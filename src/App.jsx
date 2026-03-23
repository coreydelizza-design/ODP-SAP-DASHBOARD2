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
  qualification: {
    decisionMaking: [0,0,0,0], valueProp: [0,0,0,0],
    productOps: [0,0,0,0], commercialRisk: [0,0,0,0],
  },
  collabPlan: [{ event:"", weekOf:"", done:false, responsible:"", resources:"", goNoGo:"", billable:"" }],
  economics: {
    scenario: "Base",
    resources: [
      { role:"BDR / SDR", estHours:0, actHours:0, rate:75, scarcity:1, category:"Sales", senior:false },
      { role:"Account Executive", estHours:0, actHours:0, rate:125, scarcity:1, category:"Sales", senior:false },
      { role:"Sales Leadership", estHours:0, actHours:0, rate:200, scarcity:1.3, category:"Sales", senior:true },
      { role:"Solutions Architect", estHours:0, actHours:0, rate:165, scarcity:1.2, category:"Technical", senior:false },
      { role:"Principal Architect", estHours:0, actHours:0, rate:210, scarcity:1.5, category:"Technical", senior:true },
      { role:"Product Specialist", estHours:0, actHours:0, rate:150, scarcity:1.2, category:"Technical", senior:false },
      { role:"Pricing / Deal Desk", estHours:0, actHours:0, rate:130, scarcity:1, category:"Operations", senior:false },
      { role:"Legal / Contracting", estHours:0, actHours:0, rate:175, scarcity:1.1, category:"Operations", senior:false },
      { role:"PM / Delivery", estHours:0, actHours:0, rate:140, scarcity:1, category:"Operations", senior:false },
      { role:"Customer Success", estHours:0, actHours:0, rate:120, scarcity:1, category:"Operations", senior:false },
      { role:"Executive Sponsor", estHours:0, actHours:0, rate:300, scarcity:2, category:"Executive", senior:true },
      { role:"VP / SVP / C-Level", estHours:0, actHours:0, rate:400, scarcity:2.5, category:"Executive", senior:true },
    ],
    engagements: [
      { type:"Virtual Discovery", count:0, internal:0, customer:0, mode:"Virtual" },
      { type:"Technical Deep Dive", count:0, internal:0, customer:0, mode:"Virtual" },
      { type:"Executive Meeting", count:0, internal:0, customer:0, mode:"Virtual" },
      { type:"Onsite Workshop", count:0, internal:0, customer:0, mode:"In-Person" },
      { type:"Architecture Session", count:0, internal:0, customer:0, mode:"In-Person" },
      { type:"Executive Briefing", count:0, internal:0, customer:0, mode:"In-Person" },
      { type:"Negotiation Meeting", count:0, internal:0, customer:0, mode:"Hybrid" },
      { type:"Site Visit", count:0, internal:0, customer:0, mode:"In-Person" },
    ],
    travel: { trips:0, airfare:0, hotel:0, meals:0, ground:0, eventCost:0, travelHours:0, execTravel:false, archTravel:false },
    marginInputs: { grossMarginPct:50, winProbability:50, retentionConfidence:80, expansionPotential:"Low" },
    guardrails: { numSites:1, numCountries:1, numProducts:1, customization:"Low", rfpPresent:false, competitiveDisplacement:false, stakeholderComplexity:"Low", executiveAsk:false, strategicLogo:false, expansionPotential:false },
    notes: "",
  },
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
  { id:"oppty-economics", label:"Opportunity Economics", icon:"◆", group:"OPPORTUNITIES" },
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

const OpptyHealthInner = ({ oppty:o, setOppty:so }) => {
  const h=o.health; const total=h.pain+h.power+h.vision+h.value+h.consensus;
  const pct=Math.round((total/30)*100); const hc=pct<40?C.red:pct<70?C.amber:C.green;
  return (
    <div>
      <SH title="Opportunity Health" description={o.name||"Select or name an opportunity."} />
      <Card style={{ textAlign:"center", padding:32 }}>
        <div style={{ fontSize:56, fontWeight:900, fontFamily:FM, color:hc, lineHeight:1 }}>{pct}%</div>
        <div style={{ fontSize:14, color:C.textMuted, marginTop:8, fontFamily:F }}>Deal Health — {o.name||"Untitled"}</div>
        <div style={{ display:"flex", justifyContent:"center", gap:16, marginTop:20 }}>
          {[{l:"Pain",v:h.pain,c:C.red},{l:"Power",v:h.power,c:C.amber},{l:"Vision",v:h.vision,c:C.accent},{l:"Value",v:h.value,c:C.green},{l:"Consensus",v:h.consensus,c:C.purple}].map(x=>(
            <div key={x.l} style={{ padding:"12px 18px", background:C.bg, borderRadius:10, border:`1px solid ${C.border}`, minWidth:70 }}>
              <div style={{ fontSize:24, fontWeight:800, color:x.c, fontFamily:FM }}>{x.v}</div>
              <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{x.l}</div>
            </div>
          ))}
        </div>
      </Card>
      {[{k:"pain",l:"Pain",c:C.red},{k:"power",l:"Power",c:C.amber},{k:"vision",l:"Vision",c:C.accent},{k:"value",l:"Value",c:C.green},{k:"consensus",l:"Consensus",c:C.purple}].map(dim=>(
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
        </Card>
      ))}
    </div>
  );
};
const OpptyHealth = withOppty(OpptyHealthInner);

