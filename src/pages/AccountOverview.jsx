import { C, F, FM } from "../theme.js";
import { Input, Textarea, Select, Card, SH, Grid } from "../components/ui.jsx";

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

export default AccountOverview;
