import "mocha"
import { expect } from "chai"
import { Lobby, Client } from "../../src/server/lobby"
import { ChatEvent } from "../../src/events/chatevent"
import { BeginEvent } from "../../src/controller/controller"
import { EventUtil } from "../../src/events/eventutil"

let lobby: Lobby
const player1: Client = { name: "p1" }
const player2: Client = { name: "p2" }
const player3: Client = { name: "p3" }

beforeEach(function (done) {
  lobby = new Lobby()
  done()
})

describe("Lobby", () => {
  it("generate unique ids", (done) => {
    const tableId1 = lobby.randomTableId()
    const tableId2 = lobby.randomTableId()
    expect(tableId1).to.be.not.null.and.not.equal(tableId2)
    done()
  })

  it("join empty table gets waiting message", (done) => {
    const tableId = lobby.randomTableId()
    const event = lobby.joinTable(player1, tableId)
    expect(event).to.be.an.instanceof(ChatEvent)
    expect((event as ChatEvent).message).to.contain("Waiting")
    done()
  })

  it("join waiting table gets BeginEvent", (done) => {
    const tableId = lobby.randomTableId()
    lobby.joinTable(player1, tableId)
    const event = lobby.joinTable(player2, tableId)
    expect(event).to.be.an.instanceof(BeginEvent)
    done()
  })

  it("join full table gets full message", (done) => {
    const tableId = lobby.randomTableId()
    lobby.joinTable(player1, tableId)
    lobby.joinTable(player2, tableId)
    const event = lobby.joinTable(player3, tableId)
    expect(event).to.be.an.instanceof(ChatEvent)
    expect((event as ChatEvent).message).to.contain("full")
    done()
  })

  it("Other players does not include this player", (done) => {
    const tableId = lobby.randomTableId()
    lobby.joinTable(player1, tableId)
    lobby.joinTable(player2, tableId)
    const others = lobby.otherClientsInTable(player1, tableId)
    expect(others).to.be.length(1).and.contains(player2)
    done()
  })

  it("players leave", (done) => {
    const tableId = lobby.randomTableId()
    lobby.joinTable(player1, tableId)
    lobby.joinTable(player2, tableId)
    lobby.handleLeaveTable(player1, tableId)
    expect(lobby.tableClients(tableId)).to.be.length(1)
    lobby.handleLeaveTable(player2, tableId)
    expect(lobby.tableClients(tableId)).to.be.empty
    done()
  })

  it("handle message ok", (done) => {
    const message = EventUtil.serialise(new BeginEvent())
    const tableId = lobby.randomTableId()
    lobby.joinTable(player1, tableId)
    const info1 = lobby.handleTableMessage(player1, tableId, message)
    expect(info1).to.contain(player1.name)
    lobby.joinTable(player2, tableId)
    const info2 = lobby.handleTableMessage(player2, tableId, message)
    expect(info2).to.contain(player2.name)
    done()
  })
})
