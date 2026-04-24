import './style.css'

type Task = {
  text: string
  date: string
  completed: boolean
  priority: string
}

let tasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]')
let filter = 'all'
let darkMode = false

const app = document.querySelector<HTMLDivElement>('#app')!

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function getFilteredTasks() {
  if (filter === 'pending') return tasks.filter(t => !t.completed)
  if (filter === 'completed') return tasks.filter(t => t.completed)
  return tasks
}

function render() {
  const total = tasks.length
  const pending = tasks.filter(t => !t.completed).length
  const completed = tasks.filter(t => t.completed).length

  document.body.className = darkMode ? 'dark' : ''

  app.innerHTML = `
    <h1>Study Planner Pro</h1>

    <div class="stats">
      <div class="card blue">${total} Total</div>
      <div class="card yellow">${pending} Pending</div>
      <div class="card green">${completed} Done</div>
    </div>

    <div class="controls">
      <button onclick="setFilter('all')">All</button>
      <button onclick="setFilter('pending')">Pending</button>
      <button onclick="setFilter('completed')">Done</button>
      <button onclick="toggleDark()">🌙</button>
    </div>

    <div class="form">
      <input id="taskInput" placeholder="Task..." />
      <input id="dateInput" type="date" />
      <select id="priorityInput">
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
      <button id="addBtn">Add</button>
    </div>

    <ul>
      ${getFilteredTasks()
        .map(
          (t, i) => `
        <li class="${t.completed ? 'done' : ''}">
          <span>
            ${t.text} 
            (${t.date}) 
            <b>${t.priority}</b>
            ${isLate(t.date) ? '<span class="late">⚠ Late</span>' : ''}
          </span>
          <div>
            <button onclick="toggle(${i})">✔</button>
            <button onclick="editTask(${i})">✏️</button>
            <button onclick="removeTask(${i})">❌</button>
          </div>
        </li>
      `
        )
        .join('')}
    </ul>
  `

  document.getElementById('addBtn')!.onclick = () => {
    const text = (document.getElementById('taskInput') as HTMLInputElement).value
    const date = (document.getElementById('dateInput') as HTMLInputElement).value
    const priority = (document.getElementById('priorityInput') as HTMLSelectElement).value

    if (!text) return

    tasks.push({ text, date, priority, completed: false })
    save()
    render()
  }
}

function isLate(date: string) {
  if (!date) return false
  return new Date(date) < new Date()
}

;(window as any).toggle = (i: number) => {
  tasks[i].completed = !tasks[i].completed
  save()
  render()
}

;(window as any).removeTask = (i: number) => {
  tasks.splice(i, 1)
  save()
  render()
}

;(window as any).editTask = (i: number) => {
  const newText = prompt('Edit task', tasks[i].text)
  if (newText) tasks[i].text = newText
  save()
  render()
}

;(window as any).setFilter = (f: string) => {
  filter = f
  render()
}

;(window as any).toggleDark = () => {
  darkMode = !darkMode
  render()
}

render()