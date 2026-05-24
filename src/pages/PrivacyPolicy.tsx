export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-16">
      <div className="relative overflow-hidden">
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-neon-pink/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 py-16">
          <div className="glass rounded-2xl p-8 md:p-12">
            <h1 className="text-3xl font-bold text-white mb-8">Políticas de Privacidad</h1>

            <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">1. Información que recopilamos</h2>
                <p>Al utilizar Eventos, podemos recopilar la siguiente información:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Información de perfil (nombre, correo electrónico, foto de perfil)</li>
                  <li>Datos de cuenta de Instagram (ID de usuario, nombre de usuario, medios)</li>
                  <li>Contenido que publicas en la plataforma (eventos, comentarios)</li>
                  <li>Datos de uso y navegación</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">2. Uso de la información</h2>
                <p>Utilizamos tu información para:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Proporcionar y mantener nuestros servicios</li>
                  <li>Sincronizar y mostrar tus publicaciones de Instagram en tus eventos</li>
                  <li>Mejorar tu experiencia en la plataforma</li>
                  <li>Enviar notificaciones relacionadas con el servicio</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">3. Conexión con Instagram</h2>
                <p>Al conectar tu cuenta de Instagram, nos otorgas permiso para acceder a tu perfil y medios de Instagram según los permisos que autorices. Solo accedemos a la información necesaria para proporcionar la funcionalidad de sincronización de publicaciones.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">4. Protección de datos</h2>
                <p>Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">5. Tus derechos</h2>
                <p>Tienes derecho a acceder, corregir o eliminar tu información personal en cualquier momento. Puedes desconectar tu cuenta de Instagram desde la sección de perfil.</p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">6. Contacto</h2>
                <p>Si tienes preguntas sobre estas políticas, puedes contactarnos a través de nuestro correo electrónico de contacto.</p>
              </section>

              <p className="text-gray-500 text-xs pt-4">Última actualización: Mayo 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
