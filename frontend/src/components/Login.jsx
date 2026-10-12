import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Sparkles, Mail, Lock, Eye, EyeOff, CheckCircle2, XCircle, Loader2, GraduationCap, UserRound, Bot, BarChart3, ClipboardCheck, Moon, Sun } from "lucide-react";

const FEATURES = [
  { icon: Bot, title: "Automated Evaluation", text: "LLM-assisted marking with teacher review before finalizing." },
  { icon: BarChart3, title: "Smart Analytics", text: "Spot weak prompt problems and track every student's progress." },
  { icon: ClipboardCheck, title: "Interactive Quizzes", text: "Publish quizzes and get structured, reviewable results." },
];
const DEMO = {
  teacher: { email: "teacher@eduprompt.ai", password: "demo1234" },
  student: { email: "student@eduprompt.ai", password: "demo1234" },
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Login({ onLogin, theme, onToggleTheme }) {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailValid = EMAIL_RE.test(email);
  const passValid = password.length >= 6;

  function fillDemo(r) {
    setRole(r); setEmail(DEMO[r].email); setPassword(DEMO[r].password); setTouched(false);
    toast.success(`${r === "teacher" ? "Teacher" : "Student"} demo credentials filled`);
  }

  function submit(e) {
    e.preventDefault();
    setTouched(true);
    if (!emailValid || !passValid) { toast.error("Please enter a valid email and a password (6+ characters)."); return; }
    setLoading(true);
    // Mock auth — replace with a real API call in src/api.js when the backend is ready.
    setTimeout(() => {
      setLoading(false);
      const name = email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      onLogin({ role, email, name, remember });
    }, 900);
  }

  const inputBase = "w-full pl-10 pr-10 py-3 text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition focus:ring-4 focus:ring-blue-500/15";
  const emailBorder = !email ? "border-slate-200 dark:border-slate-700" : emailValid ? "border-emerald-400" : "border-rose-400";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-900 transition-colors" style={{ fontFamily: "DM Sans, sans-serif" }}>
      {/* LEFT: brand panel */}
      <div className="relative lg:w-1/2 overflow-hidden bg-gradient-to-br from-blue-600 via-violet-500 to-rose-400 text-white px-8 py-10 lg:p-14 flex flex-col justify-between">
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-cyan-400/20 blur-3xl" />
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center"><Sparkles size={22} /></div>
          <span className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: "Manrope" }}>EduPrompt</span>
        </motion.div>

        <div className="relative my-10 lg:my-0">
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }} className="text-3xl lg:text-5xl font-extrabold leading-tight max-w-lg" style={{ fontFamily: "Manrope" }}>
            AI-Powered Prompt Workspace &amp; Auto-Grading System
          </motion.h1>
          <div className="mt-8 space-y-4 max-w-md">
            {FEATURES.map(({ icon: I, title, text }, i) => (
              <motion.div key={title} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .25 + i * .12 }} className="flex gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-white/15 flex items-center justify-center"><I size={18} /></div>
                <div><div className="font-bold text-sm">{title}</div><div className="text-xs text-blue-100 mt-0.5">{text}</div></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: form panel */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-10 relative">
        <button onClick={onToggleTheme} aria-label="Toggle theme" className="absolute top-5 right-5 w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:scale-105 transition">
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <motion.form onSubmit={submit} noValidate initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4 }} className="w-full max-w-md p-8 rounded-3xl backdrop-blur-md bg-white/80 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-xl shadow-blue-500/10">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white" style={{ fontFamily: "Manrope" }}>Welcome Back!</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">Sign in to continue to your workspace.</p>

          <div role="tablist" className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 mb-5">
            {[["student", UserRound, "Student"], ["teacher", GraduationCap, "Teacher"]].map(([r, I, l]) => (
              <button type="button" key={r} role="tab" aria-selected={role === r} onClick={() => setRole(r)} className={`relative flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition ${role === r ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"}`}>
                <I size={15} />{l}
              </button>
            ))}
          </div>

          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Email address</label>
          <div className="relative mb-1">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@university.edu" autoComplete="email" className={`${inputBase} ${emailBorder}`} />
            {email && (emailValid ? <CheckCircle2 size={17} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500" /> : <XCircle size={17} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-rose-500" />)}
          </div>
          <p className="h-4 text-[11px] text-rose-500 mb-2">{(touched || email) && !emailValid && email ? "Enter a valid email address." : touched && !email ? "Email is required." : ""}</p>

          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Password</label>
          <div className="relative mb-1">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" className={`${inputBase} ${touched && !passValid ? "border-rose-400" : "border-slate-200 dark:border-slate-700"}`} />
            <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500">{show ? <EyeOff size={17} /> : <Eye size={17} />}</button>
          </div>
          <p className="h-4 text-[11px] text-rose-500 mb-2">{touched && !passValid ? "Password must be at least 6 characters." : ""}</p>

          <div className="flex items-center justify-between mb-5 text-xs">
            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer"><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="accent-blue-600" />Remember me</label>
            <button type="button" onClick={() => toast("Password reset is available once the backend is connected.", { icon: "ℹ️" })} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Forgot Password?</button>
          </div>

          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[.98] shadow-lg shadow-blue-500/30 transition disabled:opacity-80">
            {loading ? <><Loader2 size={16} className="animate-spin" />Signing in…</> : "Sign In"}
          </button>

          <div className="flex items-center gap-3 my-5"><div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" /><span className="text-[10px] uppercase tracking-widest text-slate-400">Quick demo access</span><div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" /></div>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => fillDemo("teacher")} className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border border-blue-200 dark:border-blue-500/40 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 transition"><GraduationCap size={14} />Teacher Demo</button>
            <button type="button" onClick={() => fillDemo("student")} className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 transition"><UserRound size={14} />Student Demo</button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
