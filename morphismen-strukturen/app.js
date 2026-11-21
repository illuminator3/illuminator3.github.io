(function(){
var PER_CAT = 100;
var MACROS = {"\\Z":"\\mathbb{Z}","\\Q":"\\mathbb{Q}","\\R":"\\mathbb{R}","\\C":"\\mathbb{C}","\\N":"\\mathbb{N}","\\F":"\\mathbb{F}"};

/* ---------- assemble banks ---------- */
function toObj(a){return {c:a[0], q:a[1], a:a[2], en:a[3], de:a[4], qn:a[5]||null};}
function key(o){return (Array.isArray(o.q)?o.q[0]:o.q).replace(/\s+/g,'')+'|'+(o.qn?o.qn[0]:'');}
function seeded(arr,seed){var x=seed*9301+49297;for(var i=arr.length-1;i>0;i--){x=(x*9301+49297)%233280;var j=Math.floor(x/233280*(i+1));var t=arr[i];arr[i]=arr[j];arr[j]=t;}return arr;}
function build(hand, gen, cats){
  var out={};
  cats.forEach(function(c){
    var seen={}, list=[];
    hand.filter(function(x){return x[0]===c;}).concat(seeded(gen[c].slice(),c.charCodeAt(0))).map(toObj).forEach(function(o){
      var k=key(o); if(seen[k]) return; seen[k]=1; list.push(o);
    });
    out[c]=list.slice(0,PER_CAT);
  });
  return out;
}
var BANK = {
  maps: build(HAND_MAPS, GEN_MAPS, ['G','R','V']),
  structs: build(HAND_STRUCTS, GEN_STRUCTS, ['G','R'])
};
window.__BANK = BANK;

/* ---------- strings ---------- */
var T = {
 en:{
  title:"Morphisms & structures",
  sub:"Practice problems for linear algebra & algebra",
  maps:"Maps", structs:"Groups & rings",
  cat:{G:"Groups",R:"Rings",V:"Vector spaces"},
  problem:"Problem",
  ask:{maps:{G:R`Is $\varphi$ a group homomorphism? An isomorphism?`,R:R`Is $\varphi$ a ring homomorphism? An isomorphism?`,V:R`Is $\varphi$ linear? An isomorphism?`},
       structs:{G:"Is this a group? If not, what goes wrong?",R:"Is this a ring (with 1)? If not, what goes wrong?"}},
  opts:{maps:{G:["Not a homomorphism","Homomorphism, but not an isomorphism","Isomorphism"],
              R:["Not a ring homomorphism","Ring homomorphism, but not an isomorphism","Ring isomorphism"],
              V:["Not linear","Linear, but not an isomorphism","Linear isomorphism"]},
        structs:{G:["Group","Not closed","Not associative","No neutral element","Not every element has an inverse"],
                 R:["Ring",R`$(R,+)$ is not an abelian group`,R`Not closed under $\cdot$`,R`$\cdot$ is not associative`,"No multiplicative identity 1","A distributive law fails"]}},
  solution:"Solution.", right:"Correct.", wrong:"Wrong.", answer:"Correct answer",
  next:"Next", skip:"skip", score:"correct", streak:"streak", left:"left",
  keys:"Keys: 1–{n} or a–{l} to answer, Enter for next.",
  others:"Click the other options to see why they're wrong.",
  done:"Done", again:"Start over", of:"of",
  conv:{maps:R`Conventions: rings have a $1$, and ring homomorphisms must send $1\mapsto1$. Vector spaces are real unless stated otherwise. A map that isn't well-defined counts as “not a homomorphism”.`,
        structs:R`Conventions: a ring is a ring with $1$: $(R,+)$ abelian group, $\cdot$ closed, associative, with identity $1$, both distributive laws. Commutativity is not required. If several things fail, each of them counts as correct.`},
  note:{
   homNo:{G:"It does preserve the operation (see the solution), so it is a homomorphism.",R:"It is a ring homomorphism (see the solution).",V:"It is linear (see the solution)."},
   notHom:{G:"It isn't a homomorphism in the first place.",R:"It isn't a ring homomorphism in the first place.",V:"It isn't even linear."},
   isIso:"It is also bijective, so it is an isomorphism.",
   notIso:{G:"It is a homomorphism, but not bijective.",R:"It is a ring homomorphism, but not bijective.",V:"Linear, yes, but not bijective."},
   isG:"That holds here; it actually is a group.", isR:"That holds here; it actually is a ring.",
   notG:"It isn't a group. What fails: ", notR:"It isn't a ring. What fails: ",
   holds:"That one actually holds. What fails: ", correct:"This one is correct too."
  }
 },
 de:{
  title:"Morphismen & Strukturen",
  sub:"Übungsaufgaben zu Linearer Algebra & Algebra",
  maps:"Abbildungen", structs:"Gruppen & Ringe",
  cat:{G:"Gruppen",R:"Ringe",V:"Vektorräume"},
  problem:"Aufgabe",
  ask:{maps:{G:R`Ist $\varphi$ ein Gruppenhomomorphismus? Ein Isomorphismus?`,R:R`Ist $\varphi$ ein Ringhomomorphismus? Ein Isomorphismus?`,V:R`Ist $\varphi$ linear? Ein Isomorphismus?`},
       structs:{G:"Ist das eine Gruppe? Falls nicht, was geht schief?",R:"Ist das ein Ring (mit 1)? Falls nicht, was geht schief?"}},
  opts:{maps:{G:["Kein Homomorphismus","Homomorphismus, aber kein Isomorphismus","Isomorphismus"],
              R:["Kein Ringhomomorphismus","Ringhomomorphismus, aber kein Isomorphismus","Ringisomorphismus"],
              V:["Nicht linear","Linear, aber kein Isomorphismus","Linearer Isomorphismus"]},
        structs:{G:["Gruppe","Nicht abgeschlossen","Nicht assoziativ","Kein neutrales Element","Nicht jedes Element hat ein Inverses"],
                 R:["Ring",R`$(R,+)$ ist keine abelsche Gruppe`,R`Nicht abgeschlossen unter $\cdot$`,R`$\cdot$ ist nicht assoziativ`,"Kein Einselement","Ein Distributivgesetz ist verletzt"]}},
  solution:"Lösung.", right:"Richtig.", wrong:"Falsch.", answer:"Richtige Antwort",
  next:"Weiter", skip:"überspringen", score:"richtig", streak:"Serie", left:"übrig",
  keys:"Tasten: 1–{n} oder a–{l} zum Antworten, Enter für weiter.",
  others:"Klick auf die anderen Antworten, um zu sehen, warum sie falsch sind.",
  done:"Fertig", again:"Von vorn", of:"von",
  conv:{maps:R`Konventionen: Ringe haben eine $1$, und Ringhomomorphismen erfüllen $1\mapsto1$. Vektorräume sind reell, falls nicht anders angegeben. Eine nicht wohldefinierte Abbildung zählt als „kein Homomorphismus“.`,
        structs:R`Konventionen: Ring heißt Ring mit $1$: $(R,+)$ abelsche Gruppe, $\cdot$ abgeschlossen, assoziativ, mit Einselement, beide Distributivgesetze. Kommutativität wird nicht verlangt. Scheitert mehreres, zählt jede dieser Antworten als richtig.`},
  note:{
   homNo:{G:"Doch: Die Verknüpfung bleibt erhalten (siehe Lösung), es ist ein Homomorphismus.",R:"Doch: Es ist ein Ringhomomorphismus (siehe Lösung).",V:"Doch: Die Abbildung ist linear (siehe Lösung)."},
   notHom:{G:"Es ist gar kein Homomorphismus.",R:"Es ist gar kein Ringhomomorphismus.",V:"Sie ist nicht einmal linear."},
   isIso:"Sie ist sogar bijektiv, also ein Isomorphismus.",
   notIso:{G:"Homomorphismus ja, aber nicht bijektiv.",R:"Ringhomomorphismus ja, aber nicht bijektiv.",V:"Linear ja, aber nicht bijektiv."},
   isG:"Das gilt hier; es ist tatsächlich eine Gruppe.", isR:"Das gilt hier; es ist tatsächlich ein Ring.",
   notG:"Keine Gruppe. Es scheitert: ", notR:"Kein Ring. Es scheitert: ",
   holds:"Das gilt hier sogar. Es scheitert: ", correct:"Diese Antwort ist ebenfalls richtig."
  }
 }
};

/* ---------- rendering helpers ---------- */
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function tex(s,display){
  try{return katex.renderToString(s,{displayMode:!!display,throwOnError:false,macros:MACROS});}
  catch(e){return '<code>'+esc(s)+'</code>';}
}
function rich(s){
  return String(s).split(/(\$[^$]+\$)/g).map(function(p){
    return (p.length>1&&p[0]==='$'&&p[p.length-1]==='$')?tex(p.slice(1,-1)):esc(p);
  }).join('');
}

/* ---------- state ---------- */
var LETTERS='abcdef';
var st={
  lang:'de', mode:'maps',
  on:{maps:{G:1,R:1,V:1}, structs:{G:1,R:1}},
  deck:[], cur:null, picked:null, inspect:null, n:0,
  right:0, total:0, streak:0
};
try{var L=localStorage.getItem('mq-lang'); if(L==='en'||L==='de') st.lang=L;}catch(e){}
var h=(location.hash||'').slice(1); if(h==='structs') st.mode='structs';

function t(){return T[st.lang];}
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var x=a[i];a[i]=a[j];a[j]=x;}return a;}
function cats(){return st.mode==='maps'?['G','R','V']:['G','R'];}
function opts(q){return t().opts[st.mode][q.c];}
function correct(q){return st.mode==='maps'?[q.a]:q.a;}

