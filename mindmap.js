/* ========== MINDMAP INTERACTIVE ========== */
function initMindMap(config){
var container=document.getElementById(config.containerId);
if(!container)return;
var svg=container.querySelector('.mm-svg');
if(!svg)return;
var g=svg.querySelector('g');
if(!g){g=document.createElementNS('http://www.w3.org/2000/svg','g');svg.appendChild(g)}

var colors=['#bbf7d0','#bae6fd','#e9d5ff','#fbcfe8','#fed7aa','#dcfce7','#c7d2fe','#ddd6fe'];
var s=1,tx=0,ty=0,isDown=false,sx=0,sy=0;
function apply(){g.setAttribute('transform','translate('+tx+','+ty+') scale('+s+')')}
apply();

container.addEventListener('mousedown',function(e){isDown=true;sx=e.clientX;sy=e.clientY;container.classList.add('grabbing')});
window.addEventListener('mouseup',function(){isDown=false;container.classList.remove('grabbing')});
window.addEventListener('mousemove',function(e){if(!isDown)return;tx+=e.clientX-sx;ty+=e.clientY-sy;sx=e.clientX;sy=e.clientY;apply()});
container.addEventListener('wheel',function(e){e.preventDefault();var r=svg.getBoundingClientRect();var cx=e.clientX-r.left,cy=e.clientY-r.top;
var ds=e.deltaY>0?0.9:1.1;var ns=Math.min(Math.max(s*ds,0.3),4);
tx=cx-(cx-tx)*(ns/s);ty=cy-(cy-ty)*(ns/s);s=ns;apply()});

var tch={},pinchD=null;
container.addEventListener('touchstart',function(e){if(e.touches.length===1){var t=e.touches[0];tch={id:t.identifier,sx:t.clientX,sy:t.clientY,tx:tx,ty:ty}}else if(e.touches.length===2){var a=e.touches[0],b=e.touches[1];pinchD=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);tch.ps=s}},false);
container.addEventListener('touchmove',function(e){e.preventDefault();if(e.touches.length===1&&tch.id===e.touches[0].identifier){var t=e.touches[0];tx=tch.tx+(t.clientX-tch.sx);ty=tch.ty+(t.clientY-tch.sy);apply()}else if(e.touches.length===2&&pinchD){var a=e.touches[0],b=e.touches[1];var d=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);var ns=Math.min(Math.max(tch.ps*(d/pinchD),0.3),4);
var cx=(a.clientX+b.clientX)/2,cy=(a.clientY+b.clientY)/2;var r=svg.getBoundingClientRect();cx-=r.left;cy-=r.top;tx=cx-(cx-tx)*(ns/s);ty=cy-(cy-ty)*(ns/s);s=ns;apply()}},false);
container.addEventListener('touchend',function(){pinchD=null;tch={}});

var cx=600,cy=270,rx=140,ry=100,angOff=-Math.PI/2;
var nodes=config.nodes||[],links=config.links||[];
function getPos(i,n){var a=angOff+(2*Math.PI*i)/n;return{cx:cx+Math.cos(a)*rx,cy:cy+Math.sin(a)*ry}}

var rootG=document.createElementNS('http://www.w3.org/2000/svg','g');rootG.classList.add('mm-root');
var rootRect=document.createElementNS('http://www.w3.org/2000/svg','rect');
var rw=Math.max(config.root.length*9,140),rh=40;
rootRect.setAttribute('x',cx-rw/2);rootRect.setAttribute('y',cy-rh/2);rootRect.setAttribute('width',rw);rootRect.setAttribute('height',rh);
rootRect.setAttribute('rx',10);rootRect.classList.add('mm-node-rect');
var rootText=document.createElementNS('http://www.w3.org/2000/svg','text');
rootText.setAttribute('x',cx);rootText.setAttribute('y',cy+5);rootText.setAttribute('text-anchor','middle');rootText.setAttribute('font-size','14');rootText.textContent=config.root;
rootG.appendChild(rootRect);rootG.appendChild(rootText);g.appendChild(rootG);

var childCount=nodes.length;
nodes.forEach(function(nd,i){
var pos=getPos(i,childCount);
var el=document.createElementNS('http://www.w3.org/2000/svg','g');el.classList.add('mm-node');el.dataset.idx=i;
var pw=Math.max(nd.label.length*7+24,110),ph=34;
var rect=document.createElementNS('http://www.w3.org/2000/svg','rect');
rect.setAttribute('x',pos.cx-pw/2);rect.setAttribute('y',pos.cy-ph/2);rect.setAttribute('width',pw);rect.setAttribute('height',ph);
rect.setAttribute('rx',8);rect.setAttribute('fill',colors[i%colors.length]);rect.classList.add('mm-node-rect');
var txt=document.createElementNS('http://www.w3.org/2000/svg','text');
txt.setAttribute('x',pos.cx);txt.setAttribute('y',pos.cy+4);txt.setAttribute('text-anchor','middle');txt.setAttribute('font-size','11');txt.textContent=nd.label;

var line=document.createElementNS('http://www.w3.org/2000/svg','line');
line.setAttribute('x1',cx);line.setAttribute('y1',cy);line.setAttribute('x2',pos.cx);line.setAttribute('y2',pos.cy);
line.classList.add('mm-edge');g.insertBefore(line,rootG);

el.appendChild(rect);el.appendChild(txt);g.appendChild(el);

el.addEventListener('click',function(e){e.stopPropagation();
var active=container.querySelector('.mm-node.active');if(active)active.classList.remove('active');
el.classList.add('active');showDetail(nd.label,nd.desc,nd.sub||[])});
});

function showDetail(title,desc,subs){
var d=document.getElementById('mm-detail');
var h=d.querySelector('h4'),p=d.querySelector('p');
h.textContent=title||'';
var txt=(desc||'')+(subs.length?(' \n\nDetalles: '+subs.join('; ')+'.'):'');
p.textContent=txt;d.classList.add('show');
}
document.getElementById('mm-detail-close').addEventListener('click',function(){
document.getElementById('mm-detail').classList.remove('show');
var a=container.querySelector('.mm-node.active');if(a)a.classList.remove('active');
});
container.addEventListener('click',function(e){if(e.target===container||e.target===svg){document.getElementById('mm-detail').classList.remove('show');var a=container.querySelector('.mm-node.active');if(a)a.classList.remove('active');}});

var zx=0.85;
document.getElementById('mm-zoom-in').addEventListener('click',function(){s=Math.min(s*1.2,4);apply()});
document.getElementById('mm-zoom-out').addEventListener('click',function(){s=Math.max(s/1.2,0.3);apply()});
document.getElementById('mm-reset').addEventListener('click',function(){s=zx;tx=0;ty=0;apply()});
}
