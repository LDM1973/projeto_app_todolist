if ("serviceWorker" in navigator) {
    // register service worker
    navigator.serviceWorker.register("service-worker.js");
} 

let taskItems = []
const taskInput = document.querySelector('.task-input')
const completedTasksDiv = document.querySelector('.completed')
const unCompletedTasksDiv = document.querySelector('.uncompleted')

// Get to-do list on first boot
window.onload = () => {
    let storageTaskItems = localStorage.getItem('taskItems')
    if (storageTaskItems !== null) {
        taskItems = JSON.parse(storageTaskItems)
    }

    render()
}

// Get the content typed into the input
taskInput.onkeyup = (e) => {
    let value = e.target.value.replace(/^\s+/, "");
    if (value && e.keyCode == 13) { // Enter
        addTask(value)

        taskInput.value = ''
        taskInput.focus()
    }
};

// Add task
function addTask(text) {
    taskItems.push({
        id: Date.now(),
        text,
        completed: false
    })

    saveAndRender()
}

// Remove task
function removeTask(id) {
    taskItems = taskItems.filter(task => task.id !== Number(id))
    saveAndRender()
}

// Mark as completed
function markAsCompleted(id) {
    taskItems = taskItems.filter(task => {
        if (task.id === Number(id)) {
        task.completed = true
        }

        return task
    })

    saveAndRender()
}

// Mark as uncompleted
function markAsUncompleted(id) {
    taskItems = taskItems.filter(task => {
        if (task.id === Number(id)) {
        task.completed = false
        }

        return task
    })

    saveAndRender()
}

// Save in localstorage
function save() {
    localStorage.setItem('taskItems', JSON.stringify(taskItems))
}

// Render
function render() {
    let unCompletedTasks = taskItems.filter(item => !item.completed)
    let completedTasks = taskItems.filter(item => item.completed)

    completedTasksDiv.innerHTML = ''
    unCompletedTasksDiv.innerHTML = ''

    if (unCompletedTasks.length > 0) {
        unCompletedTasks.forEach(task => {
        unCompletedTasksDiv.append(createTaskElement(task))
        })
    } else {
        unCompletedTasksDiv.innerHTML = `<div class='empty'>No Tasks Available</div>`
    }

    if (completedTasks.length > 0) {
        completedTasksDiv.innerHTML = `<div class='completed-title'>Completed (${completedTasks.length} / ${taskItems.length})</div>`

        completedTasks.forEach(task => {
        completedTasksDiv.append(createTaskElement(task))
        })
    }
}

// Save and render
function saveAndRender() {
    save()
    render()
}

// Create task list item
function createTaskElement(task) {
    // Create task list container
    const taskDiv = document.createElement("DIV");
    taskDiv.setAttribute('data-id', task.id)
    taskDiv.className = "task-item";

    // Create task item text
    const taskTextDiv = document.createElement("SPAN");
    taskTextDiv.innerHTML = task.text;

    // Checkbox for list
    const taskInputCheckbox = document.createElement("INPUT");
    taskInputCheckbox.type = "checkbox";
    taskInputCheckbox.checked = task.completed
    taskInputCheckbox.onclick = (e) => {
        let id = e.target.closest('.task-item').dataset.id
        e.target.checked ? markAsCompleted(id) : markAsUncompleted(id)
    }

    // Delete button for list
    const taskRemoveBtn = document.createElement("A");
    taskRemoveBtn.href = "#";
    taskRemoveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>`;
    taskRemoveBtn.onclick = (e) => {
        let id = e.target.closest('.task-item').dataset.id
        removeTask(id)
    };

    taskTextDiv.prepend(taskInputCheckbox);
    taskDiv.appendChild(taskTextDiv);
    taskDiv.appendChild(taskRemoveBtn);

    return taskDiv 
}