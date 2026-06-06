import { useId, useMemo, useState } from "react";

/**
 * CompoundInterest — 第 3 层「React 19 island」示范件。
 *
 * 何时用这一层：复杂表现 —— 多个输入互相联动、状态驱动的实时重算、需要图表库
 * （recharts / visx / d3 包装）或较深的组件树。本件刻意**不引图表库**，用纯
 * React state + 内联条形证明 hydration 与状态联动即可。
 *
 * 主题契约：配色一律用随 `data-theme` 翻转的 Tailwind 语义工具类
 * （`text-foreground` / `bg-accent` / `border-foreground/…`），无需手动取色；
 * 过渡动效用 `motion-safe:` 变体，自动尊重 `prefers-reduced-motion`。
 *
 * a11y：每个滑块用 `useId()` 关联 `<label>`；装饰性的条形图 `aria-hidden`，
 * 关键数值以文本形式给出，读屏可读。
 *
 * 在 MDX 中默认以 `client:visible` 注水：
 *   <CompoundInterest client:visible />
 */
interface Props {
  /** 本金初值。 */
  principal?: number;
  /** 年利率初值（百分数，如 5 表示 5%）。 */
  rate?: number;
  /** 年数初值。 */
  years?: number;
  /** 数值前缀单位（如 "$"）；默认无。 */
  unit?: string;
}

export default function CompoundInterest({
  principal: principal0 = 1000,
  rate: rate0 = 5,
  years: years0 = 10,
  unit = "",
}: Props) {
  const [principal, setPrincipal] = useState(principal0);
  const [rate, setRate] = useState(rate0);
  const [years, setYears] = useState(years0);
  const uid = useId();

  const series = useMemo(() => {
    const out: number[] = [];
    for (let y = 0; y <= years; y += 1) out.push(principal * Math.pow(1 + rate / 100, y));
    return out;
  }, [principal, rate, years]);

  const final = series[series.length - 1] ?? principal;
  // 用整段序列的最大值做峰值：rate 可经 prop 传负数（滑块 min=0 只约束拖动），
  // 此时序列递减、principal 才是峰值，用 final 会让所有柱子超过 100% 溢出容器。
  const peak = Math.max(...series, 1);
  const gain = final - principal;
  // principal 可由 prop 传入 0（滑块 min=100 只约束拖动，不约束初值）→ 守护分母避免 NaN%。
  const gainPct = principal > 0 ? (gain / principal) * 100 : 0;
  const fmt = (n: number) => unit + Math.round(n).toLocaleString();

  const reset = () => {
    setPrincipal(principal0);
    setRate(rate0);
    setYears(years0);
  };

  const sliders = [
    { id: `${uid}-p`, label: "本金", value: principal, min: 100, max: 10000, step: 100, set: setPrincipal, fmt: (n: number) => fmt(n) },
    { id: `${uid}-r`, label: "年利率", value: rate, min: 0, max: 20, step: 0.5, set: setRate, fmt: (n: number) => `${n}%` },
    { id: `${uid}-y`, label: "年数", value: years, min: 1, max: 40, step: 1, set: setYears, fmt: (n: number) => `${n} 年` },
  ];

  return (
    <div className="not-prose border-foreground/10 my-8 rounded-lg border p-4 sm:p-5">
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
              onChange={(e) => s.set(Number(e.target.value))}
            />
          </div>
        ))}
      </div>

      {/* 装饰性增长条：每年一条，高度按复利占比。数据已在下方以文本给出。 */}
      <div
        aria-hidden="true"
        className="mt-5 flex h-24 items-end gap-[2px]"
      >
        {series.map((v, i) => (
          <div
            key={i}
            className="bg-accent motion-safe:transition-[height] flex-1 rounded-sm"
            style={{ height: `${Math.max(4, (v / peak) * 100)}%` }}
          />
        ))}
      </div>

      <div className="border-foreground/10 mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t pt-4 text-sm">
        <p className="text-foreground">
          {years} 年后：
          <span className="text-accent ml-1 font-mono text-base font-medium tabular-nums">
            {fmt(final)}
          </span>
        </p>
        <p className="text-foreground/70 font-mono tabular-nums">
          收益 +{fmt(gain)}（{gainPct.toFixed(0)}%）
        </p>
        <button
          type="button"
          onClick={reset}
          className="text-accent hover:text-foreground cursor-pointer underline underline-offset-4 transition-colors"
        >
          重置
        </button>
      </div>
    </div>
  );
}
