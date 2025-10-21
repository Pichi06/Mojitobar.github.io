const firebaseConfig = {
  apiKey: "AIzaSyC73uE8DCepBb4Ovox02xjZq7sERUn11Do",
  authDomain: "mojitos-bar-loteria.firebaseapp.com",
  projectId: "mojitos-bar-loteria",
  storageBucket: "mojitos-bar-loteria.firebasestorage.app",
  messagingSenderId: "958146584765",
  appId: "1:958146584765:web:117c6f10d63b401b8f97d4"
};


// Cargar y mostrar los boletos en la tabla
async function cargarBoletos() {
  const querySnapshot = await getDocs(collection(db, "boletos"));
  dataTable.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${data.numero}</td>
      <td>${data.nombre}</td>
      <td>${data.telefono}</td>
      <td>${data.fecha}</td>
      <td><button class="deleteBtn" data-id="${docSnap.id}">🗑️</button></td>
    `;

    dataTable.appendChild(fila);
  });

  // Agregar eventos de borrar a cada botón
  document.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.getAttribute("data-id");
      const confirmar = confirm("¿Seguro que quieres eliminar este boleto?");
      if (confirmar) {
        await deleteDoc(doc(db, "boletos", id));
        alert("🗑️ Boleto eliminado correctamente");
        cargarBoletos(); // Recargar lista
      }
    });
  });
}
