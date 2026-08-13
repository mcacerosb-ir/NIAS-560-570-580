/* ========== QUIZ (compartido) ========== */
function calcQuiz(fid){
var f=document.getElementById(fid);if(!f)return;
var fd=new FormData(f),tot=0,cor=0;
for(var ent of fd.entries()){tot++;if(ent[1]==="1")cor++;}
var sc=tot?Math.round(cor*100/tot):0,pass=sc>=70;
var r=document.getElementById("quiz-result");
r.className="quiz-result show "+(pass?"pass":"fail");
r.textContent="Resultado: "+cor+"/"+tot+" ("+sc+"%). "+(pass?"Aprobado":"Debe estudiar más");
}