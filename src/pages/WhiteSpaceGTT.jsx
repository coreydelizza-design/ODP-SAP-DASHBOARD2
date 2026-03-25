import { C, F, FM } from "../theme.js";
import { SH, Card } from "../components/ui.jsx";

const WhiteSpaceGTT = ({ data, sf }) => (
  <div>
    <SH title="White Space / GTT Services" description="Map services, providers, and contract details to find opportunities." />
    <Card>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:F, fontSize:13 }}>
          <thead><tr>{["Service","Region","Provider","Est. Spend ($)","Contract End","Comment"].map(h=><th key={h} style={{ padding:"10px 12px", fontSize:11, fontWeight:700, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", textAlign:"left", borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>{h}</th>)}</tr></thead>
          <tbody>{data.gttServices.map((s,i)=>(
            <tr key={i} style={{ borderBottom:`1px solid ${C.border}22` }}>
              <td style={{ padding:"6px 12px", fontWeight:600, color:C.text, whiteSpace:"nowrap" }}>{s.service}</td>
              {["region","provider","spend","contractEnd","comment"].map(f=>(
                <td key={f} style={{ padding:"4px 6px" }}><input value={s[f]||""} onChange={e=>{const a=[...data.gttServices];a[i]={...a[i],[f]:e.target.value};sf("gttServices",a);}} placeholder="—" style={{ width:"100%", padding:"7px 8px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, fontSize:13, fontFamily:f==="spend"?FM:F, outline:"none", boxSizing:"border-box" }} /></td>
              ))}
            </tr>
          ))}</tbody>
        </table>
      </div>
    </Card>
  </div>
);

export default WhiteSpaceGTT;
