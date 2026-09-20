import{r as Xe,t as u,D as P,O as Ot,G as Ke,g as qt,H,f as e,j as Xt,s as v,b as Kt,P as Tt,K as x,d as D,p as Jt,F as Qt,h as eo,i as to,z as oo,e as ne,k as no,l as ao,T as Je,m as so,n as Qe,o as le,q as io,u as _e,v as ro,w as lo,x as co,y as uo,a as po,A as et,B as tt,C as ho}from"./index-BSd3L5X4.js";import{B as fo,a as ot,S as mo,V as b,b as go,c as Oe,f as yo,d as vo,P as xo,e as wo,W as bo,G as So}from"./three-BH243BCb.js";import{m as Eo,P as Mo,S as Lo,b as Rt,g as Ft,d as Ao,a as zo,c as Wt,e as Ho,h as Ct,f as me,L as Gt,W as kt,E as Po}from"./UmapCloud-DAPhtCBN.js";import"./motion-BCXewYul.js";const nt=3e4,_o=[.64,.33,.03],Dt=18e3,re=-34,Te=2,ae=28,se={x:8.4,top:.2,z:-40,scale:1,count:14e3},Oo=new b(0,2,0),ge={x:9.6,top:.2,z:-2*le,scale:.85},To=new b(6,3,0),Ro=44,W={x:-1.8,top:.215,z:-3*le,scale:.4,tilt:.35},Fo=new b(.6,.8,0),Wo=40,It={x:6,y:2},Co=-.9,Go=1,ko=2.4,Do=2.8,Io=22,Nt=[.34,.5],ie={z:-5*le,minPx:110,maxPx:160,gapPx:16},No=`
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
    float L = ${(Te-re).toFixed(1)};
    float rel = mod(position.z - uCamZ - (${re.toFixed(1)}), L) + (${re.toFixed(1)});
    float relPre = rel;

    // The cloud circles a point in front of you — at the plane in focus — the
    // way the very first version did, its far layer slower than its near one; the dust (layer 3) between them.
    float speed = layer < 0.5 ? 0.5 : (layer < 1.5 ? 1.0 : (layer < 2.5 ? 1.25 : 0.75));
    float ang = uRot * speed;
    vec2 q = vec2(p.x - uCamXY.x, rel + ${P.toFixed(1)});
    float c = cos(ang), s = sin(ang);
    q = vec2(q.x * c + q.y * s, -q.x * s + q.y * c);
    p.x = q.x + uCamXY.x;
    rel = q.y - ${P.toFixed(1)};
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
      curv = smoothstep(${Ke.curveFrom.toFixed(2)}, 1.0, rr) * uGlass;
      sc += rd * (${Ke.barrel.toFixed(3)} * uGlass * rr * rr);
      gl_Position.xy = (sc / uView * 2.0 - 1.0) * gl_Position.w;
    }
    float defocus = uDefocus + curv * ${Ke.curveShare.toFixed(2)};

    float dist = -mv.z;
    // One lens for everything: sharp at the focus distance, soft away from it.
    float foc = 1.0 - smoothstep(0.0, 15.0, abs(dist - ${P.toFixed(1)}));
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
    float seam = smoothstep(${re.toFixed(1)}, ${(re+4).toFixed(1)}, relPre) * (1.0 - smoothstep(${(Te-2.5).toFixed(1)}, ${Te.toFixed(1)}, relPre));
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
`,$o=`
  precision highp float;
  ${Mo}
  ${Lo}
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
    // Through the eyepiece the field is only seen inside the circle (an edge of ${Ot.toFixed(1)} px); outside the paper stays clean.
    if (uOcular.w > 0.0) {
      float d = distance(gl_FragCoord.xy / uDpr, uOcular.xy);
      a *= mix(1.0, smoothstep(uOcular.z, uOcular.z - ${Ot.toFixed(1)}, d), uOcular.w);
    }
    if (a < 0.004) discard;
    vec3 col = mix(GRAPHITE, GRAPHITE_LIGHT, 0.3 + 0.7 * step(0.8, fract(vSeed * 3.17)));
    col = mix(col, GRAPHITE_LIGHT, vLayer > 1.5 ? 0.6 : 0.0);
    col = mix(col, GRAPHITE_DEEP, vLens * 0.6);
    gl_FragColor = vec4(col, a);
  }
`,at=ye=>(.5-ye)*window.innerHeight/x,$t=()=>Math.min(window.innerWidth*.92,880)/2/x,Bo=1.35;function jo({entered:ye}){const st=Xe.useRef(null),it=Xe.useRef(ye);return it.current=ye,Xe.useEffect(()=>{const rt=st.current;if(!rt)return;let lt=!1;const f=v.reducedMotion,ct=Math.min(window.devicePixelRatio||1,2),I=Kt.prep==="fire",ve=nt+Dt,xe=new Float32Array(ve*3),ut=new Float32Array(ve),pt=new Float32Array(ve),Re=[[re,-12],[-12,-3],[-3,Te],[-22,-5]];let N=0;for(let n=0;n<4;n++){const a=n===3?Dt:n===2?nt-N:Math.round(nt*_o[n]);for(let g=0;g<a&&N<ve;g++,N++)xe[N*3]=(Math.random()-.5)*84,xe[N*3+1]=(Math.random()-.5)*52,xe[N*3+2]=Re[n][0]+Math.random()*(Re[n][1]-Re[n][0]),ut[N]=Math.random(),pt[N]=n}const J=new fo;J.setAttribute("position",new ot(xe,3)),J.setAttribute("aSeed",new ot(ut,1)),J.setAttribute("aLayer",new ot(pt,1)),J.boundingSphere=new mo(new b,1e4);const h={uSize:{value:u.size},uDpr:{value:ct},uLens:{value:0},uPointer:{value:new Oe(99,99)},uAlpha:{value:u.density},...Eo()};h.uDefocus.value=1;const we=new go({vertexShader:No,fragmentShader:$o,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{...h,uTime:{value:0},uRot:{value:0},uCamZ:{value:P},uCamXY:{value:new Oe},uMotion:{value:f?0:.15},uBreath:{value:0},uWake:{value:0},uFade:{value:0},uOcular:{value:new yo(0,0,1,0)},uView:{value:new Oe(window.innerWidth,window.innerHeight)},uGlass:{value:0}}}),k=new vo,dt=new xo(J,we);k.add(dt);const ht=n=>2*Math.atan(n/2/Tt)*180/Math.PI,p=new wo(ht(window.innerHeight),window.innerWidth/window.innerHeight,.1,200);p.position.set(0,0,P);let be=p.fov,Se=p.fov;const $=new bo({alpha:!0,antialias:!1,powerPreference:"high-performance"});$.setPixelRatio(ct),$.setClearColor(0,0),rt.appendChild($.domElement);const Fe=()=>{$.setSize(window.innerWidth,window.innerHeight),p.aspect=window.innerWidth/window.innerHeight,be=ht(window.innerHeight),Se=be,p.fov=be,p.updateProjectionMatrix()};Fe(),window.addEventListener("resize",Fe);const R=qt(),o=I?null:Rt(h,R,{count:H.count,scale:H.scale,surveillance:!0,phagocytosis:!0,atp:!0,trace:!1,motility:u.motility,tempo:u.tempo,reach:u.reach});o&&(o.group.position.set(7.4,-.9,H.z),k.add(o.group));const ce=new b(7.4,-.9,H.z);let ue=H.scale;const Bt=()=>{const n=ro();if(!n)return;const a=lo(n,R.bound);ue=a.scale,ce.set((a.cx-n.W/2)/x,(n.H/2-a.cy)/x,H.z)},We=new b;e.heroOnScreen=o?()=>{const n=p.position.z-H.z;return n<=.1||!o.group.visible?null:(We.copy(o.group.position).project(p),{x:(We.x*.5+.5)*window.innerWidth,y:(-We.y*.5+.5)*window.innerHeight,r:R.bound*o.group.scale.x*x*P/n})}:null;let ft=!1;const S=o?Ft(o.group,p,()=>ft?R.bound*o.group.scale.x*kt:0,(n,a)=>o.stimulate(n,{instant:f,normal:a})):null;let mt=0,Ce=1,pe=0;const Ee={x:0,y:0},Q={x:0,y:0},gt=location.search.includes("debug");gt&&(e.zoomLog=[]);const c=I?null:Ao(h,5),Ge=new b(9,1,ie.z);c&&(c.group.position.copy(Ge),c.group.visible=!1,k.add(c.group));const Vt=()=>{const n=document.querySelector(".contact-centre"),a=(n==null?void 0:n.closest(".plane"))??null;if(!c||!n||!a)return;const g=window.innerWidth,Y=window.innerHeight,M=(g-a.offsetWidth)/2,fe=.13*Y,O=co(n,a),oe=M+O.x+n.offsetWidth,w=M+a.offsetWidth,Ze=(oe+w)/2,j=fe+O.y+n.offsetHeight/2,ze=Math.max(ie.minPx,Math.min(ie.maxPx,(w-oe)/2-ie.gapPx));Ge.set((Ze-g/2)/x,(Y/2-j)/x,ie.z),c.group.scale.setScalar(ze/x)},y=I?null:Rt(h,R,{count:se.count,scale:se.scale,surveillance:!1,seed:2,atp:!0,motility:u.motility,tempo:u.tempo}),_=I?zo(h,2):null,m=y?y.group:new So;_&&(m.scale.setScalar(se.scale),m.add(_.points)),k.add(m);let yt=.6,ke=1;const ee=Ft(m,p,()=>e.sheet<.5?R.bound*m.scale.x*kt:0,(n,a)=>{y?y.stimulate(n,{instant:f,normal:a}):(f||_==null||_.start(n),po.stimulatedAt=performance.now())}),d=Wt(h,"research",{channel:!I});d.group.rotation.x=0,d.group.scale.setScalar(ge.scale),k.add(d.group);const i=I?null:Wt(h,"methods");i&&(i.group.rotation.x=W.tilt,i.group.scale.setScalar(W.scale),k.add(i.group));const r=I?null:Ho(h,"/cv-vorschau/design/");r&&(r.group.position.set(-5,-4,W.z),k.add(r.group));const L=r?Ct(r.group,p,()=>r.hoverEnabled?r.group.scale.x*x*1.1:0,{tilt:!1}):null,vt=new b(-5,-4,W.z);let De=3;const Zt=new b(0,-3,0),Ut=16,Yt=-3*le-le/2,Me=new b,Le=new b,de=new b,Ie=()=>{Me.set(ge.x,at(ge.top),ge.z),Le.set(W.x,at(W.top),W.z),de.set(se.x,at(se.top),se.z),d.group.position.copy(Me),i==null||i.group.position.copy(Le),m.position.copy(de)};Ie(),window.addEventListener("resize",Ie);const te=Ct(d.group,p,()=>3.3*d.group.scale.x*x*1.2),B=o?me(h,1):null,V=y?me(h,2):null,Ae=me(h,3),Z=i?me(h,4):null,U=c?me(h,5):null;for(const n of[B,V,Ae,Z,U])n&&k.add(n.points);const he=new b;(location.search.includes("debug")||location.search.includes("tune"))&&(window.__atmos={u:we.uniforms,renderer:$,camera:p,prep:I?"fire":"wildtype",channel:d.group,methodsChannel:(i==null?void 0:i.group)??null,heroCell:o,aboutCell:y,emblem:c,puff:_,umap:(r==null?void 0:r.group)??null,stimulateAbout:(n,a)=>{const g=ee.onScreen();return!!g&&ee.at(n??g.x,a??g.y)},aboutOnScreen:()=>ee.onScreen(),stimulateHero:(n,a)=>{const g=S==null?void 0:S.onScreen();return!!g&&!!S&&S.at(n??g.x,a??g.y)},heroOnScreen:()=>{var g,Y;const n=((Y=(g=e).heroOnScreen)==null?void 0:Y.call(g))??null,a=(S==null?void 0:S.onScreen())??null;return n?{...n,work:a?a.r:0}:null}});let Ne=document.hidden,$e=performance.now(),xt=0;const C={x:0,y:0},G={x:99,y:99},wt=new Oe,Be=new b().copy(Gt),E=we.uniforms;let bt=`${u.motility}|${u.tempo}|${u.reach}`;const Ve=new b,jt=n=>{var Pt,_t;if(Ne||lt)return;const a=Math.min((n-$e)/1e3,.05);$e=n;const g=n/1e3,Y=(f?0:it.current?1:.15)*(1-.6*e.sheet);E.uMotion.value=D(E.uMotion.value,Y,1.2,a);const M=E.uMotion.value;xt+=a*u.rotation*M;const fe=e.enteredAt==null?-1:(n-e.enteredAt)/1e3,O=e.gate&&!f,oe=e.zoomAt,w=!O||fe<0||oe==null?-1:n-oe,Ze=O?w<0?0:uo(n,oe):1,j=!O||w>=Je.landed,ze=fe<0?0:Ze;h.uDefocus.value=1-ze,e.push=.8*(1-ze);const Ue=Jt(e.station,e.flight),Et=j?1:0;C.x=f?0:D(C.x,v.pointer.x*.5*Et,2,a),C.y=f?0:D(C.y,v.pointer.y*.35*Et,2,a);const q=C.x+Ue.x,X=C.y+Ue.y;p.position.set(q,X,e.camZ+e.push),p.rotation.z=Ue.roll,p.updateMatrixWorld();const Mt=be+(f?0:Qt*eo(e.flight));if(Mt!==Se&&(Se=Mt,p.fov=Se,p.updateProjectionMatrix()),E.uTime.value=g,E.uRot.value=xt,E.uCamZ.value=e.camZ+e.push,E.uCamXY.value.set(q,X),E.uBreath.value=f?0:u.breath,E.uWake.value=f?0:u.wake,h.uSize.value=u.size,h.uAlpha.value=u.density*(1-.7*e.sheet),h.uLens.value=!f&&u.lens&&v.pointerSeen?1:0,v.pointerSeen&&!f?Be.set(v.pointer.x*.9,v.pointer.y*.8+.35,.7).normalize():Be.copy(Gt),h.uLight.value.lerp(Be,1-Math.exp(-2.5*a)).normalize(),v.pointerSeen){const t=window.innerHeight/2/Tt*P,s=q+v.pointer.x*t*p.aspect,l=X+v.pointer.y*t;G.x=G.x===99?s:D(G.x,s,3.5,a),G.y=G.y===99?l:D(G.y,l,3.5,a),h.uPointer.value.set(G.x,G.y),wt.set(G.x,G.y)}const Lt=to(e.camZ);E.uFade.value=1-Lt,dt.visible=Lt>.005;let At=!1;const zt=`${u.motility}|${u.tempo}|${u.reach}`;zt!==bt&&(bt=zt,o==null||o.setMotility({motility:u.motility,tempo:u.tempo,reach:u.reach}),y==null||y.setMotility({motility:u.motility,tempo:u.tempo}));const A=t=>Math.abs(e.camZ-t.position.z-P),Ye=(t,s,l,z)=>l.position.copy(t).addScaledVector(s,1-Qe(e.camZ-t.z,z)),Ht=t=>1-Math.min(1,Math.max(0,e.camZ-t.position.z-P)/Wo);{const t=e.ocular,s=w<0?0:io(w);if(O&&t&&s<1){const l=oo(t.layout,s);E.uOcular.value.set(l.x,window.innerHeight-l.y,l.R,1-ne(.75,1,s)),E.uGlass.value=no(n,s),E.uView.value.set(window.innerWidth,window.innerHeight)}else E.uOcular.value.w=0,E.uGlass.value=0}if(o){if(o.reveal=1,o.draw=O?w<0?0:ao(w):1,o.group.visible=A(o.group)<ae&&(!O||w>=Je.draw[0]),e.station===0){Bt();const t=e.ocular;if(O&&!j&&(t!=null&&t.symbolGate)){const s=window.innerWidth,l=window.innerHeight,z=p.position.z-H.z,T=x*P/z,Pe={x:s/2+(ce.x-q)*T,y:l/2-(ce.y-X)*T,somaR:R.soma*ue*T},F=w<0?null:so(w,t.symbolGate,Pe);e.symbol=F,F?(o.group.position.set(q+(F.x-s/2)/T,X+(l/2-F.y)/T,H.z),o.group.scale.setScalar(F.bodyR/(R.soma*T))):(o.group.position.copy(ce),o.group.scale.setScalar(ue)),o.magnify=o.group.scale.x/ue,o.defocusShare=0}else e.symbol=null,o.group.position.copy(ce),o.group.scale.setScalar(ue),o.magnify=1,o.defocusShare=O?0:1}if(o.hunger=O?w>=Je.hunger?1:0:fe>=0?1:0,ft=j&&e.station===0&&e.flight===0&&e.sheet<.5&&o.group.visible,o.group.visible){const t=!!o.chemotaxis;t&&pe<1&&(Ee.x=Q.x,Ee.y=Q.y),pe=t?1:D(pe,0,3,a),Ce=t?0:D(Ce,1,2,a),j&&(mt+=a*.15*M*Ce),Q.x=C.x+(Ee.x-C.x)*pe,Q.y=C.y+(Ee.y-C.y)*pe,o.group.rotation.y=mt+Q.x*.3,o.group.rotation.x=-.1+Q.y*.18;const s=1-ne(2.5,9,Math.abs(e.camZ-H.z));o.maxPx=H.maxPx+(Io-H.maxPx)*s;const l=f?0:Math.max(M,1-.6*e.sheet);o.update(a,l,j&&v.pointerSeen&&!f?wt:null,u.activation)}if(gt&&e.zoomLog&&w>=0&&w<=2500&&e.zoomLog.length<400){const t=e.symbol,s=o.group.visible?(_t=(Pt=e).heroOnScreen)==null?void 0:_t.call(Pt):null,l=p.position.z-H.z;e.zoomLog.push({t:w,symbol:t&&t.alpha>0?{x:t.x,y:t.y,bodyR:t.bodyR,size:t.size,alpha:t.alpha}:null,cell:s?{x:s.x,y:s.y,somaR:R.soma*o.group.scale.x*x*P/l}:null,draw:o.draw,push:e.push})}if(B){const t=R.bound*o.group.scale.x*.62;B.place(he.copy(o.group.position),t,t),B.update(o.group.visible?o.reveal*o.draw*(1-Math.min(1,A(o.group)/10)):0)}}Ye(de,Oo,m);const je=e.station===1?ne(0,.12,e.flight):0;if(m.position.y+=e.pan/x*(1-je)+(It.y-de.y)*je,m.position.x+=(It.x-de.x)*je,m.visible=A(m)<ae,m.visible)if(ke=y!=null&&y.chemotaxis?0:D(ke,1,2,a),yt+=a*.1*M*ke,m.rotation.y=yt,y){const t=ne(Nt[0],Nt[1],v.acts.cell);y.update(a,M,null,Math.max(t,u.activation))}else _==null||_.update(a,M,1);if(V){const t=R.bound*m.scale.x*.62;V.place(he.copy(m.position),t,t),V.update(m.visible?1-Math.min(1,A(m)/10):0)}const He=e.sheet;if(Ye(Me,To,d.group,Ro),d.group.position.x+=($t()+3.3*ge.scale+.4-Me.x)*He,d.group.visible=A(d.group)<ae,d.group.visible){const t=1-Math.min(1,A(d.group)/10);te.active||(d.group.rotation.y+=a*(.38*M+te.spin),te.spin*=Math.pow(.03,a)),d.ionBoost=1+(Do-1)*(e.station===1?Math.sin(Math.PI*e.flight):0),d.update(a,M,t,Ht(d.group))}{const t=3.3*d.group.scale.x;Ae.place(he.copy(d.group.position).setY(d.group.position.y-t*.25),t*.95,t*.42),Ae.update(d.group.visible?1-Math.min(1,A(d.group)/10):0)}if(i){const t=e.station===2?Math.sin(Math.PI*e.flight):0,s=W.scale*(1+(Bo-1)*He)+(Go-W.scale)*t;if(i.group.scale.setScalar(s),Ye(Le,Fo,i.group),i.group.position.x+=($t()+3.3*s+.3-Le.x)*He,i.group.position.y+=(e.station===3?e.pan/x:0)*(1-He),i.group.visible=A(i.group)<ae,i.group.visible){const l=1-Math.min(1,A(i.group)/10);i.group.rotation.x=W.tilt+(Co-W.tilt)*t,i.ionBoost=1+(ko-1)*t,i.group.rotation.y+=a*.3*M,i.update(a,M,l,Ht(i.group))}if(Z){const l=3.3*i.group.scale.x;Z.place(he.copy(i.group.position).setY(i.group.position.y-l*.3),l*.95,l*.45),Z.update(i.group.visible?1-Math.min(1,A(i.group)/10):0)}}if(c){const t=e.station>=4;if(c.group.visible=t&&A(c.group)<ae,c.group.visible){Vt(),c.group.position.copy(Ge),c.group.position.y+=e.station===5?e.pan/x:0,c.draw=f?1:Qe(e.camZ-ie.z);let s=null;if(v.pointerSeen&&!f&&e.sheet<.5){Ve.copy(c.group.position).project(p);const l=c.group.scale.x*x*Po,z=(v.pointer.x-Ve.x)*.5*window.innerWidth/l,T=(Ve.y-v.pointer.y)*.5*window.innerHeight/l;Math.hypot(z,T)<1&&(s={x:z,y:T})}c.update(a,M,1-.6*Math.min(1,A(c.group)/30),s),At=!!s}if(U){const s=c.group.scale.x*.9;U.place(he.copy(c.group.position),s,s*.8),U.update(c.group.visible?c.draw*(1-Math.min(1,A(c.group)/10)):0)}}if(r&&L){const t=-3*le,s=e.camZ-t,l=Math.abs(s-P)<6&&e.station===3&&e.flight===0,z=e.station===2&&e.flight>0&&s<=36,T=document.getElementById("umap-anchor");if((l||z)&&T){const K=T.getBoundingClientRect();if(K.height>10){const qe=x*P/s;vt.set(q+(K.left+K.width/2-window.innerWidth/2)/qe,X+(window.innerHeight/2-(K.top+K.height/2))/qe,t),De=Math.min(K.width,K.height)/2/qe*.95}}const Pe=e.station===3&&e.flight>0?e.flight:0,F=ne(0,.4,Pe);r.group.position.copy(vt).addScaledVector(Zt,1-Qe(e.camZ-t)),r.group.position.lerp(new b(q*.3,X,Yt),F),r.group.scale.setScalar(De+(Ut-De)*F),r.maxPx=9+13*F,r.reveal=D(r.reveal,r.ready?1-ne(.8,1,Pe):0,2.5,a),r.hoverEnabled=F<.05&&e.sheet<.5,r.labelsEnabled=F<.3&&e.sheet<.5,r.group.visible=r.ready&&A(r.group)<ae&&r.reveal>.01,r.group.visible?(L.active||(r.group.rotation.y+=a*L.spin,L.spin*=Math.pow(.03,a)),r.update(a,M,p,v.pointerSeen?v.pointer:null,!L.active&&!f)):(_e.labels.length||_e.hover)&&(_e.labels=[],_e.hover=null)}if(et.active){p.updateMatrixWorld(),tt.object=te.hover||!!(L!=null&&L.hover)||At,tt.dragging=te.active||!!(L!=null&&L.active);const t=z=>!!z&&Math.hypot(et.px-z.x,et.py-z.y)<z.r,s=m.visible&&ee.free?ee.onScreen():null,l=S!=null&&S.free?S.onScreen():null;tt.drop=t(s)||t(l),ho(n)}$.render(k,p)},St=()=>{Ne=document.hidden,Ne||($e=performance.now())};return document.addEventListener("visibilitychange",St),e.tick=jt,()=>{lt=!0,e.tick=null,e.heroOnScreen=null,e.symbol=null,document.removeEventListener("visibilitychange",St),window.removeEventListener("resize",Fe),window.removeEventListener("resize",Ie),te.dispose(),L==null||L.dispose(),ee.dispose(),S==null||S.dispose(),B==null||B.dispose(),V==null||V.dispose(),Ae.dispose(),Z==null||Z.dispose(),U==null||U.dispose(),c==null||c.dispose(),r==null||r.dispose(),d.dispose(),i==null||i.dispose(),o==null||o.dispose(),y==null||y.dispose(),_==null||_.dispose(),J.dispose(),we.dispose(),$.dispose(),$.domElement.remove()}},[]),Xt.jsx("div",{ref:st,className:"atmos fixed inset-0 z-0 pointer-events-none","aria-hidden":"true"})}export{jo as default};
