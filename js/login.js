import { redirect, showAlret } from "./commonFunctions.js";

const form = document.querySelector("form");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

let users = [];

if (localStorage.getItem("users")) {
  users = JSON.parse(localStorage.getItem("users"));
} else {
  users = [
    {
      id: 1,
      name: "Demo",
      email: "demo@mail.com",
      password: "123",
    },
  ];
  localStorage.setItem("users", JSON.stringify(users));
}

form.addEventListener("submit", function (event) {
  login(emailInput.value, passwordInput.value);
});

emailInput.addEventListener("invalid", function (event) {
  event.preventDefault();

  if (emailInput.value == "") {
    let error = ["question", "Email is required", true];

    showAlret(...error);
  } else {
    let error = [
      "error",
      "Valid email address must contains '@' and '.'",
      true,
    ];
    showAlret(...error);
  }
});

passwordInput.addEventListener("invalid", function (event) {
  event.preventDefault();

  if (emailInput.value != "" && emailInput.validity.valid) {
    showAlret("error", "Password is required", true);
  }
});

function login(email, password) {
  const mail = users.find((user) => user.email === email);
  const pass = users.find((user) => user.password === password);

  if (!mail) {
    showAlret("error", "Email not found", true);
    return;
  }
  if (!pass) {
    showAlret("error", "Wrong password", true);
    return;
  }

  localStorage.setItem("user", JSON.stringify(mail, pass));

  showAlret(
    "success",
    "You have successfully logged in, redirecting to homepage",
    false
  );

  redirect("index");
}

(() => {
  if (localStorage.getItem("user")) {
    let storedUser = JSON.parse(localStorage.getItem("user"));

    const re = users.find(
      (user) =>
        user.email === storedUser.email && user.password === storedUser.password
    );

    if (re) {
      showAlret(
        "success",
        "You have already logged in, redirecting to homepage"
      );
      redirect("index");
    }
  }
})();
