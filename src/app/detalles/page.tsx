export default function Detalles() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Detalles del Evento</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Ceremonia</h2>
            <div className="space-y-2">
              <p><strong>Fecha:</strong> 15 de Agosto, 2025</p>
              <p><strong>Hora:</strong> 4:00 PM</p>
              {/* Lugares originales comentados para placeholder */}
              <p><strong>Lugar:</strong> Lugar de ceremonia (placeholder)</p>
              <p><strong>Dirección:</strong> Dirección (placeholder)</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Recepción</h2>
            <div className="space-y-2">
              <p><strong>Hora:</strong> 6:00 PM</p>
              {/* Lugares originales comentados para placeholder */}
              <p><strong>Lugar:</strong> Lugar de recepción (placeholder)</p>
              <p><strong>Dirección:</strong> Dirección (placeholder)</p>
              <p><strong>Código de vestimenta:</strong> Formal</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Información Adicional</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Código de Vestimenta</h3>
              <p>Te pedimos vestir de manera formal para la ocasión. Evita el color blanco.</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Niños</h3>
              <p>Aunque adoramos a los pequeños, hemos decidido que esta será una celebración solo para adultos.</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Fotografías</h3>
              <p>Tendremos fotógrafo profesional. Te pedimos que durante la ceremonia mantengas tus dispositivos guardados para disfrutar el momento.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 