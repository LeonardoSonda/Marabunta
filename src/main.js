const menuButton = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('#mobile-nav');
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      mobileNav.classList.toggle('open', !isOpen);
    });
    mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
    }));
    const toTop = document.querySelector('.to-top');
    window.addEventListener('scroll', () => toTop.classList.toggle('visible', window.scrollY > 600), { passive: true });