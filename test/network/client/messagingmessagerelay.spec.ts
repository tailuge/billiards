import { MessagingMessageRelay } from "../../../src/network/client/messagingmessagerelay"
import { NchanClient } from "@tailuge/messaging"
import { Session } from "../../../src/network/client/session"

jest.mock("@tailuge/messaging", () => {
  return {
    NchanClient: jest.fn().mockImplementation(() => {
      return {
        subscribeTable: jest.fn(),
        publishTable: jest.fn().mockResolvedValue(undefined),
      }
    }),
  }
})

describe("MessagingMessageRelay", () => {
  beforeEach(() => {
    Session.init("test-client", "TestPlayer", "test-table", false)
  })

  it("should initialize NchanClient with proper protocol and url format", () => {
    new MessagingMessageRelay()
    expect(NchanClient).toHaveBeenCalledWith(
      "https://billiards-network.onrender.com"
    )

    new MessagingMessageRelay("ws://localhost:8080")
    expect(NchanClient).toHaveBeenCalledWith("http://localhost:8080")

    new MessagingMessageRelay("wss://my-server.com")
    expect(NchanClient).toHaveBeenCalledWith("https://my-server.com")
  })

  it("should subscribe to channel and unwrap TableMessage envelope", () => {
    const relay = new MessagingMessageRelay()
    const mockNchanInstance = (relay as any).nchan

    const mockSub = { stop: jest.fn() }
    let recordedCallback: ((data: string) => void) | undefined
    mockNchanInstance.subscribeTable.mockImplementation(
      (channel: string, onMessage: (data: string) => void) => {
        recordedCallback = onMessage
        return mockSub
      }
    )

    const gameCallback = jest.fn()
    relay.subscribe("test-chan", gameCallback)

    expect(mockNchanInstance.subscribeTable).toHaveBeenCalledWith(
      "test-chan",
      expect.any(Function)
    )

    // Send a message envelope
    const envelope = {
      type: "test-type",
      senderId: "other-client",
      data: { key: "value" },
    }
    recordedCallback!(JSON.stringify(envelope))
    expect(gameCallback).toHaveBeenCalledWith(JSON.stringify({ key: "value" }))

    // Test non-JSON message passing through as-is
    recordedCallback!("raw-string")
    expect(gameCallback).toHaveBeenCalledWith("raw-string")
  })

  it("should publish a message by wrapping it in TableMessage envelope", async () => {
    const relay = new MessagingMessageRelay()
    const mockNchanInstance = (relay as any).nchan

    const rawMessage = JSON.stringify({ type: "MyEvent", value: 123 })
    relay.publish("test-chan", rawMessage)

    expect(mockNchanInstance.publishTable).toHaveBeenCalledWith(
      "test-chan",
      {
        type: "MyEvent",
        data: { type: "MyEvent", value: 123 },
      },
      "test-client"
    )
  })

  it("should publish raw strings with 'unknown' type", async () => {
    const relay = new MessagingMessageRelay()
    const mockNchanInstance = (relay as any).nchan

    relay.publish("test-chan", "raw-text")

    expect(mockNchanInstance.publishTable).toHaveBeenCalledWith(
      "test-chan",
      {
        type: "unknown",
        data: "raw-text",
      },
      "test-client"
    )
  })
})
