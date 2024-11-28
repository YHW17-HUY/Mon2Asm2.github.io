"use strict";

// Lấy dữ liệu từ Local Storage
function getFromStorage(key) {
  return localStorage.getItem(key);
}

// Lưu dữ liệu vào Local Storage
function saveToStorage(key, data) {
  localStorage.setItem(key, data);
}

// Mảng lưu các thú cưng
const petArr = JSON.parse(getFromStorage("petArr")) || [];

// Cập nhật bảng hiển thị
function renderPetTable(petArrToShow) {
  const tableBodyEl = document.getElementById("tbody");
  tableBodyEl.innerHTML = ""; // Xóa dữ liệu bảng cũ

  petArrToShow.forEach((pet, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td scope="row">${i + 1}</td>
      <td>${pet.breed}</td>
      <td>${pet.type}</td>
      <td><button class="btn btn-danger" onclick="deletePet('${
        pet.id
      }')">Delete</button></td>
    `;
    tableBodyEl.appendChild(row);
  });
}

// Xóa thú cưng
function deletePet(petID) {
  if (confirm("Are you sure you want to delete this pet?")) {
    const petIndex = petArr.findIndex((pet) => pet.id === petID);
    if (petIndex !== -1) {
      petArr.splice(petIndex, 1); // Xóa khỏi mảng
      saveToStorage("petArr", JSON.stringify(petArr)); // Lưu lại vào Storage
      renderPetTable(petArr); // Cập nhật bảng
    }
  }
}

// Thêm thú cưng mới
document.getElementById("submit-btn").addEventListener("click", () => {
  const petType = document.getElementById("input-type").value;
  const petBreed = document.getElementById("input-breed").value;

  if (petType === "Select Type" || petBreed === "Select Breed") {
    alert("All fields must be filled!");
    return;
  }

  const petData = {
    id: Date.now().toString(36), // Tạo ID duy nhất
    type: petType,
    breed: petBreed,
    dateAdded: new Date().toLocaleDateString(),
  };

  petArr.push(petData); // Thêm vào mảng
  saveToStorage("petArr", JSON.stringify(petArr)); // Lưu vào Local Storage
  document.querySelector("form").reset(); // Xóa dữ liệu form
  renderPetTable(petArr); // Cập nhật bảng
});

// Lắng nghe sự kiện thay đổi trên input type
document.getElementById("input-type").addEventListener("change", () => {
  const selectedType = document.getElementById("input-type").value;
  let filteredPets = petArr;

  if (selectedType === "Dog") {
    filteredPets = petArr.filter((pet) => pet.type === "Dog");
  } else if (selectedType === "Cat") {
    filteredPets = petArr.filter((pet) => pet.type === "Cat");
  }

  renderPetTable(filteredPets); // Hiển thị thú cưng đã lọc
});

// Hiển thị bảng khi tải trang
document.addEventListener("DOMContentLoaded", () => {
  renderPetTable(petArr);
});
