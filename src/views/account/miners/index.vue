<template>
  <div class="bourse">
    <NavHeader :title="t('minerspledge.beValidator')" :hasRight="false">
      <template v-slot:left>
        <span class="back" @click="appProvide.back">{{
      t("common.back")
    }}</span>
      </template>
    </NavHeader>
    <div class="bourse-container-error pt-12 pb-12">
      <van-icon name="warning" color="#9F54BA" />
      <span class="lh-16">{{ t("minerspledge.tip1") }}</span>
    </div>
    <van-cell-group :border="false">
      <van-cell :title="t('minerspledge.stacking')" v-if="isMiner" :label="t('minerspledge.erb_snft')" is-link @click="toCms">
      </van-cell>
      <van-cell @click="toExchange" :title="t('minerspledge.beValidator')" :label="t('minerspledge.tip2')" is-link />
    </van-cell-group>
    <SwitchNetwork v-model:show="showModalNetwork" @close="showModalNetwork = false" />
    <close-dialog @warningSuccess="warningSuccess" v-model:isWarning="isCloseDialog" v-if="isCloseDialog"></close-dialog>
  </div>
</template>

<script lang="ts">
import { useI18n } from "vue-i18n";
import {
  defineComponent,
  Ref,
  ref,
  watch,
  SetupContext,
  computed,
  toRaw,
  onMounted,
  ComputedRef,
  nextTick,
  onBeforeMount,
  inject,
} from "vue";
import dialogWarning from "@/components/dialogWarning/index.vue";
import useClipboard from "vue-clipboard3";
import { useRouter, useRoute } from "vue-router";
import { useStore, mapState } from "vuex";
import { useNetWork } from "@/components/navHeader/hooks/netWork";
import {
  Dialog,
  Form,
  Cell,
  Field,
  CellGroup,
  Button,
  Popup,
  Circle,
  Icon,
  Toast,
  Slider,
  Checkbox,
} from "vant";
import eventBus from "@/utils/bus";
import SwitchNetwork from "@/components/switchNetwork/index.vue";
import { RegUrl, RegNum1 } from "@/enum/regexp";
import closeDialog from "./close-dialog.vue";
import NavHeader from "@/components/navHeader/index.vue";
import { getWallet } from "@/store/modules/account";
import { useToast } from "@/plugins/toast";
import {
  VUE_APP_EXCHANGESMANAGEMENT_URL,
  VUE_APP_EXCHANGES_URL,
} from "@/enum/env";
import { AppProvide } from "@/provides/app";
export default defineComponent({
  components: {
    "dialog-warning": dialogWarning,
    SwitchNetwork,
    [Icon.name]: Icon,
    [Button.name]: Button,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    "close-dialog": closeDialog,
    NavHeader,
  },
  setup(props: any, context: SetupContext) {
    const appProvide = inject("appProvide");
    const router = useRouter();
    const store = useStore();
    const { dispatch, commit, state } = store;
    const networkTypeValue = computed(() => store.state.account.networkType);
    const {
      netWorkList,
      currentNetwork,
      showModalNetwork,
      chooseNetWork,
      handleChoose,
      handleChooseComfirm,
    } = useNetWork();
    const goHome = () => {
      router.push({
        path: "/wallet",
      });
    };
    const { t } = useI18n();
    const { toClipboard } = useClipboard();
    const exchangeUrl = computed(() => {
      const add = store.state.account.accountInfo.address;
      return `${VUE_APP_EXCHANGES_URL}/c${add.toLowerCase()}/#/`;
    });
    const adminUrl = computed(() => {
      const add = store.state.account.accountInfo.address;
      return `${VUE_APP_EXCHANGESMANAGEMENT_URL}?address=${add.toLowerCase()}&exchangeAddress=${add.toLowerCase()}`;
    });

    const chainAccountInfo = computed(() => state.account.chainAccountInfo);
    const isMiner = computed(() => {
      return chainAccountInfo.value.PledgedBalance > 0;
    });
    const toGoCMS = () => {
      window.open(`${exchangeUrl.value}`);
    };
    const toExchange = () => {
      router.push({
        name: "minersDeal",
      });
    };
    const pledgeIncome = ref(false);
    const toCms = () => {
      isCloseDialog.value = true;
    };
    nextTick(() => {
      if (!store.state.account.exchangeGuidance) {
        showModal.value = true;
        commit("account/UPDATE_EXCHANGEGUIDANCE", true);
      }
    });
    const { $wtoast } = useToast();
    const warningSuccess = () => {
      $wtoast.success(t("minerspledge.toggleSuccess"));
    };

    const showModal = ref(false);
    const toCopyCMS = async () => {
      try {
        await toClipboard(`${exchangeUrl.value}`);
        Toast.success(t("copy.copy"));
      } catch (e) {
        console.error(e);
      }
    };
    const isCloseDialog = ref(false);
    const toGoAmount = () => {
      window.open(`${adminUrl.value}`);
    };
    const toCopyAmount = async () => {
      try {
        await toClipboard(`${adminUrl.value}`);
        Toast.success(t("copy.copy"));
      } catch (e) {
        console.error(e);
      }
    };

    onMounted(() => {
      dispatch("account/getChainAccountInfo");
    });

    return {
      toCopyAmount,
      toCopyCMS,
      toGoAmount,
      pledgeIncome,
      toCms,
      showModal,
      isMiner,
      toGoCMS,
      warningSuccess,
      goHome,
      chainAccountInfo,
      netWorkList,
      toExchange,
      currentNetwork,
      showModalNetwork,
      chooseNetWork,
      isCloseDialog,
      handleChoose,
      handleChooseComfirm,
      networkTypeValue,
      appProvide,
      t,
    };
  },
});
</script>

