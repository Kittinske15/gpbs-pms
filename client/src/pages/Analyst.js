import React, { useState, useMemo } from 'react';
import Chart from 'react-apexcharts';
import {
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Tooltip,
    Paper,
} from '@mui/material';
import Sidebar from '../components/Sidebar';

// ---------------------------------------------------------------------------
// Source data (extracted by financial-metric-extractor skill from
// "Signed True Visions Group_FS31Dec2025.pdf"). Values in THB millions.
// When the backend ingestion endpoint is wired, this block is replaced by
// fetched JSON from /api/analyst/master.
// ---------------------------------------------------------------------------
const TV = {
    company: 'TRUE VISIONS',
    ticker: 'N/A (private)',
    revenue: 8079.904,
    revenue2024: 8739.665,
    grossProfit: 1107.813,
    ebit: -747.251,
    ebitda: 466.530,
    pretax: -847.216,
    netIncome: -901.947,
    totalAssets: 11639.278,
    totalLiab: 4120.480,
    totalEquity: 7518.798,
    totalDebt: 2432.547,
    interestExp: 99.565,
    cashFlow: 790.777,
    opCash: 2744.057,
    invCash: -832.468,
    finCash: -1760.969,
};
const CITE_TV = '[True FS2025, P.6]';
const CITE_HIST = '[TVS_KPI_2025_Annualized.csv]';
const USD_RATE = 35.0;
const LOGO_TRUE = process.env.PUBLIC_URL + '/assets/logos/truevisions.png';

// 8-year TVS historical KPIs (values in M THB / ratios as decimals).
// Source: TVS_KPI_2025_Annualized.csv.
const TVS_HISTORY = [
    { year: 2018, revenue: 13219, ebitda: 2576, netProfit:   835, equity: 17345, asset: 31134, dToE: 0.79, roe: -0.05, roa: -0.03, opCash:   -40, invCash: -1593, finCash:  1776 },
    { year: 2019, revenue: 12015, ebitda: 2432, netProfit:  1262, equity: 15972, asset: 29115, dToE: 0.82, roe: -0.08, roa: -0.04, opCash:  2737, invCash:  -942, finCash: -1908 },
    { year: 2020, revenue: 10662, ebitda: 3352, netProfit:   839, equity: 16674, asset: 30364, dToE: 0.82, roe:  0.05, roa:  0.03, opCash:  1145, invCash:  -889, finCash:  -303 },
    { year: 2021, revenue:  9835, ebitda: 2627, netProfit:   283, equity: 16889, asset: 31953, dToE: 0.89, roe:  0.02, roa:  0.01, opCash: -1370, invCash:  -212, finCash:  1580 },
    { year: 2022, revenue:  9280, ebitda: 1264, netProfit:  -325, equity: 13610, asset: 27035, dToE: 0.99, roe: -0.24, roa: -0.12, opCash:  1961, invCash:  -368, finCash: -1671 },
    { year: 2023, revenue:  9168, ebitda: 1371, netProfit:  -418, equity: 12720, asset: 19239, dToE: 0.51, roe: -0.07, roa: -0.04, opCash:  6233, invCash:  -411, finCash: -5715 },
    { year: 2024, revenue:  8740, ebitda:  612, netProfit: -4199, equity:  8421, asset: 15111, dToE: 0.79, roe: -0.51, roa: -0.29, opCash:  -924, invCash:  -132, finCash:  1042 },
    { year: 2025, revenue:  8080, ebitda:  467, netProfit:  -860, equity:  7519, asset: 11639, dToE: 0.55, roe: -0.11, roa: -0.07, opCash:  2744, invCash:  -832, finCash: -1761 },
];

// Peers — public competitors. Values sourced from output03/master_dataset.csv.
// WBD financials are surfaced under the HBO MAX label since HBO Max is the
// consumer-facing streaming brand inside Warner Bros. Discovery.
const LOGO = (name) => process.env.PUBLIC_URL + `/assets/logos/${name}.png`;
const PEERS = [
    { name: 'NETFLIX', revenueUSD: 45183, netMarginPct: 24.3,  opMarginPct: 29.9,  roePct: 41.3,  dToE: 0.54,  intCov: 17.4, cite: '[NFLX 10-K 2024]',    estimate: false, logo: LOGO('netflix') },
    { name: 'DISNEY',  revenueUSD: 94425, netMarginPct: 13.1,  opMarginPct: 14.6,  roePct: 11.3,  dToE: 0.41,  intCov: 7.6,  cite: '[DIS 10-K 2024]',     estimate: false, logo: LOGO('disney') },
    { name: 'HBO MAX', revenueUSD: 37296, netMarginPct: 1.9,   opMarginPct: 10.0,  roePct: 2.0,   dToE: 0.91,  intCov: 1.8,  cite: '[WBD 10-K 2024]',     estimate: false, logo: LOGO('hbomax') },
    { name: 'ASTRO',   revenueUSD: 703,   netMarginPct: 2.3,   opMarginPct: 9.1,   roePct: 4.9,   dToE: 2.08,  intCov: 1.6,  cite: '[ASTRO AR 2024]',     estimate: false, logo: LOGO('astro') },
    { name: 'VIU',     revenueUSD: 5140,  netMarginPct: -0.1,  opMarginPct: 14.2,  roePct: -0.7,  dToE: 16.98, intCov: 2.5,  cite: '[PCCW AR 2024]',      estimate: false, logo: LOGO('viu') },
    { name: 'MONOMAX', revenueUSD: 44.8,  netMarginPct: -28.2, opMarginPct: -23.7, roePct: -28.0, dToE: 93.97, intCov: -3.5, cite: '[MONO FS 2024]',      estimate: false, logo: LOGO('monomax') },
    { name: 'WORK',    revenueUSD: 63.5,  netMarginPct: -1.1,  opMarginPct: -0.3,  roePct: -0.5,  dToE: 0.03,  intCov: -0.8, cite: '[WORK FS 2024]',      estimate: false, logo: LOGO('work') },
];

