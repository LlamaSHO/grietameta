<template>
  <svg class="dna" viewBox="0 0 40 263" width="40" height="263" aria-hidden="true" focusable="false">
    <path class="backbone" d="M20 1C-5 16 45 30 20 45S-5 74 20 89 45 118 20 133-5 162 20 177s25 29 0 44-25 29 0 42" />
    <path class="backbone secondary" d="M20 1c25 15-25 29 0 44s25 29 0 44-25 29 0 44 25 29 0 44-25 29 0 44 25 29 0 42" />
    <g class="rungs">
      <path d="M20 8h2M13 23h14M16 38h8M23 53h14M12 68h16M2 83h18M8 98h24M20 113h12M24 128h8M18 143h12M6 158h24M2 173h18M8 188h24M24 203h12M18 218h12M2 233h18M8 248h24M19 262h1" />
    </g>
    <g class="beads">
      <circle cx="20" cy="8" r="2.6" /><circle cx="22" cy="8" r="2.1" />
      <circle cx="13" cy="23" r="2.6" /><circle cx="27" cy="23" r="2.1" />
      <circle cx="16" cy="38" r="2.6" /><circle cx="24" cy="38" r="2.1" />
      <circle cx="23" cy="53" r="2.6" /><circle cx="37" cy="53" r="2.1" />
      <circle cx="12" cy="68" r="2.6" /><circle cx="28" cy="68" r="2.1" />
      <circle cx="2" cy="83" r="2.6" /><circle cx="18" cy="83" r="2.1" />
      <circle cx="8" cy="98" r="2.6" /><circle cx="32" cy="98" r="2.1" />
      <circle cx="20" cy="113" r="2.6" /><circle cx="32" cy="113" r="2.1" />
      <circle cx="24" cy="128" r="2.6" /><circle cx="32" cy="128" r="2.1" />
      <circle cx="18" cy="143" r="2.6" /><circle cx="30" cy="143" r="2.1" />
      <circle cx="6" cy="158" r="2.6" /><circle cx="30" cy="158" r="2.1" />
      <circle cx="2" cy="173" r="2.6" /><circle cx="18" cy="173" r="2.1" />
      <circle cx="8" cy="188" r="2.6" /><circle cx="32" cy="188" r="2.1" />
      <circle cx="24" cy="203" r="2.6" /><circle cx="36" cy="203" r="2.1" />
      <circle cx="18" cy="218" r="2.6" /><circle cx="30" cy="218" r="2.1" />
      <circle cx="2" cy="233" r="2.6" /><circle cx="18" cy="233" r="2.1" />
      <circle cx="8" cy="248" r="2.6" /><circle cx="32" cy="248" r="2.1" />
      <circle cx="19" cy="262" r="2.6" /><circle cx="20" cy="262" r="2.1" />
    </g>
  </svg>
</template>

<style scoped>
.dna { display: block; overflow: visible; opacity: .7; }
.backbone,.rungs path { fill: none; stroke: #43839c; stroke-width: 1.1; stroke-linecap: round; }
.backbone.secondary { stroke: #8fe3ff50; }
.rungs path { stroke: #9de9ff40; stroke-width: .7; }
.beads circle:first-child { fill: #8fe3ff; }
.beads circle { fill: #e9f8ff; opacity: .83; }
</style>
