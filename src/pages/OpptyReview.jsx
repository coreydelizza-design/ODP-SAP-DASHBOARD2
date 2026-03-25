import { C, F, FM } from "../theme.js";
import { SH, Card, Grid, Input, Select, Textarea, Badge } from "../components/ui.jsx";
import { getOpptyStatus, FIELD_LABELS } from "../data.js";
import withOppty from "../components/withOppty.jsx";

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

export default OpptyReview;
