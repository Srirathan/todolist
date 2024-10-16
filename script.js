let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Function to render tasks in the task list
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.sort((a, b) => b.priority - a.priority); // Sort tasks by priority

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const listItem = document.createElement('li');

        listItem.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">
                <strong>Priority:</strong> ${getPriorityLabel(task.priority)}
                <br><strong>Due Date:</strong> ${task.dueDate}
                <br>${task.text}
            </span>
            <div class="button-container">
                <button class="delete-btn" data-index="${i}">Delete</button>
                <button class="complete-btn" data-index="${i}">Complete</button>
            </div>
        `;

        taskList.appendChild(listItem);
    }

    updateTaskStatus();
}

// Function to get the priority label based on the priority value
function getPriorityLabel(priority) {
    switch (priority) {
        case 1:
            return 'Low';
        case 3:
            return 'High';
        default:
            return 'Unknown';
    }
}

/// Function to add a new task
function addTask() {
    const taskInput = document.getElementById('taskInput').value.trim();
    const taskPriority = parseInt(document.getElementById('taskPriority').value);
    const taskDueDate = document.getElementById('taskDueDate').value;

    // Ensure taskDueDate is selected
    if (!taskDueDate) {
        alert('Please select a due date.');
        return;
    }

    // Get today's date in 'YYYY-MM-DD' format and the selected due date
    const today = new Date().toISOString().split('T')[0];
    const selectedDate = taskDueDate;

    // Validation checks
    if (!taskInput) {
        alert('Please enter a task.');
        return;
    }

    // Compare the selected date string to the current date string
    if (selectedDate < today) {
        alert('Please select a due date that is today or in the future.');
        return;
    }

    // If all checks pass, create new task object
    const newTask = {
        text: taskInput,
        completed: false,
        priority: taskPriority,
        dueDate: taskDueDate,
    };

    // Push new task and reset input fields
    tasks.push(newTask);
    document.getElementById('taskInput').value = '';
    document.getElementById('taskDueDate').value = '';

    // Render tasks and update local storage
    renderTasks();
    updateLocalStorage();
}

// Function to handle task actions
function handleTaskActions(e) {
    const index = e.target.getAttribute('data-index');
    
    if (e.target.classList.contains('complete-btn')) {
        completeTask(index);
    } else if (e.target.classList.contains('delete-btn')) {
        deleteTask(index);
    }
}

// Function to mark task as completed
function completeTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
    updateLocalStorage();
}

// Function to delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
    updateLocalStorage();
}

// Function to update the local storage
function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to update task status and the status circle
function updateTaskStatus() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const remainingTasks = totalTasks - completedTasks;
    const taskStatus = document.getElementById('taskStatus');
    const statusCircle = document.getElementById('statusCircle');

    taskStatus.textContent = `${remainingTasks} tasks left`;

    const completionPercentage = completedTasks / totalTasks;

    if (completionPercentage === 1) {
        statusCircle.style.backgroundColor = '#4caf50'; // Green for complete
    } else if (completionPercentage > 0) {
        statusCircle.style.backgroundColor = '#ffa500'; // Orange for partial completion
    } else {
        statusCircle.style.backgroundColor = '#f44336'; // Red for no completion
    }
}

// Add event listener for adding tasks
document.getElementById('addTaskButton').addEventListener('click', addTask);

// Add event listener for task actions (complete and delete)
document.getElementById('taskList').addEventListener('click', handleTaskActions);

// Initial render of tasks on page load
renderTasks();
