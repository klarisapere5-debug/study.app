import './style.css'

type Task = {
  id: number
  title: string
  dueDate: string
  priority: string
  completed: boolean
}

let tasks: Task[] = [
  { id: 1, title: 'Finish math homework', dueDate: '2026-04-25', priority: 'High', completed: false },
  { id: 2, title: 'Study for CS quiz', dueDate: '2026-04-26', priority: 'Medium', completed: false },
  { id: 3, title: 'Submit English assignment', dueDate: '2026-04-24', priority: 'High', completed: true }
]

const app = document.querySelector<HTMLDivElement>('#app')!

function render() {
  const total = tasks.length
  const pending = tasks.filter(task => !task.completed).length
  const completed = tasks.filter(task => task.completed).length

  app.innerHTML = `
    <main class="app">
      <section class="container">
        <header class="header">
          <h1>Study Planner Pro</h1>
          <p>Organize assignments, set priorities, track deadlines, and stay ahead of your goals.</p>
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
          ${tasks.map(task => `
            <div class="task ${task.completed ? 'done' : ''}">
              <div>
                <h3>${task.title}</h3>
                <p>Due: ${task.dueDate} | Priority: ${task.priority}</p>
              </div>
              <div class="actions">
                <button onclick="toggleTask(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
              </div>
            </div>
          `).join('')}
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

  if (!titleInput.value.trim() || !dueDateInput.value) return

  tasks.push({
    id: Date.now(),
    title: titleInput.value.trim(),
    dueDate: dueDateInput.value,
    priority: priorityInput.value,
    completed: false
  })

  render()
}

window.toggleTask = (id: number) => {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  )
  render()
}

window.deleteTask = (id: number) => {
  tasks = tasks.filter(task => task.id !== id)
  render()
}

render()

declare global {
  interface Window {
    toggleTask: (id: number) => void
    deleteTask: (id: number) => void
  }
}
