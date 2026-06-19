#Este archivo (que algunas herramientas de IA leen automáticamente) sirve para llevar el registro del progreso actual. Es como el bloc de #notas del desarrollador donde dejas anotado en qué te quedaste ayer para no perder el hilo.

#¿Qué debe contener?

-Estado actual: Qué features están 100% listas, cuáles están en desarrollo y cuáles faltan.
-Próximos pasos inmediatos: Las siguientes 3 tareas a realizar.
-Bloqueos o Notas: Bugs encontrados que hay que resolver antes de seguir.
-Regla de oro: Es un archivo altamente dinámico. Se actualiza constantemente al final de cada sesión de desarrollo para que, al día siguiente, la IA sepa exactamente por dónde empezar sin que tú tengas que recordárselo.


<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

Actua como un experto en UI/UX con react.h-js .js y tailwind.css

prioriza la accesiblidad, diseño atomico, y responsivo.

## Seguridad — Cambios implementados

### Cookie httpOnly (junio 2026)

Se migró la autenticación de `localStorage` a cookies httpOnly para eliminar la vulnerabilidad XSS.

**Cambios en el frontend:**
- `src/api/client.ts`: Axios usa `withCredentials: true`, sin interceptor de Authorization header
- `src/context/AuthContext.tsx`: Usa `GET /auth/me` para verificar sesión, no lee localStorage
- `src/api/index.ts`: Nuevos endpoints `authApi.me()` y `authApi.logout()`
- Eliminadas TODAS las referencias a `localStorage.getItem/setItem('token')` en Login, Register, Admin, ResetPassword, GoogleCallback

**Cambios en el backend:**
- `src/main.ts`: cookie-parser middleware habilitado
- `src/auth/jwt.strategy.ts`: Acepta JWT desde cookie `access_token` O header Authorization (backward compatible)
- `src/auth/auth.controller.ts`: Login/register/google/instagram setean cookie httpOnly. Nuevos endpoints `GET /auth/me` y `POST /auth/logout`
- Cookie config: `httpOnly: true`, `secure: true` en producción, `sameSite: lax`, `maxAge: 7 días`

**Reglas para desarrollo:**
- NUNCA usar `localStorage` para tokens
- NUNCA agregar header Authorization manualmente
- Siempre usar `withCredentials: true` en Axios
- Para verificar sesión usar `GET /auth/me`, no decodificar tokens
