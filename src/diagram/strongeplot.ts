import {
  findStickTime,
  findRootSlipStickSlip,
  β_n,
  β_t,
  k_n as K_N,
} from "../model/physics/stronge"
import {
  config,
  color,
  createTrace,
  layout as baseLayout,
} from "./plotlyconfig"

const V_N_0 = -3.0
const MU = 0.2
const E_N = 0.85
const M = 0.170097
const BETA_RATIO = β_t / β_n
const OMEGA_RATIO = 1.7
const ETA_SQUARED = BETA_RATIO / (OMEGA_RATIO * OMEGA_RATIO)

const OMEGA_N = Math.sqrt((β_n * K_N) / M)
const OMEGA_T = OMEGA_N * Math.sqrt(BETA_RATIO / ETA_SQUARED)
const T_C = Math.PI / (2 * OMEGA_N)
const T_F = (1 + E_N) * T_C
const T_C_SHIFT = (Math.PI / 2) * (1 - 1 / E_N)

function f_per_m_n(t: number) {
  if (t <= T_C) {
    return ((-OMEGA_N * V_N_0) / β_n) * Math.sin(OMEGA_N * t)
  } else {
    return (
      ((-OMEGA_N * V_N_0) / β_n) * Math.sin((OMEGA_N * t) / E_N + T_C_SHIFT)
    )
  }
}

function f_per_m_t_stick(
  t: number,
  v_t_stick: number,
  u_t_stick: number,
  t_stick: number
) {
  const dt = t - t_stick
  const u_t =
    u_t_stick * Math.cos(OMEGA_T * dt) -
    (v_t_stick / OMEGA_T) * Math.sin(OMEGA_T * dt)
  return (OMEGA_T * OMEGA_T * u_t) / β_t
}

export class StrongePlot {
  public plot() {
    const slider = document.getElementById("interp-slider") as HTMLInputElement
    const update = () => {
      const interp = slider ? parseFloat(slider.value) : 0.5
      this.plotInitialStick(interp, "initial-stick-force")
      this.plotInitialSlip(
        interp,
        "initial-slip-force",
        "initial-slip-velocity"
      )
    }
    if (slider) {
      slider.addEventListener("input", update)
    }
    update()
  }

  private plotInitialStick(interp: number, elementId: string) {
    const v_t_0 = V_N_0 * MU * interp * ETA_SQUARED

    const ts: number[] = []
    const n = 200
    for (let i = 0; i <= n; i++) ts.push((i * T_F) / n)

    const force_factor = β_n / (OMEGA_N * -V_N_0)

    const f_n_trace = ts.map((t) => f_per_m_n(t) * force_factor)
    const f_t_stick_trace = ts.map(
      (t) => (f_per_m_t_stick(t, v_t_0, 0, 0) * force_factor) / MU
    )

    const traces = [
      createTrace(
        ts.map((t) => t / T_C),
        f_n_trace,
        "f_per_m_n",
        color(0)
      ),
      createTrace(
        ts.map((t) => t / T_C),
        f_n_trace.map((y) => -y),
        "-f_per_m_n",
        color(1)
      ),
      createTrace(
        ts.map((t) => t / T_C),
        f_t_stick_trace,
        "f_per_m_t_stick",
        color(2)
      ),
    ]
    ;(traces[1] as any).line.dash = "dash"

    const layout = JSON.parse(JSON.stringify(baseLayout))
    layout.title.text = `Initial Stick (x=${interp.toFixed(2)})`
    layout.xaxis.title = "non-dimensional time (t/t_c)"
    layout.yaxis.title = "non-dimensional force"
    ;(globalThis as any).Plotly.react(elementId, traces, layout, config)
  }

