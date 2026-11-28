import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectFlutterRates,makePublicRateSnapshot} from './jj-flutter-rate-bridge.mjs';
const rates=[{id:'wc',name:'Cambiar váter',category:'Fontanería',unit:'ud',price:95,userEdited:true,verifiedCostPerUnit:40,scope:'Privado',referenceDate:'2026-11-28'}];
test('lee los campos reales de RateItem',()=>{
 const r=inspectFlutterRates(rates);assert.equal(r.count,1);assert.equal(r.personalized,1);assert.equal(r.withVerifiedCost,1);assert.equal(r.valid,1);
});
test('sin aprobación explícita no exporta precios',()=>assert.equal(makePublicRateSnapshot(rates,{version:'v1'}).rates.length,0));
test('aprueba sólo el precio, versión y duración coincidentes',()=>{
 const r=makePublicRateSnapshot(rates,{version:'v1',approvals:[{id:'wc',version:'v1',approved:true,cents:9500,unit:'ud',minutes:90}],durations:{wc:90}});
 assert.equal(r.rates.length,1);assert.equal(r.rates[0].price,95);
 assert.equal(JSON.stringify(r).includes('verifiedCostPerUnit'),false);assert.equal(JSON.stringify(r).includes('scope'),false);
});
test('rechaza permisos antiguos y precios diferentes',()=>{
 const a=[{id:'wc',version:'v1',approved:true,cents:7000,unit:'ud',minutes:90}];
 assert.equal(makePublicRateSnapshot(rates,{version:'v1',approvals:a,durations:{wc:90}}).rates.length,0);
 assert.equal(makePublicRateSnapshot(rates,{version:'v2',approvals:a,durations:{wc:90}}).rates.length,0);
});
test('detecta duplicados sin exportación parcial',()=>{
 const r=makePublicRateSnapshot([...rates,...rates],{version:'v1'});assert.equal(r.reason,'invalid_private_catalog');assert.equal(r.rates.length,0);
});
test('rechaza costes o precios inválidos',()=>{
 assert.equal(inspectFlutterRates([{...rates[0],price:-1}]).valid,0);
 assert.equal(inspectFlutterRates([{...rates[0],verifiedCostPerUnit:-1}]).valid,0);
});
