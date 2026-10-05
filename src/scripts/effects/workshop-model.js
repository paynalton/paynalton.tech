import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

// Shared by live WebGL and the reproducible static renders. No network resources.
export function createWorkshop(renderer,variant='hero'){
 if(variant==='book')return createBookSculpture(renderer);
 if(variant!=='hero')return createSectionSculpture(renderer,variant);
 const scene=new THREE.Scene(), sculpture=new THREE.Group(),pivot=new THREE.Group();
 pivot.position.y=1.9;sculpture.position.y=-1.9;pivot.add(sculpture);scene.add(pivot);
 const camera=new THREE.OrthographicCamera();
 const textures=[],materials=[],geometries=[];
 const material=options=>{const m=new THREE.MeshStandardMaterial(options);materials.push(m);return m;};
 const keep=g=>{geometries.push(g);return g;};
 const mesh=(g,m,parent=sculpture)=>{const o=new THREE.Mesh(keep(g),m);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;};
 // Deterministic mineral relief; one small local canvas, shared by all dark slabs.
 const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
 const ctx=canvas.getContext('2d'),pixels=ctx.createImageData(256,256);let seed=723;
 const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const noise=(x,y)=>{
  const hash=(a,b)=>{let n=Math.imul(a,374761393)+Math.imul(b,668265263);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295;};
  const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);
  return (hash(ix,iy)*(1-u)+hash(ix+1,iy)*u)*(1-v)+(hash(ix,iy+1)*(1-u)+hash(ix+1,iy+1)*u)*v;
 };
 for(let y=0;y<256;y++)for(let x=0;x<256;x++){
  const v=95+noise(x*.035,y*.035)*48+noise(x*.17,y*.17)*22+random()*15;
  const i=(y*256+x)*4;pixels.data[i]=v;pixels.data[i+1]=v;pixels.data[i+2]=v;pixels.data[i+3]=255;
 }
 ctx.putImageData(pixels,0,0);ctx.strokeStyle='rgba(225,230,215,.26)';ctx.lineWidth=.7;
 for(let i=0;i<18;i++){ctx.beginPath();let x=random()*256,y=random()*256;ctx.moveTo(x,y);for(let j=0;j<8;j++){x+=random()*25-8;y+=random()*23;ctx.lineTo(x,y);}ctx.stroke();}
 const relief=new THREE.CanvasTexture(canvas);relief.wrapS=relief.wrapT=THREE.RepeatWrapping;relief.repeat.set(.65,.65);textures.push(relief);
 const stoneColor=relief.clone();stoneColor.colorSpace=THREE.SRGBColorSpace;stoneColor.needsUpdate=true;textures.push(stoneColor);
 const obsidian=material({color:0x6c7c75,map:stoneColor,roughness:.84,metalness:.12,bumpMap:relief,bumpScale:.065});
 const copper=material({color:0xc78d65,roughness:.31,metalness:.84});
 const bronze=material({color:0x75513c,roughness:.55,metalness:.65});
 const jade=material({color:0x527e77,roughness:.55,metalness:.3});
 const rock=material({color:0x172323,roughness:.94,flatShading:true});
 const room=new RoomEnvironment(),pmrem=new THREE.PMREMGenerator(renderer),environment=pmrem.fromScene(room,.06);
 scene.environment=environment.texture;scene.environmentIntensity=.45;room.dispose();pmrem.dispose();
 scene.add(new THREE.HemisphereLight(0xdbe6df,0x11191c,.6));
 const key=new THREE.DirectionalLight(0xffd5ad,3.0);key.position.set(-3,6,5);scene.add(key);
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-3;key.shadow.camera.right=3;key.shadow.camera.top=5;key.shadow.camera.bottom=-2;key.shadow.normalBias=.03;
 const rim=new THREE.DirectionalLight(0x88afbc,1.4);rim.position.set(4,4,-3);scene.add(rim);
 const pieces=[];
 function slab(x,y,z,w,h,depth,mat,angle=0){
  const group=new THREE.Group();group.position.set(x,y,z);group.rotation.y=angle;sculpture.add(group);pieces.push(group);
  const shape=new THREE.Shape();shape.moveTo(-w/2,0);shape.lineTo(w/2,0);shape.lineTo(w/2,h);shape.lineTo(-w/2,h);shape.closePath();
  mesh(new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.017,bevelThickness:.017}),mat,group);
  return group;
 }
 const left=slab(-.98,.45,.3,1.22,2.65,.15,obsidian,-.12);
 const core=slab(.0,.54,-.05,.96,2.85,.19,copper,.08);
 const rear=slab(.25,.72,-.69,.43,3.33,.12,obsidian,.02);
 const right=slab(1.04,.56,.0,1.02,2.61,.16,obsidian,.19);
 const front=slab(.43,.29,.77,.59,1.68,.12,obsidian,-.14);
 const foot=slab(-1.43,.20,.86,.8,.8,.13,obsidian,-.18);
 // Raised step motifs, merged per slab so their detail does not multiply draw calls.
 function motif(parent,points,z,width=.025){
  const parts=[];for(let i=1;i<points.length;i++){
   const [x1,y1]=points[i-1],[x2,y2]=points[i];
   const g=new THREE.BoxGeometry(Math.abs(x2-x1)+width,Math.abs(y2-y1)+width,.023);g.translate((x1+x2)/2,(y1+y2)/2,z);parts.push(g);
  }
  mesh(mergeGeometries(parts),copper,parent).castShadow=false;parts.forEach(g=>g.dispose());
 }
 motif(left,[[-.4,.28],[-.4,.8],[-.16,.8],[-.16,1.18],[.08,1.18],[.08,1.62],[.37,1.62],[.37,2.28],[.05,2.28],[.05,1.98],[-.24,1.98],[-.24,1.5],[-.4,1.5]],.19);
 motif(right,[[-.30,.28],[-.30,.65],[0,.65],[0,1.05],[.26,1.05],[.26,1.44],[-.05,1.44],[-.05,1.83],[.29,1.83],[.29,2.27]],.2);
 motif(rear,[[-.13,2],[-.13,2.4],[.11,2.4],[.11,2.76],[-.11,2.76],[-.11,3.07]],.16,.017);
 motif(front,[[-.18,.17],[-.18,.55],[.08,.55],[.08,.93],[-.08,.93],[-.08,1.37]],.16,.017);
 motif(foot,[[-.27,.08],[-.27,.28],[-.04,.28],[-.04,.58],[.19,.58],[.19,.75]],.17,.023);
 // Fine architectural outlines and seams are one batch per material.
 const lines=[];for(const group of [left,core,right,front]){
  const geometry=group.children[0].geometry,edge=new THREE.EdgesGeometry(geometry,35);group.updateMatrix();edge.applyMatrix4(group.matrix);lines.push(edge);
 }
 const lineMaterial=new THREE.LineBasicMaterial({color:0xb7825b,transparent:true,opacity:.45});materials.push(lineMaterial);
 sculpture.add(new THREE.LineSegments(keep(mergeGeometries(lines)),lineMaterial));lines.forEach(g=>g.dispose());
 const spine=mesh(new THREE.BoxGeometry(.075,2.7,.08),jade);spine.position.set(-.30,1.72,.21);
 const orb=mesh(new THREE.SphereGeometry(.175,32,20),copper);orb.position.set(.06,3.65,-.15);
 const disc=mesh(new THREE.CylinderGeometry(.21,.21,.16,32),copper);disc.rotation.x=Math.PI/2;disc.position.set(1.25,1.03,.43);
 const base=mesh(new THREE.CylinderGeometry(1,1.07,.15,6),bronze);base.scale.set(2.0,1,1.19);base.position.y=.10;
 const rocks=[];for(let i=0;i<13;i++){
  const g=new THREE.IcosahedronGeometry(1,1);g.scale(.4+random()*.5,.1+random()*.18,.25+random()*.3);g.rotateY(random()*4);g.translate((random()-.5)*3.5,.1,(random()-.5)*1.7);rocks.push(g);
 }
 mesh(mergeGeometries(rocks),rock);rocks.forEach(g=>g.dispose());
 const orbitPoints=[];for(const [radius,tilt] of [[2.0,0],[2.12,1.1]])for(let i=0;i<100;i++){
  for(const a of [i/100*Math.PI*2,(i+1)/100*Math.PI*2])orbitPoints.push(new THREE.Vector3(Math.cos(a)*radius,Math.sin(a)*radius*Math.cos(tilt)+2,Math.sin(a)*radius*Math.sin(tilt)-.7));
 }
 const orbitMaterial=new THREE.LineBasicMaterial({color:0xa47756,transparent:true,opacity:.24});materials.push(orbitMaterial);
 sculpture.add(new THREE.LineSegments(keep(new THREE.BufferGeometry().setFromPoints(orbitPoints)),orbitMaterial));
 const homePositions=pieces.map(g=>g.position.clone());
 function animate(seconds){
  const angle=Math.atan2(5,-3)+seconds*Math.PI*2/60;
  key.position.set(Math.cos(angle)*Math.sqrt(34),6,Math.sin(angle)*Math.sqrt(34));
  orb.position.set(.06+Math.sin(seconds*Math.PI/6)*.09,3.65+Math.sin(seconds*Math.PI/4)*.14,-.15);
 }
 function pose(progress=1,yaw=0,pitch=0){pivot.rotation.set(pitch,yaw,0);pieces.forEach((g,i)=>{g.position.copy(homePositions[i]);g.position.y+=(1-progress)*(.12+i*.025);});}
 function frame(width,height){
  const mobile=width/height<1.15,span=mobile?5.15:4.9;
  camera.left=-span*width/height/2;camera.right=-camera.left;camera.top=span/2;camera.bottom=-span/2;camera.near=.1;camera.far=40;
  camera.position.set(mobile?5.9:6.8,4.6,9.8);camera.lookAt(0,1.94,0);camera.updateProjectionMatrix();
 }
 function dispose(){key.shadow.map?.dispose();key.shadow.mapPass?.dispose();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());environment.dispose();scene.clear();}
 const geometryBytes=geometries.reduce((sum,g)=>sum+Object.values(g.attributes).reduce((bytes,a)=>bytes+a.array.byteLength,0)+(g.index?.array.byteLength??0),0);
 return {scene,camera,frame,pose,animate,dispose,geometryBytes};
}

