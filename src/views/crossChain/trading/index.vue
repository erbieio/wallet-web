<script lang="ts" setup>
import { ref, Ref, inject } from 'vue';
import { Button as VanButton, Field as VanField } from 'vant';
import NavHeader from "@/components/navHeader/index.vue";
import { useI18n } from 'vue-i18n';
import { getWallet } from '@/store/modules/account';
import abi from '@/assets/json/crossChainAbi.json'
import { ethers } from 'ethers';
import { getProvider } from '@/store/modules/account';
import { InjectionKey } from 'vue';
const { t } = useI18n();
const num1: Ref<number> = ref();
const num2: Ref<number> = ref();
const num3: Ref<number> = ref();
const addr: Ref<string> = ref();
const loading1: Ref<boolean> = ref(false);
const loading2: Ref<boolean> = ref(false);
const loading3: Ref<boolean> = ref(false);
const appProvide: {back:() => void} = inject("appProvide");

// 0x57937757bfed64fd3881d711068edc226e7e0ee4 erbie测试合约地址
// 0xfb6eed023fa9db380e8392c151ee96b22b4a55ff polygon测试合约地址
type ContractAddr = '0x57937757bfed64fd3881d711068edc226e7e0ee4' | '0xfb6eed023fa9db380e8392c151ee96b22b4a55ff';
const getContract = async (contractAddr: ContractAddr = '0x57937757bfed64fd3881d711068edc226e7e0ee4') => {
    const wallet = await getWallet();
    const contract = new ethers.Contract(
        contractAddr,
        abi,
        wallet.provider
    );
    const contractWithSigner = contract.connect(wallet);
    return contractWithSigner
}

const handleSend1 = async() => {
    try {
        loading1.value = true
        const contractInstance = await getContract()
        console.log('contractInstance', contractInstance)
        const data = await contractInstance.functions.deposit({
            value: ethers.utils.parseEther(num1.value.toString())
        })
        console.log('data1', data)
        const provider = await getProvider()
        const receipt = await provider.waitForTransaction(data.hash, null, 60000)
        console.log('receipt1', receipt)
    } finally {
        loading1.value = false
    }
}

const handleSend2 = async() => {
    try {
        loading2.value = true
        const contractInstance = await getContract()
        const data = await contractInstance.functions.withdraw(ethers.utils.parseEther(num2.value.toString()))
        console.log('data2', data)
        const provider = await getProvider()
        const receipt = await provider.waitForTransaction(data.hash, null, 60000)
        console.log('receipt2', receipt)
    } finally {
        loading2.value = false
    }
}

const handleSend3 = async() => {
    try {
        loading3.value = true
        const contractInstance = await getContract('0xfb6eed023fa9db380e8392c151ee96b22b4a55ff')
        console.log('contractInstance', contractInstance)
        const data = await contractInstance.functions.crossOut(addr.value, ethers.utils.parseEther(num3.value.toString()))
        console.log('data3', data)
        const provider = await getProvider()
        const receipt = await provider.waitForTransaction(data.hash, null, 60000)
        console.log('receipt3', receipt)
    } finally {
        loading3.value = false
    }
}
</script>
<template>
    <div class="trading">
        <NavHeader :title="t('sidebar.crossChainTrading')">
            <template v-slot:left>
                <span class="back" @click="appProvide.back">{{ t("common.back") }}</span>
            </template>
        </NavHeader>
        <div class="trading-page">
            <div class="trading-card">
                转账到合约
                <div class="flex center">
                    <van-field v-model="num1" type="number" label="转账金额" />
                </div>
                <div class="flex center"><van-button size="small" type="primary" :loading="loading1" @click="handleSend1">合约存款</van-button></div>
            </div>
            <div class="trading-card">
                从合约转回
                <div class="flex center">
                    <van-field v-model="num2" type="number" label="转账金额" />
                </div>
                <div class="flex center"><van-button size="small" type="primary" :loading="loading2" @click="handleSend2">存款取款</van-button></div>
            </div>
            <div class="trading-card">
                跨链交易
                <div class="flex center">
                    <van-field v-model="num3" type="number" label="转账金额" />
                    <van-field v-model="addr" type="text" label="目标地址" />
                </div>
                <div class="flex center"><van-button size="small" type="primary" :loading="loading3" @click="handleSend3">转账</van-button></div>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.trading {
    min-height: calc(100vh - 48PX);
    &-card {
        padding: 20px;
    }
}
</style>