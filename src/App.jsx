import { useState, useEffect } from "react";

const C = {
  bg: "#1A1A1E", surface: "#242428", surfaceHover: "#2C2C31",
  border: "#38383E", borderLight: "#4A4A52",
  accent: "#3B82F6", accentGlow: "rgba(59,130,246,0.15)", accentSoft: "#1E3A5F",
  green: "#10B981", greenGlow: "rgba(16,185,129,0.12)",
  amber: "#F59E0B", amberGlow: "rgba(245,158,11,0.12)",
  red: "#EF4444", redGlow: "rgba(239,68,68,0.12)",
  purple: "#8B5CF6", purpleGlow: "rgba(139,92,246,0.12)",
  cyan: "#06B6D4",
  text: "#E2E8F0", textMuted: "#94A3B8", textDim: "#64748B", white: "#FFF",
};
const F = `'DM Sans',system-ui,sans-serif`;
const FM = `'JetBrains Mono','Fira Code',monospace`;

const blankOppty = () => ({
  id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
  name: "", clientName: "", clientRep: "", owner: "", startDate: "", forecastClose: "",
  pipelineStage: "", creditLimit: "Yes", opptyId: "", powerIdentified: "No",
  gttExecs: "", custExecs: "", bizObjectives: "", compellingEvent: "",
  proposedSolution: "", bidStrategy: "", gttStrengths: "", gttWeaknesses: "",
  compStrengths: "", compWeaknesses: "",
  commercialProcess: "", mrr: "", tcv: "", margin: "", contractLength: "",
  sellingPartner: "", tsd: "", subAgent: "",
  health: { pain: 0, power: 0, vision: 0, value: 0, consensus: 0 },
  healthSnapshots: [],
  healthNotes: { pain:"", power:"", vision:"", value:"", consensus:"" },
  qualification: {
    decisionMaking: [0,0,0,0], valueProp: [0,0,0,0],
    productOps: [0,0,0,0], commercialRisk: [0,0,0,0],
    compellingEvent: [0,0,0,0],
    notes: { decisionMaking:"", valueProp:"", productOps:"", commercialRisk:"", compellingEvent:"" },
    custom: { decisionMaking:[], valueProp:[], productOps:[], commercialRisk:[], compellingEvent:[] },
  },
  collabPlan: [{ event:"", weekOf:"", done:false, responsible:"", resources:"", goNoGo:"", billable:"" }],
});

const REQUIRED_FIELDS = [
  "name","clientName","clientRep","owner","startDate","forecastClose",
  "pipelineStage","opptyId","gttExecs","custExecs",
  "commercialProcess","mrr","tcv","margin","contractLength",
  "sellingPartner","tsd","subAgent",
  "bizObjectives","compellingEvent","proposedSolution","bidStrategy",
  "gttStrengths","gttWeaknesses","compStrengths","compWeaknesses",
];
const FIELD_LABELS = {
  name:"Opportunity Name", clientName:"Client Name", clientRep:"Client Rep", owner:"Owner",
  startDate:"Start Date", forecastClose:"Forecast Close", pipelineStage:"Pipeline Stage",
  opptyId:"Opportunity ID", gttExecs:"GTT Executives", custExecs:"Customer Executives",
  commercialProcess:"Commercial Process", mrr:"Est. MRR", tcv:"Est. TCV",
  margin:"Direct Margin %", contractLength:"Contract Length", sellingPartner:"Selling Partner",
  tsd:"TSD", subAgent:"Sub-Agent", bizObjectives:"Business Objectives",
  compellingEvent:"Compelling Event", proposedSolution:"Proposed Solution",
  bidStrategy:"Bid Strategy", gttStrengths:"GTT Strengths", gttWeaknesses:"GTT Weaknesses",
  compStrengths:"Competitor Strengths", compWeaknesses:"Competitor Weaknesses",
};
const getOpptyStatus = (o) => {
  const filled = REQUIRED_FIELDS.filter(f => (o[f]||"").toString().trim() !== "");
  return { filled: filled.length, total: REQUIRED_FIELDS.length, isActive: filled.length === REQUIRED_FIELDS.length, missing: REQUIRED_FIELDS.filter(f => !(o[f]||"").toString().trim()) };
};

const defaultData = {
  accountName: "", salesperson: "", dateCreated: "", dateUpdated: "",
  overviewOfBusiness: "", cultureValues: "", accountStatus: "Growth",
  relationshipHistory: "", whiteSpaces: "", relationshipStatus: "Technical Expert",
  valueToCustomer: "",
  performance: {
    revenue: { twoYearAgo:"", priorYear:"", current:"", forecast:"" },
    target: { twoYearAgo:"", priorYear:"", current:"", forecast:"" },
  },
  industryIssues: [{ issue:"", impact:"", opportunity:"", insight:"" }],
  runningQuestions: [{ question:"", actionStep:"" }],
  stakeholders: [{ name:"", reporting:"", role:"Unknown", influence:"Unknown", businessNeeds:"", personalNeeds:"", alignment:"Unknown", yourAccess:"None", competitorAccess:"Unknown" }],
  competitors: [{ name:"", strengths:"", vulnerabilities:"", shareOfWallet:"" }],
  overallStrengths: ["","",""], overallVulnerabilities: ["","",""],
  strengthsToLeverage: ["","",""], vulnerabilitiesToAddress: ["","",""],
  actionItems: [{ objective:"", action:"", byWhen:"", owner:"", obstacle:"", planB:"" }],
  gttServices: [
    { service:"Managed SD-WAN", region:"", provider:"", spend:"", contractEnd:"", comment:"" },
    { service:"Cloud Security", region:"", provider:"", spend:"", contractEnd:"", comment:"" },
    { service:"Managed Firewall", region:"", provider:"", spend:"", contractEnd:"", comment:"" },
    { service:"DDoS Mitigation", region:"", provider:"", spend:"", contractEnd:"", comment:"" },
    { service:"MDR", region:"", provider:"", spend:"", contractEnd:"", comment:"" },
    { service:"IP Transit", region:"", provider:"", spend:"", contractEnd:"", comment:"" },
    { service:"Dedicated Internet", region:"", provider:"", spend:"", contractEnd:"", comment:"" },
    { service:"Broadband", region:"", provider:"", spend:"", contractEnd:"", comment:"" },
  ],
  orgValues: "", goals: "", objectives: "", issues: "", initiatives: "",
  opportunities: [blankOppty()],
  activeOpptyId: null,
};

