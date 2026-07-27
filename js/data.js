// ========================================
// PP期货交割库教学平台 - 数据模块
// 所有数据基于公开资料核查结果
// ========================================

// ---- 苍南平阳塑编产业数据 ----
const INDUSTRY_DATA = {
  xiaojiang: {
    enterprises: "200余家",
    title: "中国塑编之都",
    outputTarget: "200亿元",
    park1: "350亩（一期·已建成）",
    park2: "1000亩/5亿元（二期·在建）",
    history: "1970年代起家，1999年获命名",
  },
  cangnan: {
    output2024: "79.21亿元",
    enterpriseCount: "600余家",
    annualOutput: "35万余吨",
    shareOfIndustry: "23.7%",
    ppAnnual: "约12万吨（推算）",
  },
  longgang: {
    boppLines: "16条（金田新材）",
    boppCapacity: "61.95万吨/年（全公司）",
    newMaterialOutput2022: "200余亿元",
  },
  wenzhou: {
    plasticOutput2019: "约223万吨",
    zhejiangNationalShare: "约15%（全国第二）",
  },
  national: {
    ppWoven: "400-500万吨/年",
    ppApparent: "约900万吨",
  },
  pains: [
    { title: "原料价格波动风险", desc: "PP价格受原油、丙烯、供需、政策多重影响，波动频繁且幅度大。塑编产品终端售价刚性，成本端波动无法及时传导，导致企业利润大幅波动。" },
    { title: "融资渠道狭窄", desc: "中小塑编企业普遍面临融资难、融资贵。银行对中小企业授信有限，PP原料库存和成品库存难以作为有效的融资担保品。仓单质押融资通道缺失。" },
    { title: "缺乏价格避险工具", desc: "多数企业对期货套期保值等风险管理工具认知有限，以现货一口价采购为主，被动承受价格波动风险，在本已微薄的利润空间中承受不必要的损失。" },
  ]
};

// ---- PP期货交割库数据 ----
const DELIVERY_DATA = {
  national: {
    total: "41家",
    totalCapacity: "58.57万吨",
  },
  zhejiang: [
    { city: "杭州", name: "杭州临港物流有限公司", type: "指定交割库" },
    { city: "杭州", name: "杭州国贸库（拱墅区半山）", type: "指定交割库" },
    { city: "宁波", name: "宁波保税区高新铁柜有限公司", type: "指定交割库" },
    { city: "宁波", name: "国家物资储备局浙江八三七处（镇海）", type: "指定交割库" },
    { city: "宁波", name: "浙江象屿速传智慧物流有限公司", type: "集团交割分库" },
  ],
  pingyangProject: {
    name: "平阳聚丙烯(PP)期货交割仓",
    location: "萧江镇世纪大道B09地块",
    investment: "2.81亿元",
    area: "50亩（约3.33公顷）",
    buildingArea: "约3.29万平方米",
    facilities: "立体库房、综合办公楼、交易大厅",
    target: "年周转200万吨塑料原料，交易额约1400亿元",
    partner: "物产中大期货有限公司",
    timeline: [
      "2024.12 平阳县政府调整重大决策清单",
      "2025.02 项目加速推进",
      "2025.03 物产中大期货与温大联合设立期货研究中心，副县长朱邦丰出席",
      "2025.05 社区书记陈文君提议加速",
      "2025.08 人大代表联名提案加速培育PP交割仓",
      "2025.09 项目\"加速落地\"",
    ],
  },
  blank: {
    distanceToNingbo: "约250公里",
    distanceToHangzhou: "约300公里",
    costPerTon: "125-210元/吨",
    blankArea: "浙南（温州、台州、丽水）+ 闽北（宁德、南平）",
  }
};

// ---- 交通物流数据 ----
const LOGISTICS_DATA = {
  ruicang: {
    openDate: "2026年2月13日",
    length: "52.6公里",
    interchanges: "10处",
    investment: "159.53亿元",
    bridgeRatio: "87%",
    benefit: "\"15分钟上高速、30分钟到县城、1小时抵温州市区\"",
    impact: "平阳西部40万人结束无高速历史",
  },
  bacao: {
    berths: "4个5000吨级（2通用+2多用途）",
    capacity: "519.5万吨/年",
    investment: "11.8亿元",
    status: "在建（2025年3月获批岸线）",
  },
  logistics: {
    costSave: "约30%",
    cycleShorten: "5-7个工作日",
  }
};

// ---- 经济效益数据 ----
const FINANCE_DATA = {
  pledge: {
    maxRate: "70%",
    rateRegulation: "动产和仓单、提单质押率不得超过70%",
  },
  income: {
    storage: "0.3-0.5元/吨/天",
    delivery: "1-3元/吨",
    pledgeSupervision: "0.5%-1%/年",
    multiple: "综合收入可达纯仓储的2-3倍",
    paybackPeriod: "3-5年",
  },
  compare: {
    pledgeRate: 0.70,
    pledgeRateAnnual: 0.040,
    mortgageRate: 0.40,
    mortgageRateAnnual: 0.055,
  }
};

// ---- PP期货合约规格 ----
const CONTRACT_SPEC = {
  symbol: "PP",
  unit: "5吨/手",
  priceUnit: "元/吨",
  tickSize: "1元/吨",
  limitUpDown: "±4%",
  months: "1-12月",
  lastTradeDay: "合约月份第10个交易日",
  delivery: "实物交割",
  deliveryUnit: "5吨（1手）",
  margin: "合约价值的5%",
  exchange: "大连商品交易所（DCE）",
};

