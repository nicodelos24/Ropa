if(!['localhost','127.0.0.1','[::1]'].includes(location.hostname))throw Error('QA harness is local-only');
const frame=document.querySelector('#app'),out=document.querySelector('#results'),status=document.querySelector('#status');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
let results=[],errors=[];
const w=()=>frame.contentWindow,d=()=>frame.contentDocument;
function size(width){
  frame.style.width=width+'px';frame.style.height=(width===320?568:width===393?740:640)+'px';
  const scale=Math.min(1,(innerWidth-16)/width);frame.style.transform=`scale(${scale})`;
  document.querySelector('#stage').style.height=(parseInt(frame.style.height)*scale)+'px';
}
function theme(value){const btn=d().querySelector('#themeBtn');if(d().documentElement.dataset.theme!==value)btn.click();}
function record(name,ok,detail=''){results.push({name,ok,detail});out.textContent=JSON.stringify({failures:results.filter(r=>!r.ok),results,errors},null,2);if(!ok)console.error(name,detail);}
const rect=el=>el.getBoundingClientRect();
const click=sel=>{const el=d().querySelector(sel);if(!el)throw Error('Missing '+sel);el.click();return el;};
function color(value){const c=document.createElement('canvas');c.width=c.height=1;const ctx=c.getContext('2d');ctx.fillStyle=value;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].map((n,i)=>i===3?n/255:n);}
function blend(a,b){return a.slice(0,3).map((v,i)=>v*a[3]+b[i]*(1-a[3])).concat(1);}
function background(el){if(!el)return [255,255,255,1];const c=color(w().getComputedStyle(el).backgroundColor);return c[3]===1?c:blend(c,background(el.parentElement));}
function lum(c){return c.slice(0,3).map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;}).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0);}
function contrast(el){const bg=background(el),fg=blend(color(w().getComputedStyle(el).color),bg),a=lum(fg),b=lum(bg);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);}
function contrastCheck(label,selector){const els=[...d().querySelectorAll(selector)];record(label,els.length>0&&els.every(el=>contrast(el)>=4.5),els.map(el=>Number(contrast(el).toFixed(2))));}
function noOverflow(label){record(label,d().documentElement.scrollWidth<=w().innerWidth,{viewport:w().innerWidth,document:d().documentElement.scrollWidth});}
async function photoFixture(){
  click('[data-v="inventory"]');click('[data-id="di3"] [data-act="edit"]');
  const canvas=document.createElement('canvas');canvas.width=240;canvas.height=200;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#dbe5ff';ctx.fillRect(0,0,240,200);ctx.fillStyle='#2348b3';ctx.fillRect(75,25,90,140);
  const blob=await new Promise(r=>canvas.toBlob(r));const input=d().querySelector('#inv-photo'),dt=new (w().DataTransfer)();
  dt.items.add(new (w().File)([blob],'qa-product.png',{type:'image/png'}));input.files=dt.files;input.dispatchEvent(new (w().Event)('change',{bubbles:true}));await wait(120);click('#inv-save');
}
async function scene(name){
  if(name==='detail')w().openOrder('d3');
  else if(name==='editor') {w().openOrder('d3');click('#hEdit');}
  else if(name==='lightbox'){if(!d().querySelector('[data-id="di3"] img'))await photoFixture();w().openOrder('d3');click('.dcard');click('.dcard');}
  else if(name==='empty'){click('[data-v="settings"]');click('#resetBtn');click('#cv-yes');await wait(0);click('#cv-yes');await wait(0);click('[data-v="inventory"]');w().toast('Todo borrado');}
  else {if(d().querySelector('#sheet.open'))w().closeSheet();click(`[data-v="${name}"]`);}
  await wait(250);
}
async function matrix(){
  results=[];errors=[];document.querySelector('#matrix').disabled=true;
  try{
    for(const width of [320,393,1280])for(const mode of ['light','dark']){
      status.textContent=`Probando ${width} ${mode}`;size(width);w().demoBoot();theme(mode);await wait(250);
      const label=`${width}/${mode}`;
      await scene('settings');noOverflow(label+' ajustes sin overflow');
      record(label+' SVG de cuenta ≤19px',[...d().querySelectorAll('.sett-card h3 svg,#outBtn svg')].every(el=>rect(el).width<=19&&rect(el).height<=19));
      record(label+' etiquetas nav separadas',[...d().querySelectorAll('nav button')].every(el=>{const range=d().createRange();range.selectNodeContents(el.lastChild);const r=range.getBoundingClientRect(),b=rect(el);return r.left>=b.left&&r.right<=b.right;}));
      await scene('orders');record(label+' pista de filtros',d().querySelector('#chips').scrollWidth<=d().querySelector('#chips').clientWidth||!d().querySelector('#filter-hint').hidden);
      contrastCheck(label+' contador AA','.cbadge');
      await scene('clients');contrastCheck(label+' iniciales AA','.avatar');
      await scene('detail');noOverflow(label+' detalle sin overflow');
      record(label+' estados ≥44px',[...d().querySelectorAll('.strow button')].every(el=>rect(el).height>=43.99&&el.offsetHeight>=44),[...d().querySelectorAll('.strow button')].map(el=>({height:rect(el).height,layout:el.offsetHeight})));
      contrastCheck(label+' estados AA','.strow button');contrastCheck(label+' cuotas AA','.cqbtn');contrastCheck(label+' total AA','.totalbar b');
      click('[data-st="paid"]');record(label+' confirmar antes de cambiar',!!d().querySelector('#cov.open')||d().querySelector('#cov').style.display==='flex');click('#cv-no');await wait(200);
      click('#cq-minus');record(label+' cuota menor',d().querySelector('.quota-progress b').textContent==='0 de 3');click('#cq-plus');
      click('[data-st="paid"]');click('#cv-yes');await wait(200);record(label+' estado cambiado confirmado',d().querySelector('[data-st="paid"]').getAttribute('aria-pressed')==='true');
      record(label+' éxito oculto en hoja',w().getComputedStyle(d().querySelector('#toast')).visibility==='hidden');
      await scene('editor');contrastCheck(label+' precios editor AA','.invpick p');
      const chosen=d().querySelectorAll('.invpick button');chosen[0].click();chosen[1].click();click('#saveBtn');await wait(200);
      await scene('detail');record(label+' edición conserva tres productos',d().querySelectorAll('.dcard').length===3);
      const card=d().querySelector('.dcard'),before=rect(card);card.click();const after=rect(card);record(label+' selección sin salto',Math.abs(before.x-after.x)<1&&Math.abs(before.y-after.y)<1);noOverflow(label+' tres productos sin overflow');
      w().closeSheet();await photoFixture();w().openOrder('d3');click('.dcard');const trigger=click('.dcard');await wait(200);
      const box=d().querySelector('.lightbox');record(label+' foto modal y foco',box?.getAttribute('aria-modal')==='true'&&d().activeElement===box.querySelector('button'));
      d().dispatchEvent(new (w().KeyboardEvent)('keydown',{key:'Tab',cancelable:true}));record(label+' Tab contenido',d().activeElement===box.querySelector('button'));
      click('.lbx');record(label+' retorno de foco',d().activeElement===trigger);
      w().closeSheet();await scene('empty');const notice=rect(d().querySelector('#toast')),empty=rect(d().querySelector('.empty'));
      record(label+' aviso no tapa vacío',notice.bottom<=empty.top);noOverflow(label+' vacío sin overflow');
      await wait(200);
    }
    const response=await fetch('../favicon.ico');record('favicon HTTP 200',response.status===200);
    status.textContent=`${results.filter(r=>r.ok).length}/${results.length} OK · ${errors.length} errores JS`;
  }catch(e){errors.push(e.stack);status.textContent='FALLÓ: '+e.message;out.textContent=JSON.stringify({results,errors},null,2);}
  document.querySelector('#matrix').disabled=false;
}
frame.onload=()=>{w().addEventListener('error',e=>{errors.push(e.message);});w().addEventListener('unhandledrejection',e=>{errors.push(String(e.reason));});size(320);theme('light');status.textContent='Lista';};
document.querySelector('#width').onchange=e=>size(Number(e.target.value));
document.querySelector('#theme').onchange=e=>theme(e.target.value);
document.querySelector('#matrix').onclick=matrix;
document.querySelector('#reset').onclick=()=>{w().closeSheet();w().demoBoot();size(Number(document.querySelector('#width').value));theme(document.querySelector('#theme').value);};
document.querySelectorAll('[data-scene]').forEach(b=>b.onclick=()=>scene(b.dataset.scene));
window.addEventListener('resize',()=>size(parseInt(frame.style.width)));
size(320);