function createBookSculpture(renderer){
 const scene=new THREE.Scene(),group=new THREE.Group(),camera=new THREE.OrthographicCamera();scene.add(group);
 const geometries=[],materials=[];
 const material=options=>{const m=new THREE.MeshStandardMaterial(options);materials.push(m);return m;};
 const mesh=(geometry,mat,x=0,y=0,z=0)=>{geometries.push(geometry);const object=new THREE.Mesh(geometry,mat);object.position.set(x,y,z);object.castShadow=true;object.receiveShadow=true;group.add(object);return object;};
 const cover=material({color:0x172323,roughness:.5,metalness:.28});
 const page=material({color:0xf3eee3,roughness:.8,metalness:0});
 const room=new RoomEnvironment(),generator=new THREE.PMREMGenerator(renderer),environment=generator.fromScene(room,.06);room.dispose();generator.dispose();scene.environment=environment.texture;scene.environmentIntensity=.72;
 scene.add(new THREE.HemisphereLight(0xdbe6df,0x11191c,1));
 const key=new THREE.DirectionalLight(0xffd5ad,3);key.position.set(-3,6,5);scene.add(key);
 const rim=new THREE.DirectionalLight(0x88afbc,1.8);rim.position.set(4,4,-3);scene.add(rim);
 // A bound open book: curved page blocks, layered edges and oversized covers.
 const paperEdge=material({color:0xd9cdb5,roughness:.95,metalness:0});
 const ink=new THREE.LineBasicMaterial({color:0x73695c,transparent:true,opacity:.6});materials.push(ink);
 const edgeInk=new THREE.LineBasicMaterial({color:0xb8aa90,transparent:true,opacity:.65});materials.push(edgeInk);
 const top=u=>.09+.19*Math.sin(Math.PI*u)-.13*u;
 const edgeLines=[],textLines=[];
 for(const sign of [-1,1]){
  const shape=new THREE.Shape();
  for(let i=0;i<=32;i++){const u=i/32,x=sign*(.035+u*1.3),z=top(u);if(i===0)shape.moveTo(x,z);else shape.lineTo(x,z);}
  for(let i=32;i>=0;i--){const u=i/32;shape.lineTo(sign*(.035+u*1.3),top(u)-.15);}
  shape.closePath();
  const block=new THREE.ExtrudeGeometry(shape,{depth:2.02,bevelEnabled:false,steps:1});block.rotateX(Math.PI/2);block.translate(0,1.01,0);
  mesh(block,paperEdge);
  // Fine paper surface follows the block's curved cross-section.
  const surface=new THREE.PlaneGeometry(1.3,2.02,32,1),positions=surface.attributes.position;
  for(let i=0;i<positions.count;i++){const u=(positions.getX(i)+.65)/1.3;positions.setXYZ(i,sign*(.035+u*1.3),positions.getY(i),top(u)+.002);}
  // Mirroring the left leaf reverses winding: make the paper double-sided.
  surface.computeVertexNormals();page.side=THREE.DoubleSide;mesh(surface,page);
  const board=mesh(new THREE.BoxGeometry(1.43,2.22,.075),cover,sign*.73,0,-.2);board.rotation.y=sign*.1;
  for(let layer=1;layer<8;layer++)for(let i=0;i<32;i++){
   for(const y of [-1.012,1.012])for(const u of [i/32,(i+1)/32])edgeLines.push(new THREE.Vector3(sign*(.035+u*1.3),y,top(u)-layer*.018));
  }
  for(let row=0;row<14;row++){
   const end=row%5===4?.66:.89,y=.77-row*.115;
   for(let i=0;i<20;i++){if((i+row)%5===4)continue;for(const u of [.12+(end-.12)*i/20,.12+(end-.12)*(i+1)/20])textLines.push(new THREE.Vector3(sign*(.035+u*1.3),y,top(u)+.006));}
  }
 }
 for(const [points,mat] of [[edgeLines,edgeInk],[textLines,ink]]){
  const geometry=new THREE.BufferGeometry().setFromPoints(points);geometries.push(geometry);group.add(new THREE.LineSegments(geometry,mat));
 }
 const spine=mesh(new THREE.CylinderGeometry(.12,.12,2.23,24),cover,0,0,-.13);spine.scale.z=.7;
 const ribbonMaterial=material({color:0xa8583e,roughness:.85,metalness:0,side:THREE.DoubleSide});
 const ribbon=new THREE.PlaneGeometry(.065,2.1,1,24),ribbonPoints=ribbon.attributes.position;
 for(let i=0;i<ribbonPoints.count;i++){const y=ribbonPoints.getY(i)-.29;const u=.08;ribbonPoints.setXYZ(i,ribbonPoints.getX(i)+.14,y,top(u)+.025-(y< -1?(-y-1)*.75:0));}
 ribbon.computeVertexNormals();mesh(ribbon,ribbonMaterial);
 function frame(width,height){const span=3.7;camera.left=-span*width/height/2;camera.right=-camera.left;camera.top=span/2;camera.bottom=-span/2;camera.near=.1;camera.far=30;camera.position.set(2.6,3.4,8.5);camera.lookAt(0,-.08,0);camera.updateProjectionMatrix();}
 function animate(seconds){const angle=Math.atan2(5,-3)+seconds*Math.PI*2/60;key.position.set(Math.cos(angle)*Math.sqrt(34),6,Math.sin(angle)*Math.sqrt(34));}
 function pose(progress=1,yaw=0,pitch=0){group.rotation.set(pitch-.12,yaw-.12,0);group.position.y=(1-progress)*.15;}
 function dispose(){geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());environment.dispose();scene.clear();}
 const geometryBytes=geometries.reduce((sum,g)=>sum+Object.values(g.attributes).reduce((bytes,a)=>bytes+a.array.byteLength,0)+(g.index?.array.byteLength??0),0);
 return{scene,camera,frame,pose,animate,dispose,geometryBytes};
}


