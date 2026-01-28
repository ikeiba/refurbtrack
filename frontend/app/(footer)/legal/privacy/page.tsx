export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Política de Privacidad</h1>
      <p className="text-sm text-muted-foreground">Última actualización: {new Date().toLocaleDateString()}</p>
      
      <h3>1. Introducción</h3>
      <p>
        En RefurbTrack, nos comprometemos a proteger tu privacidad. Esta política explica cómo gestionamos la información (que es mínima, ya que no vendemos productos).
      </p>

      <h3>2. Datos que recopilamos</h3>
      <p>
        No registramos datos de pago ni direcciones de envío, ya que las transacciones se realizan en la web del vendedor (ej. Back Market). 
        Solo recopilamos:
      </p>
      <ul>
        <li>Email (solo si te suscribes voluntariamente a alertas de precios).</li>
        <li>Datos de navegación anónimos para mejorar la web.</li>
      </ul>

      <h3>3. Enlaces de Afiliados y Cookies de Terceros</h3>
      <p>
        Nuestro sitio contiene enlaces a terceros. Si haces clic en una oferta, el vendedor (ej. Back Market) puede instalar una cookie en tu navegador para rastrear la venta y asignarnos una comisión. 
        RefurbTrack no tiene control sobre las cookies de esos sitios externos.
      </p>
      
      {/* ... Añade más secciones estándar ... */}
    </div>
  )
}