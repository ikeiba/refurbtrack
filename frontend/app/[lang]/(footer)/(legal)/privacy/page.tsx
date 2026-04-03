export default function PrivacyPage() {
  return (
    <div className="space-y-6 text-sm md:text-base leading-relaxed">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>
      <p className="text-muted-foreground text-sm">Última actualización: {new Date().toLocaleDateString()}</p>
      
      <div className="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 p-4 my-6">
        <p className="font-semibold text-blue-800 dark:text-blue-200">Compromiso de Transparencia</p>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          En RefurbTrack tomamos en serio la protección de tus datos personales y cumplimos rigurosamente con el Reglamento General de Protección de Datos (RGPD) de la Unión Europea.
        </p>
      </div>

      <h3 className="text-xl font-bold mt-8">1. Responsable del Tratamiento</h3>
      <p>
        Puedes contactarnos en privacidad@refurbtrack.com para ejercer tus derechos o resolver cualquier duda relacionada con el tratamiento de tus datos.
      </p>

      <h3 className="text-xl font-bold mt-8">2. Datos que Recopilamos</h3>
      <p>
        RefurbTrack es un comparador, no una tienda. <strong>No procesamos pagos ni gestionamos envíos.</strong> Por tanto, no almacenamos datos bancarios ni direcciones físicas de entrega.
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li><strong>Datos de navegación:</strong> Dirección IP, tipo de navegador, sistema operativo y páginas visitadas (vía Google Analytics) para mejorar la experiencia de usuario y optimizar nuestros servicios.</li>
        <li><strong>Email (Opcional):</strong> Solo si te suscribes explícitamente a nuestro servicio de alertas de precios o boletín informativo. Puedes darte de baja en cualquier momento.</li>
        <li><strong>Preferencias del usuario:</strong> Configuración de tema (modo oscuro/claro), productos favoritos y filtros guardados mediante almacenamiento local del navegador.</li>
        <li><strong>Cookies y tecnologías de seguimiento:</strong> Consulta nuestra <a href="/es/cookies" className="text-emerald-600 hover:underline">Política de Cookies</a> para más detalles.</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">3. Finalidad del Tratamiento</h3>
      <p>Utilizamos tus datos para:</p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li>Proporcionar y mejorar nuestro servicio de comparación de precios</li>
        <li>Analizar tendencias de uso y comportamiento agregado (sin identificar usuarios individuales)</li>
        <li>Enviar alertas de precios y comunicaciones (solo si has dado tu consentimiento explícito)</li>
        <li>Cumplir con obligaciones legales y prevenir fraudes</li>
        <li>Gestionar programas de afiliación con plataformas de venta asociadas</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">4. Base Legal del Tratamiento</h3>
      <p>
        El tratamiento de tus datos se basa en:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li><strong>Consentimiento:</strong> Para envío de newsletters y alertas personalizadas</li>
        <li><strong>Interés legítimo:</strong> Para análisis estadístico y mejora del servicio</li>
        <li><strong>Cumplimiento contractual:</strong> Para proveer los servicios solicitados</li>
        <li><strong>Obligación legal:</strong> Para cumplir con normativas fiscales y mercantiles</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">5. Enlaces de Afiliados y Terceros</h3>
      <p>
        Nuestro sitio web contiene enlaces a sitios de terceros. Si haces clic en una oferta y eres redirigido, el sitio de destino puede recopilar sus propios datos bajo sus propias políticas de privacidad. <strong>RefurbTrack no es responsable de las prácticas de privacidad de dichos sitios.</strong>
      </p>
      <p className="mt-4">
        Participamos en programas de marketing de afiliados. Estos programas utilizan códigos de seguimiento y cookies para atribuir las ventas generadas desde nuestro sitio, lo que nos permite recibir una comisión sin coste adicional para ti.
      </p>

      <h3 className="text-xl font-bold mt-8">6. Compartir Información con Terceros</h3>
      <p>
        No vendemos ni alquilamos tus datos personales a terceros. Solo compartimos información con:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li><strong>Proveedores de servicios:</strong> Google Analytics (análisis web), Mailjet (email marketing) bajo acuerdos de confidencialidad</li>
        <li><strong>Redes de afiliación:</strong> Solo información de clics y conversiones anónimas para cálculo de comisiones</li>
        <li><strong>Autoridades competentes:</strong> Cuando sea legalmente requerido</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">7. Conservación de Datos</h3>
      <p>
        Conservamos tus datos personales solo mientras mantengas una relación activa con nuestro servicio o durante el tiempo necesario para cumplir con obligaciones legales:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li><strong>Datos de navegación:</strong> Hasta 26 meses (requisito de Google Analytics)</li>
        <li><strong>Suscripciones email:</strong> Hasta que solicites la baja</li>
        <li><strong>Consultas de contacto:</strong> Hasta 2 años desde la última interacción</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">8. Tus Derechos RGPD</h3>
      <p>Tienes derecho a:</p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li><strong>Acceso:</strong> Conocer qué datos tenemos sobre ti</li>
        <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
        <li><strong>Supresión:</strong> Solicitar la eliminación de tus datos ("derecho al olvido")</li>
        <li><strong>Oposición:</strong> Oponerte al tratamiento de tus datos para determinados fines</li>
        <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado y legible</li>
        <li><strong>Limitación:</strong> Restringir el procesamiento en determinadas circunstancias</li>
        <li><strong>Revocación del consentimiento:</strong> Retirar tu consentimiento en cualquier momento</li>
      </ul>
      <p className="mt-4">
        Para ejercer estos derechos, envía un email a <strong>privacidad@refurbtrack.com</strong> con tu solicitud. Responderemos en un plazo máximo de 30 días.
      </p>

      <h3 className="text-xl font-bold mt-8">9. Seguridad de los Datos</h3>
      <p>
        Implementamos medidas técnicas y organizativas apropiadas para proteger tus datos contra acceso no autorizado, alteración, divulgación o destrucción, incluyendo:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li>Cifrado SSL/TLS para todas las comunicaciones</li>
        <li>Acceso restringido a datos personales solo a personal autorizado</li>
        <li>Copias de seguridad regulares y protocolos de recuperación</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">10. Transferencias Internacionales</h3>
      <p>
        Algunos de nuestros proveedores de servicios (como Google) pueden procesar datos fuera del Espacio Económico Europeo. En estos casos, nos aseguramos de que existan garantías adecuadas como Cláusulas Contractuales Tipo aprobadas por la Comisión Europea.
      </p>

      <h3 className="text-xl font-bold mt-8">11. Menores de Edad</h3>
      <p>
        RefurbTrack no está dirigido a menores de 16 años. No recopilamos conscientemente datos de menores. Si eres padre/tutor y descubres que tu hijo ha proporcionado información personal, contacta con nosotros para que podamos eliminarla.
      </p>

      <h3 className="text-xl font-bold mt-8">12. Cambios a esta Política</h3>
      <p>
        Nos reservamos el derecho de actualizar esta Política de Privacidad periódicamente. Te notificaremos cambios significativos mediante un aviso destacado en nuestra web o por email (si estás suscrito). El uso continuado del sitio tras los cambios constituye tu aceptación de la política actualizada.
      </p>

      <h3 className="text-xl font-bold mt-8">13. Contacto y Reclamaciones</h3>
      <p>
        Si tienes dudas sobre cómo tratamos tus datos o deseas presentar una queja:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li><strong>Formulario de contacto:</strong> <a href="/es/contact" className="text-emerald-600 hover:underline">contáctanos aquí</a></li>
        <li><strong>Autoridad de Control:</strong> Tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) en <a href="https://www.aepd.es" target="_blank" rel="noopener" className="text-emerald-600 hover:underline">www.aepd.es</a></li>
      </ul>

    </div>
  )
}