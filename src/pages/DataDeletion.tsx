export default function DataDeletion() {
  return (
    <div className="min-h-screen pt-16">
      <div className="relative overflow-hidden">
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-neon-pink/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 py-16">
          <div className="glass rounded-2xl p-8 md:p-12">
            <h1 className="text-3xl font-bold text-white mb-8">Eliminación de Datos</h1>

            <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
              <p>En Eventos, respetamos tu privacidad y te ofrecemos control total sobre tus datos. Puedes solicitar la eliminación de tu información en cualquier momento.</p>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">Eliminar tu cuenta desde la plataforma</h2>
                <p>La forma más sencilla es desde la aplicación:</p>
                <ol className="list-decimal pl-5 mt-2 space-y-1">
                  <li>Inicia sesión en tu cuenta</li>
                  <li>Ve a tu <strong>Perfil</strong></li>
                  <li>En la sección de redes sociales, haz clic en <strong>Desconectar</strong> junto a Instagram</li>
                  <li>Esto eliminará inmediatamente tu ID de Instagram y token de acceso de nuestros servidores</li>
                </ol>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">Solicitar eliminación completa de datos</h2>
                <p>Si deseas eliminar toda tu información de nuestra plataforma (incluyendo tu cuenta de usuario), envía un correo electrónico a la dirección de contacto con el asunto "Solicitud de eliminación de datos" incluyendo tu nombre de usuario registrado.</p>
                <p className="mt-2">Procesaremos tu solicitud en un plazo máximo de 30 días hábiles y te confirmaremos una vez completada.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">Datos que se eliminarán</h2>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Información de perfil (nombre, correo electrónico)</li>
                  <li>ID de Instagram y token de acceso</li>
                  <li>Eventos creados</li>
                  <li>Publicaciones sincronizadas de Instagram</li>
                  <li>Registros de actividad</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">Callback de eliminación (para Meta)</h2>
                <p>Esta página sirve como el callback de eliminación de datos requerido por Meta. Cuando recibimos una solicitud de eliminación a través de Meta, procesamos la desvinculación de tu cuenta de Instagram y eliminamos todos los datos asociados.</p>
                <p className="mt-4">Código de confirmación: <code className="bg-white/10 px-3 py-1 rounded text-neon-cyan">DEL-{Date.now().toString(36).toUpperCase()}</code></p>
              </section>

              <p className="text-gray-500 text-xs pt-4">Última actualización: Mayo 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
