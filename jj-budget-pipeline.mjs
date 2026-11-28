import {makePublicRateSnapshot} from './jj-flutter-rate-bridge.mjs';
import {adaptCatalog} from './jj-catalog-adapter.mjs';
import {voiceBudget} from './jj-voice-budget.mjs';

// Canal de PRUEBAS del asistente web, nunca sustituye el catálogo privado de Android.
// No lee el móvil, no guarda presupuestos y no publica tarifas sin aprobación.
export function prepareVoiceQuote({savedRates,version,approvals=[],durations={},command,draft,vat}) {
  if (!Array.isArray(savedRates)) return {status:'private_catalog_missing'};
  let prepared;
  try { prepared=makePublicRateSnapshot(savedRates,{version,approvals,durations}); }
  catch (error) { return {status:'catalog_review_required',message:error.message}; }
  if (prepared.reason || prepared.blocked.some(x=>x.reason==='invalid_private_catalog'))
    return {status:'catalog_review_required',blocked:prepared.blocked};
  const publicCatalog=adaptCatalog({version:prepared.version,rates:prepared.rates},approvals);
  const result=voiceBudget(command,draft,publicCatalog,vat);
  // Sólo devuelve partidas aprobadas: jamás incluir verifiedCostPerUnit ni datos privados.
  return {...result,coverage:{total:savedRates.length,approved:publicCatalog.rates.length,blocked:prepared.blocked.length}};
}
