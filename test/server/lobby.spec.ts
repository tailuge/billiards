import "mocha"
import { expect } from "chai"
import { Lobby } from "../../src/network/server/lobby"
import { ChatEvent } from "../../src/events/chatevent"
import { BeginEvent } from "../../src/controller/controller"
import { EventUtil } from "../../src/events/eventutil"
import { Client } from "../../src/network/server/tableinfo"
import { RejoinEvent } from "../../src/events/rejoinevent"
import { BreakEvent } from "../../src/events/breakevent"
import { ServerLog } from "../../src/network/server/serverlog"

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
    const tableInfo = lobby.tables.getTable(tableId)
    console.log(JSON.stringify(tableInfo))
    done()
  })

  it("players leave", (done) => {
    lobby.joinTable(player1, tableId)
    lobby.joinTable(player2, tableId)
    lobby.handleLeaveTable(player1, tableId)
    const tableInfo = lobby.tables.getTable(tableId)
    expect(tableInfo.clients).to.be.length(1)
    lobby.handleLeaveTable(player2, tableId)
    expect(tableInfo.clients).to.be.empty
    done()
  })

  it("players leaves then rejoins, replaces old client on table", (done) => {
    ServerLog.enable = false
    lobby.joinTable(player1, tableId)
    lobby.joinTable(player2, tableId)
    lobby.handleLeaveTable(player1, tableId)
    expect(lobby.joinTable(player1r, tableId)).to.be.true
    const event = EventUtil.fromSerialised(player1r.ws.messages[0])
    expect(event).to.be.an.instanceof(RejoinEvent)
    expect((event as RejoinEvent).clientToResendLast).to.be.equals("")
    expect((event as RejoinEvent).serverWillResendLast).to.be.not.equals("")
    expect(lobby.tables.getTable(tableId).clients.includes(player1r)).to.be.true
    expect(lobby.tables.getTable(tableId).clients.includes(player1)).to.be.false
    done()
  })

  it("handle message ok", (done) => {
    const message = EventUtil.serialise(new BreakEvent())
    lobby.joinTable(player1, tableId)
    lobby.joinTable(player2, tableId)
    lobby.handleTableMessage(player1, tableId, message)
    const event = EventUtil.fromSerialised(player2.ws.messages[2])
    expect(event).to.be.an.instanceof(BreakEvent)
    done()
  })
})
