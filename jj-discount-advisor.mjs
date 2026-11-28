// Asesor privado: calcula sólo cuando José lo solicita y nunca modifica presupuestos.
// Importes en céntimos SIN IVA. No confundir margen con beneficio neto fiscal.
export function adviseDiscount({saleCents, costCents = null, minimumProfitCents = null, requestedDiscount = null}) {
  if (!Number.isSafeInteger(saleCents) || saleCents <= 0) throw new Error('Precio de venta no válido');
  if (costCents === null || minimumProfitCents === null) return {status:'needs_costs',applied:false,message:'Faltan costes reales o beneficio mínimo; no se puede garantizar un descuento seguro.'};
  if (![costCents,minimumProfitCents].every(x=>Number.isSafeInteger(x)&&x>=0)) throw new Error('Costes o beneficio mínimo no válidos');
  if (!Number.isSafeInteger(costCents + minimumProfitCents)) throw new Error('Importe fuera de rango');
  const marginBeforeCents = saleCents - costCents;
  const maxSafeCents = Math.max(0,saleCents - costCents - minimumProfitCents);
  let requestedCents = null;
  if (requestedDiscount !== null) {
    if (requestedDiscount.type === 'fixed' && Number.isSafeInteger(requestedDiscount.value) && requestedDiscount.value >= 0) requestedCents = requestedDiscount.value;
    else if (requestedDiscount.type === 'percent' && Number.isFinite(requestedDiscount.value) && requestedDiscount.value >= 0 && requestedDiscount.value <= 100) requestedCents = Math.round(saleCents * requestedDiscount.value / 100);
    else throw new Error('Descuento solicitado no válido');
  }
  if (requestedCents !== null && !Number.isSafeInteger(requestedCents)) throw new Error('Descuento fuera de rango');
  const status = marginBeforeCents <= minimumProfitCents ? 'no_safe_discount' : requestedCents !== null && requestedCents > maxSafeCents ? 'exceeds_safe_limit' : 'safe_range';
  return {status,maxSafeCents,maxSafePercent:Math.floor(maxSafeCents/saleCents*10000)/100,marginBeforeCents,requestedCents,
    profitAfterRequestedCents:requestedCents===null?null:marginBeforeCents-requestedCents,applied:false,requiresExplicitApproval:true};
}
