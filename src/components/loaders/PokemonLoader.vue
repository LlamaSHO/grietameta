<template>
  <!-- Pokémon: la Poké Ball cae, rebota y se tambalea mientras carga. -->
  <div class="gl-screen gl-pk">
    <div class="drop" aria-hidden="true">
      <svg class="ball" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="glPkR" cx="38%" cy="28%" r="75%"><stop offset="0" stop-color="#FF8A7A" /><stop offset=".45" stop-color="#EE3B36" /><stop offset="1" stop-color="#A3161C" /></radialGradient>
          <radialGradient id="glPkW" cx="40%" cy="70%" r="70%"><stop offset="0" stop-color="#FFFFFF" /><stop offset=".6" stop-color="#E9ECF2" /><stop offset="1" stop-color="#A9AFBC" /></radialGradient>
        </defs>
        <path d="M3 50a47 47 0 0 1 94 0z" fill="url(#glPkR)" />
        <path d="M3 50a47 47 0 0 0 94 0z" fill="url(#glPkW)" />
        <rect x="2" y="45.5" width="96" height="9" fill="#14161D" />
        <circle cx="50" cy="50" r="47" fill="none" stroke="#14161D" stroke-width="3.4" />
        <circle cx="50" cy="50" r="15.5" fill="#14161D" />
        <circle cx="50" cy="50" r="10.5" fill="#F1F3F8" stroke="#9AA1AE" stroke-width="1.2" />
        <circle class="btn" cx="50" cy="50" r="6" fill="#F4F5F8" />
        <ellipse cx="33" cy="22" rx="13" ry="6.5" fill="#FFFFFF" opacity=".45" transform="rotate(-28 33 22)" />
      </svg>
    </div>
    <i class="shadow" aria-hidden="true"></i>
    <span class="gl-txt">Atrapando datos…</span>
  </div>
</template>

<style scoped>
.gl-pk { background: radial-gradient(600px 400px at 50% 45%, rgba(255, 90, 78, 0.16), transparent 70%), #0b0e1a; color: #f1f3f8; }
.drop { position: relative; z-index: 1; animation: drop 0.9s cubic-bezier(0.3, 0, 0.3, 1) both; }
.ball { display: block; width: 92px; height: 92px; transform-origin: 50% 90%; animation: wobble 1.2s ease-in-out 0.9s infinite; }
.btn { animation: blink 1.2s ease-in-out 0.9s infinite; }
.shadow { position: absolute; top: calc(50% + 46px); left: 50%; width: 80px; height: 12px; margin-left: -40px; border-radius: 50%; background: rgba(0, 0, 0, 0.5); animation: shadow 0.9s ease both; }
@keyframes drop { 0% { transform: translateY(-48vh); } 60% { transform: none; } 75% { transform: translateY(-22px); } 100% { transform: none; } }
@keyframes wobble { 0%, 60%, 100% { transform: rotate(0); } 70% { transform: rotate(-14deg); } 85% { transform: rotate(10deg); } }
@keyframes blink { 0%, 60%, 100% { fill: #f4f5f8; } 75% { fill: #ffd36a; } }
@keyframes shadow { from { transform: scale(0.3); opacity: 0; } to { transform: none; opacity: 1; } }
</style>
