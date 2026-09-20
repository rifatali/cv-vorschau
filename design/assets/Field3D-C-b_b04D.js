import{r as Ve,t as c,D as T,j as Ht,s as y,b as Tt,P as ht,G as re,K as m,f as e,a as _t,d as oe,p as zt,F as Rt,g as Ot,h as Ft,e as j,i as Ye,u as Re,k as he,l as qe,m as Wt}from"./index-Cbqe6LR-.js";import{B as kt,a as je,S as Dt,V as M,b as It,c as Ue,d as Nt,P as Ct,e as Bt,W as Zt,G as $t}from"./three-CdPaaKdt.js";import{m as Gt,P as Vt,S as Yt,g as qt,b as mt,d as jt,a as Ut,h as Xt,c as gt,e as Kt,i as vt,f as me,L as xt,E as Jt}from"./UmapCloud-CiuhjqzV.js";import"./motion-BCXewYul.js";const Xe=3e4,Qt=[.64,.33,.03],yt=18e3,ie=-34,Oe=2,ne=28,w={z:0,scale:2.2,scaleMin:1.6,scaleMax:2.4,gapPx:40,headerPx:84,count:3e4,maxPx:12},ae={x:8.4,top:.2,z:-40,scale:1,count:14e3},eo=new M(0,2,0),ge={x:9.6,top:.2,z:-2*re,scale:.85},to=new M(6,3,0),oo=44,H={x:-1.8,top:.215,z:-3*re,scale:.4,tilt:.35},no=new M(.6,.8,0),ao=40,wt={x:6,y:2},so=-.9,io=1,ro=2.4,lo=2.8,co=22,bt=[.34,.5],se={z:-5*re,minPx:110,maxPx:160,gapPx:16},po=`
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
    float L = ${(Oe-ie).toFixed(1)};
    float rel = mod(position.z - uCamZ - (${ie.toFixed(1)}), L) + (${ie.toFixed(1)});
    float relPre = rel;

    // The cloud circles a point in front of you — at the plane in focus — the
    // way the very first version did, its far layer slower than its near one; the dust (layer 3) between them.
    float speed = layer < 0.5 ? 0.5 : (layer < 1.5 ? 1.0 : (layer < 2.5 ? 1.25 : 0.75));
    float ang = uRot * speed;
    vec2 q = vec2(p.x - uCamXY.x, rel + ${T.toFixed(1)});
    float c = cos(ang), s = sin(ang);
    q = vec2(q.x * c + q.y * s, -q.x * s + q.y * c);
    p.x = q.x + uCamXY.x;
    rel = q.y - ${T.toFixed(1)};
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
    float foc = 1.0 - smoothstep(0.0, 15.0, abs(dist - ${T.toFixed(1)}));
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
    float seam = smoothstep(${ie.toFixed(1)}, ${(ie+4).toFixed(1)}, relPre) * (1.0 - smoothstep(${(Oe-2.5).toFixed(1)}, ${Oe.toFixed(1)}, relPre));
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
`,uo=`
  precision highp float;
  ${Vt}
  ${Yt}
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
`,Ke=ve=>(.5-ve)*window.innerHeight/m,Mt=()=>Math.min(window.innerWidth*.92,880)/2/m,fo=1.35;function xo({entered:ve}){const Je=Ve.useRef(null),Qe=Ve.useRef(ve);return Qe.current=ve,Ve.useEffect(()=>{const et=Je.current;if(!et)return;let tt=!1;const b=y.reducedMotion,ot=Math.min(window.devicePixelRatio||1,2),D=Tt.prep==="fire",xe=Xe+yt,ye=new Float32Array(xe*3),nt=new Float32Array(xe),at=new Float32Array(xe),Fe=[[ie,-12],[-12,-3],[-3,Oe],[-22,-5]];let I=0;for(let t=0;t<4;t++){const n=t===3?yt:t===2?Xe-I:Math.round(Xe*Qt[t]);for(let h=0;h<n&&I<xe;h++,I++)ye[I*3]=(Math.random()-.5)*84,ye[I*3+1]=(Math.random()-.5)*52,ye[I*3+2]=Fe[t][0]+Math.random()*(Fe[t][1]-Fe[t][0]),nt[I]=Math.random(),at[I]=t}const U=new kt;U.setAttribute("position",new je(ye,3)),U.setAttribute("aSeed",new je(nt,1)),U.setAttribute("aLayer",new je(at,1)),U.boundingSphere=new Dt(new M,1e4);const f={uSize:{value:c.size},uDpr:{value:ot},uLens:{value:0},uPointer:{value:new Ue(99,99)},uAlpha:{value:c.density},...Gt()};f.uDefocus.value=1;const we=new It({vertexShader:po,fragmentShader:uo,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{...f,uTime:{value:0},uRot:{value:0},uCamZ:{value:T},uCamXY:{value:new Ue},uMotion:{value:b?0:.15},uBreath:{value:0},uWake:{value:0},uFade:{value:0}}}),W=new Nt,st=new Ct(U,we);W.add(st);const it=t=>2*Math.atan(t/2/ht)*180/Math.PI,d=new Bt(it(window.innerHeight),window.innerWidth/window.innerHeight,.1,200);d.position.set(0,0,T);let be=d.fov,Me=d.fov;const N=new Zt({alpha:!0,antialias:!1,powerPreference:"high-performance"});N.setPixelRatio(ot),N.setClearColor(0,0),et.appendChild(N.domElement);const We=()=>{N.setSize(window.innerWidth,window.innerHeight),d.aspect=window.innerWidth/window.innerHeight,be=it(window.innerHeight),Me=be,d.fov=be,d.updateProjectionMatrix()};We(),window.addEventListener("resize",We);const k=qt(),a=D?null:mt(f,k,{count:w.count,scale:w.scale,surveillance:!0,phagocytosis:!0,motility:c.motility,tempo:c.tempo,reach:c.reach});a&&(a.group.position.set(7.4,-.9,w.z),a.reveal=0,W.add(a.group));const ke=new M(7.4,-.9,w.z);let Se=w.scale;const Ee=(t,n)=>{let h=0,S=0,l=t;for(;l&&l!==n;)h+=l.offsetLeft,S+=l.offsetTop,l=l.offsetParent;return{x:h,y:S}},rt=()=>{const t=document.querySelector("[data-name-edge]"),n=document.querySelector("[data-masthead]"),h=document.querySelector("[data-lede]"),S=(n==null?void 0:n.closest(".plane"))??null;if(!t||!n||!S)return;const l=window.innerWidth,R=window.innerHeight,A=(l-S.offsetWidth)/2,O=(R-S.offsetHeight)/2,F=Ee(t,S),J=Ee(n,S),Q=A+F.x+t.offsetWidth,ee=O+J.y+n.offsetHeight*.5,He=A+S.offsetWidth,Te=h?A+Ee(h,S).x+h.offsetWidth:0,_e=.3*w.scaleMax*m,v=Math.max(Q+w.gapPx+_e,Te+w.gapPx),ue=l-v,ze=Math.max(60,Math.min(ue*1.15/2,R*.42,(R-w.headerPx)/2-8));Se=Math.min(w.scaleMax,Math.max(w.scaleMin,ze/(k.bound*m)));const B=k.bound*Se*m,te=Math.max(v+B,Math.min((v+l)/2,He+.2*B-B)),o=Math.max(ee,w.headerPx+B);ke.set((te-l/2)/m,(R/2-o)/m,w.z)},De=new M;e.heroOnScreen=a?()=>{rt(),De.copy(ke).project(d);const t=d.position.z-w.z;return t<=.1?null:{x:(De.x*.5+.5)*window.innerWidth,y:(-De.y*.5+.5)*window.innerHeight,r:k.bound*Se*m*T/t}}:null;const r=D?null:jt(f,5),Ie=new M(9,1,se.z);r&&(r.group.position.copy(Ie),r.group.visible=!1,W.add(r.group));const St=()=>{const t=document.querySelector(".contact-centre"),n=(t==null?void 0:t.closest(".plane"))??null;if(!r||!t||!n)return;const h=window.innerWidth,S=window.innerHeight,l=(h-n.offsetWidth)/2,R=.13*S,A=Ee(t,n),O=l+A.x+t.offsetWidth,F=l+n.offsetWidth,J=(O+F)/2,Q=R+A.y+t.offsetHeight/2,ee=Math.max(se.minPx,Math.min(se.maxPx,(F-O)/2-se.gapPx));Ie.set((J-h/2)/m,(S/2-Q)/m,se.z),r.group.scale.setScalar(ee/m)},E=D?null:mt(f,k,{count:ae.count,scale:ae.scale,surveillance:!1,seed:2,atp:!0,motility:c.motility,tempo:c.tempo}),L=D?Ut(f,2):null,g=E?E.group:new $t;L&&(g.scale.setScalar(ae.scale),g.add(L.points)),W.add(g);const le=Xt(g,d,()=>e.sheet<.5?k.bound*g.scale.x*1.2:0,t=>{E?E.stimulate(t,{instant:b}):(b||L==null||L.start(t),_t.stimulatedAt=performance.now())}),p=gt(f,"research",{channel:!D});p.group.rotation.x=0,p.group.scale.setScalar(ge.scale),W.add(p.group);const s=D?null:gt(f,"methods");s&&(s.group.rotation.x=H.tilt,s.group.scale.setScalar(H.scale),W.add(s.group));const i=D?null:Kt(f,"/cv-vorschau/design/");i&&(i.group.position.set(-5,-4,H.z),W.add(i.group));const P=i?vt(i.group,d,()=>i.hoverEnabled?i.group.scale.x*m*1.1:0,{tilt:!1}):null,lt=new M(-5,-4,H.z);let Ne=3;const Et=new M(0,-3,0),Pt=16,Lt=-3*re-re/2,Pe=new M,Le=new M,ce=new M,Ce=()=>{Pe.set(ge.x,Ke(ge.top),ge.z),Le.set(H.x,Ke(H.top),H.z),ce.set(ae.x,Ke(ae.top),ae.z),p.group.position.copy(Pe),s==null||s.group.position.copy(Le),g.position.copy(ce)};Ce(),window.addEventListener("resize",Ce);const X=vt(p.group,d,()=>3.3*p.group.scale.x*m*1.2),$=a?me(f,1):null,G=E?me(f,2):null,Ae=me(f,3),V=s?me(f,4):null,Y=r?me(f,5):null;for(const t of[$,G,Ae,V,Y])t&&W.add(t.points);const pe=new M;(location.search.includes("debug")||location.search.includes("tune"))&&(window.__atmos={u:we.uniforms,renderer:N,camera:d,prep:D?"fire":"wildtype",channel:p.group,methodsChannel:(s==null?void 0:s.group)??null,heroCell:a,aboutCell:E,emblem:r,puff:L,umap:(i==null?void 0:i.group)??null,stimulateAbout:(t,n)=>{const h=le.onScreen();return!!h&&le.at(t??h.x,n??h.y)},aboutOnScreen:()=>le.onScreen()});let Be=document.hidden,Ze=performance.now(),ct=0;const C={x:0,y:0},_={x:99,y:99},pt=new Ue,$e=new M().copy(xt),z=we.uniforms;let ut=`${c.motility}|${c.tempo}|${c.reach}`;const K=new M,At=t=>{if(Be||tt)return;const n=Math.min((t-Ze)/1e3,.05);Ze=t;const h=t/1e3,S=(b?0:Qe.current?1:.15)*(1-.6*e.sheet);z.uMotion.value=oe(z.uMotion.value,S,1.2,n);const l=z.uMotion.value;ct+=n*c.rotation*l;const R=zt(e.station,e.flight);C.x=b?0:oe(C.x,y.pointer.x*.5,2,n),C.y=b?0:oe(C.y,y.pointer.y*.35,2,n);const A=C.x+R.x,O=C.y+R.y,F=e.enteredAt==null?-1:(t-e.enteredAt)/1e3,J=e.gate&&!b,Q=F<0?0:J?j(0,1,F/1.6):1;f.uDefocus.value=1-Q,e.push=.8*(1-Q),d.position.set(A,O,e.camZ+e.push),d.rotation.z=R.roll;const ee=be+(b?0:Rt*Ot(e.flight));if(ee!==Me&&(Me=ee,d.fov=Me,d.updateProjectionMatrix()),z.uTime.value=h,z.uRot.value=ct,z.uCamZ.value=e.camZ+e.push,z.uCamXY.value.set(A,O),z.uBreath.value=b?0:c.breath,z.uWake.value=b?0:c.wake,f.uSize.value=c.size,f.uAlpha.value=c.density*(1-.7*e.sheet),f.uLens.value=!b&&c.lens&&y.pointerSeen?1:0,y.pointerSeen&&!b?$e.set(y.pointer.x*.9,y.pointer.y*.8+.35,.7).normalize():$e.copy(xt),f.uLight.value.lerp($e,1-Math.exp(-2.5*n)).normalize(),y.pointerSeen){const o=window.innerHeight/2/ht*T,u=A+y.pointer.x*o*d.aspect,x=O+y.pointer.y*o;_.x=_.x===99?u:oe(_.x,u,3.5,n),_.y=_.y===99?x:oe(_.y,x,3.5,n),f.uPointer.value.set(_.x,_.y),pt.set(_.x,_.y)}const He=Ft(e.camZ);z.uFade.value=1-He,st.visible=He>.005;let Te=!1;const _e=`${c.motility}|${c.tempo}|${c.reach}`;_e!==ut&&(ut=_e,a==null||a.setMotility({motility:c.motility,tempo:c.tempo,reach:c.reach}),E==null||E.setMotility({motility:c.motility,tempo:c.tempo}));const v=o=>Math.abs(e.camZ-o.position.z-T),ue=(o,u,x,Z)=>x.position.copy(o).addScaledVector(u,1-Ye(e.camZ-o.z,Z)),ze=o=>1-Math.min(1,Math.max(0,e.camZ-o.position.z-T)/ao);if(a){if(a.reveal=F>=0?1:0,a.draw=F<0?0:J?j(0,1,(F-.8)/.6):1,a.group.visible=v(a.group)<ne&&a.draw>.001,e.station===0&&(rt(),a.group.position.copy(ke),a.group.scale.setScalar(Se)),a.group.visible){a.group.rotation.y=h*.15*l+C.x*.3,a.group.rotation.x=-.1+C.y*.18;const o=1-j(2.5,9,Math.abs(e.camZ-w.z));a.maxPx=w.maxPx+(co-w.maxPx)*o,a.update(n,l,y.pointerSeen&&!b?pt:null,c.activation)}if($){const o=k.bound*a.group.scale.x*.62;$.place(pe.copy(a.group.position),o,o),$.update(a.group.visible?a.reveal*(1-Math.min(1,v(a.group)/10)):0)}}ue(ce,eo,g);const B=e.station===1?j(0,.12,e.flight):0;if(g.position.y+=e.pan/m*(1-B)+(wt.y-ce.y)*B,g.position.x+=(wt.x-ce.x)*B,g.visible=v(g)<ne,g.visible)if(g.rotation.y=h*.1*l+.6,E){const o=j(bt[0],bt[1],y.acts.cell);E.update(n,l,null,Math.max(o,c.activation))}else L==null||L.update(n,l,1);if(G){const o=k.bound*g.scale.x*.62;G.place(pe.copy(g.position),o,o),G.update(g.visible?1-Math.min(1,v(g)/10):0)}const te=e.sheet;if(ue(Pe,to,p.group,oo),p.group.position.x+=(Mt()+3.3*ge.scale+.4-Pe.x)*te,p.group.visible=v(p.group)<ne,p.group.visible){const o=1-Math.min(1,v(p.group)/10);X.active||(p.group.rotation.y+=n*(.38*l+X.spin),X.spin*=Math.pow(.03,n)),p.ionBoost=1+(lo-1)*(e.station===1?Math.sin(Math.PI*e.flight):0),p.update(n,l,o,ze(p.group))}{const o=3.3*p.group.scale.x;Ae.place(pe.copy(p.group.position).setY(p.group.position.y-o*.25),o*.95,o*.42),Ae.update(p.group.visible?1-Math.min(1,v(p.group)/10):0)}if(s){const o=e.station===2?Math.sin(Math.PI*e.flight):0,u=H.scale*(1+(fo-1)*te)+(io-H.scale)*o;if(s.group.scale.setScalar(u),ue(Le,no,s.group),s.group.position.x+=(Mt()+3.3*u+.3-Le.x)*te,s.group.position.y+=(e.station===3?e.pan/m:0)*(1-te),s.group.visible=v(s.group)<ne,s.group.visible){const x=1-Math.min(1,v(s.group)/10);s.group.rotation.x=H.tilt+(so-H.tilt)*o,s.ionBoost=1+(ro-1)*o,s.group.rotation.y+=n*.3*l,s.update(n,l,x,ze(s.group))}if(V){const x=3.3*s.group.scale.x;V.place(pe.copy(s.group.position).setY(s.group.position.y-x*.3),x*.95,x*.45),V.update(s.group.visible?1-Math.min(1,v(s.group)/10):0)}}if(r){const o=e.station>=4;if(r.group.visible=o&&v(r.group)<ne,r.group.visible){St(),r.group.position.copy(Ie),r.group.position.y+=e.station===5?e.pan/m:0,r.draw=b?1:Ye(e.camZ-se.z);let u=null;if(y.pointerSeen&&!b&&e.sheet<.5){K.copy(r.group.position).project(d);const x=r.group.scale.x*m*Jt,Z=(y.pointer.x-K.x)*.5*window.innerWidth/x,de=(K.y-y.pointer.y)*.5*window.innerHeight/x;Math.hypot(Z,de)<1&&(u={x:Z,y:de})}r.update(n,l,1-.6*Math.min(1,v(r.group)/30),u),Te=!!u}if(Y){const u=r.group.scale.x*.9;Y.place(pe.copy(r.group.position),u,u*.8),Y.update(r.group.visible?r.draw*(1-Math.min(1,v(r.group)/10)):0)}}if(i&&P){const o=-3*re,u=e.camZ-o,x=Math.abs(u-T)<6&&e.station===3&&e.flight===0,Z=e.station===2&&e.flight>0&&u<=36,de=document.getElementById("umap-anchor");if((x||Z)&&de){const q=de.getBoundingClientRect();if(q.height>10){const Ge=m*T/u;lt.set(A+(q.left+q.width/2-window.innerWidth/2)/Ge,O+(window.innerHeight/2-(q.top+q.height/2))/Ge,o),Ne=Math.min(q.width,q.height)/2/Ge*.95}}const ft=e.station===3&&e.flight>0?e.flight:0,fe=j(0,.4,ft);i.group.position.copy(lt).addScaledVector(Et,1-Ye(e.camZ-o)),i.group.position.lerp(new M(A*.3,O,Lt),fe),i.group.scale.setScalar(Ne+(Pt-Ne)*fe),i.maxPx=9+13*fe,i.reveal=oe(i.reveal,i.ready?1-j(.8,1,ft):0,2.5,n),i.hoverEnabled=fe<.05&&e.sheet<.5,i.labelsEnabled=fe<.3&&e.sheet<.5,i.group.visible=i.ready&&v(i.group)<ne&&i.reveal>.01,i.group.visible?(P.active||(i.group.rotation.y+=n*P.spin,P.spin*=Math.pow(.03,n)),i.update(n,l,d,y.pointerSeen?y.pointer:null,!P.active&&!b)):(Re.labels.length||Re.hover)&&(Re.labels=[],Re.hover=null)}if(he.active){d.updateMatrixWorld();let o=!1;if(a!=null&&a.group.visible&&e.station===0&&e.flight===0&&e.sheet<.5){K.copy(a.group.position).project(d);const x=(K.x*.5+.5)*window.innerWidth,Z=(-K.y*.5+.5)*window.innerHeight;o=Math.hypot(he.px-x,he.py-Z)<k.bound*a.group.scale.x*m*.75}qe.object=o||X.hover||!!(P!=null&&P.hover)||Te,qe.dragging=X.active||!!(P!=null&&P.active);const u=g.visible?le.onScreen():null;qe.drop=!!u&&Math.hypot(he.px-u.x,he.py-u.y)<u.r,Wt(t)}N.render(W,d)},dt=()=>{Be=document.hidden,Be||(Ze=performance.now())};return document.addEventListener("visibilitychange",dt),e.tick=At,()=>{tt=!0,e.tick=null,e.heroOnScreen=null,document.removeEventListener("visibilitychange",dt),window.removeEventListener("resize",We),window.removeEventListener("resize",Ce),X.dispose(),P==null||P.dispose(),le.dispose(),$==null||$.dispose(),G==null||G.dispose(),Ae.dispose(),V==null||V.dispose(),Y==null||Y.dispose(),r==null||r.dispose(),i==null||i.dispose(),p.dispose(),s==null||s.dispose(),a==null||a.dispose(),E==null||E.dispose(),L==null||L.dispose(),U.dispose(),we.dispose(),N.dispose(),N.domElement.remove()}},[]),Ht.jsx("div",{ref:Je,className:"atmos fixed inset-0 z-0 pointer-events-none","aria-hidden":"true"})}export{xo as default};
