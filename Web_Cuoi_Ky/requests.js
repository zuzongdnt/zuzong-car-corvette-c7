(() => {
  // studio-data.js
  var cars = [
    { id: "corvette", brand: "Chevrolet", name: "Corvette C7", series: "STINGRAY / C7", price: 45e8, text: "D\xE1ng th\u1EA5p, vai r\u1ED9ng v\xE0 nh\u1EEFng \u0111\u01B0\u1EDDng g\xE2n d\u1EE9t kho\xE1t. M\u1ED9t d\u1EA5u \u1EA5n \u0111\u1EADm ch\u1EA5t M\u1EF9.", engine: "V8 6.2L", layout: "Coup\xE9 th\u1EC3 thao", character: "M\u1EA1nh m\u1EBD \xB7 S\u1EAFc c\u1EA1nh" },
    { id: "bmw", brand: "BMW", name: "M4 G82 Coup\xE9", series: "M4 COUP\xC9 / G82", price: 55e8, text: "T\u1EC9 l\u1EC7 coup\xE9 th\u1EC3 thao c\xF9ng l\u01B0\u1EDBi t\u1EA3n nhi\u1EC7t \u0111\u1EB7c tr\u01B0ng. C\xE1 t\xEDnh hi\u1EC7n di\u1EC7n t\u1EEB m\u1ECDi g\xF3c nh\xECn.", engine: "I6 3.0L t\u0103ng \xE1p", layout: "Coup\xE9 th\u1EC3 thao", character: "Hi\u1EC7n \u0111\u1EA1i \xB7 T\xE1o b\u1EA1o" },
    { id: "porsche", brand: "Porsche", name: "911 GT3 (992)", series: "911 GT3 / 992", price: 15e9, text: "\u0110\u01B0\u1EDDng cong quen thu\u1ED9c c\u1EE7a 911, k\u1EBFt h\u1EE3p tinh th\u1EA7n \u0111\u01B0\u1EDDng \u0111ua v\xE0 c\xE1nh gi\xF3 n\u1ED5i b\u1EADt.", engine: "Boxer 6 4.0L", layout: "Coup\xE9 th\u1EC3 thao", character: "Tinh g\u1ECDn \xB7 Ch\xEDnh x\xE1c" },
    { id: "mercedes", brand: "Mercedes-Benz", name: "AMG SL63", series: "AMG / SL63", price: 12e9, text: "Mui tr\u1EA7n thanh l\u1ECBch, n\u1ED9i th\u1EA5t s\xE1ng v\xE0 nh\u1EEFng chi ti\u1EBFt AMG. Th\u1EC3 thao theo c\xE1ch ri\xEAng.", engine: "V8 4.0L t\u0103ng \xE1p", layout: "Roadster", character: "Thanh l\u1ECBch \xB7 Uy l\u1EF1c" },
    { id: "lamborghini", brand: "Lamborghini", name: "Revuelto", series: "REVUELTO / V12", price: 44e9, text: "\u0110\u01B0\u1EDDng n\xE9t g\xF3c c\u1EA1nh, d\xE1ng n\xEAm th\u1EA5p v\xE0 ch\u1EEF k\xFD \xE1nh s\xE1ng kh\xE1c bi\u1EC7t. M\u1ED9t h\xECnh dung t\xE1o b\u1EA1o v\u1EC1 t\u1ED1c \u0111\u1ED9.", engine: "V12 hybrid 6.5L", layout: "Si\xEAu xe hybrid", character: "T\u01B0\u01A1ng lai \xB7 Quy\u1EBFt li\u1EC7t" }
  ];
  var palettes = {
    body: [
      { id: "obsidian", name: "\u0110en Obsidian", hex: "#111216", surcharge: 0 },
      { id: "pearl", name: "Tr\u1EAFng Pearl", hex: "#e7e7e2", surcharge: 18e7 },
      { id: "racing", name: "\u0110\u1ECF Racing", hex: "#ad101c", surcharge: 28e7 },
      { id: "velocity", name: "Xanh Velocity", hex: "#164ea1", surcharge: 65e7, limited: true },
      { id: "satin", name: "B\u1EA1c Satin", hex: "#9298a1", surcharge: 42e7 },
      { id: "shark-blue", name: "Shark Blue", hex: "#1878d3", surcharge: 65e7, car: "porsche" },
      { id: "verde-scandal", name: "Verde Scandal", hex: "#b4e62e", surcharge: 85e7, car: "lamborghini" }
    ],
    calipers: [{ id: "red", name: "\u0110\u1ECF Racing", hex: "#cc1826" }, { id: "yellow", name: "V\xE0ng Sport", hex: "#f3b718" }, { id: "blue", name: "Xanh Cobalt", hex: "#1762c5" }, { id: "silver", name: "B\u1EA1c Titanium", hex: "#aeb3bb" }, { id: "black", name: "\u0110en Graphite", hex: "#202228" }],
    rims: [
      { id: "silver", name: "B\u1EA1c Titanium", hex: "#aeb3bb" },
      { id: "black", name: "\u0110en Graphite", hex: "#202228" },
      { id: "bronze", name: "\u0110\u1ED3ng Bronze", hex: "#a47d4b" },
      { id: "white", name: "Tr\u1EAFng Ceramic", hex: "#e7e7e2" },
      { id: "satin-neodyme", name: "GT3 Wheels Satin Neodyme", hex: "#aa936a", surcharge: 22e7, car: "porsche" },
      { id: "altanero-black", name: "Altanero Shiny Black", hex: "#15161a", surcharge: 35e7, car: "lamborghini" }
    ]
  };
  var labels = { body: "M\xE0u s\u01A1n", calipers: "Heo phanh", rims: "M\xE2m xe" };
  var equipmentLabels = { interior: "N\u1ED9i th\u1EA5t", carbon: "G\xF3i carbon / phanh" };
  var equipment = {
    porsche: {
      interior: [{ id: "black-leather-alcantara-blue", name: "Leather/Alcantara \u0111en, ch\u1EC9 kh\xE2u xanh", surcharge: 18e7 }],
      carbon: [{ id: "carbon-pccb", name: "G\xF3i carbon + phanh g\u1ED1m PCCB", surcharge: 72e7 }]
    },
    lamborghini: {
      carbon: [{ id: "full-carbon", name: "G\xF3i kh\xED \u0111\u1ED9ng h\u1ECDc Full Carbon", surcharge: 16e8 }]
    }
  };
  var colorsFor = (car, part) => palettes[part].filter((choice) => !choice.car || choice.car === car);
  var equipmentFor = (car, part) => equipment[car]?.[part] || [];
  var equipmentChoice = (config, part) => equipmentFor(config.car, part).find((choice) => choice.id === config[part]);
  var getCar = (id) => cars.find((car) => car.id === id) || cars[0];
  function cleanConfig(raw = {}) {
    if (!raw || typeof raw !== "object") raw = {};
    const value = { car: getCar(raw.car).id };
    for (const part of Object.keys(palettes)) {
      const options = colorsFor(value.car, part);
      value[part] = options.some((choice) => choice.id === raw[part]) ? raw[part] : options[0].id;
    }
    for (const part of Object.keys(equipmentLabels)) {
      if (equipmentFor(value.car, part).some((choice) => choice.id === raw[part])) value[part] = raw[part];
    }
    return value;
  }
  var colorOf = (config, part) => colorsFor(config.car, part).find((choice) => choice.id === config[part]) || palettes[part][0];
  function readStore(key, fallback = []) {
    try {
      const v = JSON.parse(localStorage.getItem("zuzong." + key));
      return v ?? fallback;
    } catch {
      return fallback;
    }
  }
  function writeStore(key, value) {
    try {
      localStorage.setItem("zuzong." + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }
  function configText(config) {
    const colors = Object.keys(labels).map((part) => {
      const color = colorOf(config, part);
      return `${labels[part]}: ${color.name}${part === "body" && color.limited ? " (gi\u1EDBi h\u1EA1n)" : ""}`;
    });
    const extras = Object.entries(equipmentLabels).flatMap(([part, label]) => {
      const choice = equipmentChoice(config, part);
      return choice ? [`${label}: ${choice.name}`] : [];
    });
    return [...colors, ...extras].join(" \xB7 ");
  }

  // requests.src.js
  var stores = ["requests", "consultations"];
  var pending = "Ch\u1EDD t\u01B0 v\u1EA5n";
  var cancelled = "\u0110\xE3 h\u1EE7y";
  var list = document.querySelector("[data-list]");
  var search = document.querySelector("[data-search]");
  var filter = document.querySelector("[data-filter]");
  var dialog = document.querySelector(".request-dialog");
  var content = dialog.querySelector("[data-detail]");
  var feedback = document.querySelector("[data-status]");
  var records = [];
  var openKey = "";
  var escape = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
  var timeZone = "Asia/Ho_Chi_Minh";
  var dateFormat = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short", timeZone });
  var dayFormat = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeZone });
  function formatDate(value, format = dateFormat) {
    const date = new Date(value || NaN);
    return Number.isFinite(date.getTime()) ? format.format(date) : "Ch\u01B0a c\xF3 th\xF4ng tin";
  }
  function items(store) {
    const value = readStore(store, []);
    return Array.isArray(value) ? value : [];
  }
  var keyOf = (store, id) => store + ":" + id;
  var statusOf = (request) => request.status || pending;
  var normalize = (value) => String(value).toLocaleLowerCase("vi").normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/đ/g, "d");
  var nameOf = (car) => car.id === "mercedes" ? "Mercedes-AMG SL 63" : car.brand + " " + car.name;
  function photoOf(car) { return ({corvette: "assets/editorial/user-corvette.jpg", bmw: "assets/editorial/user-bmw-m4-g82.jpg", porsche: "assets/editorial/user-porsche-911-gt3.jpg", mercedes: "assets/editorial/user-mercedes-amg-sl63.jpg", lamborghini: "assets/editorial/user-revuelto.jpg"})[car] || "assets/studio/" + car + "-hero.webp"; }
  function carsOf(request) {
    const configs = Array.isArray(request.configs) ? request.configs : [];
    return configs.filter((config) => config?.car).map((config) => { const car = getCar(config.car); return { id: car.id, image: photoOf(car.id), name: nameOf(car), spec: configText(cleanConfig(config)) }; });
  }
  function recordOf(store, request) {
    const cars2 = carsOf(request);
    const hasConfiguration = cars2.length > 0;
    const car = request.car || (request.note === "Porsche 911 GT3 \xB7 B\xE0i vi\u1EBFt \u0111\xE1nh gi\xE1" ? "porsche" : "");
    if (!hasConfiguration && car) cars2.push({ id: getCar(car).id, image: photoOf(getCar(car).id), name: nameOf(getCar(car)), spec: "" });
    const status = statusOf(request);
    const type = request.intent === "testdrive" ? "H\u1EB9n l\xE1i th\u1EED" : request.note === "Y\xEAu c\u1EA7u b\xE1o gi\xE1 VIP t\u1EEB Garage" ? "B\xE1o gi\xE1 VIP" : store === "requests" && hasConfiguration ? "\u0110\u1EB7t tr\u01B0\u1EDBc" : "T\u01B0 v\u1EA5n";
    return { store, key: keyOf(store, request.id), request, cars: cars2, status, type };
  }
  function render() {
    records = stores.flatMap((store) => items(store).filter((request) => request && typeof request === "object" && request.id != null).map((request) => recordOf(store, request))).sort((a, b) => (Date.parse(b.request.created) || 0) - (Date.parse(a.request.created) || 0));
    document.querySelector("[data-total]").textContent = records.length;
    document.querySelector("[data-pending]").textContent = records.filter((record) => record.status === pending).length;
    document.querySelector("[data-cancelled]").textContent = records.filter((record) => record.status === cancelled).length;
    document.querySelector("[data-empty]").hidden = records.length > 0;
    document.querySelector("[data-history]").hidden = records.length === 0;
    renderList();
  }
  function renderList() {
    const query = normalize(search.value.trim());
    const visible = records.filter((record) => {
      const matchesStatus = filter.value === "all" || record.status === (filter.value === "pending" ? pending : cancelled);
      const searchable = [record.request.id, record.type, ...record.cars.map((car) => car.name)].join(" ");
      return matchesStatus && normalize(searchable).includes(query);
    });
    document.querySelector("[data-no-results]").hidden = visible.length > 0;
    list.innerHTML = visible.map(({ key, request, type, cars: cars2, status }) => `
    <article class="request-card">
<<<<<<< HEAD
      <div class="request-card-content">
        <div class="request-card-header">
          <span class="request-type-badge">${escape(type)}</span>
          <span class="request-status-pill ${status === pending ? 'is-pending' : 'is-cancelled'}">● ${escape(status)}</span>
        </div>
        <h2 class="request-card-title">${escape(cars2.map((car) => car.name).join(" · ") || "Yêu cầu tư vấn")}</h2>
        <div class="request-card-meta">
          <span class="request-id-badge">${escape(request.id)}</span>
          <span class="request-date">Ngày tạo: ${formatDate(request.created)}</span>
          ${request.name ? `<span class="request-client">Khách: <strong>${escape(request.name)}</strong></span>` : ''}
        </div>
=======
      <div>
        <p class="garage-kicker">${escape(type)}</p>
        <h2>${escape(cars2.map((car) => car.name).join(" \xB7 ") || "Y\xEAu c\u1EA7u t\u01B0 v\u1EA5n")}</h2>
        <p class="garage-note">${escape(request.id)} \xB7 ${formatDate(request.created)}</p>
        <div class="request-meta"><span class="request-status">${escape(status)}</span></div>
        ${cars2.length ? `<div class="request-car-previews">${cars2.map(car => `<figure><img src="${escape(car.image)}" alt="${escape(car.name)}" loading="lazy"><figcaption>${escape(car.name)}</figcaption></figure>`).join("")}</div>` : ""}
>>>>>>> 2e77d95ccd7e88204618b69e7d364c5bb77b68e2
      </div>
      <button class="garage-button garage-primary request-open-btn" type="button" data-open="${escape(key)}" aria-label="Xem chi tiết ${escape(request.id)}">
        <span>Xem chi tiết</span>
        <span aria-hidden="true">↗</span>
      </button>
    </article>`).join("");
  }
  function showDetail(record) {
    const { request, status, cars: cars2, type } = record;
    const fields = [
      ["Mã yêu cầu", request.id],
      ["Trạng thái", status],
      ["Loại yêu cầu", type],
      ["Ngày tạo", formatDate(request.created)],
      ["Họ và tên", request.name],
      ["Email", request.email],
      ["Số điện thoại", request.phone],
      ["Ngày mong muốn", request.date ? formatDate(request.date, dayFormat) : ""],
      ["Ngày hủy", request.cancelledAt ? formatDate(request.cancelledAt) : ""]
    ].filter(([, value]) => value);
    dialog.querySelector("h2").textContent = "Chi tiết yêu cầu — " + escape(request.id);
    content.innerHTML = `
    <div class="request-detail-sheet">
      <div class="request-detail-badge-row">
        <span class="request-type-badge">${escape(type)}</span>
        <span class="request-status-pill ${status === pending ? 'is-pending' : 'is-cancelled'}">● ${escape(status)}</span>
      </div>
      <dl class="request-fields">${fields.map(([label, value]) => `<div><dt>${label}</dt><dd>${escape(value)}</dd></div>`).join("")}</dl>
      ${cars2.length ? `
      <div class="request-detail-cars-section">
        <h3>Thông tin cấu hình siêu xe</h3>
        <ul class="request-specs" aria-label="Xe và cấu hình">${cars2.map((car) => `
          <li>
            <strong>${escape(car.name)}</strong>
            ${car.spec ? `<p class="garage-note">${escape(car.spec)}</p>` : ""}
          </li>`).join("")}
        </ul>
      </div>` : ""}
      ${request.note ? `
      <div class="request-detail-note-section">
        <small>Ghi chú của khách hàng</small>
        <p>${escape(request.note)}</p>
      </div>` : ""}
      ${status === pending ? '<div class="request-detail-actions"><button class="garage-button request-cancel-btn" type="button" data-cancel>Hủy yêu cầu này ×</button></div>' : ""}
    </div>`;
    if (!dialog.open) dialog.showModal();
  }
  function cancelRequest(record) {
    const latest = items(record.store);
    const index = latest.findIndex((request) => request && keyOf(record.store, request.id) === record.key);
    if (index < 0 || statusOf(latest[index]) !== pending) {
      dialog.close();
      render();
      feedback.textContent = "Y\xEAu c\u1EA7u v\u1EEBa thay \u0111\u1ED5i. Danh s\xE1ch \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt.";
      return;
    }
    latest[index] = { ...latest[index], status: cancelled, cancelledAt: (/* @__PURE__ */ new Date()).toISOString() };
    if (!writeStore(record.store, latest)) {
      content.querySelector("[data-cancel-error]").textContent = "Ch\u01B0a l\u01B0u \u0111\u01B0\u1EE3c tr\u1EA1ng th\xE1i h\u1EE7y. Vui l\xF2ng th\u1EED l\u1EA1i.";
      return;
    }
    dialog.close();
    render();
    feedback.textContent = "\u0110\xE3 h\u1EE7y y\xEAu c\u1EA7u " + record.request.id + ".";
    const trigger = [...list.querySelectorAll("[data-open]")].find((button) => button.dataset.open === record.key);
    (trigger ?? filter).focus({ preventScroll: true });
  }
  list.addEventListener("click", (event) => {
    const key = event.target.closest("[data-open]")?.dataset.open;
    const record = records.find((item) => item.key === key);
    if (!record) return;
    openKey = key;
    showDetail(record);
  });
  content.addEventListener("click", (event) => {
    const record = records.find((item) => item.key === openKey);
    if (!record) return;
    if (event.target.closest("[data-cancel]")) {
      dialog.querySelector("h2").textContent = "H\u1EE7y y\xEAu c\u1EA7u n\xE0y?";
      content.innerHTML = `<p>Y\xEAu c\u1EA7u <strong>${escape(record.request.id)}</strong> s\u1EBD chuy\u1EC3n sang tr\u1EA1ng th\xE1i \u0110\xE3 h\u1EE7y v\xE0 v\u1EABn xu\u1EA5t hi\u1EC7n trong l\u1ECBch s\u1EED.</p>
      <p class="garage-status" role="status" data-cancel-error></p>
      <button class="garage-button" type="button" data-back>Quay l\u1EA1i</button>
      <button class="garage-button garage-primary" type="button" data-confirm-cancel>X\xE1c nh\u1EADn h\u1EE7y</button>`;
      content.querySelector("[data-back]").focus();
    }
    if (event.target.closest("[data-back]")) {
      showDetail(record);
      content.querySelector("[data-cancel]")?.focus();
    }
    if (event.target.closest("[data-confirm-cancel]")) cancelRequest(record);
  });
  dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());
  search.addEventListener("input", renderList);
  filter.addEventListener("change", renderList);
  window.addEventListener("storage", (event) => {
    if (event.key !== null && !stores.some((store) => event.key === "zuzong." + store)) return;
    render();
    if (dialog.open) {
      const record = records.find((item) => item.key === openKey);
      if (record) showDetail(record);
      else dialog.close();
    }
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) render();
  });
  render();
})();
