import { C, F, FM } from "../theme.js";
import { SH, Card, AddBtn, DelBtn } from "../components/ui.jsx";
import withOppty from "../components/withOppty.jsx";

const CollabPlanInner = ({ oppty:o, setOppty:so }) => (
  <div>
    <SH title="Collaboration Plan" description={o.name||"Plan milestones for this deal."} />
    <Card>
      <div style={{ background:C.bg, borderRadius:8, padding:14, marginBottom:16, border:`1px solid ${C.border}`, fontSize:12, color:C.textMuted, lineHeight:1.6 }}>
        <span style={{ fontWeight:700, color:C.accent, textTransform:"uppercase", letterSpacing:"0.06em" }}>Why? </span>
        Identify milestones early, establish leverage, demonstrate mastery, and hold customer accountable.
      </div>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:F, fontSize:13 }}>
          <thead><tr>{["Event","Week Of","✓","Responsible","Resources","Go/No-go","Billable",""].map(h=><th key={h} style={{ padding:"8px 10px", fontSize:10, fontWeight:700, color:C.textMuted, textTransform:"uppercase", textAlign:"left", borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>{h}</th>)}</tr></thead>
          <tbody>{o.collabPlan.map((row,i)=>(
            <tr key={i} style={{ borderBottom:`1px solid ${C.border}22` }}>
              <td style={{ padding:"4px 6px" }}><input value={row.event} onChange={e=>{const a=[...o.collabPlan];a[i]={...a[i],event:e.target.value};so("collabPlan",a);}} style={{ width:"100%", padding:"7px 8px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, fontSize:13, fontFamily:F, outline:"none", boxSizing:"border-box", minWidth:150 }} /></td>
              <td style={{ padding:"4px 6px" }}><input type="date" value={row.weekOf} onChange={e=>{const a=[...o.collabPlan];a[i]={...a[i],weekOf:e.target.value};so("collabPlan",a);}} style={{ padding:"7px 8px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, fontSize:13, fontFamily:F, outline:"none" }} /></td>
              <td style={{ padding:"4px 6px", textAlign:"center" }}><input type="checkbox" checked={row.done} onChange={e=>{const a=[...o.collabPlan];a[i]={...a[i],done:e.target.checked};so("collabPlan",a);}} style={{ width:18, height:18, cursor:"pointer", accentColor:C.green }} /></td>
              {["responsible","resources","goNoGo","billable"].map(f=>(
                <td key={f} style={{ padding:"4px 6px" }}><input value={row[f]} onChange={e=>{const a=[...o.collabPlan];a[i]={...a[i],[f]:e.target.value};so("collabPlan",a);}} style={{ width:"100%", padding:"7px 8px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, fontSize:13, fontFamily:F, outline:"none", boxSizing:"border-box", minWidth:80 }} /></td>
              ))}
              <td><DelBtn onClick={()=>{const a=o.collabPlan.filter((_,j)=>j!==i);so("collabPlan",a.length?a:[{event:"",weekOf:"",done:false,responsible:"",resources:"",goNoGo:"",billable:""}]);}} /></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div style={{ marginTop:12 }}><AddBtn onClick={()=>so("collabPlan",[...o.collabPlan,{event:"",weekOf:"",done:false,responsible:"",resources:"",goNoGo:"",billable:""}])} label="Add Event" /></div>
    </Card>
  </div>
);
const CollabPlan = withOppty(CollabPlanInner);

export default CollabPlan;
