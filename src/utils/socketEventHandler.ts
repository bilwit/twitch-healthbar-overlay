import { EventEmitter } from "ws";

export default function socketEventHandler(eventData: any, TwitchEmitter: EventEmitter): void {
  switch (eventData?.message) {
    case 'reset': // reset health to default
    if (eventData?.relations_id) {
      TwitchEmitter.emit('reset', {
        relations_id: eventData?.relations_id,
      });
    } else if (eventData?.id) {
      TwitchEmitter.emit('reset', {
        id: eventData?.id,
      });
    }

      break;
    case 'current': // send current health on demand
      TwitchEmitter.emit('current', {
        id: eventData?.id,
      });
      break;
    case 'pause': // pause monster and related monsters health
      if (eventData?.relations_id) {
        TwitchEmitter.emit('pause', {
          relations_id: eventData?.relations_id,
        });
      } else if (eventData?.id) {
        TwitchEmitter.emit('pause', {
          id: eventData?.id,
        });
      }
      break;
    case 'unpause': // pause monster and related monsters health
      if (eventData?.relations_id) {
        TwitchEmitter.emit('unpause', {
          relations_id: eventData?.relations_id,
        });
      } else if (eventData?.id) {
        TwitchEmitter.emit('unpause', {
          id: eventData?.id,
        });
      }
      break;
    default:
      break;
  }
}
