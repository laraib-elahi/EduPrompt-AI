import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

class AppErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error) { console.error("EduPrompt AI UI error:", error); }
  render() {
    if (this.state.hasError) return <div className="min-h-screen flex items-center justify-center p-6" style={{background:"#F8FAFD"}}><div className="w-full max-w-md rounded-2xl p-7 text-center" style={{background:"#fff",border:"1px solid #E2E8F0",boxShadow:"0 20px 50px rgba(15,23,42,.08)"}}><div className="mx-auto mb-4 w-12 h-12 rounded-2xl flex items-center justify-center" style={{background:"#E8F0FE",color:"#1A73E8",fontSize:22}}>✦</div><h1 style={{fontFamily:"Manrope",fontWeight:800,color:"#1F1F1F",fontSize:20}}>EduPrompt AI recovered from an error</h1><p className="mt-2 mb-5" style={{fontFamily:"DM Sans",color:"#64748B",fontSize:13}}>Something unexpected happened in this screen. Reload the application to return to the workspace.</p><button onClick={()=>window.location.reload()} className="px-5 py-2.5 rounded-xl" style={{background:"#1A73E8",color:"#fff",fontFamily:"DM Sans",fontWeight:800,fontSize:12}}>Reload workspace</button></div></div>;
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(<React.StrictMode><AppErrorBoundary><App /></AppErrorBoundary></React.StrictMode>);
