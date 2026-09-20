import{r as ke,t as n,D as T,j as bt,s as y,b as Mt,P as lt,G as Q,K as x,a as St,f as e,d as U,p as Et,F as Lt,g as At,h as Pt,e as Y,i as Ne,u as Ee}from"./index-47omwk3k.js";import{B as _t,a as Ge,S as Ht,V as M,b as Tt,c as Be,d as zt,P as Rt,e as Ft,W as Ot,G as Wt}from"./three-CdPaaKdt.js";import{m as Dt,P as It,S as kt,g as Nt,b as Ce,a as Gt,f as Bt,c as ct,d as Ct,h as pt,e as re,L as ut}from"./UmapCloud-CM5oBZYk.js";import"./motion-BCXewYul.js";const j=3e4,Zt=[.64,.31,.05],J=-34,Le=2,X=28,m={z:0,scale:2.6,scaleMin:1.8,scaleMax:3.2,gapPx:40,headerPx:84,count:3e4,maxPx:12},K={x:8.4,top:.2,z:-40,scale:1,count:14e3},$t=new M(0,2,0),le={x:9.6,top:.2,z:-2*Q,scale:.85},Vt=new M(6,3,0),Yt=44,L={x:-1.8,top:.215,z:-3*Q,scale:.4,tilt:.35},qt=new M(.6,.8,0),Ut=40,dt={x:6,y:2},jt=-.9,Xt=1,Kt=2.4,Jt=2.8,Qt=22,ft=[.34,.5],H={z:-5*Q,cx:.86,top:.42,grow:1.15,scaleMin:2.4,scaleMax:3.8,count:3e4},eo=`
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
    float L = ${(Le-J).toFixed(1)};
    float rel = mod(position.z - uCamZ - (${J.toFixed(1)}), L) + (${J.toFixed(1)});
    float relPre = rel;

    // The cloud circles a point in front of you — at the plane in focus — the
    // way the very first version did, its far layer slower than its near one.
    float speed = layer < 0.5 ? 0.5 : (layer < 1.5 ? 1.0 : 1.25);
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
    float layerSize = layer < 0.5 ? 0.8 : (layer < 1.5 ? 1.15 : 2.4);
    // Out of focus a stroke grows to a soft disc; the near layer, close to the lens, to a large and very pale one
    // (bokeh, capped, its alpha divided by its area so the discs never pile up into blots).
    float near = step(1.5, layer);
    float bokeh = 1.0 + (1.0 - foc) * (0.8 + 1.4 * near) + uDefocus * (1.2 + 1.2 * near);
    float cap = mix(12.0, 28.0, near);
    float px = clamp(uSize * uDpr * base * layerSize * persp * 0.05 * bokeh, 0.75, cap * uDpr);
    gl_PointSize = px;

    float breath = 1.0 - uBreath * 0.22 * (0.5 + 0.5 * sin(p.x * 0.22 + p.y * 0.17 + uTime * 0.045));
    float seam = smoothstep(${J.toFixed(1)}, ${(J+4).toFixed(1)}, relPre) * (1.0 - smoothstep(${(Le-2.5).toFixed(1)}, ${Le.toFixed(1)}, relPre));
    float layerAlpha = layer < 0.5 ? 0.34 : (layer < 1.5 ? 0.48 : 0.36);
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
`,to=`
  precision highp float;
  ${It}
  ${kt}
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
`,Ze=ce=>(.5-ce)*window.innerHeight/x,ht=()=>Math.min(window.innerWidth*.92,880)/2/x,oo=1.35;function ro({entered:ce}){const $e=ke.useRef(null),Ve=ke.useRef(ce);return Ve.current=ce,ke.useEffect(()=>{const Ye=$e.current;if(!Ye)return;let qe=!1;const g=y.reducedMotion,Ue=Math.min(window.devicePixelRatio||1,2),F=Mt.prep==="fire",pe=new Float32Array(j*3),je=new Float32Array(j),Xe=new Float32Array(j),Ae=[[J,-12],[-12,-3],[-3,Le]];let O=0;for(let i=0;i<3;i++){const t=i===2?j-O:Math.round(j*Zt[i]);for(let u=0;u<t&&O<j;u++,O++)pe[O*3]=(Math.random()-.5)*84,pe[O*3+1]=(Math.random()-.5)*52,pe[O*3+2]=Ae[i][0]+Math.random()*(Ae[i][1]-Ae[i][0]),je[O]=Math.random(),Xe[O]=i}const q=new _t;q.setAttribute("position",new Ge(pe,3)),q.setAttribute("aSeed",new Ge(je,1)),q.setAttribute("aLayer",new Ge(Xe,1)),q.boundingSphere=new Ht(new M,1e4);const d={uSize:{value:n.size},uDpr:{value:Ue},uLens:{value:0},uPointer:{value:new Be(99,99)},uAlpha:{value:n.density},...Dt()};d.uDefocus.value=1;const ue=new Tt({vertexShader:eo,fragmentShader:to,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{...d,uTime:{value:0},uRot:{value:0},uCamZ:{value:T},uCamXY:{value:new Be},uMotion:{value:g?0:.15},uBreath:{value:0},uWake:{value:0},uFade:{value:0}}}),z=new zt,Ke=new Rt(q,ue);z.add(Ke);const Je=i=>2*Math.atan(i/2/lt)*180/Math.PI,f=new Ft(Je(window.innerHeight),window.innerWidth/window.innerHeight,.1,200);f.position.set(0,0,T);let de=f.fov,fe=f.fov;const W=new Ot({alpha:!0,antialias:!1,powerPreference:"high-performance"});W.setPixelRatio(Ue),W.setClearColor(0,0),Ye.appendChild(W.domElement);const Pe=()=>{W.setSize(window.innerWidth,window.innerHeight),f.aspect=window.innerWidth/window.innerHeight,de=Je(window.innerHeight),fe=de,f.fov=de,f.updateProjectionMatrix()};Pe(),window.addEventListener("resize",Pe);const R=Nt(),s=F?null:Ce(d,R,{count:m.count,scale:m.scale,surveillance:!0,phagocytosis:!0,motility:n.motility,tempo:n.tempo,reach:n.reach});s&&(s.group.position.set(7.4,-.9,m.z),s.reveal=0,z.add(s.group));const Qe=new M(7.4,-.9,m.z);let he=m.scale;const et=(i,t)=>{let u=0,I=0,c=i;for(;c&&c!==t;)u+=c.offsetLeft,I+=c.offsetTop,c=c.offsetParent;return{x:u,y:I}},mt=()=>{const i=document.querySelector("[data-name-edge]"),t=document.querySelector("[data-masthead]"),u=(t==null?void 0:t.closest(".plane"))??null;if(!i||!t||!u)return;const I=window.innerWidth,c=window.innerHeight,oe=(I-u.offsetWidth)/2,C=(c-u.offsetHeight)/2,Z=et(i,u),$=et(t,u),ae=oe+Z.x+i.offsetWidth,we=C+$.y+t.offsetHeight*.5,ne=.3*m.scaleMax*x,be=I-ae-m.gapPx-ne,Me=Math.max(60,Math.min(be*1.15/2,c*.42,(c-m.headerPx)/2-8));he=Math.min(m.scaleMax,Math.max(m.scaleMin,Me/(R.bound*x)));const v=R.bound*he*x,ie=Math.max(we,m.headerPx+v);Qe.set((ae+m.gapPx+ne+v-I/2)/x,(c/2-ie)/x,m.z)},r=F?null:Ce(d,R,{count:H.count,scale:m.scale*H.grow,surveillance:!0,phagocytosis:!0,motility:n.motility,tempo:n.tempo,reach:n.reach}),_e=new M(9,1,H.z);r&&(r.group.position.copy(_e),r.group.visible=!1,z.add(r.group));const gt=()=>{const i=window.innerWidth,t=window.innerHeight,u=Math.min(H.scaleMax,Math.max(H.scaleMin,he*H.grow));_e.set((H.cx*i-i/2)/x,(t/2-H.top*t)/x,H.z),r==null||r.group.scale.setScalar(u)},w=F?null:Ce(d,R,{count:K.count,scale:K.scale,surveillance:!1,seed:2,atp:!0,motility:n.motility,tempo:n.tempo}),S=F?Gt(d,2):null,h=w?w.group:new Wt;S&&(h.scale.setScalar(K.scale),h.add(S.points)),z.add(h);const me=Bt(h,f,()=>e.sheet<.5?R.bound*h.scale.x*1.2:0,i=>{w?w.stimulate(i,{instant:g}):(g||S==null||S.start(i),St.stimulatedAt=performance.now())}),p=ct(d,"research",{channel:!F});p.group.rotation.x=0,p.group.scale.setScalar(le.scale),z.add(p.group);const a=F?null:ct(d,"methods");a&&(a.group.rotation.x=L.tilt,a.group.scale.setScalar(L.scale),z.add(a.group));const l=F?null:Ct(d,"/cv-vorschau/design/");l&&(l.group.position.set(-5,-4,L.z),z.add(l.group));const D=l?pt(l.group,f,()=>l.hoverEnabled?l.group.scale.x*x*1.1:0,{tilt:!1}):null,tt=new M(-5,-4,L.z);let He=3;const vt=new M(0,-3,0),yt=16,xt=-3*Q-Q/2,ge=new M,ve=new M,ee=new M,Te=()=>{ge.set(le.x,Ze(le.top),le.z),ve.set(L.x,Ze(L.top),L.z),ee.set(K.x,Ze(K.top),K.z),p.group.position.copy(ge),a==null||a.group.position.copy(ve),h.position.copy(ee)};Te(),window.addEventListener("resize",Te);const ye=pt(p.group,f,()=>3.3*p.group.scale.x*x*1.2),k=s?re(d,1):null,N=w?re(d,2):null,xe=re(d,3),G=a?re(d,4):null,B=r?re(d,5):null;for(const i of[k,N,xe,G,B])i&&z.add(i.points);const te=new M;(location.search.includes("debug")||location.search.includes("tune"))&&(window.__atmos={u:ue.uniforms,renderer:W,camera:f,prep:F?"fire":"wildtype",channel:p.group,methodsChannel:(a==null?void 0:a.group)??null,heroCell:s,aboutCell:w,endCell:r,puff:S,umap:(l==null?void 0:l.group)??null,stimulateAbout:(i,t)=>{const u=me.onScreen();return!!u&&me.at(i??u.x,t??u.y)},aboutOnScreen:()=>me.onScreen()});let ze=document.hidden,Re=performance.now(),ot=0;const A={x:0,y:0},P={x:99,y:99},Fe=new Be,Oe=new M().copy(ut),_=ue.uniforms;let at=`${n.motility}|${n.tempo}|${n.reach}`;const wt=i=>{if(ze||qe)return;const t=Math.min((i-Re)/1e3,.05);Re=i;const u=i/1e3,I=(g?0:Ve.current?1:.15)*(1-.6*e.sheet);_.uMotion.value=U(_.uMotion.value,I,1.2,t);const c=_.uMotion.value;ot+=t*n.rotation*c;const oe=Et(e.station,e.flight);A.x=g?0:U(A.x,y.pointer.x*.5,2,t),A.y=g?0:U(A.y,y.pointer.y*.35,2,t);const C=A.x+oe.x,Z=A.y+oe.y,$=e.enteredAt==null?-1:(i-e.enteredAt)/1e3,ae=e.gate&&!g,we=$<0?0:ae?Y(0,1,$/1.6):1;d.uDefocus.value=1-we,e.push=.8*(1-we),f.position.set(C,Z,e.camZ+e.push),f.rotation.z=oe.roll;const ne=de+(g?0:Lt*At(e.flight));if(ne!==fe&&(fe=ne,f.fov=fe,f.updateProjectionMatrix()),_.uTime.value=u,_.uRot.value=ot,_.uCamZ.value=e.camZ+e.push,_.uCamXY.value.set(C,Z),_.uBreath.value=g?0:n.breath,_.uWake.value=g?0:n.wake,d.uSize.value=n.size,d.uAlpha.value=n.density*(1-.7*e.sheet),d.uLens.value=!g&&n.lens&&y.pointerSeen?1:0,y.pointerSeen&&!g?Oe.set(y.pointer.x*.9,y.pointer.y*.8+.35,.7).normalize():Oe.copy(ut),d.uLight.value.lerp(Oe,1-Math.exp(-2.5*t)).normalize(),y.pointerSeen){const o=window.innerHeight/2/lt*T,b=C+y.pointer.x*o*f.aspect,E=Z+y.pointer.y*o;P.x=P.x===99?b:U(P.x,b,3.5,t),P.y=P.y===99?E:U(P.y,E,3.5,t),d.uPointer.value.set(P.x,P.y),Fe.set(P.x,P.y)}const be=Pt(e.camZ);_.uFade.value=1-be,Ke.visible=be>.005;const Me=`${n.motility}|${n.tempo}|${n.reach}`;Me!==at&&(at=Me,s==null||s.setMotility({motility:n.motility,tempo:n.tempo,reach:n.reach}),w==null||w.setMotility({motility:n.motility,tempo:n.tempo}),r==null||r.setMotility({motility:n.motility,tempo:n.tempo,reach:n.reach}));const v=o=>Math.abs(e.camZ-o.position.z-T),ie=(o,b,E,De)=>E.position.copy(o).addScaledVector(b,1-Ne(e.camZ-o.z,De)),it=o=>1-Math.min(1,Math.max(0,e.camZ-o.position.z-T)/Ut);if(s){if(s.reveal=$>=0?1:0,s.draw=$<0?0:ae?Y(0,1,($-.5)/1.2):1,s.group.visible=v(s.group)<X&&s.draw>.001,e.station===0&&(mt(),s.group.position.copy(Qe),s.group.scale.setScalar(he)),s.group.visible){s.group.rotation.y=u*.15*c+A.x*.3,s.group.rotation.x=-.1+A.y*.18;const o=1-Y(2.5,9,Math.abs(e.camZ-m.z));s.maxPx=m.maxPx+(Qt-m.maxPx)*o,s.update(t,c,y.pointerSeen&&!g?Fe:null,n.activation)}if(k){const o=R.bound*s.group.scale.x*.62;k.place(te.copy(s.group.position),o,o),k.update(s.group.visible?s.reveal*(1-Math.min(1,v(s.group)/10)):0)}}ie(ee,$t,h);const We=e.station===1?Y(0,.12,e.flight):0;if(h.position.y+=e.pan/x*(1-We)+(dt.y-ee.y)*We,h.position.x+=(dt.x-ee.x)*We,h.visible=v(h)<X,h.visible)if(h.rotation.y=u*.1*c+.6,w){const o=Y(ft[0],ft[1],y.acts.cell);w.update(t,c,null,Math.max(o,n.activation))}else S==null||S.update(t,c,1);if(N){const o=R.bound*h.scale.x*.62;N.place(te.copy(h.position),o,o),N.update(h.visible?1-Math.min(1,v(h)/10):0)}const Se=e.sheet;if(ie(ge,Vt,p.group,Yt),p.group.position.x+=(ht()+3.3*le.scale+.4-ge.x)*Se,p.group.visible=v(p.group)<X,p.group.visible){const o=1-Math.min(1,v(p.group)/10);ye.active||(p.group.rotation.y+=t*(.38*c+ye.spin),ye.spin*=Math.pow(.03,t)),p.ionBoost=1+(Jt-1)*(e.station===1?Math.sin(Math.PI*e.flight):0),p.update(t,c,o,it(p.group))}{const o=3.3*p.group.scale.x;xe.place(te.copy(p.group.position).setY(p.group.position.y-o*.25),o*.95,o*.42),xe.update(p.group.visible?1-Math.min(1,v(p.group)/10):0)}if(a){const o=e.station===2?Math.sin(Math.PI*e.flight):0,b=L.scale*(1+(oo-1)*Se)+(Xt-L.scale)*o;if(a.group.scale.setScalar(b),ie(ve,qt,a.group),a.group.position.x+=(ht()+3.3*b+.3-ve.x)*Se,a.group.position.y+=(e.station===3?e.pan/x:0)*(1-Se),a.group.visible=v(a.group)<X,a.group.visible){const E=1-Math.min(1,v(a.group)/10);a.group.rotation.x=L.tilt+(jt-L.tilt)*o,a.ionBoost=1+(Kt-1)*o,a.group.rotation.y+=t*.3*c,a.update(t,c,E,it(a.group))}if(G){const E=3.3*a.group.scale.x;G.place(te.copy(a.group.position).setY(a.group.position.y-E*.3),E*.95,E*.45),G.update(a.group.visible?1-Math.min(1,v(a.group)/10):0)}}if(r){const o=e.station>=4;if(r.group.visible=o&&v(r.group)<X,r.group.visible&&(gt(),r.group.position.copy(_e),r.group.position.y+=e.station===5?e.pan/x:0,r.draw=g?1:Ne(e.camZ-H.z),r.group.rotation.y=u*.15*c+A.x*.3,r.group.rotation.x=-.1+A.y*.18,r.update(t,c,y.pointerSeen&&!g?Fe:null,n.activation)),B){const b=R.bound*r.group.scale.x*.62;B.place(te.copy(r.group.position),b,b),B.update(r.group.visible?r.draw*(1-Math.min(1,v(r.group)/10)):0)}}if(l&&D){const o=-3*Q,b=e.camZ-o,E=Math.abs(b-T)<6&&e.station===3&&e.flight===0,De=e.station===2&&e.flight>0&&b<=36,st=document.getElementById("umap-anchor");if((E||De)&&st){const V=st.getBoundingClientRect();if(V.height>10){const Ie=x*T/b;tt.set(C+(V.left+V.width/2-window.innerWidth/2)/Ie,Z+(window.innerHeight/2-(V.top+V.height/2))/Ie,o),He=Math.min(V.width,V.height)/2/Ie*.95}}const rt=e.station===3&&e.flight>0?e.flight:0,se=Y(0,.4,rt);l.group.position.copy(tt).addScaledVector(vt,1-Ne(e.camZ-o)),l.group.position.lerp(new M(C*.3,Z,xt),se),l.group.scale.setScalar(He+(yt-He)*se),l.maxPx=9+13*se,l.reveal=U(l.reveal,l.ready?1-Y(.8,1,rt):0,2.5,t),l.hoverEnabled=se<.05&&e.sheet<.5,l.labelsEnabled=se<.3&&e.sheet<.5,l.group.visible=l.ready&&v(l.group)<X&&l.reveal>.01,l.group.visible?(D.active||(l.group.rotation.y+=t*D.spin,D.spin*=Math.pow(.03,t)),l.update(t,c,f,y.pointerSeen?y.pointer:null,!D.active&&!g)):(Ee.labels.length||Ee.hover)&&(Ee.labels=[],Ee.hover=null)}W.render(z,f)},nt=()=>{ze=document.hidden,ze||(Re=performance.now())};return document.addEventListener("visibilitychange",nt),e.tick=wt,()=>{qe=!0,e.tick=null,document.removeEventListener("visibilitychange",nt),window.removeEventListener("resize",Pe),window.removeEventListener("resize",Te),ye.dispose(),D==null||D.dispose(),me.dispose(),k==null||k.dispose(),N==null||N.dispose(),xe.dispose(),G==null||G.dispose(),B==null||B.dispose(),r==null||r.dispose(),l==null||l.dispose(),p.dispose(),a==null||a.dispose(),s==null||s.dispose(),w==null||w.dispose(),S==null||S.dispose(),q.dispose(),ue.dispose(),W.dispose(),W.domElement.remove()}},[]),bt.jsx("div",{ref:$e,className:"atmos fixed inset-0 z-0 pointer-events-none","aria-hidden":"true"})}export{ro as default};
