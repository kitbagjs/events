export type WorkerMessage = {
  event: any,
  payload: any,
}

const ports: MessagePort[] = [];

self.onconnect = function(event) {
  const port = event.ports[0]
  
  ports.push(port);

  port.onmessage = (event) => {

    ports.forEach(port => {
      port.postMessage(event.data)
    })

  }
}