// Smaller companions share the workshop's materials and lighting vocabulary.
function createSectionSculpture(renderer,variant){
 const scene=new THREE.Scene(),group=new THREE.Group(),camera=new THREE.OrthographicCamera();scene.add(group);
 const geometries=[],materials=[];
 const material=(color,metalness,roughness)=>{const m=new THREE.MeshStandardMaterial({color,metalness,roughness});materials.push(m);return m;};
 const copper=material(0xc78d65,.8,.3),stone=material(0x344c48,.25,.72),jade=material(0x527e77,.48,.45),dark=material(0x172323,.3,.65);
 const mesh=(geometry,mat,x=0,y=0,z=0)=>{geometries.push(geometry);const obj=new THREE.Mesh(geometry,mat);obj.position.set(x,y,z);group.add(obj);return obj;};
 const room=new RoomEnvironment(),generator=new THREE.PMREMGenerator(renderer),environment=generator.fromScene(room,.06);room.dispose();generator.dispose();scene.environment=environment.texture;scene.environmentIntensity=.65;
 scene.add(new THREE.HemisphereLight(0xdbe6df,0x11191c,1));
 const key=new THREE.DirectionalLight(0xffd5ad,3);key.position.set(-3,6,5);scene.add(key);
 const rim=new THREE.DirectionalLight(0x88afbc,2);rim.position.set(4,4,-3);scene.add(rim);
 const base=mesh(new THREE.CylinderGeometry(1.8,1.92,.16,6),dark,0,-1.35,0);base.rotation.y=.25;
 if(variant==='projects'){
  // A modular system: three structures joined by visible copper conduits.
  const nodes=[[-1,-.5,.35],[.9,-.15,.35],[0,.85,-.45]];
  nodes.forEach(([x,y,z],i)=>{
   const block=mesh(new THREE.BoxGeometry(.8,.8,.8),i===1?jade:stone,x,y,z);block.rotation.y=.15;
   mesh(new THREE.BoxGeometry(.62,.055,.06),copper,x,y+.26,z+.44);
   mesh(new THREE.SphereGeometry(.14,20,12),copper,x,y+.66,z);
  });
  for(const [a,b] of [[0,1],[1,2],[2,0]]){
   const from=new THREE.Vector3(...nodes[a]),to=new THREE.Vector3(...nodes[b]);
   const middle=from.clone().lerp(to,.5);middle.y+=.38;
   mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(from,middle,to),24,.035,6,false),copper);
  }
  mesh(new THREE.CylinderGeometry(.1,.15,1.1,12),dark,0,-.7,-.45);
 }else if(variant==='career'){
  // Accumulated stages form a rising spiral, distinct from the Home pillars.
  mesh(new THREE.CylinderGeometry(.1,.14,2.85,16),copper,0,.15,0);
  for(let i=0;i<9;i++){
   const angle=i*.62,step=mesh(new THREE.BoxGeometry(.9,.15,.5),i%3===0?copper:stone,Math.cos(angle)*.75,-1.12+i*.3,Math.sin(angle)*.75);
   step.rotation.y=-angle;
  }
  const points=Array.from({length:65},(_,i)=>{const a=i/64*4.96;return new THREE.Vector3(Math.cos(a)*1.2,-.95+i/64*2.4,Math.sin(a)*1.2);});
  mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),64,.025,6,false),jade);
  mesh(new THREE.SphereGeometry(.22,24,16),copper,0,1.88,0);
 }else if(variant==='works'){
  // An unfolding archive: sheets and copper editorial lines.
  for(let i=0;i<5;i++){
   const sheet=mesh(new THREE.BoxGeometry(.72,1.85,.085),i===2?copper:i%2?jade:stone,(i-2)*.48,.12,Math.abs(i-2)*.17);
   sheet.rotation.z=-(i-2)*.16;sheet.rotation.y=(i-2)*.13;
   for(let j=0;j<2;j++){
    const line=mesh(new THREE.BoxGeometry(.46-j*.1,.035,.025),i===2?dark:copper);
    line.position.set(0,.36-j*.23,.065);group.remove(line);sheet.add(line);
   }
  }
  mesh(new THREE.BoxGeometry(2.6,.14,1.05),dark,0,-1.15,0);
  mesh(new THREE.SphereGeometry(.18,24,16),copper,0,1.58,0);
 }else if(variant==='about'){
  // A compass: direction and the meeting of different interests.
  const ring=mesh(new THREE.TorusGeometry(1.32,.06,10,64),copper,0,.2,0);ring.rotation.y=.18;
  const inner=mesh(new THREE.TorusGeometry(.92,.035,8,48),jade,0,.2,0);inner.rotation.y=-.45;
  const north=mesh(new THREE.ConeGeometry(.36,1.15,4),jade,0,.76,.15);north.rotation.y=Math.PI/4;
  const south=mesh(new THREE.ConeGeometry(.36,1.15,4),stone,0,-.39,.15);south.rotation.z=Math.PI;south.rotation.y=Math.PI/4;
  mesh(new THREE.SphereGeometry(.18,24,16),copper,0,.2,.42);
  for(let i=0;i<4;i++){const a=i*Math.PI/2;const tick=mesh(new THREE.BoxGeometry(.06,.22,.07),copper,Math.sin(a)*1.55,.2+Math.cos(a)*1.55,0);tick.rotation.z=-a;}
  mesh(new THREE.CylinderGeometry(.1,.16,.35,12),dark,0,-1.12,0);
 }else if(variant==='contact'){
  // Two interlocutors connected by an open curve, with a shared golden point.
  for(const sign of [-1,1]){
   mesh(new THREE.CylinderGeometry(.28,.4,1.45,6),sign===-1?stone:jade,sign*.97,-.48,0);
   mesh(new THREE.SphereGeometry(.26,24,16),copper,sign*.97,.58,0);
   const arc=mesh(new THREE.TorusGeometry(.53,.04,8,40,Math.PI*1.55),sign===-1?jade:copper,sign*.97,.58,0);
   arc.rotation.z=sign===-1?.7:Math.PI-.7;
  }
  const points=[new THREE.Vector3(-.97,.82,.05),new THREE.Vector3(-.45,1.65,-.2),new THREE.Vector3(.5,1.65,-.2),new THREE.Vector3(.97,.82,.05)];
  mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),40,.028,6,false),copper);
  mesh(new THREE.SphereGeometry(.17,24,16),jade,0,1.47,-.14);
 }else if(variant==='experience'){
  // Successive levels: accumulated work, joined by a copper trajectory.
  for(let i=0;i<5;i++){
   const h=.48+i*.48,x=(i-2)*.58;
   mesh(new THREE.BoxGeometry(.5,h,.85),i===3?copper:stone,x,-1.2+h/2,0);
   mesh(new THREE.BoxGeometry(.52,.035,.88),copper,x,-1.2+h+.04,0);
  }
  mesh(new THREE.SphereGeometry(.22,24,16),copper,1.16,1.62,0);
  const points=[new THREE.Vector3(-1.45,-.42,.58),new THREE.Vector3(-.45,.35,.58),new THREE.Vector3(.5,1.12,.58),new THREE.Vector3(1.45,1.95,.58)];
  mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),32,.025,6,false),jade);
 }else if(variant==='skills'){
  // Complementary fields arranged around a shared centre.
  mesh(new THREE.IcosahedronGeometry(.66,1),stone,0,.1,0);
  for(let i=0;i<3;i++){
   const ring=mesh(new THREE.TorusGeometry(1.35,.045,8,64),i===1?jade:copper,0,.1,0);
   ring.rotation.set(.45+i*.75,i*.9,.4);
   const orb=mesh(new THREE.SphereGeometry(.15,20,12),i===1?jade:copper);orb.position.set(Math.cos(i*2.1)*1.35,Math.sin(i*2.1)*1.35+.1,.25);
  }
  mesh(new THREE.CylinderGeometry(.09,.13,.62,16),copper,0,-.96,0);
 }else{
  // A span built from separate parts, with a common point of connection.
  mesh(new THREE.BoxGeometry(.48,1.95,.65),stone,-1.08,-.23,0);
  mesh(new THREE.BoxGeometry(.48,1.95,.65),stone,1.08,-.23,0);
  mesh(new THREE.BoxGeometry(2.68,.32,.7),copper,0,.89,0);
  for(let i=0;i<3;i++){
   const beam=mesh(new THREE.BoxGeometry(.1,1.32,.1),jade,(i-1)*.66,.04,.45);beam.rotation.z=(i-1)*-.32;
  }
  mesh(new THREE.TorusGeometry(.53,.075,10,48),copper,0,-.05,.3);
  mesh(new THREE.SphereGeometry(.24,24,16),jade,0,1.5,0);
  mesh(new THREE.BoxGeometry(1.05,.12,.82),copper,-.72,-1.08,.65);
  mesh(new THREE.BoxGeometry(1.05,.12,.82),copper,.72,-1.08,-.65);
 }
 function frame(width,height){const span=5.1;camera.left=-span*width/height/2;camera.right=-camera.left;camera.top=span/2;camera.bottom=-span/2;camera.near=.1;camera.far=30;camera.position.set(5.4,3.3,8);camera.lookAt(0,.05,0);camera.updateProjectionMatrix();}
 const orbs=group.children.filter(child=>child.geometry?.type==='SphereGeometry').map(orb=>({orb,home:orb.position.clone()}));
 function animate(seconds){
  const angle=Math.atan2(5,-3)+seconds*Math.PI*2/60;
  key.position.set(Math.cos(angle)*Math.sqrt(34),6,Math.sin(angle)*Math.sqrt(34));
  orbs.forEach(({orb,home},i)=>{
   const phase=seconds*Math.PI/4;
   orb.position.copy(home);
   orb.position.y+=Math.sin(phase+i)*.13-Math.sin(i)*.13;
   orb.position.x+=Math.sin(seconds*Math.PI/7+i)*.08-Math.sin(i)*.08;
  });
 }
 function pose(progress=1,yaw=0,pitch=0){group.rotation.set(pitch,yaw,0);group.position.y=(1-progress)*.16;}
 function dispose(){geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());environment.dispose();scene.clear();}
 const geometryBytes=geometries.reduce((sum,g)=>sum+Object.values(g.attributes).reduce((bytes,a)=>bytes+a.array.byteLength,0)+(g.index?.array.byteLength??0),0);
 return{scene,camera,frame,pose,animate,dispose,geometryBytes};
}
