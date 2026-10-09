"use strict";

// CONFIGURACIÓN INICIAL
const INITIAL_CENTER = [21.122, -101.68];
const INITIAL_ZOOM = 13;

const CATEGORY_CONFIG = {
  bache: {
    label: "Bache",
    color: "#d92d20",
  },

  alumbrado: {
    label: "Alumbrado",
    color: "#f79009",
  },

  basura: {
    label: "Basura",
    color: "#667085",
  },

  fuga: {
    label: "Fuga de agua",
    color: "#1570ef",
  },

  accidente: {
    label: "Accidente",
    color: "#7a5af8",
  },
};

// ARREGLO DE INCIDENTES
let incidents = [
  {
    id: "INC-001",
    title: "Bache frente a la universidad",
    category: "bache",
    description: "Bache profundo que dificulta el paso de vehículos",
    status: "pendiente",
    latitude: 21.1248,
    longitude: -101.6812,
    createdAt: "2026-01-15",
  },

  {
    id: "INC-002",
    title: "Luminaria sin funcionar",
    category: "alumbrado",
    description: "La calle permanece oscura durante la noche",
    status: "atendido",
    latitude: 21.1195,
    longitude: -101.6751,
    createdAt: "2026-01-16",
  },

  {
    id: "INC-003",
    title: "Acumulación de basura",
    category: "basura",
    description: "Hay residuos acumulados junto al parque",
    status: "pendiente",
    latitude: 21.1271,
    longitude: -101.688,
    createdAt: "2026-01-17",
  },

  {
    id: "INC-004",
    title: "Fuga en tubería principal",
    category: "fuga",
    description: "Se observa una corriente constante de agua",
    status: "pendiente",
    latitude: 21.1158,
    longitude: -101.6754,
    createdAt: "2026-01-18",
  },

  {
    id: "INC-005",
    title: "Accidente vehicular",
    category: "accidente",
    description: "Choque menor, se recomienda circular con precaución",
    status: "atendido",
    latitude: 21.121,
    longitude: -101.6923,
    createdAt: "2026-01-19",
  },
];

// REFERENCIAS DEL DOM
const incidentForm = document.getElementById("incident-form");
const incidentIdInput = document.getElementById("incident-id");
const titleInput = document.getElementById("title-input");
const categoryInput = document.getElementById("category-input");
const descriptionInput = document.getElementById("description-input");
const statusInput = document.getElementById("status-input");
const latitudeInput = document.getElementById("latitude-input");
const longitudeInput = document.getElementById("longitude-input");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const statusFilter = document.getElementById("status-filter");
const incidentList =
  document.getElementById("incidents-list") ||
  document.getElementById("incident-list");
const emptyMessage = document.getElementById("empty-message");
const resultsCounter = document.getElementById("results-counter");
const statTotal = document.getElementById("stat-total");
const statPending = document.getElementById("stat-pending");
const statResolved = document.getElementById("stat-resolved");
const formTitle = document.getElementById("form-title");
const formModeBadge = document.getElementById("form-mode-badge");
const formMessage = document.getElementById("form-message");
const saveButton = document.getElementById("save-button");
const cancelButton = document.getElementById("cancel-button");
const fitMapButton = document.getElementById("btn-fit-map");
const coordinateIndicator = document.getElementById("coordinate-indicator");
// INICIALIZACIÓN DEL MAPA
const map = L.map("map", {
  center: INITIAL_CENTER,
  zoom: INITIAL_ZOOM,
  zoomControl: true,
});
// CAPAS BASE
const streetLayer = L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://tile.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
);
const humanitarianLayer = L.tileLayer(
  "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      "&copy; OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team",
  },
);

streetLayer.addTo(map);

// GRUPOS DE CAPAS
const incidentsLayer = L.layerGroup().addTo(map);
const selectionLayer = L.layerGroup().addTo(map);
const baseLayers = {
  "Mapa de calles": streetLayer,
  "Mapa Humanitario": humanitarianLayer,
};
const overlays = {
  "Incidentes urbanos": incidentsLayer,
  "Selección temporal": selectionLayer,
};

L.control
  .layers(baseLayers, overlays, {
    collapsed: false,
    position: "topright",
  })
  .addTo(map);

L.control
  .scale({
    imperial: false,
    position: "bottomright",
  })
  .addTo(map);

// LEYENDA
const legend = L.control({
  position: "bottomleft",
});

legend.onAdd = function () {
  const container = L.DomUtil.create("div", "map-legend");
  let content = "<h4>Categorías</h4>";

  Object.entries(CATEGORY_CONFIG).forEach(function ([key, config]) {
    content += `
        <div class="legend-item">
          <span
            class="legend-color"
            style="background: ${config.color}">
          </span>

          <span>${config.label}</span>
        </div>
      `;
  });

  container.innerHTML = content;
  return container;
};

