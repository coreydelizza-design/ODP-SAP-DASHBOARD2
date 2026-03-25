import { C, F, FM } from "../theme.js";
import { SH, Card, Grid, Input, AddBtn, DelBtn } from "../components/ui.jsx";

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

export default CompetitivePosition;
