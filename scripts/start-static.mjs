import { createReadStream } from 'node:fs'
import { access, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'

const port = Number(process.env.PORT ?? 3000)
const distDir = join(process.cwd(), 'dist')

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
}

const sendFile = async (filePath, response) => {
  const extension = extname(filePath)
  const contentType = mimeTypes[extension] ?? 'application/octet-stream'

  response.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
  })

  createReadStream(filePath).pipe(response)
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', `http://${request.headers.host}`)
    const requestPath = decodeURIComponent(url.pathname)

    if (requestPath === '/health') {
      response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end('ok')
      return
    }

    const normalized = normalize(requestPath).replace(/^\\+|^\/+/g, '')
    const candidatePath = join(distDir, normalized)

    try {
      const candidateStat = await stat(candidatePath)
      if (candidateStat.isFile()) {
        await sendFile(candidatePath, response)
        return
      }
    } catch {
      // Fallback to index.html for SPA routes.
    }

    const indexPath = join(distDir, 'index.html')
    await sendFile(indexPath, response)
  } catch {
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('Internal server error')
  }
})

const start = async () => {
  await access(distDir)
  server.listen(port, '0.0.0.0', () => {
    console.log(`Static server listening on http://0.0.0.0:${port}`)
  })
}

start().catch(() => {
  console.error('dist/ not found. Run the build step before starting the web process.')
  process.exit(1)
})
