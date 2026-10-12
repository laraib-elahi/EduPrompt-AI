import React from "react";
import { ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";
import { INK, RULE, MINT, AMBER, RUST, MUTED, BODY, ACCENT, SOFT, SURFACE, ACCENT_2, CYAN } from "../theme.js";

export function SectionHeading({ eyebrow, title, trailing }) {
  return (
    <div className="section-heading flex items-end justify-between mb-7 flex-wrap gap-3">
      <div>
        {eyebrow && <div className="text-[11px] uppercase tracking-[.14em] mb-1.5" style={{ color: ACCENT_2, fontFamily: "IBM Plex Mono", fontWeight:600 }}>{eyebrow}</div>}
        <h2 className="text-[30px] leading-tight" style={{ fontFamily: "Manrope", fontWeight: 800, color: INK }}>{title}</h2>
      </div>
      {trailing}
    </div>
  );
}

const courseColors = {
  "ITP": ["#E8F0FE","#1967D2","#D2E3FC"],
  "OOP": ["#F3EDF9","#7B5AB5","#E2D6F0"],
  "Data Structures": ["#ECFEFF","#0E7490","#A5F3FC"],
  "Analysis of Algorithms": ["#FFF7ED","#C2410C","#FED7AA"]
};
export function CourseTag({ course }) {
  const [bg,color,border]=courseColors[course]||["#E8F0FE",ACCENT,"#D2E3FC"];
  return <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold" style={{fontFamily:"IBM Plex Mono",color,border:`1px solid ${border}`,background:bg}}>{course}</span>;
}

export function StatusPill({ children, tone="neutral" }) {
  const styles = {
    success: { color: MINT, bg:"#ECFDF5", border:"#A7F3D0" },
    warning: { color: AMBER, bg:"#FFFBEB", border:"#FDE68A" },
    danger: { color: RUST, bg:"#FFF1F2", border:"#FECDD3" },
    info: { color: ACCENT, bg:"#E8F0FE", border:"#D2E3FC" },
    neutral: { color: MUTED, bg:"#F1F5F9", border:"#E2E8F0" },
  }[tone];
  return <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full" style={{fontFamily:"IBM Plex Mono",fontWeight:600,color:styles.color,background:styles.bg,border:`1px solid ${styles.border}`}}>{children}</span>;
}

export function Bar({ label, value, max = 100 }) {
  const color = value >= 70 ? MINT : value >= 50 ? AMBER : RUST;
  return (
    <div className="flex items-center px-4 py-3 gap-3">
      <div className="w-40 text-[13px]" style={{fontFamily:"DM Sans",color:INK}}>{label}</div>
      <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{background:"#E2E8F0"}}>
        <div className="h-2.5 rounded-full progress-shine" style={{width:`${Math.max(0,Math.min(100,(value/max)*100))}%`,background:`linear-gradient(90deg,${color},${color}99)`}} />
      </div>
      <div className="w-12 text-right" style={{fontFamily:"IBM Plex Mono",fontSize:12,fontWeight:600,color}}>{value}%</div>
    </div>
  );
}

export function MetricCard({ label, value, note, icon: Icon, tone="indigo" }) {
  const colors = { indigo:ACCENT, emerald:MINT, amber:AMBER, rose:RUST, cyan:CYAN };
  const color=colors[tone]||ACCENT;
  return (
    <div className={`metric-card metric-${tone} p-5 rounded-2xl relative overflow-hidden`} style={{background:`linear-gradient(145deg,#fff 0%,${color}0D 100%)`,border:`1px solid ${color}30`,boxShadow:"0 14px 34px rgba(15,23,42,.07)"}}>
      <div className="metric-glow" style={{background:color}}/>
      <div className="flex items-center justify-between mb-4 relative">
        <span className="text-[11px] uppercase tracking-wider" style={{fontFamily:"IBM Plex Mono",fontWeight:600,color:MUTED}}>{label}</span>
        {Icon && <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:`linear-gradient(135deg,${color}20,${color}08)`,color,boxShadow:`0 7px 18px ${color}20`}}><Icon size={18}/></span>}
      </div>
      <div className="text-[30px] relative" style={{fontFamily:"Manrope",fontWeight:800,color:INK}}>{value}</div>
      {note && <div className="text-[11px] mt-1 relative" style={{fontFamily:"DM Sans",color:MUTED}}>{note}</div>}
    </div>
  );
}

export function ProblemCard({ problem, solved, onOpen, teacher=false, onEdit }) {
  const accent=problem.difficulty==="Hard"?RUST:problem.difficulty==="Medium"?AMBER:ACCENT;
  return (
    <div className="problem-card group p-5 rounded-2xl relative overflow-hidden" style={{background:"linear-gradient(145deg,#fff 0%,#F8FAFF 100%)",border:`1px solid ${accent}24`,boxShadow:"0 12px 30px rgba(15,23,42,.06)"}}>
      <div className="problem-card-glow" style={{background:accent}}/>
      <div className="relative">
        <div className="flex items-center justify-between gap-2 mb-4">
          <CourseTag course={problem.course}/>
          {solved ? <StatusPill tone="success"><CheckCircle2 size={11}/> Solved</StatusPill> : <StatusPill tone={problem.difficulty==="Hard"?"danger":problem.difficulty==="Medium"?"warning":"info"}>{problem.difficulty}</StatusPill>}
        </div>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center" style={{background:`linear-gradient(135deg,${accent}18,${accent}08)`,color:accent}}><Sparkles size={17}/></div>
          <div>
            <div style={{fontFamily:"Manrope",fontWeight:800,fontSize:16,color:INK}}>{problem.title}</div>
            <div className="mt-2" style={{fontFamily:"DM Sans",fontSize:11,lineHeight:1.55,color:BODY}}>{problem.description || "Practice writing a precise prompt from the supplied input/output evidence."}</div>
          </div>
        </div>
        <div className="mt-4 px-3 py-2.5 rounded-xl" style={{fontFamily:"IBM Plex Mono",fontSize:11,color:BODY,background:`linear-gradient(90deg,${accent}09,#fff)`,border:`1px solid ${accent}18`}}>{problem.examples[0]?.input} <span style={{color:accent}}>→</span> {problem.examples[0]?.output}</div>
        <div className="mt-4 flex items-center justify-between">
          <span style={{fontFamily:"IBM Plex Mono",fontSize:10,color:MUTED}}>{problem.attempts} attempts · {problem.passRate}% pass</span>
          {teacher ? <button onClick={()=>onEdit(problem.id)} className="text-[11px] inline-flex items-center gap-1" style={{color:accent,fontFamily:"DM Sans",fontWeight:700}}>Edit <ArrowUpRight size={12}/></button> :
            <button onClick={()=>onOpen(problem.id)} className="text-[11px] inline-flex items-center gap-1" style={{color:accent,fontFamily:"DM Sans",fontWeight:700}}>Open problem <ArrowUpRight size={12}/></button>}
        </div>
      </div>
    </div>
  );
}