// SWOT — TRUE rows from output03/swot_analysis.csv.
const SWOT = [
    { cat: 'Strength',    factor: 'Premium Sports Rights',  impact: 5, evidence: 'Dominant holder of English Premier League and other major sports in Thailand.' },
    { cat: 'Strength',    factor: 'Integrated Ecosystem',   impact: 4, evidence: 'Synergy with True-dtac mobile and broadband services for bundling.' },
    { cat: 'Weakness',    factor: 'High Debt',              impact: 5, evidence: 'Significant lease and related party liabilities impacting financial flexibility.' },
    { cat: 'Weakness',    factor: 'Negative Net Income',    impact: 4, evidence: 'Continuing losses due to high content costs and amortization.' },
    { cat: 'Opportunity', factor: '5G Convergence',         impact: 4, evidence: 'Leveraging high-speed mobile to deliver 4K streaming and interactive content.' },
    { cat: 'Opportunity', factor: 'Regional Expansion',     impact: 3, evidence: 'Potential to export Thai content to other SE Asian markets via Viu or other platforms.' },
    { cat: 'Threat',      factor: 'Global OTT Competition', impact: 5, evidence: 'Aggressive expansion of Netflix, Disney and HBO Max in the Thai market.' },
    { cat: 'Threat',      factor: 'Piracy',                 impact: 4, evidence: 'Illegal streaming and shared accounts reducing potential subscriber revenue.' },
];

// Porter's Five Forces — TRUE rows from output03/porter/TRUE.csv.
const PORTER = [
    { force: 'Rivalry',        rating: 5, key: 'Intense competition from global OTTs and local TV stations.',          evidence: 'Netflix, Disney+, HBO Max all expanding aggressively in Thailand.' },
    { force: 'New Entrants',   rating: 3, key: 'High capital requirements for infrastructure and content rights deter small players.', evidence: 'Sports rights and broadcast licensing keep CAPEX bar elevated.' },
    { force: 'Buyer Power',    rating: 4, key: 'Subscribers have many choices and can easily churn to other streaming services.', evidence: 'Monthly contracts and bundle competition lift churn risk.' },
    { force: 'Supplier Power', rating: 5, key: 'Major studios and sports leagues have high leverage on content pricing.', evidence: 'EPL and Hollywood rights renew at double-digit price uplifts.' },
    { force: 'Substitutes',    rating: 4, key: 'Short-form video (TikTok) and piracy are significant alternatives.',   evidence: 'Free social video continues to expand share of viewing time.' },
];

// PESTEL — TRUE rows from output03/pestel/TRUE.csv.
const PESTEL = [
    { cat: 'Political',     factor: 'Regulation',     score: 4, explanation: 'NBTC regulations on broadcasting and spectrum licenses.' },
    { cat: 'Economic',      factor: 'Household Debt', score: 4, explanation: 'High consumer debt in Thailand impacting discretionary spending on premium TV.' },
    { cat: 'Social',        factor: 'Cord-Cutting',   score: 5, explanation: 'Shift in consumer behavior from linear TV to on-demand streaming.' },
    { cat: 'Technological', factor: '5G Adoption',    score: 4, explanation: 'Enables high-quality streaming and reduces barrier for mobile-first viewers.' },
    { cat: 'Environmental', factor: 'E-Waste',        score: 2, explanation: 'Impact of legacy set-top box disposal.' },
    { cat: 'Legal',         factor: 'Copyright Law',  score: 4, explanation: 'Enforcement of anti-piracy laws is critical for revenue protection.' },
];

// Moat — 5-dimensional scoring from output03/moat/*.csv (8 companies).
const MOAT = [
    { name: 'TRUE VISIONS', group: 'self',   network: 3, switching: 4, cost: 3, intangibles: 5, branding: 4, overall: 'Strong',
        notes: 'Exclusive EPL rights and True-ecosystem bundling lift intangibles & switching costs.' },
    { name: 'NETFLIX',      group: 'global', network: 5, switching: 3, cost: 5, intangibles: 4, branding: 5, overall: 'Strong',
        notes: 'Global subscriber scale spreads content cost; data flywheel dominant.' },
    { name: 'DISNEY',       group: 'global', network: 4, switching: 4, cost: 4, intangibles: 5, branding: 5, overall: 'Strong',
        notes: 'Marvel/Star Wars/Pixar IP library and brand trust drive deep moat.' },
    { name: 'HBO MAX',      group: 'global', network: 3, switching: 3, cost: 4, intangibles: 5, branding: 5, overall: 'Strong',
        notes: 'Prestige HBO library; churn risk between season releases.' },
    { name: 'ASTRO',        group: 'asia',   network: 3, switching: 4, cost: 4, intangibles: 5, branding: 5, overall: 'Strong',
        notes: 'Malaysian pay-TV leader with deep multi-language vernacular library.' },
    { name: 'VIU',          group: 'asia',   network: 4, switching: 2, cost: 3, intangibles: 4, branding: 4, overall: 'Moderate',
        notes: 'K-drama dominance in SE Asia; low switching costs leave subs exposed.' },
    { name: 'WORK',         group: 'asia',   network: 3, switching: 2, cost: 4, intangibles: 5, branding: 5, overall: 'Strong',
        notes: 'Strong creative talent + format IP; linear viewership migration is the risk.' },
    { name: 'MONOMAX',      group: 'asia',   network: 2, switching: 2, cost: 3, intangibles: 3, branding: 4, overall: 'Narrow',
        notes: 'Mono 29 awareness is strong; sub-scale content budget limits cost moat.' },
];

