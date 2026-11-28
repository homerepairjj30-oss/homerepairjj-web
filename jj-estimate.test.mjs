import test from 'node:test';
import assert from 'node:assert/strict';
import { adaptCatalog } from './jj-catalog-adapter.mjs';
import { estimate } from './jj-estimate.mjs';

const snapshot={version:'v1',rates:[{id:'a',name:'Instalación',category:'Fontanería',unit:'ud',price:30,minutes:60,referenceDate:'2026-11-28'}]};
const approvals=[{id:'a',version:'v1',approved:true,cents:3000,minutes:60,unit:'ud'}];

test('solo tarifas expresamente aprobadas',()=>{
 assert.equal(adaptCatalog(snapshot,[]).rates.length,0);
 assert.equal(adaptCatalog(snapshot,approvals).rates.length,1);
 assert.equal(adaptCatalog(snapshot,[{...approvals[0],cents:3100}]).rates.length,0);
});
test('cantidad, tiempo e IVA al final',()=>{
 const catalog=adaptCatalog(snapshot,approvals);
 const r=estimate([{id:'a',quantity:2}],catalog,21);
 assert.equal(r.status,'estimate');
 assert.deepEqual([r.base,r.tax,r.total,r.workMinutes],[6000,1260,7260,120]);
});
test('no inventar precio para trabajos no aprobados',()=>{
 const r=estimate([{id:'desconocido',quantity:1}],adaptCatalog(snapshot,approvals),21);
 assert.equal(r.status,'review_required');
 assert.equal(r.total,null);
});
test('no aceptar IVA sin determinar',()=>{
 assert.throws(()=>estimate([{id:'a',quantity:1}],adaptCatalog(snapshot,approvals),0));
});

test('descuento porcentual antes del IVA',()=>{
 const r=estimate([{id:'a',quantity:2}],adaptCatalog(snapshot,approvals),21,{type:'percent',value:10});
 assert.deepEqual([r.base,r.discountCents,r.taxableBase,r.tax,r.total],[6000,600,5400,1134,6534]);
});
test('descuento fijo antes del IVA',()=>{
 const r=estimate([{id:'a',quantity:2}],adaptCatalog(snapshot,approvals),10,{type:'fixed',value:1000});
 assert.deepEqual([r.base,r.discountCents,r.taxableBase,r.tax,r.total],[6000,1000,5000,500,5500]);
});
test('descuentos inválidos rechazados',()=>{
 const c=adaptCatalog(snapshot,approvals);
 for(const d of [{type:'percent',value:101},{type:'percent',value:-1},{type:'fixed',value:6001},{type:'fixed',value:4.5},{type:'inventado',value:5}])
  assert.throws(()=>estimate([{id:'a',quantity:2}],c,21,d));
});
