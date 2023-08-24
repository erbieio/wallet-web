import { getWallet, handleGetTranactionReceipt, TransactionReceipt } from "./account";
import { toHex } from "@/utils/utils";
import { Toast } from "vant";
import { utils } from "ethers";
import { ethers } from "ethers";
import { TransactionTypes } from "./account";
import { encode, decode } from 'js-base64';
import store from '@/store/index'
interface GetNftPageIdxs {
  [key: string]: { total: string, page: string }
}
interface State {
  nftPageParams: GetNftPageIdxs
}
export default {
  state: {
    // Record NFT list loading of each account
    nftPageParams: {}
  },
  mutations: {
    // Page of current address+1
    addNftPage(state: State, opt: any) {
      const { page, address, total } = opt
      Object.keys(state.nftPageParams).forEach(key => {
        if (key == address) {
          state.nftPageParams[key].total = total
          state.nftPageParams[key].page = page + 1
        }
      })
    }
  },
  actions: {
    //   NFT to Erb
    async nftConver({ commit, state }: any, nft_address: string) {
      const wallet = await getWallet();
      const blockNumber = await wallet.provider.getBlockNumber()
      const { address } = wallet;
      const d = {type:6,version:"v0.0.1",nft_address}
      const str = `${store.getters['account/chainParsePrefix']}:${JSON.stringify(d)}`;
      const data3 = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(str));
      const tx1 = {
        from: address,
        to: address,
        data: data3,
        value: '0',
      };
      sessionStorage.setItem('nft_address', nft_address)
      sessionStorage.setItem("blockNumber", blockNumber)
      const data: any = await store.dispatch('account/transaction', tx1)
      const receipt: any = await data.wait()
      store.dispatch('account/waitTxQueueResponse')
      return receipt
    },
    // Personal casting NFT
    async nftCreate({ commit, state }: any, nft_data: any) {
      const wallet = await getWallet();
      const { address } = wallet
      const { royalty, meta_url, name, desc, category } = nft_data;
      const par = {
        version: '0.0.1',
        type: 0,
        royalty: royalty,
        exchanger: "",
        meta_url: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(JSON.stringify(nft_data)))
      }
      const parstr = `${store.getters['account/chainParsePrefix']}:${JSON.stringify(par)}`
      const newdata = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(parstr))
      const tx = {
        from: address,
        to: address,
        data: newdata,
        value: "0",
      };
      const data = await store.dispatch('account/transaction', tx)
      store.dispatch('account/waitTxQueueResponse')
      return data
    },
    // Transfer NFT
    async send({ commit, state }: any, params: TransferData) {
      const wallet = await getWallet();
      const { address } = wallet
      const { nft_address, to, checkTxQueue } = params
      // Update recent contacts
      store.commit("account/PUSH_RECENTLIST", to);
      const d = {type:1,version:"v0.0.1",nft_address}
      const str = `${store.getters['account/chainParsePrefix']}:${JSON.stringify(d)}`;
      const data3 =  ethers.utils.hexlify(ethers.utils.toUtf8Bytes(str));
      const tx = {
        from: address,
        to,
        data: data3,
      };
      const data = await store.dispatch('account/transaction', tx)
      return data
    },

  },
  namespaced: true,
};


export type TransferData = {
  nft_address: string,
  to: string,
  checkTxQueue: boolean
}