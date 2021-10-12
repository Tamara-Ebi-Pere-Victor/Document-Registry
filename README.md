# DOCUMENT-REGISTRY

This is a Dapp that helps users verify documents that have been issued by an organization. 

The application uses the encryption methods sha256 and keccak-256 to produce a distinct key that is identifiable to that single issued document.

There are test files that have been uploaded to see it's functionality in action, only one of those files was not uploaded to the blockchain.

The file being the whitepaper-pages-5.pdf.

Only the contract creator, has the ability to add documents to the contract.

Ways of improving this Dapp
1. A possible way could be implementation of IPFS to help host the documents.
2. Another way could requesting a fee from users, before verifying their documents.

The Documents used in this test were extracts of the celo whitepaper.

Use Cases
1. This Dapp can be used by document issuing organizations, like schools, business, e.t.c.
2. It can be used to ensure validity of a perticular document, and help reduce the effect of forgery in the professional world.


# For Developers
## Install

```

npm install

```

or 

```

yarn install

```

## Start

```

npm run dev

```

## Build

```

npm run build

```

# Usage
1. Install the [CeloExtensionWallet](https://chrome.google.com/webstore/detail/celoextensionwallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh?hl=en) from the google chrome store.
2. Create a wallet.
3. Go to [https://celo.org/developers/faucet](https://celo.org/developers/faucet) and get tokens for the alfajores testnet.
4. Switch to the alfajores testnet in the CeloExtensionWallet.