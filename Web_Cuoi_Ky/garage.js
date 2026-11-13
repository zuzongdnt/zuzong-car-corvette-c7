(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

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
      { id: "british", name: "Xanh British", hex: "#164537", surcharge: 45e7 },
      { id: "yellow", name: "V\xE0ng Competition", hex: "#c99c16", surcharge: 36e7 },
      { id: "lava", name: "Cam Lava", hex: "#df541f", surcharge: 42e7 },
      { id: "violet", name: "T\xEDm Violet", hex: "#5c4a8e", surcharge: 38e7 },
      { id: "shark-blue", name: "Shark Blue", hex: "#1878d3", surcharge: 65e7, car: "porsche" },
      { id: "verde-scandal", name: "Verde Scandal", hex: "#b4e62e", surcharge: 85e7, car: "lamborghini" }
    ],
    calipers: [{ id: "red", name: "\u0110\u1ECF Racing", hex: "#cc1826" }, { id: "yellow", name: "V\xE0ng Sport", hex: "#f3b718" }, { id: "blue", name: "Xanh Cobalt", hex: "#1762c5" }, { id: "silver", name: "B\u1EA1c Titanium", hex: "#aeb3bb" }, { id: "black", name: "\u0110en Graphite", hex: "#202228" }, { id: "orange", name: "Cam Competition", hex: "#ec6a21" }, { id: "white", name: "Tr\u1EAFng Ceramic", hex: "#f0eee7" }, { id: "green", name: "Xanh Emerald", hex: "#188052" }],
    rims: [
      { id: "silver", name: "B\u1EA1c Titanium", hex: "#aeb3bb" },
      { id: "black", name: "\u0110en Graphite", hex: "#202228" },
      { id: "bronze", name: "\u0110\u1ED3ng Bronze", hex: "#a47d4b" },
      { id: "white", name: "Tr\u1EAFng Ceramic", hex: "#e7e7e2" },
      { id: "gunmetal", name: "X\xE1m Gunmetal", hex: "#555c63" },
      { id: "gold", name: "V\xE0ng Champagne", hex: "#c5a268" },
      { id: "blue", name: "Xanh Cobalt", hex: "#1762c5" },
      { id: "satin-neodyme", name: "GT3 Wheels Satin Neodyme", hex: "#aa936a", surcharge: 22e7, car: "porsche" },
      { id: "altanero-black", name: "Altanero Shiny Black", hex: "#15161a", surcharge: 35e7, car: "lamborghini" }
    ]
  };
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
  var money = (value) => new Intl.NumberFormat("vi-VN").format(value) + " \u0111";
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
  function configurationPrice(raw = {}) {
    const config = cleanConfig(raw);
    const colors = Object.keys(palettes).reduce((total, part) => total + (colorOf(config, part).surcharge || 0), 0);
    const extras = Object.keys(equipmentLabels).reduce((total, part) => total + (equipmentChoice(config, part)?.surcharge || 0), 0);
    return getCar(config.car).price + colors + extras;
  }
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
  var poster = (car, angle = "hero") => car === "bmw" && angle === "side" ? "assets/gallery-real-v2/bmw-side-full-car.jpg" : `assets/gallery-real-v1/${car}-${angle}-real-v1.webp`;

  // garage.src.js
  var samples = [
    { id: "GT3-SHARK-01", car: "porsche", body: "shark-blue", rims: "satin-neodyme", calipers: "yellow", interior: "black-leather-alcantara-blue", carbon: "carbon-pccb" },
    { id: "REV-VERDE-02", car: "lamborghini", body: "verde-scandal", rims: "altanero-black", calipers: "black", carbon: "full-carbon" }
  ];
  var gallery = document.querySelector("[data-gallery]");
  var empty = document.querySelector("[data-empty]");
  var actionPanel = document.querySelector("[data-actions]");
  var status = document.querySelector("[data-status]");
  var selectionLabel = document.querySelector("[data-selection-label]");
  var dialog = document.querySelector(".garage-dialog");
  var dialogContent = dialog.querySelector("[data-dialog-content]");
  var reduced = matchMedia("(prefers-reduced-motion: reduce)");
  var localFile = location.protocol === "file:";
  var selected = /* @__PURE__ */ new Set();
  var escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  var list = (key) => {
    const value = readStore(key, []);
    return Array.isArray(value) ? value : [];
  };
  var savedItems = () => list("saved").filter((item) => item && typeof item === "object" && item.id != null);
  var carName = (config) => {
    const car = getCar(config.car);
    return car.id === "mercedes" ? "Mercedes-AMG SL 63" : car.brand + " " + car.name;
  };
  var specs = (config) => [
    ["M\xE0u s\u01A1n", colorOf(config, "body").name],
    ["M\xE2m xe", colorOf(config, "rims").name],
    ["Heo phanh", colorOf(config, "calipers").name],
    ["N\u1ED9i th\u1EA5t", equipmentChoice(config, "interior")?.name ?? "Ti\xEAu chu\u1EA9n"],
    ["G\xF3i carbon / phanh", equipmentChoice(config, "carbon")?.name ?? "Ti\xEAu chu\u1EA9n"]
  ];
  var observer = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.filter((entry) => entry.isIntersecting).forEach(({ target }) => {
      if (!reduced.matches) target.classList.add("garage-revealed");
      observer.unobserve(target);
    });
  }, { threshold: 0.16 }) : null;
  function updateActions() {
    const count = selected.size;
    selectionLabel.textContent = count ? "\u0110\xE3 ch\u1ECDn " + count + " b\u1EA3n ph\u1ED1i." : "Ch\u1ECDn m\u1ED9t b\u1EA3n ph\u1ED1i \u0111\u1EC3 thao t\xE1c. Ch\u1ECDn t\u1EEB hai b\u1EA3n ph\u1ED1i \u0111\u1EC3 so s\xE1nh.";
    actionPanel.querySelectorAll("[data-action]").forEach((button) => {
      const action = button.dataset.action;
      button.disabled = action === "compare" ? count < 2 : action === "quote" ? count === 0 : count !== 1;
    });
  }
  function render(items = savedItems()) {
    const ids = new Set(items.map((item) => String(item.id)));
    selected.forEach((id) => {
      if (!ids.has(id)) selected.delete(id);
    });
    const user = readStore("user", null);
    document.querySelector("[data-greeting]").textContent = user?.name ? "Xin ch\xE0o, " + user.name : "Garage c\u1EE7a b\u1EA1n";
    document.querySelector("[data-count]").textContent = items.length;
    document.querySelector("[data-budget]").textContent = money(items.reduce((sum, item) => sum + configurationPrice(item), 0));
    actionPanel.hidden = !items.length;
    document.querySelector("[data-create-more]").hidden = !items.length;
    empty.hidden = Boolean(items.length);
    observer?.disconnect();
    gallery.innerHTML = items.map((item) => {
      const config = cleanConfig(item);
      const id = escape(item.id);
      const name = carName(config);
      return `
      <article class="garage-card" data-card="${id}">
        <div class="garage-photo">
          <img src="${poster(config.car)}" alt="${name}, \u1EA3nh Studio tham kh\u1EA3o" loading="lazy" decoding="async">
          <img src="${poster(config.car, "side")}" alt="" loading="lazy" decoding="async">
        </div>
        <div class="garage-card-body">
          <p class="garage-kicker">Config ID \xB7 ${id}</p>
          <h2>${name}</h2>
          <dl class="grid gap-3 sm:grid-cols-2">
            ${specs(config).map(([label, value], index) => `<div><dt>${label}</dt><dd>${index === 0 ? `<span class="garage-chip" style="--paint:${colorOf(config, "body").hex}" aria-hidden="true"></span>` : ""}${value}</dd></div>`).join("")}
          </dl>
          <p class="garage-price">${money(configurationPrice(config))}</p>
          <p class="garage-note">\u1EA2nh Studio tham kh\u1EA3o${localFile ? "" : " \xB7 M\u1EDF b\u1EA3n ph\u1ED1i 3D \u0111\u1EC3 xem m\xE0u \u0111\xE3 ch\u1ECDn"}.</p>
          <div class="garage-card-actions flex flex-wrap gap-2">
            <label><input type="checkbox" value="${id}" ${selected.has(String(item.id)) ? "checked" : ""} aria-label="Ch\u1ECDn ${name}, m\xE3 ${id}"> Ch\u1ECDn</label>
            <button class="garage-button" type="button" data-preview="${id}">${localFile ? "Xem \u1EA3nh xe" : "Xem b\u1EA3n ph\u1ED1i 3D"}</button>
            <button class="garage-button" type="button" data-edit="${id}">Ch\u1EC9nh s\u1EEDa</button>
            <button class="garage-button" type="button" data-remove="${id}">X\xF3a</button>
          </div>
        </div>
      </article>`;
    }).join("");
    [...gallery.children].forEach((card) => observer?.observe(card));
    updateActions();
  }
  function openDialog(title, content) {
    dialog.querySelector("h2").textContent = title;
    dialogContent.innerHTML = content;
    dialog.showModal();
  }
  dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());
  function configurationForm(item) {
    const config = cleanConfig(item);
    const carField = item ? `<input type="hidden" name="car" value="${config.car}">` : `<label>D\xF2ng xe<select name="car">${cars.map((car) => `<option value="${car.id}">${carName({ car: car.id })}</option>`).join("")}</select></label>`;
    openDialog(item ? "Ch\u1EC9nh s\u1EEDa " + carName(config) : "T\u1EA1o b\u1EA3n ph\u1ED1i", `
    <form class="garage-form">
      ${carField}<div class="garage-form" data-options></div>
      <p>Chi ph\xED d\u1EF1 t\xEDnh \xB7 <strong data-estimate></strong></p>
      <p class="garage-note" role="status" data-form-status></p>
      <button class="garage-button garage-primary" type="submit">L\u01B0u c\u1EA5u h\xECnh</button>
    </form>`);
    const form = dialogContent.querySelector("form");
    const options = form.querySelector("[data-options]");
    const estimate = form.querySelector("[data-estimate]");
    const readConfig = () => cleanConfig(Object.fromEntries(new FormData(form)));
    const field = (part, label, choices, value) => `<label>${label}<select name="${part}">
    ${choices.map((choice) => `<option value="${choice.id}"${choice.id === value ? " selected" : ""}>${choice.name}</option>`).join("")}
  </select></label>`;
    function updateOptions(current) {
      const colors = [["body", "M\xE0u s\u01A1n"], ["rims", "M\xE2m xe"], ["calipers", "Heo phanh"]];
      const equipment2 = [["interior", "N\u1ED9i th\u1EA5t"], ["carbon", "G\xF3i carbon / phanh"]];
      const colorFields = colors.map(([part, label]) => field(part, label, colorsFor(current.car, part), current[part]));
      const equipmentFields = equipment2.flatMap(([part, label]) => {
        const choices = equipmentFor(current.car, part);
        return choices.length ? [field(part, label, [{ id: "", name: "Ti\xEAu chu\u1EA9n" }, ...choices], current[part])] : [];
      });
      options.innerHTML = [...colorFields, ...equipmentFields].join("");
    }
    form.elements.car.value = config.car;
    updateOptions(config);
    estimate.textContent = money(configurationPrice(config));
    form.addEventListener("change", (event) => {
      if (event.target === form.elements.car) updateOptions(readConfig());
      estimate.textContent = money(configurationPrice(readConfig()));
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const items = savedItems();
      const id = item?.id ?? crypto.randomUUID();
      const index = item ? items.findIndex((entry) => String(entry.id) === String(id)) : -1;
      const feedback = form.querySelector("[data-form-status]");
      if (item && index < 0) {
        feedback.textContent = "B\u1EA3n ph\u1ED1i n\xE0y \u0111\xE3 b\u1ECB x\xF3a kh\u1ECFi Garage.";
        return;
      }
      const updated = { ...readConfig(), id };
      if (item) items[index] = updated;
      else items.unshift(updated);
      if (!writeStore("saved", items)) {
        feedback.textContent = "Ch\u01B0a l\u01B0u \u0111\u01B0\u1EE3c b\u1EA3n ph\u1ED1i. Vui l\xF2ng th\u1EED l\u1EA1i.";
        return;
      }
      dialog.close();
      render(items);
      status.textContent = item ? "\u0110\xE3 c\u1EADp nh\u1EADt b\u1EA3n ph\u1ED1i." : "\u0110\xE3 l\u01B0u b\u1EA3n ph\u1ED1i m\u1EDBi.";
      [...gallery.children].find((card) => card.dataset.card === String(id))?.querySelector("[data-edit]").focus();
    });
  }
  if (localFile) {
    document.querySelectorAll("[data-create]").forEach((link) => {
      if (link.textContent === "Studio 3D") link.textContent = "T\u1EA1o c\u1EA5u h\xECnh";
      link.addEventListener("click", (event) => {
        event.preventDefault();
        configurationForm();
      });
    });
  }
  async function edit(id, card) {
    const config = savedItems().find((item) => String(item.id) === id);
    if (!config) {
      render();
      return;
    }
    if (localFile) {
      configurationForm(config);
      return;
    }
    if (card && !reduced.matches) {
      card.classList.add("garage-exit");
      await Promise.allSettled(card.getAnimations().map((animation) => animation.finished));
    }
    location.href = "products.html?" + new URLSearchParams({ ...cleanConfig(config), saved: id }) + "#products-studio";
  }
  async function preview(id) {
    const item = savedItems().find((entry) => String(entry.id) === id);
    if (!item) {
      render();
      return;
    }
    const config = cleanConfig(item);
    const fallback = `<img class="garage-model-photo" src="${poster(config.car)}" alt="\u1EA2nh Studio tham kh\u1EA3o"><p>M\u1EDF Garage qua npm start \u0111\u1EC3 xoay b\u1EA3n ph\u1ED1i 3D.</p>`;
    openDialog(carName(config), fallback);
    if (localFile) return;
    const loading = document.createElement("p");
    loading.textContent = "\u0110ang t\u1EA3i b\u1EA3n ph\u1ED1i 3D\u2026";
    dialogContent.replaceChildren(loading);
    try {
      await import("./assets/vendor/model-viewer/model-viewer.min.js");
      if (!dialog.open || !loading.isConnected) return;
      const model = document.createElement("model-viewer");
      model.alt = carName(config) + ", m\xE0u " + colorOf(config, "body").name;
      model.setAttribute("camera-controls", "");
      model.setAttribute("touch-action", "pan-y");
      model.addEventListener("load", () => {
        for (const part of ["body", "calipers", "rims"]) {
          const color = colorOf(config, part);
          model.model.materials.filter((material) => material.name.startsWith("ZUZONG_" + part + " |")).forEach((material) => {
            material.pbrMetallicRoughness.setBaseColorFactor(color.hex);
          });
        }
      }, { once: true });
      model.addEventListener("error", () => {
        if (model.isConnected) dialogContent.innerHTML = fallback;
      }, { once: true });
      model.src = "assets/model/studio/" + config.car + ".glb";
      dialogContent.replaceChildren(model);
    } catch {
      if (loading.isConnected) dialogContent.innerHTML = fallback;
    }
  }
  dialog.addEventListener("close", () => {
    if (!dialog.open) dialogContent.replaceChildren();
  });
  function confirmRemoval(button) {
    const id = button.dataset.remove;
    const card = button.closest("[data-card]");
    openDialog("X\xF3a b\u1EA3n ph\u1ED1i n\xE0y?", '<p>B\u1EA3n ph\u1ED1i s\u1EBD \u0111\u01B0\u1EE3c g\u1EE1 kh\u1ECFi Garage c\u1EE7a b\u1EA1n.</p><p><button class="garage-button garage-primary" type="button" data-confirm>X\xF3a b\u1EA3n ph\u1ED1i</button></p>');
    dialogContent.querySelector("[data-confirm]").addEventListener("click", async () => {
      const items = savedItems();
      if (!writeStore("saved", items.filter((item) => String(item.id) !== id))) {
        dialog.close();
        status.textContent = "Ch\u01B0a x\xF3a \u0111\u01B0\u1EE3c b\u1EA3n ph\u1ED1i. Vui l\xF2ng th\u1EED l\u1EA1i.";
        return;
      }
      dialog.close();
      if (!reduced.matches && card.isConnected) {
        card.classList.add("garage-exit");
        await Promise.allSettled(card.getAnimations().map((animation) => animation.finished));
      }
      render();
      (gallery.querySelector("[data-remove]") ?? empty.querySelector("[data-samples]")).focus({ preventScroll: true });
      status.textContent = "\u0110\xE3 x\xF3a b\u1EA3n ph\u1ED1i.";
    }, { once: true });
  }
  gallery.addEventListener("change", (event) => {
    const input = event.target.closest('input[type="checkbox"]');
    if (!input) return;
    if (input.checked) selected.add(input.value);
    else selected.delete(input.value);
    updateActions();
  });
  gallery.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (button?.dataset.edit) edit(button.dataset.edit, button.closest("[data-card]"));
    if (button?.dataset.preview) preview(button.dataset.preview);
    if (button?.dataset.remove) confirmRemoval(button);
  });
  function compare(items) {
    const configs = items.map(cleanConfig);
    const values = configs.map((config) => [...specs(config), ["Chi ph\xED d\u1EF1 t\xEDnh", money(configurationPrice(config))]]);
    openDialog("So s\xE1nh b\u1EA3n ph\u1ED1i", `<div class="garage-table" role="region" aria-label="B\u1EA3ng so s\xE1nh" tabindex="0"><table>
    <thead><tr><th scope="col">H\u1EA1ng m\u1EE5c</th>${configs.map((config, index) => `<th scope="col">${carName(config)}<br>${escape(items[index].id)}</th>`).join("")}</tr></thead>
    <tbody>${values[0].map(([label], index) => `<tr><th scope="row">${label}</th>${values.map((rows) => `<td>${rows[index][1]}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>`);
  }
  function quoteForm(items) {
    openDialog("Y\xEAu c\u1EA7u b\xE1o gi\xE1 VIP", `
    <form class="garage-form">
      <p>${items.map((item) => carName(cleanConfig(item))).join(" \xB7 ")}</p>
      <label>H\u1ECD v\xE0 t\xEAn<input name="name" autocomplete="name" required minlength="2" maxlength="80"></label>
      <label>Email<input type="email" name="email" autocomplete="email" required maxlength="120"></label>
      <p class="garage-note">Y\xEAu c\u1EA7u m\u1EABu \u0111\u01B0\u1EE3c l\u01B0u tr\xEAn tr\xECnh duy\u1EC7t.</p>
      <p class="garage-note" role="status" data-form-status></p>
      <button class="garage-button garage-primary" type="submit">L\u01B0u y\xEAu c\u1EA7u</button>
    </form>`);
    const form = dialogContent.querySelector("form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const name = data.name.trim();
      const feedback = form.querySelector("[data-form-status]");
      if (name.length < 2) {
        feedback.textContent = "Nh\u1EADp h\u1ECD v\xE0 t\xEAn c\xF3 \xEDt nh\u1EA5t hai k\xFD t\u1EF1.";
        form.elements.name.focus();
        return;
      }
      const id = "ZZ-" + crypto.randomUUID();
      const request = {
        id,
        name,
        email: data.email.trim(),
        intent: "consult",
        date: "",
        created: (/* @__PURE__ */ new Date()).toISOString(),
        status: "Ch\u1EDD t\u01B0 v\u1EA5n",
        note: "Y\xEAu c\u1EA7u b\xE1o gi\xE1 VIP t\u1EEB Garage",
        configs: items.map((item) => ({ ...cleanConfig(item), id: item.id }))
      };
      if (!writeStore("requests", [request, ...list("requests")])) {
        feedback.textContent = "Ch\u01B0a l\u01B0u \u0111\u01B0\u1EE3c y\xEAu c\u1EA7u. Vui l\xF2ng th\u1EED l\u1EA1i.";
        return;
      }
      dialog.close();
      status.textContent = "\u0110\xE3 l\u01B0u y\xEAu c\u1EA7u b\xE1o gi\xE1 \xB7 " + id;
      status.scrollIntoView({ block: "nearest" });
    });
  }
  function quote(items) {
    if (localFile) {
      quoteForm(items);
      return;
    }
    const cart = list("cart");
    items.forEach((item) => {
      const config = cleanConfig(item);
      if (!cart.some((entry) => JSON.stringify(cleanConfig(entry)) === JSON.stringify(config))) {
        cart.push({ ...config, id: crypto.randomUUID() });
      }
    });
    if (writeStore("cart", cart)) location.href = "cart.html";
    else status.textContent = "Ch\u01B0a chuy\u1EC3n \u0111\u01B0\u1EE3c b\u1EA3n ph\u1ED1i sang y\xEAu c\u1EA7u \u0111\u1EB7t tr\u01B0\u1EDBc.";
  }
  var pdfLibrary;
  function loadPDF() {
    pdfLibrary ??= new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "assets/vendor/jspdf/jspdf.umd.min.js";
      script.onload = () => resolve(globalThis.jspdf.jsPDF);
      script.onerror = () => {
        script.remove();
        pdfLibrary = void 0;
        reject(new Error("PDF library unavailable"));
      };
      document.head.append(script);
    });
    return pdfLibrary;
  }
  async function downloadPDF(item, button) {
    button.disabled = true;
    try {
      const PDF = await loadPDF();
      await document.fonts.ready;
      const config = cleanConfig(item);
      const canvas = document.createElement("canvas");
      canvas.width = 1240;
      canvas.height = 1754;
      const context = canvas.getContext("2d");
      context.fillStyle = "#fff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      const draw = (text, y, size, bold = false) => {
        context.fillStyle = "#1b1716";
        context.font = (bold ? "700 " : "400 ") + size + "px Manrope, Arial, sans-serif";
        context.fillText(text, 86, y, 1068);
      };
      draw("ZEPHYRON / BUILD SHEET", 122, 25, true);
      draw(carName(config), 226, 55, true);
      draw("Config ID \xB7 " + item.id, 288, 29);
      specs(config).forEach(([label, value], index) => {
        const y = 405 + index * 144;
        context.fillStyle = "#e4d8ce";
        context.fillRect(86, y - 48, 1068, 2);
        draw(label, y, 27);
        draw(value, y + 49, 38, true);
      });
      draw("T\u1ED5ng chi ph\xED d\u1EF1 t\xEDnh", 1210, 30);
      draw(money(configurationPrice(config)), 1280, 54, true);
      draw("Gi\xE1 minh h\u1ECDa t\u1EEB Studio ZEPHYRON.", 1438, 25);
      const pdf = new PDF({ format: "a4", compress: true });
      pdf.addImage(canvas, "PNG", 0, 0, 210, 297);
      pdf.save("ZEPHYRON-" + String(item.id).replace(/[^a-zA-Z0-9_-]/g, "-") + ".pdf");
      status.textContent = "\u0110\xE3 t\u1EA1o PDF th\xF4ng s\u1ED1.";
    } catch {
      status.textContent = "Ch\u01B0a t\u1EA1o \u0111\u01B0\u1EE3c PDF. Vui l\xF2ng th\u1EED l\u1EA1i.";
    } finally {
      updateActions();
    }
  }
  actionPanel.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button || button.disabled) return;
    const items = savedItems().filter((item) => selected.has(String(item.id)));
    if (!items.length) {
      render();
      return;
    }
    if (button.dataset.action === "edit") edit(String(items[0].id));
    if (button.dataset.action === "pdf") downloadPDF(items[0], button);
    if (button.dataset.action === "compare" && items.length > 1) compare(items);
    if (button.dataset.action === "quote") quote(items);
  });
  document.querySelector("[data-samples]").addEventListener("click", () => {
    const saved = savedItems();
    const added = samples.filter((sample) => !saved.some((item) => String(item.id) === sample.id));
    if (!writeStore("saved", [...saved, ...added])) {
      status.textContent = "Ch\u01B0a l\u01B0u \u0111\u01B0\u1EE3c hai b\u1EA3n ph\u1ED1i m\u1EABu.";
      return;
    }
    render();
    gallery.querySelector("input")?.focus();
    status.textContent = "\u0110\xE3 th\xEAm hai b\u1EA3n ph\u1ED1i m\u1EABu.";
  });
  window.addEventListener("storage", (event) => {
    if (event.key === "zuzong.saved" || event.key === "zuzong.user" || event.key === null) render();
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) render();
  });
  render();
})();
