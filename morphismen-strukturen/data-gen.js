/* Parameterized question families. Answers and explanations are computed from the parameters. */
var GEN_MAPS = {G:[],R:[],V:[]}, GEN_STRUCTS = {G:[],R:[]};
(function(){
var R = String.raw;
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=a%b;a=b;b=t;}return a;}
function md(a,n){return ((a%n)+n)%n;}
function inv(a,n){for(var x=1;x<n;x++) if(md(a*x,n)===1) return x; return null;}
function lcm(a,b){return a/gcd(a,b)*b;}
function phi(n){var c=0;for(var k=1;k<=n;k++) if(gcd(k,n)===1) c++;return c;}
function isPrime(n){if(n<2)return false;for(var d=2;d*d<=n;d++) if(n%d===0) return false;return true;}
// linear form: coeffs [a,b,..], vars ['x','y',..]
function lin(cs,vs){
  var s='';
  cs.forEach(function(c,i){
    if(c===0) return;
    var v=vs[i], a=Math.abs(c), t=(a===1?'':a)+v;
    if(s==='') s=(c<0?'-':'')+t; else s+=(c<0?'-':'+')+t;
  });
  return s===''?'0':s;
}
function mat(rows){return R`\begin{pmatrix}`+rows.map(function(r){return r.join('&');}).join(R`\\`)+R`\end{pmatrix}`;}
function vec(v){return '('+v.join(',')+')';}
function M(c,q,a,en,de,qn){GEN_MAPS[c].push([c,q,a,en,de,qn]);}
function S(c,q,a,en,de,qn){GEN_STRUCTS[c].push([c,q,a,en,de,qn]);}
function kx(k){return k===1?'x':k+'x';}

/* ======================= MAPS: GROUPS ======================= */
// Z/n -> Z/m, [x] -> [kx]
[[4,4,3],[4,4,2],[8,8,3],[8,8,6],[9,9,4],[9,9,3],[10,10,7],[10,10,5],[12,12,5],[12,12,8],[7,7,0],[7,7,6],
 [6,3,1],[6,4,1],[8,4,3],[4,8,2],[4,8,1],[3,9,3],[3,9,1],[5,10,2],[5,10,4],[5,10,3],[12,6,1],[12,8,1],
 [12,8,2],[10,15,3],[10,15,1],[15,15,4],[15,15,6],[16,16,9],[6,6,5],[11,11,3],[14,7,2],[6,9,3]].forEach(function(p){
  var n=p[0],m=p[1],k=p[2], q=R`\Z/${n}\Z\to\Z/${m}\Z,\ [x]\mapsto[${kx(k)}]`;
  if(md(k*n,m)!==0){
    var r=md(k*n,m);
    M('G',q,0,R`Not well-defined: $[0]_{${n}}=[${n}]_{${n}}$, but $[0]_{${m}}\neq[${k*n}]_{${m}}=[${r}]_{${m}}$, since $${m}\nmid ${k*n}$.`,
               R`Nicht wohldefiniert: $[0]_{${n}}=[${n}]_{${n}}$, aber $[0]_{${m}}\neq[${k*n}]_{${m}}=[${r}]_{${m}}$, da $${m}\nmid ${k*n}$.`);
    return;
  }
  if(k===0){M('G',q,1,R`This is the zero map: a homomorphism, but not injective.`,R`Das ist die Nullabbildung: ein Homomorphismus, aber nicht injektiv.`);return;}
  if(n!==m){
    M('G',q,1,R`Well-defined since $${m}\mid ${k}\cdot${n}$, and additive. But $|\Z/${n}\Z|=${n}\neq${m}=|\Z/${m}\Z|$, so it can't be bijective.`,
               R`Wohldefiniert wegen $${m}\mid ${k}\cdot${n}$, und additiv. Aber $|\Z/${n}\Z|=${n}\neq${m}=|\Z/${m}\Z|$, also nicht bijektiv.`);
    return;
  }
  var g=gcd(k,n);
  if(g===1){var u=inv(k,n);
    M('G',q,2,R`Additive, and $${k}$ is a unit mod $${n}$ ($${k}\cdot${u}\equiv1$), so $[x]\mapsto[${kx(u)}]$ is the inverse map.`,
               R`Additiv, und $${k}$ ist eine Einheit mod $${n}$ ($${k}\cdot${u}\equiv1$), also ist $[x]\mapsto[${kx(u)}]$ die Umkehrabbildung.`);
  } else {var t=n/g;
    M('G',q,1,R`Additive, but $\gcd(${k},${n})=${g}$, so $[${t}]\mapsto[${k*t}]=[0]$: the kernel is nontrivial.`,
               R`Additiv, aber $\operatorname{ggT}(${k},${n})=${g}$, also $[${t}]\mapsto[${k*t}]=[0]$: der Kern ist nicht trivial.`);
  }
});
// R^x -> R^x, x -> x^k
[3,-1,-2,4,5,-3,0].forEach(function(k){
  var q=R`(\R\setminus\{0\},\cdot)\to(\R\setminus\{0\},\cdot),\ x\mapsto x^{${k}}`;
  if(k===0) M('G',q,1,R`$x^0=1$: the trivial homomorphism, with kernel everything.`,R`$x^0=1$: der triviale Homomorphismus, alles liegt im Kern.`);
  else if(k%2===0) M('G',q,1,R`$(xy)^{${k}}=x^{${k}}y^{${k}}$ since the group is abelian. But $(-1)^{${k}}=1$, so the kernel is $\{\pm1\}$.`,R`$(xy)^{${k}}=x^{${k}}y^{${k}}$, da die Gruppe abelsch ist. Aber $(-1)^{${k}}=1$, der Kern ist also $\{\pm1\}$.`);
  else M('G',q,2,R`$(xy)^{${k}}=x^{${k}}y^{${k}}$ since the group is abelian, and for odd $${k}$ the map is bijective on $\R\setminus\{0\}$ (inverse: $x\mapsto x^{1/(${k})}$, real odd root).`,R`$(xy)^{${k}}=x^{${k}}y^{${k}}$, da die Gruppe abelsch ist, und für ungerades $${k}$ ist die Abbildung bijektiv auf $\R\setminus\{0\}$ (Umkehrung: $x\mapsto x^{1/(${k})}$, reelle ungerade Wurzel).`);
});
// C^x -> C^x, z -> z^k
[-1,3,-2,4,2].forEach(function(k){
  var q=R`(\C\setminus\{0\},\cdot)\to(\C\setminus\{0\},\cdot),\ z\mapsto z^{${k}}`;
  if(k===-1) M('G',q,2,R`Inversion is a homomorphism in an abelian group, and it is its own inverse.`,R`Inversion ist in einer abelschen Gruppe ein Homomorphismus und zu sich selbst invers.`);
  else {var a=Math.abs(k); M('G',q,1,R`A homomorphism since $\C^\times$ is abelian, and surjective ($\C$ is algebraically closed). But the kernel consists of the ${a} roots of $z^{${a}}=1$.`,R`Ein Homomorphismus, da $\C^\times$ abelsch ist, und surjektiv ($\C$ ist algebraisch abgeschlossen). Aber der Kern besteht aus den ${a} Lösungen von $z^{${a}}=1$.`);}
});
// R -> R, x -> ax+b
[["3","0",1,0],["0","0",0,0],[R`\tfrac12`,"0",1,0],["2","1",1,1],["1","-3",1,1],[R`\pi`,"0",1,0],["-5","0",1,0],["0","4",0,1]].forEach(function(p){
  var a=p[0],b=p[1],anz=p[2],bnz=p[3];
  var f=(a==="0"?"":(a==="1"?"":"{"+a+"}")+"x")+(bnz?((b[0]==='-'||a==="0")?b:"+"+b):"");
  if(f==="") f="0";
  var q=R`(\R,+)\to(\R,+),\ x\mapsto ${f}`;
  if(bnz) M('G',q,0,R`$\varphi(0)=${b}\neq0$, but a homomorphism must send $0\mapsto0$.`,R`$\varphi(0)=${b}\neq0$, aber ein Homomorphismus muss $0\mapsto0$ erfüllen.`);
  else if(!anz) M('G',q,1,R`The zero map is a homomorphism, but not injective.`,R`Die Nullabbildung ist ein Homomorphismus, aber nicht injektiv.`);
  else M('G',q,2,R`Multiplication by a constant is additive, and since $${a}\neq0$, dividing by $${a}$ undoes it.`,R`Multiplikation mit einer Konstanten ist additiv, und wegen $${a}\neq0$ macht Division durch $${a}$ sie rückgängig.`);
});
// R_{>0} -> R_{>0}, x -> x^a
["2",R`\tfrac12`,"-1","0","3",R`\pi`].forEach(function(a){
  var q=R`(\R_{>0},\cdot)\to(\R_{>0},\cdot),\ x\mapsto x^{${a}}`;
  if(a==="0") M('G',q,1,R`$x^0=1$: the trivial homomorphism.`,R`$x^0=1$: der triviale Homomorphismus.`);
  else M('G',q,2,R`$(xy)^{${a}}=x^{${a}}y^{${a}}$, and $x\mapsto x^{1/${a}}$ is the inverse on $\R_{>0}$.`,R`$(xy)^{${a}}=x^{${a}}y^{${a}}$, und $x\mapsto x^{1/${a}}$ ist die Umkehrung auf $\R_{>0}$.`);
});
// Z -> Z/n, x -> [kx]
[[6,1],[6,5],[6,4],[8,3],[8,2],[9,6],[10,0],[7,3]].forEach(function(p){
  var n=p[0],k=p[1],g=gcd(k,n), q=R`(\Z,+)\to(\Z/${n}\Z,+),\ x\mapsto[${kx(k)}]`;
  var s=(g===1)?[R`It is surjective since $\gcd(${k},${n})=1$.`,R`Surjektiv, da $\operatorname{ggT}(${k},${n})=1$.`]:[R`Not surjective either: the image is generated by $[${g}]$.`,R`Auch nicht surjektiv: das Bild wird von $[${g}]$ erzeugt.`];
  if(k===0) s=[R`It's the zero map.`,R`Es ist die Nullabbildung.`];
  M('G',q,1,R`A homomorphism, but $${n}\Z$ lies in the kernel, so it isn't injective. `+s[0],R`Ein Homomorphismus, aber $${n}\Z$ liegt im Kern, also nicht injektiv. `+s[1]);
});
// R -> R_{>0}, x -> a^x
[["2",1],[R`\tfrac13`,1],["10",1],["1",0]].forEach(function(p){
  var a=p[0], q=R`(\R,+)\to(\R_{>0},\cdot),\ x\mapsto ${a}^x`;
  if(p[1]) M('G',q,2,R`$${a}^{x+y}=${a}^x${a}^y$, and $\log_{${a}}$ is the inverse (since $${a}\neq1$).`,R`$${a}^{x+y}=${a}^x${a}^y$, und $\log_{${a}}$ ist die Umkehrung (da $${a}\neq1$).`);
  else M('G',q,1,R`$1^x=1$ for all $x$: the trivial homomorphism.`,R`$1^x=1$ für alle $x$: der triviale Homomorphismus.`);
});
// Z -> Z, n -> kn + c
[[3,0],[-2,0],[0,0],[1,0],[-1,1],[2,-2],[1,5],[4,0]].forEach(function(p){
  var k=p[0],c=p[1], f=lin([k],['n']); if(c) f=(f==='0'?'':f)+(c>0&&f!=='0'?'+':'')+c;
  var q=R`(\Z,+)\to(\Z,+),\ n\mapsto ${f}`;
  if(c) M('G',q,0,R`$\varphi(0)=${c}\neq0$.`,R`$\varphi(0)=${c}\neq0$.`);
  else if(k===0) M('G',q,1,R`The zero map: a homomorphism, not injective.`,R`Die Nullabbildung: ein Homomorphismus, nicht injektiv.`);
  else if(Math.abs(k)===1) M('G',q,2,(k===1?R`The identity map.`:R`Negation is an automorphism of an abelian group.`),(k===1?R`Die Identität.`:R`Negation ist ein Automorphismus einer abelschen Gruppe.`));
  else M('G',q,1,R`Additive and injective, but the image is $${Math.abs(k)}\Z\neq\Z$.`,R`Additiv und injektiv, aber das Bild ist $${Math.abs(k)}\Z\neq\Z$.`);
});
// sign
[2,4,5].forEach(function(n){
  var q=R`S_${n}\to(\{\pm1\},\cdot),\ \sigma\mapsto\operatorname{sgn}\sigma`;
  if(n===2) M('G',q,2,R`$S_2=\{\mathrm{id},(1\,2)\}$ has two elements, and $\operatorname{sgn}$ maps them bijectively to $\{1,-1\}$.`,R`$S_2=\{\mathrm{id},(1\,2)\}$ hat zwei Elemente, und $\operatorname{sgn}$ bildet sie bijektiv auf $\{1,-1\}$ ab.`);
  else M('G',q,1,R`The sign is a surjective homomorphism, but $|S_${n}|=${n===4?24:120}>2$; the kernel is $A_${n}$.`,R`Das Signum ist ein surjektiver Homomorphismus, aber $|S_${n}|=${n===4?24:120}>2$; der Kern ist $A_${n}$.`);
});
// CRT maps
function crt(c,n,a,b){
  var q=R`\Z/${n}\Z\to\Z/${a}\Z\times\Z/${b}\Z,\ [x]\mapsto([x],[x])`;
  if(n%a||n%b){var bad=n%a?a:b;
    M(c,q,0,R`Not well-defined: $${bad}\nmid${n}$, so $[0]_{${n}}=[${n}]_{${n}}$ but $[${n}]_{${bad}}\neq[0]_{${bad}}$.`,R`Nicht wohldefiniert: $${bad}\nmid${n}$, also $[0]_{${n}}=[${n}]_{${n}}$, aber $[${n}]_{${bad}}\neq[0]_{${bad}}$.`);return;}
  var one=(c==='R')?[R` It respects $\cdot$ and sends $1\mapsto(1,1)$.`,R` Es respektiert $\cdot$ und $1\mapsto(1,1)$.`]:['',''];
  if(a*b===n&&gcd(a,b)===1){M(c,q,2,R`Well-defined since $${a},${b}\mid${n}$.`+one[0]+R` Since $\gcd(${a},${b})=1$ and $${a}\cdot${b}=${n}$, this is the Chinese remainder theorem: bijective.`,R`Wohldefiniert, da $${a},${b}\mid${n}$.`+one[1]+R` Wegen $\operatorname{ggT}(${a},${b})=1$ und $${a}\cdot${b}=${n}$ ist das der Chinesische Restsatz: bijektiv.`);return;}
  var l=lcm(a,b);
  if(l<n) M(c,q,1,R`Well-defined since $${a},${b}\mid${n}$.`+one[0]+R` But $[${l}]\mapsto(0,0)$, as $\operatorname{lcm}(${a},${b})=${l}<${n}$.`,R`Wohldefiniert, da $${a},${b}\mid${n}$.`+one[1]+R` Aber $[${l}]\mapsto(0,0)$, da $\operatorname{kgV}(${a},${b})=${l}<${n}$.`);
  else M(c,q,1,R`Well-defined since $${a},${b}\mid${n}$, and injective.`+one[0]+R` But the target has $${a*b}\neq${n}$ elements.`,R`Wohldefiniert, da $${a},${b}\mid${n}$, und injektiv.`+one[1]+R` Aber das Ziel hat $${a*b}\neq${n}$ Elemente.`);
}
[[6,2,3],[4,2,2],[10,2,5],[12,3,4],[12,2,6],[8,2,4],[6,4,3],[20,4,5],[18,3,6],[12,4,6]].forEach(function(p){crt('G',p[0],p[1],p[2]);});

