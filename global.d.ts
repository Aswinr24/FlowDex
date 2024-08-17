interface Window {
    ethereum?: any; // or use a more specific type if available
  }

type CryptoAddress = `0x${string}`
type OrdersData = [BigInt[], string[], string[]]