// Comparison scorecard — aggregate competitive position from output03/comparison_scorecard.csv.
const SCORECARD = [
    { name: 'TRUE VISIONS', moat: 4, porter: 3, pestel: 4, total: 11, status: 'Strong Challenger' },
    { name: 'NETFLIX',      moat: 5, porter: 4, pestel: 4, total: 13, status: 'Market Leader' },
    { name: 'DISNEY',       moat: 5, porter: 4, pestel: 4, total: 13, status: 'Market Leader' },
    { name: 'HBO MAX',      moat: 4, porter: 4, pestel: 4, total: 12, status: 'Strong Challenger' },
    { name: 'ASTRO',        moat: 4, porter: 3, pestel: 4, total: 11, status: 'Strong Challenger' },
    { name: 'VIU',          moat: 4, porter: 3, pestel: 4, total: 11, status: 'Niche Specialist' },
    { name: 'WORK',         moat: 4, porter: 3, pestel: 4, total: 11, status: 'Niche Specialist' },
    { name: 'MONOMAX',      moat: 3, porter: 4, pestel: 4, total: 11, status: 'Niche Specialist' },
];

// OTT industry KPIs (Phase-1 "Step 0" output). Estimates flagged [E].
const OTT_KPIS = {
    subscribersPayTV:  { value: 1.2, unit: 'M', label: 'Pay-TV subscribers',     cite: '[E]' },
    subscribersTrueID: { value: 35,  unit: 'M', label: 'TrueID active users',    cite: '[E]' },
    arpuPayTV:         { value: 480, unit: 'THB/mo', label: 'Pay-TV ARPU',       cite: '[E]' },
    arpuOTT:           { value: 119, unit: 'THB/mo', label: 'OTT premium ARPU',  cite: '[E]' },
    annualChurnPct:    { value: 18,  unit: '%',     label: 'Annual gross churn', cite: '[E]' },
    contentAmortPct:   { value: 38,  unit: '%',     label: 'Content cost / Revenue', cite: '[True FS2025, Note 22]' },
};

// ---------------------------------------------------------------------------
// Derived metrics
// ---------------------------------------------------------------------------
const fmtPct = (n) => `${(n * 100).toFixed(1)}%`;
const fmtMoney = (n, suffix = 'M THB') => `${n >= 0 ? '' : '-'}${Math.abs(n).toLocaleString('en', { maximumFractionDigits: 0 })} ${suffix}`;
const fmtMul = (n) => `${n.toFixed(1)}x`;

const derived = {
    revenueGrowth: (TV.revenue - TV.revenue2024) / TV.revenue2024,
    grossMargin: TV.grossProfit / TV.revenue,
    opMargin: TV.ebit / TV.revenue,
    netMargin: TV.netIncome / TV.revenue,
    dToE: TV.totalDebt / TV.totalEquity,
    intCoverage: TV.ebit / TV.interestExp,
    roa: TV.netIncome / TV.totalAssets,
    roe: TV.netIncome / TV.totalEquity,
    revenueUSD: TV.revenue / USD_RATE,
    netIncomeUSD: TV.netIncome / USD_RATE,
};

// ---------------------------------------------------------------------------
// Apex chart shared theme
// ---------------------------------------------------------------------------
const apexBase = {
    chart: {
        background: 'transparent',
        toolbar: { show: false },
        foreColor: '#cfe6ff',
    },
    grid: { borderColor: 'rgba(255,255,255,0.08)' },
    tooltip: { theme: 'dark' },
    legend: { labels: { colors: '#cfe6ff' } },
    dataLabels: { enabled: false },
    theme: { mode: 'dark' },
};

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
const Citation = ({ text }) => (
    <span className="analyst-cite">{text}</span>
);

const KpiCard = ({ title, value, sub, tone = 'neutral', cite }) => (
    <div className={`analyst-kpi tone-${tone}`}>
        <div className="analyst-kpi-title">{title}</div>
        <div className="analyst-kpi-value">{value}</div>
        {sub && <div className="analyst-kpi-sub">{sub}</div>}
        {cite && <Citation text={cite} />}
    </div>
);

const SectionTitle = ({ children }) => (
    <div className="analyst-section-title">{children}</div>
);

// DuPont decomposition — visual chain of multiplicative ratio nodes.
const DuPontNode = ({ label, value, sub, tone = 'neutral', isResult = false }) => (
    <div className={`analyst-dupont-node tone-${tone}${isResult ? ' analyst-dupont-result' : ''}`}>
        <div className="analyst-dupont-label">{label}</div>
        <div className="analyst-dupont-value">{value}</div>
        {sub && <div className="analyst-dupont-sub">{sub}</div>}
    </div>
);

