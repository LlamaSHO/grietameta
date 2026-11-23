Quiero ampliar GrietaMeta con seis juegos nuevos. Trabaja sobre el lienzo de GrietaMeta que ya tenemos (https://claude.ai/code/artifact/7a6dd2b8-227b-4e01-946c-2a1a4e1ccc68): Main, Lol, LolCampeon, Zelda, Arc, ArcMapa, Premium, MiPremium, Login y Contacto.

## Lo que hay que respetar del lienzo

- El sistema de la web: fondo #07090D, logo GM tricolor, nav central con la barra de cada juego y sus mega-menús, pie, barra inferior en móvil, Bricolage Grotesque para títulos, IBM Plex Sans para texto y Chakra Petch para la marca.
- Cada juego tiene su propia identidad dentro de ese sistema, como ya pasa con LoL (dorado), ARC (naranja, Barlow Condensed) y Zelda (verde agua, Cinzel). No quiero que copies esos diseños: quiero que cada juego nuevo tenga algo único, pero que se note que es la misma web.
- Todo responsive, con móvil incluido (cortes en 860, 640 y 560 px), como el resto del lienzo.

## Lo que NO quiero

- Nada genérico: ni páginas hechas de tarjetas iguales con icono y texto, ni todo gris y apagado.
- Sin imágenes no vale. Quiero imágenes por todas partes: arte de cada juego, mapas, Pokémon, dinosaurios, armas, personajes, capturas… Si no tienes una imagen, deja un hueco con su etiqueta clara para saber qué va ahí.

## Los juegos

En todos se va **del juego más antiguo al más reciente**, y cada juego o mapa es una subsección (como los mapas de ARC). Lo común a todos:
- una portada del juego;
- una **guía para completar el juego al 100 %**, con progreso que se marca;
- **mapas interactivos con zoom** (como el de Zelda) con puntos que se pueden pulsar: coleccionables, misiones secundarias, dónde conseguir cada cosa;
- listas con filtros;
- mini-guías sacadas de foros y wikis.

### 1. Pokémon (el primero que hay que diseñar)

Pokémon está lleno de vida: quiero **mucho color**, el de los tipos y el de cada región.
- **Portada:** un mini resumen de todo lo nuevo, con el **meta competitivo** como protagonista.
- **Subsecciones:** una por juego o región, empezando por la 1.ª generación (Rojo, Azul y Amarillo, Kanto) y avanzando generación a generación.
- **Apartados comunes:**
  - Pokédex con todos los Pokémon, ficha completa y dónde capturar cada uno en cada juego;
  - habilidades (buenas, malas y situacionales);
  - naturalezas (cuál es mejor y peor para cada Pokémon);
  - movimientos;
  - tabla de tipos y matchups.
- **Por juego:**
  - guía de la historia;
  - guía 100 % (Pokédex completa, secundarias, objetos, MT, legendarios);
  - mapa interactivo de la región con Pokémon por zona, objetos y misiones.
- **Cosas de cada generación:** en la 1.ª no existen habilidades, naturalezas, objetos equipados ni crianza, hay una sola estadística «Especial» y la tabla de tipos es distinta. Hace falta un selector de generación.
- **Ya probé una versión y lo único que me gustó** fue la Pokédex (rejilla con filtros por tipo y ficha lateral) y la tabla de tipos de 15×15 con calculador de debilidades. Puedes partir de esas dos ideas, con más color e imágenes.

### 2. ARK

En ARK la historia es secundaria: lo importante es capturar dinosaurios, hacer tu tribu, tu casa…
- **Portada** de ARK.
- **Una sección por mapa:** primero Survival Evolved, empezando por The Island, y los demás mapas por orden de salida. Survival Ascended va después.
- **Mapa interactivo por mapa:**
  - spawns de cada dinosaurio;
  - recursos (metal, cristal, obsidiana, petróleo…);
  - cuevas, artefactos, obeliscos y notas;
  - buenos sitios para hacer base.
- **Dinosaurios:** ficha de cada uno con cómo tamearlo, qué hace falta (comida, kibble, tiempo, nivel de montura), para qué sirve y dónde sale. Incluye una calculadora de tameo.
- **Engramas y crafteables:** todos, con filtros, receta, dónde craftearlos y dónde conseguir cada recurso.
- **Mini-guías:**
  - casas, fuertes y bases;
  - sistemas de agua y drenaje;
  - electricidad;
  - granjas;
  - cría y mutaciones;
  - tribu.
- **Guía de progresión:** jefes, tributos y orden recomendado de mapas.

### 3. Assassin's Creed

- **Portada de la saga** con la lista de todos los juegos.
- **Primero Unity**, que es el que estoy jugando. Después, los demás del más antiguo al más reciente.
- **Por cada juego:**
  - historia (secuencias y memorias);
  - misiones secundarias;
  - coleccionables;
  - equipo y habilidades;
  - guía 100 %;
  - **mapa interactivo** con zoom y puntos que se pueden pulsar. En Unity: París por distritos, cofres, escarapelas, fragmentos de Helix, enigmas de Nostradamus, asesinatos misteriosos, puntos de sincronización y Dead Kings.

### 4. Call of Duty

- **Primero Zombies**, desde World at War (Nacht der Untoten, Verrückt, Shi No Numa, Der Riese) hasta el más reciente.
- **Por cada mapa de Zombies:**
  - mapa interactivo (caja misteriosa, ventajas, Pack-a-Punch, armas de pared, piezas, trampas);
  - Easter egg paso a paso con progreso;
  - armas maravilla;
  - estrategias.
- **La historia (campañas)** de momento es un bloque de «Próximamente», que tiene que verse en la portada y en el menú.

### 5. Resident Evil

- **Portada de la saga.** Cada juego tiene su página y **los remakes son juegos aparte**.
- **Por juego:**
  - guía de la historia;
  - **mapa interactivo** por zona o planta con objetos clave, munición, documentos, coleccionables y cajas fuertes con sus códigos;
  - puzles resueltos (con aviso de spoiler);
  - armas y mejoras;
  - enemigos y jefes;
  - guía 100 % (rangos, desbloqueables, logros).

### 6. Rust

- Como ARK: supervivencia, construir y raidear.
- **El mapa cambia en cada wipe**, así que los mapas interactivos son los de cada **monumento**: botín, puzles de tarjetas, radiación y NPC.
- **Objetos y planos** con filtros.
- **Calculadora de raideo:** explosivos por pared y puerta.
- **Guías:**
  - bases (solo, dúo, clan);
  - electricidad;
  - granjas y genes;
  - inicio de wipe.

## Qué te pido ahora

1. Empieza por **Pokémon**: la portada de Pokémon, la página de Kanto, la Pokédex con ficha, la tabla de tipos, el mapa interactivo de Kanto, la guía 100 % de Kanto, habilidades y naturalezas, y competitivo. Todas con versión de escritorio y de móvil.
2. Añade Pokémon, ARK, Assassin's Creed, Call of Duty, Resident Evil y Rust a la portada principal (Main), al buscador y al menú de juegos.
3. Después seguiremos juego a juego con ARK, Assassin's Creed, Call of Duty, Resident Evil y Rust, siempre con la misma idea: portada del juego, subsección por juego o mapa, mapa interactivo, listas con filtros, guía 100 % y mini-guías.
