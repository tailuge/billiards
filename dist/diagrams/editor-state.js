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
    // `i` is the state document's name for it and `cueBallId` the launch links'
    // -- the same ball, so either key reads the same shot.
    i: number(shot?.i ?? shot?.cueBallId, 0),
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
 * The shot the `init`/`initShot` pair carries, which is how the launch links
 * hand a shot to the game and the exporter: ?init= is the flat list of ball
 * positions and ?initShot= is the aim, each the JSON string a URL holds. They
 * arrive as two parameters rather than one document, so each is read on its own
 * and a broken one costs only what it held. Null when the URL carries neither,
 * which is what tells the caller there was nothing here to read.
 */
function readLaunchParams(params) {
  const init = params.get("init");
  const shot = params.get("initShot");
  if (init === null && shot === null) return null;

  let balls = [];
  try {
    balls = init === null ? [] : toBalls(JSON.parse(init));
  } catch (error) {
    console.warn("editor state: unreadable init, using the default layout", error);
  }

  let aim = {};
  try {
    aim = shot === null ? {} : JSON.parse(shot);
  } catch (error) {
    console.warn("editor state: unreadable initShot, using the default shot", error);
  }

  // The launch links' `initShot` is the shot itself rather than a state
  // document holding one, so it is wrapped to come through the same reader.
  return toState({ shot: aim }, balls, params);
}

/**
 * The shot to open on. ?s= is the share form three.html writes; ?state= is the
 * same document in the form the diagram's data-state carries it; ?init= and
 * ?initShot= are the pair a launch link writes, so a shot can be handed back to
 * this page the same way it is handed to the game. Anything unparseable falls
 * back to the default rather than leaving the editor shotless.
 */
