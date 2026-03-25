import { C, F, FM } from "../theme.js";
import { getOpptyStatus } from "../data.js";

const OpptyBar = ({ opportunities, activeId, onSelect, onAdd, onDelete }) => (
  <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:24, alignItems:"center" }}>
    {opportunities.map(o => {
      const h = o.health;
      const total = h.pain+h.power+h.vision+h.value+h.consensus;
      const pct = Math.round((total/30)*100);
      const col = pct<40?C.red:pct<70?C.amber:C.green;
      const active = o.id===activeId;
      const status = getOpptyStatus(o);
      const statusCol = status.isActive ? C.green : C.amber;
      return (
        <button key={o.id} onClick={()=>onSelect(o.id)} style={{
          display:"flex", alignItems:"center", gap:10, padding:"10px 16px",
          background:active?C.accentGlow:C.surface,
          border:active?`2px solid ${C.accent}`:`1px solid ${C.border}`,
          borderRadius:10, cursor:"pointer", fontFamily:F, transition:"all 0.15s",
          minWidth:200, position:"relative",
        }}>
          <div style={{ width:36, height:36, borderRadius:8, background:`${col}18`, border:`2px solid ${col}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:14, fontWeight:800, color:col, fontFamily:FM }}>{pct}</span>
          </div>
          <div style={{ textAlign:"left", flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:13, fontWeight:700, color:active?C.accent:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{o.name||"Untitled Opportunity"}</span>
              <span style={{ fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:50, background:`${statusCol}22`, color:statusCol, letterSpacing:"0.05em", flexShrink:0 }}>{status.isActive?"ACTIVE":"DRAFT"}</span>
            </div>
            <div style={{ fontSize:11, color:C.textDim }}>{o.clientName||"No client"} · {status.filled}/{status.total} fields</div>
          </div>
          {opportunities.length>1 && (
            <span onClick={e=>{e.stopPropagation();onDelete(o.id);}} style={{ position:"absolute", top:4, right:6, fontSize:12, color:C.textDim, cursor:"pointer", padding:"2px 4px", borderRadius:4 }}
              onMouseEnter={e=>e.target.style.color=C.red}
              onMouseLeave={e=>e.target.style.color=C.textDim}>×</span>
          )}
        </button>
      );
    })}
    <button onClick={onAdd} style={{ display:"flex", alignItems:"center", justifyContent:"center", width:44, height:58, background:C.accentGlow, border:`1px dashed ${C.accent}`, borderRadius:10, color:C.accent, fontSize:24, cursor:"pointer", fontWeight:300 }}>+</button>
  </div>
);

export default OpptyBar;
