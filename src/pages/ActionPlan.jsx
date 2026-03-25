import { C, F, FM } from "../theme.js";
import { SH, Card, Grid, Input, Badge, AddBtn, DelBtn } from "../components/ui.jsx";

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

export default ActionPlan;
