<template>
  <div v-if="showModal" class="custom-popover">
    <div class="custom-popover-header">
      <div class="container" style="height: 100%;">
        <div class="footer-btns">
          <div class="container pl-20 pr-20 evenly flex">
            <span @click="dispatchClose">{{ t('common.cancel') }}</span>
            <span @click="handleClick(2)">{{ t('common.next') }} 2/5</span>
          </div>
        </div>
        <div class="footer-text">
          <div>
            {{ t('guidePopup.tip2') }}
          </div>
        </div>
      </div>
    </div>
    <div class="custom-popover-container"></div>
    <div class="custom-popover-footer">


    </div>
  </div>
  <dialog-warning @warningSuccess="warningSuccess" theme="light" @close="handleClose" :text="t('common.confirmExit')" v-model:isWarning="isWarning"></dialog-warning>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch, SetupContext, computed } from "vue";
import { Popover, Dialog, Button } from "vant";
import WormTransition from "@/components/wromTransition/index.vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import dialogWarning from '@/components/dialogWarning/indexAffirm.vue'
import eventBus from "@/utils/bus";
export default defineComponent({
  name: 'guide-modal2',
  components: {
    [Popover.name]: Popover,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    WormTransition,
    'dialog-warning': dialogWarning
  },
  props: {
    type: {
      type: Number,
      default: 2,
    },
  },
  setup(props: any, context: SetupContext) {
    const { t } = useI18n()
    const { state, dispatch } = useStore();
    const showModal = ref(false);
    const show2 = computed(() => state.system.show2);
    watch(
      () => show2,
      (n) => {
        if (n.value) {
          let time = setTimeout(() => {
            eventBus.emit('guideSnftModal', 0)
            clearTimeout(time)
          }, 500)
        }
        showModal.value = n.value
      },
      { immediate: true, deep: true }
    );

    const handleClick = (v: number) => {
      dispatch("system/showDialog", v);
    };
    const warningSuccess = () => {
      dispatch('system/closeGuide')
      showModal.value = false
      isWarning.value = false
    }
    const beforeClose = async () => {
      const flag = await Dialog.confirm({
        message: t('bootstrapwindow.unboot'),
        className: "closeGuideModal",

      })
        .then(() => true)
        .catch(() => false);
      if (flag) {
        dispatch('system/closeGuide')
        showModal.value = false
      }
    };
    const isWarning = ref(false)
    const dispatchClose = () => {
      isWarning.value = true
      showModal.value = false
    }
    const handleClose = () => {
      showModal.value = true
    }
    return {
      t,
      // show2,
      handleClose,
      handleClick,
      showModal,
      beforeClose,
      dispatchClose,
      warningSuccess,
      isWarning
    };
  },
});
</script>
<style lang="scss" scoped>
.custom-popover {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100000;
}

.custom-popover-header {
  height: 290px;
  background-color: rgba(0, 0, 0, .7);
  position: relative;
}

.custom-popover-container {
  height: 245px;
}

.custom-popover-footer {

  height: calc(100vh - 290px - 245px);
  background-color: rgba(0, 0, 0, .7);
}

.footer-text {
  position: absolute;
  font-size: 12px;
  color: #fff;
  bottom: 82px;
  left: 110px;
  width: 100px;

  div {
    display: inline-block;
    /* transform: translateX(-50%); */

    &:before {
      content: "";
      position: absolute;
      bottom: -42px;
      left: -20px;
      width: 75px;
      display: inline-block;
      z-index: 999999;
      transform: rotate(90deg);
      border-top: 1px dashed #9F54BA;
    }

    &:after {
      content: "";
      position: absolute;
      bottom: -5px;
      left: 14.8px;
      width: 6px;
      height: 6px;
      background-color: #9F54BA;
      border-radius: 50%;
      display: inline-block;
      z-index: 999999;
    }
  }
}

.footer-btns {
  width: 100%;
  padding-top: 100px;

  div {
    span {
      cursor: pointer;
      display: inline-block;
      width: 100px;
      height: 45px;
      font-size: 12px;
      cursor: pointer;

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

.dialog-box {
  // width: 340px;
  padding-bottom: 25px;

  .serial-number {
    display: flex;
    justify-content: flex-end;
    text-indent: 10px;
    padding-bottom: 14px;
    padding-right: 14px;
    font-size: 12px;
    font-size: 12px;

    .left {
      color: #9F54BA;
    }
  }

  .title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    line-height: 30px;
    margin-top: 44px;
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

@media screen and (max-width: 750px) {
  .footer-text {
    left: 45px;
  }

  .custom-popover-header {
    height: 310px;
  }
}
</style>