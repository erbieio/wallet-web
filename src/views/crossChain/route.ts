export default {
    path: '/crossChain',
    name: 'crossChain',
    component: () => import('@/views/crossChain/index.vue'),
    redirect: { name: 'crossChainHome' },
    children: [
      {
        path: '/crossChain/index',
        name: 'crossChainHome',
        component: () => import('@/views/crossChain/home/index.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/crossChain/trading',
        name: 'crossChainTrading',
        component: () => import('@/views/crossChain/trading/index.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/crossChain/tradingSend',
        name: 'crossChainTradingSend',
        component: () => import('@/views/crossChain/tradingSend/index.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/crossChain/contractTradingGasFee',
        name: 'contractTradingGasFee',
        component: () => import('@/views/crossChain/contractTradingGasFee/index.vue'),
        meta: {
          auth: true
        }
      },
    ]
  }