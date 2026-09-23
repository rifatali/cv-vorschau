import{V as C,B as it,a as $,S as ft,b as ct,c as Pe,P as lt,G as Ft,F as et,D as Po,R as Eo,g as To,N as Le,f as Ro,h as io,i as Io,M as co,j as Do}from"./three-BH243BCb.js";import{D as pt,E as Qt,a as Fe,I as Lo,u as V,s as Fo,U as _e}from"./index-UNr2R4Mh.js";const Jt=new Set,Ce=new Map,te=new Set,ze={register(t){return te.add(t),()=>{te.delete(t)}},hasRig(t){return te.has(t)},emit(t){Ce.set(t.rig,t.time),Jt.forEach(e=>e(t))},subscribe(t){return Jt.add(t),()=>{Jt.delete(t)}},lastEvent(t){return Ce.get(t)??-1/0}},_t=`
  const vec3 GRAPHITE = vec3(0.24, 0.23, 0.23);
  const vec3 GRAPHITE_LIGHT = vec3(0.50, 0.48, 0.46);
  const vec3 GRAPHITE_DEEP = vec3(0.12, 0.11, 0.11);
  const vec3 AMBER = vec3(0.776, 0.486, 0.149);
`,Ct=`
  float stroke(vec2 uv, float seed, float sharp, float px) {
    float ang = seed * 6.2831853;
    float c = cos(ang), s = sin(ang);
    vec2 q = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);
    float elong = mix(1.0, 1.6, smoothstep(2.5, 5.0, px));
    float r = length(q * vec2(1.0, elong));
    float soft = mix(0.08, 0.34, sharp);
    return smoothstep(0.5, soft, r);
  }
`,lo=`
  float sphere(vec2 pointCoord, out vec3 col) {
    vec2 uv = (pointCoord - 0.5) * 2.0;
    float r2 = dot(uv, uv);
    if (r2 > 1.0) { col = vec3(0.0); return 0.0; }
    vec3 n = vec3(uv.x, -uv.y, sqrt(1.0 - r2));
    vec3 L = normalize(vec3(-0.55, 0.7, 0.55));
    float lit = 0.35 + 0.65 * max(0.0, dot(n, L));
    vec3 amber = vec3(0.86, 0.56, 0.17);
    vec3 deep = vec3(0.50, 0.28, 0.06);
    col = mix(deep, amber, lit);
    col = mix(col, deep * 0.8, 0.55 * smoothstep(0.5, 1.0, r2));
    return 1.0 - smoothstep(0.8, 1.0, r2);
  }
`,_o=new C(-.5,.75,.45).normalize();function Xa(){return{uDefocus:{value:0},uLight:{value:_o.clone()}}}const Co=`
  attribute float aSeed;
  uniform float uDpr;
  uniform vec2 uRadius;      // world units, x and y
  uniform float uPx;         // the strokes' size in px at the plane in focus
  varying float vA;
  varying float vSeed;
  void main() {
    vec3 p = vec3(position.xy * uRadius, 0.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    float persp = ${pt.toFixed(1)} / max(dist, 1.0);
    gl_PointSize = clamp(uPx * uDpr * persp * (0.7 + 0.6 * fract(aSeed * 7.31)), 1.0, 96.0 * uDpr);
    vA = 1.0 - smoothstep(0.55, 1.0, length(position.xy));
    vSeed = aSeed;
  }
`,zo=`
  precision highp float;
  ${_t}
  uniform float uAlpha;
  uniform float uStrength;
  varying float vA;
  varying float vSeed;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    // A soft grain of graphite rubbed into the paper: a gaussian, not a disc.
    float a = exp(-r * r * 11.0) * vA * uStrength * uAlpha;
    if (a < 0.002) discard;
    gl_FragColor = vec4(GRAPHITE, a);
  }
`,ee=20,ke={x:.16,y:-.22},ko=.011;function Ka(t,e=1){let a=e*7919+13;const n=()=>(a=a*1664525+1013904223>>>0,a/4294967296),o=()=>Math.sqrt(-2*Math.log(1-n()))*Math.cos(2*Math.PI*n()),i=new Float32Array(ee*3),u=new Float32Array(ee);for(let c=0;c<ee;c++)i[c*3]=o()*.5,i[c*3+1]=o()*.5,i[c*3+2]=0,u[c]=n();const h=new it;h.setAttribute("position",new $(i,3)),h.setAttribute("aSeed",new $(u,1)),h.boundingSphere=new ft(new C,30);const f=new ct({vertexShader:Co,fragmentShader:zo,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uDpr:t.uDpr,uAlpha:t.uAlpha,uRadius:{value:new Pe(1,1)},uPx:{value:40},uStrength:{value:0}}}),s=new lt(h,f);return s.frustumCulled=!1,s.renderOrder=-1,{points:s,place(c,r,l,p=60){s.position.set(c.x+r*ke.x,c.y+l*ke.y,c.z),f.uniforms.uRadius.value.set(r,l),f.uniforms.uPx.value=Math.max(r,l)*p*.9},update(c){f.uniforms.uStrength.value=ko*Math.max(0,Math.min(1,c)),s.visible=c>.01},dispose(){h.dispose(),f.dispose()}}}const bt=3.3,uo=1.3,ja={radius:bt,halfHeight:4.2},Bo=.36,Gt=12,kt=t=>.78+.42*Math.pow(t/.95,2),oe=t=>.22+.3*Math.pow(t/.95,2),Ho=[.5,.17,-.17,-.5],Oo=`
  attribute float aSeed;
  attribute float aKind;     // 0 membrane head, 1 tail dot, 2 outer wall, 3 pore wall
  attribute vec3 aNormal;    // the surface normal, object space
  uniform float uTime;
  uniform float uDpr;
  uniform float uLens;
  uniform float uDefocus;
  uniform vec3 uLight;
  uniform vec2 uPointer;
  uniform vec3 uIons[${Gt}];
  uniform int uIonCount;
  varying float vAlpha;
  varying float vGlow;
  varying float vShade;
  varying float vHemi;
  varying float vRim;
  varying float vFoc;
  varying float vLens;
  varying float vSeed;
  varying float vPx;

  void main() {
    vec3 p = position;
    // Lipids move thermally: a tiny, shared undulation of the two sheets.
    if (aKind < 1.5) {
      p.y += sin(p.x * 2.1 + uTime * 0.9) * 0.012 + cos(p.z * 2.4 + uTime * 0.7) * 0.012;
    }
    // The current lights the wall as it passes.
    float glow = 0.0;
    for (int i = 0; i < ${Gt}; i++) {
      if (i < uIonCount) {
        float d = distance(position, uIons[i]);
        glow += smoothstep(0.62, 0.0, d);
      }
    }
    glow = min(glow, 1.0) * step(1.5, aKind);

    vec4 wp = modelMatrix * vec4(p, 1.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    float foc = (1.0 - smoothstep(0.0, 18.0, abs(dist - ${pt.toFixed(1)}))) * (1.0 - uDefocus);
    float lens = smoothstep(4.4, 0.0, length(wp.xy - uPointer)) * uLens;
    float persp = 300.0 / max(dist, 1.0);

    // The light, in camera space: the lamp (a world direction that follows the hand) and the normal are both
    // taken into the camera's frame, so the light stays where it is while the channel turns. A hemisphere
    // (warm above, cool below) and a rim on the silhouette; the walls' far sides, turned away from the reader,
    // are drawn smaller and paler in place of the missing depth test.
    vec3 nw = normalize(mat3(modelMatrix) * aNormal);
    vec3 nv = normalize(normalMatrix * aNormal);
    vec3 lv = normalize(mat3(viewMatrix) * uLight);
    float key = 0.5 + 0.5 * dot(nv, lv);
    float hemi = 0.5 + 0.5 * nw.y;
    float rim = pow(1.0 - abs(nv.z), 2.2);
    float facing = aKind > 1.5 ? 0.5 + 0.5 * nv.z : 1.0;

    float size = aKind < 0.5 ? 3.0 : (aKind < 1.5 ? 1.6 : (aKind < 2.5 ? 2.1 : 1.9));
    size *= 0.85 + 0.3 * fract(aSeed * 7.31);
    size *= 1.0 + glow * 0.6;
    size *= mix(0.78, 1.0, facing);
    // Out of focus the strokes grow to soft discs and pale by their area.
    float bokeh = 1.0 + (1.0 - foc) * 1.2;
    float px = clamp(size * uDpr * persp * 0.05 * bokeh, 0.75, 14.0 * uDpr);
    gl_PointSize = px;

    // A drawn body: the side toward the lamp is sparse and light, the far side hatched denser, the silhouette pressed.
    float base = aKind < 0.5 ? 0.5 : (aKind < 1.5 ? 0.3 : (aKind < 2.5 ? 0.3 + 0.3 * (1.0 - key) : 0.42));
    vAlpha = base * (0.04 + 0.96 * foc) / (bokeh * bokeh) * mix(1.0 - 0.2 * uLens, 1.5, lens) * (1.0 + glow * 1.4) * (1.0 + 0.3 * rim) * mix(0.55, 1.0, facing);
    vGlow = glow;
    vShade = key;
    vHemi = hemi;
    vRim = rim;
    vFoc = foc;
    vLens = lens;
    vSeed = aSeed;
    vPx = px;
  }
`,No=`
  precision highp float;
  ${_t}
  ${Ct}
  uniform float uAlpha;
  varying float vAlpha;
  varying float vGlow;
  varying float vShade;
  varying float vHemi;
  varying float vRim;
  varying float vFoc;
  varying float vLens;
  varying float vSeed;
  varying float vPx;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float sharp = vFoc * (1.0 - 0.5 * vLens);
    float a = stroke(uv, vSeed, sharp, vPx) * vAlpha * uAlpha;
    if (a < 0.004) discard;
    // Lit graphite: light on the lit side, deep on the far side, a hint of warmth from above and cool from below,
    // and the silhouette pressed darker.
    vec3 col = mix(GRAPHITE, GRAPHITE_LIGHT, vShade);
    col += mix(vec3(-0.02, -0.01, 0.01), vec3(0.03, 0.02, 0.0), vHemi);
    col = mix(col, GRAPHITE_DEEP, vRim * 0.45);
    col = mix(col, AMBER, vGlow * 0.75);
    gl_FragColor = vec4(col, min(1.0, a));
  }
`,Uo=`
  attribute float aSize;
  attribute float aAlpha;
  uniform float uDpr;
  uniform float uBoost;
  varying float vA;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float persp = 300.0 / max(-mv.z, 1.0);
    // An ion is as small as its channel: the size follows the rig's scale (the Research channel's 0.85 is the measure).
    float sc = pow(length(modelMatrix[0].xyz) / 0.85, 0.7);
    gl_PointSize = aSize * uDpr * persp * 0.034 * sc * uBoost;
    vA = aAlpha;
  }
`,$o=`
  precision highp float;
  ${lo}
  uniform float uAlpha;
  varying float vA;
  void main() {
    vec3 col;
    float edge = sphere(gl_PointCoord, col);
    float a = edge * vA * uAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(col, min(1.0, a));
  }
`;function Et(t,e,a,n,o,i,u,h){const f=Math.hypot(i,u,h)||1;t.pos.push(e,a,n),t.seed.push(Math.random()),t.kind.push(o),t.normal.push(i/f,u/f,h/f)}function Go(t,e=uo){const o=Math.ceil(bt/.20351),i=Math.ceil(bt/.235);for(let u=-o;u<=o;u++)for(let h=-i;h<=i;h++){const f=h*.235+(u%2?.1175:0)+(Math.random()-.5)*.05,s=u*.20351+(Math.random()-.5)*.05,c=Math.hypot(f,s);if(c>bt||c<e)continue;const r=bt*.78;if(!(c>r&&Math.random()<(c-r)/(bt-r)))for(const l of[1,-1]){const p=l*Bo+(Math.random()-.5)*.03;Et(t,f,p,s,0,0,l,0);for(let d=1;d<=4;d++){const m=d/4.6;Et(t,f+(Math.random()-.5)*.05,p-l*(.07+.26*m),s+(Math.random()-.5)*.05,1,0,l,0)}}}}function Wo(t){const e=7*Math.PI/180,a=Math.PI/2,n=110;for(let o=0;o<=n;o++){const i=-.95+1.9*o/n,u=kt(i),h=(kt(i+.01)-kt(i-.01))/.02,f=Math.round(2*Math.PI*u/.036);for(let r=0;r<f;r++){const l=r/f*Math.PI*2+o%2*(Math.PI/f);if((l%a+a)%a<e||(l%a+a)%a>a-e)continue;const d=.02,m=Math.cos(l),T=Math.sin(l);Et(t,m*u+(Math.random()-.5)*d,i+(Math.random()-.5)*d,T*u+(Math.random()-.5)*d,2,m,-h,T)}const s=oe(i),c=Math.round(2*Math.PI*s/.042);for(let r=0;r<c;r++){const l=r/c*Math.PI*2+o%2*(Math.PI/c),p=Math.cos(l),d=Math.sin(l);Et(t,p*s,i,d*s,3,-p,.2,-d)}}for(const o of[-.95,.95])for(let i=0;i<8;i++){const u=i/7,h=oe(o)+(kt(o)-oe(o))*u,f=Math.round(2*Math.PI*h/.042);for(let s=0;s<f;s++){const c=s/f*Math.PI*2,r=(c%a+a)%a;r<e||r>a-e||Et(t,Math.cos(c)*h,o,Math.sin(c)*h,2,0,o>0?1:-1,0)}}}const Be=10,yt=8,He=3.9,Vo=-4;function Ya(t,e="research",a={}){const n=a.channel!==!1,o=n?ze.register(e):()=>{},i=new Ft,u=[],h={pos:[],seed:[],kind:[],normal:[]};Go(h,n?uo:0),n&&Wo(h);const f=new it;f.setAttribute("position",new et(h.pos,3)),f.setAttribute("aSeed",new et(h.seed,1)),f.setAttribute("aKind",new et(h.kind,1)),f.setAttribute("aNormal",new et(h.normal,3)),f.boundingSphere=new ft(new C,12);const s=Array.from({length:Gt},()=>new C(0,99,0)),c=new ct({vertexShader:Oo,fragmentShader:No,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uTime:{value:0},uDpr:t.uDpr,uLens:t.uLens,uDefocus:t.uDefocus,uLight:t.uLight,uPointer:t.uPointer,uAlpha:{value:1},uIons:{value:s},uIonCount:{value:0}}});i.add(new lt(f,c)),u.push(f,c);const r=Be*(1+yt),l=new Float32Array(r*3),p=new Float32Array(r),d=new Float32Array(r),m=new it;m.setAttribute("position",new $(l,3)),m.setAttribute("aSize",new $(p,1)),m.setAttribute("aAlpha",new $(d,1)),m.boundingSphere=new ft(new C,20);const T=new ct({vertexShader:Uo,fragmentShader:$o,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uDpr:t.uDpr,uAlpha:{value:1},uBoost:{value:1}}}),g=new lt(m,T);g.visible=n,i.add(g),u.push(m,T);const y=[],D=(w,P)=>{w.y=He,w.angle=Math.random()*Math.PI*2,w.radius=.9+Math.random()*.5,w.delay=P,w.dwell=.55+Math.random()*.35,w.gap=.28+Math.random()*.17,w.trail=[]};for(let w=0;w<Be;w++){const P={y:He,angle:0,radius:0,delay:0,dwell:.78,gap:.34,trail:[]};D(P,w*.7),y.push(P)}let I=0;const L=(w,P)=>{if(Math.abs(w)>.95)return 1.15;let _=.62;for(const M of Ho)_*=1-P*Math.exp(-Math.pow((w-M)/.07,2));return _},b={group:i,ionBoost:1,update:(w,P,_,M=_)=>{if(c.uniforms.uTime.value+=w*P,c.uniforms.uAlpha.value=.05+.95*_,T.uniforms.uAlpha.value=.1+.9*Math.max(_,M),T.uniforms.uBoost.value=b.ionBoost,!n)return;I+=w;const R=I>.04;R&&(I=0);const H=y.map((E,F)=>F).sort((E,F)=>y[E].y-y[F].y);H.forEach((E,F)=>{const v=y[E];if(v.delay>0){v.delay-=w*P;return}let k=w*L(v.y,v.dwell)*P;if(F>0){const G=y[H[F-1]],S=v.y-G.y,O=Math.abs(v.y)<1.4?v.gap:.55;S-k<O&&(k=Math.max(0,S-O))}const N=v.y;v.y-=k,N>0&&v.y<=0&&ze.emit({time:performance.now(),rig:e,ion:E}),v.angle+=w*(1.1+.3*Math.sin(E))*P;const z=Math.abs(v.y)<1?0:Math.min(1.4,(Math.abs(v.y)-1)*.55+.05);v.radius+=(z-v.radius)*Math.min(1,w*5),v.y<Vo&&D(v,.4+Math.random()*1.2)});let x=0;y.forEach((E,F)=>{const v=E.delay<=0,k=Math.cos(E.angle)*E.radius,N=Math.sin(E.angle)*E.radius;R&&v&&(E.trail.unshift(k,E.y,N),E.trail.length>yt*3&&(E.trail.length=yt*3)),v&&Math.abs(E.y)<1.5&&x<Gt&&s[x++].set(k,E.y,N);const z=v?Math.max(0,Math.min(1,(4.2-Math.abs(E.y))/.9)):0,G=Math.abs(E.y)<.95?1:0,S=F*(1+yt);l[S*3]=k,l[S*3+1]=E.y,l[S*3+2]=N,p[S]=9.5+G*2.5,d[S]=z;for(let O=0;O<yt;O++){const U=S+1+O,B=O*3,q=E.trail.length>B+2;l[U*3]=q?E.trail[B]:k,l[U*3+1]=q?E.trail[B+1]:E.y,l[U*3+2]=q?E.trail[B+2]:N;const Q=1-(O+1)/(yt+1);p[U]=1.6+4.6*Q,d[U]=q?z*Q*.32:0}}),c.uniforms.uIonCount.value=x,m.attributes.position.needsUpdate=!0,m.attributes.aSize.needsUpdate=!0,m.attributes.aAlpha.needsUpdate=!0},dispose:()=>{o(),u.forEach(w=>w.dispose())}};return b}const qo=.45,Xo=.2,Bt=18,Oe=36,Ko=.9,jo=4,ne=.35,Ht=.3,Yo=1.5,Zo=.8,Qo=.6,Jo=.7,tn=.3;function en(t){return()=>{t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function Ne(t,e={}){const a=t.branches.length,n=en(e.seed??1),o=e.motility??1,i=e.tempo??1,u=Ko*(e.reach??1),h=new Float32Array(a),f=new Float32Array(a),s=new Float32Array(a),c=new Float32Array(a),r=new Float32Array(a),l=new Float32Array(a*3);t.branches.forEach((I,L)=>{h[L]=I.isTip?qo:I.depth===4?Xo:0,f[L]=2*Math.PI/(Bt+n()*(Oe-Bt)),s[L]=2*Math.PI/(Bt+n()*(Oe-Bt)),c[L]=n()*Math.PI*2,r[L]=n()*Math.PI*2;const A=I.points.length-3;l[L*3]=I.points[A],l[L*3+1]=I.points[A+1],l[L*3+2]=I.points[A+2]});const p=new Float32Array(a).fill(1),d=new Float32Array(a*3),m=new Uint8Array(a),T=[];let g=0;const y={ext:p,disp:d,somaScale:1,thickness:1,update:D};function D({dt:I,motion:L,pointer:A,activation:b}){if(L<=0||I<=0)return;if(g+=I*L*i,m.fill(0),A){T.length=0;for(let P=0;P<a;P++){if(!t.branches[P].isTip)continue;const _=Math.hypot(A[0]-l[P*3],A[1]-l[P*3+1],A[2]-l[P*3+2]);_<u&&T.push({i:P,d:_})}T.sort((P,_)=>P.d-_.d);for(let P=0;P<Math.min(jo,T.length);P++)m[T[P].i]=1}const w=Math.max(0,Math.min(1,b));for(let P=0;P<a;P++){const _=t.branches[P],M=.6*Math.sin(f[P]*g+c[P])+.4*Math.sin(s[P]*g+r[P]);let R=m[P]?1:1-h[P]*o*(.5+.5*M);_.depth>=2&&(R*=1-Qo*w);const H=m[P]?Yo:Zo,x=1-Math.exp(-H*I*L);p[P]+=(R-p[P])*x,p[P]<0&&(p[P]=0),p[P]>1&&(p[P]=1);let E=0,F=0,v=0;if(m[P]&&A){E=(A[0]-l[P*3])*ne,F=(A[1]-l[P*3+1])*ne,v=(A[2]-l[P*3+2])*ne;const k=Math.hypot(E,F,v);k>Ht&&(E*=Ht/k,F*=Ht/k,v*=Ht/k)}d[P*3]+=(E-d[P*3])*x,d[P*3+1]+=(F-d[P*3+1])*x,d[P*3+2]+=(v-d[P*3+2])*x}y.somaScale=1+Jo*w,y.thickness=1+tn*w}return y}const on=4,ho=10,nn=.16,an=.03,ae=320;function Wt(t){return()=>{t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}const se=t=>t.toFixed(3),sn=`
  attribute float aSeed;
  uniform float uT;            // seconds since the puff, < 0 none
  uniform vec3 uOrigin;
  uniform vec3 uDrift;
  uniform float uDpr;
  uniform float uReveal;
  varying float vA;
  void main() {
    float t = max(uT, 0.0);
    // Diffusion: each point is one draw of a Gaussian whose width grows with the square root of time, for
    // PUFF_SPREAD seconds; after that the cloud only drifts and fades.
    vec3 p = uOrigin + position * (${se(nn)} * sqrt(min(t, ${se(on)}))) + uDrift * t;
    p += vec3(sin(t * 3.1 + aSeed * 40.0), cos(t * 2.7 + aSeed * 30.0), sin(t * 2.3 + aSeed * 20.0)) * 0.012 * sqrt(t);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    float foc = 1.0 - smoothstep(0.0, 18.0, abs(dist - ${pt.toFixed(1)}));
    float persp = 300.0 / max(dist, 1.0);
    gl_PointSize = clamp((1.3 + 1.4 * fract(aSeed * 7.31)) * uDpr * persp * 0.045 * (1.0 + (1.0 - foc) * 1.2), 0.75, 6.0 * uDpr);
    float fade = smoothstep(0.0, 0.12, t) * (1.0 - smoothstep(3.0, ${se(ho)}, t));
    // The gradient: dense at the source, thin outside — the outer draws are paler.
    float inner = 1.0 - 0.55 * smoothstep(0.8, 2.2, length(position));
    vA = fade * inner * (0.45 + 0.4 * fract(aSeed * 3.3)) * (0.04 + 0.96 * foc) * uReveal;
  }
`,rn=`
  precision highp float;
  uniform float uAlpha;
  varying float vA;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.2, r) * vA * uAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(0.776, 0.486, 0.149, a);
  }
`;function cn(t,e=1){const a=Wt(e*17+3),n=()=>Math.sqrt(-2*Math.log(1-a()))*Math.cos(2*Math.PI*a()),o=new Float32Array(ae*3),i=new Float32Array(ae);for(let r=0;r<ae;r++)o[r*3]=n(),o[r*3+1]=n(),o[r*3+2]=n(),i[r]=a();const u=new it;u.setAttribute("position",new $(o,3)),u.setAttribute("aSeed",new $(i,1));const h=new ct({vertexShader:sn,fragmentShader:rn,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uT:{value:-1},uOrigin:{value:new C},uDrift:{value:new C},uDpr:t.uDpr,uAlpha:t.uAlpha,uReveal:{value:1}}}),f=new lt(u,h);f.frustumCulled=!1,f.visible=!1;const s=Wt(e*5+11);let c=-1;return{points:f,get t(){return c},start(r){c=0,h.uniforms.uOrigin.value.set(r.x,r.y,r.z),h.uniforms.uDrift.value.set(s()-.5,s()-.5,s()-.5).normalize().multiplyScalar(an)},update(r,l,p){c>=0&&(c+=r*l,c>ho&&(c=-1)),h.uniforms.uT.value=c,h.uniforms.uReveal.value=p,f.visible=c>=0},dispose(){u.dispose(),h.dispose()}}}function fo(t){const e=t.branches,a=e.length,n=new Float32Array(a).fill(-1),o=new Float32Array(a),i=new Int32Array(a),u=f=>{if(n[f]>=0)return n[f];const s=e[f];return s.parent<0?(n[f]=Math.hypot(s.points[0],s.points[1],s.points[2]),i[f]=f):(n[f]=u(s.parent)+e[s.parent].length,i[f]=i[s.parent]),n[f]};let h=0;for(let f=0;f<a;f++)o[f]=u(f)+e[f].length,o[f]>h&&(h=o[f]);return{rootDist:n,endDist:o,root:i,maxDist:h}}const me=.6,Ee=4,ve=.3,at=9,Vt=14,ln=.45,un=1.6,It=.09,po=1.7,Te=1.85,qt=1.35,re=[1.15,1.5],hn=.02,fn=.03,pn=.1,dn=80,mn=3,gt=4,vn=.5,wn=.8,Dt=[.15,.3,.3,.25],Ue=3,gn=Math.cos(dn*Math.PI/180),mt=(t,e)=>[t[0]-e[0],t[1]-e[1],t[2]-e[2]],ht=(t,e)=>[t[0]+e[0],t[1]+e[1],t[2]+e[2]],Y=(t,e)=>[t[0]*e,t[1]*e,t[2]*e],we=(t,e)=>t[0]*e[0]+t[1]*e[1]+t[2]*e[2],$e=(t,e)=>[t[1]*e[2]-t[2]*e[1],t[2]*e[0]-t[0]*e[2],t[0]*e[1]-t[1]*e[0]],K=t=>Math.hypot(t[0],t[1],t[2]),vt=t=>{const e=K(t);return e>1e-9?Y(t,1/e):[0,0,0]},Re=t=>t<0?0:t>1?1:t,Tt=t=>{const e=Re(t);return e*e*(3-2*e)},ge=t=>1-Math.pow(1-Re(t),3),yn=t=>[t.points[t.points.length-3],t.points[t.points.length-2],t.points[t.points.length-1]];function xn(t,e){const a=ln*e,n=un*e,o=K(t);return o>n?Y(t,n/o):o>=a?[t[0],t[1],t[2]]:o<1e-6?[a,0,0]:Y(t,a/o)}function Ge(t,e){const a=K(t);return a>1e-9?1+K(e)/a:1}function bn(t){return 1+Math.min(qt-1,Math.max(0,t-1)*((qt-1)/(Te-1)))}function Mn(t,e,a,n){const o=(po-1)*K(t),i=mt(e,t);if(K(i)<=o)return{to:i,capped:!1};const u=mt(a,t),h=K(u)-It*n,f=vt(u);return h<=o?{to:Y(f,Math.max(0,h)),capped:!1}:{to:Y(f,o),capped:!0}}function An(t,e){const a=(Te-1)*K(t),n=K(e);return n>a?Y(e,a/n):e}function Sn(t,e,a){return e-It*a<=(po-1)*K(t)}function Pn(t,e,a){const n=[];let o=e;for(;o>=0&&n.length<Dt.length&&!(a!=null&&a.has(o));)n.push(o),o=t.branches[o].parent;return n.reverse()}function En(t){const e=Dt.slice(Dt.length-t),a=e.reduce((o,i)=>o+i,0);let n=0;return e.map(o=>n+=o/a)}function Tn(t,e,a){const n=En(e.length),o=Tt((a-re[0])/(re[1]-re[0]));if(o<=0)return n;const i=e.map(s=>t.branches[s].length),u=i.reduce((s,c)=>s+c,0);let h=0;const f=i.map(s=>h+=s/u);return n.map((s,c)=>s+(f[c]-s)*o)}function Rn(t,e,a=t.bound,n=gt,o=mn){const i=vt(e),u=[];for(const l of t.branches){if(!l.isTip)continue;const p=yn(l),d=K(mt(p,e)),m=Sn(p,d,a)?0:1;u.push({id:l.id,end:p,d,side:we(vt(p),i),reach:m,key:m?1+(d-It*a)/Math.max(1e-6,K(p)):d})}u.sort((l,p)=>l.reach-p.reach||l.key-p.key);const h=u.filter(l=>l.side>=gn),f=h.length>=o?h:u,s=new Set,c=[],r=new Set;for(const[l,p]of[[0,Dt.length],[0,Ue],[1,Dt.length],[1,Ue]]){for(const d of f){if(c.length>=n)break;if(d.reach!==l||r.has(d.id))continue;const m=Pn(t,d.id,s);m.length<p||(m.forEach(T=>s.add(T)),r.add(d.id),c.push({tip:d.id,chain:m,end:d.end,dist:d.d}))}if(c.length>=o)break}return c.sort((l,p)=>l.dist-p.dist),c}function mo(t){const e=vt(t),a=Math.abs(e[1])>.9?[1,0,0]:[0,1,0],n=vt($e(e,a)),o=vt($e(e,n));return{u:n,v:o}}const In=t=>{let e=t%(2*Math.PI);return e>Math.PI&&(e-=2*Math.PI),e<-Math.PI&&(e+=2*Math.PI),e};function Dn(t,e,a,n){const o=n.length;if(o===0)return[];const{u:i,v:u}=mo(e),h=n.map(r=>{const l=mt(r,t);return Math.atan2(we(l,u),we(l,i))}),f=h.map((r,l)=>l).sort((r,l)=>h[r]-h[l]);let s={cost:1/0,shift:0,base:0};for(let r=0;r<o;r++){let l=0,p=0;f.forEach((T,g)=>{const y=h[T]-2*Math.PI*((g+r)%o)/o;l+=Math.cos(y),p+=Math.sin(y)});const d=Math.atan2(p,l);let m=0;f.forEach((T,g)=>{m+=Math.abs(In(h[T]-d-2*Math.PI*((g+r)%o)/o))}),m<s.cost&&(s={cost:m,shift:r,base:d})}const c=new Array(o);return f.forEach((r,l)=>{const p=s.base+2*Math.PI*((l+s.shift)%o)/o;c[r]=ht(t,ht(Y(i,a*Math.cos(p)),Y(u,a*Math.sin(p))))}),c}function Ln(t,e){return[me+ve*t,Ee-ve*(e-1-t)]}function Fn(t){return[at+ve*t,Vt]}function We(t,e=!1){return t<0?0:t>=at?e?0:1-ge((t-at)/(Vt-at)):e?1:Tt((t-me)/(Ee-me))}function _n(t,e=t.bound){const a=t.branches.length,n={cum:new Float32Array(a),chainRoot:new Int32Array(a).fill(-1),reach:new Float32Array(a),goal:new Float32Array(a*3),bulbs:new Float32Array(gt*4),bulbCount:0,polar:[0,0,0],nearest:1},o=[];let i=1;const u=()=>(i=i*1664525+1013904223>>>0,i/4294967296);function h(r,l,p=!1){const d=xn(r,e),m=Rn(t,d,e),{u:T,v:g}=mo(l),y=Dn(d,l,It*e,m.map(A=>A.end)),D=p?Ee:0,I=new Map;for(const A of o){const b=[];for(const w of A.growers)m.some(P=>P.tip===w.tip)?I.set(w.tip,w):(f(w,A,A.t,A.t+(Vt-at)),b.push(w));A.growers=b,A.cut||(A.cut={polar:We(A.t,A.instant),t:A.t})}const L=m.map((A,b)=>{const w=I.get(A.tip),[P,_]=Ln(b,m.length),{to:M,capped:R}=Mn(A.end,y[b],d,e);return{tip:A.tip,chain:A.chain,cum:w&&w.chain.length===A.chain.length&&w.chain[0]===A.chain[0]?w.cum:Tn(t,A.chain,Ge(A.end,M)),k:b,end:A.end,ring:y[b],dist:A.dist,from:w?[...w.cur]:[0,0,0],fromReach:w?w.reach:0,fromSwell:w?w.swell:0,to:M,capped:R,t0:P,t1:_,phase:"grow",wFrom:[0,0,0],wReach:0,wSwell:0,w0:0,w1:0,probe:[u()*Math.PI*2,u()*Math.PI*2],cur:w?[...w.cur]:[0,0,0],reach:w?w.reach:0,swell:w?w.swell:0}});o.push({t:D,instant:p,source:d,dir:vt(d),u:T,v:g,growers:L,cut:null})}function f(r,l,p,d){r.phase!=="withdraw"&&(r.phase="withdraw",r.wFrom=[...r.cur],r.wReach=r.reach,r.wSwell=r.swell,r.w0=p,r.w1=l.instant?p:d)}function s(r,l){const p=l.t;if(r.phase==="grow"&&!l.cut){const[d,m]=l.instant?[at,at]:Fn(r.k);p>=d&&f(r,l,d,m)}if(r.phase==="grow"){if(l.instant)r.cur=[...r.to],r.reach=1,r.swell=1;else{const d=Tt((p-r.t0)/(r.t1-r.t0));r.cur=ht(r.from,Y(mt(r.to,r.from),d)),r.reach=r.fromReach+(1-r.fromReach)*d;const m=p>=r.t1?Tt((p-r.t1)/vn):0;r.swell=Math.max(m,r.fromSwell*(1-d))}if(r.swell>0){const d=hn*e*r.swell,m=ht(Y(l.u,d*Math.sin(1.3*p+r.probe[0])),Y(l.v,d*Math.cos(.9*p+r.probe[1])));r.cur=An(r.end,ht(r.cur,m))}}else if(l.instant||r.w1<=r.w0)r.cur=[0,0,0],r.reach=0,r.swell=0;else{const d=ge((p-r.w0)/(r.w1-r.w0));r.cur=Y(r.wFrom,1-d),r.reach=r.wReach*(1-d),r.swell=r.wSwell*(1-Tt((p-r.w0)/wn))}}function c(r,l){n.cum.fill(0),n.chainRoot.fill(-1),n.reach.fill(0),n.goal.fill(0),n.bulbCount=0,n.polar=[0,0,0],n.nearest=1;const p=[];for(const m of o){m.t+=r*(m.instant?1:l);let T=!1;for(const y of m.growers){if(s(y,m),(y.reach>1e-4||y.swell>1e-4||y.phase==="grow")&&(T=!0),y.reach<=0&&y.swell<=0)continue;if(y.chain.forEach((L,A)=>{n.cum[L]=y.cum[A],n.chainRoot[L]=y.chain[0],n.reach[L]=y.reach,n.goal[L*3]=y.cur[0],n.goal[L*3+1]=y.cur[1],n.goal[L*3+2]=y.cur[2]}),y.swell>.001&&n.bulbCount<gt){const L=n.bulbCount++;n.bulbs[L*4]=y.end[0]+y.cur[0],n.bulbs[L*4+1]=y.end[1]+y.cur[1],n.bulbs[L*4+2]=y.end[2]+y.cur[2],n.bulbs[L*4+3]=y.swell}const D=K(mt(ht(y.end,y.cur),m.source)),I=It*e;n.nearest=Math.min(n.nearest,y.dist-I>.001?Re((D-I)/(y.dist-I)):0)}const g=m.cut?m.cut.polar*(m.instant?0:1-ge((m.t-m.cut.t)/(Vt-at))):We(m.t,m.instant);g>1e-4&&(T=!0,n.polar=ht(n.polar,Y(m.dir,g))),!T&&m.t>(m.cut?m.cut.t:at)&&p.push(m)}for(const m of p)o.splice(o.indexOf(m),1);const d=K(n.polar);d>1&&(n.polar=Y(n.polar,1/d))}return{out:n,stimulate:h,step:c,get numbers(){const r=o[o.length-1];return r?{t:r.t,source:r.source,tips:r.growers.map(l=>{const p=Ge(l.end,l.cur);return{branch:l.tip,rest:l.dist,now:K(mt(ht(l.end,l.cur),r.source)),stretch:p,size:bn(p),capped:l.capped}}),nearest:n.nearest,polar:K(n.polar)}:null},get active(){return o.length>0}}}const Cn=.12,vo=2e4,Ve=12;function zn(t,e=vo,a=1){const n=Wt(a),o=Math.round(e*Cn),i=e-o,u=t.branches.map(M=>M.length*(M.radius0+M.radius1)*.5),h=u.reduce((M,R)=>M+R,0),f=fo(t),s=new Float32Array(e*3),c=new Float32Array(e),r=new Float32Array(e),l=new Float32Array(e),p=new Float32Array(e),d=new Float32Array(e),m=new Float32Array(e*3),T=new Float32Array(e);let g=0;for(;g<o;g++){const M=n()*2-1,R=n()*Math.PI*2,H=Math.sqrt(1-M*M),x=n(),E=t.soma*(.85+.3*x);s[g*3]=H*Math.cos(R)*E,s[g*3+1]=M*E,s[g*3+2]=H*Math.sin(R)*E,m[g*3]=H*Math.cos(R),m[g*3+1]=M,m[g*3+2]=H*Math.sin(R),T[g]=x,c[g]=-1,r[g]=0,l[g]=n(),p[g]=1,d[g]=0}const y=u.map(M=>i*M/h),D=y.map(Math.floor);let I=i-D.reduce((M,R)=>M+R,0);const L=y.map((M,R)=>({k:R,frac:M-Math.floor(M)})).sort((M,R)=>R.frac-M.frac);for(let M=0;I>0&&M<L.length;M++,I--)D[L[M].k]++;const A=new C,b=new C,w=new C,P=new C(0,1,0),_=new C;return t.branches.forEach((M,R)=>{const H=M.points.length/3;for(let x=0;x<D[R];x++,g++){const E=n(),F=E*M.length;let v=0;for(;v<H-2&&M.cum[v+1]<F;)v++;const k=M.cum[v+1]-M.cum[v],N=k>0?(F-M.cum[v])/k:0,z=M.points[v*3],G=M.points[v*3+1],S=M.points[v*3+2],O=M.points[v*3+3],U=M.points[v*3+4],B=M.points[v*3+5];_.set(z+(O-z)*N,G+(U-G)*N,S+(B-S)*N),A.set(O-z,U-G,B-S).normalize(),A.lengthSq()===0&&A.set(0,1,0),b.crossVectors(A,Math.abs(A.y)>.9?new C(1,0,0):P).normalize(),w.crossVectors(A,b);const q=(M.radius0+(M.radius1-M.radius0)*E)*(.85+.3*n()),Q=n()*Math.PI*2,tt=Math.cos(Q),nt=Math.sin(Q);_.addScaledVector(b,tt*q).addScaledVector(w,nt*q),s[g*3]=_.x,s[g*3+1]=_.y,s[g*3+2]=_.z,m[g*3]=b.x*tt+w.x*nt,m[g*3+1]=b.y*tt+w.y*nt,m[g*3+2]=b.z*tt+w.z*nt,c[g]=R,r[g]=E,l[g]=n(),p[g]=0,d[g]=f.rootDist[R]+E*M.length}}),{position:s,aBranch:c,aT:r,aSeed:l,aSoma:p,aDist:d,aNormal:m,aShell:T,count:e}}const ye=3,ie=[0,1,2].map(t=>((t+.5)/ye).toFixed(4)),kn=(qt-1)/(Te-1),St=t=>t.toFixed(3),Bn=.085,Hn=.11,On=.6,Nn=`
  attribute float aSeed;
  attribute float aBranch;
  attribute float aT;
  attribute float aSoma;
  attribute float aDist;         // arc distance from the soma along the skeleton
  attribute vec3 aNormal;        // the surface normal, cell space
  attribute float aShell;        // soma: 0 deep inside, 1 on the skin
  uniform sampler2D uBranch;     // row 0 per branch: ext, the displacement of its end; row 1: reach, the displacement of its root; row 2: stretch, chain reach
  uniform float uBranchCount;
  uniform float uStretch;      // 1 while a chain grows: row 2 is read
  uniform float uSomaScale;
  uniform float uThickness;
  uniform float uReveal;       // 0 before the reader enters, 1 once in
  uniform float uDraw;         // 0..1 how far the cell has been drawn from the soma outward
  uniform float uSize;
  uniform float uDpr;
  uniform float uMaxPx;        // cap of a stroke in px (larger near the lens, on the flight through the cell)
  uniform float uLens;
  uniform float uDefocus;
  uniform float uDefocusShare; // the cell's share of the lens's defocus: 1 all of it; the cell in the eyepiece is nearly sharp
  uniform vec3 uLight;
  uniform vec2 uPointer;
  // Phagocytosis: the tip of one process folds into a cup around a particle, then a bulge travels inward.
  uniform float uPhagoBranch;  // -1 while nothing is being eaten
  uniform vec3 uTarget;        // the particle, cell space
  uniform vec3 uCupAxis;       // unit, from the particle back toward the process
  uniform vec3 uCupU;
  uniform vec3 uCupV;
  uniform float uCup;          // 0..1 how far the tip has become a cup
  uniform float uCupRadius;
  uniform float uCupWrap;      // 0 an open cup, 1 closed around the particle
  uniform vec3 uPhagoPos;      // the phagosome on its way to the soma
  uniform float uBulge;        // 0..1
  uniform float uReach;        // 0..1 how far the process has stretched toward the particle
  // Chemotaxis toward a drop of ATP (lib/chemotaxis.ts): the chosen tips swell into bulbs on the ring around the
  // source; the processes turned away from it shorten a little and the soma moves toward it.
  uniform vec4 uBulb[${gt}]; // xyz a swelling tip's end, cell space; w 0..1 how far it has swollen
  uniform float uBulbCount;
  uniform float uPolar;        // 0..1 how far the cell is polarised ...
  uniform vec3 uSourceDir;     // ... toward this direction (unit, from the soma)
  uniform float uRadius;       // R, the cell's radius: the soma's shift is a share of it
  varying float vAlpha;
  varying float vSeed;
  varying float vFoc;
  varying float vLens;
  varying float vPx;
  varying float vSoma;
  varying float vLit;

  void main() {
    vec3 pos = position;
    float hidden = 0.0;
    float reaching = 0.0;
    float stretched = 1.0;
    if (aSoma < 0.5) {
      vec4 st = texture2D(uBranch, vec2((aBranch + 0.5) / uBranchCount, ${ie[0]}));
      vec4 sr = texture2D(uBranch, vec2((aBranch + 0.5) / uBranchCount, ${ie[1]}));
      if (aT > st.r) hidden = 1.0;          // beyond where the process reaches right now
      float prof = aT * aT;                  // the root follows its parent's end, the tip is pulled
      if (uStretch > 0.5) {
        // A growing chain is stretched, not pulled at the tip: with its reach the profile goes linear, so the stretch
        // is even along each branch, and the strokes grow with the stretch — at the far end of the t² profile twice
        // the branch's mean, at its root none — so the stipple stays full.
        vec4 ss = texture2D(uBranch, vec2((aBranch + 0.5) / uBranchCount, ${ie[2]}));
        prof = mix(prof, aT, ss.g);
        stretched = 1.0 + min(${St(qt-1)}, ss.r * mix(2.0 * aT, 1.0, ss.g));
      }
      pos += mix(sr.gba, st.gba, prof);
      reaching = sr.r;
      if (uCup > 0.0) {
        // The last stretch of the process, and whatever membrane lies near its tip, spreads over a shell around the
        // particle: a phagocytic cup.
        float own = abs(aBranch - uPhagoBranch) < 0.5 ? smoothstep(0.5, 0.9, aT) : 0.0;
        float near = smoothstep(0.42, 0.12, length(pos - (uTarget + uCupAxis * uCupRadius)));
        float w = max(own, near) * uCup;
        float theta = fract(aSeed * 13.7) * 6.2831853;
        float phi = fract(aSeed * 5.3) * mix(1.75, 3.14159, uCupWrap);
        vec3 dir = cos(phi) * uCupAxis + sin(phi) * (cos(theta) * uCupU + sin(theta) * uCupV);
        pos = mix(pos, uTarget + dir * uCupRadius, w);
      }
      if (uBulge > 0.0) {
        vec3 d = pos - uPhagoPos;
        float l = length(d);
        pos += (d / max(l, 1e-4)) * uBulge * 0.07 * smoothstep(0.2, 0.0, l);
      }
      if (uBulbCount > 0.5) {
        // The bulbs: at each tip that has arrived at the source, the membrane near its end spreads over a small
        // shell — a club-shaped ending, half the size of the phagocytic cup. A point goes to the nearest bulb.
        float bestL = 1e9;
        vec3 bestC = vec3(0.0);
        float bestW = 0.0;
        for (int k = 0; k < ${gt}; k++) {
          if (float(k) >= uBulbCount) break;
          float l = length(pos - uBulb[k].xyz);
          if (l < bestL) { bestL = l; bestC = uBulb[k].xyz; bestW = uBulb[k].w; }
        }
        // On a stretched chain the bulb gathers from further back, so it is made of as many points as at rest.
        float reachB = ${St(Hn)} * (1.0 + 1.5 * (stretched - 1.0));
        float w = smoothstep(reachB, reachB * 0.3, bestL) * bestW;
        if (w > 0.0) {
          float theta = fract(aSeed * 13.7) * 6.2831853;
          float ph = fract(aSeed * 5.3) * 3.14159;
          vec3 spread = vec3(sin(ph) * cos(theta), sin(ph) * sin(theta), cos(ph));
          vec3 dir = normalize(pos - bestC + spread * 0.03);
          pos = mix(pos, bestC + dir * ${St(Bn)}, w);
          // A bulb gathers its points; it is not stretched — no larger strokes there, or it turns into a knot.
          stretched = mix(stretched, 1.0, w);
        }
      }
      if (uPolar > 0.0) {
        // Polarised: the processes turned away from the source lose a share of their length ...
        float away = smoothstep(0.0, 0.6, -dot(normalize(position), uSourceDir));
        pos *= 1.0 - ${St(pn)} * uPolar * away;
      }
    } else {
      pos *= uSomaScale;
    }
    if (uPolar > 0.0) {
      // ... and the soma moves toward it, the roots of the processes with it; the tips stay where they are.
      float f = 1.0 - clamp((length(position) - 0.25) / (uRadius - 0.25), 0.0, 1.0);
      pos += uSourceDir * (${St(fn)} * uRadius * uPolar * f * f);
    }
    vec4 wp = modelMatrix * vec4(pos, 1.0);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    float foc = (1.0 - smoothstep(0.0, 18.0, abs(dist - ${pt.toFixed(1)}))) * (1.0 - uDefocus * uDefocusShare);
    float lens = smoothstep(4.4, 0.0, length(wp.xy - uPointer)) * uLens;
    float persp = 300.0 / max(dist, 1.0);
    float sz = (0.6 + 0.8 * fract(aSeed * 7.31)) * uThickness;
    // A process that reaches — for the particle, for the source — is drawn thicker and darker.
    if (abs(aBranch - uPhagoBranch) < 0.5) reaching = max(reaching, uReach);
    sz *= (1.0 + 0.9 * reaching) * stretched;
    // The body: every point knows which way its surface faces. In camera space the lamp (a world direction
    // that follows the hand) lights the flank turned toward it — lighter strokes there, denser on the shaded
    // underside — and the side turned away from the reader is drawn smaller and paler, as a hand would leave
    // the far side of a tube open. The soma is a ball: the points deep inside it are quieter than its skin.
    vec3 nv = normalize(normalMatrix * aNormal);
    vec3 lv = normalize(mat3(viewMatrix) * uLight);
    float lit = 0.3 + 0.7 * max(0.0, dot(nv, lv));
    float facing = 0.5 + 0.5 * nv.z;
    float shell = mix(1.0, mix(0.6, 1.0, aShell), aSoma);
    // Out of focus the strokes grow to soft discs and pale by their area.
    float bokeh = 1.0 + (1.0 - foc) * 1.2;
    float px = clamp(uSize * uDpr * sz * persp * 0.052 * bokeh * mix(0.75, 1.0, facing) * mix(0.85, 1.0, shell), 0.75, uMaxPx * uDpr);
    gl_PointSize = px;
    // The soma appears first as the drawing begins; its points are many on a small sphere, so they are lighter each.
    float somaIn = mix(1.0, 0.55 * smoothstep(0.0, 0.12, uDraw), aSoma);
    vAlpha = 0.47 * (0.04 + 0.96 * foc) / (bokeh * bokeh) * mix(1.0 - 0.2 * uLens, 1.6, lens) * (1.0 - hidden) * uReveal * somaIn * (1.0 + 0.5 * reaching) * (0.78 + 0.44 * (1.0 - lit)) * mix(0.55, 1.0, facing) * shell;
    vLit = lit;
    vSeed = aSeed;
    vFoc = foc;
    vLens = lens;
    vPx = px;
    vSoma = aSoma;
  }
`,Un=`
  precision highp float;
  ${_t}
  ${Ct}
  varying float vAlpha;
  varying float vSeed;
  varying float vFoc;
  varying float vLens;
  varying float vPx;
  varying float vSoma;
  varying float vLit;
  uniform float uAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float sharp = vFoc * (1.0 - 0.5 * vLens);
    float a = stroke(uv, vSeed, sharp, vPx) * vAlpha * uAlpha;
    if (a < 0.004) discard;
    // Graphite pressed a little harder than the field's: where strokes pile up (the soma, the thick processes)
    // the tone deepens toward ink; a few strokes are lighter, as in any drawing. The lit flank carries the
    // lighter strokes, the shaded underside the deeper ones — light is tone here, never emission.
    vec3 col = mix(GRAPHITE_DEEP, GRAPHITE, 0.45);
    col = mix(col, GRAPHITE_LIGHT, step(0.8, fract(vSeed * 3.17)) * 0.7);
    col = mix(col, GRAPHITE_LIGHT, 0.45 * smoothstep(0.55, 1.0, vLit));
    col = mix(col, GRAPHITE_DEEP, 0.35 * (1.0 - smoothstep(0.3, 0.75, vLit)));
    col = mix(col, GRAPHITE_DEEP, vLens * 0.5);
    gl_FragColor = vec4(col, a);
  }
`,$n=`
  uniform vec3 uPos;
  uniform float uScale;
  uniform float uDpr;
  void main() {
    vec4 mv = modelViewMatrix * vec4(uPos, 1.0);
    gl_Position = projectionMatrix * mv;
    float persp = 300.0 / max(-mv.z, 1.0);
    gl_PointSize = clamp(uDpr * persp * 0.6 * uScale, 3.0, 32.0 * uDpr);
  }
`,Gn=`
  precision highp float;
  ${lo}
  uniform float uAlpha;
  uniform float uCellAlpha;
  uniform float uReveal;
  void main() {
    // A small polished body, not a soft spot: lit from the top left, its rim in the shade, no halo.
    vec3 col;
    float edge = sphere(gl_PointCoord, col);
    float a = edge * uAlpha * uCellAlpha * uReveal;
    if (a < 0.004) discard;
    gl_FragColor = vec4(col, a);
  }
`,J={appear:.7,reach:1.6,cup:1.1,close:.9,retract:1,digest:.8},Pt=.17,Wn=.1,Vn=1.5,qe=6,qn=9,Xn=.45,ut=t=>{const e=Math.max(0,Math.min(1,t));return e*e*(3-2*e)},Kn=t=>1-Math.pow(1-Math.max(0,Math.min(1,t)),3);function jn(t,e){var H;const a=Wt(e),n=x=>new C(x.points[x.points.length-3],x.points[x.points.length-2],x.points[x.points.length-1]),o=t.branches.filter(x=>x.isTip).map(x=>({b:x,d:n(x).length()})).sort((x,E)=>E.d-x.d),i=o.slice(0,Math.max(6,Math.round(o.length*.5))).map(x=>x.b),u=((H=[...i].sort((x,E)=>x.length-E.length)[Math.floor(i.length/2)])==null?void 0:H.length)??0,h=i.filter(x=>x.length>=u);h.length<3&&h.push(...i.slice(0,3));let f=-1;const s={branch:-1,reach:0,disp:new C,cup:0,wrap:0,cupRadius:Pt,target:new C,axis:new C(0,0,1),u:new C(1,0,0),v:new C(0,1,0),particle:new C,particleAlpha:0,particleScale:1,phagosome:new C,bulge:0,somaBump:0};let c="rest",r=0,l=Vn,p=0;const d=new C,m=new C,T=new C;let g=new Float32Array(0),y=new Float32Array(0),D=0;const I=new C,L=new C;function A(x){const E=[];let F=x,v=0;for(;F&&v++<64;){for(let N=F.points.length-3;N>=0;N-=3){const z=F.points[N],G=F.points[N+1],S=F.points[N+2],O=E.length;O&&E[O-3]===z&&E[O-2]===G&&E[O-1]===S||E.push(z,G,S)}F=F.parent>=0&&F.parent!==F.id?t.branches[F.parent]:void 0}E.push(0,0,0),g=Float32Array.from(E);const k=g.length/3;y=new Float32Array(k);for(let N=1;N<k;N++)y[N]=y[N-1]+Math.hypot(g[N*3]-g[N*3-3],g[N*3+1]-g[N*3-2],g[N*3+2]-g[N*3-1]);D=y[k-1]}function b(x,E){const F=g.length/3;if(F===0)return E.set(0,0,0);if(x<=0)return E.set(g[0],g[1],g[2]);if(x>=D)return E.set(0,0,0);let v=1;for(;v<F-1&&y[v]<x;)v++;const k=(x-y[v-1])/Math.max(1e-6,y[v]-y[v-1]);return E.set(g[v*3-3]+(g[v*3]-g[v*3-3])*k,g[v*3-2]+(g[v*3+1]-g[v*3-2])*k,g[v*3-1]+(g[v*3+2]-g[v*3-1])*k)}const w=o.map(x=>n(x.b));function P(x,E){let F=1/0;for(let v=0;v<o.length;v++)o[v].b.id!==x.id&&(F=Math.min(F,w[v].distanceTo(E)));return F}function _(){let x=h[0],E=-1;for(let z=0;z<4;z++){const G=h[Math.floor(a()*h.length)];if(G.id===f&&h.length>1)continue;const S=n(G),O=I.set(S.x-G.points[0],S.y-G.points[1],S.z-G.points[2]).normalize(),U=L.copy(S).addScaledVector(O,.35),B=P(G,U);B>E&&(E=B,x=G)}f=x.id,d.copy(n(x));const F=I.set(d.x-x.points[0],d.y-x.points[1],d.z-x.points[2]).normalize();F.lengthSq()===0&&F.copy(d).normalize();const v=L.set(a()-.5,a()-.5,a()-.5).cross(F).normalize(),k=Math.min(.55,Math.max(.3,x.length*.9));m.copy(d).addScaledVector(F,k).addScaledVector(v,k*.35*(a()-.5)*2);const N=I.subVectors(m,d).normalize();s.axis.copy(N).negate(),T.copy(m).addScaledVector(N,-.17).sub(d),s.u.set(0,1,0),Math.abs(s.axis.y)>.9&&s.u.set(1,0,0),s.u.cross(s.axis).normalize(),s.v.crossVectors(s.axis,s.u).normalize(),s.branch=x.id,A(x),c="appear",r=0}function M(){s.branch=-1,s.reach=0,s.cup=0,s.wrap=0,s.cupRadius=Pt,s.particleAlpha=0,s.particleScale=1,s.bulge=0,s.somaBump=0,c="rest",r=0,l=qe+a()*(qn-qe)}function R(x,E=!1){if(x<=0)return;p+=x,r+=x;const F=v=>s.particle.copy(m).add(I.set(Math.sin(p*7.1)*v,Math.cos(p*5.3)*v,Math.sin(p*6.2+1.3)*v));switch(c){case"rest":E?r=0:r>=l&&_();break;case"appear":{s.particleAlpha=ut(r/J.appear),F(.014),r>=J.appear&&(c="reach",r=0);break}case"reach":{const v=ut(r/J.reach);s.reach=v,s.disp.copy(T).multiplyScalar(v),F(.014*(1-v)),s.particleAlpha=1,r>=J.reach&&(c="cup",r=0,s.target.copy(s.particle));break}case"cup":{s.reach=1,s.disp.copy(T),s.cup=Kn(r/J.cup),s.wrap=.3*s.cup,s.particle.copy(s.target),r>=J.cup&&(c="close",r=0);break}case"close":{const v=ut(r/J.close);s.cup=1,s.wrap=.3+.7*v,s.cupRadius=Pt+(Wn-Pt)*v,s.particleScale=1-.3*v,r>=J.close&&(c="retract",r=0);break}case"retract":{const v=ut(r/J.retract);s.reach=1-v,s.disp.copy(T).multiplyScalar(s.reach),s.target.copy(d).add(s.disp).addScaledVector(s.axis,-.1*(1-v)),s.particle.copy(s.target),r>=J.retract&&(c="transport",r=0);break}case"transport":{const v=r*Xn;s.reach=0,s.cup=1-ut(r/.5),s.wrap=1,b(v,s.particle),s.target.copy(s.particle),s.phagosome.copy(s.particle),s.bulge=ut(r/.4),v>=D&&(c="digest",r=0);break}case"digest":{const v=r/J.digest;s.cup=0,s.particle.set(0,0,0),s.phagosome.set(0,0,0),s.particleAlpha=1-ut(v),s.bulge=1-ut(v),s.somaBump=Math.sin(Math.PI*Math.min(1,v)),r>=J.digest&&M();break}}}return{out:s,step:R,feed(){c==="rest"&&(l=0)},get phase(){return c}}}function Za(t,e,a={}){const n=zn(e,a.count??vo,a.seed??1),o=new it;o.setAttribute("position",new $(n.position,3)),o.setAttribute("aBranch",new $(n.aBranch,1)),o.setAttribute("aT",new $(n.aT,1)),o.setAttribute("aSeed",new $(n.aSeed,1)),o.setAttribute("aSoma",new $(n.aSoma,1)),o.setAttribute("aDist",new $(n.aDist,1)),o.setAttribute("aNormal",new $(n.aNormal,3)),o.setAttribute("aShell",new $(n.aShell,1)),o.boundingSphere=new ft(new C,e.bound*1.5);const i=e.branches.length,u=new Float32Array(i*4*ye);for(let R=0;R<i;R++)u[R*4]=1;const h=new Po(u,i,ye,Eo,To);h.magFilter=Le,h.minFilter=Le,h.needsUpdate=!0;const f=new ct({vertexShader:Nn,fragmentShader:Un,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uSize:t.uSize,uDpr:t.uDpr,uMaxPx:{value:Ve},uLens:t.uLens,uPointer:t.uPointer,uAlpha:t.uAlpha,uBranch:{value:h},uBranchCount:{value:i},uSomaScale:{value:1},uThickness:{value:1},uReveal:{value:1},uDraw:{value:1},uDefocus:t.uDefocus,uDefocusShare:{value:1},uLight:t.uLight,uPhagoBranch:{value:-1},uTarget:{value:new C},uCupAxis:{value:new C(0,0,1)},uCupU:{value:new C(1,0,0)},uCupV:{value:new C(0,1,0)},uCup:{value:0},uCupRadius:{value:Pt},uCupWrap:{value:0},uPhagoPos:{value:new C},uBulge:{value:0},uReach:{value:0},uBulb:{value:Array.from({length:gt},()=>new Ro)},uBulbCount:{value:0},uPolar:{value:0},uSourceDir:{value:new C(1,0,0)},uRadius:{value:e.bound},uStretch:{value:0}}}),s=new Ft;s.add(new lt(o,f)),s.scale.setScalar(a.scale??1);const c=a.phagocytosis?jn(e,(a.seed??1)*31+7):null;let r=null,l=null;if(c){const R=new it;R.setAttribute("position",new $(new Float32Array(3),3)),R.boundingSphere=new ft(new C,e.bound*2),l=new ct({vertexShader:$n,fragmentShader:Gn,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uPos:{value:new C},uScale:{value:1},uDpr:t.uDpr,uAlpha:{value:0},uCellAlpha:t.uAlpha,uReveal:{value:1}}}),r=new lt(R,l),r.visible=!1,s.add(r)}const p=!!a.atp,d=p&&(a.trace??!0),m=fo(e),T=m.maxDist*1.02;let g=null;const y=p?_n(e):null;p&&(g=cn(t,a.seed??1),s.add(g.points));let D=0;const I=new Float32Array(i*3),L=Int32Array.from(e.branches,R=>R.parent);for(let R=0;R<i;R++)if(L[R]>=R)throw new Error("LivingCell: the skeleton must list parents before their children");const A=new Float32Array(i*3),b=new Float32Array(i);e.branches.forEach((R,H)=>{const x=R.points.length-3;A[H*3]=R.points[x]-R.points[0],A[H*3+1]=R.points[x+1]-R.points[1],A[H*3+2]=R.points[x+2]-R.points[2],b[H]=Math.hypot(A[H*3],A[H*3+1],A[H*3+2])});let w=Ne(e,a);const P=a.surveillance??!1,_=new C,M={group:s,reveal:1,draw:1,maxPx:Ve,defocusShare:1,magnify:1,hunger:1,get chemotaxis(){return y?y.numbers:null},get somaScale(){return f.uniforms.uSomaScale.value},get phagoPhase(){return c?c.phase:null},get motility(){return w},setMotility(R){w=Ne(e,{...a,...R})},update(R,H,x,E){let F=null;P&&x&&(_.set(x.x,x.y,s.position.z),s.worldToLocal(_),F=[_.x,_.y,_.z]),p&&y&&(y.step(R,H),g==null||g.update(R,H,M.reveal),d&&(D+=R,D>=1/Qt&&(D=Math.min(D-1/Qt,1/Qt),Fe.write(y.out.nearest)))),w.update({dt:R,motion:H,pointer:F,activation:E});const{ext:v,disp:k}=w,N=M.draw>=1?1/0:M.draw*T,z=(y==null?void 0:y.out)??null;for(let S=0;S<i;S++){const O=e.branches[S],U=N===1/0?1:Math.max(0,Math.min(1,(N-m.rootDist[S])/Math.max(1e-4,O.length)));let B=v[S]*U;z&&(B+=(1-B)*z.reach[S]),u[S*4]=B;const q=z&&z.cum[S]>0?1-z.reach[S]:1;I[S*3]=k[S*3]*q,I[S*3+1]=k[S*3+1]*q,I[S*3+2]=k[S*3+2]*q,u[i*4+S*4]=z?On*z.reach[S]*z.cum[S]:0}let G=0;if(c&&r&&l){M.reveal>.9&&c.step(R*Math.max(0,Math.min(1,H))*M.hunger,!!(y!=null&&y.active));const S=c.out;if(S.branch>=0&&S.reach>0){const U=S.branch,B=S.reach;u[U*4]+=(1-u[U*4])*B,I[U*3]+=(S.disp.x-I[U*3])*B,I[U*3+1]+=(S.disp.y-I[U*3+1])*B,I[U*3+2]+=(S.disp.z-I[U*3+2])*B}const O=f.uniforms;O.uPhagoBranch.value=S.branch,O.uReach.value=S.reach,O.uTarget.value.copy(S.target),O.uCupAxis.value.copy(S.axis),O.uCupU.value.copy(S.u),O.uCupV.value.copy(S.v),O.uCup.value=S.cup,O.uCupRadius.value=S.cupRadius,O.uCupWrap.value=S.wrap,O.uPhagoPos.value.copy(S.phagosome),O.uBulge.value=S.bulge,l.uniforms.uPos.value.copy(S.particle),l.uniforms.uScale.value=S.particleScale,l.uniforms.uAlpha.value=S.particleAlpha,l.uniforms.uReveal.value=M.reveal,r.visible=S.particleAlpha>.01,G=S.somaBump}for(let S=0;S<i;S++){const O=L[S],U=O>=0?u[O*4+1]:0,B=O>=0?u[O*4+2]:0,q=O>=0?u[O*4+3]:0;u[i*4+S*4+1]=U,u[i*4+S*4+2]=B,u[i*4+S*4+3]=q;let Q=U+I[S*3],tt=B+I[S*3+1],nt=q+I[S*3+2];if(z&&z.cum[S]>0){const At=z.chainRoot[S],zt=u[i*4+At*4+1],Ie=u[i*4+At*4+2],De=u[i*4+At*4+3],Yt=z.cum[S],Zt=z.reach[S];Q+=(zt+(z.goal[S*3]-zt)*Yt-Q)*Zt,tt+=(Ie+(z.goal[S*3+1]-Ie)*Yt-tt)*Zt,nt+=(De+(z.goal[S*3+2]-De)*Yt-nt)*Zt}u[S*4+1]=Q,u[S*4+2]=tt,u[S*4+3]=nt}if(z){let S=0;for(let B=0;B<i;B++){const q=z.cum[B]>0?z.reach[B]:0;let Q=0;if(q>0){S=1;const tt=b[B];if(tt>1e-6){const nt=A[B*3]+u[B*4+1]-u[i*4+B*4+1],At=A[B*3+1]+u[B*4+2]-u[i*4+B*4+2],zt=A[B*3+2]+u[B*4+3]-u[i*4+B*4+3];Q=Math.max(0,Math.hypot(nt,At,zt)/tt-1)*kn}}u[i*8+B*4]=Q,u[i*8+B*4+1]=q}const O=f.uniforms;O.uStretch.value=S;for(let B=0;B<gt;B++)O.uBulb.value[B].set(z.bulbs[B*4],z.bulbs[B*4+1],z.bulbs[B*4+2],z.bulbs[B*4+3]);O.uBulbCount.value=z.bulbCount;const U=Math.hypot(z.polar[0],z.polar[1],z.polar[2]);O.uPolar.value=U,U>1e-6&&O.uSourceDir.value.set(z.polar[0]/U,z.polar[1]/U,z.polar[2]/U)}h.needsUpdate=!0,f.uniforms.uSomaScale.value=w.somaScale*(1+.06*G),f.uniforms.uThickness.value=w.thickness*M.magnify,f.uniforms.uDefocusShare.value=M.defocusShare,f.uniforms.uReveal.value=M.reveal,f.uniforms.uDraw.value=M.draw,f.uniforms.uMaxPx.value=M.maxPx},feed(){c==null||c.feed()},stimulate(R,H={}){var v;if(!p||!y)return;const x=!!H.instant,E=H.normal?[H.normal.x,H.normal.y,H.normal.z]:[0,0,1];y.stimulate([R.x,R.y,R.z],E,x);const F=((v=y.numbers)==null?void 0:v.source)??[R.x,R.y,R.z];g&&!x&&g.start({x:F[0],y:F[1],z:F[2]}),d&&(Fe.stimulatedAt=performance.now())},dispose(){o.dispose(),f.dispose(),h.dispose(),r==null||r.geometry.dispose(),l==null||l.dispose(),g==null||g.dispose()}};return M}const Z={a:.64,b:.44,c:.54},Yn=.88,wo=.035,Zn=.08,Qn=.16,Jn=.02,X={x:-.38,y:-.31,z:0,a:.22,b:.16,c:.3},ta=24,ea=.012,W={x0:-.1,y0:-.22,x1:-.235,y1:-.64,r0:.1,r1:.07},oa=.045,na=.02,ce=.72/Z.a,le={cerebrum:22e3,cerebellum:3500,brainstem:600},Xt=.35,aa=1.5;function sa(t,e,a,n){let o=Math.imul(t|0,668265261)^Math.imul(e|0,374761393)^Math.imul(a|0,625341585)^Math.imul((n|0)+1540483477,2246822507);return o=Math.imul(o^o>>>15,739982445),o=Math.imul(o^o>>>12,695872825),o^=o>>>15,(o>>>0)/4294967296}const ue=t=>t*t*t*(t*(t*6-15)+10),ot=(t,e,a)=>t+(e-t)*a;function Rt(t,e,a,n=0){const o=Math.floor(t),i=Math.floor(e),u=Math.floor(a),h=ue(t-o),f=ue(e-i),s=ue(a-u),c=(l,p,d)=>sa(o+l,i+p,u+d,n);return ot(ot(ot(c(0,0,0),c(1,0,0),h),ot(c(0,1,0),c(1,1,0),h),f),ot(ot(c(0,0,1),c(1,0,1),h),ot(c(0,1,1),c(1,1,1),h),f),s)-.5}function j(t,e,a){const n=Math.min(1,Math.max(0,(a-t)/(e-t)));return n*n*(3-2*n)}function ra(t){let e=t*7919+13>>>0;return()=>(e=e*1664525+1013904223>>>0,e/4294967296)}function Xe(t,e,a){const n=Math.PI*(3-Math.sqrt(5)),o=1-2*(t+.5)/e,i=Math.sqrt(Math.max(0,1-o*o)),u=t*n;a[0]=i*Math.cos(u),a[1]=o,a[2]=i*Math.sin(u)}function Mt(t){const e=Math.hypot(t[0],t[1],t[2])||1;return t[0]/=e,t[1]/=e,t[2]/=e,t}const Lt=(t,e)=>[t[1]*e[2]-t[2]*e[1],t[2]*e[0]-t[0]*e[2],t[0]*e[1]-t[1]*e[0]],go=(t,e)=>t[0]*e[0]+t[1]*e[1]+t[2]*e[2];function yo(t){const e=Math.abs(t[1])<.9?[0,1,0]:[1,0,0],a=Mt(Lt(t,e)),n=Lt(t,a);return[a,n]}function Kt(t,e,a,n=.008){const[o,i]=yo(e),u=(l,p,d)=>t(Mt([e[0]+l*p[0],e[1]+l*p[1],e[2]+l*p[2]]),d),h=[0,0,0],f=[0,0,0],s=[0,0,0],c=[0,0,0];u(n,o,h),u(-n,o,f),u(n,i,s),u(-n,i,c);const r=Mt(Lt([h[0]-f[0],h[1]-f[1],h[2]-f[2]],[s[0]-c[0],s[1]-c[1],s[2]-c[2]]));a[0]=r[0],a[1]=r[1],a[2]=r[2]}const jt=t=>1-(1-Yn)*((1+t/Z.a)/2),ia=.3,he={drop:.13,x:.2,spread:.45};function xo(t,e,a,n){const o=j(.3,.8,Math.abs(a)/(Z.c*jt(t))),i=j(0,-.5,e/Z.b),u=1-ia*i*(1-o),h=he.drop*Math.exp(-(((t/Z.a-he.x)/he.spread)**2))*i*o;n[0]=t+.3*h,n[1]=e*u-h,n[2]=a+Math.sign(a)*.5*h}function xe(t,e){const a=Z.a*t[0];xo(a,Z.b*t[1],Z.c*t[2]*jt(a),e)}const rt={k:42,k2:85,second:.35,warp:.32,freq:2.5,lean:.12,sulcus:-.6,gyrus:-.2},Ot={from:.24,to:.4,amount:.75,warp:1.4},ca={x0:.46,y0:-.16,x1:-.15,y1:.03,halfWidth:.016,depth:.06,amount:1,flank:[.5,.8]},la={x0:-.02,y0:.44,x1:.17,y1:-.02,halfWidth:.013,depth:.05,amount:1,flank:[.05,.3]},ua={x0:.2,y0:.4,x1:.28,y1:.08,halfWidth:.011,depth:.045,amount:.65,flank:[.1,.35]},ha={x0:-.16,y0:.42,x1:-.08,y1:.1,halfWidth:.011,depth:.045,amount:.65,flank:[.1,.35]},fa=[ca,la,ua,ha],xt={x0:-.2,x1:.34,y:-.1},Ke=t=>1-j(rt.sulcus,rt.gyrus,t),je=t=>Math.sin(rt.k*t)+rt.second*Math.sin(rt.k2*t+1.9);function fe(t,e,a,n){const o=rt.freq;return Rt(o*t,o*e,o*a,n)+.5*Rt(2*o*t+3.1,2*o*e+1.7,2*o*a+5.3,n+1)+.25*Rt(4*o*t+7.7,4*o*e+2.9,4*o*a+4.1,n+2)}function pa(t,e,a,n){const o=t.x1-t.x0,i=t.y1-t.y0,u=Math.min(1,Math.max(0,((e-t.x0)*o+(a-t.y0)*i)/(o*o+i*i))),h=Math.hypot(e-(t.x0+u*o),a-(t.y0+u*i)),f=j(0,.08,u)*j(1,.92,u);return(1-j(t.halfWidth,t.halfWidth+.012,h))*f*j(t.flank[0],t.flank[1],n)*t.amount}function bo(t,e,a,n,o){const i=Math.abs(a)/(Z.c*jt(t)),u=fe(t,e,a,n),h=j(Ot.from,Ot.to,e),f=j(xt.x0-.06,xt.x0+.06,t)*(1-j(xt.x1-.06,xt.x1+.06,t))*j(xt.y-.08,xt.y,e)*(1-h),s=Ke(je(e+rt.lean*t+rt.warp*u))*(1-.7*h)*(1-.85*f),c=Ke(je(a+.7+Ot.warp*rt.warp*fe(t+2.3,e+1.1,a+.4,n)))*h*Ot.amount;let r=Math.max(s,c),l=oa*r;const p=t+.06*u,d=e+.06*fe(t+5.1,e+.7,a+2.2,n+3);for(const m of fa){const T=pa(m,p,d,i);T>r&&(r=T),l=Math.max(l,m.depth*T)}return o&&(o.depth=l),r}function da(t,e,a,n){const o=[0,0,0];xe(t,o);const i=[0,0,0];Kt(xe,t,i);const u={depth:0},h=bo(o[0],o[1],o[2],e,u),f=Math.abs(o[2]),s=Zn*(1-j(wo,Qn,f))*j(-.1,.35,o[1]),c=na*(1-h)-u.depth-s;a[0]=o[0]+i[0]*c,a[1]=o[1]+i[1]*c,a[2]=o[2]+i[2]*c+Math.sign(o[2])*Jn,n&&(n.tone=h)}function Mo(t){let e=t[0],a=t[1],n=t[2];const o=[0,0,0];for(let u=0;u<3;u++)xo(e,a,n,o),e+=t[0]-o[0],a+=t[1]-o[1],n+=t[2]-o[2];const i=n/(Z.c*jt(e));return Math.sqrt((e/Z.a)**2+(a/Z.b)**2+i*i)}const be=(t,e=1)=>Mo(t)<e;function Me(t,e){e[0]=X.x+X.a*t[0],e[1]=X.y+X.b*t[1],e[2]=X.z+X.c*t[2]}function ma(t,e,a,n){const o=t-X.x,i=e-X.y,u=a-X.z,h=Math.atan2(i,o);return Math.sin(ta*h+2.5*Rt(6*o,6*i,6*u,n+2))}function va(t,e,a,n){const o=[0,0,0];Me(t,o);const i=[0,0,0];Kt(Me,t,i);const u=ma(o[0],o[1],o[2],e),h=1-j(-.4,.2,u),f=ea*(.4-1.4*h);a[0]=o[0]+i[0]*f,a[1]=o[1]+i[1]*f,a[2]=o[2]+i[2]*f,n&&(n.tone=ot(.12,.9,h))}function Ao(t){return Math.sqrt(((t[0]-X.x)/X.a)**2+((t[1]-X.y)/X.b)**2+((t[2]-X.z)/X.c)**2)}const Ae=(t,e=1)=>Ao(t)<e,st=Mt([W.x1-W.x0,W.y1-W.y0,0]),wt=Math.hypot(W.x1-W.x0,W.y1-W.y0),$t=[0,0,1],pe=Lt(st,$t);function dt(t,e,a){const n=ot(W.r0,W.r1,t),o=Math.cos(e),i=Math.sin(e);a[0]=W.x0+st[0]*t*wt+n*(o*$t[0]+i*pe[0]),a[1]=W.y0+st[1]*t*wt+n*(o*$t[1]+i*pe[1]),a[2]=n*(o*$t[2]+i*pe[2])}function wa(t,e,a){const o=[0,0,0],i=[0,0,0],u=[0,0,0],h=[0,0,0];dt(t+.01,e,o),dt(t-.01,e,i),dt(t,e+.01,u),dt(t,e-.01,h);const f=Mt(Lt([u[0]-h[0],u[1]-h[1],u[2]-h[2]],[o[0]-i[0],o[1]-i[1],o[2]-i[2]])),s=[0,0,0];dt(t,e,s);const c=[W.x0+st[0]*t*wt,W.y0+st[1]*t*wt,0],r=[s[0]-c[0],s[1]-c[1],s[2]-c[2]],l=go(f,r)<0?-1:1;a[0]=f[0]*l,a[1]=f[1]*l,a[2]=f[2]*l}function Se(t){const e=t[0]-W.x0,a=t[1]-W.y0,n=(e*st[0]+a*st[1])/wt;if(n<-.05||n>1)return 1/0;const o=e-st[0]*n*wt,i=a-st[1]*n*wt,u=ot(W.r0,W.r1,Math.max(0,n));return Math.hypot(o,i,t[2])/u}const Ye=(t,e=1)=>Se(t)<e,Nt=(t,e,a)=>a*(1-j(1,e,t));function So(t,e,a,n,o){let i=0;for(let c=0;c<t.length;c++)(o||!e[c])&&(i+=t[c]);const u=i/a,h=[];let f=n*u,s=0;for(let c=0;c<t.length;c++)if(!(!o&&e[c]))for(s+=t[c];f<s;)e[c]||h.push(c),f+=u;return h}function ga(t,e,a,n){return Math.min(e,a,n)*Math.sqrt((t[0]/e)**2+(t[1]/a)**2+(t[2]/n)**2)}function Ze(t,e,a,n,o,i,u,h,f,s){const c=a*3,r=new Float64Array(c),l=new Uint8Array(c),p=[0,0,0],d=[0,0,0];for(let A=0;A<c;A++)Xe(A,c,p),o(p,d),r[A]=ga(p,n.a,n.b,n.c)*(s?s(d):1),l[A]=u(d)?1:0;const m=So(r,l,a,h(),f),T=Math.sqrt(4*Math.PI/Math.max(1,m.length)),g={tone:0},y=[0,0,0],D=[0,0,0],I=[0,0,0],L=(A,b)=>i(A,b,g);for(const A of m){Xe(A,c,p);const[b,w]=yo(p),P=(h()-.5)*2*Xt*T,_=(h()-.5)*2*Xt*T,M=Mt([p[0]+P*b[0]+_*w[0],p[1]+P*b[1]+_*w[1],p[2]+P*b[2]+_*w[2]]);o(M,d),!u(d)&&(i(M,y,g),Kt(o,M,D),Kt(L,M,I),go(I,D)<0&&(I[0]=-I[0],I[1]=-I[1],I[2]=-I[2]),t.push(y,D,I,g.tone,e,h()))}return m.length}function ya(t,e,a){const n=e*3,o=Math.PI*(3-Math.sqrt(5)),i=new Float64Array(n),u=new Uint8Array(n),h=[0,0,0],f=new Float64Array(n),s=new Float64Array(n);for(let p=0;p<n;p++)f[p]=(p+.5)/n,s[p]=p*o,dt(f[p],s[p],h),i[p]=ot(W.r0,W.r1,f[p])/W.r0,u[p]=be(h)||Ae(h)?1:0;const c=So(i,u,e,a(),!1),r=[0,0,0];let l=0;for(const p of c){const d=Math.min(1,Math.max(0,f[p]+(a()-.5)*Xt*.06)),m=s[p]+(a()-.5)*Xt*.5;if(dt(d,m,h),be(h)||Ae(h))continue;wa(d,m,r);const T=.42+.12*Rt(9*h[0],9*h[1],9*h[2],5);t.push(h,r,r,T,2,a()),l++}return l}function xa(t=1){const e=ra(t),a=[],n=[],o=[],i=[],u=[],h=[],f={push(d,m,T,g,y,D){a.push(d[0]*ce,d[1]*ce,d[2]*ce),n.push(m[0],m[1],m[2]),o.push(T[0],T[1],T[2]),i.push(g),u.push(y),h.push(D)}},s=()=>u.length,c=s();Ze(f,0,le.cerebrum,Z,xe,(d,m,T)=>{da(d,t,m,T),T.tone=Math.max(T.tone,Nt(Ao(m),1.15,.75),Nt(Se(m),1.5,.7))},d=>Math.abs(d[2])<wo||Ae(d,.98)||Ye(d,.98),e,!0,d=>1+(aa-1)*bo(d[0],d[1],d[2],t));const r=s();Ze(f,1,le.cerebellum,X,Me,(d,m,T)=>{va(d,t,m,T),T.tone=Math.max(T.tone,Nt(Mo(m),1.08,.6),Nt(Se(m),1.4,.55))},d=>be(d)||Ye(d),e,!1);const l=s();ya(f,le.brainstem,e);const p=s();return{count:u.length,positions:new Float32Array(a),normals:new Float32Array(n),folds:new Float32Array(o),tones:new Float32Array(i),kinds:new Float32Array(u),seeds:new Float32Array(h),counts:{cerebrum:r-c,cerebellum:l-r,brainstem:p-l}}}const Qa=1.05,Qe=.19,Je=11,to=72,ba=3,Ma=.03,Aa=11,Sa=.5,Pa=.32,eo=.22,Ea=1.45,de={gyrus:1.45,sulcus:1.95,base:1.4},oo={gyrus:.72,sulcus:.95},no={gyrus:.5,sulcus:.15},ao={alpha:.12,size:.6},Ta=.45,Ra=`
  attribute vec3 aU;         // an orbit's basis
  attribute vec3 aV;
  attribute float aPhase;
  attribute float aOmega;    // rad/s along the orbit; 0 for a dot of the lattice
  attribute float aSeed;
  attribute float aKind;     // 0 orbit lattice, 1 particle on an orbit
  attribute vec2 aBreath;    // the orbit's breath: rate (rad/s) and phase
  uniform float uTime;
  uniform float uDpr;
  uniform float uLens;
  uniform float uDefocus;
  uniform float uDraw;
  uniform vec3 uLight;
  uniform vec2 uPointer;
  varying float vAlpha;
  varying float vShade;
  varying float vRim;
  varying float vFoc;
  varying float vLens;
  varying float vSeed;
  varying float vPx;
  varying float vKind;

  void main() {
    float ang = aPhase + aOmega * uTime;
    // The orbits breathe in one slow rhythm, a little out of phase: the radius by ±BREATH.
    float breath = 1.0 + ${Ma.toFixed(3)} * sin(uTime * aBreath.x + aBreath.y);
    vec3 p = (cos(ang) * aU + sin(ang) * aV) * breath;
    vec4 wp = modelMatrix * vec4(p, 1.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    float foc = (1.0 - smoothstep(0.0, 18.0, abs(dist - ${pt.toFixed(1)}))) * (1.0 - uDefocus);
    float lens = smoothstep(4.4, 0.0, length(wp.xy - uPointer)) * uLens;
    float persp = 300.0 / max(dist, 1.0);

    // The dots carry the radial normal: the lamp in camera space, a rim, the far side smaller and paler.
    vec3 nv = normalize(normalMatrix * normalize(p));
    vec3 lv = normalize(mat3(viewMatrix) * uLight);
    float key = 0.5 + 0.5 * dot(nv, lv);
    float rim = pow(1.0 - abs(nv.z), 2.2);
    float facing = 0.5 + 0.5 * nv.z;

    float size = aKind < 0.5 ? 2.5 : 3.6;
    size *= 0.85 + 0.3 * fract(aSeed * 7.31);
    size *= mix(0.72, 1.0, facing);
    float bokeh = 1.0 + (1.0 - foc) * 1.2;
    float px = clamp(size * uDpr * persp * 0.05 * bokeh, 0.75, 14.0 * uDpr);
    gl_PointSize = px;

    // Drawn from the top down as the reader arrives.
    float cut = 1.35 - 2.7 * uDraw;
    float drawn = smoothstep(cut - 0.3, cut, p.y);
    float base = aKind < 0.5 ? 0.62 : 0.85;
    vAlpha = base * (0.04 + 0.96 * foc) / (bokeh * bokeh) * mix(1.0 - 0.2 * uLens, 1.5, lens) * (1.0 + 0.3 * rim) * mix(0.5, 1.0, facing) * drawn;
    vShade = key;
    vRim = rim;
    vFoc = foc;
    vLens = lens;
    vSeed = aSeed;
    vPx = px;
    vKind = aKind;
  }
`,Ia=`
  precision highp float;
  ${_t}
  ${Ct}
  uniform float uAlpha;
  varying float vAlpha;
  varying float vShade;
  varying float vRim;
  varying float vFoc;
  varying float vLens;
  varying float vSeed;
  varying float vPx;
  varying float vKind;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float sharp = vFoc * (1.0 - 0.5 * vLens);
    float a = stroke(uv, vSeed, sharp, vPx) * vAlpha * uAlpha;
    if (a < 0.004) discard;
    vec3 col = mix(GRAPHITE, GRAPHITE_LIGHT, vShade * 0.8);
    // The particles a shade deeper than the lattice they run on.
    col = mix(col, GRAPHITE_DEEP, vRim * 0.45 + (vKind > 0.5 ? 0.3 : 0.0));
    col = mix(col, GRAPHITE_DEEP, vLens * 0.4);
    gl_FragColor = vec4(col, min(1.0, a));
  }
`,Da=`
  attribute vec3 aNormal;    // the smooth body: the far side, the rim
  attribute vec3 aFold;      // the surface with its convolutions: the lamp
  attribute float aTone;     // 0 light … 1 dark
  attribute float aSeed;
  attribute float aKind;     // 0 cerebrum, 1 cerebellum, 2 brainstem
  uniform float uDpr;
  uniform float uLens;
  uniform float uDefocus;
  uniform float uDraw;
  uniform vec3 uLight;
  uniform vec2 uPointer;
  varying float vAlpha;
  varying float vShade;
  varying float vRim;
  varying float vFoc;
  varying float vLens;
  varying float vSeed;
  varying float vPx;
  varying float vTone;

  void main() {
    vec3 p = position;
    vec4 wp = modelMatrix * vec4(p, 1.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    float foc = (1.0 - smoothstep(0.0, 18.0, abs(dist - ${pt.toFixed(1)}))) * (1.0 - uDefocus);
    float lens = smoothstep(4.4, 0.0, length(wp.xy - uPointer)) * uLens;
    float persp = 300.0 / max(dist, 1.0);

    // The smooth body decides the far side and the rim; the folded surface takes the lamp, so every gyrus has its lit
    // flank and its shaded one.
    vec3 nv = normalize(normalMatrix * aNormal);
    vec3 nf = normalize(normalMatrix * aFold);
    vec3 lv = normalize(mat3(viewMatrix) * uLight);
    float key = 0.5 + 0.5 * dot(nf, lv);
    float rim = pow(1.0 - abs(nv.z), 2.2);
    float facing = 0.5 + 0.5 * nv.z;
    // The far side falls away sharply: what lies just behind the silhouette would otherwise double the contour — and
    // beyond that band it is not drawn at all (the point put outside the clip volume: no fragments, no blending).
    float near = smoothstep(-0.15, 0.45, nv.z);
    if (near <= 0.0) {
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      gl_PointSize = 1.0;
      vAlpha = 0.0;
      vShade = 0.0;
      vRim = 0.0;
      vFoc = 0.0;
      vLens = 0.0;
      vSeed = aSeed;
      vPx = 1.0;
      vTone = aTone;
      return;
    }
    // Where the surface turns away it is foreshortened and its dots crowd (their density grows as 1/nv.z); the engraver
    // lightens them there — the sulci almost wholly, so they do not blot at the shoulder, the gyri only by half, so the
    // crowding at the silhouette draws the contour of the plate.
    float nz = clamp(nv.z, 0.0, 1.0);
    float fore = mix(mix(${no.gyrus.toFixed(2)}, 1.0, nz), mix(${no.sulcus.toFixed(2)}, 1.0, nz), aTone);

    float size = aKind < 0.5 ? mix(${de.gyrus.toFixed(2)}, ${de.sulcus.toFixed(2)}, aTone) : ${de.base.toFixed(2)};
    size *= 0.85 + 0.3 * fract(aSeed * 7.31);
    size *= mix(${ao.size.toFixed(2)}, 1.0, facing);
    float bokeh = 1.0 + (1.0 - foc) * 1.2;
    float px = clamp(size * uDpr * persp * 0.05 * bokeh, 0.75, 14.0 * uDpr);
    gl_PointSize = px;

    // Drawn from the top down with the orbits.
    float cut = 1.35 - 2.7 * uDraw;
    float drawn = smoothstep(cut - 0.3, cut, p.y);
    // The gyri light, with the paper showing through them; the sulci heavy.
    float base = mix(${oo.gyrus.toFixed(2)}, ${oo.sulcus.toFixed(2)}, aTone);
    // The rim is neither raised as on the orbits nor damped (the shoulder above already thins it); the flank of a gyrus
    // away from the lamp a little denser than the lit one.
    vAlpha = base * (0.04 + 0.96 * foc) / (bokeh * bokeh) * mix(1.0 - 0.2 * uLens, 1.5, lens) * fore * (0.92 + 0.16 * (1.0 - key)) * mix(${ao.alpha.toFixed(2)}, 1.0, near) * drawn;
    vShade = key;
    vRim = rim;
    vFoc = foc;
    vLens = lens;
    vSeed = aSeed;
    vPx = px;
    vTone = aTone;
  }
`,La=`
  precision highp float;
  ${_t}
  ${Ct}
  uniform float uAlpha;
  varying float vAlpha;
  varying float vShade;
  varying float vRim;
  varying float vFoc;
  varying float vLens;
  varying float vSeed;
  varying float vPx;
  varying float vTone;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float sharp = vFoc * (1.0 - 0.5 * vLens);
    float a = stroke(uv, vSeed, sharp, vPx) * vAlpha * uAlpha;
    if (a < 0.004) discard;
    // The one amber in the picture: the gyri in full amber, the sulci in a deep dark amber, so the convolutions read as
    // dark lines on a light ground; the flank of a gyrus away from the lamp a shade deeper, the rim a shade deeper.
    vec3 sulcus = mix(AMBER, GRAPHITE_DEEP, ${Ta.toFixed(2)});
    vec3 col = mix(AMBER, sulcus, min(1.0, vTone));
    col = mix(col, sulcus, (1.0 - vShade) * 0.3 * (1.0 - vTone) + vRim * 0.1);
    col = mix(col, GRAPHITE_DEEP, vLens * 0.3);
    gl_FragColor = vec4(col, min(1.0, a));
  }
`,Fa=typeof location<"u"&&location.search.includes("nobrain");function _a(t,e){const a=xa(e),n=new it;n.setAttribute("position",new $(a.positions,3)),n.setAttribute("aNormal",new $(a.normals,3)),n.setAttribute("aFold",new $(a.folds,3)),n.setAttribute("aTone",new $(a.tones,1)),n.setAttribute("aSeed",new $(a.seeds,1)),n.setAttribute("aKind",new $(a.kinds,1)),n.boundingSphere=new ft(new C,4);const o=new ct({vertexShader:Da,fragmentShader:La,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uDpr:t.uDpr,uLens:t.uLens,uDefocus:t.uDefocus,uLight:t.uLight,uPointer:t.uPointer,uAlpha:{value:1},uDraw:{value:1}}}),i=new Ft;return i.add(new lt(n,o)),{group:i,mat:o,dispose(){n.dispose(),o.dispose()}}}function Ja(t,e=5){let a=e*7919+13;const n=()=>(a=a*1664525+1013904223>>>0,a/4294967296),o=[],i=[],u=[],h=[],f=[],s=[],c=[],r=(M,R,H,x,E,F,v)=>{o.push(M.x,M.y,M.z),i.push(R.x,R.y,R.z),u.push(H),h.push(x),f.push(n()),s.push(E),c.push(F,v)},l=new C,p=new C,d=new C,m=new C;for(let M=0;M<Je;M++){const R=Lo(M,Je);l.set(R[0],R[1],R[2]).normalize(),m.set(0,1,0),Math.abs(l.y)>.9&&m.set(1,0,0),p.crossVectors(l,m).normalize(),d.crossVectors(l,p).normalize();const H=n()*Math.PI*2,x=2*Math.PI/Aa,E=(n()-.5)*2*Sa;for(let k=0;k<to;k++)r(p,d,H+k/to*Math.PI*2+(n()-.5)*.02,0,0,x,E);const F=n()<.5?1:-1,v=(.22+.36*n())*F;for(let k=0;k<ba;k++)r(p,d,n()*Math.PI*2,v*(.85+.3*n()),1,x,E)}const T=new it,g=s.length;T.setAttribute("position",new $(new Float32Array(g*3),3)),T.setAttribute("aU",new et(o,3)),T.setAttribute("aV",new et(i,3)),T.setAttribute("aPhase",new et(u,1)),T.setAttribute("aOmega",new et(h,1)),T.setAttribute("aSeed",new et(f,1)),T.setAttribute("aKind",new et(s,1)),T.setAttribute("aBreath",new et(c,2)),T.boundingSphere=new ft(new C,4);const y=new ct({vertexShader:Ra,fragmentShader:Ia,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uTime:{value:0},uDpr:t.uDpr,uLens:t.uLens,uDefocus:t.uDefocus,uLight:t.uLight,uPointer:t.uPointer,uAlpha:{value:1},uDraw:{value:1}}}),D=_a(t,e);D.group.visible=!Fa;const I=new Ft;I.add(D.group),I.add(new lt(T,y));let L=0,A=1,b=0,w=0;const P=(M,R,H,x)=>M+(R-M)*(1-Math.exp(-3*x)),_={group:I,draw:1,update(M,R,H,x){A=P(A,x?Ea:1,3,M),L+=M*R*A,y.uniforms.uTime.value=L,y.uniforms.uAlpha.value=.05+.95*H,y.uniforms.uDraw.value=_.draw,D.mat.uniforms.uAlpha.value=y.uniforms.uAlpha.value,D.mat.uniforms.uDraw.value=_.draw,b=P(b,Pa+(x?x.y*eo:0),3,M),w=P(w,x?-x.x*eo:0,3,M),I.rotation.set(b,L*Qe,w),D.group.rotation.y=-.4*L*Qe},dispose(){D.dispose(),T.dispose(),y.dispose()}};return _}const Ca=8,za=80,Ut=.012;function ts(t,e,a,n={}){const o={active:!1,hover:!1,lastX:0,lastY:0,spin:0,pinch:1,pinching:!1},i=new C,u=(b,w)=>{if(!t.visible)return!1;i.copy(t.position).project(e);const P=(i.x*.5+.5)*window.innerWidth,_=(-i.y*.5+.5)*window.innerHeight;return Math.hypot(b-P,w-_)<a()},h=b=>{b.pointerType==="touch"||!u(b.clientX,b.clientY)||(b.preventDefault(),o.active=!0,o.lastX=b.clientX,o.lastY=b.clientY,o.spin=0,document.body.style.cursor="grabbing")},f=b=>{if(b.pointerType==="touch")return;if(o.active){const P=b.clientX-o.lastX,_=b.clientY-o.lastY;t.rotation.y+=P*Ut,n.tilt!==!1&&(t.rotation.x=Math.max(-1.3,Math.min(.7,t.rotation.x+_*.008))),o.spin=P*Ut*40,o.lastX=b.clientX,o.lastY=b.clientY;return}const w=u(b.clientX,b.clientY);w!==o.hover&&(o.hover=w,document.body.style.cursor=w?"grab":"")},s=b=>{b.pointerType==="touch"||!o.active||(o.active=!1,document.body.style.cursor=o.hover?"grab":"")};window.addEventListener("pointerdown",h),window.addEventListener("pointermove",f),window.addEventListener("pointerup",s),window.addEventListener("pointercancel",s);const c=n.touch??null,r=new Map;let l="none";const p={x:0,y:0};let d=1,m=0,T=0,g=0;const y=()=>{const[b,w]=Array.from(r.values());return b&&w?Math.max(1,Math.hypot(b.x-w.x,b.y-w.y)):1},D=(b,w,P)=>{l="none",p.x=b,p.y=w,m=0,T=P,g=P},I=b=>{var w;if(b.pointerType==="touch"&&!((w=b.target)!=null&&w.closest("button, a"))){r.set(b.pointerId,{x:b.clientX,y:b.clientY});try{c==null||c.setPointerCapture(b.pointerId)}catch{}r.size===1?(o.spin=0,D(b.clientX,b.clientY,b.timeStamp)):r.size===2&&(o.active=!1,o.pinching=!0,o.pinch=1,d=y(),l="turn")}},L=b=>{const w=r.get(b.pointerId);if(!w)return;const P=w.x;if(w.x=b.clientX,w.y=b.clientY,r.size>=2){o.pinching&&(o.pinch=y()/d);return}if(l==="none"){const H=b.clientX-p.x,x=b.clientY-p.y;if(Math.hypot(H,x)<Ca)return;l=Math.abs(H)>1.5*Math.abs(x)?"turn":"scroll",l==="turn"&&(o.active=!0),T=b.timeStamp;return}if(l!=="turn")return;const _=b.clientX-P,M=Math.max(1,b.timeStamp-T)/1e3;T=b.timeStamp,g=b.timeStamp,t.rotation.y+=_*Ut;const R=_*Ut/M;m+=(R-m)*.5},A=b=>{var w;if(r.has(b.pointerId)){if(r.delete(b.pointerId),o.pinching&&r.size<2){o.pinching=!1;const P=o.pinch;o.pinch=1,(w=n.onPinchEnd)==null||w.call(n,P);const _=Array.from(r.values())[0];_?D(_.x,_.y,b.timeStamp):l="none";return}r.size===0&&(o.active&&(o.active=!1,o.spin=b.timeStamp-g>za?0:m),l="none")}};return c&&(c.addEventListener("pointerdown",I),c.addEventListener("pointermove",L),c.addEventListener("pointerup",A),c.addEventListener("pointercancel",A)),{get active(){return o.active},get hover(){return o.hover},get spin(){return o.spin},set spin(b){o.spin=b},get pinch(){return o.pinch},get pinching(){return o.pinching},dispose(){window.removeEventListener("pointerdown",h),window.removeEventListener("pointermove",f),window.removeEventListener("pointerup",s),window.removeEventListener("pointercancel",s),c&&(c.removeEventListener("pointerdown",I),c.removeEventListener("pointermove",L),c.removeEventListener("pointerup",A),c.removeEventListener("pointercancel",A)),(o.hover||o.active)&&(document.body.style.cursor="")}}}const es=1.8,ka=8,Ba=700,Ha='a, button, [role="button"], input, select, textarea, label, summary, [data-hover], .umap-label, h1, h2, h3, h4, p, li, blockquote, figcaption, dd, dt, .lede, .abstract, .prose-body, .sheet-prose',so=t=>t instanceof Element&&!!t.closest(Ha);function os(t,e,a,n){const o={hover:!1,taken:!1,down:null},i=new C,u=new C,h=new Pe,f=new io,s=new Io,c=new C,r=new co,l=()=>{if(!t.visible)return null;const D=a();if(D<=0)return null;u.copy(t.position).applyMatrix4(e.matrixWorldInverse);const I=-u.z;if(I<=.1)return null;i.copy(t.position).project(e);const L=window.innerHeight/2/(Math.tan(e.fov*Math.PI/360)*I);return{x:(i.x*.5+.5)*window.innerWidth,y:(-i.y*.5+.5)*window.innerHeight,r:D*L}},p=(D,I)=>{const L=l();return!!L&&Math.hypot(D-L.x,I-L.y)<L.r},d=(D,I)=>{if(!p(D,I)||(h.set(D/window.innerWidth*2-1,-(I/window.innerHeight)*2+1),f.setFromCamera(h,e),s.setFromNormalAndCoplanarPoint(e.getWorldDirection(u),t.position),!f.ray.intersectPlane(s,c)))return!1;t.worldToLocal(c);const L=u.clone().transformDirection(r.copy(t.matrixWorld).invert());return n(c.clone(),L),!0},m=D=>{so(D.target)||!p(D.clientX,D.clientY)||(o.down={x:D.clientX,y:D.clientY,t:performance.now(),id:D.pointerId})},T=D=>{if(D.pointerType==="touch")return;o.taken=so(D.target);const I=!o.down&&!o.taken&&p(D.clientX,D.clientY);I!==o.hover&&(o.hover=I,I?document.body.style.cursor="pointer":document.body.style.cursor==="pointer"&&(document.body.style.cursor=""))},g=D=>{const I=o.down;!I||D.pointerId!==I.id||(o.down=null,!(Math.hypot(D.clientX-I.x,D.clientY-I.y)>ka||performance.now()-I.t>Ba)&&d(D.clientX,D.clientY))},y=()=>{o.down=null};return window.addEventListener("pointerdown",m),window.addEventListener("pointermove",T),window.addEventListener("pointerup",g),window.addEventListener("pointercancel",y),{get hover(){return o.hover},get free(){return!o.taken},at:d,onScreen:l,dispose(){window.removeEventListener("pointerdown",m),window.removeEventListener("pointermove",T),window.removeEventListener("pointerup",g),window.removeEventListener("pointercancel",y),o.hover&&document.body.style.cursor==="pointer"&&(document.body.style.cursor="")}}}function Oa(t,e){const a=e.stride;if(t.byteLength%a!==0)throw new Error(`umap: ${t.byteLength} bytes is not a multiple of ${a}`);const n=t.byteLength/a,o=new DataView(t),i=new Float32Array(n*3),u=new Float32Array(n),h=new Float32Array(n*3),f=new Float32Array(n);for(let s=0;s<n;s++){const c=s*a;i[s*3]=o.getInt16(c,!0)/32767,i[s*3+1]=o.getInt16(c+2,!0)/32767,i[s*3+2]=o.getInt16(c+4,!0)/32767,u[s]=o.getUint8(c+6),h[s*3]=o.getUint8(c+7)/255,h[s*3+1]=o.getUint8(c+8)/255,h[s*3+2]=o.getUint8(c+9)/255,f[s]=(s*2654435761>>>0)/4294967296}return{n,position:i,state:u,expr:h,seed:f}}async function Na(t){const e=await fetch(`${t}umap/manifest.json`).then(n=>n.json()),a=await fetch(`${t}umap/cells.bin`).then(n=>n.arrayBuffer());return{manifest:e,cells:Oa(a,e)}}const Ua=600,$a=12,ro=.035,Ga=`
  attribute float aSeed;
  attribute float aState;
  attribute vec3 aExpr;
  uniform float uSize;
  uniform float uDpr;
  uniform float uLens;
  uniform float uDefocus;
  uniform vec2 uPointer;
  uniform float uReveal;
  uniform float uMode;
  uniform float uPrevMode;
  uniform float uWave;
  uniform vec3 uWaveOrigin;
  uniform float uFocusState;
  uniform vec3 uHover;
  uniform float uMaxPx;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vFoc;
  varying float vSeed;
  varying float vPx;

  // The warm graphite family of the whole page; amber for the one state that is not resting.
  const vec3 GRAPHITE = vec3(0.24, 0.23, 0.23);
  const vec3 LIGHT = vec3(0.56, 0.54, 0.52);
  const vec3 DEEP = vec3(0.12, 0.11, 0.11);
  const vec3 AMBER = vec3(0.86, 0.55, 0.16);

  void look(float mode, out vec3 col, out float alpha, out float size) {
    if (mode < 0.5) {
      if (aState < 0.5) { col = GRAPHITE; alpha = 0.55; size = 1.0; }
      else if (aState < 1.5) { col = AMBER; alpha = 0.6; size = 1.05; }
      else { col = LIGHT; alpha = 0.45; size = 0.9; }
    } else {
      float e = mode < 1.5 ? aExpr.x : (mode < 2.5 ? aExpr.y : aExpr.z);
      col = mix(LIGHT, AMBER, smoothstep(0.02, 0.85, e));
      alpha = 0.3 + 0.55 * e;
      size = 0.85 + 0.7 * e;
    }
  }

  void main() {
    vec3 c0; float a0; float s0;
    vec3 c1; float a1; float s1;
    look(uPrevMode, c0, a0, s0);
    look(uMode, c1, a1, s1);
    float w = smoothstep(-0.25, 0.25, uWave - distance(position, uWaveOrigin));
    vec3 col = mix(c0, c1, w);
    float alpha = mix(a0, a1, w);
    float size = mix(s0, s1, w);
    if (uFocusState >= 0.0 && abs(aState - uFocusState) > 0.5) { alpha *= 0.12; size *= 0.8; }
    float h = smoothstep(0.06, 0.0, distance(position, uHover));
    col = mix(col, DEEP, h * 0.7);
    alpha = mix(alpha, 1.0, h);
    size *= 1.0 + 2.2 * h;

    vec4 wp = modelMatrix * vec4(position, 1.0);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    float foc = (1.0 - smoothstep(0.0, 14.0, abs(dist - ${pt.toFixed(1)}))) * (1.0 - uDefocus);
    float lens = smoothstep(4.4, 0.0, length(wp.xy - uPointer)) * uLens;
    float persp = 300.0 / max(dist, 0.6);
    float base = 0.7 + 0.6 * fract(aSeed * 7.31);
    float px = clamp(uSize * uDpr * base * size * persp * 0.055 * (1.0 + (1.0 - foc) * 1.4), 0.75, uMaxPx * uDpr);
    gl_PointSize = px;
    vColor = mix(col, DEEP, lens * 0.5);
    vAlpha = alpha * (0.06 + 0.94 * foc) * mix(1.0 - 0.15 * uLens, 1.5, lens) * uReveal;
    vFoc = foc;
    vSeed = aSeed;
    vPx = px;
  }
`,Wa=`
  precision highp float;
  ${Ct}
  varying vec3 vColor;
  varying float vAlpha;
  varying float vFoc;
  varying float vSeed;
  varying float vPx;
  uniform float uAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float a = stroke(uv, vSeed, vFoc, vPx) * vAlpha * uAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;function ns(t,e){const a=new Ft,n=new ct({vertexShader:Ga,fragmentShader:Wa,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uSize:t.uSize,uDpr:t.uDpr,uLens:t.uLens,uDefocus:t.uDefocus,uPointer:t.uPointer,uAlpha:t.uAlpha,uReveal:{value:0},uMode:{value:0},uPrevMode:{value:0},uWave:{value:10},uWaveOrigin:{value:new C},uFocusState:{value:-1},uHover:{value:new C(99,99,99)},uMaxPx:{value:9}}});let o=null,i=null,u=null,h=null,f=!1;const s={group:a,ready:!1,manifest:null,reveal:0,maxPx:9,spin:.12,hoverEnabled:!0,labelsEnabled:!0,labelFade:1,update:I,dispose(){f=!0,o==null||o.dispose(),n.dispose()}};Na(e).then(({manifest:L,cells:A})=>{f||(o=new it,o.setAttribute("position",new $(A.position,3)),o.setAttribute("aState",new $(A.state,1)),o.setAttribute("aExpr",new $(A.expr,3)),o.setAttribute("aSeed",new $(A.seed,1)),o.boundingSphere=new ft(new C,1.8),a.add(new lt(o,n)),i=A.position,u=A.state,h=A.expr,s.manifest=L,s.ready=!0,V.count=L.n,V.ready=!0)}).catch(L=>console.warn("umap: data not loaded",L));const c=L=>Math.max(0,_e.indexOf(L));let r=V.changedAt;const l=new C,p=new Do,d=new io,m=new co,T=new C,g=new Pe;let y=0,D=-1;function I(L,A,b,w,P){var H;const _=n.uniforms;_.uReveal.value=s.reveal,_.uMaxPx.value=s.maxPx,_.uMode.value=c(V.mode),_.uPrevMode.value=c(V.prevMode),_.uFocusState.value=V.focusState,P&&(a.rotation.y+=L*s.spin*A),V.changedAt!==r&&(r=V.changedAt,l.set(t.uPointer.value.x,t.uPointer.value.y,a.position.z),Math.abs(l.x)>90&&l.set(0,0,a.position.z),a.worldToLocal(l),l.clampLength(0,1.2),_.uWaveOrigin.value.copy(l));const M=(performance.now()-V.changedAt)/Ua;if(_.uWave.value=Fo.reducedMotion?10:Math.min(10,M*3.2),!s.ready||!i||!u||!h||!s.manifest)return;y+=L;const R=s.hoverEnabled&&w&&a.visible&&s.reveal>.5;if(R&&y>1/$a){y=0,g.set(w.x,w.y),d.setFromCamera(g,b),m.copy(a.matrixWorld).invert(),p.copy(d.ray).applyMatrix4(m);const x=a.scale.x||1,E=ro*8/Math.max(x,.01);let F=-1,v=Math.min(E,ro*4),k=1/0;for(let N=0;N<i.length/3;N++){T.set(i[N*3],i[N*3+1],i[N*3+2]);const z=T.clone().sub(p.origin).dot(p.direction);if(z<0)continue;const G=p.distanceToPoint(T);(G<v||G<v*1.15&&z<k-.2)&&(F=N,v=G,k=z)}D=F}if(R||(D=-1),D>=0){_.uHover.value.set(i[D*3],i[D*3+1],i[D*3+2]);const x=(w.x+1)/2*window.innerWidth,E=(1-w.y)/2*window.innerHeight,F=((H=s.manifest.states[u[D]])==null?void 0:H.name)??"",v=V.mode,k=_e.indexOf(v)-1,N=k<0?F:`${v} ${(h[D*3+k]*s.manifest.p99[k]).toFixed(2)}`;V.hover={text:N,x,y:E}}else _.uHover.value.set(99,99,99),V.hover&&(V.hover=null);if(s.labelsEnabled&&a.visible){const x=T.setFromMatrixPosition(b.matrixWorld).clone();V.labels=s.manifest.states.map(E=>{const F=new C(E.centroid[0],E.centroid[1],E.centroid[2]);a.localToWorld(F);const v=F.distanceTo(x),k=1-Math.min(1,Math.abs(v-pt)/14);F.project(b);const N=F.z>1;return{text:E.name,state:E.id,x:(F.x+1)/2*window.innerWidth,y:(1-F.y)/2*window.innerHeight,opacity:N?0:s.reveal*s.labelFade*(.15+.85*k)*(V.focusState<0||V.focusState===E.id?1:.35)}})}else V.labels.length&&(V.labels=[])}return s}export{ja as C,Qa as E,_o as L,_t as P,Ct as S,es as W,cn as a,Za as b,Ya as c,Ja as d,ns as e,Ka as f,os as g,ts as h,Xa as m};
