import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// 🔧 Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC73uE8DCepBb4Ovox02xjZq7sERUn11Do",
  authDomain: "mojitos-bar-loteria.firebaseapp.com",
  projectId: "mojitos-bar-loteria",
  storageBucket: "mojitos-bar-loteria.firebasestorage.app",
  messagingSenderId: "958146584765",
  appId: "1:958146584765:web:117c6f10d63b401b8f97d4"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const addTicketBtn = document.getElementById("addTicketBtn");
const formContainer = document.getElementById("formContainer");
const saveBtn = document.getElementById("saveBtn");
const dataContainer = document.getElementById("dataContainer");
const dataTable = document.getElementById("dataTable");
const adminLogin = document.getElementById("adminLogin");
const loginBtn = document.getElementById("loginBtn");

const ADMIN_PASSWORD = "mojitosbar2025"; // Contraseña del panel

// Mostrar / ocultar formulario
addTicketBtn.addEventListener("click", () => {
  formContainer.classList.toggle("hidden");
});

// Guardar nuevo boleto
saveBtn.addEventListener("click", async () => {
  const boleto = document.getElementById("boleto").value;
  const nombre = document.getElementById("nombre").value;
  const telefono = document.getElementById("telefono").value;
  const serie = document.getElementById("serie").value;

  if (!boleto || !nombre || !telefono || !serie) {
    alert("Completa todos los campos");
    return;
  }

  try {
    await addDoc(collection(db, "boletos"), {
      numero: boleto,
      nombre: nombre,
      telefono: telefono,
      serie: serie,
      fecha: new Date().toLocaleString()
    });
    alert("✅ Boleto guardado correctamente");
    document.getElementById("boleto").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("serie").value = "";
  } catch (error) {
    console.error("Error al guardar:", error);
    alert("❌ Error al guardar el boleto");
  }
});

// Login del administrador
loginBtn.addEventListener("click", async () => {
  const pass = document.getElementById("adminPass").value;
  if (pass === ADMIN_PASSWORD) {
    adminLogin.classList.add("hidden");
    dataContainer.classList.remove("hidden");

    const querySnapshot = await getDocs(collection(db, "boletos"));
    dataTable.innerHTML = "";
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${data.numero}</td>
        <td>${data.nombre}</td>
        <td>${data.telefono}</td>
        <td>${data.serie || "-"}</td>
        <td>${data.fecha}</td>
        <td><button class="deleteBtn" data-id="${docSnap.id}">🗑️</button></td>
      `;
      dataTable.appendChild(fila);
    });

    // Activar botones de eliminar
    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-id");
        const confirmar = confirm("¿Seguro que quieres eliminar este boleto?");
        if (confirmar) {
          await deleteDoc(doc(db, "boletos", id));
          alert("🗑️ Boleto eliminado correctamente");
          location.reload();
        }
      });
    });
  } else {
    alert("❌ Contraseña incorrecta");
  }
});
