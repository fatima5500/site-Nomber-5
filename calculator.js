const d=document.getElementById('display');
let angleMode='DEG';
let mem=0,lastAns=null;
function setAngleMode(m){angleMode=m;const b=document.getElementById('angle-mode');if(b)b.textContent=m;const dg=document.getElementById('degBtn'),rg=document.getElementById('radBtn');if(dg)dg.classList.toggle('on',m==='DEG');if(rg)rg.classList.toggle('on',m==='RAD');}
function sinD(x){return Math.sin(Math.PI/180*x)}
function cosD(x){return Math.cos(Math.PI/180*x)}
function tanD(x){return Math.tan(Math.PI/180*x)}
function asinD(x){return 180/Math.PI*Math.asin(x)}
function acosD(x){return 180/Math.PI*Math.acos(x)}
function atanD(x){return 180/Math.PI*Math.atan(x)}
function ins(v){d.value+=v}
function clr(){d.value=''}
function back(){d.value=d.value.slice(0,-1)}
function neg(){const v=d.value.trim();if(v===''){d.value='-';return}if(/^-?\d*\.?\d+$/.test(v)){d.value=String(-parseFloat(v));return}d.value='-('+v+')'}
function memAdd(){const v=parseFloat(d.value);if(!isNaN(v))mem+=v;}
function memSub(){const v=parseFloat(d.value);if(!isNaN(v))mem-=v;}
function memRec(){d.value+=String(Math.round(mem*1e10)/1e10);}
function memClr(){mem=0;}
function ans(){if(lastAns!==null)d.value+=String(lastAns);}
function fact(n){if(n<0||!Number.isInteger(n))throw new Error('bad');let r=1;for(let i=2;i<=n;i++)r*=i;return r}
function evaluate(e){
  if(!/^[0-9+\-*/().^%!a-zπe ]+$/.test(e)) throw new Error('bad');
  e=e.replace(/π/g,'Math.PI').replace(/(?<![a-z])e(?![a-z])/g,'Math.E');
  // Inverse trig first, via placeholders: a plain sin(/tan( pass would
  // otherwise match inside Math.asin(/Math.atan( and corrupt them.
  e=e.replace(/asin\(/g,'@@ASIN@@(').replace(/acos\(/g,'@@ACOS@@(').replace(/atan\(/g,'@@ATAN@@(');
  if(angleMode==='RAD'){
    e=e.replace(/sin\(/g,'Math.sin(').replace(/cos\(/g,'Math.cos(').replace(/tan\(/g,'Math.tan(');
    e=e.replace(/@@ASIN@@\(/g,'Math.asin(').replace(/@@ACOS@@\(/g,'Math.acos(').replace(/@@ATAN@@\(/g,'Math.atan(');
  }else{
    e=e.replace(/sin\(/g,'sinD(').replace(/cos\(/g,'cosD(').replace(/tan\(/g,'tanD(');
    e=e.replace(/@@ASIN@@\(/g,'asinD(').replace(/@@ACOS@@\(/g,'acosD(').replace(/@@ATAN@@\(/g,'atanD(');
  }
  e=e.replace(/log\(/g,'Math.log10(').replace(/ln\(/g,'Math.log(').replace(/√\(/g,'Math.sqrt(').replace(/sqrt\(/g,'Math.sqrt(');
  e=e.replace(/cbrt\(/g,'Math.cbrt(').replace(/exp\(/g,'Math.exp(').replace(/abs\(/g,'Math.abs(').replace(/log2\(/g,'Math.log2(');
  e=e.replace(/(\d+(?:\.\d+)?)!/g,'fact($1)').replace(/\^/g,'**');
  // % as percent: 50% -> 0.5 when it follows a number and is not part of an operator chain
  e=e.replace(/(\d+(?:\.\d+)?)%/g,'($1/100)');
  const r=Function('fact','Math','sinD','cosD','tanD','asinD','acosD','atanD','return ('+e+')')(fact,Math,sinD,cosD,tanD,asinD,acosD,atanD);
  if(!isFinite(r)) throw new Error('bad');
  return r;
}
function calc(){
  const expr=d.value.trim();
  try{
    const r=evaluate(expr);
    const out=String(Math.round(r*1e10)/1e10);
    lastAns=parseFloat(out);
    const h=document.getElementById('history');
    if(h){const row=document.createElement('div');row.textContent=expr+' = '+out;h.prepend(row);while(h.children.length>10)h.removeChild(h.lastChild);}
    try{let H=JSON.parse(localStorage.getItem('qchist')||'[]');H.unshift(expr+' = '+out);H=H.slice(0,10);localStorage.setItem('qchist',JSON.stringify(H));}catch(e2){}
    d.value=out;
    const l=document.getElementById('live');if(l)l.textContent='';
  }catch(err){d.value='Error'}
}
function live(){
  const l=document.getElementById('live');if(!l)return;
  const e=d.value.trim();if(!e){l.textContent='';return;}
  try{const r=evaluate(e);l.textContent='= '+String(Math.round(r*1e10)/1e10);}catch(err){l.textContent='';}
}
function tryEx(v){d.value=v;calc();}
try{const H=JSON.parse(localStorage.getItem('qchist')||'[]');const h=document.getElementById('history');if(h){H.forEach(function(t){const row=document.createElement('div');row.textContent=t;h.appendChild(row);});}}catch(e){}
