<template>
  <div class="currency">
    <div class="flex center">
      <div class="flex center currency-icon">
        <img class="currency-symbol" :src="require(`@/assets/currency.svg`)" alt="'" />
      </div>
    </div>
    <div :class="`amount text-center ${decimal(pageData.data.balance).length > 30 ? 'small' : 'big'
          }`">
      {{ decimal(pageData.data.balance) }} {{ pageData.data.symbol }}
    </div>

    <div class="flex center">
      <div class="actions-list flex evenly">
        <div class="actions-list-card">
          <div class="flex center">
            <div class="actions-list-card-icon flex center" @click.stop="toogleAcceptCode">
              <i class="iconfont icon-bottom"></i>
            </div>
          </div>
          <div class="actions-list-card-label text-center">
            {{ t("wallet.takeover") }}
          </div>
          <!-- <van-popup v-model:show="showAcceptCode" class="receive-sheet-popup" teleport="#page-box"  position="bottom" round>
            <AcceptCode />
          </van-popup> -->
        </div>
        <div class="actions-list-card" @click="toSend">
          <div class="flex center">
            <div class="actions-list-card-icon flex center">
              <i class="iconfont icon-jiantou_youshang"></i>
            </div>
          </div>
          <div class="actions-list-card-label text-center">
            {{ t("wallet.send") }}
          </div>
        </div>
      </div>
    </div>
    <div class="tx-tit lh-30 pl-14 pr-14 mt-20">{{ t("common.hsitory") }}</div>
    <div class="swap-list" v-show="!loading">
      <!-- <DynamicScroller class="scroller" :items="txList" minItemSize="30" keyField="txId" pageMode>
        <template v-slot="{ item, active, index }">
          <DynamicScrollerItem :item="item" :active="active" :data-index="index">
            <CollectionCard @handleClick="handleView(item)" @handleSend="handleSend" @handleCancel="handleCancel" :data="item" />
          </DynamicScrollerItem>
        </template>

</DynamicScroller> -->
      <CollectionCard @handleClick="handleView(item)" v-for="item in txList" :key="item.hash" @handleSend="handleSend" @handleCancel="handleCancel" :data="item" />
      <NoData v-if="!txList.length" :message="$t('wallet.no')" />

      <van-dialog v-model:show="showTransactionModal" title :showCancelButton="false" :showConfirmButton="false" closeOnClickOverlay class="transfer-detail-modal">
        <TransactionDetail @handleClose="handleClose" @handleSpeed="handleSend" @handleCancel="handleCancel" :data="transactionData.data" />
      </van-dialog>
    </div>
    <div class="loading-list-con" v-show="loading">
      <div class="loading-list-card" v-for="item in 10" :key="item">
        <van-skeleton avatar :row="2" />
      </div>
    </div>
  </div>
  <div class=" fixed-bottom">
    <i18n-t tag="div" keypath="wallet.toBrowser" class="flex center scan-link">
      <template v-slot:link>
        <span @click="toScan(accountInfo.address, '/address')" class="f-12 view-history hover" rel="noopener noreferrer">{{ t("wallet.scanLink") }}</span>
      </template>
    </i18n-t>
  </div>
  <!-- <Transition name="slider">

  </Transition> -->
  <CommonModal v-model="showSpeedModal" :title="sendTxType == 1
          ? t('common.gasSpeedUp')
          : t('transationHistory.cancelDealTit')
          " className="transactionDetailsModal">
    <div class="m-14 pl-14 pr-14 border-round detail-modal">
      <div class="flex between lh-16 pt-12 pb-8">
        <span>{{ t("transactionDetails.nonce") }}</span>
        <span>#{{ sendTx.nonce }}</span>
      </div>
      <div class="flex between lh-16 pt-8 pb-8 border-bottom">
        <span>{{ t("sendto.gasLimit") }}</span>
        <span>{{
          ethers.utils.formatUnits(sendTx.sendData.gasLimit, "wei")
          }}</span>
      </div>
      <div class="flex between lh-16 pt-8 pb-8">
        <span>{{ t("converSnft.amount") }}</span>
        <span>{{
          !sendTx.tokenAddress
          ? ethers.utils.formatEther(sendTx.sendData.value)
          : sendTx.amount
          }}</span>
      </div>
      <div class="flex between lh-16 pt-8 pb-8">
        <span>{{ t("transactionDetails.gasfee") }}</span>
        <span>{{
          sendTx.sendData.gasPrice
          ? ethers.utils.formatEther(sendTx.sendData.gasPrice)
          : 0
          }}</span>
      </div>
      <div class="flex between lh-16 pt-8 pb-12">
        <span>{{ t("transactionDetails.totalAmount") }}</span>
        <span>≈
          {{
          !sendTx.tokenAddress
          ? ethers.utils.formatEther(sendTx.sendData.value)
          : sendTx.amount
          }}
          {{ currentNetwork.currencySymbol }}</span>
      </div>
    </div>
    <ModifGasFee :show="showSpeedModal" :to="sendTx.to" :gasPrice="sendTx.gasPrice" :gasLimit="sendTx.gasLimit" :amount="ethers.utils.formatEther(sendTx.sendData.value)" @change="handleGasChange" />
    <div class="sendBtnBox pb-20 mt-20">
      <van-button @click="showSpeedModal = false" class="mr-26">{{
        t("common.cancel")
        }}</van-button>
      <van-button type="primary" @click="reSendTx" :loading="reloading">{{
        t("common.confirm")
        }}</van-button>
    </div>
  </CommonModal>
</template>
<script lang="ts">
import {
  ref,
  Ref,
  reactive,
  onMounted,
  computed,
  toRefs,
  onBeforeMount,
  nextTick,
  onUnmounted,
  watch,
} from "vue";
import { Icon, Popup, Empty, Dialog, Button, Toast, Skeleton, List } from "vant";
import CollectionCard from "@/views/account/components/collectionCard/index.vue";
import { addressMask, decimal } from "@/utils/filters";
import AcceptCode from "@/views/account/components/acceptCode/index.vue";
import TransactionDetail from "@/views/account/components/transactionDetail/index.vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { hexValue } from "@ethersproject/bytes";
import { useI18n } from "vue-i18n";
import CommonModal from "@/components/commonModal/index.vue";
import NoData from "@/components/noData/index.vue";
import { VUE_APP_SCAN_URL } from "@/enum/env";
import localforage from "localforage";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { debounce, guid, toScan } from "@/utils/utils";
import {
  clone,
  getWallet,
  DEL_TXQUEUE,
  PUSH_TRANSACTION,
} from "@/store/modules/account";
import ModifGasFee from "../components/modifGasFee.vue";
import { utils } from "ethers";
import { web3 } from "@/utils/web3";
import { useDialog } from "@/plugins/dialog";
import eventBus from "@/utils/bus";
import { stopLoop } from '@/store/modules/txList';
import { RecycleScroller, DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import SliderBottom from '@/components/sliderBottom/index.vue'

type SendTx = {
  [key: string]: any
}

export default {
  components: {
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [Empty.name]: Empty,
    [Button.name]: Button,
    [Skeleton.name]: Skeleton,
    [List.name]: List,
    [Dialog.Component.name]: Dialog.Component,
    CollectionCard,
    AcceptCode,
    TransactionDetail,
    NoData,
    CommonModal,
    SliderBottom,
    ModifGasFee,
    DynamicScrollerItem,
    DynamicScroller
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const store = useStore();
    const { query } = useRoute();
    const { tokenContractAddress } = query;
    const accountInfo = computed(() => store.state.account.accountInfo);
    const currentNetwork = computed(() => store.state.account.currentNetwork);
    const transactionList = ref([]);
    const pageData = reactive({ data: {} });
    const { $wdialog } = useDialog();
    pageData.data = query;
    const txList = ref([]);
    const toogleAcceptCode = () => {
      const params = {
        type: "receive",
        data: {
          address: accountInfo.value.address,
          tokenContractAddress: null,
          value: 0,
          symbol: currentNetwork.value.symbol,
          name: currentNetwork.value.name,
        },
      };
      router.push({
        name: "receive-send-link",
        query: {
          code: JSON.stringify(params),
        },
      });
    };
    const loading = ref(true);
    txList.value = [];
    const getPageList = async () => {
      // showSpeedModal.value = false;
      try {
        const chainId = currentNetwork.value.chainId;
        const id = currentNetwork.value.id;
        const targetAddress = accountInfo.value.address.toUpperCase();
        let searchKey = "";
        if (id === "wormholes-network-1") {
          searchKey = `async-${id}-${chainId}-${targetAddress}`;
        } else {
          searchKey = `txlist-${id}-${chainId}-${targetAddress}`;
        }
        const txInfo: any = await localforage.getItem(searchKey);
        const queuekey = `txQueue-${id}-${chainId}-${targetAddress.toUpperCase()}`;
        const txQueue = await localforage.getItem(queuekey);
        let tx = [];
        if (id === "wormholes-network-1") {
          tx = txInfo ? txInfo.list : [];
        } else {
          tx = txInfo;
        }

        if (tx && tx.length) {
          const list = tx || [];
          if (tokenContractAddress) {
            txList.value = list.filter((item: any) => {
              if (item.to) {
                return item.to.toUpperCase() == tokenContractAddress.toString().toUpperCase()
              }
            });

          } else {
            const tokens = currentNetwork.value.tokens[accountInfo.value.address.toUpperCase()]
            const tokenAddrs = tokens && tokens.length ? tokens.map((item: any) => item.tokenContractAddress.toUpperCase()) : []
            txList.value = list
          }
        }
        if (!tokenContractAddress) {
          if (Array.isArray(txQueue)) {
            txQueue.forEach(item => {
              if (!item.tokenAddress) {
                // @ts-ignore
                txList.value.unshift(item)
              }
            })
          }
        } else {
          if (Array.isArray(txQueue)) {
            txQueue.forEach(item => {
              if (item.tokenAddress.toUpperCase() == tokenContractAddress.toString().toUpperCase()) {
                // @ts-ignore
                txList.value.unshift(item)
              }
            })
          }
        }

      } catch (err) {
      } finally {
        loading.value = false;
      }
    };

    const handleAsyncTxList = () => {
      return store.dispatch(
        "txList/loopAsyncTxList",
        accountInfo.value.address
      );
    };
    let waitTime: any = ref(null);
    onMounted(async () => {
      store.dispatch('account/clearWaitTime')

      try {
        const { total, asyncRecordKey } = await handleAsyncTxList();
        await store.dispatch('txList/asyncUpdateList', { total })
      } finally {
        getPageList();
        loading.value = false
      }
      store.dispatch("account/waitTxQueueResponse", {
        time: null
      });

    });
    const toSend = () => {
      router.push({ name: "send", query });
    };
    const toSwap = () => { };
    let transactionData: any = reactive({ data: {} });
    const showTransactionModal: Ref<boolean> = ref(false);
    const handleView = (e: any) => {
      transactionData.data = e;
      showTransactionModal.value = true;
    };
    const handleClose = () => {
      showTransactionModal.value = false;
    };
    const showSpeedModal = ref(false);
    const sendTx: Ref<SendTx> = ref({});
    // 1 speed up  2 cancel
    const sendTxType = ref(1);
    const handleSend = (data: any) => {
      handleClose();
      sendTxType.value = 1;
      sendTx.value = data;
      showSpeedModal.value = true;
    };

    const handleCancel = (data: any) => {
      handleClose();
      sendTxType.value = 2;
      sendTx.value = data;
      showSpeedModal.value = true;
    };

    const gasLimit = ref("0");
    const gasPrice = ref("0");
    const handleGasChange = (gasData: any) => {
      const { gasLimit: limit, gasPrice: gprice } = gasData;
      gasLimit.value = limit;
      gasPrice.value = gprice;
    };
    const reloading = ref(false);
    const reSendTx = async () => {
      reloading.value = true;
      if (sendTxType.value === 1) {
        resend();
      }
      if (sendTxType.value === 2) {
        cancelSend();
      }
    };
    eventBus.on('changeNetwork', async (address) => {
      loading.value = true
      txList.value = [];
      try {
        const { total, asyncRecordKey } = await handleAsyncTxList();
        await store.dispatch('txList/asyncUpdateList', { total })
        await getPageList();
      } finally {
        loading.value = false
      }
      store.dispatch("account/waitTxQueueResponse", {
        time: null,
      });
    })
    eventBus.on("loopTxListUpdata", () => {
      getPageList();
    });
    eventBus.on("txPush", (data: any) => {
      getPageList()
    });
    eventBus.on("delTxQueue", (data: any) => {
      getPageList()
    });

    eventBus.on("txQueuePush", (data: any) => {
      getPageList()

    });
    eventBus.on('waitTxEnd', async () => {
      store.dispatch('txList/asyncUpdateList', { total: 0 })

    })
    eventBus.on("txUpdate", (data: any) => {
      getPageList()
    });
    onUnmounted(() => {
      if (waitTime.value) {
        clearInterval(waitTime.value);
      }
      stopLoop()
      eventBus.off("txPush");
      eventBus.off("txUpdate");
      eventBus.off("loopTxListUpdata");
      eventBus.off("txQueuePush");
      eventBus.off("delTxQueue");
      eventBus.off('waitTxEnd')
      store.dispatch('account/clearWaitTime')



    });
    const cancelSend = async () => {
      try {
        const wallet = await getWallet();
        const blockNumber = await wallet.provider.getBlockNumber();
        const {
          nonce,
          to,
          network: localNet,
          value,
          tokenAddress,
          toAddress,
          amount,
          transitionType,
          data: newData,
          sendData,
          txId,
        }: any = sendTx.value;
        const tx = {
          to: wallet.address,
          nonce,
          gasPrice: gasPrice.value || '1.2',
          gasLimit: gasLimit.value,
          value: ethers.utils.parseEther("0"),
          data: sendData.data
        };
        let data = null;
        if (tokenAddress) {
          const transferParams = {
            nonce,
            gasPrice: gasPrice.value || '1.2',
            gasLimit: gasLimit.value,
            to: toAddress,
            checkTxQueue: false,
            address: tokenAddress,
            amount
          };
          data = await store.dispatch('account/tokenTransaction', transferParams)
        } else {
          data = await store.dispatch('account/transaction', {
            ...tx,
            checkTxQueue: false
          })
        }
        let txType = 'normal'
        if (tokenAddress) {
          txType = 'contract'
        } else {
          txType = !newData ? 'normal' : (newData.indexOf(store.getters['account/chainParsePrefix']) > -1 ? store.getters['account/chainParsePrefix'] : 'contract')
        }
        const { hash, from, type, value: newVal, contractAddress } = data;
        const txInfo = {
          ...sendTx.value,
          receipt: {
            blockHash: null,
            blockNumber: blockNumber,
            cumulativeGasUsed: { type: "BigNumber", hex: "0x0" },
            effectiveGasPrice: { type: "BigNumber", hex: "0x0" },
            gasUsed: { type: "BigNumber", hex: "0x0" },
            // @ts-ignore
            transactionHash: sendTx.value.hash,
            from,
            to,
            contractAddress,
            transactionIndex: 0,
            status: 0,
          },
          gasPrice: gasLimit,
          gasLimit: gasLimit.value,
          value: ethers.utils.formatUnits(value, "wei"),
          txType
        }
        await DEL_TXQUEUE(txInfo)
        const newres = {
          ...clone(txInfo),
          txId: guid(),
          sendData: data,
          sendType: 'cancel',
        }
        await PUSH_TRANSACTION(newres)
        const receipt = await data.wallet.provider.waitForTransaction(
          data.hash,
          null,
          60000
        );
        store.dispatch('account/clearWaitTime')
        await store.dispatch("account/waitTxQueueResponse");
        handleAsyncTxList()
      } catch (err) {
        Toast(err.reason);
      } finally {
        showSpeedModal.value = false;
        reloading.value = false;
      }
    };

    const resend = async () => {
      /**
       * step1  step1  Set the original transaction status to false and unshift to the transaction record
       * step2  New transactions are added to the send queue
       * step3  Query the transaction receipt of the send queue
       */

      try {
        const wallet = await getWallet();
        const blockNumber = await wallet.provider.getBlockNumber();
        const {
          nonce,
          to,
          network: localNet,
          value,
          tokenAddress,
          amount,
          transitionType,
          data: newData,
          sendData,
          toAddress,
          txId,
        }: any = sendTx.value;
        const tx: any = {
          to,
          nonce,
          gasPrice: gasPrice.value || '1.2',
          gasLimit: gasLimit.value,
          data: sendData.data
        };
        let data = null;
        if (tokenAddress) {
          const transferParams = {
            nonce,
            gasPrice: gasPrice.value || '1.2',
            gasLimit: gasLimit.value,
            to: toAddress,
            checkTxQueue: false,
            address: tokenAddress,
            amount
          };
          data = await store.dispatch('account/tokenTransaction', transferParams)
        } else {
          tx.value = utils.formatEther(value);
          data = await store.dispatch('account/transaction', {
            ...tx,
            checkTxQueue: false
          })
        }
        // step1  Set the original transaction status to false and unshift to the transaction record
        const { hash, from, type, value: newVal, contractAddress } = data;
        let txType = 'normal'
        if (tokenAddress) {
          txType = 'contract'
        } else {
          txType = !newData ? 'normal' : (newData.indexOf(store.getters['account/chainParsePrefix']) > -1 ? store.getters['account/chainParsePrefix'] : 'contract')
        }
        const txInfo = {
          ...sendTx.value,
          receipt: {
            blockHash: null,
            blockNumber: blockNumber,
            cumulativeGasUsed: { type: "BigNumber", hex: "0x0" },
            effectiveGasPrice: { type: "BigNumber", hex: "0x0" },
            gasUsed: { type: "BigNumber", hex: "0x0" },
            transactionHash: sendTx.value.hash,
            from,
            to,
            contractAddress,
            transactionIndex: 0,
            status: 0,
          },
          value: ethers.utils.formatUnits(value, "wei"),
          txType,
          gasPrice: gasLimit,
          gasLimit: gasLimit.value,
        }
        await DEL_TXQUEUE(txInfo)
        // store.commit("account/DEL_TXQUEUE",txInfo);
        const newres = {
          ...clone(txInfo),
          txId: guid(),
          sendData: data,
          sendType: 'speed',
        }
        await PUSH_TRANSACTION(newres)
        const receipt = await data.wallet.provider.waitForTransaction(data.hash);
        store.dispatch('account/clearWaitTime')
        await store.dispatch("account/waitTxQueueResponse");
        handleAsyncTxList()
      } catch (err) {
        Toast(err.reason);
      } finally {
        showSpeedModal.value = false;
        reloading.value = false;
      }
    };


    return {
      showSpeedModal,
      sendTxType,
      handleGasChange,
      handleSend,
      sendTx,
      reSendTx,
      handleCancel,
      t,
      ethers,
      accountInfo,
      toogleAcceptCode,
      toSend,
      toSwap,
      handleView,
      handleClose,
      showTransactionModal,
      reloading,
      transactionData,
      decimal,
      currentNetwork,
      transactionList,
      loading,
      pageData,
      VUE_APP_SCAN_URL,
      toScan,
      txList,
    };
  },
};
</script>
<style lang="scss" scoped>
.scroller {
  overflow-y: scroll;
  flex: auto 1 1;
}

:deep() {
  .van-skeleton__avatar--round {
    margin-top: 12px;
  }
}

.tx-tit {
  height: 30px;
  color: #848484;
  background: #220a35;
}

.fixed-bottom {
  height: 20px;
  width: 220px;
  position: fixed;
  bottom: 10px;
  left: 50%;
  margin-left: -110px;

  &.fixed {
    padding: 3px 5px;
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    background: #150520;
  }
}

.view-history {
  color: #9F54BA;

  &:hover {
    text-decoration: underline;
  }
}

.loading-list-con {
  height: calc(100vh - 48px - 70px - 42px - 36px - 55px);
  overflow: hidden;
}

.loading-list-card {
  padding: 6px 0;
}

.sendBtnBox {
  button {
    min-width: 80px;
  }
}

.detail-modal {
  &>div {
    span:nth-of-type(1) {
      color: #8f8f8f;
    }
  }
}

:deep() {
  .van-dialog__footer {
    display: none;
  }
}

.detail-modal {
  border-radius: 5px;
}

.currency {
  .scan-link {
    color: #848484;

    span {
      margin-left: 3px;
      color: #9F54BA;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .currency-icon {
    width: 40px;
    height: 40px;

    .currency-symbol {
      width: 37.5px;
      // border-radius: 50%;
    }
  }

  &-icon {
    margin-top: 25px;
    width: 34px;
    height: 59px;
    border-radius: 50%;
    margin-bottom: 5px;
  }

  .amount {
    line-height: 42px;
    font-size: 24px;
    font-weight: 600;

    &.small {
      font-size: 16px;
    }

    &.big {
      font-size: 22px;
    }
  }

  .amount2 {
    color: #848484;
  }

  .actions-list {
    width: 50%;

    &-card {
      width: 60px;

      &-icon {
        height: 32px;
        width: 32px;
        background: #9F54BA;
        border-radius: 32px;
        transition: ease 0.3s;

        i {
          font-size: 18px;
        }

        &:hover {
          background: #9643b4;
        }
      }

      &-label {
        line-height: 16px;
        color: #9F54BA;
        font-size: 12px;
        margin-top: 7px;
      }
    }
  }

  .swap-list {

    border-top: 1px solid #e4e7e8;
  }
}

.iconfont {
  color: #fff;
}
</style>