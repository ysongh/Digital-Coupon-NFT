export const formatAddress = (ethAddress) => {
  if(ethAddress) return ethAddress.substring(0, 5) + '...' + ethAddress.substring(36, 42);
  return "";
}