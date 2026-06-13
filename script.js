// Basic interactivity: theme toggle, mobile nav toggle, smooth scroll, contact handler
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.getElementById('site-nav');
  const yearEl = document.getElementById('year');
  const contactForm = document.getElementById('contact-form');
  const formMsg = document.getElementById('form-msg');

  // year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // theme toggle
  themeToggle?.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    const isLight = document.documentElement.classList.contains('light');
    localStorage.setItem('theme-light', isLight ? '1' : '0');
  });

  // apply saved theme
  const saved = localStorage.getItem('theme-light');
  if (saved === '1') document.documentElement.classList.add('light');

  // mobile nav
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    siteNav.style.display = expanded ? 'none' : 'block';
  });

  // smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
  });

  // simple contact handler (no backend)
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = data.get('name');
    const email = data.get('email');
    const message = data.get('message');

    // validate minimal
    if (!name || !email || !message) {
      formMsg.textContent = 'Please complete all fields.';
      return;
    }

    // fake send
    formMsg.textContent = 'Sending...';
    setTimeout(() => {
      formMsg.textContent = 'Message sent. Thank you!';
      contactForm.reset();
    }, 800);
  });

  // profile picture upload + persistence
  const avatarInput = document.getElementById('avatar-input');
  const profilePic = document.getElementById('profile-pic');
  const removeBtn = document.getElementById('remove-avatar');

  // load saved image (data URL) from localStorage
  const savedAvatar = localStorage.getItem('profile-avatar');
  if (savedAvatar && profilePic) {
    profilePic.src = savedAvatar;
  }

  avatarInput?.addEventListener('change', (e) => {
    const file = avatarInput.files && avatarInput.files[0];
    if (!file) return;
    // ensure it's an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (profilePic) profilePic.src = dataUrl;
      try { localStorage.setItem('profile-avatar', dataUrl); } catch (err) { console.warn('Could not save avatar to localStorage', err); }
    };
    reader.readAsDataURL(file);
  });

  removeBtn?.addEventListener('click', () => {
    // revert to default placeholder
    if (profilePic) profilePic.src = 'assets/avatar.svg';
    localStorage.removeItem('profile-avatar');
  });
});