const DuPontBoxes = () => {
    const netMargin = derived.netMargin;
    const assetTurnover = TV.revenue / TV.totalAssets;
    const equityMultiplier = TV.totalAssets / TV.totalEquity;
    const roe = derived.roe;
    const toneFor = (n, threshold = 0) => (n < threshold ? 'bad' : 'ok');

    return (
        <>
            <SectionTitle>DuPont 3-step decomposition — diagnosing where ROE leakage originates</SectionTitle>
            <div className="analyst-dupont-card analyst-dupont-3step">
                <div className="analyst-dupont-head">DUPONT · 3-STEP</div>
                <div className="analyst-dupont-formula">ROE&nbsp;=&nbsp;Net Margin&nbsp;×&nbsp;Asset Turnover&nbsp;×&nbsp;Equity Multiplier</div>
                <div className="analyst-dupont-chain">
                    <DuPontNode label="Net Margin" value={fmtPct(netMargin)} sub="Profitability" tone={toneFor(netMargin)} />
                    <div className="analyst-dupont-op">×</div>
                    <DuPontNode label="Asset T/O" value={fmtMul(assetTurnover)} sub="Efficiency" tone="warn" />
                    <div className="analyst-dupont-op">×</div>
                    <DuPontNode label="Equity Mult." value={fmtMul(equityMultiplier)} sub="Leverage" tone="warn" />
                    <div className="analyst-dupont-op">=</div>
                    <DuPontNode label="ROE" value={fmtPct(roe)} sub="Du Pont" tone={toneFor(roe)} isResult />
                </div>
                <div className="analyst-foot">
                    Profitability is the leak — net margin of {fmtPct(netMargin)} drags ROE negative even though asset turnover {fmtMul(assetTurnover)} and leverage {fmtMul(equityMultiplier)} are unremarkable. {CITE_TV}
                </div>
            </div>
        </>
    );
};

