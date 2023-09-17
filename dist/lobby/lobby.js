const server = window.location.origin
const player1 = document.getElementById("player1")
const player2 = document.getElementById("player2")
const table = document.getElementById("table")
const ruletype = document.getElementById("ruletype")
const detail = document.getElementById("detail")
const info1 = document.getElementById("info1")
const info2 = document.getElementById("info2")
const spinner = document.getElementById("spinner")

const renderwss = "wss://billiards.onrender.com/ws"
const github = "https://tailuge.github.io/billiards/dist/"

let statusPage = "https://billiards.onrender.com"
let wss = renderwss
let assets = github
let link1 = ""
let link2 = ""
table.value = "Table-" + Math.floor(Math.random() * 0xffffff).toString(16)
if (location.search.includes("?mode=local")) {
  wss = server.replace(/^http/, "ws") + "/ws"
  assets = location.origin + "/dist/"
  statusPage = "../"
}

checkStatus({ mode: "no-cors" })

function checkStatus(options) {
  fetch(statusPage, options)
    .then((response) => {
      const message = response.statusText ? response.statusText : "OK"
      spinner.innerText = `${message}    (${statusPage})`
    })
    .catch((error) => {
      spinner.innerText = error
    })
    .finally(() => {
      spinner.classList.remove("spinner")
    })
}

function share() {
  const shareData = {
    title: "Billiards",
    text: `${player1.value} is inviting you to play billiards`,
    url: link2,
  }
  if (navigator.canShare) {
    navigator
      .share(shareData)
      .then(() => (info2.innerText = "shared successfully"))
      .catch((e) => {
        console.log("Error: " + e)
        info2.innerText = `${e}`
      })
  } else {
    info2.innerText = `link copied to clipboard`
    navigator.clipboard.writeText(link2)
  }
}

function join() {
  window.open(link1, "_blank").focus()
}

function createTable() {
  detail.style.visibility = "visible"

  const guid = shortGuid()
  const guid1 = "p1" + guid
  const guid2 = "p2" + guid
  const params1 = new URLSearchParams({
    websocketserver: wss,
    tableId: table.value,
    name: player1.value,
    clientId: guid1,
    ruletype: ruletype.value,
  })
  const params2 = new URLSearchParams({
    websocketserver: wss,
    tableId: table.value,
    name: player2.value,
    clientId: guid2,
    ruletype: ruletype.value,
  })
  link1 = `${assets}?${params1.toString()}`
  link2 = `${assets}?${params2.toString()}`
  info1.innerText = link1
  info2.innerText = link2
}

function shortGuid() {
  return Math.floor(Math.random() * 0xffffff).toString(16)
}
