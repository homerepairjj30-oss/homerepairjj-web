import {estimate} from './jj-estimate.mjs';

// Interpreta órdenes de José sin inventar tarifas ni emitir documentos.
const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
export function voiceBudget(command, draft, catalog, vat) {
  if (typeof command !== 'string' || !command.trim()) return {status:'need_command'};
  const phrase=normalize(command);
  if (/\b(descuento|rebaja)\b/.test(phrase)) return {status:'discount_requested', message:'Consultar costes y margen antes de recomendar; no aplicar automáticamente.'};
  if (/\b(pasa(lo|melo)?|convierte(lo|melo)?)\b.*\bpresupuesto\b|\b(haz(me)?|prepara(me)?)\b.*\bpresupuesto\b/.test(phrase)) {
    if (!Array.isArray(draft?.lines) || !draft.lines.length) return {status:'need_work_details'};
    if (![10,21].includes(vat)) return {status:'need_vat_validation'};
    const result=estimate(draft.lines,catalog,vat);
    if (result.status!=='estimate') return {status:'review_required', pending:result.pending, message:'Faltan tarifas aprobadas; no generar importe.'};
    return {status:'draft_ready_for_approval', result, message:'Borrador calculado, pendiente de revisión de José. No enviar automáticamente.'};
  }
  return {status:'work_description', description:command.trim(), message:'Conservar la descripción y pedir solo los datos imprescindibles antes de valorar.'};
}
