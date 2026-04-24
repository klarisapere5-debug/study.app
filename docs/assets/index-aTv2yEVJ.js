(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[{id:1,title:`Finish math homework`,dueDate:`2026-04-25`,priority:`High`,completed:!1},{id:2,title:`Study for CS quiz`,dueDate:`2026-04-26`,priority:`Medium`,completed:!1},{id:3,title:`Submit English assignment`,dueDate:`2026-04-24`,priority:`High`,completed:!0}],t=document.querySelector(`#app`);function n(){t.innerHTML=`
    <main class="app">
      <section class="container">
        <header class="header">
          <h1>Study Planner Pro</h1>
          <p>Organize assignments, set priorities, track deadlines, and stay ahead of your goals.</p>
        </header>

        <section class="stats">
          <div class="card total">
            <h2>${e.length}</h2>
            <p>Total Tasks</p>
          </div>
          <div class="card pending">
            <h2>${e.filter(e=>!e.completed).length}</h2>
            <p>Pending</p>
          </div>
          <div class="card completed">
            <h2>${e.filter(e=>e.completed).length}</h2>
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
          ${e.map(e=>`
            <div class="task ${e.completed?`done`:``}">
              <div>
                <h3>${e.title}</h3>
                <p>Due: ${e.dueDate} | Priority: ${e.priority}</p>
              </div>
              <div class="actions">
                <button onclick="toggleTask(${e.id})">${e.completed?`Undo`:`Complete`}</button>
                <button class="delete" onclick="deleteTask(${e.id})">Delete</button>
              </div>
            </div>
          `).join(``)}
        </section>
      </section>
    </main>
  `,document.querySelector(`#addTask`).addEventListener(`click`,r)}function r(){let t=document.querySelector(`#taskTitle`),r=document.querySelector(`#dueDate`),i=document.querySelector(`#priority`);!t.value.trim()||!r.value||(e.push({id:Date.now(),title:t.value.trim(),dueDate:r.value,priority:i.value,completed:!1}),n())}window.toggleTask=t=>{e=e.map(e=>e.id===t?{...e,completed:!e.completed}:e),n()},window.deleteTask=t=>{e=e.filter(e=>e.id!==t),n()},n();