/* ======================= MAPS: RINGS ======================= */
[[12,4,1],[12,5,1],[6,3,1],[8,4,1],[9,3,1],[10,5,1],[10,4,1],[6,6,3],[6,6,4],[10,10,6],[6,6,5],[12,6,7],[15,5,6],
 [4,2,3],[8,8,5],[5,10,2],[2,4,2],[14,7,1],[20,4,1],[20,6,1],[9,9,4],[18,6,1]].forEach(function(p){
  var n=p[0],m=p[1],k=p[2], q=R`\Z/${n}\Z\to\Z/${m}\Z,\ [x]\mapsto[${kx(k)}]`;
  if(md(k*n,m)){var r=md(k*n,m);
    M('R',q,0,R`Not well-defined: $[0]_{${n}}=[${n}]_{${n}}$, but $[${k*n}]_{${m}}=[${r}]_{${m}}\neq[0]_{${m}}$.`,R`Nicht wohldefiniert: $[0]_{${n}}=[${n}]_{${n}}$, aber $[${k*n}]_{${m}}=[${r}]_{${m}}\neq[0]_{${m}}$.`);return;}
  if(md(k,m)!==1){var k2=md(k*k,m), km=md(k,m);
    var x=(k2===km)?[R` (It is even multiplicative, since $${k}^2\equiv${k}\pmod{${m}}$, but not unital.)`,R` (Sogar multiplikativ, da $${k}^2\equiv${k}\pmod{${m}}$, aber nicht unitär.)`]
                   :[R` It isn't multiplicative either: $\varphi(1\cdot1)=[${km}]$, but $\varphi(1)^2=[${k2}]$.`,R` Auch nicht multiplikativ: $\varphi(1\cdot1)=[${km}]$, aber $\varphi(1)^2=[${k2}]$.`];
    M('R',q,0,R`Well-defined and additive, but $\varphi(1)=[${km}]\neq[1]$.`+x[0],R`Wohldefiniert und additiv, aber $\varphi(1)=[${km}]\neq[1]$.`+x[1]);return;}
  M('R',q,1,R`Since $${m}\mid${n}$ and $${k}\equiv1\pmod{${m}}$, this is just reduction mod $${m}$: a surjective ring homomorphism. But $${n}>${m}$, so it isn't injective.`,R`Wegen $${m}\mid${n}$ und $${k}\equiv1\pmod{${m}}$ ist das einfach Reduktion mod $${m}$: ein surjektiver Ringhomomorphismus. Aber $${n}>${m}$, also nicht injektiv.`);
});
// Z[i] -> Z/p
[[5,3],[5,1],[5,4],[13,5],[13,8],[13,3],[17,4],[17,13],[17,2],[3,1],[3,2],[2,1],[29,12],[29,5]].forEach(function(p){
  var P=p[0],c=p[1], q=R`\Z[i]\to\Z/${P}\Z,\ a+bi\mapsto[a+${c===1?'':c}b]`, c2=md(c*c,P);
  if(c2===P-1) M('R',q,1,R`Since $${c}^2=${c*c}\equiv-1\pmod{${P}}$, the assignment $i\mapsto${c}$ respects $i^2=-1$, so this is a ring homomorphism. It is surjective, but $${P}$ lies in the kernel.`,R`Wegen $${c}^2=${c*c}\equiv-1\pmod{${P}}$ respektiert $i\mapsto${c}$ die Relation $i^2=-1$, also ein Ringhomomorphismus. Surjektiv, aber $${P}$ liegt im Kern.`);
  else M('R',q,0,R`$\varphi(i\cdot i)=\varphi(-1)=[${P-1}]$, but $\varphi(i)^2=[${c}^2]=[${c2}]$. A ring homomorphism needs $${c}^2\equiv-1\pmod{${P}}$.`,R`$\varphi(i\cdot i)=\varphi(-1)=[${P-1}]$, aber $\varphi(i)^2=[${c}^2]=[${c2}]$. Für einen Ringhomomorphismus bräuchte man $${c}^2\equiv-1\pmod{${P}}$.`);
});
// R[x] -> R[x], f(x) -> f(ax+b)
[[2,0],[0,1],[-1,0],[3,-2],[0,0],[1,1],[1,-5]].forEach(function(p){
  var a=p[0],b=p[1], arg=lin([a],['x']); if(b) arg=(arg==='0'?'':arg)+(b>0&&arg!=='0'?'+':'')+b;
  var q=R`\R[x]\to\R[x],\ f(x)\mapsto f(${arg})`;
  if(a!==0){var ia=(a===1?'':(a===-1?'-':'\\tfrac1{'+a+'}'));
    var bb=(b===0?'x':'(x'+(b>0?'-':'+')+Math.abs(b)+')');
    M('R',q,2,R`Substitution is a ring homomorphism, and $f(x)\mapsto f(${ia}${bb})$ undoes it, since $${a}\neq0$.`,R`Einsetzen ist ein Ringhomomorphismus, und $f(x)\mapsto f(${ia}${bb})$ macht es rückgängig, da $${a}\neq0$.`);}
  else M('R',q,1,R`A ring homomorphism (evaluation at $${b}$, viewed as a constant polynomial). But $x-${b}\mapsto0$, and only constants are hit.`.replace('x-0','x').replace('x--','x+'),R`Ein Ringhomomorphismus (Auswerten bei $${b}$, als konstantes Polynom). Aber $x-${b}\mapsto0$, und nur Konstanten werden getroffen.`.replace('x-0','x'));
});
// misc ring maps
M('R',R`\R[x]\to\R,\ f\mapsto f(0)`,1,R`Evaluation at $0$: surjective, with kernel $(x)$.`,R`Auswerten bei $0$: surjektiv, mit Kern $(x)$.`);
M('R',R`\R[x]\to\R,\ f\mapsto f(\pi)`,1,R`Evaluation at $\pi$: surjective, with kernel $(x-\pi)$.`,R`Auswerten bei $\pi$: surjektiv, mit Kern $(x-\pi)$.`);
M('R',R`\R[x]\to\R,\ f\mapsto f(0)+1`,0,R`$0\mapsto1$, but a ring homomorphism sends $0\mapsto0$.`,R`$0\mapsto1$, aber ein Ringhomomorphismus erfüllt $0\mapsto0$.`);
M('R',R`\R[x]\to\R,\ f\mapsto f'(0)`,0,R`$1\mapsto0$, and $x\cdot x\mapsto0$ while $\varphi(x)^2=1$.`,R`$1\mapsto0$, und $x\cdot x\mapsto0$, während $\varphi(x)^2=1$.`);
M('R',R`\Q[x]\to\R,\ f\mapsto f(\pi)`,1,R`Injective, since $\pi$ is transcendental, but the image is countable.`,R`Injektiv, da $\pi$ transzendent ist, aber das Bild ist abzählbar.`);
M('R',R`\Z\to\Z,\ n\mapsto n`,2,R`The identity is a ring isomorphism.`,R`Die Identität ist ein Ringisomorphismus.`);
M('R',R`\Z\to\Z,\ n\mapsto -n`,0,R`$\varphi(1)=-1\neq1$, and $\varphi(1\cdot1)=-1\neq1=\varphi(1)^2$.`,R`$\varphi(1)=-1\neq1$, und $\varphi(1\cdot1)=-1\neq1=\varphi(1)^2$.`);
M('R',R`\Z\to\Z,\ n\mapsto 3n`,0,R`$\varphi(1)=3\neq1$. (In fact the only ring homomorphism $\Z\to R$ is $n\mapsto n\cdot1_R$.)`,R`$\varphi(1)=3\neq1$. (Tatsächlich ist $n\mapsto n\cdot1_R$ der einzige Ringhomomorphismus $\Z\to R$.)`);
// quadratic fields
[["3","3","-"],["5","5","-"],["-1","-1","-"],["7","7","-"],["3","5","+"],["2","8","+"],["5","3","+"],["-1","-2","+"],["2","2","0"],["-1","-1","0"]].forEach(function(p){
  function rt(d){return d==="-1"?"i":R`\sqrt{${d}}`;}
  function fld(d){return R`\Q(${rt(d)})`;}
  var d=p[0],e=p[1],t=p[2], x=rt(d), y=rt(e);
  var img=t==="-"?R`a-b${x}`:(t==="+"?R`a+b${y}`:"a");
  var q=R`${fld(d)}\to${fld(e)},\ a+b${x}\mapsto ${img}`;
  if(t==="-") M('R',q,2,R`$(-${x})^2=${d}=(${x})^2$, so $${x}\mapsto-${x}$ respects the defining relation. It's the nontrivial automorphism of $${fld(d)}$ (its own inverse).`,R`$(-${x})^2=${d}=(${x})^2$, also respektiert $${x}\mapsto-${x}$ die definierende Relation. Der nichttriviale Automorphismus von $${fld(d)}$ (zu sich selbst invers).`);
  else if(t==="+") M('R',q,0,R`$\varphi(${x}\cdot ${x})=\varphi(${d})=${d}$, but $\varphi(${x})^2=(${y})^2=${e}$.`,R`$\varphi(${x}\cdot ${x})=\varphi(${d})=${d}$, aber $\varphi(${x})^2=(${y})^2=${e}$.`);
  else M('R',q,0,R`Additive, but $\varphi(${x}\cdot ${x})=${d}$ while $\varphi(${x})^2=0$.`,R`Additiv, aber $\varphi(${x}\cdot ${x})=${d}$, während $\varphi(${x})^2=0$.`);
});
[[15,3,5],[9,3,3],[30,5,6],[14,2,7],[18,2,9],[10,4,5],[24,3,8],[24,4,6],[21,3,7],[16,2,8]].forEach(function(p){crt('R',p[0],p[1],p[2]);});
// powers on F_p
[[2,2],[3,3],[5,5],[7,7],[3,2],[5,2],[7,2],[5,3],[2,4],[3,9]].forEach(function(p){
  var P=p[0],k=p[1], q=R`\F_${P}\to\F_${P},\ x\mapsto x^{${k}}`;
  var pw=(k===P)?'':R` ($${k}=${P}^2$, apply it twice)`;
  if(k===P||k===P*P) M('R',q,2,R`By Fermat, $x^{${P}}=x$ for all $x\in\F_${P}$${pw}, so $\varphi$ is the identity.`.replace('$${pw}','$'+pw),R`Nach Fermat gilt $x^{${P}}=x$ für alle $x\in\F_${P}$${pw.replace('apply it twice','zweimal anwenden')}, also ist $\varphi$ die Identität.`.replace('$${pw}','$'+pw));
  else {var v=md(Math.pow(2,k),P); M('R',q,0,R`$(1+1)^{${k}}=${Math.pow(2,k)}=${v}$ in $\F_${P}$, but $1^{${k}}+1^{${k}}=2$.`,R`$(1+1)^{${k}}=${Math.pow(2,k)}=${v}$ in $\F_${P}$, aber $1^{${k}}+1^{${k}}=2$.`);}
});

