import{r as Me,t as c,s as A,a as nt,b as ce,c as it,j as rt,d as w,e as z,u as je}from"./index-DcxQnJYF.js";import{B as st,a as Se,S as lt,V as $e,b as ut,c as ct,d as pt,P as dt,G as ht,e as ft,W as mt}from"./three-CdPaaKdt.js";import{g as $}from"./motion-BCXewYul.js";import{m as vt,P as gt,S as wt,g as yt,b as Ue,a as xt,c as bt,d as Mt,e as St,f as At,h as Et,C as Ze,E as zt,i as Lt}from"./UmapCloud-Cop2gNlh.js";const Ve={desktop:26e3,mobile:6e3},Tt=[.64,.33,.03],Pt=.6,qe={desktop:.42,mobile:.65},Rt=.85,Z=13,pe=42,B=-16,de=6,Ye={count:6e3,fit:1},Ht=1.2,Ke={count:6e3,fit:1.05},_t={fit:.95},U={depth:6,settle:7,turn:.9},E={full:2.7,near:1.6,maxPx:16,zoomMax:6,zoomPow:.8,zoomNear:1.5,springBelow:1.3,tilt:.22},kt=`
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
    p.z = mod(p.z + uFlight - (${B.toFixed(1)}), ${(de-B).toFixed(1)}) + (${B.toFixed(1)});
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
    float seam = smoothstep(${B.toFixed(1)}, ${(B+2.5).toFixed(1)}, zf) * (1.0 - smoothstep(${(de-1.6).toFixed(1)}, ${de.toFixed(1)}, zf));
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
`,Ft=`
  precision highp float;
  ${gt}
  ${wt}
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
`;function Xe(V,D){return Math.tan(pe*Math.PI/360)*(Z-V)*D}const Ct=.35;function Wt({entered:V,thin:D=!1}){const Ae=Me.useRef(null),he=Me.useRef(V);return he.current=V,Me.useEffect(()=>{const Ee=Ae.current;if(!Ee)return;const y=window.innerWidth<820&&!D,q=ce.prep==="fire",J=y?Ve.mobile:Ve.desktop,ze=Math.round(J*Pt),Q=J+ze,fe=window.innerWidth/window.innerHeight,ee=new Float32Array(Q*3),Le=new Float32Array(Q),Te=new Float32Array(Q),me=[[B,-5],[-5,1.5],[1.5,de],[B,1.5]];let L=0;for(let r=0;r<4;r++){const a=r===3?ze:r===2?J-L:Math.round(J*Tt[r]);for(let S=0;S<a&&L<Q;S++,L++){const K=me[r][0]+Math.random()*(me[r][1]-me[r][0]),xe=Math.max(Xe(K,fe),Xe(-4,fe))*1.6;ee[L*3]=(Math.random()-.5)*2*xe,ee[L*3+1]=(Math.random()-.5)*18,ee[L*3+2]=K,Le[L]=Math.random(),Te[L]=r}}const N=new st;N.setAttribute("position",new Se(ee,3)),N.setAttribute("aSeed",new Se(Le,1)),N.setAttribute("aLayer",new Se(Te,1)),N.boundingSphere=new lt(new $e,80);const h=A.reducedMotion,Pe=Math.min(window.devicePixelRatio||1,2),x=new ut({vertexShader:kt,fragmentShader:Ft,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uTime:{value:0},uRot:{value:0},uFlight:{value:0},uScroll:{value:0},uMotion:{value:h?0:.15},uSize:{value:c.size},uDpr:{value:Pe},uReadZone:{value:1},uBreath:{value:0},uWake:{value:0},uLens:{value:0},uMag:{value:1},uPointer:{value:new ct(99,99)},uAlpha:{value:c.density},...vt()}}),T=new pt;T.add(new dt(N,x));const ve={uSize:x.uniforms.uSize,uDpr:x.uniforms.uDpr,uLens:x.uniforms.uLens,uPointer:x.uniforms.uPointer,uAlpha:x.uniforms.uAlpha,uDefocus:x.uniforms.uDefocus,uLight:x.uniforms.uLight},Re={value:c.density},I={...ve,uAlpha:Re},O=yt();let i=null,f=null,p=null,m=null,Y=0;const Je={value:U.depth};let u=null,te=0;const Qe={value:U.depth};let d=null,oe=0,ge=0;y&&(q?(m=xt(I,2),p=new ht,p.add(m.points)):(i=Ue(I,O,{count:Ye.count,scale:1,surveillance:!1,phagocytosis:!0}),T.add(i.group),f=Ue(I,O,{count:Ke.count,scale:1,surveillance:!1,seed:2,atp:!0}),p=f.group),T.add(p),u=bt(I,"phone",{channel:!q}),T.add(u.group),q||(d=Mt(I,5),T.add(d.group)));const He={value:c.density},t=q||D?null:St(y?{...ve,uAlpha:He}:ve,"/cv-vorschau/design/");t&&(t.hoverEnabled=!1,t.spin=.1,T.add(t.group));let F=null;const b={value:1};let ae=1,_e=0,ke=-1;const et=Math.tan(pe*Math.PI/360)*Z,v=new ft(pe,fe,.1,100);v.position.set(0,0,Z);const P=i?At(I,1):null;P&&T.add(P.points);const tt=new $e,M=p?Et(p,v,()=>O.bound*p.scale.x*1.2,r=>{f?f.stimulate(r,{instant:h}):(h||m==null||m.start(r),nt.stimulatedAt=performance.now())}):null,R=new mt({alpha:!0,antialias:!1,powerPreference:"high-performance"});R.setPixelRatio(Pe),R.setClearColor(0,0),Ee.appendChild(R.domElement);const we=()=>{R.setSize(window.innerWidth,window.innerHeight),v.aspect=window.innerWidth/window.innerHeight,v.updateProjectionMatrix()};we(),window.addEventListener("resize",we),(location.search.includes("debug")||location.search.includes("tune"))&&(window.__atmos={u:x.uniforms,renderer:R,camera:v,prep:q?"fire":"wildtype",heroCell:i,aboutCell:f,puff:m,channel:(u==null?void 0:u.group)??null,emblem:d,umap:(t==null?void 0:t.group)??null,stimulateAbout:(r,a)=>{const S=M==null?void 0:M.onScreen();return!!S&&!!M&&M.at(r??S.x,a??S.y)},aboutOnScreen:()=>(M==null?void 0:M.onScreen())??null,cloud:{get grow(){return _e},get zoom(){return b.value},get grab(){return F},get rotation(){return(t==null?void 0:t.group.rotation.y)??0}}});let Fe=0,ne=document.hidden,ie=performance.now(),Ce=0,Be=0,ye=!1,De=ce.current?-1e9:performance.now();const ot=700;let re=-1;const W={x:0,y:0},H={x:99,y:99},l=x.uniforms,se=()=>{if(ne)return;const r=performance.now();if(y&&ce.current&&r-De>ot){ye=!0;return}Fe=requestAnimationFrame(se);const a=Math.min((r-ie)/1e3,.05);ie=r;const S=r/1e3,K=window.scrollY/window.innerHeight,xe=h?0:he.current?1:.15;l.uMotion.value=w(l.uMotion.value,xe,1.2,a);const g=l.uMotion.value;re<0&&he.current&&(re=r);const Ie=re<0?-1:(r-re)/1e3;l.uDefocus.value=h?0:Ie<0?1:1-z(0,1,Ie/Ht),Ce+=a*c.rotation*g,Be+=a*(c.flight+Math.min(Math.abs(A.velocity)*.012,1.5))*g,l.uTime.value=S,l.uRot.value=Ce,l.uFlight.value=Be,l.uScroll.value=h?0:K,l.uSize.value=c.size*(y?Rt:1),l.uBreath.value=h||y?0:c.breath,l.uWake.value=h||y?0:c.wake,l.uLens.value=!h&&!y&&c.lens&&A.pointerSeen?1:0,l.uMag.value=c.magnify?1+.9*Math.pow(Math.min(1,A.progress),1.2):1;const Oe=A.acts,We=z(.02,.35,Oe.cell)-z(.15,.6,Oe.out);if(l.uAlpha.value=c.density*(D?Ct:1)*(1-(y?qe.mobile:qe.desktop)*Math.max(0,We)),l.uReadZone.value=Math.max(0,We),!h&&!y&&(W.x=w(W.x,A.pointer.x*.45,2,a),W.y=w(W.y,A.pointer.y*.3,2,a),v.position.x=W.x,v.position.y=W.y,A.pointerSeen)){const e=Math.tan(pe*Math.PI/360)*Z,s=A.pointer.x*e*v.aspect,n=A.pointer.y*e;H.x=H.x===99?s:w(H.x,s,3.5,a),H.y=H.y===99?n:w(H.y,n,3.5,a),l.uPointer.value.set(H.x,H.y)}Re.value=c.density;const _=et/(window.innerHeight/2),X=(e,s)=>{const n=document.getElementById(e);if(!n)return null;const o=n.getBoundingClientRect();if(o.height<10)return null;s.position.set((o.left+o.width/2-window.innerWidth/2)*_,(window.innerHeight/2-(o.top+o.height/2))*_,0);let G=1,k=0;const j=n.closest("[data-pin-scene]");if(j){const ue=window.innerHeight,be=n.offsetTop+o.height/2;G=z(ue,be,o.top+o.height/2);const C=Number(j.dataset.pinTravel??0);k=C>0?Math.max(0,Math.min(1,-j.getBoundingClientRect().top/C)):0}return{r:o,on:o.bottom>0&&o.top<window.innerHeight,arrive:G,turn:k}},Ge=(e,s,n)=>{s.value=w(s.value,h?0:U.depth*(1-n),U.settle,a);const o=(Z+s.value)/Z;e.position.set(e.position.x*o,e.position.y*o,-s.value)};if(i){const e=X("hero-cell-anchor",i.group);if(e&&i.group.scale.setScalar(Math.min(e.r.width,e.r.height)/2*_*Ye.fit/O.bound),i.reveal=w(i.reveal,ce.current?0:1,3,a),i.group.visible=!!e&&e.on&&K<1.4&&i.reveal>.01,i.group.visible&&(i.group.rotation.y=S*.12*g,i.update(a,g,null,0)),P){const s=O.bound*i.group.scale.x*.62;P.place(tt.copy(i.group.position),s,s,1/_),P.update(i.group.visible?.5*i.reveal*(1-l.uDefocus.value):0)}}if(p){const e=X("about-cell-anchor",p);if(e&&(p.scale.setScalar(Math.min(e.r.width,e.r.height)/2*_*Ke.fit/O.bound),Ge(p,Je,e.arrive)),Y=w(Y,e!=null&&e.on?1:0,3,a),f&&(f.reveal=Y),p.visible=Y>.01,p.visible&&e)if(p.rotation.y=S*.1*g+.6+e.turn*U.turn,f){const s=(e.r.top+e.r.height/2)/window.innerHeight;f.update(a,g,null,Math.max(z(.62,.3,s),z(.15,.6,e.turn),c.activation))}else m==null||m.update(a,g,Y)}if(u){const e=X("channel-anchor",u.group);e&&(u.group.scale.setScalar(Math.min(e.r.width/2/Ze.radius,e.r.height/2/Ze.halfHeight)*_*_t.fit),Ge(u.group,Qe,e.arrive)),te=w(te,e!=null&&e.on?1:0,3,a),u.group.visible=te>.01,u.group.visible&&(u.group.rotation.y+=a*.3*g,u.group.rotation.x=-((e==null?void 0:e.turn)??0)*.5*U.turn,u.update(a,g,te))}if(d){const e=X("contact-emblem-anchor",d.group);e&&d.group.scale.setScalar(Math.min(e.r.width,e.r.height)/2*_*.92/zt),oe=w(oe,e!=null&&e.on?1:0,3,a),ge=h?1:w(ge,e!=null&&e.on?1:0,1.6,a),d.group.visible=oe>.01,d.group.visible&&(d.draw=ge,d.group.rotation.y=S*.12*g,d.update(a,g,oe,null))}const le=t?X("umap-anchor",t.group):null;if(t&&le){const e=Math.min(le.r.width,le.r.height)/2*_*.95,s=y?document.querySelector("[data-cloud-scene]"):null;let n=0;if(s){const k=s.getBoundingClientRect(),j=Math.max(0,Math.min(1,-k.top/Math.max(1,k.height-window.innerHeight)));if(n=z(0,.28,j)*(1-z(.72,1,j)),Math.abs(n-ke)>.005&&(ke=n,s.style.setProperty("--cloud-grow",n.toFixed(3))),!F){const ue=s.querySelector("[data-cloud-surface]");ue&&(F=Lt(t.group,v,()=>0,{tilt:!1,touch:ue,onPinchEnd:be=>{const C=Math.max(1,Math.min(E.zoomMax,ae*be));$.killTweensOf(b),C<E.springBelow?$.to(b,{value:1,duration:.6,ease:"back.out(1.4)"}):b.value=C,ae=C<E.springBelow?1:C}}))}}_e=n;const o=F;o!=null&&o.pinching?($.killTweensOf(b),b.value=Math.max(1,Math.min(E.zoomMax,ae*o.pinch))):n<.98&&b.value!==1&&!$.isTweening(b)&&($.to(b,{value:1,duration:.6,ease:"power2.out"}),ae=1);const G=Math.max(.9,b.value);if(t.group.scale.setScalar(e*(1+(E.full-1)*n)*Math.pow(G,E.zoomPow)),t.group.position.z=n*E.near+(G-1)*E.zoomNear,t.group.rotation.x=E.tilt*n,t.maxPx=9+(E.maxPx-9)*n,t.labelFade=1-z(1.2,1.7,G),He.value=c.density*(.65+.35*n),l.uAlpha.value*=1-.92*n,t.reveal=w(t.reveal,t.ready&&le.on?1:0,3,a),t.group.visible=t.reveal>.01,t.group.visible){const k=!!o&&(o.active||o.pinching);o&&!k&&Math.abs(o.spin)>.001&&(t.group.rotation.y+=a*o.spin,o.spin*=Math.exp(-2.2*a),Math.abs(o.spin)<.02&&(o.spin=0)),t.update(a,g,v,null,!h&&!k&&!(o&&Math.abs(o.spin)>.001))}else je.labels.length&&(je.labels=[])}v.lookAt(0,0,0),R.render(T,v)},Ne=()=>{ne=document.hidden,ne||(ie=performance.now(),se())};document.addEventListener("visibilitychange",Ne);const at=it(()=>{De=performance.now(),ye&&!ne&&(ye=!1,ie=performance.now(),se())});return se(),()=>{cancelAnimationFrame(Fe),at(),document.removeEventListener("visibilitychange",Ne),window.removeEventListener("resize",we),i==null||i.dispose(),P==null||P.dispose(),M==null||M.dispose(),F==null||F.dispose(),$.killTweensOf(b),f==null||f.dispose(),m==null||m.dispose(),u==null||u.dispose(),d==null||d.dispose(),t==null||t.dispose(),N.dispose(),x.dispose(),R.dispose(),R.domElement.remove()}},[D]),rt.jsx("div",{ref:Ae,className:`atmos fixed inset-0 z-0 pointer-events-none ${V?"":"is-unfocused"}`,"aria-hidden":"true"})}export{Wt as default};
