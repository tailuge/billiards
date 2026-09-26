#!/usr/bin/env node
// IndexNow bulk URL submission script
// Reads Cloudflare URLs from dist/sitemap.xml and POSTs them to api.indexnow.org
// Usage:
//   yarn indexnow          # submit to IndexNow
//   yarn indexnow --test   # dry-run: print the payload without sending

import { readFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const SITEMAP_PATH = resolve(__dirname, "../dist/sitemap.xml")

const HOST = "billiards.tailuge.workers.dev"
const KEY = "3d6704c08f334c5d8d13537fd318c927"
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`
const ENDPOINT = "https://api.indexnow.org/IndexNow"

const isDryRun = process.argv.includes("--test")

// Parse <xhtml:link href="..."> from sitemap — these are already CF URLs
const sitemap = readFileSync(SITEMAP_PATH, "utf-8")
const urlSet = new Set()

for (const match of sitemap.matchAll(/xhtml:link[^>]+href="([^"]+)"/g)) {
  urlSet.add(match[1].trim())
}

// Also pick up any <loc> entries that are already on the CF host (post sitemap:cf)
for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const url = match[1].trim()
  if (url.includes(HOST)) {
    urlSet.add(url)
  }
}

const urlList = [...urlSet].sort()

if (urlList.length === 0) {
  console.error("No URLs found in dist/sitemap.xml — run yarn build:cf first.")
  process.exit(1)
}

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList,
}

const body = JSON.stringify(payload, null, 2)

if (isDryRun) {
  console.log("=== DRY RUN — would POST to:", ENDPOINT)
  console.log("=== Payload:")
  console.log(body)
  console.log(`\n=== ${urlList.length} URL(s) queued`)
  process.exit(0)
}

console.log(`Submitting ${urlList.length} URL(s) to IndexNow...`)

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    Host: "api.indexnow.org",
  },
  body,
})

console.log(`Response: ${res.status} ${res.statusText}`)

// IndexNow returns empty body on success (200/202); show it if present
const text = await res.text()
if (text) {
  console.log(text)
}

if (res.status === 200 || res.status === 202) {
  console.log("✓ Submission accepted.")
} else {
  console.error("✗ Submission failed.")
  process.exit(1)
}
