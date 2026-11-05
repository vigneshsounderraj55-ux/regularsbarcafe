import { supabase } from './supabase.js';

export function initAdmin() {
  if (!document.getElementById('loginForm')) return;

  const loginForm = document.getElementById('loginForm');
  const loginScreen = document.getElementById('loginScreen');
  const dashboard = document.getElementById('dashboard');
  const loginError = document.getElementById('loginError');
  const loginBtn = document.getElementById('loginBtn');

  // Check existing session
  supabase.auth.getSession().then(({ data }) => {
    if (data.session) showDashboard();
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = '';
    loginBtn.textContent = 'Signing in...';
    loginBtn.disabled = true;

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      loginError.textContent = 'Invalid email or password.';
      loginBtn.textContent = 'Sign In';
      loginBtn.disabled = false;
      return;
    }

    showDashboard();
  });

  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    dashboard.style.display = 'none';
    loginScreen.style.display = 'flex';
    loginBtn.textContent = 'Sign In';
    loginBtn.disabled = false;
  });

  // Panel navigation
  const navBtns = document.querySelectorAll('.dashboard__nav-btn');
  const panels = document.querySelectorAll('.dashboard__panel');
  const panelTitle = document.getElementById('panelTitle');

  navBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      navBtns.forEach((b) => b.classList.remove('is-active'));
      panels.forEach((p) => p.classList.remove('is-active'));
      btn.classList.add('is-active');
      const panel = document.getElementById(`panel-${btn.dataset.panel}`);
      panel.classList.add('is-active');
      panelTitle.textContent = btn.textContent;
    });
  });

  // Modal
  const modalOverlay = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  function closeModal() {
    modalOverlay.classList.remove('is-open');
    modalContent.innerHTML = '';
  }

  window.__adminModal = { open: (html) => { modalContent.innerHTML = html; modalOverlay.classList.add('is-open'); }, close: closeModal };

  function showDashboard() {
    loginScreen.style.display = 'none';
    dashboard.style.display = 'grid';
    loadMenu();
    loadGallery();
    loadReviews();
    loadContact();
  }

  // ---- MENU ----
  document.getElementById('addMenuItem')?.addEventListener('click', () => openMenuModal(null));

  async function loadMenu() {
    const { data, error } = await supabase.from('menu_items').select('*').order('sort_order', { ascending: true });
    if (error) return;
    const table = document.getElementById('menuTable');
    table.innerHTML = `
      <div class="table-row table-row--head">
        <div>Image</div><div>Name</div><div>Description</div><div>Price</div><div>Category</div><div>Actions</div>
      </div>
      ${data.map(item => `
        <div class="table-row">
          <div class="table-row__img">${item.image_url ? `<img src="${item.image_url}" alt="" />` : ''}</div>
          <div>
            <div class="table-row__name">${esc(item.name)} ${item.is_featured ? '<span class="badge">Fav</span>' : ''}</div>
            ${!item.is_available ? '<span class="badge badge--muted">Hidden</span>' : ''}
          </div>
          <div class="table-row__desc">${esc(item.description || '')}</div>
          <div class="table-row__price">${esc(item.price || '—')}</div>
          <div>${esc(item.category)}</div>
          <div class="table-row__actions">
            <button class="btn-admin btn-admin--ghost btn-admin--small" onclick="window.__editMenu('${item.id}')">Edit</button>
            <button class="btn-admin btn-admin--danger btn-admin--small" onclick="window.__deleteMenu('${item.id}')">Delete</button>
          </div>
        </div>
      `).join('')}
    `;
  }

  window.__editMenu = (id) => {
    supabase.from('menu_items').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      if (data) openMenuModal(data);
    });
  };

  window.__deleteMenu = async (id) => {
    if (!confirm('Delete this menu item?')) return;
    await supabase.from('menu_items').delete().eq('id', id);
    loadMenu();
  };

  function openMenuModal(item) {
    const isEdit = !!item;
    window.__adminModal.open(`
      <h2>${isEdit ? 'Edit' : 'Add'} Menu Item</h2>
      <form id="menuForm">
        <div class="form-group">
          <label>Name</label>
          <input type="text" id="mf_name" value="${item ? esc(item.name) : ''}" required />
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea id="mf_desc" rows="2">${item ? esc(item.description || '') : ''}</textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Price (e.g. ₹180)</label>
            <input type="text" id="mf_price" value="${item ? esc(item.price || '') : ''}" />
          </div>
          <div class="form-group">
            <label>Category</label>
            <select id="mf_cat">
              ${['coffee','cold-coffee','iced-beverages','tea','sandwiches','snacks'].map(c =>
                `<option value="${c}" ${item && item.category === c ? 'selected' : ''}>${c}</option>`
              ).join('')}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Image URL</label>
          <input type="text" id="mf_img" value="${item ? esc(item.image_url || '') : ''}" placeholder="https://..." />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Sort Order</label>
            <input type="number" id="mf_sort" value="${item ? item.sort_order : 0}" />
          </div>
          <div class="form-group">
            <label>Options</label>
            <div style="display:flex;gap:1rem;padding-top:0.5rem;">
              <label style="font-size:0.8rem;text-transform:none;letter-spacing:0;display:flex;align-items:center;gap:0.4rem;">
                <input type="checkbox" id="mf_avail" ${!item || item.is_available ? 'checked' : ''} /> Available
              </label>
              <label style="font-size:0.8rem;text-transform:none;letter-spacing:0;display:flex;align-items:center;gap:0.4rem;">
                <input type="checkbox" id="mf_feat" ${item && item.is_featured ? 'checked' : ''} /> Favourite
              </label>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button type="submit" class="btn-admin btn-admin--primary">${isEdit ? 'Update' : 'Create'}</button>
          <button type="button" class="btn-admin btn-admin--ghost" onclick="window.__adminModal.close()">Cancel</button>
        </div>
      </form>
    `);

    document.getElementById('menuForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        name: document.getElementById('mf_name').value.trim(),
        description: document.getElementById('mf_desc').value.trim(),
        price: document.getElementById('mf_price').value.trim() || null,
        image_url: document.getElementById('mf_img').value.trim() || null,
        category: document.getElementById('mf_cat').value,
        sort_order: parseInt(document.getElementById('mf_sort').value) || 0,
        is_available: document.getElementById('mf_avail').checked,
        is_featured: document.getElementById('mf_feat').checked,
      };

      if (isEdit) {
        await supabase.from('menu_items').update(payload).eq('id', item.id);
      } else {
        await supabase.from('menu_items').insert(payload);
      }
      window.__adminModal.close();
      loadMenu();
    });
  }

  // ---- GALLERY ----
  document.getElementById('addGalleryImage')?.addEventListener('click', () => openGalleryModal(null));

  async function loadGallery() {
    const { data } = await supabase.from('gallery_images').select('*').order('sort_order', { ascending: true });
    const grid = document.getElementById('galleryAdmin');
    if (!data || data.length === 0) {
      grid.innerHTML = '<p style="color:var(--text-muted);">No gallery images yet.</p>';
      return;
    }
    grid.innerHTML = data.map(img => `
      <div class="gallery-admin__item">
        <img src="${img.image_url}" alt="${esc(img.alt_text || '')}" />
        <div class="gallery-admin__overlay">
          <button class="btn-admin btn-admin--ghost btn-admin--small" onclick="window.__editGallery('${img.id}')">Edit</button>
          <button class="btn-admin btn-admin--danger btn-admin--small" onclick="window.__deleteGallery('${img.id}')">Delete</button>
        </div>
      </div>
    `).join('');
  }

  window.__editGallery = (id) => {
    supabase.from('gallery_images').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      if (data) openGalleryModal(data);
    });
  };

  window.__deleteGallery = async (id) => {
    if (!confirm('Delete this image?')) return;
    await supabase.from('gallery_images').delete().eq('id', id);
    loadGallery();
  };

  function openGalleryModal(item) {
    const isEdit = !!item;
    window.__adminModal.open(`
      <h2>${isEdit ? 'Edit' : 'Add'} Gallery Image</h2>
      <form id="galleryForm">
        <div class="form-group">
          <label>Image URL</label>
          <input type="text" id="gf_url" value="${item ? esc(item.image_url) : ''}" required placeholder="https://..." />
        </div>
        <div class="form-group">
          <label>Alt Text (description for accessibility)</label>
          <input type="text" id="gf_alt" value="${item ? esc(item.alt_text || '') : ''}" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Grid Size</label>
            <select id="gf_size">
              ${['standard','tall','wide','big'].map(s =>
                `<option value="${s}" ${item && item.size === s ? 'selected' : ''}>${s}</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Sort Order</label>
            <input type="number" id="gf_sort" value="${item ? item.sort_order : 0}" />
          </div>
        </div>
        <div class="modal-actions">
          <button type="submit" class="btn-admin btn-admin--primary">${isEdit ? 'Update' : 'Create'}</button>
          <button type="button" class="btn-admin btn-admin--ghost" onclick="window.__adminModal.close()">Cancel</button>
        </div>
      </form>
    `);

    document.getElementById('galleryForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        image_url: document.getElementById('gf_url').value.trim(),
        alt_text: document.getElementById('gf_alt').value.trim(),
        size: document.getElementById('gf_size').value,
        sort_order: parseInt(document.getElementById('gf_sort').value) || 0,
      };
      if (isEdit) {
        await supabase.from('gallery_images').update(payload).eq('id', item.id);
      } else {
        await supabase.from('gallery_images').insert(payload);
      }
      window.__adminModal.close();
      loadGallery();
    });
  }

  // ---- REVIEWS ----
  document.getElementById('addReview')?.addEventListener('click', () => openReviewModal(null));

  async function loadReviews() {
    const { data } = await supabase.from('reviews').select('*').order('sort_order', { ascending: true });
    const container = document.getElementById('reviewsAdmin');
    if (!data || data.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted);">No reviews yet.</p>';
      return;
    }
    container.innerHTML = data.map(r => `
      <div class="review-admin__card">
        <p class="review-admin__quote">"${esc(r.quote)}"</p>
        <span class="review-admin__source">${esc(r.source)} ${r.is_featured ? '' : '<span class="badge badge--muted">Hidden</span>'}</span>
        <div class="review-admin__actions">
          <button class="btn-admin btn-admin--ghost btn-admin--small" onclick="window.__editReview('${r.id}')">Edit</button>
          <button class="btn-admin btn-admin--danger btn-admin--small" onclick="window.__deleteReview('${r.id}')">Delete</button>
        </div>
      </div>
    `).join('');
  }

  window.__editReview = (id) => {
    supabase.from('reviews').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      if (data) openReviewModal(data);
    });
  };

  window.__deleteReview = async (id) => {
    if (!confirm('Delete this review?')) return;
    await supabase.from('reviews').delete().eq('id', id);
    loadReviews();
  };

  function openReviewModal(item) {
    const isEdit = !!item;
    window.__adminModal.open(`
      <h2>${isEdit ? 'Edit' : 'Add'} Review</h2>
      <form id="reviewForm">
        <div class="form-group">
          <label>Quote (customer feedback)</label>
          <textarea id="rf_quote" rows="4" required>${item ? esc(item.quote) : ''}</textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Source</label>
            <input type="text" id="rf_source" value="${item ? esc(item.source) : 'Google Review'}" />
          </div>
          <div class="form-group">
            <label>Sort Order</label>
            <input type="number" id="rf_sort" value="${item ? item.sort_order : 0}" />
          </div>
        </div>
        <div class="form-group">
          <label style="font-size:0.8rem;text-transform:none;letter-spacing:0;display:flex;align-items:center;gap:0.4rem;">
            <input type="checkbox" id="rf_feat" ${!item || item.is_featured ? 'checked' : ''} /> Show on website
          </label>
        </div>
        <div class="modal-actions">
          <button type="submit" class="btn-admin btn-admin--primary">${isEdit ? 'Update' : 'Create'}</button>
          <button type="button" class="btn-admin btn-admin--ghost" onclick="window.__adminModal.close()">Cancel</button>
        </div>
      </form>
    `);

    document.getElementById('reviewForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        quote: document.getElementById('rf_quote').value.trim(),
        source: document.getElementById('rf_source').value.trim() || 'Google Review',
        sort_order: parseInt(document.getElementById('rf_sort').value) || 0,
        is_featured: document.getElementById('rf_feat').checked,
      };
      if (isEdit) {
        await supabase.from('reviews').update(payload).eq('id', item.id);
      } else {
        await supabase.from('reviews').insert(payload);
      }
      window.__adminModal.close();
      loadReviews();
    });
  }

  // ---- CONTACT ----
  document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const success = document.getElementById('contactSuccess');
    success.textContent = '';
    const payload = {
      address_line1: document.getElementById('contactAddr1').value.trim(),
      address_line2: document.getElementById('contactAddr2').value.trim(),
      address_line3: document.getElementById('contactAddr3').value.trim(),
      phone: document.getElementById('contactPhone').value.trim(),
      instagram_url: document.getElementById('contactInstagram').value.trim(),
      google_maps_query: document.getElementById('contactMaps').value.trim(),
      hours_line1: document.getElementById('contactHours1').value.trim(),
      hours_line2: document.getElementById('contactHours2').value.trim(),
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('contact_info').update(payload).eq('id', 1);
    if (error) {
      success.textContent = 'Error saving. Please try again.';
      success.style.color = 'var(--error)';
    } else {
      success.textContent = 'Contact information saved successfully.';
      success.style.color = 'var(--success)';
      setTimeout(() => { success.textContent = ''; }, 3000);
    }
  });

  async function loadContact() {
    const { data } = await supabase.from('contact_info').select('*').eq('id', 1).maybeSingle();
    if (!data) return;
    document.getElementById('contactAddr1').value = data.address_line1 || '';
    document.getElementById('contactAddr2').value = data.address_line2 || '';
    document.getElementById('contactAddr3').value = data.address_line3 || '';
    document.getElementById('contactPhone').value = data.phone || '';
    document.getElementById('contactInstagram').value = data.instagram_url || '';
    document.getElementById('contactMaps').value = data.google_maps_query || '';
    document.getElementById('contactHours1').value = data.hours_line1 || '';
    document.getElementById('contactHours2').value = data.hours_line2 || '';
  }
}

function esc(str) {
  if (str == null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
