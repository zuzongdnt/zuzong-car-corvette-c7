import {colorOf} from './studio-data.js';
import {vehicleSpecs} from './studio-specs.js';

// Positions are measured on each shipped GLB, in model-viewer coordinates.
const points = {
  corvette: {
    engine: [-1.475,.814,.110], front: [-1.893,.660,.668],
    wheel: [-1.375,.313,.900], rear: [2.065,.847,-.574]
  },
  bmw: {
    engine: [-1.795,.916,.264], front: [-2.103,.683,.736],
    wheel: [-1.591,.304,.880], rear: [2.211,.885,-.627]
  },
  porsche: {
    engine: [2.063,.888,-.005], front: [-1.829,.678,.617],
    wheel: [-1.236,.341,.835], rear: [2.031,.793,-.498]
  },
  mercedes: {
    engine: [-1.669,.876,.210], front: [-2.000,.666,.727],
    wheel: [-1.380,.406,.925], rear: [2.127,.789,-.638]
  },
  lamborghini: {
    engine: [1.646,1.039,.022], front: [-1.967,.617,.862],
    wheel: [-1.337,.322,1.077], rear: [2.253,.884,-.677]
  }
};
const parts = [
  {id:'engine', label:'Động cơ', normal:'0 1 0', side:'left'},
  {id:'front', label:'Đèn trước', normal:'-1 0 .28', side:'right'},
  {id:'wheel', label:'Mâm và heo phanh', normal:'0 0 1', side:'left'},
  {id:'rear', label:'Đèn hậu', normal:'1 0 -.25', side:'right'}
];

export function mountStudioAnnotations(stage, viewer) {
  stage.insertAdjacentHTML('beforeend',`
    <button class="z-annotation-toggle" type="button" aria-pressed="false" disabled>
      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="5" cy="14" r="2"/><path d="m6.5 12.5 5-6H18M12 10h6"/></svg>
      Thông số 3D
    </button>
    <div class="z-annotations" aria-hidden="true" hidden>
      <svg class="z-annotation-lines" width="100%" height="100%"></svg>
    </div>
    <span class="sr-only" role="status"></span>`);
  const toggle = stage.querySelector('.z-annotation-toggle');
  const overlay = stage.querySelector('.z-annotations');
  const lines = overlay.querySelector('svg');
  const status = overlay.nextElementSibling;
  const svg = name => document.createElementNS('http://www.w3.org/2000/svg',name);
  const callouts = parts.map(part => {
    const label = document.createElement('div');
    label.className = 'z-annotation-label z-annotation-' + part.id;
    label.innerHTML = '<strong></strong><small></small>';
    label.firstElementChild.textContent = part.label;
    overlay.append(label);
    const line = svg('polyline'), dot = svg('circle');
    dot.setAttribute('r','3');
    lines.append(line,dot);
    const anchor = document.createElement('span');
    anchor.slot = 'hotspot-spec-' + part.id;
    anchor.dataset.normal = part.normal;
    anchor.className = 'z-annotation-anchor';
    anchor.setAttribute('aria-hidden','true');
    return {...part, label, line, dot, anchor};
  });
  let car, active = false, frame = 0;

  function paint() {
    frame = 0;
    if (overlay.hidden) return;
    const width = viewer.clientWidth, height = viewer.clientHeight;
    const angle = Math.sin(viewer.getCameraOrbit().theta);
    for (const {id, side, label, line, dot, anchor} of callouts) {
      const hotspot = viewer.queryHotspot(anchor.slot);
      const position = hotspot?.canvasPosition;
      const direction = id === 'engine' ? Math.sign(points[car].engine[0]) : id === 'rear' ? 1 : id === 'front' ? -1 : 0;
      const visible = hotspot?.facingCamera && angle * direction >= -.08 &&
        position.x >= 6 && position.x <= width - 6 && position.y >= 6 && position.y <= height - 6;
      label.hidden = !visible;
      line.style.display = dot.style.display = visible ? '' : 'none';
      if (!visible) continue;
      const x = label.offsetLeft + (side === 'left' ? label.offsetWidth : 0);
      const y = label.offsetTop + label.offsetHeight / 2;
      const elbow = x + (side === 'left' ? 12 : -12);
      line.setAttribute('points',`${x},${y} ${elbow},${y} ${position.x},${position.y}`);
      dot.setAttribute('cx',position.x);
      dot.setAttribute('cy',position.y);
    }
  }

  function schedule() {
    if (!overlay.hidden && !frame) frame = requestAnimationFrame(paint);
  }

  function sync() {
    overlay.hidden = !active || toggle.disabled;
    if (!overlay.hidden) {
      const engine = callouts[0].label.lastElementChild.textContent;
      const wheel = callouts[2].label.lastElementChild.textContent;
      status.textContent = `Thông số trên mô hình. Động cơ ${engine}. ${wheel}. Xoay xe để xem đèn trước và đèn hậu.`;
    }
    schedule();
  }

  toggle.addEventListener('click',() => {
    active = !active;
    toggle.setAttribute('aria-pressed',String(active));
    if (!active) status.textContent = 'Đã ẩn thông số trên mô hình.';
    sync();
  });
  viewer.addEventListener('camera-change',schedule);
  new ResizeObserver(schedule).observe(viewer);

  return {
    update(config,ready) {
      toggle.disabled = !ready;
      if (!ready) {
        sync();
        return;
      }
      if (config.car !== car) {
        car = config.car;
        for (const {id,anchor} of callouts) {
          anchor.remove();
          anchor.dataset.position = points[car][id].join(' ');
          viewer.append(anchor);
        }
      }
      const spec = vehicleSpecs[car];
      callouts[0].label.lastElementChild.textContent =
        `${spec.litres.toFixed(1).replace('.',',')} L · ${spec.kw} kW${car === 'lamborghini' ? ' hệ hybrid' : ''}`;
      callouts[2].label.lastElementChild.textContent =
        `Mâm ${colorOf(config,'rims').name} · heo phanh ${colorOf(config,'calipers').name}`;
      sync();
    }
  };
}
