import { Toast } from 'vant';
import i18n from '@/language/index'
import store from '@/store';
import { Wallet, ethers } from 'ethers';
import { HDNode, mnemonicToEntropy } from 'ethers/lib/utils';

export interface DecryptPrivateKeyPraams {
    json: string;
    password: string;
  }

export const decryptPrivateKey = async(params: DecryptPrivateKeyPraams) => {
    const { json, password } = params;
    const w = await ethers.Wallet.fromEncryptedJson(JSON.stringify(json), password)
    return w.privateKey
  };
export interface EncryptPrivateKeyParams {
    //  The private key to be encrypted
    privateKey: string
    // The password used for encryption
    password: string
}
// Convert private key encryption to Keystore V3 standard format.
export const encryptPrivateKey = (params: EncryptPrivateKeyParams) => {
    const { privateKey, password } = params
    return new ethers.Wallet(privateKey).encrypt(password).then(keyStore => JSON.parse(keyStore));
}

export interface EncryptMnemonicParams {
    //  Mnemonic words to encrypt
    mnemonic: string
    // The password used for encryption
    password: string
    wallet: Wallet
}
// Encrypt mnemonics into keystores and store them
export const encryptMnemonic = async (params: EncryptMnemonicParams) => {
    try {
        const { mnemonic, password, wallet } = params
        const mneWallet = ethers.Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/0")
        const mnemonicData = await mneWallet.encrypt(password)
        store.commit('mnemonic/UPDATE_MNEMONIC', mnemonicData)
        } catch (err) {
        console.error(err)
    }
}

// Unlock the mnemonic word and return
export const parseMnemonic = async (password: string, json: any): Promise<string> => {
    try {
      const w = await ethers.Wallet.fromEncryptedJson(JSON.stringify(json), password)
      return w.mnemonic.phrase
    } catch (err) {
      Toast(i18n.global.t("wallet.wrongpassword"));
      return Promise.reject(err);
    }
  };

