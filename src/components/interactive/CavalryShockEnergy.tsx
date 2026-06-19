import { useId, useMemo, useState } from "react";

/**
 * CavalryShockEnergy — 第 3 层「React 19 island」（受控滑杆 · 实时 ½mv²）。
 *
 * 一图一洞见：**为什么「快」比「重」值钱**。读者拖动「冲刺速度」与「人马合重」两根滑杆，
 * 看动能 ½mv² 与动量 mv 各自如何回应——动量对二者都线性（对称），动能却随速度的平方走
 * （不对称）：把速度拉一格，动能猛跳；把质量拉同样一格，只微动。这正是「速度翻倍、能量翻到
 * 四倍」的体感（driver test：洞见靠「拖动输入」才成立，而非读一个静态数字）。
 *
 * 诚实装置（honest-live-recompute gate）：
 *   - ½mv²、mv 都是严格闭式公式，且输入（速度/质量）全部暴露给读者，故实时数字诚实可验。
 *   - **不**放任何「矛尖压强 MPa」实时读数——力量集中是另一条关系（P=F/A），且网传的精确兆帕
 *     数不可靠，留给正文 §一「那个点」定性处理。一个 island 只讲一条关系。
 *   - 动能条锚定到一条**可验算**的参照：一吨小车以约 50–65 km/h 撞击 ≈95–165 kJ（同一条 ½mv²，
 *     由正文推导、非外部引用统计）。固定刻度让读者发现一个反直觉事实——两根滑杆**都拉满**，骑兵动能
 *     仍够不到那一档，印证「杀伤不在整体动能，而在集中」（此「够不到」断言由常量推导守护，见下）。
 *
 * 单位与算术：v[km/h] → v/3.6 [m/s]；KE = ½·m·(v/3.6)² [J]；p = m·(v/3.6) [kg·m/s]。
 * 默认 600 kg、36 km/h（=10 m/s）→ ½·600·10² = 30 kJ，复现正文的工作样例。
 *
 * 主题契约：配色一律用随 `data-theme` 翻转的 Tailwind 语义工具类（`text-accent` /
 * `bg-accent` / `bg-negative` / `text-foreground/…`）；唯一动效（条形宽度过渡）用 `motion-safe:`。
 * a11y：两根滑杆各以 `useId()` 关联 `<label>`；读数区 `aria-live="polite"`，装饰条 `aria-hidden`。
 *
 * 在 MDX 中以 client:visible 注水：<CavalryShockEnergy client:visible />
 */
interface Props {
  caption?: string;
}

/** 固定刻度（kJ）：让车祸带位置稳定，也让读者发现「拉满也够不到」。 */
const SCALE_KJ = 180;
/**
 * 参照档（kJ）：一吨小车以约 50–65 km/h 撞击的 ½mv²——½·1000·(50/3.6)² ≈ 96 kJ、
 * ½·1000·(65/3.6)² ≈ 163 kJ。与正文同一辆车、读者可自行验算的推导值，**非**外部引用统计。
 */
const CRASH = { lo: 95, hi: 165 };

const SPEED_MIN = 10;
const SPEED_MAX = 45; // km/h
const MASS_MIN = 400;
const MASS_MAX = 800; // kg
const SPEED0 = 36; // km/h，= 10 m/s，正文披甲骑士末段全速
const MASS0 = 600; // kg，人马合重

/**
 * 不变式：两杆都拉满的动能必须仍低于车祸档，否则下方「够不到车祸」那句会失真。
 * 由常量推导（≈62.5 kJ < 95 kJ），并据此条件渲染那句断言——日后改了滑杆上限或 CRASH，
 * 这句会自动消失，而不会留下一句变成假话的文案。
 */
const MAX_KE_KJ = (0.5 * MASS_MAX * (SPEED_MAX / 3.6) ** 2) / 1000;
const CAVALRY_STAYS_BELOW_CRASH = MAX_KE_KJ < CRASH.lo;

