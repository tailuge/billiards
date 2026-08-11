import { cueParamsFromCustom, parseTypedValue } from "../../src/utils/cueparams"
import { DEFAULT_CUE_PARAMS } from "../../src/view/cuemesh"

describe("cueparams", () => {
  describe("parseTypedValue", () => {
    it("coerces booleans and numbers, keeps colours as strings", () => {
      expect(parseTypedValue("true")).toBe(true)
      expect(parseTypedValue("false")).toBe(false)
      expect(parseTypedValue("0.004")).toBeCloseTo(0.004, 6)
      expect(parseTypedValue("0.4")).toBeCloseTo(0.4, 6)
      expect(parseTypedValue("#26282b")).toBe("#26282b")
    })
  })

  describe("cueParamsFromCustom", () => {
    it("maps the full custom.cue.* record with correct types", () => {
      const params = cueParamsFromCustom({
        "cue.shaftColour": "#26282b",
        "cue.buttColour": "#0d0d0d",
        "cue.jointColour": "#d9a62e",
        "cue.jointLength": "0.004",
        "cue.ferruleColour": "#d9a62e",
        "cue.ferruleLength": "0.004",
        "cue.buttRatio": "0.4",
        "cue.grain": "true",
      })
      expect(params).toEqual({
        shaftColour: "#26282b",
        buttColour: "#0d0d0d",
        jointColour: "#d9a62e",
        jointLength: 0.004,
        ferruleColour: "#d9a62e",
        ferruleLength: 0.004,
        buttRatio: 0.4,
        grain: true,
      })
    })

    it("falls back to defaults and ignores unknown keys", () => {
      expect(cueParamsFromCustom({})).toEqual(DEFAULT_CUE_PARAMS)
      expect(
        cueParamsFromCustom({ "cue.buttColour": "#ff0000", skin: "x" })
      ).toEqual({ ...DEFAULT_CUE_PARAMS, buttColour: "#ff0000" })
    })
  })
})
