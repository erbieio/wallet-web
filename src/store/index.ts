// @ts-nocheck
import { createStore } from 'vuex'
import common from './modules/common'
import account from './modules/account'
import price from './modules/price'
import system from './modules/system'
import txList from './modules/txList'
import configuration from './modules/configuration'
import mnemonic from './modules/mnemonic'
import { clone } from 'pouchdb-utils';
import transfer  from './modules/transfer'
import nft  from './modules/nft'
import VuexPersistence from 'vuex-persist';
import localforage from 'localforage';
import deepmerge from 'deepmerge'
export const vuexLocal = new VuexPersistence({
  storage: localforage,
  asyncStorage: true,
  reducer: (store) => {
    const {
    account:{
      mnemonic:mnemonicPath,
      path,
      wallet,
      accountList,
      currentNetwork,
      netWorkList,
      keyStore,
      accountInfo,
      networkType,
      recentList,
      exchangeGuidance,
      firstTime,
      tranactionList,
      exchangeStatus,
      exchangeServer,
      validator,
      chainVersion
    },
    price,
    system: {
      language,
      version,
      layoutType,
      transferUSDRate,
      transferCNYRate,
      finishedGuide,
      show0,
      show1,
      show2,
      show3,
      show4,
      show5,
      show6,
      show7,
      show8,
      show9,
      show10,
      show11,
      show12,
      show13,
      wallet_token,
      movePwd,
      hasBackUpMnemonic,
      lastDelayTime,
      chainVersion: chainVersion2
    },
    common,
    transfer,
    mnemonic,
    configuration,
    txList
    } = store

    return clone(({
      account:{
        mnemonic:mnemonicPath,
        path,
        wallet,
        accountList,
        currentNetwork,
        netWorkList,
        keyStore,
        accountInfo,
        networkType,
        recentList,
        exchangeGuidance,
        firstTime,
        tranactionList,
        exchangeStatus,
        exchangeServer,
        validator,
        chainVersion
      },
      common,
      price,
      transfer,
      mnemonic,
      system: {
        language,
        version,
        chainVersion: chainVersion2,
        layoutType,
        transferUSDRate,
        transferCNYRate,
  
        finishedGuide,
        show0,
        show1,
        show2,
        show3,
        show4,
        show5,
        show6,
        show7,
        show8,
        show9,
        show10,
        show11,
        show12,
        show13,
        wallet_token,
        movePwd,
        hasBackUpMnemonic,
        lastDelayTime,
      },
      configuration,
      txList,
    }))
  },
});

const store = createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    account,
    price,
    system,
    common,
    transfer,
    mnemonic,
    configuration,
    txList,
    nft
  },
  plugins: [
    vuexLocal.plugin
  ]
})

// Actively synchronizes from cache to store
export const asyncStoreFromLocal = () => {
  let time = setTimeout(async() => {
    const savedState = await vuexLocal.restoreState(vuexLocal.key, vuexLocal.storage)
    store.replaceState(deepmerge(store.state, savedState || {}, {
      arrayMerge: (destinationArray, sourceArray, options) => sourceArray
    }))
    clearTimeout(time)
   },500)
}

export default store
export interface StoreReturns {
  [key: string]: any
}
