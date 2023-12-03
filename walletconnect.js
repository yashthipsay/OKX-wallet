import { EthWallet } from "@okxweb3/coin-ethereum";
import { bip39, BigNumber } from "@okxweb3/crypto-lib";
import axios from "axios";
import { time } from "console";
import { cryptoJS } from "@okxweb3/crypto-lib";


//eth wallet
let wallet = new EthWallet();

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

// Generate signature
const secretKey = '1C4C64B13CAD90AF804F0DD36ECBD8DD';
const timestamp = new Date().toISOString();
const method = 'POST'; // or 'GET'
const requestPath = '/https://www.okx.com/api/v5/waas/wallet/create-wallet'; // replace with your actual request path




let signParams = {
    privateKey: derivePrivateKey, 
    data: {
        to: newAddress.address,
        value: new BigNumber(0),
        nonce: 5,
        gasPrice: new BigNumber(100 * 1000000000),
        gasLimit: new BigNumber(21000),
        chainId: 42
    }
};

    let signedTx = await wallet.signTransaction(signParams);
   

    const createWallet = async() => {
        const walletData = {
            addresses: {
                chainId: "1",
                address: JSON.stringify(newAddress.address),
            },
            addresses: {
                chainId: "137",
                address: JSON.stringify(newAddress.address),
            },
            addresses: {
                chainId: "314",
                address: JSON.stringify(newAddress.address),
            },
            walletId: JSON.stringify(derivePrivateKey),
        }

        const body = JSON.stringify(walletData); // replace with your actual request body

const prehash = timestamp + method + requestPath  + body;
const sign = cryptoJS.enc.Base64.stringify(cryptoJS.HmacSHA256(timestamp + 'POST' + '/api/v5/waas/wallet/create-wallet', secretKey))
console.log("generate signature:", sign);

        const res = await axios.post("https://www.okx.com/api/v5/waas/wallet/create-wallet", walletData,
       { headers: {
            'Content-Type': 'application/json',
            'OK-ACCESS-PROJECT': '3057ea6859eaec1933a7c950a0094f98',
            'OK-ACCESS-KEY': '41f1724a-3e0d-4264-bc94-e40fbf0cd638',
            'OK-ACCESS-SIGN': JSON.stringify(sign),
            'OK-ACCESS-PASSPHRASE': 'Blocklegend@123123',
            'OK-ACCESS-TIMESTAMP': timestamp,
        }}
        ).then((res) => {
            console.log(res.status);
        }).catch((err) => {
            console.log(err);
        });
    }

    createWallet();
