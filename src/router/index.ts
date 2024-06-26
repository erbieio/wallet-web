
import store from '@/store'
import NProgress from 'nprogress'

import { createRouter, createWebHashHistory, RouteRecordRaw, createWebHistory } from 'vue-router'
import Home from '../views/account/home.vue'
import { useLogin } from '@/components/navHeader/hooks/login';
import { getQuery } from '@/utils/utils'

import transferAccount from '@/views/transferAccounts/route'
import receive from '@/views/receive/route'
import tokens from '@/views/tokens/route'
import receiveAward from '@/views/receiveAward/route'
import contacts from '@/views/contacts/route'
import connectWallet from '@/views/connectWallet/route'
import { pwdKey } from '@/utils/jsCookie';
import doc from '@/views/doc/index'
import mnemonic from '@/views/mnemonic/route'
import createNft from '@/views/createNft/route'
import sendNft from '@/views/sendNft/route'
import generateNFT from '@/views/generateNFT/route'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Home,
    redirect: { name: 'home' },
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/account/wallet/index.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/transactionList',
        name: 'transactionList',
        component: () => import('@/views/account/transactionList/index.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/guidance',
        name: 'guidance',
        component: () => import('@/views/guidance/index.vue'),
        meta: {
          auth: false
        }
      },
      {
        path: '/step',
        name: 'step',
        component: () => import('@/views/guidance/step.vue'),
        meta: {
          auth: false
        }
      },
      {
        path: "/create-step",
        name: "create-step",
        component: () => import("@/views/guidance/createing.vue"),
        meta: {
          auth: false,
        },
      },
      {
        path: '/import',
        name: 'import',
        component: () => import('@/views/account/import/index.vue'),
        meta: {
          auth: true
        }
      },

      {
        path: "/export-mnemonic",
        name: "export-mnemonic",
        component: () => import("@/views/account/creatwallet/newwallet/mnemonic.vue"),
        meta: {
          auth: false,
        },
      },
      {
        path: "/import-mnemonic",
        name: "mnemonic-import",
        component: () => import("@/views/account/creatwallet/newwallet/mnemonic-import.vue"),
        meta: {
          auth: false,
        },
      },
      {
        path: '/newwallet',
        name: 'newwallet',
        component: () => import('@/views/account/creatwallet/newwallet/index1.vue'),
        meta: {
          auth: false
        }
      },
      {
        path: '/startpage',
        name: 'startpage',
        component: () => import('@/views/account/creatwallet/newwallet/startpage.vue'),
        meta: {
          auth: false
        }
      },
      {
        path: '/bourse',
        name: 'bourse',
        component: () => import('@/views/account/bourse/index.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/exchange-management',
        name: 'exchange-management',
        component: () => import('@/views/account/bourse/exchange-management.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/preposition-bourse',
        name: 'prepositionBourse',
        component: () => import('@/views/account/bourse/perosition-bourse.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/withpassword',
        name: 'withpassword',
        component: () => import('@/views/account/loginwithpassword/index.vue'),
        meta: {
          auth: false
        }
      },
      {
        path: '/inputpage',
        name: 'inputpage',
        component: () => import('@/views/account/privatekeyexport/inputpage.vue'),
        meta: {
          auth: false
        }
      },
      {
        path: '/successpage',
        name: 'successpage',
        component: () => import('@/views/account/privatekeyexport/successpage.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/createsuccessexchange',
        name: 'createsuccessexchange',
        component: () => import('@/views/account/createsuccess/index.vue'),
        meta: {
          auth: true
        }

      },
      {
        name:'sendContractTransaction',
        path:'/sendContractTransaction',
        component: () => import('@/views/sendContractTransaction/index.vue'),
        meta: {
          auth: true
        }
      },
      {
        name:'staker',
        path:'/staker',
        component: () => import('@/views/staker/staker.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/currency',
        name: 'currency',
        redirect: {
          name: 'currencyHome'
        },
        component: () => import('@/views/currency/index.vue'),
        children: [
          {
            path: '/currency/home',
            name: 'currencyHome',
            component: () => import('@/views/currency/home/index.vue'),
            meta: {
              auth: true
            }
          },
        ]
      },
      {
        path: '/sign',
        name: 'sign',
        component: () => import('@/views/sign/index.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/sendOpenExchangeTransaction',
        name: "sendOpenExchangeTransaction",
        component: () => import('@/views/sendOpenExchangeTransaction/index.vue'),
        meta: {
          auth: true,
        }
      },
      {
        path: '/exchangeSign',
        name: 'exchangeSign',
        component: () => import('@/views/exchangeSign/index.vue'),
        meta: {
          auth: true
        }
      },

      {
        path: '/sendTransaction',
        name: 'sendTransaction',
        component: () => import('@/views/exchangeTransaction/index.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('@/views/settings/index.vue'),
        redirect: { name: 'settingsHome' },
        children: [
          {
            path: '/settings/index',
            name: 'settingsHome',
            component: () => import('@/views/settings/home/index.vue'),
            meta: {
              auth: true
            }
          },
          {
            path: '/settings/networkList',
            name: 'networkList',
            component: () => import('@/views/settings/networkList/index.vue'),
            meta: {
              auth: true
            }
          },
          {
            path: '/settings/addNetwork',
            name: 'addNetwork',
            component: () => import('@/views/settings/addNetwork/index.vue'),
            meta: {
              auth: true
            }

          },

          {
            path: '/settings/language',
            name: 'language',
            component: () => import('@/views/settings/language/index.vue'),
            meta: {
              auth: true
            }
          },
          {
            path: "/settings/snft-creator",
            name: "snft-creator",
            component: () => import("@/views/settings/snftCreator/index.vue"),
            meta: {
              auth: true,
              tltle:'Snft Creator'
            },
          },

        ]
      },
      {
        path: '/miners-pledge',
        name: 'minersPledge',
        component: () => import('@/views/account/miners/index.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: '/miners-dealData',
        name: 'minersDeal',
        component: () => import('@/views/account/miners/deal.vue'),
        meta: {
          auth: true
        }
      },
      transferAccount,
      receive,
      tokens,
      receiveAward,
      contacts,
      connectWallet,
      mnemonic,
      doc,
      createNft,
      sendNft,
      generateNFT

    ]
  },


]

const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_NODE_ENV == 'test' || process.env.VUE_APP_NODE_ENV == 'production' ? '/wallet' : '/'),
  routes
})


router.beforeEach(async (to, form, next) => {
  NProgress.start();
  // @ts-ignore
  await store.restored;
  const localPwd = localStorage.getItem(pwdKey)
  // @ts-ignore
  if (!store.state.system.movePwd && localPwd) {
    const tokenObj = localPwd ? JSON.parse(localPwd) : null
    if (tokenObj) {
      store.commit('system/UPDATE_WALLET_TOKEN', tokenObj)
      store.commit('system/UPDATE_MOVEPWD', true)
      localStorage.removeItem(pwdKey)
    }
  }
  const { name, meta } = to
  const { auth } = meta
  const { authentication, hasAccount } = useLogin()
  const hasAccountFlag = await hasAccount()
  const authFlag = authentication()
  const query = getQuery()
  if (!auth && (name == 'termsOfUse' || name == 'privacyNotice' || name == 'inputpage')) {
    next()
    return
  }

  if (auth) {
    if (hasAccountFlag && authFlag) {
      next()
      return
    } else {
      next({
        name: 'withpassword',
        query
      })
      return
    }
  } else {
    if (!hasAccountFlag && name == 'withpassword') {
      next({
        name: "guidance"
      })
      return
    }
    // Having an account is not a login page without a login password
    if (hasAccountFlag && name !== 'withpassword' && !authFlag && name != 'sign') {
      next({ name: 'withpassword', query })
      return
    } else {
      if (name == 'sign' || name == 'minersPledge' || name === 'minersDeal' || name == 'send' || name == 'receive-award-home') {
        next()
        return
      }

      const arr = ['withpassword', 'guidance']
      // There's a login password. There's an account
      // @ts-ignore
      if (hasAccountFlag && authFlag && arr.includes(name?.toString()) && name != 'home') {
        next({ name: 'home' })
        return
      } else {
        next()
        return
      }
    }
  }
})

router.afterEach((to) => {
  NProgress.done()
})


export default router
