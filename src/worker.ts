export type WorkerMessage = {
  event: any,
  payload: any,
}

self.onmessage = (event) => {
  self.postMessage(event.data);
};