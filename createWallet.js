import {v4 as uuidv4} from 'uuid';
import { bip39, BigNumber } from "@okxweb3/crypto-lib";
import axios from "axios";
import { time } from "console";
import { cryptoJS } from "@okxweb3/crypto-lib";
import { EthWallet } from '@okxweb3/coin-ethereum';
import fetch from 'node-fetch';

//eth wallet
let wallet = new EthWallet();

const walletId = uuidv4();
console.log(walletId);

// get menmonic
let mnemonic =  bip39.generateMnemonic();
// console.log("generate mnemonic:", mnemonic);

// get derived key
const hdPath = await wallet.getDerivedPath({ index: 0 });
let derivePrivateKey = await wallet.getDerivedPrivateKey({ mnemonic: mnemonic, hdPath: hdPath });
// console.log("generate derived private key:", derivePrivateKey, ",derived path: ", hdPath);

// get new address
let newAddress = await wallet.getNewAddress({ privateKey: derivePrivateKey });
// console.log("generate new address:", newAddress.address);

let valid = await wallet.validAddress({address: newAddress.address});
// console.log("valid address:", valid.isValid);


// Define your parameters
const addresses = [
    {
        "chainId": "1",
        "address": JSON.stringify(newAddress.address),
    },
    {
        "chainId": "137",
        "address": JSON.stringify(newAddress.address),
    },
    {
        "chainId": "314",
        "address": JSON.stringify(newAddress.address),
    }
  ];

  const getCreateWalletBody = {
    addresses: addresses,
    walletId: '13886e05-1265-4b79-8ac3-b7ab46211001',
  };

  const getCreateWalletData = async () => {
//     const apiRequestUrl = getRequestUrl(
//       "https://www.okx.com",
//       '/api/v5/waas/wallet/create-wallet',
//     );
    return fetch("https://www.okx.com/api/v5/waas/wallet/create-wallet", {
      method: 'post',
      headers: headersParams,
      body: JSON.stringify(getCreateWalletBody),
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  };

  const { data: createWalletData } = await getCreateWalletData();