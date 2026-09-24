# 5a Galeria — archivo distribuido del arte callejero

La 5a Galeria es un archivo público y distribuido de avistamientos de arte callejero. El sistema actual permite recibir fotografías mediante formulario, revisar y catalogar los registros en Notion y publicar automáticamente los expedientes autorizados en GitHub Pages.

## Arquitectura actual

**Tally → Notion / ARCHIVO MAESTRO → GitHub Actions → archivo.json + imágenes → GitHub Pages**

### Componentes

- `index.html` — portada.
- `archivo.html` — archivo público con búsqueda y filtros.
- `expediente.html` — ficha individual de cada expediente.
- `mapa.html` — mapa de expedientes publicados.
- `stratascore.html` — sistema StrataScore™.
- `premis.html` — sección de Premis.
- `street-raw.html` — sección Street Raw.
- `styles.css`, `header.css` — identidad visual y responsive.
- `js/5a-validator.js` — validaciones de expedientes.
- `data/archivo.json` — índice público generado automáticamente.
- `assets/archive/` — fotografías de los expedientes publicados.
- `.github/workflows/sync-notion.yml` — sincronización automática.

## Recepción de avistamientos

El botón **Avistar** abre el formulario Tally:

https://tally.so/r/gDoB1P

Las entradas llegan al **5a GALERIA / ARCHIVO MAESTRO** de Notion.

El sistema asigna automáticamente un expediente canónico con formato:

`5a-000001`

Si existen coordenadas válidas, el registro pasa a **EN REVISIÓN**. La publicación pública requiere que el expediente esté en **PÚBLICO** y que **Publicado** esté activado.

## Publicación automática

GitHub Actions comprueba el Archivo Maestro cada **5 minutos** y también puede ejecutarse manualmente o mediante cambios en la rama `main`.

Los registros publicados se incorporan a:

- `data/archivo.json`
- `assets/archive/`

La web pública consume ese índice para generar Archivo, Mapa y Expedientes.

## Criterio de publicación

Un expediente no debe aparecer en el archivo público simplemente por existir en Notion.

Para su publicación se exige:

- expediente canónico válido;
- estado **PÚBLICO**;
- propiedad **Publicado = YES**;
- coordenadas válidas;
- fotografía disponible.

El sistema evita publicar registros incompletos y no inventa valores de StrataScore™.

## StrataScore™

StrataScore™ — Bareback Street Art Certification utiliza una matriz de cinco variables y un índice de 0 a 20.

El índice **no es una valoración de calidad artística**. Si la matriz no está completa, el expediente se publica sin puntuación.

## Estado del proyecto

La infraestructura básica de recepción, catalogación, publicación, archivo y mapa está operativa.

Las siguientes fases son mejorar documentación, estructura territorial, indicadores del archivo, tratamiento de imágenes y escala del sistema.

## Publicación

El sitio se sirve gratuitamente mediante GitHub Pages:

https://lepegatinier.github.io/5aGaleria/

<!-- sync trigger 2026-09-24-12-45 -->