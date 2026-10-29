const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.desktop-nav');
if (toggle && navigation) {
  const closeMenu = () => {
    navigation.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'Menu +';
  };
  toggle.addEventListener('click', () => {
    const open = navigation.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close −' : 'Menu +';
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    }
  });
  matchMedia('(min-width: 701px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });
}

const collage = document.querySelector('.hero-collage');
const collageToggle = document.querySelector('.collage-toggle');
if (collage && collageToggle) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const scene = collage.querySelector('.collage-scene');
  const elements = [...scene.querySelectorAll('.cut-letter, .collage-piece')];
  const canAnimate = elements.length > 0 && elements.every(element => typeof element.animate === 'function');
  const layers = elements.map((element, index) => {
    const style = getComputedStyle(element);
    const letter = element.classList.contains('cut-letter');
    return {
      element, index, letter,
      angle: parseFloat(style.getPropertyValue(letter ? '--rest' : '--angle')) || 0,
      depth: parseInt(style.zIndex, 10) || 1,
    };
  });
  const gentleBehaviours = ['drift', 'sway', 'float'];
  const livelyBehaviours = ['orbit', 'exchange', 'flutter', 'scatter', 'tumble', 'fold', 'sweep'];
  const random = (min, max) => min + Math.random() * (max - min);
  const pose = (x, y, angle, scale = 1, skew = 0, fold = 0, stretch = 1) =>
    `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${angle.toFixed(2)}deg) skewX(${skew.toFixed(2)}deg) rotateY(${fold.toFixed(2)}deg) scale(${scale.toFixed(3)},${(scale * stretch).toFixed(3)})`;
  const timings = {
    gather: [2500, 3300, 'cubic-bezier(.2,.8,.2,1)'],
    drift: [6800, 9600, 'cubic-bezier(.45,0,.55,1)'],
    sway: [7200, 10000, 'linear'],
    float: [7500, 10500, 'linear'],
    orbit: [4500, 6500, 'linear'],
    exchange: [3100, 4700, 'cubic-bezier(.65,0,.25,1)'],
    flutter: [3200, 4800, 'steps(3,end)'],
    scatter: [3200, 4800, 'cubic-bezier(.16,1,.3,1)'],
    tumble: [4200, 6000, 'cubic-bezier(.3,0,.35,1)'],
    fold: [4200, 6200, 'cubic-bezier(.35,0,.2,1)'],
    sweep: [2800, 4400, 'cubic-bezier(.7,0,.2,1)'],
  };
  let paused = reducedMotion.matches || !canAnimate;
  let animations = [];
  let timer = null;
  let deadline = 0;
  let remaining = 0;
  let cycle = 0;
  let behaviour = 'scatter';
  const decks = { gentle: [], lively: [] };
  let interaction = null;

  const nextBehaviour = () => {
    // Usually follow energetic movement with a quieter scene, while keeping
    // both the pace and the individual behaviour unpredictable.
    const wasGentle = behaviour === 'gather' || gentleBehaviours.includes(behaviour);
    const pace = Math.random() < (wasGentle ? .4 : .8) ? 'gentle' : 'lively';
    const deck = decks[pace];
    if (!deck.length) {
      deck.push(...(pace === 'gentle' ? gentleBehaviours : livelyBehaviours));
      for (let index = deck.length - 1; index > 0; index -= 1) {
        const other = Math.floor(random(0, index + 1));
        [deck[index], deck[other]] = [deck[other], deck[index]];
      }
    }
    if (deck.at(-1) === behaviour) {
      deck.unshift(deck.pop());
    }
    return deck.pop();
  };

  const updateControl = () => {
    collage.dataset.motion = paused ? 'paused' : 'playing';
    collageToggle.hidden = reducedMotion.matches || !canAnimate;
    collageToggle.setAttribute('aria-pressed', String(paused));
    collageToggle.setAttribute('aria-label', paused ? 'Play collage animation' : 'Pause collage animation');
    collageToggle.innerHTML = paused
      ? 'Play collage <span aria-hidden="true">▷</span>'
      : 'Pause collage <span aria-hidden="true">Ⅱ</span>';
  };

  const freeze = () => {
    interaction?.sleep();
    if (timer !== null) {
      remaining = Math.max(100, deadline - performance.now());
      clearTimeout(timer);
      timer = null;
    }
    animations.forEach(animation => {
      if (animation.playState === 'running') animation.pause();
    });
  };

  const armClock = () => {
    if (paused || reducedMotion.matches || document.hidden || timer !== null) return;
    deadline = performance.now() + remaining;
    timer = setTimeout(() => {
      timer = null;
      if (paused || reducedMotion.matches || document.hidden) return;
      cycle += 1;
      // Periodically reassemble the name; other scenes never repeat immediately.
      const next = cycle % 4 === 0 ? 'gather' : nextBehaviour();
      runBehaviour(next);
    }, remaining);
  };

  const framesFor = (layer, mode, start) => {
    const width = layer.element.offsetWidth;
    const height = layer.element.offsetHeight;
    const x = Math.min(width * .55, scene.offsetWidth * .15);
    const y = Math.min(height * .42, scene.offsetHeight * .26);
    const angle = layer.angle;
    const direction = layer.index % 2 === 0 ? 1 : -1;
    if (mode === 'gather') {
      return [
        { transform: start },
        { transform: pose(-direction * x * .1, -y * .08, angle - direction * 4, 1.025), offset: .7 },
        { transform: pose(0, 0, angle) },
      ];
    }
    if (mode === 'sway' || mode === 'float') {
      const phase = random(-.4, .4) + direction * Math.PI / 5;
      return [
        { transform: start, offset: 0, easing: 'cubic-bezier(.35,0,.2,1)' },
        ...Array.from({ length: 25 }, (_, index) => {
          const time = index / 24;
          const damping = Math.exp(-time * (mode === 'sway' ? 1.7 : .85));
          const wave = phase + time * Math.PI * (mode === 'sway' ? 3 : 2);
          // Damped pendulum arcs and buoyant bobbing settle naturally.
          const swing = Math.sin(wave) * damping;
          const bob = Math.cos(wave) * damping;
          const transform = mode === 'sway'
            ? pose(swing * x * .3, (1 - Math.cos(swing)) * y * .18, angle + swing * 12)
            : pose(swing * x * .24, bob * y * .25, angle + swing * 5, 1 + bob * .012);
          return { transform, offset: .22 + time * .78 };
        }),
      ];
    }
    if (mode === 'orbit') {
      const phase = random(0, Math.PI * 2);
      const radius = random(.8, 1.35);
      return [{ transform: start }, ...[0, 1, 2, 3, 4, 5].map(step => {
        const turn = phase + direction * step * Math.PI / 2.5;
        return { transform: pose(Math.cos(turn) * x * radius, Math.sin(turn) * y, angle + Math.sin(turn) * 28, 1 + Math.cos(turn) * .07) };
      })];
    }
    if (mode === 'exchange') {
      return [
        { transform: start },
        { transform: pose(direction * x * 1.6, -direction * y * .8, angle - direction * random(24, 48), .78), offset: .42 },
        { transform: pose(-direction * x * .9, direction * y * .7, angle + direction * random(20, 38), 1.12) },
      ];
    }
    if (mode === 'flutter') {
      const bend = random(14, 26);
      return [{ transform: start }, ...[1, -1, 1, -1, 1, 0].map((turn, index) => ({
        transform: pose(turn * x * .4, Math.sin(index + layer.index) * y * .55, angle + turn * bend, 1 + turn * .055, turn * 5),
      }))];
    }
    if (mode === 'scatter') {
      return [
        { transform: start },
        { transform: pose(direction * x * 1.25, -y * random(.65, 1.25), angle + direction * random(22, 48), random(.8, 1.15)), offset: .28 },
        { transform: pose(-direction * x * .5, y * .65, angle - direction * 20, 1.08), offset: .72 },
        { transform: pose(direction * x * .2, -y * .12, angle + direction * 8) },
      ];
    }
    if (mode === 'tumble') {
      const turn = direction * (layer.letter ? 360 : 180);
      return [
        { transform: start },
        { transform: pose(direction * x * .8, -y * .85, angle + turn * .35, .72), offset: .35 },
        { transform: pose(-direction * x * .5, y * .65, angle + turn * .8, 1.16), offset: .76 },
        { transform: pose(0, -y * .1, angle + turn) },
      ];
    }
    if (mode === 'fold') {
      return [
        { transform: start },
        { transform: pose(direction * x * .6, -y * .25, angle + direction * 18, 1.12, direction * 12, direction * 78, .82), offset: .32 },
        { transform: pose(-direction * x * .45, y * .4, angle - direction * 18, .9, -direction * 10, -direction * 62, 1.16), offset: .68 },
        { transform: pose(direction * x * .2, 0, angle) },
      ];
    }
    if (mode === 'sweep') {
      return [
        { transform: start },
        { transform: pose(-direction * x * 1.6, -y * .2, angle - direction * 18, .85, -direction * 14), offset: .3 },
        { transform: pose(direction * x * 1.7, y * .3, angle + direction * 28, 1.12, direction * 18), offset: .72 },
        { transform: pose(direction * x * .25, 0, angle + direction * 7) },
      ];
    }
    return [
      { transform: start },
      { transform: pose(random(-x, x) * .3, random(-y, y) * .25, angle + random(-5, 5), random(.99, 1.015)) },
      { transform: pose(random(-x, x) * .35, random(-y, y) * .3, angle + random(-6, 6), random(.99, 1.015)) },
    ];
  };

  function runBehaviour(mode) {
    if (!canAnimate || reducedMotion.matches) return;
    const starts = layers.map(layer => {
      const style = getComputedStyle(layer.element);
      return { transform: style.transform, depth: style.zIndex };
    });
    animations.forEach(animation => animation.cancel());
    animations = [];
    behaviour = mode;
    collage.dataset.behavior = mode;
    collage.dataset.cycle = String(cycle);
    const [shortest, longest, easing] = timings[mode];
    const gentle = mode === 'gather' || gentleBehaviours.includes(mode);
    const duration = cycle === 0 ? 3400 : random(shortest, longest);
    let finish = 0;
    layers.forEach((layer, index) => {
      const start = starts[index];
      layer.element.style.transform = start.transform;
      layer.element.style.zIndex = start.depth;
      const timing = { duration: duration * random(.92, 1.05), delay: cycle === 0 ? 0 : random(0, 90), fill: 'both' };
      finish = Math.max(finish, timing.duration + timing.delay);
      animations.push(layer.element.animate(framesFor(layer, mode, start.transform), {
        ...timing, easing,
      }));
      const depths = gentle || !layer.letter
        ? [{ zIndex: start.depth, offset: 0 }, { zIndex: String(layer.depth), offset: .2 }, { zIndex: String(layer.depth), offset: 1 }]
        : [{ zIndex: start.depth, offset: 0 }, { zIndex: '3', offset: .28 }, { zIndex: '15', offset: .58 }, { zIndex: String(index % 2 ? 12 : 6), offset: 1 }];
      animations.push(layer.element.animate(depths.map(frame => ({ ...frame, easing: 'steps(1,end)' })), {
        ...timing, easing: 'linear',
      }));
    });
    // Hold the final pose for a breathing space; pause preserves this clock too.
    const rest = mode === 'gather' ? random(2000, 3400)
      : gentle ? random(1500, 3000) : random(900, 2000);
    remaining = finish + rest;
    if (paused || document.hidden) freeze();
    else armClock();
  }

  const resume = () => {
    if (paused || reducedMotion.matches || document.hidden || !canAnimate) return;
    interaction?.wake();
    if (!animations.length) {
      runBehaviour('scatter');
      return;
    }
    animations.forEach(animation => {
      const end = animation.effect.getComputedTiming().endTime;
      if (animation.playState === 'paused' && animation.currentTime < end) animation.play();
    });
    armClock();
  };

  const makeStatic = () => {
    freeze();
    interaction?.reset();
    animations.forEach(animation => animation.cancel());
    animations = [];
    layers.forEach(layer => {
      layer.element.style.removeProperty('transform');
      layer.element.style.removeProperty('z-index');
    });
    collage.dataset.behavior = 'still';
  };

  collageToggle.addEventListener('click', () => {
    paused = !paused;
    if (paused) freeze();
    else resume();
    updateControl();
  });
  reducedMotion.addEventListener('change', event => {
    paused = event.matches || !canAnimate;
    if (paused) makeStatic();
    else resume();
    updateControl();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) freeze();
    else resume();
  });
  updateControl();
  if (paused) makeStatic();
  else runBehaviour('scatter');
  interaction = createCollageInteraction(scene, layers, () => paused || reducedMotion.matches || document.hidden);
}

