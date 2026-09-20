import{r as Te,t as p,g as dt,s as E,a as ht,b as de,c as ft,j as mt,d as f,e as z,u as Ye}from"./index-BSd3L5X4.js";import{B as vt,a as ze,S as gt,V as Xe,b as wt,c as yt,d as xt,P as bt,G as Mt,e as St,W as At}from"./three-BH243BCb.js";import{g as $}from"./motion-BCXewYul.js";import{m as Et,P as Tt,S as zt,b as Je,a as Lt,c as Pt,d as Rt,e as Ht,f as _t,g as Qe,W as Le,C as et,E as kt,h as Ft}from"./UmapCloud-DAPhtCBN.js";const tt={desktop:26e3,mobile:6e3},Dt=[.64,.33,.03],Bt=.6,ot={desktop:.42,mobile:.65},Ct=.85,V=13,he=42,N=-16,fe=6,at={count:6e3,fit:1},Nt=1.2,nt={count:6e3,fit:1.05},Ot={fit:.95},Z={depth:6,settle:7,turn:.9},T={full:2.7,near:1.6,maxPx:16,zoomMax:6,zoomPow:.8,zoomNear:1.5,springBelow:1.3,tilt:.22},It=`
  attribute float aSeed;
  attribute float aLayer;      // 0 far, 1 mid, 2 near
  uniform float uTime;
  uniform float uRot;          // the space turning about you
  uniform float uFlight;       // how far the space has streamed toward you
  uniform float uScroll;       // viewports scrolled
  uniform float uMotion;
  uniform float uSize;
  uniform float uDpr;
  uniform float uReadZone;
  uniform float uBreath;
  uniform float uWake;
  uniform float uLens;
  uniform float uDefocus;      // 1 before the objective is set: soft, large, pale
  uniform float uMag;
  uniform vec2 uPointer;       // world xy, eased
  varying float vAlpha;
  varying float vSeed;
  varying float vLayer;
  varying float vLens;
  varying float vPx;
  varying float vSharp;

  vec3 rotY(vec3 v, float a) {
    float c = cos(a), s = sin(a);
    return vec3(v.x * c + v.z * s, v.y, -v.x * s + v.z * c);
  }

  void main() {
    vec3 p = position;
    float layer = aLayer;
    // The dust (layer 3) moves like something between the far and the middle layer.
    float dust = step(2.5, layer);
    float lay = mix(layer, 0.6, dust);

    // Flight: the volume streams toward the camera and wraps in depth.
    p.z = mod(p.z + uFlight - (${N.toFixed(1)}), ${(fe-N).toFixed(1)}) + (${N.toFixed(1)});
    float zf = p.z;

    // Parallax with the scroll: far barely, near a lot. Wraps vertically.
    float depthK = 0.35 + 0.65 * lay;
    p.y += uScroll * 1.6 * depthK;
    p.y = mod(p.y + 9.0, 18.0) - 9.0;

    // Magnification: deeper on the page, the field is seen closer up.
    p.xy *= uMag;

    // The space turns about you.
    p = rotY(p, uRot);

    // A slow drift that neighbours share.
    p += vec3(
      sin(p.y * 0.35 + uTime * 0.09),
      sin(p.z * 0.30 + uTime * 0.07 + 2.0),
      sin(p.x * 0.28 + uTime * 0.06 + 4.0)
    ) * (0.16 + 0.12 * lay) * uMotion;

    // The hand: mid and near points drift aside and return.
    vec2 d = p.xy - uPointer;
    float dist = length(d);
    float w = smoothstep(3.4, 0.0, dist) * (0.25 + 0.75 * step(0.5, lay)) * uWake * uMotion;
    p.xy += (d / max(dist, 0.001)) * w * 1.2;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // The objective: sharp and present near the cursor, softer away from it.
    float lens = smoothstep(4.4, 0.0, dist) * uLens;

    float persp = 300.0 / max(-mv.z, 1.0);
    float base = 0.7 + 0.8 * fract(aSeed * 7.31);
    // The dust is the smallest grain of all.
    float layerSize = layer < 0.5 ? 0.8 : (layer < 1.5 ? 1.15 : (layer < 2.5 ? 2.6 : 0.55));
    float near = step(1.5, layer) * (1.0 - dust);
    // Before the objective is set, the strokes are soft discs, the near ones larger, all pale by their area.
    float bokeh = 1.0 + uDefocus * mix(1.4, 2.2, near);
    float cap = mix(12.0, 20.0, near);
    float px = clamp(uSize * sqrt(uMag) * uDpr * base * layerSize * persp * 0.05 * bokeh, 0.75, cap * uDpr);
    gl_PointSize = px;

    float depth = clamp((mv.z + 22.0) / 16.0, 0.0, 1.0);
    vec2 ndc = gl_Position.xy / max(gl_Position.w, 0.001);
    float zone = (1.0 - smoothstep(-0.05, 0.5, ndc.x)) * (1.0 - smoothstep(0.3, 0.8, abs(ndc.y)));
    float breath = 1.0 - uBreath * 0.22 * (0.5 + 0.5 * sin(p.x * 0.22 + p.y * 0.17 + uTime * 0.045));
    // Fade at both depth seams so a wrapping point never pops.
    float seam = smoothstep(${N.toFixed(1)}, ${(N+2.5).toFixed(1)}, zf) * (1.0 - smoothstep(${(fe-1.6).toFixed(1)}, ${fe.toFixed(1)}, zf));
    float layerAlpha = layer < 0.5 ? 0.32 : (layer < 1.5 ? 0.46 : (layer < 2.5 ? 0.30 : 0.2));
    float a = (layerAlpha + 0.18 * depth) * (1.0 - 0.4 * zone * uReadZone) * breath * seam / (bokeh * bokeh);
    a = mix(a * (1.0 - 0.25 * uLens), a * 1.7, lens);
    vAlpha = a;
    vSeed = aSeed;
    vLayer = layer;
    vLens = lens;
    vPx = px;
    // The near layer is the soft one, the mid layer the drawn one; the far room stays a haze, the dust between.
    vSharp = (dust > 0.5 ? 0.6 : (layer > 1.5 ? 0.15 : (layer > 0.5 ? 0.85 : 0.5))) * (1.0 - uDefocus);
  }
`,Wt=`
  precision highp float;
  ${Tt}
  ${zt}
  varying float vAlpha;
  varying float vSeed;
  varying float vLayer;
  varying float vLens;
  varying float vPx;
  varying float vSharp;
  uniform float uAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    // Strokes of graphite, crisp inside the objective.
    float a = stroke(uv, vSeed, max(vSharp * 0.8, vLens), vPx) * vAlpha * uAlpha;
    if (a < 0.004) discard;
    vec3 col = mix(GRAPHITE, GRAPHITE_LIGHT, 0.3 + 0.7 * step(0.8, fract(vSeed * 3.17)));
    col = mix(col, GRAPHITE_LIGHT, vLayer > 1.5 ? 0.6 : 0.0);
    col = mix(col, GRAPHITE_DEEP, vLens * 0.6);
    gl_FragColor = vec4(col, a);
  }
`;function rt(q,O){return Math.tan(he*Math.PI/360)*(V-q)*O}const Gt=.35;function qt({entered:q,thin:O=!1}){const Pe=Te.useRef(null),me=Te.useRef(q);return me.current=q,Te.useEffect(()=>{const Re=Pe.current;if(!Re)return;const y=window.innerWidth<820&&!O,K=de.prep==="fire",Q=y?tt.mobile:tt.desktop,He=Math.round(Q*Bt),ee=Q+He,ve=window.innerWidth/window.innerHeight,te=new Float32Array(ee*3),_e=new Float32Array(ee),ke=new Float32Array(ee),ge=[[N,-5],[-5,1.5],[1.5,fe],[N,1.5]];let L=0;for(let o=0;o<4;o++){const t=o===3?He:o===2?Q-L:Math.round(Q*Dt[o]);for(let w=0;w<t&&L<ee;w++,L++){const X=ge[o][0]+Math.random()*(ge[o][1]-ge[o][0]),Ae=Math.max(rt(X,ve),rt(-4,ve))*1.6;te[L*3]=(Math.random()-.5)*2*Ae,te[L*3+1]=(Math.random()-.5)*18,te[L*3+2]=X,_e[L]=Math.random(),ke[L]=o}}const I=new vt;I.setAttribute("position",new ze(te,3)),I.setAttribute("aSeed",new ze(_e,1)),I.setAttribute("aLayer",new ze(ke,1)),I.boundingSphere=new gt(new Xe,80);const d=E.reducedMotion,Fe=Math.min(window.devicePixelRatio||1,2),x=new wt({vertexShader:It,fragmentShader:Wt,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uTime:{value:0},uRot:{value:0},uFlight:{value:0},uScroll:{value:0},uMotion:{value:d?0:.15},uSize:{value:p.size},uDpr:{value:Fe},uReadZone:{value:1},uBreath:{value:0},uWake:{value:0},uLens:{value:0},uMag:{value:1},uPointer:{value:new yt(99,99)},uAlpha:{value:p.density},...Et()}}),P=new xt;P.add(new bt(I,x));const we={uSize:x.uniforms.uSize,uDpr:x.uniforms.uDpr,uLens:x.uniforms.uLens,uPointer:x.uniforms.uPointer,uAlpha:x.uniforms.uAlpha,uDefocus:x.uniforms.uDefocus,uLight:x.uniforms.uLight},De={value:p.density},W={...we,uAlpha:De},D=dt();let r=null,c=null,h=null,g=null,Y=0;const it={value:Z.depth};let u=null,oe=0;const st={value:Z.depth};let m=null,ae=0,ye=0;y&&(K?(g=Lt(W,2),h=new Mt,h.add(g.points)):(r=Je(W,D,{count:at.count,scale:1,surveillance:!1,phagocytosis:!0,atp:!0,trace:!1}),P.add(r.group),c=Je(W,D,{count:nt.count,scale:1,surveillance:!1,seed:2,atp:!0}),h=c.group),P.add(h),u=Pt(W,"phone",{channel:!K}),P.add(u.group),K||(m=Rt(W,5),P.add(m.group)));const Be={value:p.density},a=K||O?null:Ht(y?{...we,uAlpha:Be}:we,"/cv-vorschau/design/");a&&(a.hoverEnabled=!1,a.spin=.1,P.add(a.group));let B=null;const b={value:1};let ne=1,Ce=0,Ne=-1;const lt=Math.tan(he*Math.PI/360)*V,v=new St(he,ve,.1,100);v.position.set(0,0,V);const R=r?_t(W,1):null;R&&P.add(R.points);const ut=new Xe,M=h?Qe(h,v,()=>D.bound*h.scale.x*Le,(o,t)=>{c?c.stimulate(o,{instant:d,normal:t}):(d||g==null||g.start(o),ht.stimulatedAt=performance.now())}):null,re=r,S=re?Qe(re.group,v,()=>D.bound*re.group.scale.x*Le,(o,t)=>re.stimulate(o,{instant:d,normal:t})):null,H=new At({alpha:!0,antialias:!1,powerPreference:"high-performance"});H.setPixelRatio(Fe),H.setClearColor(0,0),Re.appendChild(H.domElement);const xe=()=>{H.setSize(window.innerWidth,window.innerHeight),v.aspect=window.innerWidth/window.innerHeight,v.updateProjectionMatrix()};xe(),window.addEventListener("resize",xe),(location.search.includes("debug")||location.search.includes("tune"))&&(window.__atmos={u:x.uniforms,renderer:H,camera:v,prep:K?"fire":"wildtype",heroCell:r,aboutCell:c,puff:g,channel:(u==null?void 0:u.group)??null,emblem:m,umap:(a==null?void 0:a.group)??null,stimulateAbout:(o,t)=>{const w=M==null?void 0:M.onScreen();return!!w&&!!M&&M.at(o??w.x,t??w.y)},aboutOnScreen:()=>(M==null?void 0:M.onScreen())??null,stimulateHero:(o,t)=>{const w=S==null?void 0:S.onScreen();return!!w&&!!S&&S.at(o??w.x,t??w.y)},heroOnScreen:()=>{const o=(S==null?void 0:S.onScreen())??null;return o?{x:o.x,y:o.y,r:o.r/Le,work:o.r}:null},cloud:{get grow(){return Ce},get zoom(){return b.value},get grab(){return B},get rotation(){return(a==null?void 0:a.group.rotation.y)??0}}});let Oe=0,ie=document.hidden,se=performance.now(),Ie=0,We=0,Ge=0,be=1,je=.6,Me=1,Se=!1,Ue=de.current?-1e9:performance.now();const ct=700;let le=-1;const G={x:0,y:0},_={x:99,y:99},l=x.uniforms,ue=()=>{if(ie)return;const o=performance.now();if(y&&de.current&&o-Ue>ct){Se=!0;return}Oe=requestAnimationFrame(ue);const t=Math.min((o-se)/1e3,.05);se=o;const w=o/1e3,X=window.scrollY/window.innerHeight,Ae=d?0:me.current?1:.15;l.uMotion.value=f(l.uMotion.value,Ae,1.2,t);const A=l.uMotion.value;le<0&&me.current&&(le=o);const Ze=le<0?-1:(o-le)/1e3;l.uDefocus.value=d?0:Ze<0?1:1-z(0,1,Ze/Nt),Ie+=t*p.rotation*A,We+=t*(p.flight+Math.min(Math.abs(E.velocity)*.012,1.5))*A,l.uTime.value=w,l.uRot.value=Ie,l.uFlight.value=We,l.uScroll.value=d?0:X,l.uSize.value=p.size*(y?Ct:1),l.uBreath.value=d||y?0:p.breath,l.uWake.value=d||y?0:p.wake,l.uLens.value=!d&&!y&&p.lens&&E.pointerSeen?1:0,l.uMag.value=p.magnify?1+.9*Math.pow(Math.min(1,E.progress),1.2):1;const Ve=E.acts,qe=z(.02,.35,Ve.cell)-z(.15,.6,Ve.out);if(l.uAlpha.value=p.density*(O?Gt:1)*(1-(y?ot.mobile:ot.desktop)*Math.max(0,qe)),l.uReadZone.value=Math.max(0,qe),!d&&!y&&(G.x=f(G.x,E.pointer.x*.45,2,t),G.y=f(G.y,E.pointer.y*.3,2,t),v.position.x=G.x,v.position.y=G.y,E.pointerSeen)){const e=Math.tan(he*Math.PI/360)*V,s=E.pointer.x*e*v.aspect,i=E.pointer.y*e;_.x=_.x===99?s:f(_.x,s,3.5,t),_.y=_.y===99?i:f(_.y,i,3.5,t),l.uPointer.value.set(_.x,_.y)}De.value=p.density;const k=lt/(window.innerHeight/2),J=(e,s)=>{const i=document.getElementById(e);if(!i)return null;const n=i.getBoundingClientRect();if(n.height<10)return null;s.position.set((n.left+n.width/2-window.innerWidth/2)*k,(window.innerHeight/2-(n.top+n.height/2))*k,0);let j=1,F=0;const U=i.closest("[data-pin-scene]");if(U){const pe=window.innerHeight,Ee=i.offsetTop+n.height/2;j=z(pe,Ee,n.top+n.height/2);const C=Number(U.dataset.pinTravel??0);F=C>0?Math.max(0,Math.min(1,-U.getBoundingClientRect().top/C)):0}return{r:n,on:n.bottom>0&&n.top<window.innerHeight,arrive:j,turn:F}},Ke=(e,s,i)=>{s.value=f(s.value,d?0:Z.depth*(1-i),Z.settle,t);const n=(V+s.value)/V;e.position.set(e.position.x*n,e.position.y*n,-s.value)};if(r){const e=J("hero-cell-anchor",r.group);if(e&&r.group.scale.setScalar(Math.min(e.r.width,e.r.height)/2*k*at.fit/D.bound),r.reveal=f(r.reveal,de.current?0:1,3,t),r.group.visible=!!e&&e.on&&X<1.4&&r.reveal>.01,r.group.visible&&(be=r.chemotaxis?0:f(be,1,2,t),Ge+=t*.12*A*be,r.group.rotation.y=Ge,r.update(t,A,null,0)),R){const s=D.bound*r.group.scale.x*.62;R.place(ut.copy(r.group.position),s,s,1/k),R.update(r.group.visible?.5*r.reveal*(1-l.uDefocus.value):0)}}if(h){const e=J("about-cell-anchor",h);if(e&&(h.scale.setScalar(Math.min(e.r.width,e.r.height)/2*k*nt.fit/D.bound),Ke(h,it,e.arrive)),Y=f(Y,e!=null&&e.on?1:0,3,t),c&&(c.reveal=Y),h.visible=Y>.01,h.visible&&e)if(Me=c!=null&&c.chemotaxis?0:f(Me,1,2,t),je+=t*.1*A*Me,h.rotation.y=je+e.turn*Z.turn,c){const s=(e.r.top+e.r.height/2)/window.innerHeight;c.update(t,A,null,Math.max(z(.62,.3,s),z(.15,.6,e.turn),p.activation))}else g==null||g.update(t,A,Y)}if(u){const e=J("channel-anchor",u.group);e&&(u.group.scale.setScalar(Math.min(e.r.width/2/et.radius,e.r.height/2/et.halfHeight)*k*Ot.fit),Ke(u.group,st,e.arrive)),oe=f(oe,e!=null&&e.on?1:0,3,t),u.group.visible=oe>.01,u.group.visible&&(u.group.rotation.y+=t*.3*A,u.group.rotation.x=-((e==null?void 0:e.turn)??0)*.5*Z.turn,u.update(t,A,oe))}if(m){const e=J("contact-emblem-anchor",m.group);e&&m.group.scale.setScalar(Math.min(e.r.width,e.r.height)/2*k*.92/kt),ae=f(ae,e!=null&&e.on?1:0,3,t),ye=d?1:f(ye,e!=null&&e.on?1:0,1.6,t),m.group.visible=ae>.01,m.group.visible&&(m.draw=ye,m.update(t,A,ae,null))}const ce=a?J("umap-anchor",a.group):null;if(a&&ce){const e=Math.min(ce.r.width,ce.r.height)/2*k*.95,s=y?document.querySelector("[data-cloud-scene]"):null;let i=0;if(s){const F=s.getBoundingClientRect(),U=Math.max(0,Math.min(1,-F.top/Math.max(1,F.height-window.innerHeight)));if(i=z(0,.28,U)*(1-z(.72,1,U)),Math.abs(i-Ne)>.005&&(Ne=i,s.style.setProperty("--cloud-grow",i.toFixed(3))),!B){const pe=s.querySelector("[data-cloud-surface]");pe&&(B=Ft(a.group,v,()=>0,{tilt:!1,touch:pe,onPinchEnd:Ee=>{const C=Math.max(1,Math.min(T.zoomMax,ne*Ee));$.killTweensOf(b),C<T.springBelow?$.to(b,{value:1,duration:.6,ease:"back.out(1.4)"}):b.value=C,ne=C<T.springBelow?1:C}}))}}Ce=i;const n=B;n!=null&&n.pinching?($.killTweensOf(b),b.value=Math.max(1,Math.min(T.zoomMax,ne*n.pinch))):i<.98&&b.value!==1&&!$.isTweening(b)&&($.to(b,{value:1,duration:.6,ease:"power2.out"}),ne=1);const j=Math.max(.9,b.value);if(a.group.scale.setScalar(e*(1+(T.full-1)*i)*Math.pow(j,T.zoomPow)),a.group.position.z=i*T.near+(j-1)*T.zoomNear,a.group.rotation.x=T.tilt*i,a.maxPx=9+(T.maxPx-9)*i,a.labelFade=1-z(1.2,1.7,j),Be.value=p.density*(.65+.35*i),l.uAlpha.value*=1-.92*i,a.reveal=f(a.reveal,a.ready&&ce.on?1:0,3,t),a.group.visible=a.reveal>.01,a.group.visible){const F=!!n&&(n.active||n.pinching);n&&!F&&Math.abs(n.spin)>.001&&(a.group.rotation.y+=t*n.spin,n.spin*=Math.exp(-2.2*t),Math.abs(n.spin)<.02&&(n.spin=0)),a.update(t,A,v,null,!d&&!F&&!(n&&Math.abs(n.spin)>.001))}else Ye.labels.length&&(Ye.labels=[])}v.lookAt(0,0,0),H.render(P,v)},$e=()=>{ie=document.hidden,ie||(se=performance.now(),ue())};document.addEventListener("visibilitychange",$e);const pt=ft(()=>{Ue=performance.now(),Se&&!ie&&(Se=!1,se=performance.now(),ue())});return ue(),()=>{cancelAnimationFrame(Oe),pt(),document.removeEventListener("visibilitychange",$e),window.removeEventListener("resize",xe),r==null||r.dispose(),R==null||R.dispose(),M==null||M.dispose(),S==null||S.dispose(),B==null||B.dispose(),$.killTweensOf(b),c==null||c.dispose(),g==null||g.dispose(),u==null||u.dispose(),m==null||m.dispose(),a==null||a.dispose(),I.dispose(),x.dispose(),H.dispose(),H.domElement.remove()}},[O]),mt.jsx("div",{ref:Pe,className:`atmos fixed inset-0 z-0 pointer-events-none ${q?"":"is-unfocused"}`,"aria-hidden":"true"})}export{qt as default};
