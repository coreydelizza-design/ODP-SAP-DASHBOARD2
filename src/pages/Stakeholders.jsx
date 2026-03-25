import { C, F, FM } from "../theme.js";
import { SH, Card, Grid, Input, Select, Textarea, Badge, DelBtn, AddBtn } from "../components/ui.jsx";

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

export default Stakeholders;