function createCollageInteraction(scene, layers, isPaused) {
  const finePointer = matchMedia('(any-hover: hover) and (any-pointer: fine)');
  if (!window.CSS?.supports('translate', '1px 1px')) return null;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return null;
  canvas.className = 'collage-growth';
  canvas.setAttribute('aria-hidden', 'true');
  scene.append(canvas);

  const pigment = ['#cf4c55', '#c3c773', '#b09ac5', '#ebe2cf', '#709476'];
  const grain = document.createElement('canvas');
  grain.width = grain.height = 64;
  const ink = grain.getContext('2d');
  ink.fillStyle = 'rgba(45,39,50,.32)';
  for (let dot = 0; dot < 260; dot += 1) {
    ink.fillRect(Math.random() * 64, Math.random() * 64, Math.random() * 1.4 + .4, Math.random() * 1.4 + .4);
  }
  const texture = context.createPattern(grain, 'repeat');
  const springs = layers.map(layer => ({ ...layer, x: 0, y: 0, tilt: 0, vx: 0, vy: 0, spin: 0 }));
  const pointer = { inside: false, x: 0, y: 0, anchorX: 0, anchorY: 0, stillSince: 0, seeded: false };
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  let forms = [];
  let frame = null;
  let lastFrame = 0;
  let time = 0;
  let bounds;

  const release = () => {
    forms.forEach(form => { if (form.released === null) form.released = time; });
    pointer.seeded = false;
    pointer.stillSince = time;
  };

  const resize = () => {
    bounds = scene.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(bounds.width * ratio);
    canvas.height = Math.round(bounds.height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    forms = [];
    pointer.inside = false;
    release();
  };

  const seedForm = () => {
    const segments = [];
    const heading = Math.atan2(bounds.height / 2 - pointer.y, bounds.width / 2 - pointer.x) + (Math.random() - .5) * Math.PI;
    const phase = Math.random() * Math.PI * 2;
    const unit = clamp(bounds.width / 8, 60, 125);
    const colour = Math.floor(Math.random() * pigment.length);
    // Two folded, offset ribbons follow the same flow rather than a radial motif.
    for (let ribbon = 0; ribbon < 2; ribbon += 1) {
      let x = pointer.x;
      let y = pointer.y;
      for (let step = 0; step < 18; step += 1) {
        const angle = heading + Math.sin(step * .38 + phase + ribbon * .65) * 1.3 + ribbon * .3;
        const length = unit * (.13 + Math.random() * .08);
        const endX = x + Math.cos(angle) * length;
        const endY = y + Math.sin(angle) * length;
        const width = unit * (.12 + Math.random() * .13) * (1 - step * .026);
        segments.push({ x, y, endX, endY, width, angle, colour: (colour + ribbon * 2 + Math.floor(step / 5)) % pigment.length, born: step * 160 + ribbon * 260 });
        x = endX;
        y = endY;
      }
    }
    forms.push({ born: time, released: null, segments });
    forms = forms.slice(-2);
    pointer.seeded = true;
    canvas.dataset.growth = 'growing';
  };

  const drawForms = () => {
    context.clearRect(0, 0, bounds.width, bounds.height);
    forms = forms.filter(form => form.released === null || time - form.released < 1300);
    forms.forEach(form => {
      const fade = form.released === null ? 1 : Math.pow(1 - (time - form.released) / 1300, 2);
      form.segments.forEach(segment => {
        const progress = clamp((time - form.born - segment.born) / 520, 0, 1);
        if (!progress) return;
        const growth = 1 - Math.pow(1 - progress, 3);
        const endX = segment.x + (segment.endX - segment.x) * growth;
        const endY = segment.y + (segment.endY - segment.y) * growth;
        const half = segment.width * (.3 + growth * .7) / 2;
        const nx = -Math.sin(segment.angle) * half;
        const ny = Math.cos(segment.angle) * half;
        const path = new Path2D();
        path.moveTo(segment.x + nx, segment.y + ny);
        path.lineTo(endX + nx * .8, endY + ny * .8);
        path.lineTo(endX - nx, endY - ny);
        path.lineTo(segment.x - nx * .85, segment.y - ny * .85);
        path.closePath();
        context.save();
        context.translate(2, -1.5);
        context.fillStyle = pigment[(segment.colour + 2) % pigment.length];
        context.globalAlpha = fade * .28;
        context.fill(path);
        context.restore();
        context.fillStyle = pigment[segment.colour];
        context.globalAlpha = fade * .88;
        context.fill(path);
        context.fillStyle = texture;
        context.globalAlpha = fade * .65;
        context.fill(path);
      });
    });
    context.globalAlpha = 1;
    if (!forms.length) canvas.dataset.growth = 'idle';
  };

  function tick(now) {
    frame = null;
    if (isPaused() || !finePointer.matches) return;
    const elapsed = lastFrame ? clamp(now - lastFrame, 0, 40) : 16.67;
    lastFrame = now;
    time += elapsed;
    const dt = elapsed / 16.67;
    const radius = clamp(bounds.width * .28, 140, 340);
    // Read every layer before writing, keeping layout work outside the spring loop.
    const boxes = springs.map(spring => spring.element.getBoundingClientRect());
    let moving = false;
    springs.forEach((spring, index) => {
      const box = boxes[index];
      const dx = box.left + box.width / 2 - bounds.left - spring.x - pointer.x;
      const dy = box.top + box.height / 2 - bounds.top - spring.y - pointer.y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const influence = pointer.inside ? Math.pow(Math.max(0, 1 - distance / radius), 2) : 0;
      const force = (spring.letter ? 50 : 65) * influence;
      const targetX = dx / distance * force;
      const targetY = dy / distance * force * .72;
      const targetTilt = clamp(dx / radius, -1, 1) * influence * -15;
      const damping = Math.pow(spring.letter ? .8 : .84, dt);
      spring.vx = (spring.vx + (targetX - spring.x) * .085 * dt) * damping;
      spring.vy = (spring.vy + (targetY - spring.y) * .085 * dt) * damping;
      spring.spin = (spring.spin + (targetTilt - spring.tilt) * .06 * dt) * damping;
      spring.x += spring.vx * dt;
      spring.y += spring.vy * dt;
      spring.tilt += spring.spin * dt;
      if (Math.abs(spring.x) + Math.abs(spring.y) + Math.abs(spring.tilt) + Math.abs(spring.vx) + Math.abs(spring.vy) + Math.abs(spring.spin) > .05) moving = true;
      spring.element.style.translate = `${spring.x.toFixed(2)}px ${spring.y.toFixed(2)}px`;
      spring.element.style.rotate = `${spring.tilt.toFixed(2)}deg`;
    });
    if (pointer.inside && !pointer.seeded && time - pointer.stillSince >= 1800) seedForm();
    drawForms();
    if (pointer.inside || moving || forms.length) frame = requestAnimationFrame(tick);
    else lastFrame = 0;
  }

  const wake = () => {
    if (frame === null && !isPaused() && finePointer.matches) frame = requestAnimationFrame(tick);
  };
  const sleep = () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    lastFrame = 0;
  };
  const reset = () => {
    sleep();
    forms = [];
    pointer.inside = false;
    release();
    springs.forEach(spring => {
      spring.x = spring.y = spring.tilt = spring.vx = spring.vy = spring.spin = 0;
      spring.element.style.removeProperty('translate');
      spring.element.style.removeProperty('rotate');
    });
    context.clearRect(0, 0, bounds.width, bounds.height);
    canvas.dataset.growth = 'idle';
  };
  const leave = () => {
    if (!pointer.inside) return;
    pointer.inside = false;
    release();
    wake();
  };

  scene.closest('.hero-collage').addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || !finePointer.matches || isPaused()) return;
    bounds = scene.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    if (x < 0 || y < 0 || x > bounds.width || y > bounds.height) { leave(); return; }
    if (!pointer.inside || Math.hypot(x - pointer.anchorX, y - pointer.anchorY) > 12) {
      release();
      pointer.anchorX = x;
      pointer.anchorY = y;
    }
    pointer.x = x;
    pointer.y = y;
    pointer.inside = true;
    wake();
  }, { passive: true });
  scene.closest('.hero-collage').addEventListener('pointerleave', leave);
  window.addEventListener('scroll', leave, { passive: true });
  finePointer.addEventListener('change', reset);
  new ResizeObserver(resize).observe(scene);
  resize();
  return { wake, sleep, reset };
}
