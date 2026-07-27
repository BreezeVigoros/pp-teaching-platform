// ========================================
// PP期货交割库教学平台 - 交互逻辑
// ========================================

// ---- Tab 切换 ----
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
    tab.classList.add('active');
    const moduleId = 'module-' + tab.dataset.module;
    document.getElementById(moduleId).classList.add('active');
    if (tab.dataset.module == '1') initPriceChart();
    if (tab.dataset.module == '3') calcFinance();
    if (tab.dataset.module == '4') initHedgeChart();
  });
});

// ---- 价格图表 ----
let priceChart = null;
function initPriceChart() {
  const ctx = document.getElementById('priceChart');
  if (!ctx) return;
  if (priceChart) priceChart.destroy();
  const data = PRICE_HISTORY['1D'];
  priceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((_, i) => i),
      datasets: [{
        label: 'PP2509 价格 (元/吨)',
        data: data,
        borderColor: '#529286',
        backgroundColor: 'rgba(82,146,134,0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 0,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { ticks: { font: { size: 11 } } }
      }
    }
  });
}

function updatePriceChart(period) {
  document.querySelectorAll('.chart-controls .btn-sm').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  if (priceChart) priceChart.destroy();
  const ctx = document.getElementById('priceChart');
  if (!ctx) return;
  const data = PRICE_HISTORY[period];
  priceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((_, i) => i),
      datasets: [{
        label: 'PP2509',
        data: data,
        borderColor: '#529286',
        backgroundColor: 'rgba(82,146,134,0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 0,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { ticks: { font: { size: 11 } } }
      }
    }
  });
  // Update price display
  const lastPrice = data[data.length - 1];
  document.getElementById('ppPrice').textContent = lastPrice.toLocaleString();
}

// ---- 实时行情更新 ----
setInterval(() => {
  const ppPriceEl = document.getElementById('ppPrice');
  const ppChangeEl = document.getElementById('ppChange');
  const ppVolEl = document.getElementById('ppVol');
  if (!ppPriceEl) return;
  const currentPrice = parseInt(ppPriceEl.textContent.replace(',', ''));
  const change = Math.round((Math.random() - 0.48) * 30);
  const newPrice = currentPrice + change;
  ppPriceEl.textContent = newPrice.toLocaleString();
  ppChangeEl.textContent = (change >= 0 ? '+' : '') + change + ' (' + (change >= 0 ? '+' : '') + (change/currentPrice*100).toFixed(2) + '%)';
  ppChangeEl.className = 'ticker-change ' + (change >= 0 ? 'positive' : 'negative');
  if (ppVolEl) ppVolEl.textContent = Math.floor(Math.random() * 50000 + 100000).toLocaleString();
}, 3000);

// ---- 模拟交易 ----
let positions = [];
let accountBalance = 1000000;
let usedMargin = 0;

function executeTrade(dir) {
  const contract = document.getElementById('tradeContract').value;
  const lots = parseInt(document.getElementById('tradeLots').value);
  const price = parseInt(document.getElementById('tradePrice').value);
  const marginPerLot = price * 5 * 0.05; // 5吨/手 * 5%保证金
  const totalMargin = marginPerLot * lots;

  if (totalMargin + usedMargin > accountBalance * 0.8) {
    alert('保证金不足！单笔交易保证金不得超过账户资金的80%。');
    return;
  }

  const position = {
    contract,
    direction: dir === 'buy' ? '买入' : '卖出',
    lots,
    openPrice: price,
    margin: totalMargin,
  };
  positions.push(position);
  usedMargin += totalMargin;
  accountBalance -= totalMargin;
  updateTradeUI();
}

function updateTradeUI() {
  document.getElementById('usedMargin').textContent = usedMargin.toLocaleString() + ' 元';
  const tbody = document.getElementById('positionsBody');
  if (positions.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-td">暂无持仓</td></tr>';
    return;
  }
  const currentPrice = parseInt(document.getElementById('ppPrice').textContent.replace(',', ''));
  tbody.innerHTML = positions.map((p, i) => {
    const pnl = (currentPrice - p.openPrice) * p.lots * 5 * (p.direction === '买入' ? 1 : -1);
    const pnlClass = pnl >= 0 ? 'color:#27ae60;' : 'color:#e74c3c;';
    return `<tr>
      <td>${p.contract}</td><td>${p.direction}</td><td>${p.lots}</td>
      <td>${p.openPrice}</td><td>${currentPrice}</td>
      <td style="${pnlClass}">${pnl >= 0 ? '+' : ''}${pnl.toLocaleString()}</td>
      <td><button onclick="closePosition(${i})" style="padding:3px 8px;cursor:pointer;background:#e74c3c;color:white;border:none;border-radius:3px;">平仓</button></td>
    </tr>`;
  }).join('');
}

