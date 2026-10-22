import { initAnt } from './ant';

const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle');
const mobileNav = document.querySelector<HTMLElement>('#mobile-nav');

menuButton?.addEventListener('click', () => {
  if (!mobileNav) return;

  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  mobileNav.classList.toggle('open', !isOpen);
});

mobileNav?.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
  });
});

const toTop = document.querySelector<HTMLAnchorElement>('.to-top');
window.addEventListener(
  'scroll',
  () => toTop?.classList.toggle('visible', window.scrollY > 600),
  { passive: true },
);

initAnt();
