import { EthWallet } from "@okxweb3/coin-ethereum";
import { bip39, BigNumber } from "@okxweb3/crypto-lib";
import axios from "axios";

//eth wallet
let wallet = new EthWallet();

// get menmonic
let mnemonic = await bip39.generateMnemonic();
console.log("generate mnemonic:", mnemonic);

// get derived key
const hdPath = await wallet.getDerivedPath({ index: 0 });
let derivePrivateKey = await wallet.getDerivedPrivateKey({ mnemonic: mnemonic, hdPath: hdPath });
console.log("generate derived private key:", derivePrivateKey, ",derived path: ", hdPath);

// get new address
let newAddress = await wallet.getNewAddress({ privateKey: derivePrivateKey });
console.log("generate new address:", newAddress.address);

let valid = await wallet.validAddress({address: newAddress.address});
console.log("valid address:", valid.isValid);


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
    console.log("signed tx:", signedTx);

    const createWallet = async() => {
        const walletData = {
            addresses: {
                chainId: 1,
                address: newAddress.address
            },
            walletId: derivePrivateKey
        }
        const res = await axios.post("https://www.okx.com/api/v5/waas/wallet/create-wallet", walletData).then((res) => {
            console.log(res.status);
        })
    }

    createWallet();
