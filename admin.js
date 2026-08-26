const db = window.dafenelSupabase;
const $ = id => document.getElementById(id);
let editingId = null;

function money(v){ return `GH₵${Number(v || 0).toFixed(0)}`; }
function esc(value=''){ return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function showPanel(id){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  $(id).classList.add('active');
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===id));
}
async function ensureAdmin(){
  const { data: { user } } = await db.auth.getUser();
  if(!user) return false;
  const { data, error } = await db.from('profiles').select('role').eq('id',user.id).maybeSingle();
  if(error || data?.role !== 'admin') { await db.auth.signOut(); alert('This account is not an admin.'); return false; }
  return true;
}
async function loadStats(){
  const [{count:pc},{count:oc},{count:tc}] = await Promise.all([
    db.from('products').select('*',{count:'exact',head:true}),
    db.from('orders').select('*',{count:'exact',head:true}),
    db.from('testimonials').select('*',{count:'exact',head:true})
  ]);
  $('productCount').textContent=pc||0; $('orderCount').textContent=oc||0; $('testimonialCount').textContent=tc||0;
}
async function loadProducts(){
  const {data,error}=await db.from('products').select('*').order('created_at',{ascending:false});
  if(error){$('productList').innerHTML=`<div class="empty">${esc(error.message)}</div>`;return;}
  $('productList').innerHTML=(data||[]).map(p=>`<div class="product-row"><img src="${esc(p.image_url||'assets/herbal-detox-tea.jpg')}"><div><h3>${esc(p.name)}</h3><p>${money(p.price)} · ${p.available?'Available':'Out of stock'}</p></div><div class="actions"><button onclick="editProduct('${p.id}')">Edit</button><button class="danger" onclick="deleteProduct('${p.id}')">Delete</button></div></div>`).join('')||'<div class="empty">No products yet.</div>';
}
async function loadOrders(){
  const {data,error}=await db.from('orders').select('*').order('created_at',{ascending:false});
  if(error){$('orderList').innerHTML=`<div class="empty">${esc(error.message)}</div>`;return;}
  $('orderList').innerHTML=(data||[]).map(o=>`<div class="order-row"><div><strong>${esc(o.customer_name||'Customer')}</strong><br>${esc(o.customer_phone||'No phone')}<br><small>${new Date(o.created_at).toLocaleString()}</small><p>Total: <b>${money(o.total)}</b></p></div><div><select onchange="updateOrder('${o.id}',this.value)">${['pending','confirmed','processing','completed','cancelled'].map(s=>`<option ${o.status===s?'selected':''}>${s}</option>`).join('')}</select><pre>${esc(JSON.stringify(o.items,null,2))}</pre></div></div>`).join('')||'<div class="empty">No orders yet.</div>';
}
async function loadTestimonials(){
  const {data,error}=await db.from('testimonials').select('*').order('created_at',{ascending:false});
  if(error){$('testimonialList').innerHTML=`<div class="empty">${esc(error.message)}</div>`;return;}
  $('testimonialList').innerHTML=(data||[]).map(t=>`<div class="testimonial-row"><span><b>${esc(t.customer_name)}</b><br>${esc(t.message)}<br><small>${t.approved?'Approved':'Hidden'}</small></span><div><button onclick="toggleTestimonial('${t.id}',${!t.approved})">${t.approved?'Hide':'Approve'}</button><button class="danger" onclick="deleteTestimonial('${t.id}')">Delete</button></div></div>`).join('')||'<div class="empty">No testimonials yet.</div>';
}
async function refresh(){await Promise.all([loadStats(),loadProducts(),loadOrders(),loadTestimonials()]);}
window.editProduct=async id=>{
  const {data}=await db.from('products').select('*').eq('id',id).single(); if(!data)return;
  editingId=id; $('productId').value=id; $('productName').value=data.name; $('productPrice').value=data.price; $('productDescription').value=data.description||''; $('productImage').value=data.image_url||''; $('productAvailable').checked=data.available; $('editorTitle').textContent='Edit Product'; showPanel('productEditor');
};
window.deleteProduct=async id=>{if(confirm('Delete this product?')){await db.from('products').delete().eq('id',id);await refresh();}};
window.updateOrder=async(id,status)=>{await db.from('orders').update({status}).eq('id',id);await refresh();};
window.toggleTestimonial=async(id,approved)=>{await db.from('testimonials').update({approved}).eq('id',id);await refresh();};
window.deleteTestimonial=async id=>{if(confirm('Delete this testimonial?')){await db.from('testimonials').delete().eq('id',id);await refresh();}};

$('loginBtn').onclick=async()=>{
  const email=$('email').value.trim(), password=$('password').value;
  const {error}=await db.auth.signInWithPassword({email,password});
  if(error){alert(error.message);return;}
  if(await ensureAdmin()){ $('login').classList.add('hidden'); $('dashboard').classList.remove('hidden'); await refresh(); }
};
$('logout').onclick=async()=>{await db.auth.signOut();location.reload();};
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>showPanel(b.dataset.tab));
$('newProduct').onclick=()=>{$('productForm').reset();editingId=null;$('productAvailable').checked=true;$('editorTitle').textContent='Add Product';showPanel('productEditor');};
$('backProducts').onclick=$('cancelEdit').onclick=()=>showPanel('products');
$('productForm').onsubmit=async e=>{
  e.preventDefault();
  const payload={name:$('productName').value.trim(),price:Number($('productPrice').value),description:$('productDescription').value.trim(),image_url:$('productImage').value.trim()||'assets/herbal-detox-tea.jpg',available:$('productAvailable').checked,updated_at:new Date().toISOString()};
  const result=editingId?await db.from('products').update(payload).eq('id',editingId):await db.from('products').insert(payload);
  if(result.error){alert(result.error.message);return;} showPanel('products'); await refresh();
};
$('testimonialForm').onsubmit=async e=>{e.preventDefault();const result=await db.from('testimonials').insert({customer_name:$('customerName').value.trim(),message:$('testimonialText').value.trim(),approved:true});if(result.error)alert(result.error.message);else{e.target.reset();await refresh();}};

(async()=>{if(await ensureAdmin()){$('login').classList.add('hidden');$('dashboard').classList.remove('hidden');await refresh();}})();
