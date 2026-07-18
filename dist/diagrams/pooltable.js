/**
 * Pool Table SVG data
 *
 * Extracted from pooltable.svg. Provides the visual table content
 * and viewBox for non-threecushion ruletypes (nineball, eightball, etc.).
 *
 */


const POOL_TABLE_SVG_CONTENT = `
    <style>
      path, line, polyline { fill: none; stroke: #000; stroke-width: 0.003; stroke-linecap: round; stroke-linejoin: round; }
      .pool-cloth { fill: none; stroke: none; }
    </style>
    <g class="pool-surround">
      <path class="pool-surround"
        d="M1.393,0.849L1.436,0.841L1.473,0.818L1.499,0.783L1.512,0.741L1.512,0.726L1.512,0.710L1.512,-0.715L1.512,-0.734L1.510,-0.752L1.495,-0.792L1.465,-0.825L1.431,-0.843L1.393,-0.849L1.384,-0.849L1.375,-0.849L-1.380,-0.849L-1.388,-0.849L-1.397,-0.849L-1.439,-0.840L-1.476,-0.816L-1.501,-0.781L-1.512,-0.738L-1.512,-0.723L-1.512,-0.708L-1.512,0.716L-1.512,0.735L-1.510,0.754L-1.493,0.795L-1.463,0.827L-1.429,0.843L-1.392,0.849L-1.383,0.849L-1.374,0.849L1.381,0.849L1.387,0.849L1.393,0.849"
      />
    </g>
    <rect class="pool-cloth" x="-1.380" y="-0.720" width="2.760" height="1.440" />
    <g class="pool-cushion">
      <path class="pool-cushion"
        d="M1.327,0.000L1.327,0.572L1.326,0.576L1.327,0.579L1.328,0.581L1.330,0.582L1.374,0.626L1.377,0.629L1.380,0.632L1.380,-0.632L1.330,-0.582L1.327,-0.580L1.327,-0.577L1.327,-0.571L1.327,-0.565L1.327,0.000"
      />
    </g>
    <g class="pool-cushion">
      <path class="pool-cushion"
        d="M-1.327,0.000L-1.327,0.572L-1.326,0.576L-1.327,0.579L-1.328,0.581L-1.330,0.582L-1.377,0.629L-1.379,0.632L-1.379,-0.632L-1.330,-0.582L-1.327,-0.580L-1.327,-0.577L-1.327,-0.571L-1.327,-0.565L-1.327,0.000"
      />
    </g>
    <g class="pool-pocket">
      <path class="pool-pocket"
        d="M-0.055,0.717L-0.051,0.734L-0.043,0.751L-0.035,0.760L-0.024,0.767L0.003,0.773L0.029,0.764L0.039,0.756L0.046,0.746L0.049,0.741L0.050,0.736L0.054,0.723L0.054,0.709L0.034,0.683L0.001,0.675L-0.033,0.683L-0.054,0.709L-0.055,0.713L-0.055,0.717"
      />
    </g>
    <g class="pool-pocket">
      <path class="pool-pocket"
        d="M-1.362,0.614L-1.386,0.638L-1.393,0.645L-1.400,0.653L-1.408,0.667L-1.412,0.684L-1.406,0.716L-1.384,0.740L-1.352,0.749L-1.320,0.740L-1.314,0.735L-1.309,0.730L-1.295,0.716L-1.281,0.702L-1.278,0.698L-1.277,0.694L-1.278,0.687L-1.279,0.679L-1.280,0.667L-1.284,0.655L-1.292,0.640L-1.305,0.628L-1.326,0.618L-1.348,0.615L-1.355,0.614L-1.362,0.614"
      />
    </g>
    <g class="pool-cushion">
      <path class="pool-cushion"
        d="M-0.070,0.663L-0.062,0.690L-0.055,0.717L-1.242,0.717L-1.267,0.717L-1.293,0.717L-1.294,0.717L-1.295,0.717L-1.247,0.668L-1.242,0.664L-1.236,0.663L-0.070,0.663"
      />
    </g>
    <g class="pool-corner-piece">
      <path class="pool-corner-piece" d="M-1.319,0.739L-1.319,0.849" />
    </g>
    <g class="pool-corner-piece">
      <path class="pool-corner-piece" d="M-1.512,0.656L-1.402,0.656" />
    </g>
    <g class="pool-corner-piece">
      <path class="pool-corner-piece" d="M1.512,0.656L1.402,0.656" />
    </g>
    <g class="pool-corner-piece">
      <path class="pool-corner-piece" d="M1.319,0.739L1.319,0.849" />
    </g>
    <g class="pool-cushion">
      <path class="pool-cushion"
        d="M0.070,0.663L0.063,0.690L0.055,0.717L1.242,0.717L1.268,0.717L1.293,0.717L1.294,0.717L1.295,0.717L1.247,0.668L1.242,0.664L1.237,0.663L0.070,0.663"
      />
    </g>
    <g class="pool-pocket">
      <path class="pool-pocket"
        d="M1.362,0.614L1.386,0.638L1.393,0.645L1.400,0.653L1.408,0.667L1.412,0.684L1.406,0.716L1.384,0.740L1.352,0.749L1.320,0.740L1.314,0.735L1.309,0.730L1.295,0.716L1.281,0.702L1.278,0.698L1.277,0.694L1.278,0.687L1.279,0.679L1.280,0.667L1.284,0.655L1.292,0.640L1.305,0.628L1.326,0.618L1.348,0.615L1.355,0.614L1.362,0.614"
      />
    </g>
    <g class="pool-pocket">
      <path class="pool-pocket"
        d="M1.362,-0.614L1.386,-0.638L1.393,-0.645L1.400,-0.653L1.408,-0.667L1.412,-0.684L1.406,-0.716L1.384,-0.740L1.352,-0.749L1.320,-0.740L1.314,-0.735L1.309,-0.730L1.295,-0.716L1.281,-0.702L1.278,-0.698L1.277,-0.694L1.278,-0.687L1.279,-0.679L1.280,-0.667L1.284,-0.655L1.292,-0.640L1.305,-0.628L1.326,-0.618L1.348,-0.615L1.355,-0.614L1.362,-0.614"
      />
    </g>
    <g class="pool-cushion">
      <path class="pool-cushion"
        d="M0.070,-0.663L0.063,-0.690L0.055,-0.717L1.242,-0.717L1.268,-0.717L1.293,-0.717L1.294,-0.717L1.295,-0.717L1.247,-0.668L1.242,-0.664L1.237,-0.663L0.070,-0.663"
      />
    </g>
    <g class="pool-corner-piece">
      <path class="pool-corner-piece" d="M1.319,-0.739L1.319,-0.849" />
    </g>
    <g class="pool-corner-piece">
      <path class="pool-corner-piece" d="M1.512,-0.656L1.402,-0.656" />
    </g>
    <g class="pool-corner-piece">
      <path class="pool-corner-piece" d="M-1.512,-0.656L-1.402,-0.656" />
    </g>
    <g class="pool-corner-piece">
      <path class="pool-corner-piece" d="M-1.319,-0.739L-1.319,-0.849" />
    </g>
    <g class="pool-cushion">
      <path class="pool-cushion"
        d="M-0.070,-0.663L-0.062,-0.690L-0.055,-0.717L-1.242,-0.717L-1.267,-0.717L-1.293,-0.717L-1.294,-0.717L-1.295,-0.717L-1.247,-0.668L-1.242,-0.664L-1.236,-0.663L-0.070,-0.663"
      />
    </g>
    <g class="pool-pocket">
      <path class="pool-pocket"
        d="M-1.362,-0.614L-1.386,-0.638L-1.393,-0.645L-1.400,-0.653L-1.408,-0.667L-1.412,-0.684L-1.406,-0.716L-1.384,-0.740L-1.352,-0.749L-1.320,-0.740L-1.314,-0.735L-1.309,-0.730L-1.295,-0.716L-1.281,-0.702L-1.278,-0.698L-1.277,-0.694L-1.278,-0.687L-1.279,-0.679L-1.280,-0.667L-1.284,-0.655L-1.292,-0.640L-1.305,-0.628L-1.326,-0.618L-1.348,-0.615L-1.355,-0.614L-1.362,-0.614"
      />
    </g>
    <g class="pool-pocket">
      <path class="pool-pocket"
        d="M-0.055,-0.717L-0.051,-0.734L-0.043,-0.751L-0.035,-0.760L-0.024,-0.767L0.003,-0.773L0.029,-0.764L0.039,-0.756L0.046,-0.746L0.049,-0.741L0.050,-0.736L0.054,-0.723L0.054,-0.709L0.034,-0.683L0.001,-0.675L-0.033,-0.683L-0.054,-0.709L-0.055,-0.713L-0.055,-0.717"
      />
    </g>
`

export const POOL_SCALE = 1.09

const POOL_MAX_X = 1.512
const POOL_MAX_Y = 0.849
const POOL_PAD_TOP = 0.05
const POOL_PAD_BOTTOM = 0.28
const POOL_PAD_SIDE = 0.05

export function generatePoolTable() {
  const f6 = (n) => n.toFixed(6)
  const s = POOL_SCALE
  const maxX = POOL_MAX_X * s
  const maxY = POOL_MAX_Y * s
  const minX = -(maxX + POOL_PAD_SIDE)
  const minY = -(maxY + POOL_PAD_TOP)
  const width = 2 * (maxX + POOL_PAD_SIDE)
  const height = (maxY + POOL_PAD_TOP) + (maxY + POOL_PAD_BOTTOM)
  const viewBox = `${f6(minX)} ${f6(minY)} ${f6(width)} ${f6(height)}`
  const content = `<g transform="scale(${s})">\n${POOL_TABLE_SVG_CONTENT}  </g>\n`
  return {
    viewBox,
    content,
  }
}
