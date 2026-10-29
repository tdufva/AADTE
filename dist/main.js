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
  const behaviours = ['drift', 'orbit', 'exchange', 'flutter'];
  const random = (min, max) => min + Math.random() * (max - min);
  const pose = (x, y, angle, scale = 1) => `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${angle.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
  let paused = reducedMotion.matches || !canAnimate;
  let animations = [];
  let timer = null;
  let deadline = 0;
  let remaining = 0;
  let cycle = 0;
  let behaviour = 'gather';

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
      const choices = behaviours.filter(name => name !== behaviour);
      const next = cycle % 4 === 0 ? 'gather' : choices[Math.floor(Math.random() * choices.length)];
      runBehaviour(next);
    }, remaining);
  };

  const framesFor = (layer, mode, start) => {
    const energy = Math.min(1, .55 + cycle * .075);
    const width = layer.element.offsetWidth;
    const height = layer.element.offsetHeight;
    const x = Math.min(width * .42, scene.offsetWidth * .12) * energy;
    const y = Math.min(height * .32, scene.offsetHeight * .22) * energy;
    const angle = layer.angle;
    if (mode === 'gather') {
      const home = pose(0, 0, angle);
      return [{ transform: start }, { transform: home, offset: .72 }, { transform: home }];
    }
    if (mode === 'orbit') {
      const phase = random(0, Math.PI * 2);
      const radius = random(.55, 1);
      return [{ transform: start }, ...[0, 1, 2, 3].map(step => {
        const turn = phase + step * Math.PI / 1.65;
        return { transform: pose(Math.cos(turn) * x * radius, Math.sin(turn) * y, angle + Math.sin(turn) * 14, random(.97, 1.025)) };
      })];
    }
    if (mode === 'exchange') {
      const direction = layer.index % 2 === 0 ? 1 : -1;
      return [
        { transform: start },
        { transform: pose(direction * x, -direction * y, angle - direction * random(10, 25), .95) },
        { transform: pose(-direction * x * .65, direction * y * .6, angle + direction * random(8, 19), 1.035) },
      ];
    }
    if (mode === 'flutter') {
      const bend = random(4, 11);
      return [{ transform: start }, ...[1, -1, 1, -1, 0].map((direction, index) => ({
        transform: pose(direction * x * .2, Math.sin(index + layer.index) * y * .3, angle + direction * bend, 1 + direction * .012),
      }))];
    }
    return [
      { transform: start },
      { transform: pose(random(-x, x) * .65, random(-y, y) * .65, angle + random(-11, 11), random(.97, 1.035)) },
      { transform: pose(random(-x, x) * .7, random(-y, y) * .7, angle + random(-12, 12), random(.97, 1.035)) },
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
    const duration = cycle === 0 ? 3800 : random(6500, 10500);
    layers.forEach((layer, index) => {
      const start = starts[index];
      layer.element.style.transform = start.transform;
      layer.element.style.zIndex = start.depth;
      const timing = { duration: duration * random(.92, 1.06), delay: random(0, 280), fill: 'both' };
      animations.push(layer.element.animate(framesFor(layer, mode, start.transform), {
        ...timing, easing: 'cubic-bezier(.45,0,.25,1)',
      }));
      const depths = mode === 'gather' || !layer.letter
        ? [{ zIndex: start.depth, offset: 0 }, { zIndex: String(layer.depth), offset: .2 }, { zIndex: String(layer.depth), offset: 1 }]
        : [{ zIndex: start.depth, offset: 0 }, { zIndex: '3', offset: .28 }, { zIndex: '15', offset: .58 }, { zIndex: String(index % 2 ? 12 : 6), offset: 1 }];
      animations.push(layer.element.animate(depths.map(frame => ({ ...frame, easing: 'steps(1,end)' })), {
        ...timing, easing: 'linear',
      }));
    });
    remaining = duration * 1.18;
    if (paused || document.hidden) freeze();
    else armClock();
  }

  const resume = () => {
    if (paused || reducedMotion.matches || document.hidden || !canAnimate) return;
    if (!animations.length) {
      runBehaviour('gather');
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
  else runBehaviour('gather');
}
