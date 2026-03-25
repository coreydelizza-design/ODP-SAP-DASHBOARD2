import { useState } from "react";
import { C, F, FM } from "../theme.js";
import { SH, Card, AddBtn, DelBtn } from "../components/ui.jsx";
import { DIMS, RADAR_COLORS, HL } from "../data.js";
import RadarChart from "../components/RadarChart.jsx";
import withOppty from "../components/withOppty.jsx";

const OpptyHealthInner = ({ oppty:o, setOppty:so }) => {
  const h=o.health;
  const snaps = o.healthSnapshots||[];
  const total=h.pain+h.power+h.vision+h.value+h.consensus;
  const pct=Math.round((total/30)*100); const hc=pct<40?C.red:pct<70?C.amber:C.green;

  const addSnapshot = () => {
    const snap = {
      id: Date.now().toString(36)+Math.random().toString(36).slice(2,5),
      label: "Update "+(snaps.length+1),
      date: new Date().toISOString().slice(0,10),
      scores: { ...h },
    };
    so("healthSnapshots", [...snaps, snap]);
  };
  const updateSnap = (idx, key, val) => {
    const a=[...snaps]; a[idx]={...a[idx], scores:{...a[idx].scores, [key]:val}}; so("healthSnapshots",a);
  };
  const updateSnapMeta = (idx, key, val) => {
    const a=[...snaps]; a[idx]={...a[idx],[key]:val}; so("healthSnapshots",a);
  };
  const deleteSnap = (idx) => {
    so("healthSnapshots", snaps.filter((_,i)=>i!==idx));
  };

  // Build radar layers: baseline first, then snapshots in order
  const layers = [{ label:"Baseline", scores:h, color:C.textDim }];
  snaps.forEach((s,i)=>{ layers.push({ label:s.label, scores:s.scores, color:RADAR_COLORS[i%RADAR_COLORS.length] }); });

  return (
    <div>
      <SH title="Opportunity Health" description={o.name||"Select or name an opportunity."} />

      {/* Health Score + Radar */}
      <Card style={{ textAlign:"center", padding:32 }}>
        <div style={{ fontSize:56, fontWeight:900, fontFamily:FM, color:hc, lineHeight:1 }}>{pct}%</div>
        <div style={{ fontSize:14, color:C.textMuted, marginTop:8, fontFamily:F }}>Deal Health — {o.name||"Untitled"}</div>
        <div style={{ display:"flex", justifyContent:"center", gap:16, marginTop:20, marginBottom:24 }}>
          {DIMS.map(x=>(
            <div key={x.l} style={{ padding:"12px 18px", background:C.bg, borderRadius:10, border:`1px solid ${C.border}`, minWidth:70 }}>
              <div style={{ fontSize:24, fontWeight:800, color:x.c, fontFamily:FM }}>{h[x.k]}</div>
              <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{x.l}</div>
            </div>
          ))}
        </div>

        {/* Radar Chart */}
        <RadarChart layers={layers} />

        {/* Legend */}
        <div style={{ display:"flex", justifyContent:"center", gap:16, marginTop:16, flexWrap:"wrap" }}>
          {layers.map((l,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ width:12, height:3, borderRadius:2, background:l.color, display:"inline-block" }} />
              <span style={{ fontSize:11, color:l.color, fontFamily:F, fontWeight:600 }}>{l.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Snapshot Cards */}
      {snaps.length>0 && (
        <div style={{ marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:C.text, fontFamily:F }}>Progress Snapshots</h3>
          </div>
          {snaps.map((snap,si)=>{
            const sc = snap.scores;
            const sTotal = (sc.pain||0)+(sc.power||0)+(sc.vision||0)+(sc.value||0)+(sc.consensus||0);
            const sPct = Math.round((sTotal/30)*100);
            const sCol = RADAR_COLORS[si%RADAR_COLORS.length];
            const delta = sPct - pct;
            return (
              <Card key={snap.id} accent={sCol} style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, flex:1 }}>
                    <div style={{ width:10, height:10, borderRadius:"50%", background:sCol, flexShrink:0 }} />
                    <input value={snap.label} onChange={e=>updateSnapMeta(si,"label",e.target.value)} placeholder="Snapshot label"
                      style={{ padding:"4px 8px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, fontSize:14, fontWeight:700, fontFamily:F, outline:"none", flex:1, maxWidth:200 }}
                      onFocus={e=>e.target.style.borderColor=sCol} onBlur={e=>e.target.style.borderColor=C.border} />
                    <input type="date" value={snap.date||""} onChange={e=>updateSnapMeta(si,"date",e.target.value)}
                      style={{ padding:"4px 8px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, color:C.textMuted, fontSize:12, fontFamily:F, outline:"none" }} />
                    <span style={{ fontSize:18, fontWeight:800, color:sCol, fontFamily:FM }}>{sPct}%</span>
                    <span style={{ fontSize:12, fontWeight:700, fontFamily:FM, color:delta>0?C.green:delta<0?C.red:C.textDim }}>
                      {delta>0?"+":""}{delta}%
                    </span>
                  </div>
                  <DelBtn onClick={()=>deleteSnap(si)} />
                </div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {DIMS.map(d=>(
                    <div key={d.k} style={{ display:"flex", alignItems:"center", gap:4, padding:"6px 10px", background:C.bg, borderRadius:8, border:`1px solid ${C.border}` }}>
                      <span style={{ fontSize:11, fontWeight:600, color:d.c, fontFamily:F, width:68 }}>{d.l}</span>
                      <div style={{ display:"flex", gap:2 }}>
                        {[0,1,2,3,4,5,6].map(v=>(
                          <button key={v} onClick={()=>updateSnap(si,d.k,v)} style={{
                            width:24, height:24, borderRadius:5, fontSize:11, fontWeight:700, fontFamily:FM,
                            cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                            border:(sc[d.k]||0)===v?`2px solid ${sCol}`:`1px solid ${C.border}`,
                            background:(sc[d.k]||0)===v?`${sCol}22`:C.surface,
                            color:(sc[d.k]||0)===v?sCol:C.textDim,
                          }}>{v}</button>
                        ))}
                      </div>
                      {(sc[d.k]||0)!==(h[d.k]||0) && (
                        <span style={{ fontSize:10, fontWeight:700, fontFamily:FM, marginLeft:4,
                          color:(sc[d.k]||0)>(h[d.k]||0)?C.green:C.red }}>
                          {(sc[d.k]||0)>(h[d.k]||0)?"+":""}{(sc[d.k]||0)-(h[d.k]||0)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Snapshot Button */}
      <div style={{ marginBottom:24 }}>
        <AddBtn onClick={addSnapshot} label="Add Progress Snapshot" />
      </div>

      {/* Baseline Score Cards */}
      <div style={{ marginBottom:12 }}>
        <h3 style={{ margin:"0 0 4px", fontSize:14, fontWeight:700, color:C.textMuted, fontFamily:F, textTransform:"uppercase", letterSpacing:"0.06em" }}>Baseline Scores</h3>
        <p style={{ margin:"0 0 12px", fontSize:12, color:C.textDim, fontFamily:F }}>Set the original health assessment. These scores form the baseline layer on the radar chart.</p>
      </div>
      {DIMS.map(dim=>(
        <Card key={dim.k} accent={dim.c}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:C.text, fontFamily:F }}>{dim.l}</h3>
            <span style={{ fontSize:20, fontWeight:800, color:dim.c, fontFamily:FM }}>{h[dim.k]}/6</span>
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {HL[dim.k].map((label,lvl)=>(
              <button key={lvl} onClick={()=>so("health",{...h,[dim.k]:lvl})} style={{
                padding:"6px 12px", borderRadius:8, fontSize:12, fontFamily:F, cursor:"pointer",
                border:h[dim.k]===lvl?`2px solid ${dim.c}`:`1px solid ${C.border}`,
                background:h[dim.k]===lvl?`${dim.c}22`:C.bg,
                color:h[dim.k]===lvl?dim.c:C.textDim, fontWeight:h[dim.k]===lvl?700:400,
              }}><span style={{ fontFamily:FM, marginRight:4 }}>{lvl}</span> {label}</button>
            ))}
          </div>
          <div style={{ marginTop:12 }}>
            <label style={{ display:"block", fontSize:10, fontWeight:600, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4, fontFamily:F }}>Notes</label>
            <textarea value={(o.healthNotes||{})[dim.k]||""} onChange={ev=>so("healthNotes",{...(o.healthNotes||{}),[dim.k]:ev.target.value})} rows={2} placeholder="Evidence, observations, next steps..."
              style={{ width:"100%", padding:"8px 10px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, fontSize:12, fontFamily:F, outline:"none", resize:"vertical", boxSizing:"border-box" }}
              onFocus={e=>e.target.style.borderColor=dim.c} onBlur={e=>e.target.style.borderColor=C.border} />
          </div>
        </Card>
      ))}
    </div>
  );
};
const OpptyHealth = withOppty(OpptyHealthInner);

export default OpptyHealth;
