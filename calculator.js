const d=document.getElementById('display');
function ins(v){d.value+=v}
function clr(){d.value=''}
function back(){d.value=d.value.slice(0,-1)}
function fact(n){if(n<0||!Number.isInteger(n))throw new Error('bad');let r=1;for(let i=2;i<=n;i++)r*=i;return r}
function calc(){
  let e=d.value.trim();
  try{
    if(!/^[0-9+\-*/().^%!a-zπe ]+$/.test(e)) throw new Error('bad');
    e=e.replace(/π/g,'Math.PI').replace(/(?<![a-z])e(?![a-z])/g,'Math.E');
    e=e.replace(/sin\(/g,'Math.sin(Math.PI/180*').replace(/cos\(/g,'Math.cos(Math.PI/180*').replace(/tan\(/g,'Math.tan(Math.PI/180*');
    e=e.replace(/log\(/g,'Math.log10(').replace(/ln\(/g,'Math.log(').replace(/√\(/g,'Math.sqrt(').replace(/sqrt\(/g,'Math.sqrt(');
    e=e.replace(/(\d+(?:\.\d+)?)!/g,'fact($1)').replace(/\^/g,'**');
    // % as percent: 50% -> 0.5 when it follows a number and is not part of an operator chain
    e=e.replace(/(\d+(?:\.\d+)?)%/g,'($1/100)');
    const r=Function('fact','Math','return ('+e+')')(fact,Math);
    if(!isFinite(r)) throw new Error('bad');
    const out=String(Math.round(r*1e10)/1e10);
    const h=document.getElementById('history');
    if(h){const row=document.createElement('div');row.textContent=d.value+' = '+out;h.prepend(row);while(h.children.length>5)h.removeChild(h.lastChild);}
    d.value=out;
  }catch(err){d.value='Error'}
}
function tryEx(v){d.value=v;calc();}