const NAV = [
  { id:"overview", label:"Account Overview", icon:"◉", group:"ASSESS" },
  { id:"industry", label:"Industry Analysis", icon:"◈", group:"ASSESS" },
  { id:"stakeholders", label:"Stakeholders", icon:"◇", group:"ASSESS" },
  { id:"competitive", label:"Competitive Position", icon:"⬡", group:"ASSESS" },
  { id:"whitespace", label:"White Space / GTT", icon:"▣", group:"ASSESS" },
  { id:"strategy-map", label:"Strategy Map", icon:"△", group:"STRATEGIZE" },
  { id:"strategy", label:"Develop Strategy", icon:"⬢", group:"STRATEGIZE" },
  { id:"action-plan", label:"Action Plan", icon:"▶", group:"STRATEGIZE" },
  { id:"oppty-dashboard", label:"Opportunity Dashboard", icon:"◐", group:"OPPORTUNITIES" },
  { id:"oppty-review", label:"Opportunity Review", icon:"●", group:"OPPORTUNITIES" },
  { id:"oppty-health", label:"Opportunity Health", icon:"♡", group:"OPPORTUNITIES" },
  { id:"oppty-insights", label:"Qualification", icon:"★", group:"OPPORTUNITIES" },
  { id:"collab-plan", label:"Collaboration Plan", icon:"☰", group:"OPPORTUNITIES" },
  { id:"questions", label:"Running Questions", icon:"?", group:"TRACK" },
];
const GROUPS = ["ASSESS","STRATEGIZE","OPPORTUNITIES","TRACK"];

// ── UI Primitives ──
const Input = ({ label, value, onChange, placeholder, type="text", style:sx }) => (
  <div style={{ marginBottom:12, ...sx }}>
    {label && <label style={{ display:"block", fontSize:11, fontWeight:600, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5, fontFamily:F }}>{label}</label>}
    <input type={type} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder||""}
      style={{ width:"100%", padding:"10px 12px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:14, fontFamily:F, outline:"none", boxSizing:"border-box", transition:"border-color 0.2s" }}
      onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border} />
  </div>
);
const Textarea = ({ label, value, onChange, placeholder, rows=3 }) => (
  <div style={{ marginBottom:12 }}>
    {label && <label style={{ display:"block", fontSize:11, fontWeight:600, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5, fontFamily:F }}>{label}</label>}
    <textarea value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder||""} rows={rows}
      style={{ width:"100%", padding:"10px 12px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:14, fontFamily:F, outline:"none", resize:"vertical", boxSizing:"border-box", transition:"border-color 0.2s" }}
      onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border} />
  </div>
);
const Select = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom:12 }}>
    {label && <label style={{ display:"block", fontSize:11, fontWeight:600, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5, fontFamily:F }}>{label}</label>}
    <select value={value||""} onChange={e=>onChange(e.target.value)}
      style={{ width:"100%", padding:"10px 12px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:14, fontFamily:F, outline:"none", cursor:"pointer", boxSizing:"border-box" }}>
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);
const Card = ({ children, title, subtitle, accent, style:sx }) => (
  <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:24, marginBottom:20, borderLeft:accent?`3px solid ${accent}`:undefined, ...sx }}>
    {title && <h3 style={{ margin:"0 0 4px", fontSize:16, fontWeight:700, color:C.text, fontFamily:F }}>{title}</h3>}
    {subtitle && <p style={{ margin:"0 0 16px", fontSize:13, color:C.textDim, fontFamily:F }}>{subtitle}</p>}
    {children}
  </div>
);
const Badge = ({ children, color=C.accent }) => (
  <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:50, fontSize:11, fontWeight:700, background:`${color}22`, color, fontFamily:F, letterSpacing:"0.03em" }}>{children}</span>
);
const AddBtn = ({ onClick, label }) => (
  <button onClick={onClick} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", background:C.accentGlow, border:`1px dashed ${C.accent}`, borderRadius:8, color:C.accent, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:F }}>+ {label}</button>
);
const DelBtn = ({ onClick }) => (
  <button onClick={onClick} style={{ width:28, height:28, borderRadius:6, border:`1px solid ${C.border}`, background:"none", color:C.red, cursor:"pointer", fontSize:14, flexShrink:0 }}>×</button>
);
const SH = ({ title, description }) => (
  <div style={{ marginBottom:24 }}>
    <h2 style={{ margin:0, fontSize:24, fontWeight:800, color:C.white, fontFamily:F, letterSpacing:"-0.02em" }}>{title}</h2>
    {description && <p style={{ margin:"6px 0 0", fontSize:14, color:C.textDim, fontFamily:F, lineHeight:1.5 }}>{description}</p>}
  </div>
);
const Grid = ({ cols=2, gap=16, children }) => (
  <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap }}>{children}</div>
);
const ScorePill = ({ value, onChange }) => (
  <div style={{ display:"flex", gap:3 }}>
    {[0,1,2,3,4,5].map(v=>(
      <button key={v} onClick={()=>onChange(v)} style={{ width:28, height:28, borderRadius:6, border:value===v?`2px solid ${v<=1?C.red:v<=3?C.amber:C.green}`:`1px solid ${C.border}`, background:value===v?`${v<=1?C.red:v<=3?C.amber:C.green}22`:C.bg, color:value===v?(v<=1?C.red:v<=3?C.amber:C.green):C.textDim, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:FM, display:"flex", alignItems:"center", justifyContent:"center" }}>{v}</button>
    ))}
  </div>
);

