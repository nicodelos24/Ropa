const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {JSDOM} = require('jsdom');
const html = fs.readFileSync('index.html', 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>/)[1];
function app(t) {
  const dom = new JSDOM(html.replace(/<script[\s\S]*?<\/script>/g, ''), {url:'http://localhost/?demo=1',runScripts:'outside-only',pretendToBeVisual:true});
  const w = dom.window;
  // jsdom has no layout/scroll or native inert implementation; browser harness covers those.
  w.scrollTo = ()=>{};
  w.HTMLElement.prototype.inert = false;
  const auth = {currentUser:null,getRedirectResult:()=>Promise.resolve(),onAuthStateChanged:()=>{}};
  w.firebase = {initializeApp(){},auth:()=>auth,firestore:()=>({settings(){},enablePersistence:()=>Promise.resolve(),collection(){throw Error('Unexpected cloud call in demo');}})};
  w.eval(script+'\nwindow.state={db:()=>db,profile:p=>FB.perfil=p};');
  t.after(()=>dom.window.close());
  return w;
}
const click = (w,s) => {const el=w.document.querySelector(s);assert.ok(el,s);el.click();return el;};
const tick = () => new Promise(r=>setImmediate(r));
test('all settings header SVGs are bounded, including both account paths and owner store',t=>{
  const w=app(t);
  for(const p of [{rol:'admin',nombre:'Demo',negocioId:'demo',demo:true},{rol:'owner',nombre:'Demo',negocioId:null,demo:true}]){
    w.state.profile(p);click(w,'[data-v="settings"]');
    assert.equal(w.document.querySelectorAll('.sett-card h3 > svg').length,0);
    assert.ok(w.document.querySelector('.sett-card h3 .sic svg'));
    assert.ok(w.document.querySelector('#outBtn.ghost svg'));
  }
});
test('changing status still requires confirmation and supports cancelling',async t=>{
  const w=app(t);w.openOrder('d3');click(w,'[data-st="paid"]');
  assert.equal(w.state.db().orders[2].estado,'due');click(w,'#cv-no');await tick();
  assert.equal(w.state.db().orders[2].estado,'due');
  click(w,'[data-st="paid"]');click(w,'#cv-yes');await tick();
  assert.equal(w.state.db().orders[2].estado,'paid');
  assert.equal(w.document.querySelector('[data-st="paid"]').getAttribute('aria-pressed'),'true');
  assert.equal(w.document.querySelector('#cq-plus'),null);
  assert.equal(w.document.body.style.getPropertyValue('--toast-space'),'0px');
});
test('quota controls keep zero floor, progress, and final paid state',t=>{
  const w=app(t);w.openOrder('d3');click(w,'#cq-minus');click(w,'#cq-minus');
  assert.equal(w.state.db().orders[2].cuotasPagadas,0);
  for(let i=0;i<3;i++)click(w,'#cq-plus');
  assert.equal(w.state.db().orders[2].estado,'paid');
  assert.equal(w.state.db().orders[2].cuotasPagadas,3);
});
for(const method of ['button','backdrop','Escape'])test(`lightbox ${method}: modal, duplicate guard, focus/inert/scroll restored`,t=>{
  const w=app(t),d=w.document,trigger=d.querySelector('#themeBtn');trigger.focus();
  d.querySelector('main').inert=true;d.body.style.overflow='auto';
  w.openLightbox('data:image/png;base64,eA==');w.openLightbox('another');
  const box=d.querySelector('.lightbox');
  assert.equal(d.querySelectorAll('.lightbox').length,1);
  assert.equal(box.getAttribute('role'),'dialog');assert.equal(box.getAttribute('aria-modal'),'true');
  assert.equal(d.activeElement,box.querySelector('button'));
  d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true}));
  assert.equal(d.activeElement,box.querySelector('button'));
  if(method==='Escape')d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape'}));
  else (method==='button'?box.querySelector('button'):box).click();
  assert.equal(d.querySelector('.lightbox'),null);assert.equal(d.activeElement,trigger);
  assert.equal(d.querySelector('main').inert,true);assert.equal(d.querySelector('nav').inert,false);
  assert.equal(d.body.style.overflow,'auto');
});
test('order card selection preserves horizontal transform and keyboard lightbox focus',t=>{
  const w=app(t),db=w.state.db();db.inventory[2].photo='data:image/png;base64,eA==';
  db.orders[2].items.push({name:'Vestido floral',price:1200,qty:1});
  w.openOrder('d3');const card=w.document.querySelector('.dcard');const transform=card.style.transform;
  card.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
  assert.equal(card.style.transform,transform);assert.equal(card.getAttribute('aria-pressed'),'true');
  card.click();click(w,'.lightbox button');assert.equal(w.document.activeElement,card);
});
test('inventory photo returns focus to its originating card',t=>{
  const w=app(t);w.state.db().inventory[0].photo='data:image/png;base64,eA==';
  click(w,'[data-v="inventory"]');const card=click(w,'.inv-card');click(w,'.lightbox button');
  assert.equal(w.document.activeElement,card);
});
test('notice rail reserves measured space and keeps validation visible with sheet open',t=>{
  const w=app(t),d=w.document;
  Object.defineProperty(d.querySelector('#toast'),'offsetHeight',{get:()=>48});
  w.toast('Todo borrado');assert.equal(d.body.style.getPropertyValue('--toast-space'),'48px');
  w.openEditor(null);assert.equal(d.body.style.getPropertyValue('--toast-space'),'0px');
  w.toast('Agrega al menos un producto','warn');assert.equal(d.body.style.getPropertyValue('--toast-space'),'48px');
  w.closeSheet();assert.equal(d.body.style.getPropertyValue('--toast-space'),'48px');
});
test('filter hint only when orders overflow; focusable filter strip',t=>{
  const w=app(t),d=w.document,chips=d.querySelector('#chips');
  Object.defineProperty(chips,'clientWidth',{value:300});Object.defineProperty(chips,'scrollWidth',{value:600});
  click(w,'[data-v="orders"]');w.updateFilterHint();assert.equal(d.querySelector('#filter-hint').hidden,false);
  click(w,'[data-v="settings"]');w.updateFilterHint();assert.equal(d.querySelector('#filter-hint').hidden,true);
  assert.equal(chips.tabIndex,0);
});
test('two destructive confirmations still both work on demo data',async t=>{
  const w=app(t);click(w,'[data-v="settings"]');click(w,'#resetBtn');click(w,'#cv-yes');await tick();
  assert.equal(w.document.querySelector('#cv-t').textContent,'Última confirmación');
  assert.ok(w.state.db().orders.length);click(w,'#cv-yes');await tick();
  assert.equal(w.state.db().orders.length,0);assert.match(w.document.querySelector('#toast').textContent,/Todo borrado/);
});
test('favicon exists and is included in next offline cache',()=>{
  assert.equal(fs.readFileSync('favicon.ico').readUInt32LE(0),65536);
  assert.match(html,/<link rel="icon" href="favicon.ico"/);
  assert.match(fs.readFileSync('sw.js','utf8'),/ropa-v33/);
  assert.match(fs.readFileSync('sw.js','utf8'),/\.\/favicon.ico/);
});
