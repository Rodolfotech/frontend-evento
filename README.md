# Frontend Eventos — React + TypeScript + Vite + Tailwind v4

Interfaz de usuario para la plataforma de eventos con integración a redes sociales.

## Stack

- **Framework**: React 19 + TypeScript 6
- **Bundler**: Vite 8
- **Estilos**: Tailwind CSS v4
- **Routing**: React Router 7
- **HTTP**: Axios

## Estructura

```
src/
├── api/            # Axios client + servicios por recurso
│   ├── client.ts   # Instancia de Axios con interceptor JWT
│   └── index.ts    # authApi, eventsApi, categoriesApi, attendeesApi
├── components/     # Componentes reutilizables
│   ├── Navbar.tsx  # Barra de navegación con auth state
│   └── EventCard.tsx # Tarjeta de evento
├── context/        # React Context
│   └── AuthContext.tsx  # Estado global de autenticación
├── pages/          # Páginas de la aplicación
│   ├── Home.tsx         # Landing con lista de eventos
│   ├── Login.tsx        # Inicio de sesión
│   ├── Register.tsx     # Registro de usuario
│   ├── Events.tsx       # Lista de eventos con buscador
│   ├── EventDetail.tsx  # Detalle de evento + registro
│   └── Profile.tsx      # Perfil del usuario
└── types/          # Interfaces TypeScript
    └── index.ts    # User, Event, Category, Attendee
```

## Funcionalidades

- Autenticación JWT (login/register)
- Listado de eventos con búsqueda por nombre o ciudad
- Detalle de evento con fecha, ubicación, descripción
- Vista de publicaciones de redes sociales embebidas (socialFeed)
- Registro de usuarios a eventos
- Perfil de usuario con información de rol
- Proxy automático `/api` → backend en `localhost:3000`

## Requisitos

- Node.js 20+
- pnpm

## Configuración

1. Instalar dependencias:

```bash
pnpm install
```

2. Iniciar servidor de desarrollo:

```bash
pnpm dev
```

El frontend corre en `http://localhost:5173` y redirige las peticiones `/api` al backend en `http://localhost:3000`.

## Flujo de trabajo (Git)

1. Crear una rama nueva desde `main`:
   ```bash
   git checkout -b feature/nombre-de-la-rama
   ```
2. Trabajar en la rama, hacer commits.
3. Subir la rama a GitHub:
   ```bash
   git push origin feature/nombre-de-la-rama
   ```
4. En GitHub, crear un Pull Request (PR) de `feature/nombre-de-la-rama` a `main`.
5. Revisar, resolver conflictos si los hay, y hacer merge.
6. Eliminar la rama remota y local:
   ```bash
   git push origin --delete feature/nombre-de-la-rama
   git branch -D feature/nombre-de-la-rama
   git checkout main
   git pull origin main
   ```

> Nunca trabajar directamente en `main`. Siempre usar ramas.

## Build para producción

```bash
pnpm build
```

Los archivos estáticos se generan en `dist/`.

## Variables de entorno (opcional)

Se pueden definir en un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=/api
```

## Conexión con Instagram

### Flujo OAuth con popup

1. En el perfil (`Profile.tsx`), el usuario hace clic en "Conectar con Instagram"
2. Se abre un popup con la URL de autorización de Instagram
3. Tras autorizar, Instagram redirige a `/social/callback?code=...`
4. `SocialCallback.tsx` envía el código al backend, que vincula la cuenta
5. El popup envía un mensaje `postMessage` al padre indicando éxito
6. `Profile.tsx` refresca el estado social y recarga los eventos

### Visualización de publicaciones

- **EventCard**: muestra un contador y miniaturas de las últimas 3 publicaciones
- **EventDetail**: muestra todas las publicaciones en un grid con imagen, caption y enlace al original
- Los datos se sincronizan automáticamente al conectar Instagram o manualmente con el botón "Sincronizar Instagram"

### Requisitos

- La cuenta de Instagram debe ser **Business o Creator** (no personal)
- En Meta Developers, la app debe tener configurado el **redirect URI** exacto
- En modo Development, el usuario debe ser **tester** en la app de Meta
- Para producción, se necesita **App Review** (modo Live)

#usuario de prueba
http://localhost:5173/register
http://localhost:5173/login
Email: demo@eventos.cl
Contraseña: demo123

#usuario administrador
http://localhost:5173/panel-g9k2x
Email: admin@eventos.cl
Contraseña: W^t,Ly0={I!LQiK9z+5a

