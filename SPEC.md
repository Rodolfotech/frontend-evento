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


##Historias de usuario
-el usuario quiere registrarse o logearse en la aplicación
-el usuario quiere vincular su cuenta con instagram en el perfil de usuario
-el usuario quiere publicar dentro de la aplicación lo que tiene en su instagram.
-el usuario quiere ver todos los que ingresan a través de la aplicación a su web.

-el cliente quiere ver las publicaciones sin tener que registrarse en la aplicación.
-el cliente filtra las publicaciones por comuna, región.
-el cliente filtra las publicaciones por fecha 

-el administrador debe visualizar a la lista de todos los usuarios, ver sus publicaciones y estadisticas.
