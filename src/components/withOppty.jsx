import { C } from "../theme.js";
import { blankOppty } from "../data.js";
import { Card } from "./ui.jsx";
import OpptyBar from "./OpptyBar.jsx";

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

export default withOppty;
