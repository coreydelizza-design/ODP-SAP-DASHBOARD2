import { C, F, FM } from "../theme.js";
import { DIMS } from "../data.js";

const RadarChart = ({ layers, size=380 }) => {
  const cx=size/2, cy=size/2, maxR=size/2-40, steps=6, n=DIMS.length;
  const angle = (i) => (Math.PI*2*i/n) - Math.PI/2;
  const point = (i, val) => ({
    x: cx + Math.cos(angle(i)) * (val/steps) * maxR,
    y: cy + Math.sin(angle(i)) * (val/steps) * maxR,
  });
  const poly = (vals) => DIMS.map((_,i)=>{ const p=point(i,vals[i]); return `${p.x},${p.y}`; }).join(" ");

  return (
    <svg width={size} height={size} style={{ display:"block", margin:"0 auto" }}>
      {/* Grid rings */}
      {[1,2,3,4,5,6].map(s=>(
        <polygon key={s} points={DIMS.map((_,i)=>{const p=point(i,s);return `${p.x},${p.y}`;}).join(" ")}
          fill="none" stroke={C.border} strokeWidth={s===6?1.5:0.5} strokeDasharray={s<6?"3,3":undefined} />
      ))}
      {/* Axis lines */}
      {DIMS.map((_,i)=>{const p=point(i,steps);return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={C.border} strokeWidth={0.5} />;} )}
      {/* Data layers */}
      {layers.map((layer,li)=>(
        <g key={li}>
          <polygon points={poly(DIMS.map(d=>layer.scores[d.k]||0))} fill={`${layer.color}18`} stroke={layer.color}
            strokeWidth={li===0?2.5:1.8} strokeDasharray={li===0?undefined:"6,3"} strokeLinejoin="round" />
          {DIMS.map((d,i)=>{
            const v=layer.scores[d.k]||0; const p=point(i,v);
            return <circle key={i} cx={p.x} cy={p.y} r={li===0?5:4} fill={layer.color} stroke={C.surface} strokeWidth={2} />;
          })}
        </g>
      ))}
      {/* Axis labels */}
      {DIMS.map((d,i)=>{
        const p=point(i,steps+0.7);
        return <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize:12, fontWeight:700, fill:d.c, fontFamily:F }}>{d.l}</text>;
      })}
      {/* Score labels */}
      {[0,1,2,3,4,5,6].map(s=>{
        const p=point(0,s);
        return s>0 ? <text key={s} x={p.x+8} y={p.y} textAnchor="start" dominantBaseline="middle"
          style={{ fontSize:9, fill:C.textDim, fontFamily:FM }}>{s}</text> : null;
      })}
    </svg>
  );
};

export default RadarChart;
