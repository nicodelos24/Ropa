const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('/home/nico/Documents/GitHub/Ropa/.worktrees/ux-v34/node_modules/jsdom');
const html=fs.readFileSync(process.env.APP_HTML||'/home/nico/Documents/GitHub/Ropa/.worktrees/ux-v34/index.html','utf8');
const script=html.match(/<script>([\s\S]*)<\/script>/)[1];
const PHOTO='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j0WQAAAAASUVORK5CYII=';
function app(t){
 const dom=new JSDOM(html.replace(/<script[\s\S]*?<\/script>/g,''),{url:'http://127.0.0.1:8774/?demo=1',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window; w.scrollTo=()=>{};w.HTMLElement.prototype.inert=false;
 const auth={currentUser:null,getRedirectResult:()=>Promise.resolve(),onAuthStateChanged:()=>{}};
 w.firebase={initializeApp(){},auth:()=>auth,firestore:()=>({settings(){},enablePersistence:()=>Promise.resolve(),collection(){throw Error('Unexpected cloud access');}})};
 w.eval(script+'\nwindow.qa={db:()=>db,persist:()=>save(),reload:()=>{db=JSON.parse(localStorage.getItem(KEY));}, photoStub:d=>{compressPhoto=(file,cb)=>cb(d);}};');
 t.after(()=>w.close());return w;
}
function click(w,s){const e=w.document.querySelector(s);assert.ok(e,s);e.click();return e;}
function input(w,s,v){const e=w.document.querySelector(s);assert.ok(e,s);e.value=v;e.dispatchEvent(new w.Event('input',{bubbles:true}));}
function cancel(w){const e=[...w.document.querySelectorAll('#sheet button')].find(e=>e.textContent.trim()==='Cancelar');assert.ok(e);e.click();}
function stored(w){return JSON.parse(w.localStorage.getItem('ropa_data_v2'));}
function diag(t,data){t.diagnostic(JSON.stringify(data));}
const tick=()=>new Promise(r=>setImmediate(r));
test('F1: two manual rows of same name retain both prices, total and storage',t=>{
 const w=app(t),d=w.document;w.openEditor(null);click(w,'[data-m="man"]');
 click(w,'#addp');input(w,'.pn[data-i="0"]','Remera');input(w,'.pp[data-i="0"]','100');
 click(w,'#addp');input(w,'.pn[data-i="1"]','Remera');input(w,'.pp[data-i="1"]','200');
 const rows=d.querySelectorAll('#plist .prow').length,preview=d.querySelector('#ftotal').textContent,count=d.querySelector('#fpick')?.textContent||'(contador ausente en baseline)';
 input(w,'#f-cliente','QA Sintético duplicados');click(w,'#saveBtn');
 const o=w.qa.db().orders.at(-1),disk=stored(w).orders.at(-1);w.openEditor(o);
 diag(t,{rows,preview,count,saved:o.items,stored:disk.items,reopened:d.querySelectorAll('#plist .prow').length});
 assert.equal(o.items.reduce((s,i)=>s+i.price*i.qty,0),300,'two displayed lines must not silently lose the second');
 assert.equal(o.items.length,2);assert.equal(disk.items.length,2);
});
test('F2: inventory decimal locale value must not silently become 100x larger',t=>{
 const w=app(t),it=w.qa.db().inventory[0];w.openInvEditor(it);input(w,'#inv-price','1.200,50');click(w,'#inv-save');
 diag(t,{savedPrice:it.price,persistedPrice:stored(w).inventory[0].price,toast:w.document.querySelector('#toast').textContent,sheetOpen:w.document.querySelector('#sheet').classList.contains('open')});
 assert.equal(it.price,1200.50,'either parse locale decimal or reject it, not store 120050');
});
test('F3a: remove photo then Cancel must preserve original and subsequent persistence',t=>{
 const w=app(t),it=w.qa.db().inventory[0];it.photo=PHOTO;w.qa.persist();w.openInvEditor(it);
 click(w,'#inv-photo-del');const immediately=it.photo;cancel(w);w.openInvEditor(it);const reopened=!!w.document.querySelector('#inv-prev img');cancel(w);
 const beforeOtherSave=stored(w).inventory[0].photo;w.qa.persist();
 diag(t,{immediately,reopened,storageBeforeOtherSaveHasPhoto:!!beforeOtherSave,storageAfterOtherSaveHasPhoto:!!stored(w).inventory[0].photo});
 assert.equal(it.photo,PHOTO,'Cancel must roll back live object');
});
test('F3b: attach photo then Cancel must preserve previous null (compression stub only)',t=>{
 const w=app(t),it=w.qa.db().inventory[0];assert.equal(it.photo,null);w.qa.persist();w.qa.photoStub(PHOTO);w.openInvEditor(it);
 const f=w.document.querySelector('#inv-photo');Object.defineProperty(f,'files',{value:[new w.File(['synthetic'],'qa.png',{type:'image/png'})]});f.dispatchEvent(new w.Event('change',{bubbles:true}));
 const immediate=it.photo;cancel(w);w.openInvEditor(it);const reopened=!!w.document.querySelector('#inv-prev img');cancel(w);w.qa.persist();
 diag(t,{immediateHasPhoto:!!immediate,reopened,persistedHasPhoto:!!stored(w).inventory[0].photo});
 assert.equal(it.photo,null,'Cancel must not retain attachment on live object');
});
test('F4: deleting inventory keeps photo of saved order as promised',async t=>{
 const w=app(t),db=w.qa.db(),it=db.inventory[0],o=db.orders[0];it.photo=PHOTO;o.items[0].photo=PHOTO;w.qa.persist();
 w.openOrder(o.id);const before=w.document.querySelector('.dcard').dataset.ph;const original=JSON.stringify(o);
 w.closeSheet();click(w,'[data-v="inventory"]');click(w,`[data-act="del"][data-id="${it.id}"]`);
 const promise=w.document.querySelector('#cv-p').textContent;click(w,'#cv-yes');await tick();
 w.openOrder(o.id);const after=w.document.querySelector('.dcard').dataset.ph;
 diag(t,{promise,photoBefore:!!before,photoAfter:!!after,detailImageCount:w.document.querySelectorAll('.dcard img').length,orderUnchanged:JSON.stringify(o)===original,itemPhotoStillStored:stored(w).orders[0].items[0].photo===PHOTO,inventoryDeleted:!db.inventory.some(x=>x.id===it.id)});
 assert.equal(after,PHOTO,'saved item photo must remain visible after deleting inventory');
});
for(const tab of ['inv','man'])test(`control: mixed rows, quantity 2 and zero price survive toggles/save ${tab}/reopen/local reload`,t=>{
 const w=app(t),d=w.document,o=w.qa.db().orders.find(x=>x.id==='d4');w.openEditor(o);click(w,'[data-m="inv"]');click(w,'.invpick button[data-iid="di1"]');click(w,'[data-m="man"]');
 click(w,'#addp');input(w,'.pn[data-i="2"]','QA Gratis');input(w,'.pp[data-i="2"]','0');click(w,'[data-m="inv"]');click(w,'[data-m="man"]');if(tab==='inv')click(w,'[data-m="inv"]');
 const preview=d.querySelector('#ftotal').textContent;click(w,'#saveBtn');w.qa.reload();const saved=w.qa.db().orders.find(x=>x.id==='d4');w.openEditor(saved);
 diag(t,{preview,items:saved.items,reopenedTotal:d.querySelector('#ftotal').textContent,rows:d.querySelectorAll('#plist .prow').length});
 assert.equal(saved.items.length,3);assert.equal(saved.items.reduce((s,i)=>s+i.price*i.qty,0),1700);assert.equal(saved.items[0].qty,2);assert.equal(saved.items[2].price,0);assert.equal(d.querySelector('#ftotal').textContent,preview);
});
test('control: remove photo with Save and attachment with Save persist/reopen',t=>{
 const w=app(t);let it=w.qa.db().inventory[0];it.photo=PHOTO;w.qa.persist();w.openInvEditor(it);click(w,'#inv-photo-del');click(w,'#inv-save');w.qa.reload();it=w.qa.db().inventory[0];w.openInvEditor(it);
 assert.equal(it.photo,null);assert.equal(w.document.querySelector('#inv-prev img'),null);cancel(w);
 w.qa.photoStub(PHOTO);w.openInvEditor(it);const f=w.document.querySelector('#inv-photo');Object.defineProperty(f,'files',{value:[new w.File(['x'],'qa.png',{type:'image/png'})]});f.dispatchEvent(new w.Event('change'));click(w,'#inv-save');w.qa.reload();it=w.qa.db().inventory[0];w.openInvEditor(it);
 assert.equal(it.photo,PHOTO);assert.ok(w.document.querySelector('#inv-prev img'));diag(t,{removeSavedAndReopened:true,attachSavedAndReopened:true,compressorStubbed:true});
});
