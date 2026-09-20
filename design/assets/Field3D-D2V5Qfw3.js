import{r as Je,t as c,D as W,P as We,j as Ft,s as w,b as Wt,G as ue,K as m,a as Ct,f as e,g as Nt,d as X,p as kt,F as It,h as Dt,i as Bt,k as O,l as ie,e as K,m as Qe,u as Ce}from"./index-DcxQnJYF.js";import{B as Zt,a as et,S as Vt,V as M,b as $t,c as Ne,d as Gt,P as Yt,e as qt,W as jt,G as Ut}from"./three-CdPaaKdt.js";import{m as Xt,P as Kt,S as Jt,g as Qt,b as wt,d as eo,a as to,h as oo,c as bt,e as no,i as Mt,f as ye,L as St,E as ao}from"./UmapCloud-Cop2gNlh.js";import"./motion-BCXewYul.js";const tt=3e4,io=[.64,.33,.03],Pt=18e3,ce=-34,Ie=2,se=28,y={z:0,scale:2.2,scaleMin:1.6,scaleMax:2.4,gapPx:40,headerPx:84,count:3e4,maxPx:12},re={x:8.4,top:.2,z:-40,scale:1,count:14e3},so=new M(0,2,0),we={x:9.6,top:.2,z:-2*ue,scale:.85},ro=new M(6,3,0),lo=44,R={x:-1.8,top:.215,z:-3*ue,scale:.4,tilt:.35},co=new M(.6,.8,0),uo=40,Ht={x:6,y:2},po=-.9,fo=1,ho=2.4,go=2.8,mo=22,ke={capturePx:160,ringPx:34,spin:.9,ease:3},Et=[.34,.5],le={z:-5*ue,minPx:110,maxPx:160,gapPx:16},vo=`
  attribute float aSeed;
  attribute float aLayer;
  uniform float uTime;
  uniform float uRot;
  uniform float uCamZ;
  uniform vec2 uCamXY;
  uniform float uMotion;
  uniform float uSize;
  uniform float uDpr;
  uniform float uBreath;
  uniform float uWake;
  uniform float uLens;
  uniform float uDefocus;      // 1 before the objective is set: soft, large, pale
  uniform float uFade;         // 1 once the reader has left the start page
  uniform vec2 uPointer;
  uniform float uOrbit;        // 1 while the pointer is over the first screen: the grains near the ring orbit it
  uniform vec2 uCursorNdc;     // the cursor's ring on screen
  uniform float uOrbitPx;      // the reach of the capture, px
  uniform float uRingPx;       // the orbit's radius, px
  uniform float uOrbitAng;     // how far the orbit has turned, rad
  uniform float uTanHalf;      // tan of half the field of view
  uniform float uAspect;
  uniform float uViewH;        // px
  varying float vAlpha;
  varying float vSeed;
  varying float vLayer;
  varying float vLens;
  varying float vFoc;
  varying float vPx;

  void main() {
    vec3 p = position;
    float layer = aLayer;

    // Endless in depth: the point's depth is taken relative to the camera.
    float L = ${(Ie-ce).toFixed(1)};
    float rel = mod(position.z - uCamZ - (${ce.toFixed(1)}), L) + (${ce.toFixed(1)});
    float relPre = rel;

    // The cloud circles a point in front of you — at the plane in focus — the
    // way the very first version did, its far layer slower than its near one; the dust (layer 3) between them.
    float speed = layer < 0.5 ? 0.5 : (layer < 1.5 ? 1.0 : (layer < 2.5 ? 1.25 : 0.75));
    float ang = uRot * speed;
    vec2 q = vec2(p.x - uCamXY.x, rel + ${W.toFixed(1)});
    float c = cos(ang), s = sin(ang);
    q = vec2(q.x * c + q.y * s, -q.x * s + q.y * c);
    p.x = q.x + uCamXY.x;
    rel = q.y - ${W.toFixed(1)};
    p.z = uCamZ + rel;

    p += vec3(
      sin(p.y * 0.35 + uTime * 0.09),
      sin(rel * 0.30 + uTime * 0.07 + 2.0),
      sin(p.x * 0.28 + uTime * 0.06 + 4.0)
    ) * (0.16 + 0.12 * layer) * uMotion;

    vec2 d = p.xy - uPointer;
    float dist2 = length(d);
    float w = smoothstep(3.4, 0.0, dist2) * (0.25 + 0.75 * step(0.5, layer)) * uWake * uMotion;
    p.xy += (d / max(dist2, 0.001)) * w * 1.2;

    // Over the first screen the grains near the cursor's ring (the mid layer, the near one, the dust — not the far
    // room) are drawn into a slow orbit around it: the ring's place is taken at each grain's own depth, so the
    // orbit is round on the screen whatever the depth, and each grain keeps its own pace and its own radius.
    if (uOrbit > 0.001 && layer > 0.5) {
      float dcam = uCamZ - p.z;
      if (dcam > 1.0) {
        float halfH = dcam * uTanHalf;
        float unitsPerPx = halfH / (0.5 * uViewH);
        vec2 cw = uCamXY + uCursorNdc * halfH * vec2(uAspect, 1.0);
        vec2 dc = p.xy - cw;
        float dl = length(dc);
        float capture = uOrbitPx * unitsPerPx;
        float ow = smoothstep(capture, capture * 0.3, dl) * uOrbit;
        float ang = atan(dc.y, dc.x) + uOrbitAng * (0.7 + 0.6 * fract(aSeed * 5.3));
        float ringR = uRingPx * unitsPerPx * (0.8 + 0.5 * fract(aSeed * 9.1));
        p.xy = mix(p.xy, cw + vec2(cos(ang), sin(ang)) * ringR, ow);
      }
    }

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float dist = -mv.z;
    // One lens for everything: sharp at the focus distance, soft away from it.
    float foc = 1.0 - smoothstep(0.0, 15.0, abs(dist - ${W.toFixed(1)}));
    float lens = smoothstep(4.4, 0.0, dist2) * uLens;

    float persp = 300.0 / max(dist, 1.0);
    float base = 0.7 + 0.8 * fract(aSeed * 7.31);
    // The dust is the smallest grain of all.
    float layerSize = layer < 0.5 ? 0.8 : (layer < 1.5 ? 1.15 : (layer < 2.5 ? 2.4 : 0.7));
    // Out of focus a stroke grows to a soft disc; the near layer, close to the lens, to a larger and paler one
    // (bokeh, capped — modestly, the big discs of the first round read as noise — its alpha divided by its area so
    // the discs never pile up into blots).
    float near = step(1.5, layer) * (1.0 - step(2.5, layer));
    float bokeh = 1.0 + (1.0 - foc) * (0.8 + 0.9 * near) + uDefocus * (1.2 + 0.8 * near);
    float cap = mix(12.0, 20.0, near);
    float px = clamp(uSize * uDpr * base * layerSize * persp * 0.05 * bokeh, 0.75, cap * uDpr);
    gl_PointSize = px;

    float breath = 1.0 - uBreath * 0.22 * (0.5 + 0.5 * sin(p.x * 0.22 + p.y * 0.17 + uTime * 0.045));
    float seam = smoothstep(${ce.toFixed(1)}, ${(ce+4).toFixed(1)}, relPre) * (1.0 - smoothstep(${(Ie-2.5).toFixed(1)}, ${Ie.toFixed(1)}, relPre));
    float layerAlpha = layer < 0.5 ? 0.34 : (layer < 1.5 ? 0.48 : (layer < 2.5 ? 0.30 : 0.28));
    // The pale grows with the disc: the growth beyond the old soft look is paid for by area.
    float grew = bokeh / (1.0 + (1.0 - foc) * 0.8);
    float a = layerAlpha * (0.30 + 0.70 * foc) * breath * seam / (grew * grew);
    a = mix(a * (1.0 - 0.25 * uLens), a * 1.7, lens);
    vAlpha = a * (1.0 - uFade);
    vSeed = aSeed;
    vLayer = layer;
    vLens = lens;
    vFoc = foc * (1.0 - uDefocus);
    vPx = px;
  }
`,xo=`
  precision highp float;
  ${Kt}
  ${Jt}
  varying float vAlpha;
  varying float vSeed;
  varying float vFoc;
  varying float vLens;
  varying float vLayer;
  varying float vPx;
  uniform float uAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    // Dust, not a drawing: a little softer than the objects, a little lighter.
    float a = stroke(uv, vSeed, max(vFoc * 0.7, vLens), vPx) * vAlpha * uAlpha;
    if (a < 0.004) discard;
    vec3 col = mix(GRAPHITE, GRAPHITE_LIGHT, 0.3 + 0.7 * step(0.8, fract(vSeed * 3.17)));
    col = mix(col, GRAPHITE_LIGHT, vLayer > 1.5 ? 0.6 : 0.0);
    col = mix(col, GRAPHITE_DEEP, vLens * 0.6);
    gl_FragColor = vec4(col, a);
  }
`,ot=be=>(.5-be)*window.innerHeight/m,At=()=>Math.min(window.innerWidth*.92,880)/2/m,yo=1.35;function Po({entered:be}){const nt=Je.useRef(null),at=Je.useRef(be);return at.current=be,Je.useEffect(()=>{const it=nt.current;if(!it)return;let st=!1;const v=w.reducedMotion,rt=Math.min(window.devicePixelRatio||1,2),N=Wt.prep==="fire",Me=tt+Pt,Se=new Float32Array(Me*3),lt=new Float32Array(Me),ct=new Float32Array(Me),De=[[ce,-12],[-12,-3],[-3,Ie],[-22,-5]];let k=0;for(let o=0;o<4;o++){const t=o===3?Pt:o===2?tt-k:Math.round(tt*io[o]);for(let p=0;p<t&&k<Me;p++,k++)Se[k*3]=(Math.random()-.5)*84,Se[k*3+1]=(Math.random()-.5)*52,Se[k*3+2]=De[o][0]+Math.random()*(De[o][1]-De[o][0]),lt[k]=Math.random(),ct[k]=o}const J=new Zt;J.setAttribute("position",new et(Se,3)),J.setAttribute("aSeed",new et(lt,1)),J.setAttribute("aLayer",new et(ct,1)),J.boundingSphere=new Vt(new M,1e4);const d={uSize:{value:c.size},uDpr:{value:rt},uLens:{value:0},uPointer:{value:new Ne(99,99)},uAlpha:{value:c.density},...Xt()};d.uDefocus.value=1;const V=new $t({vertexShader:vo,fragmentShader:xo,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{...d,uTime:{value:0},uRot:{value:0},uCamZ:{value:W},uCamXY:{value:new Ne},uMotion:{value:v?0:.15},uBreath:{value:0},uWake:{value:0},uFade:{value:0},uOrbit:{value:0},uCursorNdc:{value:new Ne(9,9)},uOrbitPx:{value:ke.capturePx},uRingPx:{value:ke.ringPx},uOrbitAng:{value:0},uTanHalf:{value:window.innerHeight/2/We},uAspect:{value:window.innerWidth/window.innerHeight},uViewH:{value:window.innerHeight}}}),C=new Gt,ut=new Yt(J,V);C.add(ut);const pt=o=>2*Math.atan(o/2/We)*180/Math.PI,f=new qt(pt(window.innerHeight),window.innerWidth/window.innerHeight,.1,200);f.position.set(0,0,W);let Pe=f.fov,He=f.fov;const I=new jt({alpha:!0,antialias:!1,powerPreference:"high-performance"});I.setPixelRatio(rt),I.setClearColor(0,0),it.appendChild(I.domElement);const Be=()=>{I.setSize(window.innerWidth,window.innerHeight),f.aspect=window.innerWidth/window.innerHeight,Pe=pt(window.innerHeight),He=Pe,f.fov=Pe,f.updateProjectionMatrix(),V.uniforms.uTanHalf.value=window.innerHeight/2/We,V.uniforms.uAspect.value=f.aspect,V.uniforms.uViewH.value=window.innerHeight};Be(),window.addEventListener("resize",Be);const D=Qt(),a=N?null:wt(d,D,{count:y.count,scale:y.scale,surveillance:!0,phagocytosis:!0,motility:c.motility,tempo:c.tempo,reach:c.reach});a&&(a.group.position.set(7.4,-.9,y.z),a.reveal=0,C.add(a.group));const dt=new M(7.4,-.9,y.z);let Ze=y.scale;const Ee=(o,t)=>{let p=0,b=0,r=o;for(;r&&r!==t;)p+=r.offsetLeft,b+=r.offsetTop,r=r.offsetParent;return{x:p,y:b}},Lt=()=>{const o=document.querySelector("[data-name-edge]"),t=document.querySelector("[data-masthead]"),p=document.querySelector("[data-lede]"),b=(t==null?void 0:t.closest(".plane"))??null;if(!o||!t||!b)return;const r=window.innerWidth,L=window.innerHeight,T=(r-b.offsetWidth)/2,F=(L-b.offsetHeight)/2,_=Ee(o,b),te=Ee(t,b),oe=T+_.x+o.offsetWidth,ne=F+te.y+t.offsetHeight*.5,Oe=T+b.offsetWidth,_e=p?T+Ee(p,b).x+p.offsetWidth:0,he=.3*y.scaleMax*m,j=Math.max(oe+y.gapPx+he,_e+y.gapPx),ae=r-j,Re=Math.max(60,Math.min(ae*1.15/2,L*.42,(L-y.headerPx)/2-8));Ze=Math.min(y.scaleMax,Math.max(y.scaleMin,Re/(D.bound*m)));const h=D.bound*Ze*m,ge=Math.max(j+h,Math.min((j+r)/2,Oe+.2*h-h)),ze=Math.max(L*.5+(ne-L*.5)*.25,y.headerPx+h);dt.set((ge-r/2)/m,(L/2-ze)/m,y.z)},l=N?null:eo(d,5),Ve=new M(9,1,le.z);l&&(l.group.position.copy(Ve),l.group.visible=!1,C.add(l.group));const Tt=()=>{const o=document.querySelector(".contact-centre"),t=(o==null?void 0:o.closest(".plane"))??null;if(!l||!o||!t)return;const p=window.innerWidth,b=window.innerHeight,r=(p-t.offsetWidth)/2,L=.13*b,T=Ee(o,t),F=r+T.x+o.offsetWidth,_=r+t.offsetWidth,te=(F+_)/2,oe=L+T.y+o.offsetHeight/2,ne=Math.max(le.minPx,Math.min(le.maxPx,(_-F)/2-le.gapPx));Ve.set((te-p/2)/m,(b/2-oe)/m,le.z),l.group.scale.setScalar(ne/m)},S=N?null:wt(d,D,{count:re.count,scale:re.scale,surveillance:!1,seed:2,atp:!0,motility:c.motility,tempo:c.tempo}),A=N?to(d,2):null,x=S?S.group:new Ut;A&&(x.scale.setScalar(re.scale),x.add(A.points)),C.add(x);const pe=oo(x,f,()=>e.sheet<.5?D.bound*x.scale.x*1.2:0,o=>{S?S.stimulate(o,{instant:v}):(v||A==null||A.start(o),Ct.stimulatedAt=performance.now())}),u=bt(d,"research",{channel:!N});u.group.rotation.x=0,u.group.scale.setScalar(we.scale),C.add(u.group);const i=N?null:bt(d,"methods");i&&(i.group.rotation.x=R.tilt,i.group.scale.setScalar(R.scale),C.add(i.group));const s=N?null:no(d,"/cv-vorschau/design/");s&&(s.group.position.set(-5,-4,R.z),C.add(s.group));const P=s?Mt(s.group,f,()=>s.hoverEnabled?s.group.scale.x*m*1.1:0,{tilt:!1}):null,ft=new M(-5,-4,R.z);let $e=3;const Ot=new M(0,-3,0),_t=16,Rt=-3*ue-ue/2,Ae=new M,Le=new M,de=new M,Ge=()=>{Ae.set(we.x,ot(we.top),we.z),Le.set(R.x,ot(R.top),R.z),de.set(re.x,ot(re.top),re.z),u.group.position.copy(Ae),i==null||i.group.position.copy(Le),x.position.copy(de)};Ge(),window.addEventListener("resize",Ge);const Q=Mt(u.group,f,()=>3.3*u.group.scale.x*m*1.2),$=a?ye(d,1):null,G=S?ye(d,2):null,Te=ye(d,3),Y=i?ye(d,4):null,q=l?ye(d,5):null;for(const o of[$,G,Te,Y,q])o&&C.add(o.points);const fe=new M;(location.search.includes("debug")||location.search.includes("tune"))&&(window.__atmos={u:V.uniforms,renderer:I,camera:f,prep:N?"fire":"wildtype",channel:u.group,methodsChannel:(i==null?void 0:i.group)??null,heroCell:a,aboutCell:S,emblem:l,puff:A,umap:(s==null?void 0:s.group)??null,stimulateAbout:(o,t)=>{const p=pe.onScreen();return!!p&&pe.at(o??p.x,t??p.y)},aboutOnScreen:()=>pe.onScreen()});let Ye=document.hidden,qe=performance.now(),ht=0;const B={x:0,y:0},z={x:99,y:99},gt=new Ne,je=new M().copy(St),E=V.uniforms;let mt=`${c.motility}|${c.tempo}|${c.reach}`;const ee=new M;let Ue=0,vt=0;const zt=o=>{if(Ye||st)return;const t=Math.min((o-qe)/1e3,.05);qe=o;const p=o/1e3;Nt(o);const b=(v?0:at.current?1:.15)*(1-.6*e.sheet);E.uMotion.value=X(E.uMotion.value,b,1.2,t);const r=E.uMotion.value;ht+=t*c.rotation*r;const L=kt(e.station,e.flight);B.x=v?0:X(B.x,w.pointer.x*.5,2,t),B.y=v?0:X(B.y,w.pointer.y*.35,2,t);const T=B.x+L.x,F=B.y+L.y,_=e.enteredAt==null?-1:(o-e.enteredAt)/1e3,te=e.gate&&!v,oe=_<0?0:te?K(0,1,_/1.6):1;d.uDefocus.value=1-oe,e.push=.8*(1-oe),f.position.set(T,F,e.camZ+e.push),f.rotation.z=L.roll;const ne=Pe+(v?0:It*Dt(e.flight));if(ne!==He&&(He=ne,f.fov=He,f.updateProjectionMatrix()),E.uTime.value=p,E.uRot.value=ht,E.uCamZ.value=e.camZ+e.push,E.uCamXY.value.set(T,F),E.uBreath.value=v?0:c.breath,E.uWake.value=v?0:c.wake,d.uSize.value=c.size,d.uAlpha.value=c.density*(1-.7*e.sheet),d.uLens.value=!v&&c.lens&&w.pointerSeen?1:0,w.pointerSeen&&!v?je.set(w.pointer.x*.9,w.pointer.y*.8+.35,.7).normalize():je.copy(St),d.uLight.value.lerp(je,1-Math.exp(-2.5*t)).normalize(),w.pointerSeen){const n=window.innerHeight/2/We*W,g=T+w.pointer.x*n*f.aspect,H=F+w.pointer.y*n;z.x=z.x===99?g:X(z.x,g,3.5,t),z.y=z.y===99?H:X(z.y,H,3.5,t),d.uPointer.value.set(z.x,z.y),gt.set(z.x,z.y)}const Oe=Bt(e.camZ);E.uFade.value=1-Oe,ut.visible=Oe>.005;let _e=!1;if(a!=null&&a.group.visible&&w.pointerSeen&&e.station===0&&e.flight===0){ee.copy(a.group.position).project(f);const n=(ee.x*.5+.5)*window.innerWidth,g=(-ee.y*.5+.5)*window.innerHeight;_e=Math.hypot(O.px-n,O.py-g)<D.bound*a.group.scale.x*m*.75}const he=O.px,j=O.py;ie.object=_e||Q.isOver(he,j)||!!(P!=null&&P.isOver(he,j)),ie.dragging=Q.active||!!(P!=null&&P.active);const ae=O.visible?pe.onScreen():null;ie.drop=!!ae&&Math.hypot(he-ae.x,j-ae.y)<ae.r,ie.hero=_>=0&&e.station===0&&e.flight===0&&O.visible&&O.py>y.headerPx*.75&&e.sheet<.5,Ue=X(Ue,ie.hero&&!v&&O.active?1:0,ke.ease,t),vt+=t*ke.spin*r,E.uOrbit.value=Ue,E.uOrbitAng.value=vt,E.uCursorNdc.value.set(O.x/window.innerWidth*2-1,-(O.y/window.innerHeight*2-1));const Re=`${c.motility}|${c.tempo}|${c.reach}`;Re!==mt&&(mt=Re,a==null||a.setMotility({motility:c.motility,tempo:c.tempo,reach:c.reach}),S==null||S.setMotility({motility:c.motility,tempo:c.tempo}));const h=n=>Math.abs(e.camZ-n.position.z-W),ge=(n,g,H,me)=>H.position.copy(n).addScaledVector(g,1-Qe(e.camZ-n.z,me)),ze=n=>1-Math.min(1,Math.max(0,e.camZ-n.position.z-W)/uo);if(a){if(a.reveal=_>=0?1:0,a.draw=_<0?0:te?K(0,1,(_-.5)/1.2):1,a.group.visible=h(a.group)<se&&a.draw>.001,e.station===0&&(Lt(),a.group.position.copy(dt),a.group.scale.setScalar(Ze)),a.group.visible){a.group.rotation.y=p*.15*r+B.x*.3,a.group.rotation.x=-.1+B.y*.18;const n=1-K(2.5,9,Math.abs(e.camZ-y.z));a.maxPx=y.maxPx+(mo-y.maxPx)*n,a.update(t,r,w.pointerSeen&&!v?gt:null,c.activation)}if($){const n=D.bound*a.group.scale.x*.62;$.place(fe.copy(a.group.position),n,n),$.update(a.group.visible?a.reveal*(1-Math.min(1,h(a.group)/10)):0)}}ge(de,so,x);const Xe=e.station===1?K(0,.12,e.flight):0;if(x.position.y+=e.pan/m*(1-Xe)+(Ht.y-de.y)*Xe,x.position.x+=(Ht.x-de.x)*Xe,x.visible=h(x)<se,x.visible)if(x.rotation.y=p*.1*r+.6,S){const n=K(Et[0],Et[1],w.acts.cell);S.update(t,r,null,Math.max(n,c.activation))}else A==null||A.update(t,r,1);if(G){const n=D.bound*x.scale.x*.62;G.place(fe.copy(x.position),n,n),G.update(x.visible?1-Math.min(1,h(x)/10):0)}const Fe=e.sheet;if(ge(Ae,ro,u.group,lo),u.group.position.x+=(At()+3.3*we.scale+.4-Ae.x)*Fe,u.group.visible=h(u.group)<se,u.group.visible){const n=1-Math.min(1,h(u.group)/10);Q.active||(u.group.rotation.y+=t*(.38*r+Q.spin),Q.spin*=Math.pow(.03,t)),u.ionBoost=1+(go-1)*(e.station===1?Math.sin(Math.PI*e.flight):0),u.update(t,r,n,ze(u.group))}{const n=3.3*u.group.scale.x;Te.place(fe.copy(u.group.position).setY(u.group.position.y-n*.25),n*.95,n*.42),Te.update(u.group.visible?1-Math.min(1,h(u.group)/10):0)}if(i){const n=e.station===2?Math.sin(Math.PI*e.flight):0,g=R.scale*(1+(yo-1)*Fe)+(fo-R.scale)*n;if(i.group.scale.setScalar(g),ge(Le,co,i.group),i.group.position.x+=(At()+3.3*g+.3-Le.x)*Fe,i.group.position.y+=(e.station===3?e.pan/m:0)*(1-Fe),i.group.visible=h(i.group)<se,i.group.visible){const H=1-Math.min(1,h(i.group)/10);i.group.rotation.x=R.tilt+(po-R.tilt)*n,i.ionBoost=1+(ho-1)*n,i.group.rotation.y+=t*.3*r,i.update(t,r,H,ze(i.group))}if(Y){const H=3.3*i.group.scale.x;Y.place(fe.copy(i.group.position).setY(i.group.position.y-H*.3),H*.95,H*.45),Y.update(i.group.visible?1-Math.min(1,h(i.group)/10):0)}}let yt=!1;if(l){const n=e.station>=4;if(l.group.visible=n&&h(l.group)<se,l.group.visible){Tt(),l.group.position.copy(Ve),l.group.position.y+=e.station===5?e.pan/m:0,l.draw=v?1:Qe(e.camZ-le.z),l.group.rotation.y=p*.12*r;let g=null;if(w.pointerSeen&&!v&&e.sheet<.5){ee.copy(l.group.position).project(f);const H=(ee.x*.5+.5)*window.innerWidth,me=(-ee.y*.5+.5)*window.innerHeight,ve=l.group.scale.x*m*ao,xe=(O.px-H)/ve,Z=(O.py-me)/ve;Math.hypot(xe,Z)<1&&(g={x:xe,y:Z},yt=!0)}l.update(t,r,1-.6*Math.min(1,h(l.group)/30),g)}if(q){const g=l.group.scale.x*.9;q.place(fe.copy(l.group.position),g,g*.8),q.update(l.group.visible?l.draw*(1-Math.min(1,h(l.group)/10)):0)}}if(yt&&(ie.object=!0),s&&P){const n=-3*ue,g=e.camZ-n,H=Math.abs(g-W)<6&&e.station===3&&e.flight===0,me=e.station===2&&e.flight>0&&g<=36,ve=document.getElementById("umap-anchor");if((H||me)&&ve){const U=ve.getBoundingClientRect();if(U.height>10){const Ke=m*W/g;ft.set(T+(U.left+U.width/2-window.innerWidth/2)/Ke,F+(window.innerHeight/2-(U.top+U.height/2))/Ke,n),$e=Math.min(U.width,U.height)/2/Ke*.95}}const xe=e.station===3&&e.flight>0?e.flight:0,Z=K(0,.4,xe);s.group.position.copy(ft).addScaledVector(Ot,1-Qe(e.camZ-n)),s.group.position.lerp(new M(T*.3,F,Rt),Z),s.group.scale.setScalar($e+(_t-$e)*Z),s.maxPx=9+13*Z,s.reveal=X(s.reveal,s.ready?1-K(.8,1,xe):0,2.5,t),s.hoverEnabled=Z<.05&&e.sheet<.5,s.labelsEnabled=Z<.3&&e.sheet<.5,s.group.visible=s.ready&&h(s.group)<se&&s.reveal>.01,s.group.visible?(P.active||(s.group.rotation.y+=t*P.spin,P.spin*=Math.pow(.03,t)),s.update(t,r,f,w.pointerSeen?w.pointer:null,!P.active&&!v)):(Ce.labels.length||Ce.hover)&&(Ce.labels=[],Ce.hover=null)}I.render(C,f)},xt=()=>{Ye=document.hidden,Ye||(qe=performance.now())};return document.addEventListener("visibilitychange",xt),e.tick=zt,()=>{st=!0,e.tick=null,document.removeEventListener("visibilitychange",xt),window.removeEventListener("resize",Be),window.removeEventListener("resize",Ge),Q.dispose(),P==null||P.dispose(),pe.dispose(),$==null||$.dispose(),G==null||G.dispose(),Te.dispose(),Y==null||Y.dispose(),q==null||q.dispose(),l==null||l.dispose(),s==null||s.dispose(),u.dispose(),i==null||i.dispose(),a==null||a.dispose(),S==null||S.dispose(),A==null||A.dispose(),J.dispose(),V.dispose(),I.dispose(),I.domElement.remove()}},[]),Ft.jsx("div",{ref:nt,className:"atmos fixed inset-0 z-0 pointer-events-none","aria-hidden":"true"})}export{Po as default};
