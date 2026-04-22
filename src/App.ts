import { useEffect, useState } from "react";
import "./style.css";

type Task = {
  id: number;
  text: string;
  dueDate: string;
  completed: boolean;
};

function App() {
  const [taskText, setTaskText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem("studyapp-tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("studyapp-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (taskText.trim() === "") return;

    const newTask: Task = {
      id: Date.now(),
      text: taskText,
      dueDate,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTaskText("");
    setDueDate("");
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="app">
      <div className="container">
        <h1>Study Planner</h1>
        <p className="subtitle">
          Organize assignments, track deadlines, and stay on top of your study goals.
        </p>

        <div className="stats">
          <div className="stat-box">
            <h3>{tasks.length}</h3>
            <p>Total Tasks</p>
          </div>
          <div className="stat-box">
            <h3>{pendingCount}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-box">
            <h3>{completedCount}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="task-form">
          <input
            type="text"
            placeholder="Enter a study task..."
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <button onClick={addTask}>Add Task</button>
        </div>

        <div className="task-list">
          {tasks.length === 0 ? (
            <p className="empty-message">No tasks yet. Add your first one.</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`task-card ${task.completed ? "completed" : ""}`}
              >
                <div className="task-info">
                  <h3>{task.text}</h3>
                  <p>
                    {task.dueDate ? `Due: ${task.dueDate}` : "No due date set"}
                  </p>
                </div>

                <div className="task-actions">
                  <button onClick={() => toggleTask(task.id)}>
                    {task.completed ? "Undo" : "Complete"}
                  </button>
                  <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;