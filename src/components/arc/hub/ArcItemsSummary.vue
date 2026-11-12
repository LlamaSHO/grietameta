<template>
  <!-- «Objetos y reciclaje»: resumen por acción con datos reales, cómo se
       calcula la recomendación y buscador que lleva a la lista completa. -->
  <section id="objetos" class="sec">
    <div class="wrap">
      <div class="sec-h">
        <div>
          <span class="kick"><i></i>Objetos y reciclaje</span>
          <h2 class="h2 cond">¿Qué hago con esto?</h2>
          <p>Para cada uno de los {{ total ? fmt(total) : "" }} objetos te decimos si guardarlo, reciclarlo, venderlo o usarlo, y por qué.</p>
        </div>
        <RouterLink class="more" :to="{ name: 'arc-items' }">Ver todos los objetos →</RouterLink>
      </div>

      <div class="acts">
        <RouterLink
          v-for="g in groups"
          :key="g.action"
          class="act"
          :class="actionClass(g.action)"
          :to="{ name: 'arc-items', query: { accion: g.action.toLowerCase() } }"
          :aria-label="`${g.action}: ${g.count} objetos. Ver la lista`"
        >
          <span class="act-h"><b class="cond">{{ g.action }}</b><span>{{ fmt(g.count) }} objetos</span></span>
          <span class="act-p">{{ ACTION_HINT[g.action] }}</span>
          <span v-for="it in g.top" :key="it.id" class="it" :class="it.rc">
            <span class="ic"><img :src="it.img" alt="" loading="lazy" decoding="async" width="38" height="38"></span>
            <span class="tx"><b>{{ it.name }}</b><span>{{ it.sub }}</span></span>
            <span class="v">{{ fmt(it.value) }}</span>
          </span>
        </RouterLink>
      </div>

      <div class="how">
        <div class="how-h">
          <h3 class="cond">¿Cómo se calcula la recomendación?</h3>
          <span v-if="total" class="how-n"><b>{{ fmt(total) }}</b>objetos</span>
        </div>
        <ul class="how-l">
          <li v-for="r in ACTION_RULES" :key="r.a" :class="actionClass(r.a)"><b>{{ r.a }}</b>{{ r.t }}</li>
        </ul>
        <p class="how-f">{{ ACTION_DISCLAIMER }}</p>
      </div>

      <form class="isearch" role="search" @submit.prevent="search">
        <div class="search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <label class="sr-only" for="arc-hub-q">Buscar objeto</label>
          <input id="arc-hub-q" v-model="q" type="search" placeholder="Busca un objeto (Ferro, cables, reactor…)" autocomplete="off">
        </div>
        <button class="btn-y" type="submit">Buscar</button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ACTION_DISCLAIMER, ACTION_HINT, ACTION_RULES, actionClass, fmt } from "@/components/arc/lists/arcLabels";

defineProps({
  // De summarizeActions (arcData.js).
  groups: { type: Array, required: true },
  total: { type: Number, default: 0 },
});

const router = useRouter();
const q = ref("");
function search() {
  const v = q.value.trim();
  router.push({ name: "arc-items", query: v ? { q: v } : {} });
}
</script>

<style scoped>
.acts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(270px, 100%), 1fr));
  gap: 14px;
}
.act {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  border-radius: 18px;
  background: var(--arc-panel);
  border: 1px solid var(--arc-line);
  border-top: 3px solid var(--ac);
  color: var(--arc-ink);
  text-decoration: none;
  transition: border-color 0.25s, transform 0.25s var(--ease-out);
}
.act:hover { color: var(--arc-ink); border-color: color-mix(in srgb, var(--ac) 45%, transparent); border-top-color: var(--ac); transform: translateY(-2px); }
.act-h { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
.act-h b { font-size: 28px; font-weight: 800; color: var(--ac); line-height: 1; }
.act-h span { font-size: 13px; color: var(--arc-mute); }
.act-p { font-size: 13.5px; color: var(--arc-dim); }
.it {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 12px;
  background: rgba(242, 235, 221, 0.03);
  transition: background 0.2s;
}
.act:hover .it { background: rgba(242, 235, 221, 0.05); }
.ic {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  border-radius: 10px;
  padding: 4px;
  border: 1px solid var(--rc);
  background: radial-gradient(circle at 50% 30%, var(--rb), #100E14 75%);
}
.ic img { width: 100%; height: 100%; object-fit: contain; }
.tx { flex: 1; min-width: 0; }
.tx b { display: block; font-size: 13.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tx span { display: block; font-size: 12px; color: var(--rt); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.v { font-family: var(--font-brand); font-size: 13.5px; font-weight: 600; color: var(--arc-ink-2); }

.how {
  margin-top: 16px;
  padding: 20px 22px;
  border-radius: 18px;
  background: var(--arc-panel);
  border: 1px solid var(--arc-line);
}
.how-h { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; }
.how-h h3 { margin: 0; font-size: 26px; font-weight: 800; }
.how-n { font-size: 14px; color: var(--arc-mute); }
.how-n b { font-family: var(--font-brand); font-size: 22px; color: var(--arc-yellow); margin-right: 6px; }
.how-l {
  list-style: none;
  margin: 14px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
  gap: 10px;
}
.how-l li {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(242, 235, 221, 0.03);
  border-left: 3px solid var(--ac);
  font-size: 13.5px;
  color: #C9C2B6;
  line-height: 1.45;
}
.how-l b { font-family: var(--font-arc); font-size: 19px; font-weight: 800; text-transform: uppercase; color: var(--ac); }
.how-f { margin: 14px 0 0; font-size: 13px; color: var(--arc-faint); }

.isearch {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 16px;
  padding: 14px;
  border-radius: 16px;
  background: var(--arc-panel);
  border: 1px solid var(--arc-line);
}
.isearch .search { flex: 1 1 320px; }
.isearch .btn-y { height: 46px; font-size: 17px; }

@media (max-width: 560px) {
  .act { padding: 14px; }
  .how { padding: 16px; }
  .how-h h3 { font-size: 22px; }
  .isearch .btn-y { flex: 1 1 100%; }
}
</style>
