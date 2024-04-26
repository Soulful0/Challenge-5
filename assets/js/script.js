// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  let backgroundColor = "";
  if (task.status === "todo") {
    backgroundColor = "bg-danger";
  } else if (task.status === "in-progress") {
    backgroundColor = "bg-warning";
  } else {
    backgroundColor = "bg-success";
  }
  return $(`<div class="task-card ${backgroundColor}" id="task-${task.id}">
          <h5>${task.title}</h5>
          <p>${task.description}</p>
          <p>Deadline: ${task.deadline}</p>
          <button onclick="handleDeleteTask(event, ${task.id})">Delete</button>
      </div>`);
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  $("#todo-cards, #in-progress-cards, #done-cards").empty();

  console.log("Current task list:", taskList);
  taskList.forEach((task) => {
    const taskCard = createTaskCard(task);
    $(`#${task.status}-cards`).append(taskCard);
  });

  console.log("Task cards rendered");

  $(".task-card").draggable({
    containment: "#board",
    stack: ".task-card",
    cursor: "move",
    revert: true,
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const task = {
    id: generateTaskId(),
    title: $("#task-name").val(),
    description: $("#task-description").val(),
    deadline: $("#task-due-date").val(),
    status: "todo",
  };
  taskList.push(task);
  saveTasks();
  renderTaskList();

  $("#formModal").modal("hide");
}

// Todo: create a function to handle deleting a task,
function handleDeleteTask(event, taskId) {
  taskList = taskList.filter((task) => task.id !== taskId);
  saveTasks();
  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.draggable.attr("id").split("-")[1];
  const newStatus = $(event.target).attr("id");
  const task = taskList.find((task) => task.id === parseInt(taskId));
  task.status = newStatus;
  saveTasks();
  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList();
  $("#task-form").on("submit", handleAddTask);
  $(".lane").droppable({ drop: handleDrop });
  $("#task-due-date").datepicker({
    dateFormat: "yy-mm-dd",
  });
});

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", JSON.stringify(nextId));
}
