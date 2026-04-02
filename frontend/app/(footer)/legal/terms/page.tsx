export default function TermsPage() {
  return (
    <div className="space-y-6 text-sm md:text-base leading-relaxed">
      <h1 className="text-3xl font-bold mb-6">Términos y Condiciones de Uso</h1>
      <p className="text-muted-foreground text-sm">Última actualización: {new Date().toLocaleDateString()}</p>
      
      <div className="bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-500 p-4 my-6">
        <p className="font-bold text-yellow-800 dark:text-yellow-200">Aviso Importante</p>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
            RefurbTrack es un servicio de información y comparación. <strong>No somos vendedores</strong> de los productos mostrados. Cualquier transacción se realiza única y exclusivamente entre el Usuario y el Vendedor Final en la plataforma de destino.
        </p>
      </div>

      <h3 className="text-xl font-bold mt-8">1. Aceptación de los Términos</h3>
      <p>
        Al acceder y utilizar RefurbTrack (en adelante, "el Servicio"), aceptas estar vinculado por estos Términos y Condiciones, todas las leyes y regulaciones aplicables, y aceptas que eres responsable del cumplimiento de cualquier ley local aplicable. Si no estás de acuerdo con alguno de estos términos, te prohibimos utilizar o acceder a este sitio.
      </p>

      <h3 className="text-xl font-bold mt-8">2. Naturaleza del Servicio</h3>
      <p>
        RefurbTrack es una plataforma de información que ofrece:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li>Comparación de precios de productos electrónicos reacondicionados de múltiples vendedores</li>
        <li>Historial de evolución de precios y alertas de descuentos</li>
        <li>Información sobre estados de reacondicionamiento (Excelente, Muy Bueno, Correcto)</li>
        <li>Enlaces directos a tiendas verificadas donde puedes completar tu compra</li>
      </ul>
      <p className="mt-4">
        La información mostrada (precios, estado) se actualiza periódicamente, pero puede diferir de la información en tiempo real en la web del vendedor debido a la latencia técnica o cambios repentinos en el inventario.
      </p>

      <h3 className="text-xl font-bold mt-8">3. Relación con Vendedores Externos</h3>
      <p>
        <strong>RefurbTrack NO es una tienda online.</strong> No poseemos inventario físico, no procesamos pagos, no gestionamos envíos, ni ofrecemos garantías sobre los productos.
      </p>
      <p className="mt-4">
        Cuando haces clic en "Ver Oferta" o enlaces similares:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li>Serás redirigido al sitio web del vendedor externo (ej. Back Market, Amazon Renewed, etc.)</li>
        <li>Cualquier compra, devolución, garantía o servicio postventa es responsabilidad exclusiva del vendedor</li>
        <li>RefurbTrack puede recibir una comisión de afiliación si completas una compra, sin coste adicional para ti</li>
        <li>Debes revisar los términos de servicio y política de privacidad del vendedor antes de completar tu compra</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">4. Exactitud de la Información</h3>
      <p>
        Aunque empleamos tecnología avanzada y nos esforzamos por garantizar la precisión de los datos, <strong>no garantizamos</strong> que todas las descripciones de productos, precios, disponibilidad de stock, imágenes o especificaciones técnicas estén libres de errores o completamente actualizadas.
      </p>
      <p className="mt-4">
        <strong>El precio final válido siempre será el que se muestre en el momento del pago en la web del vendedor.</strong> No asumimos responsabilidad por diferencias de precios, cambios de stock o errores tipográficos.
      </p>

      <h3 className="text-xl font-bold mt-8">5. Uso Aceptable del Servicio</h3>
      <p>Al utilizar RefurbTrack, te comprometes a:</p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li><strong>No intentar comprometer</strong> la seguridad o integridad de nuestros sistemas</li>
        <li><strong>No utilizar</strong> nuestros datos para crear servicios competidores o bases de datos comerciales</li>
        <li><strong>No manipular</strong> enlaces de afiliación para beneficio propio o de terceros</li>
        <li><strong>Utilizar el servicio</strong> únicamente para fines personales y no comerciales, salvo acuerdo previo</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">6. Propiedad Intelectual</h3>
      <p>
        El contenido original de RefurbTrack (diseño, código, análisis, gráficos de precios, estructura de datos) está protegido por derechos de autor y es propiedad de RefurbTrack o sus licenciantes.
      </p>
      <p className="mt-4">
        Las marcas comerciales de terceros (Apple®, Samsung®, Back Market®, etc.) son propiedad de sus respectivos dueños. Se utilizan en este sitio únicamente con fines informativos y de identificación de productos, bajo el principio de nominative fair use o acuerdos de afiliación. No implican endorsement ni asociación oficial.
      </p>
      <p className="mt-4">
        Las imágenes de productos pueden ser propiedad de los fabricantes o vendedores y se muestran con fines informativos bajo uso legítimo.
      </p>

      <h3 className="text-xl font-bold mt-8">7. Programa de Afiliación y Transparencia</h3>
      <p>
        RefurbTrack PUEDE participar en programas de marketing de afiliación con plataformas como:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li>Back Market</li>
        <li>Amazon Associates</li>
        <li>Otras redes de afiliación según disponibilidad regional</li>
      </ul>
      <p className="mt-4">
        Esto significa que podemos recibir una pequeña comisión cuando realizas una compra a través de nuestros enlaces, sin ningún coste adicional para ti. Esta comisión nos permite mantener el servicio gratuito y sin anuncios intrusivos.
      </p>
      <p className="mt-4">
        <strong>Compromiso de neutralidad:</strong> Nuestros rankings y recomendaciones se basan en datos objetivos (precio, estado, historial) y no están influenciados por las comisiones de afiliación.
      </p>

      <h3 className="text-xl font-bold mt-8">8. Limitación de Responsabilidad</h3>
      <p>
        En la máxima medida permitida por la ley aplicable:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li>RefurbTrack se proporciona "TAL CUAL" y "SEGÚN DISPONIBILIDAD" sin garantías de ningún tipo</li>
        <li>No garantizamos que el servicio será ininterrumpido, seguro o libre de errores</li>
        <li>No somos responsables de daños directos, indirectos, incidentales, especiales o consecuentes derivados del uso o imposibilidad de uso del servicio</li>
        <li>No asumimos responsabilidad por la calidad, autenticidad, seguridad o legalidad de los productos comprados a vendedores externos</li>
        <li>No nos responsabilizamos de disputas entre usuarios y vendedores (envíos perdidos, productos defectuosos, devoluciones, etc.)</li>
      </ul>
      <p className="mt-4">
        Tu única vía de reclamación ante problemas con un producto adquirido es contactar directamente con el vendedor donde realizaste la compra.
      </p>

      <h3 className="text-xl font-bold mt-8">9. Garantías y Devoluciones</h3>
      <p>
        Dado que RefurbTrack no vende productos, no ofrecemos garantías propias. Sin embargo, los productos reacondicionados mostrados en nuestro sitio provienen de vendedores que generalmente ofrecen:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li><strong>Garantía mínima:</strong> 12/24 meses (estándar en Back Market)</li>
        <li><strong>Periodo de prueba:</strong> Generalmente 30 días para devoluciones</li>
        <li><strong>Certificación:</strong> Reacondicionamiento realizado por técnicos cualificados</li>
      </ul>
      <p className="mt-4">
        <strong>Importante:</strong> Estas condiciones pueden variar según el vendedor y país. Verifica siempre los términos específicos en la página del vendedor antes de comprar.
      </p>

      <h3 className="text-xl font-bold mt-8">10. Enlaces a Terceros</h3>
      <p>
        Nuestro servicio contiene enlaces a sitios web de terceros no operados por nosotros. No tenemos control sobre el contenido, políticas de privacidad o prácticas de estos sitios. Al hacer clic en un enlace externo, reconoces y aceptas que RefurbTrack no es responsable de dichos sitios.
      </p>

      <h3 className="text-xl font-bold mt-8">11. Suspensión y Terminación</h3>
      <p>
        Nos reservamos el derecho de:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li>Suspender o terminar tu acceso al servicio en caso de violación de estos términos</li>
        <li>Modificar o discontinuar cualquier aspecto del servicio sin previo aviso</li>
        <li>Eliminar contenido o datos de usuario que infrinjan estos términos</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">12. Modificaciones a los Términos</h3>
      <p>
        Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios significativos serán notificados mediante:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li>Aviso destacado en la página principal</li>
        <li>Email a usuarios registrados (si aplica)</li>
        <li>Actualización de la fecha "Última actualización" en esta página</li>
      </ul>
      <p className="mt-4">
        El uso continuado del servicio tras la publicación de cambios constituye tu aceptación de los términos modificados.
      </p>

      <h3 className="text-xl font-bold mt-8">13. Indemnización</h3>
      <p>
        Aceptas indemnizar y eximir de responsabilidad a RefurbTrack, sus afiliados, directores, empleados y agentes de cualquier reclamación, daño, obligación, pérdida, responsabilidad, coste o deuda, y gasto (incluidos, entre otros, honorarios de abogados) que surja de:
      </p>
      <ul className="list-disc pl-5 space-y-2 my-4">
        <li>Tu uso o mal uso del servicio</li>
        <li>Tu violación de estos términos</li>
        <li>Tu violación de derechos de terceros</li>
      </ul>

      <h3 className="text-xl font-bold mt-8">14. Ley Aplicable y Jurisdicción</h3>
      <p>
        Estos Términos se regirán e interpretarán de acuerdo con las leyes de España, sin dar efecto a ningún principio de conflictos de leyes.
      </p>

      <h3 className="text-xl font-bold mt-8">15. Divisibilidad</h3>
      <p>
        Si alguna disposición de estos términos se considera inválida o inaplicable, dicha disposición se eliminará o limitará en la medida mínima necesaria, y las disposiciones restantes continuarán en pleno vigor y efecto.
      </p>

      <h3 className="text-xl font-bold mt-8">16. Contacto</h3>
      <p>
        Para preguntas sobre estos Términos y Condiciones, puedes contactarnos en:
      </p>
      <ul className="list-none space-y-2 my-4">
        <li><strong>Formulario de contacto:</strong> <a href="/company/contact" className="text-emerald-600 hover:underline">contáctanos aquí</a></li>
      </ul>
    </div>
  )
}