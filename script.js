let date = document.querySelector("#date");
let description = document.querySelector("#description");
let amount = document.querySelector("#amount");
let form = document.querySelector(".hero-content");
let contentWrapper = document.querySelector(".content-wrapper");
let importButton = document.querySelector("#import");
let expenses = JSON.parse(localStorage.getItem("expense")) || [];
let total = document.querySelector(".grand-total");
let totalExpense = 0;
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
  let description = document.createElement("span");
  description.textContent = capitalize(expense.description);
  content.appendChild(description);
  let amount = document.createElement("span");
  amount.textContent = "₹" + expense.amount;
  content.appendChild(amount);
  let deleteButton = document.createElement("i");
  deleteButton.className = "fas fa-trash delete-button";
  content.appendChild(deleteButton);
  let editButton = document.createElement("i");
  editButton.className = "fas fa-edit edit-button";
  content.appendChild(editButton);
  contentWrapper.appendChild(content);
  totalExpense += Number(expense.amount);
  total.textContent = `₹ ${totalExpense} `;
}
form.addEventListener("submit", (event) => {
  if (event.submitter && event.submitter.id != "submit") {
    event.preventDefault();
    return;
  }
  event.preventDefault();
  let formdata = {
    date: date.value.trim(),
    description: description.value.trim(),
    amount: amount.value.trim(),
  };
  let isDuplicate = expenses.some(
    (expense) =>
      expense.date === formdata.date &&
      expense.description === formdata.description &&
      expense.amount === formdata.amount
  );
  if (isDuplicate) {
    alert("This expense already exist !!");
  } else {
    showData(formdata);
    expenses.push(formdata);
    form.reset();
    localStorage.setItem("expense", JSON.stringify(expenses));
  }
});
importButton.addEventListener("click", (event) => {
  event.preventDefault();
});
contentWrapper.addEventListener("click", (event) => {
  if (event.target.matches(".delete-button")) {
    if (!confirm("Do you really want to delete ??")) {
      return;
    }
    let clickedButton = event.target.closest(".content");
    clickedButton.style.opacity = "0.5";
    clickedButton.style.transform = "translatex(-100px)";
    expenses = expenses.filter(
      (expense) =>
        !(
          expense.date === clickedButton.dataset.date &&
          expense.description === clickedButton.dataset.description &&
          expense.amount === clickedButton.dataset.amount
        )
    );
    localStorage.setItem("expense", JSON.stringify(expenses));
    setTimeout(() => {
      totalExpense -= clickedButton.dataset.amount;
      total.textContent = `₹ ${totalExpense}`;
      clickedButton.remove();
    }, 200);
  }
});
