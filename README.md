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

## Conexión con redes sociales

El componente `EventDetail` renderiza automáticamente el campo `socialFeed` del evento cuando contiene datos. El feed debe ser un array de objetos con la siguiente estructura:

```typescript
interface SocialPost {
  media_url?: string;   // URL de imagen/video
  caption?: string;     // Descripción de la publicación
  permalink?: string;   // Enlace a la publicación original
}
```

Estos datos se sincronizan desde el backend a través de la Graph API de Meta.

#usuario de prueba
Email: demo@eventos.cl
Contraseña: demo123
