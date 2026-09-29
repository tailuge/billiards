/**
 * The shot svgeditor.html is editing.
 *
 * One shot, held in the shape three.html carries in a .topview data-state, so
 * a single serialised string can drive the input table, the replay and the
 * launch links. This module is the only place the editor's defaults live; the
 * page reads them, never writes them.
 *
 * The physics values below mirror src/model/physics/constants.ts, which is the
 * source of truth for the simulation. They are held here rather than read from
 * the bundle because the diagram does not read them from the URL either -- only
 * BrowserContainer does -- so they are carried for the launch links, which
 * forward them to pages that do.
 */

export const DEFAULT_RULETYPE = "threecushion";

export const DEFAULT_CUSHION_MODEL = "mathavan";

// The models DiagramContainer accepts, with mathavan as the one it falls back
// to when the state names none.
export const CUSHION_MODELS = [
  "mathavan",
  "bounceHan",
  "bounceHanBlend",
  "stronge",
];

// three.html's default layout and shot, with the cue tip centred, which is
// where the editor's spin widget starts.
export const DEFAULT_STATE = {
  ruleType: DEFAULT_RULETYPE,
  cushionModel: DEFAULT_CUSHION_MODEL,
  practice: false,
  balls: [
    { x: -1.305026, y: -0.634005 },
    { x: -1.434758, y: 0.601475 },
    { x: -1.310215, y: 0.685593 },
  ],
  shot: {
    angle: 0.63687,
    power: 2.62,
    offset: { x: 0, y: 0 },
    elevation: 0,
    i: 0,
  },
};

// The page's own convention: three.html rounds a state to six places so a share
// link stays short and the numbers read as measurements.
const round = (value) => +Number(value).toFixed(6);

const number = (value, fallback) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

// init is the flat [x0,y0,x1,y1,...] the diagram serialises and the editor
// reads; the widgets want points, so the two shapes meet here.
function toBalls(init) {
  const balls = [];
  const count = Array.isArray(init) ? Math.floor(init.length / 2) : 0;
  for (let i = 0; i < count; i += 1) {
    balls.push({ x: number(init[i * 2], 0), y: number(init[i * 2 + 1], 0) });
  }
  return balls;
}

function toShot(json) {
  // Shots arrive either as the state document's shots[] or as the shot itself.
  const shot = Array.isArray(json?.shots) ? json.shots[0] : json?.shot;
  return {
    angle: number(shot?.angle, DEFAULT_STATE.shot.angle),
    power: number(shot?.power, DEFAULT_STATE.shot.power),
    offset: {
      x: number(shot?.offset?.x, 0),
      y: number(shot?.offset?.y, 0),
    },
    elevation: number(shot?.elevation, 0),
    i: number(shot?.i, 0),
  };
}

function toState(shot, balls, params) {
  return {
    ruleType: params.get("ruletype") ?? shot.ruleType ?? DEFAULT_RULETYPE,
    cushionModel:
      params.get("cushionModel") ?? shot.cushionModel ?? DEFAULT_CUSHION_MODEL,
    practice: params.has("practice"),
    balls: balls.length > 0 ? balls : DEFAULT_STATE.balls,
    shot: toShot(shot),
  };
}

/**
 * The shot to open on. ?s= is the share form three.html writes; ?state= is the
 * same document in the form the diagram's data-state carries it. Anything
 * unparseable falls back to the default rather than leaving the editor shotless.
 */
export function readState(params = new URLSearchParams()) {
  const raw = params.get("s") ?? params.get("state");
  let parsed = null;
  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      console.warn("editor state: unreadable, using the default shot", error);
    }
  }
  return toState(parsed ?? {}, toBalls(parsed?.init), params);
}

/**
 * The state document the diagram bundle reads, in the shape its Replay
 * controller takes. The cue ball's position is the shot's `pos` and `i`, both
 * of which the editor keeps up to date as balls move.
 */
export function toStateJson(state) {
  const balls = state.balls ?? [];
  const shot = state.shot ?? DEFAULT_STATE.shot;
  const cue = balls[shot.i ?? 0] ?? balls[0] ?? { x: 0, y: 0 };
  return {
    // What makes this a diagram replay rather than a game replay: Replay forces
    // the top view for every shot and drops the 1.5s between them. Left off,
    // the first shot swings the camera to the aim view and the shot that follows
    // only comes back to the top -- three.html's own state carries this flag,
    // and it is what keeps its replay overhead.
    diagram: true,
    init: balls.flatMap((ball) => [round(ball.x), round(ball.y)]),
    shots: [
      {
        type: "AIM",
        offset: {
          x: round(shot.offset?.x ?? 0),
          y: round(shot.offset?.y ?? 0),
          z: 0,
        },
        angle: round(shot.angle),
        power: round(shot.power),
        pos: { x: round(cue.x), y: round(cue.y), z: 0 },
        i: shot.i ?? 0,
        // Only carried when raised: the replay takes the angle, the power and
        // the offset, and the game page's ?initShot is what reads an elevation.
        ...(shot.elevation ? { elevation: round(shot.elevation) } : {}),
      },
    ],
  };
}

/**
 * The ?ruletype=...&state=... string a .topview carries and a share link
 * repeats. The defaults are left out, so an untouched editor round-trips to the
 * short form three.html uses.
 */
export function serializeState(state) {
  const params = new URLSearchParams();
  params.set("ruletype", state.ruleType ?? DEFAULT_RULETYPE);
  const cushionModel = state.cushionModel ?? DEFAULT_CUSHION_MODEL;
  if (cushionModel !== DEFAULT_CUSHION_MODEL) {
    params.set("cushionModel", cushionModel);
  }
  if (state.practice) params.set("practice", "true");
  params.set("state", JSON.stringify(toStateJson(state)));
  return `?${params.toString()}`;
}

// The values src/model/physics/constants.ts starts with, keyed as the setter
// names it takes them. e and muC are marked unused there but three.html still
// forwards them, so they stay.
export const PHYSICS_DEFAULTS = {
  R: 0.03275,
  m: 0.23,
  e: 0.86,
  mu: 0.0055,
  muS: 0.126,
  muC: 0.85,
  rho: 0.045,
  "μs": 0.2,
  "μw": 0.175,
  ee: 0.85,
  stronge_omega_ratio: 1.76,
  stronge_e_n: 0.77,
  "stronge_μ": 0.25,
};

// The order three.html forwards them in.
export const PHYSICS_KEYS = Object.keys(PHYSICS_DEFAULTS);

/**
 * The physics values to put on a launch link: what the URL overrides, and the
 * defaults where it says nothing. Number(null) is 0, so an absent key has to be
 * ruled out before the value is read.
 */
export function readConstants(params = new URLSearchParams()) {
  const values = {};
  PHYSICS_KEYS.forEach((key) => {
    const raw = params.get(key);
    const given = raw === null ? NaN : Number(raw);
    values[key] = Number.isFinite(given) ? given : PHYSICS_DEFAULTS[key];
  });
  return values;
}
