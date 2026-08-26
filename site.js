const db = window.dafenelSupabase;
const DEFAULT_IMAGE = 'assets/herbal-detox-tea.jpg';

function esc(value='') {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

async function loadFeaturedProduct() {
  const { data, error } = await db.from('products').select('*').eq('available', true).order('created_at', { ascending: true }).limit(1);
  const p = data?.[0];
  if (error || !p) return;
  document.querySelectorAll('[data-product-name]').forEach(e => e.textContent = p.name);
  document.querySelectorAll('[data-product-price]').forEach(e => e.textContent = `GH₵${Number(p.price).toFixed(0)}`);
  document.querySelectorAll('[data-product-description]').forEach(e => e.textContent = p.description || 'Ginger and other healthy herbs for a refreshing tea experience.');
  document.querySelectorAll('[data-product-image]').forEach(e => { e.src = p.image_url || DEFAULT_IMAGE; e.alt = p.name; });
  window.dafenelFeaturedProduct = p;
}

async function loadShop() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  const { data, error } = await db.from('products').select('*').eq('available', true).order('created_at', { ascending: true });
  if (error) { grid.innerHTML = '<p class="empty">Products are temporarily unavailable. Please try again.</p>'; return; }
  grid.innerHTML = (data || []).map(p => `
    <article class="product-card">
      <img src="${esc(p.image_url || DEFAULT_IMAGE)}" alt="${esc(p.name)}">
      <div class="product-card-body">
        <div class="eyebrow">DAFENEL'S EMPIRE</div>
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.description || '')}</p>
        <div class="shop-price">GH₵${Number(p.price).toFixed(0)} <small>per pack</small></div>
        <button class="add-order" data-id="${p.id}">Order on WhatsApp</button>
      </div>
    </article>`).join('') || '<p class="empty">No products available yet.</p>';
  grid.querySelectorAll('.add-order').forEach(btn => btn.onclick = () => {
    const p = data.find(x => x.id === btn.dataset.id);
    const text = `Hello Dafenel's Empire, I would like to order ${p.name} for GH₵${Number(p.price).toFixed(0)}.`;
    window.open(`https://wa.me/233596502626?text=${encodeURIComponent(text)}`, '_blank');
  });
}

async function loadTestimonials() {
  const box = document.getElementById('testimonialGrid');
  if (!box) return;
  const { data, error } = await db.from('testimonials').select('*').eq('approved', true).order('created_at', { ascending: false });
  if (error) { box.innerHTML = '<p class="empty">Testimonials are temporarily unavailable.</p>'; return; }
  box.innerHTML = (data || []).map(t => `<article class="testimonial-card"><div class="stars">★★★★★</div><p>“${esc(t.message)}”</p><strong>${esc(t.customer_name)}</strong></article>`).join('') || '<p class="empty">Customer testimonials will appear here soon.</p>';
}

document.querySelectorAll('#year').forEach(e => e.textContent = new Date().getFullYear());
loadFeaturedProduct();
loadShop();
loadTestimonials();
