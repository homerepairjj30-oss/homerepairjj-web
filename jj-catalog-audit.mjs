// Auditoría previa al enlace del catálogo real de Flutter con la web pública.
// NO publica tarifas y NO suplanta la aprobación de José.
const units = {'m²':'m2',m2:'m2',m:'ml',ml:'ml',ud:'ud',hora:'h',h:'h',trabajo:'trabajo',juego:'juego',km:'km'};
export function auditCatalog(snapshot, approvals = []) {
  if (!snapshot || !Array.isArray(snapshot.rates) || !Array.isArray(approvals))
    throw new Error('Catálogo o aprobaciones no disponibles');
  const rows=[], ids=new Set();
  for (const rate of snapshot.rates) {
    const problems=[];
    if (!rate || typeof rate.id!=='string' || !rate.id.trim() || ids.has(rate.id)) problems.push('id_invalid_or_duplicate');
    else ids.add(rate.id);
    if (typeof rate?.name!=='string' || !rate.name.trim()) problems.push('missing_name');
    if (!units[rate?.unit]) problems.push('unsupported_unit');
    if (!Number.isFinite(rate?.price) || rate.price < 0) problems.push('invalid_price');
    if (!rate?.referenceDate) problems.push('missing_reference_date');
    const approved = approvals.find(a=>a.id===rate?.id && a.version===snapshot.version && a.approved===true);
    if (!approved) problems.push('not_approved_for_public_web');
    if (!Number.isFinite(rate?.minutes) || rate.minutes <= 0) problems.push('missing_time_estimate');
    if (approved && (!Number.isSafeInteger(approved.cents) || approved.cents!==Math.round(rate.price*100) || approved.unit!==units[rate.unit] || approved.minutes!==rate.minutes))
      problems.push('approval_does_not_match_source');
    rows.push({id:rate?.id ?? null,name:rate?.name ?? null,unit:rate?.unit ?? null,problems,ready:problems.length===0});
  }
  const missing = {};
  for (const row of rows) for (const p of row.problems) missing[p]=(missing[p]||0)+1;
  return {version:snapshot.version ?? null,total:rows.length,ready:rows.filter(r=>r.ready).length,pending:rows.filter(r=>!r.ready).length,missing,rows};
}
