<template>
  <div class="crossChainTrading">
    <div class="page-container">
      <router-view v-slot="{ Component }">
        <keep-alive :include="['crossChainTradingSend']">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Icon, Toast, Button, Sticky, Field } from "vant";
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n'
export default {
  name: "settings",
  components: {
    [Sticky.name]: Sticky,
    [Icon.name]: Icon,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()
    return {
      route,
      t
    }
  },
};
</script>
<style lang="scss" scoped>
.crossChainTrading {
  .cancel {
    font-size: 12px;
    color: #9F54BA;

    i {
      font-size: 20px;
    }
  }

  .title {
    font-size: 17px;
  }
}
</style>