function newDeck(){
  var d=[]; cats().forEach(function(c){ if(st.on[st.mode][c]) d=d.concat(BANK[st.mode][c]); });
  st.deck=shuffle(d.slice()); st.right=0; st.total=0; st.streak=0; st.n=0; next();
}
function next(){ st.cur=st.deck.length?st.deck.pop():null; st.picked=null; st.inspect=null; if(st.cur) st.n++; render(); window.scrollTo(0,0); }

function note(q,k){
  var N=t().note, ok=correct(q);
  if(st.mode==='maps'){
    var a=q.a;
    if(k===a) return '';
    if(k===0) return N.homNo[q.c];
    if(a===0) return N.notHom[q.c];
    if(k===1) return N.isIso;
    return N.notIso[q.c];
  }
  var o=opts(q), fails=ok.filter(function(i){return i>0;}).map(function(i){return o[i];}).join('; ');
  if(ok.indexOf(k)>=0) return k===st.picked?'':N.correct;
  if(k===0) return (q.c==='G'?N.notG:N.notR)+fails+'.';
  if(ok[0]===0) return q.c==='G'?N.isG:N.isR;
  return N.holds+fails+'.';
}

/* ---------- render ---------- */
function render(){
  var L=t();
  document.documentElement.lang=st.lang;
  document.title=L.title;
  document.getElementById('title').textContent=L.title;
  ['maps','structs'].forEach(function(m){var b=document.getElementById('m-'+m); b.textContent=L[m]; b.className=st.mode===m?'on':'';});
  ['de','en'].forEach(function(l){document.getElementById('l-'+l).className=st.lang===l?'on':'';});
  // filters
  var f=document.getElementById('filters'); f.innerHTML='';
  cats().forEach(function(c){
    var lab=document.createElement('label'), cb=document.createElement('input');
    cb.type='checkbox'; cb.checked=!!st.on[st.mode][c];
    cb.onchange=function(){
      var on=st.on[st.mode], count=cats().filter(function(x){return on[x];}).length;
      if(!cb.checked&&count===1){cb.checked=true;return;}
      on[c]=cb.checked?1:0; newDeck();
    };
    lab.appendChild(cb); lab.appendChild(document.createTextNode(' '+L.cat[c]+' ('+BANK[st.mode][c].length+')'));
    f.appendChild(lab);
  });
  document.getElementById('stats').innerHTML=
    '<span>'+st.right+'/'+st.total+' '+L.score+'</span><span>'+L.streak+' '+st.streak+'</span><span>'+st.deck.length+' '+L.left+'</span>';
  document.getElementById('conv').innerHTML=rich(L.conv[st.mode]);

  var box=document.getElementById('problem');
  if(!st.cur){
    box.innerHTML='<p class="pnum">'+L.done+'.</p><p class="big">'+st.right+' '+L.of+' '+st.total+'</p><p><button class="btn" id="again">'+L.again+'</button></p>';
    document.getElementById('again').onclick=newDeck; return;
  }
  var q=st.cur, o=opts(q), ok=correct(q);
  var prompt = st.mode==='maps' ? R`\varphi\colon `+q.q : (Array.isArray(q.q)?q.q[st.lang==='en'?0:1]:q.q);
  var html='<p class="pnum"><b>'+L.problem+' '+st.n+'.</b> <span class="tag">'+L.cat[q.c]+'</span></p>';
  html+='<div class="disp">'+tex(prompt,true)+'</div>';
  if(q.qn) html+='<p class="qn">('+rich(q.qn[st.lang==='en'?0:1])+')</p>';
  html+='<p class="ask">'+rich(L.ask[st.mode][q.c])+'</p><ol class="opts">';
  o.forEach(function(text,i){
    var cls='', mark='';
    if(st.picked!==null){
      if(ok.indexOf(i)>=0){cls='good';mark='✓';}
      else if(i===st.picked){cls='bad';mark='✗';}
      if(i===st.inspect) cls+=' insp';
    }
    html+='<li><button data-i="'+i+'" class="'+cls+'"><span class="lt">('+LETTERS[i]+')</span><span class="tx">'+rich(text)+'</span><span class="mk">'+mark+'</span></button></li>';
  });
  html+='</ol>';
  if(st.picked!==null){
    var good=ok.indexOf(st.picked)>=0;
    html+='<div class="fb"><p class="verdict '+(good?'g':'b')+'"><span class="vw">'+(good?L.right:L.wrong)+'</span>';
    if(!good) html+=' '+L.answer+': '+ok.map(function(i){return '('+LETTERS[i]+')';}).join(' / ')+'.';
    var pn=note(q,st.picked); if(pn) html+=' '+rich(pn);
    html+='</p>';
    if(st.inspect!==null&&st.inspect!==st.picked){
      var nn=note(q,st.inspect); if(nn) html+='<p class="insp-note">('+LETTERS[st.inspect]+') '+rich(nn)+'</p>';
    }
    html+='<p class="sol"><i>'+L.solution+'</i> '+rich(q[st.lang])+' <span class="qed">□</span></p>';
    html+='<p class="row"><span></span><button class="btn" id="next">'+L.next+' →</button></p></div>';
  } else {
    html+='<p class="row"><span class="hint">'+L.keys.replace('{n}',o.length).replace('{l}',LETTERS[o.length-1])+'</span><button class="link" id="skip">'+L.skip+'</button></p>';
  }
  box.innerHTML=html;
  box.querySelectorAll('.opts button').forEach(function(b){b.onclick=function(){choose(+b.dataset.i);};});
  var nb=document.getElementById('next'); if(nb) nb.onclick=next;
  var sb=document.getElementById('skip'); if(sb) sb.onclick=function(){st.deck.unshift(st.cur); st.n--; next();};
}

function choose(i){
  if(!st.cur) return;
  if(st.picked===null){
    st.picked=i; st.total++;
    if(correct(st.cur).indexOf(i)>=0){st.right++;st.streak++;} else st.streak=0;
  } else st.inspect=i;
  render();
}

document.addEventListener('keydown',function(e){
  if(e.metaKey||e.ctrlKey||e.altKey||!st.cur) return;
  if(e.target&&e.target.tagName==='INPUT') return;
  var n=opts(st.cur).length, i=-1;
  if(/^[1-9]$/.test(e.key)) i=+e.key-1; else if(LETTERS.indexOf(e.key)>=0) i=LETTERS.indexOf(e.key);
  if(i>=0&&i<n){choose(i);return;}
  if(st.picked!==null&&(e.key==='Enter'||e.key==='ArrowRight')){e.preventDefault();next();}
});
['maps','structs'].forEach(function(m){document.getElementById('m-'+m).onclick=function(){ if(st.mode===m) return; st.mode=m; try{location.hash=m;}catch(e){} newDeck(); };});
['de','en'].forEach(function(l){document.getElementById('l-'+l).onclick=function(){ st.lang=l; try{localStorage.setItem('mq-lang',l);}catch(e){} render(); };});

newDeck();
})();