// ── Opportunity Selector Bar ──
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

// ── HEALTH DATA ──
const HL = {
  pain:["No identification of need","Customer admitted need","Sponsor confirms documented Pain","Pain discussion with Power","Impact across org explored with Power","Power admitted compelling reason","Power confirmed link to strategy"],
  power:["Power not known","Key players identified by Sponsor","Power identified by Sponsor","Access to Power documented","Power structure confirmed","Collaboration Plan started","Power approved contract"],
  vision:["No vision","Vision discussion with Sponsor","Vision confirmed with Sponsor","Vision discussion with Power","Power agrees solution meets Vision","Implementation plan approved","Proof of solution approved"],
  value:["No value established","Value drivers identified","Value quantified with Sponsor","Value confirmed with Power","Value differentiated","Business case approved","ROI validated"],
  consensus:["No consensus activities","Key stakeholders identified","Individual buy-in","Cross-functional alignment","Evaluation criteria agreed","Final consensus building","Full organizational consensus"],
};
const QQ = {
  decisionMaking:["We know all key players","Strong relationships with key players","Understand approval process","Understand decision maker's KPIs"],
  valueProp:["Compelling events identified & verified","Customer agrees GTT delivers outcome","Value is differentiated","GTT invited to negotiate"],
  productOps:["Can win with standard solution","Standard processes sufficient","Can meet delivery timeline","Low product dev requirements"],
  commercialRisk:["Passes financial hurdles","Credit & payment risk is low","Can invoice with existing systems","Commercial terms acceptable"],
  compellingEvent:["Quantified financial impact of inaction is confirmed","Sponsor's career, credibility, or role depends on outcome","Hard deadline exists that cannot be moved","Operational disruption or competitive loss without action"],
};

