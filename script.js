const input = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const taskList = document.getElementById('task-list');

chrome.storage.sync.get(['tasks'], (result) => {
  const tasks = result.tasks || [];
  tasks.forEach(task => addTaskToUI(task.text, task.completed));
});

addButton.addEventListener('click', () => {
  const taskText = input.value.trim();
  if (!taskText) return;

  chrome.storage.sync.get(['tasks'], (result) => {
    const tasks = result.tasks || [];
    const newTask = { text: taskText, completed: false };
    tasks.push(newTask);
    chrome.storage.sync.set({ tasks }, () => {
      addTaskToUI(newTask.text, newTask.completed);
      input.value = '';
    });
  });
});

function addTaskToUI(taskText, completed) {
  const li = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = completed;
  checkbox.addEventListener('change', () => toggleComplete(taskText, checkbox.checked));

  const span = document.createElement('span');
  span.textContent = taskText;
  if (completed) span.classList.add('completed');

  const delBtn = document.createElement('button');
  delBtn.textContent = '✕';
  delBtn.addEventListener('click', () => deleteTask(taskText, li));

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(delBtn);
  taskList.appendChild(li);
}

function toggleComplete(taskText, isCompleted) {
  chrome.storage.sync.get(['tasks'], (result) => {
    const tasks = result.tasks.map(task =>
      task.text === taskText ? { ...task, completed: isCompleted } : task
    );
    chrome.storage.sync.set({ tasks }, () => {
      const spans = document.querySelectorAll('#task-list span');
      spans.forEach(span => {
        if (span.textContent === taskText) {
          span.classList.toggle('completed', isCompleted);
        }
      });
    });
  });
}

function deleteTask(taskText, liElement) {
  chrome.storage.sync.get(['tasks'], (result) => {
    const tasks = result.tasks.filter(task => task.text !== taskText);
    chrome.storage.sync.set({ tasks }, () => {
      liElement.remove();
    });
  });
}