function closePosition(index) {
  const p = positions[index];
  const currentPrice = parseInt(document.getElementById('ppPrice').textContent.replace(',', ''));
  const pnl = (currentPrice - p.openPrice) * p.lots * 5 * (p.direction === '买入' ? 1 : -1);
  accountBalance += p.margin + pnl;
  usedMargin -= p.margin;
  positions.splice(index, 1);
  updateTradeUI();
}

// ---- 仓库运营流程动画 ----
function runProcessSim() {
  const steps = document.querySelectorAll('.process-step');
  steps.forEach(s => s.classList.remove('active'));
  let i = 0;
  const interval = setInterval(() => {
    if (i > 0) steps[i-1].classList.remove('active');
    if (i >= steps.length) { clearInterval(interval); return; }
    steps[i].classList.add('active');
    i++;
  }, 800);
}

// ---- 仓库区域详情弹窗 ----
function showWHDetail(area) {
  const details = {
    gate: { title: '🚛 地磅区', content: '<p><strong>功能：</strong>车辆进出称重</p><p>配备60-120吨级电子汽车衡，每年定期检定。出入库均须保留完整过磅记录（毛重、皮重、净重）。</p><p>与主要交通道路衔接，满足大型货车通行需求。</p>' },
    qc: { title: '🔬 质检区', content: '<p><strong>功能：</strong>PP品质检验与等级判定</p><p>检测项目：熔融指数（MFR）、拉伸强度、冲击强度、等规度</p><p>配备取样工具、样品储存柜。留样保存至货物出库后三个月。</p>' },
    store: { title: '📦 立体库房', content: '<p><strong>面积：</strong>约3.29万㎡</p><p>封闭式建筑，地面防潮处理。PP袋装堆码高度≤5米（约15-20层）。</p><p>库内主通道≥4米，次通道≥2米。满足叉车转弯半径和消防疏散要求。</p>' },
    load: { title: '🏗️ 装卸区', content: '<p><strong>功能：</strong>叉车装卸作业</p><p>配备电动叉车、皮带输送机等装卸设备。装卸区与库房无缝连接。</p><p>满足高峰期同时4-6辆货车装卸作业的需求。</p>' },
    office: { title: '🏢 综合办公楼', content: '<p><strong>功能：</strong>运营管理+交易大厅</p><p>含WMS系统监控中心、视频监控中心、仓单注册终端。</p><p>交易大厅可实时查看大商所PP期货行情和仓单信息。</p>' },
    yard: { title: '🅿️ 停车待检区', content: '<p><strong>功能：</strong>车辆排队调度</p><p>可同时停放待检货车20辆以上。配备车辆调度系统，实现入库车辆的有序排队。</p>' },
  };
  const d = details[area];
  if (d) showModal(d.title, d.content);
}

// ---- 痛点详情弹窗 ----
function showPainDetail(index) {
  const pain = INDUSTRY_DATA.pains[index];
  showModal('🔍 ' + pain.title, '<p>' + pain.desc + '</p>');
}

// ---- 地理图节点 ----
document.querySelectorAll('.geo-node').forEach(node => {
  node.addEventListener('click', function(e) {
    const info = this.dataset.info;
    showModal('📍 地区详情', '<pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;">' + info + '</pre>');
  });
});

// ---- 仓单金融计算器 ----
function calcFinance() {
  const stock = parseFloat(document.getElementById('whStockInput')?.value || 500);
  const price = parseFloat(document.getElementById('whPriceInput')?.value || 7850);
  const period = parseFloat(document.getElementById('whPeriodInput')?.value || 6);
  const totalValue = stock * price;
  const whLoan = totalValue * FINANCE_DATA.compare.pledgeRate;
  const whInt = whLoan * FINANCE_DATA.compare.pledgeRateAnnual * (period / 12);
  const trLoan = totalValue * FINANCE_DATA.compare.mortgageRate;
  const trInt = trLoan * FINANCE_DATA.compare.mortgageRateAnnual * (period / 12);

  document.getElementById('whLoanAmt').textContent = '¥' + Math.round(whLoan).toLocaleString();
  document.getElementById('whLoanInt').textContent = '¥' + Math.round(whInt).toLocaleString();
  document.getElementById('trLoanAmt').textContent = '¥' + Math.round(trLoan).toLocaleString();
  document.getElementById('trLoanInt').textContent = '¥' + Math.round(trInt).toLocaleString();
  document.getElementById('extraAmount').textContent = '¥' + Math.round(whLoan - trLoan).toLocaleString();
  document.getElementById('saveInterest').textContent = '¥' + Math.round(trInt - whInt).toLocaleString();
}

