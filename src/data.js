export const blankOppty = () => ({
  id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
  name: "", clientName: "", clientRep: "", owner: "", startDate: "", forecastClose: "",
  pipelineStage: "", creditLimit: "Yes", opptyId: "", powerIdentified: "No",
  gttExecs: "", custExecs: "", bizObjectives: "", compellingEvent: "",
  proposedSolution: "", bidStrategy: "", gttStrengths: "", gttWeaknesses: "",
  compStrengths: "", compWeaknesses: "",
  commercialProcess: "", mrr: "", tcv: "", margin: "", contractLength: "",
  sellingPartner: "", tsd: "", subAgent: "",
  health: { pain: 0, power: 0, vision: 0, value: 0, consensus: 0 },
  healthSnapshots: [],
  healthNotes: { pain:"", power:"", vision:"", value:"", consensus:"" },
  qualification: {
    decisionMaking: [0,0,0,0], valueProp: [0,0,0,0],
    productOps: [0,0,0,0], commercialRisk: [0,0,0,0],
    compellingEvent: [0,0,0,0],
    notes: { decisionMaking:"", valueProp:"", productOps:"", commercialRisk:"", compellingEvent:"" },
    custom: { decisionMaking:[], valueProp:[], productOps:[], commercialRisk:[], compellingEvent:[] },
  },
  collabPlan: [{ event:"", weekOf:"", done:false, responsible:"", resources:"", goNoGo:"", billable:"" }],
});

export const REQUIRED_FIELDS = [
  "name","clientName","clientRep","owner","startDate","forecastClose",
  "pipelineStage","opptyId","gttExecs","custExecs",
  "commercialProcess","mrr","tcv","margin","contractLength",
  "sellingPartner","tsd","subAgent",
  "bizObjectives","compellingEvent","proposedSolution","bidStrategy",
  "gttStrengths","gttWeaknesses","compStrengths","compWeaknesses",
];

export const FIELD_LABELS = {
  name:"Opportunity Name", clientName:"Client Name", clientRep:"Client Rep", owner:"Owner",
  startDate:"Start Date", forecastClose:"Forecast Close", pipelineStage:"Pipeline Stage",
  opptyId:"Opportunity ID", gttExecs:"GTT Executives", custExecs:"Customer Executives",
  commercialProcess:"Commercial Process", mrr:"Est. MRR", tcv:"Est. TCV",
  margin:"Direct Margin %", contractLength:"Contract Length", sellingPartner:"Selling Partner",
  tsd:"TSD", subAgent:"Sub-Agent", bizObjectives:"Business Objectives",
  compellingEvent:"Compelling Event", proposedSolution:"Proposed Solution",
  bidStrategy:"Bid Strategy", gttStrengths:"GTT Strengths", gttWeaknesses:"GTT Weaknesses",
  compStrengths:"Competitor Strengths", compWeaknesses:"Competitor Weaknesses",
};

export const getOpptyStatus = (o) => {
  const filled = REQUIRED_FIELDS.filter(f => (o[f]||"").toString().trim() !== "");
  return { filled: filled.length, total: REQUIRED_FIELDS.length, isActive: filled.length === REQUIRED_FIELDS.length, missing: REQUIRED_FIELDS.filter(f => !(o[f]||"").toString().trim()) };
};

export const defaultData = {
  accountName: "", salesperson: "", dateCreated: "", dateUpdated: "",
  overviewOfBusiness: "", cultureValues: "", accountStatus: "Growth",
  relationshipHistory: "", whiteSpaces: "", relationshipStatus: "Technical Expert",
  valueToCustomer: "",
  performance: {
    revenue: { twoYearAgo:"", priorYear:"", current:"", forecast:"" },
    target: { twoYearAgo:"", priorYear:"", current:"", forecast:"" },
  },
  industryIssues: [{ issue:"", impact:"", opportunity:"", insight:"" }],
  runningQuestions: [{ question:"", actionStep:"" }],
  stakeholders: [{ name:"", reporting:"", role:"Unknown", influence:"Unknown", businessNeeds:"", personalNeeds:"", alignment:"Unknown", yourAccess:"None", competitorAccess:"Unknown" }],
  competitors: [{ name:"", strengths:"", vulnerabilities:"", shareOfWallet:"" }],
  overallStrengths: ["","",""], overallVulnerabilities: ["","",""],
  strengthsToLeverage: ["","",""], vulnerabilitiesToAddress: ["","",""],
  actionItems: [{ objective:"", action:"", byWhen:"", owner:"", obstacle:"", planB:"" }],
  gttServices: [
    { service:"Managed SD-WAN", region:"", provider:"", spend:"", contractEnd:"", comment:"" },
    { service:"Cloud Security", region:"", provider:"", spend:"", contractEnd:"", comment:"" },
    { service:"Managed Firewall", region:"", provider:"", spend:"", contractEnd:"", comment:"" },
    { service:"DDoS Mitigation", region:"", provider:"", spend:"", contractEnd:"", comment:"" },
    { service:"MDR", region:"", provider:"", spend:"", contractEnd:"", comment:"" },
    { service:"IP Transit", region:"", provider:"", spend:"", contractEnd:"", comment:"" },
    { service:"Dedicated Internet", region:"", provider:"", spend:"", contractEnd:"", comment:"" },
    { service:"Broadband", region:"", provider:"", spend:"", contractEnd:"", comment:"" },
  ],
  orgValues: "", goals: "", objectives: "", issues: "", initiatives: "",
  opportunities: [blankOppty()],
  activeOpptyId: null,
};

