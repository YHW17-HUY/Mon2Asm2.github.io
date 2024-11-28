"use strict";

// Lấy dữ liệu từ Local Storage
function getFromStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

// Mảng lưu các thú cưng
const petArr = getFromStorage("petArr");

// Hàm lọc thú cưng
function filterPets() {
  // Lấy các giá trị từ form tìm kiếm
  const idInput = document
    .getElementById("input-id")
    .value.trim()
    .toLowerCase();
  const nameInput = document
    .getElementById("input-name")
    .value.trim()
    .toLowerCase();
  const typeInput = document.getElementById("input-type").value;
  const breedInput = document.getElementById("input-breed").value;
  const vaccinatedInput = document.getElementById("input-vaccinated").checked;
  const dewormedInput = document.getElementById("input-dewormed").checked;
  const sterilizedInput = document.getElementById("input-sterilized").checked;

  // Lọc thú cưng dựa trên các tiêu chí
  const filteredPets = petArr.filter((pet) => {
    return (
      // ID chứa ký tự nhập
      (!idInput || pet.id.toLowerCase().includes(idInput)) &&
      // Name chứa ký tự nhập
      (!nameInput || pet.name.toLowerCase().includes(nameInput)) &&
      // Type phải khớp
      (typeInput === "" || pet.type === typeInput) &&
      // Breed phải khớp
      (breedInput === "" || pet.breed === breedInput) &&
      // Đã tiêm phòng
      (!vaccinatedInput || pet.vaccinated) &&
      // Đã tẩy giun
      (!dewormedInput || pet.dewormed) &&
      // Đã triệt sản
      (!sterilizedInput || pet.sterilized)
    );
  });

  // Cập nhật bảng hiển thị
  updateTable(filteredPets);
}

// Hàm cập nhật bảng hiển thị
function updateTable(petArrToShow) {
  const tableBodyEl = document.getElementById("search-results");
  tableBodyEl.innerHTML = ""; // Xóa dữ liệu bảng cũ

  petArrToShow.forEach((pet) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${pet.id}</td>
      <td>${pet.name}</td>
      <td>${pet.age}</td>
      <td>${pet.type}</td>
      <td>${pet.weight} kg</td>
      <td>${pet.length} cm</td>
      <td>${pet.breed}</td>
      <td><i class="bi bi-square-fill" style="color: ${pet.color}"></i></td>
      <td>${pet.vaccinated ? "Yes" : "No"}</td>
      <td>${pet.dewormed ? "Yes" : "No"}</td>
      <td>${pet.sterilized ? "Yes" : "No"}</td>
      <td>${pet.bmi ?? "?"}</td>
      <td>${pet.dateAdded}</td>
    `;
    tableBodyEl.appendChild(row);
  });
}

// Sự kiện tìm kiếm
document.getElementById("search-form").addEventListener("submit", (event) => {
  event.preventDefault(); // Ngăn chặn hành động submit mặc định
  filterPets();
});

// Hiển thị bảng khi tải trang
document.addEventListener("DOMContentLoaded", () => {
  updateTable(petArr);
});