legend.addTo(map);

// SELECCIÓN DE COORDENADAS EN EL MAPA
map.on("click", function (event) {
  const latitude = Number(event.latlng.lat.toFixed(6));
  const longitude = Number(event.latlng.lng.toFixed(6));

  latitudeInput.value = latitude;
  longitudeInput.value = longitude;

  coordinateIndicator.textContent = `Coordenadas seleccionadas: ${latitude}, ${longitude}`;

  showTemporaryMarker(latitude, longitude);
});

// MARCADOR TEMPORAL
function showTemporaryMarker(latitude, longitude) {
  selectionLayer.clearLayers();

  const temporaryMarker = L.marker([latitude, longitude], {
    draggable: true,
  });

  temporaryMarker
    .bindPopup(
      `
      <strong>Ubicación seleccionada</strong>
      <br>
      Puedes arrastrar este marcador para ajustar la posición
    `,
    )
    .addTo(selectionLayer)
    .openPopup();

  temporaryMarker.on("dragend", function (event) {
    const position = event.target.getLatLng();
    const newLatitude = Number(position.lat.toFixed(6));
    const newLongitude = Number(position.lng.toFixed(6));
    latitudeInput.value = newLatitude;
    longitudeInput.value = newLongitude;
    coordinateIndicator.textContent = `Coordenadas ajustadas: ${newLatitude}, ${newLongitude}`;
  });
}

// FILTRADO DE INCIDENTES
function getFilteredIncidents() {
  const searchText = normalizeText(searchInput.value);
  const selectedCategory = categoryFilter.value;
  const selectedStatus = statusFilter.value;
  return incidents.filter(function (incident) {
    const searchableText = normalizeText(
      `${incident.title} ${incident.description} ${incident.category}`,
    );

    const matchesSearch = searchableText.includes(searchText);
    const matchesCategory =
      selectedCategory === "all" || incident.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || incident.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });
}

// NORMALIZAR TEXTO
function normalizeText(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// RENDERIZAR APLICACIÓN
function renderApplication() {
  const filteredIncidents = getFilteredIncidents();
  renderMapIncidents(filteredIncidents);
  renderIncidentsList(filteredIncidents);
  renderStatistics();
  updateResultsCounter(filteredIncidents.length);
}

// RENDERIZAR INCIDENTES EN EL MAPA
function renderMapIncidents(data) {
  incidentsLayer.clearLayers();

  data.forEach(function (incident) {
    const category = CATEGORY_CONFIG[incident.category];
    const point = L.circleMarker([incident.latitude, incident.longitude], {
      radius: 9,
      color: "#ffffff",
      weight: 2,
      fillColor: category.color,
      fillOpacity: 0.95,
    });

    point.bindTooltip(incident.title, {
      direction: "top",
      offset: [0, -8],
    });

    point.bindPopup(createPopupContent(incident), {
      maxWidth: 280,
    });

    point.addTo(incidentsLayer);
  });
}

// CREAR CONTENIDO DEL POPUP
function createPopupContent(incident) {
  const category = CATEGORY_CONFIG[incident.category];
  const container = document.createElement("div");
  container.className = "popup-content";
  const title = document.createElement("h3");
  title.textContent = incident.id;
  const categoryParagraph = document.createElement("p");
  categoryParagraph.innerHTML = `<strong>Categoría:</strong> ${category.label}`;
  const statusParagraph = document.createElement("p");
  statusParagraph.innerHTML = `<strong>Estado:</strong> ${formatStatus(incident.status)}`;
  const descriptionParagraph = document.createElement("p");
  descriptionParagraph.textContent = incident.description;
  const coordinatesParagraph = document.createElement("p");
  coordinatesParagraph.className = "coordinates-text";
  coordinatesParagraph.textContent = `${incident.latitude}, ${incident.longitude}`;
  const actions = document.createElement("div");
  actions.className = "popup-actions";
  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "button button-primary button-small";
  editButton.textContent = "Editar";
  editButton.addEventListener("click", function () {
    startEditingIncident(incident.id);

    map.closePopup();
  });

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "button button-danger button-small";
  deleteButton.textContent = "Eliminar";
  deleteButton.addEventListener("click", function () {
    deleteIncident(incident.id);

    map.closePopup();
  });

  actions.append(editButton, deleteButton);
  container.append(
    title,
    categoryParagraph,
    statusParagraph,
    descriptionParagraph,
    coordinatesParagraph,
    actions,
  );

  return container;
}

// RENDERIZAR LISTA DE INCIDENTES
function renderIncidentsList(data) {
  incidentList.innerHTML = "";

  emptyMessage.hidden = data.length !== 0;

  data.forEach(function (incident) {
    const category = CATEGORY_CONFIG[incident.category];
    const card = document.createElement("article");
    card.className = "incident-card";
    card.style.setProperty("--incident-color", category.color);
    const header = document.createElement("div");
    header.className = "incident-card-header";
    const title = document.createElement("h3");
    title.textContent = incident.title;
    const statusBadge = document.createElement("span");
    statusBadge.className =
      incident.status === "pendiente"
        ? "badge badge-pending"
        : "badge badge-resolved";

    statusBadge.textContent = formatStatus(incident.status);
    header.append(title, statusBadge);
    const description = document.createElement("p");
    description.className = "incident-description";
    description.textContent = incident.description;
    const meta = document.createElement("div");
    meta.className = "incident-meta";
    const categoryBadge = document.createElement("span");
    categoryBadge.className = "badge badge-category";
    categoryBadge.textContent = category.label;
    const coordinates = document.createElement("span");
    coordinates.className = "coordinates-text";
    coordinates.textContent = `${incident.latitude}, ${incident.longitude}`;
    meta.append(categoryBadge, coordinates);
    const actions = document.createElement("div");
    actions.className = "incident-actions";
    const locateButton = createActionButton(
      "Ver en Mapa",
      "button button-secondary button-small",
      function () {
        focusIncident(incident);
      },
    );

    const editButton = createActionButton(
      "Editar",
      "button button-primary button-small",
      function () {
        startEditingIncident(incident.id);
      },
    );

    const deleteButton = createActionButton(
      "Eliminar",
      "button button-danger button-small",
      function () {
        deleteIncident(incident.id);
      },
    );

    actions.append(locateButton, editButton, deleteButton);
    card.append(header, description, meta, actions);
    incidentList.appendChild(card);
  });
}

// CREAR BOTONES DE ACCIÓN
function createActionButton(text, className, callback) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = text;
  button.addEventListener("click", callback);
  return button;
}

