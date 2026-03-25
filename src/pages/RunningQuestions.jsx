import { C, F, FM } from "../theme.js";
import { SH, Card, Input, AddBtn, DelBtn } from "../components/ui.jsx";

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

export default RunningQuestions;