// ---- 仓单流转详情 ----
function showReceiptDetail(stage) {
  const details = {
    register: { title: '📝 仓单注册流程', content: '<p>1. 货主提交入库申请</p><p>2. 交割库审核并分配库位</p><p>3. 货物入库→质检→分级</p><p>4. 仓单信息录入WMS系统</p><p>5. 提交大商所审核</p><p>6. 审核通过→标准仓单生效</p>' },
    pledge: { title: '🔒 仓单质押融资流程', content: '<p>1. 企业持标准仓单向银行申请质押</p><p>2. 银行评估仓单货值→按70%质押率核定额度</p><p>3. 签署三方协议（企业-银行-交割库）</p><p>4. 银行放款→交割库冻结仓单</p><p>5. 企业还款→仓单解押→恢复流通</p>' },
    transfer: { title: '🔄 仓单流转方式', content: '<p>1. <b>背书转让：</b>仓单持有人背书后将仓单转让给受让人</p><p>2. <b>交割配对：</b>期货合约到期后，卖方仓单与买方货款配对</p><p>3. <b>期转现(EFP)：</b>买卖双方协商以期货价格+基差完成现货交收</p>' },
    cancel: { title: '✅ 仓单注销流程', content: '<p>1. 仓单持有人提交注销申请</p><p>2. 交割库确认仓单状态（未冻结/未质押）</p><p>3. 大商所审核通过→仓单注销</p><p>4. 货物解除期货监管→可自由提货</p>' },
  };
  const d = details[stage];
  if (d) {
    document.getElementById('receiptTimeline').innerHTML = '<h4>' + d.title + '</h4>' + d.content;
  }
}

// ---- 套保图表 ----
let hedgeChart = null;
function initHedgeChart() {
  const ctx = document.getElementById('hedgeChart');
  if (!ctx) return;
  if (hedgeChart) hedgeChart.destroy();
  hedgeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['价格上涨(+8%)', '价格不变(0%)', '价格下跌(-8%)'],
      datasets: [
        { label: '做套保', data: [7850, 7850, 7850], backgroundColor: '#529286' },
        { label: '不做套保', data: [8478, 7850, 7222], backgroundColor: '#e67e22' },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      scales: { y: { title: { display: true, text: '综合原料成本 (元/吨)' } } }
    }
  });
}

function updateHedgeStrategy() {
  // placeholder for strategy selection UI updates
}

function runHedgeSim() {
  const strategy = document.getElementById('hedgeStrategy').value;
  const spotPrice = HEDGE_SCENARIOS.spotPrice;
  const futPrice = HEDGE_SCENARIOS.futPrice;
  const needed = HEDGE_SCENARIOS.ppRequired;

  // Simulate random price change
  const scenarios = [
    { name: '价格上涨', change: 0.06 + Math.random() * 0.05 },
    { name: '价格不变', change: -0.01 + Math.random() * 0.02 },
    { name: '价格下跌', change: -0.06 - Math.random() * 0.05 },
  ];
  const scenario = scenarios[Math.floor(Math.random() * 3)];
  const newSpot = Math.round(spotPrice * (1 + scenario.change));
  const newFut = Math.round(newSpot - (spotPrice - futPrice) * 0.7); // 基差回归

  if (strategy === 'buy') {
    // 买入套保：期货盈利弥补现货成本增加
    const spotCostChange = (newSpot - spotPrice) * needed;
    const futProfit = (newFut - futPrice) * needed * -1; // 买多，价格上涨盈利
    const netCost = spotPrice * needed - futProfit;
    const perTonNet = Math.round(netCost / needed);

    document.getElementById('hedgedCost').textContent = perTonNet.toLocaleString() + ' 元/吨';
    document.getElementById('unhedgedCost').textContent = newSpot.toLocaleString() + ' 元/吨';
    const saving = newSpot - perTonNet;
    document.getElementById('hedgeSaving').textContent = (saving >= 0 ? '+' : '') + saving.toLocaleString() + ' 元/吨';

    if (hedgeChart) {
      hedgeChart.data.datasets[0].data = [perTonNet, perTonNet, perTonNet];
      hedgeChart.data.datasets[1].data = [newSpot, spotPrice, newSpot];
      hedgeChart.update();
    }
  } else {
    // 不做套保
    document.getElementById('hedgedCost').textContent = '---';
    document.getElementById('unhedgedCost').textContent = newSpot.toLocaleString() + ' 元/吨';
    document.getElementById('hedgeSaving').textContent = '0 元/吨（未套保）';
  }

  showModal('📊 模拟结果', `
    <p><strong>模拟情景：</strong>${scenario.name}（现货变化 ${(scenario.change*100).toFixed(1)}%）</p>
    <p>现货价格：${spotPrice.toLocaleString()} → ${newSpot.toLocaleString()} 元/吨</p>
    <p>期货价格：${futPrice.toLocaleString()} → ${newFut.toLocaleString()} 元/吨</p>
    <hr style="margin:10px 0;">
    <p style="color:#506070;">💡 套期保值的本质：以放弃潜在降价收益为代价，换取对价格上涨风险的保护。</p>
  `);
}

