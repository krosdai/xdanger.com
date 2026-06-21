import { useId, useMemo, useState } from "react";

/**
 * GrowthCompounding — 第 3 层「React 19 island」。
 *
 * 主题（§七「增长才是反常」）：让读者亲手感觉**复利**的暴力。把「长期实际年增速」
 * 从 0 拨到前沿经济体的约 1.5–2%，看几百年后的产出指数如何从「几乎没变」炸成「天文数字」。
 * 这就是马尔萨斯世界（≈0% 复利）与工业世界之间那道鸿沟的来源。
 *
 * 诚实-实时-重算闸门（REVIEW.md §0）：实时读数只由**封闭公式**驱动——
 *   index = (1 + r/100) ^ years
 * 这是严格的复利公式，读者可手算复核；输出是「从 1 起算的示意指数」（非任何被测量的
 * 真实 GDP 值），滑杆默认值落在有出处的前沿长期增速（~2%）上，0% 标注为马尔萨斯参照。
 * 因此把一个实时数字接到滑杆上是诚实的，不构成伪精确的引用。
 *
 * 主题契约：配色用随 data-theme 翻转的 Tailwind 语义工具类；过渡用 motion-safe: 变体，
 * 自动尊重 prefers-reduced-motion；每根滑杆 useId() 关联 <label>；温度计条 aria-hidden，
 * 关键数值以文本给出，读屏可读。默认 client:visible 注水。
 */
interface Props {
  /** 年增速初值（百分数，2 表示 2%）。 */
  rate?: number;
  /** 年数初值。 */
  years?: number;
  caption?: string;
}

// 温度计对数刻度上限：×1 → ×10^LOG_MAX。取 5，使下方 6 个等距刻度标签（log 0…5）
// 恰好与对数填充位置（log/LOG_MAX）一一对齐；(1.04)^300 ≈ 1.3×10^5（log≈5.12）略超，
// 由第 44 行 Math.min(1, …) 夹紧到满格。
const LOG_MAX = 5;

export default function GrowthCompounding({
  rate: rate0 = 2,
  years: years0 = 250,
  caption,
}: Props) {
  const [rate, setRate] = useState(rate0);
  const [years, setYears] = useState(years0);
  const uid = useId();

  const multiple = useMemo(() => Math.pow(1 + rate / 100, years), [rate, years]);

  // 对数温度计的填充比例（×1 在最左、×10^LOG_MAX 在最右），夹在 [0,1]。
  const fill = Math.min(1, Math.max(0, Math.log10(Math.max(multiple, 1)) / LOG_MAX));

  const fmtMultiple = (m: number) => {
    if (m < 100) return m.toFixed(1);
    if (m < 1_000_000) return Math.round(m).toLocaleString();
    return m.toExponential(1);
  };

  const reset = () => {
    setRate(rate0);
    setYears(years0);
  };

  const sliders = [
    {
      id: `${uid}-r`,
      label: "长期实际年增速",
      value: rate,
      min: 0,
      max: 4,
      step: 0.1,
      set: setRate,
      fmt: (n: number) => `${n.toFixed(1)}%`,
    },
    {
      id: `${uid}-y`,
      label: "年数",
      value: years,
      min: 50,
      max: 300,
      step: 10,
      set: setYears,
      fmt: (n: number) => `${n} 年`,
    },
  ];

  // 刻度参照点（对数位置），帮读者锚定温度计。
  const ticks = [
    { log: 0, label: "×1" },
    { log: 1, label: "×10" },
    { log: 2, label: "×100" },
    { log: 3, label: "×1000" },
    { log: 4, label: "×1 万" },
    { log: 5, label: "×10 万" },
  ];

  return (
    <figure className="not-prose border-foreground/10 my-8 flex flex-col gap-4 rounded-lg border p-4 sm:p-5">
      <div className="flex flex-col gap-4">
        {sliders.map((s) => (
          <div key={s.id} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between text-sm">
              <label htmlFor={s.id} className="text-foreground">
                {s.label}
              </label>
              <span className="text-accent font-mono tabular-nums">{s.fmt(s.value)}</span>
            </div>
            <input
              id={s.id}
              className="accent-accent cursor-pointer"
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={s.value}
              aria-valuetext={s.fmt(s.value)}
              onChange={(e) => {
                s.set(Number(e.target.value));
              }}
            />
          </div>
        ))}
      </div>

      <div className="border-foreground/10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t pt-4">
        <p className="text-foreground text-sm" aria-live="polite" aria-atomic="true">
          {years} 年后产出指数（从 1 起算）：
          <span className="text-accent ml-1 font-mono text-xl font-medium tabular-nums">
            ×{fmtMultiple(multiple)}
          </span>
        </p>
        <button
          type="button"
          onClick={reset}
          className="text-accent hover:text-foreground motion-safe:transition-colors cursor-pointer text-sm underline underline-offset-4"
        >
          重置
        </button>
      </div>

      {/* 对数温度计：×1（马尔萨斯）→ ×10^5。拖动增速时填充大幅移动 = 复利的暴力。 */}
      <div aria-hidden="true" className="flex flex-col gap-1">
        <div className="bg-foreground/8 relative h-4 w-full overflow-hidden rounded-full">
          <div
            className="bg-accent motion-safe:transition-[width] h-full rounded-full"
            style={{ width: `${Math.max(1.5, fill * 100)}%` }}
          />
        </div>
        <div className="text-foreground/45 flex justify-between font-mono text-xs tabular-nums">
          {ticks.map((t) => (
            <span key={t.label}>{t.label}</span>
          ))}
        </div>
      </div>

      <p className="text-foreground/65 text-xs leading-relaxed">
        参照：<span className="font-mono tabular-nums">0%</span> = 马尔萨斯世界，再久也几乎
        ×1；前沿经济体长期实际人均增速约 <span className="font-mono tabular-nums">1.5–2%</span>，250
        年复利约 ×42（1.5%）到 ×140（2%）。
      </p>

      {caption && <figcaption className="text-foreground/70 text-sm">{caption}</figcaption>}
    </figure>
  );
}
