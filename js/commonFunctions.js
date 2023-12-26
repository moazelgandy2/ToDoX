export function redirect(page, time = 1500) {
  setTimeout(() => {
    window.location.href = page + ".html";
  }, time);
}

export function showAlret(type, error, button) {
  console.log(type, error, button);

  Swal.fire({
    icon: type,
    text: error,
    showConfirmButton: button,
  });
}
