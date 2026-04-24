import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

let tasks: { text: string; date: string; completed: boolean }[] =
  JSON.parse(localStorage.getItem('tasks') || '[]')

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function render() {
  const total = tasks.length
  const pending = tasks.filter(t => !t.completed).length
  const completed = tasks.filter(t => t.completed).length

  app.innerHTML = `
    <h1>Study Planner Pro</h1>
    <p>Organize assignments, set priorities, track deadlines.</p>

    <div class="stats">
      <div class="card blue">${total} Total Tasks</div>
      <div class="card yellow">${pending} Pending</div>
      <div class="card green">${completed} Completed</div>
    </div>

    <div class="form">
      <input id="taskInput" placeholder="Enter a task..." />
      <input id="dateInput" type="date" />
      <button id="addBtn">Add Task</button>
    </div>

    <ul class="task-list">
      ${tasks
        .map(
          (t, i) => `
        <li class="${t.completed ? 'done' : ''}">
          <span>${t.text} (${t.date})</span>
          <div>
            <button onclick="toggle(${i})">✔</button>
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

    if (!text) return

    tasks.push({ text, date, completed: false })
    saveTasks()
    render()
  }
}

;(window as any).toggle = (i: number) => {
  tasks[i].completed = !tasks[i].completed
  saveTasks()
  render()
}

;(window as any).removeTask = (i: number) => {
  tasks.splice(i, 1)
  saveTasks()
  render()
}

render()