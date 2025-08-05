document.addEventListener("DOMContentLoaded", () => {
  const filas = [
    "A","B","C","D","E","F","G","H","I","J",
    "K","L","M","N","Ñ","O","P","Q","R","S",
    "T","U","V","W","X"
  ];

  // --- Cargar asientos reservados guardados ---
  const reservadosGuardados = JSON.parse(localStorage.getItem("asientosReservados")) || [];

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

        // Marcar como reservado si estaba guardado
        if (reservadosGuardados.includes(asiento.dataset.nombre)) {
          asiento.classList.add("reservado");
        }

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

  // Crear secciones
  crearSeccion("zona-a", 20);
  crearSeccion("zona-b", 30);
  crearSeccion("zona-c", 20);

  // --- ZOOM GLOBAL ---
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

  // --- RESERVAR ---
  document.getElementById("reservar").addEventListener("click", () => {
    const seleccionados = document.querySelectorAll(".asiento.seleccionado");
    const nuevosReservados = [];

    seleccionados.forEach(asiento => {
      asiento.classList.remove("seleccionado");
      asiento.classList.add("reservado");
      nuevosReservados.push(asiento.dataset.nombre);
    });

    // Guardar en LocalStorage
    const actual = JSON.parse(localStorage.getItem("asientosReservados")) || [];
    const actualizado = [...new Set([...actual, ...nuevosReservados])];
    localStorage.setItem("asientosReservados", JSON.stringify(actualizado));

    alert("Asientos reservados con éxito");
  });

  // --- BORRAR SELECCIÓN ---
  document.getElementById("borrar").addEventListener("click", () => {
    const seleccionados = document.querySelectorAll(".asiento.seleccionado");
    seleccionados.forEach(asiento => asiento.classList.remove("seleccionado"));
    alert("Selección borrada");
  });
});
