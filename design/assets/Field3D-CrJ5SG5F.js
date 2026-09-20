import{r as Ge,t as c,D as M,O as wt,g as Dt,H,j as kt,s as v,b as Nt,P as bt,G as ie,K as h,f as e,a as It,d as Q,p as Bt,F as Zt,h as Gt,i as $t,z as Vt,e as ee,k as Yt,Z as St,l as $e,u as Pe,m as pe,n as Ve,o as Ut,q as jt,v as qt,w as Xt,x as Kt}from"./index-jp5b5r_c.js";import{B as Jt,a as Ye,S as Qt,V as y,b as eo,f as to,c as Ue,d as oo,P as no,e as ao,W as io,G as so}from"./three-BH243BCb.js";import{m as ro,P as lo,S as co,b as Mt,d as uo,a as po,g as fo,c as Et,e as ho,h as Lt,f as de,L as At,E as mo}from"./UmapCloud-DjI1iFvD.js";import"./motion-BCXewYul.js";const je=3e4,go=[.64,.33,.03],zt=18e3,ae=-34,_e=2,te=28,oe={x:8.4,top:.2,z:-40,scale:1,count:14e3},vo=new y(0,2,0),fe={x:9.6,top:.2,z:-2*ie,scale:.85},yo=new y(6,3,0),xo=44,_={x:-1.8,top:.215,z:-3*ie,scale:.4,tilt:.35},wo=new y(.6,.8,0),bo=40,Ht={x:6,y:2},So=-.9,Mo=1,Eo=2.4,Lo=2.8,Ao=22,Pt=[.34,.5],ne={z:-5*ie,minPx:110,maxPx:160,gapPx:16},zo=`
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
    float L = ${(_e-ae).toFixed(1)};
    float rel = mod(position.z - uCamZ - (${ae.toFixed(1)}), L) + (${ae.toFixed(1)});
    float relPre = rel;

    // The cloud circles a point in front of you — at the plane in focus — the
    // way the very first version did, its far layer slower than its near one; the dust (layer 3) between them.
    float speed = layer < 0.5 ? 0.5 : (layer < 1.5 ? 1.0 : (layer < 2.5 ? 1.25 : 0.75));
    float ang = uRot * speed;
    vec2 q = vec2(p.x - uCamXY.x, rel + ${M.toFixed(1)});
    float c = cos(ang), s = sin(ang);
    q = vec2(q.x * c + q.y * s, -q.x * s + q.y * c);
    p.x = q.x + uCamXY.x;
    rel = q.y - ${M.toFixed(1)};
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
    float foc = 1.0 - smoothstep(0.0, 15.0, abs(dist - ${M.toFixed(1)}));
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
    float seam = smoothstep(${ae.toFixed(1)}, ${(ae+4).toFixed(1)}, relPre) * (1.0 - smoothstep(${(_e-2.5).toFixed(1)}, ${_e.toFixed(1)}, relPre));
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
`,Ho=`
  precision highp float;
  ${lo}
  ${co}
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
    // Through the eyepiece the field is only seen inside the circle (an edge of ${wt.toFixed(1)} px); outside the paper stays clean.
    if (uOcular.w > 0.0) {
      float d = distance(gl_FragCoord.xy / uDpr, uOcular.xy);
      a *= mix(1.0, smoothstep(uOcular.z, uOcular.z - ${wt.toFixed(1)}, d), uOcular.w);
    }
    if (a < 0.004) discard;
    vec3 col = mix(GRAPHITE, GRAPHITE_LIGHT, 0.3 + 0.7 * step(0.8, fract(vSeed * 3.17)));
    col = mix(col, GRAPHITE_LIGHT, vLayer > 1.5 ? 0.6 : 0.0);
    col = mix(col, GRAPHITE_DEEP, vLens * 0.6);
    gl_FragColor = vec4(col, a);
  }
`,qe=he=>(.5-he)*window.innerHeight/h,_t=()=>Math.min(window.innerWidth*.92,880)/2/h,Po=1.35;function Fo({entered:he}){const Xe=Ge.useRef(null),Ke=Ge.useRef(he);return Ke.current=he,Ge.useEffect(()=>{const Je=Xe.current;if(!Je)return;let Qe=!1;const g=v.reducedMotion,et=Math.min(window.devicePixelRatio||1,2),C=Nt.prep==="fire",me=je+zt,ge=new Float32Array(me*3),tt=new Float32Array(me),ot=new Float32Array(me),Oe=[[ae,-12],[-12,-3],[-3,_e],[-22,-5]];let D=0;for(let n=0;n<4;n++){const a=n===3?zt:n===2?je-D:Math.round(je*go[n]);for(let A=0;A<a&&D<me;A++,D++)ge[D*3]=(Math.random()-.5)*84,ge[D*3+1]=(Math.random()-.5)*52,ge[D*3+2]=Oe[n][0]+Math.random()*(Oe[n][1]-Oe[n][0]),tt[D]=Math.random(),ot[D]=n}const X=new Jt;X.setAttribute("position",new Ye(ge,3)),X.setAttribute("aSeed",new Ye(tt,1)),X.setAttribute("aLayer",new Ye(ot,1)),X.boundingSphere=new Qt(new y,1e4);const d={uSize:{value:c.size},uDpr:{value:et},uLens:{value:0},uPointer:{value:new Ue(99,99)},uAlpha:{value:c.density},...ro()};d.uDefocus.value=1;const ve=new eo({vertexShader:zo,fragmentShader:Ho,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{...d,uTime:{value:0},uRot:{value:0},uCamZ:{value:M},uCamXY:{value:new Ue},uMotion:{value:g?0:.15},uBreath:{value:0},uWake:{value:0},uFade:{value:0},uOcular:{value:new to(0,0,1,0)}}}),W=new oo,nt=new no(X,ve);W.add(nt);const at=n=>2*Math.atan(n/2/bt)*180/Math.PI,u=new ao(at(window.innerHeight),window.innerWidth/window.innerHeight,.1,200);u.position.set(0,0,M);let ye=u.fov,xe=u.fov;const k=new io({alpha:!0,antialias:!1,powerPreference:"high-performance"});k.setPixelRatio(et),k.setClearColor(0,0),Je.appendChild(k.domElement);const Te=()=>{k.setSize(window.innerWidth,window.innerHeight),u.aspect=window.innerWidth/window.innerHeight,ye=at(window.innerHeight),xe=ye,u.fov=ye,u.updateProjectionMatrix()};Te(),window.addEventListener("resize",Te);const O=Dt(),o=C?null:Mt(d,O,{count:H.count,scale:H.scale,surveillance:!0,phagocytosis:!0,motility:c.motility,tempo:c.tempo,reach:c.reach});o&&(o.group.position.set(7.4,-.9,H.z),W.add(o.group));const we=new y(7.4,-.9,H.z);let be=H.scale;const Ot=()=>{const n=qt();if(!n)return;const a=Xt(n,O.bound);be=a.scale,we.set((a.cx-n.W/2)/h,(n.H/2-a.cy)/h,H.z)},Re=new y;e.heroOnScreen=o?()=>{const n=u.position.z-H.z;return n<=.1||!o.group.visible?null:(Re.copy(o.group.position).project(u),{x:(Re.x*.5+.5)*window.innerWidth,y:(-Re.y*.5+.5)*window.innerHeight,r:O.bound*o.group.scale.x*h*M/n})}:null;let it=0;const st=location.search.includes("debug");st&&(e.zoomLog=[]);const l=C?null:uo(d,5),Fe=new y(9,1,ne.z);l&&(l.group.position.copy(Fe),l.group.visible=!1,W.add(l.group));const Tt=()=>{const n=document.querySelector(".contact-centre"),a=(n==null?void 0:n.closest(".plane"))??null;if(!l||!n||!a)return;const A=window.innerWidth,Le=window.innerHeight,x=(A-a.offsetWidth)/2,ce=.13*Le,I=Kt(n,a),R=x+I.x+n.offsetWidth,B=x+a.offsetWidth,Y=(R+B)/2,Ae=ce+I.y+n.offsetHeight/2,ue=Math.max(ne.minPx,Math.min(ne.maxPx,(B-R)/2-ne.gapPx));Fe.set((Y-A/2)/h,(Le/2-Ae)/h,ne.z),l.group.scale.setScalar(ue/h)},w=C?null:Mt(d,O,{count:oe.count,scale:oe.scale,surveillance:!1,seed:2,atp:!0,motility:c.motility,tempo:c.tempo}),E=C?po(d,2):null,m=w?w.group:new so;E&&(m.scale.setScalar(oe.scale),m.add(E.points)),W.add(m);const se=fo(m,u,()=>e.sheet<.5?O.bound*m.scale.x*1.2:0,n=>{w?w.stimulate(n,{instant:g}):(g||E==null||E.start(n),It.stimulatedAt=performance.now())}),p=Et(d,"research",{channel:!C});p.group.rotation.x=0,p.group.scale.setScalar(fe.scale),W.add(p.group);const i=C?null:Et(d,"methods");i&&(i.group.rotation.x=_.tilt,i.group.scale.setScalar(_.scale),W.add(i.group));const r=C?null:ho(d,"/cv-vorschau/design/");r&&(r.group.position.set(-5,-4,_.z),W.add(r.group));const b=r?Lt(r.group,u,()=>r.hoverEnabled?r.group.scale.x*h*1.1:0,{tilt:!1}):null,rt=new y(-5,-4,_.z);let We=3;const Rt=new y(0,-3,0),Ft=16,Wt=-3*ie-ie/2,Se=new y,Me=new y,re=new y,Ce=()=>{Se.set(fe.x,qe(fe.top),fe.z),Me.set(_.x,qe(_.top),_.z),re.set(oe.x,qe(oe.top),oe.z),p.group.position.copy(Se),i==null||i.group.position.copy(Me),m.position.copy(re)};Ce(),window.addEventListener("resize",Ce);const K=Lt(p.group,u,()=>3.3*p.group.scale.x*h*1.2),Z=o?de(d,1):null,G=w?de(d,2):null,Ee=de(d,3),$=i?de(d,4):null,V=l?de(d,5):null;for(const n of[Z,G,Ee,$,V])n&&W.add(n.points);const le=new y;(location.search.includes("debug")||location.search.includes("tune"))&&(window.__atmos={u:ve.uniforms,renderer:k,camera:u,prep:C?"fire":"wildtype",channel:p.group,methodsChannel:(i==null?void 0:i.group)??null,heroCell:o,aboutCell:w,emblem:l,puff:E,umap:(r==null?void 0:r.group)??null,stimulateAbout:(n,a)=>{const A=se.onScreen();return!!A&&se.at(n??A.x,a??A.y)},aboutOnScreen:()=>se.onScreen()});let De=document.hidden,ke=performance.now(),lt=0;const N={x:0,y:0},T={x:99,y:99},ct=new Ue,Ne=new y().copy(At),L=ve.uniforms;let ut=`${c.motility}|${c.tempo}|${c.reach}`;const J=new y,Ct=n=>{var yt,xt;if(De||Qe)return;const a=Math.min((n-ke)/1e3,.05);ke=n;const A=n/1e3,Le=(g?0:Ke.current?1:.15)*(1-.6*e.sheet);L.uMotion.value=Q(L.uMotion.value,Le,1.2,a);const x=L.uMotion.value;lt+=a*c.rotation*x;const ce=e.enteredAt==null?-1:(n-e.enteredAt)/1e3,I=e.gate&&!g,R=e.zoomAt,B=I?ce<0||R==null?0:jt(n,R):1,Y=!I||R!=null&&n-R>=St,Ae=ce<0?0:B;d.uDefocus.value=1-Ae,e.push=.8*(1-Ae);const ue=Bt(e.station,e.flight),dt=Y?1:0;N.x=g?0:Q(N.x,v.pointer.x*.5*dt,2,a),N.y=g?0:Q(N.y,v.pointer.y*.35*dt,2,a);const U=N.x+ue.x,j=N.y+ue.y;u.position.set(U,j,e.camZ+e.push),u.rotation.z=ue.roll,u.updateMatrixWorld();const ft=ye+(g?0:Zt*Gt(e.flight));if(ft!==xe&&(xe=ft,u.fov=xe,u.updateProjectionMatrix()),L.uTime.value=A,L.uRot.value=lt,L.uCamZ.value=e.camZ+e.push,L.uCamXY.value.set(U,j),L.uBreath.value=g?0:c.breath,L.uWake.value=g?0:c.wake,d.uSize.value=c.size,d.uAlpha.value=c.density*(1-.7*e.sheet),d.uLens.value=!g&&c.lens&&v.pointerSeen?1:0,v.pointerSeen&&!g?Ne.set(v.pointer.x*.9,v.pointer.y*.8+.35,.7).normalize():Ne.copy(At),d.uLight.value.lerp(Ne,1-Math.exp(-2.5*a)).normalize(),v.pointerSeen){const t=window.innerHeight/2/bt*M,s=U+v.pointer.x*t*u.aspect,f=j+v.pointer.y*t;T.x=T.x===99?s:Q(T.x,s,3.5,a),T.y=T.y===99?f:Q(T.y,f,3.5,a),d.uPointer.value.set(T.x,T.y),ct.set(T.x,T.y)}const ht=$t(e.camZ);L.uFade.value=1-ht,nt.visible=ht>.005;let mt=!1;const gt=`${c.motility}|${c.tempo}|${c.reach}`;gt!==ut&&(ut=gt,o==null||o.setMotility({motility:c.motility,tempo:c.tempo,reach:c.reach}),w==null||w.setMotility({motility:c.motility,tempo:c.tempo}));const S=t=>Math.abs(e.camZ-t.position.z-M),Ie=(t,s,f,z)=>f.position.copy(t).addScaledVector(s,1-$e(e.camZ-t.z,z)),vt=t=>1-Math.min(1,Math.max(0,e.camZ-t.position.z-M)/bo);{const t=e.ocular;if(I&&t&&!Y){const s=Vt(t.layout,B);L.uOcular.value.set(s.x,window.innerHeight-s.y,s.R,1-ee(.75,1,B))}else L.uOcular.value.w=0}if(o){if(o.reveal=1,o.draw=1,o.group.visible=S(o.group)<te,e.station===0){Ot();const t=e.ocular;if(I&&!Y&&(t!=null&&t.cellGate)){const s=window.innerWidth,f=window.innerHeight,z=u.position.z-H.z,F=h*M/z,He=O.bound*be*h,q={x:s/2+(we.x-U)*F,y:f/2-(we.y-j)*F,r:He*M/z},P=Yt(t.cellGate,q,B);o.group.position.set(U+(P.x-s/2)/F,j+(f/2-P.y)/F,H.z),o.group.scale.setScalar(P.r*z/(O.bound*h*M)),o.magnify=o.group.scale.x/be,o.defocusShare=.15*(1-B)}else o.group.position.copy(we),o.group.scale.setScalar(be),o.magnify=1,o.defocusShare=I?0:1}if(o.hunger=ce>=0?1:0,o.group.visible){Y&&(it+=a*.15*x),o.group.rotation.y=it+N.x*.3,o.group.rotation.x=-.1+N.y*.18;const t=1-ee(2.5,9,Math.abs(e.camZ-H.z));o.maxPx=H.maxPx+(Ao-H.maxPx)*t;const s=g?0:Math.max(x,1-.6*e.sheet);o.update(a,s,Y&&v.pointerSeen&&!g?ct:null,c.activation)}if(st&&e.zoomLog&&R!=null&&n-R<=St&&e.zoomLog.length<400){const t=(xt=(yt=e).heroOnScreen)==null?void 0:xt.call(yt);t&&e.zoomLog.push({t:n-R,x:t.x,y:t.y,r:t.r,push:e.push})}if(Z){const t=O.bound*o.group.scale.x*.62;Z.place(le.copy(o.group.position),t,t),Z.update(o.group.visible?o.reveal*(1-Math.min(1,S(o.group)/10)):0)}}Ie(re,vo,m);const Be=e.station===1?ee(0,.12,e.flight):0;if(m.position.y+=e.pan/h*(1-Be)+(Ht.y-re.y)*Be,m.position.x+=(Ht.x-re.x)*Be,m.visible=S(m)<te,m.visible)if(m.rotation.y=A*.1*x+.6,w){const t=ee(Pt[0],Pt[1],v.acts.cell);w.update(a,x,null,Math.max(t,c.activation))}else E==null||E.update(a,x,1);if(G){const t=O.bound*m.scale.x*.62;G.place(le.copy(m.position),t,t),G.update(m.visible?1-Math.min(1,S(m)/10):0)}const ze=e.sheet;if(Ie(Se,yo,p.group,xo),p.group.position.x+=(_t()+3.3*fe.scale+.4-Se.x)*ze,p.group.visible=S(p.group)<te,p.group.visible){const t=1-Math.min(1,S(p.group)/10);K.active||(p.group.rotation.y+=a*(.38*x+K.spin),K.spin*=Math.pow(.03,a)),p.ionBoost=1+(Lo-1)*(e.station===1?Math.sin(Math.PI*e.flight):0),p.update(a,x,t,vt(p.group))}{const t=3.3*p.group.scale.x;Ee.place(le.copy(p.group.position).setY(p.group.position.y-t*.25),t*.95,t*.42),Ee.update(p.group.visible?1-Math.min(1,S(p.group)/10):0)}if(i){const t=e.station===2?Math.sin(Math.PI*e.flight):0,s=_.scale*(1+(Po-1)*ze)+(Mo-_.scale)*t;if(i.group.scale.setScalar(s),Ie(Me,wo,i.group),i.group.position.x+=(_t()+3.3*s+.3-Me.x)*ze,i.group.position.y+=(e.station===3?e.pan/h:0)*(1-ze),i.group.visible=S(i.group)<te,i.group.visible){const f=1-Math.min(1,S(i.group)/10);i.group.rotation.x=_.tilt+(So-_.tilt)*t,i.ionBoost=1+(Eo-1)*t,i.group.rotation.y+=a*.3*x,i.update(a,x,f,vt(i.group))}if($){const f=3.3*i.group.scale.x;$.place(le.copy(i.group.position).setY(i.group.position.y-f*.3),f*.95,f*.45),$.update(i.group.visible?1-Math.min(1,S(i.group)/10):0)}}if(l){const t=e.station>=4;if(l.group.visible=t&&S(l.group)<te,l.group.visible){Tt(),l.group.position.copy(Fe),l.group.position.y+=e.station===5?e.pan/h:0,l.draw=g?1:$e(e.camZ-ne.z);let s=null;if(v.pointerSeen&&!g&&e.sheet<.5){J.copy(l.group.position).project(u);const f=l.group.scale.x*h*mo,z=(v.pointer.x-J.x)*.5*window.innerWidth/f,F=(J.y-v.pointer.y)*.5*window.innerHeight/f;Math.hypot(z,F)<1&&(s={x:z,y:F})}l.update(a,x,1-.6*Math.min(1,S(l.group)/30),s),mt=!!s}if(V){const s=l.group.scale.x*.9;V.place(le.copy(l.group.position),s,s*.8),V.update(l.group.visible?l.draw*(1-Math.min(1,S(l.group)/10)):0)}}if(r&&b){const t=-3*ie,s=e.camZ-t,f=Math.abs(s-M)<6&&e.station===3&&e.flight===0,z=e.station===2&&e.flight>0&&s<=36,F=document.getElementById("umap-anchor");if((f||z)&&F){const P=F.getBoundingClientRect();if(P.height>10){const Ze=h*M/s;rt.set(U+(P.left+P.width/2-window.innerWidth/2)/Ze,j+(window.innerHeight/2-(P.top+P.height/2))/Ze,t),We=Math.min(P.width,P.height)/2/Ze*.95}}const He=e.station===3&&e.flight>0?e.flight:0,q=ee(0,.4,He);r.group.position.copy(rt).addScaledVector(Rt,1-$e(e.camZ-t)),r.group.position.lerp(new y(U*.3,j,Wt),q),r.group.scale.setScalar(We+(Ft-We)*q),r.maxPx=9+13*q,r.reveal=Q(r.reveal,r.ready?1-ee(.8,1,He):0,2.5,a),r.hoverEnabled=q<.05&&e.sheet<.5,r.labelsEnabled=q<.3&&e.sheet<.5,r.group.visible=r.ready&&S(r.group)<te&&r.reveal>.01,r.group.visible?(b.active||(r.group.rotation.y+=a*b.spin,b.spin*=Math.pow(.03,a)),r.update(a,x,u,v.pointerSeen?v.pointer:null,!b.active&&!g)):(Pe.labels.length||Pe.hover)&&(Pe.labels=[],Pe.hover=null)}if(pe.active){u.updateMatrixWorld();let t=!1;if(o!=null&&o.group.visible&&e.station===0&&e.flight===0&&e.sheet<.5){J.copy(o.group.position).project(u);const f=(J.x*.5+.5)*window.innerWidth,z=(-J.y*.5+.5)*window.innerHeight;t=Math.hypot(pe.px-f,pe.py-z)<O.bound*o.group.scale.x*h*.75}Ve.object=t||K.hover||!!(b!=null&&b.hover)||mt,Ve.dragging=K.active||!!(b!=null&&b.active);const s=m.visible?se.onScreen():null;Ve.drop=!!s&&Math.hypot(pe.px-s.x,pe.py-s.y)<s.r,Ut(n)}k.render(W,u)},pt=()=>{De=document.hidden,De||(ke=performance.now())};return document.addEventListener("visibilitychange",pt),e.tick=Ct,()=>{Qe=!0,e.tick=null,e.heroOnScreen=null,document.removeEventListener("visibilitychange",pt),window.removeEventListener("resize",Te),window.removeEventListener("resize",Ce),K.dispose(),b==null||b.dispose(),se.dispose(),Z==null||Z.dispose(),G==null||G.dispose(),Ee.dispose(),$==null||$.dispose(),V==null||V.dispose(),l==null||l.dispose(),r==null||r.dispose(),p.dispose(),i==null||i.dispose(),o==null||o.dispose(),w==null||w.dispose(),E==null||E.dispose(),X.dispose(),ve.dispose(),k.dispose(),k.domElement.remove()}},[]),kt.jsx("div",{ref:Xe,className:"atmos fixed inset-0 z-0 pointer-events-none","aria-hidden":"true"})}export{Fo as default};
