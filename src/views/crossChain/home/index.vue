<template>
    <NavHeader :title="t('sidebar.crossChainTrading')">
      <template v-slot:left>
        <span class="back" @click="appProvide.back">{{ t("common.back") }}</span>
      </template>
    </NavHeader>
    <div class="crossChain-index">
      <div
        class="clickActive settings-card flex between"
        @click="routerPush('name', 'crossChainTradingSend')"
      >
        <div>
          <div class="flex between title center-v">
            <div class="label">{{ t("sidebar.crossChainTrading") }}</div>
          </div>
        </div>
        <div class="icon flex center"><van-icon name="arrow" /></div>
      </div>
    </div>
  </template>
  <script lang="ts">
  import Vue, { inject, ref } from "vue";
  import { Icon, Toast, Button, Sticky, Field } from "vant";
  import { useRoute, useRouter } from "vue-router";
  import { useI18n } from "vue-i18n";
  import NavHeader from "@/components/navHeader/index.vue";
  import { useStore } from "vuex";
  
  export default {
    name: "CrossChainTrading",
    components: {
      [Icon.name]: Icon,
      [Button.name]: Button,
      NavHeader,
    },
    setup() {
      const { t } = useI18n();
      const appProvide:{back:() => void} = inject("appProvide");
      const route = useRoute();
      const router = useRouter();
      const { state } = useStore();
      const clickLeft = () => {};
      const routerPush = (type: string, value: string) => {
        router.push({ [type]: value });
      };

      return {
        t,
        clickLeft,
        routerPush,
        route,
        appProvide,
      };
    },
  };
  </script>
  <style lang="scss" scoped>
  .crossChain-index {
    .settings-card {
      padding: 20px 12px 20px 14px;
      transition: ease 0.3s;
      border-bottom: 1px solid #e6e6e6;
      &:hover {
        // background: rgb(244, 247, 250);
        color: #9F54BA;
        i,
        .desc,
        .label {
          color: #9F54BA;
        }
      }
      .title {
        .label {
          font-size: 15px;
          font-weight: bold;
          line-height: 21px;
        }
      }
      .desc {
        margin-top: 1px;
        font-size: 12px;
        color: #848484;
        line-height: 18px;
      }
    }
    .icon {
      font-size: 18px;
      color: rgb(138, 133, 133);
    }
  }
  </style>