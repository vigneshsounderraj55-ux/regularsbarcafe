import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { fetchMenu, fetchGallery, fetchReviews, fetchContactInfo } from './supabase.js';
import { initAdmin } from './admin.js';

gsap.registerPlugin(ScrollTrigger);

const isTouch = window.matchMedia('(hover: none)').matches || window.innerWidth < 1024;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================
   PRELOADER
   ============================================ */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return Promise.resolve();

  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve });

    tl.to('.preloader__logo', { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }, 0)
      .from('.preloader__logo-line', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.2)
      .to('.preloader__tagline', { opacity: 1, duration: 0.8, ease: 'power2.out' }, 0.6)
      .to('.preloader__bar', { width: '100%', duration: 1.4, ease: 'power2.inOut' }, 0.3)
      .to('.preloader__inner', { opacity: 0, y: -20, duration: 0.6, ease: 'power2.in' }, '+=0.2')
      .to(preloader, {
        opacity: 0, duration: 0.8, ease: 'power2.inOut',
        onComplete: () => { preloader.classList.add('is-done'); },
      }, '-=0.3');

    // Safety: never let preloader get stuck
    setTimeout(() => {
      if (!preloader.classList.contains('is-done')) {
        preloader.classList.add('is-done');
        resolve();
      }
    }, 4500);
  });
}

/* ============================================
   SMOOTH SCROLL (Lenis)
   ============================================ */
function initLenis() {
  const lenis = prefersReduced ? null : new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Anchor links
  document.querySelectorAll('[data-link]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          if (lenis) {
            lenis.scrollTo(target, { offset: -60, duration: 1.5 });
          } else {
            target.scrollIntoView({ behavior: 'auto' });
          }
          closeMobileMenu();
        }
      }
    });
  });

  return lenis;
}

/* ============================================
   CUSTOM CURSOR
   ============================================ */
function initCursor() {
  if (isTouch) return;
  const cursor = document.getElementById('cursor');
  if (!cursor) return;
  const dot = cursor.querySelector('.cursor__dot');
  const ring = cursor.querySelector('.cursor__ring');

  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
  });

  const hoverables = 'a, button, .exp-card, .gallery__item, .instagram__item, .menu__tab, [data-link]';
  document.querySelectorAll(hoverables).forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });
}

/* ============================================
   NAVIGATION
   ============================================ */
function initNav() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 60);
  }, { passive: true });

  burger?.addEventListener('click', () => {
    const open = mobileMenu.classList.contains('is-open');
    if (open) closeMobileMenu();
    else openMobileMenu();
  });

  function openMobileMenu() {
    mobileMenu.classList.add('is-open');
    burger.classList.add('is-open');
    burger.setAttribute('aria-label', 'Close menu');
    burger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-label', 'Open menu');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach((s) => observer.observe(s));

  // Expose for lenis anchor handler
  window.__closeMobileMenu = closeMobileMenu;
}

