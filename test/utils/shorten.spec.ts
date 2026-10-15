import { shareableQuery } from "../../src/utils/shorten"

describe("shareableQuery", () => {
  it("removes userName and userId but keeps other params", () => {
    const url =
      "https://billiards.tailuge.workers.dev/?ruletype=reveal&state=abc&userId=Fire-1&userName=Fireman&lod=4"
    const query = shareableQuery(url)
    const params = new URLSearchParams(query)

    expect(params.has("userName")).toBe(false)
    expect(params.has("userId")).toBe(false)
    expect(params.get("ruletype")).toBe("reveal")
    expect(params.get("state")).toBe("abc")
    expect(params.get("lod")).toBe("4")
  })

  it("keeps the leading ? so the stored input stays a query string", () => {
    expect(shareableQuery("https://x.test/?ruletype=pool&state=s")).toBe(
      "?ruletype=pool&state=s"
    )
  })

  it("returns an empty string when only identity params are present", () => {
    expect(shareableQuery("https://x.test/?userName=A&userId=B")).toBe("")
  })
})