/* ======================= MAPS: VECTOR SPACES ======================= */
function ker2(a,b,c,d){var v; if(a||b) v=[-b,a]; else if(c||d) v=[-d,c]; else v=[1,0];
  var g=gcd(v[0],v[1])||1; v=[v[0]/g,v[1]/g]; if(v[0]<0||(v[0]===0&&v[1]<0)) v=[-v[0],-v[1]]; return v;}
[[0,1,1,0],[1,1,1,-1],[1,2,2,4],[2,1,1,1],[3,-1,6,-2],[1,0,0,0],[0,-1,1,0],[2,3,4,6],[1,1,0,1],[2,0,0,3],[1,-1,-1,1],
 [4,2,2,1],[1,3,2,5],[0,2,0,3],[-1,2,3,-6],[2,5,1,3],[1,1,2,2],[3,1,1,3],[0,0,1,1],[5,3,3,2],[1,-2,2,1],[2,-4,-1,2]].forEach(function(p){
  var a=p[0],b=p[1],c=p[2],d=p[3],D=a*d-b*c;
  var q=R`\R^2\to\R^2,\ (x,y)\mapsto(${lin([a,b],['x','y'])},\,${lin([c,d],['x','y'])})`, A=mat([[a,b],[c,d]]);
  if(D) M('V',q,2,R`Linear with matrix $${A}$, and $\det=${a}\cdot${d<0?'('+d+')':d}-${b<0?'('+b+')':b}\cdot${c<0?'('+c+')':c}=${D}\neq0$.`,R`Linear mit Matrix $${A}$, und $\det=${a}\cdot${d<0?'('+d+')':d}-${b<0?'('+b+')':b}\cdot${c<0?'('+c+')':c}=${D}\neq0$.`);
  else {var v=ker2(a,b,c,d); M('V',q,1,R`Linear, but $\det${A}=0$; for example $${vec(v)}\mapsto(0,0)$.`,R`Linear, aber $\det${A}=0$; zum Beispiel $${vec(v)}\mapsto(0,0)$.`);}
});
function det3(m){return m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])-m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])+m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]);}
function cross(u,v){return [u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];}
[[[1,1,0],[0,1,1],[1,0,1]],[[1,2,3],[4,5,6],[7,8,9]],[[2,0,1],[1,1,0],[0,1,1]],[[1,1,1],[1,1,1],[0,0,1]],[[1,-1,0],[0,1,-1],[-1,0,1]],
 [[0,1,0],[0,0,1],[1,0,0]],[[1,2,0],[0,1,2],[2,0,1]],[[3,1,2],[1,0,1],[2,1,1]],[[1,0,1],[0,2,0],[1,0,-1]],[[1,1,0],[1,0,1],[0,1,-1]]].forEach(function(m){
  var vs=['x','y','z'], D=det3(m), q=R`\R^3\to\R^3,\ (x,y,z)\mapsto(${m.map(function(r){return lin(r,vs);}).join(R`,\,`)})`;
  if(D) M('V',q,2,R`Linear with matrix $${mat(m)}$ of determinant $${D}\neq0$.`,R`Linear mit Matrix $${mat(m)}$ der Determinante $${D}\neq0$.`);
  else {var v=null,pr=[[0,1],[0,2],[1,2]];for(var i=0;i<3&&!v;i++){var w=cross(m[pr[i][0]],m[pr[i][1]]);if(w.some(function(t){return t;})) v=w;}
    var g=gcd(gcd(v[0],v[1]),v[2]); v=v.map(function(t){return t/g;}); if(v.find(function(t){return t;})<0) v=v.map(function(t){return -t;});
    M('V',q,1,R`Linear, but $\det${mat(m)}=0$; for example $${vec(v)}\mapsto0$.`,R`Linear, aber $\det${mat(m)}=0$; zum Beispiel $${vec(v)}\mapsto0$.`);}
});
// R^m -> R^n, m != n
function rank(rows){var A=rows.map(function(r){return r.slice();}),r=0,cols=A[0].length;
  for(var c=0;c<cols&&r<A.length;c++){var p=-1;for(var i=r;i<A.length;i++) if(A[i][c]!==0){p=i;break;} if(p<0) continue;
    var t=A[p];A[p]=A[r];A[r]=t;for(i=0;i<A.length;i++) if(i!==r&&A[i][c]!==0){var f=A[i][c]/A[r][c];for(var j=0;j<cols;j++) A[i][j]-=f*A[r][j];} r++;}
  return r;}
