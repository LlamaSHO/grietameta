<template>
  <div ref="root" class="view-privacy">
    <nav class="nav">
      <div class="wrap">
        <div class="brand">
          <div class="brand-mark"></div>
          <div class="brand-name">GRIETA<span>META</span></div>
        </div>
        <div class="nav-links">
          <a href="/lol#tierlist">Tier list</a>
          <a href="/lol#campeones">Campeones</a>
          <a href="/lol#premium">Premium</a>
        </div>
        <button class="nav-cta" @click="$router.push('/lol#premium')">Hazte Premium</button>
      </div>
    </nav>

    <main class="legal-wrap">
      <h1>Política de privacidad</h1>
      <p class="legal-updated">Última actualización: 16 de septiembre de 2026</p>

      <h2>Quiénes somos</h2>
      <p>GrietaMeta ("nosotros", "el sitio") es un sitio informativo sobre estadísticas, builds y tier lists de League of Legends. Esta política explica qué datos se recogen cuando visitas <strong>grietameta.vercel.app</strong> y con qué finalidad se usan.</p>
      <p>GrietaMeta no está afiliado a Riot Games. League of Legends y Riot Games son marcas registradas de Riot Games, Inc.</p>

      <h2>Qué datos recogemos</h2>
      <p>Al navegar por GrietaMeta se pueden recoger automáticamente los siguientes datos:</p>
      <ul>
        <li>Datos técnicos básicos: tipo de navegador, dispositivo, sistema operativo y dirección IP aproximada.</li>
        <li>Páginas visitadas, tiempo de permanencia y campeones consultados, con fines estadísticos.</li>
        <li>Si te suscribes a un plan Premium: correo electrónico y datos de facturación necesarios para procesar el pago (gestionados por nuestro procesador de pagos, no almacenamos números de tarjeta en nuestros servidores).</li>
      </ul>
      <p>No pedimos ni almacenamos datos sensibles, y no es necesario registrarse para consultar la tier list, las builds ni los winrates gratuitos.</p>

      <h2>Cookies y publicidad</h2>
      <p>GrietaMeta muestra anuncios a través de <strong>Google AdSense</strong>. Google y sus socios publicitarios pueden usar cookies y tecnologías similares para mostrar anuncios en función de tus visitas a este sitio y a otros sitios en internet.</p>
      <ul>
        <li>Puedes inhabilitar la publicidad personalizada de Google visitando <a href="https://adssettings.google.com" target="_blank" rel="noopener">adssettings.google.com</a>.</li>
        <li>Más información sobre cómo Google usa estos datos en <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">policies.google.com/technologies/partner-sites</a>.</li>
        <li>También puedes gestionar o bloquear cookies desde la configuración de tu navegador en cualquier momento.</li>
      </ul>

      <h2>Con quién compartimos datos</h2>
      <p>No vendemos tus datos personales. Los compartimos únicamente con:</p>
      <ul>
        <li><strong>Google AdSense</strong>, para la gestión de publicidad.</li>
        <li>Nuestro <strong>procesador de pagos</strong>, únicamente si contratas un plan Premium.</li>
        <li>Proveedores de análisis de tráfico, para entender el uso agregado del sitio.</li>
      </ul>

      <h2>Cuánto tiempo conservamos los datos</h2>
      <p>Los datos de navegación agregados se conservan el tiempo necesario para fines estadísticos. Si tienes una cuenta Premium, conservamos tus datos de facturación mientras la suscripción esté activa y durante el plazo legal exigido tras su cancelación.</p>

      <h2>Tus derechos</h2>
      <p>Puedes solicitar acceso, corrección o eliminación de tus datos personales, así como oponerte al tratamiento con fines publicitarios, escribiendo a <a href="mailto:ekainarlla@gmail.com">ekainarlla@gmail.com</a>.</p>

      <h2>Menores de edad</h2>
      <p>GrietaMeta no está dirigido a menores de 13 años y no recogemos conscientemente datos personales de menores de esa edad.</p>

      <h2>Cambios en esta política</h2>
      <p>Podemos actualizar esta política de privacidad ocasionalmente. Publicaremos cualquier cambio en esta misma página junto con la fecha de la última actualización.</p>

      <h2>Contacto</h2>
      <p>Si tienes preguntas sobre esta política, escríbenos a <a href="mailto:ekainarlla@gmail.com">ekainarlla@gmail.com</a>.</p>
    </main>

    <footer>
      <div class="wrap">
        <div class="foot-top">
          <div style="max-width:360px;">
            <div class="brand-name" style="margin-bottom:10px;">GRIETA<span>META</span></div>
            <p>GrietaMeta no está afiliado a Riot Games. League of Legends y Riot Games son marcas registradas o marcas comerciales de Riot Games, Inc.</p>
          </div>
          <div class="foot-cols">
            <div class="foot-col">
              <h5>Producto</h5>
              <a href="/lol#tierlist">Tier list</a>
              <a href="/lol#campeones">Campeones</a>
              <a href="/lol#premium">Premium</a>
            </div>
            <div class="foot-col">
              <h5>Legal</h5>
              <a href="/privacidad">Privacidad</a>
              <a href="#">Términos</a>
              <a href="#">Publicidad</a>
            </div>
          </div>
        </div>
        <div>© 2026 GrietaMeta. Datos de ejemplo con fines de demostración.</div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import "@/assets/styles/views/privacy.css";
</script>
