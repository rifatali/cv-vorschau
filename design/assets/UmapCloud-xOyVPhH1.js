import{V as _,B as at,a as O,S as rt,b as ot,c as ut,P as nt,G as xt,F as Z,D as ea,R as aa,g as oa,N as le,h as ke,i as na,j as sa,M as ia}from"./three-BH243BCb.js";import{D as lt,B as Ot,a as ce,C as ra,u as j,s as la,U as ue}from"./index-C6oKeEc7.js";const Nt=new Set,he=new Map,$t=new Set,fe={register(t){return $t.add(t),()=>{$t.delete(t)}},hasRig(t){return $t.has(t)},emit(t){he.set(t.rig,t.time),Nt.forEach(a=>a(t))},subscribe(t){return Nt.add(t),()=>{Nt.delete(t)}},lastEvent(t){return he.get(t)??-1/0}},At=`
  const vec3 GRAPHITE = vec3(0.24, 0.23, 0.23);
  const vec3 GRAPHITE_LIGHT = vec3(0.50, 0.48, 0.46);
  const vec3 GRAPHITE_DEEP = vec3(0.12, 0.11, 0.11);
  const vec3 AMBER = vec3(0.776, 0.486, 0.149);
`,bt=`
  float stroke(vec2 uv, float seed, float sharp, float px) {
    float ang = seed * 6.2831853;
    float c = cos(ang), s = sin(ang);
    vec2 q = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);
    float elong = mix(1.0, 1.6, smoothstep(2.5, 5.0, px));
    float r = length(q * vec2(1.0, elong));
    float soft = mix(0.08, 0.34, sharp);
    return smoothstep(0.5, soft, r);
  }
`,He=`
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
`,ca=new _(-.5,.75,.45).normalize();function Jo(){return{uDefocus:{value:0},uLight:{value:ca.clone()}}}const ua=`
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
    float persp = ${lt.toFixed(1)} / max(dist, 1.0);
    gl_PointSize = clamp(uPx * uDpr * persp * (0.7 + 0.6 * fract(aSeed * 7.31)), 1.0, 96.0 * uDpr);
    vA = 1.0 - smoothstep(0.55, 1.0, length(position.xy));
    vSeed = aSeed;
  }
`,ha=`
  precision highp float;
  ${At}
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
`,Vt=20,pe={x:.16,y:-.22},fa=.011;function tn(t,a=1){let o=a*7919+13;const s=()=>(o=o*1664525+1013904223>>>0,o/4294967296),e=()=>Math.sqrt(-2*Math.log(1-s()))*Math.cos(2*Math.PI*s()),r=new Float32Array(Vt*3),u=new Float32Array(Vt);for(let i=0;i<Vt;i++)r[i*3]=e()*.5,r[i*3+1]=e()*.5,r[i*3+2]=0,u[i]=s();const c=new at;c.setAttribute("position",new O(r,3)),c.setAttribute("aSeed",new O(u,1)),c.boundingSphere=new rt(new _,30);const h=new ot({vertexShader:ua,fragmentShader:ha,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uDpr:t.uDpr,uAlpha:t.uAlpha,uRadius:{value:new ut(1,1)},uPx:{value:40},uStrength:{value:0}}}),n=new nt(c,h);return n.frustumCulled=!1,n.renderOrder=-1,{points:n,place(i,l,p,v=60){n.position.set(i.x+l*pe.x,i.y+p*pe.y,i.z),h.uniforms.uRadius.value.set(l,p),h.uniforms.uPx.value=Math.max(l,p)*v*.9},update(i){h.uniforms.uStrength.value=fa*Math.max(0,Math.min(1,i)),n.visible=i>.01},dispose(){c.dispose(),h.dispose()}}}const dt=3.3,Ue=1.3,en={radius:dt,halfHeight:4.2},pa=.36,It=12,Pt=t=>.78+.42*Math.pow(t/.95,2),Gt=t=>.22+.3*Math.pow(t/.95,2),da=[.5,.17,-.17,-.5],ma=`
  attribute float aSeed;
  attribute float aKind;     // 0 membrane head, 1 tail dot, 2 outer wall, 3 pore wall
  attribute vec3 aNormal;    // the surface normal, object space
  uniform float uTime;
  uniform float uDpr;
  uniform float uLens;
  uniform float uDefocus;
  uniform vec3 uLight;
  uniform vec2 uPointer;
  uniform vec3 uIons[${It}];
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
    for (int i = 0; i < ${It}; i++) {
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
    float foc = (1.0 - smoothstep(0.0, 18.0, abs(dist - ${lt.toFixed(1)}))) * (1.0 - uDefocus);
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
`,va=`
  precision highp float;
  ${At}
  ${bt}
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
`,ga=`
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
`,wa=`
  precision highp float;
  ${He}
  uniform float uAlpha;
  varying float vA;
  void main() {
    vec3 col;
    float edge = sphere(gl_PointCoord, col);
    float a = edge * vA * uAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(col, min(1.0, a));
  }
`;function gt(t,a,o,s,e,r,u,c){const h=Math.hypot(r,u,c)||1;t.pos.push(a,o,s),t.seed.push(Math.random()),t.kind.push(e),t.normal.push(r/h,u/h,c/h)}function ya(t,a=Ue){const e=Math.ceil(dt/.20351),r=Math.ceil(dt/.235);for(let u=-e;u<=e;u++)for(let c=-r;c<=r;c++){const h=c*.235+(u%2?.1175:0)+(Math.random()-.5)*.05,n=u*.20351+(Math.random()-.5)*.05,i=Math.hypot(h,n);if(i>dt||i<a)continue;const l=dt*.78;if(!(i>l&&Math.random()<(i-l)/(dt-l)))for(const p of[1,-1]){const v=p*pa+(Math.random()-.5)*.03;gt(t,h,v,n,0,0,p,0);for(let g=1;g<=4;g++){const P=g/4.6;gt(t,h+(Math.random()-.5)*.05,v-p*(.07+.26*P),n+(Math.random()-.5)*.05,1,0,p,0)}}}}function xa(t){const a=7*Math.PI/180,o=Math.PI/2,s=110;for(let e=0;e<=s;e++){const r=-.95+1.9*e/s,u=Pt(r),c=(Pt(r+.01)-Pt(r-.01))/.02,h=Math.round(2*Math.PI*u/.036);for(let l=0;l<h;l++){const p=l/h*Math.PI*2+e%2*(Math.PI/h);if((p%o+o)%o<a||(p%o+o)%o>o-a)continue;const g=.02,P=Math.cos(p),b=Math.sin(p);gt(t,P*u+(Math.random()-.5)*g,r+(Math.random()-.5)*g,b*u+(Math.random()-.5)*g,2,P,-c,b)}const n=Gt(r),i=Math.round(2*Math.PI*n/.042);for(let l=0;l<i;l++){const p=l/i*Math.PI*2+e%2*(Math.PI/i),v=Math.cos(p),g=Math.sin(p);gt(t,v*n,r,g*n,3,-v,.2,-g)}}for(const e of[-.95,.95])for(let r=0;r<8;r++){const u=r/7,c=Gt(e)+(Pt(e)-Gt(e))*u,h=Math.round(2*Math.PI*c/.042);for(let n=0;n<h;n++){const i=n/h*Math.PI*2,l=(i%o+o)%o;l<a||l>o-a||gt(t,Math.cos(i)*c,e,Math.sin(i)*c,2,0,e>0?1:-1,0)}}}const de=10,ft=8,me=3.9,Aa=-4;function an(t,a="research",o={}){const s=o.channel!==!1,e=s?fe.register(a):()=>{},r=new xt,u=[],c={pos:[],seed:[],kind:[],normal:[]};ya(c,s?Ue:0),s&&xa(c);const h=new at;h.setAttribute("position",new Z(c.pos,3)),h.setAttribute("aSeed",new Z(c.seed,1)),h.setAttribute("aKind",new Z(c.kind,1)),h.setAttribute("aNormal",new Z(c.normal,3)),h.boundingSphere=new rt(new _,12);const n=Array.from({length:It},()=>new _(0,99,0)),i=new ot({vertexShader:ma,fragmentShader:va,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uTime:{value:0},uDpr:t.uDpr,uLens:t.uLens,uDefocus:t.uDefocus,uLight:t.uLight,uPointer:t.uPointer,uAlpha:{value:1},uIons:{value:n},uIonCount:{value:0}}});r.add(new nt(h,i)),u.push(h,i);const l=de*(1+ft),p=new Float32Array(l*3),v=new Float32Array(l),g=new Float32Array(l),P=new at;P.setAttribute("position",new O(p,3)),P.setAttribute("aSize",new O(v,1)),P.setAttribute("aAlpha",new O(g,1)),P.boundingSphere=new rt(new _,20);const b=new ot({vertexShader:ga,fragmentShader:wa,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uDpr:t.uDpr,uAlpha:{value:1},uBoost:{value:1}}}),A=new nt(P,b);A.visible=s,r.add(A),u.push(P,b);const E=[],T=(M,x)=>{M.y=me,M.angle=Math.random()*Math.PI*2,M.radius=.9+Math.random()*.5,M.delay=x,M.dwell=.55+Math.random()*.35,M.gap=.28+Math.random()*.17,M.trail=[]};for(let M=0;M<de;M++){const x={y:me,angle:0,radius:0,delay:0,dwell:.78,gap:.34,trail:[]};T(x,M*.7),E.push(x)}let F=0;const B=(M,x)=>{if(Math.abs(M)>.95)return 1.15;let D=.62;for(const S of da)D*=1-x*Math.exp(-Math.pow((M-S)/.07,2));return D},y={group:r,ionBoost:1,update:(M,x,D,S=D)=>{if(i.uniforms.uTime.value+=M*x,i.uniforms.uAlpha.value=.05+.95*D,b.uniforms.uAlpha.value=.1+.9*Math.max(D,S),b.uniforms.uBoost.value=y.ionBoost,!s)return;F+=M;const C=F>.04;C&&(F=0);const k=E.map((d,m)=>m).sort((d,m)=>E[d].y-E[m].y);k.forEach((d,m)=>{const w=E[d];if(w.delay>0){w.delay-=M*x;return}let z=M*B(w.y,w.dwell)*x;if(m>0){const U=E[k[m-1]],N=w.y-U.y,V=Math.abs(w.y)<1.4?w.gap:.55;N-z<V&&(z=Math.max(0,N-V))}const I=w.y;w.y-=z,I>0&&w.y<=0&&fe.emit({time:performance.now(),rig:a,ion:d}),w.angle+=M*(1.1+.3*Math.sin(d))*x;const H=Math.abs(w.y)<1?0:Math.min(1.4,(Math.abs(w.y)-1)*.55+.05);w.radius+=(H-w.radius)*Math.min(1,M*5),w.y<Aa&&T(w,.4+Math.random()*1.2)});let f=0;E.forEach((d,m)=>{const w=d.delay<=0,z=Math.cos(d.angle)*d.radius,I=Math.sin(d.angle)*d.radius;C&&w&&(d.trail.unshift(z,d.y,I),d.trail.length>ft*3&&(d.trail.length=ft*3)),w&&Math.abs(d.y)<1.5&&f<It&&n[f++].set(z,d.y,I);const H=w?Math.max(0,Math.min(1,(4.2-Math.abs(d.y))/.9)):0,U=Math.abs(d.y)<.95?1:0,N=m*(1+ft);p[N*3]=z,p[N*3+1]=d.y,p[N*3+2]=I,v[N]=9.5+U*2.5,g[N]=H;for(let V=0;V<ft;V++){const R=N+1+V,$=V*3,W=d.trail.length>$+2;p[R*3]=W?d.trail[$]:z,p[R*3+1]=W?d.trail[$+1]:d.y,p[R*3+2]=W?d.trail[$+2]:I;const J=1-(V+1)/(ft+1);v[R]=1.6+4.6*J,g[R]=W?H*J*.32:0}}),i.uniforms.uIonCount.value=f,P.attributes.position.needsUpdate=!0,P.attributes.aSize.needsUpdate=!0,P.attributes.aAlpha.needsUpdate=!0},dispose:()=>{e(),u.forEach(M=>M.dispose())}};return y}const ba=.45,Ma=.2,Et=18,ve=36,Sa=.9,Pa=4,Wt=.35,Tt=.3,Ea=1.5,Ta=.8,Da=.6,Ra=.7,La=.3;function Fa(t){return()=>{t|=0,t=t+1831565813|0;let a=Math.imul(t^t>>>15,1|t);return a=a+Math.imul(a^a>>>7,61|a)^a,((a^a>>>14)>>>0)/4294967296}}function ge(t,a={}){const o=t.branches.length,s=Fa(a.seed??1),e=a.motility??1,r=a.tempo??1,u=Sa*(a.reach??1),c=new Float32Array(o),h=new Float32Array(o),n=new Float32Array(o),i=new Float32Array(o),l=new Float32Array(o),p=new Float32Array(o*3);t.branches.forEach((F,B)=>{c[B]=F.isTip?ba:F.depth===4?Ma:0,h[B]=2*Math.PI/(Et+s()*(ve-Et)),n[B]=2*Math.PI/(Et+s()*(ve-Et)),i[B]=s()*Math.PI*2,l[B]=s()*Math.PI*2;const L=F.points.length-3;p[B*3]=F.points[L],p[B*3+1]=F.points[L+1],p[B*3+2]=F.points[L+2]});const v=new Float32Array(o).fill(1),g=new Float32Array(o*3),P=new Uint8Array(o),b=[];let A=0;const E={ext:v,disp:g,somaScale:1,thickness:1,update:T};function T({dt:F,motion:B,pointer:L,activation:y}){if(B<=0||F<=0)return;if(A+=F*B*r,P.fill(0),L){b.length=0;for(let x=0;x<o;x++){if(!t.branches[x].isTip)continue;const D=Math.hypot(L[0]-p[x*3],L[1]-p[x*3+1],L[2]-p[x*3+2]);D<u&&b.push({i:x,d:D})}b.sort((x,D)=>x.d-D.d);for(let x=0;x<Math.min(Pa,b.length);x++)P[b[x].i]=1}const M=Math.max(0,Math.min(1,y));for(let x=0;x<o;x++){const D=t.branches[x],S=.6*Math.sin(h[x]*A+i[x])+.4*Math.sin(n[x]*A+l[x]);let C=P[x]?1:1-c[x]*e*(.5+.5*S);D.depth>=2&&(C*=1-Da*M);const k=P[x]?Ea:Ta,f=1-Math.exp(-k*F*B);v[x]+=(C-v[x])*f,v[x]<0&&(v[x]=0),v[x]>1&&(v[x]=1);let d=0,m=0,w=0;if(P[x]&&L){d=(L[0]-p[x*3])*Wt,m=(L[1]-p[x*3+1])*Wt,w=(L[2]-p[x*3+2])*Wt;const z=Math.hypot(d,m,w);z>Tt&&(d*=Tt/z,m*=Tt/z,w*=Tt/z)}g[x*3]+=(d-g[x*3])*f,g[x*3+1]+=(m-g[x*3+1])*f,g[x*3+2]+=(w-g[x*3+2])*f}E.somaScale=1+Ra*M,E.thickness=1+La*M}return E}const Oe=1.2,_t=.6,Ne=.12,$e=.36,zt=.55,Ct=4,we=2.5,Ia=6.5,ye=10,_a=8,za=3,Ve=4,Ca=.16,Ba=.03,jt=320,ka=40;function Ge(t){const a=t.branches,o=a.length,s=new Float32Array(o).fill(-1),e=new Float32Array(o),r=new Int32Array(o),u=h=>{if(s[h]>=0)return s[h];const n=a[h];return n.parent<0?(s[h]=Math.hypot(n.points[0],n.points[1],n.points[2]),r[h]=h):(s[h]=u(n.parent)+a[n.parent].length,r[h]=r[n.parent]),s[h]};let c=0;for(let h=0;h<o;h++)e[h]=u(h)+a[h].length,e[h]>c&&(c=e[h]);return{rootDist:s,endDist:e,root:r,maxDist:c}}function Ha(t,a){let o=-1,s=1/0;for(const e of t.branches){if(!e.isTip)continue;const r=e.points.length-3,u=Math.hypot(a[0]-e.points[r],a[1]-e.points[r+1],a[2]-e.points[r+2]);u<s&&(s=u,o=e.id)}return o}function Ua(t,a,o){const s=t.branches,e=s.length,r=new Uint8Array(e);for(let l=o;l>=0;l=s[l].parent)r[l]=1;const u=a.root[o],c=s[u].points,h=[c[0],c[1],c[2]],n=a.rootDist[u],i=new Float32Array(e);for(let l=0;l<e;l++){if(a.root[l]!==u){const v=s[a.root[l]].points,g=Math.hypot(v[0]-h[0],v[1]-h[1],v[2]-h[2]);i[l]=(n+a.rootDist[a.root[l]]-g)/2;continue}let p=l;for(;!r[p];)p=s[p].parent;i[l]=a.endDist[p]}return{tip:o,tipDist:a.endDist[o],junction:i,entry:h,entryDist:n}}const Oa=(t,a,o)=>Math.abs(o-t.junction[a])+(t.tipDist-t.junction[a]),We=t=>{const a=t<0?0:t>1?1:t;return a*a*(3-2*a)};function xe(t,a,o=!1){if(a<0)return 0;if(o)return zt*Math.exp(-a/Ct);const s=a-Oe;if(s<=0)return 0;const e=t-_t*s,r=e>0?1-We(e/Ne):Math.exp(e/$e),u=e<0?zt*Math.exp(e/(_t*Ct)):0;return Math.min(1,u+(1-u)*r)}function Na(t,a=!1){return t<0?0:t>=ye?Math.exp(-(t-ye)/_a):a?1:We((t-we)/(Ia-we))}function Bt(t){return()=>{t|=0,t=t+1831565813|0;let a=Math.imul(t^t>>>15,1|t);return a=a+Math.imul(a^a>>>7,61|a)^a,((a^a>>>14)>>>0)/4294967296}}const Ae=t=>t.toFixed(3),$a=`
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
    vec3 p = uOrigin + position * (${Ae(Ca)} * sqrt(t)) + uDrift * t;
    p += vec3(sin(t * 3.1 + aSeed * 40.0), cos(t * 2.7 + aSeed * 30.0), sin(t * 2.3 + aSeed * 20.0)) * 0.012 * sqrt(t);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    float foc = 1.0 - smoothstep(0.0, 18.0, abs(dist - ${lt.toFixed(1)}));
    float persp = 300.0 / max(dist, 1.0);
    gl_PointSize = clamp((1.3 + 1.4 * fract(aSeed * 7.31)) * uDpr * persp * 0.045 * (1.0 + (1.0 - foc) * 1.2), 0.75, 6.0 * uDpr);
    float fade = smoothstep(0.0, 0.12, t) * (1.0 - smoothstep(1.2, ${Ae(Ve)}, t));
    vA = fade * (0.45 + 0.4 * fract(aSeed * 3.3)) * (0.04 + 0.96 * foc) * uReveal;
  }
`,Va=`
  precision highp float;
  uniform float uAlpha;
  varying float vA;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.2, r) * vA * uAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(0.776, 0.486, 0.149, a);
  }
`;function Ga(t,a=1){const o=Bt(a*17+3),s=()=>Math.sqrt(-2*Math.log(1-o()))*Math.cos(2*Math.PI*o()),e=new Float32Array(jt*3),r=new Float32Array(jt);for(let l=0;l<jt;l++)e[l*3]=s(),e[l*3+1]=s(),e[l*3+2]=s(),r[l]=o();const u=new at;u.setAttribute("position",new O(e,3)),u.setAttribute("aSeed",new O(r,1));const c=new ot({vertexShader:$a,fragmentShader:Va,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uT:{value:-1},uOrigin:{value:new _},uDrift:{value:new _},uDpr:t.uDpr,uAlpha:t.uAlpha,uReveal:{value:1}}}),h=new nt(u,c);h.frustumCulled=!1,h.visible=!1;const n=Bt(a*5+11);let i=-1;return{points:h,get t(){return i},start(l){i=0,c.uniforms.uOrigin.value.set(l.x,l.y,l.z),c.uniforms.uDrift.value.set(n()-.5,n()-.5,n()-.5).normalize().multiplyScalar(Ba)},update(l,p,v){i>=0&&(i+=l*p,i>Ve&&(i=-1)),c.uniforms.uT.value=i,c.uniforms.uReveal.value=v,h.visible=i>=0},dispose(){u.dispose(),c.dispose()}}}const ee=.12,je=2e4,be=12;function Wa(t,a=je,o=1){const s=Bt(o),e=Math.round(a*ee),r=a-e,u=t.branches.map(S=>S.length*(S.radius0+S.radius1)*.5),c=u.reduce((S,C)=>S+C,0),h=Ge(t),n=new Float32Array(a*3),i=new Float32Array(a),l=new Float32Array(a),p=new Float32Array(a),v=new Float32Array(a),g=new Float32Array(a),P=new Float32Array(a*3),b=new Float32Array(a);let A=0;for(;A<e;A++){const S=s()*2-1,C=s()*Math.PI*2,k=Math.sqrt(1-S*S),f=s(),d=t.soma*(.85+.3*f);n[A*3]=k*Math.cos(C)*d,n[A*3+1]=S*d,n[A*3+2]=k*Math.sin(C)*d,P[A*3]=k*Math.cos(C),P[A*3+1]=S,P[A*3+2]=k*Math.sin(C),b[A]=f,i[A]=-1,l[A]=0,p[A]=s(),v[A]=1,g[A]=0}const E=u.map(S=>r*S/c),T=E.map(Math.floor);let F=r-T.reduce((S,C)=>S+C,0);const B=E.map((S,C)=>({k:C,frac:S-Math.floor(S)})).sort((S,C)=>C.frac-S.frac);for(let S=0;F>0&&S<B.length;S++,F--)T[B[S].k]++;const L=new _,y=new _,M=new _,x=new _(0,1,0),D=new _;return t.branches.forEach((S,C)=>{const k=S.points.length/3;for(let f=0;f<T[C];f++,A++){const d=s(),m=d*S.length;let w=0;for(;w<k-2&&S.cum[w+1]<m;)w++;const z=S.cum[w+1]-S.cum[w],I=z>0?(m-S.cum[w])/z:0,H=S.points[w*3],U=S.points[w*3+1],N=S.points[w*3+2],V=S.points[w*3+3],R=S.points[w*3+4],$=S.points[w*3+5];D.set(H+(V-H)*I,U+(R-U)*I,N+($-N)*I),L.set(V-H,R-U,$-N).normalize(),L.lengthSq()===0&&L.set(0,1,0),y.crossVectors(L,Math.abs(L.y)>.9?new _(1,0,0):x).normalize(),M.crossVectors(L,y);const W=(S.radius0+(S.radius1-S.radius0)*d)*(.85+.3*s()),J=s()*Math.PI*2,Mt=Math.cos(J),St=Math.sin(J);D.addScaledVector(y,Mt*W).addScaledVector(M,St*W),n[A*3]=D.x,n[A*3+1]=D.y,n[A*3+2]=D.z,P[A*3]=y.x*Mt+M.x*St,P[A*3+1]=y.y*Mt+M.y*St,P[A*3+2]=y.z*Mt+M.z*St,i[A]=C,l[A]=d,p[A]=s(),v[A]=0,g[A]=h.rootDist[C]+d*S.length}}),{position:n,aBranch:i,aT:l,aSeed:p,aSoma:v,aDist:g,aNormal:P,aShell:b,count:a}}const ae=3,qt=[0,1,2].map(t=>((t+.5)/ae).toFixed(4)),st=t=>t.toFixed(3),ja=`
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
    if (instant > 0.5) return ${st(zt)} * exp(-t / ${st(Ct)});
    float tw = t - ${st(Oe)};
    if (tw <= 0.0) return 0.0;
    float x = d - ${st(_t)} * tw;
    float band = x > 0.0 ? 1.0 - smoothstep(0.0, ${st(Ne)}, x) : exp(x / ${st($e)});
    float plateau = x < 0.0 ? ${st(zt)} * exp(x / ${st(_t*Ct)}) : 0.0;
    return clamp(plateau + (1.0 - plateau) * band, 0.0, 1.0);
  }

  void main() {
    vec3 pos = position;
    float hidden = 0.0;
    if (aSoma < 0.5) {
      vec4 st = texture2D(uBranch, vec2((aBranch + 0.5) / uBranchCount, ${qt[0]}));
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
      float jA = texture2D(uBranch, vec2((aBranch + 0.5) / uBranchCount, ${qt[1]})).r;
      float jB = texture2D(uBranch, vec2((aBranch + 0.5) / uBranchCount, ${qt[2]})).r;
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
    float foc = (1.0 - smoothstep(0.0, 18.0, abs(dist - ${lt.toFixed(1)}))) * (1.0 - uDefocus * uDefocusShare);
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
`,qa=`
  precision highp float;
  ${At}
  ${bt}
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
`,Xa=`
  uniform vec3 uPos;
  uniform float uScale;
  uniform float uDpr;
  void main() {
    vec4 mv = modelViewMatrix * vec4(uPos, 1.0);
    gl_Position = projectionMatrix * mv;
    float persp = 300.0 / max(-mv.z, 1.0);
    gl_PointSize = clamp(uDpr * persp * 0.6 * uScale, 3.0, 32.0 * uDpr);
  }
`,Ka=`
  precision highp float;
  ${He}
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
`,Y={appear:.7,reach:1.6,cup:1.1,close:.9,retract:1,digest:.8},vt=.17,Ya=.1,Za=1.5,Me=6,Qa=9,Ja=.45,it=t=>{const a=Math.max(0,Math.min(1,t));return a*a*(3-2*a)},to=t=>1-Math.pow(1-Math.max(0,Math.min(1,t)),3);function eo(t,a){var k;const o=Bt(a),s=f=>new _(f.points[f.points.length-3],f.points[f.points.length-2],f.points[f.points.length-1]),e=t.branches.filter(f=>f.isTip).map(f=>({b:f,d:s(f).length()})).sort((f,d)=>d.d-f.d),r=e.slice(0,Math.max(6,Math.round(e.length*.5))).map(f=>f.b),u=((k=[...r].sort((f,d)=>f.length-d.length)[Math.floor(r.length/2)])==null?void 0:k.length)??0,c=r.filter(f=>f.length>=u);c.length<3&&c.push(...r.slice(0,3));let h=-1;const n={branch:-1,reach:0,disp:new _,cup:0,wrap:0,cupRadius:vt,target:new _,axis:new _(0,0,1),u:new _(1,0,0),v:new _(0,1,0),particle:new _,particleAlpha:0,particleScale:1,phagosome:new _,bulge:0,somaBump:0};let i="rest",l=0,p=Za,v=0;const g=new _,P=new _,b=new _;let A=new Float32Array(0),E=new Float32Array(0),T=0;const F=new _,B=new _;function L(f){const d=[];let m=f,w=0;for(;m&&w++<64;){for(let I=m.points.length-3;I>=0;I-=3){const H=m.points[I],U=m.points[I+1],N=m.points[I+2],V=d.length;V&&d[V-3]===H&&d[V-2]===U&&d[V-1]===N||d.push(H,U,N)}m=m.parent>=0&&m.parent!==m.id?t.branches[m.parent]:void 0}d.push(0,0,0),A=Float32Array.from(d);const z=A.length/3;E=new Float32Array(z);for(let I=1;I<z;I++)E[I]=E[I-1]+Math.hypot(A[I*3]-A[I*3-3],A[I*3+1]-A[I*3-2],A[I*3+2]-A[I*3-1]);T=E[z-1]}function y(f,d){const m=A.length/3;if(m===0)return d.set(0,0,0);if(f<=0)return d.set(A[0],A[1],A[2]);if(f>=T)return d.set(0,0,0);let w=1;for(;w<m-1&&E[w]<f;)w++;const z=(f-E[w-1])/Math.max(1e-6,E[w]-E[w-1]);return d.set(A[w*3-3]+(A[w*3]-A[w*3-3])*z,A[w*3-2]+(A[w*3+1]-A[w*3-2])*z,A[w*3-1]+(A[w*3+2]-A[w*3-1])*z)}const M=e.map(f=>s(f.b));function x(f,d){let m=1/0;for(let w=0;w<e.length;w++)e[w].b.id!==f.id&&(m=Math.min(m,M[w].distanceTo(d)));return m}function D(){let f=c[0],d=-1;for(let H=0;H<4;H++){const U=c[Math.floor(o()*c.length)];if(U.id===h&&c.length>1)continue;const N=s(U),V=F.set(N.x-U.points[0],N.y-U.points[1],N.z-U.points[2]).normalize(),R=B.copy(N).addScaledVector(V,.35),$=x(U,R);$>d&&(d=$,f=U)}h=f.id,g.copy(s(f));const m=F.set(g.x-f.points[0],g.y-f.points[1],g.z-f.points[2]).normalize();m.lengthSq()===0&&m.copy(g).normalize();const w=B.set(o()-.5,o()-.5,o()-.5).cross(m).normalize(),z=Math.min(.55,Math.max(.3,f.length*.9));P.copy(g).addScaledVector(m,z).addScaledVector(w,z*.35*(o()-.5)*2);const I=F.subVectors(P,g).normalize();n.axis.copy(I).negate(),b.copy(P).addScaledVector(I,-.17).sub(g),n.u.set(0,1,0),Math.abs(n.axis.y)>.9&&n.u.set(1,0,0),n.u.cross(n.axis).normalize(),n.v.crossVectors(n.axis,n.u).normalize(),n.branch=f.id,L(f),i="appear",l=0}function S(){n.branch=-1,n.reach=0,n.cup=0,n.wrap=0,n.cupRadius=vt,n.particleAlpha=0,n.particleScale=1,n.bulge=0,n.somaBump=0,i="rest",l=0,p=Me+o()*(Qa-Me)}function C(f){if(f<=0)return;v+=f,l+=f;const d=m=>n.particle.copy(P).add(F.set(Math.sin(v*7.1)*m,Math.cos(v*5.3)*m,Math.sin(v*6.2+1.3)*m));switch(i){case"rest":l>=p&&D();break;case"appear":{n.particleAlpha=it(l/Y.appear),d(.014),l>=Y.appear&&(i="reach",l=0);break}case"reach":{const m=it(l/Y.reach);n.reach=m,n.disp.copy(b).multiplyScalar(m),d(.014*(1-m)),n.particleAlpha=1,l>=Y.reach&&(i="cup",l=0,n.target.copy(n.particle));break}case"cup":{n.reach=1,n.disp.copy(b),n.cup=to(l/Y.cup),n.wrap=.3*n.cup,n.particle.copy(n.target),l>=Y.cup&&(i="close",l=0);break}case"close":{const m=it(l/Y.close);n.cup=1,n.wrap=.3+.7*m,n.cupRadius=vt+(Ya-vt)*m,n.particleScale=1-.3*m,l>=Y.close&&(i="retract",l=0);break}case"retract":{const m=it(l/Y.retract);n.reach=1-m,n.disp.copy(b).multiplyScalar(n.reach),n.target.copy(g).add(n.disp).addScaledVector(n.axis,-.1*(1-m)),n.particle.copy(n.target),l>=Y.retract&&(i="transport",l=0);break}case"transport":{const m=l*Ja;n.reach=0,n.cup=1-it(l/.5),n.wrap=1,y(m,n.particle),n.target.copy(n.particle),n.phagosome.copy(n.particle),n.bulge=it(l/.4),m>=T&&(i="digest",l=0);break}case"digest":{const m=l/Y.digest;n.cup=0,n.particle.set(0,0,0),n.phagosome.set(0,0,0),n.particleAlpha=1-it(m),n.bulge=1-it(m),n.somaBump=Math.sin(Math.PI*Math.min(1,m)),l>=Y.digest&&S();break}}}return{out:n,step:C,feed(){i==="rest"&&(p=0)}}}function on(t,a,o={}){const s=Wa(a,o.count??je,o.seed??1),e=new at;e.setAttribute("position",new O(s.position,3)),e.setAttribute("aBranch",new O(s.aBranch,1)),e.setAttribute("aT",new O(s.aT,1)),e.setAttribute("aSeed",new O(s.aSeed,1)),e.setAttribute("aSoma",new O(s.aSoma,1)),e.setAttribute("aDist",new O(s.aDist,1)),e.setAttribute("aNormal",new O(s.aNormal,3)),e.setAttribute("aShell",new O(s.aShell,1)),e.boundingSphere=new rt(new _,a.bound*1.5);const r=a.branches.length,u=new Float32Array(r*4*ae);for(let f=0;f<r;f++)u[f*4]=1;const c=new ea(u,r,ae,aa,oa);c.magFilter=le,c.minFilter=le,c.needsUpdate=!0;const h=new ot({vertexShader:ja,fragmentShader:qa,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uSize:t.uSize,uDpr:t.uDpr,uMaxPx:{value:be},uLens:t.uLens,uPointer:t.uPointer,uAlpha:t.uAlpha,uBranch:{value:c},uBranchCount:{value:r},uSomaScale:{value:1},uThickness:{value:1},uReveal:{value:1},uDraw:{value:1},uDefocus:t.uDefocus,uDefocusShare:{value:1},uLight:t.uLight,uPhagoBranch:{value:-1},uTarget:{value:new _},uCupAxis:{value:new _(0,0,1)},uCupU:{value:new _(1,0,0)},uCupV:{value:new _(0,1,0)},uCup:{value:0},uCupRadius:{value:vt},uCupWrap:{value:0},uPhagoPos:{value:new _},uBulge:{value:0},uReach:{value:0},uStimT:{value:new ut(-1,-1)},uStimInstant:{value:new ut(0,0)},uTipDist:{value:new ut(0,0)},uEntryDist:{value:new ut(0,0)},uEntryA:{value:new _},uEntryB:{value:new _}}}),n=new xt;n.add(new nt(e,h)),n.scale.setScalar(o.scale??1);const i=o.phagocytosis?eo(a,(o.seed??1)*31+7):null;let l=null,p=null;if(i){const f=new at;f.setAttribute("position",new O(new Float32Array(3),3)),f.boundingSphere=new rt(new _,a.bound*2),p=new ot({vertexShader:Xa,fragmentShader:Ka,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uPos:{value:new _},uScale:{value:1},uDpr:t.uDpr,uAlpha:{value:0},uCellAlpha:t.uAlpha,uReveal:{value:1}}}),l=new nt(f,p),l.visible=!1,n.add(l)}const v=!!o.atp,g=Ge(a),P=g.maxDist*1.02;let b=null;v&&(b=Ga(t,o.seed??1),n.add(b.points));const A=[{t:-1,instant:!1,s:null},{t:-1,instant:!1,s:null}];let E=0;const T=[0,0,0];let F=0,B=0;const L=a.branches.map(f=>f.length*(f.radius0+f.radius1)*.5),y=L.reduce((f,d)=>f+d,0),M=[.17,.5,.83],x=()=>{let f=0;for(const d of A){if(d.t<0||!d.s)continue;let m=0;for(let w=0;w<r;w++){const z=a.branches[w];let I=0;for(const H of M)I+=xe(Oa(d.s,w,g.rootDist[w]+H*z.length),d.t,d.instant);m+=I/M.length*(L[w]/y)*(1-ee)}m+=ee*xe(d.s.tipDist-d.s.entryDist+a.soma,d.t,d.instant),f=Math.max(f,m)}return f};let D=ge(a,o);const S=o.surveillance??!1,C=new _,k={group:n,reveal:1,draw:1,maxPx:be,defocusShare:1,magnify:1,hunger:1,calcium:0,get motility(){return D},setMotility(f){D=ge(a,{...o,...f})},update(f,d,m,w){let z=null;S&&m&&(C.set(m.x,m.y,n.position.z),n.worldToLocal(C),z=[C.x,C.y,C.z]);let I=0;if(v){for(const R of A)if(!(R.t<0)){if(R.t+=f*(R.instant?1:d),R.t>ka){R.t=-1;continue}I=Math.max(I,Na(R.t,R.instant))}h.uniforms.uStimT.value.set(A[0].t,A[1].t),F>0&&(F-=f*d,z=T),b==null||b.update(f,d,k.reveal),B+=f,B>=1/Ot&&(B=Math.min(B-1/Ot,1/Ot),k.calcium=x(),ce.write(k.calcium))}D.update({dt:f,motion:d,pointer:z,activation:Math.max(w,I)});const{ext:H,disp:U}=D,N=k.draw>=1?1/0:k.draw*P;for(let R=0;R<r;R++){const $=a.branches[R],W=N===1/0?1:Math.max(0,Math.min(1,(N-g.rootDist[R])/Math.max(1e-4,$.length)));u[R*4]=H[R]*W,u[R*4+1]=U[R*3],u[R*4+2]=U[R*3+1],u[R*4+3]=U[R*3+2]}let V=0;if(i&&l&&p){k.reveal>.9&&i.step(f*Math.max(0,Math.min(1,d))*k.hunger);const R=i.out;if(R.branch>=0&&R.reach>0){const W=R.branch,J=R.reach;u[W*4]+=(1-u[W*4])*J,u[W*4+1]+=(R.disp.x-u[W*4+1])*J,u[W*4+2]+=(R.disp.y-u[W*4+2])*J,u[W*4+3]+=(R.disp.z-u[W*4+3])*J}const $=h.uniforms;$.uPhagoBranch.value=R.branch,$.uReach.value=R.reach,$.uTarget.value.copy(R.target),$.uCupAxis.value.copy(R.axis),$.uCupU.value.copy(R.u),$.uCupV.value.copy(R.v),$.uCup.value=R.cup,$.uCupRadius.value=R.cupRadius,$.uCupWrap.value=R.wrap,$.uPhagoPos.value.copy(R.phagosome),$.uBulge.value=R.bulge,p.uniforms.uPos.value.copy(R.particle),p.uniforms.uScale.value=R.particleScale,p.uniforms.uAlpha.value=R.particleAlpha,p.uniforms.uReveal.value=k.reveal,l.visible=R.particleAlpha>.01,V=R.somaBump}c.needsUpdate=!0,h.uniforms.uSomaScale.value=D.somaScale*(1+.06*V),h.uniforms.uThickness.value=D.thickness*k.magnify,h.uniforms.uDefocusShare.value=k.defocusShare,h.uniforms.uReveal.value=k.reveal,h.uniforms.uDraw.value=k.draw,h.uniforms.uMaxPx.value=k.maxPx},feed(){i==null||i.feed()},stimulate(f,d={}){if(!v)return;const m=Ua(a,g,Ha(a,[f.x,f.y,f.z])),w=E;E=1-E;const z=(1+w)*r*4;for(let U=0;U<r;U++)u[z+U*4]=m.junction[U];const I=!!d.instant;A[w]={t:0,instant:I,s:m};const H=h.uniforms;w===0?(H.uTipDist.value.x=m.tipDist,H.uEntryDist.value.x=m.entryDist,H.uStimInstant.value.x=I?1:0,H.uEntryA.value.set(m.entry[0],m.entry[1],m.entry[2])):(H.uTipDist.value.y=m.tipDist,H.uEntryDist.value.y=m.entryDist,H.uStimInstant.value.y=I?1:0,H.uEntryB.value.set(m.entry[0],m.entry[1],m.entry[2])),T[0]=f.x,T[1]=f.y,T[2]=f.z,F=za,b&&!I&&b.start(f),ce.stimulatedAt=performance.now()},dispose(){e.dispose(),h.dispose(),c.dispose(),l==null||l.geometry.dispose(),p==null||p.dispose(),b==null||b.dispose()}};return k}const K={a:.64,b:.44,c:.54},ao=.88,qe=.035,oo=.08,no=.16,so=.02,q={x:-.38,y:-.31,z:0,a:.22,b:.16,c:.3},io=24,ro=.012,G={x0:-.1,y0:-.22,x1:-.235,y1:-.64,r0:.1,r1:.07},lo=.045,co=.02,Xt=.72/K.a,Kt={cerebrum:22e3,cerebellum:3500,brainstem:600},kt=.35,uo=1.5;function ho(t,a,o,s){let e=Math.imul(t|0,668265261)^Math.imul(a|0,374761393)^Math.imul(o|0,625341585)^Math.imul((s|0)+1540483477,2246822507);return e=Math.imul(e^e>>>15,739982445),e=Math.imul(e^e>>>12,695872825),e^=e>>>15,(e>>>0)/4294967296}const Yt=t=>t*t*t*(t*(t*6-15)+10),Q=(t,a,o)=>t+(a-t)*o;function wt(t,a,o,s=0){const e=Math.floor(t),r=Math.floor(a),u=Math.floor(o),c=Yt(t-e),h=Yt(a-r),n=Yt(o-u),i=(p,v,g)=>ho(e+p,r+v,u+g,s);return Q(Q(Q(i(0,0,0),i(1,0,0),c),Q(i(0,1,0),i(1,1,0),c),h),Q(Q(i(0,0,1),i(1,0,1),c),Q(i(0,1,1),i(1,1,1),c),h),n)-.5}function X(t,a,o){const s=Math.min(1,Math.max(0,(o-t)/(a-t)));return s*s*(3-2*s)}function fo(t){let a=t*7919+13>>>0;return()=>(a=a*1664525+1013904223>>>0,a/4294967296)}function Se(t,a,o){const s=Math.PI*(3-Math.sqrt(5)),e=1-2*(t+.5)/a,r=Math.sqrt(Math.max(0,1-e*e)),u=t*s;o[0]=r*Math.cos(u),o[1]=e,o[2]=r*Math.sin(u)}function mt(t){const a=Math.hypot(t[0],t[1],t[2])||1;return t[0]/=a,t[1]/=a,t[2]/=a,t}const yt=(t,a)=>[t[1]*a[2]-t[2]*a[1],t[2]*a[0]-t[0]*a[2],t[0]*a[1]-t[1]*a[0]],Xe=(t,a)=>t[0]*a[0]+t[1]*a[1]+t[2]*a[2];function Ke(t){const a=Math.abs(t[1])<.9?[0,1,0]:[1,0,0],o=mt(yt(t,a)),s=yt(t,o);return[o,s]}function Ht(t,a,o,s=.008){const[e,r]=Ke(a),u=(p,v,g)=>t(mt([a[0]+p*v[0],a[1]+p*v[1],a[2]+p*v[2]]),g),c=[0,0,0],h=[0,0,0],n=[0,0,0],i=[0,0,0];u(s,e,c),u(-s,e,h),u(s,r,n),u(-s,r,i);const l=mt(yt([c[0]-h[0],c[1]-h[1],c[2]-h[2]],[n[0]-i[0],n[1]-i[1],n[2]-i[2]]));o[0]=l[0],o[1]=l[1],o[2]=l[2]}const Ut=t=>1-(1-ao)*((1+t/K.a)/2),po=.3,Zt={drop:.13,x:.2,spread:.45};function Ye(t,a,o,s){const e=X(.3,.8,Math.abs(o)/(K.c*Ut(t))),r=X(0,-.5,a/K.b),u=1-po*r*(1-e),c=Zt.drop*Math.exp(-(((t/K.a-Zt.x)/Zt.spread)**2))*r*e;s[0]=t+.3*c,s[1]=a*u-c,s[2]=o+Math.sign(o)*.5*c}function oe(t,a){const o=K.a*t[0];Ye(o,K.b*t[1],K.c*t[2]*Ut(o),a)}const et={k:42,k2:85,second:.35,warp:.32,freq:2.5,lean:.12,sulcus:-.6,gyrus:-.2},Dt={from:.24,to:.4,amount:.75,warp:1.4},mo={x0:.46,y0:-.16,x1:-.15,y1:.03,halfWidth:.016,depth:.06,amount:1,flank:[.5,.8]},vo={x0:-.02,y0:.44,x1:.17,y1:-.02,halfWidth:.013,depth:.05,amount:1,flank:[.05,.3]},go={x0:.2,y0:.4,x1:.28,y1:.08,halfWidth:.011,depth:.045,amount:.65,flank:[.1,.35]},wo={x0:-.16,y0:.42,x1:-.08,y1:.1,halfWidth:.011,depth:.045,amount:.65,flank:[.1,.35]},yo=[mo,vo,go,wo],pt={x0:-.2,x1:.34,y:-.1},Pe=t=>1-X(et.sulcus,et.gyrus,t),Ee=t=>Math.sin(et.k*t)+et.second*Math.sin(et.k2*t+1.9);function Qt(t,a,o,s){const e=et.freq;return wt(e*t,e*a,e*o,s)+.5*wt(2*e*t+3.1,2*e*a+1.7,2*e*o+5.3,s+1)+.25*wt(4*e*t+7.7,4*e*a+2.9,4*e*o+4.1,s+2)}function xo(t,a,o,s){const e=t.x1-t.x0,r=t.y1-t.y0,u=Math.min(1,Math.max(0,((a-t.x0)*e+(o-t.y0)*r)/(e*e+r*r))),c=Math.hypot(a-(t.x0+u*e),o-(t.y0+u*r)),h=X(0,.08,u)*X(1,.92,u);return(1-X(t.halfWidth,t.halfWidth+.012,c))*h*X(t.flank[0],t.flank[1],s)*t.amount}function Ze(t,a,o,s,e){const r=Math.abs(o)/(K.c*Ut(t)),u=Qt(t,a,o,s),c=X(Dt.from,Dt.to,a),h=X(pt.x0-.06,pt.x0+.06,t)*(1-X(pt.x1-.06,pt.x1+.06,t))*X(pt.y-.08,pt.y,a)*(1-c),n=Pe(Ee(a+et.lean*t+et.warp*u))*(1-.7*c)*(1-.85*h),i=Pe(Ee(o+.7+Dt.warp*et.warp*Qt(t+2.3,a+1.1,o+.4,s)))*c*Dt.amount;let l=Math.max(n,i),p=lo*l;const v=t+.06*u,g=a+.06*Qt(t+5.1,a+.7,o+2.2,s+3);for(const P of yo){const b=xo(P,v,g,r);b>l&&(l=b),p=Math.max(p,P.depth*b)}return e&&(e.depth=p),l}function Ao(t,a,o,s){const e=[0,0,0];oe(t,e);const r=[0,0,0];Ht(oe,t,r);const u={depth:0},c=Ze(e[0],e[1],e[2],a,u),h=Math.abs(e[2]),n=oo*(1-X(qe,no,h))*X(-.1,.35,e[1]),i=co*(1-c)-u.depth-n;o[0]=e[0]+r[0]*i,o[1]=e[1]+r[1]*i,o[2]=e[2]+r[2]*i+Math.sign(e[2])*so,s&&(s.tone=c)}function Qe(t){let a=t[0],o=t[1],s=t[2];const e=[0,0,0];for(let u=0;u<3;u++)Ye(a,o,s,e),a+=t[0]-e[0],o+=t[1]-e[1],s+=t[2]-e[2];const r=s/(K.c*Ut(a));return Math.sqrt((a/K.a)**2+(o/K.b)**2+r*r)}const ne=(t,a=1)=>Qe(t)<a;function se(t,a){a[0]=q.x+q.a*t[0],a[1]=q.y+q.b*t[1],a[2]=q.z+q.c*t[2]}function bo(t,a,o,s){const e=t-q.x,r=a-q.y,u=o-q.z,c=Math.atan2(r,e);return Math.sin(io*c+2.5*wt(6*e,6*r,6*u,s+2))}function Mo(t,a,o,s){const e=[0,0,0];se(t,e);const r=[0,0,0];Ht(se,t,r);const u=bo(e[0],e[1],e[2],a),c=1-X(-.4,.2,u),h=ro*(.4-1.4*c);o[0]=e[0]+r[0]*h,o[1]=e[1]+r[1]*h,o[2]=e[2]+r[2]*h,s&&(s.tone=Q(.12,.9,c))}function Je(t){return Math.sqrt(((t[0]-q.x)/q.a)**2+((t[1]-q.y)/q.b)**2+((t[2]-q.z)/q.c)**2)}const ie=(t,a=1)=>Je(t)<a,tt=mt([G.x1-G.x0,G.y1-G.y0,0]),ht=Math.hypot(G.x1-G.x0,G.y1-G.y0),Ft=[0,0,1],Jt=yt(tt,Ft);function ct(t,a,o){const s=Q(G.r0,G.r1,t),e=Math.cos(a),r=Math.sin(a);o[0]=G.x0+tt[0]*t*ht+s*(e*Ft[0]+r*Jt[0]),o[1]=G.y0+tt[1]*t*ht+s*(e*Ft[1]+r*Jt[1]),o[2]=s*(e*Ft[2]+r*Jt[2])}function So(t,a,o){const e=[0,0,0],r=[0,0,0],u=[0,0,0],c=[0,0,0];ct(t+.01,a,e),ct(t-.01,a,r),ct(t,a+.01,u),ct(t,a-.01,c);const h=mt(yt([u[0]-c[0],u[1]-c[1],u[2]-c[2]],[e[0]-r[0],e[1]-r[1],e[2]-r[2]])),n=[0,0,0];ct(t,a,n);const i=[G.x0+tt[0]*t*ht,G.y0+tt[1]*t*ht,0],l=[n[0]-i[0],n[1]-i[1],n[2]-i[2]],p=Xe(h,l)<0?-1:1;o[0]=h[0]*p,o[1]=h[1]*p,o[2]=h[2]*p}function re(t){const a=t[0]-G.x0,o=t[1]-G.y0,s=(a*tt[0]+o*tt[1])/ht;if(s<-.05||s>1)return 1/0;const e=a-tt[0]*s*ht,r=o-tt[1]*s*ht,u=Q(G.r0,G.r1,Math.max(0,s));return Math.hypot(e,r,t[2])/u}const Te=(t,a=1)=>re(t)<a,Rt=(t,a,o)=>o*(1-X(1,a,t));function ta(t,a,o,s,e){let r=0;for(let i=0;i<t.length;i++)(e||!a[i])&&(r+=t[i]);const u=r/o,c=[];let h=s*u,n=0;for(let i=0;i<t.length;i++)if(!(!e&&a[i]))for(n+=t[i];h<n;)a[i]||c.push(i),h+=u;return c}function Po(t,a,o,s){return Math.min(a,o,s)*Math.sqrt((t[0]/a)**2+(t[1]/o)**2+(t[2]/s)**2)}function De(t,a,o,s,e,r,u,c,h,n){const i=o*3,l=new Float64Array(i),p=new Uint8Array(i),v=[0,0,0],g=[0,0,0];for(let L=0;L<i;L++)Se(L,i,v),e(v,g),l[L]=Po(v,s.a,s.b,s.c)*(n?n(g):1),p[L]=u(g)?1:0;const P=ta(l,p,o,c(),h),b=Math.sqrt(4*Math.PI/Math.max(1,P.length)),A={tone:0},E=[0,0,0],T=[0,0,0],F=[0,0,0],B=(L,y)=>r(L,y,A);for(const L of P){Se(L,i,v);const[y,M]=Ke(v),x=(c()-.5)*2*kt*b,D=(c()-.5)*2*kt*b,S=mt([v[0]+x*y[0]+D*M[0],v[1]+x*y[1]+D*M[1],v[2]+x*y[2]+D*M[2]]);e(S,g),!u(g)&&(r(S,E,A),Ht(e,S,T),Ht(B,S,F),Xe(F,T)<0&&(F[0]=-F[0],F[1]=-F[1],F[2]=-F[2]),t.push(E,T,F,A.tone,a,c()))}return P.length}function Eo(t,a,o){const s=a*3,e=Math.PI*(3-Math.sqrt(5)),r=new Float64Array(s),u=new Uint8Array(s),c=[0,0,0],h=new Float64Array(s),n=new Float64Array(s);for(let v=0;v<s;v++)h[v]=(v+.5)/s,n[v]=v*e,ct(h[v],n[v],c),r[v]=Q(G.r0,G.r1,h[v])/G.r0,u[v]=ne(c)||ie(c)?1:0;const i=ta(r,u,a,o(),!1),l=[0,0,0];let p=0;for(const v of i){const g=Math.min(1,Math.max(0,h[v]+(o()-.5)*kt*.06)),P=n[v]+(o()-.5)*kt*.5;if(ct(g,P,c),ne(c)||ie(c))continue;So(g,P,l);const b=.42+.12*wt(9*c[0],9*c[1],9*c[2],5);t.push(c,l,l,b,2,o()),p++}return p}function To(t=1){const a=fo(t),o=[],s=[],e=[],r=[],u=[],c=[],h={push(g,P,b,A,E,T){o.push(g[0]*Xt,g[1]*Xt,g[2]*Xt),s.push(P[0],P[1],P[2]),e.push(b[0],b[1],b[2]),r.push(A),u.push(E),c.push(T)}},n=()=>u.length,i=n();De(h,0,Kt.cerebrum,K,oe,(g,P,b)=>{Ao(g,t,P,b),b.tone=Math.max(b.tone,Rt(Je(P),1.15,.75),Rt(re(P),1.5,.7))},g=>Math.abs(g[2])<qe||ie(g,.98)||Te(g,.98),a,!0,g=>1+(uo-1)*Ze(g[0],g[1],g[2],t));const l=n();De(h,1,Kt.cerebellum,q,se,(g,P,b)=>{Mo(g,t,P,b),b.tone=Math.max(b.tone,Rt(Qe(P),1.08,.6),Rt(re(P),1.4,.55))},g=>ne(g)||Te(g),a,!1);const p=n();Eo(h,Kt.brainstem,a);const v=n();return{count:u.length,positions:new Float32Array(o),normals:new Float32Array(s),folds:new Float32Array(e),tones:new Float32Array(r),kinds:new Float32Array(u),seeds:new Float32Array(c),counts:{cerebrum:l-i,cerebellum:p-l,brainstem:v-p}}}const nn=1.05,Re=.19,Le=11,Fe=72,Do=3,Ro=.03,Lo=11,Fo=.5,Io=.32,Ie=.22,_o=1.45,te={gyrus:1.45,sulcus:1.95,base:1.4},_e={gyrus:.72,sulcus:.95},ze={gyrus:.5,sulcus:.15},Ce={alpha:.12,size:.6},zo=.45,Co=`
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
    float breath = 1.0 + ${Ro.toFixed(3)} * sin(uTime * aBreath.x + aBreath.y);
    vec3 p = (cos(ang) * aU + sin(ang) * aV) * breath;
    vec4 wp = modelMatrix * vec4(p, 1.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    float foc = (1.0 - smoothstep(0.0, 18.0, abs(dist - ${lt.toFixed(1)}))) * (1.0 - uDefocus);
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
`,Bo=`
  precision highp float;
  ${At}
  ${bt}
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
`,ko=`
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
    float foc = (1.0 - smoothstep(0.0, 18.0, abs(dist - ${lt.toFixed(1)}))) * (1.0 - uDefocus);
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
    float fore = mix(mix(${ze.gyrus.toFixed(2)}, 1.0, nz), mix(${ze.sulcus.toFixed(2)}, 1.0, nz), aTone);

    float size = aKind < 0.5 ? mix(${te.gyrus.toFixed(2)}, ${te.sulcus.toFixed(2)}, aTone) : ${te.base.toFixed(2)};
    size *= 0.85 + 0.3 * fract(aSeed * 7.31);
    size *= mix(${Ce.size.toFixed(2)}, 1.0, facing);
    float bokeh = 1.0 + (1.0 - foc) * 1.2;
    float px = clamp(size * uDpr * persp * 0.05 * bokeh, 0.75, 14.0 * uDpr);
    gl_PointSize = px;

    // Drawn from the top down with the orbits.
    float cut = 1.35 - 2.7 * uDraw;
    float drawn = smoothstep(cut - 0.3, cut, p.y);
    // The gyri light, with the paper showing through them; the sulci heavy.
    float base = mix(${_e.gyrus.toFixed(2)}, ${_e.sulcus.toFixed(2)}, aTone);
    // The rim is neither raised as on the orbits nor damped (the shoulder above already thins it); the flank of a gyrus
    // away from the lamp a little denser than the lit one.
    vAlpha = base * (0.04 + 0.96 * foc) / (bokeh * bokeh) * mix(1.0 - 0.2 * uLens, 1.5, lens) * fore * (0.92 + 0.16 * (1.0 - key)) * mix(${Ce.alpha.toFixed(2)}, 1.0, near) * drawn;
    vShade = key;
    vRim = rim;
    vFoc = foc;
    vLens = lens;
    vSeed = aSeed;
    vPx = px;
    vTone = aTone;
  }
`,Ho=`
  precision highp float;
  ${At}
  ${bt}
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
    vec3 sulcus = mix(AMBER, GRAPHITE_DEEP, ${zo.toFixed(2)});
    vec3 col = mix(AMBER, sulcus, min(1.0, vTone));
    col = mix(col, sulcus, (1.0 - vShade) * 0.3 * (1.0 - vTone) + vRim * 0.1);
    col = mix(col, GRAPHITE_DEEP, vLens * 0.3);
    gl_FragColor = vec4(col, min(1.0, a));
  }
`,Uo=typeof location<"u"&&location.search.includes("nobrain");function Oo(t,a){const o=To(a),s=new at;s.setAttribute("position",new O(o.positions,3)),s.setAttribute("aNormal",new O(o.normals,3)),s.setAttribute("aFold",new O(o.folds,3)),s.setAttribute("aTone",new O(o.tones,1)),s.setAttribute("aSeed",new O(o.seeds,1)),s.setAttribute("aKind",new O(o.kinds,1)),s.boundingSphere=new rt(new _,4);const e=new ot({vertexShader:ko,fragmentShader:Ho,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uDpr:t.uDpr,uLens:t.uLens,uDefocus:t.uDefocus,uLight:t.uLight,uPointer:t.uPointer,uAlpha:{value:1},uDraw:{value:1}}}),r=new xt;return r.add(new nt(s,e)),{group:r,mat:e,dispose(){s.dispose(),e.dispose()}}}function sn(t,a=5){let o=a*7919+13;const s=()=>(o=o*1664525+1013904223>>>0,o/4294967296),e=[],r=[],u=[],c=[],h=[],n=[],i=[],l=(S,C,k,f,d,m,w)=>{e.push(S.x,S.y,S.z),r.push(C.x,C.y,C.z),u.push(k),c.push(f),h.push(s()),n.push(d),i.push(m,w)},p=new _,v=new _,g=new _,P=new _;for(let S=0;S<Le;S++){const C=ra(S,Le);p.set(C[0],C[1],C[2]).normalize(),P.set(0,1,0),Math.abs(p.y)>.9&&P.set(1,0,0),v.crossVectors(p,P).normalize(),g.crossVectors(p,v).normalize();const k=s()*Math.PI*2,f=2*Math.PI/Lo,d=(s()-.5)*2*Fo;for(let z=0;z<Fe;z++)l(v,g,k+z/Fe*Math.PI*2+(s()-.5)*.02,0,0,f,d);const m=s()<.5?1:-1,w=(.22+.36*s())*m;for(let z=0;z<Do;z++)l(v,g,s()*Math.PI*2,w*(.85+.3*s()),1,f,d)}const b=new at,A=n.length;b.setAttribute("position",new O(new Float32Array(A*3),3)),b.setAttribute("aU",new Z(e,3)),b.setAttribute("aV",new Z(r,3)),b.setAttribute("aPhase",new Z(u,1)),b.setAttribute("aOmega",new Z(c,1)),b.setAttribute("aSeed",new Z(h,1)),b.setAttribute("aKind",new Z(n,1)),b.setAttribute("aBreath",new Z(i,2)),b.boundingSphere=new rt(new _,4);const E=new ot({vertexShader:Co,fragmentShader:Bo,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uTime:{value:0},uDpr:t.uDpr,uLens:t.uLens,uDefocus:t.uDefocus,uLight:t.uLight,uPointer:t.uPointer,uAlpha:{value:1},uDraw:{value:1}}}),T=Oo(t,a);T.group.visible=!Uo;const F=new xt;F.add(T.group),F.add(new nt(b,E));let B=0,L=1,y=0,M=0;const x=(S,C,k,f)=>S+(C-S)*(1-Math.exp(-3*f)),D={group:F,draw:1,update(S,C,k,f){L=x(L,f?_o:1,3,S),B+=S*C*L,E.uniforms.uTime.value=B,E.uniforms.uAlpha.value=.05+.95*k,E.uniforms.uDraw.value=D.draw,T.mat.uniforms.uAlpha.value=E.uniforms.uAlpha.value,T.mat.uniforms.uDraw.value=D.draw,y=x(y,Io+(f?f.y*Ie:0),3,S),M=x(M,f?-f.x*Ie:0,3,S),F.rotation.set(y,B*Re,M),T.group.rotation.y=-.4*B*Re},dispose(){T.dispose(),b.dispose(),E.dispose()}};return D}const No=8,$o=80,Lt=.012;function rn(t,a,o,s={}){const e={active:!1,hover:!1,lastX:0,lastY:0,spin:0,pinch:1,pinching:!1},r=new _,u=(y,M)=>{if(!t.visible)return!1;r.copy(t.position).project(a);const x=(r.x*.5+.5)*window.innerWidth,D=(-r.y*.5+.5)*window.innerHeight;return Math.hypot(y-x,M-D)<o()},c=y=>{y.pointerType==="touch"||!u(y.clientX,y.clientY)||(y.preventDefault(),e.active=!0,e.lastX=y.clientX,e.lastY=y.clientY,e.spin=0,document.body.style.cursor="grabbing")},h=y=>{if(y.pointerType==="touch")return;if(e.active){const x=y.clientX-e.lastX,D=y.clientY-e.lastY;t.rotation.y+=x*Lt,s.tilt!==!1&&(t.rotation.x=Math.max(-1.3,Math.min(.7,t.rotation.x+D*.008))),e.spin=x*Lt*40,e.lastX=y.clientX,e.lastY=y.clientY;return}const M=u(y.clientX,y.clientY);M!==e.hover&&(e.hover=M,document.body.style.cursor=M?"grab":"")},n=y=>{y.pointerType==="touch"||!e.active||(e.active=!1,document.body.style.cursor=e.hover?"grab":"")};window.addEventListener("pointerdown",c),window.addEventListener("pointermove",h),window.addEventListener("pointerup",n),window.addEventListener("pointercancel",n);const i=s.touch??null,l=new Map;let p="none";const v={x:0,y:0};let g=1,P=0,b=0,A=0;const E=()=>{const[y,M]=Array.from(l.values());return y&&M?Math.max(1,Math.hypot(y.x-M.x,y.y-M.y)):1},T=(y,M,x)=>{p="none",v.x=y,v.y=M,P=0,b=x,A=x},F=y=>{var M;if(y.pointerType==="touch"&&!((M=y.target)!=null&&M.closest("button, a"))){l.set(y.pointerId,{x:y.clientX,y:y.clientY});try{i==null||i.setPointerCapture(y.pointerId)}catch{}l.size===1?(e.spin=0,T(y.clientX,y.clientY,y.timeStamp)):l.size===2&&(e.active=!1,e.pinching=!0,e.pinch=1,g=E(),p="turn")}},B=y=>{const M=l.get(y.pointerId);if(!M)return;const x=M.x;if(M.x=y.clientX,M.y=y.clientY,l.size>=2){e.pinching&&(e.pinch=E()/g);return}if(p==="none"){const k=y.clientX-v.x,f=y.clientY-v.y;if(Math.hypot(k,f)<No)return;p=Math.abs(k)>1.5*Math.abs(f)?"turn":"scroll",p==="turn"&&(e.active=!0),b=y.timeStamp;return}if(p!=="turn")return;const D=y.clientX-x,S=Math.max(1,y.timeStamp-b)/1e3;b=y.timeStamp,A=y.timeStamp,t.rotation.y+=D*Lt;const C=D*Lt/S;P+=(C-P)*.5},L=y=>{var M;if(l.has(y.pointerId)){if(l.delete(y.pointerId),e.pinching&&l.size<2){e.pinching=!1;const x=e.pinch;e.pinch=1,(M=s.onPinchEnd)==null||M.call(s,x);const D=Array.from(l.values())[0];D?T(D.x,D.y,y.timeStamp):p="none";return}l.size===0&&(e.active&&(e.active=!1,e.spin=y.timeStamp-A>$o?0:P),p="none")}};return i&&(i.addEventListener("pointerdown",F),i.addEventListener("pointermove",B),i.addEventListener("pointerup",L),i.addEventListener("pointercancel",L)),{get active(){return e.active},get hover(){return e.hover},get spin(){return e.spin},set spin(y){e.spin=y},get pinch(){return e.pinch},get pinching(){return e.pinching},dispose(){window.removeEventListener("pointerdown",c),window.removeEventListener("pointermove",h),window.removeEventListener("pointerup",n),window.removeEventListener("pointercancel",n),i&&(i.removeEventListener("pointerdown",F),i.removeEventListener("pointermove",B),i.removeEventListener("pointerup",L),i.removeEventListener("pointercancel",L)),(e.hover||e.active)&&(document.body.style.cursor="")}}}const Vo=8,Go=700;function ln(t,a,o,s){const e={hover:!1,down:null},r=new _,u=new _,c=new ut,h=new ke,n=new na,i=new _,l=()=>{if(!t.visible)return null;const E=o();if(E<=0)return null;u.copy(t.position).applyMatrix4(a.matrixWorldInverse);const T=-u.z;if(T<=.1)return null;r.copy(t.position).project(a);const F=window.innerHeight/2/(Math.tan(a.fov*Math.PI/360)*T);return{x:(r.x*.5+.5)*window.innerWidth,y:(-r.y*.5+.5)*window.innerHeight,r:E*F}},p=(E,T)=>{const F=l();return!!F&&Math.hypot(E-F.x,T-F.y)<F.r},v=(E,T)=>!p(E,T)||(c.set(E/window.innerWidth*2-1,-(T/window.innerHeight)*2+1),h.setFromCamera(c,a),n.setFromNormalAndCoplanarPoint(a.getWorldDirection(u),t.position),!h.ray.intersectPlane(n,i))?!1:(t.worldToLocal(i),s(i.clone()),!0),g=E=>{p(E.clientX,E.clientY)&&(e.down={x:E.clientX,y:E.clientY,t:performance.now(),id:E.pointerId})},P=E=>{if(E.pointerType==="touch")return;const T=!e.down&&p(E.clientX,E.clientY);T!==e.hover&&(e.hover=T,T?document.body.style.cursor="pointer":document.body.style.cursor==="pointer"&&(document.body.style.cursor=""))},b=E=>{const T=e.down;!T||E.pointerId!==T.id||(e.down=null,!(Math.hypot(E.clientX-T.x,E.clientY-T.y)>Vo||performance.now()-T.t>Go)&&v(E.clientX,E.clientY))},A=()=>{e.down=null};return window.addEventListener("pointerdown",g),window.addEventListener("pointermove",P),window.addEventListener("pointerup",b),window.addEventListener("pointercancel",A),{get hover(){return e.hover},at:v,onScreen:l,dispose(){window.removeEventListener("pointerdown",g),window.removeEventListener("pointermove",P),window.removeEventListener("pointerup",b),window.removeEventListener("pointercancel",A),e.hover&&document.body.style.cursor==="pointer"&&(document.body.style.cursor="")}}}function Wo(t,a){const o=a.stride;if(t.byteLength%o!==0)throw new Error(`umap: ${t.byteLength} bytes is not a multiple of ${o}`);const s=t.byteLength/o,e=new DataView(t),r=new Float32Array(s*3),u=new Float32Array(s),c=new Float32Array(s*3),h=new Float32Array(s);for(let n=0;n<s;n++){const i=n*o;r[n*3]=e.getInt16(i,!0)/32767,r[n*3+1]=e.getInt16(i+2,!0)/32767,r[n*3+2]=e.getInt16(i+4,!0)/32767,u[n]=e.getUint8(i+6),c[n*3]=e.getUint8(i+7)/255,c[n*3+1]=e.getUint8(i+8)/255,c[n*3+2]=e.getUint8(i+9)/255,h[n]=(n*2654435761>>>0)/4294967296}return{n:s,position:r,state:u,expr:c,seed:h}}async function jo(t){const a=await fetch(`${t}umap/manifest.json`).then(s=>s.json()),o=await fetch(`${t}umap/cells.bin`).then(s=>s.arrayBuffer());return{manifest:a,cells:Wo(o,a)}}const qo=600,Xo=12,Be=.035,Ko=`
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
    float foc = (1.0 - smoothstep(0.0, 14.0, abs(dist - ${lt.toFixed(1)}))) * (1.0 - uDefocus);
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
`,Yo=`
  precision highp float;
  ${bt}
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
`;function cn(t,a){const o=new xt,s=new ot({vertexShader:Ko,fragmentShader:Yo,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uSize:t.uSize,uDpr:t.uDpr,uLens:t.uLens,uDefocus:t.uDefocus,uPointer:t.uPointer,uAlpha:t.uAlpha,uReveal:{value:0},uMode:{value:0},uPrevMode:{value:0},uWave:{value:10},uWaveOrigin:{value:new _},uFocusState:{value:-1},uHover:{value:new _(99,99,99)},uMaxPx:{value:9}}});let e=null,r=null,u=null,c=null,h=!1;const n={group:o,ready:!1,manifest:null,reveal:0,maxPx:9,spin:.12,hoverEnabled:!0,labelsEnabled:!0,labelFade:1,update:F,dispose(){h=!0,e==null||e.dispose(),s.dispose()}};jo(a).then(({manifest:B,cells:L})=>{h||(e=new at,e.setAttribute("position",new O(L.position,3)),e.setAttribute("aState",new O(L.state,1)),e.setAttribute("aExpr",new O(L.expr,3)),e.setAttribute("aSeed",new O(L.seed,1)),e.boundingSphere=new rt(new _,1.8),o.add(new nt(e,s)),r=L.position,u=L.state,c=L.expr,n.manifest=B,n.ready=!0,j.count=B.n,j.ready=!0)}).catch(B=>console.warn("umap: data not loaded",B));const i=B=>Math.max(0,ue.indexOf(B));let l=j.changedAt;const p=new _,v=new sa,g=new ke,P=new ia,b=new _,A=new ut;let E=0,T=-1;function F(B,L,y,M,x){var k;const D=s.uniforms;D.uReveal.value=n.reveal,D.uMaxPx.value=n.maxPx,D.uMode.value=i(j.mode),D.uPrevMode.value=i(j.prevMode),D.uFocusState.value=j.focusState,x&&(o.rotation.y+=B*n.spin*L),j.changedAt!==l&&(l=j.changedAt,p.set(t.uPointer.value.x,t.uPointer.value.y,o.position.z),Math.abs(p.x)>90&&p.set(0,0,o.position.z),o.worldToLocal(p),p.clampLength(0,1.2),D.uWaveOrigin.value.copy(p));const S=(performance.now()-j.changedAt)/qo;if(D.uWave.value=la.reducedMotion?10:Math.min(10,S*3.2),!n.ready||!r||!u||!c||!n.manifest)return;E+=B;const C=n.hoverEnabled&&M&&o.visible&&n.reveal>.5;if(C&&E>1/Xo){E=0,A.set(M.x,M.y),g.setFromCamera(A,y),P.copy(o.matrixWorld).invert(),v.copy(g.ray).applyMatrix4(P);const f=o.scale.x||1,d=Be*8/Math.max(f,.01);let m=-1,w=Math.min(d,Be*4),z=1/0;for(let I=0;I<r.length/3;I++){b.set(r[I*3],r[I*3+1],r[I*3+2]);const H=b.clone().sub(v.origin).dot(v.direction);if(H<0)continue;const U=v.distanceToPoint(b);(U<w||U<w*1.15&&H<z-.2)&&(m=I,w=U,z=H)}T=m}if(C||(T=-1),T>=0){D.uHover.value.set(r[T*3],r[T*3+1],r[T*3+2]);const f=(M.x+1)/2*window.innerWidth,d=(1-M.y)/2*window.innerHeight,m=((k=n.manifest.states[u[T]])==null?void 0:k.name)??"",w=j.mode,z=ue.indexOf(w)-1,I=z<0?m:`${w} ${(c[T*3+z]*n.manifest.p99[z]).toFixed(2)}`;j.hover={text:I,x:f,y:d}}else D.uHover.value.set(99,99,99),j.hover&&(j.hover=null);if(n.labelsEnabled&&o.visible){const f=b.setFromMatrixPosition(y.matrixWorld).clone();j.labels=n.manifest.states.map(d=>{const m=new _(d.centroid[0],d.centroid[1],d.centroid[2]);o.localToWorld(m);const w=m.distanceTo(f),z=1-Math.min(1,Math.abs(w-lt)/14);m.project(y);const I=m.z>1;return{text:d.name,state:d.id,x:(m.x+1)/2*window.innerWidth,y:(1-m.y)/2*window.innerHeight,opacity:I?0:n.reveal*n.labelFade*(.15+.85*z)*(j.focusState<0||j.focusState===d.id?1:.35)}})}else j.labels.length&&(j.labels=[])}return n}export{en as C,nn as E,ca as L,At as P,bt as S,Ga as a,on as b,an as c,sn as d,cn as e,tn as f,ln as g,rn as h,Jo as m};