[[[1,1,0],[0,1,-1]],[[1,0],[0,1],[1,1]],[[1,2,3]],[[1],[2]],[[1,1,1,1]],[[1,0,1],[2,0,2]],[[1,-1],[2,-2],[0,0]],[[1,0,0,1],[0,1,1,0]]].forEach(function(rows){
  var m=rows[0].length,n=rows.length, vs=m===1?['t']:['x','y','z','w'].slice(0,m), r=rank(rows);
  var src=m===1?'t':'('+vs.join(',')+')', img=n===1?lin(rows[0],vs):'('+rows.map(function(rw){return lin(rw,vs);}).join(R`,\,`)+')';
  var q=R`\R^${m}\to\R^${n},\ ${src}\mapsto ${img}`;
  var st = r===m&&r===n?['',''] : r===m?[R`injective, not surjective`,R`injektiv, nicht surjektiv`] : r===n?[R`surjective, not injective`,R`surjektiv, nicht injektiv`] : [R`neither injective nor surjective`,R`weder injektiv noch surjektiv`];
  M('V',q,1,R`Linear (every coordinate is a linear form), but $\dim\R^${m}=${m}\neq${n}=\dim\R^${n}$, so it can't be an isomorphism. The rank is $${r}$: ${st[0]}.`,R`Linear (jede Koordinate ist eine Linearform), aber $\dim\R^${m}=${m}\neq${n}=\dim\R^${n}$, also kein Isomorphismus. Der Rang ist $${r}$: ${st[1]}.`);
});
// non-linear maps
[[R`\R^2\to\R^2,\ (x,y)\mapsto(x+y,1)`,R`$\varphi(0,0)=(0,1)\neq0$.`,R`$\varphi(0,0)=(0,1)\neq0$.`],
 [R`\R^2\to\R^2,\ (x,y)\mapsto(2x-y+3,\,x)`,R`$\varphi(0,0)=(3,0)\neq0$: affine, not linear.`,R`$\varphi(0,0)=(3,0)\neq0$: affin, nicht linear.`],
 [R`\R^2\to\R^2,\ (x,y)\mapsto(e^x,y)`,R`$\varphi(0,0)=(1,0)\neq0$.`,R`$\varphi(0,0)=(1,0)\neq0$.`],
 [R`\R^2\to\R^2,\ (x,y)\mapsto(\sin x,y)`,R`$\varphi(\pi,0)=(0,0)$, but $2\varphi(\tfrac\pi2,0)=(2,0)$.`,R`$\varphi(\pi,0)=(0,0)$, aber $2\varphi(\tfrac\pi2,0)=(2,0)$.`],
 [R`\R^2\to\R^2,\ (x,y)\mapsto(x^3,y)`,R`$\varphi(2,0)=(8,0)$, but $2\varphi(1,0)=(2,0)$.`,R`$\varphi(2,0)=(8,0)$, aber $2\varphi(1,0)=(2,0)$.`],
 [R`\R^2\to\R^2,\ (x,y)\mapsto(xy,\,x+y)`,R`$\varphi(2,2)=(4,4)$, but $2\varphi(1,1)=(2,4)$.`,R`$\varphi(2,2)=(4,4)$, aber $2\varphi(1,1)=(2,4)$.`],
 [R`\R^2\to\R^2,\ (x,y)\mapsto(x,\,y+x^2)`,R`$\varphi(-1,0)=(-1,1)$, but $-\varphi(1,0)=(-1,-1)$.`,R`$\varphi(-1,0)=(-1,1)$, aber $-\varphi(1,0)=(-1,-1)$.`],
 [R`\R^3\to\R^3,\ (x,y,z)\mapsto(x,y,1)`,R`$\varphi(0)=(0,0,1)\neq0$.`,R`$\varphi(0)=(0,0,1)\neq0$.`],
 [R`\R^2\to\R^2,\ (x,y)\mapsto(\max(x,y),0)`,R`$\varphi(-1,0)=(0,0)$, but $-\varphi(1,0)=(-1,0)$.`,R`$\varphi(-1,0)=(0,0)$, aber $-\varphi(1,0)=(-1,0)$.`],
 [R`\R^2\to\R^2,\ (x,y)\mapsto(\sqrt{x^2+y^2},0)`,R`$\varphi(-1,0)=(1,0)$, but $-\varphi(1,0)=(-1,0)$.`,R`$\varphi(-1,0)=(1,0)$, aber $-\varphi(1,0)=(-1,0)$.`],
 [R`\R\to\R,\ x\mapsto x+5`,R`$\varphi(0)=5\neq0$.`,R`$\varphi(0)=5\neq0$.`],
 [R`\R\to\R,\ x\mapsto\lfloor x\rfloor`,R`$\varphi(\tfrac12+\tfrac12)=1$, but $\varphi(\tfrac12)+\varphi(\tfrac12)=0$.`,R`$\varphi(\tfrac12+\tfrac12)=1$, aber $\varphi(\tfrac12)+\varphi(\tfrac12)=0$.`]
].forEach(function(p){M('V',p[0],0,p[1],p[2]);});
// over F_p
[[5,[1,2,3,1]],[5,[1,2,2,1]],[3,[1,1,1,2]],[3,[1,2,2,1]],[2,[1,1,1,0]],[2,[1,1,1,1]],[7,[2,3,1,5]],[7,[1,3,2,1]],[3,[2,1,1,2]],[5,[2,1,1,3]],[2,[0,1,1,0]],[11,[3,1,1,4]]].forEach(function(p){
  var P=p[0],a=p[1][0],b=p[1][1],c=p[1][2],d=p[1][3],D=a*d-b*c,r=md(D,P);
  var q=R`\F_${P}^2\to\F_${P}^2,\ (x,y)\mapsto(${lin([a,b],['x','y'])},\,${lin([c,d],['x','y'])})`;
  if(r) M('V',q,2,R`Linear, with $\det=${D}\equiv${r}\neq0$ in $\F_${P}$.`,R`Linear, mit $\det=${D}\equiv${r}\neq0$ in $\F_${P}$.`);
  else {var v=ker2(a,b,c,d).map(function(t){return md(t,P);});
    var note=D?[R` (Over $\R$ it would be invertible, since $${D}\neq0$ there.)`,R` (Über $\R$ wäre es invertierbar, da dort $${D}\neq0$.)`]:['',''];
    M('V',q,1,R`Linear, but $\det=${D}\equiv0$ in $\F_${P}$; e.g. $${vec(v)}\mapsto(0,0)$.`+note[0],R`Linear, aber $\det=${D}\equiv0$ in $\F_${P}$; z.B. $${vec(v)}\mapsto(0,0)$.`+note[1]);}
});
// polynomial spaces
[[R`\R[x]_{\le2}\to\R[x]_{\le2},\ f\mapsto f+f'`,2,R`In the basis $1,x,x^2$ the matrix is upper triangular with $1$s on the diagonal. Or: $f+f'=0$ is impossible for $f\neq0$ by comparing degrees.`,R`In der Basis $1,x,x^2$ ist die Matrix obere Dreiecksmatrix mit Einsen auf der Diagonale. Oder: $f+f'=0$ ist für $f\neq0$ aus Gradgründen unmöglich.`],
 [R`\R[x]_{\le2}\to\R[x]_{\le2},\ f\mapsto f'`,1,R`Linear, but constants lie in the kernel (and $x^2$ isn't hit).`,R`Linear, aber Konstanten liegen im Kern (und $x^2$ wird nicht getroffen).`],
 [R`\R[x]_{\le2}\to\R[x]_{\le3},\ f\mapsto xf`,1,R`Linear and injective, but $\dim 3<4$; $1$ isn't hit.`,R`Linear und injektiv, aber $\dim 3<4$; $1$ wird nicht getroffen.`],
 [R`\R[x]_{\le2}\to\R[x]_{\le2},\ f\mapsto xf'`,1,R`Linear ($x^k\mapsto kx^k$), but constants go to $0$.`,R`Linear ($x^k\mapsto kx^k$), aber Konstanten gehen auf $0$.`],
 [R`\R[x]_{\le3}\to\R^4,\ f\mapsto(f(0),f(1),f(2),f(3))`,2,R`Linear; a polynomial of degree $\le3$ with four roots is $0$, so it is injective, and the dimensions agree.`,R`Linear; ein Polynom vom Grad $\le3$ mit vier Nullstellen ist $0$, also injektiv, und die Dimensionen stimmen überein.`],
 [R`\R[x]_{\le3}\to\R^3,\ f\mapsto(f(0),f(1),f(2))`,1,R`Linear and surjective (interpolation), but $x(x-1)(x-2)\mapsto0$.`,R`Linear und surjektiv (Interpolation), aber $x(x-1)(x-2)\mapsto0$.`],
 [R`\R[x]_{\le2}\to\R[x]_{\le2},\ f(x)\mapsto f(2x)`,2,R`Linear and diagonal in the basis $1,x,x^2$ with entries $1,2,4$.`,R`Linear und diagonal in der Basis $1,x,x^2$ mit Einträgen $1,2,4$.`],
 [R`\R[x]_{\le2}\to\R[x]_{\le2},\ f\mapsto f(0)`,1,R`Linear (the constant polynomial $f(0)$), but $x\mapsto0$.`,R`Linear (das konstante Polynom $f(0)$), aber $x\mapsto0$.`],
 [R`\R[x]_{\le2}\to\R[x]_{\le2},\ f\mapsto f+1`,0,R`$0\mapsto1\neq0$.`,R`$0\mapsto1\neq0$.`],
 [R`\R[x]_{\le2}\to\R[x]_{\le4},\ f\mapsto f^2`,0,R`$(2f)^2=4f^2\neq2f^2$ for $f\neq0$.`,R`$(2f)^2=4f^2\neq2f^2$ für $f\neq0$.`],
 [R`\R[x]_{\le2}\to\R^3,\ f\mapsto(f(0),f'(0),f''(0))`,2,R`Linear; by Taylor, $f=f(0)+f'(0)x+\tfrac12f''(0)x^2$, so $f$ is recovered from its image.`,R`Linear; nach Taylor ist $f=f(0)+f'(0)x+\tfrac12f''(0)x^2$, also lässt sich $f$ aus dem Bild zurückgewinnen.`],
 [R`\R[x]_{\le2}\to\R^2,\ f\mapsto(f(1),f'(1))`,1,R`Linear and surjective, but $(x-1)^2\mapsto(0,0)$.`,R`Linear und surjektiv, aber $(x-1)^2\mapsto(0,0)$.`],
 [R`\R[x]_{\le2}\to\R[x]_{\le2},\ f(x)\mapsto x^2f(1/x)`,2,R`Linear: $a+bx+cx^2\mapsto c+bx+ax^2$ reverses the coefficients, and is its own inverse.`,R`Linear: $a+bx+cx^2\mapsto c+bx+ax^2$ kehrt die Koeffizienten um und ist zu sich selbst invers.`],
 [R`\R[x]_{\le2}\to\R,\ f\mapsto\int_0^1f(t)\,dt`,1,R`Linear and surjective, but $x-\tfrac12\mapsto0$.`,R`Linear und surjektiv, aber $x-\tfrac12\mapsto0$.`],
 [R`\R[x]_{\le2}\to\R[x]_{\le2},\ f(x)\mapsto f(x)-f(x-1)`,1,R`Linear, but constants map to $0$.`,R`Linear, aber Konstanten gehen auf $0$.`]
].forEach(function(p){M('V',p[0],p[1],p[2],p[3]);});

