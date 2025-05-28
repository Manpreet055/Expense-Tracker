let date = document.querySelector("#date");
let description = document.querySelector("#description");
let amount = document.querySelector("#amount");
let inputElements = document.querySelectorAll(".input");
let form = document.querySelector(".contribution-form");
let contentWrapper = document.querySelector(".content-wrapper");
let contributions = JSON.parse(localStorage.getItem(localStorageKey)) || [];
let editingElement = null;
let localStorageKey = null;
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
contributions.forEach((expense) => {
  showExpenseData(expense);
});
function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function showExpenseData(expense) {
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
  if (
    formdata.date.trim() == "" ||
    formdata.description.trim() == "" ||
    formdata.amount.trim() == ""
  ) {
    alert("Empty input field..");
  } else {
    let isDuplicate = contributions.some(
      (expense) =>
        expense.date === formdata.date &&
        expense.description === formdata.description &&
        expense.amount === formdata.amount
    );
    if (isDuplicate) {
      alert("This expense already exist !!");
      form.reset();
    } else {
      if (editingElement) {
        storageUpdate(editingElement);
        document.querySelector("#submit").textContent = "Submit";
      }
    }
    contributions.push(formdata);
    contributions.sort((a, b) => new Date(b.date) - new Date(a.date));
    showExpenseData(formdata);
    form.reset();
    localStorage.setItem(localStorageKey, JSON.stringify(contributions));
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
  contributions = contributions.filter(
    (expense) =>
      !(
        expense.date === clickedButton.dataset.date &&
        expense.description === clickedButton.dataset.description &&
        expense.amount === clickedButton.dataset.amount
      )
  );
  localStorage.setItem(localStorageKey, JSON.stringify(contributions));
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
    document.querySelector("#submit").textContent = "Update";

    editingElement = clickedButton;
  }
});
menuCard.addEventListener("click", (event) => {
  if (!event.target.matches("#sorting")) {
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
  if (contributions.length === 0 && contentWrapper.innerHTML.trim() === "") {
    alert("List is already Empty !!");
    return;
  }
  if (!confirm("Do you really want to Delete ?")) return;
  contentWrapper.innerHTML = "";
  contributions = [];
  localStorage.setItem("contribution", JSON.stringify(contributions));
  alert("All expenses cleared successfully !!");
});
function downloadPDF() {
  const tempWrapper = document.createElement("div");
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let monthName = months[new Date().getMonth()];
  const title = document.createElement("h2");
  title.textContent = `Expense Report (${monthName})`;
  title.style.textAlign = "center";
  tempWrapper.appendChild(title);
  let total = document.createElement("div");
  total.className = "pdf-total";
  total.innerHTML = `<div>Grand Total</div><div>₹ ${totalExpense}</div>`;
  document.querySelectorAll(".content-wrapper .content").forEach((original) => {
    const clone = original.cloneNode(true);
    clone.className = "clone";
    const icon = clone.querySelector(".icon-wrapper");
    if (icon) icon.remove();
    tempWrapper.appendChild(clone);
  });
  tempWrapper.appendChild(total);
  tempWrapper.style.color = "black";
  tempWrapper.style.backgroundColor = "white";
  tempWrapper.style.padding = "20px";
  tempWrapper.style.fontSize = "1rem";
  /*global html2pdf*/
  html2pdf()
    .set({
      filename: "Expense.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    })
    .from(tempWrapper)
    .save();
}
document.querySelector(".download").addEventListener("click", downloadPDF);
