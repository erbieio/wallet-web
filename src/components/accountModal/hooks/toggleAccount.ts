// @ts-nocheck
import { SetupContext, Ref, ref, reactive, defineComponent, computed, toRaw, nextTick } from "vue";
import { CreateWalletByJsonParams, CreateWalletByMnemonicParams, createWalletByMnemonic, getPath } from '@/utils/ether'
import { setCookies, getCookies, hasLogin } from '@/utils/jsCookie'
import { encryptPrivateKey, EncryptPrivateKeyParams } from '@/utils/web3'
import eventBus from "@/utils/bus";
import { useBroadCast } from '@/utils/broadCast'
import i18n from "@/language/index";
import store from '@/store/index'
import router from "@/router";
import { Mnemonic } from "ethers/lib/utils";
import { useExchanges } from "@/hooks/useExchanges";
import localforage from "localforage";
import { ethers } from "ethers";
export const useToggleAccount = () => {
  const { commit, dispatch, state } = store
  const { handleUpdate } = useBroadCast()
  const createLoading: Ref<boolean> = ref(false)
  const listDom = ref()
  const showAccount: Ref<boolean> = ref(false);
  const toggleAccount = () => {
    showAccount.value = true;
  };
  const { initExchangeData } = useExchanges()
  const options = computed(() => store.state.account.accountList)
  const accountLoading: Ref<boolean> = ref(false)
  const clickAccountIdx: Ref<number | null> = ref(null)
  const handleAccount = async (account: any, idx: number) => {
    if (createLoading.value) {
      return
    }
    eventBus.emit('beforeChangeAccount')
    accountLoading.value = true
    clickAccountIdx.value = idx
    const { currentNetwork } = store.state.account
    const password: string = getCookies('password') || ''
    const keyStore = toRaw(account.keyStore)
    const data: CreateWalletByJsonParams = {
      password,
      json: keyStore
    }
    try {
      const wall = await dispatch('account/createWalletByJson', data)
      eventBus.emit('changeAccount', wall.address)
      commit('account/UPDATE_ACCOUNTINFO', account)
      dispatch('account/updateTokensBalances')
      dispatch("account/getProviderWallet");
      dispatch('account/getChainVersion')
      dispatch("account/getExchangeStatus")
      dispatch('account/getCreatorStatus', wall.address)

      handleUpdate()
      return wall
    } catch (err) {
      const errstr = String(err)
      if (errstr.indexOf('password') > -1) {
        router.replace({ name: 'withpassword' })
      }
    } finally {
      accountLoading.value = false
      clickAccountIdx.value = null
    }
    showAccount.value = false
  };
  const password: string = getCookies('password') || '';
  const keyStore = computed(() => store.state.mnemonic.keyStore)
  const phrase: string = ethers.Wallet.fromEncryptedJsonSync(JSON.stringify(keyStore.value), password).mnemonic.phrase
  // let phrase: string = ethers.Wallet.fromEncryptedJsonSync(JSON.stringify(keyStore.value), password).mnemonic.phrase
  const createWalletByPath = async (callBack: Function = () => { }) => {
    const { pathIndex, path }: any = { ...store.state.account.mnemonic }
    const newPathIndex = (Number(pathIndex) + 1)
    let startTime = new Date().getTime()
    console.warn('pathIndex', pathIndex)
    console.log('startTime', startTime)
    console.log('time 1 parse', new Date().getTime() - startTime)
    let mnemonic: CreateWalletByMnemonicParams = { pathIndex: newPathIndex, phrase, path }
    const wallet = ethers.Wallet.fromMnemonic(phrase, getPath(newPathIndex))
    console.log('time 2 parse', new Date().getTime() - startTime)

    let { privateKey, address } = wallet
    const accountList = toRaw(store.state.account.accountList);
    const newAdd = address.toUpperCase();
    const hasAccount = accountList.find(
      (item: any) => item.address.toUpperCase() == newAdd
    );
    if (hasAccount) {
      commit('account/UPDATE_MNEMONIC', {
        pathIndex: newPathIndex + 1,
        path
      })
      createWalletByPath(callBack)
    } else {
      console.log('time 3 parse', new Date().getTime() - startTime)
      commit('account/UPDATE_MNEMONIC', {
        pathIndex: newPathIndex,
        path
      })
      callBack(wallet, mnemonic)
    }
  }

  const createAccount = () => {
    if(createLoading.value) {
      return Promise.reject('loading ...')
    }
    createLoading.value = true
    const password: string = getCookies('password') || ''
    if (!password) {
      router.replace({ name: 'withpassword' })
      return Promise.reject('password is invalid ...')
    }
    return new Promise((resolve, reject) => {
      createWalletByPath(async(wallet: any, mnemonic: Mnemonic) => {
        eventBus.emit('beforeChangeAccount')
        const { privateKey, address } = wallet
        const params: EncryptPrivateKeyParams = {
          privateKey,
          password
        }
        const keyStore = await encryptPrivateKey(params)
        dispatch('account/addAccount', { keyStore, mnemonic, address }).then(() => {
          resolve(wallet)
          eventBus.emit('changeAccount', address)
          handleUpdate()
          dispatch("account/getExchangeStatus")
          nextTick(() => {
            listDom.value?.scrollTop = listDom.value.scrollHeight
          })
        }).finally(() => {
          createLoading.value = false
        })
      })
    })

  }
  return {
    showAccount,
    toggleAccount,
    options,
    handleAccount,
    createLoading,
    createAccount,
    accountLoading,
    clickAccountIdx,
    listDom
  }
}