/* ======================= STRUCTS: GROUPS ======================= */
[2,3,4,5,8,9,10,11,12,13,15,6,7].forEach(function(n){
  var q=R`(\Z/${n}\Z\setminus\{0\},\cdot)`;
  if(isPrime(n)) S('G',q,[0],n===2?R`This is $\{1\}$, the trivial group.`:R`$${n}$ is prime, so $\Z/${n}\Z$ is a field: nonzero elements are closed under $\cdot$ and invertible. (Cyclic of order $${n-1}$.)`,n===2?R`Das ist $\{1\}$, die triviale Gruppe.`:R`$${n}$ ist prim, also ist $\Z/${n}\Z$ ein Körper: Elemente $\neq0$ sind abgeschlossen unter $\cdot$ und invertierbar. (Zyklisch der Ordnung $${n-1}$.)`);
  else {var p=2;while(n%p) p++; S('G',q,[1,4],R`$${p}\cdot${n/p}=${n}\equiv0$, so it isn't closed. ($${p}$ has no inverse mod $${n}$ either.)`,R`$${p}\cdot${n/p}=${n}\equiv0$, also nicht abgeschlossen. ($${p}$ hat mod $${n}$ auch kein Inverses.)`);}
});
[8,9,10,12,15].forEach(function(n){
  S('G',R`((\Z/${n}\Z)^\times,\cdot)`,[0],R`The units of any ring form a group under multiplication. Here it has $\varphi(${n})=${phi(n)}$ elements.`,R`Die Einheiten eines Rings bilden immer eine Gruppe unter Multiplikation. Hier mit $\varphi(${n})=${phi(n)}$ Elementen.`);
});
[5,8].forEach(function(n){S('G',R`(\Z/${n}\Z,\cdot)`,[4],R`Associative with neutral element $1$, but $0$ has no inverse.`,R`Assoziativ mit neutralem Element $1$, aber $0$ hat kein Inverses.`);});
[[3,0],[3,1],[5,0],[4,2],[6,3],[7,0]].forEach(function(p){
  var k=p[0],r=p[1], q=R`(${k}\Z${r?'+'+r:''},+)`;
  if(!r) S('G',q,[0],R`Multiples of $${k}$ are closed under $+$ and negation and contain $0$: a subgroup of $\Z$.`,R`Vielfache von $${k}$ sind abgeschlossen unter $+$ und Negation und enthalten $0$: eine Untergruppe von $\Z$.`);
  else S('G',q,[1,3],R`$${r}+${r}=${2*r}\notin${k}\Z+${r}$, so it isn't closed. And $0$ isn't in the set.`,R`$${r}+${r}=${2*r}\notin${k}\Z+${r}$, also nicht abgeschlossen. Und $0$ liegt nicht in der Menge.`);
});
[-3,2,5,-1].forEach(function(c){
  var q=R`(\Z,*),\ a*b=a+b${c>0?'+':''}${c}`;
  S('G',q,[0],R`Associative ($a+b+c${c>0?'+':''}${2*c}$ either way). Neutral element $${-c}$; inverse of $a$ is $-a${-2*c>0?'+':''}${-2*c}$. Isomorphic to $(\Z,+)$ via $a\mapsto a${c>0?'+':''}${c}$.`,R`Assoziativ (beide Seiten $a+b+c${c>0?'+':''}${2*c}$). Neutrales Element $${-c}$; invers zu $a$ ist $-a${-2*c>0?'+':''}${-2*c}$. Isomorph zu $(\Z,+)$ via $a\mapsto a${c>0?'+':''}${c}$.`);
});
[[2,R`\tfrac12`,R`-\tfrac12`],[-1,"1","1"],[3,R`\tfrac13`,R`-\tfrac13`]].forEach(function(p){
  var c=p[0], op=R`a+b${c<0?'-':'+'}${Math.abs(c)===1?'':Math.abs(c)}ab`, bad=c<0?p[2]:p[2];
  S('G',R`(\R,*),\ a*b=${op}`,[4],R`$a*b=\frac{(1${c<0?'-':'+'}${Math.abs(c)===1?'':Math.abs(c)}a)(1${c<0?'-':'+'}${Math.abs(c)===1?'':Math.abs(c)}b)-1}{${c}}$, which is associative with neutral element $0$. But $${bad}*b=${bad}$ for every $b$, so $${bad}$ has no inverse.`.replace('{-1}','{-1}'),R`$a*b=\frac{(1${c<0?'-':'+'}${Math.abs(c)===1?'':Math.abs(c)}a)(1${c<0?'-':'+'}${Math.abs(c)===1?'':Math.abs(c)}b)-1}{${c}}$ ist assoziativ mit neutralem Element $0$. Aber $${bad}*b=${bad}$ für alle $b$, also hat $${bad}$ kein Inverses.`);
  S('G',R`(\R\setminus\{${bad}\},*),\ a*b=${op}`,[0],R`$a\mapsto1${c<0?'-':'+'}${Math.abs(c)===1?'':Math.abs(c)}a$ turns $*$ into multiplication and maps $\R\setminus\{${bad}\}$ bijectively onto $\R\setminus\{0\}$, so this is $(\R\setminus\{0\},\cdot)$ in disguise. Neutral element $0$.`,R`$a\mapsto1${c<0?'-':'+'}${Math.abs(c)===1?'':Math.abs(c)}a$ übersetzt $*$ in Multiplikation und bildet $\R\setminus\{${bad}\}$ bijektiv auf $\R\setminus\{0\}$ ab: verkleidetes $(\R\setminus\{0\},\cdot)$. Neutrales Element $0$.`);
});
[R`\tfrac12`,"3"].forEach(function(r){S('G',R`(\{z\in\C:|z|=${r}\},\cdot)`,[1,3],R`$|z\cdot w|=${r}\cdot${r}\neq${r}$, so it isn't closed, and $1$ is not in the set.`,R`$|z\cdot w|=${r}\cdot${r}\neq${r}$, also nicht abgeschlossen, und $1$ liegt nicht in der Menge.`);});
[3,5,6,8].forEach(function(n){S('G',R`(\{z\in\C:z^{${n}}=1\},\cdot)`,[0],R`The ${n}th roots of unity: closed ($(zw)^{${n}}=z^{${n}}w^{${n}}=1$), $1$ is in it, $z^{-1}=\bar z$ is too. Cyclic of order ${n}.`,R`Die ${n}-ten Einheitswurzeln: abgeschlossen ($(zw)^{${n}}=z^{${n}}w^{${n}}=1$), $1$ liegt drin, $z^{-1}=\bar z$ auch. Zyklisch der Ordnung ${n}.`);});
[2,4].forEach(function(n){S('G',R`(\{z\in\C:z^{${n}}=-1\},\cdot)`,[1,3],R`If $z^{${n}}=w^{${n}}=-1$, then $(zw)^{${n}}=1\neq-1$: not closed. And $1^{${n}}=1$, so $1$ isn't in the set.`,R`Aus $z^{${n}}=w^{${n}}=-1$ folgt $(zw)^{${n}}=1\neq-1$: nicht abgeschlossen. Und $1^{${n}}=1$, also liegt $1$ nicht in der Menge.`);});
[[R`(\{A\in M_2(\R):\det A=2\},\cdot)`,[1,3],R`$\det(AB)=4\neq2$, and $\det I=1$.`,R`$\det(AB)=4\neq2$, und $\det I=1$.`],
 [R`(\{A\in M_2(\R):\det A=-1\},\cdot)`,[1,3],R`$\det(AB)=1\neq-1$, and $I$ isn't in the set.`,R`$\det(AB)=1\neq-1$, und $I$ liegt nicht in der Menge.`],
 [R`(\{A\in M_2(\R):\det A=\pm1\},\cdot)`,[0],R`$\det(AB)=\det A\det B\in\{\pm1\}$, $I$ is in it, and $\det A^{-1}=1/\det A\in\{\pm1\}$.`,R`$\det(AB)=\det A\det B\in\{\pm1\}$, $I$ liegt drin, und $\det A^{-1}=1/\det A\in\{\pm1\}$.`],
 [R`(\{A\in M_2(\R):\det A>0\},\cdot)`,[0],R`Positive determinants multiply to positive ones, $\det I=1>0$, and $\det A^{-1}=1/\det A>0$.`,R`Positive Determinanten multiplizieren sich zu positiven, $\det I=1>0$, und $\det A^{-1}=1/\det A>0$.`],
 [R`(\{A\in M_2(\R):\det A<0\},\cdot)`,[1,3],R`A product of two negative determinants is positive: not closed. $I$ isn't in the set.`,R`Das Produkt zweier negativer Determinanten ist positiv: nicht abgeschlossen. $I$ liegt nicht in der Menge.`],
 [R`(\{A\in\mathrm{GL}_2(\R):A=A^T\},\cdot)`,[1],R`Products of symmetric matrices needn't be symmetric: $\begin{pmatrix}1&0\\0&2\end{pmatrix}\begin{pmatrix}0&1\\1&0\end{pmatrix}=\begin{pmatrix}0&1\\2&0\end{pmatrix}$.`,R`Produkte symmetrischer Matrizen sind nicht unbedingt symmetrisch: $\begin{pmatrix}1&0\\0&2\end{pmatrix}\begin{pmatrix}0&1\\1&0\end{pmatrix}=\begin{pmatrix}0&1\\2&0\end{pmatrix}$.`],
 [R`(\{A\in M_2(\R):A^TA=I\},\cdot)`,[0],R`The orthogonal group $O(2)$: $(AB)^TAB=B^TA^TAB=I$, and $A^{-1}=A^T$ is orthogonal too.`,R`Die orthogonale Gruppe $O(2)$: $(AB)^TAB=B^TA^TAB=I$, und $A^{-1}=A^T$ ist ebenfalls orthogonal.`],
 [R`(\{\begin{pmatrix}a&b\\0&c\end{pmatrix}:ac\neq0\},\cdot)`,[0],R`Invertible upper triangular matrices are closed under products and inverses (the Borel subgroup).`,R`Invertierbare obere Dreiecksmatrizen sind abgeschlossen unter Produkt und Inversion (Borel-Untergruppe).`],
 [R`(\{\begin{pmatrix}1&b\\0&1\end{pmatrix}:b\in\R\},\cdot)`,[0],R`$\begin{pmatrix}1&b\\0&1\end{pmatrix}\begin{pmatrix}1&c\\0&1\end{pmatrix}=\begin{pmatrix}1&b+c\\0&1\end{pmatrix}$, so this is $(\R,+)$ in disguise.`,R`$\begin{pmatrix}1&b\\0&1\end{pmatrix}\begin{pmatrix}1&c\\0&1\end{pmatrix}=\begin{pmatrix}1&b+c\\0&1\end{pmatrix}$: verkleidetes $(\R,+)$.`],
 [[R`(\{\text{diagonal }A\in M_2(\R):\det A\neq0\},\cdot)`,R`(\{\text{diagonale }A\in M_2(\R):\det A\neq0\},\cdot)`],[0],R`Isomorphic to $(\R^\times)^2$ via the diagonal entries.`,R`Über die Diagonaleinträge isomorph zu $(\R^\times)^2$.`],
 [R`(\mathrm{SL}_2(\Z),\cdot)`,[0],R`Integer matrices of determinant $1$: the inverse $\begin{pmatrix}d&-b\\-c&a\end{pmatrix}$ again has integer entries.`,R`Ganzzahlige Matrizen mit Determinante $1$: die Inverse $\begin{pmatrix}d&-b\\-c&a\end{pmatrix}$ ist wieder ganzzahlig.`],
 [R`(\{A\in M_2(\Z):\det A\neq0\},\cdot)`,[4],R`Closed with neutral element $I$, but $(2I)^{-1}=\tfrac12I$ has non-integer entries.`,R`Abgeschlossen mit neutralem Element $I$, aber $(2I)^{-1}=\tfrac12I$ ist nicht ganzzahlig.`],
 [R`(M_2(\Z),+)`,[0],R`Entrywise addition of integers: an abelian group, isomorphic to $\Z^4$.`,R`Eintragsweise Addition ganzer Zahlen: eine abelsche Gruppe, isomorph zu $\Z^4$.`],
 [R`(\{A\in M_2(\R):\det A=0\},\cdot)`,[3,4],R`Closed ($\det AB=0$), but $I$ isn't in the set, and no singular $E$ satisfies $EA=A$ for all singular $A$ (take $A=\operatorname{diag}(1,0)$ and $\operatorname{diag}(0,1)$).`,R`Abgeschlossen ($\det AB=0$), aber $I$ liegt nicht drin, und kein singuläres $E$ erfüllt $EA=A$ für alle singulären $A$ (nimm $A=\operatorname{diag}(1,0)$ und $\operatorname{diag}(0,1)$).`]
].forEach(function(p){S('G',p[0],p[1],p[2],p[3]);});
S('G',R`([0,\infty),\max)`,[4],R`$0$ is neutral, but $\max(1,b)=0$ is impossible.`,R`$0$ ist neutral, aber $\max(1,b)=0$ ist unmöglich.`);
S('G',R`(\{0,1\},\max)`,[4],R`$0$ is neutral, but $\max(1,b)=0$ has no solution.`,R`$0$ ist neutral, aber $\max(1,b)=0$ ist unlösbar.`);
S('G',R`(\Z/2\Z,-)`,[0],R`In $\Z/2\Z$ we have $-b=b$, so $a-b=a+b$: this is just $(\Z/2\Z,+)$.`,R`In $\Z/2\Z$ ist $-b=b$, also $a-b=a+b$: das ist einfach $(\Z/2\Z,+)$.`);
S('G',R`(\Z/5\Z,-)`,[2,3],R`$(0-1)-1=3$, but $0-(1-1)=0$. And $0$ is only right-neutral: $0-1=4\neq1$.`,R`$(0-1)-1=3$, aber $0-(1-1)=0$. Und $0$ ist nur rechtsneutral: $0-1=4\neq1$.`);
[[[R`(\{\text{words over }\{a,b\}\},\ \text{concatenation})`,R`(\{\text{Wörter über }\{a,b\}\},\ \text{Konkatenation})`],[4],R`Associative with the empty word as neutral element, but concatenation never shortens a word, so $a$ has no inverse.`,R`Assoziativ mit dem leeren Wort als neutralem Element, aber Konkatenation verkürzt nie, also hat $a$ kein Inverses.`],
 [R`(A_4,\circ)`,[0],R`The even permutations form a subgroup of $S_4$ (the kernel of $\operatorname{sgn}$).`,R`Die geraden Permutationen bilden eine Untergruppe von $S_4$ (den Kern von $\operatorname{sgn}$).`],
 [[R`(\{\text{odd permutations in }S_4\},\circ)`,R`(\{\text{ungerade Permutationen in }S_4\},\circ)`],[1,3],R`odd $\circ$ odd is even: not closed, and $\mathrm{id}$ is even.`,R`ungerade $\circ$ ungerade ist gerade: nicht abgeschlossen, und $\mathrm{id}$ ist gerade.`],
 [R`(\{\mathrm{id},(1\,2),(2\,3),(1\,3)\},\circ)`,[1],R`$(1\,2)(2\,3)=(1\,2\,3)$ is not in the set.`,R`$(1\,2)(2\,3)=(1\,2\,3)$ liegt nicht in der Menge.`],
 [R`(\{\mathrm{id},(1\,2)\},\circ)`,[0],R`$(1\,2)^2=\mathrm{id}$, so it is closed and every element is its own inverse: a group of order $2$.`,R`$(1\,2)^2=\mathrm{id}$, also abgeschlossen und jedes Element zu sich selbst invers: eine Gruppe der Ordnung $2$.`],
 [[R`(\{\text{rotations of a square}\},\circ)`,R`(\{\text{Drehungen eines Quadrats}\},\circ)`],[0],R`Rotations by $0,\frac\pi2,\pi,\frac{3\pi}2$: cyclic of order $4$.`,R`Drehungen um $0,\frac\pi2,\pi,\frac{3\pi}2$: zyklisch der Ordnung $4$.`],
 [R`(\Q,*),\ a*b=a+b-ab`,[4],R`$a*b=1-(1-a)(1-b)$ is associative with neutral element $0$, but $1*b=1$ for all $b$.`,R`$a*b=1-(1-a)(1-b)$ ist assoziativ mit neutralem Element $0$, aber $1*b=1$ für alle $b$.`],
 [R`(\{2^k:k\in\Z\},\cdot)`,[0],R`Isomorphic to $(\Z,+)$ via $k\mapsto2^k$.`,R`Isomorph zu $(\Z,+)$ via $k\mapsto2^k$.`],
 [R`(\{2^k:k\in\N_0\},\cdot)`,[4],R`$1=2^0$ is neutral, but $2^{-1}$ is missing.`,R`$1=2^0$ ist neutral, aber $2^{-1}$ fehlt.`],
 [R`(\{\tfrac1n:n\in\N\},\cdot)`,[4],R`Closed ($\frac1m\cdot\frac1n=\frac1{mn}$) with neutral element $1$, but $\frac12$ would need $2$ as its inverse.`,R`Abgeschlossen ($\frac1m\cdot\frac1n=\frac1{mn}$) mit neutralem Element $1$, aber $\frac12$ bräuchte $2$ als Inverses.`]
].forEach(function(p){S('G',p[0],p[1],p[2],p[3]);});

