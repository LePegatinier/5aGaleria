# 5a Galeria — archivo distribuido del arte callejero

La 5a Galeria es un archivo público y distribuido de avistamientos de arte callejero. El sistema recibe fotografías mediante formulario, revisa y cataloga los registros en Notion y publica automáticamente los expedientes autorizados en GitHub Pages.

## Arquitectura actual

**Tally → Notion / ARCHIVO MAESTRO → GitHub Actions → archivo.json + imágenes → GitHub Pages**

### Componentes principales

- `index.html` — portada.
- `archivo.html` + `archivo.js` — archivo público, búsqueda, filtros e indicadores.
- `expediente.html` — ficha individual de cada expediente.
- `mapa.html` — mapa de expedientes con coordenadas válidas.
- `stratascore.html` — sistema StrataScore™.
- `premis.html` — sección de Premis.
- `calabozo.html` — archivo curatorial del Calabozo del Metacrilato™.
- `carnet.html` — información del Carnet Incívic y estado del área de agentes.
- `styles.css`, `header.css` — identidad visual y responsive.
- `js/5a-validator.js` — validaciones de expedientes.
- `data/archivo.json` — índice público generado automáticamente.
- `assets/archive/` — fotografías de los expedientes publicados.
- `.github/workflows/sync-notion.yml` — sincronización automática.

## Recepción de avistamientos

El botón **Avistar** de la web abre el formulario Tally:

https://tally.so/r/kdqeNr

Las entradas llegan al **5a GALERIA / ARCHIVO MAESTRO** de Notion.

El sistema asigna automáticamente un expediente canónico con formato `5a-000001`.

Los registros nuevos reciben un estado inicial según la información disponible. La publicación pública requiere que el expediente esté en **PÚBLICO** y que **Publicado** esté activado. Un expediente puede formar parte del Archivo sin coordenadas; en ese caso no aparece en el Mapa.

## Publicación automática

GitHub Actions consulta el Archivo Maestro cada cinco minutos y también puede ejecutarse manualmente o mediante el evento configurado.

Los registros publicados se incorporan a:

- `data/archivo.json`
- `assets/archive/`

La web pública consume ese índice para generar el Archivo, el Mapa y los Expedientes.

## Criterio de publicación

Un expediente no debe aparecer en el archivo público simplemente por existir en Notion.

Para su publicación se exige:

- expediente canónico válido;
- estado **PÚBLICO**;
- propiedad **Publicado = YES**;
- fotografía disponible.

**Las coordenadas no son un requisito para el Archivo.** Son necesarias únicamente para representar el expediente en el Mapa. Esta distinción evita excluir documentación válida por carecer de geolocalización.

El sistema debe evitar publicar registros incompletos y no inventar valores de StrataScore™.

## StrataScore™

StrataScore™ — Bareback Street Art Certification utiliza una matriz de cinco variables y un índice de 0 a 20.

El índice **no es una valoración de calidad artística**. Si la matriz no está completa, el expediente se publica sin puntuación propuesta. La certificación validada permanece separada de la propuesta.

## Estado del proyecto

La infraestructura básica de recepción, catalogación, publicación, archivo y mapa está implementada. La operatividad de cada integración debe comprobarse periódicamente con envíos de prueba y ejecuciones reales del workflow.

Las siguientes mejoras prioritarias son la trazabilidad temporal de los expedientes, la documentación de capas, la calidad de los datos y la observabilidad del proceso de publicación.

## Publicación

El sitio se sirve mediante GitHub Pages:

https://lepegatinier.github.io/5aGaleria/

## Gobierno del Archivo Maestro

- **Producción:** data source `081d103e-208a-45df-a3f7-489a2deaf3eb`.
- **Legacy:** data source histórico `7016bada-bf2a-425a-840c-429425f42c2d`, conservado como referencia y no operativo para publicaciones.
- **Publicación:** `Estado del expediente = PÚBLICO` + `Publicado = YES`.
- **Archivo ≠ Mapa:** las coordenadas ausentes no bloquean el Archivo; el Mapa filtra únicamente registros con coordenadas válidas.
- **StrataScore™:** una matriz incompleta no se convierte en ceros. La puntuación propuesta sólo se calcula cuando las cinco variables están realmente informadas; la certificación validada permanece separada.
