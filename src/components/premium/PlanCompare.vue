<template>
  <!-- Comparativa Gratis / Premium por juego (.cmp de Premium.dc.html). -->
  <div class="cmp-box">
    <table class="cmp">
      <thead>
        <tr>
          <th scope="col"><span class="sr-only">Función</span></th>
          <th scope="col">Gratis</th>
          <th scope="col" class="pc">Premium</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="g in GROUPS" :key="g.name">
          <tr class="grp">
            <th colspan="3" scope="colgroup">
              <span class="gh">
                <GmMark v-if="!g.logo" :size="20" />
                <img v-else :src="g.logo" alt="">
                {{ g.name }}
              </span>
            </th>
          </tr>
          <tr v-for="r in g.rows" :key="r.label">
            <th scope="row">{{ r.label }}</th>
            <td v-for="(v, i) in [r.free, r.premium]" :key="i" :class="{ pc: i === 1 }">
              <span v-if="v === true" class="ck" :class="{ g: i === 1 }" role="img" aria-label="Incluido">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="5 12 10 17 19 7" /></svg>
              </span>
              <span v-else-if="v === false" class="dash" role="img" aria-label="No incluido" />
              <span v-else class="tx" :class="i === 1 ? 'g' : 'd'">{{ v }}</span>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import GmMark from "@/components/brand/GmMark.vue";

// true = incluido, false = no incluido, texto = se enseña tal cual.
const GROUPS = [
  {
    name: "Toda la web",
    logo: null,
    rows: [
      { label: "Guías, tier lists y mapas", free: true, premium: true },
      { label: "Favoritos y progreso guardados en tu cuenta", free: true, premium: true },
      { label: "Publicidad", free: "Con anuncios", premium: "Sin anuncios" },
      { label: "Acceso anticipado a herramientas nuevas", free: false, premium: true },
      { label: "Insignia Premium en tu perfil", free: false, premium: true },
    ],
  },
  {
    name: "League of Legends",
    logo: "/images/games/logo-lol.png",
    rows: [
      { label: "Tier list con winrate, pickrate y banrate por rango", free: true, premium: true },
      { label: "Build completa y runas de cada campeón", free: true, premium: true },
      { label: "Aviso cuando sale un parche nuevo", free: false, premium: true },
    ],
  },
  {
    name: "ARC Raiders",
    logo: "/images/games/logo-arc.png",
    rows: [
      { label: "Objetos, misiones, enemigos y mapas", free: true, premium: true },
      { label: "Aviso cuando llega una actualización del juego", free: false, premium: true },
    ],
  },
  {
    name: "Zelda: Tears of the Kingdom",
    logo: "/images/games/logo-zelda.png",
    rows: [
      { label: "Mapa con santuarios, torres, cuevas y semillas", free: true, premium: true },
      { label: "Aviso cuando añadimos guías o puntos al mapa", free: false, premium: true },
    ],
  },
];
</script>

<style scoped>
.cmp-box {
  margin-top: 36px;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  overflow-x: auto;
}
.cmp {
  width: 100%;
  min-width: 620px;
  border-collapse: collapse;
  font-size: 14.5px;
}
.cmp thead th {
  padding: 20px 24px;
  text-align: center;
  font-family: var(--font-brand);
  font-size: 14px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #C6CBD2;
  background: var(--bg-raised);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.cmp thead th:first-child {
  text-align: left;
}
.cmp thead th.pc {
  color: var(--gm-gold);
}
.cmp th[scope="row"] {
  padding: 15px 24px;
  text-align: left;
  font-weight: 500;
  color: #D6D3CB;
}
.cmp td {
  padding: 15px 24px;
  text-align: center;
  width: 180px;
}
.cmp td.pc {
  background: rgba(212, 160, 74, 0.05);
}
.cmp tbody tr {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}
.cmp tbody tr:not(.grp):hover {
  background: rgba(255, 255, 255, 0.025);
}
.cmp .grp th {
  padding: 22px 24px 10px;
  text-align: left;
}
.gh {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink);
}
.gh img {
  width: 26px;
  height: 26px;
  object-fit: contain;
}
.ck {
  display: inline-grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  color: #C6CBD2;
}
.ck.g {
  background: rgba(212, 160, 74, 0.16);
  color: var(--gm-gold);
}
.dash {
  display: inline-block;
  width: 14px;
  height: 2px;
  border-radius: 2px;
  background: #5D6572;
  vertical-align: middle;
}
.tx {
  font-size: 13.5px;
  font-weight: 600;
}
.tx.d {
  color: var(--ink-mute);
}
.tx.g {
  color: var(--gm-gold);
}

@media (max-width: 640px) {
  .cmp {
    min-width: 0;
    font-size: 13.5px;
  }
  .cmp thead th {
    padding: 14px 6px;
    font-size: 11px;
    letter-spacing: 0.08em;
  }
  .cmp th[scope="row"] {
    padding: 12px;
  }
  .cmp td {
    width: 70px;
    padding: 12px 4px;
  }
  .cmp .grp th {
    padding: 18px 12px 8px;
  }
  .tx {
    font-size: 11.5px;
  }
}
</style>
