/* Lógica de la vista (migrada tal cual desde el antiguo arc-raiders.html).
   Se ejecuta al montar la vista; los listeners globales usan `signal` para
   limpiarse al salir de ella. */

import { fetchArcItems, arcItemImageUrl as imgUrl } from "@/services/arcRaiders";

export function init({ root, signal }) {
  var PER_PAGE = 48;

  var TYPE_ES = {
    'Assault Rifle':'Rifle de asalto','SMG':'Subfusil','Pistol':'Pistola','Battle Rifle':'Rifle de batalla','Shotgun':'Escopeta',
    'LMG':'Ametralladora ligera','Sniper Rifle':'Rifle de francotirador','Hand Cannon':'Cañón de mano',
    'Quick Use':'Uso rápido','Augment':'Aumento','Shield':'Escudo','Ammunition':'Munición','Modification':'Modificación',
    'Refined Material':'Material refinado','Basic Material':'Material básico','Topside Material':'Material de la superficie','Nature':'Naturaleza',
    'Recyclable':'Reciclable','Trinket':'Baratija','Special':'Especial','Misc':'Varios','Blueprint':'Plano','Key':'Llave'
  };
  function typeEs(t){ return TYPE_ES[t] || t || ''; }

  // Categorías amplias: agrupan los tipos de objeto en pocas familias.
  var GROUPS = {
    'Armas': ['Assault Rifle','SMG','Pistol','Battle Rifle','Shotgun','LMG','Sniper Rifle','Hand Cannon'],
    'Equipo y consumibles': ['Quick Use','Augment','Shield','Ammunition','Modification'],
    'Materiales': ['Refined Material','Basic Material','Topside Material','Nature'],
    'Botín': ['Recyclable','Trinket','Special','Misc'],
    'Planos y llaves': ['Blueprint','Key']
  };
  var GROUP_ORDER = ['Armas','Equipo y consumibles','Materiales','Botín','Planos y llaves','Otros'];
  var TYPE_TO_GROUP = {};
  Object.keys(GROUPS).forEach(function(g){ GROUPS[g].forEach(function(t){ TYPE_TO_GROUP[t]=g; }); });
  function groupOf(t){ return TYPE_TO_GROUP[t] || 'Otros'; }

  var RARITY_COLORS = {common:'--r-common',uncommon:'--r-uncommon',rare:'--r-rare',epic:'--r-epic',legendary:'--r-legendary'};
  var RARITY_ES = {common:'Común',uncommon:'Poco común',rare:'Raro',epic:'Épico',legendary:'Legendario'};
  var RARITY_ORDER = ['common','uncommon','rare','epic','legendary'];
  var ACTIONS = ['Vender','Reciclar','Guardar','Usar'];
  var ACTION_COLORS = {Vender:'--a-vender',Reciclar:'--a-reciclar',Guardar:'--a-guardar',Usar:'--a-usar'};

  var state = {items:[], meta:null, search:'', action:'', rarity:'', group:'', pageNo:1, loading:true, failed:false};
  var $ = function(id){return document.getElementById(id);};
  var grid=$('grid'), more=$('more'), statusEl=$('status'), countEl=$('count');
  var pager=$('pager'), pageSel=$('pageSel'), prevBtn=$('prev'), nextBtn=$('next');
  var lastFocus=null;

  function el(tag, cls, text){
    var n=document.createElement(tag);
    if(cls) n.className=cls;
    if(text!==undefined && text!==null) n.textContent=text;
    return n;
  }
  function norm(s){ return (s||'').toString().normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase(); }
  function rarityKey(r){ return (r||'').toString().toLowerCase(); }
  function rarityVar(r){ return 'var(' + (RARITY_COLORS[rarityKey(r)]||'--r-common') + ')'; }
  function rarityLabel(r){ return RARITY_ES[rarityKey(r)] || r || '—'; }
  function actionVar(a){ return 'var(' + (ACTION_COLORS[a]||'--ink-dim') + ')'; }
  function fmt(n){ return typeof n==='number' ? n.toLocaleString('es-ES') : '—'; }

  function setStatus(msg, isErr){
    if(!msg){ statusEl.hidden=true; return; }
    statusEl.hidden=false;
    statusEl.textContent=msg;
    statusEl.className='status'+(isErr?' err':'');
  }

  function makeArt(item, cls){
    var art=el('div', cls||'art');
    art.style.setProperty('--rc', rarityVar(item.rarity));
    var letter=(item.name||'?').charAt(0).toUpperCase();
    if(item.hasImage){
      var img=document.createElement('img');
      img.src=imgUrl(item.id); img.alt=''; img.loading='lazy'; img.decoding='async';
      img.onerror=function(){ img.remove(); art.textContent=letter; };
      art.appendChild(img);
    } else {
      art.textContent=letter;
    }
    return art;
  }

  function visible(){
    var q=norm(state.search);
    return state.items.filter(function(it){
      if(state.action && it.action!==state.action) return false;
      if(state.rarity && rarityKey(it.rarity)!==state.rarity) return false;
      if(state.group && groupOf(it.type)!==state.group) return false;
      if(q && it._n.indexOf(q)===-1) return false;
      return true;
    });
  }

  function buildChips(container, values, current, labelFn, onPick, extraCls, colorFn){
    container.textContent='';
    var all=el('button','chip','Todos'); all.type='button';
    all.setAttribute('aria-pressed', current===''?'true':'false');
    all.onclick=function(){ onPick(''); };
    container.appendChild(all);
    values.forEach(function(v){
      var b=el('button','chip'+(extraCls?' '+extraCls:''),labelFn(v)); b.type='button';
      if(colorFn) b.style.setProperty('--ac', colorFn(v));
      b.setAttribute('aria-pressed', current===v?'true':'false');
      b.onclick=function(){ onPick(current===v?'':v); };
      container.appendChild(b);
    });
  }

  function renderChips(){
    var rs={}, ts={};
    state.items.forEach(function(it){
      if(it.rarity) rs[rarityKey(it.rarity)]=1;
      ts[groupOf(it.type)]=1;
    });
    function reset(){ state.pageNo=1; render(); }
    buildChips($('actions'), ACTIONS, state.action, function(v){return v;}, function(v){ state.action=v; reset(); }, 'act', actionVar);
    buildChips($('rarities'), RARITY_ORDER.filter(function(r){ return rs[r]; }), state.rarity, rarityLabel, function(v){ state.rarity=v; reset(); });
    buildChips($('types'), GROUP_ORDER.filter(function(g){ return ts[g]; }), state.group, function(v){return v;}, function(v){ state.group=v; reset(); });
  }

  function renderPager(pages){
    // Sin paginación si todo cabe en una sola página.
    pager.hidden = pages <= 1;
    if(pages <= 1) return;
    pageSel.textContent='';
    for(var i=1;i<=pages;i++){
      var o=document.createElement('option');
      o.value=String(i); o.textContent=String(i);
      if(i===state.pageNo) o.selected=true;
      pageSel.appendChild(o);
    }
    pageSel.value=String(state.pageNo);
    $('pageTotal').textContent='de '+pages;
    prevBtn.disabled = state.pageNo<=1;
    nextBtn.disabled = state.pageNo>=pages;
  }

  function render(){
    renderChips();
    var list=visible();
    var pages=Math.max(1, Math.ceil(list.length/PER_PAGE));
    if(state.pageNo>pages) state.pageNo=pages;
    if(state.pageNo<1) state.pageNo=1;
    var start=(state.pageNo-1)*PER_PAGE;
    var slice=list.slice(start, start+PER_PAGE);

    grid.textContent='';
    var frag=document.createDocumentFragment();
    slice.forEach(function(it){
      var b=el('button','card'); b.type='button';
      b.appendChild(makeArt(it));
      b.appendChild(el('p','name',it.name));
      var meta=el('div','meta');
      var r=el('span','rar',rarityLabel(it.rarity)); r.style.setProperty('--rc', rarityVar(it.rarity));
      meta.appendChild(r);
      meta.appendChild(el('span',null, fmt(it.value)));
      b.appendChild(meta);
      var badge=el('span','badge',it.action); badge.style.setProperty('--ac', actionVar(it.action));
      b.appendChild(badge);
      b.onclick=function(){ openModal(it, b); };
      frag.appendChild(b);
    });
    grid.appendChild(frag);

    if(state.items.length) countEl.textContent = fmt(list.length) + (list.length===1 ? ' objeto' : ' objetos');
    else countEl.textContent = '';

    renderPager(pages);
    more.hidden = !state.failed;

    if(state.failed){ /* se mantiene el mensaje de error */ }
    else if(state.loading) setStatus('Cargando…');
    else if(!list.length) setStatus('Ningún objeto coincide con la búsqueda o los filtros.');
    else setStatus('');
  }

  function goToPage(n){
    state.pageNo=n;
    render();
    grid.scrollIntoView({behavior:'smooth', block:'start'});
  }

  function load(){
    state.loading=true; state.failed=false;
    setStatus('Cargando…');
    fetchArcItems()
      .then(function(json){
        var items=Array.isArray(json.items)?json.items:[];
        items.forEach(function(it){ it._n = norm(it.name); });
        state.items=items; state.meta=json.meta||null;
        state.loading=false;
        renderFooter();
        render();
      })
      .catch(function(){
        state.loading=false; state.failed=true;
        render();
        setStatus('No se pudieron cargar los objetos. Inténtalo de nuevo en unos minutos.', true);
      });
  }

  function renderFooter(){
    var m=state.meta; if(!m || !m.sourceDate) return;
    var d=new Date(m.sourceDate+'T00:00:00');
    var txt=isNaN(d) ? m.sourceDate : d.toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'});
    $('foot-data').textContent='Datos del juego actualizados hasta el '+txt+'. Los cambios posteriores pueden no estar reflejados.';
  }

  function section(parent, title, rows){
    if(!rows || !rows.length) return;
    parent.appendChild(el('h3',null,title));
    var ul=document.createElement('ul');
    rows.forEach(function(t){ ul.appendChild(el('li',null,t)); });
    parent.appendChild(ul);
  }
  function mats(list){
    return (list||[]).map(function(m){ return m.name+' ×'+m.qty; });
  }

  function openModal(it, trigger){
    lastFocus=trigger;
    $('m-name').textContent=it.name;
    var meta=$('m-meta'); meta.textContent='';
    var r=el('span','rar',rarityLabel(it.rarity)); r.style.setProperty('--rc', rarityVar(it.rarity));
    meta.appendChild(r);
    meta.appendChild(el('span',null,typeEs(it.type)));
    var art=$('m-art'); var fresh=makeArt(it,'art');
    art.replaceWith(fresh); fresh.id='m-art';

    var rec=$('m-rec'); rec.textContent='';
    rec.style.setProperty('--ac', actionVar(it.action));
    rec.appendChild(el('strong',null,it.action));
    rec.appendChild(el('p',null,it.reason));

    $('m-desc').textContent=it.description||'';

    var tbl=$('m-stats'); tbl.textContent='';
    function row(k,v){
      var tr=document.createElement('tr');
      tr.appendChild(el('td',null,k)); tr.appendChild(el('td',null,v));
      tbl.appendChild(tr);
    }
    row('Valor de venta', fmt(it.value));
    if(it.recycleValue) row('Valor de lo que da al reciclar', fmt(it.recycleValue));
    if(typeof it.weightKg==='number') row('Peso', it.weightKg.toLocaleString('es-ES')+' kg');
    if(typeof it.stackSize==='number') row('Pila máxima', fmt(it.stackSize));
    (it.effects||[]).forEach(function(e){ row(e[0], e[1]); });

    var sec=$('m-sections'); sec.textContent='';
    section(sec,'Necesario para',(it.neededFor||[]).map(function(n){
      return (n.kind+': '+n.name+(n.label?' '+n.label:'')+' (×'+n.qty+')');
    }));
    section(sec,'Se recicla en',mats(it.recyclesInto));
    section(sec,'Se desguaza en',mats(it.salvagesInto));
    if(it.recipe){
      var title='Se fabrica con'+(it.recipe.bench?' ('+it.recipe.bench+(it.recipe.level?' nivel '+it.recipe.level:'')+')':'');
      section(sec,title,mats(it.recipe.materials));
    }

    $('modal').classList.add('open');
    $('m-close').focus();
  }
  function closeModal(){
    $('modal').classList.remove('open');
    if(lastFocus) lastFocus.focus();
  }
  $('m-close').onclick=closeModal;
  $('modal').addEventListener('click',function(e){ if(e.target===this) closeModal(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape' && $('modal').classList.contains('open')) closeModal(); },{signal:signal});

  pageSel.addEventListener('change',function(){ goToPage(parseInt(pageSel.value,10)||1); });
  prevBtn.onclick=function(){ goToPage(state.pageNo-1); };
  nextBtn.onclick=function(){ goToPage(state.pageNo+1); };

  var timer=null;
  $('q').addEventListener('input',function(){
    var v=this.value;
    clearTimeout(timer);
    timer=setTimeout(function(){
      if(v===state.search) return;
      state.search=v; state.pageNo=1; render();
    },150);
  });
  more.onclick=function(){ load(); };

  load();
}
