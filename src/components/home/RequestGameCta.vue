<template>
  <!-- "¿Echas de menos algún juego?" (.req de models/paginas/Main.dc.html). -->
  <section class="wrap req-sec">
    <div class="req">
      <div class="req-ico" aria-hidden="true">
        <span class="hex-spin"></span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
      </div>
      <div class="req-txt">
        <h3>¿Echas de menos algún juego?</h3>
        <p>Escríbelo en el buscador de arriba y te diremos cómo pedirlo.</p>
      </div>
      <RouterLink class="btn-line" :to="{ path: '/contacto', query: { motivo: 'juego' } }">
        Pedir un juego
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.req {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  padding: 26px 28px;
  border-radius: 24px;
  border: 1px dashed rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.02);
  transition: border-color 0.3s, background 0.3s;
}
.req:hover {
  border-color: rgba(212, 160, 74, 0.55);
  background: rgba(212, 160, 74, 0.04);
}
.req-ico {
  position: relative;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  overflow: hidden;
}
.hex-spin {
  position: absolute;
  inset: -45%;
  background: conic-gradient(from 0deg, var(--gm-gold), var(--gm-orange), var(--gm-teal), var(--gm-gold));
  animation: gm-spin 9s linear infinite;
}
.req-ico svg {
  position: relative;
  color: #0A0C10;
  transition: transform 0.5s var(--ease-out);
}
.req:hover .req-ico svg {
  transform: rotate(90deg);
}
.req-txt {
  flex: 1 1 320px;
  min-width: 0;
}
.req-txt h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.req-txt p {
  margin: 4px 0 0;
  color: var(--ink-dim);
  font-size: 15px;
}
.btn-line {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  padding: 0 20px;
  border-radius: 13px;
  border: 1px solid rgba(212, 160, 74, 0.5);
  color: var(--gold-hi);
  font-weight: 600;
  font-size: 14.5px;
  text-decoration: none;
  transition: background 0.25s, color 0.25s;
}
.btn-line:hover {
  background: var(--gold);
  color: #17120A;
}
.btn-line:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
}
.btn-line svg {
  transition: transform 0.3s;
}
.btn-line:hover svg {
  transform: translateX(4px);
}

/* Móvil: icono y texto en fila, botón a lo ancho debajo. */
@media (max-width: 560px) {
  .req {
    gap: 16px 18px;
    padding: 22px 20px;
  }
  .req-ico {
    width: 52px;
    height: 52px;
  }
  .req-txt {
    flex: 1 1 0;
  }
  .req-txt h3 {
    font-size: 19px;
  }
  .req-txt p {
    font-size: 14px;
  }
  .btn-line {
    width: 100%;
    justify-content: center;
  }
}
</style>
