import test from 'node:test';
import assert from 'node:assert/strict';
import {voiceBudget} from './jj-voice-budget.mjs';
const catalog={version:'v1',rates:[{id:'wc',label:'Cambiar váter',category:'Fontanería',unit:'ud',cents:9000,minutes:120,updatedAt:'2026-11-28',approved:true}]};
const draft={lines:[{id:'wc',quantity:1}]};
test('conservar descripción del trabajo',()=>assert.deepEqual(voiceBudget('Cambiar un váter',null,catalog,21).description,'Cambiar un váter'));
test('órdenes equivalentes generan únicamente borrador',()=>{
 for(const cmd of ['JJ, pásamelo a presupuesto','hazme un presupuesto','prepara un presupuesto','créame un presupuesto','presupuéstamelo']){
  const r=voiceBudget(cmd,draft,catalog,21); assert.equal(r.status,'draft_ready_for_approval',cmd); assert.equal(r.result.total,10890);
 }
});
test('falta descripción',()=>assert.equal(voiceBudget('hazme un presupuesto',null,catalog,21).status,'need_work_details'));
test('catálogo vacío bloquea el cálculo',()=>assert.equal(voiceBudget('pásamelo a presupuesto',draft,{version:'pending',rates:[]},21).status,'catalog_missing'));
test('tarifa no autorizada bloquea el precio',()=>assert.equal(voiceBudget('pásamelo a presupuesto',{lines:[{id:'otro',quantity:1}]},catalog,21).status,'review_required'));
test('IVA no determinado bloquea',()=>assert.equal(voiceBudget('pásamelo a presupuesto',draft,catalog,null).status,'need_vat_validation'));
test('factura no se emite al mencionar la palabra',()=>assert.equal(voiceBudget('pasa el presupuesto a factura',draft,catalog,21).status,'invoice_requires_confirmation'));
test('descuento sólo aconseja',()=>assert.equal(voiceBudget('¿Puedo hacer un descuento?',draft,catalog,21).status,'discount_requested'));
test('cantidad inválida pide revisión',()=>assert.equal(voiceBudget('haz presupuesto',{lines:[{id:'wc',quantity:0}]},catalog,21).status,'review_required'));
