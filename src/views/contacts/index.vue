<template>
  <van-sticky>
    <NavHeader :title="t('receive.contants')" >
      <template v-slot:left>
       <span class="back hover f-12" @click="back">{{t('createAccountpage.back')}}</span>
      </template>
    </NavHeader>
  </van-sticky>
  <div class="">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>
<script lang="ts">
import Vue, { computed, ref } from "vue";
import { Icon, Toast, Button, Sticky, Field } from "vant";
import NavHeader from "@/components/navHeader/index.vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

export default {
  name: "page-receive",
  components: {
    [Sticky.name]: Sticky,
    [Icon.name]: Icon,
    NavHeader,
  },
  setup() {
    const { t } = useI18n();
    const route: any = useRoute();
    const backUrl = ref(route.query.backUrl ? route.query.backUrl :'wallet')
    const router = useRouter()
    // Filter out pages that do not display on the right
    const filter = ["receive-choose-code", "receive-choose"];
    // The Cancel button on the right is displayed dynamically according to the route
    const hasRight = computed(() => {
      if (filter.includes(route.name || "")) {
        return true;
      }
      return false;
    });
    const back = () => {
      const {backUrl} = route.query
      if(backUrl){
        router.replace({name:backUrl})
        return
      }
      router.back()
    }
    // Click the return button to jump to the route name
    const { query } = useRoute()
    const { clickBackUrl } = query
    const replaceBackUrl = ref(clickBackUrl || '')

    return {
      replaceBackUrl,
      t,
      hasRight,
      back,
      backUrl,
      query
    };
  },
};
</script>
<style scoped lang="scss">
.back {
  color: #9F54BA;
  font-size: 12px;
}
.title {
      font-size: 16px;
  font-weight: bold;
}</style>