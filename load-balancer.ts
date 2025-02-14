import http from 'http'

interface BackendInstance {
  host: string
  port: number
  name: string
}

/*** TODO: replace with ec2 instances ***/
const clusters: BackendInstance[] = [
  { host: 'localhost', port: 8081, name: 'Instance 1' },
  { host: 'localhost', port: 8082, name: 'Instance 2' },
  { host: 'localhost', port: 8083, name: 'Instance 3' },
]

/*** Intialize test servers for testing load-balancer ***/
// TODO: remove once fully tested
clusters.forEach(serverNode => {
  http
    .createServer((req, res) => {
      console.log(`${serverNode.name} received request ${req.url}`)
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end(
        `${serverNode.name}:${serverNode.port} is serving Request: ${req.url}`,
      )
    })
    .listen(serverNode.port, () => {
      console.log(`${serverNode.name} listening on port ${serverNode.port}`)
    })
})

let currentServerPosition = 0
const loadBalancer = http.createServer((req, res) => {
  // Round-Robin Implementation
  const server = clusters[currentServerPosition]
  currentServerPosition = (currentServerPosition + 1) % clusters.length

  console.log(`Load-Balancer forwarding request to ${server.name}`)
  const proxyReq = http.request(
    {
      host: server.host,
      port: server.port,
      path: req.url,
      method: req.method,
      headers: req.headers,
    },
    proxyRes => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers)
      proxyRes.pipe(res)
    },
  )

  req.pipe(proxyReq)
  proxyReq.on('error', err => {
    console.error(`Error connecting to ${server.name}:`, err)
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end('Internal Server Error')
  })
})

loadBalancer.listen(8080, () => {
  console.log('Load Balancer on Port 8080')
})