// ── SECTION COMPONENTS ──
const AccountOverview = ({ data, sf }) => (
  <div>
    <SH title="Account Overview" description="High-level account information, business overview, and relationship status." />
    <Grid>
      <Card title="Account Information" accent={C.accent}>
        <Input label="Account Name" value={data.accountName} onChange={v=>sf("accountName",v)} placeholder="e.g. Acme Corp" />
        <Input label="Salesperson" value={data.salesperson} onChange={v=>sf("salesperson",v)} />
        <Grid><Input label="Date Created" type="date" value={data.dateCreated} onChange={v=>sf("dateCreated",v)} /><Input label="Date Updated" type="date" value={data.dateUpdated} onChange={v=>sf("dateUpdated",v)} /></Grid>
        <Select label="Account Status" value={data.accountStatus} onChange={v=>sf("accountStatus",v)} options={["Retention","Growth","Risk"]} />
        <Select label="Relationship Status" value={data.relationshipStatus} onChange={v=>sf("relationshipStatus",v)} options={["Trusted Advisor","Technical Expert","Product Provider","Professional Visitor"]} />
      </Card>
      <Card title="Business Profile" accent={C.purple}>
        <Textarea label="Overview of Business" value={data.overviewOfBusiness} onChange={v=>sf("overviewOfBusiness",v)} rows={3} />
        <Textarea label="Culture / Values" value={data.cultureValues} onChange={v=>sf("cultureValues",v)} rows={2} />
        <Textarea label="Value You Bring" value={data.valueToCustomer} onChange={v=>sf("valueToCustomer",v)} rows={2} />
      </Card>
    </Grid>
    <Grid>
      <Card title="Relationship History" accent={C.green}><Textarea value={data.relationshipHistory} onChange={v=>sf("relationshipHistory",v)} rows={4} placeholder="Summary of relationship, business units worked with..." /></Card>
      <Card title="White Space Opportunities" accent={C.amber}><Textarea value={data.whiteSpaces} onChange={v=>sf("whiteSpaces",v)} rows={4} placeholder="Identified gaps, new product opportunities..." /></Card>
    </Grid>
    <Card title="Account Performance" subtitle="Revenue and targets across years.">
      <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:F }}>
        <thead><tr>{["","2 Years Ago","Prior Year","Current Year","Forecast"].map(h=><th key={h} style={{ padding:"8px 12px", fontSize:11, fontWeight:700, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", textAlign:"left", borderBottom:`1px solid ${C.border}` }}>{h}</th>)}</tr></thead>
        <tbody>{["revenue","target"].map(row=>(
          <tr key={row}><td style={{ padding:"8px 12px", fontSize:13, fontWeight:600, color:C.text, textTransform:"capitalize" }}>{row}</td>
            {["twoYearAgo","priorYear","current","forecast"].map(col=>(
              <td key={col} style={{ padding:"4px 8px" }}><input value={data.performance[row][col]||""} onChange={e=>{const p={...data.performance};p[row]={...p[row],[col]:e.target.value};sf("performance",p);}} placeholder="$0" style={{ width:"100%", padding:"8px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, fontSize:14, fontFamily:FM, outline:"none", boxSizing:"border-box" }} /></td>
            ))}</tr>
        ))}</tbody>
      </table>
    </Card>
  </div>
);

const IndustryAnalysis = ({ data, sf }) => (
  <div>
    <SH title="Industry Analysis" description="Industry issues impacting your customer and resulting opportunities." />
    <Card title="Reference: Types of Industry Issues">
      <Grid cols={4} gap={12}>
        {[{c:"Resources",i:["Supply & demand","Capital","Labor","R&D"]},{c:"Market",i:["Economic climate","Preferences","Market size","PR"]},{c:"Competitive",i:["New entrants","Upgrades","Mergers","Price cuts"]},{c:"Regulatory",i:["Gov rules","Local regs","Compliance"]}].map(x=>(
          <div key={x.c} style={{ padding:12, background:C.bg, borderRadius:8, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.accent, marginBottom:8, fontFamily:F, textTransform:"uppercase" }}>{x.c}</div>
            {x.i.map(i=><div key={i} style={{ fontSize:12, color:C.textMuted, marginBottom:3 }}>• {i}</div>)}
          </div>
        ))}
      </Grid>
    </Card>
    <Card title="Customer Issues, Impact & Insights">
      {data.industryIssues.map((item,i)=>(
        <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr auto", gap:8, marginBottom:8, alignItems:"start" }}>
          <Input placeholder="Industry Issue" value={item.issue} onChange={v=>{const a=[...data.industryIssues];a[i]={...a[i],issue:v};sf("industryIssues",a);}} />
          <Input placeholder="Impact" value={item.impact} onChange={v=>{const a=[...data.industryIssues];a[i]={...a[i],impact:v};sf("industryIssues",a);}} />
          <Input placeholder="Opportunity" value={item.opportunity} onChange={v=>{const a=[...data.industryIssues];a[i]={...a[i],opportunity:v};sf("industryIssues",a);}} />
          <Input placeholder="Insight" value={item.insight} onChange={v=>{const a=[...data.industryIssues];a[i]={...a[i],insight:v};sf("industryIssues",a);}} />
          <div style={{ marginTop:22 }}><DelBtn onClick={()=>{const a=data.industryIssues.filter((_,j)=>j!==i);sf("industryIssues",a.length?a:[{issue:"",impact:"",opportunity:"",insight:""}]);}} /></div>
        </div>
      ))}
      <AddBtn onClick={()=>sf("industryIssues",[...data.industryIssues,{issue:"",impact:"",opportunity:"",insight:""}])} label="Add Issue" />
    </Card>
  </div>
);

const Stakeholders = ({ data, sf }) => (
  <div>
    <SH title="Assess Stakeholders" description="Identify stakeholders and attributes. Don't guess — update Running Questions if unsure." />
    {data.stakeholders.map((s,i)=>(
      <Card key={i} accent={s.alignment==="Coach"?C.green:s.alignment==="Ally"?C.accent:s.alignment==="Critic"?C.red:C.border}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <Badge color={s.alignment==="Coach"?C.green:s.alignment==="Ally"?C.accent:s.alignment==="Critic"?C.red:C.textDim}>{s.alignment||"Unknown"}</Badge>
          <DelBtn onClick={()=>{const a=data.stakeholders.filter((_,j)=>j!==i);sf("stakeholders",a.length?a:[{name:"",reporting:"",role:"Unknown",influence:"Unknown",businessNeeds:"",personalNeeds:"",alignment:"Unknown",yourAccess:"None",competitorAccess:"Unknown"}]);}} />
        </div>
        <Grid cols={3}><Input label="Name & Title" value={s.name} onChange={v=>{const a=[...data.stakeholders];a[i]={...a[i],name:v};sf("stakeholders",a);}} /><Input label="Reports To" value={s.reporting} onChange={v=>{const a=[...data.stakeholders];a[i]={...a[i],reporting:v};sf("stakeholders",a);}} /><Select label="Role" value={s.role} onChange={v=>{const a=[...data.stakeholders];a[i]={...a[i],role:v};sf("stakeholders",a);}} options={["ED","I","CC","Unknown"]} /></Grid>
        <Grid cols={4}>
          <Select label="Influence" value={s.influence} onChange={v=>{const a=[...data.stakeholders];a[i]={...a[i],influence:v};sf("stakeholders",a);}} options={["H","M","L","Unknown"]} />
          <Select label="Alignment" value={s.alignment} onChange={v=>{const a=[...data.stakeholders];a[i]={...a[i],alignment:v};sf("stakeholders",a);}} options={["Coach","Ally","Neutral","Critic","Unknown"]} />
          <Select label="Your Access" value={s.yourAccess} onChange={v=>{const a=[...data.stakeholders];a[i]={...a[i],yourAccess:v};sf("stakeholders",a);}} options={["In-depth","Some","None"]} />
          <Select label="Competitor Access" value={s.competitorAccess} onChange={v=>{const a=[...data.stakeholders];a[i]={...a[i],competitorAccess:v};sf("stakeholders",a);}} options={["In-depth","Some","None","Unknown"]} />
        </Grid>
        <Grid><Textarea label="Business Needs" value={s.businessNeeds} onChange={v=>{const a=[...data.stakeholders];a[i]={...a[i],businessNeeds:v};sf("stakeholders",a);}} rows={2} /><Textarea label="Personal Needs" value={s.personalNeeds} onChange={v=>{const a=[...data.stakeholders];a[i]={...a[i],personalNeeds:v};sf("stakeholders",a);}} rows={2} /></Grid>
      </Card>
    ))}
    <AddBtn onClick={()=>sf("stakeholders",[...data.stakeholders,{name:"",reporting:"",role:"Unknown",influence:"Unknown",businessNeeds:"",personalNeeds:"",alignment:"Unknown",yourAccess:"None",competitorAccess:"Unknown"}])} label="Add Stakeholder" />
  </div>
);

const CompetitivePosition = ({ data, sf }) => (
  <div>
    <SH title="Competitive Position" description="Your standing from the customer's perspective." />
    <Card title="Competitive Landscape">
      {data.competitors.map((c,i)=>(
        <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr auto", gap:8, marginBottom:8, alignItems:"start" }}>
          <Input placeholder="Competitor" value={c.name} onChange={v=>{const a=[...data.competitors];a[i]={...a[i],name:v};sf("competitors",a);}} />
          <Input placeholder="Strengths" value={c.strengths} onChange={v=>{const a=[...data.competitors];a[i]={...a[i],strengths:v};sf("competitors",a);}} />
          <Input placeholder="Vulnerabilities" value={c.vulnerabilities} onChange={v=>{const a=[...data.competitors];a[i]={...a[i],vulnerabilities:v};sf("competitors",a);}} />
          <Input placeholder="Share of Wallet" value={c.shareOfWallet} onChange={v=>{const a=[...data.competitors];a[i]={...a[i],shareOfWallet:v};sf("competitors",a);}} />
          <div style={{ marginTop:22 }}><DelBtn onClick={()=>{const a=data.competitors.filter((_,j)=>j!==i);sf("competitors",a.length?a:[{name:"",strengths:"",vulnerabilities:"",shareOfWallet:""}]);}} /></div>
        </div>
      ))}
      <AddBtn onClick={()=>sf("competitors",[...data.competitors,{name:"",strengths:"",vulnerabilities:"",shareOfWallet:""}])} label="Add Competitor" />
    </Card>
    <Grid>
      <Card title="Overall Strengths" accent={C.green}>
        {data.overallStrengths.map((s,i)=><Input key={i} placeholder={`Strength ${i+1}`} value={s} onChange={v=>{const a=[...data.overallStrengths];a[i]=v;sf("overallStrengths",a);}} />)}
        <AddBtn onClick={()=>sf("overallStrengths",[...data.overallStrengths,""])} label="Add" />
      </Card>
      <Card title="Overall Vulnerabilities" accent={C.red}>
        {data.overallVulnerabilities.map((v,i)=><Input key={i} placeholder={`Vulnerability ${i+1}`} value={v} onChange={val=>{const a=[...data.overallVulnerabilities];a[i]=val;sf("overallVulnerabilities",a);}} />)}
        <AddBtn onClick={()=>sf("overallVulnerabilities",[...data.overallVulnerabilities,""])} label="Add" />
      </Card>
    </Grid>
  </div>
);

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

const StrategyMap = ({ data, sf }) => (
  <div>
    <SH title="Customer Strategy Map" description="Understand the customer's strategy to create value." />
    <Card title="Organizational Values & Culture" accent={C.purple}><Textarea value={data.orgValues} onChange={v=>sf("orgValues",v)} rows={3} placeholder="Values, attitudes, beliefs..." /></Card>
    <Grid><Card title="Goals" subtitle="2–5 years" accent={C.accent}><Textarea value={data.goals} onChange={v=>sf("goals",v)} rows={4} /></Card><Card title="Objectives" subtitle="3–12 months" accent={C.green}><Textarea value={data.objectives} onChange={v=>sf("objectives",v)} rows={4} /></Card></Grid>
    <Grid><Card title="Key Issues" accent={C.amber}><Textarea value={data.issues} onChange={v=>sf("issues",v)} rows={3} /></Card><Card title="Initiatives" accent={C.accent}><Textarea value={data.initiatives} onChange={v=>sf("initiatives",v)} rows={3} /></Card></Grid>
  </div>
);

const DevelopStrategy = ({ data, sf }) => (
  <div>
    <SH title="Develop Strategy" />
    <Grid>
      <Card title="Strengths to Leverage" accent={C.green}>
        {data.strengthsToLeverage.map((s,i)=>(
          <div key={i} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
            <span style={{ width:24, height:24, borderRadius:6, background:C.greenGlow, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:C.green, fontFamily:FM, flexShrink:0 }}>{i+1}</span>
            <input value={s} onChange={e=>{const a=[...data.strengthsToLeverage];a[i]=e.target.value;sf("strengthsToLeverage",a);}} style={{ flex:1, padding:"8px 10px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, fontSize:13, fontFamily:F, outline:"none" }} />
          </div>))}
        <div style={{ marginTop:8 }}><AddBtn onClick={()=>sf("strengthsToLeverage",[...data.strengthsToLeverage,""])} label="Add" /></div>
      </Card>
      <Card title="Vulnerabilities to Address" accent={C.red}>
        {data.vulnerabilitiesToAddress.map((v,i)=>(
          <div key={i} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
            <span style={{ width:24, height:24, borderRadius:6, background:C.redGlow, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:C.red, fontFamily:FM, flexShrink:0 }}>{i+1}</span>
            <input value={v} onChange={e=>{const a=[...data.vulnerabilitiesToAddress];a[i]=e.target.value;sf("vulnerabilitiesToAddress",a);}} style={{ flex:1, padding:"8px 10px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, fontSize:13, fontFamily:F, outline:"none" }} />
          </div>))}
        <div style={{ marginTop:8 }}><AddBtn onClick={()=>sf("vulnerabilitiesToAddress",[...data.vulnerabilitiesToAddress,""])} label="Add" /></div>
      </Card>
    </Grid>
  </div>
);

const ActionPlan = ({ data, sf }) => (
  <div>
    <SH title="Action Plan" description="Actions to leverage strengths, reduce vulnerabilities, and drive momentum." />
    {data.actionItems.map((item,i)=>(
      <Card key={i} accent={C.accent}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}><Badge>Action #{i+1}</Badge><DelBtn onClick={()=>{const a=data.actionItems.filter((_,j)=>j!==i);sf("actionItems",a.length?a:[{objective:"",action:"",byWhen:"",owner:"",obstacle:"",planB:""}]);}} /></div>
        <Grid><Input label="Objective" value={item.objective} onChange={v=>{const a=[...data.actionItems];a[i]={...a[i],objective:v};sf("actionItems",a);}} /><Input label="Action" value={item.action} onChange={v=>{const a=[...data.actionItems];a[i]={...a[i],action:v};sf("actionItems",a);}} /></Grid>
        <Grid cols={4}><Input label="By When" type="date" value={item.byWhen} onChange={v=>{const a=[...data.actionItems];a[i]={...a[i],byWhen:v};sf("actionItems",a);}} /><Input label="Owner" value={item.owner} onChange={v=>{const a=[...data.actionItems];a[i]={...a[i],owner:v};sf("actionItems",a);}} /><Input label="Obstacle" value={item.obstacle} onChange={v=>{const a=[...data.actionItems];a[i]={...a[i],obstacle:v};sf("actionItems",a);}} /><Input label="Plan B" value={item.planB} onChange={v=>{const a=[...data.actionItems];a[i]={...a[i],planB:v};sf("actionItems",a);}} /></Grid>
      </Card>
    ))}
    <AddBtn onClick={()=>sf("actionItems",[...data.actionItems,{objective:"",action:"",byWhen:"",owner:"",obstacle:"",planB:""}])} label="Add Action Item" />
  </div>
);

const RunningQuestions = ({ data, sf }) => (
  <div>
    <SH title="Running Questions" description="Information gaps to validate. Reference when completing your Action Plan." />
    <Card>{data.runningQuestions.map((q,i)=>(
      <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:8, marginBottom:8, alignItems:"start" }}>
        <Input placeholder="Question" value={q.question} onChange={v=>{const a=[...data.runningQuestions];a[i]={...a[i],question:v};sf("runningQuestions",a);}} />
        <Input placeholder="Action Step" value={q.actionStep} onChange={v=>{const a=[...data.runningQuestions];a[i]={...a[i],actionStep:v};sf("runningQuestions",a);}} />
        <div style={{ marginTop:22 }}><DelBtn onClick={()=>{const a=data.runningQuestions.filter((_,j)=>j!==i);sf("runningQuestions",a.length?a:[{question:"",actionStep:""}]);}} /></div>
      </div>
    ))}
    <AddBtn onClick={()=>sf("runningQuestions",[...data.runningQuestions,{question:"",actionStep:""}])} label="Add Question" />
    </Card>
  </div>
);

// ── OPPORTUNITY DASHBOARD ──
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

// ── Higher-order component for per-opportunity views ──
const withOppty = (Component) => ({ data, sf, ...props }) => {
  const opps = data.opportunities;
  const activeId = data.activeOpptyId || (opps[0]&&opps[0].id);
  const oppty = opps.find(o=>o.id===activeId) || opps[0];
  if (!oppty) return <Card><p style={{ color:C.textMuted }}>No opportunities yet. Create one from the Dashboard.</p></Card>;

  const setOppty = (key, val) => {
    const updated = opps.map(o=>o.id===oppty.id?{...o,[key]:val}:o);
    sf("opportunities", updated);
  };
  const addOppty = () => { const n=blankOppty(); sf({opportunities:[...opps,n],activeOpptyId:n.id}); };
  const delOppty = (id) => {
    const a=opps.filter(o=>o.id!==id);
    if(a.length) { sf("opportunities",a); if(id===activeId) sf("activeOpptyId",a[0].id); }
  };

  return (
    <div>
      <OpptyBar opportunities={opps} activeId={oppty.id} onSelect={id=>sf("activeOpptyId",id)} onAdd={addOppty} onDelete={delOppty} />
      <Component key={oppty.id} oppty={oppty} setOppty={setOppty} data={data} sf={sf} {...props} />
    </div>
  );
};

const OpptyReviewInner = ({ oppty:o, setOppty:so, setSection }) => {
  const status = getOpptyStatus(o);
  const completePct = Math.round((status.filled/status.total)*100);
  const stCol = status.isActive ? C.green : C.amber;
  return (
  <div>
    <SH title="Opportunity Review" description={o.name?`Editing: ${o.name}`:"Fill in opportunity details below."} />
    {/* Completion Progress Card */}
    <Card style={{ padding:16, marginBottom:20, borderLeft:`3px solid ${stCol}` }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, flex:1 }}>
          <span style={{ fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:50, background:`${stCol}22`, color:stCol, letterSpacing:"0.05em" }}>{status.isActive?"ACTIVE":"DRAFT"}</span>
          <div style={{ flex:1, maxWidth:300 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontSize:12, color:C.textMuted, fontFamily:F }}>Review Completion</span>
              <span style={{ fontSize:12, fontWeight:700, color:stCol, fontFamily:FM }}>{status.filled}/{status.total}</span>
            </div>
            <div style={{ height:8, background:C.bg, borderRadius:4, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${completePct}%`, background:status.isActive?`linear-gradient(90deg,${C.green},${C.green}aa)`:`linear-gradient(90deg,${C.amber},${C.amber}aa)`, borderRadius:4, transition:"width 0.4s ease" }} />
            </div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {!status.isActive && (
            <div style={{ fontSize:12, color:C.textDim, fontFamily:F, maxWidth:220 }}>
              {status.missing.length <= 3
                ? `Missing: ${status.missing.map(f=>FIELD_LABELS[f]||f).join(", ")}`
                : `${status.missing.length} fields remaining`}
            </div>
          )}
          {setSection && (
            <button onClick={()=>setSection("oppty-dashboard")} style={{
              padding:"8px 18px", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:F, transition:"all 0.2s",
              background:status.isActive?C.green:`${C.accent}22`,
              border:status.isActive?`1px solid ${C.green}`:`1px solid ${C.accent}`,
              color:status.isActive?C.white:C.accent,
            }}>
              {status.isActive ? "✓ View on Dashboard" : "◐ Go to Dashboard"}
            </button>
          )}
        </div>
      </div>
    </Card>
    <Grid>
      <Card title="Opportunity Info" accent={C.accent}>
        <Input label="Opportunity Name" value={o.name} onChange={v=>so("name",v)} placeholder="e.g. Network Refresh 2026" />
        <Input label="Client Name" value={o.clientName} onChange={v=>so("clientName",v)} />
        <Grid><Input label="Client Rep" value={o.clientRep} onChange={v=>so("clientRep",v)} /><Input label="Owner" value={o.owner} onChange={v=>so("owner",v)} /></Grid>
        <Grid><Input label="Start Date" type="date" value={o.startDate} onChange={v=>so("startDate",v)} /><Input label="Forecast Close" type="date" value={o.forecastClose} onChange={v=>so("forecastClose",v)} /></Grid>
        <Input label="Pipeline Stage" value={o.pipelineStage} onChange={v=>so("pipelineStage",v)} />
        <Input label="Opportunity ID(s)" value={o.opptyId} onChange={v=>so("opptyId",v)} />
        <Grid><Select label="Credit Qualifies" value={o.creditLimit} onChange={v=>so("creditLimit",v)} options={["Yes","No","Don't Know"]} /><Select label="Power Identified?" value={o.powerIdentified} onChange={v=>so("powerIdentified",v)} options={["Yes","No"]} /></Grid>
        <Grid><Input label="GTT Executives" value={o.gttExecs} onChange={v=>so("gttExecs",v)} /><Input label="Customer Executives" value={o.custExecs} onChange={v=>so("custExecs",v)} /></Grid>
      </Card>
      <div>
        <Card title="Commercial" accent={C.green}>
          <Input label="Commercial Process" value={o.commercialProcess} onChange={v=>so("commercialProcess",v)} />
          <Grid><Input label="Est. MRR ($)" value={o.mrr} onChange={v=>so("mrr",v)} /><Input label="Est. TCV ($)" value={o.tcv} onChange={v=>so("tcv",v)} /></Grid>
          <Grid><Input label="Direct Margin %" value={o.margin} onChange={v=>so("margin",v)} /><Input label="Contract (months)" value={o.contractLength} onChange={v=>so("contractLength",v)} /></Grid>
          <Grid><Input label="Selling Partner" value={o.sellingPartner} onChange={v=>so("sellingPartner",v)} /><Input label="TSD" value={o.tsd} onChange={v=>so("tsd",v)} /></Grid>
          <Input label="Sub-Agent" value={o.subAgent} onChange={v=>so("subAgent",v)} />
        </Card>
        <Card title="Strategic Positioning" accent={C.purple}>
          <Textarea label="Business Objectives" value={o.bizObjectives} onChange={v=>so("bizObjectives",v)} rows={2} />
          <Textarea label="Compelling Event" value={o.compellingEvent} onChange={v=>so("compellingEvent",v)} rows={2} />
          <Textarea label="Proposed Solution" value={o.proposedSolution} onChange={v=>so("proposedSolution",v)} rows={2} />
          <Textarea label="Bid Strategy" value={o.bidStrategy} onChange={v=>so("bidStrategy",v)} rows={2} />
        </Card>
      </div>
    </Grid>
    <Grid>
      <Card title="GTT Position" accent={C.green}><Textarea label="Strengths" value={o.gttStrengths} onChange={v=>so("gttStrengths",v)} rows={2} /><Textarea label="Weaknesses" value={o.gttWeaknesses} onChange={v=>so("gttWeaknesses",v)} rows={2} /></Card>
      <Card title="Competitor Position" accent={C.red}><Textarea label="Strengths" value={o.compStrengths} onChange={v=>so("compStrengths",v)} rows={2} /><Textarea label="Weaknesses" value={o.compWeaknesses} onChange={v=>so("compWeaknesses",v)} rows={2} /></Card>
    </Grid>
  </div>
  );
};
const OpptyReview = withOppty(OpptyReviewInner);

// ── Radar Chart ──
const DIMS = [{k:"pain",l:"Pain",c:C.red},{k:"power",l:"Power",c:C.amber},{k:"vision",l:"Vision",c:C.accent},{k:"value",l:"Value",c:C.green},{k:"consensus",l:"Consensus",c:C.purple}];
const RADAR_COLORS = [C.accent,C.green,C.amber,C.purple,C.cyan,C.red,"#F472B6","#A78BFA","#34D399","#FB923C"];

const RadarChart = ({ layers, size=380 }) => {
  const cx=size/2, cy=size/2, maxR=size/2-40, steps=6, n=DIMS.length;
  const angle = (i) => (Math.PI*2*i/n) - Math.PI/2;
  const point = (i, val) => ({
    x: cx + Math.cos(angle(i)) * (val/steps) * maxR,
    y: cy + Math.sin(angle(i)) * (val/steps) * maxR,
  });
  const poly = (vals) => DIMS.map((_,i)=>{ const p=point(i,vals[i]); return `${p.x},${p.y}`; }).join(" ");

  return (
    <svg width={size} height={size} style={{ display:"block", margin:"0 auto" }}>
      {/* Grid rings */}
      {[1,2,3,4,5,6].map(s=>(
        <polygon key={s} points={DIMS.map((_,i)=>{const p=point(i,s);return `${p.x},${p.y}`;}).join(" ")}
          fill="none" stroke={C.border} strokeWidth={s===6?1.5:0.5} strokeDasharray={s<6?"3,3":undefined} />
      ))}
      {/* Axis lines */}
      {DIMS.map((_,i)=>{const p=point(i,steps);return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={C.border} strokeWidth={0.5} />;} )}
      {/* Data layers — oldest first so latest is on top */}
      {layers.map((layer,li)=>(
        <g key={li}>
          <polygon points={poly(DIMS.map(d=>layer.scores[d.k]||0))} fill={`${layer.color}18`} stroke={layer.color}
            strokeWidth={li===0?2.5:1.8} strokeDasharray={li===0?undefined:"6,3"} strokeLinejoin="round" />
          {DIMS.map((d,i)=>{
            const v=layer.scores[d.k]||0; const p=point(i,v);
            return <circle key={i} cx={p.x} cy={p.y} r={li===0?5:4} fill={layer.color} stroke={C.surface} strokeWidth={2} />;
          })}
        </g>
      ))}
      {/* Axis labels */}
      {DIMS.map((d,i)=>{
        const p=point(i,steps+0.7);
        return <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize:12, fontWeight:700, fill:d.c, fontFamily:F }}>{d.l}</text>;
      })}
      {/* Score labels on outermost ring */}
      {[0,1,2,3,4,5,6].map(s=>{
        const p=point(0,s);
        return s>0 ? <text key={s} x={p.x+8} y={p.y} textAnchor="start" dominantBaseline="middle"
          style={{ fontSize:9, fill:C.textDim, fontFamily:FM }}>{s}</text> : null;
      })}
    </svg>
  );
};

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

const CE_DIMS = [
  { l:"Financial Impact", desc:"Budget expiration, revenue at risk, cost escalation, or penalty if they don't act" },
  { l:"Career & Political Risk", desc:"Sponsor's credibility, promotion, or role depends on delivering this outcome" },
  { l:"Hard Deadline", desc:"Contract expiry, regulatory mandate, board commitment, or go-live date that can't move" },
  { l:"Operational Consequence", desc:"Service disruption, security exposure, competitive displacement, or degradation without action" },
];
const CE_LABELS = ["Not assessed","Absent","Anecdotal","Acknowledged","Confirmed","Verified & quantified"];
const CE_COACHING = [
  [0,3,"Compelling event is weak — high risk the deal stalls or goes dark. Focus next call on uncovering why the customer must act now."],
  [4,7,"Early-stage compelling event — need to deepen discovery around urgency drivers. Probe financial impact and deadlines."],
  [8,11,"Developing compelling event — some urgency confirmed but gaps remain. Prioritize validating the weakest dimensions."],
  [12,15,"Solid compelling event with key drivers validated. Continue to reinforce urgency and connect solution to timeline."],
  [16,20,"Strong compelling event across multiple dimensions — this deal has urgency and mandate. Leverage this in every interaction."],
];

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


// ── MAIN APP ──
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
