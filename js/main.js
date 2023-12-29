import { redirect, showAlret } from "./commonFunctions.js";

const storedUser = JSON.parse(localStorage.getItem("user"));
const users = JSON.parse(localStorage.getItem("users"));
const tasksCards = document.querySelector(".tasksCards");
const doneTasksCard = document.querySelector(".doneTasksCard");
const newTaskBtn = document.querySelector(".newTask");
const newTaskForm = document.querySelector(".newTaskForm");
const taskName = document.querySelector(".taskName");
const taskDesc = document.querySelector(".taskDesc");
const addBtn = document.querySelector(".addBtn");
const updateBtn = document.querySelector(".updateBtn");
const closeBtn = document.querySelector(".closeBtn");
const logoutBtn = document.querySelector(".logoutBtn");
const title = document.querySelector(".welcom");
const mainContent = document.querySelector(".main-content");
const profile = document.querySelector(".profile");
const profileBtn = document.querySelector(".profileBtn");
const homeBtn = document.querySelector(".homeBtn");
const pEmail = document.getElementById("pEmail");
const pPassword = document.getElementById("pPassword");
const pUpdateBtn = document.querySelector(".pUpdateBtn");

let tasks = [];

let task = {
  id: "",
  user: "",
  name: "",
  desc: "",
  status: "",
};

// ! Set tasks in local storage if not exist or get them if exist

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
} else {
  tasks = [
    {
      id: 1,
      user: 1,
      name: "Vist Moaz's Github",
      desc: "@moazelgandy2 😊",
      status: "pending",
    },
    {
      id: 2,
      user: 1,
      name: "Task 2",
      desc: "Task2 Desc",

      status: "done",
    },
  ];
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ! <------------- Check login ---------------->

if (!storedUser) {
  showAlret("error", "You must be logged in first", true);
  redirect("login");
} else {
  const res = users.find(
    (user) =>
      user.email === storedUser.email && user.password === storedUser.password
  );
  if (!res) {
    showAlret(
      "error",
      `The session info is nologer valid, please login again`,
      true
    );
    redirect("login");
  }
}

// ! <------------ End login check ------------->

// ! <--------------- Profile -------------------->

pUpdateBtn.addEventListener("click", () => {
  updateProfile();
});

(function profilePage() {
  pEmail.value = storedUser.email;
  pPassword.value = storedUser.password;
})();

function updateProfile() {
  let mail = pEmail.value;
  let pass = pPassword.value;

  storedUser.email = mail;
  storedUser.password = pass;

  const index = users.findIndex((user) => user.id === storedUser.id);

  users[index] = storedUser;

  localStorage.setItem("users", JSON.stringify(users));

  localStorage.setItem("user", JSON.stringify(storedUser));

  showAlret("success", "Profile updated successfully");
}

// ! <--------------EndProfile ------------------->

//! <--------------- Logout -------------------->

function logout() {
  localStorage.removeItem("user");

  redirect("login", 0);
}

// ! <--------------EndLogout ------------------->

// ! <------------- Display user Info ---------->

(function displayUser() {
  title.innerHTML = `Welcome ${storedUser.email}`;
})();

// ! <------------- End user Info ---------->

// ! <------------- Display Tasks----------->

function displayTasks() {
  let taskCard = ``;

  let doneTaskCard = ``;

  let userTasks = tasks.filter(
    (task) => task.user === storedUser.id && task.status == "pending"
  );

  let userDoneTasks = tasks.filter(
    (task) => task.user === storedUser.id && task.status == "done"
  );

  if (userTasks.length == 0 && userDoneTasks.length == 0) {
    taskCard = `<div class="col-md-12 col-lg-6 col-12 mb-3">
              <div class="nes-input">
                <h3 class="nes-text text-center text-danger">You have no tasks</h3>
                <div class="row mt-4 text-center">
                </div>
              </div>
            </div>`;
  }

  for (const task of userTasks) {
    taskCard += `<div class="col-md-12 col-lg-6 col-12 mb-3">
                  <i class="text-danger d-block mb-3 deleteBtn" data-id="${task.id}">Remove</i>
              <div class="nes-input">
                <h3 class="nes-text is-primary">${task.name}</h3>
                <p class="nes-text is-warning">${task.desc}</p>
                <div class="row mt-4 text-center">
                  <div class="col-6">
                    <button class="doneBtn btn-sm nes-btn is-success" data-id="${task.id}">Done</button>
                  </div>
                  <div class="col-6">
                    <button class="editBtn nes-btn is-warning btn-sm" data-id="${task.id}">Edit</button>
                  </div>
                </div>
              </div>
            </div>`;
  }

  for (const task of userDoneTasks) {
    doneTaskCard += `<div class="col-12">
              <i class="text-danger d-block mb-3 deleteBtn" data-id="${task.id}">Remove</i>
              <div class="nes-input mb-4">
                <h3 class="nes-text is-primary">${task.name}</h3>
                <p class="nes-text is-warning">${task.desc}</p>
                <div class="nes-badge w-100">
                  <span class="is-success position-static d-block" >Done</span>
                </div>
              </div>
            </div>`;
  }
  tasksCards.classList.add("hasTasks");
  tasksCards.innerHTML = taskCard;
  doneTasksCard.innerHTML = doneTaskCard;

  if (tasksCards.classList.contains("hasTasks")) {
    const doneBtns = document.querySelectorAll(".doneBtn");

    const editBtn = document.querySelectorAll(".editBtn");

    const deleteBtn = document.querySelectorAll(".deleteBtn");

    doneBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        let id = e.target.dataset.id;
        taskDone(id);
      });
    });

    editBtn.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        let id = e.target.dataset.id;
        updateTask(id);
      });
    });

    deleteBtn.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        let id = e.target.dataset.id;
        deleteTask(id);
      });
    });
  }
}

