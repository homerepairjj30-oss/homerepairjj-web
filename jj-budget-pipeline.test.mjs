import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareVoiceQuote} from './jj-budget-pipeline.mjs';
const savedRates=[
 {id:'wc',name:'Cambiar váter',category:'Fontanería',unit:'ud',price:100,verifiedCostPerUnit:65,userEdited:true,referenceDate:'2026-11-28'},
 {id:'other',name:'Pintar',category:'Pintura',unit:'m²',price:15,verifiedCostPerUnit:9,referenceDate:'2026-11-28'}
];
const approvals=[{id:'wc',version:'v1',approved:true,cents:10000,minutes:90,unit:'ud'}];
const args={savedRates,version:'v1',approvals,durations:{wc:90},command:'JJ, pásamelo a presupuesto',draft:{lines:[{id:'wc',quantity:1}]},vat:21};
test('genera borrador con tarifa personalizada y duración verificada',()=>{
 const r=prepareVoiceQuote(args);
 assert.equal(r.status,'draft_ready_for_approval');
 assert.equal(r.result.total,12100);assert.equal(r.result.workMinutes,90);
 assert.deepEqual(r.coverage,{total:2,approved:1,blocked:1});
 assert.equal(JSON.stringify(r).includes('verifiedCostPerUnit'),false);
});
test('tarifa sin aprobación no se valora públicamente',()=>{
 const r=prepareVoiceQuote({...args,draft:{lines:[{id:'other',quantity:1}]}});
 assert.equal(r.status,'review_required');
});
test('cambio de precio personalizado caduca la aprobación antigua',()=>{
 const revised=savedRates.map(x=>x.id==='wc'?{...x,price:110}:x);
 assert.equal(prepareVoiceQuote({...args,savedRates:revised}).status,'catalog_missing');
});
test('sin duración aprobada no calcula',()=>assert.equal(prepareVoiceQuote({...args,durations:{}}).status,'catalog_missing'));
test('no hay descuento de oficio',()=>assert.equal(prepareVoiceQuote(args).result.discountCents,0));
test('pedir descuento no altera documentos',()=>{
 const r=prepareVoiceQuote({...args,command:'¿Puedo hacer descuento?'});
 assert.equal(r.status,'discount_requested');assert.equal(r.result,undefined);
});
test('sin exportación privada no inventa tarifas',()=>assert.equal(prepareVoiceQuote({...args,savedRates:null}).status,'private_catalog_missing'));
