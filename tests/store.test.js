import {test} from 'node:test';
import assert from 'node:assert/strict';
import {updatePlant,validateGenetics,load,qrPayload} from '../src/store.js';
test('cria ID estável e mantém histórico ao editar e trocar fase',()=>{
 const p=updatePlant(null,{name:' Planta ',startDate:'2026-01-01',phase:'Broto'},'p1');
 const renamed=updatePlant(p,{...p,name:'Outra'});
 assert.equal(renamed.id,'p1');assert.deepEqual(renamed.history,p.history);
 const next=updatePlant(renamed,{...renamed,phase:'Vega',phaseDate:'2026-02-01'});
 assert.equal(next.history.length,2);assert.equal(p.history.length,1);
 assert.throws(()=>updatePlant(next,{...next,phase:'Flora',phaseDate:'2025-01-01'}));
});
test('valida intervalos opcionais da genética',()=>{
 validateGenetics({name:'G',minWeeks:'',maxWeeks:''});
 validateGenetics({name:'G',minWeeks:'8',maxWeeks:'10'});
 assert.throws(()=>validateGenetics({name:'G',minWeeks:'10',maxWeeks:'8'}));
 assert.throws(()=>validateGenetics({name:'G',minWeeks:'-1',maxWeeks:''}));
});
test('dados ausentes, corrompidos e QR sem URL pública',()=>{
 assert.deepEqual(load({getItem:()=>null}),{plants:[],genetics:[]});
 assert.throws(()=>load({getItem:()=>'{corrompido'}));
 assert.throws(()=>load({getItem:()=>'{"plants":[{}],"genetics":[]}'}));
 assert.equal(qrPayload('p1'),'growtrack:planta:p1');
});
