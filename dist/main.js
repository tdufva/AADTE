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
  const behaviours = ['drift', 'orbit', 'exchange', 'flutter', 'scatter', 'tumble', 'fold', 'sweep'];
  const random = (min, max) => min + Math.random() * (max - min);
  const pose = (x, y, angle, scale = 1, skew = 0, fold = 0, stretch = 1) =>
    `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${angle.toFixed(2)}deg) skewX(${skew.toFixed(2)}deg) rotateY(${fold.toFixed(2)}deg) scale(${scale.toFixed(3)},${(scale * stretch).toFixed(3)})`;
  const timings = {
    gather: [1500, 1900, 'cubic-bezier(.2,.8,.2,1)'],
    drift: [3600, 4700, 'cubic-bezier(.4,0,.3,1)'],
    orbit: [3000, 4100, 'linear'],
    exchange: [2200, 3100, 'cubic-bezier(.65,0,.25,1)'],
    flutter: [2300, 3200, 'steps(3,end)'],
    scatter: [2300, 3200, 'cubic-bezier(.16,1,.3,1)'],
    tumble: [2800, 3700, 'cubic-bezier(.3,0,.35,1)'],
    fold: [2400, 3300, 'cubic-bezier(.35,0,.2,1)'],
    sweep: [2100, 2900, 'cubic-bezier(.7,0,.2,1)'],
  };
  let paused = reducedMotion.matches || !canAnimate;
  let animations = [];
  let timer = null;
  let deadline = 0;
  let remaining = 0;
  let cycle = 0;
  let behaviour = 'scatter';
  let remainingBehaviours = [];

  const nextBehaviour = () => {
    // A shuffled deck gives every motion a turn without immediate repeats.
    if (!remainingBehaviours.length) {
      remainingBehaviours = [...behaviours];
      for (let index = remainingBehaviours.length - 1; index > 0; index -= 1) {
        const other = Math.floor(random(0, index + 1));
        [remainingBehaviours[index], remainingBehaviours[other]] = [remainingBehaviours[other], remainingBehaviours[index]];
      }
    }
    if (remainingBehaviours.at(-1) === behaviour) {
      remainingBehaviours.unshift(remainingBehaviours.pop());
    }
    return remainingBehaviours.pop();
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
    if (mode === 'orbit') {
      const phase = random(0, Math.PI * 2);
      const radius = random(.8, 1.35);
      return [{ transform: start }, ...[0, 1, 2, 3, 4, 5].map(step => {
        const turn = phase + direction * step * Math.PI / 2.5;
        return { transform: pose(Math.cos(turn) * x * radius, Math.sin(turn) * y, angle + Math.sin(turn) * 35, 1 + Math.cos(turn) * .09) };
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
    const [shortest, longest, easing] = timings[mode];
    const duration = cycle === 0 ? 2100 : random(shortest, longest);
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
      const depths = mode === 'gather' || !layer.letter
        ? [{ zIndex: start.depth, offset: 0 }, { zIndex: String(layer.depth), offset: .2 }, { zIndex: String(layer.depth), offset: 1 }]
        : [{ zIndex: start.depth, offset: 0 }, { zIndex: '3', offset: .28 }, { zIndex: '15', offset: .58 }, { zIndex: String(index % 2 ? 12 : 6), offset: 1 }];
      animations.push(layer.element.animate(depths.map(frame => ({ ...frame, easing: 'steps(1,end)' })), {
        ...timing, easing: 'linear',
      }));
    });
    // Blend into the next scene before this one ends, avoiding a static gap.
    remaining = finish - 100;
    if (paused || document.hidden) freeze();
    else armClock();
  }

  const resume = () => {
    if (paused || reducedMotion.matches || document.hidden || !canAnimate) return;
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
}
