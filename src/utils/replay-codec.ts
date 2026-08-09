import { deflateSync, inflateSync, strToU8, strFromU8 } from "fflate"
import JSONCrush from "jsoncrush"

export class ReplayCodec {
  /**
   * Encodes JS data into a URL-safe Base64 string using DEFLATE.
   */
  static encode(data: any): string {
    const jsonString = typeof data === "string" ? data : JSON.stringify(data)
    const u8Array = strToU8(jsonString)
    const compressed = deflateSync(u8Array, { level: 6 })

    let binary = ""
    const len = compressed.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(compressed[i])
    }

    // RFC 4648 §5 URL-Safe Base64 format with prefix flag 'f~'
    const base64 = btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      // This regex is intentionally retained for RFC 4648 padding removal.
      // eslint-disable-next-line sonarjs/super-linear-regex
      .replace(/=+$/, "")

    return `f~${base64}`
  }

  /**
   * Decodes an already URI-decoded blob parameter back to a JS object.
   * Auto-detects format (fflate vs. legacy JSONCrush) for 100% backward compatibility.
   */
  static decode(blob: string | null): any {
    if (!blob) return null

    // The URLSearchParams caller decodes the state parameter before passing it
    // here. Decode the payload exactly once at the URL boundary.
    const payload = blob

    // 1. Check for fflate format prefix ('f~')
    if (payload.startsWith("f~")) {
      return this._decodeFflate(payload.slice(2))
    }

    // 2. Fallback to Legacy JSONCrush handling
    try {
      const uncrushed = JSONCrush.uncrush(payload)
      return JSON.parse(uncrushed)
    } catch (err) {
      throw Object.assign(
        new Error(
          "Failed to parse replay blob: invalid or corrupted data format."
        ),
        { cause: err }
      )
    }
  }

  private static _decodeFflate(rawBlob: string): any {
    let base64 = rawBlob.replace(/-/g, "+").replace(/_/g, "/")
    while (base64.length % 4) {
      base64 += "="
    }

    const binaryString = atob(base64)
    const len = binaryString.length
    const compressed = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      compressed[i] = binaryString.charCodeAt(i)
    }

    const decompressed = inflateSync(compressed)
    return JSON.parse(strFromU8(decompressed))
  }
}
