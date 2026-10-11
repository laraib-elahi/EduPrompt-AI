import React from "react";
import { LogOut, UserRound, GraduationCap, LayoutDashboard, ClipboardCheck, Sparkles, PencilLine, BarChart3, ListChecks, ShieldCheck, Lightbulb, ChevronRight } from "lucide-react";
import { PAPER, MUTED, ACCENT, NAV, NAV_2 } from "../theme.js";

export const STUDENT_NAV = [
  { key:"s-dashboard", label:"My Progress", icon:LayoutDashboard },
  { key:"s-problems", label:"Prompt Problems", icon:ListChecks },
  { key:"s-quiz", label:"Quizzes", icon:ClipboardCheck },
  { key:"s-guidance", label:"Guidance", icon:Lightbulb },
  { key:"s-privacy", label:"Privacy Assistant", icon:ShieldCheck },
];
export const TEACHER_NAV = [
  { key:"t-dashboard", label:"Dashboard", icon:LayoutDashboard },
  { key:"t-marking", label:"Auto-Marking", icon:ClipboardCheck },
  { key:"t-quiz", label:"Quiz Studio", icon:Sparkles },
  { key:"t-problems", label:"Prompt Problems", icon:PencilLine },
  { key:"t-analytics", label:"Analytics", icon:BarChart3 },
];

export default function Sidebar({ role,onSwitchRole,active,onNavigate,nav,user,onLogout }) {
  return (
    <aside className="app-sidebar w-64 flex-shrink-0 flex flex-col sticky top-0 h-screen" style={{background:`linear-gradient(180deg,${NAV} 0%,${NAV_2} 100%)`,boxShadow:"8px 0 30px rgba(15,23,42,.14)"}}>
      <div className="px-5 py-6" style={{borderBottom:"1px solid rgba(255,255,255,.08)"}}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:"linear-gradient(135deg,#4285F4,#9B72CB)",color:"#fff",boxShadow:"0 8px 20px rgba(66,133,244,.3)"}}><Sparkles size={19}/></div>
          <div className="brand-copy">
            <div style={{fontFamily:"Manrope",fontWeight:800,fontSize:17,color:PAPER}}>EduPrompt AI</div>
            <div style={{fontFamily:"IBM Plex Mono",fontSize:9,color:"#AECBFA",letterSpacing:".08em"}}>PROMPT LEARNING LAB</div>
          </div>
        </div>
      </div>
      {!user&&<div className="px-4 py-4" style={{borderBottom:"1px solid rgba(255,255,255,.08)"}}>
        <div className="role-label text-[9px] uppercase tracking-wider mb-2" style={{fontFamily:"IBM Plex Mono",color:"#94A3B8"}}>Viewing console as</div>
        <div className="flex p-1 rounded-xl" style={{background:"rgba(255,255,255,.06)"}}>
          {[["student",UserRound,"Student"],["teacher",GraduationCap,"Teacher"]].map(([r,I,l])=>
            <button key={r} onClick={()=>onSwitchRole(r)} aria-pressed={role===r} className="role-btn flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px]" style={{fontFamily:"DM Sans",fontWeight:600,color:role===r?NAV:"#CBD5E1",background:role===r?"#fff":"transparent"}}><I size={13}/><span className="role-label">{l}</span></button>
          )}
        </div>
      </div>}
      <nav className="flex-1 py-4" aria-label={`${role} navigation`}>
        {nav.map(item=>{
          const I=item.icon; const isActive=active===item.key || (item.key==="s-problems"&&active==="s-workspace");
          return <button key={item.key} onClick={()=>onNavigate(item.key)} aria-current={isActive?"page":undefined} className="nav-btn w-full flex items-center gap-3 px-5 py-2.5 text-left mb-1" style={{fontFamily:"DM Sans",fontSize:13,color:isActive?"#fff":"#AAB4D8",background:isActive?"rgba(66,133,244,.23)":"transparent",borderLeft:isActive?`3px solid ${ACCENT}`:"3px solid transparent"}}><I size={16}/><span className="nav-label flex-1">{item.label}</span>{isActive&&<ChevronRight className="nav-label" size={13}/>}</button>
        })}
      </nav>
      <div className="px-5 py-4 flex items-center gap-2" style={{borderTop:"1px solid rgba(255,255,255,.08)"}}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"rgba(255,255,255,.1)",color:"#E0E7FF"}}>{role==="teacher"?<GraduationCap size={14}/>:<UserRound size={14}/>}</div>
        <div className="footer-copy flex-1 min-w-0"><div className="truncate" style={{fontFamily:"DM Sans",fontSize:12,color:"#E2E8F0",fontWeight:700}}>{user?user.name:"BSEF23 · PUCIT"}</div><div style={{fontFamily:"IBM Plex Mono",fontSize:9,color:"#AECBFA",textTransform:"uppercase"}}>{user?role:"EDUPROMPT WORKSPACE"}</div></div>
        {onLogout&&<button onClick={onLogout} aria-label="Log out" title="Log out" className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:"rgba(255,255,255,.08)",color:"#FDA4AF"}}><LogOut size={14}/></button>}
      </div>
    </aside>
  );
}
