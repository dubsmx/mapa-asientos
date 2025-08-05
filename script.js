import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, set, get, child, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA19AJ-FK_5In9GHNSNZytSeiSOPMjkvSE",
  authDomain: "mapa-asientos.firebaseapp.com",
  databaseURL: "https://mapa-asientos-default-rtdb.firebaseio.com",
  projectId: "mapa-asientos",
  storageBucket: "mapa-asientos.firebasestorage.app",
  messagingSenderId: "701584379187",
  appId: "1:701584379187:web:a861507862b0788ea50246",
  measurementId: "G-VGQX1X8GCE"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
  const filas = [
    "A","B","C","D","E","F","G","H","I","J",
    "K","L","M","N","Ñ","O","P","Q","R","S",
    "T","U","V","W","X"
  ];

  function crearSeccion(contenedorId, columnas, claseColor) {
    const contenedor = document.getElementById(contenedorId);
    contenedor.style.setProperty('--columnas', columnas);

    filas.forEach(fila => {
      const filaDiv = document.createElement("div");
      filaDiv.classList.add("fila");

      const etiqueta = document.createElement("div");
      etiqueta.classList.add("etiqueta-fila");
      etiqueta.textContent = fila;
      filaDiv.appendChild(etiqueta);

      const asientosContainer = document.createElement("div");
      asientosContainer.classList.add("asientos-container");

      for (let col = 1; col <= columnas; col++) {
        const asiento = document.createElement("div");
        asiento.classList.add("asiento", claseColor);
        asiento.dataset.nombre = `${contenedorId}-${fila}${col}`;
        asiento.textContent = col;

        asiento.addEventListener("click", () => {
          if (!asiento.classList.contains("reservado")) {
            asiento.classList.toggle("seleccionado");
          }
        });

        asientosContainer.appendChild(asiento);
      }

      filaDiv.appendChild(asientosContainer);
      contenedor.appendChild(filaDiv);
    });
  }

  // Crear las zonas
  crearSeccion("zona-a", 20, "rosa");
  crearSeccion("zona-b", 30, "naranja");
  crearSeccion("zona-c", 20, "amarillo");

  // Sincronizar reservas con Firebase
  const reservadosRef = ref(db, "reservados");
  onValue(reservadosRef, (snapshot) => {
    const reservados = snapshot.val() || [];
    document.querySelectorAll(".asiento").forEach(asiento => {
      if (reservados.includes(asiento.dataset.nombre)) {
        asiento.classList.add("reservado");
        asiento.classList.remove("seleccionado");
      } else {
        asiento.classList.remove("reservado");
      }
    });
  });

  document.getElementById("reservar").addEventListener("click", async () => {
    const seleccionados = [...document.querySelectorAll(".asiento.seleccionado")];
    const nuevosReservados = seleccionados.map(a => a.dataset.nombre);
    const snapshot = await get(child(ref(db), "reservados"));
    const actuales = snapshot.exists() ? snapshot.val() : [];
    const actualizados = [...new Set([...actuales, ...nuevosReservados])];
    await set(ref(db, "reservados"), actualizados);
    seleccionados.forEach(a => a.classList.remove("seleccionado"));
    alert("Asientos reservados en la nube");
  });

  document.getElementById("borrar").addEventListener("click", () => {
    document.querySelectorAll(".asiento.seleccionado").forEach(a => a.classList.remove("seleccionado"));
    alert("Selección borrada");
  });

  document.getElementById("reset-all").addEventListener("click", async () => {
    const confirmacion = confirm("¿Seguro que quieres borrar TODAS las reservas?");
    if (confirmacion) {
      await remove(ref(db, "reservados"));
      alert("Todas las reservas fueron eliminadas");
    }
  });

  const mapa = document.getElementById("mapa");
  let scale = 1;
  function updateTransform() { mapa.style.transform = `scale(${scale})`; }
  document.getElementById("zoom-in").addEventListener("click", () => { scale += 0.1; updateTransform(); });
  document.getElementById("zoom-out").addEventListener("click", () => { scale = Math.max(0.5, scale - 0.1); updateTransform(); });
  document.getElementById("reset").addEventListener("click", () => { scale = 1; updateTransform(); });
});
