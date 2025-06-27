const input = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const taskList = document.getElementById('task-list');

// Load saved tasks
chrome.storage.sync.get(['tasks'], (result) => {
  (result.tasks || []).forEach(addTaskToUI);
});

addButton.addEventListener('click', () => {
  const task = input.value.trim();
  if (!task) return;

  chrome.storage.sync.get(['tasks'], (result) => {
    const tasks = result.tasks || [];
    tasks.push(task);
    chrome.storage.sync.set({ tasks }, () => {
      addTaskToUI(task);
      input.value = '';
    });
  });
});

function addTaskToUI(task) {
  const li = document.createElement('li');
  li.textContent = task;

  const del = document.createElement('button');
  del.textContent = '✕';
  del.className = 'delete';
  del.onclick = () => {
    chrome.storage.sync.get(['tasks'], (result) => {
      const tasks = (result.tasks || []).filter(t => t !== task);
      chrome.storage.sync.set({ tasks }, () => li.remove());
    });
  };

  li.appendChild(del);
  taskList.appendChild(li);
}
