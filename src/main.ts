import './style.css'

type Priority = 'Low' | 'Medium' | 'High'

type Task = {
  id: number
  title: string
  dueDate: string
  priority: Priority
  completed: boolean
}

const STORAGE_KEY = 'study-planner-tasks'

let tasks: Task[] = loadTasks()

const app = document.querySelector<HTMLDivElement>('#app')!

function loadTasks(): Task[] {
  const savedTasks = localStorage.getItem(STORAGE_KEY)

  if (savedTasks) {
    return JSON.parse(savedTasks)
  }

  return [
    {
      id: 1,
      title: 'Finish math homework',
      dueDate: '2026-04-25',
      priority: 'High',
      completed: false,
    },
    {
      id: 2,
      title: 'Study for CS quiz',
      dueDate: '2026-04-26',
      priority: 'Medium',
      completed: false,
    },
    {
      id: 3,
      title: 'Submit English assignment',
      dueDate: '2026-04-24',
      priority: 'High',
      completed: true,
    },
  ]
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function sortTasks(taskList: Task[]) {
  const priorityOrder: Record<Priority, number> = {
    High: 1,
    Medium: 2,
    Low: 3,
  }

  return [...taskList].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }

    if (a.dueDate !== b.dueDate) {
      return a.dueDate.localeCompare(b.dueDate)
    }

    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

function render() {
  const total = tasks.length
  const pending = tasks.filter((task) => !task.completed).length
  const completed = tasks.filter((task) => task.completed).length
  const sortedTasks = sortTasks(tasks)

  app.innerHTML = `
    <main class="app">
      <section class="container">
        <header class="header">
          <h1>Study Planner Pro</h1>
          <p>Organize assignments, save tasks, track deadlines, and stay ahead of your goals.</p>
        </header>

        <section class="stats">
          <div class="card total">
            <h2>${total}</h2>
            <p>Total Tasks</p>
          </div>

          <div class="card pending">
            <h2>${pending}</h2>
            <p>Pending</p>
          </div>

          <div class="card completed">
            <h2>${completed}</h2>
            <p>Completed</p>
          </div>
        </section>

        <section class="form-section">
          <input id="taskTitle" type="text" placeholder="Enter a study task..." />

          <input id="dueDate" type="date" />

          <select id="priority">
            <option value="Low">Low Priority</option>
            <option value="Medium" selected>Medium Priority</option>
            <option value="High">High Priority</option>
          </select>

          <button id="addTask">Add Task</button>
        </section>

        <section class="task-list">
          ${
            sortedTasks.length === 0
              ? `<p class="empty-message">No tasks yet. Add one above.</p>`
              : sortedTasks
                  .map(
                    (task) => `
              <div class="task ${task.completed ? 'done' : ''}">
                <div class="task-info">
                  <h3>${task.title}</h3>
                  <p>Due: ${task.dueDate} | Priority: ${task.priority}</p>
                </div>

                <div class="actions">
                  <button onclick="toggleTask(${task.id})">
                    ${task.completed ? 'Undo' : 'Complete'}
                  </button>

                  <button onclick="editTask(${task.id})">
                    Edit
                  </button>

                  <button class="delete" onclick="deleteTask(${task.id})">
                    Delete
                  </button>
                </div>
              </div>
            `
                  )
                  .join('')
          }
        </section>
      </section>
    </main>
  `

  document.querySelector<HTMLButtonElement>('#addTask')!.addEventListener('click', addTask)
}

function addTask() {
  const titleInput = document.querySelector<HTMLInputElement>('#taskTitle')!
  const dueDateInput = document.querySelector<HTMLInputElement>('#dueDate')!
  const priorityInput = document.querySelector<HTMLSelectElement>('#priority')!

  if (!titleInput.value.trim() || !dueDateInput.value) {
    alert('Please enter a task and due date.')
    return
  }

  tasks.push({
    id: Date.now(),
    title: titleInput.value.trim(),
    dueDate: dueDateInput.value,
    priority: priorityInput.value as Priority,
    completed: false,
  })

  saveTasks()
  render()
}

window.toggleTask = (id: number) => {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  )

  saveTasks()
  render()
}

window.deleteTask = (id: number) => {
  tasks = tasks.filter((task) => task.id !== id)

  saveTasks()
  render()
}

window.editTask = (id: number) => {
  const task = tasks.find((item) => item.id === id)

  if (!task) return

  const newTitle = prompt('Edit task name:', task.title)
  if (!newTitle || !newTitle.trim()) return

  const newDueDate = prompt('Edit due date YYYY-MM-DD:', task.dueDate)
  if (!newDueDate || !newDueDate.trim()) return

  const newPriority = prompt('Edit priority: Low, Medium, or High', task.priority) as Priority

  if (!['Low', 'Medium', 'High'].includes(newPriority)) {
    alert('Priority must be Low, Medium, or High.')
    return
  }

  tasks = tasks.map((item) =>
    item.id === id
      ? {
          ...item,
          title: newTitle.trim(),
          dueDate: newDueDate.trim(),
          priority: newPriority,
        }
      : item
  )

  saveTasks()
  render()
}

render()

declare global {
  interface Window {
    toggleTask: (id: number) => void
    deleteTask: (id: number) => void
    editTask: (id: number) => void
  }
}