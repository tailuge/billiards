import { ReplayCodec } from "../../src/utils/replay-codec"
import JSONCrush from "jsoncrush"

describe("ReplayCodec", () => {
  const sampleData = {
    init: [1, 2, 3],
    shots: [{ type: "AIM", power: 50 }, { type: "SCORE" }],
    score: 10,
    players: { player1: "Alice", player2: "Bob" },
    tableSize: 12,
  }

  it("should successfully encode and decode JS objects using the fflate format", () => {
    const encoded = ReplayCodec.encode(sampleData)
    expect(encoded.startsWith("f~")).toBe(true)

    const decoded = ReplayCodec.decode(encoded)
    expect(decoded).toEqual(sampleData)
  })

  it("should return null if blob is falsy", () => {
    expect(ReplayCodec.decode(null)).toBeNull()
    expect(ReplayCodec.decode("")).toBeNull()
  })

  it("should successfully decode legacy JSONCrush inputs", () => {
    const jsonString = JSON.stringify(sampleData)
    const crushed = JSONCrush.crush(jsonString)
    const encodedUri = encodeURIComponent(crushed)
    const params = new URLSearchParams(`state=${encodedUri}`)

    // URLSearchParams decodes the state before ReplayCodec receives it.
    const decoded = ReplayCodec.decode(params.get("state"))
    expect(decoded).toEqual(sampleData)
  })

  it("should throw an error for completely invalid or corrupted data format", () => {
    const decode = () =>
      ReplayCodec.decode("invalid_garbage_data_not_json_or_base64")

    let thrownError: unknown
    try {
      decode()
    } catch (error) {
      thrownError = error
    }

    expect(thrownError).toBeInstanceOf(Error)
    const error = thrownError as Error & { cause?: unknown }
    expect(error.message).toBe(
      "Failed to parse replay blob: invalid or corrupted data format."
    )
    expect(error.cause).toBeInstanceOf(Error)
    expect(error.cause).not.toBe(error)
  })
})
