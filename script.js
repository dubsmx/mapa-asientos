// --- Inicializar Firebase ---
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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ----------------------------

document.addEventListener("DOMContentLoaded", () => {
  const filas = [
    "A","B","C","D","E","F","G","H","I","J",
    "K","L","M","N","Ñ","O","P","Q","R","S",
    "T","U","V","W","X"
  ];

  // --- Crear secciones ---
  function crearSeccion(contenedorId, columnas) {
    const contenedor = document.getElementById(contenedorId);

    filas.forEach(fila => {
      const filaDiv = document.createElement("div");
      filaDiv.classList.add("fila");

      const etiqueta = document.createElement("div");
      etiqueta.classList.add("etiqueta-fila");
      etiqueta.textContent = fila;
      filaDiv.appendChild(etiqueta);

      for (let col = 1; col <= columnas; col++) {
        const asiento = document.createElement("div");
        asiento.classList.add("asiento");
        asiento.dataset.nombre = `${contenedorId}-${fila}${col}`;
        asiento.textContent = col;

        asiento.addEventListener("click", () => {
          if (!asiento.classList.contains("reservado")) {
            asiento.classList.toggle("seleccionado");
          }
        });

        filaDiv.appendChild(asiento);
      }
      contenedor.appendChild(filaDiv);
    });
  }

  crearSeccion("zona-a", 20);
  crearSeccion("zona-b", 30);
  crearSeccion("zona-c", 20);

  // --- Escuchar asientos reservados en tiempo real ---
  const reservadosRef = db.ref("reservados");
  reservadosRef.on("value", (snapshot) => {
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

  // --- Botón Reservar ---
  document.getElementById("reservar").addEventListener("click", () => {
    const seleccionados = [...document.querySelectorAll(".asiento.seleccionado")];
    const nuevosReservados = seleccionados.map(a => a.dataset.nombre);

    reservadosRef.once("value", (snapshot) => {
      const actuales = snapshot.val() || [];
      const actualizados = [...new Set([...actuales, ...nuevosReservados])];
      db.ref("reservados").set(actualizados);
    });

    seleccionados.forEach(a => a.classList.remove("seleccionado"));
    alert("Asientos reservados y guardados en la nube");
  });

  // --- Botón Borrar selección ---
  document.getElementById("borrar").addEventListener("click", () => {
    document.querySelectorAll(".asiento.seleccionado").forEach(a => a.classList.remove("seleccionado"));
    alert("Selección borrada");
  });

  // --- Zoom ---
  const mapa = document.getElementById("mapa");
  let scale = 1;

  function updateTransform() {
    mapa.style.transform = `scale(${scale})`;
  }

  document.getElementById("zoom-in").addEventListener("click", () => {
    scale += 0.1;
    updateTransform();
  });

  document.getElementById("zoom-out").addEventListener("click", () => {
    scale = Math.max(0.5, scale - 0.1);
    updateTransform();
  });

  document.getElementById("reset").addEventListener("click", () => {
    scale = 1;
    updateTransform();
  });
});