export default function CavalryShockEnergy({ caption }: Props) {
  const uid = useId();
  const [speed, setSpeed] = useState(SPEED0);
  const [mass, setMass] = useState(MASS0);

  const { keKJ, momentum, kePct } = useMemo(() => {
    const v = speed / 3.6; // m/s
    const ke = 0.5 * mass * v * v; // J
    return {
      keKJ: ke / 1000,
      momentum: mass * v, // kg·m/s
      kePct: Math.min(100, (ke / 1000 / SCALE_KJ) * 100),
    };
  }, [speed, mass]);

  const bandLeft = (CRASH.lo / SCALE_KJ) * 100;
  const bandWidth = ((CRASH.hi - CRASH.lo) / SCALE_KJ) * 100;

  const sliders = [
    {
      id: `${uid}-v`,
      label: "冲刺速度",
      value: speed,
      min: SPEED_MIN,
      max: SPEED_MAX,
      step: 1,
      set: setSpeed,
      fmt: (n: number) => `${n} km/h`,
    },
    {
      id: `${uid}-m`,
      label: "人马合重",
      value: mass,
      min: MASS_MIN,
      max: MASS_MAX,
      step: 10,
      set: setMass,
      fmt: (n: number) => `${n} kg`,
    },
  ];

  const atDefault = speed === SPEED0 && mass === MASS0;

  return (
    <figure className="not-prose text-foreground my-8">
      <div className="border-foreground/10 rounded-lg border p-4 sm:p-5">
        <p className="text-foreground/70 text-sm">
          为什么「快」比「重」值钱——拖动滑杆，看 <span className="font-mono">½mv²</span> 怎么回应
        </p>

        <div className="mt-4 flex flex-col gap-4">
          {sliders.map((s) => (
            <div key={s.id} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between text-sm">
                <label htmlFor={s.id} className="text-foreground/80">
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
                onChange={(e) => {
                  s.set(Number(e.target.value));
                }}
              />
            </div>
          ))}
        </div>

        <div aria-live="polite" className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-1">
          <p className="text-foreground/60 text-xs">
            动能 <span className="font-mono">½mv²</span>
            <span className="text-accent ml-2 font-mono text-2xl tabular-nums">
              {keKJ.toFixed(1)}
            </span>
            <span className="text-foreground/60 ml-1 text-sm">kJ</span>
          </p>
          <p className="text-foreground/50 text-xs">
            动量 <span className="font-mono">mv</span>
            <span className="text-foreground/80 ml-2 font-mono text-base tabular-nums">
              {Math.round(momentum).toLocaleString()}
            </span>
            <span className="ml-1">kg·m/s</span>
          </p>
        </div>

        {/* 装饰性对照条：动能（实心）vs 推导出的车祸档（阴影）。数值已在上方文本给出。 */}
        <div aria-hidden="true" className="mt-3">
          <div className="bg-foreground/5 relative h-5 w-full overflow-hidden rounded">
            <div
              className="bg-negative/15 absolute inset-y-0"
              style={{ left: `${bandLeft}%`, width: `${bandWidth}%` }}
            />
            <div
              className="bg-accent motion-safe:transition-[width] absolute inset-y-0 left-0"
              style={{ width: `${kePct}%` }}
            />
          </div>
          <div className="text-foreground/45 mt-1 flex justify-between text-xs">
            <span>0</span>
            <span className="text-negative/80">真实车祸 ≈95–165 kJ</span>
            <span>{SCALE_KJ} kJ</span>
          </div>
        </div>

        <div className="border-foreground/10 mt-4 flex items-baseline justify-between gap-3 border-t pt-3">
          <p className="text-foreground/55 text-xs leading-relaxed">
            速度按<strong className="text-foreground/80">平方</strong>
            进动能、质量只按线性：速度拉一格能量猛跳，质量拉同样一格只微动。
            {CAVALRY_STAYS_BELOW_CRASH && "而且两杆都拉满，动能仍够不到「真实车祸」——"}
            骑兵的杀伤不在这点整体动能，而在把它集中到长枪尖端的那个点上。
          </p>
          {!atDefault && (
            <button
              type="button"
              onClick={() => {
                setSpeed(SPEED0);
                setMass(MASS0);
              }}
              className="text-accent hover:text-foreground shrink-0 cursor-pointer text-xs underline underline-offset-4 transition-colors"
            >
              重置
            </button>
          )}
        </div>
      </div>
      {caption && (
        <figcaption className="text-foreground/70 mt-3 text-center text-sm">{caption}</figcaption>
      )}
    </figure>
  );
}
