import "mocha"
import { expect } from "chai"
import { Lobby } from "../../src/network/server/lobby"
import { ChatEvent } from "../../src/events/chatevent"
import { AimEvent, BeginEvent } from "../../src/controller/controller"
import { EventUtil } from "../../src/events/eventutil"
import { Client } from "../../src/network/server/tableinfo"
import { RejoinEvent } from "../../src/events/rejoinevent"
import { BreakEvent } from "../../src/events/breakevent"
import { ServerLog } from "../../src/network/server/serverlog"
import { EventHistory } from "../../src/events/eventhistory"

let lobby: Lobby

class MockWebSocket {
  messages: string[] = []
  send(m: string) {
    this.messages.push(m)
  }
  reset() {
    this.messages = []
  }
}

function mockws() {
  return new MockWebSocket()
}

const player1: Client = { name: "p1", clientId: "id1", ws: mockws() }
const player1r: Client = { name: "p1rej", clientId: "id1", ws: mockws() }
const player2: Client = { name: "p2", clientId: "id2", ws: mockws() }
const player3: Client = { name: "p3", clientId: "id3", ws: mockws() }
const tableId = "tableOne"

beforeEach(function (done) {
  lobby = new Lobby()
  done()
  player1.ws.reset()
  player1r.ws.reset()
  player2.ws.reset()
})

const jestConsole = console

beforeEach(() => {
  global.console = require("console")
})

afterEach(() => {
  global.console = jestConsole
})

