import http from 'http'
import 'dotenv/config'

interface BackendInstance {
  host: string
  port: number
  name: string
}

/*** Server Group ***/
const server1 = JSON.parse(process.env.SERVER1!)
const server2 = JSON.parse(process.env.SERVER2!)
const clusters: BackendInstance[] = [
  { host: server1.HOST, port: server1.PORT, name: server1.NAME },
  { host: server2.HOST, port: server2.PORT, name: server2.NAME }
]

let currentServerPosition = 0
const loadBalancer = http.createServer((req, res) => {
  // Round-Robin Implementation
  const server = clusters[currentServerPosition]
  currentServerPosition = (currentServerPosition + 1) % clusters.length

  console.log(
    `Load-Balancer forwarding request to ${server.host}:${[server.port]}`
  )
  const proxyReq = http.request(
    {
      host: server.host,
      port: server.port,
      path: req.url,
      method: req.method,
      headers: req.headers
    },
    proxyRes => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers)
      proxyRes.pipe(res)
    }
  )

  req.pipe(proxyReq)
  proxyReq.on('error', err => {
    console.error(`Error connecting to ${server.name}:`, err)
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end('Internal Server Error')
  })
})

loadBalancer.listen(process.env.PORT || 8080, () => {
  console.log(`Load Balancer on Port ${process.env.PORT}`)
})
