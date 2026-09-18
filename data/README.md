# Archivo público — 5a Galeria

Este directorio contiene el índice y los recursos publicados del archivo de la 5a Galeria.

## Fuente

`archivo.json` se genera y sincroniza automáticamente desde el **5a GALERIA / ARCHIVO MAESTRO** de Notion mediante GitHub Actions.

La sincronización se ejecuta cada 5 minutos, además de poder activarse manualmente o mediante cambios en la rama principal.

## Publicación

Solo llegan al archivo público los expedientes que cumplen las condiciones de publicación establecidas por el sistema:

- estado del expediente: **PÚBLICO**;
- propiedad **Publicado** activada;
- expediente canónico válido;
- coordenadas válidas;
- fotografía disponible.

## Recursos

- `archivo.json` — índice público consumido por la web.
- `assets/archive/` — fotografías asociadas a los expedientes publicados.

El archivo puede crecer progresivamente a partir de los avistamientos recibidos mediante el formulario de la 5a Galeria.
