<template>
  <van-sticky offset-top="91">
    <div class="flex between center-v create-box">
      <span class="f-12 text-bold label">
        <span class="flex center">{{ sortVal.text }}
        </span>
      </span>

    </div>
  </van-sticky>
  <van-list v-if="layoutType == 'list'" v-model:loading="loadNft" :finished="finished" @load="handleOnLoad" v-model:error="nftErr">

    <div :class="`nft-list ${layoutType}`">
      <AiNftCard v-for="item in pageData.nftList" :key="item.nft_address" :data="item" />
    </div>
  </van-list>

  <div v-else :class="`list-box ${pageData.nftList.length ? 'pt-20 hasLen' : ''}`">
    <masonry-infinite-grid :column="2" @request-append="handleOnLoad">
      <div class="nftCard-card" v-for="item in pageData.nftList" :key="item.nft_address" :data-grid-groupkey="item.nft_address">
        <AiNftCard :data="item" />
      </div>
    </masonry-infinite-grid>
    <div class="flex center pt-20" v-show="loadNft">
      <van-loading size="16px">{{ t('common.loading') }}</van-loading>
    </div>
  </div>


  <div class="no-list" v-show="!pageData.nftList.length && !nftErr && finished">
    <NoData />
  </div>
  <!-- <SliderBottom :finished="finished">
    <div class="text-center tip1">
      {{ t("wallet.notoken", { type: "NFT" }) }}
      <span class="toCreate hover mr-4" @click="toCreate">{{
        sortVal.text
      }}</span>
      <span class="tip2 disabled">{{ t("createNft.findMore") }}</span>
    </div>
  </SliderBottom> -->

  <!-- error -->
  <div class="err-nft p-20" v-if="nftErr">
    <div class="text-center mt-20 mb-20 f-14">
      {{ t("createNft.pullagain") }}
    </div>
    <div class="flex center">
      <van-button @click="reLoading">{{ t("createNft.retry") }}</van-button>
    </div>
  </div>
</template>

