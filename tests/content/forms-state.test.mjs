import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createFormsController,formsStorageKey,initialFormsState,formsExpirationMs} from '../../src/lib/site/forms-state.mjs';

test('forms state persists, restores and resets only its own key',()=>{
 const data=new Map([['unrelated','keep']]);const storage={getItem:key=>data.get(key),setItem:(key,value)=>data.set(key,value)};
 const controller=createFormsController(storage);
 assert.deepEqual(JSON.parse(data.get(formsStorageKey)),initialFormsState);
 controller.setState({HideForms:true,FormsConvertationCounter:7,FormsConvertationWorkflow:2});
 assert.deepEqual(createFormsController(storage).getState(),controller.getState());
 assert.throws(()=>{controller.getState().HideForms=false;},TypeError);
 const observed=[];const remove=controller.subscribe(value=>observed.push(value));
 assert.deepEqual(controller.reset(),initialFormsState);assert.deepEqual(JSON.parse(data.get(formsStorageKey)),initialFormsState);
 assert.equal(observed.length,2);remove();assert.equal(data.get('unrelated'),'keep');
});
test('24-hour expiration resets every field at the boundary and persists the reset',()=>{
 let now=1000000000;
 const saved={HideForms:true,FormsConvertationCounter:20,FormsConvertationWorkflow:1,FormsConvertationTimeout:now};
 let raw=JSON.stringify(saved);
 const storage={getItem:()=>raw,setItem:(_key,value)=>raw=value};
 const controller=createFormsController(storage,()=>now);
 now+=formsExpirationMs-1;assert.deepEqual(controller.checkExpiration(),saved);
 now++;assert.deepEqual(controller.checkExpiration(),initialFormsState);
 assert.deepEqual(JSON.parse(raw),initialFormsState);
 raw=JSON.stringify(saved);assert.deepEqual(createFormsController(storage,()=>now).getState(),initialFormsState);
 raw=JSON.stringify(saved);assert.deepEqual(controller.reload(),initialFormsState);
 controller.setState({FormsConvertationCounter:8});now+=formsExpirationMs*3;
 assert.equal(controller.checkExpiration().FormsConvertationCounter,8,'A zero timestamp does not start expiration');
});
test('corrupt data and blocked storage leave valid session state',()=>{
 const storage={getItem:()=>'{bad json',setItem:()=>{throw new Error('blocked');}};
 const controller=createFormsController(storage);assert.deepEqual(controller.getState(),initialFormsState);
 controller.setState({FormsConvertationCounter:1});assert.equal(controller.getState().FormsConvertationCounter,1);
 for(const patch of [{HideForms:'true'},{FormsConvertationCounter:-1},{FormsConvertationWorkflow:1.2},{unknown:3}])assert.throws(()=>controller.setState(patch),TypeError);
 assert.deepEqual(controller.reset(),initialFormsState);
});
test('reload picks up changes from storage without writing them back',()=>{
 let raw=JSON.stringify({HideForms:true,FormsConvertationCounter:4,FormsConvertationWorkflow:'invalid'}),writes=0;
 const controller=createFormsController({getItem:()=>raw,setItem:()=>writes++});
 assert.deepEqual(controller.getState(),{HideForms:true,FormsConvertationCounter:4,FormsConvertationWorkflow:0,FormsConvertationTimeout:0});
 raw=null;controller.reload();assert.deepEqual(controller.getState(),initialFormsState);assert.equal(writes,1);
});
