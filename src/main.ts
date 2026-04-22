import "./style.css";

type Task = {
  id: number;
  text: string;
  dueDate: string;
  completed: boolean;
};

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App container not found");
}

let tasks: Task[] = JSON.parse(localStorage.getItem("studyapp-tasks") || "[]");

const saveTasks = () => {
  localStorage.setItem("studyapp-tasks", JSON.stringify(tasks));
};

const formatDate = (date: string) => {
  if (!date) return "No due date";
  const formatted = new Date(date + "T00:00:00");
  return formatted.toLocaleDateString();
};

const renderApp = () => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  app.innerHTML = `
    <div class="app">
      <div class="container">
        <header class="header">
          <h1>Study Planner</h1>
          <p class="subtitle">
            Organize assignments, track deadlines, and stay on top of your study goals.
          </p>
        </header>

        <section class="stats">
          <div class="stat-box">
            <h2>${totalTasks}</h2>
            <p>Total Tasks</p>
          </div>
          <div class="stat-box">
            <h2>${pendingTasks}</h2>
            <p>Pending</p>
          </div>
          <div class="stat-box">
            <h2>${completedTasks}</h2>
            <p>Completed</p>
          </div>
        </section>

        <section class="task-form">
          <input id="taskInput" type="text" placeholder="Enter a study task..." />
          <input id="dateInput" type="date" />
          <button id="addTaskBtn">Add Task</button>
        </section>

        <section class="task-list">
          ${
            tasks.length === 0
              ? `<p class="empty-message">No tasks yet. Add your first one.</p>`
              : tasks
                  .map(
                    (task) => `
              <div class="task-card ${task.completed ? "completed" : ""}">
                <div class="task-info">
                  <h3>${task.text}</h3>
                  <p>Due: ${formatDate(task.dueDate)}</p>
                </div>

                <div class="task-actions">
                  <button class="complete-btn" data-id="${task.id}">
                    ${task.completed ? "Undo" : "Complete"}
                  </button>
                  <button class="delete-btn" data-id="${task.id}">
                    Delete
                  </button>
                </div>
              </div>
            `
                  )
                  .join("")
          }
        </section>
      </div>
    </div>
  `;

  const taskInput = document.querySelector<HTMLInputElement>("#taskInput");
  const dateInput = document.querySelector<HTMLInputElement>("#dateInput");
  const addTaskBtn = document.querySelector<HTMLButtonElement>("#addTaskBtn");

  addTaskBtn?.addEventListener("click", () => {
    const text = taskInput?.value.trim() || "";
    const dueDate = dateInput?.value || "";

    if (!text) return;

    const newTask: Task = {
      id: Date.now(),
      text,
      dueDate,
      completed: false,
    };

    tasks.push(newTask);
    saveTasks();
    renderApp();
  });

  document.querySelectorAll<HTMLButtonElement>(".complete-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      tasks = tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      saveTasks();
      renderApp();
    });
  });

  document.querySelectorAll<HTMLButtonElement>(".delete-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      tasks = tasks.filter((task) => task.id !== id);
      saveTasks();
      renderApp();
    });
  });
};

renderApp();