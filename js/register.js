import { redirect, showAlret } from "./commonFunctions.js";

const form = document.querySelector("form");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

const passwordConfirmInput = document.getElementById("re-password");

let users = [];

if (localStorage.getItem("users")) {
  users = JSON.parse(localStorage.getItem("users"));
} else {
  users = [
    {
      name: "Demo",
      email: "demo@mail.com",
      password: "123",
    },
  ];

  localStorage.setItem("users", JSON.stringify(users));
}

form.addEventListener("submit", function (event) {
  register(emailInput.value, passwordInput.value, passwordConfirmInput.value);
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

function register(email, password, passwordConfirm) {
  const mail = users.find((user) => user.email === email);

  if (mail) {
    showAlret("error", "Email already exists", true);
  } else {
    if (password !== passwordConfirm) {
      showAlret("error", "Passwords do not match", true);
    } else {
      let user = {
        email,
        password,
      };

      users.push(user);

      localStorage.setItem("users", JSON.stringify(users));

      localStorage.setItem("user", JSON.stringify(user));

      showAlret("success", "You have successfully registered", true);

      redirect("index");
    }
  }
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
