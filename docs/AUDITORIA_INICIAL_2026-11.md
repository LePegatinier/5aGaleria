# Auditoría inicial — 5a Galeria
**Fecha:** 9 de noviembre de 2026  
**Alcance:** revisión estática del repositorio público `LePegatinier/5aGaleria`, rama `main`.  
**Rama de trabajo:** `audit/estabilizacion-nov-2026`

> Esta auditoría revisa código y datos versionados. No equivale a una prueba end-to-end con Notion/Tally ni a una comprobación visual en todos los dispositivos. No se han consultado ni modificado secretos.

## Resumen ejecutivo

La web ya tiene una arquitectura funcional considerable: Tally → Notion → GitHub Actions → JSON e imágenes → web estática. No recomiendo reconstruirla. La prioridad es proteger esa cadena, aclarar los criterios documentales y añadir pruebas de integridad antes de introducir nuevas funciones.

## Hallazgos priorizados

### P0 — Verificar el formulario de entrada antes de tocarlo
- La navegación y la portada apuntan de forma consistente a `https://tally.so/r/kdqeNr`.
- En el contexto histórico del proyecto también consta `https://tally.so/r/Pd7oDP`, utilizado para registro/inscripción.
- No hay evidencia suficiente para sustituir uno por otro: podrían ser formularios distintos (avistamientos frente a registro). **No se ha cambiado ningún enlace.**
- Acción: confirmar el propósito y destino de cada formulario y documentar sus responsabilidades.

### P1 — Criterios de publicación contradictorios en README
- El README enumeraba coordenadas válidas como requisito de publicación y, en la misma frase, decía que no eran obligatorias para el Archivo.
- El validador `js/5a-validator.js` confirma que las coordenadas no son requisito del Archivo y sólo lo son para el Mapa.
- Corrección aplicada en esta rama: README actualizado para dejar explícita la separación Archivo ≠ Mapa.

### P1 — La navegación no está normalizada entre páginas
- El menú se repite manualmente en varios HTML.
- Se observan diferencias de orden entre StrataScore™ y Calabozo, y no todas las páginas tienen exactamente la misma secuencia.
- Riesgo: una modificación futura puede dejar páginas desincronizadas.
- Acción propuesta: definir un único patrón de navegación compartido o una rutina de verificación automática. No se ha reestructurado el encabezado para evitar un cambio visual global sin pruebas.

### P1 — Riesgo de integridad en la sincronización StrataScore
- El workflow distingue propuesta y certificación validada, lo cual es correcto como principio.
- La sincronización también actualiza propiedades de Notion durante el proceso de publicación. Es una operación con efectos sobre el Archivo Maestro, no una simple exportación.
- Acción: añadir pruebas de casos (matriz incompleta, ceros legítimos, categoría validada sin índice, propuesta no validada) y revisar los cambios de propiedades antes de alterar la lógica. No se ha tocado el workflow ni Notion.

### P2 — Ficha del Carnet: estados de desarrollo que requieren consistencia
- `carnet.html` presenta el carnet como «EN DESARROLLO» y explica que el área privada aún no está activada.
- Conviene comprobar que los contadores, ejemplos y registros visibles nunca aparenten ser acreditaciones reales. La página contiene bloques de panel y de estado que merecen una revisión funcional específica.
- Acción: prueba de interfaz y datos; no se ha cambiado el estado del Carnet.

### P2 — Calidad de datos del archivo público
- `data/archivo.json` contiene registros con valores vacíos o desconocidos (por ejemplo, fechas ausentes y autorías no identificadas). Esto no debe provocar que se inventen datos ni que se eliminen expedientes.
- Acción: incorporar un informe de calidad que detecte IDs duplicados, imágenes ausentes, coordenadas inválidas, fechas no normalizadas y valores de StrataScore inconsistentes, sin bloquear automáticamente registros válidos.

### P2 — Mapa y geolocalización
- El Mapa valida rangos de latitud/longitud y representa únicamente registros con coordenadas válidas.
- La geocodificación automática del workflow usa Nominatim. Debe vigilarse la precisión de ubicaciones ambiguas y no aceptar una geocodificación dudosa como hecho confirmado.
- Acción: marcar procedencia/confianza de coordenadas (aportadas, geocodificadas, verificadas) antes de automatizar más.

### P3 — SEO y metadatos
- Portada y varias páginas incluyen canonical, Open Graph y datos estructurados.
- Conviene revisar consistencia de títulos, descripciones, idioma, canonical y metadatos específicos en todas las páginas, además de sitemap/robots y páginas de error.
- Acción: auditoría SEO por URL y generación de sitemap si no existe.

## Corrección documental incluida

- README reescrito para eliminar la contradicción sobre coordenadas y clarificar la arquitectura, las páginas y el criterio de publicación.
- No se ha modificado la web publicada, el formulario, los datos de Notion ni los secretos.

## Próximos pasos recomendados

1. Confirmar qué formulario es Avistar y cuál es inscripción/Carnet.
2. Ejecutar un envío de prueba controlado y comprobar Tally → Notion → workflow → JSON → página.
3. Añadir un script de validación automática para `data/archivo.json`.
4. Normalizar navegación sólo después de validar todas las páginas.
5. Diseñar el esquema de historial de estados de cada expediente (sin sobrescribir el registro original).

## Enlaces

- Web: https://lepegatinier.github.io/5aGaleria/
- Repositorio: https://github.com/LePegatinier/5aGaleria
- README: https://github.com/LePegatinier/5aGaleria/blob/main/README.md
- Formulario Avistar actualmente enlazado: https://tally.so/r/kdqeNr