<style lang="scss" scoped>
.bourse {
  height: 100%;

  .bourse-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 48px;
    padding: 0 16px;
    background: #150520;
    box-sizing: border-box;
    box-shadow: 0 1px 2px rgb(135 134 134 / 10%);
  }

  .bourse-container {
    padding: 23px 15px 25px 15px;
    font-size: 14px;

    .bourse-container-w {
      height: 160px;
      border: 1px solid #e4e7e8;
      padding: 0 17.5px;

      .da {
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        &:first-child {
          border-bottom: 1px solid #e4e7e8;
        }
      }
    }

    .da-c {
      display: flex;
      align-items: center;

      span {
        margin: 0 35.5px 0 10px;
      }
    }

    .da-img {
      width: 20px;
      height: 20px;
      margin-top: -4px;
    }

    .right {
      padding-left: 15px;
      border-left: 1px solid #e4e7e8;

      img {
        width: 14px;
        height: 14px;
      }
    }
  }

  .bourse-container-meaning {
    margin-top: 15px;
    padding-top: 15px;
  }

  .bourse-container-pull {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .hundred {
      color: #3aae55;
      font-size: 18px;
      line-height: 30px;
    }
  }

  .bourse-container-slider {
    margin: 33.5px 0;
  }

  .bourse-container-server {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;

    div {
      width: 310px;
      height: 85px;
      display: flex;
      margin-left: 15px;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      background: #220a35;
      border-radius: 7.5px;
      box-sizing: border-box;
    }

    .active {
      border: 1px solid #9F54BA;

      span {
        color: #9F54BA;
      }
    }

    .t1 {
      font-size: 12px;
      color: #848484;
      line-height: 20px;
    }

    .t2 {
      font-size: 12px;
      font-weight: bold;
      line-height: 20px;
    }
  }

  .bourse-container-server-b {
    div {
      background-color: #f1f3f4 !important;
    }

    .active-d {
      border: 1px solid #ccc;
    }
  }

  .bourse-container-btns {
    width: calc(100% - 30px);
    position: absolute;
    bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .b1 {
      width: 160px;
    }
  }

  .bourse-container-error {
    margin: 0 15px 25px 15px;
    background: #220a35;
    border-radius: 7.5px;
    display: flex;
    align-items: center;
    padding: 0 15px;

    span {
      margin-left: 10px;
      font-size: 12px;
    }
  }

  .t1 {
    font-size: 14px;
    color: #9F54BA;
  }

  .t3 {
    font-size: 18px;
    font-weight: bold;
    line-height: 40px;
  }

  .t2 {
    font-size: 16px;
  }

  .right-img {
    width: 18px;
    height: 18px;
    margin-top: -2px;
  }

  .create-new-password {
    margin-top: 13.5px;

    .tit-small {
      color: #848484;
    }

    .right {
      color: #9F54BA;
      text-decoration: underline;
    }

    .icon-yanjing {
      color: #9F54BA;
    }

    :deep(.van-field__label) {
      display: none;
    }

    :deep(.van-field__error-message) {
      margin-bottom: 0px;
    }

    :deep(.van-cell:after) {
      display: none;
    }

    :deep(.van-cell) {
      padding: 0;
    }

    :deep(.van-field__body) {
      margin-bottom: 10px;

      &:hover {
        border: 1px solid #9F54BA;
      }
    }

    .error-field {
      :deep(.van-field__body) {
        border: 1px solid #d73a49 !important;
      }
    }

    .success-field {
      :deep(.van-field__body) {
        border: 1px solid #9F54BA !important;
      }
    }

    .tool {
      color: #9F54BA;
    }

    .pointer {
      cursor: pointer;
    }

    .check-box {
      margin-top: 30px;
    }
  }
}

