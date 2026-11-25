<template>
  <!-- Glosario para recién llegados (diseño: #basico) -->
  <section class="sec" id="basico">
    <div class="wrap">
      <div class="sec-h">
        <div>
          <span class="kicker">Para recién llegados</span>
          <h2 class="h2">Lo básico</h2>
          <p>Las palabras que vas a leer en todas las fichas.</p>
        </div>
      </div>
      <div class="gls">
        <div v-for="t in TERMS" :key="t[0]" class="gl"><b class="sc">{{ t[0] }}</b><p>{{ t[1] }}</p></div>
      </div>
    </div>
  </section>
</template>

<script setup>
const TERMS = [
  ["Grupo 935", "El grupo de científicos alemanes que experimentaba con el Elemento 115: el origen de todo."],
  ["El Aether", "La dimensión de donde sale el poder del 115. «Aether» es también el nombre de toda la historia de 2008 a 2019."],
  ["Agartha", "«La Casa»: un lugar fuera del tiempo, puro y luminoso, donde vive el Doctor Monty."],
  ["Llave de la Invocación", "Un orbe que guarda almas y abre portales: el objeto alrededor del que gira Black Ops III."],
  ["Elemento 115", "El mineral que lo provoca todo: reanima a los muertos y alimenta las máquinas y las armas maravilla."],
  ["Pack-a-Punch", "La máquina que mejora tu arma por 5.000 puntos: más daño, más munición y a veces efectos nuevos."],
  ["Caja misteriosa", "Arma aleatoria por 950 puntos. Cuando aparece el osito, cambia de sitio."],
  ["Ventajas (Perk-a-Cola)", "Bebidas que te mejoran: Juggernog (más vida), Quick Revive, Speed Cola (recarga), Double Tap…"],
  ["Armas maravilla", "Armas únicas de cada mapa, como el Ray Gun, la Thundergun o los bastones de Origins."],
  ["Easter egg principal", "La misión secreta de cada mapa que cuenta la historia. Suele necesitar varios jugadores."],
];
</script>