/* ======================= STRUCTS: RINGS ======================= */
[3,4,5,10,2].forEach(function(k){S('R',R`(${k}\Z,+,\cdot)`,[4],R`An abelian group, closed under $\cdot$, associative and distributive, but there's no $1$: $${k}m\cdot e=${k}m$ forces $e=1\notin${k}\Z$.`,R`Abelsche Gruppe, abgeschlossen unter $\cdot$, assoziativ und distributiv, aber ohne $1$: $${k}m\cdot e=${k}m$ erzwingt $e=1\notin${k}\Z$.`);});
[7,8,9,2,12].forEach(function(n){S('R',R`(\Z/${n}\Z,+,\cdot)`,[0],R`A quotient of $\Z$ by the ideal $${n}\Z$, hence a commutative ring with $1$.`+(isPrime(n)?R` (Even a field, since $${n}$ is prime.)`:R` (It has zero divisors, since $${n}$ isn't prime.)`),R`Ein Quotient von $\Z$ nach dem Ideal $${n}\Z$, also ein kommutativer Ring mit $1$.`+(isPrime(n)?R` (Sogar ein Körper, da $${n}$ prim ist.)`:R` (Mit Nullteilern, da $${n}$ nicht prim ist.)`));});
[["i","-1"],[R`\sqrt3`,"3"],[R`\sqrt5`,"5"],[R`\sqrt{-2}`,"-2"],[R`\sqrt2`,"2"]].forEach(function(p){
  S('R',R`(\Z[${p[0]}],+,\cdot)`,[0],R`$(a+b${p[0]})(c+d${p[0]})=(ac${p[1][0]==='-'?'':'+'}${p[1]==='-1'?'-':p[1]}bd)+(ad+bc)${p[0]}$, so it is closed; a subring of $\C$.`,R`$(a+b${p[0]})(c+d${p[0]})=(ac${p[1][0]==='-'?'':'+'}${p[1]==='-1'?'-':p[1]}bd)+(ad+bc)${p[0]}$, also abgeschlossen; ein Unterring von $\C$.`);
});
["2","3","5"].forEach(function(d){S('R',R`(\{a+b\sqrt[3]{${d}}:a,b\in\Z\},+,\cdot)`,[2],R`$\sqrt[3]{${d}}\cdot\sqrt[3]{${d}}=\sqrt[3]{${d*d}}$ isn't of the form $a+b\sqrt[3]{${d}}$. You'd need $\Z[\sqrt[3]{${d}}]=\{a+b\sqrt[3]{${d}}+c\sqrt[3]{${d*d}}\}$.`,R`$\sqrt[3]{${d}}\cdot\sqrt[3]{${d}}=\sqrt[3]{${d*d}}$ ist nicht von der Form $a+b\sqrt[3]{${d}}$. Man bräuchte $\Z[\sqrt[3]{${d}}]=\{a+b\sqrt[3]{${d}}+c\sqrt[3]{${d*d}}\}$.`);});
S('R',[R`(\{a+b\sqrt2:a,b\in\Z,\ b\text{ even}\},+,\cdot)`,R`(\{a+b\sqrt2:a,b\in\Z,\ b\text{ gerade}\},+,\cdot)`],[0],R`This is $\Z[2\sqrt2]$: $(a+2b'\sqrt2)(c+2d'\sqrt2)=(ac+8b'd')+2(ad'+b'c)\sqrt2$, and $1$ is in it.`,R`Das ist $\Z[2\sqrt2]$: $(a+2b'\sqrt2)(c+2d'\sqrt2)=(ac+8b'd')+2(ad'+b'c)\sqrt2$, und $1$ liegt drin.`);
S('R',R`(\{a+b\sqrt2:a,b\in\N_0\},+,\cdot)`,[1],R`Closed under $+$ and $\cdot$, but there are no additive inverses.`,R`Abgeschlossen unter $+$ und $\cdot$, aber ohne additive Inverse.`);
S('R',R`(\{a+b\tfrac{1+\sqrt5}2:a,b\in\Z\},+,\cdot)`,[0],R`With $\tau=\frac{1+\sqrt5}2$ we have $\tau^2=\tau+1$, so products stay in the set: this is the ring $\Z[\tau]$.`,R`Mit $\tau=\frac{1+\sqrt5}2$ gilt $\tau^2=\tau+1$, also bleiben Produkte in der Menge: der Ring $\Z[\tau]$.`);
S('R',R`(\{a+b\sqrt2:a,b\in\Q\},+,\cdot)`,[0],R`This is the field $\Q(\sqrt2)$, in particular a ring.`,R`Das ist der Körper $\Q(\sqrt2)$, insbesondere ein Ring.`);
[["\\R","3",1,R`\tfrac13`],["\\R","-1",1,"-1"],["\\R",R`\tfrac12`,1,"2"],["\\Q","5",1,R`\tfrac15`],["\\Z","-1",1,"-1"],["\\Z","3",0,R`\tfrac13`],["\\Z","2",0,R`\tfrac12`]].forEach(function(p){
  var q=R`(${p[0]},+,*),\ a*b=${p[1]==='-1'?'-':p[1]}ab`;
  if(p[2]) S('R',q,[0],R`$*$ is associative and distributive, and $${p[3]}$ is the identity: $a*${p[3]}=a$. Isomorphic to the usual ring via $x\mapsto${p[1]==='-1'?'-':p[1]}x$.`,R`$*$ ist assoziativ und distributiv, und $${p[3]}$ ist das Einselement: $a*${p[3]}=a$. Isomorph zum üblichen Ring via $x\mapsto${p[1]==='-1'?'-':p[1]}x$.`);
  else S('R',q,[4],R`Associative and distributive, but the identity would have to be $${p[3]}\notin\Z$.`,R`Assoziativ und distributiv, aber das Einselement müsste $${p[3]}\notin\Z$ sein.`);
});
[[2,R`a\oplus b=a+b-2,\ a\odot b=ab-2a-2b+6`],[-1,R`a\oplus b=a+b+1,\ a\odot b=ab+a+b`],[3,R`a\oplus b=a+b-3,\ a\odot b=ab-3a-3b+12`]].forEach(function(p){
  var k=p[0];
  S('R',R`(\Z,\oplus,\odot),\ ${p[1]}`,[0],R`$\varphi(a)=a${k>0?'-':'+'}${Math.abs(k)}$ satisfies $\varphi(a\oplus b)=\varphi(a)+\varphi(b)$ and $\varphi(a\odot b)=\varphi(a)\varphi(b)$: this is $\Z$ in disguise, with zero $${k}$ and one $${k+1}$.`,R`$\varphi(a)=a${k>0?'-':'+'}${Math.abs(k)}$ erfüllt $\varphi(a\oplus b)=\varphi(a)+\varphi(b)$ und $\varphi(a\odot b)=\varphi(a)\varphi(b)$: verkleidetes $\Z$, mit Null $${k}$ und Eins $${k+1}$.`);
});
[[R`(\{\begin{pmatrix}a&b\\0&a\end{pmatrix}\},+,\cdot)`,[0],R`Closed: $\begin{pmatrix}a&b\\0&a\end{pmatrix}\begin{pmatrix}c&d\\0&c\end{pmatrix}=\begin{pmatrix}ac&ad+bc\\0&ac\end{pmatrix}$, and $I$ is in it (the dual numbers).`,R`Abgeschlossen: $\begin{pmatrix}a&b\\0&a\end{pmatrix}\begin{pmatrix}c&d\\0&c\end{pmatrix}=\begin{pmatrix}ac&ad+bc\\0&ac\end{pmatrix}$, und $I$ liegt drin (duale Zahlen).`],
 [R`(\{\begin{pmatrix}a&-b\\b&a\end{pmatrix}\},+,\cdot)`,[0],R`This is a copy of $\C$ inside $M_2(\R)$: closed, commutative, contains $I$.`,R`Eine Kopie von $\C$ in $M_2(\R)$: abgeschlossen, kommutativ, enthält $I$.`],
 [R`(\{\begin{pmatrix}a&b\\b&a\end{pmatrix}\},+,\cdot)`,[0],R`$\begin{pmatrix}a&b\\b&a\end{pmatrix}\begin{pmatrix}c&d\\d&c\end{pmatrix}=\begin{pmatrix}ac+bd&ad+bc\\ad+bc&ac+bd\end{pmatrix}$: closed, and $I$ is in it.`,R`$\begin{pmatrix}a&b\\b&a\end{pmatrix}\begin{pmatrix}c&d\\d&c\end{pmatrix}=\begin{pmatrix}ac+bd&ad+bc\\ad+bc&ac+bd\end{pmatrix}$: abgeschlossen, und $I$ liegt drin.`],
 [R`(\{\begin{pmatrix}a&0\\0&0\end{pmatrix}\},+,\cdot)`,[0],R`Trick question: $I$ isn't in the set, but $\begin{pmatrix}1&0\\0&0\end{pmatrix}$ acts as identity on it. It's a ring (isomorphic to $\R$), just not a unital subring of $M_2(\R)$.`,R`Fangfrage: $I$ liegt nicht drin, aber $\begin{pmatrix}1&0\\0&0\end{pmatrix}$ wirkt darauf als Eins. Ein Ring (isomorph zu $\R$), nur kein unitärer Unterring von $M_2(\R)$.`],
 [R`(\{\begin{pmatrix}a&b\\0&0\end{pmatrix}\},+,\cdot)`,[4],R`Closed, but no identity: $\begin{pmatrix}a&b\\0&0\end{pmatrix}\begin{pmatrix}e&f\\0&0\end{pmatrix}=\begin{pmatrix}ae&af\\0&0\end{pmatrix}$ can't return $b$ for all $a,b$.`,R`Abgeschlossen, aber ohne Eins: $\begin{pmatrix}a&b\\0&0\end{pmatrix}\begin{pmatrix}e&f\\0&0\end{pmatrix}=\begin{pmatrix}ae&af\\0&0\end{pmatrix}$ liefert nicht für alle $a,b$ wieder $b$.`],
 [R`(\{\begin{pmatrix}a&b\\c&0\end{pmatrix}\},+,\cdot)`,[2],R`$\begin{pmatrix}0&1\\1&0\end{pmatrix}^2=I$, whose lower right entry is $1\neq0$.`,R`$\begin{pmatrix}0&1\\1&0\end{pmatrix}^2=I$, mit Eintrag $1\neq0$ unten rechts.`],
 [R`(\{A\in M_2(\R):A=A^T\},+,\cdot)`,[2],R`$\begin{pmatrix}1&0\\0&2\end{pmatrix}\begin{pmatrix}0&1\\1&0\end{pmatrix}=\begin{pmatrix}0&1\\2&0\end{pmatrix}$ is not symmetric.`,R`$\begin{pmatrix}1&0\\0&2\end{pmatrix}\begin{pmatrix}0&1\\1&0\end{pmatrix}=\begin{pmatrix}0&1\\2&0\end{pmatrix}$ ist nicht symmetrisch.`],
 [R`(\{A\in M_2(\R):\operatorname{tr}A=0\},+,\cdot)`,[2,4],R`$\begin{pmatrix}1&0\\0&-1\end{pmatrix}^2=I$ has trace $2$. And $I$ itself isn't in the set.`,R`$\begin{pmatrix}1&0\\0&-1\end{pmatrix}^2=I$ hat Spur $2$. Und $I$ selbst liegt nicht drin.`],
 [[R`(\{\text{diagonal }2\times2\text{ matrices}\},+,\cdot)`,R`(\{\text{Diagonalmatrizen in }M_2(\R)\},+,\cdot)`],[0],R`Isomorphic to $\R\times\R$ via the diagonal entries.`,R`Über die Diagonaleinträge isomorph zu $\R\times\R$.`],
 [R`(M_2(\Z),+,\cdot)`,[0],R`Integer matrices are closed under $+$ and $\cdot$, and $I\in M_2(\Z)$.`,R`Ganzzahlige Matrizen sind abgeschlossen unter $+$ und $\cdot$, und $I\in M_2(\Z)$.`],
 [R`(M_2(2\Z),+,\cdot)`,[4],R`Closed, but $I$ has odd entries, and no matrix with even entries can act as identity.`,R`Abgeschlossen, aber $I$ hat ungerade Einträge, und keine Matrix mit geraden Einträgen kann als Eins wirken.`],
 [R`(\{\begin{pmatrix}0&b\\0&0\end{pmatrix}\},+,\cdot)`,[4],R`All products are $0$, so there is no $1$.`,R`Alle Produkte sind $0$, also gibt es keine $1$.`],
 [R`(M_3(\R),+,\cdot)`,[0],R`A full matrix ring: non-commutative ring with $1=I$.`,R`Ein voller Matrizenring: nichtkommutativ mit $1=I$.`],
 [R`(M_2(\F_2),+,\cdot)`,[0],R`Matrices over any ring form a ring; this one has $16$ elements.`,R`Matrizen über einem Ring bilden einen Ring; dieser hat $16$ Elemente.`]
].forEach(function(p){S('R',p[0],p[1],p[2],p[3]);});
[[R`(C([0,1]),+,\cdot)`,[0],R`Sums and products of continuous functions are continuous; $1$ is the constant function.`,R`Summen und Produkte stetiger Funktionen sind stetig; $1$ ist die konstante Funktion.`],
 [R`(\{f\in C(\R):f(0)=0\},+,\cdot)`,[4],R`Closed, but the only candidate for $1$ is the constant function $1$, and $1(0)\neq0$. It's an ideal, not a ring with $1$.`,R`Abgeschlossen, aber der einzige Kandidat für $1$ ist die konstante Funktion $1$, und $1(0)\neq0$. Ein Ideal, kein Ring mit $1$.`],
 [R`(\{f\in C(\R):f(0)=1\},+,\cdot)`,[1],R`$(f+g)(0)=2\neq1$, and the zero function is missing.`,R`$(f+g)(0)=2\neq1$, und die Nullfunktion fehlt.`],
 [R`(\{f\in\R[x]:f(0)=0\},+,\cdot)`,[4],R`The ideal $(x)$: closed, but $1\notin(x)$ and nothing else can act as $1$.`,R`Das Ideal $(x)$: abgeschlossen, aber $1\notin(x)$, und nichts anderes kann als $1$ wirken.`],
 [R`(C^1(\R),+,\cdot)`,[0],R`By the product rule, products of differentiable functions are differentiable; constants are too.`,R`Nach der Produktregel sind Produkte differenzierbarer Funktionen differenzierbar; Konstanten auch.`],
 [[R`(\{\text{bounded }f:\R\to\R\},+,\cdot)`,R`(\{\text{beschränkte }f:\R\to\R\},+,\cdot)`],[0],R`Sums and products of bounded functions are bounded; $1$ is bounded.`,R`Summen und Produkte beschränkter Funktionen sind beschränkt; $1$ ist beschränkt.`],
 [[R`(\{\text{even }f:\R\to\R\},+,\cdot)`,R`(\{\text{gerade }f:\R\to\R\},+,\cdot)`],[0],R`even $+$ even and even $\cdot$ even are even, and the constant $1$ is even.`,R`gerade $+$ gerade und gerade $\cdot$ gerade sind gerade, und die Konstante $1$ ist gerade.`],
 [[R`(\{\text{odd }f:\R\to\R\},+,\cdot)`,R`(\{\text{ungerade }f:\R\to\R\},+,\cdot)`],[2,4],R`odd $\cdot$ odd is even (e.g. $x\cdot x=x^2$), and the constant $1$ isn't odd.`,R`ungerade $\cdot$ ungerade ist gerade (etwa $x\cdot x=x^2$), und die Konstante $1$ ist nicht ungerade.`],
 [[R`(\{1\text{-periodic }f:\R\to\R\},+,\cdot)`,R`(\{1\text{-periodische }f:\R\to\R\},+,\cdot)`],[0],R`If $f,g$ have period $1$, so do $f+g$ and $fg$; constants are periodic.`,R`Haben $f,g$ Periode $1$, dann auch $f+g$ und $fg$; Konstanten sind periodisch.`],
 [R`(\{f\in C([0,1]):f(\tfrac12)=0\},+,\cdot)`,[4],R`Closed, but the constant $1$ isn't in it, and no $e$ with $e(\frac12)=0$ can satisfy $ef=f$ for all $f$ in the set (the identity of $C([0,1])$ is unique).`,R`Abgeschlossen, aber die Konstante $1$ liegt nicht drin, und kein $e$ mit $e(\frac12)=0$ kann $ef=f$ für alle $f$ der Menge erfüllen.`]
].forEach(function(p){S('R',p[0],p[1],p[2],p[3]);});
[[R`(\Z/2\Z\times\Z/3\Z,+,\cdot)`,[0],R`A product of rings, componentwise; isomorphic to $\Z/6\Z$.`,R`Ein Produkt von Ringen, komponentenweise; isomorph zu $\Z/6\Z$.`],
 [R`(\Z[x]/(x^2+1),+,\cdot)`,[0],R`A quotient ring; isomorphic to $\Z[i]$.`,R`Ein Quotientenring; isomorph zu $\Z[i]$.`],
 [R`(\Z[\tfrac12],+,\cdot)`,[0],R`Fractions $\frac a{2^k}$ are closed under $+$ and $\cdot$ and contain $1$.`,R`Brüche $\frac a{2^k}$ sind abgeschlossen unter $+$ und $\cdot$ und enthalten $1$.`],
 [R`(\R^3,+,\cdot)`,[0],R`With componentwise multiplication this is the product ring $\R\times\R\times\R$, $1=(1,1,1)$.`,R`Mit komponentenweiser Multiplikation der Produktring $\R\times\R\times\R$, $1=(1,1,1)$.`,[R`componentwise`,R`komponentenweise`]],
 [R`(\Z/5\Z\setminus\{0\},+,\cdot)`,[1],R`$1+4=0$ is not in the set, so $+$ isn't closed.`,R`$1+4=0$ liegt nicht in der Menge, also ist $+$ nicht abgeschlossen.`],
 [R`(\R,+,*),\ a*b=ab+a`,[3,4,5],R`$(a*b)*c=abc+ac+ab+a$, but $a*(b*c)=abc+ab+a$. $a*(b+c)=ab+ac+a\neq a*b+a*c$. And $e*a=e(a+1)=a$ for all $a$ is impossible.`,R`$(a*b)*c=abc+ac+ab+a$, aber $a*(b*c)=abc+ab+a$. $a*(b+c)=ab+ac+a\neq a*b+a*c$. Und $e*a=e(a+1)=a$ für alle $a$ ist unmöglich.`],
 [R`(\R,+,*),\ a*b=ab+1`,[3,4,5],R`$(a*b)*c=abc+c+1\neq abc+a+1=a*(b*c)$. $a*(b+c)=ab+ac+1\neq ab+ac+2$. And $ae+1=a$ fails for $a=0$.`,R`$(a*b)*c=abc+c+1\neq abc+a+1=a*(b*c)$. $a*(b+c)=ab+ac+1\neq ab+ac+2$. Und $ae+1=a$ scheitert für $a=0$.`],
 [R`(\R^2,+,*),\ (a,b)*(c,d)=(ac,\,ad+bc)`,[0],R`This is $\R[\varepsilon]/(\varepsilon^2)$, the dual numbers, with $1=(1,0)$.`,R`Das ist $\R[\varepsilon]/(\varepsilon^2)$, die dualen Zahlen, mit $1=(1,0)$.`],
 [R`(\R^2,+,*),\ (a,b)*(c,d)=(ad,\,bc)`,[3,4],R`$((a,b)*(c,d))*(e,f)=(adf,bce)$, but $(a,b)*((c,d)*(e,f))=(ade,bcf)$. An identity would need $(e,f)*(a,b)=(eb,fa)=(a,b)$ for all $a,b$: impossible.`,R`$((a,b)*(c,d))*(e,f)=(adf,bce)$, aber $(a,b)*((c,d)*(e,f))=(ade,bcf)$. Eine Eins bräuchte $(e,f)*(a,b)=(eb,fa)=(a,b)$ für alle $a,b$: unmöglich.`],
 [R`(\Q,+,*),\ a*b=a+b+ab`,[5],R`$*$ is associative with neutral element $0$, but $a*(b+c)=a+b+c+ab+ac$ while $a*b+a*c=2a+b+c+ab+ac$.`,R`$*$ ist assoziativ mit neutralem Element $0$, aber $a*(b+c)=a+b+c+ab+ac$, während $a*b+a*c=2a+b+c+ab+ac$.`]
].forEach(function(p){S('R',p[0],p[1],p[2],p[3]||null,p[4]);});

