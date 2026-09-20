import{r as we,t as c,s as M,a as Qe,b as se,c as et,j as tt,d as S,e as z,u as Ne}from"./index-47omwk3k.js";import{B as ot,a as ye,S as at,V as Ie,b as nt,c as it,d as rt,P as st,G as lt,e as ut,W as ct}from"./three-CdPaaKdt.js";import{g as G}from"./motion-BCXewYul.js";import{m as pt,P as dt,S as ht,g as ft,b as Oe,a as mt,c as vt,d as gt,e as wt,f as yt,C as We,h as xt}from"./UmapCloud-CM5oBZYk.js";const Ge={desktop:26e3,mobile:6e3},bt=[.64,.31,.05],je={desktop:.42,mobile:.65},Mt=.85,$=13,le=42,U=-16,ue=6,$e={count:6e3,fit:1.12},St=1.2,Ue={count:6e3,fit:1.05},At={fit:.95},j={depth:6,settle:7,turn:.9},A={full:2.7,near:1.6,maxPx:16,zoomMax:6,zoomPow:.8,zoomNear:1.5,springBelow:1.3,tilt:.22},zt=`
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

    // Flight: the volume streams toward the camera and wraps in depth.
    p.z = mod(p.z + uFlight - (${U.toFixed(1)}), ${(ue-U).toFixed(1)}) + (${U.toFixed(1)});
    float zf = p.z;

    // Parallax with the scroll: far barely, near a lot. Wraps vertically.
    float depthK = 0.35 + 0.65 * layer;
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
    ) * (0.16 + 0.12 * layer) * uMotion;

    // The hand: mid and near points drift aside and return.
    vec2 d = p.xy - uPointer;
    float dist = length(d);
    float w = smoothstep(3.4, 0.0, dist) * (0.25 + 0.75 * step(0.5, layer)) * uWake * uMotion;
    p.xy += (d / max(dist, 0.001)) * w * 1.2;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // The objective: sharp and present near the cursor, softer away from it.
    float lens = smoothstep(4.4, 0.0, dist) * uLens;

    float persp = 300.0 / max(-mv.z, 1.0);
    float base = 0.7 + 0.8 * fract(aSeed * 7.31);
    float layerSize = layer < 0.5 ? 0.8 : (layer < 1.5 ? 1.15 : 2.6);
    // Before the objective is set, the strokes are soft discs, the near ones large, all pale by their area.
    float bokeh = 1.0 + uDefocus * (layer > 1.5 ? 2.6 : 1.4);
    float cap = layer > 1.5 ? 28.0 : 12.0;
    float px = clamp(uSize * sqrt(uMag) * uDpr * base * layerSize * persp * 0.05 * bokeh, 0.75, cap * uDpr);
    gl_PointSize = px;

    float depth = clamp((mv.z + 22.0) / 16.0, 0.0, 1.0);
    vec2 ndc = gl_Position.xy / max(gl_Position.w, 0.001);
    float zone = (1.0 - smoothstep(-0.05, 0.5, ndc.x)) * (1.0 - smoothstep(0.3, 0.8, abs(ndc.y)));
    float breath = 1.0 - uBreath * 0.22 * (0.5 + 0.5 * sin(p.x * 0.22 + p.y * 0.17 + uTime * 0.045));
    // Fade at both depth seams so a wrapping point never pops.
    float seam = smoothstep(${U.toFixed(1)}, ${(U+2.5).toFixed(1)}, zf) * (1.0 - smoothstep(${(ue-1.6).toFixed(1)}, ${ue.toFixed(1)}, zf));
    float layerAlpha = layer < 0.5 ? 0.32 : (layer < 1.5 ? 0.46 : 0.34);
    float a = (layerAlpha + 0.18 * depth) * (1.0 - 0.4 * zone * uReadZone) * breath * seam / (bokeh * bokeh);
    a = mix(a * (1.0 - 0.25 * uLens), a * 1.7, lens);
    vAlpha = a;
    vSeed = aSeed;
    vLayer = layer;
    vLens = lens;
    vPx = px;
    // The near layer is the soft one, the mid layer the drawn one; the far room stays a haze.
    vSharp = (layer > 1.5 ? 0.15 : (layer > 0.5 ? 0.85 : 0.5)) * (1.0 - uDefocus);
  }
`,Lt=`
  precision highp float;
  ${dt}
  ${ht}
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
`;function Ze(Z,C){return Math.tan(le*Math.PI/360)*($-Z)*C}const Et=.35;function _t({entered:Z,thin:C=!1}){const xe=we.useRef(null),ce=we.useRef(Z);return ce.current=Z,we.useEffect(()=>{const be=xe.current;if(!be)return;const v=window.innerWidth<820&&!C,K=se.prep==="fire",B=v?Ge.mobile:Ge.desktop,pe=window.innerWidth/window.innerHeight,X=new Float32Array(B*3),Me=new Float32Array(B),Se=new Float32Array(B),de=[[U,-5],[-5,1.5],[1.5,ue]];let L=0;for(let r=0;r<3;r++){const a=r===2?B-L:Math.round(B*bt[r]);for(let x=0;x<a&&L<B;x++,L++){const Y=de[r][0]+Math.random()*(de[r][1]-de[r][0]),ve=Math.max(Ze(Y,pe),Ze(-4,pe))*1.6;X[L*3]=(Math.random()-.5)*2*ve,X[L*3+1]=(Math.random()-.5)*18,X[L*3+2]=Y,Me[L]=Math.random(),Se[L]=r}}const D=new ot;D.setAttribute("position",new ye(X,3)),D.setAttribute("aSeed",new ye(Me,1)),D.setAttribute("aLayer",new ye(Se,1)),D.boundingSphere=new at(new Ie,80);const d=M.reducedMotion,Ae=Math.min(window.devicePixelRatio||1,2),g=new nt({vertexShader:zt,fragmentShader:Lt,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uTime:{value:0},uRot:{value:0},uFlight:{value:0},uScroll:{value:0},uMotion:{value:d?0:.15},uSize:{value:c.size},uDpr:{value:Ae},uReadZone:{value:1},uBreath:{value:0},uWake:{value:0},uLens:{value:0},uMag:{value:1},uPointer:{value:new it(99,99)},uAlpha:{value:c.density},...pt()}}),H=new rt;H.add(new st(D,g));const he={uSize:g.uniforms.uSize,uDpr:g.uniforms.uDpr,uLens:g.uniforms.uLens,uPointer:g.uniforms.uPointer,uAlpha:g.uniforms.uAlpha,uDefocus:g.uniforms.uDefocus,uLight:g.uniforms.uLight},ze={value:c.density},V={...he,uAlpha:ze},N=ft();let i=null,h=null,p=null,f=null,q=0;const Ve={value:j.depth};let u=null,J=0;const qe={value:j.depth};v&&(K?(f=mt(V,2),p=new lt,p.add(f.points)):(i=Oe(V,N,{count:$e.count,scale:1,surveillance:!1,phagocytosis:!0}),H.add(i.group),h=Oe(V,N,{count:Ue.count,scale:1,surveillance:!1,seed:2,atp:!0}),p=h.group),H.add(p),u=vt(V,"phone",{channel:!K}),H.add(u.group));const Le={value:c.density},t=K||C?null:gt(v?{...he,uAlpha:Le}:he,"/cv-vorschau/design/");t&&(t.hoverEnabled=!1,t.spin=.1,H.add(t.group));let k=null;const w={value:1};let Q=1,Ee=0,Pe=-1;const Ye=Math.tan(le*Math.PI/360)*$,m=new ut(le,pe,.1,100);m.position.set(0,0,$);const E=i?wt(V,1):null;E&&H.add(E.points);const Ke=new Ie,y=p?yt(p,m,()=>N.bound*p.scale.x*1.2,r=>{h?h.stimulate(r,{instant:d}):(d||f==null||f.start(r),Qe.stimulatedAt=performance.now())}):null,P=new ct({alpha:!0,antialias:!1,powerPreference:"high-performance"});P.setPixelRatio(Ae),P.setClearColor(0,0),be.appendChild(P.domElement);const fe=()=>{P.setSize(window.innerWidth,window.innerHeight),m.aspect=window.innerWidth/window.innerHeight,m.updateProjectionMatrix()};fe(),window.addEventListener("resize",fe),(location.search.includes("debug")||location.search.includes("tune"))&&(window.__atmos={u:g.uniforms,renderer:P,camera:m,prep:K?"fire":"wildtype",heroCell:i,aboutCell:h,puff:f,channel:(u==null?void 0:u.group)??null,umap:(t==null?void 0:t.group)??null,stimulateAbout:(r,a)=>{const x=y==null?void 0:y.onScreen();return!!x&&!!y&&y.at(r??x.x,a??x.y)},aboutOnScreen:()=>(y==null?void 0:y.onScreen())??null,cloud:{get grow(){return Ee},get zoom(){return w.value},get grab(){return k},get rotation(){return(t==null?void 0:t.group.rotation.y)??0}}});let Te=0,ee=document.hidden,te=performance.now(),Re=0,He=0,me=!1,ke=se.current?-1e9:performance.now();const Xe=700;let oe=-1;const I={x:0,y:0},T={x:99,y:99},l=g.uniforms,ae=()=>{if(ee)return;const r=performance.now();if(v&&se.current&&r-ke>Xe){me=!0;return}Te=requestAnimationFrame(ae);const a=Math.min((r-te)/1e3,.05);te=r;const x=r/1e3,Y=window.scrollY/window.innerHeight,ve=d?0:ce.current?1:.15;l.uMotion.value=S(l.uMotion.value,ve,1.2,a);const b=l.uMotion.value;oe<0&&ce.current&&(oe=r);const Fe=oe<0?-1:(r-oe)/1e3;l.uDefocus.value=d?0:Fe<0?1:1-z(0,1,Fe/St),Re+=a*c.rotation*b,He+=a*(c.flight+Math.min(Math.abs(M.velocity)*.012,1.5))*b,l.uTime.value=x,l.uRot.value=Re,l.uFlight.value=He,l.uScroll.value=d?0:Y,l.uSize.value=c.size*(v?Mt:1),l.uBreath.value=d||v?0:c.breath,l.uWake.value=d||v?0:c.wake,l.uLens.value=!d&&!v&&c.lens&&M.pointerSeen?1:0,l.uMag.value=c.magnify?1+.9*Math.pow(Math.min(1,M.progress),1.2):1;const Ce=M.acts,Be=z(.02,.35,Ce.cell)-z(.15,.6,Ce.out);if(l.uAlpha.value=c.density*(C?Et:1)*(1-(v?je.mobile:je.desktop)*Math.max(0,Be)),l.uReadZone.value=Math.max(0,Be),!d&&!v&&(I.x=S(I.x,M.pointer.x*.45,2,a),I.y=S(I.y,M.pointer.y*.3,2,a),m.position.x=I.x,m.position.y=I.y,M.pointerSeen)){const e=Math.tan(le*Math.PI/360)*$,s=M.pointer.x*e*m.aspect,n=M.pointer.y*e;T.x=T.x===99?s:S(T.x,s,3.5,a),T.y=T.y===99?n:S(T.y,n,3.5,a),l.uPointer.value.set(T.x,T.y)}ze.value=c.density;const _=Ye/(window.innerHeight/2),ne=(e,s)=>{const n=document.getElementById(e);if(!n)return null;const o=n.getBoundingClientRect();if(o.height<10)return null;s.position.set((o.left+o.width/2-window.innerWidth/2)*_,(window.innerHeight/2-(o.top+o.height/2))*_,0);let O=1,R=0;const W=n.closest("[data-pin-scene]");if(W){const re=window.innerHeight,ge=n.offsetTop+o.height/2;O=z(re,ge,o.top+o.height/2);const F=Number(W.dataset.pinTravel??0);R=F>0?Math.max(0,Math.min(1,-W.getBoundingClientRect().top/F)):0}return{r:o,on:o.bottom>0&&o.top<window.innerHeight,arrive:O,turn:R}},De=(e,s,n)=>{s.value=S(s.value,d?0:j.depth*(1-n),j.settle,a);const o=($+s.value)/$;e.position.set(e.position.x*o,e.position.y*o,-s.value)};if(i){const e=ne("hero-cell-anchor",i.group);if(e&&i.group.scale.setScalar(Math.min(e.r.width,e.r.height)/2*_*$e.fit/N.bound),i.reveal=S(i.reveal,se.current?0:1,3,a),i.group.visible=!!e&&e.on&&Y<1.4&&i.reveal>.01,i.group.visible&&(i.group.rotation.y=x*.12*b,i.update(a,b,null,0)),E){const s=N.bound*i.group.scale.x*.62;E.place(Ke.copy(i.group.position),s,s,1/_),E.update(i.group.visible?.5*i.reveal*(1-l.uDefocus.value):0)}}if(p){const e=ne("about-cell-anchor",p);if(e&&(p.scale.setScalar(Math.min(e.r.width,e.r.height)/2*_*Ue.fit/N.bound),De(p,Ve,e.arrive)),q=S(q,e!=null&&e.on?1:0,3,a),h&&(h.reveal=q),p.visible=q>.01,p.visible&&e)if(p.rotation.y=x*.1*b+.6+e.turn*j.turn,h){const s=(e.r.top+e.r.height/2)/window.innerHeight;h.update(a,b,null,Math.max(z(.62,.3,s),z(.15,.6,e.turn),c.activation))}else f==null||f.update(a,b,q)}if(u){const e=ne("channel-anchor",u.group);e&&(u.group.scale.setScalar(Math.min(e.r.width/2/We.radius,e.r.height/2/We.halfHeight)*_*At.fit),De(u.group,qe,e.arrive)),J=S(J,e!=null&&e.on?1:0,3,a),u.group.visible=J>.01,u.group.visible&&(u.group.rotation.y+=a*.3*b,u.group.rotation.x=-((e==null?void 0:e.turn)??0)*.5*j.turn,u.update(a,b,J))}const ie=t?ne("umap-anchor",t.group):null;if(t&&ie){const e=Math.min(ie.r.width,ie.r.height)/2*_*.95,s=v?document.querySelector("[data-cloud-scene]"):null;let n=0;if(s){const R=s.getBoundingClientRect(),W=Math.max(0,Math.min(1,-R.top/Math.max(1,R.height-window.innerHeight)));if(n=z(0,.28,W)*(1-z(.72,1,W)),Math.abs(n-Pe)>.005&&(Pe=n,s.style.setProperty("--cloud-grow",n.toFixed(3))),!k){const re=s.querySelector("[data-cloud-surface]");re&&(k=xt(t.group,m,()=>0,{tilt:!1,touch:re,onPinchEnd:ge=>{const F=Math.max(1,Math.min(A.zoomMax,Q*ge));G.killTweensOf(w),F<A.springBelow?G.to(w,{value:1,duration:.6,ease:"back.out(1.4)"}):w.value=F,Q=F<A.springBelow?1:F}}))}}Ee=n;const o=k;o!=null&&o.pinching?(G.killTweensOf(w),w.value=Math.max(1,Math.min(A.zoomMax,Q*o.pinch))):n<.98&&w.value!==1&&!G.isTweening(w)&&(G.to(w,{value:1,duration:.6,ease:"power2.out"}),Q=1);const O=Math.max(.9,w.value);if(t.group.scale.setScalar(e*(1+(A.full-1)*n)*Math.pow(O,A.zoomPow)),t.group.position.z=n*A.near+(O-1)*A.zoomNear,t.group.rotation.x=A.tilt*n,t.maxPx=9+(A.maxPx-9)*n,t.labelFade=1-z(1.2,1.7,O),Le.value=c.density*(.65+.35*n),l.uAlpha.value*=1-.92*n,t.reveal=S(t.reveal,t.ready&&ie.on?1:0,3,a),t.group.visible=t.reveal>.01,t.group.visible){const R=!!o&&(o.active||o.pinching);o&&!R&&Math.abs(o.spin)>.001&&(t.group.rotation.y+=a*o.spin,o.spin*=Math.exp(-2.2*a),Math.abs(o.spin)<.02&&(o.spin=0)),t.update(a,b,m,null,!d&&!R&&!(o&&Math.abs(o.spin)>.001))}else Ne.labels.length&&(Ne.labels=[])}m.lookAt(0,0,0),P.render(H,m)},_e=()=>{ee=document.hidden,ee||(te=performance.now(),ae())};document.addEventListener("visibilitychange",_e);const Je=et(()=>{ke=performance.now(),me&&!ee&&(me=!1,te=performance.now(),ae())});return ae(),()=>{cancelAnimationFrame(Te),Je(),document.removeEventListener("visibilitychange",_e),window.removeEventListener("resize",fe),i==null||i.dispose(),E==null||E.dispose(),y==null||y.dispose(),k==null||k.dispose(),G.killTweensOf(w),h==null||h.dispose(),f==null||f.dispose(),u==null||u.dispose(),t==null||t.dispose(),D.dispose(),g.dispose(),P.dispose(),P.domElement.remove()}},[C]),tt.jsx("div",{ref:xe,className:`atmos fixed inset-0 z-0 pointer-events-none ${Z?"":"is-unfocused"}`,"aria-hidden":"true"})}export{_t as default};
