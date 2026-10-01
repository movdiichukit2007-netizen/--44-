// Змінна для збереження ID відправлення, яке видаляємо
let currentDeleteTrack = null;

// Функція перемикання між розділами
function showSection(sectionId) {
    document.getElementById("list-section").style.display = "none";
    document.getElementById("form-section").style.display = "none";
    document.getElementById("details-section").style.display = "none";
    document.getElementById("about-section").style.display = "none";

    document.getElementById(sectionId).style.display = "block";
}

// Функція валідації форми та додавання запису
function handleFormSubmit(event) {
    event.preventDefault();

    // Отримуємо значення з полів
    const sender = document.getElementById("sender").value.trim();
    const receiver = document.getElementById("receiver").value.trim();
    const weight = Number(document.getElementById("weight").value);
    const price = Number(document.getElementById("price").value);

    let hasErrors = false;

    // Скидаємо попередні помилки
    resetErrors();

    // Валідація відправника
    if (sender === "") {
        showError("sender", "⚠️ Введіть ПІБ відправника");
        hasErrors = true;
    }

    // Валідація отримувача
    if (receiver === "") {
        showError("receiver", "⚠️ Введіть ПІБ отримувача");
        hasErrors = true;
    }

    // Валідація ваги
    if (isNaN(weight) || weight <= 0) {
        showError("weight", "⚠️ Вага має бути числом більше 0");
        hasErrors = true;
    }

    // Валідація вартості
    if (isNaN(price) || price < 0) {
        showError("price", "⚠️ Вартість має бути числом від 0");
        hasErrors = true;
    }

    // Якщо є помилки — зупиняємо збереження
    if (hasErrors) {
        return;
    }

    // Додаємо новий рядок у таблицю
    const randomTrack = "PS-" + Math.floor(100000 + Math.random() * 900000);
    const tableBody = document.getElementById("postings-body");

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td><b>${randomTrack}</b></td>
        <td>${sender}</td>
        <td>${receiver}</td>
        <td>${weight}</td>
        <td>${price.toFixed(2)}</td>
        <td><span class="badge in-transit">Оформлено</span></td>
        <td>
            <button class="btn-sm btn-info" onclick="viewDetails('${randomTrack}', '${sender}', '${receiver}', ${weight}, ${price}, 'Оформлено')">Деталі</button>
            <button class="btn-sm btn-danger" onclick="confirmDelete('${randomTrack}')">Видалити</button>
        </td>
    `;

    tableBody.appendChild(newRow);

    // Очищаємо форму і повертаємося до списку
    document.getElementById("posting-form").reset();
    showSection("list-section");
}

// Допоміжні функції для показу помилок
function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorSpan = document.getElementById(fieldId + "-error");

    input.classList.add("input-error");
    errorSpan.textContent = message;
}

function resetErrors() {
    const errorInputs = document.querySelectorAll(".input-error");
    errorInputs.forEach(input => input.classList.remove("input-error"));

    const errorSpans = document.querySelectorAll(".error-text");
    errorSpans.forEach(span => span.textContent = "");
}

// Перегляд деталей відправлення
function viewDetails(track, sender, receiver, weight, price, status) {
    document.getElementById("det-track").textContent = track;
    document.getElementById("det-sender").textContent = sender;
    document.getElementById("det-receiver").textContent = receiver;
    document.getElementById("det-weight").textContent = weight;
    document.getElementById("det-price").textContent = price;
    document.getElementById("det-status").textContent = status;

    showSection("details-section");
}

// Модальне вікно видалення
function confirmDelete(trackId) {
    currentDeleteTrack = trackId;
    document.getElementById("delete-track-id").textContent = trackId;
    document.getElementById("confirm-modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("confirm-modal").style.display = "none";
    currentDeleteTrack = null;
}

function deleteConfirmed() {
    // Знаходимо рядок у таблиці та видаляємо
    const rows = document.querySelectorAll("#postings-body tr");
    rows.forEach(row => {
        if (row.textContent.includes(currentDeleteTrack)) {
            row.remove();
        }
    });

    closeModal();
}
