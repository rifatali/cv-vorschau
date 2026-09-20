import{V as _,B as tt,a as O,S as st,b as et,c as ct,P as at,G as yt,F as Y,D as Xe,R as qe,g as Ke,N as ae,h as De,i as Ye,j as Ze,M as Je}from"./three-BH243BCb.js";import{D as it,T as kt,a as oe,y as Qe,u as j,s as ta,U as ne}from"./index-CqcNKEJF.js";const Ht=new Set,se=new Map,Ut=new Set,ie={register(t){return Ut.add(t),()=>{Ut.delete(t)}},hasRig(t){return Ut.has(t)},emit(t){se.set(t.rig,t.time),Ht.forEach(e=>e(t))},subscribe(t){return Ht.add(t),()=>{Ht.delete(t)}},lastEvent(t){return se.get(t)??-1/0}},xt=`
  const vec3 GRAPHITE = vec3(0.24, 0.23, 0.23);
  const vec3 GRAPHITE_LIGHT = vec3(0.50, 0.48, 0.46);
  const vec3 GRAPHITE_DEEP = vec3(0.12, 0.11, 0.11);
  const vec3 AMBER = vec3(0.776, 0.486, 0.149);
`,At=`
  float stroke(vec2 uv, float seed, float sharp, float px) {
    float ang = seed * 6.2831853;
    float c = cos(ang), s = sin(ang);
    vec2 q = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);
    float elong = mix(1.0, 1.6, smoothstep(2.5, 5.0, px));
    float r = length(q * vec2(1.0, elong));
    float soft = mix(0.08, 0.34, sharp);
    return smoothstep(0.5, soft, r);
  }
`,Re=`
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
`,ea=new _(-.5,.75,.45).normalize();function ko(){return{uDefocus:{value:0},uLight:{value:ea.clone()}}}const aa=`
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
    float persp = ${it.toFixed(1)} / max(dist, 1.0);
    gl_PointSize = clamp(uPx * uDpr * persp * (0.7 + 0.6 * fract(aSeed * 7.31)), 1.0, 96.0 * uDpr);
    vA = 1.0 - smoothstep(0.55, 1.0, length(position.xy));
    vSeed = aSeed;
  }
`,oa=`
  precision highp float;
  ${xt}
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
`,Ot=20,re={x:.16,y:-.22},na=.011;function Ho(t,e=1){let n=e*7919+13;const s=()=>(n=n*1664525+1013904223>>>0,n/4294967296),a=()=>Math.sqrt(-2*Math.log(1-s()))*Math.cos(2*Math.PI*s()),r=new Float32Array(Ot*3),h=new Float32Array(Ot);for(let i=0;i<Ot;i++)r[i*3]=a()*.5,r[i*3+1]=a()*.5,r[i*3+2]=0,h[i]=s();const c=new tt;c.setAttribute("position",new O(r,3)),c.setAttribute("aSeed",new O(h,1)),c.boundingSphere=new st(new _,30);const u=new et({vertexShader:aa,fragmentShader:oa,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uDpr:t.uDpr,uAlpha:t.uAlpha,uRadius:{value:new ct(1,1)},uPx:{value:40},uStrength:{value:0}}}),o=new at(c,u);return o.frustumCulled=!1,o.renderOrder=-1,{points:o,place(i,l,p,g=60){o.position.set(i.x+l*re.x,i.y+p*re.y,i.z),u.uniforms.uRadius.value.set(l,p),u.uniforms.uPx.value=Math.max(l,p)*g*.9},update(i){u.uniforms.uStrength.value=na*Math.max(0,Math.min(1,i)),o.visible=i>.01},dispose(){c.dispose(),u.dispose()}}}const ft=3.3,Le=1.3,Uo={radius:ft,halfHeight:4.2},sa=.36,Lt=12,St=t=>.78+.42*Math.pow(t/.95,2),Gt=t=>.22+.3*Math.pow(t/.95,2),ia=[.5,.17,-.17,-.5],ra=`
  attribute float aSeed;
  attribute float aKind;     // 0 membrane head, 1 tail dot, 2 outer wall, 3 pore wall
  attribute vec3 aNormal;    // the surface normal, object space
  uniform float uTime;
  uniform float uDpr;
  uniform float uLens;
  uniform float uDefocus;
  uniform vec3 uLight;
  uniform vec2 uPointer;
  uniform vec3 uIons[${Lt}];
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
    for (int i = 0; i < ${Lt}; i++) {
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
    float foc = (1.0 - smoothstep(0.0, 18.0, abs(dist - ${it.toFixed(1)}))) * (1.0 - uDefocus);
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
`,la=`
  precision highp float;
  ${xt}
  ${At}
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
`,ca=`
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
`,ua=`
  precision highp float;
  ${Re}
  uniform float uAlpha;
  varying float vA;
  void main() {
    vec3 col;
    float edge = sphere(gl_PointCoord, col);
    float a = edge * vA * uAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(col, min(1.0, a));
  }
`;function vt(t,e,n,s,a,r,h,c){const u=Math.hypot(r,h,c)||1;t.pos.push(e,n,s),t.seed.push(Math.random()),t.kind.push(a),t.normal.push(r/u,h/u,c/u)}function ha(t,e=Le){const a=Math.ceil(ft/.20351),r=Math.ceil(ft/.235);for(let h=-a;h<=a;h++)for(let c=-r;c<=r;c++){const u=c*.235+(h%2?.1175:0)+(Math.random()-.5)*.05,o=h*.20351+(Math.random()-.5)*.05,i=Math.hypot(u,o);if(i>ft||i<e)continue;const l=ft*.78;if(!(i>l&&Math.random()<(i-l)/(ft-l)))for(const p of[1,-1]){const g=p*sa+(Math.random()-.5)*.03;vt(t,u,g,o,0,0,p,0);for(let w=1;w<=4;w++){const T=w/4.6;vt(t,u+(Math.random()-.5)*.05,g-p*(.07+.26*T),o+(Math.random()-.5)*.05,1,0,p,0)}}}}function fa(t){const e=7*Math.PI/180,n=Math.PI/2,s=110;for(let a=0;a<=s;a++){const r=-.95+1.9*a/s,h=St(r),c=(St(r+.01)-St(r-.01))/.02,u=Math.round(2*Math.PI*h/.036);for(let l=0;l<u;l++){const p=l/u*Math.PI*2+a%2*(Math.PI/u);if((p%n+n)%n<e||(p%n+n)%n>n-e)continue;const w=.02,T=Math.cos(p),S=Math.sin(p);vt(t,T*h+(Math.random()-.5)*w,r+(Math.random()-.5)*w,S*h+(Math.random()-.5)*w,2,T,-c,S)}const o=Gt(r),i=Math.round(2*Math.PI*o/.042);for(let l=0;l<i;l++){const p=l/i*Math.PI*2+a%2*(Math.PI/i),g=Math.cos(p),w=Math.sin(p);vt(t,g*o,r,w*o,3,-g,.2,-w)}}for(const a of[-.95,.95])for(let r=0;r<8;r++){const h=r/7,c=Gt(a)+(St(a)-Gt(a))*h,u=Math.round(2*Math.PI*c/.042);for(let o=0;o<u;o++){const i=o/u*Math.PI*2,l=(i%n+n)%n;l<e||l>n-e||vt(t,Math.cos(i)*c,a,Math.sin(i)*c,2,0,a>0?1:-1,0)}}}const le=10,ht=8,ce=3.9,pa=-4;function Oo(t,e="research",n={}){const s=n.channel!==!1,a=s?ie.register(e):()=>{},r=new yt,h=[],c={pos:[],seed:[],kind:[],normal:[]};ha(c,s?Le:0),s&&fa(c);const u=new tt;u.setAttribute("position",new Y(c.pos,3)),u.setAttribute("aSeed",new Y(c.seed,1)),u.setAttribute("aKind",new Y(c.kind,1)),u.setAttribute("aNormal",new Y(c.normal,3)),u.boundingSphere=new st(new _,12);const o=Array.from({length:Lt},()=>new _(0,99,0)),i=new et({vertexShader:ra,fragmentShader:la,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uTime:{value:0},uDpr:t.uDpr,uLens:t.uLens,uDefocus:t.uDefocus,uLight:t.uLight,uPointer:t.uPointer,uAlpha:{value:1},uIons:{value:o},uIonCount:{value:0}}});r.add(new at(u,i)),h.push(u,i);const l=le*(1+ht),p=new Float32Array(l*3),g=new Float32Array(l),w=new Float32Array(l),T=new tt;T.setAttribute("position",new O(p,3)),T.setAttribute("aSize",new O(g,1)),T.setAttribute("aAlpha",new O(w,1)),T.boundingSphere=new st(new _,20);const S=new et({vertexShader:ca,fragmentShader:ua,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uDpr:t.uDpr,uAlpha:{value:1},uBoost:{value:1}}}),A=new at(T,S);A.visible=s,r.add(A),h.push(T,S);const P=[],E=(b,x)=>{b.y=ce,b.angle=Math.random()*Math.PI*2,b.radius=.9+Math.random()*.5,b.delay=x,b.dwell=.55+Math.random()*.35,b.gap=.28+Math.random()*.17,b.trail=[]};for(let b=0;b<le;b++){const x={y:ce,angle:0,radius:0,delay:0,dwell:.78,gap:.34,trail:[]};E(x,b*.7),P.push(x)}let F=0;const B=(b,x)=>{if(Math.abs(b)>.95)return 1.15;let D=.62;for(const M of ia)D*=1-x*Math.exp(-Math.pow((b-M)/.07,2));return D},y={group:r,ionBoost:1,update:(b,x,D,M=D)=>{if(i.uniforms.uTime.value+=b*x,i.uniforms.uAlpha.value=.05+.95*D,S.uniforms.uAlpha.value=.1+.9*Math.max(D,M),S.uniforms.uBoost.value=y.ionBoost,!s)return;F+=b;const C=F>.04;C&&(F=0);const k=P.map((d,m)=>m).sort((d,m)=>P[d].y-P[m].y);k.forEach((d,m)=>{const v=P[d];if(v.delay>0){v.delay-=b*x;return}let z=b*B(v.y,v.dwell)*x;if(m>0){const U=P[k[m-1]],G=v.y-U.y,V=Math.abs(v.y)<1.4?v.gap:.55;G-z<V&&(z=Math.max(0,G-V))}const I=v.y;v.y-=z,I>0&&v.y<=0&&ie.emit({time:performance.now(),rig:e,ion:d}),v.angle+=b*(1.1+.3*Math.sin(d))*x;const H=Math.abs(v.y)<1?0:Math.min(1.4,(Math.abs(v.y)-1)*.55+.05);v.radius+=(H-v.radius)*Math.min(1,b*5),v.y<pa&&E(v,.4+Math.random()*1.2)});let f=0;P.forEach((d,m)=>{const v=d.delay<=0,z=Math.cos(d.angle)*d.radius,I=Math.sin(d.angle)*d.radius;C&&v&&(d.trail.unshift(z,d.y,I),d.trail.length>ht*3&&(d.trail.length=ht*3)),v&&Math.abs(d.y)<1.5&&f<Lt&&o[f++].set(z,d.y,I);const H=v?Math.max(0,Math.min(1,(4.2-Math.abs(d.y))/.9)):0,U=Math.abs(d.y)<.95?1:0,G=m*(1+ht);p[G*3]=z,p[G*3+1]=d.y,p[G*3+2]=I,g[G]=9.5+U*2.5,w[G]=H;for(let V=0;V<ht;V++){const R=G+1+V,$=V*3,W=d.trail.length>$+2;p[R*3]=W?d.trail[$]:z,p[R*3+1]=W?d.trail[$+1]:d.y,p[R*3+2]=W?d.trail[$+2]:I;const Z=1-(V+1)/(ht+1);g[R]=1.6+4.6*Z,w[R]=W?H*Z*.32:0}}),i.uniforms.uIonCount.value=f,T.attributes.position.needsUpdate=!0,T.attributes.aSize.needsUpdate=!0,T.attributes.aAlpha.needsUpdate=!0},dispose:()=>{a(),h.forEach(b=>b.dispose())}};return y}const da=.45,ma=.2,Pt=18,ue=36,va=.9,ga=4,$t=.35,Tt=.3,wa=1.5,ya=.8,xa=.6,Aa=.7,ba=.3;function Ma(t){return()=>{t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function he(t,e={}){const n=t.branches.length,s=Ma(e.seed??1),a=e.motility??1,r=e.tempo??1,h=va*(e.reach??1),c=new Float32Array(n),u=new Float32Array(n),o=new Float32Array(n),i=new Float32Array(n),l=new Float32Array(n),p=new Float32Array(n*3);t.branches.forEach((F,B)=>{c[B]=F.isTip?da:F.depth===4?ma:0,u[B]=2*Math.PI/(Pt+s()*(ue-Pt)),o[B]=2*Math.PI/(Pt+s()*(ue-Pt)),i[B]=s()*Math.PI*2,l[B]=s()*Math.PI*2;const L=F.points.length-3;p[B*3]=F.points[L],p[B*3+1]=F.points[L+1],p[B*3+2]=F.points[L+2]});const g=new Float32Array(n).fill(1),w=new Float32Array(n*3),T=new Uint8Array(n),S=[];let A=0;const P={ext:g,disp:w,somaScale:1,thickness:1,update:E};function E({dt:F,motion:B,pointer:L,activation:y}){if(B<=0||F<=0)return;if(A+=F*B*r,T.fill(0),L){S.length=0;for(let x=0;x<n;x++){if(!t.branches[x].isTip)continue;const D=Math.hypot(L[0]-p[x*3],L[1]-p[x*3+1],L[2]-p[x*3+2]);D<h&&S.push({i:x,d:D})}S.sort((x,D)=>x.d-D.d);for(let x=0;x<Math.min(ga,S.length);x++)T[S[x].i]=1}const b=Math.max(0,Math.min(1,y));for(let x=0;x<n;x++){const D=t.branches[x],M=.6*Math.sin(u[x]*A+i[x])+.4*Math.sin(o[x]*A+l[x]);let C=T[x]?1:1-c[x]*a*(.5+.5*M);D.depth>=2&&(C*=1-xa*b);const k=T[x]?wa:ya,f=1-Math.exp(-k*F*B);g[x]+=(C-g[x])*f,g[x]<0&&(g[x]=0),g[x]>1&&(g[x]=1);let d=0,m=0,v=0;if(T[x]&&L){d=(L[0]-p[x*3])*$t,m=(L[1]-p[x*3+1])*$t,v=(L[2]-p[x*3+2])*$t;const z=Math.hypot(d,m,v);z>Tt&&(d*=Tt/z,m*=Tt/z,v*=Tt/z)}w[x*3]+=(d-w[x*3])*f,w[x*3+1]+=(m-w[x*3+1])*f,w[x*3+2]+=(v-w[x*3+2])*f}P.somaScale=1+Aa*b,P.thickness=1+ba*b}return P}const Fe=1.2,Ft=.6,Ie=.12,_e=.36,It=.55,_t=4,fe=2.5,Sa=6.5,pe=10,Pa=8,Ta=3,ze=4,Ea=.16,Da=.03,Vt=320,Ra=40;function Ce(t){const e=t.branches,n=e.length,s=new Float32Array(n).fill(-1),a=new Float32Array(n),r=new Int32Array(n),h=u=>{if(s[u]>=0)return s[u];const o=e[u];return o.parent<0?(s[u]=Math.hypot(o.points[0],o.points[1],o.points[2]),r[u]=u):(s[u]=h(o.parent)+e[o.parent].length,r[u]=r[o.parent]),s[u]};let c=0;for(let u=0;u<n;u++)a[u]=h(u)+e[u].length,a[u]>c&&(c=a[u]);return{rootDist:s,endDist:a,root:r,maxDist:c}}function La(t,e){let n=-1,s=1/0;for(const a of t.branches){if(!a.isTip)continue;const r=a.points.length-3,h=Math.hypot(e[0]-a.points[r],e[1]-a.points[r+1],e[2]-a.points[r+2]);h<s&&(s=h,n=a.id)}return n}function Fa(t,e,n){const s=t.branches,a=s.length,r=new Uint8Array(a);for(let l=n;l>=0;l=s[l].parent)r[l]=1;const h=e.root[n],c=s[h].points,u=[c[0],c[1],c[2]],o=e.rootDist[h],i=new Float32Array(a);for(let l=0;l<a;l++){if(e.root[l]!==h){const g=s[e.root[l]].points,w=Math.hypot(g[0]-u[0],g[1]-u[1],g[2]-u[2]);i[l]=(o+e.rootDist[e.root[l]]-w)/2;continue}let p=l;for(;!r[p];)p=s[p].parent;i[l]=e.endDist[p]}return{tip:n,tipDist:e.endDist[n],junction:i,entry:u,entryDist:o}}const Ia=(t,e,n)=>Math.abs(n-t.junction[e])+(t.tipDist-t.junction[e]),Be=t=>{const e=t<0?0:t>1?1:t;return e*e*(3-2*e)};function de(t,e,n=!1){if(e<0)return 0;if(n)return It*Math.exp(-e/_t);const s=e-Fe;if(s<=0)return 0;const a=t-Ft*s,r=a>0?1-Be(a/Ie):Math.exp(a/_e),h=a<0?It*Math.exp(a/(Ft*_t)):0;return Math.min(1,h+(1-h)*r)}function _a(t,e=!1){return t<0?0:t>=pe?Math.exp(-(t-pe)/Pa):e?1:Be((t-fe)/(Sa-fe))}function zt(t){return()=>{t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}const me=t=>t.toFixed(3),za=`
  attribute float aSeed;
  uniform float uT;            // seconds since the puff, < 0 none
  uniform vec3 uOrigin;
  uniform vec3 uDrift;
  uniform float uDpr;
  uniform float uReveal;
  varying float vA;
  void main() {
    float t = max(uT, 0.0);
    // Diffusion: each point is one draw of a Gaussian whose width grows with the square root of time.
    vec3 p = uOrigin + position * (${me(Ea)} * sqrt(t)) + uDrift * t;
    p += vec3(sin(t * 3.1 + aSeed * 40.0), cos(t * 2.7 + aSeed * 30.0), sin(t * 2.3 + aSeed * 20.0)) * 0.012 * sqrt(t);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    float foc = 1.0 - smoothstep(0.0, 18.0, abs(dist - ${it.toFixed(1)}));
    float persp = 300.0 / max(dist, 1.0);
    gl_PointSize = clamp((1.3 + 1.4 * fract(aSeed * 7.31)) * uDpr * persp * 0.045 * (1.0 + (1.0 - foc) * 1.2), 0.75, 6.0 * uDpr);
    float fade = smoothstep(0.0, 0.12, t) * (1.0 - smoothstep(1.2, ${me(ze)}, t));
    vA = fade * (0.45 + 0.4 * fract(aSeed * 3.3)) * (0.04 + 0.96 * foc) * uReveal;
  }
`,Ca=`
  precision highp float;
  uniform float uAlpha;
  varying float vA;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.2, r) * vA * uAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(0.776, 0.486, 0.149, a);
  }
`;function Ba(t,e=1){const n=zt(e*17+3),s=()=>Math.sqrt(-2*Math.log(1-n()))*Math.cos(2*Math.PI*n()),a=new Float32Array(Vt*3),r=new Float32Array(Vt);for(let l=0;l<Vt;l++)a[l*3]=s(),a[l*3+1]=s(),a[l*3+2]=s(),r[l]=n();const h=new tt;h.setAttribute("position",new O(a,3)),h.setAttribute("aSeed",new O(r,1));const c=new et({vertexShader:za,fragmentShader:Ca,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uT:{value:-1},uOrigin:{value:new _},uDrift:{value:new _},uDpr:t.uDpr,uAlpha:t.uAlpha,uReveal:{value:1}}}),u=new at(h,c);u.frustumCulled=!1,u.visible=!1;const o=zt(e*5+11);let i=-1;return{points:u,get t(){return i},start(l){i=0,c.uniforms.uOrigin.value.set(l.x,l.y,l.z),c.uniforms.uDrift.value.set(o()-.5,o()-.5,o()-.5).normalize().multiplyScalar(Da)},update(l,p,g){i>=0&&(i+=l*p,i>ze&&(i=-1)),c.uniforms.uT.value=i,c.uniforms.uReveal.value=g,u.visible=i>=0},dispose(){h.dispose(),c.dispose()}}}const Kt=.12,ke=2e4,ve=12;function ka(t,e=ke,n=1){const s=zt(n),a=Math.round(e*Kt),r=e-a,h=t.branches.map(M=>M.length*(M.radius0+M.radius1)*.5),c=h.reduce((M,C)=>M+C,0),u=Ce(t),o=new Float32Array(e*3),i=new Float32Array(e),l=new Float32Array(e),p=new Float32Array(e),g=new Float32Array(e),w=new Float32Array(e),T=new Float32Array(e*3),S=new Float32Array(e);let A=0;for(;A<a;A++){const M=s()*2-1,C=s()*Math.PI*2,k=Math.sqrt(1-M*M),f=s(),d=t.soma*(.85+.3*f);o[A*3]=k*Math.cos(C)*d,o[A*3+1]=M*d,o[A*3+2]=k*Math.sin(C)*d,T[A*3]=k*Math.cos(C),T[A*3+1]=M,T[A*3+2]=k*Math.sin(C),S[A]=f,i[A]=-1,l[A]=0,p[A]=s(),g[A]=1,w[A]=0}const P=h.map(M=>r*M/c),E=P.map(Math.floor);let F=r-E.reduce((M,C)=>M+C,0);const B=P.map((M,C)=>({k:C,frac:M-Math.floor(M)})).sort((M,C)=>C.frac-M.frac);for(let M=0;F>0&&M<B.length;M++,F--)E[B[M].k]++;const L=new _,y=new _,b=new _,x=new _(0,1,0),D=new _;return t.branches.forEach((M,C)=>{const k=M.points.length/3;for(let f=0;f<E[C];f++,A++){const d=s(),m=d*M.length;let v=0;for(;v<k-2&&M.cum[v+1]<m;)v++;const z=M.cum[v+1]-M.cum[v],I=z>0?(m-M.cum[v])/z:0,H=M.points[v*3],U=M.points[v*3+1],G=M.points[v*3+2],V=M.points[v*3+3],R=M.points[v*3+4],$=M.points[v*3+5];D.set(H+(V-H)*I,U+(R-U)*I,G+($-G)*I),L.set(V-H,R-U,$-G).normalize(),L.lengthSq()===0&&L.set(0,1,0),y.crossVectors(L,Math.abs(L.y)>.9?new _(1,0,0):x).normalize(),b.crossVectors(L,y);const W=(M.radius0+(M.radius1-M.radius0)*d)*(.85+.3*s()),Z=s()*Math.PI*2,bt=Math.cos(Z),Mt=Math.sin(Z);D.addScaledVector(y,bt*W).addScaledVector(b,Mt*W),o[A*3]=D.x,o[A*3+1]=D.y,o[A*3+2]=D.z,T[A*3]=y.x*bt+b.x*Mt,T[A*3+1]=y.y*bt+b.y*Mt,T[A*3+2]=y.z*bt+b.z*Mt,i[A]=C,l[A]=d,p[A]=s(),g[A]=0,w[A]=u.rootDist[C]+d*M.length}}),{position:o,aBranch:i,aT:l,aSeed:p,aSoma:g,aDist:w,aNormal:T,aShell:S,count:e}}const Yt=3,Nt=[0,1,2].map(t=>((t+.5)/Yt).toFixed(4)),ot=t=>t.toFixed(3),Ha=`
  attribute float aSeed;
  attribute float aBranch;
  attribute float aT;
  attribute float aSoma;
  attribute float aDist;         // arc distance from the soma along the skeleton
  attribute vec3 aNormal;        // the surface normal, cell space
  attribute float aShell;        // soma: 0 deep inside, 1 on the skin
  uniform sampler2D uBranch;     // row 0 per branch: ext, disp.xyz; rows 1 and 2: the junction distance of each stimulus
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
  // A drop of ATP: up to two stimuli, each a calcium wave running along the skeleton from a tip (lib/calcium.ts).
  uniform vec2 uStimT;         // seconds since each stimulus, < 0 none
  uniform vec2 uStimInstant;   // 1: reduced motion, the plateau at once
  uniform vec2 uTipDist;       // arc distance of the stimulated tip
  uniform vec2 uEntryDist;     // arc distance where the stimulated process leaves the soma ...
  uniform vec3 uEntryA;        // ... and that point, per stimulus
  uniform vec3 uEntryB;
  varying float vAlpha;
  varying float vSeed;
  varying float vFoc;
  varying float vLens;
  varying float vCa;
  varying float vPx;
  varying float vSoma;
  varying float vLit;

  // Calcium at a point the wave reaches after travelling d: a narrow front on a plateau that decays.
  float calcium(float t, float d, float instant) {
    if (t < 0.0) return 0.0;
    if (instant > 0.5) return ${ot(It)} * exp(-t / ${ot(_t)});
    float tw = t - ${ot(Fe)};
    if (tw <= 0.0) return 0.0;
    float x = d - ${ot(Ft)} * tw;
    float band = x > 0.0 ? 1.0 - smoothstep(0.0, ${ot(Ie)}, x) : exp(x / ${ot(_e)});
    float plateau = x < 0.0 ? ${ot(It)} * exp(x / ${ot(Ft*_t)}) : 0.0;
    return clamp(plateau + (1.0 - plateau) * band, 0.0, 1.0);
  }

  void main() {
    vec3 pos = position;
    float hidden = 0.0;
    if (aSoma < 0.5) {
      vec4 st = texture2D(uBranch, vec2((aBranch + 0.5) / uBranchCount, ${Nt[0]}));
      if (aT > st.r) hidden = 1.0;          // beyond where the process reaches right now
      pos += st.gba * aT * aT;               // the tip is pulled, the root stays
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
    } else {
      pos *= uSomaScale;
    }
    // The calcium wave: how far it has to travel to this point, per stimulus.
    float dA;
    float dB;
    if (aSoma < 0.5) {
      float jA = texture2D(uBranch, vec2((aBranch + 0.5) / uBranchCount, ${Nt[1]})).r;
      float jB = texture2D(uBranch, vec2((aBranch + 0.5) / uBranchCount, ${Nt[2]})).r;
      dA = abs(aDist - jA) + (uTipDist.x - jA);
      dB = abs(aDist - jB) + (uTipDist.y - jB);
    } else {
      dA = uTipDist.x - uEntryDist.x + distance(position, uEntryA);
      dB = uTipDist.y - uEntryDist.y + distance(position, uEntryB);
    }
    vCa = max(calcium(uStimT.x, dA, uStimInstant.x), calcium(uStimT.y, dB, uStimInstant.y));
    vec4 wp = modelMatrix * vec4(pos, 1.0);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    float foc = (1.0 - smoothstep(0.0, 18.0, abs(dist - ${it.toFixed(1)}))) * (1.0 - uDefocus * uDefocusShare);
    float lens = smoothstep(4.4, 0.0, length(wp.xy - uPointer)) * uLens;
    float persp = 300.0 / max(dist, 1.0);
    float sz = (0.6 + 0.8 * fract(aSeed * 7.31)) * uThickness;
    float reaching = abs(aBranch - uPhagoBranch) < 0.5 ? uReach : 0.0;
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
`,Ua=`
  precision highp float;
  ${xt}
  ${At}
  varying float vAlpha;
  varying float vSeed;
  varying float vFoc;
  varying float vLens;
  varying float vCa;
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
    // Calcium: the same points in amber. The hue changes, nothing else.
    col = mix(col, AMBER, vCa);
    gl_FragColor = vec4(col, a);
  }
`,Oa=`
  uniform vec3 uPos;
  uniform float uScale;
  uniform float uDpr;
  void main() {
    vec4 mv = modelViewMatrix * vec4(uPos, 1.0);
    gl_Position = projectionMatrix * mv;
    float persp = 300.0 / max(-mv.z, 1.0);
    gl_PointSize = clamp(uDpr * persp * 0.6 * uScale, 3.0, 32.0 * uDpr);
  }
`,Ga=`
  precision highp float;
  ${Re}
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
`,q={appear:.7,reach:1.6,cup:1.1,close:.9,retract:1,digest:.8},mt=.17,$a=.1,Va=1.5,ge=6,Na=9,Wa=.45,nt=t=>{const e=Math.max(0,Math.min(1,t));return e*e*(3-2*e)},ja=t=>1-Math.pow(1-Math.max(0,Math.min(1,t)),3);function Xa(t,e){var k;const n=zt(e),s=f=>new _(f.points[f.points.length-3],f.points[f.points.length-2],f.points[f.points.length-1]),a=t.branches.filter(f=>f.isTip).map(f=>({b:f,d:s(f).length()})).sort((f,d)=>d.d-f.d),r=a.slice(0,Math.max(6,Math.round(a.length*.5))).map(f=>f.b),h=((k=[...r].sort((f,d)=>f.length-d.length)[Math.floor(r.length/2)])==null?void 0:k.length)??0,c=r.filter(f=>f.length>=h);c.length<3&&c.push(...r.slice(0,3));let u=-1;const o={branch:-1,reach:0,disp:new _,cup:0,wrap:0,cupRadius:mt,target:new _,axis:new _(0,0,1),u:new _(1,0,0),v:new _(0,1,0),particle:new _,particleAlpha:0,particleScale:1,phagosome:new _,bulge:0,somaBump:0};let i="rest",l=0,p=Va,g=0;const w=new _,T=new _,S=new _;let A=new Float32Array(0),P=new Float32Array(0),E=0;const F=new _,B=new _;function L(f){const d=[];let m=f,v=0;for(;m&&v++<64;){for(let I=m.points.length-3;I>=0;I-=3){const H=m.points[I],U=m.points[I+1],G=m.points[I+2],V=d.length;V&&d[V-3]===H&&d[V-2]===U&&d[V-1]===G||d.push(H,U,G)}m=m.parent>=0&&m.parent!==m.id?t.branches[m.parent]:void 0}d.push(0,0,0),A=Float32Array.from(d);const z=A.length/3;P=new Float32Array(z);for(let I=1;I<z;I++)P[I]=P[I-1]+Math.hypot(A[I*3]-A[I*3-3],A[I*3+1]-A[I*3-2],A[I*3+2]-A[I*3-1]);E=P[z-1]}function y(f,d){const m=A.length/3;if(m===0)return d.set(0,0,0);if(f<=0)return d.set(A[0],A[1],A[2]);if(f>=E)return d.set(0,0,0);let v=1;for(;v<m-1&&P[v]<f;)v++;const z=(f-P[v-1])/Math.max(1e-6,P[v]-P[v-1]);return d.set(A[v*3-3]+(A[v*3]-A[v*3-3])*z,A[v*3-2]+(A[v*3+1]-A[v*3-2])*z,A[v*3-1]+(A[v*3+2]-A[v*3-1])*z)}const b=a.map(f=>s(f.b));function x(f,d){let m=1/0;for(let v=0;v<a.length;v++)a[v].b.id!==f.id&&(m=Math.min(m,b[v].distanceTo(d)));return m}function D(){let f=c[0],d=-1;for(let H=0;H<4;H++){const U=c[Math.floor(n()*c.length)];if(U.id===u&&c.length>1)continue;const G=s(U),V=F.set(G.x-U.points[0],G.y-U.points[1],G.z-U.points[2]).normalize(),R=B.copy(G).addScaledVector(V,.35),$=x(U,R);$>d&&(d=$,f=U)}u=f.id,w.copy(s(f));const m=F.set(w.x-f.points[0],w.y-f.points[1],w.z-f.points[2]).normalize();m.lengthSq()===0&&m.copy(w).normalize();const v=B.set(n()-.5,n()-.5,n()-.5).cross(m).normalize(),z=Math.min(.55,Math.max(.3,f.length*.9));T.copy(w).addScaledVector(m,z).addScaledVector(v,z*.35*(n()-.5)*2);const I=F.subVectors(T,w).normalize();o.axis.copy(I).negate(),S.copy(T).addScaledVector(I,-.17).sub(w),o.u.set(0,1,0),Math.abs(o.axis.y)>.9&&o.u.set(1,0,0),o.u.cross(o.axis).normalize(),o.v.crossVectors(o.axis,o.u).normalize(),o.branch=f.id,L(f),i="appear",l=0}function M(){o.branch=-1,o.reach=0,o.cup=0,o.wrap=0,o.cupRadius=mt,o.particleAlpha=0,o.particleScale=1,o.bulge=0,o.somaBump=0,i="rest",l=0,p=ge+n()*(Na-ge)}function C(f){if(f<=0)return;g+=f,l+=f;const d=m=>o.particle.copy(T).add(F.set(Math.sin(g*7.1)*m,Math.cos(g*5.3)*m,Math.sin(g*6.2+1.3)*m));switch(i){case"rest":l>=p&&D();break;case"appear":{o.particleAlpha=nt(l/q.appear),d(.014),l>=q.appear&&(i="reach",l=0);break}case"reach":{const m=nt(l/q.reach);o.reach=m,o.disp.copy(S).multiplyScalar(m),d(.014*(1-m)),o.particleAlpha=1,l>=q.reach&&(i="cup",l=0,o.target.copy(o.particle));break}case"cup":{o.reach=1,o.disp.copy(S),o.cup=ja(l/q.cup),o.wrap=.3*o.cup,o.particle.copy(o.target),l>=q.cup&&(i="close",l=0);break}case"close":{const m=nt(l/q.close);o.cup=1,o.wrap=.3+.7*m,o.cupRadius=mt+($a-mt)*m,o.particleScale=1-.3*m,l>=q.close&&(i="retract",l=0);break}case"retract":{const m=nt(l/q.retract);o.reach=1-m,o.disp.copy(S).multiplyScalar(o.reach),o.target.copy(w).add(o.disp).addScaledVector(o.axis,-.1*(1-m)),o.particle.copy(o.target),l>=q.retract&&(i="transport",l=0);break}case"transport":{const m=l*Wa;o.reach=0,o.cup=1-nt(l/.5),o.wrap=1,y(m,o.particle),o.target.copy(o.particle),o.phagosome.copy(o.particle),o.bulge=nt(l/.4),m>=E&&(i="digest",l=0);break}case"digest":{const m=l/q.digest;o.cup=0,o.particle.set(0,0,0),o.phagosome.set(0,0,0),o.particleAlpha=1-nt(m),o.bulge=1-nt(m),o.somaBump=Math.sin(Math.PI*Math.min(1,m)),l>=q.digest&&M();break}}}return{out:o,step:C,feed(){i==="rest"&&(p=0)}}}function Go(t,e,n={}){const s=ka(e,n.count??ke,n.seed??1),a=new tt;a.setAttribute("position",new O(s.position,3)),a.setAttribute("aBranch",new O(s.aBranch,1)),a.setAttribute("aT",new O(s.aT,1)),a.setAttribute("aSeed",new O(s.aSeed,1)),a.setAttribute("aSoma",new O(s.aSoma,1)),a.setAttribute("aDist",new O(s.aDist,1)),a.setAttribute("aNormal",new O(s.aNormal,3)),a.setAttribute("aShell",new O(s.aShell,1)),a.boundingSphere=new st(new _,e.bound*1.5);const r=e.branches.length,h=new Float32Array(r*4*Yt);for(let f=0;f<r;f++)h[f*4]=1;const c=new Xe(h,r,Yt,qe,Ke);c.magFilter=ae,c.minFilter=ae,c.needsUpdate=!0;const u=new et({vertexShader:Ha,fragmentShader:Ua,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uSize:t.uSize,uDpr:t.uDpr,uMaxPx:{value:ve},uLens:t.uLens,uPointer:t.uPointer,uAlpha:t.uAlpha,uBranch:{value:c},uBranchCount:{value:r},uSomaScale:{value:1},uThickness:{value:1},uReveal:{value:1},uDraw:{value:1},uDefocus:t.uDefocus,uDefocusShare:{value:1},uLight:t.uLight,uPhagoBranch:{value:-1},uTarget:{value:new _},uCupAxis:{value:new _(0,0,1)},uCupU:{value:new _(1,0,0)},uCupV:{value:new _(0,1,0)},uCup:{value:0},uCupRadius:{value:mt},uCupWrap:{value:0},uPhagoPos:{value:new _},uBulge:{value:0},uReach:{value:0},uStimT:{value:new ct(-1,-1)},uStimInstant:{value:new ct(0,0)},uTipDist:{value:new ct(0,0)},uEntryDist:{value:new ct(0,0)},uEntryA:{value:new _},uEntryB:{value:new _}}}),o=new yt;o.add(new at(a,u)),o.scale.setScalar(n.scale??1);const i=n.phagocytosis?Xa(e,(n.seed??1)*31+7):null;let l=null,p=null;if(i){const f=new tt;f.setAttribute("position",new O(new Float32Array(3),3)),f.boundingSphere=new st(new _,e.bound*2),p=new et({vertexShader:Oa,fragmentShader:Ga,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uPos:{value:new _},uScale:{value:1},uDpr:t.uDpr,uAlpha:{value:0},uCellAlpha:t.uAlpha,uReveal:{value:1}}}),l=new at(f,p),l.visible=!1,o.add(l)}const g=!!n.atp,w=Ce(e),T=w.maxDist*1.02;let S=null;g&&(S=Ba(t,n.seed??1),o.add(S.points));const A=[{t:-1,instant:!1,s:null},{t:-1,instant:!1,s:null}];let P=0;const E=[0,0,0];let F=0,B=0;const L=e.branches.map(f=>f.length*(f.radius0+f.radius1)*.5),y=L.reduce((f,d)=>f+d,0),b=[.17,.5,.83],x=()=>{let f=0;for(const d of A){if(d.t<0||!d.s)continue;let m=0;for(let v=0;v<r;v++){const z=e.branches[v];let I=0;for(const H of b)I+=de(Ia(d.s,v,w.rootDist[v]+H*z.length),d.t,d.instant);m+=I/b.length*(L[v]/y)*(1-Kt)}m+=Kt*de(d.s.tipDist-d.s.entryDist+e.soma,d.t,d.instant),f=Math.max(f,m)}return f};let D=he(e,n);const M=n.surveillance??!1,C=new _,k={group:o,reveal:1,draw:1,maxPx:ve,defocusShare:1,magnify:1,hunger:1,calcium:0,get motility(){return D},setMotility(f){D=he(e,{...n,...f})},update(f,d,m,v){let z=null;M&&m&&(C.set(m.x,m.y,o.position.z),o.worldToLocal(C),z=[C.x,C.y,C.z]);let I=0;if(g){for(const R of A)if(!(R.t<0)){if(R.t+=f*(R.instant?1:d),R.t>Ra){R.t=-1;continue}I=Math.max(I,_a(R.t,R.instant))}u.uniforms.uStimT.value.set(A[0].t,A[1].t),F>0&&(F-=f*d,z=E),S==null||S.update(f,d,k.reveal),B+=f,B>=1/kt&&(B=Math.min(B-1/kt,1/kt),k.calcium=x(),oe.write(k.calcium))}D.update({dt:f,motion:d,pointer:z,activation:Math.max(v,I)});const{ext:H,disp:U}=D,G=k.draw>=1?1/0:k.draw*T;for(let R=0;R<r;R++){const $=e.branches[R],W=G===1/0?1:Math.max(0,Math.min(1,(G-w.rootDist[R])/Math.max(1e-4,$.length)));h[R*4]=H[R]*W,h[R*4+1]=U[R*3],h[R*4+2]=U[R*3+1],h[R*4+3]=U[R*3+2]}let V=0;if(i&&l&&p){k.reveal>.9&&i.step(f*Math.max(0,Math.min(1,d))*k.hunger);const R=i.out;if(R.branch>=0&&R.reach>0){const W=R.branch,Z=R.reach;h[W*4]+=(1-h[W*4])*Z,h[W*4+1]+=(R.disp.x-h[W*4+1])*Z,h[W*4+2]+=(R.disp.y-h[W*4+2])*Z,h[W*4+3]+=(R.disp.z-h[W*4+3])*Z}const $=u.uniforms;$.uPhagoBranch.value=R.branch,$.uReach.value=R.reach,$.uTarget.value.copy(R.target),$.uCupAxis.value.copy(R.axis),$.uCupU.value.copy(R.u),$.uCupV.value.copy(R.v),$.uCup.value=R.cup,$.uCupRadius.value=R.cupRadius,$.uCupWrap.value=R.wrap,$.uPhagoPos.value.copy(R.phagosome),$.uBulge.value=R.bulge,p.uniforms.uPos.value.copy(R.particle),p.uniforms.uScale.value=R.particleScale,p.uniforms.uAlpha.value=R.particleAlpha,p.uniforms.uReveal.value=k.reveal,l.visible=R.particleAlpha>.01,V=R.somaBump}c.needsUpdate=!0,u.uniforms.uSomaScale.value=D.somaScale*(1+.06*V),u.uniforms.uThickness.value=D.thickness*k.magnify,u.uniforms.uDefocusShare.value=k.defocusShare,u.uniforms.uReveal.value=k.reveal,u.uniforms.uDraw.value=k.draw,u.uniforms.uMaxPx.value=k.maxPx},feed(){i==null||i.feed()},stimulate(f,d={}){if(!g)return;const m=Fa(e,w,La(e,[f.x,f.y,f.z])),v=P;P=1-P;const z=(1+v)*r*4;for(let U=0;U<r;U++)h[z+U*4]=m.junction[U];const I=!!d.instant;A[v]={t:0,instant:I,s:m};const H=u.uniforms;v===0?(H.uTipDist.value.x=m.tipDist,H.uEntryDist.value.x=m.entryDist,H.uStimInstant.value.x=I?1:0,H.uEntryA.value.set(m.entry[0],m.entry[1],m.entry[2])):(H.uTipDist.value.y=m.tipDist,H.uEntryDist.value.y=m.entryDist,H.uStimInstant.value.y=I?1:0,H.uEntryB.value.set(m.entry[0],m.entry[1],m.entry[2])),E[0]=f.x,E[1]=f.y,E[2]=f.z,F=Ta,S&&!I&&S.start(f),oe.stimulatedAt=performance.now()},dispose(){a.dispose(),u.dispose(),c.dispose(),l==null||l.geometry.dispose(),p==null||p.dispose(),S==null||S.dispose()}};return k}const Q={a:.64,b:.44,c:.54},qa=.88,He=.035,Ka=.08,Ya=.16,Za=.02,X={x:-.4,y:-.27,z:0,a:.22,b:.16,c:.3},Ja=24,Qa=.012,N={x0:-.12,y0:-.3,x1:-.24,y1:-.66,r0:.1,r1:.07},to=.045,eo=.02,Wt={cerebrum:6500,cerebellum:1100,brainstem:250},Ct=.35,ao=1.7;function oo(t,e,n,s){let a=Math.imul(t|0,668265261)^Math.imul(e|0,374761393)^Math.imul(n|0,625341585)^Math.imul((s|0)+1540483477,2246822507);return a=Math.imul(a^a>>>15,739982445),a=Math.imul(a^a>>>12,695872825),a^=a>>>15,(a>>>0)/4294967296}const jt=t=>t*t*t*(t*(t*6-15)+10),K=(t,e,n)=>t+(e-t)*n;function gt(t,e,n,s=0){const a=Math.floor(t),r=Math.floor(e),h=Math.floor(n),c=jt(t-a),u=jt(e-r),o=jt(n-h),i=(p,g,w)=>oo(a+p,r+g,h+w,s);return K(K(K(i(0,0,0),i(1,0,0),c),K(i(0,1,0),i(1,1,0),c),u),K(K(i(0,0,1),i(1,0,1),c),K(i(0,1,1),i(1,1,1),c),u),o)-.5}function pt(t,e,n){const s=Math.min(1,Math.max(0,(n-t)/(e-t)));return s*s*(3-2*s)}function no(t){let e=t*7919+13>>>0;return()=>(e=e*1664525+1013904223>>>0,e/4294967296)}function we(t,e,n){const s=Math.PI*(3-Math.sqrt(5)),a=1-2*(t+.5)/e,r=Math.sqrt(Math.max(0,1-a*a)),h=t*s;n[0]=r*Math.cos(h),n[1]=a,n[2]=r*Math.sin(h)}function dt(t){const e=Math.hypot(t[0],t[1],t[2])||1;return t[0]/=e,t[1]/=e,t[2]/=e,t}const wt=(t,e)=>[t[1]*e[2]-t[2]*e[1],t[2]*e[0]-t[0]*e[2],t[0]*e[1]-t[1]*e[0]],Ue=(t,e)=>t[0]*e[0]+t[1]*e[1]+t[2]*e[2];function Oe(t){const e=Math.abs(t[1])<.9?[0,1,0]:[1,0,0],n=dt(wt(t,e)),s=wt(t,n);return[n,s]}function Bt(t,e,n,s=.008){const[a,r]=Oe(e),h=(p,g,w)=>t(dt([e[0]+p*g[0],e[1]+p*g[1],e[2]+p*g[2]]),w),c=[0,0,0],u=[0,0,0],o=[0,0,0],i=[0,0,0];h(s,a,c),h(-s,a,u),h(s,r,o),h(-s,r,i);const l=dt(wt([c[0]-u[0],c[1]-u[1],c[2]-u[2]],[o[0]-i[0],o[1]-i[1],o[2]-i[2]]));n[0]=l[0],n[1]=l[1],n[2]=l[2]}const Ge=t=>1-(1-qa)*((1+t/Q.a)/2);function Zt(t,e){const n=Q.a*t[0];e[0]=n,e[1]=Q.b*t[1],e[2]=Q.c*t[2]*Ge(n)}const rt={k:50,k2:85,second:.4,warp:.45,freq:3.5,sulcus:-.5,gyrus:-.1};function $e(t,e,n,s){const a=rt.freq,r=gt(a*t,a*e,a*n,s)+.5*gt(2*a*t+3.1,2*a*e+1.7,2*a*n+5.3,s+1)+.25*gt(4*a*t+7.7,4*a*e+2.9,4*a*n+4.1,s+2),h=pt(.5,.85,Math.abs(t)/Q.a),c=K(.7*t+.45*e,.45*e+.7*n,h)+rt.warp*r;return Math.sin(rt.k*c)+rt.second*Math.sin(rt.k2*c+1.9)}const Ve=t=>1-pt(rt.sulcus,rt.gyrus,t);function so(t,e,n,s){const a=[0,0,0];Zt(t,a);const r=[0,0,0];Bt(Zt,t,r);const h=Ve($e(a[0],a[1],a[2],e)),c=Math.abs(a[2]),u=Ka*(1-pt(He,Ya,c))*pt(-.1,.35,a[1]),o=eo*(1-h)-to*h-u;n[0]=a[0]+r[0]*o,n[1]=a[1]+r[1]*o,n[2]=a[2]+r[2]*o+Math.sign(a[2])*Za,s&&(s.tone=h)}function Ne(t){const e=t[2]/(Q.c*Ge(t[0]));return Math.sqrt((t[0]/Q.a)**2+(t[1]/Q.b)**2+e*e)}const Jt=(t,e=1)=>Ne(t)<e;function Qt(t,e){e[0]=X.x+X.a*t[0],e[1]=X.y+X.b*t[1],e[2]=X.z+X.c*t[2]}function io(t,e,n,s){const a=t-X.x,r=e-X.y,h=n-X.z,c=Math.atan2(r,a);return Math.sin(Ja*c+2.5*gt(6*a,6*r,6*h,s+2))}function ro(t,e,n,s){const a=[0,0,0];Qt(t,a);const r=[0,0,0];Bt(Qt,t,r);const h=io(a[0],a[1],a[2],e),c=1-pt(-.4,.2,h),u=Qa*(.4-1.4*c);n[0]=a[0]+r[0]*u,n[1]=a[1]+r[1]*u,n[2]=a[2]+r[2]*u,s&&(s.tone=K(.12,.9,c))}function We(t){return Math.sqrt(((t[0]-X.x)/X.a)**2+((t[1]-X.y)/X.b)**2+((t[2]-X.z)/X.c)**2)}const te=(t,e=1)=>We(t)<e,J=dt([N.x1-N.x0,N.y1-N.y0,0]),ut=Math.hypot(N.x1-N.x0,N.y1-N.y0),Rt=[0,0,1],Xt=wt(J,Rt);function lt(t,e,n){const s=K(N.r0,N.r1,t),a=Math.cos(e),r=Math.sin(e);n[0]=N.x0+J[0]*t*ut+s*(a*Rt[0]+r*Xt[0]),n[1]=N.y0+J[1]*t*ut+s*(a*Rt[1]+r*Xt[1]),n[2]=s*(a*Rt[2]+r*Xt[2])}function lo(t,e,n){const a=[0,0,0],r=[0,0,0],h=[0,0,0],c=[0,0,0];lt(t+.01,e,a),lt(t-.01,e,r),lt(t,e+.01,h),lt(t,e-.01,c);const u=dt(wt([h[0]-c[0],h[1]-c[1],h[2]-c[2]],[a[0]-r[0],a[1]-r[1],a[2]-r[2]])),o=[0,0,0];lt(t,e,o);const i=[N.x0+J[0]*t*ut,N.y0+J[1]*t*ut,0],l=[o[0]-i[0],o[1]-i[1],o[2]-i[2]],p=Ue(u,l)<0?-1:1;n[0]=u[0]*p,n[1]=u[1]*p,n[2]=u[2]*p}function ee(t){const e=t[0]-N.x0,n=t[1]-N.y0,s=(e*J[0]+n*J[1])/ut;if(s<-.05||s>1)return 1/0;const a=e-J[0]*s*ut,r=n-J[1]*s*ut,h=K(N.r0,N.r1,Math.max(0,s));return Math.hypot(a,r,t[2])/h}const ye=(t,e=1)=>ee(t)<e,Et=(t,e,n)=>n*(1-pt(1,e,t));function je(t,e,n,s,a){let r=0;for(let i=0;i<t.length;i++)(a||!e[i])&&(r+=t[i]);const h=r/n,c=[];let u=s*h,o=0;for(let i=0;i<t.length;i++)if(!(!a&&e[i]))for(o+=t[i];u<o;)e[i]||c.push(i),u+=h;return c}function co(t,e,n,s){return Math.min(e,n,s)*Math.sqrt((t[0]/e)**2+(t[1]/n)**2+(t[2]/s)**2)}function xe(t,e,n,s,a,r,h,c,u,o){const i=n*3,l=new Float64Array(i),p=new Uint8Array(i),g=[0,0,0],w=[0,0,0];for(let L=0;L<i;L++)we(L,i,g),a(g,w),l[L]=co(g,s.a,s.b,s.c)*(o?o(w):1),p[L]=h(w)?1:0;const T=je(l,p,n,c(),u),S=Math.sqrt(4*Math.PI/Math.max(1,T.length)),A={tone:0},P=[0,0,0],E=[0,0,0],F=[0,0,0],B=(L,y)=>r(L,y,A);for(const L of T){we(L,i,g);const[y,b]=Oe(g),x=(c()-.5)*2*Ct*S,D=(c()-.5)*2*Ct*S,M=dt([g[0]+x*y[0]+D*b[0],g[1]+x*y[1]+D*b[1],g[2]+x*y[2]+D*b[2]]);a(M,w),!h(w)&&(r(M,P,A),Bt(a,M,E),Bt(B,M,F),Ue(F,E)<0&&(F[0]=-F[0],F[1]=-F[1],F[2]=-F[2]),t.push(P,E,F,A.tone,e,c()))}return T.length}function uo(t,e,n){const s=e*3,a=Math.PI*(3-Math.sqrt(5)),r=new Float64Array(s),h=new Uint8Array(s),c=[0,0,0],u=new Float64Array(s),o=new Float64Array(s);for(let g=0;g<s;g++)u[g]=(g+.5)/s,o[g]=g*a,lt(u[g],o[g],c),r[g]=K(N.r0,N.r1,u[g])/N.r0,h[g]=Jt(c)||te(c)?1:0;const i=je(r,h,e,n(),!1),l=[0,0,0];let p=0;for(const g of i){const w=Math.min(1,Math.max(0,u[g]+(n()-.5)*Ct*.06)),T=o[g]+(n()-.5)*Ct*.5;if(lt(w,T,c),Jt(c)||te(c))continue;lo(w,T,l);const S=.42+.12*gt(9*c[0],9*c[1],9*c[2],5);t.push(c,l,l,S,2,n()),p++}return p}function ho(t=1){const e=no(t),n=[],s=[],a=[],r=[],h=[],c=[],u={push(w,T,S,A,P,E){n.push(w[0],w[1],w[2]),s.push(T[0],T[1],T[2]),a.push(S[0],S[1],S[2]),r.push(A),h.push(P),c.push(E)}},o=()=>h.length,i=o();xe(u,0,Wt.cerebrum,Q,Zt,(w,T,S)=>{so(w,t,T,S),S.tone=Math.max(S.tone,Et(We(T),1.15,.75),Et(ee(T),1.5,.7))},w=>Math.abs(w[2])<He||te(w,.98)||ye(w,.98),e,!0,w=>1+(ao-1)*Ve($e(w[0],w[1],w[2],t)));const l=o();xe(u,1,Wt.cerebellum,X,Qt,(w,T,S)=>{ro(w,t,T,S),S.tone=Math.max(S.tone,Et(Ne(T),1.08,.6),Et(ee(T),1.4,.55))},w=>Jt(w)||ye(w),e,!1);const p=o();uo(u,Wt.brainstem,e);const g=o();return{count:h.length,positions:new Float32Array(n),normals:new Float32Array(s),folds:new Float32Array(a),tones:new Float32Array(r),kinds:new Float32Array(h),seeds:new Float32Array(c),counts:{cerebrum:l-i,cerebellum:p-l,brainstem:g-p}}}const $o=1.05,Ae=.19,be=11,Me=72,fo=3,po=.03,mo=11,vo=.5,go=.32,Se=.22,wo=1.45,qt={gyrus:1.4,sulcus:2.3,base:1.7},Pe={gyrus:.26,sulcus:.95},Te={alpha:.2,size:.6},yo=`
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
    float breath = 1.0 + ${po.toFixed(3)} * sin(uTime * aBreath.x + aBreath.y);
    vec3 p = (cos(ang) * aU + sin(ang) * aV) * breath;
    vec4 wp = modelMatrix * vec4(p, 1.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    float foc = (1.0 - smoothstep(0.0, 18.0, abs(dist - ${it.toFixed(1)}))) * (1.0 - uDefocus);
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
`,xo=`
  precision highp float;
  ${xt}
  ${At}
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
`,Ao=`
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
    float foc = (1.0 - smoothstep(0.0, 18.0, abs(dist - ${it.toFixed(1)}))) * (1.0 - uDefocus);
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
    float near = smoothstep(-0.2, 0.4, nv.z);
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
    // lightens them there, so the ink per area stays even up to the shoulder.
    float fore = mix(0.1, 1.0, clamp(nv.z, 0.0, 1.0));

    float size = aKind < 0.5 ? mix(${qt.gyrus.toFixed(2)}, ${qt.sulcus.toFixed(2)}, aTone) : ${qt.base.toFixed(2)};
    size *= 0.85 + 0.3 * fract(aSeed * 7.31);
    size *= mix(${Te.size.toFixed(2)}, 1.0, facing);
    float bokeh = 1.0 + (1.0 - foc) * 1.2;
    float px = clamp(size * uDpr * persp * 0.05 * bokeh, 0.75, 14.0 * uDpr);
    gl_PointSize = px;

    // Drawn from the top down with the orbits.
    float cut = 1.35 - 2.7 * uDraw;
    float drawn = smoothstep(cut - 0.3, cut, p.y);
    // The gyri light, with the paper showing through them; the sulci heavy.
    float base = mix(${Pe.gyrus.toFixed(2)}, ${Pe.sulcus.toFixed(2)}, aTone);
    // Seen edge-on the surface's dots crowd at the silhouette, so the rim is damped here, not raised as on the orbits;
    // the flank of a gyrus away from the lamp a little denser than the lit one.
    vAlpha = base * (0.04 + 0.96 * foc) / (bokeh * bokeh) * mix(1.0 - 0.2 * uLens, 1.5, lens) * (1.0 - 0.3 * rim) * fore * (0.92 + 0.16 * (1.0 - key)) * mix(${Te.alpha.toFixed(2)}, 1.0, near) * drawn;
    vShade = key;
    vRim = rim;
    vFoc = foc;
    vLens = lens;
    vSeed = aSeed;
    vPx = px;
    vTone = aTone;
  }
`,bo=`
  precision highp float;
  ${xt}
  ${At}
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
    // The gyri a little lighter under the lamp (half of what the orbits take, so the lit side stays a drawing), the
    // sulci deep; the rim a shade deeper.
    vec3 col = mix(GRAPHITE, GRAPHITE_LIGHT, vShade * 0.45);
    col = mix(col, GRAPHITE_DEEP, min(1.0, vTone * 0.85 + vRim * 0.05));
    col = mix(col, GRAPHITE_DEEP, vLens * 0.4);
    gl_FragColor = vec4(col, min(1.0, a));
  }
`,Mo=typeof location<"u"&&location.search.includes("nobrain");function So(t,e){const n=ho(e),s=new tt;s.setAttribute("position",new O(n.positions,3)),s.setAttribute("aNormal",new O(n.normals,3)),s.setAttribute("aFold",new O(n.folds,3)),s.setAttribute("aTone",new O(n.tones,1)),s.setAttribute("aSeed",new O(n.seeds,1)),s.setAttribute("aKind",new O(n.kinds,1)),s.boundingSphere=new st(new _,4);const a=new et({vertexShader:Ao,fragmentShader:bo,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uDpr:t.uDpr,uLens:t.uLens,uDefocus:t.uDefocus,uLight:t.uLight,uPointer:t.uPointer,uAlpha:{value:1},uDraw:{value:1}}}),r=new yt;return r.add(new at(s,a)),{group:r,mat:a,dispose(){s.dispose(),a.dispose()}}}function Vo(t,e=5){let n=e*7919+13;const s=()=>(n=n*1664525+1013904223>>>0,n/4294967296),a=[],r=[],h=[],c=[],u=[],o=[],i=[],l=(M,C,k,f,d,m,v)=>{a.push(M.x,M.y,M.z),r.push(C.x,C.y,C.z),h.push(k),c.push(f),u.push(s()),o.push(d),i.push(m,v)},p=new _,g=new _,w=new _,T=new _;for(let M=0;M<be;M++){const C=Qe(M,be);p.set(C[0],C[1],C[2]).normalize(),T.set(0,1,0),Math.abs(p.y)>.9&&T.set(1,0,0),g.crossVectors(p,T).normalize(),w.crossVectors(p,g).normalize();const k=s()*Math.PI*2,f=2*Math.PI/mo,d=(s()-.5)*2*vo;for(let z=0;z<Me;z++)l(g,w,k+z/Me*Math.PI*2+(s()-.5)*.02,0,0,f,d);const m=s()<.5?1:-1,v=(.22+.36*s())*m;for(let z=0;z<fo;z++)l(g,w,s()*Math.PI*2,v*(.85+.3*s()),1,f,d)}const S=new tt,A=o.length;S.setAttribute("position",new O(new Float32Array(A*3),3)),S.setAttribute("aU",new Y(a,3)),S.setAttribute("aV",new Y(r,3)),S.setAttribute("aPhase",new Y(h,1)),S.setAttribute("aOmega",new Y(c,1)),S.setAttribute("aSeed",new Y(u,1)),S.setAttribute("aKind",new Y(o,1)),S.setAttribute("aBreath",new Y(i,2)),S.boundingSphere=new st(new _,4);const P=new et({vertexShader:yo,fragmentShader:xo,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uTime:{value:0},uDpr:t.uDpr,uLens:t.uLens,uDefocus:t.uDefocus,uLight:t.uLight,uPointer:t.uPointer,uAlpha:{value:1},uDraw:{value:1}}}),E=So(t,e);E.group.visible=!Mo;const F=new yt;F.add(E.group),F.add(new at(S,P));let B=0,L=1,y=0,b=0;const x=(M,C,k,f)=>M+(C-M)*(1-Math.exp(-3*f)),D={group:F,draw:1,update(M,C,k,f){L=x(L,f?wo:1,3,M),B+=M*C*L,P.uniforms.uTime.value=B,P.uniforms.uAlpha.value=.05+.95*k,P.uniforms.uDraw.value=D.draw,E.mat.uniforms.uAlpha.value=P.uniforms.uAlpha.value,E.mat.uniforms.uDraw.value=D.draw,y=x(y,go+(f?f.y*Se:0),3,M),b=x(b,f?-f.x*Se:0,3,M),F.rotation.set(y,B*Ae,b),E.group.rotation.y=-.4*B*Ae},dispose(){E.dispose(),S.dispose(),P.dispose()}};return D}const Po=8,To=80,Dt=.012;function No(t,e,n,s={}){const a={active:!1,hover:!1,lastX:0,lastY:0,spin:0,pinch:1,pinching:!1},r=new _,h=(y,b)=>{if(!t.visible)return!1;r.copy(t.position).project(e);const x=(r.x*.5+.5)*window.innerWidth,D=(-r.y*.5+.5)*window.innerHeight;return Math.hypot(y-x,b-D)<n()},c=y=>{y.pointerType==="touch"||!h(y.clientX,y.clientY)||(y.preventDefault(),a.active=!0,a.lastX=y.clientX,a.lastY=y.clientY,a.spin=0,document.body.style.cursor="grabbing")},u=y=>{if(y.pointerType==="touch")return;if(a.active){const x=y.clientX-a.lastX,D=y.clientY-a.lastY;t.rotation.y+=x*Dt,s.tilt!==!1&&(t.rotation.x=Math.max(-1.3,Math.min(.7,t.rotation.x+D*.008))),a.spin=x*Dt*40,a.lastX=y.clientX,a.lastY=y.clientY;return}const b=h(y.clientX,y.clientY);b!==a.hover&&(a.hover=b,document.body.style.cursor=b?"grab":"")},o=y=>{y.pointerType==="touch"||!a.active||(a.active=!1,document.body.style.cursor=a.hover?"grab":"")};window.addEventListener("pointerdown",c),window.addEventListener("pointermove",u),window.addEventListener("pointerup",o),window.addEventListener("pointercancel",o);const i=s.touch??null,l=new Map;let p="none";const g={x:0,y:0};let w=1,T=0,S=0,A=0;const P=()=>{const[y,b]=Array.from(l.values());return y&&b?Math.max(1,Math.hypot(y.x-b.x,y.y-b.y)):1},E=(y,b,x)=>{p="none",g.x=y,g.y=b,T=0,S=x,A=x},F=y=>{var b;if(y.pointerType==="touch"&&!((b=y.target)!=null&&b.closest("button, a"))){l.set(y.pointerId,{x:y.clientX,y:y.clientY});try{i==null||i.setPointerCapture(y.pointerId)}catch{}l.size===1?(a.spin=0,E(y.clientX,y.clientY,y.timeStamp)):l.size===2&&(a.active=!1,a.pinching=!0,a.pinch=1,w=P(),p="turn")}},B=y=>{const b=l.get(y.pointerId);if(!b)return;const x=b.x;if(b.x=y.clientX,b.y=y.clientY,l.size>=2){a.pinching&&(a.pinch=P()/w);return}if(p==="none"){const k=y.clientX-g.x,f=y.clientY-g.y;if(Math.hypot(k,f)<Po)return;p=Math.abs(k)>1.5*Math.abs(f)?"turn":"scroll",p==="turn"&&(a.active=!0),S=y.timeStamp;return}if(p!=="turn")return;const D=y.clientX-x,M=Math.max(1,y.timeStamp-S)/1e3;S=y.timeStamp,A=y.timeStamp,t.rotation.y+=D*Dt;const C=D*Dt/M;T+=(C-T)*.5},L=y=>{var b;if(l.has(y.pointerId)){if(l.delete(y.pointerId),a.pinching&&l.size<2){a.pinching=!1;const x=a.pinch;a.pinch=1,(b=s.onPinchEnd)==null||b.call(s,x);const D=Array.from(l.values())[0];D?E(D.x,D.y,y.timeStamp):p="none";return}l.size===0&&(a.active&&(a.active=!1,a.spin=y.timeStamp-A>To?0:T),p="none")}};return i&&(i.addEventListener("pointerdown",F),i.addEventListener("pointermove",B),i.addEventListener("pointerup",L),i.addEventListener("pointercancel",L)),{get active(){return a.active},get hover(){return a.hover},get spin(){return a.spin},set spin(y){a.spin=y},get pinch(){return a.pinch},get pinching(){return a.pinching},dispose(){window.removeEventListener("pointerdown",c),window.removeEventListener("pointermove",u),window.removeEventListener("pointerup",o),window.removeEventListener("pointercancel",o),i&&(i.removeEventListener("pointerdown",F),i.removeEventListener("pointermove",B),i.removeEventListener("pointerup",L),i.removeEventListener("pointercancel",L)),(a.hover||a.active)&&(document.body.style.cursor="")}}}const Eo=8,Do=700;function Wo(t,e,n,s){const a={hover:!1,down:null},r=new _,h=new _,c=new ct,u=new De,o=new Ye,i=new _,l=()=>{if(!t.visible)return null;const P=n();if(P<=0)return null;h.copy(t.position).applyMatrix4(e.matrixWorldInverse);const E=-h.z;if(E<=.1)return null;r.copy(t.position).project(e);const F=window.innerHeight/2/(Math.tan(e.fov*Math.PI/360)*E);return{x:(r.x*.5+.5)*window.innerWidth,y:(-r.y*.5+.5)*window.innerHeight,r:P*F}},p=(P,E)=>{const F=l();return!!F&&Math.hypot(P-F.x,E-F.y)<F.r},g=(P,E)=>!p(P,E)||(c.set(P/window.innerWidth*2-1,-(E/window.innerHeight)*2+1),u.setFromCamera(c,e),o.setFromNormalAndCoplanarPoint(e.getWorldDirection(h),t.position),!u.ray.intersectPlane(o,i))?!1:(t.worldToLocal(i),s(i.clone()),!0),w=P=>{p(P.clientX,P.clientY)&&(a.down={x:P.clientX,y:P.clientY,t:performance.now(),id:P.pointerId})},T=P=>{if(P.pointerType==="touch")return;const E=!a.down&&p(P.clientX,P.clientY);E!==a.hover&&(a.hover=E,E?document.body.style.cursor="pointer":document.body.style.cursor==="pointer"&&(document.body.style.cursor=""))},S=P=>{const E=a.down;!E||P.pointerId!==E.id||(a.down=null,!(Math.hypot(P.clientX-E.x,P.clientY-E.y)>Eo||performance.now()-E.t>Do)&&g(P.clientX,P.clientY))},A=()=>{a.down=null};return window.addEventListener("pointerdown",w),window.addEventListener("pointermove",T),window.addEventListener("pointerup",S),window.addEventListener("pointercancel",A),{get hover(){return a.hover},at:g,onScreen:l,dispose(){window.removeEventListener("pointerdown",w),window.removeEventListener("pointermove",T),window.removeEventListener("pointerup",S),window.removeEventListener("pointercancel",A),a.hover&&document.body.style.cursor==="pointer"&&(document.body.style.cursor="")}}}function Ro(t,e){const n=e.stride;if(t.byteLength%n!==0)throw new Error(`umap: ${t.byteLength} bytes is not a multiple of ${n}`);const s=t.byteLength/n,a=new DataView(t),r=new Float32Array(s*3),h=new Float32Array(s),c=new Float32Array(s*3),u=new Float32Array(s);for(let o=0;o<s;o++){const i=o*n;r[o*3]=a.getInt16(i,!0)/32767,r[o*3+1]=a.getInt16(i+2,!0)/32767,r[o*3+2]=a.getInt16(i+4,!0)/32767,h[o]=a.getUint8(i+6),c[o*3]=a.getUint8(i+7)/255,c[o*3+1]=a.getUint8(i+8)/255,c[o*3+2]=a.getUint8(i+9)/255,u[o]=(o*2654435761>>>0)/4294967296}return{n:s,position:r,state:h,expr:c,seed:u}}async function Lo(t){const e=await fetch(`${t}umap/manifest.json`).then(s=>s.json()),n=await fetch(`${t}umap/cells.bin`).then(s=>s.arrayBuffer());return{manifest:e,cells:Ro(n,e)}}const Fo=600,Io=12,Ee=.035,_o=`
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
    float foc = (1.0 - smoothstep(0.0, 14.0, abs(dist - ${it.toFixed(1)}))) * (1.0 - uDefocus);
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
`,zo=`
  precision highp float;
  ${At}
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
`;function jo(t,e){const n=new yt,s=new et({vertexShader:_o,fragmentShader:zo,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uSize:t.uSize,uDpr:t.uDpr,uLens:t.uLens,uDefocus:t.uDefocus,uPointer:t.uPointer,uAlpha:t.uAlpha,uReveal:{value:0},uMode:{value:0},uPrevMode:{value:0},uWave:{value:10},uWaveOrigin:{value:new _},uFocusState:{value:-1},uHover:{value:new _(99,99,99)},uMaxPx:{value:9}}});let a=null,r=null,h=null,c=null,u=!1;const o={group:n,ready:!1,manifest:null,reveal:0,maxPx:9,spin:.12,hoverEnabled:!0,labelsEnabled:!0,labelFade:1,update:F,dispose(){u=!0,a==null||a.dispose(),s.dispose()}};Lo(e).then(({manifest:B,cells:L})=>{u||(a=new tt,a.setAttribute("position",new O(L.position,3)),a.setAttribute("aState",new O(L.state,1)),a.setAttribute("aExpr",new O(L.expr,3)),a.setAttribute("aSeed",new O(L.seed,1)),a.boundingSphere=new st(new _,1.8),n.add(new at(a,s)),r=L.position,h=L.state,c=L.expr,o.manifest=B,o.ready=!0,j.count=B.n,j.ready=!0)}).catch(B=>console.warn("umap: data not loaded",B));const i=B=>Math.max(0,ne.indexOf(B));let l=j.changedAt;const p=new _,g=new Ze,w=new De,T=new Je,S=new _,A=new ct;let P=0,E=-1;function F(B,L,y,b,x){var k;const D=s.uniforms;D.uReveal.value=o.reveal,D.uMaxPx.value=o.maxPx,D.uMode.value=i(j.mode),D.uPrevMode.value=i(j.prevMode),D.uFocusState.value=j.focusState,x&&(n.rotation.y+=B*o.spin*L),j.changedAt!==l&&(l=j.changedAt,p.set(t.uPointer.value.x,t.uPointer.value.y,n.position.z),Math.abs(p.x)>90&&p.set(0,0,n.position.z),n.worldToLocal(p),p.clampLength(0,1.2),D.uWaveOrigin.value.copy(p));const M=(performance.now()-j.changedAt)/Fo;if(D.uWave.value=ta.reducedMotion?10:Math.min(10,M*3.2),!o.ready||!r||!h||!c||!o.manifest)return;P+=B;const C=o.hoverEnabled&&b&&n.visible&&o.reveal>.5;if(C&&P>1/Io){P=0,A.set(b.x,b.y),w.setFromCamera(A,y),T.copy(n.matrixWorld).invert(),g.copy(w.ray).applyMatrix4(T);const f=n.scale.x||1,d=Ee*8/Math.max(f,.01);let m=-1,v=Math.min(d,Ee*4),z=1/0;for(let I=0;I<r.length/3;I++){S.set(r[I*3],r[I*3+1],r[I*3+2]);const H=S.clone().sub(g.origin).dot(g.direction);if(H<0)continue;const U=g.distanceToPoint(S);(U<v||U<v*1.15&&H<z-.2)&&(m=I,v=U,z=H)}E=m}if(C||(E=-1),E>=0){D.uHover.value.set(r[E*3],r[E*3+1],r[E*3+2]);const f=(b.x+1)/2*window.innerWidth,d=(1-b.y)/2*window.innerHeight,m=((k=o.manifest.states[h[E]])==null?void 0:k.name)??"",v=j.mode,z=ne.indexOf(v)-1,I=z<0?m:`${v} ${(c[E*3+z]*o.manifest.p99[z]).toFixed(2)}`;j.hover={text:I,x:f,y:d}}else D.uHover.value.set(99,99,99),j.hover&&(j.hover=null);if(o.labelsEnabled&&n.visible){const f=S.setFromMatrixPosition(y.matrixWorld).clone();j.labels=o.manifest.states.map(d=>{const m=new _(d.centroid[0],d.centroid[1],d.centroid[2]);n.localToWorld(m);const v=m.distanceTo(f),z=1-Math.min(1,Math.abs(v-it)/14);m.project(y);const I=m.z>1;return{text:d.name,state:d.id,x:(m.x+1)/2*window.innerWidth,y:(1-m.y)/2*window.innerHeight,opacity:I?0:o.reveal*o.labelFade*(.15+.85*z)*(j.focusState<0||j.focusState===d.id?1:.35)}})}else j.labels.length&&(j.labels=[])}return o}export{Uo as C,$o as E,ea as L,xt as P,At as S,Ba as a,Go as b,Oo as c,Vo as d,jo as e,Ho as f,Wo as g,No as h,ko as m};
