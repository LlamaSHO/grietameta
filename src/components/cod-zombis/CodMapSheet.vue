<template>
  <!-- Ficha del mapa elegido: Pack-a-Punch, ventajas, armas, Easter egg paso a paso,
       canción y consejos (diseño: #mapa de CodBO1..4.dc.html) -->
  <section id="mapa" class="sec md-s">
    <span v-for="x in maps" :id="x.id" :key="x.id" class="anc"></span>
    <div class="wrap md" :class="anim" :style="{ '--mc': m.c }">
      <div class="md-top">
        <figure class="md-fig">
          <img v-if="m.img" :src="m.img" :alt="m.n" decoding="async" />
          <div v-else class="md-ph" aria-hidden="true"><i class="stencil">{{ m.ini }}</i><span class="hz"></span></div>
          <span class="grain"></span>
          <span class="md-k sc">Mapa {{ String(index + 1).padStart(2, "0") }} / {{ maps.length }}</span>
          <figcaption>{{ m.cap }}</figcaption>
        </figure>
        <div class="md-info">
          <span class="md-dlc"><i></i>{{ m.dlc }}</span>
          <h2 class="md-h stencil">{{ m.n }}</h2>
          <p class="md-d">{{ m.desc }}</p>
          <dl class="md-dl">
            <dt>Dónde</dt><dd>{{ m.setting }}</dd>
            <dt>Época</dt><dd>{{ m.year }}</dd>
            <dt>Personajes</dt><dd>{{ m.crew }}</dd>
            <dt>Enemigos</dt><dd>{{ m.enemies }}</dd>
          </dl>
          <div class="pills"><span v-for="p in pills" :key="p" class="pill">{{ p }}</span></div>
        </div>
      </div>

      <div class="md-g">
        <div class="col">
          <article class="cd pap">
            <header>
              <span class="ci"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg></span>
              <div><span class="kk">Mejora tus armas</span><h3>Pack-a-Punch</h3></div>
              <span class="cost sc">5.000</span>
            </header>
            <p class="pap-t">{{ m.pap }}</p>
            <ul class="pap-f"><li><b class="sc">5.000</b>por arma</li><li><b class="sc">+</b>daño y munición</li><li><b class="sc">Aa</b>el arma cambia de nombre</li></ul>
          </article>
          <article class="cd walls">
            <header>
              <span class="ci"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 12h7l2-2h2" /><path d="M9 12v3" /></svg></span>
              <div><span class="kk">Tiza en la pared</span><h3>Armas de pared</h3></div>
            </header>
            <div v-if="m.walls.length" class="wt" :class="{ nocost: !m.walls.some((w) => w.cost !== '—') }">
              <div class="wr wh"><span>Arma</span><span>Dónde está</span><span>Precio</span></div>
              <div v-for="w in m.walls" :key="w.w" class="wr"><b>{{ w.w }}</b><span>{{ w.loc }}</span><span class="sc">{{ w.cost }}</span></div>
            </div>
            <p v-else class="empty">Todavía no hemos comprobado una por una las armas de pared de este mapa. Las añadiremos en la próxima actualización de la guía.</p>
          </article>
        </div>
        <div class="col">
          <article class="cd perks">
            <header>
              <span class="ci"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3h6" /><path d="M10 3v4l-3 4v9a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-9l-3-4V3" /><path d="M7 14h10" /></svg></span>
              <div><span class="kk">Perk-a-Cola</span><h3>Ventajas</h3></div>
              <span class="cnt sc">{{ m.perks.length }}</span>
            </header>
            <ul class="pl">
              <li v-for="p in m.perks" :key="p.n" :style="{ '--pc': p.c }"><i></i><span><b>{{ p.n }}</b><small v-if="p.hasLoc">{{ p.loc }}</small></span></li>
            </ul>
          </article>
          <article class="cd ww">
            <header>
              <span class="ci"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" /></svg></span>
              <div><span class="kk">Caja, construibles y secretos</span><h3>Armas especiales</h3></div>
              <span class="cnt sc">{{ m.ww.length }}</span>
            </header>
            <div class="wl"><div v-for="w in m.ww" :key="w.n" class="wi"><b>{{ w.n }}</b><p>{{ w.d }}</p></div></div>
          </article>
        </div>
      </div>

      <article class="ee">
        <div v-if="ee" class="ee-in">
          <div class="ee-l">
            <span class="kk"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c-3.6 0-6.5 5.2-6.5 9.5S8.4 21 12 21s6.5-4.2 6.5-8.5S15.6 3 12 3z" /><path d="M8 13l2-1.5L12 13l2-1.5L16 13" /></svg> Easter egg principal</span>
            <h3 class="stencil">{{ ee.name }}</h3>
            <p class="ee-goal"><b>Objetivo.</b> {{ ee.goal }}</p>
            <template v-if="steps.length">
              <div class="ee-bar">
                <div class="ee-prog"><span>{{ nRev }} de {{ steps.length }} pasos a la vista</span><i><b :style="{ width: Math.round((nRev / steps.length) * 100) + '%' }"></b></i></div>
                <div class="ee-btns">
                  <button type="button" class="btn-r sm" :class="{ dis: nRev >= steps.length }" @click="setRev(Math.min(nRev + 1, steps.length))">{{ nRev >= steps.length ? "Todo a la vista" : "Ver el paso " + (nRev + 1) }}</button>
                  <button type="button" class="btn-o sm" @click="setRev(steps.length)">Mostrar todos</button>
                  <button type="button" class="btn-o sm" @click="setRev(0)">Ocultar</button>
                </div>
              </div>
              <ol class="steps">
                <li v-for="(t, i) in steps" :key="i" :class="i < nRev ? 'open' : i === nRev ? 'next' : ''">
                  <span class="sn sc">{{ i + 1 }}</span>
                  <p v-if="i < nRev">{{ t }}</p>
                  <button v-else type="button" class="lock" @click="setRev(i + 1)">
                    <span class="bars" aria-hidden="true"><i></i><i></i></span>
                    <span class="lk"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>Revelar el paso {{ i + 1 }}</span>
                  </button>
                </li>
              </ol>
            </template>
            <div v-else class="ee-soon"><b>Paso a paso en preparación</b><p>Es un Easter egg largo y preferimos comprobar cada paso antes de publicarlo. De momento tienes el objetivo y, si quieres, cómo termina.</p></div>
          </div>
          <aside class="ee-r">
            <div v-if="ee.reward" class="rw"><span class="kk">Recompensa</span><p>{{ ee.reward }}</p></div>
            <div v-if="ee.ending" class="end">
              <span class="kk">Cómo termina</span>
              <template v-if="sp['end' + m.id]"><p>{{ ee.ending }}</p><button type="button" class="spoil ghost" @click="toggle('end' + m.id)">Ocultar el final</button></template>
              <button v-else type="button" class="spoil" @click="toggle('end' + m.id)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>Mostrar el final (spoiler)</button>
            </div>
            <div class="tip"><b>Antes de empezar</b><p>Algunos Easter eggs piden cuatro jugadores, sobre todo en Black Ops II. Abre los pasos de uno en uno para no destriparte la sorpresa.</p></div>
          </aside>
        </div>
        <div v-else class="ee-none">
          <span class="ci"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c-3.6 0-6.5 5.2-6.5 9.5S8.4 21 12 21s6.5-4.2 6.5-8.5S15.6 3 12 3z" /><path d="M8 13l2-1.5L12 13l2-1.5L16 13" /></svg></span>
          <div><b>Sin Easter egg principal</b><p>Este mapa no tiene una misión secreta con final propio. Merece la pena igualmente por sus secretos pequeños: mira «A tener en cuenta».</p></div>
        </div>
      </article>

      <div class="md-g2">
        <article class="cd song">
          <header>
            <span class="ci"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg></span>
            <div><span class="kk">Easter egg musical</span><h3>Canción secreta</h3></div>
          </header>
          <template v-if="m.song">
            <p class="sname">{{ m.song.name }}</p>
            <template v-if="m.song.steps.length">
              <ol v-if="sp['song' + m.id]" class="ss"><li v-for="t in m.song.steps" :key="t">{{ t }}</li></ol>
              <button type="button" class="spoil" @click="toggle('song' + m.id)">{{ sp["song" + m.id] ? "Ocultar los pasos" : "Ver cómo activarla" }}</button>
            </template>
            <p v-else class="empty">Las ubicaciones para activarla llegarán en la próxima actualización.</p>
          </template>
          <p v-else class="empty">No tenemos todavía la canción de este mapa en la guía.</p>
        </article>
        <article class="cd extra">
          <header>
            <span class="ci"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8h.01" /></svg></span>
            <div><span class="kk">Lo que conviene saber</span><h3>A tener en cuenta</h3></div>
          </header>
          <ul v-if="m.extra.length" class="xl"><li v-for="t in m.extra" :key="t">{{ t }}</li></ul>
          <p class="en"><b>Enemigos especiales.</b> {{ m.enemies }}</p>
        </article>
      </div>

      <nav class="md-nav" aria-label="Cambiar de mapa">
        <button type="button" class="mn prev" @click="go(index - 1)">
          <span class="ar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="11 6 5 12 11 18" /></svg></span>
          <span><small>Mapa anterior</small><b>{{ maps[(index - 1 + maps.length) % maps.length].n }}</b></span>
        </button>
        <a class="mn up" href="#mapas">Todos los mapas</a>
        <button type="button" class="mn next" @click="go(index + 1)">
          <span><small>Siguiente mapa</small><b>{{ maps[(index + 1) % maps.length].n }}</b></span>
          <span class="ar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg></span>
        </button>
      </nav>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";

const props = defineProps({
  maps: { type: Array, required: true },
  index: { type: Number, required: true },
});
const emit = defineEmits(["go"]);

const m = computed(() => props.maps[props.index]);
const ee = computed(() => m.value.ee);
const steps = computed(() => ee.value?.steps || []);

// Pasos revelados por mapa (rv) y giros abiertos (sp): se conservan al cambiar de mapa.
const rv = reactive({});
const sp = reactive({});
const nRev = computed(() => Math.min(rv[m.value.id] || 0, steps.value.length));
const setRev = (n) => {
  rv[m.value.id] = n;
};
const toggle = (key) => {
  sp[key] = !sp[key];
};

// La ficha se anima al cambiar de mapa: se alternan dos clases para repetir la entrada.
const k = ref(0);
watch(() => props.index, () => k.value++);
const anim = computed(() => (k.value % 2 ? "fa" : "fb"));

const pills = computed(() => {
  const x = m.value;
  const n = steps.value.length;
  return [
    x.perks.length + (x.perks.length === 1 ? " ventaja" : " ventajas"),
    x.ww.length + (x.ww.length === 1 ? " arma especial" : " armas especiales"),
    x.walls.length ? x.walls.length + " armas de pared" : "Paredes: pendiente",
    ee.value ? (n ? "Easter egg · " + n + " pasos" : "Easter egg principal") : "Sin Easter egg principal",
    x.song ? "Canción secreta" : "Sin canción en la guía",
  ];
});

function go(i) {
  emit("go", (i + props.maps.length) % props.maps.length, true);
}
</script>
