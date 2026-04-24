import './style.css'
import { auth, db } from './firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore'

type Task = {
  id: string
  text: string
  date: string
  priority: string
  completed: boolean
  createdAt: number
}

let currentUser: User | null = null
let tasks: Task[] = []
let filter = 'all'
let darkMode = false

const app = document.querySelector<HTMLDivElement>('#app')!

function tasksRef() {
  return collection(db, 'users', currentUser!.uid, 'tasks')
}

function renderLogin() {
  app.innerHTML = `
    <main class="app">
      <section class="container">
        <h1>Study Planner Pro</h1>
        <p>Login or create an account to save your tasks in the cloud.</p>

        <div class="form">
          <input id="email" type="email" placeholder="Email" />
          <input id="password" type="password" placeholder="Password" />
          <button id="loginBtn">Login</button>
          <button id="signupBtn">Sign Up</button>
        </div>
      </section>
    </main>
  `

  document.querySelector<HTMLButtonElement>('#loginBtn')!.onclick = login
  document.querySelector<HTMLButtonElement>('#signupBtn')!.onclick = signup
}

async function signup() {
  const email = (document.querySelector<HTMLInputElement>('#email')!).value
  const password = (document.querySelector<HTMLInputElement>('#password')!).value

  try {
    await createUserWithEmailAndPassword(auth, email, password)
  } catch (error: any) {
    alert(error.message)
  }
}

async function login() {
  const email = (document.querySelector<HTMLInputElement>('#email')!).value
  const password = (document.querySelector<HTMLInputElement>('#password')!).value

  try {
    await signInWithEmailAndPassword(auth, email, password)
  } catch (error: any) {
    alert(error.message)
  }
}

async function logout() {
  await signOut(auth)
}

function loadTasks() {
  const q = query(tasksRef(), orderBy('createdAt', 'desc'))

  onSnapshot(q, (snapshot) => {
    tasks = snapshot.docs.map((document) => ({
      id: document.id,
      ...(document.data() as Omit<Task, 'id'>),
    }))

    renderApp()
  })
}

function getFilteredTasks() {
  if (filter === 'pending') return tasks.filter((task) => !task.completed)
  if (filter === 'completed') return tasks.filter((task) => task.completed)
  return tasks
}

function isLate(date: string) {
  if (!date) return false
  const today = new Date().toISOString().split('T')[0]
  return date < today
}

function renderApp() {
  const total = tasks.length
  const pending = tasks.filter((task) => !task.completed).length
  const completed = tasks.filter((task) => task.completed).length

  document.body.className = darkMode ? 'dark' : ''

  app.innerHTML = `
    <main class="app">
      <section class="container">
        <header class="header">
          <h1>Study Planner Pro</h1>
          <p>Welcome, ${currentUser?.email}</p>
        </header>

        <section class="stats">
          <div class="card blue">${total} Total Tasks</div>
          <div class="card yellow">${pending} Pending</div>
          <div class="card green">${completed} Completed</div>
        </section>

        <section class="controls">
          <button onclick="setFilter('all')">All</button>
          <button onclick="setFilter('pending')">Pending</button>
          <button onclick="setFilter('completed')">Completed</button>
          <button onclick="toggleDark()">Dark Mode</button>
          <button class="delete" onclick="logoutUser()">Logout</button>
        </section>

        <section class="form">
          <input id="taskInput" placeholder="Enter a task..." />
          <input id="dateInput" type="date" />
          <select id="priorityInput">
            <option value="High">High Priority</option>
            <option value="Medium" selected>Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          <button id="addBtn">Add Task</button>
        </section>

        <ul class="task-list">
          ${
            getFilteredTasks().length === 0
              ? `<p class="empty-message">No tasks found.</p>`
              : getFilteredTasks()
                  .map(
                    (task) => `
                    <li class="${task.completed ? 'done' : ''}">
                      <span>
                        ${task.text} (${task.date}) 
                        <b>${task.priority}</b>
                        ${isLate(task.date) && !task.completed ? '<span class="late">Late</span>' : ''}
                      </span>

                      <div>
                        <button onclick="toggleTask('${task.id}', ${task.completed})">
                          ${task.completed ? 'Undo' : 'Complete'}
                        </button>
                        <button onclick="editTask('${task.id}', '${task.text}', '${task.date}', '${task.priority}')">
                          Edit
                        </button>
                        <button class="delete" onclick="removeTask('${task.id}')">
                          Delete
                        </button>
                      </div>
                    </li>
                  `
                  )
                  .join('')
          }
        </ul>
      </section>
    </main>
  `

  document.querySelector<HTMLButtonElement>('#addBtn')!.onclick = addTask
}

async function addTask() {
  const text = (document.querySelector<HTMLInputElement>('#taskInput')!).value
  const date = (document.querySelector<HTMLInputElement>('#dateInput')!).value
  const priority = (document.querySelector<HTMLSelectElement>('#priorityInput')!).value

  if (!text.trim() || !date) {
    alert('Please enter a task and date.')
    return
  }

  await addDoc(tasksRef(), {
    text: text.trim(),
    date,
    priority,
    completed: false,
    createdAt: Date.now(),
  })
}

window.toggleTask = async (id: string, completed: boolean) => {
  await updateDoc(doc(db, 'users', currentUser!.uid, 'tasks', id), {
    completed: !completed,
  })
}

window.removeTask = async (id: string) => {
  await deleteDoc(doc(db, 'users', currentUser!.uid, 'tasks', id))
}

window.editTask = async (
  id: string,
  oldText: string,
  oldDate: string,
  oldPriority: string
) => {
  const text = prompt('Edit task:', oldText)
  if (!text) return

  const date = prompt('Edit due date:', oldDate)
  if (!date) return

  const priority = prompt('Edit priority: High, Medium, or Low', oldPriority)
  if (!priority) return

  await updateDoc(doc(db, 'users', currentUser!.uid, 'tasks', id), {
    text,
    date,
    priority,
  })
}

window.setFilter = (newFilter: string) => {
  filter = newFilter
  renderApp()
}

window.toggleDark = () => {
  darkMode = !darkMode
  renderApp()
}

window.logoutUser = logout

onAuthStateChanged(auth, (user) => {
  currentUser = user

  if (user) {
    loadTasks()
  } else {
    renderLogin()
  }
})

declare global {
  interface Window {
    toggleTask: (id: string, completed: boolean) => void
    removeTask: (id: string) => void
    editTask: (
      id: string,
      oldText: string,
      oldDate: string,
      oldPriority: string
    ) => void
    setFilter: (newFilter: string) => void
    toggleDark: () => void
    logoutUser: () => void
  }
}