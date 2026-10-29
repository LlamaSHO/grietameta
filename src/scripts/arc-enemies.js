/* Lógica de la vista (migrada tal cual desde el antiguo arc-enemigos.html).
   Se ejecuta al montar la vista; los listeners globales usan `signal` para
   limpiarse al salir de ella. */

import { fetchArcEnemies, arcItemImageUrl as itemImg, arcBotImageUrl } from "@/services/arcRaiders";

export function init({ root, signal }) {
  var THREAT_ORDER = ['Low','Moderate','High','Critical','Extreme'];
  var THREAT_ES = {Low:'Baja',Moderate:'Moderada',High:'Alta',Critical:'Crítica',Extreme:'Extrema'};
  var THREAT_VAR = {Low:'--t-low',Moderate:'--t-moderate',High:'--t-high',Critical:'--t-critical',Extreme:'--t-extreme'};
  var RARITY_ES = {common:'Común',uncommon:'Poco común',rare:'Raro',epic:'Épico',legendary:'Legendario'};
  var RARITY_VAR = {common:'--r-common',uncommon:'--r-uncommon',rare:'--r-rare',epic:'--r-epic',legendary:'--r-legendary'};
  var ACTION_VAR = {Vender:'--a-vender',Reciclar:'--a-reciclar',Guardar:'--a-guardar',Usar:'--a-usar'};

  var state = {enemies:[], search:'', threat:'', map:'', last:null};
  function $(id){ return document.getElementById(id); }
  function el(tag, cls, text){
    var e=document.createElement(tag);
    if(cls) e.className=cls;
    if(text!==undefined && text!==null) e.textContent=String(text);
    return e;
  }
  function fmt(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,'.'); }
  function tvar(t){ return 'var('+(THREAT_VAR[t]||'--t-low')+')'; }
  function img(src, alt, onerrorText, cls){
    var i=document.createElement('img');
    i.src=src; i.alt=alt; i.loading='lazy'; i.decoding='async';
    if(cls) i.className=cls;
    return i;
  }
  function picOrPlaceholder(box, src, name){
    var ph=el('span','ph',name.charAt(0));
    ph.setAttribute('aria-hidden','true');
    box.appendChild(ph);
    var i=img(src, '');
    i.alt='';
    i.addEventListener('load', function(){ if(ph.parentNode) ph.parentNode.removeChild(ph); });
    i.addEventListener('error', function(){ if(i.parentNode) i.parentNode.removeChild(i); });
    box.appendChild(i);
  }
  function itemThumb(id, hasImage, name){
    var box=el('span','ph-wrap');
    box.style.display='contents';
    if(hasImage){
      var i=img(itemImg(id), '');
      i.addEventListener('error', function(){
        var p=el('span','ph',name.charAt(0)); if(i.parentNode) i.parentNode.replaceChild(p,i);
      });
      return i;
    }
    return el('span','ph',name.charAt(0));
  }

  function matches(e){
    if(state.threat && e.threat!==state.threat) return false;
    if(state.map && e.maps.indexOf(state.map)<0) return false;
    if(state.search){
      var q=state.search.toLowerCase();
      var hay=(e.name+' '+e.type+' '+e.drops.map(function(d){return d.name;}).join(' ')).toLowerCase();
      if(hay.indexOf(q)<0) return false;
    }
    return true;
  }

  function buildChips(box, values, current, label, onPick){
    while(box.firstChild) box.removeChild(box.firstChild);
    [''].concat(values).forEach(function(v){
      var b=el('button','chip', v===''?'Todos':label(v));
      b.type='button';
      b.setAttribute('aria-pressed', String(v===current));
      b.addEventListener('click', function(){ onPick(v===current?'':v); });
      box.appendChild(b);
    });
  }

  function renderFilters(){
    var ts={}, ms={};
    state.enemies.forEach(function(e){ ts[e.threat]=1; e.maps.forEach(function(m){ ms[m]=1; }); });
    buildChips($('threats'), THREAT_ORDER.filter(function(t){return ts[t];}), state.threat,
      function(v){return THREAT_ES[v];}, function(v){ state.threat=v; render(); });
    buildChips($('maps'), Object.keys(ms).sort(), state.map,
      function(v){return v;}, function(v){ state.map=v; render(); });
  }

  function render(){
    renderFilters();
    var list=state.enemies.filter(matches);
    var grid=$('grid');
    while(grid.firstChild) grid.removeChild(grid.firstChild);
    $('count').textContent = list.length+' de '+state.enemies.length+' enemigos';
    $('status').hidden = list.length>0 || !state.enemies.length;
    if(!list.length && state.enemies.length){ $('status').textContent='Ningún enemigo coincide con los filtros.'; $('status').className='status'; }
    list.forEach(function(e){
      var c=el('button','card'); c.type='button';
      c.style.setProperty('--tc', tvar(e.threat));
      c.setAttribute('aria-label', e.name+', amenaza '+e.threatEs);
      var pic=el('span','pic'); pic.style.display='block';
      if(e.hasImage) picOrPlaceholder(pic, arcBotImageUrl(e.id), e.name);
      else pic.appendChild(el('span','ph',e.name.charAt(0)));
      c.appendChild(pic);
      var body=el('span','body'); body.style.display='block';
      body.appendChild(el('h2',null,e.name));
      body.appendChild(el('span','ty',e.type)).style.display='block';
      body.appendChild(el('span','threat','Amenaza '+e.threatEs));
      var mini=el('span','mini',e.drops.length+' botines · '+e.maps.length+(e.maps.length===1?' mapa':' mapas')); mini.style.display='block';
      body.appendChild(mini);
      c.appendChild(body);
      c.addEventListener('click', function(){ openSheet(e, c); });
      grid.appendChild(c);
    });
  }

  function section(parent, title){
    parent.appendChild(el('h3',null,title));
  }

  function openSheet(e, opener){
    state.last=opener||null;
    var sh=$('sheet');
    while(sh.firstChild) sh.removeChild(sh.firstChild);
    var close=el('button','close','×'); close.type='button'; close.setAttribute('aria-label','Cerrar');
    close.addEventListener('click', closeSheet);
    sh.appendChild(close);
    if(e.hasImage){
      var h=img(arcBotImageUrl(e.id),'Imagen de '+e.name,null,'hero');
      sh.appendChild(h);
    }
    var inn=el('div','in');
    var t=el('h2',null,e.name); t.id='m-title'; inn.appendChild(t);
    var sub=el('div','ty',e.type+' · '); sub.style.color='var(--ink-dim)';
    var th=el('span','threat','Amenaza '+e.threatEs); th.style.setProperty('--tc', tvar(e.threat)); th.style.marginTop='0';
    sub.appendChild(th); inn.appendChild(sub);
    inn.appendChild(el('p',null,e.description));

    section(inn,'Punto débil');
    var w=el('div','weak'); w.appendChild(el('b',null,'▸ ')); w.appendChild(document.createTextNode(e.weakness)); inn.appendChild(w);

    var f=el('div','facts');
    [['Dónde aparece', e.maps.join(', ')],['XP al destruirlo', e.destroyXp],['XP al saquearlo', e.lootXp]].forEach(function(p){
      var s=el('span'); s.appendChild(document.createTextNode(p[0]+': ')); s.appendChild(el('b',null,p[1])); f.appendChild(s);
    });
    section(inn,'Datos'); inn.appendChild(f);

    section(inn,'Mejores armas');
    inn.appendChild(el('p','armor',e.armor+'. '+e.armorNote));
    var wl=el('ul','rows');
    e.weapons.forEach(function(wp, idx){
      var li=el('li','row'+(idx===0?' best':''));
      li.appendChild(wp.icon?itemThumb(wp.icon,true,wp.name):el('span','ph',wp.name.charAt(0)));
      var tx=el('span','t'); tx.appendChild(document.createTextNode(wp.name));
      var s=el('small',null,wp.type+' · penetración '+wp.penEs.toLowerCase()); tx.appendChild(s);
      li.appendChild(tx); wl.appendChild(li);
    });
    inn.appendChild(wl);

    section(inn,'Mejores balas');
    var al=el('ul','rows');
    e.ammo.forEach(function(a){
      var li=el('li','row');
      li.appendChild(itemThumb(a.id,a.hasImage,a.name));
      var tx=el('span','t'); tx.appendChild(document.createTextNode(a.name));
      tx.appendChild(el('small',null,'Valor: '+fmt(a.value)+' por unidad'));
      li.appendChild(tx); al.appendChild(li);
    });
    inn.appendChild(al);

    section(inn,'Qué suelta ('+e.drops.length+')');
    var dl=el('ul','rows');
    e.drops.forEach(function(d){
      var li=el('li','row');
      li.appendChild(itemThumb(d.id,d.hasImage,d.name));
      var tx=el('span','t'); tx.appendChild(document.createTextNode(d.name));
      var s=el('small'); 
      var r=el('span','rar',RARITY_ES[(d.rarity||'').toLowerCase()]||d.rarity||''); 
      r.style.setProperty('--rc','var('+(RARITY_VAR[(d.rarity||'').toLowerCase()]||'--r-common')+')');
      s.appendChild(r); s.appendChild(document.createTextNode(' · '+fmt(d.value)+' · '));
      var a=el('span','ac',d.action); a.style.setProperty('--ac','var('+(ACTION_VAR[d.action]||'--a-vender')+')');
      s.appendChild(a); tx.appendChild(s);
      li.appendChild(tx); dl.appendChild(li);
    });
    inn.appendChild(dl);
    inn.appendChild(el('p','note','El botín listado es el de la lista de datos del juego: no todos los objetos caen siempre. La acción (Vender/Reciclar/Guardar/Usar) es la misma recomendación de la página de Objetos.'));
    sh.appendChild(inn);
    $('modal').classList.add('open');
    document.documentElement.style.overflow='hidden';
    close.focus();
  }
  function closeSheet(){
    $('modal').classList.remove('open');
    document.documentElement.style.overflow='';
    if(state.last && state.last.focus) state.last.focus();
  }
  $('modal').addEventListener('click', function(ev){ if(ev.target===$('modal')) closeSheet(); });
  document.addEventListener('keydown', function(ev){ if(ev.key==='Escape' && $('modal').classList.contains('open')) closeSheet(); }, {signal:signal});
  $('search').addEventListener('input', function(){ state.search=this.value.trim(); render(); });

  function fail(){
    var s=$('status'); s.hidden=false; s.className='status err';
    s.textContent='No se pudieron cargar los enemigos. Recarga la página en unos segundos.';
  }
  function load(){
    fetchArcEnemies()
    .then(function(d){
      if(!d || !Array.isArray(d.enemies)) throw new Error('formato');
      state.enemies=d.enemies;
      $('foot-data').textContent='Datos actualizados a '+(d.meta&&d.meta.sourceDate?d.meta.sourceDate:'—')+'. Las armas y balas recomendadas son orientativas.';
      $('status').hidden=true;
      render();
    }).catch(fail);
  }
  load();
}
