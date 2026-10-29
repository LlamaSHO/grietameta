/* Lógica de la vista (migrada tal cual desde el antiguo arc-misiones.html).
   Se ejecuta al montar la vista; los listeners globales usan `signal` para
   limpiarse al salir de ella. */

import { fetchArcQuests, arcMapImageUrl } from "@/services/arcRaiders";

export function init({ root, signal }) {
  var KEY = 'arcmeta.misiones.v1';
  var STATUS_LABEL = {done:'Completada', avail:'Disponible', locked:'Bloqueada'};
  var STATUS_FILTERS = [['','Todas'],['pin','Siguiendo'],['avail','Disponibles'],['pending','Pendientes'],['done','Completadas']];

  var state = {
    quests:[], byId:null, meta:null, maps:[], mapById:null,
    done:{}, pin:{}, obj:{},
    f:{status:'', trader:'', map:'', q:''},
    open:{}, onlyAvail:false, loading:true, failed:false, saveOk:true
  };
  var $ = function(id){ return document.getElementById(id); };
  var listEl=$('list'), statusEl=$('status'), moreBtn=$('more'), countEl=$('count');
  var rowEls = {};

  function el(tag, cls, text){
    var n=document.createElement(tag);
    if(cls) n.className=cls;
    if(text!==undefined && text!==null) n.textContent=text;
    return n;
  }
  function norm(s){ return (s||'').toString().normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase(); }
  function fmt(n){ return typeof n==='number' ? n.toLocaleString('es-ES') : '—'; }
  function setStatus(msg, isErr){
    if(!msg){ statusEl.hidden=true; return; }
    statusEl.hidden=false; statusEl.textContent=msg; statusEl.className='status'+(isErr?' err':'');
  }

  /* ---------- Guardado en el navegador ---------- */
  function save(){
    try{
      localStorage.setItem(KEY, JSON.stringify({v:1, done:Object.keys(state.done), pin:Object.keys(state.pin), obj:state.obj}));
      if(!state.saveOk){ state.saveOk=true; $('notice').hidden=true; }
    }catch(e){
      if(state.saveOk){ state.saveOk=false; $('notice').hidden=false; }
    }
  }
  function readSaved(){
    try{ var raw=localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; }catch(e){ return null; }
  }
  // Solo se aceptan identificadores que existen y objetivos dentro de rango.
  function applySaved(s){
    state.done={}; state.pin={}; state.obj={};
    if(!s || typeof s!=='object') return;
    (Array.isArray(s.done)?s.done:[]).forEach(function(id){ if(state.byId[id]) state.done[id]=1; });
    (Array.isArray(s.pin)?s.pin:[]).forEach(function(id){ if(state.byId[id]) state.pin[id]=1; });
    if(s.obj && typeof s.obj==='object'){
      Object.keys(s.obj).forEach(function(id){
        var q=state.byId[id], a=s.obj[id];
        if(!q || !Array.isArray(a)) return;
        var ok=a.filter(function(i,k){ return Number.isInteger(i) && i>=0 && i<q.objectives.length && a.indexOf(i)===k; });
        if(ok.length) state.obj[id]=ok;
      });
    }
  }

  /* ---------- Estado de cada misión ---------- */
  function statusOf(q){
    if(state.done[q.id]) return 'done';
    for(var i=0;i<q.prev.length;i++){ if(!state.done[q.prev[i]]) return 'locked'; }
    return 'avail';
  }
  function visible(){
    var f=state.f, qn=norm(f.q);
    return state.quests.filter(function(q){
      var st=statusOf(q);
      if(f.status==='pin' && !state.pin[q.id]) return false;
      if(f.status==='avail' && st!=='avail') return false;
      if(f.status==='pending' && st==='done') return false;
      if(f.status==='done' && st!=='done') return false;
      if(f.trader && q.trader!==f.trader) return false;
      if(f.map && q.maps.indexOf(f.map)===-1) return false;
      if(qn && q._n.indexOf(qn)===-1) return false;
      return true;
    });
  }

  /* ---------- Acciones ---------- */
  function setDone(id, v){
    if(v) state.done[id]=1; else delete state.done[id];
    save(); render();
  }
  function markWithPrevious(id){
    var seen={};
    (function walk(x){
      if(seen[x]) return; seen[x]=1; state.done[x]=1;
      state.byId[x].prev.forEach(walk);
    })(id);
    save(); render();
  }
  function togglePin(id){
    if(state.pin[id]) delete state.pin[id]; else state.pin[id]=1;
    save(); render();
  }
  function toggleObj(id, i){
    var a=(state.obj[id]||[]).slice(), k=a.indexOf(i);
    if(k===-1) a.push(i); else a.splice(k,1);
    if(a.length) state.obj[id]=a; else delete state.obj[id];
    save(); render();
  }
  function goTo(id){
    state.f={status:'', trader:'', map:'', q:''}; $('q').value='';
    state.open[id]=1;
    render();
    var r=rowEls[id]; if(r) r.scrollIntoView({behavior:'smooth', block:'center'});
  }

  /* ---------- Pintado ---------- */
  function renderProgress(){
    var total=state.quests.length, done=0;
    var tr={}; // comerciante -> {t, d}
    state.quests.forEach(function(q){
      var x=tr[q.trader]||(tr[q.trader]={t:0,d:0}); x.t++;
      if(state.done[q.id]){ done++; x.d++; }
    });
    var pct = total ? Math.round(done*100/total) : 0;
    $('p-main').textContent = done+' de '+total+' misiones completadas';
    $('p-sub').textContent = pct+' %';
    $('p-fill').style.width = pct+'%';
    $('p-bar').setAttribute('aria-valuenow', String(pct));

    var tiles=$('tiles'); tiles.textContent='';
    Object.keys(tr).sort().forEach(function(name){
      var x=tr[name];
      var b=el('button','tile'); b.type='button';
      b.setAttribute('aria-pressed', state.f.trader===name?'true':'false');
      var head=el('b'); head.appendChild(document.createTextNode(name||'Sin comerciante')); head.appendChild(el('span',null,x.d+'/'+x.t));
      b.appendChild(head);
      var bar=el('div','bar'); var fill=document.createElement('i'); fill.style.width=(x.t?Math.round(x.d*100/x.t):0)+'%'; bar.appendChild(fill); b.appendChild(bar);
      b.onclick=function(){ state.f.trader = state.f.trader===name ? '' : name; render(); };
      tiles.appendChild(b);
    });
  }

  function renderFilters(){
    var counts={'':state.quests.length, pin:0, avail:0, pending:0, done:0};
    state.quests.forEach(function(q){
      var st=statusOf(q);
      if(state.pin[q.id]) counts.pin++;
      if(st==='avail') counts.avail++;
      if(st!=='done') counts.pending++; else counts.done++;
    });
    var s=$('f-status'); s.textContent='';
    STATUS_FILTERS.forEach(function(p){
      var b=el('button','chip',p[1]); b.type='button';
      b.appendChild(el('small',null,String(counts[p[0]])));
      b.setAttribute('aria-pressed', state.f.status===p[0]?'true':'false');
      b.onclick=function(){ state.f.status=p[0]; render(); };
      s.appendChild(b);
    });
    var maps={}; state.quests.forEach(function(q){ q.maps.forEach(function(m){ maps[m]=(maps[m]||0)+1; }); });
    var m=$('f-map'); m.textContent='';
    var all=el('button','chip','Todos'); all.type='button';
    all.setAttribute('aria-pressed', state.f.map===''?'true':'false');
    all.onclick=function(){ state.f.map=''; render(); };
    m.appendChild(all);
    Object.keys(maps).sort().forEach(function(name){
      var b=el('button','chip',name); b.type='button';
      b.appendChild(el('small',null,String(maps[name])));
      b.setAttribute('aria-pressed', state.f.map===name?'true':'false');
      b.onclick=function(){ state.f.map = state.f.map===name ? '' : name; render(); };
      m.appendChild(b);
    });
  }

  function renderGuard(){
    var agg=Object.create(null), n=0;
    state.quests.forEach(function(q){
      if(state.done[q.id]) return;
      if(state.onlyAvail && statusOf(q)!=='avail') return;
      q.required.forEach(function(r){
        var a=agg[r.id]; if(!a){ a=agg[r.id]={name:r.name, qty:0, quests:[]}; n++; }
        a.qty+=r.qty; a.quests.push(q.name);
      });
    });
    $('guard-sum').textContent='Objetos que necesitas guardar ('+n+')';
    var ul=$('guard-list'); ul.textContent='';
    var keys=Object.keys(agg).sort(function(a,b){ return agg[a].name.localeCompare(agg[b].name,'es'); });
    if(!keys.length){ ul.appendChild(el('li',null,'No tienes objetos pendientes de guardar para misiones.')); return; }
    keys.forEach(function(k){
      var a=agg[k], li=el('li',null,a.name+' ×'+fmt(a.qty));
      li.appendChild(el('small',null,'Para: '+a.quests.join(', ')));
      ul.appendChild(li);
    });
  }

  function itemLines(arr){
    return arr.map(function(r){ return r.name+' ×'+fmt(r.qty); });
  }
  function section(parent, title, lines){
    if(!lines || !lines.length) return;
    parent.appendChild(el('h3',null,title));
    var ul=el('ul'); lines.forEach(function(t){ ul.appendChild(el('li',null,t)); }); parent.appendChild(ul);
  }
  function questLinks(parent, title, ids){
    if(!ids.length) return;
    parent.appendChild(el('h3',null,title));
    var ul=el('ul');
    ids.forEach(function(id){
      var q=state.byId[id], li=el('li');
      var b=el('button','linkbtn',q.name); b.type='button';
      b.onclick=function(){ goTo(id); };
      li.appendChild(b);
      if(state.done[id]) li.appendChild(document.createTextNode(' ✓'));
      ul.appendChild(li);
    });
    parent.appendChild(ul);
  }

  /* ---------- Mapas ---------- */
  var ZOOMS=[0,1.5,2,3,4]; // 0 = ajustar a la pantalla; el resto, múltiplos del ancho visible
  var viewer={mid:null, vi:0, zoom:0, last:null};
  function mapTitle(m, v){ return m.name + (v.label ? ' · '+v.label : ''); }
  function mapSrc(v){ return arcMapImageUrl(v.file); }

  function mapThumb(mid, vi){
    var m=state.mapById[mid], v=m.views[vi];
    var b=el('button','mthumb'); b.type='button';
    b.setAttribute('aria-label','Ver mapa ampliado: '+mapTitle(m,v));
    var img=document.createElement('img');
    img.src=mapSrc(v); img.alt=''; img.loading='lazy'; img.decoding='async';
    img.onerror=function(){ img.remove(); b.insertBefore(el('span','mfail','Mapa no disponible'), b.firstChild); };
    b.appendChild(img);
    b.appendChild(el('span','mcap',mapTitle(m,v)));
    b.onclick=function(){ openMap(mid, vi, b); };
    return b;
  }
  function renderMapsPanel(){
    var g=$('maps-grid'); g.textContent=''; var n=0;
    state.maps.forEach(function(m){ m.views.forEach(function(v,i){ g.appendChild(mapThumb(m.id,i)); n++; }); });
    $('maps-sum').textContent='Mapas ('+n+')';
    $('maps-panel').hidden = !n;
  }
  function applyZoom(){
    var z=ZOOMS[viewer.zoom], img=$('v-img');
    if(z===0){ img.style.width=''; img.style.maxWidth='100%'; img.style.maxHeight='100%'; }
    else { img.style.maxWidth='none'; img.style.maxHeight='none'; img.style.width=(z*100)+'%'; }
    $('v-zoom').textContent = z===0 ? 'Ajustado' : '×'+z;
    $('v-out').disabled = viewer.zoom===0;
    $('v-in').disabled = viewer.zoom===ZOOMS.length-1;
    var sc=$('v-scroll'); sc.scrollLeft=0; sc.scrollTop=0;
  }
  function paintViewer(){
    var m=state.mapById[viewer.mid], v=m.views[viewer.vi];
    $('v-title').textContent=mapTitle(m,v);
    var tabs=$('v-tabs'); tabs.textContent='';
    if(m.views.length>1){
      m.views.forEach(function(vv,i){
        var b=el('button','chip',vv.label||('Vista '+(i+1))); b.type='button';
        b.setAttribute('aria-pressed', i===viewer.vi?'true':'false');
        b.onclick=function(){ viewer.vi=i; viewer.zoom=0; paintViewer(); };
        tabs.appendChild(b);
      });
    }
    var img=$('v-img'); img.src=mapSrc(v); img.alt='Mapa de '+mapTitle(m,v);
    $('v-note').textContent = v.zoneNames
      ? 'Los nombres de zona están en inglés, como en el juego. Los datos no indican el punto exacto de cada objetivo.'
      : 'Este mapa no tiene nombres de zona. Los datos no indican el punto exacto de cada objetivo.';
    applyZoom();
  }
  function openMap(mid, vi, trigger){
    if(!state.mapById || !state.mapById[mid]) return;
    viewer.mid=mid; viewer.vi=vi||0; viewer.zoom=0; viewer.last=trigger||null;
    paintViewer();
    $('viewer').classList.add('open');
    $('v-close').focus();
  }
  function closeViewer(){
    $('viewer').classList.remove('open');
    if(viewer.last && viewer.last.focus) viewer.last.focus();
  }
  function setZoom(i){ viewer.zoom=Math.max(0, Math.min(ZOOMS.length-1, i)); applyZoom(); }

  function buildRow(q){
    var st=statusOf(q);
    var art=el('article','q '+st); art.dataset.id=q.id;

    var row=el('div','qrow');
    var cb=document.createElement('input'); cb.type='checkbox'; cb.checked=st==='done';
    cb.setAttribute('aria-label','Marcar «'+q.name+'» como completada');
    cb.onchange=function(){ setDone(q.id, cb.checked); };
    row.appendChild(cb);

    var head=el('button','qhead'); head.type='button';
    var isOpen=!!state.open[q.id];
    head.setAttribute('aria-expanded', isOpen?'true':'false');
    head.appendChild(el('span','qname',q.name));
    var meta=[q.trader];
    if(q.maps.length) meta.push(q.maps.join(', '));
    if(q.xp) meta.push(fmt(q.xp)+' XP');
    head.appendChild(el('span','qmeta',meta.filter(Boolean).join(' · ')));
    head.onclick=function(){ if(state.open[q.id]) delete state.open[q.id]; else state.open[q.id]=1; render(); };
    row.appendChild(head);

    row.appendChild(el('span','pill '+st, STATUS_LABEL[st]));

    var star=el('button','star','★'); star.type='button';
    star.setAttribute('aria-pressed', state.pin[q.id]?'true':'false');
    star.setAttribute('aria-label', (state.pin[q.id]?'Dejar de seguir «':'Seguir «')+q.name+'»');
    star.title = state.pin[q.id] ? 'Dejar de seguir' : 'Seguir esta misión';
    star.onclick=function(){ togglePin(q.id); };
    row.appendChild(star);
    art.appendChild(row);

    var body=el('div','qbody'); body.hidden=!isOpen;
    if(isOpen){
      if(st==='locked'){
        var pend=q.prev.filter(function(p){ return !state.done[p]; }).map(function(p){ return state.byId[p].name; });
        body.appendChild(el('p','lock-note','Completa antes: '+pend.join(', ')+'.'));
      }
      if(q.description) body.appendChild(el('p',null,q.description));

      if(q.objectives.length){
        body.appendChild(el('h3',null,'Objetivos'));
        var ul=el('ul','obj'); var ticks=state.obj[q.id]||[];
        q.objectives.forEach(function(o,i){
          var li=el('li'), lab=el('label');
          var c=document.createElement('input'); c.type='checkbox'; c.checked=ticks.indexOf(i)!==-1;
          c.onchange=function(){ toggleObj(q.id, i); };
          lab.appendChild(c); lab.appendChild(el('span', c.checked?'ticked':'', o));
          li.appendChild(lab); ul.appendChild(li);
        });
        body.appendChild(ul);
      }
      if(q.mapIds.length){
        body.appendChild(el('h3',null,'Dónde se juega'));
        var wrap=el('div','mapthumbs');
        q.mapIds.forEach(function(mid){ state.mapById[mid].views.forEach(function(v,i){ wrap.appendChild(mapThumb(mid,i)); }); });
        body.appendChild(wrap);
        body.appendChild(el('p','mnote','Pulsa el mapa para ampliarlo. Los nombres de zona de los objetivos te ayudan a ubicarte.'));
      }
      section(body,'Objetos que debes entregar', itemLines(q.required));
      section(body,'Otros requisitos', q.other);
      section(body,'Objetos que te da al empezar', itemLines(q.granted));
      var rew=itemLines(q.rewards); if(q.xp) rew.push(fmt(q.xp)+' XP');
      section(body,'Recompensas', rew);
      questLinks(body,'Misiones anteriores', q.prev);
      questLinks(body,'Desbloquea', q.next);

      var prevPending=false;
      (function walk(id, seen){ state.byId[id].prev.forEach(function(p){ if(!seen[p]){ seen[p]=1; if(!state.done[p]) prevPending=true; walk(p, seen); } }); })(q.id, {});
      if(prevPending){
        var btn=el('button','btn','Marcar esta y todas las anteriores como completadas'); btn.type='button';
        btn.style.marginTop='14px';
        btn.onclick=function(){ markWithPrevious(q.id); };
        body.appendChild(btn);
      }
    }
    art.appendChild(body);
    rowEls[q.id]=art;
    return art;
  }

  function render(){
    renderProgress();
    renderFilters();
    renderGuard();
    var list=visible();
    listEl.textContent=''; rowEls={};
    var frag=document.createDocumentFragment();
    list.forEach(function(q){ frag.appendChild(buildRow(q)); });
    listEl.appendChild(frag);

    countEl.textContent = state.quests.length ? (list.length===state.quests.length ? list.length+' misiones' : list.length+' de '+state.quests.length+' misiones') : '';
    moreBtn.hidden=!state.failed;
    if(state.failed){ /* se mantiene el error */ }
    else if(state.loading) setStatus('Cargando misiones…');
    else if(!list.length){
      setStatus(state.f.status==='pin' && !state.f.q && !state.f.trader && !state.f.map
        ? 'Aún no sigues ninguna misión. Pulsa la estrella ★ de una misión para seguirla.'
        : 'Ninguna misión coincide con la búsqueda o los filtros.');
    } else setStatus('');
  }

  /* ---------- Carga ---------- */
  function load(){
    state.loading=true; state.failed=false; setStatus('Cargando misiones…'); moreBtn.hidden=true;
    fetchArcQuests()
      .then(function(json){
        var qs=Array.isArray(json.quests)?json.quests:[];
        state.byId=Object.create(null);
        // Mapas: solo los que tienen al menos una vista con archivo.
        state.maps=(Array.isArray(json.maps)?json.maps:[]).filter(function(m){ return m && m.id && Array.isArray(m.views) && m.views.length; });
        state.mapById=Object.create(null);
        state.maps.forEach(function(m){ state.mapById[m.id]=m; });
        qs.forEach(function(q){
          q.mapIds=(Array.isArray(q.mapIds)?q.mapIds:[]).filter(function(id){ return state.mapById[id]; });
          q.prev=q.prev||[]; q.next=q.next||[]; q.objectives=q.objectives||[]; q.maps=q.maps||[];
          q.required=q.required||[]; q.rewards=q.rewards||[]; q.granted=q.granted||[]; q.other=q.other||[];
          q._n=norm([q.name,q.trader,q.objectives.join(' '),q.required.map(function(r){return r.name;}).join(' '),q.rewards.map(function(r){return r.name;}).join(' ')].join(' '));
          state.byId[q.id]=q;
        });
        // Se descartan enlaces a misiones que no existan.
        qs.forEach(function(q){
          q.prev=q.prev.filter(function(p){ return state.byId[p]; });
          q.next=q.next.filter(function(p){ return state.byId[p]; });
        });
        state.quests=qs; state.meta=json.meta||null;
        applySaved(readSaved());
        state.loading=false;
        renderFooter();
        renderMapsPanel();
        render();
      })
      .catch(function(){
        state.loading=false; state.failed=true;
        render();
        setStatus('No se pudieron cargar las misiones. Inténtalo de nuevo en unos minutos.', true);
      });
  }
  function renderFooter(){
    var m=state.meta; if(!m || !m.sourceDate) return;
    var d=new Date(m.sourceDate+'T00:00:00');
    var txt=isNaN(d) ? m.sourceDate : d.toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'});
    $('foot-data').textContent='Datos de '+state.quests.length+' misiones actualizados hasta el '+txt+'. Las misiones añadidas después pueden no aparecer.';
  }

  /* ---------- Eventos ---------- */
  var timer=null;
  $('q').addEventListener('input',function(){
    var v=this.value; clearTimeout(timer);
    timer=setTimeout(function(){ state.f.q=v; render(); },150);
  });
  $('guard-avail').addEventListener('change',function(){ state.onlyAvail=this.checked; renderGuard(); });
  moreBtn.onclick=function(){ load(); };

  // Visor de mapas
  $('v-close').onclick=closeViewer;
  $('v-in').onclick=function(){ setZoom(viewer.zoom+1); };
  $('v-out').onclick=function(){ setZoom(viewer.zoom-1); };
  $('v-fit').onclick=function(){ setZoom(0); };
  $('viewer').addEventListener('click',function(e){ if(e.target===this) closeViewer(); });
  document.addEventListener('keydown',function(e){
    if(!$('viewer').classList.contains('open')) return;
    if(e.key==='Escape') closeViewer();
    else if(e.key==='+' || e.key==='=') setZoom(viewer.zoom+1);
    else if(e.key==='-') setZoom(viewer.zoom-1);
  },{signal:signal});
  // Arrastrar con el ratón para moverse por el mapa ampliado (en pantallas táctiles se desliza con el dedo).
  (function(){
    var sc=$('v-scroll'), drag=null;
    sc.addEventListener('pointerdown',function(e){
      if(e.pointerType!=='mouse' || e.button!==0) return;
      drag={x:e.clientX, y:e.clientY, l:sc.scrollLeft, t:sc.scrollTop};
      sc.classList.add('drag');
      try{ sc.setPointerCapture(e.pointerId); }catch(_){}
    });
    sc.addEventListener('pointermove',function(e){
      if(!drag) return;
      sc.scrollLeft = drag.l-(e.clientX-drag.x);
      sc.scrollTop = drag.t-(e.clientY-drag.y);
    });
    function end(){ drag=null; sc.classList.remove('drag'); }
    sc.addEventListener('pointerup',end);
    sc.addEventListener('pointercancel',end);
  })();

  function msg(t, bad){ var m=$('bk-msg'); m.textContent=t; m.style.color = bad ? 'var(--warn)' : 'var(--green)'; }
  $('bk-export').onclick=function(){
    var code=JSON.stringify({v:1, done:Object.keys(state.done), pin:Object.keys(state.pin), obj:state.obj});
    $('bk-code').value=code;
    $('bk-code').select();
    msg('Código generado. Cópialo (Ctrl+C) y guárdalo o pégalo en otro dispositivo.', false);
  };
  $('bk-import').onclick=function(){
    var raw=$('bk-code').value.trim();
    if(!raw){ msg('Pega primero un código en el cuadro.', true); return; }
    var data;
    try{ data=JSON.parse(raw); }catch(e){ msg('El código no es válido.', true); return; }
    if(!data || typeof data!=='object' || !Array.isArray(data.done)){ msg('El código no es válido.', true); return; }
    if(!window.confirm('Esto sustituirá el progreso actual de este navegador. ¿Continuar?')) return;
    applySaved(data); save(); render();
    msg('Progreso importado: '+Object.keys(state.done).length+' misiones completadas.', false);
  };
  $('bk-reset').onclick=function(){
    if(!window.confirm('¿Borrar todo tu progreso de misiones en este navegador? No se puede deshacer.')) return;
    state.done={}; state.pin={}; state.obj={}; save(); render();
    msg('Progreso borrado.', false);
  };

  load();
}
