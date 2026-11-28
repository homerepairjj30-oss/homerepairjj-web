// SOLO para entorno privado autenticado; no exponer JSON con costes en la web.
const units=Object.freeze({'m²':'m2',m2:'m2',m:'ml',ml:'ml',ud:'ud',hora:'h',h:'h',trabajo:'trabajo',juego:'juego',km:'km'});
const validMoney=n=>typeof n==='number' && Number.isFinite(n) && n>=0 && Number.isSafeInteger(Math.round(n*100));
export function inspectFlutterRates(savedRates) {
 if(!Array.isArray(savedRates)) throw new Error('No hay tarifas exportadas');
 const ids=new Set(),rows=[],issues=[];
 for(const rate of savedRates) {
  const id=rate?.id, problems=[];
  if(typeof id!=='string'||!id.trim()||ids.has(id)) problems.push('id_missing_or_duplicate'); else ids.add(id);
  if(typeof rate?.name!=='string'||!rate.name.trim()) problems.push('missing_name');
  if(typeof rate?.category!=='string'||!rate.category.trim()) problems.push('missing_category');
  if(!units[rate?.unit]) problems.push('unsupported_unit');
  if(!validMoney(rate?.price)) problems.push('invalid_price');
  if(rate?.verifiedCostPerUnit!=null&&!validMoney(rate.verifiedCostPerUnit)) problems.push('invalid_verified_cost');
  if(rate?.userEdited!=null&&typeof rate.userEdited!=='boolean') problems.push('invalid_user_edited');
  rows.push({id:id??null,name:rate?.name??null,unit:rate?.unit??null,personalized:rate?.userEdited===true,
    hasVerifiedCost:rate?.verifiedCostPerUnit!=null,valid:problems.length===0,problems});
  if(problems.length) issues.push({id:id??null,problems});
 }
 return {count:rows.length,personalized:rows.filter(r=>r.personalized).length,
  withVerifiedCost:rows.filter(r=>r.hasVerifiedCost).length,valid:rows.filter(r=>r.valid).length,issues,rows};
}
// Exportador seguro: admite solamente versión, tarifa y tiempo aprobados expresamente.
// No expone verifiedCostPerUnit, scope, sourceIds ni datos del cliente.
export function makePublicRateSnapshot(savedRates,{version,approvals=[],durations={}}={}) {
 if(typeof version!=='string'||!version.trim()) throw new Error('Falta versión de catálogo');
 const audit=inspectFlutterRates(savedRates);
 if(audit.issues.length) return {version,rates:[],blocked:audit.issues,reason:'invalid_private_catalog'};
 if(!Array.isArray(approvals)||!durations||typeof durations!=='object') throw new Error('Faltan aprobaciones o duraciones');
 const rates=[],blocked=[];
 for(const r of savedRates) {
  const minutes=durations[r.id],cents=Math.round(r.price*100),unit=units[r.unit];
  const approval=approvals.find(a=>a.id===r.id&&a.version===version&&a.approved===true&&a.cents===cents&&a.unit===unit&&a.minutes===minutes);
  if(!approval||!Number.isFinite(minutes)||minutes<=0) {blocked.push({id:r.id,reason:'not_approved_or_missing_duration'});continue;}
  rates.push({id:r.id,name:r.name,category:r.category,unit:r.unit,price:r.price,minutes,referenceDate:r.referenceDate||version});
 }
 return {version,rates,blocked};
}
