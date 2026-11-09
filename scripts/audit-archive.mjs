#!/usr/bin/env node
/**
 * 5a GALERIA — Auditoría no destructiva del archivo público.
 * No modifica registros ni impide publicaciones: genera avisos para revisión humana.
 * Uso: node scripts/audit-archive.mjs [ruta-json]
 */
import fs from 'node:fs';
import path from 'node:path';

const input = process.argv[2] || 'data/archivo.json';
const root = process.cwd();
const report = { file: input, records: 0, errors: [], warnings: [], info: [] };

function warn(id, message) { report.warnings.push({ id, message }); }
function error(id, message) { report.errors.push({ id, message }); }
function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(d.valueOf()) && d.toISOString().slice(0, 10) === value;
}
function coords(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const m = value.trim().match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (!m) return false;
  const lat = Number(m[1]), lon = Number(m[2]);
  return Number.isFinite(lat) && Number.isFinite(lon) &&
    lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}
function fileExists(relative) {
  if (typeof relative !== 'string' || !relative.trim()) return false;
  const normalized = relative.replace(/^\.\//, '');
  const resolved = path.resolve(root, normalized);
  return resolved.startsWith(root + path.sep) && fs.existsSync(resolved) && fs.statSync(resolved).isFile();
}

let data;
try {
  data = JSON.parse(fs.readFileSync(input, 'utf8'));
} catch (e) {
  console.error(`No se puede leer ${input}: ${e.message}`);
  process.exit(2);
}
if (!data || !Array.isArray(data.records)) {
  console.error('Estructura inválida: se esperaba un array data.records.');
  process.exit(2);
}
report.records = data.records.length;
const seen = new Set();

for (const [index, r] of data.records.entries()) {
  const id = String(r?.expediente || `registro #${index + 1}`).trim();
  if (!/^5a-\d{6}$/.test(id)) error(id, 'Identificador fuera del formato 5a-000000.');
  if (seen.has(id)) error(id, 'Identificador duplicado.');
  seen.add(id);

  for (const field of ['avistador', 'ciudad', 'tecnica', 'tipo_formato']) {
    if (typeof r?.[field] !== 'string' || !r[field].trim()) warn(id, `Campo vacío o ausente: ${field}.`);
  }
  if (r?.publicado === true) {
    if (!r.imagen) warn(id, 'Expediente público sin ruta de imagen.');
    else if (!fileExists(r.imagen)) warn(id, `Imagen no encontrada en el repositorio: ${r.imagen}.`);
  }
  if (!r?.fecha) warn(id, 'Fecha ausente; no se inventa ni se corrige.');
  else if (!validDate(r.fecha)) warn(id, `Fecha no válida o formato inesperado: ${r.fecha}.`);

  const point = coords(r?.coordenadas);
  if (point === null) warn(id, 'Sin coordenadas: válido para Archivo, no representable en Mapa.');
  else if (point === false) warn(id, `Coordenadas con formato o rango inválido: ${r.coordenadas}.`);

  const fields = ['strata_origen', 'strata_mediacion', 'strata_soporte', 'strata_autonomia', 'strata_artwash'];
  const values = fields.map(k => r?.[k]);
  const present = values.filter(v => v !== null && v !== undefined && v !== '').length;
  if (present > 0 && present < fields.length) {
    warn(id, `Matriz StrataScore incompleta (${present}/5); no debe interpretarse como puntuación completa.`);
  } else if (present === 5) {
    const numeric = values.every(v => typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 4);
    if (!numeric) warn(id, 'Matriz StrataScore contiene valores fuera del rango entero 0–4.');
    else {
      const sum = values.reduce((a, b) => a + b, 0);
      if (typeof r.strata_index === 'number' && r.strata_index !== sum) {
        warn(id, `Índice StrataScore (${r.strata_index}) no coincide con la suma de la matriz (${sum}).`);
      }
      if (typeof r.strata_index_validado === 'number' && r.strata_index_validado < 0) {
        warn(id, 'Índice validado negativo.');
      }
    }
  } else if (r?.strata_index !== null && r?.strata_index !== undefined) {
    warn(id, 'Hay índice StrataScore sin matriz completa.');
  }
  if (r?.strata_index !== null && r?.strata_index !== undefined &&
      (!Number.isInteger(r.strata_index) || r.strata_index < 0 || r.strata_index > 20)) {
    warn(id, 'Índice StrataScore fuera del rango 0–20.');
  }
  if (r?.strata_index_validado !== null && r?.strata_index_validado !== undefined &&
      (!Number.isInteger(r.strata_index_validado) || r.strata_index_validado < 0 || r.strata_index_validado > 20)) {
    warn(id, 'Índice StrataScore validado fuera del rango 0–20.');
  }
}

console.log('\n5a GALERIA · INFORME DE INTEGRIDAD');
console.log(`Registros examinados: ${report.records}`);
console.log(`Errores estructurales: ${report.errors.length}`);
console.log(`Avisos para revisión: ${report.warnings.length}`);
if (report.errors.length) {
  console.log('\nERRORES');
  for (const x of report.errors) console.log(`[ERROR] ${x.id}: ${x.message}`);
}
if (report.warnings.length) {
  console.log('\nAVISOS');
  for (const x of report.warnings) console.log(`[REVISAR] ${x.id}: ${x.message}`);
}
console.log('\nAuditoría de solo lectura: no se ha modificado ningún expediente.');
fs.mkdirSync('reports', { recursive: true });
fs.writeFileSync('reports/archive-audit.json', JSON.stringify(report, null, 2) + '\n');
if (report.errors.length) process.exitCode = 1;
