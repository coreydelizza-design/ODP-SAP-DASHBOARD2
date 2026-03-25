import { C, F, FM } from "../theme.js";

export const Input = ({ label, value, onChange, placeholder, type="text", style:sx }) => (
  <div style={{ marginBottom:12, ...sx }}>
    {label && <label style={{ display:"block", fontSize:11, fontWeight:600, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5, fontFamily:F }}>{label}</label>}
    <input type={type} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder||""}
      style={{ width:"100%", padding:"10px 12px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:14, fontFamily:F, outline:"none", boxSizing:"border-box", transition:"border-color 0.2s" }}
      onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border} />
  </div>
);

export const Textarea = ({ label, value, onChange, placeholder, rows=3 }) => (
  <div style={{ marginBottom:12 }}>
    {label && <label style={{ display:"block", fontSize:11, fontWeight:600, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5, fontFamily:F }}>{label}</label>}
    <textarea value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder||""} rows={rows}
      style={{ width:"100%", padding:"10px 12px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:14, fontFamily:F, outline:"none", resize:"vertical", boxSizing:"border-box", transition:"border-color 0.2s" }}
      onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border} />
  </div>
);

export const Select = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom:12 }}>
    {label && <label style={{ display:"block", fontSize:11, fontWeight:600, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5, fontFamily:F }}>{label}</label>}
    <select value={value||""} onChange={e=>onChange(e.target.value)}
      style={{ width:"100%", padding:"10px 12px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:14, fontFamily:F, outline:"none", cursor:"pointer", boxSizing:"border-box" }}>
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export const Card = ({ children, title, subtitle, accent, style:sx }) => (
  <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:24, marginBottom:20, borderLeft:accent?`3px solid ${accent}`:undefined, ...sx }}>
    {title && <h3 style={{ margin:"0 0 4px", fontSize:16, fontWeight:700, color:C.text, fontFamily:F }}>{title}</h3>}
    {subtitle && <p style={{ margin:"0 0 16px", fontSize:13, color:C.textDim, fontFamily:F }}>{subtitle}</p>}
    {children}
  </div>
);

export const Badge = ({ children, color=C.accent }) => (
  <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:50, fontSize:11, fontWeight:700, background:`${color}22`, color, fontFamily:F, letterSpacing:"0.03em" }}>{children}</span>
);

export const AddBtn = ({ onClick, label }) => (
  <button onClick={onClick} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", background:C.accentGlow, border:`1px dashed ${C.accent}`, borderRadius:8, color:C.accent, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:F }}>+ {label}</button>
);

export const DelBtn = ({ onClick }) => (
  <button onClick={onClick} style={{ width:28, height:28, borderRadius:6, border:`1px solid ${C.border}`, background:"none", color:C.red, cursor:"pointer", fontSize:14, flexShrink:0 }}>×</button>
);

export const SH = ({ title, description }) => (
  <div style={{ marginBottom:24 }}>
    <h2 style={{ margin:0, fontSize:24, fontWeight:800, color:C.white, fontFamily:F, letterSpacing:"-0.02em" }}>{title}</h2>
    {description && <p style={{ margin:"6px 0 0", fontSize:14, color:C.textDim, fontFamily:F, lineHeight:1.5 }}>{description}</p>}
  </div>
);

export const Grid = ({ cols=2, gap=16, children }) => (
  <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap }}>{children}</div>
);

export const ScorePill = ({ value, onChange }) => (
  <div style={{ display:"flex", gap:3 }}>
    {[0,1,2,3,4,5].map(v=>(
      <button key={v} onClick={()=>onChange(v)} style={{ width:28, height:28, borderRadius:6, border:value===v?`2px solid ${v<=1?C.red:v<=3?C.amber:C.green}`:`1px solid ${C.border}`, background:value===v?`${v<=1?C.red:v<=3?C.amber:C.green}22`:C.bg, color:value===v?(v<=1?C.red:v<=3?C.amber:C.green):C.textDim, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:FM, display:"flex", alignItems:"center", justifyContent:"center" }}>{v}</button>
    ))}
  </div>
);
