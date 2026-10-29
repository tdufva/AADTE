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
  let paused = reducedMotion.matches;

  const updateCollage = () => {
    collage.dataset.motion = paused ? 'paused' : 'playing';
    collageToggle.hidden = reducedMotion.matches;
    collageToggle.setAttribute('aria-pressed', String(paused));
    collageToggle.setAttribute('aria-label', paused ? 'Play collage animation' : 'Pause collage animation');
    collageToggle.innerHTML = paused
      ? 'Play collage <span aria-hidden="true">▷</span>'
      : 'Pause collage <span aria-hidden="true">Ⅱ</span>';
  };

  collageToggle.addEventListener('click', () => {
    paused = !paused;
    updateCollage();
  });
  reducedMotion.addEventListener('change', event => {
    paused = event.matches;
    updateCollage();
  });
  updateCollage();
}