// VALIDAR INCIDENTE
function validateIncident(data) {
  if (!data.title) {
    showFormMessage("Ingresa el nombre del incidente", "error");
    return false;
  }
  if (!data.category) {
    showFormMessage("Selecciona una categoría", "error");
    return false;
  }
  if (!data.description) {
    showFormMessage("Ingresa una descripción", "error");
    return false;
  }
  if (!data.status) {
    showFormMessage("Selecciona un estado", "error");
    return false;
  }
  if (
    latitudeInput.value === "" ||
    longitudeInput.value === "" ||
    !Number.isFinite(data.latitude) ||
    !Number.isFinite(data.longitude)
  ) {
    showFormMessage("Selecciona una ubicación válida en el mapa", "error");
    return false;
  }
  return true;
}

// ESTADÍSTICAS
function renderStatistics() {
  const total = incidents.length;
  const pending = incidents.filter(function (incident) {
    return incident.status === "pendiente";
  }).length;
  const resolved = incidents.filter(function (incident) {
    return incident.status === "atendido";
  }).length;
  statTotal.textContent = total;
  statPending.textContent = pending;
  statResolved.textContent = resolved;
}

// CONTADOR DE RESULTADOS
function updateResultsCounter(amount) {
  resultsCounter.textContent = `${amount} incidentes encontrados`;
}

// CENTRAR MAPA EN INCIDENTE
function focusIncident(incident) {
  map.setView([incident.latitude, incident.longitude], 17);
  incidentsLayer.eachLayer(function (layer) {
    const coordinates = layer.getLatLng();
    if (
      coordinates.lat === incident.latitude &&
      coordinates.lng === incident.longitude
    ) {
      layer.openPopup();
    }
  });
}

// CREAR INCIDENTE
function createIncident(data) {
  const newIncident = {
    id: generateIncidentId(),
    title: data.title,
    category: data.category,
    description: data.description,
    status: data.status,
    latitude: data.latitude,
    longitude: data.longitude,
    createdAt: getCurrentDate(),
  };
  incidents.push(newIncident);
  renderApplication();
  resetForm();
  showFormMessage("Incidente registrado correctamente", "success");
  focusIncident(newIncident);
}

function generateIncidentId() {
  const dateString = getCurrentDate(); // "2026-09-30"
  const randomNumber = Math.floor(Math.random() * 900) + 100;

  return `INC-${dateString}-${randomNumber}`;
}

// OBTENER FECHA ACTUAL
function getCurrentDate() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

