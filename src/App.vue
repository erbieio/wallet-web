<template>
  <div class="page-box container" id="page-box">
    <div class="van-safe-area-top"></div>
    <div class="container" id="container">
      <router-view />
    </div>
    <div class="van-safe-area-bottom"></div>
  </div>
</template>
<script lang="ts">
import { useRouter } from "vue-router";
import {
  Ref,
  ref,
  watch,
  onBeforeMount,
  onActivated,
  onMounted,
  provide,
  nextTick,
} from "vue";
import { useStore, mapActions } from "vuex";
import { Button, Dialog, Loading, Toast } from "vant";
import { utils } from "ethers";

import { useExchanges } from "@/hooks/useExchanges";
import { useI18n } from "vue-i18n";
import { getWallet, NetStatus, getGasFee } from "./store/modules/account";
import { version } from "@/enum/version";
import { useBroadCast } from "@/utils/broadCast";
import { guid } from "@/utils/utils";
import { provide as appProvide } from "@/provides/app";
import localforage, { clear } from "localforage";
import eventBus from "./utils/bus";
import { useWallet } from './hooks/useWallet';
import { VUE_APP_NODE_URL, VUE_APP_NODE_NAME, VUE_APP_SCAN_URL } from "./enum/env";
import { asyncStoreFromLocal } from "./store";

export default {
  components: {
    [Button.name]: Button,
    [Loading.name]: Loading,
  },

  setup() {
    const { commit, dispatch, state } = useStore();
    const { t } = useI18n();
    const router = useRouter();
    let time: any = null;
    provide("appProvide", appProvide());
    const { initWallet } = useWallet()
    const waittxlist = () => {
      time = setTimeout(async () => {
        await dispatch("account/waitTxQueueResponse");
        clearTimeout(time);
      }, 3000);
    };
    onBeforeMount(async () => {

      localStorage.setItem('connect-wallet-url', location.href)
      sessionStorage.setItem('connect-wallet-url', location.href)
      commit("system/UPDATE_TRANSFERUSDRATE", 0.5);
      commit("account/UPDATE_NETSTATUS", NetStatus.pendding);
      commit("system/UPDATA_CONVERSATIONID", guid());

      waittxlist();
    });
    eventBus.on('walletReady', newwallet => {
      dispatch('system/getChainVersion', newwallet);
    })
    window.onload = async () => {
      let time2 = setTimeout(function () {
        commit("account/UPDATE_WORMHOLES_URL", {
          URL: VUE_APP_NODE_URL,
          browser: VUE_APP_SCAN_URL,
          label: VUE_APP_NODE_NAME
        });
        clearTimeout(time2);
      }, 2000);
      let time = setTimeout(() => {
        // @ts-ignore
        document.getElementById("loading-page-box").style.display = "none";
        // @ts-ignore
        document.getElementById("app").style.display = "block";
        clearTimeout(time);
      }, 400);
    };
    onMounted(() => {
      initWallet()
      const { handleUpdate, broad } = useBroadCast();
      broad.onmessage = (e: any) => {
        const { action, id } = e;
        if (e && action) {
          if (
            action == "wromHoles-update" &&
            id != state.system.conversationId
          ) {
            asyncStoreFromLocal()
          }
        }
      };
      dispatch("account/getContractAddress");
      dispatch("configuration/getConfiguration");

      (async function () {
        const vuex = localStorage.getItem("vuex");
        const mnemonic = localStorage.getItem("mnemonic");
        const hasMove = localStorage.getItem("hasMove");
        if (!hasMove && vuex && mnemonic) {
          router.replace({ name: "guidance" });
        }
      })();

      // move mnemonic to indexDB
      (function () {
        let time = setTimeout(async () => {
          const mnemonic = await localforage.getItem("mnemonic");
          if (!state.mnemonic.keyStore && mnemonic) {
            commit("mnemonic/UPDATE_MNEMONIC", mnemonic);
          }
          clearTimeout(time);
        }, 5000);
      })();
    });
    return {
      t,
    };
  },
};
</script>
<style lang="scss">
.page-container {
  min-height: calc(100vh - 48px);
  position: relative;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;

  }
}

:deep(.van-popup) {
  position: absolute;
}

.page-box {
  transition: transform 0.35s, opacity 0.35s;
  position: relative;
  margin: 0 auto;
  min-height: 100vh;
  background: radial-gradient(ellipse at center, #270d3b, #0d0316 55%, #0d0316);
  box-sizing: border-box;


  :deep(.van-toast) {
    word-break: keep-all !important;
  }

  &>.container>.loading-box {
    height: 100vh;
  }
}
</style>
