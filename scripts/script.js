import { renderContentHeader, sortList } from "./components.js";
let date = document.querySelector("#date");
let description = document.querySelector("#description");
let amount = document.querySelector("#amount");
let inputElements = document.querySelectorAll("input");
let form = document.querySelector(".record-form");
let contentWrapper = document.querySelector(".content-wrapper");
let pageName = document.body.dataset.page;
let localStorageKey =
  pageName === "Contribution" ? "Contributions" : "Expenses";
let records = JSON.parse(localStorage.getItem(localStorageKey)) || [];
let editingElement = null;
let total = document.querySelector(".grand-total");
let totalExpense = 0;
let menuButton = document.querySelector(".menu");
let menuCard = document.querySelector(".menu-card");
if (localStorage.getItem("Dark Mode") === "true") {
  document.body.classList.add("dark");
  document.body.style.transition = "none";
  let darkModeButton = menuCard.querySelector(".dark-mode");
  if (darkModeButton) {
    darkModeButton.innerHTML = `Light Mode &#9728;`;
  }
}
records.forEach((record) => {
  showData(record);
});
export function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function showData(record) {
  let content = document.createElement("div");
  content.className = "content";
  content.dataset.date = record.date;
  content.dataset.description = record.description;
  content.dataset.amount = Number(record.amount);
  let dateSpan = document.createElement("span");
  let dateObj = new Date(record.date);
  let monthName = dateObj.toLocaleString("default", { month: "short" });
  let day = dateObj.getDate();
  dateSpan.textContent = `${monthName} - ${day}`;
  content.appendChild(dateSpan);
  let descriptionSpan = document.createElement("span");
  descriptionSpan.textContent = capitalize(record.description);
  content.appendChild(descriptionSpan);
  let amount = document.createElement("span");
  amount.textContent = "₹" + record.amount;
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
  totalExpense += Number(record.amount);
  total.textContent = `₹ ${totalExpense} `;
}
function submitForm(event) {
  event.preventDefault();
  let formdata = {
    date: date.value,
    description: description.value.trim(),
    amount: amount.value.trim(),
  };
  if (!formdata.date || !formdata.description || !formdata.amount) {
    alert("Empty input field..");
    return;
  }
  let isDuplicate = records.some(
    (record) =>
      record.date === formdata.date &&
      record.description === formdata.description &&
      record.amount === formdata.amount
  );
  if (isDuplicate) {
    alert("This record already exists!");
    document.querySelector("#submit-button").textContent = "Submit";
    form.reset();
    return;
  }
  if (editingElement) {
    storageUpdate(editingElement);
    showData(formdata);
    records.push(formdata);
    editingElement = null;
    document.querySelector("#submit-button").textContent = "Submit";
  } else {
    showData(formdata);
    records.push(formdata);
  }
  total.textContent = `₹ ${totalExpense}`;
  localStorage.setItem(localStorageKey, JSON.stringify(records));
  form.reset();
}
form.addEventListener("submit", submitForm);
inputElements.forEach((input) => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitForm(e);
  });
});
menuButton.addEventListener("click", () => {
  menuCard.style.display = "grid";
  setTimeout(() => {
    menuCard.style.opacity = "1";
    menuCard.style.transform = "translateX(0)";
  }, 200);
});
document.addEventListener("click", (event) => {
  if (!menuButton.contains(event.target) && !menuCard.contains(event.target)) {
    menuCard.style.opacity = "0.5";
    menuCard.style.transform = "translateX(-100%)";
    setTimeout(() => {
      menuCard.style.display = "none";
    }, 200);
  }
});
function storageUpdate(clickedButton) {
  records = records.filter(
    (record) =>
      !(
        record.date === clickedButton.dataset.date &&
        record.description === clickedButton.dataset.description &&
        Number(record.amount) === Number(clickedButton.dataset.amount)
      )
  );
  totalExpense -= Number(clickedButton.dataset.amount);
  total.textContent = `₹ ${totalExpense}`;
  clickedButton.style.opacity = "0.5";
  clickedButton.style.transform = "translatex(-200px)";
  setTimeout(() => {
    clickedButton.remove();
  }, 200);
  localStorage.setItem(localStorageKey, JSON.stringify(records));
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
    document.querySelector("#submit-button").textContent = "Update";
  }
});
menuCard.addEventListener("click", (event) => {
  if (!event.target.matches("#sort-dropdown")) {
    menuCard.style.opacity = "0.5";
    menuCard.style.transform = "translateX(-100%)";
    setTimeout(() => {
      menuCard.style.display = "none";
    }, 200);
  }
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
document.querySelector(".reset").addEventListener("click", () => {
  if (!confirm("Do you really want to Delete ?")) return;
  records = [];
  contentWrapper.innerHTML = renderContentHeader();
  localStorage.setItem(localStorageKey, JSON.stringify(records));
  alert("All records cleared successfully !!");
});
let sorting = document.querySelector("#sort-dropdown");
sorting.addEventListener("change", () => {
  let clickOption = sorting.value;
  totalExpense = 0;
  sortList(clickOption);
  console.log(clickOption);
});
export { showData };
