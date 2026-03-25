import { C, F, FM } from "../theme.js";
import { SH, Card, Badge, AddBtn } from "../components/ui.jsx";
import { getOpptyStatus, blankOppty } from "../data.js";

const OpptyDashboard = ({ data, sf, setSection }) => {
  const opps = data.opportunities;
  const statuses = opps.map(o=>getOpptyStatus(o));
  const activeCount = statuses.filter(s=>s.isActive).length;
  const draftCount = opps.length - activeCount;
  const totalMrr = opps.reduce((s,o)=>s+(parseFloat(o.mrr)||0),0);
  const totalTcv = opps.reduce((s,o)=>s+(parseFloat(o.tcv)||0),0);
  const avgHealth = opps.length ? Math.round(opps.reduce((s,o)=>{const h=o.health;return s+((h.pain+h.power+h.vision+h.value+h.consensus)/30)*100;},0)/opps.length) : 0;
  const healthCol = avgHealth<40?C.red:avgHealth<70?C.amber:C.green;

  return (
    <div>
      <SH title="Opportunity Dashboard" description={`Tracking ${opps.length} opportunit${opps.length===1?"y":"ies"} across this account.`} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:20 }}>
        {[
          { label:"Active", value:activeCount, color:C.green },
          { label:"Draft", value:draftCount, color:C.amber },
          { label:"Avg Health", value:`${avgHealth}%`, color:healthCol },
          { label:"Total MRR", value:`$${totalMrr.toLocaleString()}`, color:C.green },
          { label:"Total TCV", value:`$${totalTcv.toLocaleString()}`, color:C.purple },
        ].map(m=>(
          <Card key={m.label} style={{ textAlign:"center", padding:20 }}>
            <div style={{ fontSize:28, fontWeight:900, fontFamily:FM, color:m.color }}>{m.value}</div>
            <div style={{ fontSize:11, color:C.textMuted, marginTop:4, fontFamily:F, textTransform:"uppercase", letterSpacing:"0.06em" }}>{m.label}</div>
          </Card>
        ))}
      </div>
      <Card title="All Opportunities">
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:F, fontSize:13 }}>
            <thead><tr>{["","Status","Name","Client","Stage","Review","MRR","TCV","Health","Pain","Power","Vision","Value","Consensus"].map(h=>(
              <th key={h} style={{ padding:"10px 10px", fontSize:10, fontWeight:700, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", textAlign:"left", borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>{h}</th>
            ))}</tr></thead>
            <tbody>{opps.map((o,i)=>{
              const h=o.health;const tot=h.pain+h.power+h.vision+h.value+h.consensus;const pct=Math.round((tot/30)*100);const col=pct<40?C.red:pct<70?C.amber:C.green;
              const st=getOpptyStatus(o);const stCol=st.isActive?C.green:C.amber;const completePct=Math.round((st.filled/st.total)*100);
              return (
                <tr key={o.id} style={{ borderBottom:`1px solid ${C.border}22`, cursor:"pointer" }}
                  onClick={()=>{sf("activeOpptyId",o.id);setSection("oppty-review");}}
                  onMouseEnter={e=>e.currentTarget.style.background=C.surfaceHover}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"10px 10px" }}><span style={{ width:24, height:24, borderRadius:6, background:`${C.accent}22`, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:C.accent, fontFamily:FM }}>{i+1}</span></td>
                  <td style={{ padding:"10px 10px" }}><span style={{ fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:50, background:`${stCol}22`, color:stCol, letterSpacing:"0.05em" }}>{st.isActive?"ACTIVE":"DRAFT"}</span></td>
                  <td style={{ padding:"10px 10px", fontWeight:600, color:C.text }}>{o.name||"Untitled"}</td>
                  <td style={{ padding:"10px 10px", color:C.textMuted }}>{o.clientName||"—"}</td>
                  <td style={{ padding:"10px 10px" }}><Badge color={C.accent}>{o.pipelineStage||"—"}</Badge></td>
                  <td style={{ padding:"10px 10px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <div style={{ width:48, height:6, background:C.bg, borderRadius:3, overflow:"hidden" }}><div style={{ height:"100%", width:`${completePct}%`, background:st.isActive?C.green:C.amber, borderRadius:3, transition:"width 0.3s" }} /></div>
                      <span style={{ fontSize:11, fontFamily:FM, color:st.isActive?C.green:C.textDim }}>{completePct}%</span>
                    </div>
                  </td>
                  <td style={{ padding:"10px 10px", fontFamily:FM, color:C.green }}>{o.mrr?`$${Number(o.mrr).toLocaleString()}`:"—"}</td>
                  <td style={{ padding:"10px 10px", fontFamily:FM, color:C.purple }}>{o.tcv?`$${Number(o.tcv).toLocaleString()}`:"—"}</td>
                  <td style={{ padding:"10px 10px" }}><span style={{ padding:"3px 10px", borderRadius:50, fontSize:12, fontWeight:800, background:`${col}22`, color:col, fontFamily:FM }}>{pct}%</span></td>
                  {["pain","power","vision","value","consensus"].map(k=>(
                    <td key={k} style={{ padding:"10px 8px", textAlign:"center", fontSize:13, fontWeight:700, fontFamily:FM, color:h[k]<=1?C.red:h[k]<=3?C.amber:C.green }}>{h[k]}</td>
                  ))}
                </tr>
              );
            })}</tbody>
          </table>
        </div>
        <div style={{ marginTop:16 }}>
          <AddBtn onClick={()=>{const n=blankOppty();sf({opportunities:[...data.opportunities,n],activeOpptyId:n.id});setSection("oppty-review");}} label="New Opportunity" />
        </div>
      </Card>
    </div>
  );
};

export default OpptyDashboard;
