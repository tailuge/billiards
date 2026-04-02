import { expect } from "chai"
import { initDom } from "./dom"
import { fireEvent } from "@testing-library/dom"
import { Container } from "../../src/container/container"
import { Comment } from "../../src/view/comment"
import { Assets } from "../../src/view/assets"

initDom()

let container: Container

function addMenu() {
  const menu = document.createElement("div")
  menu.id = "commentMenu"
  menu.className = "comment-menu"
  menu.style.display = "none"
  menu.innerHTML = `
    <button class="comment-emoji">🍀</button>
    <button class="comment-emoji">🐢</button>
    <button class="comment-emoji">🐑</button>
    <button class="comment-emoji">👏</button>
    <button class="comment-emoji">🧸</button>
    <button class="comment-emoji">🧙‍♂️</button>
    <button class="comment-emoji">🎖️</button>
    <button class="comment-emoji">🦈</button>
    <button class="comment-emoji">👀</button>
  `
  document.body.appendChild(menu)
}

beforeEach(function (done) {
  document.querySelectorAll(".comment-menu").forEach((el) => el.remove())
  addMenu()
  container = new Container({
    element: document.getElementById("viewP1"),
    log: (_) => {},
    assets: Assets.localAssets(),
  })
  const comment = new Comment(container)
  expect(comment).to.not.be.undefined
  done()
})

describe("Comment", () => {
  it("clicking comment button shows menu", (done) => {
    const commentBtn = document.getElementById("comment") as HTMLButtonElement
    const menu = document.getElementById("commentMenu") as HTMLDivElement

    expect(menu.style.display).to.equal("none")
    fireEvent.click(commentBtn)
    expect(menu.style.display).to.equal("grid")
    done()
  })

  it("clicking an emoji sends a chat event with that emoji", (done) => {
    const menu = document.getElementById("commentMenu") as HTMLDivElement

    const emojiBtns = menu.querySelectorAll(".comment-emoji")
    expect(emojiBtns.length).to.equal(9)

    const firstEmoji = emojiBtns[0] as HTMLButtonElement
    fireEvent.click(firstEmoji)

    expect(menu.style.display).to.equal("none")
    done()
  })
})
