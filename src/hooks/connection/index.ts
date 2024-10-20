import useConnect from './connect';
import useConnected from './connected';
import useDisconnect from './disconnect';

/**
 * Base connection hook
 */
export default function useConnection() {
  const connected = useConnected();
  const connect = useConnect();
  const disconnect = useDisconnect();

  return {
    connected,
    connect,
    disconnect,
  };
}
