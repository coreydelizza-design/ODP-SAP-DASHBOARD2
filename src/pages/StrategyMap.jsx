import { C, F, FM } from "../theme.js";
import { SH, Card, Grid, Textarea } from "../components/ui.jsx";

const StrategyMap = ({ data, sf }) => (
  <div>
    <SH title="Customer Strategy Map" description="Understand the customer's strategy to create value." />
    <Card title="Organizational Values & Culture" accent={C.purple}><Textarea value={data.orgValues} onChange={v=>sf("orgValues",v)} rows={3} placeholder="Values, attitudes, beliefs..." /></Card>
    <Grid><Card title="Goals" subtitle="2–5 years" accent={C.accent}><Textarea value={data.goals} onChange={v=>sf("goals",v)} rows={4} /></Card><Card title="Objectives" subtitle="3–12 months" accent={C.green}><Textarea value={data.objectives} onChange={v=>sf("objectives",v)} rows={4} /></Card></Grid>
    <Grid><Card title="Key Issues" accent={C.amber}><Textarea value={data.issues} onChange={v=>sf("issues",v)} rows={3} /></Card><Card title="Initiatives" accent={C.accent}><Textarea value={data.initiatives} onChange={v=>sf("initiatives",v)} rows={3} /></Card></Grid>
  </div>
);

export default StrategyMap;