// ! <------------- End Display tasks ------>

// ! <---------- Add new task ------------>

function createTask() {
  if (taskName.value === "" || taskDesc.value === "") {
    showAlret("error", "Please fill all fields");
    return;
  }
  task = {
    id: tasks.length + 1,
    user: storedUser.id,
    name: taskName.value,
    desc: taskDesc.value,
    status: "pending",
  };

  tasks.push(task);

  localStorage.setItem("tasks", JSON.stringify(tasks));

  displayTasks();

  showAlret("success", "Task added successfully");

  reset();
  // console.log(tasks);
}

// ! <---------- End Add new task ------------>

// ! <---------- Update task ------------>

function updateTask(id) {
  let task = tasks.find((task) => task.id == id);

  const index = tasks.findIndex((task) => task.id == id);

  addBtn.classList.add("d-none");

  updateBtn.classList.remove("d-none");

  newTaskForm.classList.replace("d-none", "d-flex");

  taskName.value = task.name;
  document.querySelector(".taskId").value = task.id;
  taskDesc.value = task.desc;
}

function update() {
  let id = document.querySelector(".taskId").value;
  tasks[id - 1].name = taskName.value;
  tasks[id - 1].desc = taskDesc.value;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  showAlret("success", "Task updated successfully");
  displayTasks();
  reset();
}

// ! <---------- End Update task ------>

// ! <---------- Delete Task ---------->

function deleteTask(id) {
  let index = tasks.find((task) => task.id == id);

  index = tasks.indexOf(index);

  console.log(tasks.splice(index, 1));

  localStorage.setItem("tasks", JSON.stringify(tasks));

  displayTasks();
}

// ! <---------- End Delete Task ------>

// ! <---------- Task done ------------>

function taskDone(id) {
  let task = tasks.find((task) => task.id == id);

  task.status = "done";

  localStorage.setItem("tasks", JSON.stringify(tasks));

  displayTasks();
}

// ! <---------- End Task done ------------>

// ! <---------- Event Listeners ------------>

profileBtn.addEventListener("click", () => {
  mainContent.classList.add("d-none");
  profile.classList.remove("d-none");
  profileBtn.classList.add("d-none");
  homeBtn.classList.remove("d-none");
});

homeBtn.addEventListener("click", () => {
  homeBtn.classList.add("d-none");
  profileBtn.classList.remove("d-none");
  mainContent.classList.remove("d-none");
  profile.classList.add("d-none");
});

logoutBtn.addEventListener("click", () => {
  logout();
});

newTaskBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  newTaskForm.classList.replace("d-none", "d-flex");
});

addBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  createTask();
});

updateBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  update();
});

closeBtn.addEventListener("click", () => {
  newTaskForm.classList.replace("d-flex", "d-none");
  reset();
});

// ! <---------- End Event Listeners ------------>

// ! Function calls

displayTasks();

// ! <---------- Reset ------------>

function reset() {
  newTaskForm.classList.replace("d-flex", "d-none");

  taskName.value = "";

  taskDesc.value = "";

  updateBtn.classList.add("d-none");

  addBtn.classList.remove("d-none");
}

// ! <---------- End Reset ------------>
