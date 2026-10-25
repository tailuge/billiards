import { AimEvent } from "../../src/events/aimevent"
import { WatchEvent } from "../../src/events/watchevent"
import { PlaceBallEvent } from "../../src/events/placeballevent"
import { EventUtil } from "../../src/events/eventutil"
import {
  removeZeroVectorEntries,
  reinstateZeroVectorEntries,
} from "../../src/utils/wire-codec"
import { Vector3 } from "three"
import { MessagingMessageRelay } from "../../src/network/client/messagingmessagerelay"

describe("Wire Vector Compaction", () => {
  describe("removeZeroVectorEntries and reinstateZeroVectorEntries", () => {
    it("individually removes x=0, y=0, z=0 entries from vectors in JSON strings", () => {
      const input = JSON.stringify({
        offset: { x: 0, y: 0, z: 0 },
        pos: { x: 1.25, y: 0, z: 0 },
        spin: { x: 0, y: -0.5, z: 0 },
      })

      const compacted = removeZeroVectorEntries(input)
      expect(compacted).toBe(
        JSON.stringify({
          offset: {},
          pos: { x: 1.25 },
          spin: { y: -0.5 },
        })
      )
    })

    it("reinstates missing vector properties at 0 on parsed JSON objects", () => {
      const parsed = {
        offset: {},
        pos: { x: 1.25 },
        spin: { y: -0.5 },
      }

      reinstateZeroVectorEntries(parsed)
      expect(parsed).toEqual({
        offset: { x: 0, y: 0, z: 0 },
        pos: { x: 1.25, y: 0, z: 0 },
        spin: { x: 0, y: -0.5, z: 0 },
      })
    })
  })

  describe("EventUtil serialization and deserialization", () => {
    it("compacts zero vectors when serialising AimEvent and reinstates them when deserialising", () => {
      const aim = new AimEvent()
      aim.offset = new Vector3(0, 0, 0)
      aim.pos = new Vector3(0, 0, 0)
      aim.power = 3.406

      const serialised = EventUtil.serialise(aim)
      expect(serialised).toContain('"offset":{}')
      expect(serialised).toContain('"pos":{}')
      expect(serialised).not.toContain('"x":0')

      const deserialised = EventUtil.fromSerialised(serialised) as AimEvent
      expect(deserialised.offset).toEqual(new Vector3(0, 0, 0))
      expect(deserialised.pos).toEqual(new Vector3(0, 0, 0))
      expect(deserialised.power).toBe(3.406)
    })

    it("compacts zero vectors in WATCHAIM payloads", () => {
      const watchEvent = new WatchEvent({
        aim: {
          type: "AIM",
          offset: { x: 0, y: 0, z: 0 },
          angle: 0,
          power: 3.406,
          elevation: 0,
          pos: { x: 0, y: 0, z: 0 },
          i: 0,
        },
      })

      const serialised = EventUtil.serialise(watchEvent)
      expect(serialised).toContain('"offset":{}')
      expect(serialised).toContain('"pos":{}')

      const deserialised = EventUtil.fromSerialised(serialised) as WatchEvent
      expect(deserialised.json.aim.offset).toEqual({ x: 0, y: 0, z: 0 })
      expect(deserialised.json.aim.pos).toEqual({ x: 0, y: 0, z: 0 })
    })

    it("compacts zero vectors in PlaceBallEvent", () => {
      const placeBall = new PlaceBallEvent(new Vector3(0, 0, 0), {
        id: 1,
        pos: new Vector3(0.5, 0, 0),
      })

      const serialised = EventUtil.serialise(placeBall)
      expect(serialised).toContain('"pos":{}')
      expect(serialised).toContain('"pos":{"x":0.5}')

      const deserialised = EventUtil.fromSerialised(
        serialised
      ) as PlaceBallEvent
      expect(deserialised.pos).toEqual(new Vector3(0, 0, 0))
      expect(deserialised.respot?.pos).toEqual(new Vector3(0.5, 0, 0))
    })
  })

  describe("MessagingMessageRelay publication and receipt payload", () => {
    it("publishes object data with compacted zero vectors and reinstates them on receipt", async () => {
      const relay = new MessagingMessageRelay()
      let publishedType = ""
      let publishedData: any = null
      let onMessageCallback: ((msg: any) => void) | null = null

      const mockMessagingClient = {
        joinTable: jest.fn(async (_tableId: string, _clientId: string, opts: any) => {
          onMessageCallback = opts.onMessage
          return {
            publish: jest.fn(async (type: string, data: unknown) => {
              publishedType = type
              publishedData = data
            }),
            bothJoined: Promise.resolve(),
            onOpponentLeft: jest.fn(),
            onOpponentRejoined: jest.fn(),
          }
        }),
      }

      await relay.connect(mockMessagingClient as any, "table1")

      let receivedMessage = ""
      relay.subscribe("table1", (msgStr) => {
        receivedMessage = msgStr
      })

      const watchEvent = new WatchEvent({
        aim: {
          type: "AIM",
          offset: { x: 0, y: 0, z: 0 },
          angle: 0,
          power: 3.406,
          elevation: 0,
          pos: { x: 0, y: 0, z: 0 },
          i: 0,
        },
      })

      const serialised = EventUtil.serialise(watchEvent)
      relay.publish("table1", serialised)

      expect(publishedType).toBe("WATCHAIM")
      expect(publishedData.json.aim.offset).toEqual({})
      expect(publishedData.json.aim.pos).toEqual({})

      const jsonOutput = JSON.stringify({ type: publishedType, data: publishedData })
      expect(jsonOutput).toContain('"offset":{}')
      expect(jsonOutput).toContain('"pos":{}')
      expect(jsonOutput).not.toContain('"x":0')

      // Simulate network receipt of the published payload
      onMessageCallback!({
        type: publishedType,
        data: publishedData,
      })

      expect(receivedMessage).toContain('"offset":{"x":0,"y":0,"z":0}')
      expect(receivedMessage).toContain('"pos":{"x":0,"y":0,"z":0}')

      const deserialised = EventUtil.fromSerialised(receivedMessage) as WatchEvent
      expect(deserialised.json.aim.offset).toEqual({ x: 0, y: 0, z: 0 })
      expect(deserialised.json.aim.pos).toEqual({ x: 0, y: 0, z: 0 })
    })
  })
})
