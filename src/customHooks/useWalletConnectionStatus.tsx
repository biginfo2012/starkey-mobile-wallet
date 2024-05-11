import { useState } from 'react';

type ConnectionStatus = 'Connected' | 'Not connected';

interface WalletConnectionStatus {
  status: ConnectionStatus;
  updateStatus: (newStatus: ConnectionStatus) => void;
}

const useWalletConnectionStatus = (): WalletConnectionStatus => {
  const [status, setStatus] = useState<ConnectionStatus>('Connected');

  const updateStatus = (newStatus: ConnectionStatus): void => {
    setStatus(newStatus);
  };

  return { status, updateStatus };
};

export default useWalletConnectionStatus;
