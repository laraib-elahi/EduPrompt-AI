import React, { useState, useEffect } from "react";
import { Sparkles, Moon, Sun, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import Login from "./components/Login.jsx";
import ConfirmModal from "./components/ConfirmModal.jsx";
import { PageSkeleton } from "./components/Skeleton.jsx";
import { PAPER, INK, ACCENT, ACCENT_2, RULE, MUTED, BODY } from "./theme.js";
import Sidebar, { STUDENT_NAV, TEACHER_NAV } from "./components/Sidebar.jsx";
import { INITIAL_QUEUE, PROBLEMS as SEED_PROBLEMS, STUDENTS } from "./data/mockData.js";
import StudentDashboard from "./student/StudentDashboard.jsx";
import StudentProblems from "./student/StudentProblems.jsx";
import PromptWorkspace from "./student/PromptWorkspace.jsx";
import StudentQuiz from "./student/StudentQuiz.jsx";
import Guidance from "./student/Guidance.jsx";
import PrivacyAssistant from "./student/PrivacyAssistant.jsx";
import TeacherDashboard from "./teacher/TeacherDashboard.jsx";
import AutoMarking from "./teacher/AutoMarking.jsx";
import QuizStudio from "./teacher/QuizStudio.jsx";
import TeacherProblems from "./teacher/TeacherProblems.jsx";
import Analytics from "./teacher/Analytics.jsx";

function usePersisted(key,init){
  const [v,setV]=useState(()=>{try{const r=localStorage.getItem("eduprompt_"+key);return r?JSON.parse(r):init;}catch{return init;}});
  useEffect(()=>{try{localStorage.setItem("eduprompt_"+key,JSON.stringify(v));}catch{}},[key,v]);
  return [v,setV];
}

function loadSession(){
  try{ const raw=localStorage.getItem("eduprompt_user"); return raw?JSON.parse(raw):null; }catch{ return null; }
}

export default function App() {
  const [user,setUser]=useState(loadSession);            // null => logged out
  const isLoggedIn=!!user;
  const [theme,setTheme]=useState(()=>{ try{return localStorage.getItem("eduprompt_theme")||"light";}catch{return "light";} });
  const [loading,setLoading]=useState(false);
  const [confirmLogout,setConfirmLogout]=useState(false);
  const [role,setRole]=useState(user?.role||"student");
  const [active,setActive]=useState(user?.role==="teacher"?"t-dashboard":"s-dashboard");
  const [currentStudent,setCurrentStudent]=usePersisted("student",STUDENTS[3]);
  const [queue,setQueue]=usePersisted("queue",INITIAL_QUEUE);
  const [openProblemId,setOpenProblemId]=useState(null);
  const [progress,setProgress]=usePersisted("progress",{});
  const [problems,setProblems]=usePersisted("problems_v3",SEED_PROBLEMS);
  const [editId,setEditId]=useState(null);
  const [results,setResults]=usePersisted("results",[]);
  const [published,setPublished]=usePersisted("published",[]);
  const [submittedIds,setSubmittedIds]=usePersisted("submitted",[]);

  useEffect(()=>{
    document.documentElement.classList.toggle("dark",theme==="dark");
    try{localStorage.setItem("eduprompt_theme",theme);}catch{}
  },[theme]);

  // Skeleton shimmer briefly on every route/tab change
  useEffect(()=>{
    if(!isLoggedIn) return;
    setLoading(true);
    const t=setTimeout(()=>setLoading(false),350);
    return ()=>clearTimeout(t);
  },[active,role,isLoggedIn]);

  function handleLogin(u){
    setUser(u); setRole(u.role); setOpenProblemId(null); setEditId(null);
    setActive(u.role==="teacher"?"t-dashboard":"s-dashboard");
    try{ if(u.remember) localStorage.setItem("eduprompt_user",JSON.stringify(u)); else localStorage.removeItem("eduprompt_user"); }catch{}
    toast.success(`Welcome back, ${u.name}!`);
  }
  function handleLogout(){
    setConfirmLogout(false); setUser(null);
    try{localStorage.removeItem("eduprompt_user");}catch{}
    toast("Signed out successfully",{icon:"👋"});
  }
  const toggleTheme=()=>setTheme(t=>t==="dark"?"light":"dark");
  function resetDemo(){
    if(!window.confirm("Reset all demo data (quizzes, marks, progress, edited problems)?")) return;
    setQueue(INITIAL_QUEUE);setProgress({});setProblems(SEED_PROBLEMS);setResults([]);setPublished([]);setSubmittedIds([]);setOpenProblemId(null);setEditId(null);
    toast.success("Demo data reset");
  }

  function publishQuiz(quiz){
    const publishedQuiz={...quiz,id:`quiz-${Date.now()}`,publishedAt:"just now"};
    setPublished(p=>[...p,publishedQuiz]);
    toast.success("Quiz published to students!");
  }

  function submitQuiz(quiz,answers){
    const id=Date.now()%100000;
    setSubmittedIds(p=>[...new Set([...p,quiz.id])]);
    setQueue(q=>[...q,{id,student:currentStudent,course:quiz.course,assignment:quiz.title,submitted:"just now",status:"queued",answers,quizId:quiz.id,quizTitle:quiz.title,quizQuestions:quiz.questions}]);
    setActive("s-dashboard");
    toast.success("Quiz Submitted Successfully!");
  }
  function approve(item) {
    setResults(prev=>[...prev.filter(r=>r.id!==item.id),{
      ...item,status:"graded",reviewed:true,finalizedAt:"just now",score:Number(item.score||0),feedback:item.feedback||"Reviewed by instructor."
    }]);
    toast.success("Mark finalized and sent to student");
  }
  function editFromAnalytics(id){ setEditId(id); setActive("t-problems"); }
  function switchRole(next){setRole(next);setOpenProblemId(null);setEditId(null);setActive(next==="student"?"s-dashboard":"t-dashboard");}
  function openProblem(id){setOpenProblemId(id);setActive("s-workspace");}
  function recordAttempt(id,passed){setProgress(prev=>{const key=`${currentStudent}:${id}`;const cur=prev[key]||{attempts:0,solved:false};return {...prev,[key]:{attempts:cur.attempts+1,solved:cur.solved||passed}};});}

  const nav=role==="student"?STUDENT_NAV:TEACHER_NAV;
  const selectedProblem=problems.find(p=>p.id===openProblemId);
  const studentProgress=Object.fromEntries(problems.map(p=>[p.id,progress[`${currentStudent}:${p.id}`]||{attempts:0,solved:false}]));

  const toaster=<Toaster position="top-right" toastOptions={{duration:3000,style:{fontFamily:"DM Sans",fontSize:13,borderRadius:14,background:theme==="dark"?"#1e293b":"#fff",color:theme==="dark"?"#f1f5f9":"#1F1F1F",border:"1px solid rgba(66,133,244,.2)"},success:{iconTheme:{primary:"#10B981",secondary:"#fff"}}}}/>;

  if(!isLoggedIn) return <>{toaster}<Login onLogin={handleLogin} theme={theme} onToggleTheme={toggleTheme}/></>;

  return (
    <div className="flex min-h-screen" style={{background:PAPER}}>
      <Sidebar role={role} user={user} onLogout={()=>setConfirmLogout(true)} onSwitchRole={switchRole} active={active} onNavigate={key=>{setOpenProblemId(null);setActive(key)}} nav={nav}/>
      <main className="app-main flex-1 px-7 sm:px-10 py-8 overflow-auto">
        <div className="max-w-[1400px] mx-auto">
          <div className="topbar-glass flex items-center justify-between mb-7 px-4 py-3 rounded-2xl gap-4" style={{background:"linear-gradient(100deg,rgba(255,255,255,.82),rgba(238,242,255,.82),rgba(250,245,255,.82))",backdropFilter:"blur(16px)",border:"1px solid rgba(66,133,244,.20)",boxShadow:"0 10px 30px rgba(66,133,244,.07)"}}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:"linear-gradient(135deg,#1A73E8,#9B72CB)",color:"#fff",boxShadow:"0 7px 18px rgba(66,133,244,.24)"}}><Sparkles size={16}/></div>
              <div>
                <div className="text-[10px] uppercase tracking-[.12em]" style={{fontFamily:"IBM Plex Mono",color:ACCENT_2,fontWeight:600}}>{role==="student"?"Student workspace":"Teacher workspace"}</div>
                <div className="text-[12px] mt-1" style={{fontFamily:"DM Sans",color:MUTED}}>EduPrompt AI · Prompt engineering for programming</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
            <button onClick={resetDemo} aria-label="Reset demo data" title="Reset demo data" className="w-10 h-10 flex items-center justify-center" style={{background:"rgba(255,255,255,.72)",border:"1px solid rgba(66,133,244,.15)",color:ACCENT}}><RotateCcw size={15}/></button>
            <button onClick={toggleTheme} aria-label="Toggle dark mode" title={theme==="dark"?"Switch to light mode":"Switch to dark mode"} className="w-10 h-10 flex items-center justify-center" style={{background:"rgba(255,255,255,.72)",border:"1px solid rgba(66,133,244,.15)",color:ACCENT}}>{theme==="dark"?<Sun size={16}/>:<Moon size={16}/>}</button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl" style={{background:"rgba(255,255,255,.72)",border:"1px solid rgba(66,133,244,.15)"}}>
              <span className="w-2 h-2 rounded-full" style={{background:"#10B981",boxShadow:"0 0 0 4px rgba(16,185,129,.12)"}}/>
              <span style={{fontFamily:"IBM Plex Mono",fontSize:10,color:BODY,fontWeight:600}}>SYSTEM READY</span>
            </div>
            </div>
          </div>

          {loading?<PageSkeleton/>:<AnimatePresence mode="wait"><motion.div key={role+active+(openProblemId||"")} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.25}}>
          {role==="teacher"&&active==="t-dashboard"&&<TeacherDashboard queue={queue} results={results} onNavigate={setActive} name={user?.name} problems={problems} onEditProblem={editFromAnalytics}/>} 
          {role==="teacher"&&active==="t-marking"&&<AutoMarking queue={queue} setQueue={setQueue} onApprove={approve}/>} 
          {role==="teacher"&&active==="t-quiz"&&<QuizStudio published={published} onPublish={publishQuiz}/>} 
          {role==="teacher"&&active==="t-problems"&&<TeacherProblems problems={problems} setProblems={setProblems} editId={editId} setEditId={setEditId}/>} 
          {role==="teacher"&&active==="t-analytics"&&<Analytics problems={problems} results={results} onEditProblem={editFromAnalytics}/>} 

          {role==="student"&&active==="s-dashboard"&&<StudentDashboard student={currentStudent} onStudentChange={setCurrentStudent} problems={problems} progress={studentProgress} onOpenProblem={openProblem} results={results} onAttempt={recordAttempt}/>} 
          {role==="student"&&active==="s-problems"&&<StudentProblems problems={problems} progress={studentProgress} onOpenProblem={openProblem}/>} 
          {role==="student"&&active==="s-workspace"&&selectedProblem&&<PromptWorkspace problem={selectedProblem} attempts={studentProgress[selectedProblem.id]?.attempts||0} onAttempt={recordAttempt} onBack={()=>setActive("s-problems")}/>} 
          {role==="student"&&active==="s-quiz"&&<StudentQuiz student={currentStudent} published={published} submittedIds={submittedIds} onSubmit={submitQuiz}/>} 
          {role==="student"&&active==="s-guidance"&&<Guidance/>} 
          {role==="student"&&active==="s-privacy"&&<PrivacyAssistant/>} 
          </motion.div></AnimatePresence>}
        </div>
      </main>
      {toaster}
      <ConfirmModal open={confirmLogout} title="Log out of EduPrompt?" message="You will need to sign in again to access your workspace." confirmLabel="Log out" onConfirm={handleLogout} onCancel={()=>setConfirmLogout(false)}/>
    </div>
  );
}