// ---- 模拟行情数据 ----
const PRICE_HISTORY = {
  "1D": generatePriceData(24, 7800, 7900),
  "1W": generatePriceData(7, 7700, 7950),
  "1M": generatePriceData(30, 7500, 8100),
  "3M": generatePriceData(90, 7200, 8200),
};

function generatePriceData(points, low, high) {
  const data = [];
  let price = (low + high) / 2;
  for (let i = 0; i < points; i++) {
    price += (Math.random() - 0.48) * 40;
    price = Math.max(low, Math.min(high, price));
    data.push(Math.round(price));
  }
  return data;
}

// ---- 风险事件库 ----
const RISK_EVENTS = [
  {
    type: "market",
    title: "📉 市场风险：PP价格暴跌",
    description: "国际原油价格暴跌8%，PP期货主力合约盘中下跌5%，触发跌停板。你的持仓面临重大亏损。",
    choices: [
      { text: "立即平仓止损", outcome: "good", feedback: "✅ 正确！果断止损将损失控制在可接受范围内。止损是风险管控的第一道防线。" },
      { text: "追加保证金继续持有", outcome: "bad", feedback: "❌ 错误！逆势加仓可能面临更大损失。在市场方向明确不利时应及时止损。" },
      { text: "观望等待反弹", outcome: "bad", feedback: "⚠️ 风险较高！在市场恐慌性下跌时观望可能错失止损时机，亏损进一步扩大。" },
    ]
  },
  {
    type: "credit",
    title: "🤝 信用风险：交易对手违约",
    description: "某贸易商在PP2509合约到期后未能按时交付实物货物，声称\"物流延误\"。你作为买方已支付全额货款。",
    choices: [
      { text: "通过交易所启动违约处置程序", outcome: "good", feedback: "✅ 正确！大商所有完善的违约处置机制，包括保证金划转、违约金赔付和替代交割。" },
      { text: "私下协商解决", outcome: "bad", feedback: "❌ 风险很大！私下协商缺乏制度保障，可能越拖越被动。应交由交易所按规则处理。" },
    ]
  },
  {
    type: "oper",
    title: "⚙️ 操作风险：仓单数据录入错误",
    description: "仓管员在WMS系统中将500吨PP的等级误录入为\"合格品\"而非\"优等品\"，导致仓单注册信息与实际货物不符。",
    choices: [
      { text: "立即撤销错误仓单并重新注册", outcome: "good", feedback: "✅ 正确！发现错误立即纠正，主动向交易所说明情况，避免后续交割纠纷。" },
      { text: "将错就错，等交割时再解释", outcome: "bad", feedback: "❌ 严重错误！仓单信息不实属于违规行为，可能面临交易所处罚，严重者取消交割库资格。" },
    ]
  },
  {
    type: "compliance",
    title: "📋 合规风险：大商所年度检查",
    description: "大商所通知将对你的交割库进行年度等级评定检查，检查内容包括：消防设施、质检能力、仓单管理、信息系统等13个项目。",
    choices: [
      { text: "逐条对照13项标准自查整改", outcome: "good", feedback: "✅ 正确！系统性的自查整改是应对检查的最佳策略。2025年新规将等级分为A/B/C/D四级，A级可获优先权。" },
      { text: "临时应付，检查完再说", outcome: "bad", feedback: "❌ 风险极高！临时应付容易被查出问题，严重者将被降级甚至取消资格。" },
    ]
  },
];

// ---- 综合沙盘市场事件 ----
const MARKET_EVENTS = [
  { tag: "宏观", tagClass: "macro", title: "国际原油价格震荡上行", desc: "布伦特原油突破85美元/桶，丙烯成本支撑增强，PP价格重心上移。" },
  { tag: "供给", tagClass: "supply", title: "福建中化石化PP装置检修", desc: "泉州PP装置计划检修2周，影响产能约15万吨/月，华东PP供应收紧。" },
  { tag: "需求", tagClass: "demand", title: "萧江塑编出口订单增加", desc: "中东市场编织袋需求增长20%，萧江塑编企业开工率提升至90%以上。" },
  { tag: "宏观", tagClass: "macro", title: "央行下调LPR利率", desc: "1年期LPR下调10bp至3.35%，企业融资成本下降，利好大宗商品需求。" },
  { tag: "供给", tagClass: "supply", title: "宁波PDH工厂满负荷运行", desc: "宁波PDH工厂PP装置开工率100%，PP南下供应充足。" },
  { tag: "需求", tagClass: "demand", title: "水泥行业进入淡季", desc: "基建施工放缓，水泥袋需求季节性下降，拉丝级PP需求短期承压。" },
];

// ---- 仓库模拟数据 ----
const WAREHOUSE_DATA = {
  capacity: 32900,
  usage: 85.3,
  stock: 17250,
  batches: 328,
  temperature: 24.5,
  humidity: 52.8,
};

// ---- 套保情景数据 ----
const HEDGE_SCENARIOS = {
  ppRequired: 450, // 吨
  spotPrice: 7850, // 当前现货
  futPrice: 7720,  // 当前期货PP2509
  lotSize: 5,      // 吨/手
  lotsNeeded: 90,  // 450/5 = 90手
  scenarios: [
    { name: "价格上涨", spotChange: 0.08, color: "#e74c3c" },
    { name: "价格不变", spotChange: 0.00, color: "#7f8c8d" },
    { name: "价格下跌", spotChange: -0.08, color: "#27ae60" },
  ]
};