const OpptyInsightsInner = ({ oppty:o, setOppty:so }) => {
  const q=o.qualification;
  const sc=k=>q[k].reduce((a,b)=>a+b,0);
  const tot=sc("decisionMaking")+sc("valueProp")+sc("productOps")+sc("commercialRisk");
  const scaled=Math.round((tot/80)*100);
  const hc=scaled<60?C.red:scaled<80?C.amber:C.green;
  const hl=scaled<60?"Poor":scaled<80?"Improvement Needed":"Strong";
  return (
    <div>
      <SH title="Qualification & Insights" description={o.name||"Score each dimension."} />
      <Card style={{ textAlign:"center", padding:32 }}>
        <Badge color={hc}>{hl}</Badge>
        <div style={{ fontSize:48, fontWeight:900, fontFamily:FM, color:hc, lineHeight:1, marginTop:12 }}>{scaled}</div>
        <div style={{ fontSize:13, color:C.textMuted, marginTop:6 }}>Qualification Score — {o.name||"Untitled"}</div>
        <div style={{ display:"flex", justifyContent:"center", gap:20, marginTop:20 }}>
          {[{l:"Decision",k:"decisionMaking"},{l:"Value Prop",k:"valueProp"},{l:"Product/Ops",k:"productOps"},{l:"Commercial",k:"commercialRisk"}].map(x=>{
            const s=sc(x.k);const p=s/20;const col=p<0.5?C.red:p<0.75?C.amber:C.green;
            return (<div key={x.k} style={{ minWidth:100 }}>
              <div style={{ fontSize:22, fontWeight:800, fontFamily:FM, color:col }}>{s}<span style={{ fontSize:12, color:C.textDim }}>/20</span></div>
              <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{x.l}</div>
              <div style={{ height:6, background:C.bg, borderRadius:3, marginTop:6, overflow:"hidden" }}><div style={{ height:"100%", width:`${p*100}%`, background:col, borderRadius:3 }} /></div>
            </div>);
          })}
        </div>
      </Card>
      {[{k:"decisionMaking",l:"Decision Making Process",c:C.accent},{k:"valueProp",l:"GTT Value Proposition",c:C.green},{k:"productOps",l:"Product & Operations",c:C.purple},{k:"commercialRisk",l:"Commercial Risk",c:C.amber}].map(cat=>(
        <Card key={cat.k} title={cat.l} accent={cat.c}>
          {QQ[cat.k].map((question,qi)=>(
            <div key={qi} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:qi<QQ[cat.k].length-1?`1px solid ${C.border}22`:"none" }}>
              <span style={{ fontSize:13, color:C.text, fontFamily:F, flex:1 }}>{question}</span>
              <ScorePill value={q[cat.k][qi]} onChange={v=>{const nq={...q};nq[cat.k]=[...nq[cat.k]];nq[cat.k][qi]=v;so("qualification",nq);}} />
            </div>
          ))}
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

// ── OPPORTUNITY ECONOMICS ──
const CATEGORY_COLORS = { Sales:C.accent, Technical:C.purple, Operations:C.cyan, Executive:C.amber };
const SCENARIO_MULT = { Conservative:0.8, Base:1.0, Aggressive:1.25 };

const PRESETS = {
  "Light Touch": [5,10,2,5,0,0,2,0,0,2,0,0],
  "Standard Pursuit": [15,40,8,20,5,10,8,5,5,5,2,0],
  "Heavy Pursuit": [25,80,15,40,20,20,15,12,10,8,5,2],
  "Executive-Led": [10,30,20,15,10,5,10,8,5,5,10,8],
  "Clear All": [0,0,0,0,0,0,0,0,0,0,0,0],
};

const useCalc = (o) => {
  const e = o.economics || {};
  const res = e.resources || [];
  const t = e.travel || {};
  const m = e.marginInputs || {};
  const g = e.guardrails || {};
  const scenario = e.scenario || "Base";
  const sMult = SCENARIO_MULT[scenario] || 1;

  const totalEstHours = res.reduce((s,r)=>s+r.estHours,0);
  const totalActHours = res.reduce((s,r)=>s+r.actHours,0);
  const totalLaborCost = res.reduce((s,r)=>s+(r.estHours*r.rate*r.scarcity),0);
  const totalActLaborCost = res.reduce((s,r)=>s+(r.actHours*r.rate*r.scarcity),0);
  const blendedRate = totalEstHours>0 ? totalLaborCost/totalEstHours : 0;
  const seniorHours = res.filter(r=>r.senior).reduce((s,r)=>s+r.estHours,0);
  const seniorPct = totalEstHours>0 ? (seniorHours/totalEstHours)*100 : 0;

  const travelDirect = (t.airfare||0)+(t.hotel||0)+(t.meals||0)+(t.ground||0)+(t.eventCost||0);
  const travelTimeCost = (t.travelHours||0)*blendedRate;
  const totalTravel = travelDirect+travelTimeCost;
  const totalInvestment = totalLaborCost+travelDirect+travelTimeCost;

  const tcv = parseFloat(o.tcv)||0;
  const mrr = parseFloat(o.mrr)||0;
  const gm = (m.grossMarginPct||0)/100;
  const wp = (m.winProbability||0)/100;
  const contractMonths = parseFloat(o.contractLength)||12;

  const contractGP = tcv*gm;
  const riskAdjGP = contractGP*wp*sMult;
  const netExpectedValue = riskAdjGP-totalInvestment;
  const paybackMonths = (mrr*gm)>0 ? totalInvestment/(mrr*gm) : Infinity;
  const marginSupportRatio = totalInvestment>0 ? contractGP/totalInvestment : 0;
  const minRequiredMRR = (gm*contractMonths)>0 ? totalInvestment/(gm*contractMonths) : 0;
  const overInvest = riskAdjGP>0 ? totalInvestment/riskAdjGP>0.5 : totalInvestment>0;

  // Posture
  let posture = "Monitor Closely", postureColor = C.textMuted;
  if (g.strategicLogo) { posture="Strategic Exception"; postureColor=C.purple; }
  else if (marginSupportRatio>=4 && wp>=0.6) { posture="Invest Aggressively"; postureColor=C.green; }
  else if (marginSupportRatio>=2.5 && wp>=0.4) { posture="Invest Selectively"; postureColor=C.accent; }
  else if (overInvest) { posture="Over-Investment Risk"; postureColor=C.red; }
  else if (marginSupportRatio<1.5 && totalInvestment>5000) { posture="Reduce Investment"; postureColor=C.amber; }

  // Guardrail score
  let gs = 0;
  if (g.numSites>5) gs+=2; else if (g.numSites>1) gs+=1;
  if (g.numCountries>3) gs+=2; else if (g.numCountries>1) gs+=1;
  if (g.numProducts>3) gs+=2; else if (g.numProducts>1) gs+=1;
  if (g.customization==="High") gs+=2; else if (g.customization==="Medium") gs+=1;
  if (g.rfpPresent) gs+=1;
  if (g.competitiveDisplacement) gs+=1;
  if (g.executiveAsk) gs+=1;
  if (g.stakeholderComplexity==="High") gs+=2; else if (g.stakeholderComplexity==="Medium") gs+=1;
  const gsLabel = gs<=2?"Low":gs<=4?"Moderate":gs<=7?"Elevated":"High";
  const gsColor = gs<=2?C.green:gs<=4?C.amber:gs<=7?C.amber:C.red;

  // Category summaries
  const cats = {};
  for (const r of res) {
    if (!cats[r.category]) cats[r.category]={hours:0,cost:0,actHours:0,actCost:0};
    cats[r.category].hours+=r.estHours;
    cats[r.category].cost+=r.estHours*r.rate*r.scarcity;
    cats[r.category].actHours+=r.actHours;
    cats[r.category].actCost+=r.actHours*r.rate*r.scarcity;
  }

  // Engagement summary
  const engVirtual = (e.engagements||[]).filter(x=>x.mode==="Virtual").reduce((s,x)=>s+x.count,0);
  const engInPerson = (e.engagements||[]).filter(x=>x.mode==="In-Person").reduce((s,x)=>s+x.count,0);
  const engHybrid = (e.engagements||[]).filter(x=>x.mode==="Hybrid").reduce((s,x)=>s+x.count,0);
  const totalEng = engVirtual+engInPerson+engHybrid;

  // Decision reasons
  const reasons = [];
  if (marginSupportRatio>=3) reasons.push({text:"Strong margin support ratio ("+marginSupportRatio.toFixed(1)+"x) justifies pursuit investment",color:C.green});
  else if (marginSupportRatio>=1.5) reasons.push({text:"Adequate margin support ("+marginSupportRatio.toFixed(1)+"x) — monitor investment levels",color:C.amber});
  else if (totalInvestment>0) reasons.push({text:"Thin margin support ("+marginSupportRatio.toFixed(1)+"x) — reduce resource commitment",color:C.red});
  if (seniorPct>40) reasons.push({text:"Senior resource concentration at "+Math.round(seniorPct)+"% — consider delegating to optimize cost",color:C.amber});
  if (paybackMonths<6) reasons.push({text:"Fast payback window ("+paybackMonths.toFixed(1)+"mo) — low investment risk",color:C.green});
  else if (paybackMonths<18) reasons.push({text:"Acceptable payback ("+paybackMonths.toFixed(1)+"mo) — standard pursuit timeline",color:C.amber});
  else if (paybackMonths!==Infinity) reasons.push({text:"Extended payback ("+paybackMonths.toFixed(1)+"mo) — requires strategic justification",color:C.red});
  if (engInPerson>engVirtual && totalEng>0) reasons.push({text:"Heavy in-person engagement mix — validate travel ROI",color:C.amber});
  else if (engVirtual>0 && engInPerson===0) reasons.push({text:"Virtual-first engagement — cost-efficient pursuit model",color:C.green});
  if (travelDirect>5000) reasons.push({text:"Significant travel spend ($"+travelDirect.toLocaleString()+") — ensure field time drives deal progress",color:C.amber});
  if (g.strategicLogo) reasons.push({text:"Strategic logo designation — investment ceiling may be extended",color:C.purple});
  if (wp<0.3 && wp>0) reasons.push({text:"Low win probability ("+Math.round(wp*100)+"%) — validate before increasing investment",color:C.red});
  if (reasons.length===0) reasons.push({text:"Enter deal economics to generate recommendations",color:C.textDim});

  return { totalEstHours, totalActHours, totalLaborCost, totalActLaborCost, blendedRate, seniorPct, travelDirect, travelTimeCost, totalTravel, totalInvestment, contractGP, riskAdjGP, netExpectedValue, paybackMonths, marginSupportRatio, minRequiredMRR, overInvest, posture, postureColor, gs, gsLabel, gsColor, cats, engVirtual, engInPerson, engHybrid, totalEng, reasons, tcv, mrr, gm, wp, contractMonths, scenario };
};

const KPI = ({ label, value, sub, color=C.text }) => (
  <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px", textAlign:"center", minWidth:0 }}>
    <div style={{ fontSize:20, fontWeight:900, fontFamily:FM, color, lineHeight:1.2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{value}</div>
    <div style={{ fontSize:10, color:C.textMuted, marginTop:4, fontFamily:F, textTransform:"uppercase", letterSpacing:"0.06em", lineHeight:1.3 }}>{label}</div>
    {sub && <div style={{ fontSize:10, color:C.textDim, marginTop:2, fontFamily:F }}>{sub}</div>}
  </div>
);

const PostureBadge = ({ label, color }) => (
  <span style={{ display:"inline-block", padding:"6px 16px", borderRadius:50, fontSize:13, fontWeight:800, background:`${color}22`, color, fontFamily:F, letterSpacing:"0.03em", border:`1px solid ${color}44` }}>{label}</span>
);

const Toggle = ({ options, value, onChange }) => (
  <div style={{ display:"inline-flex", background:C.bg, borderRadius:8, border:`1px solid ${C.border}`, overflow:"hidden" }}>
    {options.map(opt=>(
      <button key={opt} onClick={()=>onChange(opt)} style={{
        padding:"6px 14px", fontSize:12, fontWeight:value===opt?700:500, fontFamily:F, cursor:"pointer", border:"none",
        background:value===opt?C.accentGlow:"transparent", color:value===opt?C.accent:C.textDim, transition:"all 0.15s",
      }}>{opt}</button>
    ))}
  </div>
);

const MiniBar = ({ pct, color=C.accent, height=6 }) => (
  <div style={{ width:"100%", height, background:C.bg, borderRadius:height/2, overflow:"hidden" }}>
    <div style={{ height:"100%", width:`${Math.min(100,Math.max(0,pct))}%`, background:color, borderRadius:height/2, transition:"width 0.3s" }} />
  </div>
);

const Section = ({ title, subtitle, defaultOpen=false, children, accent }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, marginBottom:20, borderLeft:accent?`3px solid ${accent}`:undefined, overflow:"hidden" }}>
      <div onClick={()=>setOpen(!open)} style={{ padding:"16px 24px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}
        onMouseEnter={e=>e.currentTarget.style.background=C.surfaceHover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
        <div>
          <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:C.text, fontFamily:F }}>{title}</h3>
          {subtitle && <p style={{ margin:"2px 0 0", fontSize:12, color:C.textDim, fontFamily:F }}>{subtitle}</p>}
        </div>
        <span style={{ fontSize:18, color:C.textDim, transform:open?"rotate(180deg)":"rotate(0)", transition:"transform 0.2s" }}>▾</span>
      </div>
      {open && <div style={{ padding:"0 24px 24px" }}>{children}</div>}
    </div>
  );
};

const NumInput = ({ label, value, onChange, prefix, suffix, min=0, max, step=1, style:sx }) => (
  <div style={{ marginBottom:10, ...sx }}>
    {label && <label style={{ display:"block", fontSize:10, fontWeight:600, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4, fontFamily:F }}>{label}</label>}
    <div style={{ display:"flex", alignItems:"center", gap:4 }}>
      {prefix && <span style={{ fontSize:12, color:C.textDim, fontFamily:FM }}>{prefix}</span>}
      <input type="number" value={value||0} min={min} max={max} step={step} onChange={e=>onChange(parseFloat(e.target.value)||0)}
        style={{ width:"100%", padding:"7px 8px", background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, fontSize:13, fontFamily:FM, outline:"none", boxSizing:"border-box" }}
        onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border} />
      {suffix && <span style={{ fontSize:11, color:C.textDim, fontFamily:FM, whiteSpace:"nowrap" }}>{suffix}</span>}
    </div>
  </div>
);

const fmt$ = (n) => n>=1000000?"$"+((n/1000000).toFixed(1))+"M":n>=1000?"$"+((n/1000).toFixed(1))+"K":"$"+Math.round(n);
const fmtN = (n) => n>=1000000?((n/1000000).toFixed(1))+"M":n>=1000?((n/1000).toFixed(1))+"K":Math.round(n).toString();

const OpptyEconomicsInner = ({ oppty: o, setOppty: so }) => {
  const e = o.economics || {};
  const calc = useCalc(o);
  const se = (key, val) => so("economics", { ...e, [key]: val });
  const setRes = (idx, key, val) => { const r=[...e.resources]; r[idx]={...r[idx],[key]:val}; se("resources",r); };
  const setEng = (idx, key, val) => { const en=[...e.engagements]; en[idx]={...en[idx],[key]:val}; se("engagements",en); };
  const setTravel = (key, val) => se("travel", { ...e.travel, [key]:val });
  const setMargin = (key, val) => se("marginInputs", { ...e.marginInputs, [key]:val });
  const setGuard = (key, val) => se("guardrails", { ...e.guardrails, [key]:val });

  const applyPreset = (name) => {
    const hrs = PRESETS[name];
    if (!hrs) return;
    const r = e.resources.map((res,i)=>({...res, estHours:hrs[i]||0}));
    se("resources", r);
  };

  const msr = calc.marginSupportRatio;
  const msrColor = msr>=3?C.green:msr>=1.5?C.amber:C.red;
  const pbColor = calc.paybackMonths<6?C.green:calc.paybackMonths<18?C.amber:C.red;
  const nevColor = calc.netExpectedValue>=0?C.green:C.red;

  return (
    <div>
      <SH title="Opportunity Economics" description={o.name ? `Investment analysis: ${o.name}` : "PE-style investment intelligence for opportunity pursuit."} />

      {/* Scenario Toggle */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <Toggle options={["Conservative","Base","Aggressive"]} value={e.scenario||"Base"} onChange={v=>se("scenario",v)} />
        <span style={{ fontSize:11, color:C.textDim, fontFamily:F }}>Scenario multiplier: {SCENARIO_MULT[e.scenario||"Base"]}x</span>
      </div>

      {/* ROW 1: KPI Bar */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(8,1fr)", gap:10, marginBottom:24 }}>
        <KPI label="Total Investment" value={fmt$(calc.totalInvestment)} color={C.text} />
        <KPI label="Resource Cost" value={fmt$(calc.totalLaborCost)} color={C.accent} />
        <KPI label="Travel / Field" value={fmt$(calc.totalTravel)} color={C.cyan} />
        <KPI label="Expected GP" value={fmt$(calc.riskAdjGP)} sub={calc.scenario} color={C.green} />
        <KPI label="Margin Support" value={msr>0?msr.toFixed(1)+"x":"—"} color={msrColor} />
        <KPI label="Payback" value={calc.paybackMonths===Infinity?"—":calc.paybackMonths.toFixed(1)+"mo"} color={pbColor} />
        <KPI label="Net Expected" value={calc.netExpectedValue!==0?(calc.netExpectedValue>0?"+":"")+fmt$(calc.netExpectedValue):"—"} color={nevColor} />
        <KPI label="Posture" value={calc.posture.split(" ")[0]} sub={calc.posture.split(" ").slice(1).join(" ")} color={calc.postureColor} />
      </div>

      {/* ROW 2: Decision Panel + Margin & Payback */}
      <Grid>
        <Card title="Investment Committee Recommendation" accent={calc.postureColor}>
          <div style={{ marginBottom:16 }}><PostureBadge label={calc.posture} color={calc.postureColor} /></div>
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
            {calc.reasons.slice(0,5).map((r,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"8px 12px", background:C.bg, borderRadius:8, border:`1px solid ${C.border}` }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:r.color, marginTop:5, flexShrink:0 }} />
                <span style={{ fontSize:12, color:C.text, fontFamily:F, lineHeight:1.4 }}>{r.text}</span>
              </div>
            ))}
          </div>
          <div style={{ padding:12, background:`${C.accent}11`, borderRadius:8, border:`1px solid ${C.accent}33` }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.accent, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Next Best Action</div>
            <div style={{ fontSize:12, color:C.text, fontFamily:F, lineHeight:1.5 }}>
              {calc.posture==="Invest Aggressively"?"Accelerate engagement cadence and lock executive sponsorship.":
               calc.posture==="Invest Selectively"?"Focus resources on highest-impact activities; gate further investment on deal progression milestones.":
               calc.posture==="Over-Investment Risk"?"Immediately review resource allocation — reduce non-critical hours and defer discretionary travel.":
               calc.posture==="Reduce Investment"?"Scale back to minimum viable pursuit team; require stage-gate approval before re-investing.":
               calc.posture==="Strategic Exception"?"Document strategic justification and secure leadership sign-off for extended investment ceiling.":
               "Gather more data on deal economics before committing additional resources."}
            </div>
          </div>
          {calc.overInvest && calc.totalInvestment>0 && (
            <div style={{ marginTop:12, padding:10, background:`${C.red}11`, borderRadius:8, border:`1px solid ${C.red}33`, fontSize:12, color:C.red, fontWeight:600 }}>
              ⚠ Over-investment warning: Total investment exceeds 50% of risk-adjusted gross profit
            </div>
          )}
        </Card>
        <Card title="Margin & Payback Analysis" accent={C.green}>
          <NumInput label="Gross Margin %" value={e.marginInputs?.grossMarginPct} onChange={v=>setMargin("grossMarginPct",v)} suffix="%" max={100} />
          <NumInput label="Win Probability %" value={e.marginInputs?.winProbability} onChange={v=>setMargin("winProbability",v)} suffix="%" max={100} />
          <NumInput label="Retention Confidence %" value={e.marginInputs?.retentionConfidence} onChange={v=>setMargin("retentionConfidence",v)} suffix="%" max={100} />
          <div style={{ marginTop:20, display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[
              { l:"Contract GP", v:fmt$(calc.contractGP), c:C.green },
              { l:"Risk-Adjusted GP", v:fmt$(calc.riskAdjGP), c:C.accent },
              { l:"Payback Window", v:calc.paybackMonths===Infinity?"N/A":calc.paybackMonths.toFixed(1)+" months", c:pbColor },
              { l:"Min Required MRR", v:fmt$(calc.minRequiredMRR)+"/mo", c:C.amber },
            ].map(x=>(
              <div key={x.l} style={{ padding:12, background:C.bg, borderRadius:8, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:10, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4, fontFamily:F }}>{x.l}</div>
                <div style={{ fontSize:16, fontWeight:800, color:x.c, fontFamily:FM }}>{x.v}</div>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      {/* ROW 3: Resource Investment + Engagement Model */}
      <Grid>
        <div>
          <Card title="Resource Investment Model" subtitle="Primary cost driver — adjust hours per role to model pursuit investment." accent={C.accent}>
            {/* Presets */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
              {Object.keys(PRESETS).map(p=>(
                <button key={p} onClick={()=>applyPreset(p)} style={{
                  padding:"5px 12px", fontSize:11, fontWeight:600, fontFamily:F, cursor:"pointer",
                  background:p==="Clear All"?`${C.red}11`:C.bg, border:`1px solid ${p==="Clear All"?C.red:C.border}`,
                  borderRadius:6, color:p==="Clear All"?C.red:C.textMuted, transition:"all 0.15s",
                }} onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=p==="Clear All"?C.red:C.border}>
                  {p}
                </button>
              ))}
            </div>

            {/* Category summary bars */}
            <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:20 }}>
              {["Sales","Technical","Operations","Executive"].map(cat=>{
                const cd = calc.cats[cat]||{hours:0,cost:0};
                const pct = calc.totalLaborCost>0?(cd.cost/calc.totalLaborCost)*100:0;
                return (
                  <div key={cat} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:11, fontWeight:700, color:CATEGORY_COLORS[cat], width:80, fontFamily:F }}>{cat}</span>
                    <div style={{ flex:1 }}><MiniBar pct={pct} color={CATEGORY_COLORS[cat]} height={8} /></div>
                    <span style={{ fontSize:11, fontFamily:FM, color:C.textMuted, width:60, textAlign:"right" }}>{fmt$(cd.cost)}</span>
                    <span style={{ fontSize:10, fontFamily:FM, color:C.textDim, width:40, textAlign:"right" }}>{cd.hours}h</span>
                  </div>
                );
              })}
            </div>

            {calc.seniorPct>40 && (
              <div style={{ padding:8, background:`${C.amber}11`, borderRadius:6, border:`1px solid ${C.amber}33`, fontSize:11, color:C.amber, marginBottom:16 }}>
                ⚠ Senior resource concentration: {Math.round(calc.seniorPct)}% — consider delegating lower-value tasks
              </div>
            )}

            {/* Per-role cards grouped by category */}
            {["Sales","Technical","Operations","Executive"].map(cat=>{
              const catRes = e.resources.map((r,i)=>({...r,idx:i})).filter(r=>r.category===cat);
              if (!catRes.length) return null;
              return (
                <div key={cat} style={{ marginBottom:16 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:CATEGORY_COLORS[cat], textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8, fontFamily:F }}>{cat}</div>
                  {catRes.map(r=>{
                    const cost = r.estHours*r.rate*r.scarcity;
                    const pct = calc.totalLaborCost>0?(cost/calc.totalLaborCost)*100:0;
                    const variance = r.estHours>0?((r.actHours-r.estHours)/r.estHours)*100:0;
                    return (
                      <div key={r.idx} style={{ padding:12, background:C.bg, borderRadius:8, border:`1px solid ${C.border}`, marginBottom:6 }}
                        onMouseEnter={e=>e.currentTarget.style.borderColor=CATEGORY_COLORS[cat]}
                        onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <span style={{ fontSize:13, fontWeight:600, color:C.text, fontFamily:F }}>{r.role}</span>
                            {r.senior && <span style={{ fontSize:9, padding:"2px 6px", borderRadius:50, background:`${C.amber}22`, color:C.amber, fontWeight:700 }}>SENIOR</span>}
                            {r.scarcity>1 && <span style={{ fontSize:9, padding:"2px 6px", borderRadius:50, background:`${C.purple}22`, color:C.purple, fontWeight:700 }}>{r.scarcity}x SCARCE</span>}
                          </div>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <span style={{ fontSize:13, fontWeight:700, color:CATEGORY_COLORS[cat], fontFamily:FM }}>{fmt$(cost)}</span>
                            <span style={{ fontSize:10, color:C.textDim, fontFamily:FM }}>{pct.toFixed(0)}%</span>
                          </div>
                        </div>
                        {/* Slider */}
                        <input type="range" min={0} max={200} step={5} value={r.estHours}
                          onChange={ev=>setRes(r.idx,"estHours",parseInt(ev.target.value)||0)}
                          style={{ width:"100%", height:6, appearance:"auto", accentColor:CATEGORY_COLORS[cat], cursor:"pointer", marginBottom:6 }} />
                        {/* Cost bar */}
                        <MiniBar pct={pct} color={CATEGORY_COLORS[cat]} height={4} />
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:8 }}>
                          {/* Steppers */}
                          <button onClick={()=>setRes(r.idx,"estHours",Math.max(0,r.estHours-5))} style={{ width:28, height:24, borderRadius:4, border:`1px solid ${C.border}`, background:C.surface, color:C.textMuted, cursor:"pointer", fontSize:11, fontFamily:FM }}>−5</button>
                          {/* Direct input */}
                          <input type="number" min={0} value={r.estHours} onChange={ev=>setRes(r.idx,"estHours",parseInt(ev.target.value)||0)}
                            style={{ width:56, padding:"4px 6px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:4, color:C.text, fontSize:12, fontFamily:FM, outline:"none", textAlign:"center" }} />
                          <button onClick={()=>setRes(r.idx,"estHours",r.estHours+5)} style={{ width:28, height:24, borderRadius:4, border:`1px solid ${C.border}`, background:C.surface, color:C.textMuted, cursor:"pointer", fontSize:11, fontFamily:FM }}>+5</button>
                          <span style={{ fontSize:10, color:C.textDim, fontFamily:F }}>est hrs</span>
                          <div style={{ flex:1 }} />
                          {/* Actuals */}
                          <span style={{ fontSize:10, color:C.textDim, fontFamily:F }}>Actual:</span>
                          <input type="number" min={0} value={r.actHours} onChange={ev=>setRes(r.idx,"actHours",parseInt(ev.target.value)||0)}
                            style={{ width:48, padding:"4px 6px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:4, color:C.text, fontSize:12, fontFamily:FM, outline:"none", textAlign:"center" }} />
                          {r.estHours>0 && r.actHours>0 && (
                            <span style={{ fontSize:10, fontWeight:700, fontFamily:FM, color:variance>10?C.red:variance<-10?C.green:C.textDim }}>
                              {variance>0?"+":""}{variance.toFixed(0)}%
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </Card>
        </div>

        <Card title="Engagement Model" subtitle="Meeting cadence and stakeholder touchpoints." accent={C.purple}>
          {/* Summary */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:16 }}>
            {[
              { l:"Virtual", v:calc.engVirtual, c:C.green },
              { l:"In-Person", v:calc.engInPerson, c:C.amber },
              { l:"Total", v:calc.totalEng, c:C.accent },
            ].map(x=>(
              <div key={x.l} style={{ padding:10, background:C.bg, borderRadius:8, border:`1px solid ${C.border}`, textAlign:"center" }}>
                <div style={{ fontSize:20, fontWeight:800, color:x.c, fontFamily:FM }}>{x.v}</div>
                <div style={{ fontSize:10, color:C.textMuted, fontFamily:F, textTransform:"uppercase" }}>{x.l}</div>
              </div>
            ))}
          </div>
          {/* Engagement grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {(e.engagements||[]).map((eng,i)=>{
              const modeCol = eng.mode==="Virtual"?C.green:eng.mode==="In-Person"?C.amber:C.cyan;
              return (
                <div key={i} style={{ padding:10, background:C.bg, borderRadius:8, border:`1px solid ${C.border}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                    <span style={{ fontSize:12, fontWeight:600, color:C.text, fontFamily:F }}>{eng.type}</span>
                    <span style={{ fontSize:9, padding:"2px 6px", borderRadius:50, background:`${modeCol}22`, color:modeCol, fontWeight:700 }}>{eng.mode}</span>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:4 }}>
                    <NumInput label="Count" value={eng.count} onChange={v=>setEng(i,"count",v)} />
                    <NumInput label="Internal" value={eng.internal} onChange={v=>setEng(i,"internal",v)} />
                    <NumInput label="Customer" value={eng.customer} onChange={v=>setEng(i,"customer",v)} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </Grid>

      {/* ROW 4: Travel & Guardrails */}
      <Grid>
        <Section title="Travel & Field ROI" subtitle="Direct costs and time investment for field engagement." defaultOpen={false} accent={C.cyan}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:16 }}>
            <NumInput label="# Trips" value={e.travel?.trips} onChange={v=>setTravel("trips",v)} />
            <NumInput label="Airfare" value={e.travel?.airfare} onChange={v=>setTravel("airfare",v)} prefix="$" />
            <NumInput label="Hotel" value={e.travel?.hotel} onChange={v=>setTravel("hotel",v)} prefix="$" />
            <NumInput label="Meals" value={e.travel?.meals} onChange={v=>setTravel("meals",v)} prefix="$" />
            <NumInput label="Ground Transport" value={e.travel?.ground} onChange={v=>setTravel("ground",v)} prefix="$" />
            <NumInput label="Event Costs" value={e.travel?.eventCost} onChange={v=>setTravel("eventCost",v)} prefix="$" />
          </div>
          <NumInput label="Travel Hours (opportunity cost)" value={e.travel?.travelHours} onChange={v=>setTravel("travelHours",v)} suffix="hrs" />
          <div style={{ display:"flex", gap:16, marginBottom:16 }}>
            <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:C.text, fontFamily:F, cursor:"pointer" }}>
              <input type="checkbox" checked={e.travel?.execTravel||false} onChange={ev=>setTravel("execTravel",ev.target.checked)} style={{ accentColor:C.amber }} /> Executive travel required
            </label>
            <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:C.text, fontFamily:F, cursor:"pointer" }}>
              <input type="checkbox" checked={e.travel?.archTravel||false} onChange={ev=>setTravel("archTravel",ev.target.checked)} style={{ accentColor:C.purple }} /> Architect travel required
            </label>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12 }}>
            {[
              { l:"Direct Expense", v:fmt$(calc.travelDirect), c:C.cyan },
              { l:"Time Cost", v:fmt$(calc.travelTimeCost), c:C.amber },
              { l:"Total Travel", v:fmt$(calc.totalTravel), c:C.text },
            ].map(x=>(
              <div key={x.l} style={{ padding:10, background:C.bg, borderRadius:8, border:`1px solid ${C.border}`, textAlign:"center" }}>
                <div style={{ fontSize:16, fontWeight:800, color:x.c, fontFamily:FM }}>{x.v}</div>
                <div style={{ fontSize:10, color:C.textMuted, fontFamily:F, textTransform:"uppercase" }}>{x.l}</div>
              </div>
            ))}
          </div>
          {calc.totalInvestment>0 && (
            <div style={{ fontSize:11, color:C.textDim, fontFamily:F }}>
              Travel is {((calc.totalTravel/calc.totalInvestment)*100).toFixed(0)}% of total investment
            </div>
          )}
        </Section>

        <Section title="Stage Guardrails" subtitle="Complexity and risk factors that increase pursuit cost." defaultOpen={false} accent={C.amber}>
          <div style={{ textAlign:"center", marginBottom:16 }}>
            <div style={{ width:64, height:64, borderRadius:12, background:`${calc.gsColor}22`, border:`2px solid ${calc.gsColor}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 8px" }}>
              <span style={{ fontSize:28, fontWeight:900, color:calc.gsColor, fontFamily:FM }}>{calc.gs}</span>
            </div>
            <div style={{ fontSize:13, fontWeight:700, color:calc.gsColor, fontFamily:F }}>{calc.gsLabel} Demand</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12 }}>
            <NumInput label="# Sites" value={e.guardrails?.numSites} onChange={v=>setGuard("numSites",v)} min={1} />
            <NumInput label="# Countries" value={e.guardrails?.numCountries} onChange={v=>setGuard("numCountries",v)} min={1} />
            <NumInput label="# Products" value={e.guardrails?.numProducts} onChange={v=>setGuard("numProducts",v)} min={1} />
          </div>
          <Select label="Customization Level" value={e.guardrails?.customization||"Low"} onChange={v=>setGuard("customization",v)} options={["Low","Medium","High"]} />
          <Select label="Stakeholder Complexity" value={e.guardrails?.stakeholderComplexity||"Low"} onChange={v=>setGuard("stakeholderComplexity",v)} options={["Low","Medium","High"]} />
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:12 }}>
            {[
              { k:"rfpPresent", l:"RFP Present" },
              { k:"competitiveDisplacement", l:"Competitive Displacement" },
              { k:"executiveAsk", l:"Executive Ask" },
              { k:"strategicLogo", l:"Strategic Logo" },
              { k:"expansionPotential", l:"Expansion Potential" },
            ].map(f=>(
              <label key={f.k} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:C.text, fontFamily:F, cursor:"pointer" }}>
                <input type="checkbox" checked={e.guardrails?.[f.k]||false} onChange={ev=>setGuard(f.k,ev.target.checked)} style={{ accentColor:C.amber }} /> {f.l}
              </label>
            ))}
          </div>
          {calc.overInvest && (
            <div style={{ marginTop:12, padding:8, background:`${C.red}11`, borderRadius:6, border:`1px solid ${C.red}33`, fontSize:11, color:C.red }}>
              ⚠ Over-investment risk flagged — review resource allocation
            </div>
          )}
        </Section>
      </Grid>

      {/* ROW 5: Actuals vs Estimate */}
      <Section title="Actuals vs Estimate" subtitle="Compare planned investment against actual spend." defaultOpen={false}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:12 }}>
          {[
            { l:"Hours", plan:calc.totalEstHours, actual:calc.totalActHours, unit:"h" },
            { l:"Labor Cost", plan:calc.totalLaborCost, actual:calc.totalActLaborCost, unit:"$" },
            { l:"Travel", plan:calc.travelDirect, actual:calc.travelDirect, unit:"$" },
            { l:"Payback", plan:calc.paybackMonths===Infinity?"N/A":calc.paybackMonths.toFixed(1)+"mo", actual:"—", unit:"" },
          ].map(x=>{
            const delta = typeof x.plan==="number" && typeof x.actual==="number" && x.plan>0 ? ((x.actual-x.plan)/x.plan)*100 : null;
            return (
              <div key={x.l} style={{ padding:14, background:C.bg, borderRadius:8, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:10, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10, fontFamily:F }}>{x.l}</div>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <div><div style={{ fontSize:9, color:C.textDim }}>PLANNED</div><div style={{ fontSize:14, fontWeight:700, color:C.text, fontFamily:FM }}>{x.unit==="$"?fmt$(x.plan):typeof x.plan==="number"?fmtN(x.plan):x.plan}</div></div>
                  <div style={{ textAlign:"right" }}><div style={{ fontSize:9, color:C.textDim }}>ACTUAL</div><div style={{ fontSize:14, fontWeight:700, color:C.accent, fontFamily:FM }}>{x.unit==="$"&&typeof x.actual==="number"?fmt$(x.actual):typeof x.actual==="number"?fmtN(x.actual):x.actual}</div></div>
                </div>
                {delta!==null && (
                  <>
                    <MiniBar pct={Math.min(100,Math.abs(delta))} color={delta>10?C.red:delta<-10?C.green:C.textDim} height={4} />
                    <div style={{ fontSize:10, fontWeight:700, color:delta>10?C.red:delta<-10?C.green:C.textDim, textAlign:"right", marginTop:4, fontFamily:FM }}>
                      {delta>0?"+":""}{delta.toFixed(0)}%
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* Economics Notes */}
      <Section title="Economics Notes" subtitle="Assumptions, exceptions, and leadership notes." defaultOpen={false}>
        <Textarea value={e.notes||""} onChange={v=>se("notes",v)} rows={4} placeholder="Document key assumptions, strategic exceptions, investment rationale..." />
      </Section>
    </div>
  );
};

const OpptyEconomics = withOppty(OpptyEconomicsInner);

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
  const reset = ()=>{setData(defaultData);try{localStorage.removeItem("sap-planner-v2");}catch(e){}};

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
      case "oppty-economics": return <OpptyEconomics data={data} sf={sf} />;
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
            <button onClick={reset} style={{ width:"100%", padding:"7px 12px", background:"none", border:`1px solid ${C.border}`, borderRadius:6, color:C.textDim, fontSize:11, cursor:"pointer", fontFamily:F }}
              onMouseEnter={e=>{e.target.style.borderColor=C.red;e.target.style.color=C.red;}} onMouseLeave={e=>{e.target.style.borderColor=C.border;e.target.style.color=C.textDim;}}>Reset All Data</button>
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