export const NAV = [
  { id:"overview", label:"Account Overview", icon:"◉", group:"ASSESS" },
  { id:"industry", label:"Industry Analysis", icon:"◈", group:"ASSESS" },
  { id:"stakeholders", label:"Stakeholders", icon:"◇", group:"ASSESS" },
  { id:"competitive", label:"Competitive Position", icon:"⬡", group:"ASSESS" },
  { id:"whitespace", label:"White Space / GTT", icon:"▣", group:"ASSESS" },
  { id:"strategy-map", label:"Strategy Map", icon:"△", group:"STRATEGIZE" },
  { id:"strategy", label:"Develop Strategy", icon:"⬢", group:"STRATEGIZE" },
  { id:"action-plan", label:"Action Plan", icon:"▶", group:"STRATEGIZE" },
  { id:"oppty-dashboard", label:"Opportunity Dashboard", icon:"◐", group:"OPPORTUNITIES" },
  { id:"oppty-review", label:"Opportunity Review", icon:"●", group:"OPPORTUNITIES" },
  { id:"oppty-health", label:"Opportunity Health", icon:"♡", group:"OPPORTUNITIES" },
  { id:"oppty-insights", label:"Qualification", icon:"★", group:"OPPORTUNITIES" },
  { id:"collab-plan", label:"Collaboration Plan", icon:"☰", group:"OPPORTUNITIES" },
  { id:"questions", label:"Running Questions", icon:"?", group:"TRACK" },
];

export const GROUPS = ["ASSESS","STRATEGIZE","OPPORTUNITIES","TRACK"];

export const HL = {
  pain:["No identification of need","Customer admitted need","Sponsor confirms documented Pain","Pain discussion with Power","Impact across org explored with Power","Power admitted compelling reason","Power confirmed link to strategy"],
  power:["Power not known","Key players identified by Sponsor","Power identified by Sponsor","Access to Power documented","Power structure confirmed","Collaboration Plan started","Power approved contract"],
  vision:["No vision","Vision discussion with Sponsor","Vision confirmed with Sponsor","Vision discussion with Power","Power agrees solution meets Vision","Implementation plan approved","Proof of solution approved"],
  value:["No value established","Value drivers identified","Value quantified with Sponsor","Value confirmed with Power","Value differentiated","Business case approved","ROI validated"],
  consensus:["No consensus activities","Key stakeholders identified","Individual buy-in","Cross-functional alignment","Evaluation criteria agreed","Final consensus building","Full organizational consensus"],
};

export const QQ = {
  decisionMaking:["We know all key players","Strong relationships with key players","Understand approval process","Understand decision maker's KPIs"],
  valueProp:["Compelling events identified & verified","Customer agrees GTT delivers outcome","Value is differentiated","GTT invited to negotiate"],
  productOps:["Can win with standard solution","Standard processes sufficient","Can meet delivery timeline","Low product dev requirements"],
  commercialRisk:["Passes financial hurdles","Credit & payment risk is low","Can invoice with existing systems","Commercial terms acceptable"],
  compellingEvent:["Quantified financial impact of inaction is confirmed","Sponsor's career, credibility, or role depends on outcome","Hard deadline exists that cannot be moved","Operational disruption or competitive loss without action"],
};

export const CE_DIMS = [
  { l:"Financial Impact", desc:"Budget expiration, revenue at risk, cost escalation, or penalty if they don't act" },
  { l:"Career & Political Risk", desc:"Sponsor's credibility, promotion, or role depends on delivering this outcome" },
  { l:"Hard Deadline", desc:"Contract expiry, regulatory mandate, board commitment, or go-live date that can't move" },
  { l:"Operational Consequence", desc:"Service disruption, security exposure, competitive displacement, or degradation without action" },
];

export const CE_LABELS = ["Not assessed","Absent","Anecdotal","Acknowledged","Confirmed","Verified & quantified"];

export const CE_COACHING = [
  [0,3,"Compelling event is weak — high risk the deal stalls or goes dark. Focus next call on uncovering why the customer must act now."],
  [4,7,"Early-stage compelling event — need to deepen discovery around urgency drivers. Probe financial impact and deadlines."],
  [8,11,"Developing compelling event — some urgency confirmed but gaps remain. Prioritize validating the weakest dimensions."],
  [12,15,"Solid compelling event with key drivers validated. Continue to reinforce urgency and connect solution to timeline."],
  [16,20,"Strong compelling event across multiple dimensions — this deal has urgency and mandate. Leverage this in every interaction."],
];

export const DIMS = [{k:"pain",l:"Pain",c:"#EF4444"},{k:"power",l:"Power",c:"#F59E0B"},{k:"vision",l:"Vision",c:"#3B82F6"},{k:"value",l:"Value",c:"#10B981"},{k:"consensus",l:"Consensus",c:"#8B5CF6"}];

export const RADAR_COLORS = ["#3B82F6","#10B981","#F59E0B","#8B5CF6","#06B6D4","#EF4444","#F472B6","#A78BFA","#34D399","#FB923C"];
