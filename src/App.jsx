import { useState, useEffect } from "react";
import { C, F } from "./theme.js";
import { defaultData, NAV, GROUPS } from "./data.js";
import AccountOverview from "./pages/AccountOverview.jsx";
import IndustryAnalysis from "./pages/IndustryAnalysis.jsx";
import Stakeholders from "./pages/Stakeholders.jsx";
import CompetitivePosition from "./pages/CompetitivePosition.jsx";
import WhiteSpaceGTT from "./pages/WhiteSpaceGTT.jsx";
import StrategyMap from "./pages/StrategyMap.jsx";
import DevelopStrategy from "./pages/DevelopStrategy.jsx";
import ActionPlan from "./pages/ActionPlan.jsx";
import RunningQuestions from "./pages/RunningQuestions.jsx";
import OpptyDashboard from "./pages/OpptyDashboard.jsx";
import OpptyReview from "./pages/OpptyReview.jsx";
import OpptyHealth from "./pages/OpptyHealth.jsx";
import OpptyInsights from "./pages/OpptyInsights.jsx";
import CollabPlan from "./pages/CollabPlan.jsx";

export default function App() {
  const [data, setData] = useState(defaultData);
  const [section, setSection] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    try{const r=localStorage.getItem("sap-planner-v2");if(r)setData(JSON.parse(r));}catch(e){}
  },[]);

  const save = (d)=>{setData(d);setSaving(true);try{localStorage.setItem("sap-planner-v2",JSON.stringify(d));}catch(e){}setTimeout(()=>setSaving(false),600);};
  const sf = (k,v)=>{
    if(typeof k==="object"&&v===undefined){save({...data,...k});}
    else{save({...data,[k]:v});}
  };

  const renderSection = () => {
    switch(section) {
      case "overview": return <AccountOverview data={data} sf={sf} />;
      case "industry": return <IndustryAnalysis data={data} sf={sf} />;
      case "stakeholders": return <Stakeholders data={data} sf={sf} />;
      case "competitive": return <CompetitivePosition data={data} sf={sf} />;
      case "whitespace": return <WhiteSpaceGTT data={data} sf={sf} />;
      case "strategy-map": return <StrategyMap data={data} sf={sf} />;
      case "strategy": return <DevelopStrategy data={data} sf={sf} />;
      case "action-plan": return <ActionPlan data={data} sf={sf} />;
      case "oppty-dashboard": return <OpptyDashboard data={data} sf={sf} setSection={setSection} />;
      case "oppty-review": return <OpptyReview data={data} sf={sf} setSection={setSection} />;
      case "oppty-health": return <OpptyHealth data={data} sf={sf} />;
      case "oppty-insights": return <OpptyInsights data={data} sf={sf} />;
      case "collab-plan": return <CollabPlan data={data} sf={sf} />;
      case "questions": return <RunningQuestions data={data} sf={sf} />;
      default: return null;
    }
  };

  return (
    <div style={{ display:"flex", height:"100vh", background:C.bg, fontFamily:F, overflow:"hidden" }}>
      {/* Sidebar */}
      <div style={{ width:collapsed?56:260, background:C.surface, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", transition:"width 0.25s", overflow:"hidden", flexShrink:0 }}>
        <div style={{ padding:collapsed?"16px 8px":"20px 20px 12px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:10, cursor:"pointer", minHeight:56 }} onClick={()=>setCollapsed(!collapsed)}>
          <div style={{ width:32, height:32, borderRadius:8, background:`linear-gradient(135deg,${C.accent},${C.purple})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:900, color:C.white, flexShrink:0 }}>S</div>
          {!collapsed&&<div><div style={{ fontSize:14, fontWeight:800, color:C.white, whiteSpace:"nowrap" }}>Strategic Planner</div><div style={{ fontSize:10, color:C.textDim, whiteSpace:"nowrap" }}>SAP + ODP Unified</div></div>}
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:collapsed?"8px 6px":"8px 10px" }}>
          {GROUPS.map(g=>(
            <div key={g}>
              {!collapsed&&<div style={{ fontSize:10, fontWeight:700, color:C.textDim, padding:"12px 10px 4px", letterSpacing:"0.1em", textTransform:"uppercase" }}>{g}</div>}
              {NAV.filter(n=>n.group===g).map(nav=>{
                const a=section===nav.id;
                return (<button key={nav.id} onClick={()=>setSection(nav.id)} title={collapsed?nav.label:undefined}
                  style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:collapsed?"10px 0":"8px 10px", justifyContent:collapsed?"center":"flex-start", background:a?C.accentGlow:"transparent", border:"none", borderRadius:8, cursor:"pointer", color:a?C.accent:C.textMuted, fontSize:13, fontWeight:a?700:500, fontFamily:F, marginBottom:2, textAlign:"left", transition:"all 0.15s" }}
                  onMouseEnter={e=>{if(!a)e.currentTarget.style.background=C.surfaceHover;}} onMouseLeave={e=>{if(!a)e.currentTarget.style.background="transparent";}}>
                  <span style={{ fontSize:14, flexShrink:0, width:20, textAlign:"center" }}>{nav.icon}</span>
                  {!collapsed&&<span style={{ whiteSpace:"nowrap" }}>{nav.label}</span>}
                </button>);
              })}
            </div>
          ))}
        </div>
        {!collapsed&&(
          <div style={{ padding:"12px 16px", borderTop:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:saving?C.amber:C.green, transition:"background 0.3s" }} />
              <span style={{ fontSize:11, color:C.textDim }}>{saving?"Saving...":"Auto-saved"}</span>
            </div>
          </div>
        )}
      </div>
      {/* Content */}
      <div style={{ flex:1, overflowY:"auto", padding:"32px 40px 60px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>{renderSection()}</div>
      </div>
    </div>
  );
}
