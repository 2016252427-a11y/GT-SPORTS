
const WHATSAPP = "27790952085";
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = n => `R${Number(n).toLocaleString("en-ZA")}`;

function productCard(p, prefix=""){
  const msg = encodeURIComponent(`Hi GT-Sport, I would like to order the ${p.team} ${p.kit} jersey (${p.category}). Please confirm available sizes and total price.`);
  return `<article class="product-card">
    <div class="product-image">${p.badge?`<span class="tag">${p.badge}</span>`:""}<img src="${prefix}assets/products/${p.image}" alt="${p.team} ${p.kit} jersey"></div>
    <div class="product-info"><small>${p.league}</small><h3>${p.team}</h3><div class="kit">${p.kit} Kit</div>
    <div class="product-bottom"><strong>${money(p.price)}</strong><a target="_blank" href="https://wa.me/${WHATSAPP}?text=${msg}">Order</a></div></div>
  </article>`;
}

function initHome(){
  const grid = $("#featuredGrid");
  if(grid) grid.innerHTML = window.GT_PRODUCTS.filter(p => p.badge).slice(0,8).map(p=>productCard(p,"")).join("");
}

function initShop(){
  const grid=$("#shopGrid"); if(!grid) return;
  const search=$("#searchInput"), cat=$("#categoryFilter"), league=$("#leagueFilter"), kit=$("#kitFilter"), count=$("#resultCount"), title=$("#resultsTitle");
  [...new Set(window.GT_PRODUCTS.map(p=>p.league))].sort().forEach(x=>league.insertAdjacentHTML("beforeend",`<option>${x}</option>`));
  function render(){
    const q=search.value.trim().toLowerCase();
    const items=window.GT_PRODUCTS.filter(p =>
      (!q || `${p.team} ${p.league} ${p.kit}`.toLowerCase().includes(q)) &&
      (cat.value==="all" || p.category===cat.value) &&
      (league.value==="all" || p.league===league.value) &&
      (kit.value==="all" || p.kit===kit.value)
    );
    grid.innerHTML=items.map(p=>productCard(p,"../")).join("");
    count.textContent=`${items.length} jersey options`;
    title.textContent=cat.value==="soccer"?"Soccer Jerseys":cat.value==="rugby"?"Rugby Jerseys":"All Jerseys";
  }
  [search,cat,league,kit].forEach(el=>el.addEventListener("input",render));
  if(location.hash==="#soccer") cat.value="soccer";
  if(location.hash==="#rugby") cat.value="rugby";
  render();
}

function initMenu(){
  const btn=$(".menu-btn"), links=$(".nav-links");
  if(btn) btn.addEventListener("click",()=>links.classList.toggle("open"));
}

function initChat(){
  const launch=$(".chat-launch"), panel=$(".chat-panel"), close=$(".chat-close"), form=$(".chat-form"), input=form?.querySelector("input"), body=$("#chatBody");
  if(!launch||!panel) return;
  launch.addEventListener("click",()=>panel.classList.toggle("open"));
  close.addEventListener("click",()=>panel.classList.remove("open"));
  function answer(text){
    const q=text.toLowerCase();
    if(q.includes("price")) return "Soccer jerseys are R600 each or 2 for R1,000. Rugby jerseys are R800 each or 2 for R1,500. Mystery boxes are R550 and grip sets are R140.";
    if(q.includes("deliver")) return "Orders normally take approximately 20–25 days from the supplier-order date. Supplier orders close on the 7th and 20th each month.";
    if(q.includes("bank")||q.includes("account")||q.includes("pay")) return "Capitec — Account name: GTSPORTS, account number: 2521725141, branch code: 470010. Use your full name as reference and send proof on WhatsApp.";
    if(q.includes("size")) return "Send your preferred team, kit and size on WhatsApp. GT-Sport will confirm availability before payment.";
    if(q.includes("order")||q.includes("how")) return "Choose a jersey, click Order, confirm size and total on WhatsApp, pay using your full name as reference, then send proof of payment.";
    return "I can help with prices, delivery, banking details, sizes and ordering. For anything else, please use the WhatsApp button.";
  }
  function send(text){
    if(!text.trim()) return;
    body.insertAdjacentHTML("beforeend",`<p class="user-msg">${text.replace(/[<>]/g,"")}</p>`);
    body.insertAdjacentHTML("beforeend",`<p class="bot">${answer(text)}</p>`);
    body.scrollTop=body.scrollHeight;
  }
  form.addEventListener("submit",e=>{e.preventDefault();send(input.value);input.value=""});
  $$(".quick-questions button").forEach(b=>b.addEventListener("click",()=>send(b.textContent)));
}

document.addEventListener("DOMContentLoaded",()=>{
  initMenu(); initHome(); initShop(); initChat();
  const y=$("#year"); if(y) y.textContent=new Date().getFullYear();
});
