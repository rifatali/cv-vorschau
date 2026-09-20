import{r as Ze,t as u,D as L,O as St,g as It,H as E,j as kt,s as y,b as Nt,P as Mt,G as se,K as m,f as e,a as Bt,d as Q,p as Gt,F as $t,h as Zt,i as Vt,k as Yt,z as Ut,e as ee,l as jt,T as Ve,m as qt,n as Ye,u as He,o as de,q as Ue,v as Xt,w as Kt,x as Jt,y as Qt,A as eo}from"./index-C6oKeEc7.js";import{B as to,a as je,S as oo,V as x,b as no,f as ao,c as qe,d as so,P as io,e as ro,W as lo,G as co}from"./three-BH243BCb.js";import{m as uo,P as po,S as fo,b as Et,d as ho,a as mo,g as go,c as Lt,e as yo,h as At,f as fe,L as zt,E as vo}from"./UmapCloud-xOyVPhH1.js";import"./motion-BCXewYul.js";const Xe=3e4,xo=[.64,.33,.03],Ht=18e3,ae=-34,Pe=2,te=28,oe={x:8.4,top:.2,z:-40,scale:1,count:14e3},wo=new x(0,2,0),he={x:9.6,top:.2,z:-2*se,scale:.85},bo=new x(6,3,0),So=44,R={x:-1.8,top:.215,z:-3*se,scale:.4,tilt:.35},Mo=new x(.6,.8,0),Eo=40,Pt={x:6,y:2},Lo=-.9,Ao=1,zo=2.4,Ho=2.8,Po=22,Tt=[.34,.5],ne={z:-5*se,minPx:110,maxPx:160,gapPx:16},To=`
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
    float L = ${(Pe-ae).toFixed(1)};
    float rel = mod(position.z - uCamZ - (${ae.toFixed(1)}), L) + (${ae.toFixed(1)});
    float relPre = rel;

    // The cloud circles a point in front of you — at the plane in focus — the
    // way the very first version did, its far layer slower than its near one; the dust (layer 3) between them.
    float speed = layer < 0.5 ? 0.5 : (layer < 1.5 ? 1.0 : (layer < 2.5 ? 1.25 : 0.75));
    float ang = uRot * speed;
    vec2 q = vec2(p.x - uCamXY.x, rel + ${L.toFixed(1)});
    float c = cos(ang), s = sin(ang);
    q = vec2(q.x * c + q.y * s, -q.x * s + q.y * c);
    p.x = q.x + uCamXY.x;
    rel = q.y - ${L.toFixed(1)};
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

    float dist = -mv.z;
    // One lens for everything: sharp at the focus distance, soft away from it.
    float foc = 1.0 - smoothstep(0.0, 15.0, abs(dist - ${L.toFixed(1)}));
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
    float seam = smoothstep(${ae.toFixed(1)}, ${(ae+4).toFixed(1)}, relPre) * (1.0 - smoothstep(${(Pe-2.5).toFixed(1)}, ${Pe.toFixed(1)}, relPre));
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
`,_o=`
  precision highp float;
  ${po}
  ${fo}
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
    // Through the eyepiece the field is only seen inside the circle (an edge of ${St.toFixed(1)} px); outside the paper stays clean.
    if (uOcular.w > 0.0) {
      float d = distance(gl_FragCoord.xy / uDpr, uOcular.xy);
      a *= mix(1.0, smoothstep(uOcular.z, uOcular.z - ${St.toFixed(1)}, d), uOcular.w);
    }
    if (a < 0.004) discard;
    vec3 col = mix(GRAPHITE, GRAPHITE_LIGHT, 0.3 + 0.7 * step(0.8, fract(vSeed * 3.17)));
    col = mix(col, GRAPHITE_LIGHT, vLayer > 1.5 ? 0.6 : 0.0);
    col = mix(col, GRAPHITE_DEEP, vLens * 0.6);
    gl_FragColor = vec4(col, a);
  }
`,Ke=me=>(.5-me)*window.innerHeight/m,_t=()=>Math.min(window.innerWidth*.92,880)/2/m,Oo=1.35;function Do({entered:me}){const Je=Ze.useRef(null),Qe=Ze.useRef(me);return Qe.current=me,Ze.useEffect(()=>{const et=Je.current;if(!et)return;let tt=!1;const g=y.reducedMotion,ot=Math.min(window.devicePixelRatio||1,2),D=Nt.prep==="fire",ge=Xe+Ht,ye=new Float32Array(ge*3),nt=new Float32Array(ge),at=new Float32Array(ge),Te=[[ae,-12],[-12,-3],[-3,Pe],[-22,-5]];let I=0;for(let n=0;n<4;n++){const s=n===3?Ht:n===2?Xe-I:Math.round(Xe*xo[n]);for(let H=0;H<s&&I<ge;H++,I++)ye[I*3]=(Math.random()-.5)*84,ye[I*3+1]=(Math.random()-.5)*52,ye[I*3+2]=Te[n][0]+Math.random()*(Te[n][1]-Te[n][0]),nt[I]=Math.random(),at[I]=n}const j=new to;j.setAttribute("position",new je(ye,3)),j.setAttribute("aSeed",new je(nt,1)),j.setAttribute("aLayer",new je(at,1)),j.boundingSphere=new oo(new x,1e4);const f={uSize:{value:u.size},uDpr:{value:ot},uLens:{value:0},uPointer:{value:new qe(99,99)},uAlpha:{value:u.density},...uo()};f.uDefocus.value=1;const ve=new no({vertexShader:To,fragmentShader:_o,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{...f,uTime:{value:0},uRot:{value:0},uCamZ:{value:L},uCamXY:{value:new qe},uMotion:{value:g?0:.15},uBreath:{value:0},uWake:{value:0},uFade:{value:0},uOcular:{value:new ao(0,0,1,0)}}}),C=new so,st=new io(j,ve);C.add(st);const it=n=>2*Math.atan(n/2/Mt)*180/Math.PI,p=new ro(it(window.innerHeight),window.innerWidth/window.innerHeight,.1,200);p.position.set(0,0,L);let xe=p.fov,we=p.fov;const k=new lo({alpha:!0,antialias:!1,powerPreference:"high-performance"});k.setPixelRatio(ot),k.setClearColor(0,0),et.appendChild(k.domElement);const _e=()=>{k.setSize(window.innerWidth,window.innerHeight),p.aspect=window.innerWidth/window.innerHeight,xe=it(window.innerHeight),we=xe,p.fov=xe,p.updateProjectionMatrix()};_e(),window.addEventListener("resize",_e);const _=It(),o=D?null:Et(f,_,{count:E.count,scale:E.scale,surveillance:!0,phagocytosis:!0,motility:u.motility,tempo:u.tempo,reach:u.reach});o&&(o.group.position.set(7.4,-.9,E.z),C.add(o.group));const ie=new x(7.4,-.9,E.z);let re=E.scale;const Ot=()=>{const n=Kt();if(!n)return;const s=Jt(n,_.bound);re=s.scale,ie.set((s.cx-n.W/2)/m,(n.H/2-s.cy)/m,E.z)},Oe=new x;e.heroOnScreen=o?()=>{const n=p.position.z-E.z;return n<=.1||!o.group.visible?null:(Oe.copy(o.group.position).project(p),{x:(Oe.x*.5+.5)*window.innerWidth,y:(-Oe.y*.5+.5)*window.innerHeight,r:_.bound*o.group.scale.x*m*L/n})}:null;let rt=0;const lt=location.search.includes("debug");lt&&(e.zoomLog=[]);const l=D?null:ho(f,5),Re=new x(9,1,ne.z);l&&(l.group.position.copy(Re),l.group.visible=!1,C.add(l.group));const Rt=()=>{const n=document.querySelector(".contact-centre"),s=(n==null?void 0:n.closest(".plane"))??null;if(!l||!n||!s)return;const H=window.innerWidth,Ee=window.innerHeight,w=(H-s.offsetWidth)/2,pe=.13*Ee,P=Qt(n,s),K=w+P.x+n.offsetWidth,v=w+s.offsetWidth,ke=(K+v)/2,J=pe+P.y+n.offsetHeight/2,Le=Math.max(ne.minPx,Math.min(ne.maxPx,(v-K)/2-ne.gapPx));Re.set((ke-H/2)/m,(Ee/2-J)/m,ne.z),l.group.scale.setScalar(Le/m)},b=D?null:Et(f,_,{count:oe.count,scale:oe.scale,surveillance:!1,seed:2,atp:!0,motility:u.motility,tempo:u.tempo}),A=D?mo(f,2):null,h=b?b.group:new co;A&&(h.scale.setScalar(oe.scale),h.add(A.points)),C.add(h);const le=go(h,p,()=>e.sheet<.5?_.bound*h.scale.x*1.2:0,n=>{b?b.stimulate(n,{instant:g}):(g||A==null||A.start(n),Bt.stimulatedAt=performance.now())}),d=Lt(f,"research",{channel:!D});d.group.rotation.x=0,d.group.scale.setScalar(he.scale),C.add(d.group);const i=D?null:Lt(f,"methods");i&&(i.group.rotation.x=R.tilt,i.group.scale.setScalar(R.scale),C.add(i.group));const r=D?null:yo(f,"/cv-vorschau/design/");r&&(r.group.position.set(-5,-4,R.z),C.add(r.group));const S=r?At(r.group,p,()=>r.hoverEnabled?r.group.scale.x*m*1.1:0,{tilt:!1}):null,ct=new x(-5,-4,R.z);let Fe=3;const Ft=new x(0,-3,0),Wt=16,Ct=-3*se-se/2,be=new x,Se=new x,ce=new x,We=()=>{be.set(he.x,Ke(he.top),he.z),Se.set(R.x,Ke(R.top),R.z),ce.set(oe.x,Ke(oe.top),oe.z),d.group.position.copy(be),i==null||i.group.position.copy(Se),h.position.copy(ce)};We(),window.addEventListener("resize",We);const q=At(d.group,p,()=>3.3*d.group.scale.x*m*1.2),B=o?fe(f,1):null,G=b?fe(f,2):null,Me=fe(f,3),$=i?fe(f,4):null,Z=l?fe(f,5):null;for(const n of[B,G,Me,$,Z])n&&C.add(n.points);const ue=new x;(location.search.includes("debug")||location.search.includes("tune"))&&(window.__atmos={u:ve.uniforms,renderer:k,camera:p,prep:D?"fire":"wildtype",channel:d.group,methodsChannel:(i==null?void 0:i.group)??null,heroCell:o,aboutCell:b,emblem:l,puff:A,umap:(r==null?void 0:r.group)??null,stimulateAbout:(n,s)=>{const H=le.onScreen();return!!H&&le.at(n??H.x,s??H.y)},aboutOnScreen:()=>le.onScreen()});let Ce=document.hidden,De=performance.now(),ut=0;const N={x:0,y:0},F={x:99,y:99},pt=new qe,Ie=new x().copy(zt),z=ve.uniforms;let dt=`${u.motility}|${u.tempo}|${u.reach}`;const X=new x,Dt=n=>{var wt,bt;if(Ce||tt)return;const s=Math.min((n-De)/1e3,.05);De=n;const H=n/1e3,Ee=(g?0:Qe.current?1:.15)*(1-.6*e.sheet);z.uMotion.value=Q(z.uMotion.value,Ee,1.2,s);const w=z.uMotion.value;ut+=s*u.rotation*w;const pe=e.enteredAt==null?-1:(n-e.enteredAt)/1e3,P=e.gate&&!g,K=e.zoomAt,v=!P||pe<0||K==null?-1:n-K,ke=P?v<0?0:eo(n,K):1,J=!P||v>=Ve.landed,Le=pe<0?0:ke;f.uDefocus.value=1-Le,e.push=.8*(1-Le);const Ne=Gt(e.station,e.flight),ht=J?1:0;N.x=g?0:Q(N.x,y.pointer.x*.5*ht,2,s),N.y=g?0:Q(N.y,y.pointer.y*.35*ht,2,s);const V=N.x+Ne.x,Y=N.y+Ne.y;p.position.set(V,Y,e.camZ+e.push),p.rotation.z=Ne.roll,p.updateMatrixWorld();const mt=xe+(g?0:$t*Zt(e.flight));if(mt!==we&&(we=mt,p.fov=we,p.updateProjectionMatrix()),z.uTime.value=H,z.uRot.value=ut,z.uCamZ.value=e.camZ+e.push,z.uCamXY.value.set(V,Y),z.uBreath.value=g?0:u.breath,z.uWake.value=g?0:u.wake,f.uSize.value=u.size,f.uAlpha.value=u.density*(1-.7*e.sheet),f.uLens.value=!g&&u.lens&&y.pointerSeen?1:0,y.pointerSeen&&!g?Ie.set(y.pointer.x*.9,y.pointer.y*.8+.35,.7).normalize():Ie.copy(zt),f.uLight.value.lerp(Ie,1-Math.exp(-2.5*s)).normalize(),y.pointerSeen){const t=window.innerHeight/2/Mt*L,a=V+y.pointer.x*t*p.aspect,c=Y+y.pointer.y*t;F.x=F.x===99?a:Q(F.x,a,3.5,s),F.y=F.y===99?c:Q(F.y,c,3.5,s),f.uPointer.value.set(F.x,F.y),pt.set(F.x,F.y)}const gt=Vt(e.camZ);z.uFade.value=1-gt,st.visible=gt>.005;let yt=!1;const vt=`${u.motility}|${u.tempo}|${u.reach}`;vt!==dt&&(dt=vt,o==null||o.setMotility({motility:u.motility,tempo:u.tempo,reach:u.reach}),b==null||b.setMotility({motility:u.motility,tempo:u.tempo}));const M=t=>Math.abs(e.camZ-t.position.z-L),Be=(t,a,c,W)=>c.position.copy(t).addScaledVector(a,1-Ye(e.camZ-t.z,W)),xt=t=>1-Math.min(1,Math.max(0,e.camZ-t.position.z-L)/Eo);{const t=e.ocular,a=v<0?0:Yt(v);if(P&&t&&a<1){const c=Ut(t.layout,a);z.uOcular.value.set(c.x,window.innerHeight-c.y,c.R,1-ee(.75,1,a))}else z.uOcular.value.w=0}if(o){if(o.reveal=1,o.draw=P?v<0?0:jt(v):1,o.group.visible=M(o.group)<te&&(!P||v>=Ve.draw[0]),e.station===0){Ot();const t=e.ocular;if(P&&!J&&(t!=null&&t.symbolGate)){const a=window.innerWidth,c=window.innerHeight,W=p.position.z-E.z,T=m*L/W,ze={x:a/2+(ie.x-V)*T,y:c/2-(ie.y-Y)*T,somaR:_.soma*re*T},O=v<0?null:qt(v,t.symbolGate,ze);e.symbol=O,O?(o.group.position.set(V+(O.x-a/2)/T,Y+(c/2-O.y)/T,E.z),o.group.scale.setScalar(O.bodyR/(_.soma*T))):(o.group.position.copy(ie),o.group.scale.setScalar(re)),o.magnify=o.group.scale.x/re,o.defocusShare=0}else e.symbol=null,o.group.position.copy(ie),o.group.scale.setScalar(re),o.magnify=1,o.defocusShare=P?0:1}if(o.hunger=P?v>=Ve.hunger?1:0:pe>=0?1:0,o.group.visible){J&&(rt+=s*.15*w),o.group.rotation.y=rt+N.x*.3,o.group.rotation.x=-.1+N.y*.18;const t=1-ee(2.5,9,Math.abs(e.camZ-E.z));o.maxPx=E.maxPx+(Po-E.maxPx)*t;const a=g?0:Math.max(w,1-.6*e.sheet);o.update(s,a,J&&y.pointerSeen&&!g?pt:null,u.activation)}if(lt&&e.zoomLog&&v>=0&&v<=2500&&e.zoomLog.length<400){const t=e.symbol,a=o.group.visible?(bt=(wt=e).heroOnScreen)==null?void 0:bt.call(wt):null,c=p.position.z-E.z;e.zoomLog.push({t:v,symbol:t&&t.alpha>0?{x:t.x,y:t.y,bodyR:t.bodyR,size:t.size,alpha:t.alpha}:null,cell:a?{x:a.x,y:a.y,somaR:_.soma*o.group.scale.x*m*L/c}:null,draw:o.draw,push:e.push})}if(B){const t=_.bound*o.group.scale.x*.62;B.place(ue.copy(o.group.position),t,t),B.update(o.group.visible?o.reveal*o.draw*(1-Math.min(1,M(o.group)/10)):0)}}Be(ce,wo,h);const Ge=e.station===1?ee(0,.12,e.flight):0;if(h.position.y+=e.pan/m*(1-Ge)+(Pt.y-ce.y)*Ge,h.position.x+=(Pt.x-ce.x)*Ge,h.visible=M(h)<te,h.visible)if(h.rotation.y=H*.1*w+.6,b){const t=ee(Tt[0],Tt[1],y.acts.cell);b.update(s,w,null,Math.max(t,u.activation))}else A==null||A.update(s,w,1);if(G){const t=_.bound*h.scale.x*.62;G.place(ue.copy(h.position),t,t),G.update(h.visible?1-Math.min(1,M(h)/10):0)}const Ae=e.sheet;if(Be(be,bo,d.group,So),d.group.position.x+=(_t()+3.3*he.scale+.4-be.x)*Ae,d.group.visible=M(d.group)<te,d.group.visible){const t=1-Math.min(1,M(d.group)/10);q.active||(d.group.rotation.y+=s*(.38*w+q.spin),q.spin*=Math.pow(.03,s)),d.ionBoost=1+(Ho-1)*(e.station===1?Math.sin(Math.PI*e.flight):0),d.update(s,w,t,xt(d.group))}{const t=3.3*d.group.scale.x;Me.place(ue.copy(d.group.position).setY(d.group.position.y-t*.25),t*.95,t*.42),Me.update(d.group.visible?1-Math.min(1,M(d.group)/10):0)}if(i){const t=e.station===2?Math.sin(Math.PI*e.flight):0,a=R.scale*(1+(Oo-1)*Ae)+(Ao-R.scale)*t;if(i.group.scale.setScalar(a),Be(Se,Mo,i.group),i.group.position.x+=(_t()+3.3*a+.3-Se.x)*Ae,i.group.position.y+=(e.station===3?e.pan/m:0)*(1-Ae),i.group.visible=M(i.group)<te,i.group.visible){const c=1-Math.min(1,M(i.group)/10);i.group.rotation.x=R.tilt+(Lo-R.tilt)*t,i.ionBoost=1+(zo-1)*t,i.group.rotation.y+=s*.3*w,i.update(s,w,c,xt(i.group))}if($){const c=3.3*i.group.scale.x;$.place(ue.copy(i.group.position).setY(i.group.position.y-c*.3),c*.95,c*.45),$.update(i.group.visible?1-Math.min(1,M(i.group)/10):0)}}if(l){const t=e.station>=4;if(l.group.visible=t&&M(l.group)<te,l.group.visible){Rt(),l.group.position.copy(Re),l.group.position.y+=e.station===5?e.pan/m:0,l.draw=g?1:Ye(e.camZ-ne.z);let a=null;if(y.pointerSeen&&!g&&e.sheet<.5){X.copy(l.group.position).project(p);const c=l.group.scale.x*m*vo,W=(y.pointer.x-X.x)*.5*window.innerWidth/c,T=(X.y-y.pointer.y)*.5*window.innerHeight/c;Math.hypot(W,T)<1&&(a={x:W,y:T})}l.update(s,w,1-.6*Math.min(1,M(l.group)/30),a),yt=!!a}if(Z){const a=l.group.scale.x*.9;Z.place(ue.copy(l.group.position),a,a*.8),Z.update(l.group.visible?l.draw*(1-Math.min(1,M(l.group)/10)):0)}}if(r&&S){const t=-3*se,a=e.camZ-t,c=Math.abs(a-L)<6&&e.station===3&&e.flight===0,W=e.station===2&&e.flight>0&&a<=36,T=document.getElementById("umap-anchor");if((c||W)&&T){const U=T.getBoundingClientRect();if(U.height>10){const $e=m*L/a;ct.set(V+(U.left+U.width/2-window.innerWidth/2)/$e,Y+(window.innerHeight/2-(U.top+U.height/2))/$e,t),Fe=Math.min(U.width,U.height)/2/$e*.95}}const ze=e.station===3&&e.flight>0?e.flight:0,O=ee(0,.4,ze);r.group.position.copy(ct).addScaledVector(Ft,1-Ye(e.camZ-t)),r.group.position.lerp(new x(V*.3,Y,Ct),O),r.group.scale.setScalar(Fe+(Wt-Fe)*O),r.maxPx=9+13*O,r.reveal=Q(r.reveal,r.ready?1-ee(.8,1,ze):0,2.5,s),r.hoverEnabled=O<.05&&e.sheet<.5,r.labelsEnabled=O<.3&&e.sheet<.5,r.group.visible=r.ready&&M(r.group)<te&&r.reveal>.01,r.group.visible?(S.active||(r.group.rotation.y+=s*S.spin,S.spin*=Math.pow(.03,s)),r.update(s,w,p,y.pointerSeen?y.pointer:null,!S.active&&!g)):(He.labels.length||He.hover)&&(He.labels=[],He.hover=null)}if(de.active){p.updateMatrixWorld();let t=!1;if(o!=null&&o.group.visible&&e.station===0&&e.flight===0&&e.sheet<.5){X.copy(o.group.position).project(p);const c=(X.x*.5+.5)*window.innerWidth,W=(-X.y*.5+.5)*window.innerHeight;t=Math.hypot(de.px-c,de.py-W)<_.bound*o.group.scale.x*m*.75}Ue.object=t||q.hover||!!(S!=null&&S.hover)||yt,Ue.dragging=q.active||!!(S!=null&&S.active);const a=h.visible?le.onScreen():null;Ue.drop=!!a&&Math.hypot(de.px-a.x,de.py-a.y)<a.r,Xt(n)}k.render(C,p)},ft=()=>{Ce=document.hidden,Ce||(De=performance.now())};return document.addEventListener("visibilitychange",ft),e.tick=Dt,()=>{tt=!0,e.tick=null,e.heroOnScreen=null,e.symbol=null,document.removeEventListener("visibilitychange",ft),window.removeEventListener("resize",_e),window.removeEventListener("resize",We),q.dispose(),S==null||S.dispose(),le.dispose(),B==null||B.dispose(),G==null||G.dispose(),Me.dispose(),$==null||$.dispose(),Z==null||Z.dispose(),l==null||l.dispose(),r==null||r.dispose(),d.dispose(),i==null||i.dispose(),o==null||o.dispose(),b==null||b.dispose(),A==null||A.dispose(),j.dispose(),ve.dispose(),k.dispose(),k.domElement.remove()}},[]),kt.jsx("div",{ref:Je,className:"atmos fixed inset-0 z-0 pointer-events-none","aria-hidden":"true"})}export{Do as default};
