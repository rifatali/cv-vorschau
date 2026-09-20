import{r as Ze,t as u,D as A,O as Mt,G as Ye,g as Dt,H as L,j as It,s as v,b as Nt,P as Et,f as ne,K as m,h as e,a as $t,d as Q,p as Bt,F as Vt,i as Zt,k as Yt,l as Ut,z as jt,e as ee,m as qt,n as Xt,T as Ue,o as Kt,q as je,u as He,v as de,w as qe,x as Jt,y as Qt,A as eo,B as to,C as oo}from"./index-BNzWs8Dg.js";import{B as ao,a as Xe,S as so,V as x,b as no,c as Pe,f as io,d as ro,P as lo,e as co,W as uo,G as po}from"./three-BH243BCb.js";import{m as ho,P as fo,S as mo,b as Lt,d as go,a as vo,g as yo,c as At,e as xo,h as zt,f as he,L as Ht,E as wo}from"./UmapCloud-mXpXNVPJ.js";import"./motion-BCXewYul.js";const Ke=3e4,bo=[.64,.33,.03],Pt=18e3,se=-34,_e=2,te=28,oe={x:8.4,top:.2,z:-40,scale:1,count:14e3},So=new x(0,2,0),fe={x:9.6,top:.2,z:-2*ne,scale:.85},Mo=new x(6,3,0),Eo=44,R={x:-1.8,top:.215,z:-3*ne,scale:.4,tilt:.35},Lo=new x(.6,.8,0),Ao=40,_t={x:6,y:2},zo=-.9,Ho=1,Po=2.4,_o=2.8,Oo=22,Ot=[.34,.5],ae={z:-5*ne,minPx:110,maxPx:160,gapPx:16},To=`
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
  uniform vec4 uOcular;        // the eyepiece: centre (CSS px, y from the bottom), radius, and 0..1 how far the mask is on
  uniform vec2 uView;          // the window, CSS px
  uniform float uGlass;        // the glass of the eyepiece, 0..1 (praeparat/ocular.ts)
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
    float L = ${(_e-se).toFixed(1)};
    float rel = mod(position.z - uCamZ - (${se.toFixed(1)}), L) + (${se.toFixed(1)});
    float relPre = rel;

    // The cloud circles a point in front of you — at the plane in focus — the
    // way the very first version did, its far layer slower than its near one; the dust (layer 3) between them.
    float speed = layer < 0.5 ? 0.5 : (layer < 1.5 ? 1.0 : (layer < 2.5 ? 1.25 : 0.75));
    float ang = uRot * speed;
    vec2 q = vec2(p.x - uCamXY.x, rel + ${A.toFixed(1)});
    float c = cos(ang), s = sin(ang);
    q = vec2(q.x * c + q.y * s, -q.x * s + q.y * c);
    p.x = q.x + uCamXY.x;
    rel = q.y - ${A.toFixed(1)};
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

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // Through the glass of the eyepiece (praeparat/ocular.ts, GLASS) the field bulges a little toward the rim —
    // barrel distortion: nothing in the middle, a few px at the edge, the mask's edge staying where the circle is
    // (the fragment reads its own place) — and curves: from 60 % of the radius out the points grow, pale and
    // soften as under uDefocus, to a share of 0.7 at the rim. Only the middle stands, as through a simple ocular.
    float curv = 0.0;
    if (uGlass > 0.0 && uOcular.w > 0.0 && gl_Position.w > 0.0) {
      vec2 sc = (gl_Position.xy / gl_Position.w * 0.5 + 0.5) * uView;
      vec2 rd = sc - uOcular.xy;
      float rr = length(rd) / max(uOcular.z, 1.0);
      curv = smoothstep(${Ye.curveFrom.toFixed(2)}, 1.0, rr) * uGlass;
      sc += rd * (${Ye.barrel.toFixed(3)} * uGlass * rr * rr);
      gl_Position.xy = (sc / uView * 2.0 - 1.0) * gl_Position.w;
    }
    float defocus = uDefocus + curv * ${Ye.curveShare.toFixed(2)};

    float dist = -mv.z;
    // One lens for everything: sharp at the focus distance, soft away from it.
    float foc = 1.0 - smoothstep(0.0, 15.0, abs(dist - ${A.toFixed(1)}));
    float lens = smoothstep(4.4, 0.0, dist2) * uLens;

    float persp = 300.0 / max(dist, 1.0);
    float base = 0.7 + 0.8 * fract(aSeed * 7.31);
    // The dust is the smallest grain of all.
    float layerSize = layer < 0.5 ? 0.8 : (layer < 1.5 ? 1.15 : (layer < 2.5 ? 2.4 : 0.7));
    // Out of focus a stroke grows to a soft disc; the near layer, close to the lens, to a larger and paler one
    // (bokeh, capped — modestly, the big discs of the first round read as noise — its alpha divided by its area so
    // the discs never pile up into blots).
    float near = step(1.5, layer) * (1.0 - step(2.5, layer));
    float bokeh = 1.0 + (1.0 - foc) * (0.8 + 0.9 * near) + defocus * (1.2 + 0.8 * near);
    float cap = mix(12.0, 20.0, near);
    float px = clamp(uSize * uDpr * base * layerSize * persp * 0.05 * bokeh, 0.75, cap * uDpr);
    gl_PointSize = px;

    float breath = 1.0 - uBreath * 0.22 * (0.5 + 0.5 * sin(p.x * 0.22 + p.y * 0.17 + uTime * 0.045));
    float seam = smoothstep(${se.toFixed(1)}, ${(se+4).toFixed(1)}, relPre) * (1.0 - smoothstep(${(_e-2.5).toFixed(1)}, ${_e.toFixed(1)}, relPre));
    float layerAlpha = layer < 0.5 ? 0.34 : (layer < 1.5 ? 0.48 : (layer < 2.5 ? 0.30 : 0.28));
    // The pale grows with the disc: the growth beyond the old soft look is paid for by area.
    float grew = bokeh / (1.0 + (1.0 - foc) * 0.8);
    float a = layerAlpha * (0.30 + 0.70 * foc) * breath * seam / (grew * grew);
    a = mix(a * (1.0 - 0.25 * uLens), a * 1.7, lens);
    vAlpha = a * (1.0 - uFade);
    vSeed = aSeed;
    vLayer = layer;
    vLens = lens;
    vFoc = foc * (1.0 - min(1.0, defocus));
    vPx = px;
  }
`,Ro=`
  precision highp float;
  ${fo}
  ${mo}
  varying float vAlpha;
  varying float vSeed;
  varying float vFoc;
  varying float vLens;
  varying float vLayer;
  varying float vPx;
  uniform float uAlpha;
  uniform float uDpr;
  uniform vec4 uOcular;        // the eyepiece: centre (CSS px, y from the bottom), radius, and 0..1 how far the mask is on

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    // Dust, not a drawing: a little softer than the objects, a little lighter.
    float a = stroke(uv, vSeed, max(vFoc * 0.7, vLens), vPx) * vAlpha * uAlpha;
    // Through the eyepiece the field is only seen inside the circle (an edge of ${Mt.toFixed(1)} px); outside the paper stays clean.
    if (uOcular.w > 0.0) {
      float d = distance(gl_FragCoord.xy / uDpr, uOcular.xy);
      a *= mix(1.0, smoothstep(uOcular.z, uOcular.z - ${Mt.toFixed(1)}, d), uOcular.w);
    }
    if (a < 0.004) discard;
    vec3 col = mix(GRAPHITE, GRAPHITE_LIGHT, 0.3 + 0.7 * step(0.8, fract(vSeed * 3.17)));
    col = mix(col, GRAPHITE_LIGHT, vLayer > 1.5 ? 0.6 : 0.0);
    col = mix(col, GRAPHITE_DEEP, vLens * 0.6);
    gl_FragColor = vec4(col, a);
  }
`,Je=me=>(.5-me)*window.innerHeight/m,Tt=()=>Math.min(window.innerWidth*.92,880)/2/m,Fo=1.35;function Do({entered:me}){const Qe=Ze.useRef(null),et=Ze.useRef(me);return et.current=me,Ze.useEffect(()=>{const tt=Qe.current;if(!tt)return;let ot=!1;const g=v.reducedMotion,at=Math.min(window.devicePixelRatio||1,2),G=Nt.prep==="fire",ge=Ke+Pt,ve=new Float32Array(ge*3),st=new Float32Array(ge),nt=new Float32Array(ge),Oe=[[se,-12],[-12,-3],[-3,_e],[-22,-5]];let k=0;for(let a=0;a<4;a++){const n=a===3?Pt:a===2?Ke-k:Math.round(Ke*bo[a]);for(let H=0;H<n&&k<ge;H++,k++)ve[k*3]=(Math.random()-.5)*84,ve[k*3+1]=(Math.random()-.5)*52,ve[k*3+2]=Oe[a][0]+Math.random()*(Oe[a][1]-Oe[a][0]),st[k]=Math.random(),nt[k]=a}const j=new ao;j.setAttribute("position",new Xe(ve,3)),j.setAttribute("aSeed",new Xe(st,1)),j.setAttribute("aLayer",new Xe(nt,1)),j.boundingSphere=new so(new x,1e4);const h={uSize:{value:u.size},uDpr:{value:at},uLens:{value:0},uPointer:{value:new Pe(99,99)},uAlpha:{value:u.density},...ho()};h.uDefocus.value=1;const ye=new no({vertexShader:To,fragmentShader:Ro,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{...h,uTime:{value:0},uRot:{value:0},uCamZ:{value:A},uCamXY:{value:new Pe},uMotion:{value:g?0:.15},uBreath:{value:0},uWake:{value:0},uFade:{value:0},uOcular:{value:new io(0,0,1,0)},uView:{value:new Pe(window.innerWidth,window.innerHeight)},uGlass:{value:0}}}),C=new ro,it=new lo(j,ye);C.add(it);const rt=a=>2*Math.atan(a/2/Et)*180/Math.PI,p=new co(rt(window.innerHeight),window.innerWidth/window.innerHeight,.1,200);p.position.set(0,0,A);let xe=p.fov,we=p.fov;const D=new uo({alpha:!0,antialias:!1,powerPreference:"high-performance"});D.setPixelRatio(at),D.setClearColor(0,0),tt.appendChild(D.domElement);const Te=()=>{D.setSize(window.innerWidth,window.innerHeight),p.aspect=window.innerWidth/window.innerHeight,xe=rt(window.innerHeight),we=xe,p.fov=xe,p.updateProjectionMatrix()};Te(),window.addEventListener("resize",Te);const O=Dt(),o=G?null:Lt(h,O,{count:L.count,scale:L.scale,surveillance:!0,phagocytosis:!0,motility:u.motility,tempo:u.tempo,reach:u.reach});o&&(o.group.position.set(7.4,-.9,L.z),C.add(o.group));const ie=new x(7.4,-.9,L.z);let re=L.scale;const Rt=()=>{const a=Qt();if(!a)return;const n=eo(a,O.bound);re=n.scale,ie.set((n.cx-a.W/2)/m,(a.H/2-n.cy)/m,L.z)},Re=new x;e.heroOnScreen=o?()=>{const a=p.position.z-L.z;return a<=.1||!o.group.visible?null:(Re.copy(o.group.position).project(p),{x:(Re.x*.5+.5)*window.innerWidth,y:(-Re.y*.5+.5)*window.innerHeight,r:O.bound*o.group.scale.x*m*A/a})}:null;let lt=0;const ct=location.search.includes("debug");ct&&(e.zoomLog=[]);const l=G?null:go(h,5),Fe=new x(9,1,ae.z);l&&(l.group.position.copy(Fe),l.group.visible=!1,C.add(l.group));const Ft=()=>{const a=document.querySelector(".contact-centre"),n=(a==null?void 0:a.closest(".plane"))??null;if(!l||!a||!n)return;const H=window.innerWidth,Ee=window.innerHeight,b=(H-n.offsetWidth)/2,pe=.13*Ee,P=to(a,n),K=b+P.x+a.offsetWidth,y=b+n.offsetWidth,Ie=(K+y)/2,J=pe+P.y+a.offsetHeight/2,Le=Math.max(ae.minPx,Math.min(ae.maxPx,(y-K)/2-ae.gapPx));Fe.set((Ie-H/2)/m,(Ee/2-J)/m,ae.z),l.group.scale.setScalar(Le/m)},S=G?null:Lt(h,O,{count:oe.count,scale:oe.scale,surveillance:!1,seed:2,atp:!0,motility:u.motility,tempo:u.tempo}),z=G?vo(h,2):null,f=S?S.group:new po;z&&(f.scale.setScalar(oe.scale),f.add(z.points)),C.add(f);const le=yo(f,p,()=>e.sheet<.5?O.bound*f.scale.x*1.2:0,(a,n)=>{S?S.stimulate(a,{instant:g,normal:n}):(g||z==null||z.start(a),$t.stimulatedAt=performance.now())}),d=At(h,"research",{channel:!G});d.group.rotation.x=0,d.group.scale.setScalar(fe.scale),C.add(d.group);const i=G?null:At(h,"methods");i&&(i.group.rotation.x=R.tilt,i.group.scale.setScalar(R.scale),C.add(i.group));const r=G?null:xo(h,"/cv-vorschau/design/");r&&(r.group.position.set(-5,-4,R.z),C.add(r.group));const M=r?zt(r.group,p,()=>r.hoverEnabled?r.group.scale.x*m*1.1:0,{tilt:!1}):null,ut=new x(-5,-4,R.z);let We=3;const Wt=new x(0,-3,0),Ct=16,Gt=-3*ne-ne/2,be=new x,Se=new x,ce=new x,Ce=()=>{be.set(fe.x,Je(fe.top),fe.z),Se.set(R.x,Je(R.top),R.z),ce.set(oe.x,Je(oe.top),oe.z),d.group.position.copy(be),i==null||i.group.position.copy(Se),f.position.copy(ce)};Ce(),window.addEventListener("resize",Ce);const q=zt(d.group,p,()=>3.3*d.group.scale.x*m*1.2),N=o?he(h,1):null,$=S?he(h,2):null,Me=he(h,3),B=i?he(h,4):null,V=l?he(h,5):null;for(const a of[N,$,Me,B,V])a&&C.add(a.points);const ue=new x;(location.search.includes("debug")||location.search.includes("tune"))&&(window.__atmos={u:ye.uniforms,renderer:D,camera:p,prep:G?"fire":"wildtype",channel:d.group,methodsChannel:(i==null?void 0:i.group)??null,heroCell:o,aboutCell:S,emblem:l,puff:z,umap:(r==null?void 0:r.group)??null,stimulateAbout:(a,n)=>{const H=le.onScreen();return!!H&&le.at(a??H.x,n??H.y)},aboutOnScreen:()=>le.onScreen()});let Ge=document.hidden,ke=performance.now(),pt=0;const I={x:0,y:0},F={x:99,y:99},dt=new Pe,De=new x().copy(Ht),w=ye.uniforms;let ht=`${u.motility}|${u.tempo}|${u.reach}`;const X=new x,kt=a=>{var bt,St;if(Ge||ot)return;const n=Math.min((a-ke)/1e3,.05);ke=a;const H=a/1e3,Ee=(g?0:et.current?1:.15)*(1-.6*e.sheet);w.uMotion.value=Q(w.uMotion.value,Ee,1.2,n);const b=w.uMotion.value;pt+=n*u.rotation*b;const pe=e.enteredAt==null?-1:(a-e.enteredAt)/1e3,P=e.gate&&!g,K=e.zoomAt,y=!P||pe<0||K==null?-1:a-K,Ie=P?y<0?0:oo(a,K):1,J=!P||y>=Ue.landed,Le=pe<0?0:Ie;h.uDefocus.value=1-Le,e.push=.8*(1-Le);const Ne=Bt(e.station,e.flight),mt=J?1:0;I.x=g?0:Q(I.x,v.pointer.x*.5*mt,2,n),I.y=g?0:Q(I.y,v.pointer.y*.35*mt,2,n);const Z=I.x+Ne.x,Y=I.y+Ne.y;p.position.set(Z,Y,e.camZ+e.push),p.rotation.z=Ne.roll,p.updateMatrixWorld();const gt=xe+(g?0:Vt*Zt(e.flight));if(gt!==we&&(we=gt,p.fov=we,p.updateProjectionMatrix()),w.uTime.value=H,w.uRot.value=pt,w.uCamZ.value=e.camZ+e.push,w.uCamXY.value.set(Z,Y),w.uBreath.value=g?0:u.breath,w.uWake.value=g?0:u.wake,h.uSize.value=u.size,h.uAlpha.value=u.density*(1-.7*e.sheet),h.uLens.value=!g&&u.lens&&v.pointerSeen?1:0,v.pointerSeen&&!g?De.set(v.pointer.x*.9,v.pointer.y*.8+.35,.7).normalize():De.copy(Ht),h.uLight.value.lerp(De,1-Math.exp(-2.5*n)).normalize(),v.pointerSeen){const t=window.innerHeight/2/Et*A,s=Z+v.pointer.x*t*p.aspect,c=Y+v.pointer.y*t;F.x=F.x===99?s:Q(F.x,s,3.5,n),F.y=F.y===99?c:Q(F.y,c,3.5,n),h.uPointer.value.set(F.x,F.y),dt.set(F.x,F.y)}const vt=Yt(e.camZ);w.uFade.value=1-vt,it.visible=vt>.005;let yt=!1;const xt=`${u.motility}|${u.tempo}|${u.reach}`;xt!==ht&&(ht=xt,o==null||o.setMotility({motility:u.motility,tempo:u.tempo,reach:u.reach}),S==null||S.setMotility({motility:u.motility,tempo:u.tempo}));const E=t=>Math.abs(e.camZ-t.position.z-A),$e=(t,s,c,W)=>c.position.copy(t).addScaledVector(s,1-je(e.camZ-t.z,W)),wt=t=>1-Math.min(1,Math.max(0,e.camZ-t.position.z-A)/Ao);{const t=e.ocular,s=y<0?0:Ut(y);if(P&&t&&s<1){const c=jt(t.layout,s);w.uOcular.value.set(c.x,window.innerHeight-c.y,c.R,1-ee(.75,1,s)),w.uGlass.value=qt(a,s),w.uView.value.set(window.innerWidth,window.innerHeight)}else w.uOcular.value.w=0,w.uGlass.value=0}if(o){if(o.reveal=1,o.draw=P?y<0?0:Xt(y):1,o.group.visible=E(o.group)<te&&(!P||y>=Ue.draw[0]),e.station===0){Rt();const t=e.ocular;if(P&&!J&&(t!=null&&t.symbolGate)){const s=window.innerWidth,c=window.innerHeight,W=p.position.z-L.z,_=m*A/W,ze={x:s/2+(ie.x-Z)*_,y:c/2-(ie.y-Y)*_,somaR:O.soma*re*_},T=y<0?null:Kt(y,t.symbolGate,ze);e.symbol=T,T?(o.group.position.set(Z+(T.x-s/2)/_,Y+(c/2-T.y)/_,L.z),o.group.scale.setScalar(T.bodyR/(O.soma*_))):(o.group.position.copy(ie),o.group.scale.setScalar(re)),o.magnify=o.group.scale.x/re,o.defocusShare=0}else e.symbol=null,o.group.position.copy(ie),o.group.scale.setScalar(re),o.magnify=1,o.defocusShare=P?0:1}if(o.hunger=P?y>=Ue.hunger?1:0:pe>=0?1:0,o.group.visible){J&&(lt+=n*.15*b),o.group.rotation.y=lt+I.x*.3,o.group.rotation.x=-.1+I.y*.18;const t=1-ee(2.5,9,Math.abs(e.camZ-L.z));o.maxPx=L.maxPx+(Oo-L.maxPx)*t;const s=g?0:Math.max(b,1-.6*e.sheet);o.update(n,s,J&&v.pointerSeen&&!g?dt:null,u.activation)}if(ct&&e.zoomLog&&y>=0&&y<=2500&&e.zoomLog.length<400){const t=e.symbol,s=o.group.visible?(St=(bt=e).heroOnScreen)==null?void 0:St.call(bt):null,c=p.position.z-L.z;e.zoomLog.push({t:y,symbol:t&&t.alpha>0?{x:t.x,y:t.y,bodyR:t.bodyR,size:t.size,alpha:t.alpha}:null,cell:s?{x:s.x,y:s.y,somaR:O.soma*o.group.scale.x*m*A/c}:null,draw:o.draw,push:e.push})}if(N){const t=O.bound*o.group.scale.x*.62;N.place(ue.copy(o.group.position),t,t),N.update(o.group.visible?o.reveal*o.draw*(1-Math.min(1,E(o.group)/10)):0)}}$e(ce,So,f);const Be=e.station===1?ee(0,.12,e.flight):0;if(f.position.y+=e.pan/m*(1-Be)+(_t.y-ce.y)*Be,f.position.x+=(_t.x-ce.x)*Be,f.visible=E(f)<te,f.visible)if(f.rotation.y=H*.1*b+.6,S){const t=ee(Ot[0],Ot[1],v.acts.cell);S.update(n,b,null,Math.max(t,u.activation))}else z==null||z.update(n,b,1);if($){const t=O.bound*f.scale.x*.62;$.place(ue.copy(f.position),t,t),$.update(f.visible?1-Math.min(1,E(f)/10):0)}const Ae=e.sheet;if($e(be,Mo,d.group,Eo),d.group.position.x+=(Tt()+3.3*fe.scale+.4-be.x)*Ae,d.group.visible=E(d.group)<te,d.group.visible){const t=1-Math.min(1,E(d.group)/10);q.active||(d.group.rotation.y+=n*(.38*b+q.spin),q.spin*=Math.pow(.03,n)),d.ionBoost=1+(_o-1)*(e.station===1?Math.sin(Math.PI*e.flight):0),d.update(n,b,t,wt(d.group))}{const t=3.3*d.group.scale.x;Me.place(ue.copy(d.group.position).setY(d.group.position.y-t*.25),t*.95,t*.42),Me.update(d.group.visible?1-Math.min(1,E(d.group)/10):0)}if(i){const t=e.station===2?Math.sin(Math.PI*e.flight):0,s=R.scale*(1+(Fo-1)*Ae)+(Ho-R.scale)*t;if(i.group.scale.setScalar(s),$e(Se,Lo,i.group),i.group.position.x+=(Tt()+3.3*s+.3-Se.x)*Ae,i.group.position.y+=(e.station===3?e.pan/m:0)*(1-Ae),i.group.visible=E(i.group)<te,i.group.visible){const c=1-Math.min(1,E(i.group)/10);i.group.rotation.x=R.tilt+(zo-R.tilt)*t,i.ionBoost=1+(Po-1)*t,i.group.rotation.y+=n*.3*b,i.update(n,b,c,wt(i.group))}if(B){const c=3.3*i.group.scale.x;B.place(ue.copy(i.group.position).setY(i.group.position.y-c*.3),c*.95,c*.45),B.update(i.group.visible?1-Math.min(1,E(i.group)/10):0)}}if(l){const t=e.station>=4;if(l.group.visible=t&&E(l.group)<te,l.group.visible){Ft(),l.group.position.copy(Fe),l.group.position.y+=e.station===5?e.pan/m:0,l.draw=g?1:je(e.camZ-ae.z);let s=null;if(v.pointerSeen&&!g&&e.sheet<.5){X.copy(l.group.position).project(p);const c=l.group.scale.x*m*wo,W=(v.pointer.x-X.x)*.5*window.innerWidth/c,_=(X.y-v.pointer.y)*.5*window.innerHeight/c;Math.hypot(W,_)<1&&(s={x:W,y:_})}l.update(n,b,1-.6*Math.min(1,E(l.group)/30),s),yt=!!s}if(V){const s=l.group.scale.x*.9;V.place(ue.copy(l.group.position),s,s*.8),V.update(l.group.visible?l.draw*(1-Math.min(1,E(l.group)/10)):0)}}if(r&&M){const t=-3*ne,s=e.camZ-t,c=Math.abs(s-A)<6&&e.station===3&&e.flight===0,W=e.station===2&&e.flight>0&&s<=36,_=document.getElementById("umap-anchor");if((c||W)&&_){const U=_.getBoundingClientRect();if(U.height>10){const Ve=m*A/s;ut.set(Z+(U.left+U.width/2-window.innerWidth/2)/Ve,Y+(window.innerHeight/2-(U.top+U.height/2))/Ve,t),We=Math.min(U.width,U.height)/2/Ve*.95}}const ze=e.station===3&&e.flight>0?e.flight:0,T=ee(0,.4,ze);r.group.position.copy(ut).addScaledVector(Wt,1-je(e.camZ-t)),r.group.position.lerp(new x(Z*.3,Y,Gt),T),r.group.scale.setScalar(We+(Ct-We)*T),r.maxPx=9+13*T,r.reveal=Q(r.reveal,r.ready?1-ee(.8,1,ze):0,2.5,n),r.hoverEnabled=T<.05&&e.sheet<.5,r.labelsEnabled=T<.3&&e.sheet<.5,r.group.visible=r.ready&&E(r.group)<te&&r.reveal>.01,r.group.visible?(M.active||(r.group.rotation.y+=n*M.spin,M.spin*=Math.pow(.03,n)),r.update(n,b,p,v.pointerSeen?v.pointer:null,!M.active&&!g)):(He.labels.length||He.hover)&&(He.labels=[],He.hover=null)}if(de.active){p.updateMatrixWorld();let t=!1;if(o!=null&&o.group.visible&&e.station===0&&e.flight===0&&e.sheet<.5){X.copy(o.group.position).project(p);const c=(X.x*.5+.5)*window.innerWidth,W=(-X.y*.5+.5)*window.innerHeight;t=Math.hypot(de.px-c,de.py-W)<O.bound*o.group.scale.x*m*.75}qe.object=t||q.hover||!!(M!=null&&M.hover)||yt,qe.dragging=q.active||!!(M!=null&&M.active);const s=f.visible?le.onScreen():null;qe.drop=!!s&&Math.hypot(de.px-s.x,de.py-s.y)<s.r,Jt(a)}D.render(C,p)},ft=()=>{Ge=document.hidden,Ge||(ke=performance.now())};return document.addEventListener("visibilitychange",ft),e.tick=kt,()=>{ot=!0,e.tick=null,e.heroOnScreen=null,e.symbol=null,document.removeEventListener("visibilitychange",ft),window.removeEventListener("resize",Te),window.removeEventListener("resize",Ce),q.dispose(),M==null||M.dispose(),le.dispose(),N==null||N.dispose(),$==null||$.dispose(),Me.dispose(),B==null||B.dispose(),V==null||V.dispose(),l==null||l.dispose(),r==null||r.dispose(),d.dispose(),i==null||i.dispose(),o==null||o.dispose(),S==null||S.dispose(),z==null||z.dispose(),j.dispose(),ye.dispose(),D.dispose(),D.domElement.remove()}},[]),It.jsx("div",{ref:Qe,className:"atmos fixed inset-0 z-0 pointer-events-none","aria-hidden":"true"})}export{Do as default};
