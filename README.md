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

[DappLink](https://tamara-ebi-pere-victor.github.io/Document-Registry/)

# UPDATE
The following updates have been made to this DApp after reviewing pull requests by reviewers from the Celo development course
1. Owner of contract can add addresses that can act as admins and add more documents to the registry
2. A payment structure has been added for non-admins, so for a document verification by a non-admin, they pay a fee of 2cUSD
3. A blocker has been put to stop non-admin users from being able to upload documents to the registry, as this brought about an unintended bug after my first submission
4. The Wallet details of the contract owner are stored in the admin.js file for testers that wish to interact with the dapp with maximum access. 
5. The Following documents are already in the registry
      * whitepaper-pages-1.pdf
      * whitepaper-pages-2.pdf
      * whitepaper-pages-3.pdf
      * whitepaper-pages-4.pdf
6. The Following documents are not in the registry
      * whitepaper-pages-5.pdf
      * whitepaper-pages-6.pdf
      * whitepaper.pdf 


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
