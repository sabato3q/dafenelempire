let q=1,cart=0;
const plus=document.getElementById("plus"),minus=document.getElementById("minus"),qty=document.getElementById("qty"),add=document.getElementById("add"),count=document.getElementById("cartCount");
if(plus)plus.onclick=()=>{q++;qty.textContent=q};
if(minus)minus.onclick=()=>{q=Math.max(1,q-1);qty.textContent=q};
if(add)add.onclick=()=>{cart+=q;if(count)count.textContent=cart;add.textContent="Added to Cart ✓";setTimeout(()=>add.textContent="Add to Cart",1400)};
document.querySelectorAll("#year").forEach(e=>e.textContent=new Date().getFullYear());
