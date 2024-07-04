import { httpGet, httpPost } from "../request";

export const isProduct =
  process.env.VUE_APP_NODE_ENV == "production" ||
  process.env.VUE_APP_NODE_ENV == "test"
    ? true
    : false;
const api = isProduct ? "" : "/createExchange";

const exchangeApi = isProduct ? "" : "/exchangeApi";
const exchansApi = isProduct ? "" : "/exchans";
// Test url
export const snftUrl = isProduct ? "" : "";
// Create an exchange with one click
export const createExchange = (data: any) => {
  return httpGet(`${api}/install/do_conf`, data);
};

// Example Query whether the exchange is generated successfully
export const is_install = (address: string) => {
  return httpGet(
    `${api}/install/is_install`,
    { address: address.toLowerCase() },
    null
  );
};
/**
 * @deprecated
 * @param address
 * @param params
 * @returns
 */
// One-click exchange to get the address
export const getSysParams = (address: string, params = {}) => {
  return httpGet(
    `${exchangeApi}/c${address.toLowerCase()}/v2/querySysParams`,
    params
  );
};

/**
 * Query exchange signature data
 * @deprecated
 * @param address
 * @param params
 * @returns boolean
 */
export const getExchangeSig = (address: string, params = {}) => {
  return httpGet(
    `${exchangeApi}/c${address.toLowerCase()}/v2/getExchangeSig`,
    params
  );
};

/**
 * Set System information Set one-click exchange data
 * @deprecated
 * @param address
 * @param params
 * @returns
 */
export const setExchangeSig = (address: string, params = {}) => {
  return httpPost(
    `${exchangeApi}/c${address.toLowerCase()}/v2/setExchangeSig`,
    params
  );
};

// Get the smart contract address
export const getContractAddress = () => {
  return httpGet(
    `https://wallet.erbie.io/upload/ERBPay.json?${new Date().getTime()}`
  );
};

export const getConfiguration = () => {
  return httpGet(
    `https://wallet.erbie.io/upload/configuration.json?${new Date().getTime()}`
  );
};

// const contractApi = isProduct ? 'contractApi' : 'contractApi'
const contractApi = isProduct ? "/contractApi" : "https://scanapi.erbie.io";
// Query the account information of the specified address
export const getAccountAddr = (address: string) => {
  return httpGet(`${contractApi}/account/${address}`, {});
};

// Get user NFT reward information  nftaward/v1/queryuseraward
export const queryuseraward = (user_addr: string) => {
  return httpPost(`${exchansApi}/nftaward/v1/queryuseraward`, { user_addr });
};

/**
 * receive award /v1/receiveuseraward
 * award_type erb/snft/exchange
 * @param {user_addr}
 * @param {award_type}
 * @returns
 */
export const receiveuseraward = (params: any) => {
  return httpPost(`${exchansApi}/nftaward/v1/receiveuseraward`, params);
};

export interface CreatorData {
  address: string;
  count: number;
  lastEpoch: string;
  lastNumber: number;
  lastTime: number;
  number: number;
  profit: string;
  reward: string;
  timestamp: number;
}
// specifies the address to query the creator
export const getCreator = (address: string): Promise<CreatorData> => {
  return httpGet(`${contractApi}/creator/${address}`, {});
};

// specifies the ID to query the NFT period information of the system, including 16 collection information
export const getPeriodById = (id: string): Promise<any> => {
  return httpGet(`${snftUrl}/epoch/${id}`, {});
};
