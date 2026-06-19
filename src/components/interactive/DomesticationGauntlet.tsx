import { useId, useState } from "react";

/**
 * DomesticationGauntlet — 第 3 层「React 19 island」。
 *
 * 主题：Diamond 的「六道关卡」是一道合取式的连环筛——148 种候选大型哺乳动物里，
 * 只有 14 种六关全过、被驯化（其中 13 种在欧亚）。点开任意一关，看是谁卡在这里、为什么。
 * 安娜·卡列尼娜原理：能驯化的都相像，不能驯化的各有各的出局理由。
 *
 * 为什么用 React：六个关卡是可点开/收起的状态联动，移动端用点击（非 hover）逐关揭示，
 * 比静态 SVG 更适合「逐关探索」。每代候选数（72/51/24/1）未经一手核实，故只标 148→14 两端，
 * 各关只给「代表性失败者」，不编造逐关数字。
 *
 * 主题契约：配色一律用随 data-theme 翻转的 Tailwind 语义工具类；过渡用 motion-safe:。
 * a11y：每关是真正的 <button>，aria-expanded/aria-controls 关联；受控面板始终在 DOM 中、
 *   仅用 hidden 切换可见（aria-controls 在收起时也指向真实元素）；图整体 role="group" + aria-label。
 *
 * 在 MDX 中以 client:visible 注水：<DomesticationGauntlet client:visible />
 */
interface Gate {
  key: string;
  title: string;
  need: string;
  failHead: string;
  fail: string;
}
const GATES: Gate[] = [
  {
    key: "diet",
    title: "① 吃得便宜",
    need: "不能是纯肉食",
    failHead: "食肉动物出局",
    fail: "能量每升一级只剩约一成（生态「十一律」），养一头肉食动物约等于养十头同重的食草动物——喂不起。",
  },
  {
    key: "growth",
    title: "② 长得快",
    need: "几年内就能出栏/可用",
    failHead: "大象出局",
    fail: "要十几年才成年。等得起的人，不如去抓野象驯使，而非圈养繁育——慢成长直接劝退。",
  },
  {
    key: "breed",
    title: "③ 圈养能繁殖",
    need: "在人看管下愿意交配",
    failHead: "猎豹出局",
    fail: "求偶要长途追逐，关进圈里就不育。古埃及人养过猎豹打猎，却始终得去野外捕捉、无法自繁。",
  },
  {
    key: "temper",
    title: "④ 性情温顺",
    need: "不会动辄攻击人",
    failHead: "斑马 / 河马 / 灰熊 / 非洲水牛出局",
    fail: "脾气太烈、力气太大。斑马会咬住人不松口，每年伤的饲养员据 Diamond 说比老虎还多。",
  },
  {
    key: "panic",
    title: "⑤ 不易惊逃",
    need: "受惊不会盲目狂奔",
    failHead: "瞪羚等羚羊出局",
    fail: "天性一惊就炸群猛冲，撞栏而死（捕获性肌病）。2024 年有研究认为，这道「惊逃关」可能是六关里最关键的一道。",
  },
  {
    key: "social",
    title: "⑥ 群居有等级",
    need: "成群、有首领、不强领地",
    failHead: "多数鹿科 / 独居猫科出局",
    fail: "群居且认首领，人就能接管那个「头领」位置、整群驱赶。独居或强领地的动物没有这个抓手。",
  },
];

export default function DomesticationGauntlet() {
  const [open, setOpen] = useState<string | null>(null);
  const uid = useId();

  return (
    <div
      className="not-prose border-foreground/10 my-8 rounded-lg border p-4 sm:p-5"
      role="group"
      aria-label="驯化的六道关卡：148 种候选，仅 14 种通过"
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-foreground text-sm font-medium">
          <span className="text-accent font-mono text-base tabular-nums">148</span> 种候选
          <span className="text-foreground/50">（≥45 kg 的大型陆生食草/杂食哺乳动物）</span>
        </p>
      </div>

      <p className="text-foreground/60 mt-1 text-xs">
        六关全过才能被驯化——挂一关就出局（合取逻辑）。点开看谁卡在哪一关。
      </p>

      <ul className="mt-4 flex flex-col gap-2">
        {GATES.map((g) => {
          const isOpen = open === g.key;
          const panelId = `${uid}-${g.key}`;
          return (
            <li key={g.key}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  setOpen(isOpen ? null : g.key);
                }}
                className="border-foreground/10 hover:border-accent/40 flex w-full items-center justify-between gap-3 rounded-md border px-3 py-2.5 text-left transition-colors"
              >
                <span className="text-foreground text-sm font-medium">{g.title}</span>
                <span className="text-foreground/55 flex items-center gap-2 text-xs">
                  <span className="hidden sm:inline">{g.need}</span>
                  <span
                    aria-hidden="true"
                    className={`text-accent motion-safe:transition-transform ${isOpen ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </span>
              </button>
              {/* 始终渲染，仅用 hidden 切换可见性：让 button 的 aria-controls
                  在收起时也能指向真实存在的元素（WAI-ARIA disclosure 约定）。 */}
              <div
                id={panelId}
                hidden={!isOpen}
                className="border-accent/30 bg-accent/5 mt-1 rounded-md border-l-2 px-3 py-2.5"
              >
                <p className="text-accent text-xs font-semibold">{g.failHead}</p>
                <p className="text-foreground/80 mt-1 text-sm leading-relaxed">{g.fail}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="border-foreground/10 mt-4 flex items-baseline justify-between border-t pt-3">
        <p className="text-foreground text-sm">六关全过</p>
        <p className="text-foreground/70 text-sm">
          仅 <span className="text-accent font-mono text-base tabular-nums">14</span> 种被驯化
          <span className="text-foreground/45 ml-1 text-xs">其中 13 种在欧亚</span>
        </p>
      </div>
    </div>
  );
}
