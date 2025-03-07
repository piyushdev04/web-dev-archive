const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList= document.getElementById('taskList');
const taskStats = document.getElementById('taskStats');
const themeToggle = document.getElementById('themeToggle');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
renderTasks();

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    taskStats.textContent = `Tasks: ${total} | Completed: ${completed}`;
}

function addTask() {
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;

    if (taskText === '') return;

    const task = {
        id: Date.now(),
        text: taskText,
        priority: priority,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    taskInput.value = '';
}


function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item', task.priority);
        if (task.completed) taskItem.classList.add('completed');
        
        const taskSpan = document.createElement('span');
        taskSpan.textContent = task.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';

        taskSpan.addEventListener('click', () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        });

        deleteBtn.addEventListener('click', () => {
            taskItem.classList.add('fade-out');
            taskItem.addEventListener('animationend', () => {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
                renderTasks();
            });
        });

        taskItem.appendChild(taskSpan);
        taskItem.appendChild(deleteBtn);
        taskList.appendChild(taskItem);
    });
    updateStats();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeToggle.textContent = document.body.classList.contains('dark') ? 'Light Mode' : 'Dark Mode';
});

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') addTask();
});