[[R`(\Q[x],+,\cdot)`,[0],R`Polynomials over a field form a commutative ring with $1$.`,R`Polynome über einem Körper bilden einen kommutativen Ring mit $1$.`],
 [R`(\{f\in\R[x]:f'(0)=0\},+,\cdot)`,[0],R`$(fg)'(0)=f'(0)g(0)+f(0)g'(0)=0$, so it is closed under $\cdot$, and the constant $1$ satisfies $1'=0$. A subring of $\R[x]$.`,R`$(fg)'(0)=f'(0)g(0)+f(0)g'(0)=0$, also abgeschlossen unter $\cdot$, und die Konstante $1$ erfüllt $1'=0$. Ein Unterring von $\R[x]$.`],
 [R`(\{f\in\R[x]:f(1)=f(2)\},+,\cdot)`,[0],R`$(fg)(1)=f(1)g(1)=f(2)g(2)=(fg)(2)$; same for sums, and $1$ is in it.`,R`$(fg)(1)=f(1)g(1)=f(2)g(2)=(fg)(2)$; ebenso für Summen, und $1$ liegt drin.`],
 [R`(\{f\in\R[x]:f(0)=f(1)+1\},+,\cdot)`,[1],R`The zero polynomial isn't in the set, and sums leave it: $(f+g)(0)=(f+g)(1)+2$.`,R`Das Nullpolynom liegt nicht drin, und Summen fallen heraus: $(f+g)(0)=(f+g)(1)+2$.`],
 [R`(\{a+bi:a,b\in2\Z\},+,\cdot)`,[4],R`This is $2\Z[i]$: closed under $+$ and $\cdot$, but $1\notin2\Z[i]$, and nothing else can act as $1$.`,R`Das ist $2\Z[i]$: abgeschlossen unter $+$ und $\cdot$, aber $1\notin2\Z[i]$, und nichts anderes kann als $1$ wirken.`],
 [R`(\{a+bi:a,b\in\Q\},+,\cdot)`,[0],R`This is the field $\Q(i)$, in particular a ring.`,R`Das ist der Körper $\Q(i)$, insbesondere ein Ring.`],
 [R`([0,\infty),+,\cdot)`,[1],R`Closed under $+$ and $\cdot$, but $1$ has no additive inverse in $[0,\infty)$.`,R`Abgeschlossen unter $+$ und $\cdot$, aber $1$ hat in $[0,\infty)$ kein additives Inverses.`],
 [R`(\F_2[x]/(x^2+x+1),+,\cdot)`,[0],R`A quotient ring; since $x^2+x+1$ is irreducible over $\F_2$, it is even the field $\F_4$.`,R`Ein Quotientenring; da $x^2+x+1$ über $\F_2$ irreduzibel ist, sogar der Körper $\F_4$.`]
].forEach(function(p){S('R',p[0],p[1],p[2],p[3]);});
})();
