import {estimate} from './jj-estimate.mjs';

// Solo interpreta órdenes y prepara borradores; no guarda, emite ni envía documentos.
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export function voiceBudget(command, draft, catalog, vat) {
  if (typeof command !== 'string' || !command.trim()) return {status:'need_command'};
  const phrase = normalize(command);
  if (/\b(descuento|rebaja|descontar)\b/.test(phrase)) {
    return {status:'discount_requested', message:'Pedir costes completos y beneficio mínimo antes de recomendar. No aplicar descuento sin autorización.'};
  }
  // Emitir una factura es otra operación y siempre necesita aprobación específica.
  if (/\b(factura|facturar)\b/.test(phrase)) {
    return {status:'invoice_requires_confirmation', message:'Buscar presupuesto de origen y confirmar antes de crear factura; no emitir automáticamente.'};
  }
  const quoteCommand = /\b(pasa(lo|melo)?|convierte(lo|melo)?|haz(me)?|prepara(me)?|crea(me)?)\b.*\bpresupuesto\b|\bpresupuesta(me|melo|lo)?\b/.test(phrase);
  if (!quoteCommand) {
    return {status:'work_description', description:command.trim(), message:'Conservar la explicación para continuar sin repetirla.'};
  }
  if (!Array.isArray(draft?.lines) || draft.lines.length === 0) return {status:'need_work_details'};
  if (![10,21].includes(vat)) return {status:'need_vat_validation'};
  if (!catalog?.version || !Array.isArray(catalog.rates) || !catalog.rates.length) {
    return {status:'catalog_missing', message:'Conectar y aprobar catálogo completo antes de calcular.'};
  }
  try {
    const result = estimate(draft.lines, catalog, vat);
    if (result.status !== 'estimate') {
      return {status:'review_required', pending:result.pending, message:'Faltan tarifas aprobadas o detalles válidos.'};
    }
    return {status:'draft_ready_for_approval', result, message:'Borrador pendiente de autorización; no se ha emitido ni enviado.'};
  } catch (err) {
    return {status:'review_required', message:err instanceof Error ? err.message : 'Revisión necesaria'};
  }
}
