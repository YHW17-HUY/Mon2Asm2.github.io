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
      <td><button class="btn btn-warning edit-btn" data-id="${
        pet.id
      }">Edit</button></td>
    `;
    tableBodyEl.appendChild(row);
  });
}

// Hàm editPet
const editPet = function (petID) {
  const containerEl = document.querySelector(".container"); // Lấy phần tử với class .container

  if (containerEl) {
    containerEl.classList.remove("dplay"); // Xóa class 'dplay' nếu tồn tại
  }

  // Tìm thú cưng cần chỉnh sửa
  const pet = petArr.find((p) => p.id === petID);

  // Điền thông tin thú cưng vào form
  document.getElementById("input-id").value = pet.id;
  document.getElementById("input-name").value = pet.name;
  document.getElementById("input-age").value = pet.age;
  document.getElementById("input-type").value = pet.type;
  document.getElementById("input-weight").value = pet.weight;
  document.getElementById("input-length").value = pet.length;
  document.getElementById("input-color-1").value = pet.color;
  document.getElementById("input-breed").value = pet.breed;
  document.getElementById("input-vaccinated").checked = pet.vaccinated;
  document.getElementById("input-dewormed").checked = pet.dewormed;
  document.getElementById("input-sterilized").checked = pet.sterilized;

  // Xử lý sự kiện submit
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

    // Kiểm tra dữ liệu
    function validateData() {
      if (
        petId === pet.id &&
        petName === pet.name &&
        petAge === pet.age &&
        petType === pet.type &&
        petWeight === pet.weight &&
        petLength === pet.length &&
        petColor === pet.color &&
        petBreed === pet.breed &&
        isVaccinated === pet.vaccinated &&
        isDewormed === pet.dewormed &&
        isSterilized === pet.sterilized
      ) {
        return false;
      }

      if (petArr.some((pet) => pet.id !== petID && pet.id === petId)) {
        return false;
      }
      if (
        petId.trim() === "" || // Kiểm tra ID không rỗng
        petName.trim() === "" || // Kiểm tra tên không rỗng
        petAge === "" ||
        isNaN(petAge) || // Kiểm tra tuổi không rỗng và là số
        petWeight === "" ||
        isNaN(petWeight) || // Kiểm tra cân nặng không rỗng và là số
        petLength === "" ||
        isNaN(petLength) || // Kiểm tra chiều dài không rỗng và là số
        petType === "Select Type" || // Kiểm tra loại thú cưng đã chọn
        petBreed === "Select Breed" // Kiểm tra giống thú cưng đã chọn
      ) {
        return false;
      }

      if (petAge < 1 || petAge > 15) {
        return false;
      }

      if (petWeight < 1 || petWeight > 15) {
        return false;
      }

      if (petLength < 1 || petLength > 100) {
        return false;
      }

      return true;
    }

    if (validateData()) {
      // Tạo dữ liệu thú cưng mới
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
        dateAdded: pet.dateAdded, // Giữ nguyên ngày thêm
      };

      // Tìm vị trí thú cưng cần chỉnh sửa
      const petIndex = petArr.findIndex((p) => p.id === petID);

      if (petIndex !== -1) {
        // Xóa thú cưng cũ
        petArr.splice(petIndex, 1);

        // Thêm thú cưng mới vào mảng
        petArr.splice(petIndex, 0, petData);

        // Lưu vào Local Storage
        saveToStorage("petArr", JSON.stringify(petArr));

        // Reset form
        document.querySelector("form").reset();

        // Cập nhật bảng
        updateTable(petArr);
      }
      if (containerEl) {
        containerEl.classList.add("dplay"); // Xóa class 'dplay' nếu tồn tại
      }
    }
  });
};

// Lắng nghe sự kiện click trên bảng (Event Delegation)
document.getElementById("tbody").addEventListener("click", (event) => {
  if (event.target.classList.contains("edit-btn")) {
    const petId = event.target.getAttribute("data-id"); // Lấy ID từ nút bấm
    editPet(petId); // Gọi hàm editPet với ID
  }
});

// Lắng nghe sự kiện thay đổi loại thú cưng (dog/cat)
document.getElementById("input-type").addEventListener("change", () => {
  const selectedType = document.getElementById("input-type").value;
  let filteredPets = petArr;

  if (selectedType !== "Select Type") {
    filteredPets = petArr.filter((pet) => pet.type === selectedType);
  }

  updateTable(filteredPets);
});

// Hiển thị bảng khi tải trang
document.addEventListener("DOMContentLoaded", () => {
  updateTable(petArr);
});
