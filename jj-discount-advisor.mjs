// Asesor de descuentos JJ. Nunca aplica descuentos ni cambia documentos por sí solo.
// Todos los importes monetarios se expresan en céntimos, sin IVA.
export function adviseDiscount({saleCents, costCents, minimumProfitCents = 0, requestedDiscount = null}) {
  if (![saleCents,costCents,minimumProfitCents].every(x=>Number.isSafeInteger(x)&&x>=0)) throw new Error('Importes de venta, costes y beneficio mínimo no válidos');
  if(costCents===0) return {status:'needs_costs',message:'Indica los costes verificados antes de recomendar un descuento',applied:false};
  if(saleCents<=costCents+minimumProfitCents) return {status:'no_safe_discount',maxSafeCents:0,marginBeforeCents:saleCents-costCents,message:'No hay margen disponible para recomendar descuento',applied:false};
  const maxSafeCents=saleCents-costCents-minimumProfitCents;
  const marginBeforeCents=saleCents-costCents;
  let requestedCents=null;
  if(requestedDiscount!==null){
    if(requestedDiscount.type==='fixed' && Number.isSafeInteger(requestedDiscount.value) && requestedDiscount.value>=0) requestedCents=requestedDiscount.value;
    else if(requestedDiscount.type==='percent' && Number.isFinite(requestedDiscount.value) && requestedDiscount.value>=0 && requestedDiscount.value<=100) requestedCents=Math.round(saleCents*requestedDiscount.value/100);
    else throw new Error('Descuento solicitado no válido');
  }
  return {status:requestedCents!==null&&requestedCents>maxSafeCents?'exceeds_safe_limit':'safe_range',
    maxSafeCents, maxSafePercent:Math.floor(maxSafeCents/saleCents*10000)/100,
    marginBeforeCents, requestedCents,
    profitAfterRequestedCents:requestedCents===null?null:saleCents-costCents-requestedCents,
    applied:false,requiresExplicitApproval:true};
}
