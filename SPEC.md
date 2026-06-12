#SPEC.md explica qué estamos construyendo y cómo debe funcionar el negocio.

"¿Qué debe contener?

-El alcance del MVP (Mínimo Producto Viable).
-Historias de usuario y flujos lógicos (ej: "El cliente hace click en solicitar, se abre el formulario, si el formulario es válido se envía al backend...").
-Reglas de negocio (ej: "Un reparador no puede aceptar más de 3 trabajos simultáneos").
-Casos de borde (Edge Cases) y manejo de errores que el producto requiere.
-Regla de oro: Es el contrato funcional. Si la IA tiene dudas de cómo debe comportarse un botón o una pantalla, viene a leer este archivo.


# Especificación de Flujo de Trabajo

## Regla Fundamental (Inquebrantable)

**Nunca trabajar directamente en `main`.**

Todo cambio, sin excepción, debe seguir este flujo:

## Flujo Obligatorio

```
1. Crear rama desde main → feature/<nombre-descritivo>
2. Hacer cambios en la rama
3. Commit + Push a GitHub
4. Git checkout main + git merge --no-ff <rama>
5. Git push origin main
```

## Convención de Nombres de Ramas

- `feature/<nombre>` — Nuevas funcionalidades
- `fix/<nombre>` — Correcciones de bugs
- `chore/<nombre>` — Tareas de mantenimiento

## Commits

Usar prefijos semánticos:

- `feat:` — Nueva funcionalidad
- `fix:` — Corrección
- `chore:` — Mantenimiento
- `docs:` — Documentación
- `refactor:` — Refactorización

## Deploy

Solo se deploya desde `main` después del merge.

---

## Identidad Visual

### Paleta cromática

| Nombre    | HEX       | Uso                                      |
|-----------|-----------|------------------------------------------|
| Gris oscuro | `#1D1D1F` | Fondo principal, texto sobre fondo claro |
| Azul      | `#2563EB` | Color primario, CTA, isotipo, links      |
| Neutro 1  | `#F8FAFC` | Fondo de secciones claras                |
| Neutro 2  | `#E4EBFA` | Fondos de cards, superficies secundarias |
| Blanco    | `#FFFFFF` | Texto sobre fondos oscuros, backgrounds  |

### Tipografía

**Fuente principal:** Raleway (Regular 400 · Medium 500 · SemiBold 600)

| Estilo              | Peso      | Tamaño | Line height |
|---------------------|-----------|--------|-------------|
| Titular H1          | Medium    | 60px   | 70px        |
| Titular H2          | SemiBold  | 36px   | 60px        |
| Titular H3          | Regular   | 20px   | 28px        |
| Párrafo 1           | Regular   | 18px   | 28px        |
| Párrafo 2 (bajada)  | SemiBold  | 18px   | 28px        |
| Párrafo 3 (cards)   | Medium    | 14px   | 16px        |
| Títulos card        | Regular   | 14px   | 16px        |

### Logo

- Isotipo: ícono de pin de ubicación con estrella, en azul `#2563EB`
- Logotipo: isotipo + texto **"HoySeSale"** en Raleway SemiBold, color `#1D1D1F`
- Archivo: `public/Isotipo.svg`


##Historias de usuario
-el usuario quiere registrarse o logearse en la aplicación
-el usuario quiere vincular su cuenta con instagram en el perfil de usuario
-el usuario quiere publicar dentro de la aplicación lo que tiene en su instagram.
-el usuario quiere ver todos los que ingresan a través de la aplicación a su web.

-el cliente quiere ver las publicaciones sin tener que registrarse en la aplicación.
-el cliente filtra las publicaciones por comuna, región.
-el cliente filtra las publicaciones por fecha 

-el administrador debe visualizar a la lista de todos los usuarios, ver sus publicaciones y estadisticas.