// ---------------------------------------------------------------------------
// Tab 0 — Executive Cockpit
// ---------------------------------------------------------------------------
const ExecutiveCockpit = ({ goTab }) => {
    const headline = `Cord-cutting drove revenue down ${fmtPct(Math.abs(derived.revenueGrowth))}; operating loss widened to ${fmtMoney(TV.ebit)} despite gross margin holding at ${fmtPct(derived.grossMargin)}.`;
    return (
        <div className="analyst-tab">
            <SectionTitle>FY2025 financial position — at a glance</SectionTitle>
            <div className="analyst-kpi-grid">
                <KpiCard title="REVENUE" value={fmtMoney(TV.revenue)} sub={`YoY ${fmtPct(derived.revenueGrowth)}`} tone="warn" cite={CITE_TV} />
                <KpiCard title="GROSS MARGIN" value={fmtPct(derived.grossMargin)} sub={fmtMoney(TV.grossProfit)} tone="ok" cite={CITE_TV} />
                <KpiCard title="EBIT" value={fmtMoney(TV.ebit)} sub={`EBITDA ${fmtMoney(TV.ebitda)} · Op margin ${fmtPct(derived.opMargin)}`} tone="bad" cite={CITE_TV} />
                <KpiCard title="NET INCOME" value={fmtMoney(TV.netIncome)} sub={`Net margin ${fmtPct(derived.netMargin)}`} tone="bad" cite={CITE_TV} />
                <KpiCard title="DEBT / EQUITY" value={derived.dToE.toFixed(2)} sub={`Debt ${fmtMoney(TV.totalDebt)}`} tone="warn" cite={CITE_TV} />
                <KpiCard title="INTEREST COVERAGE" value={fmtMul(derived.intCoverage)} sub="EBIT cannot service interest" tone="bad" cite={CITE_TV} />
                <KpiCard
                    title="CASH FLOW (FY2025)"
                    value={fmtMoney(TV.cashFlow)}
                    sub={`Op ${fmtMoney(TV.opCash, '')} · Inv ${fmtMoney(TV.invCash, '')} · Fin ${fmtMoney(TV.finCash, '')}`}
                    tone="ok"
                    cite={CITE_HIST}
                />
            </div>

            <div className="analyst-insight">
                <div className="analyst-insight-tag">HEADLINE INSIGHT</div>
                <div className="analyst-insight-body">{headline}</div>
            </div>

            <SectionTitle>Competitive scorecard — Moat / Porter / PESTEL composite (output03)</SectionTitle>
            <TableContainer component={Paper} className="analyst-table">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Company</TableCell>
                            <TableCell align="right">Moat</TableCell>
                            <TableCell align="right">Porter</TableCell>
                            <TableCell align="right">PESTEL</TableCell>
                            <TableCell align="right">Total ability</TableCell>
                            <TableCell>Competitive status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {SCORECARD.map(s => (
                            <TableRow key={s.name} className={s.name === 'TRUE VISIONS' ? 'analyst-row-self' : ''}>
                                <TableCell>{s.name}</TableCell>
                                <TableCell align="right">{s.moat}</TableCell>
                                <TableCell align="right">{s.porter}</TableCell>
                                <TableCell align="right">{s.pestel}</TableCell>
                                <TableCell align="right"><b>{s.total}</b></TableCell>
                                <TableCell>
                                    <Chip
                                        size="small"
                                        label={s.status}
                                        className={`status-chip status-${s.status.toLowerCase().replace(/\s+/g, '-')}`}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <div className="analyst-jump-grid">
                <div className="analyst-jump" onClick={() => goTab(3)}>
                    <div className="analyst-jump-title">Strategic Synthesis</div>
                    <div className="analyst-jump-sub">Moat · SWOT · Porter · PESTEL</div>
                </div>
                <div className="analyst-jump" onClick={() => goTab(1)}>
                    <div className="analyst-jump-title">Financial Benchmark</div>
                    <div className="analyst-jump-sub">vs Netflix · Disney · HBO Max · Astro · Viu · Mono · Work</div>
                </div>
                <div className="analyst-jump" onClick={() => goTab(4)}>
                    <div className="analyst-jump-title">Risk Watchlist</div>
                    <div className="analyst-jump-sub">Top weaknesses + high-pressure PESTEL items</div>
                </div>
            </div>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Tab 1 — Financial Benchmark
// ---------------------------------------------------------------------------
const FinancialBenchmark = () => {
    const tvForChart = { name: TV.company, revenueUSD: derived.revenueUSD, netMarginPct: derived.netMargin * 100, estimate: false, cite: CITE_TV, logo: LOGO_TRUE };
    const all = [tvForChart, ...PEERS];
    const xMax = Math.max(...all.map(p => p.revenueUSD)) * 1.08;

    const scatterSeries = [{
        name: 'Revenue × Net Margin',
        data: all.map(p => ({ x: p.revenueUSD, y: p.netMarginPct, name: p.name })),
    }];
    const scatterOpts = {
        ...apexBase,
        chart: { ...apexBase.chart, type: 'scatter', zoom: { enabled: false } },
        xaxis: {
            type: 'numeric',
            min: 0,
            max: xMax,
            tickAmount: 8,
            title: { text: 'Revenue (USD M)', style: { color: '#cfe6ff' } },
            labels: {
                style: { colors: '#cfe6ff' },
                formatter: (v) => `$${Number(v).toLocaleString('en', { maximumFractionDigits: 0 })}`,
            },
        },
        yaxis: {
            title: { text: 'Net margin (%)', style: { color: '#cfe6ff' } },
            labels: {
                style: { colors: '#cfe6ff' },
                formatter: (v) => `${Number(v).toFixed(0)}%`,
            },
        },
        // Visible markers handle hover/tooltip; image annotations overlay each logo.
        // ApexCharts' markers.image.src maps per-series, so logos must come from
        // per-point annotations to render one image per company.
        markers: { size: 14, colors: ['#1589ff'], strokeColors: '#0b1727', strokeWidth: 2, hover: { size: 18 } },
        annotations: {
            points: all.map(p => ({
                x: p.revenueUSD,
                y: p.netMarginPct,
                marker: { size: 0 },
                image: {
                    path: p.logo,
                    width: 36,
                    height: 36,
                    offsetX: 0,
                    offsetY: 0,
                },
            })),
        },
        dataLabels: {
            enabled: true,
            formatter: (_v, { seriesIndex, dataPointIndex, w }) => w.config.series[seriesIndex].data[dataPointIndex].name,
            offsetY: -30,
            style: { fontSize: '11px', fontWeight: 700, colors: ['#fff'] },
            background: { enabled: false },
        },
        tooltip: { ...apexBase.tooltip, custom: ({ seriesIndex, dataPointIndex, w }) => {
            const p = w.config.series[seriesIndex].data[dataPointIndex];
            return `<div style="padding:8px"><b>${p.name}</b><br/>Revenue $${p.x.toLocaleString('en', { maximumFractionDigits: 0 })}M<br/>Net margin ${p.y.toFixed(1)}%</div>`;
        }},
    };

    const waterfallLabels = ['Revenue', 'COGS', 'Gross profit', 'OpEx', 'EBIT', 'Tax & int.', 'Net income'];
    const cogs = TV.revenue - TV.grossProfit;
    const opex = TV.grossProfit - TV.ebit;
    const taxInt = TV.ebit - TV.netIncome;
    const waterfallSeries = [{
        name: 'THB M',
        data: [TV.revenue, -cogs, TV.grossProfit, -opex, TV.ebit, -taxInt, TV.netIncome],
    }];
    const waterfallOpts = {
        ...apexBase,
        chart: { ...apexBase.chart, type: 'bar' },
        plotOptions: { bar: { borderRadius: 4, colors: { ranges: [
            { from: -100000, to: -0.001, color: '#ff6b6b' },
            { from: 0, to: 100000, color: '#4dd07b' },
        ]}}},
        xaxis: { categories: waterfallLabels, labels: { style: { colors: '#cfe6ff' } } },
        yaxis: { labels: { style: { colors: '#cfe6ff' }, formatter: (v) => `${v.toLocaleString()}M` } },
    };

    const years = TVS_HISTORY.map(h => h.year);
    const historySeries = [
        { name: 'Revenue (M THB)',    type: 'area',   data: TVS_HISTORY.map(h => h.revenue) },
        { name: 'EBITDA (M THB)',     type: 'line',   data: TVS_HISTORY.map(h => h.ebitda) },
        { name: 'Net Profit (M THB)', type: 'column', data: TVS_HISTORY.map(h => h.netProfit) },
    ];
    const historyOpts = {
        ...apexBase,
        chart: { ...apexBase.chart, type: 'line', stacked: false, sparkline: { enabled: false } },
        stroke: { curve: 'smooth', width: [2, 3, 0] },
        fill: { type: ['gradient', 'solid', 'solid'], opacity: [0.35, 1, 1] },
        plotOptions: { bar: { columnWidth: '40%', borderRadius: 3 } },
        markers: { size: [0, 5, 0] },
        xaxis: { categories: years, labels: { style: { colors: '#cfe6ff' } } },
        yaxis: {
            labels: {
                style: { colors: '#cfe6ff' },
                formatter: (v) => `${(v/1000).toFixed(1)}B`,
            },
            title: { text: 'THB (M)', style: { color: '#cfe6ff' } },
        },
        colors: ['#1589ff', '#4dd07b', '#f6c453'],
        tooltip: { ...apexBase.tooltip, y: { formatter: (v) => `${v.toLocaleString()} M THB` } },
        legend: { ...apexBase.legend, position: 'bottom' },
    };

    const ratioSeries = [
        { name: 'ROE',  data: TVS_HISTORY.map(h => +(h.roe * 100).toFixed(1)) },
        { name: 'ROA',  data: TVS_HISTORY.map(h => +(h.roa * 100).toFixed(1)) },
        { name: 'D/E',  data: TVS_HISTORY.map(h => +h.dToE.toFixed(2)) },
    ];
    const ratioOpts = {
        ...apexBase,
        chart: { ...apexBase.chart, type: 'line', sparkline: { enabled: false } },
        stroke: { curve: 'smooth', width: 3 },
        markers: { size: 4 },
        xaxis: { categories: years, labels: { style: { colors: '#cfe6ff' } } },
        yaxis: [
            { seriesName: 'ROE', labels: { style: { colors: '#cfe6ff' }, formatter: (v) => `${v}%` }, title: { text: 'ROE / ROA (%)', style: { color: '#cfe6ff' } } },
            { seriesName: 'ROA', show: false },
            { seriesName: 'D/E', opposite: true, labels: { style: { colors: '#cfe6ff' }, formatter: (v) => v.toFixed(2) }, title: { text: 'D/E (×)', style: { color: '#cfe6ff' } } },
        ],
        colors: ['#5cc6ff', '#84d18a', '#f6c453'],
        legend: { ...apexBase.legend, position: 'bottom' },
    };

    return (
        <div className="analyst-tab">
            <SectionTitle>Revenue (USD M) vs Net margin — scale leaders dwarf TV; the gap to Disney's margin is the actionable one</SectionTitle>
            <div className="analyst-chart-card">
                <Chart options={scatterOpts} series={scatterSeries} type="scatter" height={360} />
            </div>

            <DuPontBoxes />

            <SectionTitle>Where the loss leaks — FY2025 margin waterfall (THB M)</SectionTitle>
            <div className="analyst-chart-card">
                <Chart options={waterfallOpts} series={waterfallSeries} type="bar" height={320} />
            </div>

            <SectionTitle>8-year history (2018–2025) — Revenue holding near 8B THB while EBITDA collapsed from 3.4B to 467M</SectionTitle>
            <div className="analyst-chart-card">
                <Chart options={historyOpts} series={historySeries} type="line" height={320} />
                <div className="analyst-foot">{CITE_HIST}</div>
            </div>

            <SectionTitle>Profitability & leverage ratios — ROE swung from +5% (2020) to -51% (2024) on the goodwill write-down</SectionTitle>
            <div className="analyst-chart-card">
                <Chart options={ratioOpts} series={ratioSeries} type="line" height={280} />
                <div className="analyst-foot">{CITE_HIST}</div>
            </div>

            <div className="analyst-chart-card">
                <SectionTitle>Solvency vs peers</SectionTitle>
                <TableContainer component={Paper} className="analyst-table">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Company</TableCell>
                                <TableCell align="right">Net margin %</TableCell>
                                <TableCell align="right">ROE %</TableCell>
                                <TableCell align="right">D/E</TableCell>
                                <TableCell align="right">Int. cov.</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow className="analyst-row-self">
                                <TableCell>{TV.company}{' '}<Citation text={CITE_TV} /></TableCell>
                                <TableCell align="right">{(derived.netMargin * 100).toFixed(1)}</TableCell>
                                <TableCell align="right">{(derived.roe * 100).toFixed(1)}</TableCell>
                                <TableCell align="right">{derived.dToE.toFixed(2)}</TableCell>
                                <TableCell align="right">{derived.intCoverage.toFixed(1)}</TableCell>
                            </TableRow>
                            {PEERS.map(p => (
                                <TableRow key={p.name}>
                                    <TableCell>{p.name}{p.estimate && ' [E]'}{' '}<Citation text={p.cite} /></TableCell>
                                    <TableCell align="right">{p.netMarginPct.toFixed(1)}</TableCell>
                                    <TableCell align="right">{p.roePct.toFixed(1)}</TableCell>
                                    <TableCell align="right">{p.dToE.toFixed(2)}</TableCell>
                                    <TableCell align="right">{p.intCov.toFixed(1)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Tab 2 — OTT Industry KPIs
// ---------------------------------------------------------------------------
const OttKpis = () => {
    const subSeries = [OTT_KPIS.subscribersPayTV.value, OTT_KPIS.subscribersTrueID.value];
    const subOpts = {
        ...apexBase,
        labels: ['Pay-TV STB (M)', 'TrueID active (M)'],
        legend: { ...apexBase.legend, position: 'bottom' },
        colors: ['#ff6b6b', '#1589ff'],
        chart: { ...apexBase.chart, type: 'donut' },
    };

    const arpuSeries = [{ name: 'ARPU (THB/mo)', data: [OTT_KPIS.arpuPayTV.value, OTT_KPIS.arpuOTT.value] }];
    const arpuOpts = {
        ...apexBase,
        chart: { ...apexBase.chart, type: 'bar' },
        plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
        xaxis: { categories: ['Pay-TV', 'OTT premium'] },
        colors: ['#1589ff'],
    };

    return (
        <div className="analyst-tab">
            <SectionTitle>OTT-first migration is the only path forward — TrueID dwarfs legacy STB by ~30×</SectionTitle>
            <div className="analyst-kpi-grid">
                {Object.values(OTT_KPIS).map(k => (
                    <KpiCard key={k.label} title={k.label.toUpperCase()} value={`${k.value}${k.unit ? ' ' + k.unit : ''}`} cite={k.cite} tone="neutral" />
                ))}
            </div>
            <div className="analyst-two-col">
                <div className="analyst-chart-card">
                    <SectionTitle>Subscriber mix — Pay-TV vs TrueID OTT</SectionTitle>
                    <Chart options={subOpts} series={subSeries} type="donut" height={300} />
                    <div className="analyst-foot">[E] estimates pending segment disclosure</div>
                </div>
                <div className="analyst-chart-card">
                    <SectionTitle>ARPU gap — Pay-TV ≈ 4× OTT</SectionTitle>
                    <Chart options={arpuOpts} series={arpuSeries} type="bar" height={300} />
                    <div className="analyst-foot">Migration plan must close ARPU gap with bundle pricing.</div>
                </div>
            </div>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Tab 3 — Strategic Synthesis (nested tabs)
// ---------------------------------------------------------------------------
const Synthesis = () => {
    const [sub, setSub] = useState(0);
    return (
        <div className="analyst-tab">
            <Tabs
                value={sub}
                onChange={(_, v) => setSub(v)}
                className="analyst-subtabs"
                textColor="inherit"
                TabIndicatorProps={{ style: { background: '#1589ff' } }}
            >
                <Tab label="Moat" />
                <Tab label="SWOT" />
                <Tab label="Porter's 5 Forces" />
                <Tab label="PESTEL" />
            </Tabs>
            {sub === 0 && <MoatPanel />}
            {sub === 1 && <SwotPanel />}
            {sub === 2 && <PorterPanel />}
            {sub === 3 && <PestelPanel />}
        </div>
    );
};

const MoatPanel = () => {
    const dimensions = ['Network', 'Switching', 'Cost', 'Intangibles', 'Branding'];
    const dimKey = { Network: 'network', Switching: 'switching', Cost: 'cost', Intangibles: 'intangibles', Branding: 'branding' };

    // ApexCharts heatmap renders the FIRST series at the bottom of the y-axis.
    // Reverse so TRUE VISIONS appears at the top of the chart.
    const series = [...MOAT].reverse().map(m => ({
        name: m.group === 'self' ? `★ ${m.name}` : m.name,
        data: dimensions.map(d => ({ x: d, y: m[dimKey[d]] })),
    }));

    const opts = {
        ...apexBase,
        chart: { ...apexBase.chart, type: 'heatmap' },
        plotOptions: {
            heatmap: {
                radius: 4,
                enableShades: false,
                colorScale: {
                    ranges: [
                        { from: 1, to: 1, color: '#ff6b6b', name: '1 — Weak' },
                        { from: 2, to: 2, color: '#ff8c42', name: '2' },
                        { from: 3, to: 3, color: '#f6c453', name: '3' },
                        { from: 4, to: 4, color: '#84d18a', name: '4' },
                        { from: 5, to: 5, color: '#4dd07b', name: '5 — Strong' },
                    ],
                },
            },
        },
        dataLabels: {
            enabled: true,
            style: { colors: ['#1a2a3a'], fontWeight: 700, fontSize: '14px' },
        },
        xaxis: {
            categories: dimensions,
            position: 'top',
            labels: { style: { colors: '#cfe6ff', fontSize: '12px', fontWeight: 700 } },
        },
        yaxis: {
            labels: { style: { colors: '#cfe6ff', fontSize: '12px', fontWeight: 600 } },
        },
        stroke: { width: 1, colors: ['rgba(11, 23, 39, 0.6)'] },
        legend: { ...apexBase.legend, position: 'bottom' },
        tooltip: {
            ...apexBase.tooltip,
            y: { formatter: (val) => `${val}/5` },
        },
    };

    return (
        <>
            <SectionTitle>Moat scorecard — TV leads on Switching via True ecosystem; trails on Network and Cost vs global SVOD</SectionTitle>
            <div className="analyst-chart-card">
                <Chart options={opts} series={series} type="heatmap" height={460} />
                <div className="analyst-foot">Score 1 (Weak, red) → 5 (Strong, green). ★ TRUE VISIONS row pinned at top.</div>
            </div>
            <TableContainer component={Paper} className="analyst-table">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Company</TableCell>
                            <TableCell align="right">Network</TableCell>
                            <TableCell align="right">Switching</TableCell>
                            <TableCell align="right">Cost</TableCell>
                            <TableCell align="right">Intangibles</TableCell>
                            <TableCell align="right">Branding</TableCell>
                            <TableCell>Overall moat</TableCell>
                            <TableCell>Notes</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {MOAT.map(m => (
                            <TableRow key={m.name} className={m.name === 'TRUE VISIONS' ? 'analyst-row-self' : ''}>
                                <TableCell>{m.name}</TableCell>
                                <TableCell align="right">{m.network}</TableCell>
                                <TableCell align="right">{m.switching}</TableCell>
                                <TableCell align="right">{m.cost}</TableCell>
                                <TableCell align="right">{m.intangibles}</TableCell>
                                <TableCell align="right">{m.branding}</TableCell>
                                <TableCell><Chip size="small" label={m.overall} className={`moat-chip moat-${m.overall.toLowerCase()}`} /></TableCell>
                                <TableCell>{m.notes}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

const SwotPanel = () => {
    const groups = ['Strength', 'Weakness', 'Opportunity', 'Threat'];
    const byGroup = (g) => SWOT.filter(s => s.cat === g);
    return (
        <>
            <SectionTitle>SWOT — TRUE VISIONS strategic position scored 1–5</SectionTitle>
            <div className="analyst-swot-grid">
                {groups.map(g => (
                    <div key={g} className={`analyst-swot-quad swot-${g.toLowerCase()}`}>
                        <div className="analyst-swot-head">{g.toUpperCase()}</div>
                        {byGroup(g).map(s => (
                            <div key={s.factor} className="analyst-swot-item" style={{ '--impact': s.impact }}>
                                <div className="analyst-swot-factor">
                                    {s.factor}
                                    <span className={`impact-pip impact-${s.impact}`} title={`Score ${s.impact}/5`}>{s.impact}</span>
                                </div>
                                <div className="analyst-swot-evidence">{s.evidence}</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
};

const PorterPanel = () => {
    const opts = {
        ...apexBase,
        chart: { ...apexBase.chart, type: 'radar' },
        xaxis: { categories: PORTER.map(p => p.force) },
        yaxis: { min: 0, max: 5, tickAmount: 5 },
        colors: ['#ff6b6b'],
        stroke: { width: 2 },
        fill: { opacity: 0.25 },
        markers: { size: 5 },
    };
    const series = [{ name: 'Force intensity (1-5)', data: PORTER.map(p => p.rating) }];
    return (
        <>
            <SectionTitle>Industry pressure is uniformly high — Buyer Power and Substitutes pin the ceiling at 5/5</SectionTitle>
            <div className="analyst-two-col">
                <div className="analyst-chart-card">
                    <Chart options={opts} series={series} type="radar" height={380} />
                </div>
                <div className="analyst-chart-card">
                    <TableContainer component={Paper} className="analyst-table">
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Force</TableCell>
                                    <TableCell>Rating</TableCell>
                                    <TableCell>Key driver</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {PORTER.map(p => (
                                    <TableRow key={p.force}>
                                        <TableCell>{p.force}</TableCell>
                                        <TableCell>
                                            <Chip size="small" label={`${p.rating}/5`} className={`porter-chip porter-${p.rating}`} />
                                        </TableCell>
                                        <TableCell>{p.key}<div className="analyst-foot">{p.evidence}</div></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </>
    );
};

const PestelPanel = () => (
    <>
        <SectionTitle>PESTEL — TRUE VISIONS macro-environment scored 1–5 (higher = stronger pressure)</SectionTitle>
        <TableContainer component={Paper} className="analyst-table">
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell>Factor</TableCell>
                        <TableCell align="right">Score</TableCell>
                        <TableCell>Explanation</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {PESTEL.map(p => (
                        <TableRow key={p.factor}>
                            <TableCell>{p.cat}</TableCell>
                            <TableCell>{p.factor}</TableCell>
                            <TableCell align="right">
                                <span className={`impact-pip impact-${p.score}`}>{p.score}</span>
                            </TableCell>
                            <TableCell>{p.explanation}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>
);

// ---------------------------------------------------------------------------
// Tab 4 — Risk Watchlist
// ---------------------------------------------------------------------------
const RiskWatchlist = () => {
    const risks = useMemo(() => {
        const fromSwot = SWOT
            .filter(s => (s.cat === 'Weakness' || s.cat === 'Threat') && s.impact >= 4)
            .map(s => ({ source: s.cat.toUpperCase(), factor: s.factor, evidence: s.evidence, action: '—', impact: s.impact }));
        const fromPestel = PESTEL
            .filter(p => p.score >= 4)
            .map(p => ({ source: 'PESTEL', factor: p.factor, evidence: `${p.cat} · ${p.explanation}`, action: '—', impact: p.score }));
        const fromPorter = PORTER
            .filter(p => p.rating >= 4)
            .map(p => ({ source: 'PORTER', factor: p.force, evidence: p.key, action: p.evidence, impact: p.rating }));
        return [...fromSwot, ...fromPestel, ...fromPorter].sort((a, b) => b.impact - a.impact);
    }, []);

    return (
        <div className="analyst-tab">
            <SectionTitle>Risk queue — auto-derived from SWOT (impact ≥ 4), PESTEL (score ≥ 4) and Porter (rating ≥ 4)</SectionTitle>
            <TableContainer component={Paper} className="analyst-table">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Source</TableCell>
                            <TableCell>Risk</TableCell>
                            <TableCell>Evidence</TableCell>
                            <TableCell>Strategic action</TableCell>
                            <TableCell align="right">Impact</TableCell>
                            <TableCell>Push</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {risks.map((r, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <Chip size="small" label={r.source} className={`risk-source risk-${r.source.toLowerCase()}`} />
                                </TableCell>
                                <TableCell>{r.factor}</TableCell>
                                <TableCell>{r.evidence}</TableCell>
                                <TableCell>{r.action}</TableCell>
                                <TableCell align="right">
                                    <span className={`impact-pip impact-${r.impact}`}>{r.impact}</span>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Backend route /api/projects/draft will be wired in phase 2">
                                        <span className="analyst-push-btn">→ Project</span>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Page shell
// ---------------------------------------------------------------------------
export default function Analyst() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [tab, setTab] = useState(0);

    return (
        <div className="App">
            <Sidebar onToggle={(isOpen) => setSidebarOpen(isOpen)} />
            <div className={sidebarOpen ? 'body-grid' : 'body-grid-close'}>
                <div className="header_container">
                    <img className="true-logo" src={process.env.PUBLIC_URL + '/assets/true-logo.png'} alt="True Logo" />
                </div>
                <div className="body_container">
                    <div className="body-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <span>AI ANALYST · COMPETITIVE DEEP-DIVE</span>
                        <span className="analyst-source-pill">Source · Signed True Visions Group FS31Dec2025</span>
                    </div>

                    <Tabs
                        value={tab}
                        onChange={(_, v) => setTab(v)}
                        className="analyst-tabs"
                        variant="scrollable"
                        textColor="inherit"
                        TabIndicatorProps={{ style: { background: '#1589ff' } }}
                    >
                        <Tab label="Executive Cockpit" />
                        <Tab label="Financial Benchmark" />
                        <Tab label="OTT Industry KPIs" />
                        <Tab label="Strategic Synthesis" />
                        <Tab label="Risk Watchlist" />
                    </Tabs>

                    {tab === 0 && <ExecutiveCockpit goTab={setTab} />}
                    {tab === 1 && <FinancialBenchmark />}
                    {tab === 2 && <OttKpis />}
                    {tab === 3 && <Synthesis />}
                    {tab === 4 && <RiskWatchlist />}
                </div>
            </div>
        </div>
    );
}
