// Interactive 3D ball-and-stick molecules for the home hero (CPK colours).
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(pointer: fine)').matches;
if ($("#mol")) {
const cv=$("#mol"),cx=cv.getContext("2d");
const PARA=[[0,1.4,0,"C"],[1.21,.7,0,"C"],[1.21,-.7,0,"C"],[0,-1.4,0,"C"],[-1.21,-.7,0,"C"],[-1.21,.7,0,"C"],
 [0,2.8,0,"O"],[.92,3.35,0,"H"],[0,-2.8,0,"N"],[-.92,-3.3,0,"H"],[1.21,-3.5,0,"C"],[2.42,-2.8,0,"O"],[1.21,-4.9,0,"C"],
 [2.15,1.25,0,"H"],[2.15,-1.25,0,"H"],[-2.15,-1.25,0,"H"],[-2.15,1.25,0,"H"],[2.1,-5.35,.55,"H"],[.32,-5.35,.55,"H"],[1.21,-5.2,-.98,"H"]].map(a=>[a[0]-.3,a[1]+.95,a[2],a[3]]);
const PARAB=[[0,1,2],[1,2,1],[2,3,2],[3,4,1],[4,5,2],[5,0,1],[0,6,1],[6,7,1],[3,8,1],[8,9,1],[8,10,1],[10,11,2],[10,12,1],[1,13,1],[2,14,1],[4,15,1],[5,16,1],[12,17,1],[12,18,1],[12,19,1]];
const MET=[[-2.1,.7,0,"N"],[-3.4,1.45,0,"C"],[-2.1,-.75,0,"C"],[-.85,1.45,0,"C"],[-.85,2.85,0,"N"],[.05,3.35,0,"H"],[.4,.7,0,"N"],[.4,-.3,0,"H"],[1.65,1.45,0,"C"],[1.65,2.85,0,"N"],[2.55,3.35,0,"H"],[2.9,.7,0,"N"],[3.8,1.2,0,"H"],[2.9,-.3,0,"H"],
 [-4.3,.95,.3,"H"],[-3.45,2.15,.75,"H"],[-3.5,1.85,-.95,"H"],[-2.95,-1.2,.35,"H"],[-1.25,-1.2,.35,"H"],[-2.1,-.95,-1.05,"H"]].map(a=>[a[0]+.25,a[1]-1.05,a[2],a[3]]);
const METB=[[0,1,1],[0,2,1],[0,3,1],[3,4,2],[4,5,1],[3,6,1],[6,7,1],[6,8,1],[8,9,2],[9,10,1],[8,11,1],[11,12,1],[11,13,1],[1,14,1],[1,15,1],[1,16,1],[2,17,1],[2,18,1],[2,19,1]];
const MOLS=[{A:PARA,B:PARAB,n:"Paracetamol",f:"C₈H₉NO₂ · CAS 103-90-2"},{A:MET,B:METB,n:"Metformin",f:"C₄H₁₁N₅ · CAS 657-24-9"}];
let A=PARA,B=PARAB,mi=0,mk=1,mkT=1,pend=-1,el=0;
const mbtn=$$(".mswitch button"),mcap=$("#mcap");
function pickMol(i){if(i===mi&&pend<0)return;pend=i;mkT=0;el=0;mbtn.forEach((b,j)=>b.setAttribute("aria-pressed",j===i));}
mbtn.forEach(b=>b.addEventListener("click",()=>pickMol(+b.dataset.m)));
const COL={C:["#E3E9F2","#8D9AB0","#2E3A50"],O:["#FFC2BA","#F2493D","#7C1710"],N:["#C9D8FF","#4479FF","#14298A"],H:["#FFFFFF","#E4E9F1","#8E99AB"]};
const RAD={C:.36,O:.34,N:.34,H:.22};
let ph=0,W=0,Hh=0,dpr=1,ry=0,rx=.25,vy=0,dragging=false,lx=0,ly=0,tx=0,tyy=0,running=false,last=0,hinted=false;
function size(){const r=cv.getBoundingClientRect();dpr=Math.min(2,devicePixelRatio||1);W=r.width;Hh=r.height;cv.width=W*dpr;cv.height=Hh*dpr}
new ResizeObserver(size).observe(cv);
function frame(t){
  if(!running)return;requestAnimationFrame(frame);
  const dt=Math.min(50,t-(last||t));last=t;
  if(!dragging){ry+=vy;vy*=.94;ry*=.995;ph+=RM?0:dt*.00045;if(!RM&&pend<0){el+=dt;if(el>8000)pickMol((mi+1)%MOLS.length)}}
  mk+=(mkT-mk)*.14;
  if(pend>=0&&mk<.03){mi=pend;pend=-1;A=MOLS[mi].A;B=MOLS[mi].B;mkT=1;vy+=.06;mcap.innerHTML=`<b>${MOLS[mi].n}</b><span>${MOLS[mi].f}</span>`;mcap.classList.remove("swap");void mcap.offsetWidth;mcap.classList.add("swap")}
  mbtn.forEach((b,j)=>{b.firstElementChild.style.width=j===mi&&pend<0&&!RM?Math.min(100,el/80)+"%":"0"});
  const RX=rx+tyy*.25+.18*Math.sin(ph*.7),RY=ry+tx*.3+.8*Math.sin(ph);
  cx.setTransform(dpr,0,0,dpr,0,0);cx.clearRect(0,0,W,Hh);
  const S=Math.min(W,Hh)/12*Math.max(.001,mk),cX=W/2,cY=Hh/2-Hh*.03,f=9;
  const cy1=Math.cos(RY),sy1=Math.sin(RY),cx1=Math.cos(RX),sx1=Math.sin(RX);
  const P=A.map(([x,y,z,e])=>{const x1=x*cy1+z*sy1,z1=-x*sy1+z*cy1;const y2=y*cx1-z1*sx1,z2=y*sx1+z1*cx1;const k=f/(f+z2);return{x:cX+x1*S*k,y:cY-y2*S*k,z:z2,k,e}});
  cx.lineCap="round";
  B.slice().sort((a,b)=>(P[b[0]].z+P[b[1]].z)-(P[a[0]].z+P[a[1]].z)).forEach(([i,j,o])=>{
    const a=P[i],b=P[j],w=S*.11*(a.k+b.k)/2,depth=Math.max(.35,Math.min(1,.75-(a.z+b.z)/8));
    cx.strokeStyle=`rgba(196,210,232,${depth})`;cx.lineWidth=w;
    if(o===2){const dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy)||1,nx=-dy/L*w*.9,ny=dx/L*w*.9;
      cx.beginPath();cx.moveTo(a.x+nx,a.y+ny);cx.lineTo(b.x+nx,b.y+ny);cx.moveTo(a.x-nx,a.y-ny);cx.lineTo(b.x-nx,b.y-ny);cx.stroke()}
    else{cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}
  });
  P.map((p,i)=>i).sort((a,b)=>P[b].z-P[a].z).forEach(i=>{const p=P[i],r=RAD[p.e]*S*p.k,c=COL[p.e];
    const g=cx.createRadialGradient(p.x-r*.38,p.y-r*.42,r*.08,p.x,p.y,r);g.addColorStop(0,c[0]);g.addColorStop(.45,c[1]);g.addColorStop(1,c[2]);
    cx.fillStyle=g;cx.beginPath();cx.arc(p.x,p.y,r,0,Math.PI*2);cx.fill()});
}
new IntersectionObserver(es=>{const v=es[0].isIntersecting;if(v&&!running){running=true;last=0;requestAnimationFrame(frame)}else if(!v)running=false},{threshold:0}).observe(cv);
cv.addEventListener("pointerdown",e=>{dragging=true;lx=e.clientX;ly=e.clientY;cv.setPointerCapture(e.pointerId);if(!hinted){hinted=true;$("#hint").style.opacity=0}});
cv.addEventListener("pointermove",e=>{if(!dragging)return;const dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;ry+=dx*.01;vy=dx*.0008;rx=Math.max(-1.2,Math.min(1.2,rx+dy*.008))});
const up=()=>dragging=false;cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up);
if(FINE)$(".hero").addEventListener("mousemove",e=>{tx=e.clientX/innerWidth-.5;tyy=e.clientY/innerHeight-.5});
}