<script lang="ts">
import AiNftCard from "./aiNftCard.vue";
import {
  getDrawInfoByUser,
  GetDrawInfoParams,
  getDrawInfoByNftaddrs,
  getOwnerNftList,
} from "@/http/modules/nft";
import eventBus from "@/utils/bus";
import NoData from "@/components/noData/index.vue";
import { web3 } from "@/utils/web3";
import {
  computed,
  ref,
  watch,
  reactive,
  Ref,
  defineComponent,
  SetupContext,
  onUnmounted,
  onMounted
} from "vue";
import { useStore } from "vuex";
import { List, Toast, Button, PullRefresh, Sticky, Icon, Popover, Loading } from "vant";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "@/plugins/toast";
import { decode } from "js-base64";
import SliderBottom from "@/components/sliderBottom/index.vue";
import { MasonryInfiniteGrid } from "@egjs/vue3-infinitegrid";
export default defineComponent({
  name: "nft-list",
  components: {
    AiNftCard,
    [List.name]: List,
    [Button.name]: Button,
    [PullRefresh.name]: PullRefresh,
    [Sticky.name]: Sticky,
    [Loading.name]: Loading,
    [Icon.name]: Icon,
    [Popover.name]: Popover,
    NoData,
    SliderBottom,
    MasonryInfiniteGrid,
  },
  emits: ["onLoad"],
  setup(props: any, context: SetupContext) {
    const store = useStore();
    const { t } = useI18n();
    const router = useRouter();
    const layoutType = computed(() => store.state.system.layoutType);
    const accountInfo = computed(() => store.state.account.accountInfo);
    const pageData: any = reactive({ nftList: [] });
    const { $wtoast } = useToast();
    // nft load
    const loadNft: Ref<boolean> = ref(false);
    const finished: Ref<boolean> = ref(false);
    const nftErr: Ref<boolean> = ref(false);
    let params = {
      owner: accountInfo.value.address.toLowerCase(),
      page: "0",
      page_size: "8"
    };
    let aiparams = {
      useraddr: accountInfo.value.address,
      index: "-8",
      count: "8",
    };

    const getAiNftList = async (newAiparams: GetDrawInfoParams) => {
      const { data } = await getDrawInfoByUser(newAiparams).finally(
        () => (loadNft.value = false)
      );

      if (data && data.length) {
        data.forEach((item: any) => {
          const param = JSON.parse(item.Drawparams);
          item["prompt"] = param.prompt;
          item["randomNumber"] = param.randomNumber;
        });
        pageData.nftList.push(...data);
      }
      return Promise.resolve(data);
    };

    // Get user NFT
    const getNftList = async (params: any) => {
      // Get user NFT Gets the NFT list of the current account
      try {
        const { nfts, total }: any = await getOwnerNftList(params);
        const nftaddrs = nfts.map((item: any) => item.address);
        const drawList = await getDrawInfoByNftaddrs({
          nftaddrs: JSON.stringify(nftaddrs),
        });
        const nowTime = new Date().getTime()
        const darwedList =
          drawList.data && drawList.data.length
            ? drawList.data.map((item: any) => {
              const { drawtime } = item;
              const isOverTime = (nowTime - (drawtime * 1000)) < 600000 ? false : true
              return {
                ...item,
                progress: isOverTime
              }
            })
            : [];
        console.log('darwedList', darwedList)
        // @ts-ignore
        if (nfts && nfts.length) {
          nfts.forEach((item: any) => {
            try {
              // three category nft
              // 1: normal  value = 0
              // 2: ai drawed value = 1
              // 3: ai not draw value = 2
              // 4: ai is drawing value = 4
              const pa = JSON.parse(web3.utils.toUtf8(item.meta_url));
              const current = darwedList.find(child => item.address.toUpperCase() == child.nft_address.toUpperCase())
              if (current) {
                if (current.drawfee && current.drawed) {
                  item.category = 1;
                } else {
                  if (!current.progress && current.drawtime) {
                    item.category = 4;
                  } else {
                    item.category = 2;
                  }
                }
                item.progress = current.progress;
              } else {
                if (pa.meta_url) {
                  item.category = 0;
                } else {
                  item.category = 2;
                }
              }
              item.meta_url = pa.meta_url;
              item.prompt = pa.meta_url;
              item.randomNumber = pa.randomNumber;
              item.info = JSON.stringify(pa);
            } catch (err) {
              console.error('-------------err', err);
              item.info = {};
            }
          });
          console.warn('nfts', nfts)
          // @ts-ignore
          pageData.nftList.push(...nfts);
        }
        return Promise.resolve(nfts);
      } catch (err) {
      } finally {
        loadNft.value = false;
      }
    };
    // List loading event
    const handleOnLoad = async () => {
      if (layoutType.value == 'card') {
        if (loadNft.value || finished.value) {
          return
        }
        loadNft.value = true;
      }
      try {
        params.page = Number(params.page) + 1 + "";
        const list = await getNftList(params);
        if (!list || !list.length) {
          finished.value = true;
        }
      } catch (err) {
        nftErr.value = true;
        Toast(JSON.stringify(err));
      }
    };

    // Error, retry
    const reLoading = () => {
      nftErr.value = false;
      finished.value = false;
      params.page = "0";
      aiparams.index = "-8";
      pageData.nftList = [];

      handleOnLoad();
    };

    onUnmounted(() => {
      eventBus.off("changeAccount")
    })
    // Update the current collectibles list each time you switch accounts
    onMounted(() => {
      eventBus.on("changeAccount", (address) => {
        params.owner = address;
        reLoading();
      });
    })
    const toCreate = () => {
      if (Number(accountInfo.value.amount) == 0) {
        $wtoast.warn(t("wallet.haveNoMoney"));
        return false;
      }
      router.push({ name: "generateNFT" });
    };

    // The drop-down load
    const onRefresh = () => {
      reLoading();
    };

    const showPopover = ref(false);
    const sortVal = reactive({
      text: t("castingnft.createNFT"),
      value: 0,
    });
    const actions = [
      { text: t("castingnft.createNFT"), value: 0, className: "hoverMenuItem" },
      { text: t("generateNFT.title"), value: 1, className: "hoverMenuItem" },
    ];
    const onSelect = ({ text, value }: any) => {
      sortVal.text = text;
      sortVal.value = value;
      reLoading();
    };

    return {
      sortVal,
      onSelect,
      actions,
      showPopover,
      toCreate,
      layoutType,
      handleOnLoad,
      pageData,
      nftErr,
      finished,
      loadNft,
      reLoading,
      onRefresh,
      t,
    };
  },
});
</script>
<style lang="scss" scoped>
.list-box {
  &.hasLen {
    min-height: 50px;
  }

  padding-left: 15px;
  padding-right: 15px;
  overflow: hidden scroll;

  .nftCard-card {
    width: 48%;

  }
}

.icon-shangla {
  font-size: 18px;
}

.create-box {
  background: #220a35;
  height: 36px;
  padding: 0 15px;
  position: relative;

  .label {
    color: #848484;
  }

  .add {
    width: 36px;
    height: 18px;
    background: #9f54ba;
    border-radius: 9px;
    cursor: pointer;

    i {
      color: #fff;
      font-size: 14px;
    }
  }
}

.nft-list {
  &.card {
    padding: 15px;
    display: grid;
    grid-gap: 15px;
    grid-template-columns: repeat(2, 1fr);
  }
}

.tip1 {
  .toCreate {
    color: #9f54ba;
    font-size: 12px;

    &:hover {
      text-decoration: underline;
    }
  }
}

.tip2.disabled {
  color: #b3b3b3 !important;
}
</style>