.bt {
  border-top: 1px solid #e4e7e8;
}

.bourse-img {
  height: 135px;
  background-color: #F8F3F9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .exchange-welcome-icon {
    height: 35px;
    width: 35px;
  }

  .d1 {
    margin: 10px 0;
    font-size: 15px;
  }

  .d2 {
    font-size: 12px;
    color: #848484;
  }
}

.bourse-container-error,
.bourse-container-warning {
  height: 72px;
  background: transparent;
  border-radius: 7.5px;
  margin-top: 15px !important;
  display: flex;
  align-items: center;
  padding: 0 15px;
  margin-bottom: 36.5px;

  span {
    margin-left: 10px;
    font-size: 12px;
  }
}

.btns-footer {
  position: fixed;
  bottom: 25px;
  width: 100%;
  max-width: 750px;
}
</style>

<style lang="scss" scoped>
.custom-popover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 10;
}

.custom-popover-header {
  height: 202px;
  background-color: rgba(0, 0, 0, 0.3);

  .footer-text1 {
    position: absolute;
    font-size: 12px;
    color: #fff;
    top: 130px;
    left: 15px;

    div {
      &:before {
        content: "";
        position: absolute;
        top: 50px;
        left: 85px;
        width: 76px;
        display: inline-block;
        z-index: 999999;
        transform: rotate(90deg);
        border-top: 1px dotted #9F54BA;
      }

      &:after {
        content: "";
        position: absolute;
        top: 10px;
        left: 120.5px;
        width: 4px;
        height: 4px;
        background-color: #9F54BA;
        border-radius: 50%;
        display: inline-block;
        z-index: 999999;
      }
    }
  }
}

.custom-popover-container {
  height: 170px;
}

.custom-popover-footer {
  position: relative;
  height: calc(100% - 372px);
  z-index: 11;
  background-color: rgba(0, 0, 0, 0.6);
}

.footer-btns {
  position: absolute;
  bottom: 30px;
  left: 50%;
  width: 100%;

  div {
    display: inline-block;
    transform: translateX(-50%);

    span {
      display: inline-block;
      width: 100px;
      height: 45px;
      font-size: 12px;
      border-radius: 50px;
      text-align: center;
      line-height: 45px;
      color: #fff;
      box-sizing: border-box;

      &:first-child {
        border: 1px solid #fff;
        margin-right: 40px;
      }

      &:last-child {
        background-color: #9F54BA;
      }
    }
  }
}

.footer-text {
  position: absolute;
  font-size: 12px;
  color: #fff;
  top: 63px;
  right: 15px;

  div {
    &:before {
      content: "";
      position: absolute;
      top: -44px;
      left: 85px;
      width: 76px;
      display: inline-block;
      z-index: 999999;
      transform: rotate(90deg);
      border-top: 1px dotted #9F54BA;
    }

    &:after {
      content: "";
      position: absolute;
      top: -8px;
      left: 121.5px;
      width: 4px;
      height: 4px;
      background-color: #9F54BA;
      border-radius: 50%;
      display: inline-block;
      z-index: 999999;
    }
  }
}

.dialog-box {
  // max-width: 340px;
  padding-bottom: 25px;
  position: relative;

  .serial-number {
    display: flex;
    justify-content: flex-end;
    text-indent: 10px;
    padding-bottom: 14px;
    padding-right: 14px;
    font-size: 12px;

    .left {
      color: #9F54BA;
    }
  }

  .tip2 {
    position: absolute;
    bottom: -100px;
    color: #fff;
  }

  .title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    line-height: 30px;
  }

  .small-tit {
    text-align: center;
    margin-bottom: 50px;
    font-size: 12px;
    color: #848484;
  }

  :deep {
    button {
      min-width: 100px;
    }
  }

  :deep(.van-popover__wrapper) {
    height: 0;
  }
}

:deep(.van-cell__right-icon) {
  margin-top: 11px;
}
</style>
