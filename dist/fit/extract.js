const BALL_RADIUS = 0.03275
const THROW_FACTOR = 0.3
const TABLE_HALF_WIDTH = (BALL_RADIUS * 92.36) / 2
const TABLE_HALF_HEIGHT = (BALL_RADIUS * 46.18) / 2

/**
 * Extract ball position samples from SS telemetry JSON.
 * Returns [{ball, t, x, y}, ...] with positions relative to table centre,
 * scaled to game units (same as ww simulation output).
 */
export function extractSamples(json) {
  return json.PathTracking.DataSets.flatMap((ds, ball) =>
    (ds.Coords ?? []).map(({ DeltaT_500us, X, Y }) => ({
      ball,
      t: DeltaT_500us * 0.0005,
      x: (X - 0.5) * 2 * TABLE_HALF_WIDTH,
      y: -(Y - 0.5) * 2 * TABLE_HALF_HEIGHT,
    }))
  )
}