describe("Lobby", () => {
  it("validate client connection request", (done) => {
    const ws = new MockWebSocket()
    const client1 = lobby.createClient(ws, "tableId", "clientId", null)
    expect(client1).to.be.not.null
    const client2 = lobby.createClient(ws, null, "clientId", null)
    expect(client2).to.be.undefined
    expect(ws.messages).to.be.not.empty
    const client3 = lobby.createClient(ws, "tableId", null, null)
    expect(client3).to.be.undefined
    done()
  })

  it("join empty table gets waiting message", (done) => {
    expect(lobby.joinTable(player1, tableId)).to.be.true
    const event = EventUtil.fromSerialised(player1.ws.messages[0])
    expect(event).to.be.an.instanceof(ChatEvent)
    expect((event as ChatEvent).message).to.contain("Waiting")
    done()
  })

  it("join waiting table gets BeginEvent", (done) => {
    expect(lobby.joinTable(player1, tableId)).to.be.true
    expect(lobby.joinTable(player2, tableId)).to.be.true
    const event = EventUtil.fromSerialised(player2.ws.messages[1])
    expect(event).to.be.an.instanceof(BeginEvent)
    done()
  })

  it("join full table gets full message", (done) => {
    lobby.joinTable(player1, tableId)
    lobby.joinTable(player2, tableId)
    expect(lobby.joinTable(player3, tableId)).to.be.false
    const event = EventUtil.fromSerialised(player3.ws.messages[0])
    expect(event).to.be.an.instanceof(ChatEvent)
    expect((event as ChatEvent).message).to.contain("full")
    done()
  })

  it("join twice gets message", (done) => {
    lobby.joinTable(player1, tableId)
    expect(lobby.joinTable(player1r, tableId)).to.be.false
    const event = EventUtil.fromSerialised(player1r.ws.messages[0])
    expect(event).to.be.an.instanceof(ChatEvent)
    expect((event as ChatEvent).message).to.contain("Already")
    done()
  })

  it("Other players does not include this player", (done) => {
    lobby.joinTable(player1, tableId)
    lobby.joinTable(player2, tableId)
    const tableInfo = lobby.tables.getTable(tableId)
    const others = tableInfo.otherClients(player1)
    expect(others).to.be.length(1).and.contains(player2)
    done()
  })

  it("second join without leaving is table full", (done) => {
    lobby.joinTable(player1, tableId)
    lobby.joinTable(player2, tableId)
    expect(lobby.joinTable(player1, tableId)).to.be.false
    done()
  })

  it("second join without leaving is rejoin if has sent/recv", (done) => {
    lobby.joinTable(player1, tableId)
    lobby.joinTable(player2, tableId)
    expect(lobby.joinTable(player1r, tableId, "some", "some")).to.be.true
    done()
  })

  it("rejoin empty table not valid", (done) => {
    expect(lobby.joinTable(player1, tableId, "some", "some")).to.be.false
    done()
  })

  it("players leave", (done) => {
    lobby.joinTable(player1, tableId)
    lobby.joinTable(player2, tableId)
    lobby.handleLeaveTable(player1, tableId)
    const tableInfo = lobby.tables.getTable(tableId)
    expect(tableInfo.clients).to.be.length(2)
    lobby.handleLeaveTable(player2, tableId)
    expect(tableInfo.clients).to.be.length(2)
    done()
  })

  it("player leaves then rejoins, becomes client on table", (done) => {
    lobby.joinTable(player1, tableId)
    lobby.joinTable(player2, tableId)
    const tableInfo = lobby.tables.getTable(tableId)
    expect(tableInfo.clients).to.be.length(2)
    lobby.handleLeaveTable(player1, tableId)
    expect(lobby.joinTable(player1r, tableId, "", "server-1001")).to.be.true
    const rejoin = EventUtil.fromSerialised(
      player1r.ws.messages[0]
    ) as RejoinEvent
    expect(rejoin.clientResendFrom).to.be.equal("")
    expect(rejoin.serverResendFrom).to.be.equal("")
    expect(tableInfo.clients.includes(player1r)).to.be.true
    expect(tableInfo.clients).to.be.length(2)
    done()
  })

  it("player leaves then rejoins, with no messages missed", (done) => {
    lobby.joinTable(player1, tableId)
    lobby.joinTable(player2, tableId)
    const lastRecv = EventUtil.fromSerialised(
      player1.ws.messages[player1.ws.messages.length - 1]
    ).sequence
    lobby.handleLeaveTable(player1, tableId)
    expect(lobby.joinTable(player1r, tableId, "", lastRecv)).to.be.true
    const rejoin = EventUtil.fromSerialised(
      player1r.ws.messages[0]
    ) as RejoinEvent
    expect(rejoin.clientResendFrom).to.be.equal("")
    expect(rejoin.serverResendFrom).to.be.equal("")
    done()
  })

  it("player leaves then rejoins, server has no recv messages, request everything", (done) => {
    lobby.joinTable(player1, tableId)
    lobby.joinTable(player2, tableId)
    const lastRecv = EventUtil.fromSerialised(
      player1.ws.messages[player1.ws.messages.length - 1]
    ).sequence
    lobby.handleLeaveTable(player1, tableId)
    expect(lobby.joinTable(player1r, tableId, "pendingId", lastRecv)).to.be.true
    const rejoin = EventUtil.fromSerialised(
      player1r.ws.messages[0]
    ) as RejoinEvent
    expect(rejoin.clientResendFrom).to.be.equal("*")
    expect(rejoin.serverResendFrom).to.be.equal("")
    done()
  })

  it("player sends,leaves,sends,rejoins server requests delta", (done) => {
    lobby.joinTable(player1, tableId)
    const lastRecv = EventUtil.fromSerialised(
      player1.ws.messages[player1.ws.messages.length - 1]
    ).sequence
    const event1 = new BreakEvent()
    event1.sequence = "seq-001"
    lobby.handleTableMessage(player1, tableId, EventUtil.serialise(event1))
    lobby.handleLeaveTable(player1, tableId)
    expect(lobby.joinTable(player1r, tableId, "seq-002", lastRecv)).to.be.true
    const rejoin = EventUtil.fromSerialised(
      player1r.ws.messages[0]
    ) as RejoinEvent
    expect(rejoin.clientResendFrom).to.be.equal("seq-001")
    expect(rejoin.serverResendFrom).to.be.equal("")
    done()
  })

  it("player leaves never recieving anything, requests everything", (done) => {
    lobby.joinTable(player1, tableId)
    const event1 = new BreakEvent()
    event1.sequence = "seq-001"
    lobby.handleTableMessage(player1, tableId, EventUtil.serialise(event1))
    lobby.handleLeaveTable(player1, tableId)
    expect(lobby.joinTable(player1r, tableId, "seq-001", "")).to.be.true
    const rejoin = EventUtil.fromSerialised(
      player1r.ws.messages[0]
    ) as RejoinEvent
    expect(rejoin.clientResendFrom).to.be.equal("")
    expect(rejoin.serverResendFrom).to.be.equal("server-1000")
    done()
  })

  it("player leaves, misses messages and server replays", (done) => {
    ServerLog.enable = false
    lobby.joinTable(player1, tableId)
    lobby.joinTable(player2, tableId)
    const lastRecv = EventUtil.fromSerialised(
      player1.ws.messages[player1.ws.messages.length - 1]
    ).sequence
    const event1 = new BreakEvent()
    event1.sequence = "p2-001"
    lobby.handleTableMessage(player2, tableId, EventUtil.serialise(event1))
    // pretend last message was before p2 sent
    expect(lobby.joinTable(player1r, tableId, "", lastRecv)).to.be.true
    const rejoin = EventUtil.fromSerialised(
      player1r.ws.messages[0]
    ) as RejoinEvent
    expect(rejoin.clientResendFrom).to.be.equal("")
    expect(rejoin.serverResendFrom).to.be.equal("p2-001")
    const missed = EventUtil.fromSerialised(player1r.ws.messages[1])
    expect(missed).to.be.instanceOf(BreakEvent)
    done()
  })

  it("history next id", (done) => {
    const a = [new BeginEvent(), new BeginEvent(), new BeginEvent()]
    a.forEach((e, i) => (e.sequence = `seq-${i}`))
    const h = new EventHistory()
    expect(h.nextId(a, "seq-2")).to.be.equal("")
    expect(h.nextId(a, "seq-1")).to.be.equal("seq-2")
    expect(h.nextId(a, "seq-0")).to.be.equal("seq-1")
    expect(h.nextId(a, "*")).to.be.equal("seq-0")
    expect(EventHistory.after(a, "seq-0")).to.be.length(2)
    done()
  })

  it("handle message ok", (done) => {
    const message = EventUtil.serialise(new AimEvent())
    lobby.joinTable(player1, tableId)
    lobby.joinTable(player2, tableId)
    lobby.handleTableMessage(player1, tableId, message)
    const event = EventUtil.fromSerialised(player2.ws.messages[2])
    expect(event).to.be.an.instanceof(AimEvent)
    done()
  })

  it("do not send if socket not ready", (done) => {
    lobby.joinTable(player1, tableId)
    player1.ws.readyState = 2
    lobby.sendInfo(player1, tableId, "more info")
    expect(player1.ws.messages).to.be.length(1)
    done()
  })
})
