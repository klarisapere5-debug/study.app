(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`study-planner-tasks`,t=r(),n=document.querySelector(`#app`);function r(){let t=localStorage.getItem(e);return t?JSON.parse(t):[{id:1,title:`Finish math homework`,dueDate:`2026-04-25`,priority:`High`,completed:!1},{id:2,title:`Study for CS quiz`,dueDate:`2026-04-26`,priority:`Medium`,completed:!1},{id:3,title:`Submit English assignment`,dueDate:`2026-04-24`,priority:`High`,completed:!0}]}function i(){localStorage.setItem(e,JSON.stringify(t))}function a(e){let t={High:1,Medium:2,Low:3};return[...e].sort((e,n)=>e.completed===n.completed?e.dueDate===n.dueDate?t[e.priority]-t[n.priority]:e.dueDate.localeCompare(n.dueDate):e.completed?1:-1)}function o(){let e=t.length,r=t.filter(e=>!e.completed).length,i=t.filter(e=>e.completed).length,o=a(t);n.innerHTML=`
    <main class="app">
      <section class="container">
        <header class="header">
          <h1>Study Planner Pro</h1>
          <p>Organize assignments, save tasks, track deadlines, and stay ahead of your goals.</p>
        </header>

        <section class="stats">
          <div class="card total">
            <h2>${e}</h2>
            <p>Total Tasks</p>
          </div>

          <div class="card pending">
            <h2>${r}</h2>
            <p>Pending</p>
          </div>

          <div class="card completed">
            <h2>${i}</h2>
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
          ${o.length===0?`<p class="empty-message">No tasks yet. Add one above.</p>`:o.map(e=>`
              <div class="task ${e.completed?`done`:``}">
                <div class="task-info">
                  <h3>${e.title}</h3>
                  <p>Due: ${e.dueDate} | Priority: ${e.priority}</p>
                </div>

                <div class="actions">
                  <button onclick="toggleTask(${e.id})">
                    ${e.completed?`Undo`:`Complete`}
                  </button>

                  <button onclick="editTask(${e.id})">
                    Edit
                  </button>

                  <button class="delete" onclick="deleteTask(${e.id})">
                    Delete
                  </button>
                </div>
              </div>
            `).join(``)}
        </section>
      </section>
    </main>
  `,document.querySelector(`#addTask`).addEventListener(`click`,s)}function s(){let e=document.querySelector(`#taskTitle`),n=document.querySelector(`#dueDate`),r=document.querySelector(`#priority`);if(!e.value.trim()||!n.value){alert(`Please enter a task and due date.`);return}t.push({id:Date.now(),title:e.value.trim(),dueDate:n.value,priority:r.value,completed:!1}),i(),o()}window.toggleTask=e=>{t=t.map(t=>t.id===e?{...t,completed:!t.completed}:t),i(),o()},window.deleteTask=e=>{t=t.filter(t=>t.id!==e),i(),o()},window.editTask=e=>{let n=t.find(t=>t.id===e);if(!n)return;let r=prompt(`Edit task name:`,n.title);if(!r||!r.trim())return;let a=prompt(`Edit due date YYYY-MM-DD:`,n.dueDate);if(!a||!a.trim())return;let s=prompt(`Edit priority: Low, Medium, or High`,n.priority);if(![`Low`,`Medium`,`High`].includes(s)){alert(`Priority must be Low, Medium, or High.`);return}t=t.map(t=>t.id===e?{...t,title:r.trim(),dueDate:a.trim(),priority:s}:t),i(),o()},o();