import "mocha"
import { expect } from "chai"
import { Lobby } from "../../src/network/server/lobby"
import { ChatEvent } from "../../src/events/chatevent"
import { BeginEvent, HitEvent } from "../../src/controller/controller"
import { EventUtil } from "../../src/events/eventutil"
import { Client } from "../../src/network/server/tableinfo"
import { RejoinEvent } from "../../src/events/rejoinevent"

let lobby: Lobby
const player1: Client = { name: "p1", clientId: "id1" }
const player2: Client = { name: "p2", clientId: "id2" }
const player3: Client = { name: "p3", clientId: "id3" }
const tableId = "tableOne"

beforeEach(function (done) {
  lobby = new Lobby()
  done()
})

describe("Lobby", () => {
  it("validate client connection request", (done) => {
    const client1 = lobby.createClient(null, "tableId", "clientId", null)
    expect(client1).to.be.not.null
    const client2 = lobby.createClient(null, null, "clientId", null)
    expect(client2).to.be.undefined
    const client3 = lobby.createClient(null, "tableId", null, null)
    expect(client3).to.be.undefined
    done()
  })

  it("join empty table gets waiting message", (done) => {
    const event = lobby.joinTable(player1, tableId)
    expect(event).to.be.an.instanceof(ChatEvent)
    expect((event as ChatEvent).message).to.contain("Waiting")
    done()
  })

  it("join waiting table gets BeginEvent", (done) => {
    lobby.joinTable(player1, tableId)
    const event = lobby.joinTable(player2, tableId)
    expect(event).to.be.an.instanceof(BeginEvent)
    done()
  })

  it("join full table gets full message", (done) => {
    lobby.joinTable(player1, tableId)
    lobby.joinTable(player2, tableId)
    const event = lobby.joinTable(player3, tableId)
    expect(event).to.be.an.instanceof(ChatEvent)
    expect((event as ChatEvent).message).to.contain("full")
    done()
  })

  it("join twice gets message", (done) => {
    lobby.joinTable(player1, tableId)
    const event = lobby.joinTable(player1, tableId)
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

  it("players leaves then rejoins", (done) => {
    lobby.joinTable(player1, tableId)
    lobby.joinTable(player2, tableId)
    lobby.handleLeaveTable(player1, tableId)
    const event = lobby.joinTable(player1, tableId)
    expect(event).to.be.an.instanceof(RejoinEvent)
    expect((event as RejoinEvent).senderId).to.be.null
    done()
  })

  it("players leaves after playing shot then rejoins", (done) => {
    lobby.joinTable(player1, tableId)
    lobby.joinTable(player2, tableId)
    const message = EventUtil.serialise(new HitEvent(null))
    lobby.handleTableMessage(player1, tableId, message)
    lobby.handleLeaveTable(player1, tableId)
    const event = lobby.joinTable(player1, tableId)
    expect(event).to.be.an.instanceof(RejoinEvent)
    expect((event as RejoinEvent).senderId).to.be.equal(player1.clientId)
    expect((event as RejoinEvent).fromOther).to.be.false
    done()
  })

  it("players leaves after opponent plays shot then rejoins", (done) => {
    lobby.joinTable(player1, tableId)
    lobby.joinTable(player2, tableId)
    const message = EventUtil.serialise(new HitEvent(null))
    lobby.handleTableMessage(player2, tableId, message)
    lobby.handleLeaveTable(player1, tableId)
    const event = lobby.joinTable(player1, tableId)
    expect(event).to.be.an.instanceof(RejoinEvent)
    expect((event as RejoinEvent).senderId).to.be.equal(player2.clientId)
    expect((event as RejoinEvent).fromOther).to.be.true
    done()
  })

  it("handle message ok", (done) => {
    const message = EventUtil.serialise(new BeginEvent())
    lobby.joinTable(player1, tableId)
    const info1 = lobby.handleTableMessage(player1, tableId, message)
    expect(info1).to.contain(player1.name)
    lobby.joinTable(player2, tableId)
    const info2 = lobby.handleTableMessage(player2, tableId, message)
    expect(info2).to.contain(player2.name)
    done()
  })
})
