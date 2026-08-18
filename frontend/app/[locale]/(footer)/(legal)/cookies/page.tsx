export default async function CookiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return (
    <div className="space-y-6 text-sm md:text-base leading-relaxed">
      <h1 className="text-3xl font-bold mb-6">Política de Cookies</h1>
      <p className="text-muted-foreground text-sm">Última actualización: {new Date().toLocaleDateString()}</p>
      
      <p className="text-lg">
        En RefurbTrack utilizamos cookies y tecnologías similares para mejorar tu experiencia de navegación, analizar el tráfico del sitio web y personalizar el contenido. Esta política explica qué son las cookies, cómo las usamos y cómo puedes controlarlas.
      </p>

      <h3 className="text-xl font-bold mt-8">¿Qué son las cookies?</h3>
      <p>
        Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador, tablet, smartphone) cuando visitas un sitio web. Permiten que el sitio recuerde tus acciones y preferencias durante un período de tiempo, para que no tengas que volver a configurarlas cada vez que regreses.
      </p>

      <h3 className="text-xl font-bold mt-8">Tipos de cookies que utilizamos</h3>
      
      <div className="space-y-6 mt-4">
        <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 dark:bg-blue-900/10 p-4">
          <h4 className="font-bold text-lg mb-2">🔧 Cookies Técnicas (Estrictamente Necesarias)</h4>
          <p className="mb-2">Estas cookies son esenciales para el funcionamiento básico del sitio web y no pueden desactivarse.</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>Tema preferido:</strong> Recordar si prefieres modo oscuro o claro</li>
            <li><strong>Consentimiento de cookies:</strong> Guardar tu elección sobre el banner de cookies</li>
            <li><strong>Sesión del navegador:</strong> Mantener tu sesión activa mientras navegas</li>
          </ul>
          <p className="text-xs mt-2 text-muted-foreground"><strong>Duración:</strong> Sesión o hasta 1 año | <strong>Base legal:</strong> Interés legítimo (funcionamiento del sitio)</p>
        </div>

        <div className="border-l-4 border-green-500 pl-4 bg-green-50 dark:bg-green-900/10 p-4">
          <h4 className="font-bold text-lg mb-2">📊 Cookies Analíticas</h4>
          <p className="mb-2">Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web recopilando información de forma anónima.</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>Google Analytics (_ga, _gid, _gat):</strong> Análisis de tráfico, páginas más visitadas, tiempo de permanencia, tasa de rebote</li>
            <li><strong>Datos recopilados:</strong> Páginas vistas, origen del tráfico, tipo de dispositivo, navegador, datos demográficos agregados</li>
            <li><strong>IP anonimizada:</strong> Activamos la anonimización de IP en cumplimiento con RGPD</li>
          </ul>
          <p className="text-xs mt-2 text-muted-foreground"><strong>Duración:</strong> Hasta 26 meses | <strong>Base legal:</strong> Consentimiento del usuario</p>
        </div>

        <div className="border-l-4 border-emerald-500 pl-4 bg-emerald-50 dark:bg-emerald-900/10 p-4">
          <h4 className="font-bold text-lg mb-2">💰 Cookies de Marketing/Afiliación</h4>
          <p className="mb-2"><strong>Estas cookies son cruciales para nuestro modelo de negocio.</strong> Cuando haces clic en una oferta hacia una tienda colaboradora, se almacena una cookie para rastrear la referencia.</p>
          <p className="mt-2 text-sm">
            <strong>¿Qué información contienen?</strong> Solo un identificador único que indica que el visitante provino de RefurbTrack. <strong>NO contienen datos personales</strong> como nombre, email o dirección.
          </p>
          <p className="mt-2 text-sm">
            <strong>¿Cómo funcionan?</strong> Si completas una compra dentro del periodo de validez (generalmente 30 días), el vendedor nos paga una pequeña comisión sin coste adicional para ti.
          </p>
          <p className="text-xs mt-2 text-muted-foreground"><strong>Duración:</strong> 1-90 días según red de afiliación | <strong>Base legal:</strong> Consentimiento + Interés legítimo</p>
        </div>

        <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 dark:bg-purple-900/10 p-4">
          <h4 className="font-bold text-lg mb-2">⚙️ Cookies de Funcionalidad</h4>
          <p className="mb-2">Permiten recordar tus preferencias y ofrecer funcionalidades mejoradas.</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>Favoritos guardados:</strong> Productos que marcas como favoritos (almacenamiento local)</li>
            <li><strong>Filtros preferidos:</strong> Recordar tus filtros de búsqueda (marca, estado, rango de precio)</li>
            <li><strong>Idioma:</strong> Preferencia de idioma (si implementamos multi-idioma)</li>
          </ul>
          <p className="text-xs mt-2 text-muted-foreground"><strong>Duración:</strong> Hasta 1 año | <strong>Base legal:</strong> Consentimiento implícito (mejora de experiencia)</p>
        </div>
      </div>

      <h3 className="text-xl font-bold mt-8">Cookies de terceros</h3>
      <p>
        Algunos servicios externos que usamos pueden establecer sus propias cookies cuando interactúas con ellos:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li><strong>Google Fonts:</strong> Tipografías optimizadas (puede almacenar caché)</li>
        <li><strong>Sitios de vendedores:</strong> Al ser redirigido a Back Market, Amazon, etc., esos sitios establecen sus propias cookies bajo sus políticas</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">¿Por qué necesitamos cookies de afiliación?</h3>
      <div className="bg-muted p-6 rounded-lg border my-4">
        <p className="mb-2">
          RefurbTrack es un servicio <strong>100% gratuito para el usuario final</strong>. No cobramos suscripciones, no mostramos anuncios intrusivos de terceros, ni vendemos tus datos.
        </p>
        <p className="mb-2">
          Para mantener la infraestructura (servidores, bases de datos, seguimiento de precios, desarrollo) y seguir ofreciendo un servicio de calidad, dependemos de comisiones de afiliación cuando ayudamos a conectar a usuarios con vendedores verificados.
        </p>
        <p className="font-semibold text-emerald-700 dark:text-emerald-300">
          ✅ Sin cookies de afiliación → No podríamos atribuir las ventas → No recibiríamos comisiones → El servicio no sería sostenible
        </p>
      </div>

      <h3 className="text-xl font-bold mt-8">Gestión y control de cookies</h3>
      <p>
        Tienes control total sobre las cookies. Puedes gestionarlas de las siguientes maneras:
      </p>

      <h4 className="font-bold text-lg mt-6">1. Panel de preferencias de cookies</h4>
      <p className="mb-2">
        Al visitar RefurbTrack por primera vez, aparece un banner donde puedes:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Aceptar todas las cookies (recomendado para la mejor experiencia)</li>
        <li>Rechazar cookies no esenciales (solo se usarán las técnicas)</li>
        <li>Personalizar tu elección (elegir qué tipos aceptas)</li>
      </ul>
      {/*}
      <p className="mt-2">
        <button className="text-emerald-600 hover:underline font-medium">⚙️ Abrir configuración de cookies</button>
      </p>
      */}
      <h4 className="font-bold text-lg mt-6">2. Configuración del navegador</h4>
      <p className="mb-2">
        Puedes configurar tu navegador para que bloquee o te avise sobre cookies. Consulta las instrucciones según tu navegador:
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios</li>
        <li><strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies y datos del sitio</li>
        <li><strong>Safari:</strong> Preferencias → Privacidad → Gestionar datos de sitios web</li>
        <li><strong>Edge:</strong> Configuración → Privacidad, búsqueda y servicios → Cookies</li>
      </ul>
      <p className="mt-4 text-sm text-muted-foreground">
        ⚠️ <strong>Nota:</strong> Bloquear cookies esenciales puede afectar la funcionalidad del sitio (ej. no recordar tu preferencia de tema).
      </p>

      <h4 className="font-bold text-lg mt-6">3. Navegación privada/incógnito</h4>
      <p>
        Los modos de navegación privada eliminan automáticamente las cookies al cerrar la ventana. Sin embargo, durante la sesión activa las cookies siguen funcionando normalmente.
      </p>

      <h4 className="font-bold text-lg mt-6">4. Extensiones de bloqueo</h4>
      <p>
        Puedes usar extensiones como <strong>uBlock Origin</strong>, <strong>Privacy Badger</strong> o <strong>Ghostery</strong> para un control más granular. Ten en cuenta que pueden romper funcionalidades de afiliación.
      </p>

      <h3 className="text-xl font-bold mt-8">¿Qué ocurre si rechazas las cookies?</h3>
      <div className="grid md:grid-cols-2 gap-4 my-4">
        <div className="border rounded-lg p-4">
          <h5 className="font-bold text-green-600 dark:text-green-400 mb-2">✅ Seguirás pudiendo:</h5>
          <ul className="text-sm space-y-1">
            <li>• Navegar por RefurbTrack</li>
            <li>• Ver productos y precios</li>
            <li>• Acceder a gráficos de historial</li>
            <li>• Ser redirigido a tiendas externas</li>
          </ul>
        </div>
        <div className="border rounded-lg p-4">
          <h5 className="font-bold text-red-600 dark:text-red-400 mb-2">❌ No podremos:</h5>
          <ul className="text-sm space-y-1">
            <li>• Recordar tu preferencia de tema</li>
            <li>• Guardar tus favoritos entre sesiones</li>
            <li>• Analizar qué productos interesan más</li>
            <li>• Recibir comisiones por tu compra</li>
          </ul>
        </div>
      </div>

      <h3 className="text-xl font-bold mt-8">Cookies y dispositivos móviles</h3>
      <p>
        Si accedes a RefurbTrack desde un smartphone o tablet, las cookies funcionan de manera similar. Puedes gestionarlas desde:
      </p>
      <ul className="list-disc pl-5 space-y-1 my-4">
        <li><strong>Safari (iOS):</strong> Ajustes → Safari → Bloquear cookies</li>
        <li><strong>Chrome (Android):</strong> Chrome → Configuración → Configuración del sitio → Cookies</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">Actualizaciones de la política</h3>
      <p>
        Podemos actualizar esta Política de Cookies para reflejar cambios en nuestra tecnología, legislación aplicable o mejoras en el servicio. Te notificaremos cambios significativos mediante:
      </p>
      <ul className="list-disc pl-5 space-y-1 my-4">
        <li>Banner destacado en la web</li>
        <li>Email (si estás suscrito a alertas)</li>
        <li>Actualización de la fecha en esta página</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">Más información</h3>
      <p>
        Si tienes preguntas sobre nuestra política de cookies, puedes contactarnos en:
      </p>
      <ul className="list-none space-y-2 my-4">
        <li><strong>Formulario de contacto:</strong> <a href={`/${locale}/contact`} className="text-emerald-600 hover:underline">contáctanos aquí</a></li>
        <li><strong>Consulta también:</strong> <a href={`/${locale}/privacy`} className="text-emerald-600 hover:underline">Política de Privacidad</a></li>
      </ul>

      <h3 className="text-xl font-bold mt-8">Recursos externos útiles</h3>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li><a href="https://www.aepd.es/guias/guia-cookies.pdf" target="_blank" rel="noopener" className="text-emerald-600 hover:underline">Guía de Cookies - AEPD (Agencia Española de Protección de Datos)</a></li>
        <li><a href="https://www.allaboutcookies.org/" target="_blank" rel="noopener" className="text-emerald-600 hover:underline">All About Cookies - Información completa sobre cookies</a></li>
        <li><a href="https://cookiepedia.co.uk/" target="_blank" rel="noopener" className="text-emerald-600 hover:underline">Cookiepedia - Base de datos de cookies</a></li>
      </ul>

      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-6 rounded-lg mt-8">
        <h4 className="font-bold text-emerald-800 dark:text-emerald-200 mb-2">💚 Compromiso con la Transparencia</h4>
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          Creemos en una web transparente y respetuosa con la privacidad. Nunca vendemos datos de usuarios, no usamos cookies de rastreo invasivas ni compartimos información personal con terceros sin tu consentimiento explícito. Si tienes dudas, ¡pregúntanos!
        </p>
      </div>
    </div>
  )
}