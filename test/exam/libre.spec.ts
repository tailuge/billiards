import { readFileSync } from "fs"
import { resolve } from "path"
import { initExam } from "../../dist/exam/exam"

const page = readFileSync(
  resolve(__dirname, "..", "..", "dist", "exam", "libre.html"),
  "utf8"
)

/** The page markup without the module script that boots the exam. */
function pageBody(html: string): string {
  const start = html.indexOf("<body>") + "<body>".length
  const end = html.indexOf("</body>")
  return html.slice(start, end).replace(/<script[\s\S]*?<\/script>/g, "")
}

/** The question block whose diagram plays a libre carom. */
function libreBlock(): HTMLElement {
  const blocks = Array.from(
    document.querySelectorAll<HTMLElement>(".question-block")
  )
  const block = blocks.find((b) => {
    const svg = b.querySelector<SVGElement>(".billiards-table")
    try {
      const configs = JSON.parse(svg?.dataset.jsonShots ?? "[]")
      return configs[0]?.ruleType === "libre"
    } catch {
      return false
    }
  })
  if (!block) throw new Error("no libre question on the page")
  return block
}

type ShotOutcome = {
  type: string
  timestamp: number
  incidentSpeed: number
  ballA: { id: number } | null
  ballB: { id: number } | null
}

type TableBall = { id: number; pos: { x: number; y: number; z: number } }

const collision = (
  ballA: number,
  ballB: number,
  timestamp: number
): ShotOutcome => ({
  type: "Collision",
  timestamp,
  incidentSpeed: 0.8,
  ballA: { id: ballA },
  ballB: { id: ballB },
})

/** All three balls resting inside the question's position zone. */
const allInZone: TableBall[] = [
  { id: 0, pos: { x: -1.0, y: 0.51, z: 0 } },
  { id: 1, pos: { x: -1.01, y: 0.5, z: 0 } },
  { id: 2, pos: { x: -0.99, y: 0.49, z: 0 } },
]

/** Far side of the table, well outside the page's zone. */
const away = (id: number): TableBall => ({ id, pos: { x: 0, y: 0, z: 0 } })

/** Same carom, but the red finishes on the far side of the table. */
const oneOutside: TableBall[] = [allInZone[0], allInZone[1], away(2)]

/** Same carom, but only the cue ball finishes inside the zone. */
const oneInside: TableBall[] = [allInZone[0], away(1), away(2)]

function postStationary(outcome: ShotOutcome[], balls: TableBall[]) {
  window.dispatchEvent(
    new MessageEvent("message", {
      data: { type: "stationary", outcome, table: { balls } },
    })
  )
}

function playShot() {
  ;(document.querySelector(".play-btn") as HTMLButtonElement).click()
}

function statsText() {
  return document.querySelector(".q-stats")?.textContent
}

describe("libre exam", () => {
  beforeAll(() => {
    localStorage.clear()
    document.body.innerHTML = pageBody(page)
    // The paper is edited by hand and questions come and go. The scoring
    // assertions below are about the libre zone, so the rest are dropped and
    // the assessment totals are this one question's.
    const keep = libreBlock()
    document.querySelectorAll(".question-block").forEach((block) => {
      if (block !== keep) block.remove()
    })
    initExam()
  })

  it("plays every question on the paper under libre rules", () => {
    const ruleTypes = [...page.matchAll(/data-json-shots='([^']+)'/g)].map(
      ([, json]) => JSON.parse(json)[0].ruleType
    )

    expect(ruleTypes.length).toBeGreaterThan(0)
    // A diagram exported while the editor was set to three cushion launches
    // rules that want three cushions before a carom counts, so the question
    // silently scores nothing. The paper's rule type is what each shot plays.
    expect(ruleTypes.filter((type) => type !== "libre")).toEqual([])
  })

  it("holds one libre question", () => {
    expect(document.querySelectorAll(".question-block")).toHaveLength(1)
    const svg = document.querySelector(".billiards-table") as SVGElement
    const configs = JSON.parse(svg.dataset.jsonShots as string)
    expect(configs[0].ruleType).toBe("libre")
  })

  it("pays for the point and for every ball left in the zone", () => {
    const carom = [collision(0, 1, 1), collision(0, 2, 2)]

    // 3 for the carom + 3 balls in the zone = 6/6
    playShot()
    postStationary(carom, allInZone)
    expect(statsText()).toBe("✅ 100%, 1 attempt")
    // The assessment total has to use the same zone weights.
    expect(document.getElementById("scorePct")?.textContent).toBe("score: 100%")
    expect(document.getElementById("completionPct")?.textContent).toBe(
      "completion: 100%"
    )

    // 3 + 2 = 5/6
    playShot()
    postStationary(carom, oneOutside)
    expect(statsText()).toBe("✅ 83%, 2 attempts")

    // 3 + 1 = 4/6
    playShot()
    postStationary(carom, oneInside)
    expect(statsText()).toBe("✅ 67%, 3 attempts")

    // Missed point, but the cue ball is still in the zone: 0 + 1 = 1/6
    playShot()
    postStationary([collision(0, 1, 1)], oneInside)
    expect(statsText()).toBe("❌ 17%, 4 attempts")
  })
})
