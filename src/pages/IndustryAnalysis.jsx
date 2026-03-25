import { C, F, FM } from "../theme.js";
import { SH, Card, Grid, Input, DelBtn, AddBtn } from "../components/ui.jsx";

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

export default IndustryAnalysis;
