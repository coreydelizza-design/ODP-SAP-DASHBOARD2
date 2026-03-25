import { C, F, FM } from "../theme.js";
import { SH, Card, Badge, ScorePill, AddBtn, DelBtn } from "../components/ui.jsx";
import { QQ, CE_DIMS, CE_LABELS, CE_COACHING } from "../data.js";
import withOppty from "../components/withOppty.jsx";

const OpptyInsightsInner = ({ oppty:o, setOppty:so }) => {
  const q=o.qualification;
  const ce = q.compellingEvent || [0,0,0,0];
  const cust = q.custom || {};
  const custScore = (k) => (cust[k]||[]).reduce((a,b)=>a+b.score,0);
  const custMax = (k) => (cust[k]||[]).length * 5;
  const sc=k=>(k==="compellingEvent"?ce.reduce((a,b)=>a+b,0):(q[k]||[0,0,0,0]).reduce((a,b)=>a+b,0))+custScore(k);
  const maxPts = (k) => (k==="compellingEvent"?20:(q[k]||[0,0,0,0]).length*5)+custMax(k);
  const totalMax = maxPts("decisionMaking")+maxPts("valueProp")+maxPts("productOps")+maxPts("commercialRisk")+maxPts("compellingEvent");
  const tot=sc("decisionMaking")+sc("valueProp")+sc("productOps")+sc("commercialRisk")+sc("compellingEvent");
  const scaled=totalMax>0?Math.round((tot/totalMax)*100):0;
  const hc=scaled<50?C.red:scaled<70?C.amber:C.green;
  const hl=scaled<50?"Poor":scaled<70?"Improvement Needed":"Strong";

  const ceScore = ce.reduce((a,b)=>a+b,0)+custScore("compellingEvent");
  const ceMax = 20+custMax("compellingEvent");
  const cePct = ceMax>0?ceScore/ceMax:0;
  const ceColor = cePct<0.4?C.red:cePct<0.7?C.amber:C.green;
  const ceLabel = ceScore===0?"Not Identified":cePct<0.4?"Weak":cePct<0.7?"Developing":"Verified & Strong";
  const ceCoach = (CE_COACHING.find(([lo,hi])=>ceScore>=lo&&ceScore<=hi)||CE_COACHING[0])[2];

  const setCe = (qi,v) => {
    const nq = { ...q, compellingEvent: [...ce] };
    nq.compellingEvent[qi] = v;
    so("qualification", nq);
  };
  const addCustom = (k) => {
    const nq = { ...q, custom: { ...cust, [k]: [...(cust[k]||[]), { label:"", score:0 }] } };
    so("qualification", nq);
  };
  const updateCustom = (k, idx, field, val) => {
    const arr = [...(cust[k]||[])]; arr[idx] = { ...arr[idx], [field]: val };
    so("qualification", { ...q, custom: { ...cust, [k]: arr } });
  };
  const deleteCustom = (k, idx) => {
    const arr = (cust[k]||[]).filter((_,i)=>i!==idx);
    so("qualification", { ...q, custom: { ...cust, [k]: arr } });
  };

  return (
    <div>
      <SH title="Qualification & Insights" description={o.name||"Score each dimension."} />

      {/* Summary Card */}
      <Card style={{ textAlign:"center", padding:32 }}>
        <Badge color={hc}>{hl}</Badge>
        <div style={{ fontSize:48, fontWeight:900, fontFamily:FM, color:hc, lineHeight:1, marginTop:12 }}>{scaled}</div>
        <div style={{ fontSize:13, color:C.textMuted, marginTop:6 }}>Qualification Score — {o.name||"Untitled"}</div>
        <div style={{ display:"flex", justifyContent:"center", gap:16, marginTop:20, flexWrap:"wrap" }}>
          {[{l:"Decision",k:"decisionMaking"},{l:"Value Prop",k:"valueProp"},{l:"Product/Ops",k:"productOps"},{l:"Commercial",k:"commercialRisk"},{l:"Compelling",k:"compellingEvent"}].map(x=>{
            const s=sc(x.k);const mx=maxPts(x.k);const p=mx>0?s/mx:0;const col=p<0.5?C.red:p<0.75?C.amber:C.green;
            return (<div key={x.k} style={{ minWidth:90 }}>
              <div style={{ fontSize:22, fontWeight:800, fontFamily:FM, color:col }}>{s}<span style={{ fontSize:12, color:C.textDim }}>/{mx}</span></div>
              <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{x.l}</div>
              <div style={{ height:6, background:C.bg, borderRadius:3, marginTop:6, overflow:"hidden" }}><div style={{ height:"100%", width:`${p*100}%`, background:col, borderRadius:3 }} /></div>
            </div>);
          })}
        </div>
      </Card>

      {/* Compelling Event — Featured Card */}
      <Card accent={ceColor} style={{ padding:0, overflow:"hidden" }}>
        <div style={{ background:`linear-gradient(135deg, ${ceColor}11, ${ceColor}06)`, padding:"20px 24px" }}>
          {/* Header */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                <span style={{ fontSize:17, fontWeight:800, color:C.white, fontFamily:F }}>Compelling Event</span>
                <Badge color={ceColor}>{ceLabel}</Badge>
              </div>
              <div style={{ fontSize:12, color:C.textDim, fontFamily:F }}>Why must the customer act now?</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:32, fontWeight:900, fontFamily:FM, color:ceColor, lineHeight:1 }}>{ceScore}</div>
              <div style={{ fontSize:12, color:C.textDim, fontFamily:FM }}>/ {ceMax}</div>
            </div>
          </div>

          {/* 2×2 Dimension Grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
            {CE_DIMS.map((dim,qi)=>{
              const val = ce[qi]||0;
              const dimCol = val<=1?C.red:val<=3?C.amber:C.green;
              return (
                <div key={qi} style={{ background:C.bg, borderRadius:10, border:`1px solid ${C.border}`, padding:"14px 16px", transition:"border-color 0.15s" }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=`${ceColor}66`}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:2 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:C.text, fontFamily:F }}>{dim.l}</span>
                    <span style={{ fontSize:18, fontWeight:800, color:dimCol, fontFamily:FM }}>{val}</span>
                  </div>
                  <div style={{ fontSize:11, color:C.textDim, fontFamily:F, marginBottom:8, lineHeight:1.4 }}>{dim.desc}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:10, fontWeight:700, color:dimCol, fontFamily:F }}>{CE_LABELS[val]||"—"}</span>
                    <ScorePill value={val} onChange={v=>setCe(qi,v)} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Items */}
          {(cust.compellingEvent||[]).map((ci,idx)=>{
            const dimCol = ci.score<=1?C.red:ci.score<=3?C.amber:C.green;
            return (
              <div key={idx} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 0", borderBottom:`1px solid ${C.border}22` }}>
                <input value={ci.label} onChange={e=>updateCustom("compellingEvent",idx,"label",e.target.value)} placeholder="Custom issue..."
                  style={{ flex:1, padding:"6px 8px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, fontSize:13, fontFamily:F, outline:"none" }}
                  onFocus={e=>e.target.style.borderColor=ceColor} onBlur={e=>e.target.style.borderColor=C.border} />
                <span style={{ fontSize:10, fontWeight:700, color:dimCol, fontFamily:F, minWidth:50, textAlign:"right" }}>{CE_LABELS[ci.score]||"—"}</span>
                <ScorePill value={ci.score} onChange={v=>updateCustom("compellingEvent",idx,"score",v)} />
                <DelBtn onClick={()=>deleteCustom("compellingEvent",idx)} />
              </div>
            );
          })}
          <div style={{ marginTop:8, marginBottom:12 }}>
            <AddBtn onClick={()=>addCustom("compellingEvent")} label="Add Issue" />
          </div>

          {/* Assessment Panel */}
          {ceScore>0 && (
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"12px 16px", marginBottom:12 }}>
              <div style={{ fontSize:10, fontWeight:700, color:ceColor, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6, fontFamily:F }}>Compelling Event Assessment</div>
              <div style={{ fontSize:12, color:C.textMuted, fontFamily:F, lineHeight:1.6 }}>{ceCoach}</div>
            </div>
          )}
          {/* Notes */}
          <div>
            <label style={{ display:"block", fontSize:10, fontWeight:600, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4, fontFamily:F }}>Notes</label>
            <textarea value={(q.notes||{}).compellingEvent||""} onChange={ev=>{const nq={...q,notes:{...(q.notes||{}),compellingEvent:ev.target.value}};so("qualification",nq);}} rows={2} placeholder="Compelling event details, evidence, dates..."
              style={{ width:"100%", padding:"8px 10px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, fontSize:12, fontFamily:F, outline:"none", resize:"vertical", boxSizing:"border-box" }}
              onFocus={e=>e.target.style.borderColor=ceColor} onBlur={e=>e.target.style.borderColor=C.border} />
          </div>
        </div>
      </Card>

      {/* Existing 4 Category Cards */}
      {[{k:"decisionMaking",l:"Decision Making Process",c:C.accent},{k:"valueProp",l:"GTT Value Proposition",c:C.green},{k:"productOps",l:"Product & Operations",c:C.purple},{k:"commercialRisk",l:"Commercial Risk",c:C.amber}].map(cat=>(
        <Card key={cat.k} title={cat.l} accent={cat.c}>
          <div style={{ display:"flex", gap:4, marginBottom:12, flexWrap:"wrap" }}>
            {["Not assessed","Disagree","Slightly disagree","Neutral","Slightly agree","Strongly agree"].map((lbl,i)=>{
              const lc=i<=1?C.red:i<=3?C.amber:C.green;
              return <span key={i} style={{ fontSize:9, fontFamily:F, color:lc, padding:"2px 6px", borderRadius:4, background:`${lc}11`, border:`1px solid ${lc}22` }}>{i} = {lbl}</span>;
            })}
          </div>
          {QQ[cat.k].map((question,qi)=>{
            const val=(q[cat.k]||[0,0,0,0])[qi];
            const vCol=val<=1?C.red:val<=3?C.amber:C.green;
            const vLabel=["Not assessed","Disagree","Slightly disagree","Neutral","Slightly agree","Strongly agree"][val]||"";
            return (
              <div key={qi} style={{ padding:"10px 0", borderBottom:qi<QQ[cat.k].length-1?`1px solid ${C.border}22`:"none" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:13, color:C.text, fontFamily:F, flex:1 }}>{question}</span>
                  <ScorePill value={val} onChange={v=>{const nq={...q};nq[cat.k]=[...(nq[cat.k]||[0,0,0,0])];nq[cat.k][qi]=v;so("qualification",nq);}} />
                </div>
                {val>0 && <div style={{ fontSize:10, fontWeight:600, color:vCol, fontFamily:F, marginTop:4, textAlign:"right" }}>{vLabel}</div>}
              </div>
            );
          })}
          {/* Custom Items */}
          {(cust[cat.k]||[]).map((ci,idx)=>{
            const ciCol=ci.score<=1?C.red:ci.score<=3?C.amber:C.green;
            const ciLabel=["Not assessed","Disagree","Slightly disagree","Neutral","Slightly agree","Strongly agree"][ci.score]||"";
            return (
              <div key={idx} style={{ padding:"10px 0", borderBottom:`1px solid ${C.border}22` }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <input value={ci.label} onChange={e=>updateCustom(cat.k,idx,"label",e.target.value)} placeholder="Custom issue..."
                    style={{ flex:1, padding:"6px 8px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, fontSize:13, fontFamily:F, outline:"none" }}
                    onFocus={e=>e.target.style.borderColor=cat.c} onBlur={e=>e.target.style.borderColor=C.border} />
                  <ScorePill value={ci.score} onChange={v=>updateCustom(cat.k,idx,"score",v)} />
                  <DelBtn onClick={()=>deleteCustom(cat.k,idx)} />
                </div>
                {ci.score>0 && <div style={{ fontSize:10, fontWeight:600, color:ciCol, fontFamily:F, marginTop:4, textAlign:"right" }}>{ciLabel}</div>}
              </div>
            );
          })}
          <div style={{ marginTop:8 }}>
            <AddBtn onClick={()=>addCustom(cat.k)} label="Add Issue" />
          </div>
          <div style={{ marginTop:12 }}>
            <label style={{ display:"block", fontSize:10, fontWeight:600, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4, fontFamily:F }}>Notes</label>
            <textarea value={(q.notes||{})[cat.k]||""} onChange={ev=>{const nq={...q,notes:{...(q.notes||{}),[cat.k]:ev.target.value}};so("qualification",nq);}} rows={2} placeholder="Key observations, evidence, gaps..."
              style={{ width:"100%", padding:"8px 10px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, fontSize:12, fontFamily:F, outline:"none", resize:"vertical", boxSizing:"border-box" }}
              onFocus={e=>e.target.style.borderColor=cat.c} onBlur={e=>e.target.style.borderColor=C.border} />
          </div>
        </Card>
      ))}
    </div>
  );
};
const OpptyInsights = withOppty(OpptyInsightsInner);

export default OpptyInsights;
