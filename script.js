let date = document.querySelector("#date");
let description = document.querySelector("#description");
let amount = document.querySelector("#amount");
let inputElements = document.querySelectorAll(".input");
let form = document.querySelector(".expense-form");
let contentWrapper = document.querySelector(".content-wrapper");
let localStorageKey = null;
let title = document.querySelector("title");
if (title.textContent === "Contribution Tracker") {
  localStorageKey = "Contributions";
} else if (title.textContent === "Expense Tracker") {
  localStorageKey = "Expenses";
}
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
function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function showData(record) {
  let content = document.createElement("div");
  content.className = "content";
  content.dataset.date = record.date;
  content.dataset.description = record.description;
  content.dataset.amount = record.amount;
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
    date: date.value.trim(),
    description: description.value.trim(),
    amount: amount.value.trim(),
  };
  if (editingElement) {
    storageUpdate(editingElement);
    document.querySelector("#submit").textContent = "Submit";
  }
  if (
    formdata.date.trim() == "" ||
    formdata.description.trim() == "" ||
    formdata.amount.trim() == ""
  ) {
    alert("Empty input field..");
  } else {
    let isDuplicate = records.some(
      (record) =>
        record.date === formdata.date &&
        record.description === formdata.description &&
        record.amount === formdata.amount
    );
    if (isDuplicate) {
      alert("This record already exist !!");
      form.reset();
    } else {
      records.push(formdata);
      records.sort((a, b) => new Date(b.date) - new Date(a.date));
      showData(formdata);
      form.reset();
      localStorage.setItem(localStorageKey, JSON.stringify(records));
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
        record.amount === clickedButton.dataset.amount
      )
  );
  localStorage.setItem(localStorageKey, JSON.stringify(records));
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
  if (records.length === 0 && contentWrapper.innerHTML.trim() === "") {
    alert("List is already Empty !!");
    return;
  }
  if (!confirm("Do you really want to Delete ?")) return;
  contentWrapper.innerHTML = "";
  records = [];
  localStorage.setItem(localStorageKey, JSON.stringify(records));
  alert("All records cleared successfully !!");
});
// function downloadPDF() {
//   const tempWrapper = document.createElement("div");
//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//   let monthName = months[new Date().getMonth()];
//   const title = document.createElement("h2");
//   title.textContent = `Report (${monthName})`;
//   title.style.textAlign = "center";
//   tempWrapper.appendChild(title);
//   let total = document.createElement("div");
//   total.className = "pdf-total";
//   total.innerHTML = `<div>Grand Total</div><div>₹ ${totalExpense}</div>`;
//   document.querySelectorAll(".content-wrapper .content").forEach((original) => {
//     const clone = original.cloneNode(true);
//     clone.className = "clone";
//     const icon = clone.querySelector(".icon-wrapper");
//     if (icon) icon.remove();
//     tempWrapper.appendChild(clone);
//   });
// tempWrapper.appendChild(total);
// tempWrapper.style.color = "black";
// tempWrapper.style.backgroundColor = "white";
// tempWrapper.style.padding = "20px";
// tempWrapper.style.fontSize = "1rem";
// /*global html2pdf*/
// html2pdf()
//   .set({
//     filename: "Expense.pdf",
//     image: { type: "jpeg", quality: 0.98 },
//     html2canvas: { scale: 2 },
//     jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
//   })
//   .from(tempWrapper)
//   .save();
// }
function pdfContent(titleText, storage, element) {
  let total = 0;

  const title = document.createElement("h2");
  title.textContent = titleText;
  title.style.gridColumn = "1/4";
  title.style.justifySelf = "center";
  title.style.margin = "20px 0";
  title.style.textAlign = "center";
  element.appendChild(title);

  // Add table-like headings
  const headings = document.createElement("div");
  headings.style.display = "flex";
  headings.style.justifyContent = "space-between";
  headings.style.fontWeight = "bold";
  headings.style.marginBottom = "10px";

  const dateHeading = document.createElement("span");
  dateHeading.textContent = "Date";
  headings.appendChild(dateHeading);

  const descHeading = document.createElement("span");
  descHeading.textContent = "Description";
  headings.appendChild(descHeading);

  const amountHeading = document.createElement("span");
  amountHeading.textContent = "Amount";
  headings.appendChild(amountHeading);

  element.appendChild(headings);

  storage.forEach((data) => {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.justifyContent = "space-between";
    wrapper.style.marginBottom = "5px";

    const dateSpan = document.createElement("span");
    dateSpan.textContent = data.date;
    wrapper.appendChild(dateSpan);

    const descSpan = document.createElement("span");
    descSpan.textContent = data.description;
    wrapper.appendChild(descSpan);

    const amountSpan = document.createElement("span");
    amountSpan.textContent = data.amount;
    wrapper.appendChild(amountSpan);

    total += Number(data.amount);
    element.appendChild(wrapper);
  });

  const subTotal = document.createElement("div");
  subTotal.className = "pdf-total";
  subTotal.style.marginTop = "10px";
  subTotal.innerHTML = `<strong>Subtotal:</strong> ₹ ${total}`;
  element.appendChild(subTotal);

  return { element, total };
}

function downloadPDF() {
  const tempWrapper = document.createElement("div");
  tempWrapper.style.color = "black";
  tempWrapper.style.backgroundColor = "white";
  tempWrapper.style.padding = "20px";
  tempWrapper.style.fontSize = "1rem";
  tempWrapper.style.width = "100%";

  const title = document.createElement("h2");
  const monthName = new Date().toLocaleString("default", { month: "long" });
  title.textContent = `Monthly Report (${monthName})`;
  title.style.textAlign = "center";
  title.style.marginBottom = "20px";
  tempWrapper.appendChild(title);

  // Contributions Section
  const contributionData = JSON.parse(localStorage.getItem("Contributions") || "[]");
  const contributionsContainer = document.createElement("div");
  const contributionsResult = pdfContent("Contributions", contributionData, contributionsContainer);
  tempWrapper.appendChild(contributionsResult.element);

  // Expenses Section
  const expenseData = JSON.parse(localStorage.getItem("Expenses") || "[]");
  const expensesContainer = document.createElement("div");
  const expensesResult = pdfContent("Expenses", expenseData, expensesContainer);
  tempWrapper.appendChild(expensesResult.element);

  // Export as PDF
  html2pdf()
    .set({
      filename: "Monthly_Report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    })
    .from(tempWrapper)
    .save();
}


document.querySelector(".download").addEventListener("click", downloadPDF);
  /*global html2pdf*/