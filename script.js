let participants = [
  "Manolo",
  "Juan",
  "Suso",
  "Víctor",
  "Eloy",
  "Nando",
  "Melo",
  "Norberto",
  "Ramon",
  "Daniel",
  "Antonio",
  "Jesé",
  "Ruben",
  "Esteban",
  "Rene",
  "Ray",
  "Octavio",
  "David",
  "Carlos",
  "Camilo",
  "Jorge",
  "Jorge 2",
  "Héctor",
  "Gustavo",
  "Tomas",
  "Egonay",
  "Esteban",
  "Raúl",
  "Octavio 2",
  "Mario",
  "Fran",
  "Sergio",
  "Jaime"
];
let tableAssignments = []; // Nueva estructura para mantener las mesas

function addParticipant() {
  const input = document.getElementById("participant-name");
  const name = input.value.trim();
  if (name && participants.length < 30 && !participants.includes(name)) {
    participants.push(name);
    updateParticipantList();
    input.value = "";
  }
}

function updateParticipantList() {
  const list = document.getElementById("participant-list");
  list.innerHTML = "";
  participants.forEach((name, index) => {
    const item = document.createElement("li");
    item.className = "list-group-item d-flex justify-content-between align-items-center";
    item.innerText = `${index + 1}. ${name}`;
    const removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-danger btn-sm";
    removeBtn.innerText = "X";
    removeBtn.onclick = () => {
      participants.splice(index, 1);
      updateParticipantList();
    };
    item.appendChild(removeBtn);
    list.appendChild(item);
  });
}

function confirmParticipants() {
  if (participants.length === 0) return alert("Agrega al menos un participante.");
  document.getElementById("registration-view").classList.add("d-none");
  document.getElementById("tables-view").classList.remove("d-none");
  generateInitialTables();
  renderTables();
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function generateInitialTables() {
  const shuffled = shuffle([...participants]);
  const tableCount = shuffled.length <= 10 ? 1 : shuffled.length <= 18 ? 2 : 3;
  const base = Math.floor(shuffled.length / tableCount);
  const extras = shuffled.length % tableCount;
  tableAssignments = [];
  let index = 0;
  for (let i = 0; i < tableCount; i++) {
    const size = base + (i < extras ? 1 : 0);
    tableAssignments.push(shuffled.slice(index, index + size));
    index += size;
  }
}

function renderTables() {
  const container = document.getElementById("tables-container");
  container.innerHTML = "";
  container.style.display = "flex";
  container.style.flexWrap = "wrap";
  container.style.justifyContent = "center";
  container.style.alignItems = "flex-start";
  container.style.gap = "40px";
  container.style.maxWidth = "100%";

  tableAssignments.forEach((table, idx) => {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = "center";
    wrapper.style.flex = "0 1 500px";
    wrapper.style.maxWidth = "600px";

    if (tableAssignments.length === 3 && idx === 2) {
      wrapper.style.marginTop = "40px";
      wrapper.style.width = "100%";
      wrapper.style.display = "flex";
      wrapper.style.justifyContent = "center";
    }

    const tableTitle = document.createElement("h5");
    tableTitle.className = "text-white text-center mb-2";
    tableTitle.innerText = `Mesa ${idx + 1}`;
    wrapper.appendChild(tableTitle);

    const tableLayout = document.createElement("div");
    tableLayout.className = "poker-table";

    // Los asientos se crean en orden de 1 a 10 siguiendo el CSS (de las agujas del reloj)
    for (let i = 0; i < 10; i++) {
      const seat = document.createElement("div");
      seat.className = "seat";
      if (table[i]) {
        const playerBox = document.createElement("div");
        playerBox.className = "player-box";
        playerBox.innerHTML = `
          ${i + 1}. ${table[i]}  <!-- número correlativo del asiento -->
          <div class="player-controls">
              <button class="btn btn-delete" onclick="removeFromTable(${idx}, ${i})">🗑️</button>
          </div>`;
        seat.appendChild(playerBox);
      } else {
        createPlayerSelector(seat, idx, i);
      }
      tableLayout.appendChild(seat);
    }

    wrapper.appendChild(tableLayout);
    container.appendChild(wrapper);
  });
}


function removeFromTable(tableIndex, seatIndex) {
  // Cambiar el jugador por null para mantener la posición
  tableAssignments[tableIndex][seatIndex] = null;
  renderTables();
}

function createPlayerSelector(seatElement, tableIndex, seatIndex) {
  const select = document.createElement("select");
  select.className = "form-select form-select-sm";
  select.innerHTML = `<option value="">+ Añadir</option>`;

  const assignedPlayers = tableAssignments.flat().filter(Boolean);
  const available = participants.filter(p => !assignedPlayers.includes(p));

  available.forEach(p => {
    const option = document.createElement("option");
    option.value = p;
    option.text = p;
    select.appendChild(option);
  });

  select.onchange = (e) => {
    const selectedName = e.target.value;
    if (selectedName) {
      tableAssignments[tableIndex][seatIndex] = selectedName;
      renderTables();
    }
  };

  seatElement.appendChild(select);
}

updateParticipantList();