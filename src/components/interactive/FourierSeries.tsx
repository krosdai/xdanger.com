import { useId, useMemo, useState } from "react";

/**
 * FourierSeries — 第 3 层「React 19 island」。
 *
 * 主题：傅里叶级数 —— 任何周期函数都能拆成正弦谐波之和。方波 =
 *   (4/π)·Σ_{k=1,3,5,…} sin(kx)/k
 * 拖滑块加项，部分和逐步逼近方波（边沿处可见 Gibbs 过冲）。状态驱动的实时重算 +
 * 交互，正是该升到 React 的场景。
 *
 * 主题契约：每条谐波用一种分类色 `--color-cat-1…6`（内联 CSS 变量，随 `[data-theme]`
 * 自动变色、且能按序号动态取色而不被 Tailwind purge），部分和用 `--color-accent`；
 * 滑块 / 文字用随 `dark:` 翻转的工具类。装饰性 SVG `aria-hidden`，关键信息走文本与
 * 带 `<label>` 的滑块，读屏可达。
 */
interface Props {
  /** 初始谐波项数。 */
  terms?: number;
  /** 最大项数。 */
  maxTerms?: number;
}

const W = 640;
const H = 200;
const PAD = 16;
const MIDY = H / 2;
const AMP = 72;
const SAMPLES = 280;
const CAT = [
  "var(--color-cat-1)",
  "var(--color-cat-2)",
  "var(--color-cat-3)",
  "var(--color-cat-4)",
  "var(--color-cat-5)",
  "var(--color-cat-6)",
];

export default function FourierSeries({ terms: terms0 = 5, maxTerms = 12 }: Props) {
  // 把初始项数 clamp 到 [1, maxTerms]，否则越界的 prop 会让受控 range input 的 value
  // 落到 min/max 之外（React 告警 + 交互异常）。
  const [terms, setTerms] = useState(() => Math.min(maxTerms, Math.max(1, terms0)));
  const uid = useId();

  const xs = useMemo(() => Array.from({ length: SAMPLES + 1 }, (_, i) => (i / SAMPLES) * Math.PI * 2), []);

  const { harmonics, sum, square } = useMemo(() => {
    const harmonics: { k: number; vals: number[] }[] = [];
    for (let j = 0; j < terms; j += 1) {
      const k = 2 * j + 1;
      harmonics.push({ k, vals: xs.map((x) => ((4 / Math.PI) * Math.sin(k * x)) / k) });
    }
    const sum = xs.map((_, i) => harmonics.reduce((acc, h) => acc + h.vals[i], 0));
    const square = xs.map((x) => (x < Math.PI ? 1 : -1));
    return { harmonics, sum, square };
  }, [terms, xs]);

  const toPath = (vals: number[]) =>
    vals
      .map((v, i) => `${(PAD + (i / SAMPLES) * (W - 2 * PAD)).toFixed(1)},${(MIDY - v * AMP).toFixed(1)}`)
      .join(" ");

  return (
    <div className="not-prose border-foreground/10 my-8 rounded-lg border p-4 sm:p-5">
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between text-sm">
          <label htmlFor={`${uid}-n`} className="text-foreground">
            谐波项数
          </label>
          <span className="text-accent font-mono tabular-nums">
            {terms} 项 · 最高 {2 * terms - 1} 次
          </span>
        </div>
        <input
          id={`${uid}-n`}
          className="accent-accent cursor-pointer"
          type="range"
          min={1}
          max={maxTerms}
          step={1}
          value={terms}
          onChange={(e) => setTerms(Number(e.target.value))}
        />
      </div>

      <svg
        aria-hidden="true"
        className="mt-4 block w-full"
        viewBox={`0 0 ${W} ${H}`}
        style={{ height: "auto" }}
      >
        {/* 中线 + 目标方波（faint） */}
        <line
          x1={PAD}
          y1={MIDY}
          x2={W - PAD}
          y2={MIDY}
          stroke="var(--color-axis)"
          strokeWidth={1}
        />
        <polyline
          points={toPath(square)}
          fill="none"
          stroke="var(--color-ink)"
          strokeOpacity={0.22}
          strokeWidth={1.4}
          strokeDasharray="4 4"
        />
        {/* 各次谐波（分类色，faint） */}
        {harmonics.map((h, j) => (
          <polyline
            key={h.k}
            points={toPath(h.vals)}
            fill="none"
            stroke={CAT[j % CAT.length]}
            strokeOpacity={0.34}
            strokeWidth={1.3}
          />
        ))}
        {/* 部分和（accent，粗） */}
        <polyline
          points={toPath(sum)}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <p className="text-foreground/70 mt-3 font-mono text-sm tabular-nums">
        {terms} 项谐波叠加，逼近方波；边沿的 Gibbs 过冲不随项数消失。
      </p>
    </div>
  );
}
