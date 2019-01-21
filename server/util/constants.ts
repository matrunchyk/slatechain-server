// Fake JSC rate which fluctuates every hour
const hourIdx = (new Date()).getHours() + 1;
const offset = 10000;
export const JSC_RATE = ((Math.sin(hourIdx) * offset) - Math.floor(Math.sin(hourIdx) * offset)) * 100 + 1000;

export enum MessageType {
  SEND_BLOCKS,
  QUERY_LATEST_BLOCK,
  QUERY_ALL_BLOCKS,
  SEND_PEERS,
}
