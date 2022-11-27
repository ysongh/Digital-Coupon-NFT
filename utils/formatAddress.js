export const formatAddress = (ethAddress) => {
  return ethAddress.substring(0, 5) + '...' + ethAddress.substring(36, 42);
}