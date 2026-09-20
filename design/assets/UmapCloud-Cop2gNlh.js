var we=Object.defineProperty;var ye=(a,t,o)=>t in a?we(a,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):a[t]=o;var Pt=(a,t,o)=>ye(a,typeof t!="symbol"?t+"":t,o);import{V as I,B as Y,a as V,S as et,b as Z,c as at,P as J,G as Mt,F as q,D as xe,R as Ae,f as Me,N as Ut,g as le,h as Se,i as be,M as Pe}from"./three-CdPaaKdt.js";import{D as nt,n as Gt,T as Tt,a as Vt,o as Te,q as Ee,u as N,s as De,U as $t}from"./index-DcxQnJYF.js";const j=624,ut=397,Et=2567483615,Dt=2147483648,Lt=2147483647;class Le{constructor(t){Pt(this,"mt",new Uint32Array(j));Pt(this,"mti",j+1);if(!Number.isInteger(t)||t<0)throw new Error("PyRandom: seed must be a non-negative integer");const o=[];let s=t;do o.push(s%4294967296),s=Math.floor(s/4294967296);while(s>0);this.initByArray(o)}initGenrand(t){const o=this.mt;o[0]=t>>>0;for(let s=1;s<j;s++){const n=o[s-1]^o[s-1]>>>30;o[s]=Math.imul(1812433253,n)+s>>>0}this.mti=j}initByArray(t){const o=this.mt;this.initGenrand(19650218);let s=1,n=0;for(let h=Math.max(j,t.length);h>0;h--){const v=o[s-1]^o[s-1]>>>30;o[s]=(o[s]^Math.imul(v,1664525))+t[n]+n>>>0,s++,n++,s>=j&&(o[0]=o[j-1],s=1),n>=t.length&&(n=0)}for(let h=j-1;h>0;h--){const v=o[s-1]^o[s-1]>>>30;o[s]=(o[s]^Math.imul(v,1566083941))-s>>>0,s++,s>=j&&(o[0]=o[j-1],s=1)}o[0]=2147483648}genrandInt32(){const t=this.mt;let o;if(this.mti>=j){let s=0;for(;s<j-ut;s++)o=t[s]&Dt|t[s+1]&Lt,t[s]=t[s+ut]^o>>>1^(o&1?Et:0);for(;s<j-1;s++)o=t[s]&Dt|t[s+1]&Lt,t[s]=t[s+(ut-j)]^o>>>1^(o&1?Et:0);o=t[j-1]&Dt|t[0]&Lt,t[j-1]=t[ut-1]^o>>>1^(o&1?Et:0),this.mti=0}return o=t[this.mti++],o^=o>>>11,o^=o<<7&2636928640,o^=o<<15&4022730752,o^=o>>>18,o>>>0}random(){const t=this.genrandInt32()>>>5,o=this.genrandInt32()>>>6;return(t*67108864+o)/9007199254740992}uniform(t,o){return t+(o-t)*this.random()}}const ce=.22,pt=(a,t)=>[a[0]+t[0],a[1]+t[1],a[2]+t[2]],Re=(a,t)=>[a[0]-t[0],a[1]-t[1],a[2]-t[2]],vt=(a,t)=>[a[0]*t,a[1]*t,a[2]*t],Ht=a=>Math.hypot(a[0],a[1],a[2]),Rt=a=>{const t=Ht(a);return t>0?vt(a,1/t):[0,0,0]};function Ie(a=7,t=10,o=5,s=.72){const n=new Le(a),h=[[0,0,0]],v=[],u=[ce],c=(r,i,m,A,M,P)=>{if(P<=0||A<.02)return;let E=Rt(m),g=[i[0],i[1],i[2]],S=r;const D=3;for(let F=0;F<D;F++){const z=P>3?.32:.48;E=Rt(pt(E,[n.uniform(-z,z),n.uniform(-z,z),n.uniform(-z,z)])),g=pt(g,vt(E,A/D)),h.push([g[0],g[1],g[2]]);const y=h.length-1,x=(F+1)/D;u.push(Math.max(.004,M*(1-.5*x))),v.push([S,y]),S=y}if(P===1){h.push(pt(g,vt(E,A*.28))),u.push(.0035),v.push([S,h.length-1]);return}const C=P>=4?3:n.random()<.82?2:3;for(let F=0;F<C;F++){const z=Rt(pt(E,[n.uniform(-1,1),n.uniform(-1,1),n.uniform(-1,1)])),y=A*n.uniform(.52,.64);c(S,g,z,y,M*.58,P-1)}};for(let r=0;r<t;r++){const i=1-r/Math.max(1,t-1)*2,m=Math.sqrt(Math.max(0,1-i*i)),A=r*2.399963,M=[Math.cos(A)*m,i,Math.sin(A)*m],P=vt(M,.24);h.push(P),u.push(.042),v.push([0,h.length-1]);const E=s*n.uniform(.85,1.15);c(h.length-1,P,M,E,.04,o)}let e=0;for(const r of h)e=Math.max(e,Ht(r));return{verts:h,edges:v,radii:u,bound:e+.06}}const ze=a=>[a[0],a[2],-a[1]];function _e(a){const t=new Map;for(const[u,c]of a.edges)t.has(u)||t.set(u,[]),t.get(u).push(c);const o=[],s=(u,c)=>{c.push(u);const e=t.get(u)??[];if(e.length===1)s(e[0],c);else{o.push(c);for(const r of e)s(r,[u])}};for(const u of t.get(0)??[])s(u,[0]);const n=o.map((u,c)=>{const e=u[0]===0?u.slice(1):u,r=e.map(M=>ze(a.verts[M])),i=new Float32Array(r.length*3),m=new Float32Array(r.length);let A=0;return r.forEach((M,P)=>{i.set(M,P*3),P>0&&(A+=Ht(Re(M,r[P-1]))),m[P]=A}),{id:c,points:i,cum:m,length:A,radius0:a.radii[e[0]],radius1:a.radii[e[e.length-1]],depth:0,parent:-1,children:[],isTip:!0}}),h=new Map;o.forEach((u,c)=>h.set(u[u.length-1],c)),o.forEach((u,c)=>{if(u[0]===0)return;const e=h.get(u[0]);e!==void 0&&(n[c].parent=e,n[e].children.push(c),n[e].isTip=!1)});const v=u=>n[u].parent<0?0:v(n[u].parent)+1;return n.forEach((u,c)=>u.depth=v(c)),{branches:n,soma:ce,bound:a.bound}}function qa(a=7,t=10,o=5,s=.72){return _e(Ie(a,t,o,s))}const St=`
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
`,Ot=`
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
`,Fe=new I(-.5,.75,.45).normalize();function Ya(){return{uDefocus:{value:0},uLight:{value:Fe.clone()}}}const Ce=`
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
    float persp = ${nt.toFixed(1)} / max(dist, 1.0);
    gl_PointSize = clamp(uPx * uDpr * persp * (0.7 + 0.6 * fract(aSeed * 7.31)), 1.0, 96.0 * uDpr);
    vA = 1.0 - smoothstep(0.55, 1.0, length(position.xy));
    vSeed = aSeed;
  }
`,Be=`
  precision highp float;
  ${St}
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
`,It=20,Wt={x:.16,y:-.22},ke=.011;function Za(a,t=1){let o=t*7919+13;const s=()=>(o=o*1664525+1013904223>>>0,o/4294967296),n=()=>Math.sqrt(-2*Math.log(1-s()))*Math.cos(2*Math.PI*s()),h=new Float32Array(It*3),v=new Float32Array(It);for(let r=0;r<It;r++)h[r*3]=n()*.5,h[r*3+1]=n()*.5,h[r*3+2]=0,v[r]=s();const u=new Y;u.setAttribute("position",new V(h,3)),u.setAttribute("aSeed",new V(v,1)),u.boundingSphere=new et(new I,30);const c=new Z({vertexShader:Ce,fragmentShader:Be,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uDpr:a.uDpr,uAlpha:a.uAlpha,uRadius:{value:new at(1,1)},uPx:{value:40},uStrength:{value:0}}}),e=new J(u,c);return e.frustumCulled=!1,e.renderOrder=-1,{points:e,place(r,i,m,A=60){e.position.set(r.x+i*Wt.x,r.y+m*Wt.y,r.z),c.uniforms.uRadius.value.set(i,m),c.uniforms.uPx.value=Math.max(i,m)*A*.9},update(r){c.uniforms.uStrength.value=ke*Math.max(0,Math.min(1,r)),e.visible=r>.01},dispose(){u.dispose(),c.dispose()}}}const st=3.3,ue=1.3,Ja={radius:st,halfHeight:4.2},He=.36,gt=12,ht=a=>.78+.42*Math.pow(a/.95,2),zt=a=>.22+.3*Math.pow(a/.95,2),Oe=[.5,.17,-.17,-.5],Ue=`
  attribute float aSeed;
  attribute float aKind;     // 0 membrane head, 1 tail dot, 2 outer wall, 3 pore wall
  attribute vec3 aNormal;    // the surface normal, object space
  uniform float uTime;
  uniform float uDpr;
  uniform float uLens;
  uniform float uDefocus;
  uniform vec3 uLight;
  uniform vec2 uPointer;
  uniform vec3 uIons[${gt}];
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
    for (int i = 0; i < ${gt}; i++) {
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
    float foc = (1.0 - smoothstep(0.0, 18.0, abs(dist - ${nt.toFixed(1)}))) * (1.0 - uDefocus);
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
`,Ge=`
  precision highp float;
  ${St}
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
`,Ve=`
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
`,$e=`
  precision highp float;
  ${Ot}
  uniform float uAlpha;
  varying float vA;
  void main() {
    vec3 col;
    float edge = sphere(gl_PointCoord, col);
    float a = edge * vA * uAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(col, min(1.0, a));
  }
`;function rt(a,t,o,s,n,h,v,u){const c=Math.hypot(h,v,u)||1;a.pos.push(t,o,s),a.seed.push(Math.random()),a.kind.push(n),a.normal.push(h/c,v/c,u/c)}function We(a,t=ue){const n=Math.ceil(st/.20351),h=Math.ceil(st/.235);for(let v=-n;v<=n;v++)for(let u=-h;u<=h;u++){const c=u*.235+(v%2?.1175:0)+(Math.random()-.5)*.05,e=v*.20351+(Math.random()-.5)*.05,r=Math.hypot(c,e);if(r>st||r<t)continue;const i=st*.78;if(!(r>i&&Math.random()<(r-i)/(st-i)))for(const m of[1,-1]){const A=m*He+(Math.random()-.5)*.03;rt(a,c,A,e,0,0,m,0);for(let M=1;M<=4;M++){const P=M/4.6;rt(a,c+(Math.random()-.5)*.05,A-m*(.07+.26*P),e+(Math.random()-.5)*.05,1,0,m,0)}}}}function Ne(a){const t=7*Math.PI/180,o=Math.PI/2,s=110;for(let n=0;n<=s;n++){const h=-.95+1.9*n/s,v=ht(h),u=(ht(h+.01)-ht(h-.01))/.02,c=Math.round(2*Math.PI*v/.036);for(let i=0;i<c;i++){const m=i/c*Math.PI*2+n%2*(Math.PI/c);if((m%o+o)%o<t||(m%o+o)%o>o-t)continue;const M=.02,P=Math.cos(m),E=Math.sin(m);rt(a,P*v+(Math.random()-.5)*M,h+(Math.random()-.5)*M,E*v+(Math.random()-.5)*M,2,P,-u,E)}const e=zt(h),r=Math.round(2*Math.PI*e/.042);for(let i=0;i<r;i++){const m=i/r*Math.PI*2+n%2*(Math.PI/r),A=Math.cos(m),M=Math.sin(m);rt(a,A*e,h,M*e,3,-A,.2,-M)}}for(const n of[-.95,.95])for(let h=0;h<8;h++){const v=h/7,u=zt(n)+(ht(n)-zt(n))*v,c=Math.round(2*Math.PI*u/.042);for(let e=0;e<c;e++){const r=e/c*Math.PI*2,i=(r%o+o)%o;i<t||i>o-t||rt(a,Math.cos(r)*u,n,Math.sin(r)*u,2,0,n>0?1:-1,0)}}}const Nt=10,ot=8,jt=3.9,je=-4;function Qa(a,t="research",o={}){const s=o.channel!==!1,n=s?Gt.register(t):()=>{},h=new Mt,v=[],u={pos:[],seed:[],kind:[],normal:[]};We(u,s?ue:0),s&&Ne(u);const c=new Y;c.setAttribute("position",new q(u.pos,3)),c.setAttribute("aSeed",new q(u.seed,1)),c.setAttribute("aKind",new q(u.kind,1)),c.setAttribute("aNormal",new q(u.normal,3)),c.boundingSphere=new et(new I,12);const e=Array.from({length:gt},()=>new I(0,99,0)),r=new Z({vertexShader:Ue,fragmentShader:Ge,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uTime:{value:0},uDpr:a.uDpr,uLens:a.uLens,uDefocus:a.uDefocus,uLight:a.uLight,uPointer:a.uPointer,uAlpha:{value:1},uIons:{value:e},uIonCount:{value:0}}});h.add(new J(c,r)),v.push(c,r);const i=Nt*(1+ot),m=new Float32Array(i*3),A=new Float32Array(i),M=new Float32Array(i),P=new Y;P.setAttribute("position",new V(m,3)),P.setAttribute("aSize",new V(A,1)),P.setAttribute("aAlpha",new V(M,1)),P.boundingSphere=new et(new I,20);const E=new Z({vertexShader:Ve,fragmentShader:$e,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uDpr:a.uDpr,uAlpha:{value:1},uBoost:{value:1}}}),g=new J(P,E);g.visible=s,h.add(g),v.push(P,E);const S=[],D=(x,w)=>{x.y=jt,x.angle=Math.random()*Math.PI*2,x.radius=.9+Math.random()*.5,x.delay=w,x.dwell=.55+Math.random()*.35,x.gap=.28+Math.random()*.17,x.trail=[]};for(let x=0;x<Nt;x++){const w={y:jt,angle:0,radius:0,delay:0,dwell:.78,gap:.34,trail:[]};D(w,x*.7),S.push(w)}let C=0;const F=(x,w)=>{if(Math.abs(x)>.95)return 1.15;let _=.62;for(const L of Oe)_*=1-w*Math.exp(-Math.pow((x-L)/.07,2));return _},y={group:h,ionBoost:1,update:(x,w,_,L=_)=>{if(r.uniforms.uTime.value+=x*w,r.uniforms.uAlpha.value=.05+.95*_,E.uniforms.uAlpha.value=.1+.9*Math.max(_,L),E.uniforms.uBoost.value=y.ionBoost,!s)return;C+=x;const H=C>.04;H&&(C=0);const O=S.map((f,d)=>d).sort((f,d)=>S[f].y-S[d].y);O.forEach((f,d)=>{const l=S[f];if(l.delay>0){l.delay-=x*w;return}let T=x*F(l.y,l.dwell)*w;if(d>0){const k=S[O[d-1]],U=l.y-k.y,$=Math.abs(l.y)<1.4?l.gap:.55;U-T<$&&(T=Math.max(0,U-$))}const b=l.y;l.y-=T,b>0&&l.y<=0&&Gt.emit({time:performance.now(),rig:t,ion:f}),l.angle+=x*(1.1+.3*Math.sin(f))*w;const B=Math.abs(l.y)<1?0:Math.min(1.4,(Math.abs(l.y)-1)*.55+.05);l.radius+=(B-l.radius)*Math.min(1,x*5),l.y<je&&D(l,.4+Math.random()*1.2)});let p=0;S.forEach((f,d)=>{const l=f.delay<=0,T=Math.cos(f.angle)*f.radius,b=Math.sin(f.angle)*f.radius;H&&l&&(f.trail.unshift(T,f.y,b),f.trail.length>ot*3&&(f.trail.length=ot*3)),l&&Math.abs(f.y)<1.5&&p<gt&&e[p++].set(T,f.y,b);const B=l?Math.max(0,Math.min(1,(4.2-Math.abs(f.y))/.9)):0,k=Math.abs(f.y)<.95?1:0,U=d*(1+ot);m[U*3]=T,m[U*3+1]=f.y,m[U*3+2]=b,A[U]=9.5+k*2.5,M[U]=B;for(let $=0;$<ot;$++){const R=U+1+$,G=$*3,W=f.trail.length>G+2;m[R*3]=W?f.trail[G]:T,m[R*3+1]=W?f.trail[G+1]:f.y,m[R*3+2]=W?f.trail[G+2]:b;const X=1-($+1)/(ot+1);A[R]=1.6+4.6*X,M[R]=W?B*X*.32:0}}),r.uniforms.uIonCount.value=p,P.attributes.position.needsUpdate=!0,P.attributes.aSize.needsUpdate=!0,P.attributes.aAlpha.needsUpdate=!0},dispose:()=>{n(),v.forEach(x=>x.dispose())}};return y}const Ke=.45,Xe=.2,ft=18,Kt=36,qe=.9,Ye=4,_t=.35,dt=.3,Ze=1.5,Je=.8,Qe=.6,ta=.7,ea=.3;function aa(a){return()=>{a|=0,a=a+1831565813|0;let t=Math.imul(a^a>>>15,1|a);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function Xt(a,t={}){const o=a.branches.length,s=aa(t.seed??1),n=t.motility??1,h=t.tempo??1,v=qe*(t.reach??1),u=new Float32Array(o),c=new Float32Array(o),e=new Float32Array(o),r=new Float32Array(o),i=new Float32Array(o),m=new Float32Array(o*3);a.branches.forEach((C,F)=>{u[F]=C.isTip?Ke:C.depth===4?Xe:0,c[F]=2*Math.PI/(ft+s()*(Kt-ft)),e[F]=2*Math.PI/(ft+s()*(Kt-ft)),r[F]=s()*Math.PI*2,i[F]=s()*Math.PI*2;const z=C.points.length-3;m[F*3]=C.points[z],m[F*3+1]=C.points[z+1],m[F*3+2]=C.points[z+2]});const A=new Float32Array(o).fill(1),M=new Float32Array(o*3),P=new Uint8Array(o),E=[];let g=0;const S={ext:A,disp:M,somaScale:1,thickness:1,update:D};function D({dt:C,motion:F,pointer:z,activation:y}){if(F<=0||C<=0)return;if(g+=C*F*h,P.fill(0),z){E.length=0;for(let w=0;w<o;w++){if(!a.branches[w].isTip)continue;const _=Math.hypot(z[0]-m[w*3],z[1]-m[w*3+1],z[2]-m[w*3+2]);_<v&&E.push({i:w,d:_})}E.sort((w,_)=>w.d-_.d);for(let w=0;w<Math.min(Ye,E.length);w++)P[E[w].i]=1}const x=Math.max(0,Math.min(1,y));for(let w=0;w<o;w++){const _=a.branches[w],L=.6*Math.sin(c[w]*g+r[w])+.4*Math.sin(e[w]*g+i[w]);let H=P[w]?1:1-u[w]*n*(.5+.5*L);_.depth>=2&&(H*=1-Qe*x);const O=P[w]?Ze:Je,p=1-Math.exp(-O*C*F);A[w]+=(H-A[w])*p,A[w]<0&&(A[w]=0),A[w]>1&&(A[w]=1);let f=0,d=0,l=0;if(P[w]&&z){f=(z[0]-m[w*3])*_t,d=(z[1]-m[w*3+1])*_t,l=(z[2]-m[w*3+2])*_t;const T=Math.hypot(f,d,l);T>dt&&(f*=dt/T,d*=dt/T,l*=dt/T)}M[w*3]+=(f-M[w*3])*p,M[w*3+1]+=(d-M[w*3+1])*p,M[w*3+2]+=(l-M[w*3+2])*p}S.somaScale=1+ta*x,S.thickness=1+ea*x}return S}const pe=1.2,wt=.6,he=.12,fe=.36,yt=.55,xt=4,qt=2.5,na=6.5,Yt=10,oa=8,sa=3,de=4,ia=.16,ra=.03,Ft=320,la=40;function me(a){const t=a.branches,o=t.length,s=new Float32Array(o).fill(-1),n=new Float32Array(o),h=new Int32Array(o),v=c=>{if(s[c]>=0)return s[c];const e=t[c];return e.parent<0?(s[c]=Math.hypot(e.points[0],e.points[1],e.points[2]),h[c]=c):(s[c]=v(e.parent)+t[e.parent].length,h[c]=h[e.parent]),s[c]};let u=0;for(let c=0;c<o;c++)n[c]=v(c)+t[c].length,n[c]>u&&(u=n[c]);return{rootDist:s,endDist:n,root:h,maxDist:u}}function ca(a,t){let o=-1,s=1/0;for(const n of a.branches){if(!n.isTip)continue;const h=n.points.length-3,v=Math.hypot(t[0]-n.points[h],t[1]-n.points[h+1],t[2]-n.points[h+2]);v<s&&(s=v,o=n.id)}return o}function ua(a,t,o){const s=a.branches,n=s.length,h=new Uint8Array(n);for(let i=o;i>=0;i=s[i].parent)h[i]=1;const v=t.root[o],u=s[v].points,c=[u[0],u[1],u[2]],e=t.rootDist[v],r=new Float32Array(n);for(let i=0;i<n;i++){if(t.root[i]!==v){const A=s[t.root[i]].points,M=Math.hypot(A[0]-c[0],A[1]-c[1],A[2]-c[2]);r[i]=(e+t.rootDist[t.root[i]]-M)/2;continue}let m=i;for(;!h[m];)m=s[m].parent;r[i]=t.endDist[m]}return{tip:o,tipDist:t.endDist[o],junction:r,entry:c,entryDist:e}}const pa=(a,t,o)=>Math.abs(o-a.junction[t])+(a.tipDist-a.junction[t]),ve=a=>{const t=a<0?0:a>1?1:a;return t*t*(3-2*t)};function Zt(a,t,o=!1){if(t<0)return 0;if(o)return yt*Math.exp(-t/xt);const s=t-pe;if(s<=0)return 0;const n=a-wt*s,h=n>0?1-ve(n/he):Math.exp(n/fe),v=n<0?yt*Math.exp(n/(wt*xt)):0;return Math.min(1,v+(1-v)*h)}function ha(a,t=!1){return a<0?0:a>=Yt?Math.exp(-(a-Yt)/oa):t?1:ve((a-qt)/(na-qt))}function At(a){return()=>{a|=0,a=a+1831565813|0;let t=Math.imul(a^a>>>15,1|a);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}const Jt=a=>a.toFixed(3),fa=`
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
    vec3 p = uOrigin + position * (${Jt(ia)} * sqrt(t)) + uDrift * t;
    p += vec3(sin(t * 3.1 + aSeed * 40.0), cos(t * 2.7 + aSeed * 30.0), sin(t * 2.3 + aSeed * 20.0)) * 0.012 * sqrt(t);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    float foc = 1.0 - smoothstep(0.0, 18.0, abs(dist - ${nt.toFixed(1)}));
    float persp = 300.0 / max(dist, 1.0);
    gl_PointSize = clamp((1.3 + 1.4 * fract(aSeed * 7.31)) * uDpr * persp * 0.045 * (1.0 + (1.0 - foc) * 1.2), 0.75, 6.0 * uDpr);
    float fade = smoothstep(0.0, 0.12, t) * (1.0 - smoothstep(1.2, ${Jt(de)}, t));
    vA = fade * (0.45 + 0.4 * fract(aSeed * 3.3)) * (0.04 + 0.96 * foc) * uReveal;
  }
`,da=`
  precision highp float;
  uniform float uAlpha;
  varying float vA;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.2, r) * vA * uAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(0.776, 0.486, 0.149, a);
  }
`;function ma(a,t=1){const o=At(t*17+3),s=()=>Math.sqrt(-2*Math.log(1-o()))*Math.cos(2*Math.PI*o()),n=new Float32Array(Ft*3),h=new Float32Array(Ft);for(let i=0;i<Ft;i++)n[i*3]=s(),n[i*3+1]=s(),n[i*3+2]=s(),h[i]=o();const v=new Y;v.setAttribute("position",new V(n,3)),v.setAttribute("aSeed",new V(h,1));const u=new Z({vertexShader:fa,fragmentShader:da,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uT:{value:-1},uOrigin:{value:new I},uDrift:{value:new I},uDpr:a.uDpr,uAlpha:a.uAlpha,uReveal:{value:1}}}),c=new J(v,u);c.frustumCulled=!1,c.visible=!1;const e=At(t*5+11);let r=-1;return{points:c,get t(){return r},start(i){r=0,u.uniforms.uOrigin.value.set(i.x,i.y,i.z),u.uniforms.uDrift.value.set(e()-.5,e()-.5,e()-.5).normalize().multiplyScalar(ra)},update(i,m,A){r>=0&&(r+=i*m,r>de&&(r=-1)),u.uniforms.uT.value=r,u.uniforms.uReveal.value=A,c.visible=r>=0},dispose(){v.dispose(),u.dispose()}}}const Bt=.12,ge=2e4,Qt=12;function va(a,t=ge,o=1){const s=At(o),n=Math.round(t*Bt),h=t-n,v=a.branches.map(L=>L.length*(L.radius0+L.radius1)*.5),u=v.reduce((L,H)=>L+H,0),c=me(a),e=new Float32Array(t*3),r=new Float32Array(t),i=new Float32Array(t),m=new Float32Array(t),A=new Float32Array(t),M=new Float32Array(t),P=new Float32Array(t*3),E=new Float32Array(t);let g=0;for(;g<n;g++){const L=s()*2-1,H=s()*Math.PI*2,O=Math.sqrt(1-L*L),p=s(),f=a.soma*(.85+.3*p);e[g*3]=O*Math.cos(H)*f,e[g*3+1]=L*f,e[g*3+2]=O*Math.sin(H)*f,P[g*3]=O*Math.cos(H),P[g*3+1]=L,P[g*3+2]=O*Math.sin(H),E[g]=p,r[g]=-1,i[g]=0,m[g]=s(),A[g]=1,M[g]=0}const S=v.map(L=>h*L/u),D=S.map(Math.floor);let C=h-D.reduce((L,H)=>L+H,0);const F=S.map((L,H)=>({k:H,frac:L-Math.floor(L)})).sort((L,H)=>H.frac-L.frac);for(let L=0;C>0&&L<F.length;L++,C--)D[F[L].k]++;const z=new I,y=new I,x=new I,w=new I(0,1,0),_=new I;return a.branches.forEach((L,H)=>{const O=L.points.length/3;for(let p=0;p<D[H];p++,g++){const f=s(),d=f*L.length;let l=0;for(;l<O-2&&L.cum[l+1]<d;)l++;const T=L.cum[l+1]-L.cum[l],b=T>0?(d-L.cum[l])/T:0,B=L.points[l*3],k=L.points[l*3+1],U=L.points[l*3+2],$=L.points[l*3+3],R=L.points[l*3+4],G=L.points[l*3+5];_.set(B+($-B)*b,k+(R-k)*b,U+(G-U)*b),z.set($-B,R-k,G-U).normalize(),z.lengthSq()===0&&z.set(0,1,0),y.crossVectors(z,Math.abs(z.y)>.9?new I(1,0,0):w).normalize(),x.crossVectors(z,y);const W=(L.radius0+(L.radius1-L.radius0)*f)*(.85+.3*s()),X=s()*Math.PI*2,lt=Math.cos(X),ct=Math.sin(X);_.addScaledVector(y,lt*W).addScaledVector(x,ct*W),e[g*3]=_.x,e[g*3+1]=_.y,e[g*3+2]=_.z,P[g*3]=y.x*lt+x.x*ct,P[g*3+1]=y.y*lt+x.y*ct,P[g*3+2]=y.z*lt+x.z*ct,r[g]=H,i[g]=f,m[g]=s(),A[g]=0,M[g]=c.rootDist[H]+f*L.length}}),{position:e,aBranch:r,aT:i,aSeed:m,aSoma:A,aDist:M,aNormal:P,aShell:E,count:t}}const kt=3,Ct=[0,1,2].map(a=>((a+.5)/kt).toFixed(4)),Q=a=>a.toFixed(3),ga=`
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
    if (instant > 0.5) return ${Q(yt)} * exp(-t / ${Q(xt)});
    float tw = t - ${Q(pe)};
    if (tw <= 0.0) return 0.0;
    float x = d - ${Q(wt)} * tw;
    float band = x > 0.0 ? 1.0 - smoothstep(0.0, ${Q(he)}, x) : exp(x / ${Q(fe)});
    float plateau = x < 0.0 ? ${Q(yt)} * exp(x / ${Q(wt*xt)}) : 0.0;
    return clamp(plateau + (1.0 - plateau) * band, 0.0, 1.0);
  }

  void main() {
    vec3 pos = position;
    float hidden = 0.0;
    if (aSoma < 0.5) {
      vec4 st = texture2D(uBranch, vec2((aBranch + 0.5) / uBranchCount, ${Ct[0]}));
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
      float jA = texture2D(uBranch, vec2((aBranch + 0.5) / uBranchCount, ${Ct[1]})).r;
      float jB = texture2D(uBranch, vec2((aBranch + 0.5) / uBranchCount, ${Ct[2]})).r;
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
    float foc = (1.0 - smoothstep(0.0, 18.0, abs(dist - ${nt.toFixed(1)}))) * (1.0 - uDefocus);
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
`,wa=`
  precision highp float;
  ${St}
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
`,ya=`
  uniform vec3 uPos;
  uniform float uScale;
  uniform float uDpr;
  void main() {
    vec4 mv = modelViewMatrix * vec4(uPos, 1.0);
    gl_Position = projectionMatrix * mv;
    float persp = 300.0 / max(-mv.z, 1.0);
    gl_PointSize = clamp(uDpr * persp * 0.6 * uScale, 3.0, 32.0 * uDpr);
  }
`,xa=`
  precision highp float;
  ${Ot}
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
`,K={appear:.7,reach:1.6,cup:1.1,close:.9,retract:1,digest:.8},it=.17,Aa=.1,Ma=1.5,te=6,Sa=9,ba=.45,tt=a=>{const t=Math.max(0,Math.min(1,a));return t*t*(3-2*t)},Pa=a=>1-Math.pow(1-Math.max(0,Math.min(1,a)),3);function Ta(a,t){var O;const o=At(t),s=p=>new I(p.points[p.points.length-3],p.points[p.points.length-2],p.points[p.points.length-1]),n=a.branches.filter(p=>p.isTip).map(p=>({b:p,d:s(p).length()})).sort((p,f)=>f.d-p.d),h=n.slice(0,Math.max(6,Math.round(n.length*.5))).map(p=>p.b),v=((O=[...h].sort((p,f)=>p.length-f.length)[Math.floor(h.length/2)])==null?void 0:O.length)??0,u=h.filter(p=>p.length>=v);u.length<3&&u.push(...h.slice(0,3));let c=-1;const e={branch:-1,reach:0,disp:new I,cup:0,wrap:0,cupRadius:it,target:new I,axis:new I(0,0,1),u:new I(1,0,0),v:new I(0,1,0),particle:new I,particleAlpha:0,particleScale:1,phagosome:new I,bulge:0,somaBump:0};let r="rest",i=0,m=Ma,A=0;const M=new I,P=new I,E=new I;let g=new Float32Array(0),S=new Float32Array(0),D=0;const C=new I,F=new I;function z(p){const f=[];let d=p,l=0;for(;d&&l++<64;){for(let b=d.points.length-3;b>=0;b-=3){const B=d.points[b],k=d.points[b+1],U=d.points[b+2],$=f.length;$&&f[$-3]===B&&f[$-2]===k&&f[$-1]===U||f.push(B,k,U)}d=d.parent>=0&&d.parent!==d.id?a.branches[d.parent]:void 0}f.push(0,0,0),g=Float32Array.from(f);const T=g.length/3;S=new Float32Array(T);for(let b=1;b<T;b++)S[b]=S[b-1]+Math.hypot(g[b*3]-g[b*3-3],g[b*3+1]-g[b*3-2],g[b*3+2]-g[b*3-1]);D=S[T-1]}function y(p,f){const d=g.length/3;if(d===0)return f.set(0,0,0);if(p<=0)return f.set(g[0],g[1],g[2]);if(p>=D)return f.set(0,0,0);let l=1;for(;l<d-1&&S[l]<p;)l++;const T=(p-S[l-1])/Math.max(1e-6,S[l]-S[l-1]);return f.set(g[l*3-3]+(g[l*3]-g[l*3-3])*T,g[l*3-2]+(g[l*3+1]-g[l*3-2])*T,g[l*3-1]+(g[l*3+2]-g[l*3-1])*T)}const x=n.map(p=>s(p.b));function w(p,f){let d=1/0;for(let l=0;l<n.length;l++)n[l].b.id!==p.id&&(d=Math.min(d,x[l].distanceTo(f)));return d}function _(){let p=u[0],f=-1;for(let B=0;B<4;B++){const k=u[Math.floor(o()*u.length)];if(k.id===c&&u.length>1)continue;const U=s(k),$=C.set(U.x-k.points[0],U.y-k.points[1],U.z-k.points[2]).normalize(),R=F.copy(U).addScaledVector($,.35),G=w(k,R);G>f&&(f=G,p=k)}c=p.id,M.copy(s(p));const d=C.set(M.x-p.points[0],M.y-p.points[1],M.z-p.points[2]).normalize();d.lengthSq()===0&&d.copy(M).normalize();const l=F.set(o()-.5,o()-.5,o()-.5).cross(d).normalize(),T=Math.min(.55,Math.max(.3,p.length*.9));P.copy(M).addScaledVector(d,T).addScaledVector(l,T*.35*(o()-.5)*2);const b=C.subVectors(P,M).normalize();e.axis.copy(b).negate(),E.copy(P).addScaledVector(b,-.17).sub(M),e.u.set(0,1,0),Math.abs(e.axis.y)>.9&&e.u.set(1,0,0),e.u.cross(e.axis).normalize(),e.v.crossVectors(e.axis,e.u).normalize(),e.branch=p.id,z(p),r="appear",i=0}function L(){e.branch=-1,e.reach=0,e.cup=0,e.wrap=0,e.cupRadius=it,e.particleAlpha=0,e.particleScale=1,e.bulge=0,e.somaBump=0,r="rest",i=0,m=te+o()*(Sa-te)}function H(p){if(p<=0)return;A+=p,i+=p;const f=d=>e.particle.copy(P).add(C.set(Math.sin(A*7.1)*d,Math.cos(A*5.3)*d,Math.sin(A*6.2+1.3)*d));switch(r){case"rest":i>=m&&_();break;case"appear":{e.particleAlpha=tt(i/K.appear),f(.014),i>=K.appear&&(r="reach",i=0);break}case"reach":{const d=tt(i/K.reach);e.reach=d,e.disp.copy(E).multiplyScalar(d),f(.014*(1-d)),e.particleAlpha=1,i>=K.reach&&(r="cup",i=0,e.target.copy(e.particle));break}case"cup":{e.reach=1,e.disp.copy(E),e.cup=Pa(i/K.cup),e.wrap=.3*e.cup,e.particle.copy(e.target),i>=K.cup&&(r="close",i=0);break}case"close":{const d=tt(i/K.close);e.cup=1,e.wrap=.3+.7*d,e.cupRadius=it+(Aa-it)*d,e.particleScale=1-.3*d,i>=K.close&&(r="retract",i=0);break}case"retract":{const d=tt(i/K.retract);e.reach=1-d,e.disp.copy(E).multiplyScalar(e.reach),e.target.copy(M).add(e.disp).addScaledVector(e.axis,-.1*(1-d)),e.particle.copy(e.target),i>=K.retract&&(r="transport",i=0);break}case"transport":{const d=i*ba;e.reach=0,e.cup=1-tt(i/.5),e.wrap=1,y(d,e.particle),e.target.copy(e.particle),e.phagosome.copy(e.particle),e.bulge=tt(i/.4),d>=D&&(r="digest",i=0);break}case"digest":{const d=i/K.digest;e.cup=0,e.particle.set(0,0,0),e.phagosome.set(0,0,0),e.particleAlpha=1-tt(d),e.bulge=1-tt(d),e.somaBump=Math.sin(Math.PI*Math.min(1,d)),i>=K.digest&&L();break}}}return{out:e,step:H,feed(){r==="rest"&&(m=0)}}}function tn(a,t,o={}){const s=va(t,o.count??ge,o.seed??1),n=new Y;n.setAttribute("position",new V(s.position,3)),n.setAttribute("aBranch",new V(s.aBranch,1)),n.setAttribute("aT",new V(s.aT,1)),n.setAttribute("aSeed",new V(s.aSeed,1)),n.setAttribute("aSoma",new V(s.aSoma,1)),n.setAttribute("aDist",new V(s.aDist,1)),n.setAttribute("aNormal",new V(s.aNormal,3)),n.setAttribute("aShell",new V(s.aShell,1)),n.boundingSphere=new et(new I,t.bound*1.5);const h=t.branches.length,v=new Float32Array(h*4*kt);for(let p=0;p<h;p++)v[p*4]=1;const u=new xe(v,h,kt,Ae,Me);u.magFilter=Ut,u.minFilter=Ut,u.needsUpdate=!0;const c=new Z({vertexShader:ga,fragmentShader:wa,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uSize:a.uSize,uDpr:a.uDpr,uMaxPx:{value:Qt},uLens:a.uLens,uPointer:a.uPointer,uAlpha:a.uAlpha,uBranch:{value:u},uBranchCount:{value:h},uSomaScale:{value:1},uThickness:{value:1},uReveal:{value:1},uDraw:{value:1},uDefocus:a.uDefocus,uLight:a.uLight,uPhagoBranch:{value:-1},uTarget:{value:new I},uCupAxis:{value:new I(0,0,1)},uCupU:{value:new I(1,0,0)},uCupV:{value:new I(0,1,0)},uCup:{value:0},uCupRadius:{value:it},uCupWrap:{value:0},uPhagoPos:{value:new I},uBulge:{value:0},uReach:{value:0},uStimT:{value:new at(-1,-1)},uStimInstant:{value:new at(0,0)},uTipDist:{value:new at(0,0)},uEntryDist:{value:new at(0,0)},uEntryA:{value:new I},uEntryB:{value:new I}}}),e=new Mt;e.add(new J(n,c)),e.scale.setScalar(o.scale??1);const r=o.phagocytosis?Ta(t,(o.seed??1)*31+7):null;let i=null,m=null;if(r){const p=new Y;p.setAttribute("position",new V(new Float32Array(3),3)),p.boundingSphere=new et(new I,t.bound*2),m=new Z({vertexShader:ya,fragmentShader:xa,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uPos:{value:new I},uScale:{value:1},uDpr:a.uDpr,uAlpha:{value:0},uCellAlpha:a.uAlpha,uReveal:{value:1}}}),i=new J(p,m),i.visible=!1,e.add(i)}const A=!!o.atp,M=me(t),P=M.maxDist*1.02;let E=null;A&&(E=ma(a,o.seed??1),e.add(E.points));const g=[{t:-1,instant:!1,s:null},{t:-1,instant:!1,s:null}];let S=0;const D=[0,0,0];let C=0,F=0;const z=t.branches.map(p=>p.length*(p.radius0+p.radius1)*.5),y=z.reduce((p,f)=>p+f,0),x=[.17,.5,.83],w=()=>{let p=0;for(const f of g){if(f.t<0||!f.s)continue;let d=0;for(let l=0;l<h;l++){const T=t.branches[l];let b=0;for(const B of x)b+=Zt(pa(f.s,l,M.rootDist[l]+B*T.length),f.t,f.instant);d+=b/x.length*(z[l]/y)*(1-Bt)}d+=Bt*Zt(f.s.tipDist-f.s.entryDist+t.soma,f.t,f.instant),p=Math.max(p,d)}return p};let _=Xt(t,o);const L=o.surveillance??!1,H=new I,O={group:e,reveal:1,draw:1,maxPx:Qt,calcium:0,get motility(){return _},setMotility(p){_=Xt(t,{...o,...p})},update(p,f,d,l){let T=null;L&&d&&(H.set(d.x,d.y,e.position.z),e.worldToLocal(H),T=[H.x,H.y,H.z]);let b=0;if(A){for(const R of g)if(!(R.t<0)){if(R.t+=p*(R.instant?1:f),R.t>la){R.t=-1;continue}b=Math.max(b,ha(R.t,R.instant))}c.uniforms.uStimT.value.set(g[0].t,g[1].t),C>0&&(C-=p*f,T=D),E==null||E.update(p,f,O.reveal),F+=p,F>=1/Tt&&(F=Math.min(F-1/Tt,1/Tt),O.calcium=w(),Vt.write(O.calcium))}_.update({dt:p,motion:f,pointer:T,activation:Math.max(l,b)});const{ext:B,disp:k}=_,U=O.draw>=1?1/0:O.draw*P;for(let R=0;R<h;R++){const G=t.branches[R],W=U===1/0?1:Math.max(0,Math.min(1,(U-M.rootDist[R])/Math.max(1e-4,G.length)));v[R*4]=B[R]*W,v[R*4+1]=k[R*3],v[R*4+2]=k[R*3+1],v[R*4+3]=k[R*3+2]}let $=0;if(r&&i&&m){O.reveal>.9&&r.step(p*Math.max(0,Math.min(1,f)));const R=r.out;if(R.branch>=0&&R.reach>0){const W=R.branch,X=R.reach;v[W*4]+=(1-v[W*4])*X,v[W*4+1]+=(R.disp.x-v[W*4+1])*X,v[W*4+2]+=(R.disp.y-v[W*4+2])*X,v[W*4+3]+=(R.disp.z-v[W*4+3])*X}const G=c.uniforms;G.uPhagoBranch.value=R.branch,G.uReach.value=R.reach,G.uTarget.value.copy(R.target),G.uCupAxis.value.copy(R.axis),G.uCupU.value.copy(R.u),G.uCupV.value.copy(R.v),G.uCup.value=R.cup,G.uCupRadius.value=R.cupRadius,G.uCupWrap.value=R.wrap,G.uPhagoPos.value.copy(R.phagosome),G.uBulge.value=R.bulge,m.uniforms.uPos.value.copy(R.particle),m.uniforms.uScale.value=R.particleScale,m.uniforms.uAlpha.value=R.particleAlpha,m.uniforms.uReveal.value=O.reveal,i.visible=R.particleAlpha>.01,$=R.somaBump}u.needsUpdate=!0,c.uniforms.uSomaScale.value=_.somaScale*(1+.06*$),c.uniforms.uThickness.value=_.thickness,c.uniforms.uReveal.value=O.reveal,c.uniforms.uDraw.value=O.draw,c.uniforms.uMaxPx.value=O.maxPx},feed(){r==null||r.feed()},stimulate(p,f={}){if(!A)return;const d=ua(t,M,ca(t,[p.x,p.y,p.z])),l=S;S=1-S;const T=(1+l)*h*4;for(let k=0;k<h;k++)v[T+k*4]=d.junction[k];const b=!!f.instant;g[l]={t:0,instant:b,s:d};const B=c.uniforms;l===0?(B.uTipDist.value.x=d.tipDist,B.uEntryDist.value.x=d.entryDist,B.uStimInstant.value.x=b?1:0,B.uEntryA.value.set(d.entry[0],d.entry[1],d.entry[2])):(B.uTipDist.value.y=d.tipDist,B.uEntryDist.value.y=d.entryDist,B.uStimInstant.value.y=b?1:0,B.uEntryB.value.set(d.entry[0],d.entry[1],d.entry[2])),D[0]=p.x,D[1]=p.y,D[2]=p.z,C=sa,E&&!b&&E.start(p),Vt.stimulatedAt=performance.now()},dispose(){n.dispose(),c.dispose(),u.dispose(),i==null||i.geometry.dispose(),m==null||m.dispose(),E==null||E.dispose()}};return O}const Ea={n:4,pass:1.1,dwell:.8,exit:1,head:.45,step:.2},ee=1.2,ae=11,ne=72,Da=3,oe=44,La=[[-.1,.09],[0,.12],[.1,.09]],se=18,Ra=.32,ie=.22,Ia=1.8,za=`
  attribute vec3 aU;         // an orbit's basis, or the point itself (aOmega 0)
  attribute vec3 aV;
  attribute float aPhase;
  attribute float aOmega;    // rad/s along the orbit; 0 for a still point
  attribute float aSeed;
  attribute float aKind;     // 0 orbit lattice, 1 particle on an orbit, 2 axis, 3 filter
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
    vec3 p = aKind < 1.5 ? cos(ang) * aU + sin(ang) * aV : aU;
    vec4 wp = modelMatrix * vec4(p, 1.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    float foc = (1.0 - smoothstep(0.0, 18.0, abs(dist - ${nt.toFixed(1)}))) * (1.0 - uDefocus);
    float lens = smoothstep(4.4, 0.0, length(wp.xy - uPointer)) * uLens;
    float persp = 300.0 / max(dist, 1.0);

    // The sphere's dots carry the radial normal; the axis and the filter face the reader.
    vec3 n = aKind < 1.5 ? normalize(p) : vec3(0.0, 0.0, 1.0);
    vec3 nv = aKind < 1.5 ? normalize(normalMatrix * n) : n;
    vec3 lv = normalize(mat3(viewMatrix) * uLight);
    float key = aKind < 1.5 ? 0.5 + 0.5 * dot(nv, lv) : 0.55;
    float rim = aKind < 1.5 ? pow(1.0 - abs(nv.z), 2.2) : 0.0;
    float facing = aKind < 1.5 ? 0.5 + 0.5 * nv.z : 1.0;

    float size = aKind < 0.5 ? 2.5 : (aKind < 1.5 ? 3.6 : (aKind < 2.5 ? 2.0 : 2.1));
    size *= 0.85 + 0.3 * fract(aSeed * 7.31);
    size *= mix(0.72, 1.0, facing);
    float bokeh = 1.0 + (1.0 - foc) * 1.2;
    float px = clamp(size * uDpr * persp * 0.05 * bokeh, 0.75, 14.0 * uDpr);
    gl_PointSize = px;

    // Drawn from the top down as the reader arrives.
    float cut = 1.35 - 2.7 * uDraw;
    float drawn = smoothstep(cut - 0.3, cut, p.y);
    float base = aKind < 0.5 ? 0.62 : (aKind < 1.5 ? 0.85 : (aKind < 2.5 ? 0.7 : 0.78));
    vAlpha = base * (0.04 + 0.96 * foc) / (bokeh * bokeh) * mix(1.0 - 0.2 * uLens, 1.5, lens) * (1.0 + 0.3 * rim) * mix(0.5, 1.0, facing) * drawn;
    vShade = key;
    vRim = rim;
    vFoc = foc;
    vLens = lens;
    vSeed = aSeed;
    vPx = px;
    vKind = aKind;
  }
`,_a=`
  precision highp float;
  ${St}
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
    col = mix(col, GRAPHITE_DEEP, vRim * 0.45 + (vKind > 0.5 && vKind < 1.5 ? 0.3 : 0.0));
    col = mix(col, GRAPHITE_DEEP, vLens * 0.4);
    gl_FragColor = vec4(col, min(1.0, a));
  }
`,Fa=`
  attribute float aSize;
  attribute float aAlpha;
  uniform float uDpr;
  varying float vA;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float persp = 300.0 / max(-mv.z, 1.0);
    // The same measure as the channel's ions: their size follows the rig's scale.
    float sc = pow(length(modelMatrix[0].xyz) / 0.85, 0.7);
    gl_PointSize = aSize * uDpr * persp * 0.034 * sc;
    vA = aAlpha;
  }
`,Ca=`
  precision highp float;
  ${Ot}
  uniform float uAlpha;
  varying float vA;
  void main() {
    vec3 col;
    float edge = sphere(gl_PointCoord, col);
    float a = edge * vA * uAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(col, min(1.0, a));
  }
`;function en(a,t=5){let o=t*7919+13;const s=()=>(o=o*1664525+1013904223>>>0,o/4294967296),n=[],h=[],v=[],u=[],c=[],e=[],r=(l,T,b,B,k)=>{n.push(l.x,l.y,l.z),h.push(T.x,T.y,T.z),v.push(b),u.push(B),c.push(s()),e.push(k)},i=new I,m=new I,A=new I,M=new I;for(let l=0;l<ae;l++){const T=Te(l,ae);i.set(T[0],T[1],T[2]).normalize(),M.set(0,1,0),Math.abs(i.y)>.9&&M.set(1,0,0),m.crossVectors(i,M).normalize(),A.crossVectors(i,m).normalize();const b=s()*Math.PI*2;for(let U=0;U<ne;U++)r(m,A,b+U/ne*Math.PI*2+(s()-.5)*.02,0,0);const B=s()<.5?1:-1,k=(.22+.36*s())*B;for(let U=0;U<Da;U++)r(m,A,s()*Math.PI*2,k*(.85+.3*s()),1)}const P=new I,E=new I;for(let l=0;l<oe;l++){const T=-1.2+2*ee*(l+.5)/oe;E.set((s()-.5)*.02,T,(s()-.5)*.02),r(E,P,0,0,2)}for(const[l,T]of La)for(let b=0;b<se;b++){const B=b/se*Math.PI*2;E.set(Math.cos(B)*T,l,Math.sin(B)*T),r(E,P,0,0,3)}const g=new Y,S=e.length;g.setAttribute("position",new V(new Float32Array(S*3),3)),g.setAttribute("aU",new q(n,3)),g.setAttribute("aV",new q(h,3)),g.setAttribute("aPhase",new q(v,1)),g.setAttribute("aOmega",new q(u,1)),g.setAttribute("aSeed",new q(c,1)),g.setAttribute("aKind",new q(e,1)),g.boundingSphere=new et(new I,4);const D=new Z({vertexShader:za,fragmentShader:_a,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uTime:{value:0},uDpr:a.uDpr,uLens:a.uLens,uDefocus:a.uDefocus,uLight:a.uLight,uPointer:a.uPointer,uAlpha:{value:1},uDraw:{value:1}}}),C=new Mt;C.add(new J(g,D));const F=Ea,z=new Float32Array(F.n*3),y=new Float32Array(F.n),x=new Float32Array(F.n),w=new Y;w.setAttribute("position",new V(z,3)),w.setAttribute("aSize",new V(y,1)),w.setAttribute("aAlpha",new V(x,1)),w.boundingSphere=new et(new I,4);const _=new Z({vertexShader:Fa,fragmentShader:Ca,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uDpr:a.uDpr,uAlpha:{value:1}}});C.add(new J(w,_));let L=0,H=1,O=0,p=0;const f=(l,T,b,B)=>l+(T-l)*(1-Math.exp(-3*B)),d={group:C,draw:1,update(l,T,b,B){D.uniforms.uTime.value+=l*T,D.uniforms.uAlpha.value=.05+.95*b,D.uniforms.uDraw.value=d.draw,_.uniforms.uAlpha.value=(.05+.95*b)*Math.min(1,d.draw*1.5),H=f(H,B?Ia:1,3,l),L+=l*T*H,O=f(O,Ra+(B?B.y*ie:0),3,l),p=f(p,B?-B.x*ie:0,3,l),C.rotation.x=O,C.rotation.z=p;for(let k=0;k<F.n;k++){const U=Ee(L,k,F);z[k*3]=0,z[k*3+1]=U.y*ee,z[k*3+2]=0,y[k]=U.phase==="dwell"?10.5:8.5,x[k]=U.a*(U.phase==="queue"?.75:1)}w.attributes.position.needsUpdate=!0,w.attributes.aSize.needsUpdate=!0,w.attributes.aAlpha.needsUpdate=!0},dispose(){g.dispose(),D.dispose(),w.dispose(),_.dispose()}};return d}const Ba=8,ka=80,mt=.012;function an(a,t,o,s={}){const n={active:!1,hover:!1,lastX:0,lastY:0,spin:0,pinch:1,pinching:!1},h=new I,v=(y,x)=>{if(!a.visible)return!1;h.copy(a.position).project(t);const w=(h.x*.5+.5)*window.innerWidth,_=(-h.y*.5+.5)*window.innerHeight;return Math.hypot(y-w,x-_)<o()},u=y=>{y.pointerType==="touch"||!v(y.clientX,y.clientY)||(n.active=!0,n.lastX=y.clientX,n.lastY=y.clientY,n.spin=0,document.body.style.cursor="grabbing")},c=y=>{if(y.pointerType==="touch")return;if(n.active){const w=y.clientX-n.lastX,_=y.clientY-n.lastY;a.rotation.y+=w*mt,s.tilt!==!1&&(a.rotation.x=Math.max(-1.3,Math.min(.7,a.rotation.x+_*.008))),n.spin=w*mt*40,n.lastX=y.clientX,n.lastY=y.clientY;return}const x=v(y.clientX,y.clientY);x!==n.hover&&(n.hover=x,document.body.style.cursor=x?"grab":"")},e=y=>{y.pointerType==="touch"||!n.active||(n.active=!1,document.body.style.cursor=n.hover?"grab":"")};window.addEventListener("pointerdown",u),window.addEventListener("pointermove",c),window.addEventListener("pointerup",e),window.addEventListener("pointercancel",e);const r=s.touch??null,i=new Map;let m="none";const A={x:0,y:0};let M=1,P=0,E=0,g=0;const S=()=>{const[y,x]=Array.from(i.values());return y&&x?Math.max(1,Math.hypot(y.x-x.x,y.y-x.y)):1},D=(y,x,w)=>{m="none",A.x=y,A.y=x,P=0,E=w,g=w},C=y=>{var x;if(y.pointerType==="touch"&&!((x=y.target)!=null&&x.closest("button, a"))){i.set(y.pointerId,{x:y.clientX,y:y.clientY});try{r==null||r.setPointerCapture(y.pointerId)}catch{}i.size===1?(n.spin=0,D(y.clientX,y.clientY,y.timeStamp)):i.size===2&&(n.active=!1,n.pinching=!0,n.pinch=1,M=S(),m="turn")}},F=y=>{const x=i.get(y.pointerId);if(!x)return;const w=x.x;if(x.x=y.clientX,x.y=y.clientY,i.size>=2){n.pinching&&(n.pinch=S()/M);return}if(m==="none"){const O=y.clientX-A.x,p=y.clientY-A.y;if(Math.hypot(O,p)<Ba)return;m=Math.abs(O)>1.5*Math.abs(p)?"turn":"scroll",m==="turn"&&(n.active=!0),E=y.timeStamp;return}if(m!=="turn")return;const _=y.clientX-w,L=Math.max(1,y.timeStamp-E)/1e3;E=y.timeStamp,g=y.timeStamp,a.rotation.y+=_*mt;const H=_*mt/L;P+=(H-P)*.5},z=y=>{var x;if(i.has(y.pointerId)){if(i.delete(y.pointerId),n.pinching&&i.size<2){n.pinching=!1;const w=n.pinch;n.pinch=1,(x=s.onPinchEnd)==null||x.call(s,w);const _=Array.from(i.values())[0];_?D(_.x,_.y,y.timeStamp):m="none";return}i.size===0&&(n.active&&(n.active=!1,n.spin=y.timeStamp-g>ka?0:P),m="none")}};return r&&(r.addEventListener("pointerdown",C),r.addEventListener("pointermove",F),r.addEventListener("pointerup",z),r.addEventListener("pointercancel",z)),{get active(){return n.active},get hover(){return n.hover},get spin(){return n.spin},set spin(y){n.spin=y},get pinch(){return n.pinch},get pinching(){return n.pinching},isOver(y,x){return v(y,x)},dispose(){window.removeEventListener("pointerdown",u),window.removeEventListener("pointermove",c),window.removeEventListener("pointerup",e),window.removeEventListener("pointercancel",e),r&&(r.removeEventListener("pointerdown",C),r.removeEventListener("pointermove",F),r.removeEventListener("pointerup",z),r.removeEventListener("pointercancel",z)),(n.hover||n.active)&&(document.body.style.cursor="")}}}const Ha=8,Oa=700;function nn(a,t,o,s){const n={hover:!1,down:null},h=new I,v=new I,u=new at,c=new le,e=new Se,r=new I,i=()=>{if(!a.visible)return null;const S=o();if(S<=0)return null;v.copy(a.position).applyMatrix4(t.matrixWorldInverse);const D=-v.z;if(D<=.1)return null;h.copy(a.position).project(t);const C=window.innerHeight/2/(Math.tan(t.fov*Math.PI/360)*D);return{x:(h.x*.5+.5)*window.innerWidth,y:(-h.y*.5+.5)*window.innerHeight,r:S*C}},m=(S,D)=>{const C=i();return!!C&&Math.hypot(S-C.x,D-C.y)<C.r},A=(S,D)=>!m(S,D)||(u.set(S/window.innerWidth*2-1,-(D/window.innerHeight)*2+1),c.setFromCamera(u,t),e.setFromNormalAndCoplanarPoint(t.getWorldDirection(v),a.position),!c.ray.intersectPlane(e,r))?!1:(a.worldToLocal(r),s(r.clone()),!0),M=S=>{m(S.clientX,S.clientY)&&(n.down={x:S.clientX,y:S.clientY,t:performance.now(),id:S.pointerId})},P=S=>{if(S.pointerType==="touch")return;const D=!n.down&&m(S.clientX,S.clientY);D!==n.hover&&(n.hover=D,D?document.body.style.cursor="pointer":document.body.style.cursor==="pointer"&&(document.body.style.cursor=""))},E=S=>{const D=n.down;!D||S.pointerId!==D.id||(n.down=null,!(Math.hypot(S.clientX-D.x,S.clientY-D.y)>Ha||performance.now()-D.t>Oa)&&A(S.clientX,S.clientY))},g=()=>{n.down=null};return window.addEventListener("pointerdown",M),window.addEventListener("pointermove",P),window.addEventListener("pointerup",E),window.addEventListener("pointercancel",g),{get hover(){return n.hover},at:A,onScreen:i,dispose(){window.removeEventListener("pointerdown",M),window.removeEventListener("pointermove",P),window.removeEventListener("pointerup",E),window.removeEventListener("pointercancel",g),n.hover&&document.body.style.cursor==="pointer"&&(document.body.style.cursor="")}}}function Ua(a,t){const o=t.stride;if(a.byteLength%o!==0)throw new Error(`umap: ${a.byteLength} bytes is not a multiple of ${o}`);const s=a.byteLength/o,n=new DataView(a),h=new Float32Array(s*3),v=new Float32Array(s),u=new Float32Array(s*3),c=new Float32Array(s);for(let e=0;e<s;e++){const r=e*o;h[e*3]=n.getInt16(r,!0)/32767,h[e*3+1]=n.getInt16(r+2,!0)/32767,h[e*3+2]=n.getInt16(r+4,!0)/32767,v[e]=n.getUint8(r+6),u[e*3]=n.getUint8(r+7)/255,u[e*3+1]=n.getUint8(r+8)/255,u[e*3+2]=n.getUint8(r+9)/255,c[e]=(e*2654435761>>>0)/4294967296}return{n:s,position:h,state:v,expr:u,seed:c}}async function Ga(a){const t=await fetch(`${a}umap/manifest.json`).then(s=>s.json()),o=await fetch(`${a}umap/cells.bin`).then(s=>s.arrayBuffer());return{manifest:t,cells:Ua(o,t)}}const Va=600,$a=12,re=.035,Wa=`
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
    float foc = (1.0 - smoothstep(0.0, 14.0, abs(dist - ${nt.toFixed(1)}))) * (1.0 - uDefocus);
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
`,Na=`
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
`;function on(a,t){const o=new Mt,s=new Z({vertexShader:Wa,fragmentShader:Na,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uSize:a.uSize,uDpr:a.uDpr,uLens:a.uLens,uDefocus:a.uDefocus,uPointer:a.uPointer,uAlpha:a.uAlpha,uReveal:{value:0},uMode:{value:0},uPrevMode:{value:0},uWave:{value:10},uWaveOrigin:{value:new I},uFocusState:{value:-1},uHover:{value:new I(99,99,99)},uMaxPx:{value:9}}});let n=null,h=null,v=null,u=null,c=!1;const e={group:o,ready:!1,manifest:null,reveal:0,maxPx:9,spin:.12,hoverEnabled:!0,labelsEnabled:!0,labelFade:1,update:C,dispose(){c=!0,n==null||n.dispose(),s.dispose()}};Ga(t).then(({manifest:F,cells:z})=>{c||(n=new Y,n.setAttribute("position",new V(z.position,3)),n.setAttribute("aState",new V(z.state,1)),n.setAttribute("aExpr",new V(z.expr,3)),n.setAttribute("aSeed",new V(z.seed,1)),n.boundingSphere=new et(new I,1.8),o.add(new J(n,s)),h=z.position,v=z.state,u=z.expr,e.manifest=F,e.ready=!0,N.count=F.n,N.ready=!0)}).catch(F=>console.warn("umap: data not loaded",F));const r=F=>Math.max(0,$t.indexOf(F));let i=N.changedAt;const m=new I,A=new be,M=new le,P=new Pe,E=new I,g=new at;let S=0,D=-1;function C(F,z,y,x,w){var O;const _=s.uniforms;_.uReveal.value=e.reveal,_.uMaxPx.value=e.maxPx,_.uMode.value=r(N.mode),_.uPrevMode.value=r(N.prevMode),_.uFocusState.value=N.focusState,w&&(o.rotation.y+=F*e.spin*z),N.changedAt!==i&&(i=N.changedAt,m.set(a.uPointer.value.x,a.uPointer.value.y,o.position.z),Math.abs(m.x)>90&&m.set(0,0,o.position.z),o.worldToLocal(m),m.clampLength(0,1.2),_.uWaveOrigin.value.copy(m));const L=(performance.now()-N.changedAt)/Va;if(_.uWave.value=De.reducedMotion?10:Math.min(10,L*3.2),!e.ready||!h||!v||!u||!e.manifest)return;S+=F;const H=e.hoverEnabled&&x&&o.visible&&e.reveal>.5;if(H&&S>1/$a){S=0,g.set(x.x,x.y),M.setFromCamera(g,y),P.copy(o.matrixWorld).invert(),A.copy(M.ray).applyMatrix4(P);const p=o.scale.x||1,f=re*8/Math.max(p,.01);let d=-1,l=Math.min(f,re*4),T=1/0;for(let b=0;b<h.length/3;b++){E.set(h[b*3],h[b*3+1],h[b*3+2]);const B=E.clone().sub(A.origin).dot(A.direction);if(B<0)continue;const k=A.distanceToPoint(E);(k<l||k<l*1.15&&B<T-.2)&&(d=b,l=k,T=B)}D=d}if(H||(D=-1),D>=0){_.uHover.value.set(h[D*3],h[D*3+1],h[D*3+2]);const p=(x.x+1)/2*window.innerWidth,f=(1-x.y)/2*window.innerHeight,d=((O=e.manifest.states[v[D]])==null?void 0:O.name)??"",l=N.mode,T=$t.indexOf(l)-1,b=T<0?d:`${l} ${(u[D*3+T]*e.manifest.p99[T]).toFixed(2)}`;N.hover={text:b,x:p,y:f}}else _.uHover.value.set(99,99,99),N.hover&&(N.hover=null);if(e.labelsEnabled&&o.visible){const p=E.setFromMatrixPosition(y.matrixWorld).clone();N.labels=e.manifest.states.map(f=>{const d=new I(f.centroid[0],f.centroid[1],f.centroid[2]);o.localToWorld(d);const l=d.distanceTo(p),T=1-Math.min(1,Math.abs(l-nt)/14);d.project(y);const b=d.z>1;return{text:f.name,state:f.id,x:(d.x+1)/2*window.innerWidth,y:(1-d.y)/2*window.innerHeight,opacity:b?0:e.reveal*e.labelFade*(.15+.85*T)*(N.focusState<0||N.focusState===f.id?1:.35)}})}else N.labels.length&&(N.labels=[])}return e}export{Ja as C,ee as E,Fe as L,St as P,bt as S,ma as a,tn as b,Qa as c,en as d,on as e,Za as f,qa as g,nn as h,an as i,Ya as m};
