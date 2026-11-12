<template>
  <!-- Bloque Premium del hub (#premium). El pago y la gestión van por la
       cuenta: los botones llevan a /premium o a /cuenta/premium. -->
  <section class="prem" aria-labelledby="prem-h">
    <span id="premium" class="lol-anchor" aria-hidden="true"></span>
    <div class="wrap">
      <div class="kicker">Premium</div>
      <h2 id="prem-h" class="h2 disp">Navega sin anuncios</h2>
      <p class="prem-lead">
        Toda la tier list, winrates y builds completas son gratis para todo el mundo. Premium quita la publicidad y añade alertas de
        cambios de parche antes de que salgan las notas oficiales.
      </p>
      <div class="plans">
        <div class="plan">
          <span class="pn">Gratis</span>
          <div class="pp">0€ <span>siempre</span></div>
          <ul>
            <li v-for="f in free" :key="f"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="5 12 10 17 19 7" /></svg>{{ f }}</li>
            <li class="minus"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="12" x2="18" y2="12" /></svg>Con publicidad</li>
          </ul>
          <span class="btn-off">{{ isPremium ? "Incluido en tu plan" : "Tu plan actual" }}</span>
        </div>
        <div class="plan feat">
          <span class="pn">Premium</span>
          <div class="pp">4,99€ <span>/mes</span></div>
          <ul>
            <li v-for="f in prem" :key="f"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="5 12 10 17 19 7" /></svg>{{ f }}</li>
          </ul>
          <RouterLink v-if="isPremium" class="btn-gold" to="/cuenta/premium">Premium activo · gestionar</RouterLink>
          <!-- La prueba de 7 días es del plan mensual: /premium se abre con él elegido. -->
          <RouterLink v-else class="btn-gold" :to="{ path: '/premium', query: { plan: 'mensual' } }">Empezar prueba de 7 días</RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useAuth } from "@/composables/useAuth";

const { isPremium } = useAuth();
const free = ["Tier list completa", "Winrate, pickrate y banrate reales", "Build completa: inicial, botas, núcleo y runas"];
const prem = ["Todo lo del plan Gratis", "Sin publicidad", "Alertas de cambios de parche", "Acceso anticipado a nuevas herramientas"];
</script>

<style scoped>
.prem {
  position: relative;
  padding: 56px 0 64px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: radial-gradient(800px 300px at 20% 0%, rgba(226, 181, 102, 0.08), transparent 70%);
}
.h2 { margin: 10px 0 0; font-size: clamp(28px, 3vw, 38px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; }
.prem-lead { margin: 10px 0 0; color: var(--ink-dim); max-width: 620px; font-size: 15.5px; }
.plans {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: 16px;
  max-width: 820px;
  margin-top: 28px;
}
.plan {
  padding: 24px;
  border-radius: 20px;
  background: #0D1017;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.plan.feat {
  border-color: rgba(226, 181, 102, 0.5);
  background: linear-gradient(180deg, rgba(226, 181, 102, 0.1), #0D1017 45%);
  box-shadow: 0 30px 80px -40px rgba(226, 181, 102, 0.6);
}
.pn { font-size: 13px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-dim); }
.feat .pn { color: var(--accent); }
.pp { font-family: var(--font-display); font-size: 40px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; }
.pp span { font-family: var(--font-body); font-size: 14px; font-weight: 500; color: var(--ink-mute); letter-spacing: 0; }
.plan ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 9px; font-size: 14px; color: #C6CBD2; flex: 1; }
.plan li { display: flex; gap: 10px; align-items: flex-start; }
.plan li svg { flex-shrink: 0; margin-top: 2px; color: #62D99C; }
.plan li.minus,
.plan li.minus svg { color: var(--ink-mute); }
.btn-off {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 46px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--ink-mute);
  font-weight: 600;
  font-size: 14.5px;
}
@media (max-width: 560px) {
  .prem { padding: 40px 0 48px; }
  .plan { padding: 20px; }
}
</style>