// ---- 风险事件模拟 ----
function triggerRiskEvent() {
  const event = RISK_EVENTS[Math.floor(Math.random() * RISK_EVENTS.length)];
  document.getElementById('riskEvent').innerHTML = `
    <h4>${event.title}</h4>
    <p>${event.description}</p>
  `;
  document.getElementById('riskChoices').innerHTML = event.choices.map((c, i) => `
    <button class="risk-choice-btn" onclick="handleRiskChoice(${i}, '${c.outcome}', '${c.feedback.replace(/'/g, "\\'")}')">${c.text}</button>
  `).join('');
  document.getElementById('riskFeedback').innerHTML = '';
}

function handleRiskChoice(index, outcome, feedback) {
  const el = document.getElementById('riskFeedback');
  el.className = 'risk-feedback ' + (outcome === 'good' ? 'good' : 'bad');
  el.innerHTML = '<strong>' + feedback + '</strong>';
}

// ---- 综合沙盘 ----
let selectedRole = null;
function selectRole(role) {
  selectedRole = role;
  document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
  event.target.closest('.role-card').classList.add('selected');
  const names = { warehouse: '交割库经理', factory: '塑编企业采购总监', trader: 'PP贸易商', bank: '银行风控官' };
  document.getElementById('selRoleName').textContent = names[role];
  document.getElementById('submitDecisionBtn').disabled = false;

  const decisionDiv = document.getElementById('roleDecisions');
  const decisions = {
    warehouse: '<p>🏗️ 决定本周期库容分配策略：</p><select><option>提高库容利用率至90%</option><option>保持85%不变</option><option>预留20%机动库容</option></select>',
    factory: '<p>🏭 决定PP采购策略：</p><select><option>买入套保锁定成本</option><option>现货采购(不做套保)</option><option>基差交易</option></select>',
    trader: '<p>📈 决定交易策略：</p><select><option>期现套利(买现卖期)</option><option>单边做多PP</option><option>单边做空PP</option></select>',
    bank: '<p>🏦 审批仓单质押申请：</p><select><option>按70%质押率批准</option><option>要求追加担保</option><option>暂缓审批(观望市场)</option></select>',
  };
  decisionDiv.innerHTML = decisions[role];
}

function submitDecision() {
  if (!selectedRole) { alert('请先选择角色！'); return; }
  alert('✅ 决策已提交！\n\n当前周期结果：\n' + getRandomOutcome());
}

function getRandomOutcome() {
  const outcomes = [
    'PP价格上涨2.3%，套保组成本锁定，未套保组成本增加。',
    'PP价格下跌1.8%，套保组失去降价红利，未套保组获益。',
    '市场平稳，基差收窄，期现套利组合收益+1.2%。',
    '仓单质押融资顺利放款，企业流动资金压力缓解。',
  ];
  return outcomes[Math.floor(Math.random() * outcomes.length)];
}

function refreshNews() {
  const newsContainer = document.getElementById('marketNews');
  const shuffled = MARKET_EVENTS.sort(() => Math.random() - 0.5).slice(0, 3);
  newsContainer.innerHTML = shuffled.map(e => `
    <div class="news-item">
      <span class="news-tag ${e.tagClass}">${e.tag}</span>
      <div><strong>${e.title}</strong><p>${e.desc}</p></div>
    </div>
  `).join('');
}

// ---- 弹窗 ----
function showModal(title, body) {
  document.getElementById('modalBody').innerHTML = '<h2>' + title + '</h2>' + body;
  document.getElementById('modalOverlay').classList.add('show');
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
}

// ---- 仓库监控数据更新 ----
setInterval(() => {
  const usageEl = document.getElementById('whUsage');
  const stockEl = document.getElementById('whStock');
  const tempEl = document.getElementById('whTemp');
  const humEl = document.getElementById('whHum');
  if (usageEl) usageEl.textContent = (84 + Math.random() * 3).toFixed(1);
  if (stockEl) stockEl.textContent = Math.floor(17000 + Math.random() * 1000).toLocaleString();
  if (tempEl) tempEl.textContent = (24 + Math.random() * 2).toFixed(1);
  if (humEl) humEl.textContent = (50 + Math.random() * 8).toFixed(1);
}, 5000);

// ---- 初始化 ----
document.addEventListener('DOMContentLoaded', () => {
  initPriceChart();
  initHedgeChart();
  calcFinance();
  console.log('🏗️ PP期货交割库虚拟仿真教学平台 V2.0 已就绪');
  console.log('📊 数据来源：大商所、平阳/苍南县政府公开信息、卓创资讯');
  console.log('🎓 参照标准：国家级虚拟仿真实验教学项目');
});
