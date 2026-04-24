(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=JSON.parse(localStorage.getItem(`tasks`)||`[]`),t=`all`,n=!1,r=document.querySelector(`#app`);function i(){localStorage.setItem(`tasks`,JSON.stringify(e))}function a(){return t===`pending`?e.filter(e=>!e.completed):t===`completed`?e.filter(e=>e.completed):e}function o(){let t=e.length,c=e.filter(e=>!e.completed).length,l=e.filter(e=>e.completed).length;document.body.className=n?`dark`:``,r.innerHTML=`
    <h1>Study Planner Pro</h1>

    <div class="stats">
      <div class="card blue">${t} Total</div>
      <div class="card yellow">${c} Pending</div>
      <div class="card green">${l} Done</div>
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
      ${a().map((e,t)=>`
        <li class="${e.completed?`done`:``}">
          <span>
            ${e.text} 
            (${e.date}) 
            <b>${e.priority}</b>
            ${s(e.date)?`<span class="late">⚠ Late</span>`:``}
          </span>
          <div>
            <button onclick="toggle(${t})">✔</button>
            <button onclick="editTask(${t})">✏️</button>
            <button onclick="removeTask(${t})">❌</button>
          </div>
        </li>
      `).join(``)}
    </ul>
  `,document.getElementById(`addBtn`).onclick=()=>{let t=document.getElementById(`taskInput`).value,n=document.getElementById(`dateInput`).value,r=document.getElementById(`priorityInput`).value;t&&(e.push({text:t,date:n,priority:r,completed:!1}),i(),o())}}function s(e){return e?new Date(e)<new Date:!1}window.toggle=t=>{e[t].completed=!e[t].completed,i(),o()},window.removeTask=t=>{e.splice(t,1),i(),o()},window.editTask=t=>{let n=prompt(`Edit task`,e[t].text);n&&(e[t].text=n),i(),o()},window.setFilter=e=>{t=e,o()},window.toggleDark=()=>{n=!n,o()},o();