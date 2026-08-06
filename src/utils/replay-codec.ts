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
      .replace(/=+$/, "")

    return `f~${base64}`
  }

  /**
   * Decodes blob parameter back to JS object.
   * Auto-detects format (fflate vs. legacy JSONCrush) for 100% backward compatibility.
   */
  static decode(blob: string | null): any {
    if (!blob) return null

    const unescapedBlob = decodeURIComponent(blob)

    // 1. Check for fflate format prefix ('f~')
    if (unescapedBlob.startsWith("f~")) {
      return this._decodeFflate(unescapedBlob.slice(2))
    }

    // 2. Fallback to Legacy JSONCrush handling
    try {
      const uncrushed = JSONCrush.uncrush(unescapedBlob)
      return JSON.parse(uncrushed)
    } catch (err) {
      // 3. Fallback for old legacy payload that used raw uncrushed fflate without prefix
      try {
        return this._decodeFflate(unescapedBlob)
      } catch {
        throw new Error("Failed to parse replay blob: invalid or corrupted data format.")
      }
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
