import test from 'node:test';
import assert from 'node:assert/strict';
import {estimate} from './jj-estimate.mjs';
import {adaptCatalog} from './jj-catalog-adapter.mjs';
const dataset=[
 {id:'j',name:'Trabajo completo',category:'Reformas',unit:'trabajo',price:200,minutes:180,referenceDate:'2026-11-28'},
 {id:'m',name:'Metro de tubo',category:'Fontanería',unit:'m',price:17.5,minutes:30,referenceDate:'2026-11-28'},
 {id:'h',name:'Hora técnico',category:'Mantenimiento',unit:'hora',price:30,minutes:60,referenceDate:'2026-11-28'},
 {id:'g',name:'Juego cierre',category:'Puertas',unit:'juego',price:60,minutes:45,referenceDate:'2026-11-28'},
 {id:'k',name:'Desplazamiento',category:'Otros',unit:'km',price:1,minutes:2,referenceDate:'2026-11-28'}
];
const normalUnit={trabajo:'trabajo',m:'ml',hora:'h',juego:'juego',km:'km'};
const snapshot={version:'v-actual',rates:dataset};
const approvals=dataset.map(r=>({id:r.id,version:'v-actual',approved:true,cents:r.price*100,minutes:r.minutes,unit:normalUnit[r.unit]}));
const catalog=adaptCatalog(snapshot,approvals);
test('se adaptan las unidades realmente utilizadas por Flutter',()=>assert.equal(catalog.rates.length,5));
test('cálculo mezcla servicio, metros fraccionarios y horas',()=>{
 const result=estimate([{id:'j',quantity:1},{id:'m',quantity:2.5},{id:'h',quantity:2}],catalog,21);
 assert.equal(result.base,30375); assert.equal(result.tax,6379); assert.equal(result.total,36754);
 assert.equal(result.workMinutes,375);
});
test('trabajo y juego exigen cantidades enteras',()=>{
 assert.equal(estimate([{id:'j',quantity:0.5}],catalog,21).status,'review_required');
 assert.equal(estimate([{id:'g',quantity:1.5}],catalog,21).status,'review_required');
});
test('km y m permiten decimales',()=>assert.equal(estimate([{id:'k',quantity:12.5}],catalog,21).total,1513));
test('catálogo sin aprobar no genera importe',()=>assert.equal(estimate([{id:'j',quantity:1}],adaptCatalog(snapshot,[]),21).total,null));
test('sin tiempo comprobado no se publica tarifa',()=>{
 const bad={version:'v-actual',rates:[{...dataset[0],minutes:null}]};
 assert.equal(adaptCatalog(bad,approvals).rates.length,0);
});
test('el descuento no es automático',()=>{
 const r=estimate([{id:'j',quantity:1}],catalog,21);
 assert.equal(r.discountCents,0); assert.equal(r.total,24200);
});
