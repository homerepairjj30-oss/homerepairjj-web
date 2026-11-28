// Motor de cálculo JJ. No contiene tarifas ni datos personales.
// Los precios se expresan en céntimos para evitar errores de coma flotante.
export function estimate(lines, catalog, vat, discount = null) {
  if (![10, 21].includes(vat)) throw new Error('IVA pendiente de determinar');
  if (!Array.isArray(lines) || !lines.length) throw new Error('Selecciona trabajos');
  const version = catalog?.version;
  if (!version || !Array.isArray(catalog.rates)) throw new Error('Catálogo no disponible');
  const pending = [], items = [];
  for (const line of lines) {
    const rate = catalog.rates.find(r => r.id === line.id);
    if (!rate || rate.approved !== true || !rate.updatedAt || !Number.isSafeInteger(rate.cents) || rate.cents < 0 || !Number.isFinite(line.quantity) || line.quantity <= 0 || (rate.unit === 'ud' && !Number.isInteger(line.quantity)) || !['ud', 'm2', 'ml', 'h'].includes(rate.unit) || !Number.isFinite(rate.minutes) || rate.minutes < 0) {
      pending.push(line.id); continue;
    }
    const cents = Math.round(rate.cents * line.quantity);
    if (!Number.isSafeInteger(cents)) throw new Error('Importe fuera de rango');
    items.push({id:rate.id,label:rate.label,category:rate.category,unit:rate.unit,quantity:line.quantity,cents,minutes:rate.minutes*line.quantity});
  }
  if (pending.length) return {status:'review_required',version,pending,items,total:null};
  const base = items.reduce((sum,item) => sum + item.cents, 0);
  if (!Number.isSafeInteger(base)) throw new Error('Importe fuera de rango');
  // El descuento reduce la base imponible antes de calcular el IVA.
  // El porcentaje se expresa en tanto por ciento; el importe fijo en céntimos.
  let discountCents = 0;
  if (discount != null) {
    if (discount.type === 'percent' && Number.isFinite(discount.value) && discount.value >= 0 && discount.value <= 100) {
      discountCents = Math.round(base * discount.value / 100);
    } else if (discount.type === 'fixed' && Number.isSafeInteger(discount.value) && discount.value >= 0 && discount.value <= base) {
      discountCents = discount.value;
    } else {
      throw new Error('Descuento no válido');
    }
  }
  if (!Number.isSafeInteger(discountCents)) throw new Error('Descuento fuera de rango');
  const taxableBase = base - discountCents;
  if (!Number.isSafeInteger(taxableBase * vat)) throw new Error('Importe fuera de rango');
  const tax = Math.round(taxableBase * vat / 100);
  if (!Number.isSafeInteger(taxableBase + tax)) throw new Error('Importe fuera de rango');
  return {status:'estimate',version,items,base,discountCents,taxableBase,tax,vat,total:taxableBase+tax,workMinutes:items.reduce((sum,item)=>sum+item.minutes,0)};
}
