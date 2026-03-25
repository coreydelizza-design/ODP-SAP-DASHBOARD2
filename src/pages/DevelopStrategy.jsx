import { C, F, FM } from "../theme.js";
import { SH, Card, Grid, AddBtn } from "../components/ui.jsx";

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

export default DevelopStrategy;