export function readState(params = new URLSearchParams()) {
  const raw = params.get("s") ?? params.get("state");
  if (raw) {
    try {
      const parsed = JSON.parse(raw) ?? {};
      return toState(parsed, toBalls(parsed?.init), params);
    } catch (error) {
      console.warn("editor state: unreadable, using the default shot", error);
    }
  }
  return readLaunchParams(params) ?? toState({}, [], params);
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

/**
 * A link back to this page with one shot on it.
 *
 * The `init`/`initShot` pair is the same one the launch links write, so a shot
 * that opens here opens the same way in the game and in the exporter. What the
 * reader already has is left out: the cushion model and the rule type only when
 * they are not the defaults, and a constant only once a slider has moved it off
 * its default. Otherwise a link is mostly a dozen numbers repeating the physics
 * the reader is already running.
 *
 * `constants` is the raw slider values, keyed as the inputs are, so the caller
 * can hand over whatever is on screen without deciding what counts as changed.
 */
export function shareShotUrl(base, state, constants = {}) {
  const shot = state.shot ?? DEFAULT_STATE.shot;
  const url = new URL(base);
  // Whatever this page was opened with: the link carries the shot, not the
  // query it arrived on.
  url.search = "";

  if ((state.ruleType ?? DEFAULT_RULETYPE) !== DEFAULT_RULETYPE) {
    url.searchParams.set("ruletype", state.ruleType);
  }
  const cushionModel = state.cushionModel ?? DEFAULT_CUSHION_MODEL;
  if (cushionModel !== DEFAULT_CUSHION_MODEL) {
    url.searchParams.set("cushionModel", cushionModel);
  }

  url.searchParams.set(
    "init",
    JSON.stringify(
      (state.balls ?? []).flatMap((ball) => [round(ball.x), round(ball.y)])
    )
  );
  url.searchParams.set(
    "initShot",
    JSON.stringify({
      cueBallId: shot.i ?? 0,
      angle: round(shot.angle),
      power: round(shot.power),
      offset: {
        x: round(shot.offset?.x ?? 0),
        y: round(shot.offset?.y ?? 0),
        z: 0,
      },
      elevation: round(shot.elevation ?? 0),
    })
  );

  Object.entries(constants).forEach(([key, value]) => {
    // A constant that is not one the panel exposes has no default to compare
    // against, so it goes on the link as it stands.
    const fallback = PHYSICS_DEFAULTS[key];
    if (fallback !== undefined && Number(value) === fallback) return;
    url.searchParams.set(key, String(value));
  });

  return url;
}

// --- presets ---

/**
 * Where the editor keeps its saved shots.
 *
 * Deliberately not three.html's `three_cushion_presets`. A preset here is the
 * editor's own state, so it carries the elevation and the cushion model, which
 * that shape has nowhere to put -- so the two lists stay separate rather than
 * trading presets that quietly lose half of themselves.
 */
export const PRESETS_KEY = "svgeditor_presets";

/** Names are shown in a narrow list, and capped as three.html caps them. */
export const MAX_PRESET_NAME = 16;

/**
 * The built-in library, so a first visit has something to load.
 *
 * Converted from three.html's own `DEFAULT_PRESETS` -- the same 36 shots, which
 * are a three-cushion research set worth having. Every field maps across one for
 * one except two: three.html's shape has no elevation and no cushion model, so
 * both come out here at the editor's defaults. That is the whole of what the
 * separate list gives up, and the whole of what these gain over three.html's
 * own, where an elevation is simply lost.
 *
 * Held as [name, positions, angle, power, offsetX, offsetY] and expanded by
 * `toPreset` below, because 36 full preset objects would be a wall of
 * boilerplate nobody ever reads. Regenerate with the conversion script rather
 * than editing these by hand.
 */
const PRESET_LIBRARY = [
  ["0->3 plain", [[-1.43725,-0.723348],[-1.479545,-0.338378],[-1.479545,-0.437653]], 0.97278, 2.1484, -0.016348, 0.026548],
  ["0->3 max", [[-1.43725,-0.723348],[-1.479545,-0.338378],[-1.479545,-0.437653]], 0.97278, 2.1484, -0.298654, 0.028383],
  ["0->4 plain", [[-1.398795,-0.711841],[-1.479545,-0.338378],[-1.479545,-0.437653]], 0.834095, 2.1484, -0.032914, 0.068287],
  ["0->4 max", [[-1.398795,-0.711841],[-1.479545,-0.338378],[-1.479545,-0.437653]], 0.834095, 2.1484, -0.299159, 0.022451],
  ["0->5 plain", [[-1.379568,-0.723348],[-1.479545,-0.338378],[-1.479545,-0.437653]], 0.727616, 2.6724, -0.032914, 0.068287],
  ["0->5 max", [[-1.379568,-0.723348],[-1.479545,-0.338378],[-1.479545,-0.437653]], 0.727616, 2.6724, -0.297669, 0.037322],
  ["0->6 plain", [[-1.360341,-0.723348],[-1.479545,-0.338378],[-1.479545,-0.437653]], 0.640387, 2.6724, -0.032914, 0.068287],
  ["0->6 max", [[-1.360341,-0.723348],[-1.479545,-0.338378],[-1.479545,-0.437653]], 0.640387, 2.6724, -0.299432, 0.018458],
  ["0->7 plain", [[-1.350727,-0.723348],[-1.479545,-0.338378],[-1.479545,-0.437653]], 0.558663, 2.6724, -0.032914, 0.068287],
  ["0->7 max", [[-1.350727,-0.723348],[-1.479545,-0.338378],[-1.479545,-0.437653]], 0.558663, 2.6724, -0.298575, 0.029203],
  ["0->8 plain", [[-1.326693,-0.723348],[-1.479545,-0.338378],[-1.479545,-0.437653]], 0.501812, 2.6724, -0.010489, 0.080802],
  ["0->8 max", [[-1.326693,-0.723348],[-1.479545,-0.338378],[-1.479545,-0.437653]], 0.501812, 2.6724, -0.298776, 0.027072],
  ["holdup", [[-0.372531,-0.371469],[0.747466,-0.395106],[0.704205,-0.574747]], 0.004992, 3.93, -0.240914, -0.178774],
  ["screw", [[-0.771501,-0.376197],[0.742659,0.49837],[0.704205,-0.574747]], 0.524251, 5.24, -0.031442, -0.298348],
  ["doubleRail", [[0.603261,0.053996],[1.415619,0.110724],[1.127208,-0.139827]], 0.093624, 3.8776, -0.121388, 0.274344],
  ["break", [[-0.756,-0.189],[-0.756,0],[0.756,0]], 0.147099, 3.7204, -0.252932, 0.161324],
  ["doubleRail2", [[-1.160856,0.181635],[-1.347367,0.611996],[-1.412751,0.687701]], 0.250141, 2.096, 0.246853, 0.170481],
  ["outside", [[-0.773558,0.555247],[-1.313599,-0.101375],[1.364066,0.481371]], 3.970485, 2.2532, 0.257684, 0.153619],
  ["2->6 max", [[-0.634505,-0.723348],[-1.479545,-0.338378],[-1.479545,-0.437653]], 0.848993, 2.6724, -0.297669, 0.037322],
  ["4->7 max", [[0.07691,-0.723348],[-1.479545,-0.338378],[-1.479545,-0.437653]], 0.984702, 2.6724, -0.297669, 0.037322],
  ["6->8 max", [[0.797938,-0.723348],[-1.479545,-0.338378],[-1.479545,-0.437653]], 1.142182, 2.6724, -0.297669, 0.037322],
  ["S->S max", [[-0.781114,-0.631476],[-1.478109,-0.035825],[-1.479545,-0.149282]], 0.002101, 3.2488, 0.288315, -0.082912],
  ["crosstable", [[0.761887,-0.560565],[1.112787,0.068178],[1.357937,0.465278]], 1.127747, 3.2488, -0.163669, 0.251421],
  ["crosstable2", [[0.761887,-0.560565],[1.112787,0.068178],[1.439654,-0.645658]], 1.137206, 5.24, -0.163669, 0.251421],
  ["L->L max", [[-0.00721,-0.380924],[1.479545,0.17218],[1.479545,-0.158737]], 1.570796, 2.096, -0.299665, -0.014179],
  ["eightC", [[-1.132015,-0.00746],[-1.300255,0.597645],[-1.300255,0.493643]], 0.326251, 5.24, -0.284128, 0.096287],
  ["screw2", [[-1.136822,-0.390379],[-0.829183,0.659101],[-0.983002,-0.002733]], 1.188073, 5.24, -0.102683, -0.28188],
  ["fiveC", [[-0.444634,-0.24383],[-0.829183,0.659101],[-1.18489,-0.55111]], 2.029754, 5.24, 0.257474, -0.153972],
  ["doubleRail3", [[-0.910899,0.252546],[-1.420426,0.366003],[-1.372358,-0.55111]], 2.858948, 5.24, -0.110817, 0.278782],
  ["cornermax", [[-0.761887,0.370731],[-1.479545,0.588191],[-1.479545,0.723348]], 5.835231, 3.3012, -0.299863, -0.009066],
  ["reverse", [[-0.769,-0.192],[0.769,0],[1.07,0]], 5.495572, 3, -0.201901, 0.221892],
  ["i02", [[-0.90532,-0.644583],[1.091042,0.485176],[1.379607,0.384451]], 0.003509, 3.3012, 0.299737, -0.012553],
  ["i03", [[-0.992616,0.663829],[0.795535,-0.215466],[0.441922,-0.442376]], -0.015876, 3.3012, -0.299715, 0.013084],
  ["doubleRail3->1", [[-1.479545,-0.338378],[-1.434758,0.601475],[-1.310215,0.685593]], 0.360142, 2.62, 0.284801, -0.094279],
  ["kshot", [[-1.218538,-0.555837],[1.479545,0.723348],[1.132015,0.723348]], 0.501502, 5.24, 0.118015, -0.485873],
  ["crosstable-vid", [[0.362918,-0.012188],[-1.343517,0.375458],[-0.463862,0.644919]], 2.429575, 5.24, 0.013723, 0.449791],
];

/** Expand one library entry into a preset, supplying the two fields it lacks. */
function toPreset([name, positions, angle, power, offsetX, offsetY]) {
  return {
    name,
    state: {
      ruleType: DEFAULT_RULETYPE,
      cushionModel: DEFAULT_CUSHION_MODEL,
      practice: false,
      balls: positions.map(([x, y]) => ({ x, y })),
      shot: {
        angle,
        power,
        offset: { x: offsetX, y: offsetY },
        elevation: 0,
        i: 0,
      },
    },
  };
}

export const DEFAULT_PRESETS = PRESET_LIBRARY.map(toPreset);

/**
 * A preset is a shot and nothing else: the balls, the aim, the spin, the power,
 * the elevation and the cushion model. Deliberately NOT the physics constants,
 * so applying a preset can never move a constant the user did not go and change
 * themselves -- the sliders stay where the user left them.
 */
export function capturePreset(state, name) {
  const shot = state.shot ?? {};
  const offset = shot.offset ?? {};
  return {
    name: String(name).slice(0, MAX_PRESET_NAME),
    state: {
      ruleType: state.ruleType ?? DEFAULT_RULETYPE,
      cushionModel: state.cushionModel ?? DEFAULT_CUSHION_MODEL,
      practice: state.practice ?? false,
      balls: (state.balls ?? []).map(({ x, y }) => ({ x, y })),
      shot: {
        angle: shot.angle ?? 0,
        power: shot.power ?? 0,
        offset: { x: offset.x ?? 0, y: offset.y ?? 0 },
        elevation: shot.elevation ?? 0,
        i: shot.i ?? 0,
      },
    },
  };
}

/**
 * The saved list, newest storage winning. A first visit falls back to the
 * built-in library below, so there is something to load before the user has
 * saved anything of their own.
 *
 * Anything unreadable in storage is treated as no list at all rather than
 * allowed to throw on load -- a corrupt entry should cost the user their
 * presets, not the page.
 */
export function loadPresets() {
  let saved = null;
  try {
    saved = localStorage.getItem(PRESETS_KEY);
  } catch {
    // Private browsing, or storage disabled. Presets are a convenience, so an
    // editor that cannot fall back to nothing, and an editor that cannot reach
    // the built-ins are both still working editors.
    return DEFAULT_PRESETS.slice();
  }
  if (!saved) return DEFAULT_PRESETS.slice();
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : DEFAULT_PRESETS.slice();
  } catch (e) {
    console.error("Failed to load presets", e);
    return DEFAULT_PRESETS.slice();
  }
}

export function savePresets(presets) {
  try {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
    return true;
  } catch (e) {
    console.error("Failed to save presets", e);
    return false;
  }
}

/**
 * Forget the saved list, so the built-in library is what loads next.
 *
 * Removing the key is the whole of it: `loadPresets` already falls back to the
 * library when there is nothing stored, so there is nothing to write back and
 * nothing to reload. A page reload would only throw away the shot on the table.
 */
export function clearPresets() {
  try {
    localStorage.removeItem(PRESETS_KEY);
    return true;
  } catch (e) {
    console.error("Failed to clear presets", e);
    return false;
  }
}
