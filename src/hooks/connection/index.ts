import { useConnect } from './connect';
import { useConnected } from './connected';
import { useDisconnect } from './disconnect';

export { useConnect, useConnected, useDisconnect };

/**
 * Base connection hook
 */
export function useConnection() {
  const connected = useConnected();
  const connect = useConnect();
  const disconnect = useDisconnect();

  return {
    connected,
    connect,
    disconnect,
  };
}