function closeMobileMenu() {
  if (window.__closeMobileMenu) window.__closeMobileMenu();
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
  if (prefersReduced) {
    document.querySelectorAll('.reveal-y, .reveal-img').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.clipPath = 'none';
    });
    return;
  }

  // Reveal text elements
  gsap.utils.toArray('.reveal-y').filter((el) => !el.closest('.hero')).forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // Image reveal with clip-path
  gsap.utils.toArray('.reveal-img').forEach((el) => {
    gsap.to(el, {
      clipPath: 'inset(0 0 0 0)', duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
    const img = el.querySelector('img');
    if (img) {
      gsap.fromTo(img, { scale: 1.2 }, {
        scale: 1, duration: 1.4, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
    }
  });

  // Experience cards
  gsap.utils.toArray('[data-exp]').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0, y: 50, duration: 0.9, ease: 'power3.out', delay: i * 0.1,
      scrollTrigger: { trigger: card, start: 'top 85%', once: true },
    });
  });

  // Hero parallax
  const heroImg = document.querySelector('.hero__img');
  if (heroImg) {
    gsap.to(heroImg, {
      y: 150, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  // Floating elements
  if (!isTouch) {
    gsap.to('.hero__float--1', { y: 30, x: -20, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.hero__float--2', { y: -25, x: 15, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }

  // Stay section parallax
  const stayImg = document.querySelector('.stay__media img');
  if (stayImg) {
    gsap.fromTo(stayImg, { y: -30 }, {
      y: 30, ease: 'none',
      scrollTrigger: { trigger: '.stay', start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }
}

/* ============================================
   HERO INTRO
   ============================================ */
function initHeroIntro() {
  if (prefersReduced) {
    document.querySelectorAll('.hero .reveal-y').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  const tl = gsap.timeline({ delay: 0.2 });
  tl.fromTo('.hero__desc', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
    .fromTo('.hero__actions', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
    .from('.hero__scroll', { opacity: 0, duration: 1, ease: 'power2.out' }, '-=0.3');
}

/* ============================================
   MAGNETIC BUTTONS
   ============================================ */
function initMagnetic() {
  if (isTouch) return;
  document.querySelectorAll('.magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.6, ease: 'power3.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ============================================
   MENU
   ============================================ */
let menuData = [];

async function initMenu() {
  menuData = await fetchMenu();
  const tabs = document.querySelectorAll('.menu__tab');
  const grid = document.getElementById('menuGrid');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      renderMenu(tab.dataset.cat);
    });
  });

  renderMenu('coffee');
}

function renderMenu(category) {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;

  const items = menuData.filter((m) => m.category === category && m.is_available);
  grid.innerHTML = '';

  if (items.length === 0) {
    grid.innerHTML = '<p class="menu-empty">Items in this category will appear here soon.</p>';
    return;
  }

  items.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'menu-item';
    el.innerHTML = `
      <div class="menu-item__img">
        ${item.image_url ? `<img src="${item.image_url}" alt="${escapeHtml(item.name)}" loading="lazy" />` : ''}
      </div>
      <div class="menu-item__body">
        <h4 class="menu-item__name">${escapeHtml(item.name)}${item.is_featured ? '<span class="menu-item__tag">Favourite</span>' : ''}</h4>
        <p class="menu-item__desc">${escapeHtml(item.description || '')}</p>
      </div>
      <div class="menu-item__price">${item.price ? escapeHtml(item.price) : ''}</div>
    `;
    grid.appendChild(el);

    // Staggered reveal
    setTimeout(() => el.classList.add('is-visible'), 50 + i * 80);
  });
}

/* ============================================
   GALLERY
   ============================================ */
let galleryData = [];

async function initGallery() {
  galleryData = await fetchGallery();
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  grid.innerHTML = '';

  galleryData.forEach((img, i) => {
    const el = document.createElement('div');
    const sizeClass = img.size === 'tall' ? 'gallery__item--tall'
      : img.size === 'wide' ? 'gallery__item--wide'
      : img.size === 'big' ? 'gallery__item--big' : '';
    el.className = `gallery__item ${sizeClass}`;
    el.dataset.index = i;
    el.innerHTML = `<img src="${img.image_url}" alt="${escapeHtml(img.alt_text || 'Café photograph')}" loading="lazy" />`;
    el.addEventListener('click', () => openLightbox(i));
    grid.appendChild(el);

    // Reveal on scroll
    if (!prefersReduced) {
      ScrollTrigger.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: () => setTimeout(() => el.classList.add('is-visible'), i * 60),
      });
    } else {
      el.classList.add('is-visible');
    }
  });

  ScrollTrigger.refresh();
}

/* ============================================
   LIGHTBOX
   ============================================ */
let currentLightboxIndex = 0;

function initLightbox() {
  const lb = document.getElementById('lightbox');
  const close = document.getElementById('lightboxClose');
  const prev = document.getElementById('lightboxPrev');
  const next = document.getElementById('lightboxNext');

  close?.addEventListener('click', closeLightbox);
  prev?.addEventListener('click', () => navigateLightbox(-1));
  next?.addEventListener('click', () => navigateLightbox(1));

  lb?.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

function openLightbox(index) {
  currentLightboxIndex = index;
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  if (!lb || !img || !galleryData[index]) return;

  img.src = galleryData[index].image_url;
  img.alt = galleryData[index].alt_text || 'Café photograph';
  lb.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function navigateLightbox(dir) {
  currentLightboxIndex = (currentLightboxIndex + dir + galleryData.length) % galleryData.length;
  const img = document.getElementById('lightboxImg');
  if (!img) return;
  gsap.to(img, {
    opacity: 0, duration: 0.2, onComplete: () => {
      img.src = galleryData[currentLightboxIndex].image_url;
      gsap.to(img, { opacity: 1, duration: 0.3 });
    },
  });
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb?.classList.remove('is-open');
  document.body.style.overflow = '';
}

/* ============================================
   REVIEWS SLIDER
   ============================================ */
let reviewIndex = 0;
let reviewsData = [];

async function initReviews() {
  reviewsData = await fetchReviews();
  const track = document.getElementById('reviewsTrack');
  if (!track) return;

  track.innerHTML = '';
  reviewsData.forEach((r) => {
    const el = document.createElement('div');
    el.className = 'review-card';
    el.innerHTML = `
      <p class="review-card__quote">${escapeHtml(r.quote)}</p>
      <span class="review-card__source">${escapeHtml(r.source)}</span>
    `;
    track.appendChild(el);
  });

  document.getElementById('reviewPrev')?.addEventListener('click', () => slideReviews(-1));
  document.getElementById('reviewNext')?.addEventListener('click', () => slideReviews(1));

  // Auto-advance
  if (!prefersReduced && reviewsData.length > 1) {
    setInterval(() => slideReviews(1), 6000);
  }
}

function slideReviews(dir) {
  if (reviewsData.length === 0) return;
  reviewIndex = (reviewIndex + dir + reviewsData.length) % reviewsData.length;
  const track = document.getElementById('reviewsTrack');
  if (track) {
    track.style.transform = `translateX(-${reviewIndex * 100}%)`;
  }
}

/* ============================================
   INSTAGRAM GRID
   ============================================ */
function initInstagram() {
  const grid = document.getElementById('instagramGrid');
  if (!grid) return;

  const images = [
    'https://images.pexels.com/photos/14630362/pexels-photo-14630362.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/35213548/pexels-photo-35213548.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/34338427/pexels-photo-34338427.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/4920899/pexels-photo-4920899.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/36673264/pexels-photo-36673264.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/2251752/pexels-photo-2251752.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/7590623/pexels-photo-7590623.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/39047893/pexels-photo-39047893.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/5598273/pexels-photo-5598273.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/34258683/pexels-photo-34258683.jpeg?auto=compress&cs=tinysrgb&w=400',
  ];

  grid.innerHTML = '';
  images.forEach((url) => {
    const el = document.createElement('a');
    el.className = 'instagram__item';
    el.href = 'https://www.instagram.com/regularscoffeebar/';
    el.target = '_blank';
    el.rel = 'noopener';
    el.innerHTML = `<img src="${url}" alt="Regulars Coffee Bar on Instagram" loading="lazy" />`;
    grid.appendChild(el);
  });
}

/* ============================================
   CONTACT INFO
   ============================================ */
async function initContactInfo() {
  const info = await fetchContactInfo();

  const hoursEl = document.getElementById('contactHours');
  if (hoursEl) {
    hoursEl.innerHTML = escapeHtml(info.hours_line1) + (info.hours_line2 ? `<br>${escapeHtml(info.hours_line2)}` : '');
  }

  // Update direction links with maps query
  document.querySelectorAll('a[href*="google.com/maps/dir"]').forEach((link) => {
    const q = encodeURIComponent(info.google_maps_query);
    link.href = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
  });

  // Update map iframe
  const mapIframe = document.querySelector('.contact__map iframe');
  if (mapIframe) {
    mapIframe.src = `https://www.google.com/maps?q=${encodeURIComponent(info.google_maps_query)}&output=embed`;
  }
}

/* ============================================
   BACK TO TOP
   ============================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  btn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });
}

/* ============================================
   UTILITIES
   ============================================ */
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ============================================
   INIT
   ============================================ */
async function init() {
  initNav();
  initCursor();
  initMagnetic();
  initLightbox();
  initInstagram();
  initBackToTop();

  await initPreloader();

  initLenis();
  initHeroIntro();
  initScrollAnimations();

  // Load data-driven sections
  await Promise.all([
    initMenu(),
    initGallery(),
    initReviews(),
    initContactInfo(),
  ]);

  ScrollTrigger.refresh();

  // Admin (on admin page)
  initAdmin();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
