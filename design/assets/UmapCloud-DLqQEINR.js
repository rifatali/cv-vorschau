var we=Object.defineProperty;var ye=(t,e,o)=>e in t?we(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o;var Pt=(t,e,o)=>ye(t,typeof e!="symbol"?e+"":e,o);import{V as C,B as J,a as $,S as at,b as Q,c as et,P as tt,G as Mt,F as K,D as xe,R as Ae,f as Me,N as Gt,g as re,h as be,i as Se,M as Pe}from"./three-CdPaaKdt.js";import{D as nt,T as Tt,a as Vt,k as Te,u as N,s as Ee,U as $t}from"./index-Dqlpft0Y.js";const Et=new Set,Wt=new Map,Dt=new Set,Nt={register(t){return Dt.add(t),()=>{Dt.delete(t)}},hasRig(t){return Dt.has(t)},emit(t){Wt.set(t.rig,t.time),Et.forEach(e=>e(t))},subscribe(t){return Et.add(t),()=>{Et.delete(t)}},lastEvent(t){return Wt.get(t)??-1/0}},j=624,ut=397,Lt=2567483615,Rt=2147483648,It=2147483647;class De{constructor(e){Pt(this,"mt",new Uint32Array(j));Pt(this,"mti",j+1);if(!Number.isInteger(e)||e<0)throw new Error("PyRandom: seed must be a non-negative integer");const o=[];let s=e;do o.push(s%4294967296),s=Math.floor(s/4294967296);while(s>0);this.initByArray(o)}initGenrand(e){const o=this.mt;o[0]=e>>>0;for(let s=1;s<j;s++){const n=o[s-1]^o[s-1]>>>30;o[s]=Math.imul(1812433253,n)+s>>>0}this.mti=j}initByArray(e){const o=this.mt;this.initGenrand(19650218);let s=1,n=0;for(let h=Math.max(j,e.length);h>0;h--){const v=o[s-1]^o[s-1]>>>30;o[s]=(o[s]^Math.imul(v,1664525))+e[n]+n>>>0,s++,n++,s>=j&&(o[0]=o[j-1],s=1),n>=e.length&&(n=0)}for(let h=j-1;h>0;h--){const v=o[s-1]^o[s-1]>>>30;o[s]=(o[s]^Math.imul(v,1566083941))-s>>>0,s++,s>=j&&(o[0]=o[j-1],s=1)}o[0]=2147483648}genrandInt32(){const e=this.mt;let o;if(this.mti>=j){let s=0;for(;s<j-ut;s++)o=e[s]&Rt|e[s+1]&It,e[s]=e[s+ut]^o>>>1^(o&1?Lt:0);for(;s<j-1;s++)o=e[s]&Rt|e[s+1]&It,e[s]=e[s+(ut-j)]^o>>>1^(o&1?Lt:0);o=e[j-1]&Rt|e[0]&It,e[j-1]=e[ut-1]^o>>>1^(o&1?Lt:0),this.mti=0}return o=e[this.mti++],o^=o>>>11,o^=o<<7&2636928640,o^=o<<15&4022730752,o^=o>>>18,o>>>0}random(){const e=this.genrandInt32()>>>5,o=this.genrandInt32()>>>6;return(e*67108864+o)/9007199254740992}uniform(e,o){return e+(o-e)*this.random()}}const le=.22,ht=(t,e)=>[t[0]+e[0],t[1]+e[1],t[2]+e[2]],Le=(t,e)=>[t[0]-e[0],t[1]-e[1],t[2]-e[2]],vt=(t,e)=>[t[0]*e,t[1]*e,t[2]*e],Ut=t=>Math.hypot(t[0],t[1],t[2]),Ct=t=>{const e=Ut(t);return e>0?vt(t,1/e):[0,0,0]};function Re(t=7,e=10,o=5,s=.72){const n=new De(t),h=[[0,0,0]],v=[],u=[le],l=(r,i,d,A,b,E)=>{if(E<=0||A<.02)return;let P=Ct(d),g=[i[0],i[1],i[2]],M=r;const D=3;for(let _=0;_<D;_++){const R=E>3?.32:.48;P=Ct(ht(P,[n.uniform(-R,R),n.uniform(-R,R),n.uniform(-R,R)])),g=ht(g,vt(P,A/D)),h.push([g[0],g[1],g[2]]);const w=h.length-1,x=(_+1)/D;u.push(Math.max(.004,b*(1-.5*x))),v.push([M,w]),M=w}if(E===1){h.push(ht(g,vt(P,A*.28))),u.push(.0035),v.push([M,h.length-1]);return}const z=E>=4?3:n.random()<.82?2:3;for(let _=0;_<z;_++){const R=Ct(ht(P,[n.uniform(-1,1),n.uniform(-1,1),n.uniform(-1,1)])),w=A*n.uniform(.52,.64);l(M,g,R,w,b*.58,E-1)}};for(let r=0;r<e;r++){const i=1-r/Math.max(1,e-1)*2,d=Math.sqrt(Math.max(0,1-i*i)),A=r*2.399963,b=[Math.cos(A)*d,i,Math.sin(A)*d],E=vt(b,.24);h.push(E),u.push(.042),v.push([0,h.length-1]);const P=s*n.uniform(.85,1.15);l(h.length-1,E,b,P,.04,o)}let a=0;for(const r of h)a=Math.max(a,Ut(r));return{verts:h,edges:v,radii:u,bound:a+.06}}const Ie=t=>[t[0],t[2],-t[1]];function Ce(t){const e=new Map;for(const[u,l]of t.edges)e.has(u)||e.set(u,[]),e.get(u).push(l);const o=[],s=(u,l)=>{l.push(u);const a=e.get(u)??[];if(a.length===1)s(a[0],l);else{o.push(l);for(const r of a)s(r,[u])}};for(const u of e.get(0)??[])s(u,[0]);const n=o.map((u,l)=>{const a=u[0]===0?u.slice(1):u,r=a.map(b=>Ie(t.verts[b])),i=new Float32Array(r.length*3),d=new Float32Array(r.length);let A=0;return r.forEach((b,E)=>{i.set(b,E*3),E>0&&(A+=Ut(Le(b,r[E-1]))),d[E]=A}),{id:l,points:i,cum:d,length:A,radius0:t.radii[a[0]],radius1:t.radii[a[a.length-1]],depth:0,parent:-1,children:[],isTip:!0}}),h=new Map;o.forEach((u,l)=>h.set(u[u.length-1],l)),o.forEach((u,l)=>{if(u[0]===0)return;const a=h.get(u[0]);a!==void 0&&(n[l].parent=a,n[a].children.push(l),n[a].isTip=!1)});const v=u=>n[u].parent<0?0:v(n[u].parent)+1;return n.forEach((u,l)=>u.depth=v(l)),{branches:n,soma:le,bound:t.bound}}function Ka(t=7,e=10,o=5,s=.72){return Ce(Re(t,e,o,s))}const bt=`
  const vec3 GRAPHITE = vec3(0.24, 0.23, 0.23);
  const vec3 GRAPHITE_LIGHT = vec3(0.50, 0.48, 0.46);
  const vec3 GRAPHITE_DEEP = vec3(0.12, 0.11, 0.11);
  const vec3 AMBER = vec3(0.776, 0.486, 0.149);
`,St=`
  float stroke(vec2 uv, float seed, float sharp, float px) {
    float ang = seed * 6.2831853;
    float c = cos(ang), s = sin(ang);
    vec2 q = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);
    float elong = mix(1.0, 1.6, smoothstep(2.5, 5.0, px));
    float r = length(q * vec2(1.0, elong));
    float soft = mix(0.08, 0.34, sharp);
    return smoothstep(0.5, soft, r);
  }
`,ce=`
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
`,_e=new C(-.5,.75,.45).normalize();function Ya(){return{uDefocus:{value:0},uLight:{value:_e.clone()}}}const Fe=`
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
`,ze=`
  precision highp float;
  ${bt}
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
`,_t=20,jt={x:.16,y:-.22},Be=.011;function qa(t,e=1){let o=e*7919+13;const s=()=>(o=o*1664525+1013904223>>>0,o/4294967296),n=()=>Math.sqrt(-2*Math.log(1-s()))*Math.cos(2*Math.PI*s()),h=new Float32Array(_t*3),v=new Float32Array(_t);for(let r=0;r<_t;r++)h[r*3]=n()*.5,h[r*3+1]=n()*.5,h[r*3+2]=0,v[r]=s();const u=new J;u.setAttribute("position",new $(h,3)),u.setAttribute("aSeed",new $(v,1)),u.boundingSphere=new at(new C,30);const l=new Q({vertexShader:Fe,fragmentShader:ze,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uDpr:t.uDpr,uAlpha:t.uAlpha,uRadius:{value:new et(1,1)},uPx:{value:40},uStrength:{value:0}}}),a=new tt(u,l);return a.frustumCulled=!1,a.renderOrder=-1,{points:a,place(r,i,d,A=60){a.position.set(r.x+i*jt.x,r.y+d*jt.y,r.z),l.uniforms.uRadius.value.set(i,d),l.uniforms.uPx.value=Math.max(i,d)*A*.9},update(r){l.uniforms.uStrength.value=Be*Math.max(0,Math.min(1,r)),a.visible=r>.01},dispose(){u.dispose(),l.dispose()}}}const st=3.3,ue=1.3,Za={radius:st,halfHeight:4.2},He=.36,gt=12,pt=t=>.78+.42*Math.pow(t/.95,2),Ft=t=>.22+.3*Math.pow(t/.95,2),ke=[.5,.17,-.17,-.5],Oe=`
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
`,Ue=`
  precision highp float;
  ${bt}
  ${St}
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
`,Ge=`
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
`,Ve=`
  precision highp float;
  ${ce}
  uniform float uAlpha;
  varying float vA;
  void main() {
    vec3 col;
    float edge = sphere(gl_PointCoord, col);
    float a = edge * vA * uAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(col, min(1.0, a));
  }
`;function rt(t,e,o,s,n,h,v,u){const l=Math.hypot(h,v,u)||1;t.pos.push(e,o,s),t.seed.push(Math.random()),t.kind.push(n),t.normal.push(h/l,v/l,u/l)}function $e(t,e=ue){const n=Math.ceil(st/.20351),h=Math.ceil(st/.235);for(let v=-n;v<=n;v++)for(let u=-h;u<=h;u++){const l=u*.235+(v%2?.1175:0)+(Math.random()-.5)*.05,a=v*.20351+(Math.random()-.5)*.05,r=Math.hypot(l,a);if(r>st||r<e)continue;const i=st*.78;if(!(r>i&&Math.random()<(r-i)/(st-i)))for(const d of[1,-1]){const A=d*He+(Math.random()-.5)*.03;rt(t,l,A,a,0,0,d,0);for(let b=1;b<=4;b++){const E=b/4.6;rt(t,l+(Math.random()-.5)*.05,A-d*(.07+.26*E),a+(Math.random()-.5)*.05,1,0,d,0)}}}}function We(t){const e=7*Math.PI/180,o=Math.PI/2,s=110;for(let n=0;n<=s;n++){const h=-.95+1.9*n/s,v=pt(h),u=(pt(h+.01)-pt(h-.01))/.02,l=Math.round(2*Math.PI*v/.036);for(let i=0;i<l;i++){const d=i/l*Math.PI*2+n%2*(Math.PI/l);if((d%o+o)%o<e||(d%o+o)%o>o-e)continue;const b=.02,E=Math.cos(d),P=Math.sin(d);rt(t,E*v+(Math.random()-.5)*b,h+(Math.random()-.5)*b,P*v+(Math.random()-.5)*b,2,E,-u,P)}const a=Ft(h),r=Math.round(2*Math.PI*a/.042);for(let i=0;i<r;i++){const d=i/r*Math.PI*2+n%2*(Math.PI/r),A=Math.cos(d),b=Math.sin(d);rt(t,A*a,h,b*a,3,-A,.2,-b)}}for(const n of[-.95,.95])for(let h=0;h<8;h++){const v=h/7,u=Ft(n)+(pt(n)-Ft(n))*v,l=Math.round(2*Math.PI*u/.042);for(let a=0;a<l;a++){const r=a/l*Math.PI*2,i=(r%o+o)%o;i<e||i>o-e||rt(t,Math.cos(r)*u,n,Math.sin(r)*u,2,0,n>0?1:-1,0)}}}const Xt=10,ot=8,Kt=3.9,Ne=-4;function Ja(t,e="research",o={}){const s=o.channel!==!1,n=s?Nt.register(e):()=>{},h=new Mt,v=[],u={pos:[],seed:[],kind:[],normal:[]};$e(u,s?ue:0),s&&We(u);const l=new J;l.setAttribute("position",new K(u.pos,3)),l.setAttribute("aSeed",new K(u.seed,1)),l.setAttribute("aKind",new K(u.kind,1)),l.setAttribute("aNormal",new K(u.normal,3)),l.boundingSphere=new at(new C,12);const a=Array.from({length:gt},()=>new C(0,99,0)),r=new Q({vertexShader:Oe,fragmentShader:Ue,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uTime:{value:0},uDpr:t.uDpr,uLens:t.uLens,uDefocus:t.uDefocus,uLight:t.uLight,uPointer:t.uPointer,uAlpha:{value:1},uIons:{value:a},uIonCount:{value:0}}});h.add(new tt(l,r)),v.push(l,r);const i=Xt*(1+ot),d=new Float32Array(i*3),A=new Float32Array(i),b=new Float32Array(i),E=new J;E.setAttribute("position",new $(d,3)),E.setAttribute("aSize",new $(A,1)),E.setAttribute("aAlpha",new $(b,1)),E.boundingSphere=new at(new C,20);const P=new Q({vertexShader:Ge,fragmentShader:Ve,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uDpr:t.uDpr,uAlpha:{value:1},uBoost:{value:1}}}),g=new tt(E,P);g.visible=s,h.add(g),v.push(E,P);const M=[],D=(x,y)=>{x.y=Kt,x.angle=Math.random()*Math.PI*2,x.radius=.9+Math.random()*.5,x.delay=y,x.dwell=.55+Math.random()*.35,x.gap=.28+Math.random()*.17,x.trail=[]};for(let x=0;x<Xt;x++){const y={y:Kt,angle:0,radius:0,delay:0,dwell:.78,gap:.34,trail:[]};D(y,x*.7),M.push(y)}let z=0;const _=(x,y)=>{if(Math.abs(x)>.95)return 1.15;let T=.62;for(const S of ke)T*=1-y*Math.exp(-Math.pow((x-S)/.07,2));return T},w={group:h,ionBoost:1,update:(x,y,T,S=T)=>{if(r.uniforms.uTime.value+=x*y,r.uniforms.uAlpha.value=.05+.95*T,P.uniforms.uAlpha.value=.1+.9*Math.max(T,S),P.uniforms.uBoost.value=w.ionBoost,!s)return;z+=x;const H=z>.04;H&&(z=0);const F=M.map((p,f)=>f).sort((p,f)=>M[p].y-M[f].y);F.forEach((p,f)=>{const m=M[p];if(m.delay>0){m.delay-=x*y;return}let B=x*_(m.y,m.dwell)*y;if(f>0){const O=M[F[f-1]],U=m.y-O.y,V=Math.abs(m.y)<1.4?m.gap:.55;U-B<V&&(B=Math.max(0,U-V))}const I=m.y;m.y-=B,I>0&&m.y<=0&&Nt.emit({time:performance.now(),rig:e,ion:p}),m.angle+=x*(1.1+.3*Math.sin(p))*y;const k=Math.abs(m.y)<1?0:Math.min(1.4,(Math.abs(m.y)-1)*.55+.05);m.radius+=(k-m.radius)*Math.min(1,x*5),m.y<Ne&&D(m,.4+Math.random()*1.2)});let c=0;M.forEach((p,f)=>{const m=p.delay<=0,B=Math.cos(p.angle)*p.radius,I=Math.sin(p.angle)*p.radius;H&&m&&(p.trail.unshift(B,p.y,I),p.trail.length>ot*3&&(p.trail.length=ot*3)),m&&Math.abs(p.y)<1.5&&c<gt&&a[c++].set(B,p.y,I);const k=m?Math.max(0,Math.min(1,(4.2-Math.abs(p.y))/.9)):0,O=Math.abs(p.y)<.95?1:0,U=f*(1+ot);d[U*3]=B,d[U*3+1]=p.y,d[U*3+2]=I,A[U]=9.5+O*2.5,b[U]=k;for(let V=0;V<ot;V++){const L=U+1+V,G=V*3,W=p.trail.length>G+2;d[L*3]=W?p.trail[G]:B,d[L*3+1]=W?p.trail[G+1]:p.y,d[L*3+2]=W?p.trail[G+2]:I;const Y=1-(V+1)/(ot+1);A[L]=1.6+4.6*Y,b[L]=W?k*Y*.32:0}}),r.uniforms.uIonCount.value=c,E.attributes.position.needsUpdate=!0,E.attributes.aSize.needsUpdate=!0,E.attributes.aAlpha.needsUpdate=!0},dispose:()=>{n(),v.forEach(x=>x.dispose())}};return w}const je=.45,Xe=.2,ft=18,Yt=36,Ke=.9,Ye=4,zt=.35,dt=.3,qe=1.5,Ze=.8,Je=.6,Qe=.7,ta=.3;function ea(t){return()=>{t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function qt(t,e={}){const o=t.branches.length,s=ea(e.seed??1),n=e.motility??1,h=e.tempo??1,v=Ke*(e.reach??1),u=new Float32Array(o),l=new Float32Array(o),a=new Float32Array(o),r=new Float32Array(o),i=new Float32Array(o),d=new Float32Array(o*3);t.branches.forEach((z,_)=>{u[_]=z.isTip?je:z.depth===4?Xe:0,l[_]=2*Math.PI/(ft+s()*(Yt-ft)),a[_]=2*Math.PI/(ft+s()*(Yt-ft)),r[_]=s()*Math.PI*2,i[_]=s()*Math.PI*2;const R=z.points.length-3;d[_*3]=z.points[R],d[_*3+1]=z.points[R+1],d[_*3+2]=z.points[R+2]});const A=new Float32Array(o).fill(1),b=new Float32Array(o*3),E=new Uint8Array(o),P=[];let g=0;const M={ext:A,disp:b,somaScale:1,thickness:1,update:D};function D({dt:z,motion:_,pointer:R,activation:w}){if(_<=0||z<=0)return;if(g+=z*_*h,E.fill(0),R){P.length=0;for(let y=0;y<o;y++){if(!t.branches[y].isTip)continue;const T=Math.hypot(R[0]-d[y*3],R[1]-d[y*3+1],R[2]-d[y*3+2]);T<v&&P.push({i:y,d:T})}P.sort((y,T)=>y.d-T.d);for(let y=0;y<Math.min(Ye,P.length);y++)E[P[y].i]=1}const x=Math.max(0,Math.min(1,w));for(let y=0;y<o;y++){const T=t.branches[y],S=.6*Math.sin(l[y]*g+r[y])+.4*Math.sin(a[y]*g+i[y]);let H=E[y]?1:1-u[y]*n*(.5+.5*S);T.depth>=2&&(H*=1-Je*x);const F=E[y]?qe:Ze,c=1-Math.exp(-F*z*_);A[y]+=(H-A[y])*c,A[y]<0&&(A[y]=0),A[y]>1&&(A[y]=1);let p=0,f=0,m=0;if(E[y]&&R){p=(R[0]-d[y*3])*zt,f=(R[1]-d[y*3+1])*zt,m=(R[2]-d[y*3+2])*zt;const B=Math.hypot(p,f,m);B>dt&&(p*=dt/B,f*=dt/B,m*=dt/B)}b[y*3]+=(p-b[y*3])*c,b[y*3+1]+=(f-b[y*3+1])*c,b[y*3+2]+=(m-b[y*3+2])*c}M.somaScale=1+Qe*x,M.thickness=1+ta*x}return M}const he=1.2,wt=.6,pe=.12,fe=.36,yt=.55,xt=4,Zt=2.5,aa=6.5,Jt=10,na=8,oa=3,de=4,sa=.16,ia=.03,Bt=320,ra=40;function me(t){const e=t.branches,o=e.length,s=new Float32Array(o).fill(-1),n=new Float32Array(o),h=new Int32Array(o),v=l=>{if(s[l]>=0)return s[l];const a=e[l];return a.parent<0?(s[l]=Math.hypot(a.points[0],a.points[1],a.points[2]),h[l]=l):(s[l]=v(a.parent)+e[a.parent].length,h[l]=h[a.parent]),s[l]};let u=0;for(let l=0;l<o;l++)n[l]=v(l)+e[l].length,n[l]>u&&(u=n[l]);return{rootDist:s,endDist:n,root:h,maxDist:u}}function la(t,e){let o=-1,s=1/0;for(const n of t.branches){if(!n.isTip)continue;const h=n.points.length-3,v=Math.hypot(e[0]-n.points[h],e[1]-n.points[h+1],e[2]-n.points[h+2]);v<s&&(s=v,o=n.id)}return o}function ca(t,e,o){const s=t.branches,n=s.length,h=new Uint8Array(n);for(let i=o;i>=0;i=s[i].parent)h[i]=1;const v=e.root[o],u=s[v].points,l=[u[0],u[1],u[2]],a=e.rootDist[v],r=new Float32Array(n);for(let i=0;i<n;i++){if(e.root[i]!==v){const A=s[e.root[i]].points,b=Math.hypot(A[0]-l[0],A[1]-l[1],A[2]-l[2]);r[i]=(a+e.rootDist[e.root[i]]-b)/2;continue}let d=i;for(;!h[d];)d=s[d].parent;r[i]=e.endDist[d]}return{tip:o,tipDist:e.endDist[o],junction:r,entry:l,entryDist:a}}const ua=(t,e,o)=>Math.abs(o-t.junction[e])+(t.tipDist-t.junction[e]),ve=t=>{const e=t<0?0:t>1?1:t;return e*e*(3-2*e)};function Qt(t,e,o=!1){if(e<0)return 0;if(o)return yt*Math.exp(-e/xt);const s=e-he;if(s<=0)return 0;const n=t-wt*s,h=n>0?1-ve(n/pe):Math.exp(n/fe),v=n<0?yt*Math.exp(n/(wt*xt)):0;return Math.min(1,v+(1-v)*h)}function ha(t,e=!1){return t<0?0:t>=Jt?Math.exp(-(t-Jt)/na):e?1:ve((t-Zt)/(aa-Zt))}function At(t){return()=>{t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}const te=t=>t.toFixed(3),pa=`
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
    vec3 p = uOrigin + position * (${te(sa)} * sqrt(t)) + uDrift * t;
    p += vec3(sin(t * 3.1 + aSeed * 40.0), cos(t * 2.7 + aSeed * 30.0), sin(t * 2.3 + aSeed * 20.0)) * 0.012 * sqrt(t);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    float foc = 1.0 - smoothstep(0.0, 18.0, abs(dist - ${nt.toFixed(1)}));
    float persp = 300.0 / max(dist, 1.0);
    gl_PointSize = clamp((1.3 + 1.4 * fract(aSeed * 7.31)) * uDpr * persp * 0.045 * (1.0 + (1.0 - foc) * 1.2), 0.75, 6.0 * uDpr);
    float fade = smoothstep(0.0, 0.12, t) * (1.0 - smoothstep(1.2, ${te(de)}, t));
    vA = fade * (0.45 + 0.4 * fract(aSeed * 3.3)) * (0.04 + 0.96 * foc) * uReveal;
  }
`,fa=`
  precision highp float;
  uniform float uAlpha;
  varying float vA;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.2, r) * vA * uAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(0.776, 0.486, 0.149, a);
  }
`;function da(t,e=1){const o=At(e*17+3),s=()=>Math.sqrt(-2*Math.log(1-o()))*Math.cos(2*Math.PI*o()),n=new Float32Array(Bt*3),h=new Float32Array(Bt);for(let i=0;i<Bt;i++)n[i*3]=s(),n[i*3+1]=s(),n[i*3+2]=s(),h[i]=o();const v=new J;v.setAttribute("position",new $(n,3)),v.setAttribute("aSeed",new $(h,1));const u=new Q({vertexShader:pa,fragmentShader:fa,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uT:{value:-1},uOrigin:{value:new C},uDrift:{value:new C},uDpr:t.uDpr,uAlpha:t.uAlpha,uReveal:{value:1}}}),l=new tt(v,u);l.frustumCulled=!1,l.visible=!1;const a=At(e*5+11);let r=-1;return{points:l,get t(){return r},start(i){r=0,u.uniforms.uOrigin.value.set(i.x,i.y,i.z),u.uniforms.uDrift.value.set(a()-.5,a()-.5,a()-.5).normalize().multiplyScalar(ia)},update(i,d,A){r>=0&&(r+=i*d,r>de&&(r=-1)),u.uniforms.uT.value=r,u.uniforms.uReveal.value=A,l.visible=r>=0},dispose(){v.dispose(),u.dispose()}}}const kt=.12,ge=2e4,ee=12;function ma(t,e=ge,o=1){const s=At(o),n=Math.round(e*kt),h=e-n,v=t.branches.map(S=>S.length*(S.radius0+S.radius1)*.5),u=v.reduce((S,H)=>S+H,0),l=me(t),a=new Float32Array(e*3),r=new Float32Array(e),i=new Float32Array(e),d=new Float32Array(e),A=new Float32Array(e),b=new Float32Array(e),E=new Float32Array(e*3),P=new Float32Array(e);let g=0;for(;g<n;g++){const S=s()*2-1,H=s()*Math.PI*2,F=Math.sqrt(1-S*S),c=s(),p=t.soma*(.85+.3*c);a[g*3]=F*Math.cos(H)*p,a[g*3+1]=S*p,a[g*3+2]=F*Math.sin(H)*p,E[g*3]=F*Math.cos(H),E[g*3+1]=S,E[g*3+2]=F*Math.sin(H),P[g]=c,r[g]=-1,i[g]=0,d[g]=s(),A[g]=1,b[g]=0}const M=v.map(S=>h*S/u),D=M.map(Math.floor);let z=h-D.reduce((S,H)=>S+H,0);const _=M.map((S,H)=>({k:H,frac:S-Math.floor(S)})).sort((S,H)=>H.frac-S.frac);for(let S=0;z>0&&S<_.length;S++,z--)D[_[S].k]++;const R=new C,w=new C,x=new C,y=new C(0,1,0),T=new C;return t.branches.forEach((S,H)=>{const F=S.points.length/3;for(let c=0;c<D[H];c++,g++){const p=s(),f=p*S.length;let m=0;for(;m<F-2&&S.cum[m+1]<f;)m++;const B=S.cum[m+1]-S.cum[m],I=B>0?(f-S.cum[m])/B:0,k=S.points[m*3],O=S.points[m*3+1],U=S.points[m*3+2],V=S.points[m*3+3],L=S.points[m*3+4],G=S.points[m*3+5];T.set(k+(V-k)*I,O+(L-O)*I,U+(G-U)*I),R.set(V-k,L-O,G-U).normalize(),R.lengthSq()===0&&R.set(0,1,0),w.crossVectors(R,Math.abs(R.y)>.9?new C(1,0,0):y).normalize(),x.crossVectors(R,w);const W=(S.radius0+(S.radius1-S.radius0)*p)*(.85+.3*s()),Y=s()*Math.PI*2,lt=Math.cos(Y),ct=Math.sin(Y);T.addScaledVector(w,lt*W).addScaledVector(x,ct*W),a[g*3]=T.x,a[g*3+1]=T.y,a[g*3+2]=T.z,E[g*3]=w.x*lt+x.x*ct,E[g*3+1]=w.y*lt+x.y*ct,E[g*3+2]=w.z*lt+x.z*ct,r[g]=H,i[g]=p,d[g]=s(),A[g]=0,b[g]=l.rootDist[H]+p*S.length}}),{position:a,aBranch:r,aT:i,aSeed:d,aSoma:A,aDist:b,aNormal:E,aShell:P,count:e}}const Ot=3,Ht=[0,1,2].map(t=>((t+.5)/Ot).toFixed(4)),q=t=>t.toFixed(3),va=`
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
    if (instant > 0.5) return ${q(yt)} * exp(-t / ${q(xt)});
    float tw = t - ${q(he)};
    if (tw <= 0.0) return 0.0;
    float x = d - ${q(wt)} * tw;
    float band = x > 0.0 ? 1.0 - smoothstep(0.0, ${q(pe)}, x) : exp(x / ${q(fe)});
    float plateau = x < 0.0 ? ${q(yt)} * exp(x / ${q(wt*xt)}) : 0.0;
    return clamp(plateau + (1.0 - plateau) * band, 0.0, 1.0);
  }

  void main() {
    vec3 pos = position;
    float hidden = 0.0;
    if (aSoma < 0.5) {
      vec4 st = texture2D(uBranch, vec2((aBranch + 0.5) / uBranchCount, ${Ht[0]}));
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
      float jA = texture2D(uBranch, vec2((aBranch + 0.5) / uBranchCount, ${Ht[1]})).r;
      float jB = texture2D(uBranch, vec2((aBranch + 0.5) / uBranchCount, ${Ht[2]})).r;
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
`,ga=`
  precision highp float;
  ${bt}
  ${St}
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
`,wa=`
  uniform vec3 uPos;
  uniform float uScale;
  uniform float uDpr;
  void main() {
    vec4 mv = modelViewMatrix * vec4(uPos, 1.0);
    gl_Position = projectionMatrix * mv;
    float persp = 300.0 / max(-mv.z, 1.0);
    gl_PointSize = clamp(uDpr * persp * 0.6 * uScale, 3.0, 32.0 * uDpr);
  }
`,ya=`
  precision highp float;
  ${ce}
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
`,X={appear:.7,reach:1.6,cup:1.1,close:.9,retract:1,digest:.8},it=.17,xa=.1,Aa=1.5,ae=6,Ma=9,ba=.45,Z=t=>{const e=Math.max(0,Math.min(1,t));return e*e*(3-2*e)},Sa=t=>1-Math.pow(1-Math.max(0,Math.min(1,t)),3);function Pa(t,e){var F;const o=At(e),s=c=>new C(c.points[c.points.length-3],c.points[c.points.length-2],c.points[c.points.length-1]),n=t.branches.filter(c=>c.isTip).map(c=>({b:c,d:s(c).length()})).sort((c,p)=>p.d-c.d),h=n.slice(0,Math.max(6,Math.round(n.length*.5))).map(c=>c.b),v=((F=[...h].sort((c,p)=>c.length-p.length)[Math.floor(h.length/2)])==null?void 0:F.length)??0,u=h.filter(c=>c.length>=v);u.length<3&&u.push(...h.slice(0,3));let l=-1;const a={branch:-1,reach:0,disp:new C,cup:0,wrap:0,cupRadius:it,target:new C,axis:new C(0,0,1),u:new C(1,0,0),v:new C(0,1,0),particle:new C,particleAlpha:0,particleScale:1,phagosome:new C,bulge:0,somaBump:0};let r="rest",i=0,d=Aa,A=0;const b=new C,E=new C,P=new C;let g=new Float32Array(0),M=new Float32Array(0),D=0;const z=new C,_=new C;function R(c){const p=[];let f=c,m=0;for(;f&&m++<64;){for(let I=f.points.length-3;I>=0;I-=3){const k=f.points[I],O=f.points[I+1],U=f.points[I+2],V=p.length;V&&p[V-3]===k&&p[V-2]===O&&p[V-1]===U||p.push(k,O,U)}f=f.parent>=0&&f.parent!==f.id?t.branches[f.parent]:void 0}p.push(0,0,0),g=Float32Array.from(p);const B=g.length/3;M=new Float32Array(B);for(let I=1;I<B;I++)M[I]=M[I-1]+Math.hypot(g[I*3]-g[I*3-3],g[I*3+1]-g[I*3-2],g[I*3+2]-g[I*3-1]);D=M[B-1]}function w(c,p){const f=g.length/3;if(f===0)return p.set(0,0,0);if(c<=0)return p.set(g[0],g[1],g[2]);if(c>=D)return p.set(0,0,0);let m=1;for(;m<f-1&&M[m]<c;)m++;const B=(c-M[m-1])/Math.max(1e-6,M[m]-M[m-1]);return p.set(g[m*3-3]+(g[m*3]-g[m*3-3])*B,g[m*3-2]+(g[m*3+1]-g[m*3-2])*B,g[m*3-1]+(g[m*3+2]-g[m*3-1])*B)}const x=n.map(c=>s(c.b));function y(c,p){let f=1/0;for(let m=0;m<n.length;m++)n[m].b.id!==c.id&&(f=Math.min(f,x[m].distanceTo(p)));return f}function T(){let c=u[0],p=-1;for(let k=0;k<4;k++){const O=u[Math.floor(o()*u.length)];if(O.id===l&&u.length>1)continue;const U=s(O),V=z.set(U.x-O.points[0],U.y-O.points[1],U.z-O.points[2]).normalize(),L=_.copy(U).addScaledVector(V,.35),G=y(O,L);G>p&&(p=G,c=O)}l=c.id,b.copy(s(c));const f=z.set(b.x-c.points[0],b.y-c.points[1],b.z-c.points[2]).normalize();f.lengthSq()===0&&f.copy(b).normalize();const m=_.set(o()-.5,o()-.5,o()-.5).cross(f).normalize(),B=Math.min(.55,Math.max(.3,c.length*.9));E.copy(b).addScaledVector(f,B).addScaledVector(m,B*.35*(o()-.5)*2);const I=z.subVectors(E,b).normalize();a.axis.copy(I).negate(),P.copy(E).addScaledVector(I,-.17).sub(b),a.u.set(0,1,0),Math.abs(a.axis.y)>.9&&a.u.set(1,0,0),a.u.cross(a.axis).normalize(),a.v.crossVectors(a.axis,a.u).normalize(),a.branch=c.id,R(c),r="appear",i=0}function S(){a.branch=-1,a.reach=0,a.cup=0,a.wrap=0,a.cupRadius=it,a.particleAlpha=0,a.particleScale=1,a.bulge=0,a.somaBump=0,r="rest",i=0,d=ae+o()*(Ma-ae)}function H(c){if(c<=0)return;A+=c,i+=c;const p=f=>a.particle.copy(E).add(z.set(Math.sin(A*7.1)*f,Math.cos(A*5.3)*f,Math.sin(A*6.2+1.3)*f));switch(r){case"rest":i>=d&&T();break;case"appear":{a.particleAlpha=Z(i/X.appear),p(.014),i>=X.appear&&(r="reach",i=0);break}case"reach":{const f=Z(i/X.reach);a.reach=f,a.disp.copy(P).multiplyScalar(f),p(.014*(1-f)),a.particleAlpha=1,i>=X.reach&&(r="cup",i=0,a.target.copy(a.particle));break}case"cup":{a.reach=1,a.disp.copy(P),a.cup=Sa(i/X.cup),a.wrap=.3*a.cup,a.particle.copy(a.target),i>=X.cup&&(r="close",i=0);break}case"close":{const f=Z(i/X.close);a.cup=1,a.wrap=.3+.7*f,a.cupRadius=it+(xa-it)*f,a.particleScale=1-.3*f,i>=X.close&&(r="retract",i=0);break}case"retract":{const f=Z(i/X.retract);a.reach=1-f,a.disp.copy(P).multiplyScalar(a.reach),a.target.copy(b).add(a.disp).addScaledVector(a.axis,-.1*(1-f)),a.particle.copy(a.target),i>=X.retract&&(r="transport",i=0);break}case"transport":{const f=i*ba;a.reach=0,a.cup=1-Z(i/.5),a.wrap=1,w(f,a.particle),a.target.copy(a.particle),a.phagosome.copy(a.particle),a.bulge=Z(i/.4),f>=D&&(r="digest",i=0);break}case"digest":{const f=i/X.digest;a.cup=0,a.particle.set(0,0,0),a.phagosome.set(0,0,0),a.particleAlpha=1-Z(f),a.bulge=1-Z(f),a.somaBump=Math.sin(Math.PI*Math.min(1,f)),i>=X.digest&&S();break}}}return{out:a,step:H,feed(){r==="rest"&&(d=0)}}}function Qa(t,e,o={}){const s=ma(e,o.count??ge,o.seed??1),n=new J;n.setAttribute("position",new $(s.position,3)),n.setAttribute("aBranch",new $(s.aBranch,1)),n.setAttribute("aT",new $(s.aT,1)),n.setAttribute("aSeed",new $(s.aSeed,1)),n.setAttribute("aSoma",new $(s.aSoma,1)),n.setAttribute("aDist",new $(s.aDist,1)),n.setAttribute("aNormal",new $(s.aNormal,3)),n.setAttribute("aShell",new $(s.aShell,1)),n.boundingSphere=new at(new C,e.bound*1.5);const h=e.branches.length,v=new Float32Array(h*4*Ot);for(let c=0;c<h;c++)v[c*4]=1;const u=new xe(v,h,Ot,Ae,Me);u.magFilter=Gt,u.minFilter=Gt,u.needsUpdate=!0;const l=new Q({vertexShader:va,fragmentShader:ga,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uSize:t.uSize,uDpr:t.uDpr,uMaxPx:{value:ee},uLens:t.uLens,uPointer:t.uPointer,uAlpha:t.uAlpha,uBranch:{value:u},uBranchCount:{value:h},uSomaScale:{value:1},uThickness:{value:1},uReveal:{value:1},uDraw:{value:1},uDefocus:t.uDefocus,uLight:t.uLight,uPhagoBranch:{value:-1},uTarget:{value:new C},uCupAxis:{value:new C(0,0,1)},uCupU:{value:new C(1,0,0)},uCupV:{value:new C(0,1,0)},uCup:{value:0},uCupRadius:{value:it},uCupWrap:{value:0},uPhagoPos:{value:new C},uBulge:{value:0},uReach:{value:0},uStimT:{value:new et(-1,-1)},uStimInstant:{value:new et(0,0)},uTipDist:{value:new et(0,0)},uEntryDist:{value:new et(0,0)},uEntryA:{value:new C},uEntryB:{value:new C}}}),a=new Mt;a.add(new tt(n,l)),a.scale.setScalar(o.scale??1);const r=o.phagocytosis?Pa(e,(o.seed??1)*31+7):null;let i=null,d=null;if(r){const c=new J;c.setAttribute("position",new $(new Float32Array(3),3)),c.boundingSphere=new at(new C,e.bound*2),d=new Q({vertexShader:wa,fragmentShader:ya,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uPos:{value:new C},uScale:{value:1},uDpr:t.uDpr,uAlpha:{value:0},uCellAlpha:t.uAlpha,uReveal:{value:1}}}),i=new tt(c,d),i.visible=!1,a.add(i)}const A=!!o.atp,b=me(e),E=b.maxDist*1.02;let P=null;A&&(P=da(t,o.seed??1),a.add(P.points));const g=[{t:-1,instant:!1,s:null},{t:-1,instant:!1,s:null}];let M=0;const D=[0,0,0];let z=0,_=0;const R=e.branches.map(c=>c.length*(c.radius0+c.radius1)*.5),w=R.reduce((c,p)=>c+p,0),x=[.17,.5,.83],y=()=>{let c=0;for(const p of g){if(p.t<0||!p.s)continue;let f=0;for(let m=0;m<h;m++){const B=e.branches[m];let I=0;for(const k of x)I+=Qt(ua(p.s,m,b.rootDist[m]+k*B.length),p.t,p.instant);f+=I/x.length*(R[m]/w)*(1-kt)}f+=kt*Qt(p.s.tipDist-p.s.entryDist+e.soma,p.t,p.instant),c=Math.max(c,f)}return c};let T=qt(e,o);const S=o.surveillance??!1,H=new C,F={group:a,reveal:1,draw:1,maxPx:ee,calcium:0,get motility(){return T},setMotility(c){T=qt(e,{...o,...c})},update(c,p,f,m){let B=null;S&&f&&(H.set(f.x,f.y,a.position.z),a.worldToLocal(H),B=[H.x,H.y,H.z]);let I=0;if(A){for(const L of g)if(!(L.t<0)){if(L.t+=c*(L.instant?1:p),L.t>ra){L.t=-1;continue}I=Math.max(I,ha(L.t,L.instant))}l.uniforms.uStimT.value.set(g[0].t,g[1].t),z>0&&(z-=c*p,B=D),P==null||P.update(c,p,F.reveal),_+=c,_>=1/Tt&&(_=Math.min(_-1/Tt,1/Tt),F.calcium=y(),Vt.write(F.calcium))}T.update({dt:c,motion:p,pointer:B,activation:Math.max(m,I)});const{ext:k,disp:O}=T,U=F.draw>=1?1/0:F.draw*E;for(let L=0;L<h;L++){const G=e.branches[L],W=U===1/0?1:Math.max(0,Math.min(1,(U-b.rootDist[L])/Math.max(1e-4,G.length)));v[L*4]=k[L]*W,v[L*4+1]=O[L*3],v[L*4+2]=O[L*3+1],v[L*4+3]=O[L*3+2]}let V=0;if(r&&i&&d){F.reveal>.9&&r.step(c*Math.max(0,Math.min(1,p)));const L=r.out;if(L.branch>=0&&L.reach>0){const W=L.branch,Y=L.reach;v[W*4]+=(1-v[W*4])*Y,v[W*4+1]+=(L.disp.x-v[W*4+1])*Y,v[W*4+2]+=(L.disp.y-v[W*4+2])*Y,v[W*4+3]+=(L.disp.z-v[W*4+3])*Y}const G=l.uniforms;G.uPhagoBranch.value=L.branch,G.uReach.value=L.reach,G.uTarget.value.copy(L.target),G.uCupAxis.value.copy(L.axis),G.uCupU.value.copy(L.u),G.uCupV.value.copy(L.v),G.uCup.value=L.cup,G.uCupRadius.value=L.cupRadius,G.uCupWrap.value=L.wrap,G.uPhagoPos.value.copy(L.phagosome),G.uBulge.value=L.bulge,d.uniforms.uPos.value.copy(L.particle),d.uniforms.uScale.value=L.particleScale,d.uniforms.uAlpha.value=L.particleAlpha,d.uniforms.uReveal.value=F.reveal,i.visible=L.particleAlpha>.01,V=L.somaBump}u.needsUpdate=!0,l.uniforms.uSomaScale.value=T.somaScale*(1+.06*V),l.uniforms.uThickness.value=T.thickness,l.uniforms.uReveal.value=F.reveal,l.uniforms.uDraw.value=F.draw,l.uniforms.uMaxPx.value=F.maxPx},feed(){r==null||r.feed()},stimulate(c,p={}){if(!A)return;const f=ca(e,b,la(e,[c.x,c.y,c.z])),m=M;M=1-M;const B=(1+m)*h*4;for(let O=0;O<h;O++)v[B+O*4]=f.junction[O];const I=!!p.instant;g[m]={t:0,instant:I,s:f};const k=l.uniforms;m===0?(k.uTipDist.value.x=f.tipDist,k.uEntryDist.value.x=f.entryDist,k.uStimInstant.value.x=I?1:0,k.uEntryA.value.set(f.entry[0],f.entry[1],f.entry[2])):(k.uTipDist.value.y=f.tipDist,k.uEntryDist.value.y=f.entryDist,k.uStimInstant.value.y=I?1:0,k.uEntryB.value.set(f.entry[0],f.entry[1],f.entry[2])),D[0]=c.x,D[1]=c.y,D[2]=c.z,z=oa,P&&!I&&P.start(c),Vt.stimulatedAt=performance.now()},dispose(){n.dispose(),l.dispose(),u.dispose(),i==null||i.geometry.dispose(),d==null||d.dispose(),P==null||P.dispose()}};return F}const tn=1.05,Ta=.19,ne=11,oe=72,Ea=3,Da=.03,La=11,Ra=.5,Ia=.32,se=.22,Ca=1.45,_a=`
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
    float breath = 1.0 + ${Da.toFixed(3)} * sin(uTime * aBreath.x + aBreath.y);
    vec3 p = (cos(ang) * aU + sin(ang) * aV) * breath;
    vec4 wp = modelMatrix * vec4(p, 1.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    float foc = (1.0 - smoothstep(0.0, 18.0, abs(dist - ${nt.toFixed(1)}))) * (1.0 - uDefocus);
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
`,Fa=`
  precision highp float;
  ${bt}
  ${St}
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
`;function en(t,e=5){let o=e*7919+13;const s=()=>(o=o*1664525+1013904223>>>0,o/4294967296),n=[],h=[],v=[],u=[],l=[],a=[],r=[],i=(T,S,H,F,c,p,f)=>{n.push(T.x,T.y,T.z),h.push(S.x,S.y,S.z),v.push(H),u.push(F),l.push(s()),a.push(c),r.push(p,f)},d=new C,A=new C,b=new C,E=new C;for(let T=0;T<ne;T++){const S=Te(T,ne);d.set(S[0],S[1],S[2]).normalize(),E.set(0,1,0),Math.abs(d.y)>.9&&E.set(1,0,0),A.crossVectors(d,E).normalize(),b.crossVectors(d,A).normalize();const H=s()*Math.PI*2,F=2*Math.PI/La,c=(s()-.5)*2*Ra;for(let m=0;m<oe;m++)i(A,b,H+m/oe*Math.PI*2+(s()-.5)*.02,0,0,F,c);const p=s()<.5?1:-1,f=(.22+.36*s())*p;for(let m=0;m<Ea;m++)i(A,b,s()*Math.PI*2,f*(.85+.3*s()),1,F,c)}const P=new J,g=a.length;P.setAttribute("position",new $(new Float32Array(g*3),3)),P.setAttribute("aU",new K(n,3)),P.setAttribute("aV",new K(h,3)),P.setAttribute("aPhase",new K(v,1)),P.setAttribute("aOmega",new K(u,1)),P.setAttribute("aSeed",new K(l,1)),P.setAttribute("aKind",new K(a,1)),P.setAttribute("aBreath",new K(r,2)),P.boundingSphere=new at(new C,4);const M=new Q({vertexShader:_a,fragmentShader:Fa,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uTime:{value:0},uDpr:t.uDpr,uLens:t.uLens,uDefocus:t.uDefocus,uLight:t.uLight,uPointer:t.uPointer,uAlpha:{value:1},uDraw:{value:1}}}),D=new Mt;D.add(new tt(P,M));let z=0,_=1,R=0,w=0;const x=(T,S,H,F)=>T+(S-T)*(1-Math.exp(-3*F)),y={group:D,draw:1,update(T,S,H,F){_=x(_,F?Ca:1,3,T),z+=T*S*_,M.uniforms.uTime.value=z,M.uniforms.uAlpha.value=.05+.95*H,M.uniforms.uDraw.value=y.draw,R=x(R,Ia+(F?F.y*se:0),3,T),w=x(w,F?-F.x*se:0,3,T),D.rotation.set(R,z*Ta,w)},dispose(){P.dispose(),M.dispose()}};return y}const za=8,Ba=80,mt=.012;function an(t,e,o,s={}){const n={active:!1,hover:!1,lastX:0,lastY:0,spin:0,pinch:1,pinching:!1},h=new C,v=(w,x)=>{if(!t.visible)return!1;h.copy(t.position).project(e);const y=(h.x*.5+.5)*window.innerWidth,T=(-h.y*.5+.5)*window.innerHeight;return Math.hypot(w-y,x-T)<o()},u=w=>{w.pointerType==="touch"||!v(w.clientX,w.clientY)||(n.active=!0,n.lastX=w.clientX,n.lastY=w.clientY,n.spin=0,document.body.style.cursor="grabbing")},l=w=>{if(w.pointerType==="touch")return;if(n.active){const y=w.clientX-n.lastX,T=w.clientY-n.lastY;t.rotation.y+=y*mt,s.tilt!==!1&&(t.rotation.x=Math.max(-1.3,Math.min(.7,t.rotation.x+T*.008))),n.spin=y*mt*40,n.lastX=w.clientX,n.lastY=w.clientY;return}const x=v(w.clientX,w.clientY);x!==n.hover&&(n.hover=x,document.body.style.cursor=x?"grab":"")},a=w=>{w.pointerType==="touch"||!n.active||(n.active=!1,document.body.style.cursor=n.hover?"grab":"")};window.addEventListener("pointerdown",u),window.addEventListener("pointermove",l),window.addEventListener("pointerup",a),window.addEventListener("pointercancel",a);const r=s.touch??null,i=new Map;let d="none";const A={x:0,y:0};let b=1,E=0,P=0,g=0;const M=()=>{const[w,x]=Array.from(i.values());return w&&x?Math.max(1,Math.hypot(w.x-x.x,w.y-x.y)):1},D=(w,x,y)=>{d="none",A.x=w,A.y=x,E=0,P=y,g=y},z=w=>{var x;if(w.pointerType==="touch"&&!((x=w.target)!=null&&x.closest("button, a"))){i.set(w.pointerId,{x:w.clientX,y:w.clientY});try{r==null||r.setPointerCapture(w.pointerId)}catch{}i.size===1?(n.spin=0,D(w.clientX,w.clientY,w.timeStamp)):i.size===2&&(n.active=!1,n.pinching=!0,n.pinch=1,b=M(),d="turn")}},_=w=>{const x=i.get(w.pointerId);if(!x)return;const y=x.x;if(x.x=w.clientX,x.y=w.clientY,i.size>=2){n.pinching&&(n.pinch=M()/b);return}if(d==="none"){const F=w.clientX-A.x,c=w.clientY-A.y;if(Math.hypot(F,c)<za)return;d=Math.abs(F)>1.5*Math.abs(c)?"turn":"scroll",d==="turn"&&(n.active=!0),P=w.timeStamp;return}if(d!=="turn")return;const T=w.clientX-y,S=Math.max(1,w.timeStamp-P)/1e3;P=w.timeStamp,g=w.timeStamp,t.rotation.y+=T*mt;const H=T*mt/S;E+=(H-E)*.5},R=w=>{var x;if(i.has(w.pointerId)){if(i.delete(w.pointerId),n.pinching&&i.size<2){n.pinching=!1;const y=n.pinch;n.pinch=1,(x=s.onPinchEnd)==null||x.call(s,y);const T=Array.from(i.values())[0];T?D(T.x,T.y,w.timeStamp):d="none";return}i.size===0&&(n.active&&(n.active=!1,n.spin=w.timeStamp-g>Ba?0:E),d="none")}};return r&&(r.addEventListener("pointerdown",z),r.addEventListener("pointermove",_),r.addEventListener("pointerup",R),r.addEventListener("pointercancel",R)),{get active(){return n.active},get hover(){return n.hover},get spin(){return n.spin},set spin(w){n.spin=w},get pinch(){return n.pinch},get pinching(){return n.pinching},dispose(){window.removeEventListener("pointerdown",u),window.removeEventListener("pointermove",l),window.removeEventListener("pointerup",a),window.removeEventListener("pointercancel",a),r&&(r.removeEventListener("pointerdown",z),r.removeEventListener("pointermove",_),r.removeEventListener("pointerup",R),r.removeEventListener("pointercancel",R)),(n.hover||n.active)&&(document.body.style.cursor="")}}}const Ha=8,ka=700;function nn(t,e,o,s){const n={hover:!1,down:null},h=new C,v=new C,u=new et,l=new re,a=new be,r=new C,i=()=>{if(!t.visible)return null;const M=o();if(M<=0)return null;v.copy(t.position).applyMatrix4(e.matrixWorldInverse);const D=-v.z;if(D<=.1)return null;h.copy(t.position).project(e);const z=window.innerHeight/2/(Math.tan(e.fov*Math.PI/360)*D);return{x:(h.x*.5+.5)*window.innerWidth,y:(-h.y*.5+.5)*window.innerHeight,r:M*z}},d=(M,D)=>{const z=i();return!!z&&Math.hypot(M-z.x,D-z.y)<z.r},A=(M,D)=>!d(M,D)||(u.set(M/window.innerWidth*2-1,-(D/window.innerHeight)*2+1),l.setFromCamera(u,e),a.setFromNormalAndCoplanarPoint(e.getWorldDirection(v),t.position),!l.ray.intersectPlane(a,r))?!1:(t.worldToLocal(r),s(r.clone()),!0),b=M=>{d(M.clientX,M.clientY)&&(n.down={x:M.clientX,y:M.clientY,t:performance.now(),id:M.pointerId})},E=M=>{if(M.pointerType==="touch")return;const D=!n.down&&d(M.clientX,M.clientY);D!==n.hover&&(n.hover=D,D?document.body.style.cursor="pointer":document.body.style.cursor==="pointer"&&(document.body.style.cursor=""))},P=M=>{const D=n.down;!D||M.pointerId!==D.id||(n.down=null,!(Math.hypot(M.clientX-D.x,M.clientY-D.y)>Ha||performance.now()-D.t>ka)&&A(M.clientX,M.clientY))},g=()=>{n.down=null};return window.addEventListener("pointerdown",b),window.addEventListener("pointermove",E),window.addEventListener("pointerup",P),window.addEventListener("pointercancel",g),{get hover(){return n.hover},at:A,onScreen:i,dispose(){window.removeEventListener("pointerdown",b),window.removeEventListener("pointermove",E),window.removeEventListener("pointerup",P),window.removeEventListener("pointercancel",g),n.hover&&document.body.style.cursor==="pointer"&&(document.body.style.cursor="")}}}function Oa(t,e){const o=e.stride;if(t.byteLength%o!==0)throw new Error(`umap: ${t.byteLength} bytes is not a multiple of ${o}`);const s=t.byteLength/o,n=new DataView(t),h=new Float32Array(s*3),v=new Float32Array(s),u=new Float32Array(s*3),l=new Float32Array(s);for(let a=0;a<s;a++){const r=a*o;h[a*3]=n.getInt16(r,!0)/32767,h[a*3+1]=n.getInt16(r+2,!0)/32767,h[a*3+2]=n.getInt16(r+4,!0)/32767,v[a]=n.getUint8(r+6),u[a*3]=n.getUint8(r+7)/255,u[a*3+1]=n.getUint8(r+8)/255,u[a*3+2]=n.getUint8(r+9)/255,l[a]=(a*2654435761>>>0)/4294967296}return{n:s,position:h,state:v,expr:u,seed:l}}async function Ua(t){const e=await fetch(`${t}umap/manifest.json`).then(s=>s.json()),o=await fetch(`${t}umap/cells.bin`).then(s=>s.arrayBuffer());return{manifest:e,cells:Oa(o,e)}}const Ga=600,Va=12,ie=.035,$a=`
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
`,Wa=`
  precision highp float;
  ${St}
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
`;function on(t,e){const o=new Mt,s=new Q({vertexShader:$a,fragmentShader:Wa,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uSize:t.uSize,uDpr:t.uDpr,uLens:t.uLens,uDefocus:t.uDefocus,uPointer:t.uPointer,uAlpha:t.uAlpha,uReveal:{value:0},uMode:{value:0},uPrevMode:{value:0},uWave:{value:10},uWaveOrigin:{value:new C},uFocusState:{value:-1},uHover:{value:new C(99,99,99)},uMaxPx:{value:9}}});let n=null,h=null,v=null,u=null,l=!1;const a={group:o,ready:!1,manifest:null,reveal:0,maxPx:9,spin:.12,hoverEnabled:!0,labelsEnabled:!0,labelFade:1,update:z,dispose(){l=!0,n==null||n.dispose(),s.dispose()}};Ua(e).then(({manifest:_,cells:R})=>{l||(n=new J,n.setAttribute("position",new $(R.position,3)),n.setAttribute("aState",new $(R.state,1)),n.setAttribute("aExpr",new $(R.expr,3)),n.setAttribute("aSeed",new $(R.seed,1)),n.boundingSphere=new at(new C,1.8),o.add(new tt(n,s)),h=R.position,v=R.state,u=R.expr,a.manifest=_,a.ready=!0,N.count=_.n,N.ready=!0)}).catch(_=>console.warn("umap: data not loaded",_));const r=_=>Math.max(0,$t.indexOf(_));let i=N.changedAt;const d=new C,A=new Se,b=new re,E=new Pe,P=new C,g=new et;let M=0,D=-1;function z(_,R,w,x,y){var F;const T=s.uniforms;T.uReveal.value=a.reveal,T.uMaxPx.value=a.maxPx,T.uMode.value=r(N.mode),T.uPrevMode.value=r(N.prevMode),T.uFocusState.value=N.focusState,y&&(o.rotation.y+=_*a.spin*R),N.changedAt!==i&&(i=N.changedAt,d.set(t.uPointer.value.x,t.uPointer.value.y,o.position.z),Math.abs(d.x)>90&&d.set(0,0,o.position.z),o.worldToLocal(d),d.clampLength(0,1.2),T.uWaveOrigin.value.copy(d));const S=(performance.now()-N.changedAt)/Ga;if(T.uWave.value=Ee.reducedMotion?10:Math.min(10,S*3.2),!a.ready||!h||!v||!u||!a.manifest)return;M+=_;const H=a.hoverEnabled&&x&&o.visible&&a.reveal>.5;if(H&&M>1/Va){M=0,g.set(x.x,x.y),b.setFromCamera(g,w),E.copy(o.matrixWorld).invert(),A.copy(b.ray).applyMatrix4(E);const c=o.scale.x||1,p=ie*8/Math.max(c,.01);let f=-1,m=Math.min(p,ie*4),B=1/0;for(let I=0;I<h.length/3;I++){P.set(h[I*3],h[I*3+1],h[I*3+2]);const k=P.clone().sub(A.origin).dot(A.direction);if(k<0)continue;const O=A.distanceToPoint(P);(O<m||O<m*1.15&&k<B-.2)&&(f=I,m=O,B=k)}D=f}if(H||(D=-1),D>=0){T.uHover.value.set(h[D*3],h[D*3+1],h[D*3+2]);const c=(x.x+1)/2*window.innerWidth,p=(1-x.y)/2*window.innerHeight,f=((F=a.manifest.states[v[D]])==null?void 0:F.name)??"",m=N.mode,B=$t.indexOf(m)-1,I=B<0?f:`${m} ${(u[D*3+B]*a.manifest.p99[B]).toFixed(2)}`;N.hover={text:I,x:c,y:p}}else T.uHover.value.set(99,99,99),N.hover&&(N.hover=null);if(a.labelsEnabled&&o.visible){const c=P.setFromMatrixPosition(w.matrixWorld).clone();N.labels=a.manifest.states.map(p=>{const f=new C(p.centroid[0],p.centroid[1],p.centroid[2]);o.localToWorld(f);const m=f.distanceTo(c),B=1-Math.min(1,Math.abs(m-nt)/14);f.project(w);const I=f.z>1;return{text:p.name,state:p.id,x:(f.x+1)/2*window.innerWidth,y:(1-f.y)/2*window.innerHeight,opacity:I?0:a.reveal*a.labelFade*(.15+.85*B)*(N.focusState<0||N.focusState===p.id?1:.35)}})}else N.labels.length&&(N.labels=[])}return a}export{Za as C,tn as E,_e as L,bt as P,St as S,da as a,Qa as b,Ja as c,en as d,on as e,qa as f,Ka as g,nn as h,an as i,Ya as m};
