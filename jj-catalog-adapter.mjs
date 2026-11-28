// Solo tarifas y tiempos verificados, aprobados para la versión concreta.
const units = {'m²':'m2',m2:'m2',m:'ml',ml:'ml',ud:'ud',hora:'h',h:'h',trabajo:'trabajo',juego:'juego',km:'km'};
export function adaptCatalog(snapshot, approvals) {
  if (!snapshot?.version || !Array.isArray(snapshot.rates) || !Array.isArray(approvals)) throw new Error('Catálogo o aprobaciones no disponibles');
  const rates = [], ids = new Set();
  for (const row of snapshot.rates) {
    if (!row || typeof row.id!=='string' || !row.id.trim() || ids.has(row.id)) continue;
    ids.add(row.id);
    const a = approvals.find(x=>x.id===row.id && x.version===snapshot.version && x.approved===true);
    const unit=units[row.unit];
    if (!a || !unit || typeof row.name!=='string' || !row.name.trim() || typeof row.category!=='string' || !row.category.trim() ||
      !Number.isFinite(row.price) || row.price<0 || !Number.isSafeInteger(Math.round(row.price*100)) ||
      !Number.isFinite(row.minutes) || row.minutes<=0 || !row.referenceDate ||
      a.cents!==Math.round(row.price*100) || a.minutes!==row.minutes || a.unit!==unit) continue;
    rates.push({id:row.id,label:row.name,category:row.category,unit,cents:a.cents,minutes:row.minutes,updatedAt:row.referenceDate,approved:true});
  }
  return {version:snapshot.version,rates};
}
