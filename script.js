// ---------- mobile menu ----------
const menuBtn = document.getElementById('menuBtn');
const navlinks = document.getElementById('navlinks');

menuBtn.addEventListener('click', () => {
  const open = navlinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});

navlinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navlinks.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', false);
}));

// ---------- hero console (application queue) ----------
const queue = [
  { task: 'RITA business name — Mwangaza Traders', ref: 'REF-RITA-2291', status: 'approved' },
  { task: 'HESLB loan — 2nd year application', ref: 'REF-HESLB-0847', status: 'approved' },
  { task: 'TIN registration — small retail shop', ref: 'REF-TIN-1163', status: 'processing' },
  { task: 'Website build — consulting client', ref: 'REF-DEV-0092', status: 'processing' },
];

const consoleBody = document.getElementById('consoleBody');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function renderQueue() {
  consoleBody.innerHTML = '';
  queue.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'console-line';
    row.style.animationDelay = reduceMotion ? '0s' : `${i * 0.15}s`;
    row.innerHTML = `
      <div>
        <div class="task">${item.task}</div>
        <div class="ref">${item.ref}</div>
      </div>
      <span class="status ${item.status}">${item.status === 'approved' ? 'APPROVED' : 'PROCESSING'}</span>
    `;
    consoleBody.appendChild(row);
  });
}
renderQueue();

// ---------- scroll reveal ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- contact form ----------
// Submits via fetch so the page doesn't reload. Works out of the box once
// deployed on Netlify (the form has data-netlify="true" in the HTML).
// On GitHub Pages this endpoint doesn't exist, so it will show the
// "couldn't send" message below — swap in Formspree or similar for that host.
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  formNote.textContent = 'Sending…';
  formNote.className = 'form-note mono';

  try {
    const formData = new FormData(form);
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString(),
    });

    if (response.ok) {
      formNote.textContent = 'Sent — we\'ll get back to you within 24 hours.';
      formNote.className = 'form-note mono success';
      form.reset();
    } else {
      throw new Error('Non-OK response');
    }
  } catch (err) {
    formNote.textContent = 'Couldn\'t send from this host. Email hello@kyphertech.co.tz directly.';
    formNote.className = 'form-note mono error';
  } finally {
    submitBtn.disabled = false;
  }
});
