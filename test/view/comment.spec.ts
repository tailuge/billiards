import { expect } from "chai"
import { initDom } from "./dom"
import { fireEvent } from "@testing-library/dom"
import { Container } from "../../src/container/container"
import { Comment } from "../../src/view/comment"
import { Assets } from "../../src/view/assets"

initDom()

let container: Container

beforeEach(function (done) {
  document.querySelectorAll(".comment-menu").forEach((el) => el.remove())
  container = new Container({
    element: document.getElementById("viewP1"),
    log: (_) => {},
    assets: Assets.localAssets(),
  })
  new Comment(container)
  done()
})

describe("Comment", () => {
  it("clicking comment button shows menu", (done) => {
    const commentBtn = document.getElementById("comment") as HTMLButtonElement

    fireEvent.click(commentBtn)

    const menu = document.querySelector(".comment-menu")
    expect(menu).to.not.be.null
    done()
  })

  it("clicking an emoji sends a chat event with that emoji", (done) => {
    const commentBtn = document.getElementById("comment") as HTMLButtonElement
    fireEvent.click(commentBtn)

    const emojiBtns = document.querySelectorAll(".comment-emoji")
    expect(emojiBtns.length).to.equal(9)

    const firstEmoji = emojiBtns[0] as HTMLButtonElement
    fireEvent.click(firstEmoji)

    const menu = document.querySelector(".comment-menu")
    expect(menu).to.be.null
    done()
  })
})
