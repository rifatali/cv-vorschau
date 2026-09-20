var pe=Object.defineProperty;var fe=(n,t,a)=>t in n?pe(n,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):n[t]=a;var Mt=(n,t,a)=>fe(n,typeof t!="symbol"?t+"":t,a);import{V as I,B as J,a as W,S as ot,b as Q,c as Z,P as tt,G as zt,F as ct,D as de,R as me,f as ve,N as Ot,g as ee,h as ge,i as we,M as ye}from"./three-CdPaaKdt.js";import{D as at,k as Ut,T as St,a as Gt,u as N,s as xe,U as Vt}from"./index-47omwk3k.js";const j=624,ut=397,bt=2567483615,Pt=2147483648,Tt=2147483647;class Ae{constructor(t){Mt(this,"mt",new Uint32Array(j));Mt(this,"mti",j+1);if(!Number.isInteger(t)||t<0)throw new Error("PyRandom: seed must be a non-negative integer");const a=[];let s=t;do a.push(s%4294967296),s=Math.floor(s/4294967296);while(s>0);this.initByArray(a)}initGenrand(t){const a=this.mt;a[0]=t>>>0;for(let s=1;s<j;s++){const o=a[s-1]^a[s-1]>>>30;a[s]=Math.imul(1812433253,o)+s>>>0}this.mti=j}initByArray(t){const a=this.mt;this.initGenrand(19650218);let s=1,o=0;for(let u=Math.max(j,t.length);u>0;u--){const m=a[s-1]^a[s-1]>>>30;a[s]=(a[s]^Math.imul(m,1664525))+t[o]+o>>>0,s++,o++,s>=j&&(a[0]=a[j-1],s=1),o>=t.length&&(o=0)}for(let u=j-1;u>0;u--){const m=a[s-1]^a[s-1]>>>30;a[s]=(a[s]^Math.imul(m,1566083941))-s>>>0,s++,s>=j&&(a[0]=a[j-1],s=1)}a[0]=2147483648}genrandInt32(){const t=this.mt;let a;if(this.mti>=j){let s=0;for(;s<j-ut;s++)a=t[s]&Pt|t[s+1]&Tt,t[s]=t[s+ut]^a>>>1^(a&1?bt:0);for(;s<j-1;s++)a=t[s]&Pt|t[s+1]&Tt,t[s]=t[s+(ut-j)]^a>>>1^(a&1?bt:0);a=t[j-1]&Pt|t[0]&Tt,t[j-1]=t[ut-1]^a>>>1^(a&1?bt:0),this.mti=0}return a=t[this.mti++],a^=a>>>11,a^=a<<7&2636928640,a^=a<<15&4022730752,a^=a>>>18,a>>>0}random(){const t=this.genrandInt32()>>>5,a=this.genrandInt32()>>>6;return(t*67108864+a)/9007199254740992}uniform(t,a){return t+(a-t)*this.random()}}const ne=.22,ht=(n,t)=>[n[0]+t[0],n[1]+t[1],n[2]+t[2]],Me=(n,t)=>[n[0]-t[0],n[1]-t[1],n[2]-t[2]],vt=(n,t)=>[n[0]*t,n[1]*t,n[2]*t],Bt=n=>Math.hypot(n[0],n[1],n[2]),Et=n=>{const t=Bt(n);return t>0?vt(n,1/t):[0,0,0]};function Se(n=7,t=10,a=5,s=.72){const o=new Ae(n),u=[[0,0,0]],m=[],c=[ne],l=(r,i,d,A,M,b)=>{if(b<=0||A<.02)return;let E=Et(d),g=[i[0],i[1],i[2]],S=r;const L=3;for(let F=0;F<L;F++){const R=b>3?.32:.48;E=Et(ht(E,[o.uniform(-R,R),o.uniform(-R,R),o.uniform(-R,R)])),g=ht(g,vt(E,A/L)),u.push([g[0],g[1],g[2]]);const w=u.length-1,x=(F+1)/L;c.push(Math.max(.004,M*(1-.5*x))),m.push([S,w]),S=w}if(b===1){u.push(ht(g,vt(E,A*.28))),c.push(.0035),m.push([S,u.length-1]);return}const z=b>=4?3:o.random()<.82?2:3;for(let F=0;F<z;F++){const R=Et(ht(E,[o.uniform(-1,1),o.uniform(-1,1),o.uniform(-1,1)])),w=A*o.uniform(.52,.64);l(S,g,R,w,M*.58,b-1)}};for(let r=0;r<t;r++){const i=1-r/Math.max(1,t-1)*2,d=Math.sqrt(Math.max(0,1-i*i)),A=r*2.399963,M=[Math.cos(A)*d,i,Math.sin(A)*d],b=vt(M,.24);u.push(b),c.push(.042),m.push([0,u.length-1]);const E=s*o.uniform(.85,1.15);l(u.length-1,b,M,E,.04,a)}let e=0;for(const r of u)e=Math.max(e,Bt(r));return{verts:u,edges:m,radii:c,bound:e+.06}}const be=n=>[n[0],n[2],-n[1]];function Pe(n){const t=new Map;for(const[c,l]of n.edges)t.has(c)||t.set(c,[]),t.get(c).push(l);const a=[],s=(c,l)=>{l.push(c);const e=t.get(c)??[];if(e.length===1)s(e[0],l);else{a.push(l);for(const r of e)s(r,[c])}};for(const c of t.get(0)??[])s(c,[0]);const o=a.map((c,l)=>{const e=c[0]===0?c.slice(1):c,r=e.map(M=>be(n.verts[M])),i=new Float32Array(r.length*3),d=new Float32Array(r.length);let A=0;return r.forEach((M,b)=>{i.set(M,b*3),b>0&&(A+=Bt(Me(M,r[b-1]))),d[b]=A}),{id:l,points:i,cum:d,length:A,radius0:n.radii[e[0]],radius1:n.radii[e[e.length-1]],depth:0,parent:-1,children:[],isTip:!0}}),u=new Map;a.forEach((c,l)=>u.set(c[c.length-1],l)),a.forEach((c,l)=>{if(c[0]===0)return;const e=u.get(c[0]);e!==void 0&&(o[l].parent=e,o[e].children.push(l),o[e].isTip=!1)});const m=c=>o[c].parent<0?0:m(o[c].parent)+1;return o.forEach((c,l)=>c.depth=m(l)),{branches:o,soma:ne,bound:n.bound}}function Fn(n=7,t=10,a=5,s=.72){return Pe(Se(n,t,a,s))}const kt=`
  const vec3 GRAPHITE = vec3(0.24, 0.23, 0.23);
  const vec3 GRAPHITE_LIGHT = vec3(0.50, 0.48, 0.46);
  const vec3 GRAPHITE_DEEP = vec3(0.12, 0.11, 0.11);
  const vec3 AMBER = vec3(0.776, 0.486, 0.149);
`,Ht=`
  float stroke(vec2 uv, float seed, float sharp, float px) {
    float ang = seed * 6.2831853;
    float c = cos(ang), s = sin(ang);
    vec2 q = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);
    float elong = mix(1.0, 1.6, smoothstep(2.5, 5.0, px));
    float r = length(q * vec2(1.0, elong));
    float soft = mix(0.08, 0.34, sharp);
    return smoothstep(0.5, soft, r);
  }
`,oe=`
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
`,Te=new I(-.5,.75,.45).normalize();function _n(){return{uDefocus:{value:0},uLight:{value:Te.clone()}}}const Ee=`
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
    float persp = ${at.toFixed(1)} / max(dist, 1.0);
    gl_PointSize = clamp(uPx * uDpr * persp * (0.7 + 0.6 * fract(aSeed * 7.31)), 1.0, 96.0 * uDpr);
    vA = 1.0 - smoothstep(0.55, 1.0, length(position.xy));
    vSeed = aSeed;
  }
`,De=`
  precision highp float;
  ${kt}
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
`,Dt=20,Wt={x:.16,y:-.22},Le=.011;function zn(n,t=1){let a=t*7919+13;const s=()=>(a=a*1664525+1013904223>>>0,a/4294967296),o=()=>Math.sqrt(-2*Math.log(1-s()))*Math.cos(2*Math.PI*s()),u=new Float32Array(Dt*3),m=new Float32Array(Dt);for(let r=0;r<Dt;r++)u[r*3]=o()*.5,u[r*3+1]=o()*.5,u[r*3+2]=0,m[r]=s();const c=new J;c.setAttribute("position",new W(u,3)),c.setAttribute("aSeed",new W(m,1)),c.boundingSphere=new ot(new I,30);const l=new Q({vertexShader:Ee,fragmentShader:De,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uDpr:n.uDpr,uAlpha:n.uAlpha,uRadius:{value:new Z(1,1)},uPx:{value:40},uStrength:{value:0}}}),e=new tt(c,l);return e.frustumCulled=!1,e.renderOrder=-1,{points:e,place(r,i,d,A=60){e.position.set(r.x+i*Wt.x,r.y+d*Wt.y,r.z),l.uniforms.uRadius.value.set(i,d),l.uniforms.uPx.value=Math.max(i,d)*A*.9},update(r){l.uniforms.uStrength.value=Le*Math.max(0,Math.min(1,r)),e.visible=r>.01},dispose(){c.dispose(),l.dispose()}}}const nt=3.3,ae=1.3,Bn={radius:nt,halfHeight:4.2},Re=.36,gt=12,pt=n=>.78+.42*Math.pow(n/.95,2),Lt=n=>.22+.3*Math.pow(n/.95,2),Ce=[.5,.17,-.17,-.5],Ie=`
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
    float foc = (1.0 - smoothstep(0.0, 18.0, abs(dist - ${at.toFixed(1)}))) * (1.0 - uDefocus);
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
`,Fe=`
  precision highp float;
  ${kt}
  ${Ht}
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
`,_e=`
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
`,ze=`
  precision highp float;
  ${oe}
  uniform float uAlpha;
  varying float vA;
  void main() {
    vec3 col;
    float edge = sphere(gl_PointCoord, col);
    float a = edge * vA * uAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(col, min(1.0, a));
  }
`;function it(n,t,a,s,o,u,m,c){const l=Math.hypot(u,m,c)||1;n.pos.push(t,a,s),n.seed.push(Math.random()),n.kind.push(o),n.normal.push(u/l,m/l,c/l)}function Be(n,t=ae){const o=Math.ceil(nt/.20351),u=Math.ceil(nt/.235);for(let m=-o;m<=o;m++)for(let c=-u;c<=u;c++){const l=c*.235+(m%2?.1175:0)+(Math.random()-.5)*.05,e=m*.20351+(Math.random()-.5)*.05,r=Math.hypot(l,e);if(r>nt||r<t)continue;const i=nt*.78;if(!(r>i&&Math.random()<(r-i)/(nt-i)))for(const d of[1,-1]){const A=d*Re+(Math.random()-.5)*.03;it(n,l,A,e,0,0,d,0);for(let M=1;M<=4;M++){const b=M/4.6;it(n,l+(Math.random()-.5)*.05,A-d*(.07+.26*b),e+(Math.random()-.5)*.05,1,0,d,0)}}}}function ke(n){const t=7*Math.PI/180,a=Math.PI/2,s=110;for(let o=0;o<=s;o++){const u=-.95+1.9*o/s,m=pt(u),c=(pt(u+.01)-pt(u-.01))/.02,l=Math.round(2*Math.PI*m/.036);for(let i=0;i<l;i++){const d=i/l*Math.PI*2+o%2*(Math.PI/l);if((d%a+a)%a<t||(d%a+a)%a>a-t)continue;const M=.02,b=Math.cos(d),E=Math.sin(d);it(n,b*m+(Math.random()-.5)*M,u+(Math.random()-.5)*M,E*m+(Math.random()-.5)*M,2,b,-c,E)}const e=Lt(u),r=Math.round(2*Math.PI*e/.042);for(let i=0;i<r;i++){const d=i/r*Math.PI*2+o%2*(Math.PI/r),A=Math.cos(d),M=Math.sin(d);it(n,A*e,u,M*e,3,-A,.2,-M)}}for(const o of[-.95,.95])for(let u=0;u<8;u++){const m=u/7,c=Lt(o)+(pt(o)-Lt(o))*m,l=Math.round(2*Math.PI*c/.042);for(let e=0;e<l;e++){const r=e/l*Math.PI*2,i=(r%a+a)%a;i<t||i>a-t||it(n,Math.cos(r)*c,o,Math.sin(r)*c,2,0,o>0?1:-1,0)}}}const $t=10,et=8,Nt=3.9,He=-4;function kn(n,t="research",a={}){const s=a.channel!==!1,o=s?Ut.register(t):()=>{},u=new zt,m=[],c={pos:[],seed:[],kind:[],normal:[]};Be(c,s?ae:0),s&&ke(c);const l=new J;l.setAttribute("position",new ct(c.pos,3)),l.setAttribute("aSeed",new ct(c.seed,1)),l.setAttribute("aKind",new ct(c.kind,1)),l.setAttribute("aNormal",new ct(c.normal,3)),l.boundingSphere=new ot(new I,12);const e=Array.from({length:gt},()=>new I(0,99,0)),r=new Q({vertexShader:Ie,fragmentShader:Fe,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uTime:{value:0},uDpr:n.uDpr,uLens:n.uLens,uDefocus:n.uDefocus,uLight:n.uLight,uPointer:n.uPointer,uAlpha:{value:1},uIons:{value:e},uIonCount:{value:0}}});u.add(new tt(l,r)),m.push(l,r);const i=$t*(1+et),d=new Float32Array(i*3),A=new Float32Array(i),M=new Float32Array(i),b=new J;b.setAttribute("position",new W(d,3)),b.setAttribute("aSize",new W(A,1)),b.setAttribute("aAlpha",new W(M,1)),b.boundingSphere=new ot(new I,20);const E=new Q({vertexShader:_e,fragmentShader:ze,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uDpr:n.uDpr,uAlpha:{value:1},uBoost:{value:1}}}),g=new tt(b,E);g.visible=s,u.add(g),m.push(b,E);const S=[],L=(x,y)=>{x.y=Nt,x.angle=Math.random()*Math.PI*2,x.radius=.9+Math.random()*.5,x.delay=y,x.dwell=.55+Math.random()*.35,x.gap=.28+Math.random()*.17,x.trail=[]};for(let x=0;x<$t;x++){const y={y:Nt,angle:0,radius:0,delay:0,dwell:.78,gap:.34,trail:[]};L(y,x*.7),S.push(y)}let z=0;const F=(x,y)=>{if(Math.abs(x)>.95)return 1.15;let C=.62;for(const T of Ce)C*=1-y*Math.exp(-Math.pow((x-T)/.07,2));return C},w={group:u,ionBoost:1,update:(x,y,C,T=C)=>{if(r.uniforms.uTime.value+=x*y,r.uniforms.uAlpha.value=.05+.95*C,E.uniforms.uAlpha.value=.1+.9*Math.max(C,T),E.uniforms.uBoost.value=w.ionBoost,!s)return;z+=x;const B=z>.04;B&&(z=0);const k=S.map((p,f)=>f).sort((p,f)=>S[p].y-S[f].y);k.forEach((p,f)=>{const v=S[p];if(v.delay>0){v.delay-=x*y;return}let _=x*F(v.y,v.dwell)*y;if(f>0){const O=S[k[f-1]],U=v.y-O.y,V=Math.abs(v.y)<1.4?v.gap:.55;U-_<V&&(_=Math.max(0,U-V))}const D=v.y;v.y-=_,D>0&&v.y<=0&&Ut.emit({time:performance.now(),rig:t,ion:p}),v.angle+=x*(1.1+.3*Math.sin(p))*y;const H=Math.abs(v.y)<1?0:Math.min(1.4,(Math.abs(v.y)-1)*.55+.05);v.radius+=(H-v.radius)*Math.min(1,x*5),v.y<He&&L(v,.4+Math.random()*1.2)});let h=0;S.forEach((p,f)=>{const v=p.delay<=0,_=Math.cos(p.angle)*p.radius,D=Math.sin(p.angle)*p.radius;B&&v&&(p.trail.unshift(_,p.y,D),p.trail.length>et*3&&(p.trail.length=et*3)),v&&Math.abs(p.y)<1.5&&h<gt&&e[h++].set(_,p.y,D);const H=v?Math.max(0,Math.min(1,(4.2-Math.abs(p.y))/.9)):0,O=Math.abs(p.y)<.95?1:0,U=f*(1+et);d[U*3]=_,d[U*3+1]=p.y,d[U*3+2]=D,A[U]=9.5+O*2.5,M[U]=H;for(let V=0;V<et;V++){const P=U+1+V,G=V*3,$=p.trail.length>G+2;d[P*3]=$?p.trail[G]:_,d[P*3+1]=$?p.trail[G+1]:p.y,d[P*3+2]=$?p.trail[G+2]:D;const Y=1-(V+1)/(et+1);A[P]=1.6+4.6*Y,M[P]=$?H*Y*.32:0}}),r.uniforms.uIonCount.value=h,b.attributes.position.needsUpdate=!0,b.attributes.aSize.needsUpdate=!0,b.attributes.aAlpha.needsUpdate=!0},dispose:()=>{o(),m.forEach(x=>x.dispose())}};return w}const Oe=.45,Ue=.2,ft=18,jt=36,Ge=.9,Ve=4,Rt=.35,dt=.3,We=1.5,$e=.8,Ne=.6,je=.7,Xe=.3;function Ye(n){return()=>{n|=0,n=n+1831565813|0;let t=Math.imul(n^n>>>15,1|n);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function Xt(n,t={}){const a=n.branches.length,s=Ye(t.seed??1),o=t.motility??1,u=t.tempo??1,m=Ge*(t.reach??1),c=new Float32Array(a),l=new Float32Array(a),e=new Float32Array(a),r=new Float32Array(a),i=new Float32Array(a),d=new Float32Array(a*3);n.branches.forEach((z,F)=>{c[F]=z.isTip?Oe:z.depth===4?Ue:0,l[F]=2*Math.PI/(ft+s()*(jt-ft)),e[F]=2*Math.PI/(ft+s()*(jt-ft)),r[F]=s()*Math.PI*2,i[F]=s()*Math.PI*2;const R=z.points.length-3;d[F*3]=z.points[R],d[F*3+1]=z.points[R+1],d[F*3+2]=z.points[R+2]});const A=new Float32Array(a).fill(1),M=new Float32Array(a*3),b=new Uint8Array(a),E=[];let g=0;const S={ext:A,disp:M,somaScale:1,thickness:1,update:L};function L({dt:z,motion:F,pointer:R,activation:w}){if(F<=0||z<=0)return;if(g+=z*F*u,b.fill(0),R){E.length=0;for(let y=0;y<a;y++){if(!n.branches[y].isTip)continue;const C=Math.hypot(R[0]-d[y*3],R[1]-d[y*3+1],R[2]-d[y*3+2]);C<m&&E.push({i:y,d:C})}E.sort((y,C)=>y.d-C.d);for(let y=0;y<Math.min(Ve,E.length);y++)b[E[y].i]=1}const x=Math.max(0,Math.min(1,w));for(let y=0;y<a;y++){const C=n.branches[y],T=.6*Math.sin(l[y]*g+r[y])+.4*Math.sin(e[y]*g+i[y]);let B=b[y]?1:1-c[y]*o*(.5+.5*T);C.depth>=2&&(B*=1-Ne*x);const k=b[y]?We:$e,h=1-Math.exp(-k*z*F);A[y]+=(B-A[y])*h,A[y]<0&&(A[y]=0),A[y]>1&&(A[y]=1);let p=0,f=0,v=0;if(b[y]&&R){p=(R[0]-d[y*3])*Rt,f=(R[1]-d[y*3+1])*Rt,v=(R[2]-d[y*3+2])*Rt;const _=Math.hypot(p,f,v);_>dt&&(p*=dt/_,f*=dt/_,v*=dt/_)}M[y*3]+=(p-M[y*3])*h,M[y*3+1]+=(f-M[y*3+1])*h,M[y*3+2]+=(v-M[y*3+2])*h}S.somaScale=1+je*x,S.thickness=1+Xe*x}return S}const se=1.2,wt=.6,ie=.12,re=.36,yt=.55,xt=4,Yt=2.5,qe=6.5,qt=10,Ke=8,Ze=3,le=4,Je=.16,Qe=.03,Ct=320,tn=40;function ce(n){const t=n.branches,a=t.length,s=new Float32Array(a).fill(-1),o=new Float32Array(a),u=new Int32Array(a),m=l=>{if(s[l]>=0)return s[l];const e=t[l];return e.parent<0?(s[l]=Math.hypot(e.points[0],e.points[1],e.points[2]),u[l]=l):(s[l]=m(e.parent)+t[e.parent].length,u[l]=u[e.parent]),s[l]};let c=0;for(let l=0;l<a;l++)o[l]=m(l)+t[l].length,o[l]>c&&(c=o[l]);return{rootDist:s,endDist:o,root:u,maxDist:c}}function en(n,t){let a=-1,s=1/0;for(const o of n.branches){if(!o.isTip)continue;const u=o.points.length-3,m=Math.hypot(t[0]-o.points[u],t[1]-o.points[u+1],t[2]-o.points[u+2]);m<s&&(s=m,a=o.id)}return a}function nn(n,t,a){const s=n.branches,o=s.length,u=new Uint8Array(o);for(let i=a;i>=0;i=s[i].parent)u[i]=1;const m=t.root[a],c=s[m].points,l=[c[0],c[1],c[2]],e=t.rootDist[m],r=new Float32Array(o);for(let i=0;i<o;i++){if(t.root[i]!==m){const A=s[t.root[i]].points,M=Math.hypot(A[0]-l[0],A[1]-l[1],A[2]-l[2]);r[i]=(e+t.rootDist[t.root[i]]-M)/2;continue}let d=i;for(;!u[d];)d=s[d].parent;r[i]=t.endDist[d]}return{tip:a,tipDist:t.endDist[a],junction:r,entry:l,entryDist:e}}const on=(n,t,a)=>Math.abs(a-n.junction[t])+(n.tipDist-n.junction[t]),ue=n=>{const t=n<0?0:n>1?1:n;return t*t*(3-2*t)};function Kt(n,t,a=!1){if(t<0)return 0;if(a)return yt*Math.exp(-t/xt);const s=t-se;if(s<=0)return 0;const o=n-wt*s,u=o>0?1-ue(o/ie):Math.exp(o/re),m=o<0?yt*Math.exp(o/(wt*xt)):0;return Math.min(1,m+(1-m)*u)}function an(n,t=!1){return n<0?0:n>=qt?Math.exp(-(n-qt)/Ke):t?1:ue((n-Yt)/(qe-Yt))}function At(n){return()=>{n|=0,n=n+1831565813|0;let t=Math.imul(n^n>>>15,1|n);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}const Zt=n=>n.toFixed(3),sn=`
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
    vec3 p = uOrigin + position * (${Zt(Je)} * sqrt(t)) + uDrift * t;
    p += vec3(sin(t * 3.1 + aSeed * 40.0), cos(t * 2.7 + aSeed * 30.0), sin(t * 2.3 + aSeed * 20.0)) * 0.012 * sqrt(t);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    float foc = 1.0 - smoothstep(0.0, 18.0, abs(dist - ${at.toFixed(1)}));
    float persp = 300.0 / max(dist, 1.0);
    gl_PointSize = clamp((1.3 + 1.4 * fract(aSeed * 7.31)) * uDpr * persp * 0.045 * (1.0 + (1.0 - foc) * 1.2), 0.75, 6.0 * uDpr);
    float fade = smoothstep(0.0, 0.12, t) * (1.0 - smoothstep(1.2, ${Zt(le)}, t));
    vA = fade * (0.45 + 0.4 * fract(aSeed * 3.3)) * (0.04 + 0.96 * foc) * uReveal;
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
`;function ln(n,t=1){const a=At(t*17+3),s=()=>Math.sqrt(-2*Math.log(1-a()))*Math.cos(2*Math.PI*a()),o=new Float32Array(Ct*3),u=new Float32Array(Ct);for(let i=0;i<Ct;i++)o[i*3]=s(),o[i*3+1]=s(),o[i*3+2]=s(),u[i]=a();const m=new J;m.setAttribute("position",new W(o,3)),m.setAttribute("aSeed",new W(u,1));const c=new Q({vertexShader:sn,fragmentShader:rn,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uT:{value:-1},uOrigin:{value:new I},uDrift:{value:new I},uDpr:n.uDpr,uAlpha:n.uAlpha,uReveal:{value:1}}}),l=new tt(m,c);l.frustumCulled=!1,l.visible=!1;const e=At(t*5+11);let r=-1;return{points:l,get t(){return r},start(i){r=0,c.uniforms.uOrigin.value.set(i.x,i.y,i.z),c.uniforms.uDrift.value.set(e()-.5,e()-.5,e()-.5).normalize().multiplyScalar(Qe)},update(i,d,A){r>=0&&(r+=i*d,r>le&&(r=-1)),c.uniforms.uT.value=r,c.uniforms.uReveal.value=A,l.visible=r>=0},dispose(){m.dispose(),c.dispose()}}}const Ft=.12,he=2e4,Jt=12;function cn(n,t=he,a=1){const s=At(a),o=Math.round(t*Ft),u=t-o,m=n.branches.map(T=>T.length*(T.radius0+T.radius1)*.5),c=m.reduce((T,B)=>T+B,0),l=ce(n),e=new Float32Array(t*3),r=new Float32Array(t),i=new Float32Array(t),d=new Float32Array(t),A=new Float32Array(t),M=new Float32Array(t),b=new Float32Array(t*3),E=new Float32Array(t);let g=0;for(;g<o;g++){const T=s()*2-1,B=s()*Math.PI*2,k=Math.sqrt(1-T*T),h=s(),p=n.soma*(.85+.3*h);e[g*3]=k*Math.cos(B)*p,e[g*3+1]=T*p,e[g*3+2]=k*Math.sin(B)*p,b[g*3]=k*Math.cos(B),b[g*3+1]=T,b[g*3+2]=k*Math.sin(B),E[g]=h,r[g]=-1,i[g]=0,d[g]=s(),A[g]=1,M[g]=0}const S=m.map(T=>u*T/c),L=S.map(Math.floor);let z=u-L.reduce((T,B)=>T+B,0);const F=S.map((T,B)=>({k:B,frac:T-Math.floor(T)})).sort((T,B)=>B.frac-T.frac);for(let T=0;z>0&&T<F.length;T++,z--)L[F[T].k]++;const R=new I,w=new I,x=new I,y=new I(0,1,0),C=new I;return n.branches.forEach((T,B)=>{const k=T.points.length/3;for(let h=0;h<L[B];h++,g++){const p=s(),f=p*T.length;let v=0;for(;v<k-2&&T.cum[v+1]<f;)v++;const _=T.cum[v+1]-T.cum[v],D=_>0?(f-T.cum[v])/_:0,H=T.points[v*3],O=T.points[v*3+1],U=T.points[v*3+2],V=T.points[v*3+3],P=T.points[v*3+4],G=T.points[v*3+5];C.set(H+(V-H)*D,O+(P-O)*D,U+(G-U)*D),R.set(V-H,P-O,G-U).normalize(),R.lengthSq()===0&&R.set(0,1,0),w.crossVectors(R,Math.abs(R.y)>.9?new I(1,0,0):y).normalize(),x.crossVectors(R,w);const $=(T.radius0+(T.radius1-T.radius0)*p)*(.85+.3*s()),Y=s()*Math.PI*2,rt=Math.cos(Y),lt=Math.sin(Y);C.addScaledVector(w,rt*$).addScaledVector(x,lt*$),e[g*3]=C.x,e[g*3+1]=C.y,e[g*3+2]=C.z,b[g*3]=w.x*rt+x.x*lt,b[g*3+1]=w.y*rt+x.y*lt,b[g*3+2]=w.z*rt+x.z*lt,r[g]=B,i[g]=p,d[g]=s(),A[g]=0,M[g]=l.rootDist[B]+p*T.length}}),{position:e,aBranch:r,aT:i,aSeed:d,aSoma:A,aDist:M,aNormal:b,aShell:E,count:t}}const _t=3,It=[0,1,2].map(n=>((n+.5)/_t).toFixed(4)),q=n=>n.toFixed(3),un=`
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
    float tw = t - ${q(se)};
    if (tw <= 0.0) return 0.0;
    float x = d - ${q(wt)} * tw;
    float band = x > 0.0 ? 1.0 - smoothstep(0.0, ${q(ie)}, x) : exp(x / ${q(re)});
    float plateau = x < 0.0 ? ${q(yt)} * exp(x / ${q(wt*xt)}) : 0.0;
    return clamp(plateau + (1.0 - plateau) * band, 0.0, 1.0);
  }

  void main() {
    vec3 pos = position;
    float hidden = 0.0;
    if (aSoma < 0.5) {
      vec4 st = texture2D(uBranch, vec2((aBranch + 0.5) / uBranchCount, ${It[0]}));
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
      float jA = texture2D(uBranch, vec2((aBranch + 0.5) / uBranchCount, ${It[1]})).r;
      float jB = texture2D(uBranch, vec2((aBranch + 0.5) / uBranchCount, ${It[2]})).r;
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
    float foc = (1.0 - smoothstep(0.0, 18.0, abs(dist - ${at.toFixed(1)}))) * (1.0 - uDefocus);
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
`,hn=`
  precision highp float;
  ${kt}
  ${Ht}
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
`,pn=`
  uniform vec3 uPos;
  uniform float uScale;
  uniform float uDpr;
  void main() {
    vec4 mv = modelViewMatrix * vec4(uPos, 1.0);
    gl_Position = projectionMatrix * mv;
    float persp = 300.0 / max(-mv.z, 1.0);
    gl_PointSize = clamp(uDpr * persp * 0.6 * uScale, 3.0, 32.0 * uDpr);
  }
`,fn=`
  precision highp float;
  ${oe}
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
`,X={appear:.7,reach:1.6,cup:1.1,close:.9,retract:1,digest:.8},st=.17,dn=.1,mn=5,Qt=6,vn=9,gn=.45,K=n=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t)},wn=n=>1-Math.pow(1-Math.max(0,Math.min(1,n)),3);function yn(n,t){var k;const a=At(t),s=h=>new I(h.points[h.points.length-3],h.points[h.points.length-2],h.points[h.points.length-1]),o=n.branches.filter(h=>h.isTip).map(h=>({b:h,d:s(h).length()})).sort((h,p)=>p.d-h.d),u=o.slice(0,Math.max(6,Math.round(o.length*.5))).map(h=>h.b),m=((k=[...u].sort((h,p)=>h.length-p.length)[Math.floor(u.length/2)])==null?void 0:k.length)??0,c=u.filter(h=>h.length>=m);c.length<3&&c.push(...u.slice(0,3));let l=-1;const e={branch:-1,reach:0,disp:new I,cup:0,wrap:0,cupRadius:st,target:new I,axis:new I(0,0,1),u:new I(1,0,0),v:new I(0,1,0),particle:new I,particleAlpha:0,particleScale:1,phagosome:new I,bulge:0,somaBump:0};let r="rest",i=0,d=mn,A=0;const M=new I,b=new I,E=new I;let g=new Float32Array(0),S=new Float32Array(0),L=0;const z=new I,F=new I;function R(h){const p=[];let f=h,v=0;for(;f&&v++<64;){for(let D=f.points.length-3;D>=0;D-=3){const H=f.points[D],O=f.points[D+1],U=f.points[D+2],V=p.length;V&&p[V-3]===H&&p[V-2]===O&&p[V-1]===U||p.push(H,O,U)}f=f.parent>=0&&f.parent!==f.id?n.branches[f.parent]:void 0}p.push(0,0,0),g=Float32Array.from(p);const _=g.length/3;S=new Float32Array(_);for(let D=1;D<_;D++)S[D]=S[D-1]+Math.hypot(g[D*3]-g[D*3-3],g[D*3+1]-g[D*3-2],g[D*3+2]-g[D*3-1]);L=S[_-1]}function w(h,p){const f=g.length/3;if(f===0)return p.set(0,0,0);if(h<=0)return p.set(g[0],g[1],g[2]);if(h>=L)return p.set(0,0,0);let v=1;for(;v<f-1&&S[v]<h;)v++;const _=(h-S[v-1])/Math.max(1e-6,S[v]-S[v-1]);return p.set(g[v*3-3]+(g[v*3]-g[v*3-3])*_,g[v*3-2]+(g[v*3+1]-g[v*3-2])*_,g[v*3-1]+(g[v*3+2]-g[v*3-1])*_)}const x=o.map(h=>s(h.b));function y(h,p){let f=1/0;for(let v=0;v<o.length;v++)o[v].b.id!==h.id&&(f=Math.min(f,x[v].distanceTo(p)));return f}function C(){let h=c[0],p=-1;for(let H=0;H<4;H++){const O=c[Math.floor(a()*c.length)];if(O.id===l&&c.length>1)continue;const U=s(O),V=z.set(U.x-O.points[0],U.y-O.points[1],U.z-O.points[2]).normalize(),P=F.copy(U).addScaledVector(V,.35),G=y(O,P);G>p&&(p=G,h=O)}l=h.id,M.copy(s(h));const f=z.set(M.x-h.points[0],M.y-h.points[1],M.z-h.points[2]).normalize();f.lengthSq()===0&&f.copy(M).normalize();const v=F.set(a()-.5,a()-.5,a()-.5).cross(f).normalize(),_=Math.min(.55,Math.max(.3,h.length*.9));b.copy(M).addScaledVector(f,_).addScaledVector(v,_*.35*(a()-.5)*2);const D=z.subVectors(b,M).normalize();e.axis.copy(D).negate(),E.copy(b).addScaledVector(D,-.17).sub(M),e.u.set(0,1,0),Math.abs(e.axis.y)>.9&&e.u.set(1,0,0),e.u.cross(e.axis).normalize(),e.v.crossVectors(e.axis,e.u).normalize(),e.branch=h.id,R(h),r="appear",i=0}function T(){e.branch=-1,e.reach=0,e.cup=0,e.wrap=0,e.cupRadius=st,e.particleAlpha=0,e.particleScale=1,e.bulge=0,e.somaBump=0,r="rest",i=0,d=Qt+a()*(vn-Qt)}function B(h){if(h<=0)return;A+=h,i+=h;const p=f=>e.particle.copy(b).add(z.set(Math.sin(A*7.1)*f,Math.cos(A*5.3)*f,Math.sin(A*6.2+1.3)*f));switch(r){case"rest":i>=d&&C();break;case"appear":{e.particleAlpha=K(i/X.appear),p(.014),i>=X.appear&&(r="reach",i=0);break}case"reach":{const f=K(i/X.reach);e.reach=f,e.disp.copy(E).multiplyScalar(f),p(.014*(1-f)),e.particleAlpha=1,i>=X.reach&&(r="cup",i=0,e.target.copy(e.particle));break}case"cup":{e.reach=1,e.disp.copy(E),e.cup=wn(i/X.cup),e.wrap=.3*e.cup,e.particle.copy(e.target),i>=X.cup&&(r="close",i=0);break}case"close":{const f=K(i/X.close);e.cup=1,e.wrap=.3+.7*f,e.cupRadius=st+(dn-st)*f,e.particleScale=1-.3*f,i>=X.close&&(r="retract",i=0);break}case"retract":{const f=K(i/X.retract);e.reach=1-f,e.disp.copy(E).multiplyScalar(e.reach),e.target.copy(M).add(e.disp).addScaledVector(e.axis,-.1*(1-f)),e.particle.copy(e.target),i>=X.retract&&(r="transport",i=0);break}case"transport":{const f=i*gn;e.reach=0,e.cup=1-K(i/.5),e.wrap=1,w(f,e.particle),e.target.copy(e.particle),e.phagosome.copy(e.particle),e.bulge=K(i/.4),f>=L&&(r="digest",i=0);break}case"digest":{const f=i/X.digest;e.cup=0,e.particle.set(0,0,0),e.phagosome.set(0,0,0),e.particleAlpha=1-K(f),e.bulge=1-K(f),e.somaBump=Math.sin(Math.PI*Math.min(1,f)),i>=X.digest&&T();break}}}return{out:e,step:B,feed(){r==="rest"&&(d=0)}}}function Hn(n,t,a={}){const s=cn(t,a.count??he,a.seed??1),o=new J;o.setAttribute("position",new W(s.position,3)),o.setAttribute("aBranch",new W(s.aBranch,1)),o.setAttribute("aT",new W(s.aT,1)),o.setAttribute("aSeed",new W(s.aSeed,1)),o.setAttribute("aSoma",new W(s.aSoma,1)),o.setAttribute("aDist",new W(s.aDist,1)),o.setAttribute("aNormal",new W(s.aNormal,3)),o.setAttribute("aShell",new W(s.aShell,1)),o.boundingSphere=new ot(new I,t.bound*1.5);const u=t.branches.length,m=new Float32Array(u*4*_t);for(let h=0;h<u;h++)m[h*4]=1;const c=new de(m,u,_t,me,ve);c.magFilter=Ot,c.minFilter=Ot,c.needsUpdate=!0;const l=new Q({vertexShader:un,fragmentShader:hn,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uSize:n.uSize,uDpr:n.uDpr,uMaxPx:{value:Jt},uLens:n.uLens,uPointer:n.uPointer,uAlpha:n.uAlpha,uBranch:{value:c},uBranchCount:{value:u},uSomaScale:{value:1},uThickness:{value:1},uReveal:{value:1},uDraw:{value:1},uDefocus:n.uDefocus,uLight:n.uLight,uPhagoBranch:{value:-1},uTarget:{value:new I},uCupAxis:{value:new I(0,0,1)},uCupU:{value:new I(1,0,0)},uCupV:{value:new I(0,1,0)},uCup:{value:0},uCupRadius:{value:st},uCupWrap:{value:0},uPhagoPos:{value:new I},uBulge:{value:0},uReach:{value:0},uStimT:{value:new Z(-1,-1)},uStimInstant:{value:new Z(0,0)},uTipDist:{value:new Z(0,0)},uEntryDist:{value:new Z(0,0)},uEntryA:{value:new I},uEntryB:{value:new I}}}),e=new zt;e.add(new tt(o,l)),e.scale.setScalar(a.scale??1);const r=a.phagocytosis?yn(t,(a.seed??1)*31+7):null;let i=null,d=null;if(r){const h=new J;h.setAttribute("position",new W(new Float32Array(3),3)),h.boundingSphere=new ot(new I,t.bound*2),d=new Q({vertexShader:pn,fragmentShader:fn,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uPos:{value:new I},uScale:{value:1},uDpr:n.uDpr,uAlpha:{value:0},uCellAlpha:n.uAlpha,uReveal:{value:1}}}),i=new tt(h,d),i.visible=!1,e.add(i)}const A=!!a.atp,M=ce(t),b=M.maxDist*1.02;let E=null;A&&(E=ln(n,a.seed??1),e.add(E.points));const g=[{t:-1,instant:!1,s:null},{t:-1,instant:!1,s:null}];let S=0;const L=[0,0,0];let z=0,F=0;const R=t.branches.map(h=>h.length*(h.radius0+h.radius1)*.5),w=R.reduce((h,p)=>h+p,0),x=[.17,.5,.83],y=()=>{let h=0;for(const p of g){if(p.t<0||!p.s)continue;let f=0;for(let v=0;v<u;v++){const _=t.branches[v];let D=0;for(const H of x)D+=Kt(on(p.s,v,M.rootDist[v]+H*_.length),p.t,p.instant);f+=D/x.length*(R[v]/w)*(1-Ft)}f+=Ft*Kt(p.s.tipDist-p.s.entryDist+t.soma,p.t,p.instant),h=Math.max(h,f)}return h};let C=Xt(t,a);const T=a.surveillance??!1,B=new I,k={group:e,reveal:1,draw:1,maxPx:Jt,calcium:0,get motility(){return C},setMotility(h){C=Xt(t,{...a,...h})},update(h,p,f,v){let _=null;T&&f&&(B.set(f.x,f.y,e.position.z),e.worldToLocal(B),_=[B.x,B.y,B.z]);let D=0;if(A){for(const P of g)if(!(P.t<0)){if(P.t+=h*(P.instant?1:p),P.t>tn){P.t=-1;continue}D=Math.max(D,an(P.t,P.instant))}l.uniforms.uStimT.value.set(g[0].t,g[1].t),z>0&&(z-=h*p,_=L),E==null||E.update(h,p,k.reveal),F+=h,F>=1/St&&(F=Math.min(F-1/St,1/St),k.calcium=y(),Gt.write(k.calcium))}C.update({dt:h,motion:p,pointer:_,activation:Math.max(v,D)});const{ext:H,disp:O}=C,U=k.draw>=1?1/0:k.draw*b;for(let P=0;P<u;P++){const G=t.branches[P],$=U===1/0?1:Math.max(0,Math.min(1,(U-M.rootDist[P])/Math.max(1e-4,G.length)));m[P*4]=H[P]*$,m[P*4+1]=O[P*3],m[P*4+2]=O[P*3+1],m[P*4+3]=O[P*3+2]}let V=0;if(r&&i&&d){k.reveal>.9&&r.step(h*Math.max(0,Math.min(1,p)));const P=r.out;if(P.branch>=0&&P.reach>0){const $=P.branch,Y=P.reach;m[$*4]+=(1-m[$*4])*Y,m[$*4+1]+=(P.disp.x-m[$*4+1])*Y,m[$*4+2]+=(P.disp.y-m[$*4+2])*Y,m[$*4+3]+=(P.disp.z-m[$*4+3])*Y}const G=l.uniforms;G.uPhagoBranch.value=P.branch,G.uReach.value=P.reach,G.uTarget.value.copy(P.target),G.uCupAxis.value.copy(P.axis),G.uCupU.value.copy(P.u),G.uCupV.value.copy(P.v),G.uCup.value=P.cup,G.uCupRadius.value=P.cupRadius,G.uCupWrap.value=P.wrap,G.uPhagoPos.value.copy(P.phagosome),G.uBulge.value=P.bulge,d.uniforms.uPos.value.copy(P.particle),d.uniforms.uScale.value=P.particleScale,d.uniforms.uAlpha.value=P.particleAlpha,d.uniforms.uReveal.value=k.reveal,i.visible=P.particleAlpha>.01,V=P.somaBump}c.needsUpdate=!0,l.uniforms.uSomaScale.value=C.somaScale*(1+.06*V),l.uniforms.uThickness.value=C.thickness,l.uniforms.uReveal.value=k.reveal,l.uniforms.uDraw.value=k.draw,l.uniforms.uMaxPx.value=k.maxPx},feed(){r==null||r.feed()},stimulate(h,p={}){if(!A)return;const f=nn(t,M,en(t,[h.x,h.y,h.z])),v=S;S=1-S;const _=(1+v)*u*4;for(let O=0;O<u;O++)m[_+O*4]=f.junction[O];const D=!!p.instant;g[v]={t:0,instant:D,s:f};const H=l.uniforms;v===0?(H.uTipDist.value.x=f.tipDist,H.uEntryDist.value.x=f.entryDist,H.uStimInstant.value.x=D?1:0,H.uEntryA.value.set(f.entry[0],f.entry[1],f.entry[2])):(H.uTipDist.value.y=f.tipDist,H.uEntryDist.value.y=f.entryDist,H.uStimInstant.value.y=D?1:0,H.uEntryB.value.set(f.entry[0],f.entry[1],f.entry[2])),L[0]=h.x,L[1]=h.y,L[2]=h.z,z=Ze,E&&!D&&E.start(h),Gt.stimulatedAt=performance.now()},dispose(){o.dispose(),l.dispose(),c.dispose(),i==null||i.geometry.dispose(),d==null||d.dispose(),E==null||E.dispose()}};return k}const xn=8,An=80,mt=.012;function On(n,t,a,s={}){const o={active:!1,hover:!1,lastX:0,lastY:0,spin:0,pinch:1,pinching:!1},u=new I,m=(w,x)=>{if(!n.visible)return!1;u.copy(n.position).project(t);const y=(u.x*.5+.5)*window.innerWidth,C=(-u.y*.5+.5)*window.innerHeight;return Math.hypot(w-y,x-C)<a()},c=w=>{w.pointerType==="touch"||!m(w.clientX,w.clientY)||(o.active=!0,o.lastX=w.clientX,o.lastY=w.clientY,o.spin=0,document.body.style.cursor="grabbing")},l=w=>{if(w.pointerType==="touch")return;if(o.active){const y=w.clientX-o.lastX,C=w.clientY-o.lastY;n.rotation.y+=y*mt,s.tilt!==!1&&(n.rotation.x=Math.max(-1.3,Math.min(.7,n.rotation.x+C*.008))),o.spin=y*mt*40,o.lastX=w.clientX,o.lastY=w.clientY;return}const x=m(w.clientX,w.clientY);x!==o.hover&&(o.hover=x,document.body.style.cursor=x?"grab":"")},e=w=>{w.pointerType==="touch"||!o.active||(o.active=!1,document.body.style.cursor=o.hover?"grab":"")};window.addEventListener("pointerdown",c),window.addEventListener("pointermove",l),window.addEventListener("pointerup",e),window.addEventListener("pointercancel",e);const r=s.touch??null,i=new Map;let d="none";const A={x:0,y:0};let M=1,b=0,E=0,g=0;const S=()=>{const[w,x]=Array.from(i.values());return w&&x?Math.max(1,Math.hypot(w.x-x.x,w.y-x.y)):1},L=(w,x,y)=>{d="none",A.x=w,A.y=x,b=0,E=y,g=y},z=w=>{var x;if(w.pointerType==="touch"&&!((x=w.target)!=null&&x.closest("button, a"))){i.set(w.pointerId,{x:w.clientX,y:w.clientY});try{r==null||r.setPointerCapture(w.pointerId)}catch{}i.size===1?(o.spin=0,L(w.clientX,w.clientY,w.timeStamp)):i.size===2&&(o.active=!1,o.pinching=!0,o.pinch=1,M=S(),d="turn")}},F=w=>{const x=i.get(w.pointerId);if(!x)return;const y=x.x;if(x.x=w.clientX,x.y=w.clientY,i.size>=2){o.pinching&&(o.pinch=S()/M);return}if(d==="none"){const k=w.clientX-A.x,h=w.clientY-A.y;if(Math.hypot(k,h)<xn)return;d=Math.abs(k)>1.5*Math.abs(h)?"turn":"scroll",d==="turn"&&(o.active=!0),E=w.timeStamp;return}if(d!=="turn")return;const C=w.clientX-y,T=Math.max(1,w.timeStamp-E)/1e3;E=w.timeStamp,g=w.timeStamp,n.rotation.y+=C*mt;const B=C*mt/T;b+=(B-b)*.5},R=w=>{var x;if(i.has(w.pointerId)){if(i.delete(w.pointerId),o.pinching&&i.size<2){o.pinching=!1;const y=o.pinch;o.pinch=1,(x=s.onPinchEnd)==null||x.call(s,y);const C=Array.from(i.values())[0];C?L(C.x,C.y,w.timeStamp):d="none";return}i.size===0&&(o.active&&(o.active=!1,o.spin=w.timeStamp-g>An?0:b),d="none")}};return r&&(r.addEventListener("pointerdown",z),r.addEventListener("pointermove",F),r.addEventListener("pointerup",R),r.addEventListener("pointercancel",R)),{get active(){return o.active},get hover(){return o.hover},get spin(){return o.spin},set spin(w){o.spin=w},get pinch(){return o.pinch},get pinching(){return o.pinching},dispose(){window.removeEventListener("pointerdown",c),window.removeEventListener("pointermove",l),window.removeEventListener("pointerup",e),window.removeEventListener("pointercancel",e),r&&(r.removeEventListener("pointerdown",z),r.removeEventListener("pointermove",F),r.removeEventListener("pointerup",R),r.removeEventListener("pointercancel",R)),(o.hover||o.active)&&(document.body.style.cursor="")}}}const Mn=8,Sn=700;function Un(n,t,a,s){const o={hover:!1,down:null},u=new I,m=new I,c=new Z,l=new ee,e=new ge,r=new I,i=()=>{if(!n.visible)return null;const S=a();if(S<=0)return null;m.copy(n.position).applyMatrix4(t.matrixWorldInverse);const L=-m.z;if(L<=.1)return null;u.copy(n.position).project(t);const z=window.innerHeight/2/(Math.tan(t.fov*Math.PI/360)*L);return{x:(u.x*.5+.5)*window.innerWidth,y:(-u.y*.5+.5)*window.innerHeight,r:S*z}},d=(S,L)=>{const z=i();return!!z&&Math.hypot(S-z.x,L-z.y)<z.r},A=(S,L)=>!d(S,L)||(c.set(S/window.innerWidth*2-1,-(L/window.innerHeight)*2+1),l.setFromCamera(c,t),e.setFromNormalAndCoplanarPoint(t.getWorldDirection(m),n.position),!l.ray.intersectPlane(e,r))?!1:(n.worldToLocal(r),s(r.clone()),!0),M=S=>{d(S.clientX,S.clientY)&&(o.down={x:S.clientX,y:S.clientY,t:performance.now(),id:S.pointerId})},b=S=>{if(S.pointerType==="touch")return;const L=!o.down&&d(S.clientX,S.clientY);L!==o.hover&&(o.hover=L,L?document.body.style.cursor="pointer":document.body.style.cursor==="pointer"&&(document.body.style.cursor=""))},E=S=>{const L=o.down;!L||S.pointerId!==L.id||(o.down=null,!(Math.hypot(S.clientX-L.x,S.clientY-L.y)>Mn||performance.now()-L.t>Sn)&&A(S.clientX,S.clientY))},g=()=>{o.down=null};return window.addEventListener("pointerdown",M),window.addEventListener("pointermove",b),window.addEventListener("pointerup",E),window.addEventListener("pointercancel",g),{get hover(){return o.hover},at:A,onScreen:i,dispose(){window.removeEventListener("pointerdown",M),window.removeEventListener("pointermove",b),window.removeEventListener("pointerup",E),window.removeEventListener("pointercancel",g),o.hover&&document.body.style.cursor==="pointer"&&(document.body.style.cursor="")}}}function bn(n,t){const a=t.stride;if(n.byteLength%a!==0)throw new Error(`umap: ${n.byteLength} bytes is not a multiple of ${a}`);const s=n.byteLength/a,o=new DataView(n),u=new Float32Array(s*3),m=new Float32Array(s),c=new Float32Array(s*3),l=new Float32Array(s);for(let e=0;e<s;e++){const r=e*a;u[e*3]=o.getInt16(r,!0)/32767,u[e*3+1]=o.getInt16(r+2,!0)/32767,u[e*3+2]=o.getInt16(r+4,!0)/32767,m[e]=o.getUint8(r+6),c[e*3]=o.getUint8(r+7)/255,c[e*3+1]=o.getUint8(r+8)/255,c[e*3+2]=o.getUint8(r+9)/255,l[e]=(e*2654435761>>>0)/4294967296}return{n:s,position:u,state:m,expr:c,seed:l}}async function Pn(n){const t=await fetch(`${n}umap/manifest.json`).then(s=>s.json()),a=await fetch(`${n}umap/cells.bin`).then(s=>s.arrayBuffer());return{manifest:t,cells:bn(a,t)}}const Tn=600,En=12,te=.035,Dn=`
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
    float foc = (1.0 - smoothstep(0.0, 14.0, abs(dist - ${at.toFixed(1)}))) * (1.0 - uDefocus);
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
`,Ln=`
  precision highp float;
  ${Ht}
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
`;function Gn(n,t){const a=new zt,s=new Q({vertexShader:Dn,fragmentShader:Ln,transparent:!0,depthWrite:!1,depthTest:!1,uniforms:{uSize:n.uSize,uDpr:n.uDpr,uLens:n.uLens,uDefocus:n.uDefocus,uPointer:n.uPointer,uAlpha:n.uAlpha,uReveal:{value:0},uMode:{value:0},uPrevMode:{value:0},uWave:{value:10},uWaveOrigin:{value:new I},uFocusState:{value:-1},uHover:{value:new I(99,99,99)},uMaxPx:{value:9}}});let o=null,u=null,m=null,c=null,l=!1;const e={group:a,ready:!1,manifest:null,reveal:0,maxPx:9,spin:.12,hoverEnabled:!0,labelsEnabled:!0,labelFade:1,update:z,dispose(){l=!0,o==null||o.dispose(),s.dispose()}};Pn(t).then(({manifest:F,cells:R})=>{l||(o=new J,o.setAttribute("position",new W(R.position,3)),o.setAttribute("aState",new W(R.state,1)),o.setAttribute("aExpr",new W(R.expr,3)),o.setAttribute("aSeed",new W(R.seed,1)),o.boundingSphere=new ot(new I,1.8),a.add(new tt(o,s)),u=R.position,m=R.state,c=R.expr,e.manifest=F,e.ready=!0,N.count=F.n,N.ready=!0)}).catch(F=>console.warn("umap: data not loaded",F));const r=F=>Math.max(0,Vt.indexOf(F));let i=N.changedAt;const d=new I,A=new we,M=new ee,b=new ye,E=new I,g=new Z;let S=0,L=-1;function z(F,R,w,x,y){var k;const C=s.uniforms;C.uReveal.value=e.reveal,C.uMaxPx.value=e.maxPx,C.uMode.value=r(N.mode),C.uPrevMode.value=r(N.prevMode),C.uFocusState.value=N.focusState,y&&(a.rotation.y+=F*e.spin*R),N.changedAt!==i&&(i=N.changedAt,d.set(n.uPointer.value.x,n.uPointer.value.y,a.position.z),Math.abs(d.x)>90&&d.set(0,0,a.position.z),a.worldToLocal(d),d.clampLength(0,1.2),C.uWaveOrigin.value.copy(d));const T=(performance.now()-N.changedAt)/Tn;if(C.uWave.value=xe.reducedMotion?10:Math.min(10,T*3.2),!e.ready||!u||!m||!c||!e.manifest)return;S+=F;const B=e.hoverEnabled&&x&&a.visible&&e.reveal>.5;if(B&&S>1/En){S=0,g.set(x.x,x.y),M.setFromCamera(g,w),b.copy(a.matrixWorld).invert(),A.copy(M.ray).applyMatrix4(b);const h=a.scale.x||1,p=te*8/Math.max(h,.01);let f=-1,v=Math.min(p,te*4),_=1/0;for(let D=0;D<u.length/3;D++){E.set(u[D*3],u[D*3+1],u[D*3+2]);const H=E.clone().sub(A.origin).dot(A.direction);if(H<0)continue;const O=A.distanceToPoint(E);(O<v||O<v*1.15&&H<_-.2)&&(f=D,v=O,_=H)}L=f}if(B||(L=-1),L>=0){C.uHover.value.set(u[L*3],u[L*3+1],u[L*3+2]);const h=(x.x+1)/2*window.innerWidth,p=(1-x.y)/2*window.innerHeight,f=((k=e.manifest.states[m[L]])==null?void 0:k.name)??"",v=N.mode,_=Vt.indexOf(v)-1,D=_<0?f:`${v} ${(c[L*3+_]*e.manifest.p99[_]).toFixed(2)}`;N.hover={text:D,x:h,y:p}}else C.uHover.value.set(99,99,99),N.hover&&(N.hover=null);if(e.labelsEnabled&&a.visible){const h=E.setFromMatrixPosition(w.matrixWorld).clone();N.labels=e.manifest.states.map(p=>{const f=new I(p.centroid[0],p.centroid[1],p.centroid[2]);a.localToWorld(f);const v=f.distanceTo(h),_=1-Math.min(1,Math.abs(v-at)/14);f.project(w);const D=f.z>1;return{text:p.name,state:p.id,x:(f.x+1)/2*window.innerWidth,y:(1-f.y)/2*window.innerHeight,opacity:D?0:e.reveal*e.labelFade*(.15+.85*_)*(N.focusState<0||N.focusState===p.id?1:.35)}})}else N.labels.length&&(N.labels=[])}return e}export{Bn as C,Te as L,kt as P,Ht as S,ln as a,Hn as b,kn as c,Gn as d,zn as e,Un as f,Fn as g,On as h,_n as m};
