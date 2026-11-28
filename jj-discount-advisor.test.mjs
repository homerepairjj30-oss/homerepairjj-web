import test from 'node:test';
import assert from 'node:assert/strict';
import {adviseDiscount} from './jj-discount-advisor.mjs';

test('sin costes o beneficio objetivo no afirma descuento seguro',()=>{
 assert.equal(adviseDiscount({saleCents:20000}).status,'needs_costs');
 assert.equal(adviseDiscount({saleCents:20000,costCents:10000}).status,'needs_costs');
});
test('con margen comprobado calcula máximo sin aplicarlo',()=>{
 const r=adviseDiscount({saleCents:20000,costCents:13000,minimumProfitCents:5000});
 assert.equal(r.maxSafeCents,2000); assert.equal(r.maxSafePercent,10); assert.equal(r.applied,false);
});
test('avisa si se supera el margen protegido',()=>{
 const r=adviseDiscount({saleCents:20000,costCents:13000,minimumProfitCents:5000,requestedDiscount:{type:'percent',value:15}});
 assert.equal(r.status,'exceeds_safe_limit'); assert.equal(r.profitAfterRequestedCents,4000);
});
test('sin margen disponible no recomienda descuento',()=>{
 assert.equal(adviseDiscount({saleCents:10000,costCents:9000,minimumProfitCents:1500}).status,'no_safe_discount');
});
test('rechaza precios inválidos',()=>assert.throws(()=>adviseDiscount({saleCents:-1,costCents:100,minimumProfitCents:200})));
