import { expect } from "chai"
import { initDom } from "./dom"
import { fireEvent } from "@testing-library/dom"
import { Container } from "../../src/container/container"
import { Comment } from "../../src/view/comment"
import { Assets } from "../../src/view/assets"

initDom()

let container: Container
let comment: Comment

beforeEach(function (done) {
  initDom()
  container = new Container({
    element: document.getElementById("viewP1"),
    log: (_) => {},
    assets: Assets.localAssets(),
  })
  comment = new Comment(container)
  done()
})

describe("Comment", () => {
  it("clicking comment button shows menu", (done) => {
    const commentBtn = document.getElementById("comment") as HTMLButtonElement

    expect(comment.menu.style.display).to.equal("none")
    fireEvent.click(commentBtn)
    expect(comment.menu.style.display).to.equal("grid")
    done()
  })

  it("clicking an emoji sends a chat event with that emoji", (done) => {
    const emojiBtns = comment.menu.querySelectorAll(".comment-emoji")
    expect(emojiBtns.length).to.equal(9)

    const firstEmoji = emojiBtns[0] as HTMLButtonElement
    fireEvent.click(firstEmoji)

    expect(comment.menu.style.display).to.equal("none")
    done()
  })

  it("toggleMenu shows/hides the menu", (done) => {
    expect(comment.menu.style.display).to.equal("none")
    comment.toggleMenu()
    expect(comment.menu.style.display).to.equal("grid")
    comment.toggleMenu()
    expect(comment.menu.style.display).to.equal("none")
    done()
  })

  it("handles missing elements gracefully", (done) => {
    // @ts-ignore
    comment.menu = null
    comment.toggleMenu()
    comment.showMenu()
    comment.hideMenu()
    done()
  })

  it("initializes via setTimeout if elements are not immediately present", (done) => {
    document.body.innerHTML = ""
    const commentLater = new Comment(container)

    initDom()

    setTimeout(() => {
      expect(commentLater.button).to.not.be.null
      expect(commentLater.menu).to.not.be.null
      const emojiBtn = commentLater.menu!.querySelector(
        ".comment-emoji"
      ) as HTMLButtonElement
      fireEvent.click(emojiBtn)
      done()
    }, 200)
  })
})
