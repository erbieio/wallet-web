<template>
  <div class="createNftModal">
    <van-dialog v-model:show="showModal" teleport="#page-box" :showConfirmButton="false" :showCancelButton="false" closeOnClickOverlay :title="''">
      <div class="title text-center text-bold van-hairline--bottom">
        {{ t("sendNFT.sendNFT") }}
      </div>
      <div class="ml-12 mr-12 p-12 content mt-24">
        <div class="flex between">
          <div class="label">{{ t("transactionDetails.from") }}</div>
          <div class="value van-multi-ellipsis--l2" :title="tx.from">{{ addressMask(tx.from) }}</div>
        </div>
        <div class="flex between">
          <div class="label">{{ t("send.to") }}</div>
          <div class="value">{{ addressMask(tx.to) }}</div>
        </div>
        <div class="mt-10 pt-10 border-top"></div>
        <div class="flex between">
          <div class="label">{{ t("sendNft.nftAddr") }}</div>
          <div class="value">
            {{ addressMask(tx.nft_address) }}
          </div>
        </div>
        <!-- <div class="flex between">
            <div class="label">{{ t("send.gasfee") }}</div>
            <div class="value">
              {{  }}
            </div>
          </div>
          <div class="flex between">
            <div class="label">{{ t("castingnft.category") }}</div>
            <div class="value">
              {{ tx.category.label }}
            </div>
          </div> -->
        <div class="flex between">
          <div class="label">
            {{ t("transactiondetails.gasfee") }}
            <van-popover v-model:show="showPopover" theme="dark" placement="top">
              <div class="f-12 pl-10 pr-10 pt-10 pb-10" @click="showPopover = false">
                {{ t("common.gasFee") }}
              </div>
              <template #reference>
                <van-icon name="question hover" @mouseover="showPopover = true" @mouseout="showPopover = false" />
              </template>
            </van-popover>
          </div>
          <div class="value green">
            ≈ {{ gasFee }} {{ currentNetwork.currencySymbol }}
          </div>
        </div>
        <!--  <div class="flex between">
            <div class="label">{{ t("transactiondetails.totalAmount") }}</div>
            <div class="value">
              ≈ {{ totalAmount }} {{ currentNetwork.currencySymbol }}
            </div>
          </div> -->
      </div>
      <div class="flex between pb-30 pl-16 pr-16 mt-20 btn-box">
        <van-button @click="cencel">{{ t("sendto.cancel") }}</van-button>
        <van-button type="primary" :loading="nextLoading" :disabled="!finishCount ? true : false" @click="handleComfirm">{{ t("sendto.send") }}
          {{ !finishCount ? `(${current.seconds}S)` : "" }}</van-button>
      </div>
    </van-dialog>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
  watch,
  SetupContext,
  reactive,
  computed,
} from "vue";
import {
  Dialog,
  Button,
  Field,
  NumberKeyboard,
  Toast,
  Popover,
  Icon
} from "vant";
import { addressMask, decimal } from "@/utils/filters";
import { ethers, utils } from "ethers";
import { useI18n } from "vue-i18n";
import BigNumber from "bignumber.js";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useCountDown } from "@vant/use";
import { useTradeConfirm } from "@/plugins/tradeConfirmationsModal";
import { clone, getGasFee } from "@/store/modules/account";
import { TradeStatus } from "@/plugins/tradeConfirmationsModal/tradeConfirm";
import { useToast } from "@/plugins/toast";
import eventBus from "@/utils/bus";
import { encode, decode } from "js-base64";
import { web3 } from '@/utils/web3'
export default defineComponent({
  name: "sendNftModal",
  components: {
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    [Popover.name]: Popover,
    [Icon.name]: Icon
  }, emits: ["handleComfirm", "update:modelValue"],
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    tx: {
      type: Object,
      default: {

      }
    }
  },
  setup(props: any, context: SetupContext) {
    const { t } = useI18n();
    const { emit } = context
    const showModal: Ref<boolean> = ref(false);
    const store = useStore();
    const currentNetwork = computed(() => store.state.account.currentNetwork);
    const accountInfo = computed(() => store.state.account.accountInfo);
    const gasFee = ref("0");
    const { state } = store
    const calcFee = async () => {
      const { nft_address, to } = props.tx
      const d2 = { type: 1, nft_address, version: "v0.0.1" }
      const str = `erbie:${JSON.stringify(d2)}`;
      const data3 = web3.utils.fromUtf8(str);
      const myAddr = accountInfo.value.address
      const tx = {
        from: myAddr,
        to,
        data: data3,
        value: "0",
      };
      gasFee.value = await getGasFee(tx)
    }
    watch(
      () => props.modelValue,
      async (n) => {

        showModal.value = n;

        if (n) {
          calcFee()
          countDown.start();
        }
      },
      {
        immediate: true,
      }
    );

    watch(
      () => showModal.value,
      (n) => {
        if (!n) {
          emit("update:modelValue", false);
        }
      }
    );
    const showPopover = ref(false)
    const cencel = () => {
      emit("update:modelValue", false);
    }
    const nextLoading = ref(false)
    const handleComfirm = () => {
      emit("handleComfirm");
    }

    const finishCount = ref(false);
    const countDown = useCountDown({
      time: 4000,
      onFinish() {
        finishCount.value = true;
      },
    });
    return {
      cencel,
      nextLoading,
      handleComfirm,
      finishCount,
      countDown,
      t,
      showModal,
      addressMask,
      ethers,
      showPopover,
      currentNetwork,
      current: countDown.current,
      gasFee,
    }
  }
})

</script>
<style lang="scss" scoped>
.title {
  line-height: 62px;
  font-weight: bold;
  font-size: 14px;
  background: #220a35;
}


.btn-box {
  padding: 0 52px 20px;

  button {
    min-width: 100px;
  }
}

.content {
  border: 1px solid #e4e7e8;
  border-radius: 5px;

  .label {
    color: #8f8f8f;
    width: 30%;
  }

  .label,
  .value {
    line-height: 16px;
    padding: 6px 0;
    display: block;
  }

  .value {
    text-align: right;
  }
}
</style>