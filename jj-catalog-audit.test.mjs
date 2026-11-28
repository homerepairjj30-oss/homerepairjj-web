import test from 'node:test';
import assert from 'node:assert/strict';
import {auditCatalog} from './jj-catalog-audit.mjs';
const snapshot={version:'v1',rates:[{id:'wc',name:'WC',unit:'ud',price:70,referenceDate:'2026-11-10'}]};
test('sin tiempos ni aprobación bloquea publicación',()=>{
 const a=auditCatalog(snapshot);assert.equal(a.total,1);assert.equal(a.ready,0);
 assert.ok(a.missing.missing_time_estimate);assert.ok(a.missing.not_approved_for_public_web);
});
test('aprobación exacta y duración completan partida',()=>{
 const s={version:'v1',rates:[{...snapshot.rates[0],minutes:90}]};
 const a=auditCatalog(s,[{id:'wc',version:'v1',approved:true,cents:7000,unit:'ud',minutes:90}]);
 assert.equal(a.ready,1);assert.equal(a.pending,0);
});
test('una aprobación antigua o de otro precio no vale',()=>{
 const s={version:'v2',rates:[{...snapshot.rates[0],minutes:90}]};
 assert.equal(auditCatalog(s,[{id:'wc',version:'v1',approved:true,cents:7000,unit:'ud',minutes:90}]).ready,0);
 assert.equal(auditCatalog(s,[{id:'wc',version:'v2',approved:true,cents:8000,unit:'ud',minutes:90}]).ready,0);
});
test('unidades adicionales se auditan sin inventar equivalencias',()=>{
 const s={version:'v1',rates:[{id:'a',name:'Visita',unit:'trabajo',price:45,minutes:60,referenceDate:'2026-11-10'}]};
 assert.equal(auditCatalog(s,[{id:'a',version:'v1',approved:true,cents:4500,unit:'trabajo',minutes:60}]).ready,1);
});
