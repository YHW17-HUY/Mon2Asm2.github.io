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

const petArrHealthy = [];

// Cập nhật danh sách thú cưng khỏe mạnh
function updateHealthyPets() {
  petArrHealthy.length = 0; // Xóa dữ liệu cũ
  petArr.forEach((pet) => {
    if (pet.vaccinated && pet.dewormed && pet.sterilized) {
      petArrHealthy.push(pet);
    }
  });
}

// Cập nhật bảng hiển thị
function updateTable(petArrToShow) {
  const tableBodyEl = document.getElementById("tbody");
  tableBodyEl.innerHTML = ""; // Xóa dữ liệu bảng cũ

  petArrToShow.forEach((pet) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <th scope="row">${pet.id}</th>
      <td>${pet.name}</td>
      <td>${pet.age}</td>
      <td>${pet.type}</td>
      <td>${pet.weight} kg</td>
      <td>${pet.length} cm</td>
      <td>${pet.breed}</td>
      <td><i class="bi bi-square-fill" style="color: ${pet.color}"></i></td>
      <td><i class="bi ${
        pet.vaccinated ? "bi-check-circle-fill" : "bi-x-circle-fill"
      }"></i></td>
      <td><i class="bi ${
        pet.dewormed ? "bi-check-circle-fill" : "bi-x-circle-fill"
      }"></i></td>
      <td><i class="bi ${
        pet.sterilized ? "bi-check-circle-fill" : "bi-x-circle-fill"
      }"></i></td>
      <td>${pet.bmi ?? "?"}</td>
      <td>${pet.dateAdded}</td>
      <td><button class="btn btn-danger" onclick="deletePet('${
        pet.id
      }')">Delete</button></td>
    `;
    tableBodyEl.appendChild(row);
  });
}

// Xóa thú cưng
function deletePet(petId) {
  if (confirm("Are you sure you want to delete this pet?")) {
    const petIndex = petArr.findIndex((pet) => pet.id == petId);
    if (petIndex !== -1) {
      petArr.splice(petIndex, 1); // Xóa thú cưng khỏi mảng
      saveToStorage("petArr", JSON.stringify(petArr)); // Lưu lại dữ liệu
      updateHealthyPets(); // Cập nhật danh sách thú cưng khỏe mạnh
      updateTable(healthyCheck ? petArrHealthy : petArr); // Cập nhật bảng
    }
  }
}

// Thêm thú cưng mới
document.getElementById("submit-btn").addEventListener("click", () => {
  const petId = document.getElementById("input-id").value.trim();
  const petName = document.getElementById("input-name").value.trim();
  const petAge = parseInt(document.getElementById("input-age").value.trim());
  const petType = document.getElementById("input-type").value;
  const petWeight = parseFloat(
    document.getElementById("input-weight").value.trim()
  );
  const petLength = parseFloat(
    document.getElementById("input-length").value.trim()
  );
  const petColor = document.getElementById("input-color-1").value;
  const petBreed = document.getElementById("input-breed").value;
  const isVaccinated = document.getElementById("input-vaccinated").checked;
  const isDewormed = document.getElementById("input-dewormed").checked;
  const isSterilized = document.getElementById("input-sterilized").checked;

  // Kiểm tra tính hợp lệ của dữ liệu
  function validateData() {
    let valid = true;
    let errorMessage = "";

    // Kiểm tra các trường dữ liệu
    if (
      !petId ||
      !petName ||
      isNaN(petAge) ||
      isNaN(petWeight) ||
      isNaN(petLength) ||
      petType === "Select Type" ||
      petBreed === "Select Breed"
    ) {
      errorMessage = "All fields must be filled!";
      valid = false;
    }

    if (petArr.some((pet) => pet.id === petId)) {
      errorMessage = "ID must be unique!";
      valid = false;
    }

    if (petAge < 1 || petAge > 15) {
      errorMessage = "Age must be between 1 and 15!";
      valid = false;
    }

    if (petWeight < 1 || petWeight > 15) {
      errorMessage = "Weight must be between 1 and 15!";
      valid = false;
    }

    if (petLength < 1 || petLength > 100) {
      errorMessage = "Length must be between 1 and 100!";
      valid = false;
    }

    if (!valid) {
      alert(errorMessage); // Hiển thị thông báo lỗi phù hợp
    }

    return valid;
  }

  if (validateData()) {
    const petData = {
      id: petId,
      name: petName,
      age: petAge,
      type: petType,
      weight: petWeight,
      length: petLength,
      color: petColor,
      breed: petBreed,
      vaccinated: isVaccinated,
      dewormed: isDewormed,
      sterilized: isSterilized,
      bmi: "?",
      dateAdded: new Date().toLocaleDateString(),
    };

    petArr.push(petData); // Thêm thú cưng vào mảng
    saveToStorage("petArr", JSON.stringify(petArr)); // Lưu dữ liệu
    updateHealthyPets(); // Cập nhật danh sách thú cưng khỏe mạnh
    document.querySelector("form").reset(); // Xóa dữ liệu form
    updateTable(healthyCheck ? petArrHealthy : petArr); // Cập nhật bảng
  }
});

// Lắng nghe sự kiện click trên input type
// Lắng nghe sự kiện click trên input type
document.getElementById("input-type").addEventListener("change", () => {
  const selectedType = document.getElementById("input-type").value; // Lấy giá trị loại thú cưng được chọn
  let filteredPets = healthyCheck ? petArrHealthy : petArr; // Lọc theo chế độ Healthy Pet

  // Kiểm tra loại thú cưng được chọn
  if (selectedType === "Select Type") {
    // Hiển thị toàn bộ thú cưng (không lọc)
    updateTable(filteredPets);
  } else {
    // Lọc theo loại thú cưng được chọn (Dog hoặc Cat)
    filteredPets = filteredPets.filter((pet) => pet.type === selectedType);
    updateTable(filteredPets);
  }
});
// Chuyển đổi chế độ hiển thị
let healthyCheck = false;
document.getElementById("healthy-btn").addEventListener("click", () => {
  healthyCheck = !healthyCheck;
  document.getElementById("healthy-btn").textContent = healthyCheck
    ? "Show All Pet"
    : "Show Healthy Pet";

  const selectedType = document.getElementById("input-type").value;
  let filteredPets = healthyCheck ? petArrHealthy : petArr;

  if (selectedType === "Dog") {
    filteredPets = filteredPets.filter((pet) => pet.type === "Dog");
  } else if (selectedType === "Cat") {
    filteredPets = filteredPets.filter((pet) => pet.type === "Cat");
  }

  updateTable(filteredPets);
});

// Tính BMI
document.getElementById("bmi-btn").addEventListener("click", () => {
  petArr.forEach((pet) => {
    if (pet.type === "Dog") {
      pet.bmi = ((pet.weight * 703) / pet.length ** 2).toFixed(2);
    } else if (pet.type === "Cat") {
      pet.bmi = ((pet.weight * 886) / pet.length ** 2).toFixed(2);
    }
  });
  saveToStorage("petArr", JSON.stringify(petArr)); // Lưu lại sau khi tính BMI
  updateTable(healthyCheck ? petArrHealthy : petArr); // Cập nhật bảng
});

// Hiển thị bảng khi tải trang
document.addEventListener("DOMContentLoaded", () => {
  updateHealthyPets();
  updateTable(healthyCheck ? petArrHealthy : petArr);
});
