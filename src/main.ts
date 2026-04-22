import "./style.css";

type Priority = "High" | "Medium" | "Low";
type FilterType = "All" | "Pending" | "Completed";

type Task = {
  id: number;
  text: string;
  dueDate: string;
  completed: boolean;
  priority: Priority;
};

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App container not found");
}

let tasks: Task[] = JSON.parse(localStorage.getItem("studyapp-tasks") || "[]");
let currentFilter: FilterType = "All";
let editingTaskId: number | null = null;

const saveTasks = () => {
  localStorage.setItem("studyapp-tasks", JSON.stringify(tasks));
};

const formatDate = (date: string) => {
  if (!date) return "No due date";
  const formatted = new Date(date + "T00:00:00");
  return formatted.toLocaleDateString();
};

const getFilteredTasks = () => {
  if (currentFilter === "Pending") {
    return tasks.filter((task) => !task.completed);
  }

  if (currentFilter === "Completed") {
    return tasks.filter((task) => task.completed);
  }

  return tasks;
};

const getPriorityClass = (priority: Priority) => {
  return priority.toLowerCase();
};

const renderApp = () => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const filteredTasks = getFilteredTasks();

  app.innerHTML = `
    <div class="app">
      <div class="container">
        <header class="header">
          <h1>Study Planner Pro</h1>
          <p class="subtitle">
            Organize assignments, set priorities, track deadlines, and stay ahead of your goals.
          </p>
        </header>

        <section class="stats">
          <div class="stat-box total-card">
            <h2>${totalTasks}</h2>
            <p>Total Tasks</p>
          </div>
          <div class="stat-box pending-card">
            <h2>${pendingTasks}</h2>
            <p>Pending</p>
          </div>
          <div class="stat-box completed-card">
            <h2>${completedTasks}</h2>
            <p>Completed</p>
          </div>
        </section>

        <section class="task-form">
          <input id="taskInput" type="text" placeholder="Enter a study task..." />
          <input id="dateInput" type="date" />
          <select id="priorityInput">
            <option value="High">High Priority</option>
            <option value="Medium" selected>Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          <button id="addTaskBtn">Add Task</button>
        </section>

        <section class="filters">
          <button class="filter-btn ${currentFilter === "All" ? "active-filter" : ""}" data-filter="All">All</button>
          <button class="filter-btn ${currentFilter === "Pending" ? "active-filter" : ""}" data-filter="Pending">Pending</button>
          <button class="filter-btn ${currentFilter === "Completed" ? "active-filter" : ""}" data-filter="Completed">Completed</button>
        </section>

        <section class="task-list">
          ${
            filteredTasks.length === 0
              ? `<p class="empty-message">No tasks found for this filter.</p>`
              : filteredTasks
                  .map(
                    (task) => `
              <div class="task-card ${task.completed ? "completed" : ""}">
                <div class="task-info">
                  <div class="task-top-row">
                    <h3>${task.text}</h3>
                    <span class="priority-badge ${getPriorityClass(task.priority)}">${task.priority}</span>
                  </div>
                  <p>Due: ${formatDate(task.dueDate)}</p>
                </div>

                <div class="task-actions">
                  <button class="complete-btn" data-id="${task.id}">
                    ${task.completed ? "Undo" : "Complete"}
                  </button>
                  <button class="edit-btn" data-id="${task.id}">
                    Edit
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
  const priorityInput = document.querySelector<HTMLSelectElement>("#priorityInput");
  const addTaskBtn = document.querySelector<HTMLButtonElement>("#addTaskBtn");

  if (editingTaskId !== null) {
    const taskToEdit = tasks.find((task) => task.id === editingTaskId);

    if (taskToEdit && taskInput && dateInput && priorityInput && addTaskBtn) {
      taskInput.value = taskToEdit.text;
      dateInput.value = taskToEdit.dueDate;
      priorityInput.value = taskToEdit.priority;
      addTaskBtn.textContent = "Save Changes";
    }
  }

  addTaskBtn?.addEventListener("click", () => {
    const text = taskInput?.value.trim() || "";
    const dueDate = dateInput?.value || "";
    const priority = (priorityInput?.value as Priority) || "Medium";

    if (!text) return;

    if (editingTaskId !== null) {
      tasks = tasks.map((task) =>
        task.id === editingTaskId
          ? { ...task, text, dueDate, priority }
          : task
      );

      editingTaskId = null;
    } else {
      const newTask: Task = {
        id: Date.now(),
        text,
        dueDate,
        completed: false,
        priority,
      };

      tasks.push(newTask);
    }

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

      if (editingTaskId === id) {
        editingTaskId = null;
      }

      saveTasks();
      renderApp();
    });
  });

  document.querySelectorAll<HTMLButtonElement>(".edit-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      editingTaskId = id;
      renderApp();
    });
  });

  document.querySelectorAll<HTMLButtonElement>(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter as FilterType;
      renderApp();
    });
  });
};

renderApp();