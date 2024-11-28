// Lấy và lưu dữ liệu vào LocalStorage
const storage = {
  get(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },
  set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },
};

// Quản lý dữ liệu thú cưng
const petData = {
  key: "petArr", // Key dùng để lưu trữ trong LocalStorage

  // Lấy dữ liệu thú cưng từ LocalStorage
  getPets() {
    return storage.get(this.key);
  },

  // Lưu dữ liệu thú cưng vào LocalStorage
  savePets(pets) {
    storage.set(this.key, pets);
  },

  // Thêm thú cưng vào danh sách
  addPet(pet) {
    const pets = this.getPets();
    pets.push(pet);
    this.savePets(pets);
  },

  // Xóa thú cưng khỏi danh sách
  deletePet(petId) {
    const pets = this.getPets();
    const updatedPets = pets.filter((pet) => pet.id !== petId);
    this.savePets(updatedPets);
  },

  // Cập nhật thông tin thú cưng
  updatePet(updatedPet) {
    const pets = this.getPets();
    const index = pets.findIndex((pet) => pet.id === updatedPet.id);
    if (index !== -1) {
      pets[index] = updatedPet;
      this.savePets(pets);
    }
  },

  // Tìm thú cưng theo ID
  findPetById(petId) {
    const pets = this.getPets();
    return pets.find((pet) => pet.id === petId);
  },

  // Lọc thú cưng khỏe mạnh (đã tiêm phòng, tẩy giun, triệt sản)
  getHealthyPets() {
    return this.getPets().filter(
      (pet) => pet.vaccinated && pet.dewormed && pet.sterilized
    );
  },
};

// Xuất dữ liệu ra file JSON
const exportData = () => {
  const pets = petData.getPets();
  const blob = new Blob([JSON.stringify(pets, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pets.json";
  a.click();
  URL.revokeObjectURL(url); // Hủy URL sau khi tải về
};

// Nhập dữ liệu từ file JSON
const importData = (file) => {
  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const importedPets = JSON.parse(event.target.result);
      if (Array.isArray(importedPets)) {
        const existingPets = petData.getPets();

        // Ghi đè dữ liệu đối với thú cưng trùng ID
        importedPets.forEach((importedPet) => {
          const existingPet = existingPets.find(
            (pet) => pet.id === importedPet.id
          );
          if (existingPet) {
            // Nếu thú cưng đã tồn tại, cập nhật dữ liệu
            petData.updatePet(importedPet);
          } else {
            // Nếu thú cưng chưa tồn tại, thêm mới
            petData.addPet(importedPet);
          }
        });

        alert("Data imported successfully!");
      } else {
        alert("Invalid file format!");
      }
    } catch (error) {
      alert("Error reading file!");
    }
  };
  reader.readAsText(file);
};

// Lắng nghe sự kiện export dữ liệu
document.getElementById("export-btn").addEventListener("click", () => {
  exportData();
});

// Lắng nghe sự kiện import dữ liệu
document.getElementById("import-btn").addEventListener("click", () => {
  const inputFile = document.getElementById("input-file");
  if (inputFile.files.length > 0) {
    const file = inputFile.files[0];
    importData(file);
  } else {
    alert("Please choose a file to import!");
  }
});
