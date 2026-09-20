import{r as Be,t as c,D as F,j as Et,s as g,b as Pt,P as ct,G as se,K as v,a as Lt,f as e,d as ee,p as At,F as Tt,g as _t,h as Ht,e as U,i as Ge,u as Te}from"./index-Dqlpft0Y.js";import{B as zt,a as Ze,S as Rt,V as S,b as Ft,c as $e,d as Ot,P as Wt,e as Ct,W as Dt,G as It}from"./three-CdPaaKdt.js";import{m as Nt,P as kt,S as Bt,g as Gt,b as pt,d as Zt,a as $t,h as Vt,c as ut,e as Yt,i as dt,f as ue,L as ft,E as qt}from"./UmapCloud-DLqQEINR.js";import"./motion-BCXewYul.js";const Ve=3e4,Ut=[.64,.33,.03],ht=18e3,ne=-34,_e=2,te=28,w={z:0,scale:2.2,scaleMin:1.6,scaleMax:2.4,gapPx:40,headerPx:84,count:3e4,maxPx:12},oe={x:8.4,top:.2,z:-40,scale:1,count:14e3},jt=new S(0,2,0),de={x:9.6,top:.2,z:-2*se,scale:.85},Xt=new S(6,3,0),Kt=44,A={x:-1.8,top:.215,z:-3*se,scale:.4,tilt:.35},Jt=new S(.6,.8,0),Qt=40,mt={x:6,y:2},eo=-.9,to=1,oo=2.4,ao=2.8,no=22,gt=[.34,.5],ae={z:-5*se,minPx:110,maxPx:160,gapPx:16},so=`
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
    float L = ${(_e-ne).toFixed(1)};
    float rel = mod(position.z - uCamZ - (${ne.toFixed(1)}), L) + (${ne.toFixed(1)});
    float relPre = rel;

    // The cloud circles a point in front of you — at the plane in focus — the
    // way the very first version did, its far layer slower than its near one; the dust (layer 3) between them.
    float speed = layer < 0.5 ? 0.5 : (layer < 1.5 ? 1.0 : (layer < 2.5 ? 1.25 : 0.75));
    float ang = uRot * speed;
    vec2 q = vec2(p.x - uCamXY.x, rel + ${F.toFixed(1)});
    float c = cos(ang), s = sin(ang);
    q = vec2(q.x * c + q.y * s, -q.x * s + q.y * c);
    p.x = q.x + uCamXY.x;
    rel = q.y - ${F.toFixed(1)};
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
    float foc = 1.0 - smoothstep(0.0, 15.0, abs(dist - ${F.toFixed(1)}));
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
    float seam = smoothstep(${ne.toFixed(1)}, ${(ne+4).toFixed(1)}, relPre) * (1.0 - smoothstep(${(_e-2.5).toFixed(1)}, ${_e.toFixed(1)}, relPre));
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
`,io=`
  precision highp float;
  ${kt}
  ${Bt}
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
`,Ye=fe=>(.5-fe)*window.innerHeight/v,vt=()=>Math.min(window.innerWidth*.92,880)/2/v,ro=1.35;function fo({entered:fe}){const qe=Be.useRef(null),Ue=Be.useRef(fe);return Ue.current=fe,Be.useEffect(()=>{const je=qe.current;if(!je)return;let Xe=!1;const x=g.reducedMotion,Ke=Math.min(window.devicePixelRatio||1,2),C=Pt.prep==="fire",he=Ve+ht,me=new Float32Array(he*3),Je=new Float32Array(he),Qe=new Float32Array(he),He=[[ne,-12],[-12,-3],[-3,_e],[-22,-5]];let D=0;for(let t=0;t<4;t++){const o=t===3?ht:t===2?Ve-D:Math.round(Ve*Ut[t]);for(let d=0;d<o&&D<he;d++,D++)me[D*3]=(Math.random()-.5)*84,me[D*3+1]=(Math.random()-.5)*52,me[D*3+2]=He[t][0]+Math.random()*(He[t][1]-He[t][0]),Je[D]=Math.random(),Qe[D]=t}const j=new zt;j.setAttribute("position",new Ze(me,3)),j.setAttribute("aSeed",new Ze(Je,1)),j.setAttribute("aLayer",new Ze(Qe,1)),j.boundingSphere=new Rt(new S,1e4);const u={uSize:{value:c.size},uDpr:{value:Ke},uLens:{value:0},uPointer:{value:new $e(99,99)},uAlpha:{value:c.density},...Nt()};u.uDefocus.value=1;const ge=new Ft({vertexShader:so,fragmentShader:io,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{...u,uTime:{value:0},uRot:{value:0},uCamZ:{value:F},uCamXY:{value:new $e},uMotion:{value:x?0:.15},uBreath:{value:0},uWake:{value:0},uFade:{value:0}}}),O=new Ot,et=new Wt(j,ge);O.add(et);const tt=t=>2*Math.atan(t/2/ct)*180/Math.PI,h=new Ct(tt(window.innerHeight),window.innerWidth/window.innerHeight,.1,200);h.position.set(0,0,F);let ve=h.fov,xe=h.fov;const I=new Dt({alpha:!0,antialias:!1,powerPreference:"high-performance"});I.setPixelRatio(Ke),I.setClearColor(0,0),je.appendChild(I.domElement);const ze=()=>{I.setSize(window.innerWidth,window.innerHeight),h.aspect=window.innerWidth/window.innerHeight,ve=tt(window.innerHeight),xe=ve,h.fov=ve,h.updateProjectionMatrix()};ze(),window.addEventListener("resize",ze);const B=Gt(),s=C?null:pt(u,B,{count:w.count,scale:w.scale,surveillance:!0,phagocytosis:!0,motility:c.motility,tempo:c.tempo,reach:c.reach});s&&(s.group.position.set(7.4,-.9,w.z),s.reveal=0,O.add(s.group));const ot=new S(7.4,-.9,w.z);let Re=w.scale;const ye=(t,o)=>{let d=0,b=0,l=t;for(;l&&l!==o;)d+=l.offsetLeft,b+=l.offsetTop,l=l.offsetParent;return{x:d,y:b}},xt=()=>{const t=document.querySelector("[data-name-edge]"),o=document.querySelector("[data-masthead]"),d=document.querySelector("[data-lede]"),b=(o==null?void 0:o.closest(".plane"))??null;if(!t||!o||!b)return;const l=window.innerWidth,H=window.innerHeight,L=(l-b.offsetWidth)/2,z=(H-b.offsetHeight)/2,R=ye(t,b),X=ye(o,b),K=L+R.x+t.offsetWidth,J=z+X.y+o.offsetHeight*.5,Pe=L+b.offsetWidth,Le=d?L+ye(d,b).x+d.offsetWidth:0,y=.3*w.scaleMax*v,Y=Math.max(K+w.gapPx+y,Le+w.gapPx),Ae=l-Y,le=Math.max(60,Math.min(Ae*1.15/2,H*.42,(H-w.headerPx)/2-8));Re=Math.min(w.scaleMax,Math.max(w.scaleMin,le/(B.bound*v)));const W=B.bound*Re*v,a=Math.max(Y+W,Math.min((Y+l)/2,Pe+.2*W-W)),f=Math.max(J,w.headerPx+W);ot.set((a-l/2)/v,(H/2-f)/v,w.z)},r=C?null:Zt(u,5),Fe=new S(9,1,ae.z);r&&(r.group.position.copy(Fe),r.group.visible=!1,O.add(r.group));const yt=()=>{const t=document.querySelector(".contact-centre"),o=(t==null?void 0:t.closest(".plane"))??null;if(!r||!t||!o)return;const d=window.innerWidth,b=window.innerHeight,l=(d-o.offsetWidth)/2,H=.13*b,L=ye(t,o),z=l+L.x+t.offsetWidth,R=l+o.offsetWidth,X=(z+R)/2,K=H+L.y+t.offsetHeight/2,J=Math.max(ae.minPx,Math.min(ae.maxPx,(R-z)/2-ae.gapPx));Fe.set((X-d/2)/v,(b/2-K)/v,ae.z),r.group.scale.setScalar(J/v)},E=C?null:pt(u,B,{count:oe.count,scale:oe.scale,surveillance:!1,seed:2,atp:!0,motility:c.motility,tempo:c.tempo}),P=C?$t(u,2):null,m=E?E.group:new It;P&&(m.scale.setScalar(oe.scale),m.add(P.points)),O.add(m);const we=Vt(m,h,()=>e.sheet<.5?B.bound*m.scale.x*1.2:0,t=>{E?E.stimulate(t,{instant:x}):(x||P==null||P.start(t),Lt.stimulatedAt=performance.now())}),p=ut(u,"research",{channel:!C});p.group.rotation.x=0,p.group.scale.setScalar(de.scale),O.add(p.group);const n=C?null:ut(u,"methods");n&&(n.group.rotation.x=A.tilt,n.group.scale.setScalar(A.scale),O.add(n.group));const i=C?null:Yt(u,"/cv-vorschau/design/");i&&(i.group.position.set(-5,-4,A.z),O.add(i.group));const N=i?dt(i.group,h,()=>i.hoverEnabled?i.group.scale.x*v*1.1:0,{tilt:!1}):null,at=new S(-5,-4,A.z);let Oe=3;const wt=new S(0,-3,0),bt=16,Mt=-3*se-se/2,be=new S,Me=new S,ie=new S,We=()=>{be.set(de.x,Ye(de.top),de.z),Me.set(A.x,Ye(A.top),A.z),ie.set(oe.x,Ye(oe.top),oe.z),p.group.position.copy(be),n==null||n.group.position.copy(Me),m.position.copy(ie)};We(),window.addEventListener("resize",We);const Se=dt(p.group,h,()=>3.3*p.group.scale.x*v*1.2),G=s?ue(u,1):null,Z=E?ue(u,2):null,Ee=ue(u,3),$=n?ue(u,4):null,V=r?ue(u,5):null;for(const t of[G,Z,Ee,$,V])t&&O.add(t.points);const re=new S;(location.search.includes("debug")||location.search.includes("tune"))&&(window.__atmos={u:ge.uniforms,renderer:I,camera:h,prep:C?"fire":"wildtype",channel:p.group,methodsChannel:(n==null?void 0:n.group)??null,heroCell:s,aboutCell:E,emblem:r,puff:P,umap:(i==null?void 0:i.group)??null,stimulateAbout:(t,o)=>{const d=we.onScreen();return!!d&&we.at(t??d.x,o??d.y)},aboutOnScreen:()=>we.onScreen()});let Ce=document.hidden,De=performance.now(),nt=0;const k={x:0,y:0},T={x:99,y:99},st=new $e,Ie=new S().copy(ft),_=ge.uniforms;let it=`${c.motility}|${c.tempo}|${c.reach}`;const Ne=new S,St=t=>{if(Ce||Xe)return;const o=Math.min((t-De)/1e3,.05);De=t;const d=t/1e3,b=(x?0:Ue.current?1:.15)*(1-.6*e.sheet);_.uMotion.value=ee(_.uMotion.value,b,1.2,o);const l=_.uMotion.value;nt+=o*c.rotation*l;const H=At(e.station,e.flight);k.x=x?0:ee(k.x,g.pointer.x*.5,2,o),k.y=x?0:ee(k.y,g.pointer.y*.35,2,o);const L=k.x+H.x,z=k.y+H.y,R=e.enteredAt==null?-1:(t-e.enteredAt)/1e3,X=e.gate&&!x,K=R<0?0:X?U(0,1,R/1.6):1;u.uDefocus.value=1-K,e.push=.8*(1-K),h.position.set(L,z,e.camZ+e.push),h.rotation.z=H.roll;const J=ve+(x?0:Tt*_t(e.flight));if(J!==xe&&(xe=J,h.fov=xe,h.updateProjectionMatrix()),_.uTime.value=d,_.uRot.value=nt,_.uCamZ.value=e.camZ+e.push,_.uCamXY.value.set(L,z),_.uBreath.value=x?0:c.breath,_.uWake.value=x?0:c.wake,u.uSize.value=c.size,u.uAlpha.value=c.density*(1-.7*e.sheet),u.uLens.value=!x&&c.lens&&g.pointerSeen?1:0,g.pointerSeen&&!x?Ie.set(g.pointer.x*.9,g.pointer.y*.8+.35,.7).normalize():Ie.copy(ft),u.uLight.value.lerp(Ie,1-Math.exp(-2.5*o)).normalize(),g.pointerSeen){const a=window.innerHeight/2/ct*F,f=L+g.pointer.x*a*h.aspect,M=z+g.pointer.y*a;T.x=T.x===99?f:ee(T.x,f,3.5,o),T.y=T.y===99?M:ee(T.y,M,3.5,o),u.uPointer.value.set(T.x,T.y),st.set(T.x,T.y)}const Pe=Ht(e.camZ);_.uFade.value=1-Pe,et.visible=Pe>.005;const Le=`${c.motility}|${c.tempo}|${c.reach}`;Le!==it&&(it=Le,s==null||s.setMotility({motility:c.motility,tempo:c.tempo,reach:c.reach}),E==null||E.setMotility({motility:c.motility,tempo:c.tempo}));const y=a=>Math.abs(e.camZ-a.position.z-F),Y=(a,f,M,Q)=>M.position.copy(a).addScaledVector(f,1-Ge(e.camZ-a.z,Q)),Ae=a=>1-Math.min(1,Math.max(0,e.camZ-a.position.z-F)/Qt);if(s){if(s.reveal=R>=0?1:0,s.draw=R<0?0:X?U(0,1,(R-.5)/1.2):1,s.group.visible=y(s.group)<te&&s.draw>.001,e.station===0&&(xt(),s.group.position.copy(ot),s.group.scale.setScalar(Re)),s.group.visible){s.group.rotation.y=d*.15*l+k.x*.3,s.group.rotation.x=-.1+k.y*.18;const a=1-U(2.5,9,Math.abs(e.camZ-w.z));s.maxPx=w.maxPx+(no-w.maxPx)*a,s.update(o,l,g.pointerSeen&&!x?st:null,c.activation)}if(G){const a=B.bound*s.group.scale.x*.62;G.place(re.copy(s.group.position),a,a),G.update(s.group.visible?s.reveal*(1-Math.min(1,y(s.group)/10)):0)}}Y(ie,jt,m);const le=e.station===1?U(0,.12,e.flight):0;if(m.position.y+=e.pan/v*(1-le)+(mt.y-ie.y)*le,m.position.x+=(mt.x-ie.x)*le,m.visible=y(m)<te,m.visible)if(m.rotation.y=d*.1*l+.6,E){const a=U(gt[0],gt[1],g.acts.cell);E.update(o,l,null,Math.max(a,c.activation))}else P==null||P.update(o,l,1);if(Z){const a=B.bound*m.scale.x*.62;Z.place(re.copy(m.position),a,a),Z.update(m.visible?1-Math.min(1,y(m)/10):0)}const W=e.sheet;if(Y(be,Xt,p.group,Kt),p.group.position.x+=(vt()+3.3*de.scale+.4-be.x)*W,p.group.visible=y(p.group)<te,p.group.visible){const a=1-Math.min(1,y(p.group)/10);Se.active||(p.group.rotation.y+=o*(.38*l+Se.spin),Se.spin*=Math.pow(.03,o)),p.ionBoost=1+(ao-1)*(e.station===1?Math.sin(Math.PI*e.flight):0),p.update(o,l,a,Ae(p.group))}{const a=3.3*p.group.scale.x;Ee.place(re.copy(p.group.position).setY(p.group.position.y-a*.25),a*.95,a*.42),Ee.update(p.group.visible?1-Math.min(1,y(p.group)/10):0)}if(n){const a=e.station===2?Math.sin(Math.PI*e.flight):0,f=A.scale*(1+(ro-1)*W)+(to-A.scale)*a;if(n.group.scale.setScalar(f),Y(Me,Jt,n.group),n.group.position.x+=(vt()+3.3*f+.3-Me.x)*W,n.group.position.y+=(e.station===3?e.pan/v:0)*(1-W),n.group.visible=y(n.group)<te,n.group.visible){const M=1-Math.min(1,y(n.group)/10);n.group.rotation.x=A.tilt+(eo-A.tilt)*a,n.ionBoost=1+(oo-1)*a,n.group.rotation.y+=o*.3*l,n.update(o,l,M,Ae(n.group))}if($){const M=3.3*n.group.scale.x;$.place(re.copy(n.group.position).setY(n.group.position.y-M*.3),M*.95,M*.45),$.update(n.group.visible?1-Math.min(1,y(n.group)/10):0)}}if(r){const a=e.station>=4;if(r.group.visible=a&&y(r.group)<te,r.group.visible){yt(),r.group.position.copy(Fe),r.group.position.y+=e.station===5?e.pan/v:0,r.draw=x?1:Ge(e.camZ-ae.z);let f=null;if(g.pointerSeen&&!x&&e.sheet<.5){Ne.copy(r.group.position).project(h);const M=r.group.scale.x*v*qt,Q=(g.pointer.x-Ne.x)*.5*window.innerWidth/M,ce=(Ne.y-g.pointer.y)*.5*window.innerHeight/M;Math.hypot(Q,ce)<1&&(f={x:Q,y:ce})}r.update(o,l,1-.6*Math.min(1,y(r.group)/30),f)}if(V){const f=r.group.scale.x*.9;V.place(re.copy(r.group.position),f,f*.8),V.update(r.group.visible?r.draw*(1-Math.min(1,y(r.group)/10)):0)}}if(i&&N){const a=-3*se,f=e.camZ-a,M=Math.abs(f-F)<6&&e.station===3&&e.flight===0,Q=e.station===2&&e.flight>0&&f<=36,ce=document.getElementById("umap-anchor");if((M||Q)&&ce){const q=ce.getBoundingClientRect();if(q.height>10){const ke=v*F/f;at.set(L+(q.left+q.width/2-window.innerWidth/2)/ke,z+(window.innerHeight/2-(q.top+q.height/2))/ke,a),Oe=Math.min(q.width,q.height)/2/ke*.95}}const lt=e.station===3&&e.flight>0?e.flight:0,pe=U(0,.4,lt);i.group.position.copy(at).addScaledVector(wt,1-Ge(e.camZ-a)),i.group.position.lerp(new S(L*.3,z,Mt),pe),i.group.scale.setScalar(Oe+(bt-Oe)*pe),i.maxPx=9+13*pe,i.reveal=ee(i.reveal,i.ready?1-U(.8,1,lt):0,2.5,o),i.hoverEnabled=pe<.05&&e.sheet<.5,i.labelsEnabled=pe<.3&&e.sheet<.5,i.group.visible=i.ready&&y(i.group)<te&&i.reveal>.01,i.group.visible?(N.active||(i.group.rotation.y+=o*N.spin,N.spin*=Math.pow(.03,o)),i.update(o,l,h,g.pointerSeen?g.pointer:null,!N.active&&!x)):(Te.labels.length||Te.hover)&&(Te.labels=[],Te.hover=null)}I.render(O,h)},rt=()=>{Ce=document.hidden,Ce||(De=performance.now())};return document.addEventListener("visibilitychange",rt),e.tick=St,()=>{Xe=!0,e.tick=null,document.removeEventListener("visibilitychange",rt),window.removeEventListener("resize",ze),window.removeEventListener("resize",We),Se.dispose(),N==null||N.dispose(),we.dispose(),G==null||G.dispose(),Z==null||Z.dispose(),Ee.dispose(),$==null||$.dispose(),V==null||V.dispose(),r==null||r.dispose(),i==null||i.dispose(),p.dispose(),n==null||n.dispose(),s==null||s.dispose(),E==null||E.dispose(),P==null||P.dispose(),j.dispose(),ge.dispose(),I.dispose(),I.domElement.remove()}},[]),Et.jsx("div",{ref:qe,className:"atmos fixed inset-0 z-0 pointer-events-none","aria-hidden":"true"})}export{fo as default};
