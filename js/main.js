// =====================
// NAVBAR SCROLL
// =====================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// =====================
// HAMBURGER MENU
// =====================
const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => {
  document.body.classList.toggle('nav-open');
});
// Close when clicking a nav link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => document.body.classList.remove('nav-open'));
});

// =====================
// SCROLL REVEAL
// =====================
const revealEls = document.querySelectorAll(
  '.kursus-card, .ku-item, .testi-card, .daftar-form, .hero-stats, .section-header, .keunggulan-text'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));

// =====================
// FORM SUBMIT → SPREADSHEET + WHATSAPP
// =====================
// 1) Tempel URL Web App Google Apps Script di sini (lihat panduan).
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzBjk-Owq1gc4BXqxUSGsFUKwF2iQ4_ZR6Z6woYyg4I4MAl8IRYXgH-IEqI56SZbT6BiQ/exec';
// 2) Nomor WhatsApp admin (format 62, tanpa + atau 0 di depan).
const WA_NUMBER = '6281995597658';

async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.btn-submit');

  // Wajib pilih minimal satu hari jadwal
  const hari = [...form.querySelectorAll('input[name="hari"]:checked')].map(el => el.value);
  if (hari.length === 0) {
    alert('Silakan pilih minimal satu hari jadwal kursus.');
    return;
  }

  // Kumpulkan data
  const data = {
    nama: form.nama.value.trim(),
    wa: form.wa.value.trim(),
    jk: (form.querySelector('input[name="jk"]:checked') || {}).value || '',
    tempat: form.tempat.value.trim(),
    alamat: form.alamat.value.trim(),
    program: form.program.value,
    hari: hari.join(', '),
    waktu: (form.querySelector('input[name="waktu"]:checked') || {}).value || '',
  };

  const label = btn.textContent;
  btn.textContent = 'Mengirim...';
  btn.disabled = true;

  // Kirim ke Google Spreadsheet (via Apps Script)
  try {
    if (SHEET_URL && !SHEET_URL.startsWith('PASTE_')) {
      await fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams(data),
      });
    }
  } catch (err) {
    console.error('Gagal kirim ke Spreadsheet:', err);
  }

  // Susun pesan WhatsApp (data + pengingat lampiran berkas)
  const teks =
    `Halo Berlian Computer, saya ingin mendaftar kursus.%0A%0A` +
    `*Nama:* ${encodeURIComponent(data.nama)}%0A` +
    `*No. WhatsApp:* ${encodeURIComponent(data.wa)}%0A` +
    `*Jenis Kelamin:* ${encodeURIComponent(data.jk)}%0A` +
    `*Tempat Lahir:* ${encodeURIComponent(data.tempat)}%0A` +
    `*Alamat:* ${encodeURIComponent(data.alamat)}%0A` +
    `*Program:* ${encodeURIComponent(data.program)}%0A` +
    `*Jadwal:* ${encodeURIComponent(data.hari)} | ${encodeURIComponent(data.waktu)}%0A%0A` +
    `Berikut saya lampirkan berkas: KK, Pas Foto, KTP, Ijazah Terakhir, dan Bukti Transfer.`;

  window.open(`https://wa.me/${WA_NUMBER}?text=${teks}`, '_blank');

  // Feedback tombol
  btn.textContent = '✓ Terkirim! Buka WhatsApp...';
  btn.style.background = '#22c55e';
  setTimeout(() => {
    btn.textContent = label;
    btn.style.background = '';
    btn.disabled = false;
    form.reset();
  }, 3000);
}

// =====================
// SMOOTH ACTIVE NAV
// =====================
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}`
      ? 'var(--gold)'
      : '';
  });
});
