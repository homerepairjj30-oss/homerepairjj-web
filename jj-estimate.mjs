// Motor de cálculo JJ. No contiene tarifas ni datos personales.
export function estimate(lines, catalog, vat) {
  if (![10,21].includes(vat)) throw new Error("IVA pendiente de determinar");
  if (!Array.isArray(lines) || !lines.length) throw new Error("Selecciona trabajos");
  const version=catalog?.version;
  if (!version || !Array.isArray(catalog.rates)) throw new Error("Catálogo no disponible");
  const pending=[], items=[];
  for(const line of lines){
    const rate=catalog.rates.find(r=>r.id===line.id);
    if(!rate || rate.approved!==true || !rate.updatedAt || !Number.isSafeInteger(rate.cents) || rate.cents<0 || !Number.isFinite(line.quantity) || line.quantity<=0 || (rate.unit==="ud"&&!Number.isInteger(line.quantity)) || !["ud","m2","ml","h"].includes(rate.unit) || !Number.isFinite(rate.minutes) || rate.minutes<0){pending.push(line.id);continue;}
    const cents=Math.round(rate.cents*line.quantity);
    if(!Number.isSafeInteger(cents)) throw new Error("Importe fuera de rango");
    items.push({id:rate.id,label:rate.label,category:rate.category,unit:rate.unit,quantity:line.quantity,cents,minutes:rate.minutes*line.quantity});
  }
  if(pending.length)return {status:"review_required",version,pending,items,total:null};
  const base=items.reduce((s,i)=>s+i.cents,0);
  if(!Number.isSafeInteger(base) || !Number.isSafeInteger(base*vat))throw new Error("Importe fuera de rango");
  const tax=Math.round(base*vat/100);
  return {status:"estimate",version,items,base,tax,vat,total:base+tax,workMinutes:items.reduce((s,i)=>s+i.minutes,0)};
}
