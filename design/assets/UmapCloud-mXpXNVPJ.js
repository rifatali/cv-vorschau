import{V as _,B as at,a as N,S as ct,b as st,c as ye,P as rt,G as Rt,F as Z,D as vo,R as wo,g as go,N as Ae,f as yo,h as Je,i as xo,M as to,j as bo}from"./three-BH243BCb.js";import{D as ut,E as Kt,a as Se,I as Mo,u as G,s as Ao,U as Pe}from"./index-BNzWs8Dg.js";const jt=new Set,Ee=new Map,Yt=new Set,Te={register(t){return Yt.add(t),()=>{Yt.delete(t)}},hasRig(t){return Yt.has(t)},emit(t){Ee.set(t.rig,t.time),jt.forEach(e=>e(t))},subscribe(t){return jt.add(t),()=>{jt.delete(t)}},lastEvent(t){return Ee.get(t)??-1/0}},It=`
  const vec3 GRAPHITE = vec3(0.24, 0.23, 0.23);
  const vec3 GRAPHITE_LIGHT = vec3(0.50, 0.48, 0.46);
  const vec3 GRAPHITE_DEEP = vec3(0.12, 0.11, 0.11);
  const vec3 AMBER = vec3(0.776, 0.486, 0.149);
`,Dt=`
  float stroke(vec2 uv, float seed, float sharp, float px) {
    float ang = seed * 6.2831853;
    float c = cos(ang), s = sin(ang);
    vec2 q = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);
    float elong = mix(1.0, 1.6, smoothstep(2.5, 5.0, px));
    float r = length(q * vec2(1.0, elong));
    float soft = mix(0.08, 0.34, sharp);
    return smoothstep(0.5, soft, r);
  }
`,eo=`
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
`,So=new _(-.5,.75,.45).normalize();function Da(){return{uDefocus:{value:0},uLight:{value:So.clone()}}}const Po=`
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
    float persp = ${ut.toFixed(1)} / max(dist, 1.0);
    gl_PointSize = clamp(uPx * uDpr * persp * (0.7 + 0.6 * fract(aSeed * 7.31)), 1.0, 96.0 * uDpr);
    vA = 1.0 - smoothstep(0.55, 1.0, length(position.xy));
    vSeed = aSeed;
  }
`,Eo=`
  precision highp float;
  ${It}
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
`,Zt=20,Re={x:.16,y:-.22},To=.011;function La(t,e=1){let s=e*7919+13;const n=()=>(s=s*1664525+1013904223>>>0,s/4294967296),o=()=>Math.sqrt(-2*Math.log(1-n()))*Math.cos(2*Math.PI*n()),i=new Float32Array(Zt*3),h=new Float32Array(Zt);for(let l=0;l<Zt;l++)i[l*3]=o()*.5,i[l*3+1]=o()*.5,i[l*3+2]=0,h[l]=n();const u=new at;u.setAttribute("position",new N(i,3)),u.setAttribute("aSeed",new N(h,1)),u.boundingSphere=new ct(new _,30);const f=new st({vertexShader:Po,fragmentShader:Eo,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uDpr:t.uDpr,uAlpha:t.uAlpha,uRadius:{value:new ye(1,1)},uPx:{value:40},uStrength:{value:0}}}),r=new rt(u,f);return r.frustumCulled=!1,r.renderOrder=-1,{points:r,place(l,a,c,p=60){r.position.set(l.x+a*Re.x,l.y+c*Re.y,l.z),f.uniforms.uRadius.value.set(a,c),f.uniforms.uPx.value=Math.max(a,c)*p*.9},update(l){f.uniforms.uStrength.value=To*Math.max(0,Math.min(1,l)),r.visible=l>.01},dispose(){u.dispose(),f.dispose()}}}const yt=3.3,oo=1.3,Fa={radius:yt,halfHeight:4.2},Ro=.36,Ot=12,Lt=t=>.78+.42*Math.pow(t/.95,2),Qt=t=>.22+.3*Math.pow(t/.95,2),Io=[.5,.17,-.17,-.5],Do=`
  attribute float aSeed;
  attribute float aKind;     // 0 membrane head, 1 tail dot, 2 outer wall, 3 pore wall
  attribute vec3 aNormal;    // the surface normal, object space
  uniform float uTime;
  uniform float uDpr;
  uniform float uLens;
  uniform float uDefocus;
  uniform vec3 uLight;
  uniform vec2 uPointer;
  uniform vec3 uIons[${Ot}];
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
    for (int i = 0; i < ${Ot}; i++) {
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
    float foc = (1.0 - smoothstep(0.0, 18.0, abs(dist - ${ut.toFixed(1)}))) * (1.0 - uDefocus);
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
`,Lo=`
  precision highp float;
  ${It}
  ${Dt}
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
`,Fo=`
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
`,_o=`
  precision highp float;
  ${eo}
  uniform float uAlpha;
  varying float vA;
  void main() {
    vec3 col;
    float edge = sphere(gl_PointCoord, col);
    float a = edge * vA * uAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(col, min(1.0, a));
  }
`;function Pt(t,e,s,n,o,i,h,u){const f=Math.hypot(i,h,u)||1;t.pos.push(e,s,n),t.seed.push(Math.random()),t.kind.push(o),t.normal.push(i/f,h/f,u/f)}function zo(t,e=oo){const o=Math.ceil(yt/.20351),i=Math.ceil(yt/.235);for(let h=-o;h<=o;h++)for(let u=-i;u<=i;u++){const f=u*.235+(h%2?.1175:0)+(Math.random()-.5)*.05,r=h*.20351+(Math.random()-.5)*.05,l=Math.hypot(f,r);if(l>yt||l<e)continue;const a=yt*.78;if(!(l>a&&Math.random()<(l-a)/(yt-a)))for(const c of[1,-1]){const p=c*Ro+(Math.random()-.5)*.03;Pt(t,f,p,r,0,0,c,0);for(let d=1;d<=4;d++){const v=d/4.6;Pt(t,f+(Math.random()-.5)*.05,p-c*(.07+.26*v),r+(Math.random()-.5)*.05,1,0,c,0)}}}}function Co(t){const e=7*Math.PI/180,s=Math.PI/2,n=110;for(let o=0;o<=n;o++){const i=-.95+1.9*o/n,h=Lt(i),u=(Lt(i+.01)-Lt(i-.01))/.02,f=Math.round(2*Math.PI*h/.036);for(let a=0;a<f;a++){const c=a/f*Math.PI*2+o%2*(Math.PI/f);if((c%s+s)%s<e||(c%s+s)%s>s-e)continue;const d=.02,v=Math.cos(c),M=Math.sin(c);Pt(t,v*h+(Math.random()-.5)*d,i+(Math.random()-.5)*d,M*h+(Math.random()-.5)*d,2,v,-u,M)}const r=Qt(i),l=Math.round(2*Math.PI*r/.042);for(let a=0;a<l;a++){const c=a/l*Math.PI*2+o%2*(Math.PI/l),p=Math.cos(c),d=Math.sin(c);Pt(t,p*r,i,d*r,3,-p,.2,-d)}}for(const o of[-.95,.95])for(let i=0;i<8;i++){const h=i/7,u=Qt(o)+(Lt(o)-Qt(o))*h,f=Math.round(2*Math.PI*u/.042);for(let r=0;r<f;r++){const l=r/f*Math.PI*2,a=(l%s+s)%s;a<e||a>s-e||Pt(t,Math.cos(l)*u,o,Math.sin(l)*u,2,0,o>0?1:-1,0)}}}const Ie=10,wt=8,De=3.9,ko=-4;function _a(t,e="research",s={}){const n=s.channel!==!1,o=n?Te.register(e):()=>{},i=new Rt,h=[],u={pos:[],seed:[],kind:[],normal:[]};zo(u,n?oo:0),n&&Co(u);const f=new at;f.setAttribute("position",new Z(u.pos,3)),f.setAttribute("aSeed",new Z(u.seed,1)),f.setAttribute("aKind",new Z(u.kind,1)),f.setAttribute("aNormal",new Z(u.normal,3)),f.boundingSphere=new ct(new _,12);const r=Array.from({length:Ot},()=>new _(0,99,0)),l=new st({vertexShader:Do,fragmentShader:Lo,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uTime:{value:0},uDpr:t.uDpr,uLens:t.uLens,uDefocus:t.uDefocus,uLight:t.uLight,uPointer:t.uPointer,uAlpha:{value:1},uIons:{value:r},uIonCount:{value:0}}});i.add(new rt(f,l)),h.push(f,l);const a=Ie*(1+wt),c=new Float32Array(a*3),p=new Float32Array(a),d=new Float32Array(a),v=new at;v.setAttribute("position",new N(c,3)),v.setAttribute("aSize",new N(p,1)),v.setAttribute("aAlpha",new N(d,1)),v.boundingSphere=new ct(new _,20);const M=new st({vertexShader:Fo,fragmentShader:_o,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uDpr:t.uDpr,uAlpha:{value:1},uBoost:{value:1}}}),x=new rt(v,M);x.visible=n,i.add(x),h.push(v,M);const P=[],R=(g,m)=>{g.y=De,g.angle=Math.random()*Math.PI*2,g.radius=.9+Math.random()*.5,g.delay=m,g.dwell=.55+Math.random()*.35,g.gap=.28+Math.random()*.17,g.trail=[]};for(let g=0;g<Ie;g++){const m={y:De,angle:0,radius:0,delay:0,dwell:.78,gap:.34,trail:[]};R(m,g*.7),P.push(m)}let D=0;const L=(g,m)=>{if(Math.abs(g)>.95)return 1.15;let F=.62;for(const E of Io)F*=1-m*Math.exp(-Math.pow((g-E)/.07,2));return F},b={group:i,ionBoost:1,update:(g,m,F,E=F)=>{if(l.uniforms.uTime.value+=g*m,l.uniforms.uAlpha.value=.05+.95*F,M.uniforms.uAlpha.value=.1+.9*Math.max(F,E),M.uniforms.uBoost.value=b.ionBoost,!n)return;D+=g;const C=D>.04;C&&(D=0);const H=P.map((S,T)=>T).sort((S,T)=>P[S].y-P[T].y);H.forEach((S,T)=>{const y=P[S];if(y.delay>0){y.delay-=g*m;return}let z=g*L(y.y,y.dwell)*m;if(T>0){const B=P[H[T-1]],O=y.y-B.y,U=Math.abs(y.y)<1.4?y.gap:.55;O-z<U&&(z=Math.max(0,O-U))}const w=y.y;y.y-=z,w>0&&y.y<=0&&Te.emit({time:performance.now(),rig:e,ion:S}),y.angle+=g*(1.1+.3*Math.sin(S))*m;const k=Math.abs(y.y)<1?0:Math.min(1.4,(Math.abs(y.y)-1)*.55+.05);y.radius+=(k-y.radius)*Math.min(1,g*5),y.y<ko&&R(y,.4+Math.random()*1.2)});let A=0;P.forEach((S,T)=>{const y=S.delay<=0,z=Math.cos(S.angle)*S.radius,w=Math.sin(S.angle)*S.radius;C&&y&&(S.trail.unshift(z,S.y,w),S.trail.length>wt*3&&(S.trail.length=wt*3)),y&&Math.abs(S.y)<1.5&&A<Ot&&r[A++].set(z,S.y,w);const k=y?Math.max(0,Math.min(1,(4.2-Math.abs(S.y))/.9)):0,B=Math.abs(S.y)<.95?1:0,O=T*(1+wt);c[O*3]=z,c[O*3+1]=S.y,c[O*3+2]=w,p[O]=9.5+B*2.5,d[O]=k;for(let U=0;U<wt;U++){const q=O+1+U,X=U*3,Y=S.trail.length>X+2;c[q*3]=Y?S.trail[X]:z,c[q*3+1]=Y?S.trail[X+1]:S.y,c[q*3+2]=Y?S.trail[X+2]:w;const tt=1-(U+1)/(wt+1);p[q]=1.6+4.6*tt,d[q]=Y?k*tt*.32:0}}),l.uniforms.uIonCount.value=A,v.attributes.position.needsUpdate=!0,v.attributes.aSize.needsUpdate=!0,v.attributes.aAlpha.needsUpdate=!0},dispose:()=>{o(),h.forEach(g=>g.dispose())}};return b}const Bo=.45,Ho=.2,Ft=18,Le=36,Oo=.9,No=4,Jt=.35,_t=.3,Uo=1.5,$o=.8,Go=.6,Wo=.7,Vo=.3;function qo(t){return()=>{t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function Fe(t,e={}){const s=t.branches.length,n=qo(e.seed??1),o=e.motility??1,i=e.tempo??1,h=Oo*(e.reach??1),u=new Float32Array(s),f=new Float32Array(s),r=new Float32Array(s),l=new Float32Array(s),a=new Float32Array(s),c=new Float32Array(s*3);t.branches.forEach((D,L)=>{u[L]=D.isTip?Bo:D.depth===4?Ho:0,f[L]=2*Math.PI/(Ft+n()*(Le-Ft)),r[L]=2*Math.PI/(Ft+n()*(Le-Ft)),l[L]=n()*Math.PI*2,a[L]=n()*Math.PI*2;const I=D.points.length-3;c[L*3]=D.points[I],c[L*3+1]=D.points[I+1],c[L*3+2]=D.points[I+2]});const p=new Float32Array(s).fill(1),d=new Float32Array(s*3),v=new Uint8Array(s),M=[];let x=0;const P={ext:p,disp:d,somaScale:1,thickness:1,update:R};function R({dt:D,motion:L,pointer:I,activation:b}){if(L<=0||D<=0)return;if(x+=D*L*i,v.fill(0),I){M.length=0;for(let m=0;m<s;m++){if(!t.branches[m].isTip)continue;const F=Math.hypot(I[0]-c[m*3],I[1]-c[m*3+1],I[2]-c[m*3+2]);F<h&&M.push({i:m,d:F})}M.sort((m,F)=>m.d-F.d);for(let m=0;m<Math.min(No,M.length);m++)v[M[m].i]=1}const g=Math.max(0,Math.min(1,b));for(let m=0;m<s;m++){const F=t.branches[m],E=.6*Math.sin(f[m]*x+l[m])+.4*Math.sin(r[m]*x+a[m]);let C=v[m]?1:1-u[m]*o*(.5+.5*E);F.depth>=2&&(C*=1-Go*g);const H=v[m]?Uo:$o,A=1-Math.exp(-H*D*L);p[m]+=(C-p[m])*A,p[m]<0&&(p[m]=0),p[m]>1&&(p[m]=1);let S=0,T=0,y=0;if(v[m]&&I){S=(I[0]-c[m*3])*Jt,T=(I[1]-c[m*3+1])*Jt,y=(I[2]-c[m*3+2])*Jt;const z=Math.hypot(S,T,y);z>_t&&(S*=_t/z,T*=_t/z,y*=_t/z)}d[m*3]+=(S-d[m*3])*A,d[m*3+1]+=(T-d[m*3+1])*A,d[m*3+2]+=(y-d[m*3+2])*A}P.somaScale=1+Wo*g,P.thickness=1+Vo*g}return P}const Xo=4,no=10,Ko=.16,jo=.03,te=320;function Nt(t){return()=>{t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}const ee=t=>t.toFixed(3),Yo=`
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
    vec3 p = uOrigin + position * (${ee(Ko)} * sqrt(min(t, ${ee(Xo)}))) + uDrift * t;
    p += vec3(sin(t * 3.1 + aSeed * 40.0), cos(t * 2.7 + aSeed * 30.0), sin(t * 2.3 + aSeed * 20.0)) * 0.012 * sqrt(t);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    float foc = 1.0 - smoothstep(0.0, 18.0, abs(dist - ${ut.toFixed(1)}));
    float persp = 300.0 / max(dist, 1.0);
    gl_PointSize = clamp((1.3 + 1.4 * fract(aSeed * 7.31)) * uDpr * persp * 0.045 * (1.0 + (1.0 - foc) * 1.2), 0.75, 6.0 * uDpr);
    float fade = smoothstep(0.0, 0.12, t) * (1.0 - smoothstep(3.0, ${ee(no)}, t));
    // The gradient: dense at the source, thin outside — the outer draws are paler.
    float inner = 1.0 - 0.55 * smoothstep(0.8, 2.2, length(position));
    vA = fade * inner * (0.45 + 0.4 * fract(aSeed * 3.3)) * (0.04 + 0.96 * foc) * uReveal;
  }
`,Zo=`
  precision highp float;
  uniform float uAlpha;
  varying float vA;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.2, r) * vA * uAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(0.776, 0.486, 0.149, a);
  }
`;function Qo(t,e=1){const s=Nt(e*17+3),n=()=>Math.sqrt(-2*Math.log(1-s()))*Math.cos(2*Math.PI*s()),o=new Float32Array(te*3),i=new Float32Array(te);for(let a=0;a<te;a++)o[a*3]=n(),o[a*3+1]=n(),o[a*3+2]=n(),i[a]=s();const h=new at;h.setAttribute("position",new N(o,3)),h.setAttribute("aSeed",new N(i,1));const u=new st({vertexShader:Yo,fragmentShader:Zo,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uT:{value:-1},uOrigin:{value:new _},uDrift:{value:new _},uDpr:t.uDpr,uAlpha:t.uAlpha,uReveal:{value:1}}}),f=new rt(h,u);f.frustumCulled=!1,f.visible=!1;const r=Nt(e*5+11);let l=-1;return{points:f,get t(){return l},start(a){l=0,u.uniforms.uOrigin.value.set(a.x,a.y,a.z),u.uniforms.uDrift.value.set(r()-.5,r()-.5,r()-.5).normalize().multiplyScalar(jo)},update(a,c,p){l>=0&&(l+=a*c,l>no&&(l=-1)),u.uniforms.uT.value=l,u.uniforms.uReveal.value=p,f.visible=l>=0},dispose(){h.dispose(),u.dispose()}}}function ao(t){const e=t.branches,s=e.length,n=new Float32Array(s).fill(-1),o=new Float32Array(s),i=new Int32Array(s),h=f=>{if(n[f]>=0)return n[f];const r=e[f];return r.parent<0?(n[f]=Math.hypot(r.points[0],r.points[1],r.points[2]),i[f]=f):(n[f]=h(r.parent)+e[r.parent].length,i[f]=i[r.parent]),n[f]};let u=0;for(let f=0;f<s;f++)o[f]=h(f)+e[f].length,o[f]>u&&(u=o[f]);return{rootDist:n,endDist:o,root:i,maxDist:u}}const ce=.6,xe=4,ue=.3,et=9,Ut=14,Jo=.35,_e=.07,tn=.02,en=.03,on=.1,nn=80,an=3,vt=4,sn=.5,rn=.8,$t=[.15,.3,.3,.25],ln=3,cn=Math.cos(nn*Math.PI/180),xt=(t,e)=>[t[0]-e[0],t[1]-e[1],t[2]-e[2]],lt=(t,e)=>[t[0]+e[0],t[1]+e[1],t[2]+e[2]],J=(t,e)=>[t[0]*e,t[1]*e,t[2]*e],he=(t,e)=>t[0]*e[0]+t[1]*e[1]+t[2]*e[2],ze=(t,e)=>[t[1]*e[2]-t[2]*e[1],t[2]*e[0]-t[0]*e[2],t[0]*e[1]-t[1]*e[0]],dt=t=>Math.hypot(t[0],t[1],t[2]),bt=t=>{const e=dt(t);return e>1e-9?J(t,1/e):[0,0,0]},be=t=>t<0?0:t>1?1:t,Bt=t=>{const e=be(t);return e*e*(3-2*e)},fe=t=>1-Math.pow(1-be(t),3),un=t=>[t.points[t.points.length-3],t.points[t.points.length-2],t.points[t.points.length-1]];function hn(t,e){const s=Jo*e,n=dt(t);return n>=s?[t[0],t[1],t[2]]:n<1e-6?[s,0,0]:J(t,s/n)}function fn(t,e,s){const n=[];let o=e;for(;o>=0&&n.length<$t.length&&!(s!=null&&s.has(o));)n.push(o),o=t.branches[o].parent;return n.reverse()}function pn(t){const e=$t.slice($t.length-t),s=e.reduce((o,i)=>o+i,0);let n=0;return e.map(o=>n+=o/s)}function dn(t,e,s=vt,n=an){const o=bt(e),i=[];for(const a of t.branches){if(!a.isTip)continue;const c=un(a);i.push({id:a.id,end:c,d:dt(xt(c,e)),side:he(bt(c),o)})}i.sort((a,c)=>a.d-c.d);const h=i.filter(a=>a.side>=cn),u=h.length>=n?h:i,f=new Set,r=[],l=new Set;for(const a of[$t.length,ln]){for(const c of u){if(r.length>=s)break;if(l.has(c.id))continue;const p=fn(t,c.id,f);p.length<a||(p.forEach(d=>f.add(d)),l.add(c.id),r.push({tip:c.id,chain:p,end:c.end,dist:c.d}))}if(r.length>=n)break}return r.sort((a,c)=>a.dist-c.dist),r}function so(t){const e=bt(t),s=Math.abs(e[1])>.9?[1,0,0]:[0,1,0],n=bt(ze(e,s)),o=bt(ze(e,n));return{u:n,v:o}}const mn=t=>{let e=t%(2*Math.PI);return e>Math.PI&&(e-=2*Math.PI),e<-Math.PI&&(e+=2*Math.PI),e};function vn(t,e,s,n){const o=n.length;if(o===0)return[];const{u:i,v:h}=so(e),u=n.map(a=>{const c=xt(a,t);return Math.atan2(he(c,h),he(c,i))}),f=u.map((a,c)=>c).sort((a,c)=>u[a]-u[c]);let r={cost:1/0,shift:0,base:0};for(let a=0;a<o;a++){let c=0,p=0;f.forEach((M,x)=>{const P=u[M]-2*Math.PI*((x+a)%o)/o;c+=Math.cos(P),p+=Math.sin(P)});const d=Math.atan2(p,c);let v=0;f.forEach((M,x)=>{v+=Math.abs(mn(u[M]-d-2*Math.PI*((x+a)%o)/o))}),v<r.cost&&(r={cost:v,shift:a,base:d})}const l=new Array(o);return f.forEach((a,c)=>{const p=r.base+2*Math.PI*((c+r.shift)%o)/o;l[a]=lt(t,lt(J(i,s*Math.cos(p)),J(h,s*Math.sin(p))))}),l}function wn(t,e){return[ce+ue*t,xe-ue*(e-1-t)]}function gn(t){return[et+ue*t,Ut]}function Ce(t,e=!1){return t<0?0:t>=et?e?0:1-fe((t-et)/(Ut-et)):e?1:Bt((t-ce)/(xe-ce))}function yn(t,e=t.bound){const s=t.branches.length,n={cum:new Float32Array(s),chainRoot:new Int32Array(s).fill(-1),reach:new Float32Array(s),goal:new Float32Array(s*3),bulbs:new Float32Array(vt*4),bulbCount:0,polar:[0,0,0],nearest:1},o=[];let i=1;const h=()=>(i=i*1664525+1013904223>>>0,i/4294967296);function u(a,c,p=!1){const d=hn(a,e),v=dn(t,d),{u:M,v:x}=so(c),P=vn(d,c,_e*e,v.map(I=>I.end)),R=p?xe:0,D=new Map;for(const I of o){const b=[];for(const g of I.growers)v.some(m=>m.tip===g.tip)?D.set(g.tip,g):(f(g,I,I.t,I.t+(Ut-et)),b.push(g));I.growers=b,I.cut||(I.cut={polar:Ce(I.t,I.instant),t:I.t})}const L=v.map((I,b)=>{const g=D.get(I.tip),[m,F]=wn(b,v.length);return{tip:I.tip,chain:I.chain,cum:pn(I.chain.length),k:b,end:I.end,ring:P[b],dist:I.dist,from:g?[...g.cur]:[0,0,0],fromReach:g?g.reach:0,fromSwell:g?g.swell:0,to:xt(P[b],I.end),t0:m,t1:F,phase:"grow",wFrom:[0,0,0],wReach:0,wSwell:0,w0:0,w1:0,probe:[h()*Math.PI*2,h()*Math.PI*2],cur:g?[...g.cur]:[0,0,0],reach:g?g.reach:0,swell:g?g.swell:0}});o.push({t:R,instant:p,source:d,dir:bt(d),u:M,v:x,growers:L,cut:null})}function f(a,c,p,d){a.phase!=="withdraw"&&(a.phase="withdraw",a.wFrom=[...a.cur],a.wReach=a.reach,a.wSwell=a.swell,a.w0=p,a.w1=c.instant?p:d)}function r(a,c){const p=c.t;if(a.phase==="grow"&&!c.cut){const[d,v]=c.instant?[et,et]:gn(a.k);p>=d&&f(a,c,d,v)}if(a.phase==="grow"){if(c.instant)a.cur=[...a.to],a.reach=1,a.swell=1;else{const d=Bt((p-a.t0)/(a.t1-a.t0));a.cur=lt(a.from,J(xt(a.to,a.from),d)),a.reach=a.fromReach+(1-a.fromReach)*d;const v=p>=a.t1?Bt((p-a.t1)/sn):0;a.swell=Math.max(v,a.fromSwell*(1-d))}if(a.swell>0){const d=tn*e*a.swell,v=lt(J(c.u,d*Math.sin(1.3*p+a.probe[0])),J(c.v,d*Math.cos(.9*p+a.probe[1])));a.cur=lt(a.cur,v)}}else if(c.instant||a.w1<=a.w0)a.cur=[0,0,0],a.reach=0,a.swell=0;else{const d=fe((p-a.w0)/(a.w1-a.w0));a.cur=J(a.wFrom,1-d),a.reach=a.wReach*(1-d),a.swell=a.wSwell*(1-Bt((p-a.w0)/rn))}}function l(a,c){n.cum.fill(0),n.chainRoot.fill(-1),n.reach.fill(0),n.goal.fill(0),n.bulbCount=0,n.polar=[0,0,0],n.nearest=1;const p=[];for(const v of o){v.t+=a*(v.instant?1:c);let M=!1;for(const P of v.growers){if(r(P,v),(P.reach>1e-4||P.swell>1e-4||P.phase==="grow")&&(M=!0),P.reach<=0&&P.swell<=0)continue;if(P.chain.forEach((L,I)=>{n.cum[L]=P.cum[I],n.chainRoot[L]=P.chain[0],n.reach[L]=P.reach,n.goal[L*3]=P.cur[0],n.goal[L*3+1]=P.cur[1],n.goal[L*3+2]=P.cur[2]}),P.swell>.001&&n.bulbCount<vt){const L=n.bulbCount++;n.bulbs[L*4]=P.end[0]+P.cur[0],n.bulbs[L*4+1]=P.end[1]+P.cur[1],n.bulbs[L*4+2]=P.end[2]+P.cur[2],n.bulbs[L*4+3]=P.swell}const R=dt(xt(lt(P.end,P.cur),v.source)),D=_e*e;n.nearest=Math.min(n.nearest,P.dist-D>.001?be((R-D)/(P.dist-D)):0)}const x=v.cut?v.cut.polar*(v.instant?0:1-fe((v.t-v.cut.t)/(Ut-et))):Ce(v.t,v.instant);x>1e-4&&(M=!0,n.polar=lt(n.polar,J(v.dir,x))),!M&&v.t>(v.cut?v.cut.t:et)&&p.push(v)}for(const v of p)o.splice(o.indexOf(v),1);const d=dt(n.polar);d>1&&(n.polar=J(n.polar,1/d))}return{out:n,stimulate:u,step:l,get numbers(){const a=o[o.length-1];return a?{t:a.t,source:a.source,tips:a.growers.map(c=>({branch:c.tip,rest:c.dist,now:dt(xt(lt(c.end,c.cur),a.source))})),nearest:n.nearest,polar:dt(n.polar)}:null},get active(){return o.length>0}}}const xn=.12,ro=2e4,ke=12;function bn(t,e=ro,s=1){const n=Nt(s),o=Math.round(e*xn),i=e-o,h=t.branches.map(E=>E.length*(E.radius0+E.radius1)*.5),u=h.reduce((E,C)=>E+C,0),f=ao(t),r=new Float32Array(e*3),l=new Float32Array(e),a=new Float32Array(e),c=new Float32Array(e),p=new Float32Array(e),d=new Float32Array(e),v=new Float32Array(e*3),M=new Float32Array(e);let x=0;for(;x<o;x++){const E=n()*2-1,C=n()*Math.PI*2,H=Math.sqrt(1-E*E),A=n(),S=t.soma*(.85+.3*A);r[x*3]=H*Math.cos(C)*S,r[x*3+1]=E*S,r[x*3+2]=H*Math.sin(C)*S,v[x*3]=H*Math.cos(C),v[x*3+1]=E,v[x*3+2]=H*Math.sin(C),M[x]=A,l[x]=-1,a[x]=0,c[x]=n(),p[x]=1,d[x]=0}const P=h.map(E=>i*E/u),R=P.map(Math.floor);let D=i-R.reduce((E,C)=>E+C,0);const L=P.map((E,C)=>({k:C,frac:E-Math.floor(E)})).sort((E,C)=>C.frac-E.frac);for(let E=0;D>0&&E<L.length;E++,D--)R[L[E].k]++;const I=new _,b=new _,g=new _,m=new _(0,1,0),F=new _;return t.branches.forEach((E,C)=>{const H=E.points.length/3;for(let A=0;A<R[C];A++,x++){const S=n(),T=S*E.length;let y=0;for(;y<H-2&&E.cum[y+1]<T;)y++;const z=E.cum[y+1]-E.cum[y],w=z>0?(T-E.cum[y])/z:0,k=E.points[y*3],B=E.points[y*3+1],O=E.points[y*3+2],U=E.points[y*3+3],q=E.points[y*3+4],X=E.points[y*3+5];F.set(k+(U-k)*w,B+(q-B)*w,O+(X-O)*w),I.set(U-k,q-B,X-O).normalize(),I.lengthSq()===0&&I.set(0,1,0),b.crossVectors(I,Math.abs(I.y)>.9?new _(1,0,0):m).normalize(),g.crossVectors(I,b);const Y=(E.radius0+(E.radius1-E.radius0)*S)*(.85+.3*n()),tt=n()*Math.PI*2,ht=Math.cos(tt),ft=Math.sin(tt);F.addScaledVector(b,ht*Y).addScaledVector(g,ft*Y),r[x*3]=F.x,r[x*3+1]=F.y,r[x*3+2]=F.z,v[x*3]=b.x*ht+g.x*ft,v[x*3+1]=b.y*ht+g.y*ft,v[x*3+2]=b.z*ht+g.z*ft,l[x]=C,a[x]=S,c[x]=n(),p[x]=0,d[x]=f.rootDist[C]+S*E.length}}),{position:r,aBranch:l,aT:a,aSeed:c,aSoma:p,aDist:d,aNormal:v,aShell:M,count:e}}const pe=2,Be=[0,1].map(t=>((t+.5)/pe).toFixed(4)),At=t=>t.toFixed(3),Mn=.085,He=.11,An=.6,Sn=`
  attribute float aSeed;
  attribute float aBranch;
  attribute float aT;
  attribute float aSoma;
  attribute float aDist;         // arc distance from the soma along the skeleton
  attribute vec3 aNormal;        // the surface normal, cell space
  attribute float aShell;        // soma: 0 deep inside, 1 on the skin
  uniform sampler2D uBranch;     // row 0 per branch: ext, the displacement of its end; row 1: reach, the displacement of its root
  uniform float uBranchCount;
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
  uniform vec4 uBulb[${vt}]; // xyz a swelling tip's end, cell space; w 0..1 how far it has swollen
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
    if (aSoma < 0.5) {
      vec4 st = texture2D(uBranch, vec2((aBranch + 0.5) / uBranchCount, ${Be[0]}));
      vec4 sr = texture2D(uBranch, vec2((aBranch + 0.5) / uBranchCount, ${Be[1]}));
      if (aT > st.r) hidden = 1.0;          // beyond where the process reaches right now
      pos += mix(sr.gba, st.gba, aT * aT);   // the root follows its parent's end, the tip is pulled
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
        for (int k = 0; k < ${vt}; k++) {
          if (float(k) >= uBulbCount) break;
          float l = length(pos - uBulb[k].xyz);
          if (l < bestL) { bestL = l; bestC = uBulb[k].xyz; bestW = uBulb[k].w; }
        }
        float w = smoothstep(${At(He)}, ${At(He*.3)}, bestL) * bestW;
        if (w > 0.0) {
          float theta = fract(aSeed * 13.7) * 6.2831853;
          float ph = fract(aSeed * 5.3) * 3.14159;
          vec3 spread = vec3(sin(ph) * cos(theta), sin(ph) * sin(theta), cos(ph));
          vec3 dir = normalize(pos - bestC + spread * 0.03);
          pos = mix(pos, bestC + dir * ${At(Mn)}, w);
        }
      }
      if (uPolar > 0.0) {
        // Polarised: the processes turned away from the source lose a share of their length ...
        float away = smoothstep(0.0, 0.6, -dot(normalize(position), uSourceDir));
        pos *= 1.0 - ${At(on)} * uPolar * away;
      }
    } else {
      pos *= uSomaScale;
    }
    if (uPolar > 0.0) {
      // ... and the soma moves toward it, the roots of the processes with it; the tips stay where they are.
      float f = 1.0 - clamp((length(position) - 0.25) / (uRadius - 0.25), 0.0, 1.0);
      pos += uSourceDir * (${At(en)} * uRadius * uPolar * f * f);
    }
    vec4 wp = modelMatrix * vec4(pos, 1.0);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    float foc = (1.0 - smoothstep(0.0, 18.0, abs(dist - ${ut.toFixed(1)}))) * (1.0 - uDefocus * uDefocusShare);
    float lens = smoothstep(4.4, 0.0, length(wp.xy - uPointer)) * uLens;
    float persp = 300.0 / max(dist, 1.0);
    float sz = (0.6 + 0.8 * fract(aSeed * 7.31)) * uThickness;
    // A process that reaches — for the particle, for the source — is drawn thicker and darker.
    if (abs(aBranch - uPhagoBranch) < 0.5) reaching = max(reaching, uReach);
    sz *= 1.0 + 0.9 * reaching;
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
`,Pn=`
  precision highp float;
  ${It}
  ${Dt}
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
`,En=`
  uniform vec3 uPos;
  uniform float uScale;
  uniform float uDpr;
  void main() {
    vec4 mv = modelViewMatrix * vec4(uPos, 1.0);
    gl_Position = projectionMatrix * mv;
    float persp = 300.0 / max(-mv.z, 1.0);
    gl_PointSize = clamp(uDpr * persp * 0.6 * uScale, 3.0, 32.0 * uDpr);
  }
`,Tn=`
  precision highp float;
  ${eo}
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
`,j={appear:.7,reach:1.6,cup:1.1,close:.9,retract:1,digest:.8},St=.17,Rn=.1,In=1.5,Oe=6,Dn=9,Ln=.45,it=t=>{const e=Math.max(0,Math.min(1,t));return e*e*(3-2*e)},Fn=t=>1-Math.pow(1-Math.max(0,Math.min(1,t)),3);function _n(t,e){var H;const s=Nt(e),n=A=>new _(A.points[A.points.length-3],A.points[A.points.length-2],A.points[A.points.length-1]),o=t.branches.filter(A=>A.isTip).map(A=>({b:A,d:n(A).length()})).sort((A,S)=>S.d-A.d),i=o.slice(0,Math.max(6,Math.round(o.length*.5))).map(A=>A.b),h=((H=[...i].sort((A,S)=>A.length-S.length)[Math.floor(i.length/2)])==null?void 0:H.length)??0,u=i.filter(A=>A.length>=h);u.length<3&&u.push(...i.slice(0,3));let f=-1;const r={branch:-1,reach:0,disp:new _,cup:0,wrap:0,cupRadius:St,target:new _,axis:new _(0,0,1),u:new _(1,0,0),v:new _(0,1,0),particle:new _,particleAlpha:0,particleScale:1,phagosome:new _,bulge:0,somaBump:0};let l="rest",a=0,c=In,p=0;const d=new _,v=new _,M=new _;let x=new Float32Array(0),P=new Float32Array(0),R=0;const D=new _,L=new _;function I(A){const S=[];let T=A,y=0;for(;T&&y++<64;){for(let w=T.points.length-3;w>=0;w-=3){const k=T.points[w],B=T.points[w+1],O=T.points[w+2],U=S.length;U&&S[U-3]===k&&S[U-2]===B&&S[U-1]===O||S.push(k,B,O)}T=T.parent>=0&&T.parent!==T.id?t.branches[T.parent]:void 0}S.push(0,0,0),x=Float32Array.from(S);const z=x.length/3;P=new Float32Array(z);for(let w=1;w<z;w++)P[w]=P[w-1]+Math.hypot(x[w*3]-x[w*3-3],x[w*3+1]-x[w*3-2],x[w*3+2]-x[w*3-1]);R=P[z-1]}function b(A,S){const T=x.length/3;if(T===0)return S.set(0,0,0);if(A<=0)return S.set(x[0],x[1],x[2]);if(A>=R)return S.set(0,0,0);let y=1;for(;y<T-1&&P[y]<A;)y++;const z=(A-P[y-1])/Math.max(1e-6,P[y]-P[y-1]);return S.set(x[y*3-3]+(x[y*3]-x[y*3-3])*z,x[y*3-2]+(x[y*3+1]-x[y*3-2])*z,x[y*3-1]+(x[y*3+2]-x[y*3-1])*z)}const g=o.map(A=>n(A.b));function m(A,S){let T=1/0;for(let y=0;y<o.length;y++)o[y].b.id!==A.id&&(T=Math.min(T,g[y].distanceTo(S)));return T}function F(){let A=u[0],S=-1;for(let k=0;k<4;k++){const B=u[Math.floor(s()*u.length)];if(B.id===f&&u.length>1)continue;const O=n(B),U=D.set(O.x-B.points[0],O.y-B.points[1],O.z-B.points[2]).normalize(),q=L.copy(O).addScaledVector(U,.35),X=m(B,q);X>S&&(S=X,A=B)}f=A.id,d.copy(n(A));const T=D.set(d.x-A.points[0],d.y-A.points[1],d.z-A.points[2]).normalize();T.lengthSq()===0&&T.copy(d).normalize();const y=L.set(s()-.5,s()-.5,s()-.5).cross(T).normalize(),z=Math.min(.55,Math.max(.3,A.length*.9));v.copy(d).addScaledVector(T,z).addScaledVector(y,z*.35*(s()-.5)*2);const w=D.subVectors(v,d).normalize();r.axis.copy(w).negate(),M.copy(v).addScaledVector(w,-.17).sub(d),r.u.set(0,1,0),Math.abs(r.axis.y)>.9&&r.u.set(1,0,0),r.u.cross(r.axis).normalize(),r.v.crossVectors(r.axis,r.u).normalize(),r.branch=A.id,I(A),l="appear",a=0}function E(){r.branch=-1,r.reach=0,r.cup=0,r.wrap=0,r.cupRadius=St,r.particleAlpha=0,r.particleScale=1,r.bulge=0,r.somaBump=0,l="rest",a=0,c=Oe+s()*(Dn-Oe)}function C(A){if(A<=0)return;p+=A,a+=A;const S=T=>r.particle.copy(v).add(D.set(Math.sin(p*7.1)*T,Math.cos(p*5.3)*T,Math.sin(p*6.2+1.3)*T));switch(l){case"rest":a>=c&&F();break;case"appear":{r.particleAlpha=it(a/j.appear),S(.014),a>=j.appear&&(l="reach",a=0);break}case"reach":{const T=it(a/j.reach);r.reach=T,r.disp.copy(M).multiplyScalar(T),S(.014*(1-T)),r.particleAlpha=1,a>=j.reach&&(l="cup",a=0,r.target.copy(r.particle));break}case"cup":{r.reach=1,r.disp.copy(M),r.cup=Fn(a/j.cup),r.wrap=.3*r.cup,r.particle.copy(r.target),a>=j.cup&&(l="close",a=0);break}case"close":{const T=it(a/j.close);r.cup=1,r.wrap=.3+.7*T,r.cupRadius=St+(Rn-St)*T,r.particleScale=1-.3*T,a>=j.close&&(l="retract",a=0);break}case"retract":{const T=it(a/j.retract);r.reach=1-T,r.disp.copy(M).multiplyScalar(r.reach),r.target.copy(d).add(r.disp).addScaledVector(r.axis,-.1*(1-T)),r.particle.copy(r.target),a>=j.retract&&(l="transport",a=0);break}case"transport":{const T=a*Ln;r.reach=0,r.cup=1-it(a/.5),r.wrap=1,b(T,r.particle),r.target.copy(r.particle),r.phagosome.copy(r.particle),r.bulge=it(a/.4),T>=R&&(l="digest",a=0);break}case"digest":{const T=a/j.digest;r.cup=0,r.particle.set(0,0,0),r.phagosome.set(0,0,0),r.particleAlpha=1-it(T),r.bulge=1-it(T),r.somaBump=Math.sin(Math.PI*Math.min(1,T)),a>=j.digest&&E();break}}}return{out:r,step:C,feed(){l==="rest"&&(c=0)}}}function za(t,e,s={}){const n=bn(e,s.count??ro,s.seed??1),o=new at;o.setAttribute("position",new N(n.position,3)),o.setAttribute("aBranch",new N(n.aBranch,1)),o.setAttribute("aT",new N(n.aT,1)),o.setAttribute("aSeed",new N(n.aSeed,1)),o.setAttribute("aSoma",new N(n.aSoma,1)),o.setAttribute("aDist",new N(n.aDist,1)),o.setAttribute("aNormal",new N(n.aNormal,3)),o.setAttribute("aShell",new N(n.aShell,1)),o.boundingSphere=new ct(new _,e.bound*1.5);const i=e.branches.length,h=new Float32Array(i*4*pe);for(let m=0;m<i;m++)h[m*4]=1;const u=new vo(h,i,pe,wo,go);u.magFilter=Ae,u.minFilter=Ae,u.needsUpdate=!0;const f=new st({vertexShader:Sn,fragmentShader:Pn,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uSize:t.uSize,uDpr:t.uDpr,uMaxPx:{value:ke},uLens:t.uLens,uPointer:t.uPointer,uAlpha:t.uAlpha,uBranch:{value:u},uBranchCount:{value:i},uSomaScale:{value:1},uThickness:{value:1},uReveal:{value:1},uDraw:{value:1},uDefocus:t.uDefocus,uDefocusShare:{value:1},uLight:t.uLight,uPhagoBranch:{value:-1},uTarget:{value:new _},uCupAxis:{value:new _(0,0,1)},uCupU:{value:new _(1,0,0)},uCupV:{value:new _(0,1,0)},uCup:{value:0},uCupRadius:{value:St},uCupWrap:{value:0},uPhagoPos:{value:new _},uBulge:{value:0},uReach:{value:0},uBulb:{value:Array.from({length:vt},()=>new yo)},uBulbCount:{value:0},uPolar:{value:0},uSourceDir:{value:new _(1,0,0)},uRadius:{value:e.bound}}}),r=new Rt;r.add(new rt(o,f)),r.scale.setScalar(s.scale??1);const l=s.phagocytosis?_n(e,(s.seed??1)*31+7):null;let a=null,c=null;if(l){const m=new at;m.setAttribute("position",new N(new Float32Array(3),3)),m.boundingSphere=new ct(new _,e.bound*2),c=new st({vertexShader:En,fragmentShader:Tn,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uPos:{value:new _},uScale:{value:1},uDpr:t.uDpr,uAlpha:{value:0},uCellAlpha:t.uAlpha,uReveal:{value:1}}}),a=new rt(m,c),a.visible=!1,r.add(a)}const p=!!s.atp,d=ao(e),v=d.maxDist*1.02;let M=null;const x=p?yn(e):null;p&&(M=Qo(t,s.seed??1),r.add(M.points));let P=0;const R=new Float32Array(i*3),D=Int32Array.from(e.branches,m=>m.parent);for(let m=0;m<i;m++)if(D[m]>=m)throw new Error("LivingCell: the skeleton must list parents before their children");let L=Fe(e,s);const I=s.surveillance??!1,b=new _,g={group:r,reveal:1,draw:1,maxPx:ke,defocusShare:1,magnify:1,hunger:1,get chemotaxis(){return x?x.numbers:null},get somaScale(){return f.uniforms.uSomaScale.value},get motility(){return L},setMotility(m){L=Fe(e,{...s,...m})},update(m,F,E,C){let H=null;I&&E&&(b.set(E.x,E.y,r.position.z),r.worldToLocal(b),H=[b.x,b.y,b.z]),p&&x&&(x.step(m,F),M==null||M.update(m,F,g.reveal),P+=m,P>=1/Kt&&(P=Math.min(P-1/Kt,1/Kt),Se.write(x.out.nearest))),L.update({dt:m,motion:F,pointer:H,activation:C});const{ext:A,disp:S}=L,T=g.draw>=1?1/0:g.draw*v,y=(x==null?void 0:x.out)??null;for(let w=0;w<i;w++){const k=e.branches[w],B=T===1/0?1:Math.max(0,Math.min(1,(T-d.rootDist[w])/Math.max(1e-4,k.length)));let O=A[w]*B;y&&(O+=(1-O)*y.reach[w]),h[w*4]=O,R[w*3]=S[w*3],R[w*3+1]=S[w*3+1],R[w*3+2]=S[w*3+2],h[i*4+w*4]=y?An*y.reach[w]*y.cum[w]:0}let z=0;if(l&&a&&c){g.reveal>.9&&l.step(m*Math.max(0,Math.min(1,F))*g.hunger);const w=l.out;if(w.branch>=0&&w.reach>0){const B=w.branch,O=w.reach;h[B*4]+=(1-h[B*4])*O,R[B*3]+=(w.disp.x-R[B*3])*O,R[B*3+1]+=(w.disp.y-R[B*3+1])*O,R[B*3+2]+=(w.disp.z-R[B*3+2])*O}const k=f.uniforms;k.uPhagoBranch.value=w.branch,k.uReach.value=w.reach,k.uTarget.value.copy(w.target),k.uCupAxis.value.copy(w.axis),k.uCupU.value.copy(w.u),k.uCupV.value.copy(w.v),k.uCup.value=w.cup,k.uCupRadius.value=w.cupRadius,k.uCupWrap.value=w.wrap,k.uPhagoPos.value.copy(w.phagosome),k.uBulge.value=w.bulge,c.uniforms.uPos.value.copy(w.particle),c.uniforms.uScale.value=w.particleScale,c.uniforms.uAlpha.value=w.particleAlpha,c.uniforms.uReveal.value=g.reveal,a.visible=w.particleAlpha>.01,z=w.somaBump}for(let w=0;w<i;w++){const k=D[w],B=k>=0?h[k*4+1]:0,O=k>=0?h[k*4+2]:0,U=k>=0?h[k*4+3]:0;h[i*4+w*4+1]=B,h[i*4+w*4+2]=O,h[i*4+w*4+3]=U;let q=B+R[w*3],X=O+R[w*3+1],Y=U+R[w*3+2];if(y&&y.cum[w]>0){const tt=y.chainRoot[w],ht=h[i*4+tt*4+1],ft=h[i*4+tt*4+2],Me=h[i*4+tt*4+3],qt=y.cum[w],Xt=y.reach[w];q+=(ht+(y.goal[w*3]-ht)*qt-q)*Xt,X+=(ft+(y.goal[w*3+1]-ft)*qt-X)*Xt,Y+=(Me+(y.goal[w*3+2]-Me)*qt-Y)*Xt}h[w*4+1]=q,h[w*4+2]=X,h[w*4+3]=Y}if(y){const w=f.uniforms;for(let B=0;B<vt;B++)w.uBulb.value[B].set(y.bulbs[B*4],y.bulbs[B*4+1],y.bulbs[B*4+2],y.bulbs[B*4+3]);w.uBulbCount.value=y.bulbCount;const k=Math.hypot(y.polar[0],y.polar[1],y.polar[2]);w.uPolar.value=k,k>1e-6&&w.uSourceDir.value.set(y.polar[0]/k,y.polar[1]/k,y.polar[2]/k)}u.needsUpdate=!0,f.uniforms.uSomaScale.value=L.somaScale*(1+.06*z),f.uniforms.uThickness.value=L.thickness*g.magnify,f.uniforms.uDefocusShare.value=g.defocusShare,f.uniforms.uReveal.value=g.reveal,f.uniforms.uDraw.value=g.draw,f.uniforms.uMaxPx.value=g.maxPx},feed(){l==null||l.feed()},stimulate(m,F={}){var A;if(!p||!x)return;const E=!!F.instant,C=F.normal?[F.normal.x,F.normal.y,F.normal.z]:[0,0,1];x.stimulate([m.x,m.y,m.z],C,E);const H=((A=x.numbers)==null?void 0:A.source)??[m.x,m.y,m.z];M&&!E&&M.start({x:H[0],y:H[1],z:H[2]}),Se.stimulatedAt=performance.now()},dispose(){o.dispose(),f.dispose(),u.dispose(),a==null||a.geometry.dispose(),c==null||c.dispose(),M==null||M.dispose()}};return g}const K={a:.64,b:.44,c:.54},zn=.88,io=.035,Cn=.08,kn=.16,Bn=.02,W={x:-.38,y:-.31,z:0,a:.22,b:.16,c:.3},Hn=24,On=.012,$={x0:-.1,y0:-.22,x1:-.235,y1:-.64,r0:.1,r1:.07},Nn=.045,Un=.02,oe=.72/K.a,ne={cerebrum:22e3,cerebellum:3500,brainstem:600},Gt=.35,$n=1.5;function Gn(t,e,s,n){let o=Math.imul(t|0,668265261)^Math.imul(e|0,374761393)^Math.imul(s|0,625341585)^Math.imul((n|0)+1540483477,2246822507);return o=Math.imul(o^o>>>15,739982445),o=Math.imul(o^o>>>12,695872825),o^=o>>>15,(o>>>0)/4294967296}const ae=t=>t*t*t*(t*(t*6-15)+10),Q=(t,e,s)=>t+(e-t)*s;function Et(t,e,s,n=0){const o=Math.floor(t),i=Math.floor(e),h=Math.floor(s),u=ae(t-o),f=ae(e-i),r=ae(s-h),l=(c,p,d)=>Gn(o+c,i+p,h+d,n);return Q(Q(Q(l(0,0,0),l(1,0,0),u),Q(l(0,1,0),l(1,1,0),u),f),Q(Q(l(0,0,1),l(1,0,1),u),Q(l(0,1,1),l(1,1,1),u),f),r)-.5}function V(t,e,s){const n=Math.min(1,Math.max(0,(s-t)/(e-t)));return n*n*(3-2*n)}function Wn(t){let e=t*7919+13>>>0;return()=>(e=e*1664525+1013904223>>>0,e/4294967296)}function Ne(t,e,s){const n=Math.PI*(3-Math.sqrt(5)),o=1-2*(t+.5)/e,i=Math.sqrt(Math.max(0,1-o*o)),h=t*n;s[0]=i*Math.cos(h),s[1]=o,s[2]=i*Math.sin(h)}function Mt(t){const e=Math.hypot(t[0],t[1],t[2])||1;return t[0]/=e,t[1]/=e,t[2]/=e,t}const Tt=(t,e)=>[t[1]*e[2]-t[2]*e[1],t[2]*e[0]-t[0]*e[2],t[0]*e[1]-t[1]*e[0]],lo=(t,e)=>t[0]*e[0]+t[1]*e[1]+t[2]*e[2];function co(t){const e=Math.abs(t[1])<.9?[0,1,0]:[1,0,0],s=Mt(Tt(t,e)),n=Tt(t,s);return[s,n]}function Wt(t,e,s,n=.008){const[o,i]=co(e),h=(c,p,d)=>t(Mt([e[0]+c*p[0],e[1]+c*p[1],e[2]+c*p[2]]),d),u=[0,0,0],f=[0,0,0],r=[0,0,0],l=[0,0,0];h(n,o,u),h(-n,o,f),h(n,i,r),h(-n,i,l);const a=Mt(Tt([u[0]-f[0],u[1]-f[1],u[2]-f[2]],[r[0]-l[0],r[1]-l[1],r[2]-l[2]]));s[0]=a[0],s[1]=a[1],s[2]=a[2]}const Vt=t=>1-(1-zn)*((1+t/K.a)/2),Vn=.3,se={drop:.13,x:.2,spread:.45};function uo(t,e,s,n){const o=V(.3,.8,Math.abs(s)/(K.c*Vt(t))),i=V(0,-.5,e/K.b),h=1-Vn*i*(1-o),u=se.drop*Math.exp(-(((t/K.a-se.x)/se.spread)**2))*i*o;n[0]=t+.3*u,n[1]=e*h-u,n[2]=s+Math.sign(s)*.5*u}function de(t,e){const s=K.a*t[0];uo(s,K.b*t[1],K.c*t[2]*Vt(s),e)}const nt={k:42,k2:85,second:.35,warp:.32,freq:2.5,lean:.12,sulcus:-.6,gyrus:-.2},zt={from:.24,to:.4,amount:.75,warp:1.4},qn={x0:.46,y0:-.16,x1:-.15,y1:.03,halfWidth:.016,depth:.06,amount:1,flank:[.5,.8]},Xn={x0:-.02,y0:.44,x1:.17,y1:-.02,halfWidth:.013,depth:.05,amount:1,flank:[.05,.3]},Kn={x0:.2,y0:.4,x1:.28,y1:.08,halfWidth:.011,depth:.045,amount:.65,flank:[.1,.35]},jn={x0:-.16,y0:.42,x1:-.08,y1:.1,halfWidth:.011,depth:.045,amount:.65,flank:[.1,.35]},Yn=[qn,Xn,Kn,jn],gt={x0:-.2,x1:.34,y:-.1},Ue=t=>1-V(nt.sulcus,nt.gyrus,t),$e=t=>Math.sin(nt.k*t)+nt.second*Math.sin(nt.k2*t+1.9);function re(t,e,s,n){const o=nt.freq;return Et(o*t,o*e,o*s,n)+.5*Et(2*o*t+3.1,2*o*e+1.7,2*o*s+5.3,n+1)+.25*Et(4*o*t+7.7,4*o*e+2.9,4*o*s+4.1,n+2)}function Zn(t,e,s,n){const o=t.x1-t.x0,i=t.y1-t.y0,h=Math.min(1,Math.max(0,((e-t.x0)*o+(s-t.y0)*i)/(o*o+i*i))),u=Math.hypot(e-(t.x0+h*o),s-(t.y0+h*i)),f=V(0,.08,h)*V(1,.92,h);return(1-V(t.halfWidth,t.halfWidth+.012,u))*f*V(t.flank[0],t.flank[1],n)*t.amount}function ho(t,e,s,n,o){const i=Math.abs(s)/(K.c*Vt(t)),h=re(t,e,s,n),u=V(zt.from,zt.to,e),f=V(gt.x0-.06,gt.x0+.06,t)*(1-V(gt.x1-.06,gt.x1+.06,t))*V(gt.y-.08,gt.y,e)*(1-u),r=Ue($e(e+nt.lean*t+nt.warp*h))*(1-.7*u)*(1-.85*f),l=Ue($e(s+.7+zt.warp*nt.warp*re(t+2.3,e+1.1,s+.4,n)))*u*zt.amount;let a=Math.max(r,l),c=Nn*a;const p=t+.06*h,d=e+.06*re(t+5.1,e+.7,s+2.2,n+3);for(const v of Yn){const M=Zn(v,p,d,i);M>a&&(a=M),c=Math.max(c,v.depth*M)}return o&&(o.depth=c),a}function Qn(t,e,s,n){const o=[0,0,0];de(t,o);const i=[0,0,0];Wt(de,t,i);const h={depth:0},u=ho(o[0],o[1],o[2],e,h),f=Math.abs(o[2]),r=Cn*(1-V(io,kn,f))*V(-.1,.35,o[1]),l=Un*(1-u)-h.depth-r;s[0]=o[0]+i[0]*l,s[1]=o[1]+i[1]*l,s[2]=o[2]+i[2]*l+Math.sign(o[2])*Bn,n&&(n.tone=u)}function fo(t){let e=t[0],s=t[1],n=t[2];const o=[0,0,0];for(let h=0;h<3;h++)uo(e,s,n,o),e+=t[0]-o[0],s+=t[1]-o[1],n+=t[2]-o[2];const i=n/(K.c*Vt(e));return Math.sqrt((e/K.a)**2+(s/K.b)**2+i*i)}const me=(t,e=1)=>fo(t)<e;function ve(t,e){e[0]=W.x+W.a*t[0],e[1]=W.y+W.b*t[1],e[2]=W.z+W.c*t[2]}function Jn(t,e,s,n){const o=t-W.x,i=e-W.y,h=s-W.z,u=Math.atan2(i,o);return Math.sin(Hn*u+2.5*Et(6*o,6*i,6*h,n+2))}function ta(t,e,s,n){const o=[0,0,0];ve(t,o);const i=[0,0,0];Wt(ve,t,i);const h=Jn(o[0],o[1],o[2],e),u=1-V(-.4,.2,h),f=On*(.4-1.4*u);s[0]=o[0]+i[0]*f,s[1]=o[1]+i[1]*f,s[2]=o[2]+i[2]*f,n&&(n.tone=Q(.12,.9,u))}function po(t){return Math.sqrt(((t[0]-W.x)/W.a)**2+((t[1]-W.y)/W.b)**2+((t[2]-W.z)/W.c)**2)}const we=(t,e=1)=>po(t)<e,ot=Mt([$.x1-$.x0,$.y1-$.y0,0]),mt=Math.hypot($.x1-$.x0,$.y1-$.y0),Ht=[0,0,1],ie=Tt(ot,Ht);function pt(t,e,s){const n=Q($.r0,$.r1,t),o=Math.cos(e),i=Math.sin(e);s[0]=$.x0+ot[0]*t*mt+n*(o*Ht[0]+i*ie[0]),s[1]=$.y0+ot[1]*t*mt+n*(o*Ht[1]+i*ie[1]),s[2]=n*(o*Ht[2]+i*ie[2])}function ea(t,e,s){const o=[0,0,0],i=[0,0,0],h=[0,0,0],u=[0,0,0];pt(t+.01,e,o),pt(t-.01,e,i),pt(t,e+.01,h),pt(t,e-.01,u);const f=Mt(Tt([h[0]-u[0],h[1]-u[1],h[2]-u[2]],[o[0]-i[0],o[1]-i[1],o[2]-i[2]])),r=[0,0,0];pt(t,e,r);const l=[$.x0+ot[0]*t*mt,$.y0+ot[1]*t*mt,0],a=[r[0]-l[0],r[1]-l[1],r[2]-l[2]],c=lo(f,a)<0?-1:1;s[0]=f[0]*c,s[1]=f[1]*c,s[2]=f[2]*c}function ge(t){const e=t[0]-$.x0,s=t[1]-$.y0,n=(e*ot[0]+s*ot[1])/mt;if(n<-.05||n>1)return 1/0;const o=e-ot[0]*n*mt,i=s-ot[1]*n*mt,h=Q($.r0,$.r1,Math.max(0,n));return Math.hypot(o,i,t[2])/h}const Ge=(t,e=1)=>ge(t)<e,Ct=(t,e,s)=>s*(1-V(1,e,t));function mo(t,e,s,n,o){let i=0;for(let l=0;l<t.length;l++)(o||!e[l])&&(i+=t[l]);const h=i/s,u=[];let f=n*h,r=0;for(let l=0;l<t.length;l++)if(!(!o&&e[l]))for(r+=t[l];f<r;)e[l]||u.push(l),f+=h;return u}function oa(t,e,s,n){return Math.min(e,s,n)*Math.sqrt((t[0]/e)**2+(t[1]/s)**2+(t[2]/n)**2)}function We(t,e,s,n,o,i,h,u,f,r){const l=s*3,a=new Float64Array(l),c=new Uint8Array(l),p=[0,0,0],d=[0,0,0];for(let I=0;I<l;I++)Ne(I,l,p),o(p,d),a[I]=oa(p,n.a,n.b,n.c)*(r?r(d):1),c[I]=h(d)?1:0;const v=mo(a,c,s,u(),f),M=Math.sqrt(4*Math.PI/Math.max(1,v.length)),x={tone:0},P=[0,0,0],R=[0,0,0],D=[0,0,0],L=(I,b)=>i(I,b,x);for(const I of v){Ne(I,l,p);const[b,g]=co(p),m=(u()-.5)*2*Gt*M,F=(u()-.5)*2*Gt*M,E=Mt([p[0]+m*b[0]+F*g[0],p[1]+m*b[1]+F*g[1],p[2]+m*b[2]+F*g[2]]);o(E,d),!h(d)&&(i(E,P,x),Wt(o,E,R),Wt(L,E,D),lo(D,R)<0&&(D[0]=-D[0],D[1]=-D[1],D[2]=-D[2]),t.push(P,R,D,x.tone,e,u()))}return v.length}function na(t,e,s){const n=e*3,o=Math.PI*(3-Math.sqrt(5)),i=new Float64Array(n),h=new Uint8Array(n),u=[0,0,0],f=new Float64Array(n),r=new Float64Array(n);for(let p=0;p<n;p++)f[p]=(p+.5)/n,r[p]=p*o,pt(f[p],r[p],u),i[p]=Q($.r0,$.r1,f[p])/$.r0,h[p]=me(u)||we(u)?1:0;const l=mo(i,h,e,s(),!1),a=[0,0,0];let c=0;for(const p of l){const d=Math.min(1,Math.max(0,f[p]+(s()-.5)*Gt*.06)),v=r[p]+(s()-.5)*Gt*.5;if(pt(d,v,u),me(u)||we(u))continue;ea(d,v,a);const M=.42+.12*Et(9*u[0],9*u[1],9*u[2],5);t.push(u,a,a,M,2,s()),c++}return c}function aa(t=1){const e=Wn(t),s=[],n=[],o=[],i=[],h=[],u=[],f={push(d,v,M,x,P,R){s.push(d[0]*oe,d[1]*oe,d[2]*oe),n.push(v[0],v[1],v[2]),o.push(M[0],M[1],M[2]),i.push(x),h.push(P),u.push(R)}},r=()=>h.length,l=r();We(f,0,ne.cerebrum,K,de,(d,v,M)=>{Qn(d,t,v,M),M.tone=Math.max(M.tone,Ct(po(v),1.15,.75),Ct(ge(v),1.5,.7))},d=>Math.abs(d[2])<io||we(d,.98)||Ge(d,.98),e,!0,d=>1+($n-1)*ho(d[0],d[1],d[2],t));const a=r();We(f,1,ne.cerebellum,W,ve,(d,v,M)=>{ta(d,t,v,M),M.tone=Math.max(M.tone,Ct(fo(v),1.08,.6),Ct(ge(v),1.4,.55))},d=>me(d)||Ge(d),e,!1);const c=r();na(f,ne.brainstem,e);const p=r();return{count:h.length,positions:new Float32Array(s),normals:new Float32Array(n),folds:new Float32Array(o),tones:new Float32Array(i),kinds:new Float32Array(h),seeds:new Float32Array(u),counts:{cerebrum:a-l,cerebellum:c-a,brainstem:p-c}}}const Ca=1.05,Ve=.19,qe=11,Xe=72,sa=3,ra=.03,ia=11,la=.5,ca=.32,Ke=.22,ua=1.45,le={gyrus:1.45,sulcus:1.95,base:1.4},je={gyrus:.72,sulcus:.95},Ye={gyrus:.5,sulcus:.15},Ze={alpha:.12,size:.6},ha=.45,fa=`
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
    float breath = 1.0 + ${ra.toFixed(3)} * sin(uTime * aBreath.x + aBreath.y);
    vec3 p = (cos(ang) * aU + sin(ang) * aV) * breath;
    vec4 wp = modelMatrix * vec4(p, 1.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    float foc = (1.0 - smoothstep(0.0, 18.0, abs(dist - ${ut.toFixed(1)}))) * (1.0 - uDefocus);
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
`,pa=`
  precision highp float;
  ${It}
  ${Dt}
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
`,da=`
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
    float foc = (1.0 - smoothstep(0.0, 18.0, abs(dist - ${ut.toFixed(1)}))) * (1.0 - uDefocus);
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
    float fore = mix(mix(${Ye.gyrus.toFixed(2)}, 1.0, nz), mix(${Ye.sulcus.toFixed(2)}, 1.0, nz), aTone);

    float size = aKind < 0.5 ? mix(${le.gyrus.toFixed(2)}, ${le.sulcus.toFixed(2)}, aTone) : ${le.base.toFixed(2)};
    size *= 0.85 + 0.3 * fract(aSeed * 7.31);
    size *= mix(${Ze.size.toFixed(2)}, 1.0, facing);
    float bokeh = 1.0 + (1.0 - foc) * 1.2;
    float px = clamp(size * uDpr * persp * 0.05 * bokeh, 0.75, 14.0 * uDpr);
    gl_PointSize = px;

    // Drawn from the top down with the orbits.
    float cut = 1.35 - 2.7 * uDraw;
    float drawn = smoothstep(cut - 0.3, cut, p.y);
    // The gyri light, with the paper showing through them; the sulci heavy.
    float base = mix(${je.gyrus.toFixed(2)}, ${je.sulcus.toFixed(2)}, aTone);
    // The rim is neither raised as on the orbits nor damped (the shoulder above already thins it); the flank of a gyrus
    // away from the lamp a little denser than the lit one.
    vAlpha = base * (0.04 + 0.96 * foc) / (bokeh * bokeh) * mix(1.0 - 0.2 * uLens, 1.5, lens) * fore * (0.92 + 0.16 * (1.0 - key)) * mix(${Ze.alpha.toFixed(2)}, 1.0, near) * drawn;
    vShade = key;
    vRim = rim;
    vFoc = foc;
    vLens = lens;
    vSeed = aSeed;
    vPx = px;
    vTone = aTone;
  }
`,ma=`
  precision highp float;
  ${It}
  ${Dt}
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
    vec3 sulcus = mix(AMBER, GRAPHITE_DEEP, ${ha.toFixed(2)});
    vec3 col = mix(AMBER, sulcus, min(1.0, vTone));
    col = mix(col, sulcus, (1.0 - vShade) * 0.3 * (1.0 - vTone) + vRim * 0.1);
    col = mix(col, GRAPHITE_DEEP, vLens * 0.3);
    gl_FragColor = vec4(col, min(1.0, a));
  }
`,va=typeof location<"u"&&location.search.includes("nobrain");function wa(t,e){const s=aa(e),n=new at;n.setAttribute("position",new N(s.positions,3)),n.setAttribute("aNormal",new N(s.normals,3)),n.setAttribute("aFold",new N(s.folds,3)),n.setAttribute("aTone",new N(s.tones,1)),n.setAttribute("aSeed",new N(s.seeds,1)),n.setAttribute("aKind",new N(s.kinds,1)),n.boundingSphere=new ct(new _,4);const o=new st({vertexShader:da,fragmentShader:ma,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uDpr:t.uDpr,uLens:t.uLens,uDefocus:t.uDefocus,uLight:t.uLight,uPointer:t.uPointer,uAlpha:{value:1},uDraw:{value:1}}}),i=new Rt;return i.add(new rt(n,o)),{group:i,mat:o,dispose(){n.dispose(),o.dispose()}}}function ka(t,e=5){let s=e*7919+13;const n=()=>(s=s*1664525+1013904223>>>0,s/4294967296),o=[],i=[],h=[],u=[],f=[],r=[],l=[],a=(E,C,H,A,S,T,y)=>{o.push(E.x,E.y,E.z),i.push(C.x,C.y,C.z),h.push(H),u.push(A),f.push(n()),r.push(S),l.push(T,y)},c=new _,p=new _,d=new _,v=new _;for(let E=0;E<qe;E++){const C=Mo(E,qe);c.set(C[0],C[1],C[2]).normalize(),v.set(0,1,0),Math.abs(c.y)>.9&&v.set(1,0,0),p.crossVectors(c,v).normalize(),d.crossVectors(c,p).normalize();const H=n()*Math.PI*2,A=2*Math.PI/ia,S=(n()-.5)*2*la;for(let z=0;z<Xe;z++)a(p,d,H+z/Xe*Math.PI*2+(n()-.5)*.02,0,0,A,S);const T=n()<.5?1:-1,y=(.22+.36*n())*T;for(let z=0;z<sa;z++)a(p,d,n()*Math.PI*2,y*(.85+.3*n()),1,A,S)}const M=new at,x=r.length;M.setAttribute("position",new N(new Float32Array(x*3),3)),M.setAttribute("aU",new Z(o,3)),M.setAttribute("aV",new Z(i,3)),M.setAttribute("aPhase",new Z(h,1)),M.setAttribute("aOmega",new Z(u,1)),M.setAttribute("aSeed",new Z(f,1)),M.setAttribute("aKind",new Z(r,1)),M.setAttribute("aBreath",new Z(l,2)),M.boundingSphere=new ct(new _,4);const P=new st({vertexShader:fa,fragmentShader:pa,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uTime:{value:0},uDpr:t.uDpr,uLens:t.uLens,uDefocus:t.uDefocus,uLight:t.uLight,uPointer:t.uPointer,uAlpha:{value:1},uDraw:{value:1}}}),R=wa(t,e);R.group.visible=!va;const D=new Rt;D.add(R.group),D.add(new rt(M,P));let L=0,I=1,b=0,g=0;const m=(E,C,H,A)=>E+(C-E)*(1-Math.exp(-3*A)),F={group:D,draw:1,update(E,C,H,A){I=m(I,A?ua:1,3,E),L+=E*C*I,P.uniforms.uTime.value=L,P.uniforms.uAlpha.value=.05+.95*H,P.uniforms.uDraw.value=F.draw,R.mat.uniforms.uAlpha.value=P.uniforms.uAlpha.value,R.mat.uniforms.uDraw.value=F.draw,b=m(b,ca+(A?A.y*Ke:0),3,E),g=m(g,A?-A.x*Ke:0,3,E),D.rotation.set(b,L*Ve,g),R.group.rotation.y=-.4*L*Ve},dispose(){R.dispose(),M.dispose(),P.dispose()}};return F}const ga=8,ya=80,kt=.012;function Ba(t,e,s,n={}){const o={active:!1,hover:!1,lastX:0,lastY:0,spin:0,pinch:1,pinching:!1},i=new _,h=(b,g)=>{if(!t.visible)return!1;i.copy(t.position).project(e);const m=(i.x*.5+.5)*window.innerWidth,F=(-i.y*.5+.5)*window.innerHeight;return Math.hypot(b-m,g-F)<s()},u=b=>{b.pointerType==="touch"||!h(b.clientX,b.clientY)||(b.preventDefault(),o.active=!0,o.lastX=b.clientX,o.lastY=b.clientY,o.spin=0,document.body.style.cursor="grabbing")},f=b=>{if(b.pointerType==="touch")return;if(o.active){const m=b.clientX-o.lastX,F=b.clientY-o.lastY;t.rotation.y+=m*kt,n.tilt!==!1&&(t.rotation.x=Math.max(-1.3,Math.min(.7,t.rotation.x+F*.008))),o.spin=m*kt*40,o.lastX=b.clientX,o.lastY=b.clientY;return}const g=h(b.clientX,b.clientY);g!==o.hover&&(o.hover=g,document.body.style.cursor=g?"grab":"")},r=b=>{b.pointerType==="touch"||!o.active||(o.active=!1,document.body.style.cursor=o.hover?"grab":"")};window.addEventListener("pointerdown",u),window.addEventListener("pointermove",f),window.addEventListener("pointerup",r),window.addEventListener("pointercancel",r);const l=n.touch??null,a=new Map;let c="none";const p={x:0,y:0};let d=1,v=0,M=0,x=0;const P=()=>{const[b,g]=Array.from(a.values());return b&&g?Math.max(1,Math.hypot(b.x-g.x,b.y-g.y)):1},R=(b,g,m)=>{c="none",p.x=b,p.y=g,v=0,M=m,x=m},D=b=>{var g;if(b.pointerType==="touch"&&!((g=b.target)!=null&&g.closest("button, a"))){a.set(b.pointerId,{x:b.clientX,y:b.clientY});try{l==null||l.setPointerCapture(b.pointerId)}catch{}a.size===1?(o.spin=0,R(b.clientX,b.clientY,b.timeStamp)):a.size===2&&(o.active=!1,o.pinching=!0,o.pinch=1,d=P(),c="turn")}},L=b=>{const g=a.get(b.pointerId);if(!g)return;const m=g.x;if(g.x=b.clientX,g.y=b.clientY,a.size>=2){o.pinching&&(o.pinch=P()/d);return}if(c==="none"){const H=b.clientX-p.x,A=b.clientY-p.y;if(Math.hypot(H,A)<ga)return;c=Math.abs(H)>1.5*Math.abs(A)?"turn":"scroll",c==="turn"&&(o.active=!0),M=b.timeStamp;return}if(c!=="turn")return;const F=b.clientX-m,E=Math.max(1,b.timeStamp-M)/1e3;M=b.timeStamp,x=b.timeStamp,t.rotation.y+=F*kt;const C=F*kt/E;v+=(C-v)*.5},I=b=>{var g;if(a.has(b.pointerId)){if(a.delete(b.pointerId),o.pinching&&a.size<2){o.pinching=!1;const m=o.pinch;o.pinch=1,(g=n.onPinchEnd)==null||g.call(n,m);const F=Array.from(a.values())[0];F?R(F.x,F.y,b.timeStamp):c="none";return}a.size===0&&(o.active&&(o.active=!1,o.spin=b.timeStamp-x>ya?0:v),c="none")}};return l&&(l.addEventListener("pointerdown",D),l.addEventListener("pointermove",L),l.addEventListener("pointerup",I),l.addEventListener("pointercancel",I)),{get active(){return o.active},get hover(){return o.hover},get spin(){return o.spin},set spin(b){o.spin=b},get pinch(){return o.pinch},get pinching(){return o.pinching},dispose(){window.removeEventListener("pointerdown",u),window.removeEventListener("pointermove",f),window.removeEventListener("pointerup",r),window.removeEventListener("pointercancel",r),l&&(l.removeEventListener("pointerdown",D),l.removeEventListener("pointermove",L),l.removeEventListener("pointerup",I),l.removeEventListener("pointercancel",I)),(o.hover||o.active)&&(document.body.style.cursor="")}}}const xa=8,ba=700;function Ha(t,e,s,n){const o={hover:!1,down:null},i=new _,h=new _,u=new ye,f=new Je,r=new xo,l=new _,a=new to,c=()=>{if(!t.visible)return null;const R=s();if(R<=0)return null;h.copy(t.position).applyMatrix4(e.matrixWorldInverse);const D=-h.z;if(D<=.1)return null;i.copy(t.position).project(e);const L=window.innerHeight/2/(Math.tan(e.fov*Math.PI/360)*D);return{x:(i.x*.5+.5)*window.innerWidth,y:(-i.y*.5+.5)*window.innerHeight,r:R*L}},p=(R,D)=>{const L=c();return!!L&&Math.hypot(R-L.x,D-L.y)<L.r},d=(R,D)=>{if(!p(R,D)||(u.set(R/window.innerWidth*2-1,-(D/window.innerHeight)*2+1),f.setFromCamera(u,e),r.setFromNormalAndCoplanarPoint(e.getWorldDirection(h),t.position),!f.ray.intersectPlane(r,l)))return!1;t.worldToLocal(l);const L=h.clone().transformDirection(a.copy(t.matrixWorld).invert());return n(l.clone(),L),!0},v=R=>{p(R.clientX,R.clientY)&&(o.down={x:R.clientX,y:R.clientY,t:performance.now(),id:R.pointerId})},M=R=>{if(R.pointerType==="touch")return;const D=!o.down&&p(R.clientX,R.clientY);D!==o.hover&&(o.hover=D,D?document.body.style.cursor="pointer":document.body.style.cursor==="pointer"&&(document.body.style.cursor=""))},x=R=>{const D=o.down;!D||R.pointerId!==D.id||(o.down=null,!(Math.hypot(R.clientX-D.x,R.clientY-D.y)>xa||performance.now()-D.t>ba)&&d(R.clientX,R.clientY))},P=()=>{o.down=null};return window.addEventListener("pointerdown",v),window.addEventListener("pointermove",M),window.addEventListener("pointerup",x),window.addEventListener("pointercancel",P),{get hover(){return o.hover},at:d,onScreen:c,dispose(){window.removeEventListener("pointerdown",v),window.removeEventListener("pointermove",M),window.removeEventListener("pointerup",x),window.removeEventListener("pointercancel",P),o.hover&&document.body.style.cursor==="pointer"&&(document.body.style.cursor="")}}}function Ma(t,e){const s=e.stride;if(t.byteLength%s!==0)throw new Error(`umap: ${t.byteLength} bytes is not a multiple of ${s}`);const n=t.byteLength/s,o=new DataView(t),i=new Float32Array(n*3),h=new Float32Array(n),u=new Float32Array(n*3),f=new Float32Array(n);for(let r=0;r<n;r++){const l=r*s;i[r*3]=o.getInt16(l,!0)/32767,i[r*3+1]=o.getInt16(l+2,!0)/32767,i[r*3+2]=o.getInt16(l+4,!0)/32767,h[r]=o.getUint8(l+6),u[r*3]=o.getUint8(l+7)/255,u[r*3+1]=o.getUint8(l+8)/255,u[r*3+2]=o.getUint8(l+9)/255,f[r]=(r*2654435761>>>0)/4294967296}return{n,position:i,state:h,expr:u,seed:f}}async function Aa(t){const e=await fetch(`${t}umap/manifest.json`).then(n=>n.json()),s=await fetch(`${t}umap/cells.bin`).then(n=>n.arrayBuffer());return{manifest:e,cells:Ma(s,e)}}const Sa=600,Pa=12,Qe=.035,Ea=`
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
    float foc = (1.0 - smoothstep(0.0, 14.0, abs(dist - ${ut.toFixed(1)}))) * (1.0 - uDefocus);
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
`,Ta=`
  precision highp float;
  ${Dt}
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
`;function Oa(t,e){const s=new Rt,n=new st({vertexShader:Ea,fragmentShader:Ta,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uSize:t.uSize,uDpr:t.uDpr,uLens:t.uLens,uDefocus:t.uDefocus,uPointer:t.uPointer,uAlpha:t.uAlpha,uReveal:{value:0},uMode:{value:0},uPrevMode:{value:0},uWave:{value:10},uWaveOrigin:{value:new _},uFocusState:{value:-1},uHover:{value:new _(99,99,99)},uMaxPx:{value:9}}});let o=null,i=null,h=null,u=null,f=!1;const r={group:s,ready:!1,manifest:null,reveal:0,maxPx:9,spin:.12,hoverEnabled:!0,labelsEnabled:!0,labelFade:1,update:D,dispose(){f=!0,o==null||o.dispose(),n.dispose()}};Aa(e).then(({manifest:L,cells:I})=>{f||(o=new at,o.setAttribute("position",new N(I.position,3)),o.setAttribute("aState",new N(I.state,1)),o.setAttribute("aExpr",new N(I.expr,3)),o.setAttribute("aSeed",new N(I.seed,1)),o.boundingSphere=new ct(new _,1.8),s.add(new rt(o,n)),i=I.position,h=I.state,u=I.expr,r.manifest=L,r.ready=!0,G.count=L.n,G.ready=!0)}).catch(L=>console.warn("umap: data not loaded",L));const l=L=>Math.max(0,Pe.indexOf(L));let a=G.changedAt;const c=new _,p=new bo,d=new Je,v=new to,M=new _,x=new ye;let P=0,R=-1;function D(L,I,b,g,m){var H;const F=n.uniforms;F.uReveal.value=r.reveal,F.uMaxPx.value=r.maxPx,F.uMode.value=l(G.mode),F.uPrevMode.value=l(G.prevMode),F.uFocusState.value=G.focusState,m&&(s.rotation.y+=L*r.spin*I),G.changedAt!==a&&(a=G.changedAt,c.set(t.uPointer.value.x,t.uPointer.value.y,s.position.z),Math.abs(c.x)>90&&c.set(0,0,s.position.z),s.worldToLocal(c),c.clampLength(0,1.2),F.uWaveOrigin.value.copy(c));const E=(performance.now()-G.changedAt)/Sa;if(F.uWave.value=Ao.reducedMotion?10:Math.min(10,E*3.2),!r.ready||!i||!h||!u||!r.manifest)return;P+=L;const C=r.hoverEnabled&&g&&s.visible&&r.reveal>.5;if(C&&P>1/Pa){P=0,x.set(g.x,g.y),d.setFromCamera(x,b),v.copy(s.matrixWorld).invert(),p.copy(d.ray).applyMatrix4(v);const A=s.scale.x||1,S=Qe*8/Math.max(A,.01);let T=-1,y=Math.min(S,Qe*4),z=1/0;for(let w=0;w<i.length/3;w++){M.set(i[w*3],i[w*3+1],i[w*3+2]);const k=M.clone().sub(p.origin).dot(p.direction);if(k<0)continue;const B=p.distanceToPoint(M);(B<y||B<y*1.15&&k<z-.2)&&(T=w,y=B,z=k)}R=T}if(C||(R=-1),R>=0){F.uHover.value.set(i[R*3],i[R*3+1],i[R*3+2]);const A=(g.x+1)/2*window.innerWidth,S=(1-g.y)/2*window.innerHeight,T=((H=r.manifest.states[h[R]])==null?void 0:H.name)??"",y=G.mode,z=Pe.indexOf(y)-1,w=z<0?T:`${y} ${(u[R*3+z]*r.manifest.p99[z]).toFixed(2)}`;G.hover={text:w,x:A,y:S}}else F.uHover.value.set(99,99,99),G.hover&&(G.hover=null);if(r.labelsEnabled&&s.visible){const A=M.setFromMatrixPosition(b.matrixWorld).clone();G.labels=r.manifest.states.map(S=>{const T=new _(S.centroid[0],S.centroid[1],S.centroid[2]);s.localToWorld(T);const y=T.distanceTo(A),z=1-Math.min(1,Math.abs(y-ut)/14);T.project(b);const w=T.z>1;return{text:S.name,state:S.id,x:(T.x+1)/2*window.innerWidth,y:(1-T.y)/2*window.innerHeight,opacity:w?0:r.reveal*r.labelFade*(.15+.85*z)*(G.focusState<0||G.focusState===S.id?1:.35)}})}else G.labels.length&&(G.labels=[])}return r}export{Fa as C,Ca as E,So as L,It as P,Dt as S,Qo as a,za as b,_a as c,ka as d,Oa as e,La as f,Ha as g,Ba as h,Da as m};