  private plotInitialSlip(interp: number, forceId: string, velocityId: string) {
    const v_t_0_start = ETA_SQUARED
    const v_t_0_end = (1 + E_N) * BETA_RATIO - ETA_SQUARED / E_N
    const v_t_0_val = v_t_0_start + interp * (v_t_0_end - v_t_0_start)
    const v_t_0 = V_N_0 * MU * v_t_0_val
    const v_ratio = v_t_0 / V_N_0

    const t_stick = findStickTime(
      v_ratio,
      MU,
      BETA_RATIO,
      ETA_SQUARED,
      T_C,
      T_C_SHIFT,
      E_N
    )

    const v_t_at_stick =
      t_stick <= T_C
        ? v_t_0 - MU * BETA_RATIO * V_N_0 * (1 - Math.cos(OMEGA_N * t_stick))
        : v_t_0 -
          MU *
            BETA_RATIO *
            V_N_0 *
            (1 - E_N * Math.cos((OMEGA_N * t_stick) / E_N + T_C_SHIFT))

    const u_t_at_stick =
      t_stick <= T_C
        ? ((-MU * V_N_0 * ETA_SQUARED) / OMEGA_N) * Math.sin(OMEGA_N * t_stick)
        : ((-MU * V_N_0 * ETA_SQUARED) / OMEGA_N) *
          Math.sin((OMEGA_N * t_stick) / E_N + T_C_SHIFT)

    const t_slip = findRootSlipStickSlip(
      V_N_0,
      MU,
      ETA_SQUARED,
      OMEGA_T,
      OMEGA_N,
      u_t_at_stick,
      v_t_at_stick,
      t_stick,
      T_C,
      T_F,
      T_C_SHIFT,
      E_N
    )

    const ts: number[] = []
    const n = 500
    for (let i = 0; i <= n; i++) ts.push((i * T_F) / n)
    const force_factor = β_n / (OMEGA_N * -V_N_0)

    const f_n_trace = ts.map((t) => f_per_m_n(t) * force_factor)

    const f_t = ts.map((t) => {
      if (t < t_stick) return f_n_trace[ts.indexOf(t)]
      if (t < t_slip)
        return (
          (f_per_m_t_stick(t, v_t_at_stick, u_t_at_stick, t_stick) *
            force_factor) /
          MU
        )
      return -f_n_trace[ts.indexOf(t)]
    })

    const f_t_stick_full = ts.map(
      (t) =>
        (f_per_m_t_stick(t, v_t_at_stick, u_t_at_stick, t_stick) *
          force_factor) /
        MU
    )

    const v_t = ts.map((t) => {
      if (t < t_stick) {
        if (t <= T_C)
          return v_t_0 - MU * BETA_RATIO * V_N_0 * (1 - Math.cos(OMEGA_N * t))
        return (
          v_t_0 -
          MU *
            BETA_RATIO *
            V_N_0 *
            (1 - E_N * Math.cos((OMEGA_N * t) / E_N + T_C_SHIFT))
        )
      }
      const dt = t - t_stick
      return (
        OMEGA_T * u_t_at_stick * Math.sin(OMEGA_T * dt) +
        v_t_at_stick * Math.cos(OMEGA_T * dt)
      )
    })

    const u_t_dot = ts.map((t) => {
      if (t < t_stick) {
        if (t <= T_C) return MU * ETA_SQUARED * V_N_0 * Math.cos(OMEGA_N * t)
        return (
          MU * ETA_SQUARED * V_N_0 * Math.cos((OMEGA_N * t) / E_N + T_C_SHIFT)
        )
      }
      const dt = t - t_stick
      return -(
        OMEGA_T * u_t_at_stick * Math.sin(OMEGA_T * dt) +
        v_t_at_stick * Math.cos(OMEGA_T * dt)
      )
    })

    // Force plot
    const forceTraces = [
      createTrace(
        ts.map((t) => t / T_C),
        f_n_trace,
        "f_per_m_n",
        color(0)
      ),
      createTrace(
        ts.map((t) => t / T_C),
        f_n_trace.map((y) => -y),
        "-f_per_m_n",
        color(1)
      ),
      createTrace(
        ts.map((t) => t / T_C),
        f_t_stick_full,
        "f_per_m_t_stick",
        color(3)
      ),
      createTrace(
        ts.map((t) => t / T_C),
        f_t,
        "f_per_m_t",
        color(2)
      ),
    ]
    ;(forceTraces[1] as any).line.dash = "dash"
    ;(forceTraces[2] as any).line.dash = "dash"

    const forceLayout = JSON.parse(JSON.stringify(baseLayout))
    forceLayout.title.text = `Initial Slip Force (x=${interp.toFixed(2)})`
    forceLayout.xaxis.title = "non-dimensional time (t/t_c)"
    forceLayout.yaxis.title = "non-dimensional force"
    ;(globalThis as any).Plotly.react(forceId, forceTraces, forceLayout, config)

    // Velocity plot
    const velocityTraces = [
      createTrace(
        ts.map((t) => t / T_C),
        v_t,
        "v_t",
        color(0)
      ),
      createTrace(
        ts.map((t) => t / T_C),
        u_t_dot.map((y) => -y),
        "-u_t_dot",
        color(1)
      ),
    ]
    const velocityLayout = JSON.parse(JSON.stringify(baseLayout))
    velocityLayout.title.text = `Initial Slip Velocity (x=${interp.toFixed(2)})`
    velocityLayout.xaxis.title = "non-dimensional time (t/t_c)"
    velocityLayout.yaxis.title = "velocity"
    ;(globalThis as any).Plotly.react(
      velocityId,
      velocityTraces,
      velocityLayout,
      config
    )
  }
}