// INICIAR EDICIÓN
function startEditingIncident(id) {
  const incident = incidents.find(function (incident) {
    return incident.id === id;
  });

  if (!incident) {
    showFormMessage("No se encontró el incidente", "error");
    return;
  }
  incidentIdInput.value = incident.id;
  titleInput.value = incident.title;
  categoryInput.value = incident.category;
  descriptionInput.value = incident.description;
  statusInput.value = incident.status;
  latitudeInput.value = incident.latitude;
  longitudeInput.value = incident.longitude;

  formTitle.textContent = "Editar incidente";
  formModeBadge.textContent = "Modo edición";
  saveButton.textContent = "Actualizar incidente";
  cancelButton.hidden = false;
  coordinateIndicator.textContent = `Coordenadas seleccionadas: ${incident.latitude}, ${incident.longitude}`;
  showTemporaryMarker(incident.latitude, incident.longitude);
  map.setView([incident.latitude, incident.longitude], 16);
}

// ACTUALIZAR INCIDENTE
function updateIncident(id, changes) {
  const incident = incidents.find(function (incident) {
    return incident.id === id;
  });
  if (!incident) {
    showFormMessage("No se encontró el incidente", "error");
    return;
  }
  incident.title = changes.title;
  incident.category = changes.category;
  incident.description = changes.description;
  incident.status = changes.status;
  incident.latitude = changes.latitude;
  incident.longitude = changes.longitude;
  renderApplication();
  resetForm();
  showFormMessage("Incidente actualizado correctamente", "success");
  focusIncident(incident);
}

// ELIMINAR INCIDENTE
function deleteIncident(id) {
  const incident = incidents.find(function (incident) {
    return incident.id === id;
  });
  if (!incident) {
    showFormMessage("No se encontró el incidente", "error");
    return;
  }
  const confirmed = confirm(`¿Seguro que deseas eliminar "${incident.title}"?`);
  if (!confirmed) {
    return;
  }
  incidents = incidents.filter(function (incident) {
    return incident.id !== id;
  });
  renderApplication();
  resetForm();
  showFormMessage("Incidente eliminado correctamente", "success");
}

// RESTABLECER FORMULARIO
function resetForm() {
  incidentForm.reset();
  incidentIdInput.value = "";
  formTitle.textContent = "Registrar incidente";
  formModeBadge.textContent = "Modo registro";
  saveButton.textContent = "Guardar incidente";
  cancelButton.hidden = true;
  coordinateIndicator.textContent = "Selecciona una ubicación en el mapa";
  selectionLayer.clearLayers();
}

// MENSAJES DEL FORMULARIO
function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = "form-message";
  if (type === "success") {
    formMessage.classList.add("form-message-success");
  }
  if (type === "error") {
    formMessage.classList.add("form-message-error");
  }
  formMessage.hidden = false;
}

function hideFormMessage() {
  formMessage.hidden = true;
  formMessage.textContent = "";
}

// FORMATEAR ESTADO
function formatStatus(status) {
  if (status === "pendiente") {
    return "Pendiente";
  }
  if (status === "atendido") {
    return "Atendido";
  }
  return status;
}

// EVENTO DEL FORMULARIO
incidentForm.addEventListener("submit", function (event) {
  event.preventDefault();
  hideFormMessage();
  const data = {
    title: titleInput.value.trim(),
    category: categoryInput.value,
    description: descriptionInput.value.trim(),
    status: statusInput.value,
    latitude: Number(latitudeInput.value),
    longitude: Number(longitudeInput.value),
  };
  if (!validateIncident(data)) {
    return;
  }
  const incidentId = incidentIdInput.value;
  if (incidentId) {
    updateIncident(incidentId, data);
  } else {
    createIncident(data);
  }
});

// CANCELAR EDICIÓN
cancelButton.addEventListener("click", function () {
  resetForm();
  hideFormMessage();
});

// BUSCADOR
searchInput.addEventListener("input", function () {
  renderApplication();
});

// FILTRO POR CATEGORÍA
categoryFilter.addEventListener("change", function () {
  renderApplication();
});

// FILTRO POR ESTADO
statusFilter.addEventListener("change", function () {
  renderApplication();
});

// AJUSTAR MAPA A LOS INCIDENTES
fitMapButton.addEventListener("click", function () {
  const filteredIncidents = getFilteredIncidents();
  if (filteredIncidents.length === 0) {
    return;
  }
  const bounds = L.latLngBounds(
    filteredIncidents.map(function (incident) {
      return [incident.latitude, incident.longitude];
    }),
  );
  map.fitBounds(bounds, {
    padding: [30, 30],
  });
});

// INICIALIZAR APLICACIÓN
renderApplication();
