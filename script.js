let date = document.querySelector("#date");
let description = document.querySelector("#description");
let amount = document.querySelector("#amount");
let inputElements = document.querySelectorAll(".input");
let form = document.querySelector(".hero-content");
let contentWrapper = document.querySelector(".content-wrapper");
let importButton = document.querySelector("#import");
let expenses = JSON.parse(localStorage.getItem("expense")) || [];
let editingElement = null;
let total = document.querySelector(".grand-total");
let totalExpense = 0;
let menuButton = document.querySelector("#menu");
let menuCard = document.querySelector(".menu-card");
if (localStorage.getItem("Dark Mode") === "true") {
  document.body.classList.add("dark");
  form.style.transition = "none";
  document.body.style.transition = "none";
  let darkModeButton = menuCard.querySelector(".dark-mode");
  if (darkModeButton) {
    darkModeButton.innerHTML = `Light Mode &#9728;`;
  }
}
expenses.forEach((expense) => {
  showData(expense);
});
function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function showData(expense) {
  let content = document.createElement("div");
  content.className = "content";
  content.dataset.date = expense.date;
  content.dataset.description = expense.description;
  content.dataset.amount = expense.amount;
  let dateSpan = document.createElement("span");
  let dateObj = new Date(expense.date);
  let monthName = dateObj.toLocaleString("default", { month: "short" });
  let day = dateObj.getDate();
  dateSpan.textContent = `${monthName} - ${day}`;
  content.appendChild(dateSpan);
  let descriptionSpan = document.createElement("span");
  descriptionSpan.textContent = capitalize(expense.description);
  content.appendChild(descriptionSpan);
  let amount = document.createElement("span");
  amount.textContent = "₹" + expense.amount;
  content.appendChild(amount);
  let iconWrapper = document.createElement("div");
  iconWrapper.className = "icon-wrapper";
  let deleteButton = document.createElement("i");
  deleteButton.className = "fas fa-trash delete-button";
  iconWrapper.appendChild(deleteButton);
  let editButton = document.createElement("i");
  editButton.className = "fas fa-edit edit-button";
  iconWrapper.appendChild(editButton);
  content.appendChild(iconWrapper);
  contentWrapper.appendChild(content);
  totalExpense += Number(expense.amount);
  total.textContent = `₹ ${totalExpense} `;
}
function submitForm(event) {
  event.preventDefault();
  let formdata = {
    date: date.value.trim(),
    description: description.value.trim(),
    amount: amount.value.trim(),
  };
  if (editingElement) {
    storageUpdate(editingElement);
  }
  if (
    formdata.date.trim() == "" ||
    formdata.description.trim() == "" ||
    formdata.amount.trim() == ""
  ) {
    alert("Empty input field..");
  } else {
    let isDuplicate = expenses.some(
      (expense) =>
        expense.date === formdata.date &&
        expense.description === formdata.description &&
        expense.amount === formdata.amount
    );
    if (isDuplicate) {
      alert("This expense already exist !!");
      form.reset();
    } else {
      expenses.push(formdata);
      expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
      showData(formdata);
      form.reset();
      localStorage.setItem("expense", JSON.stringify(expenses));
    }
  }
}
form.addEventListener("submit", (event) => {
  submitForm(event);
});
inputElements.forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      submitForm(event);
    }
  });
});
importButton.addEventListener("click", (event) => {
  event.preventDefault();
  alert("This feature is coming soon..");
});
menuButton.addEventListener("click", (event) => {
  event.preventDefault();
  menuCard.style.display = "grid";
});
document.addEventListener("click", (event) => {
  if (!menuButton.contains(event.target) && !menuCard.contains(event.target)) {
    menuCard.style.display = "none";
  }
});
function storageUpdate(clickedButton) {
  expenses = expenses.filter(
    (expense) =>
      !(
        expense.date === clickedButton.dataset.date &&
        expense.description === clickedButton.dataset.description &&
        expense.amount === clickedButton.dataset.amount
      )
  );
  localStorage.setItem("expense", JSON.stringify(expenses));
  clickedButton.style.opacity = "0.5";
  clickedButton.style.transform = "translatex(-200px)";
  setTimeout(() => {
    totalExpense -= Number(clickedButton.dataset.amount);
    total.textContent = `₹ ${totalExpense}`;
    clickedButton.remove();
  }, 200);
}
contentWrapper.addEventListener("click", (event) => {
  if (event.target.matches(".delete-button")) {
    if (!confirm("Do you really want to delete ??")) {
      return;
    }
    let clickedButton = event.target.closest(".content");
    storageUpdate(clickedButton);
  }
  if (event.target.matches(".edit-button")) {
    let clickedButton = event.target.closest(".content");
    date.value = clickedButton.dataset.date;
    description.value = clickedButton.dataset.description;
    amount.value = clickedButton.dataset.amount;
    editingElement = clickedButton;
  }
});
menuCard.addEventListener("click", (event) => {
  if (event.target.matches(".dark-mode")) {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
      event.target.innerHTML = "Light Mode &#9728;";
    } else {
      event.target.innerHTML =
        'Dark Mode <i class="fas fa-moon dark-mode-icon"></i>';
    }
    localStorage.setItem("Dark Mode", document.body.classList.contains("dark"));
  }
});
