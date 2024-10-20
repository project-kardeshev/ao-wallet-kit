

import { Chain } from 'viem'
import { weaveVMAlphanet } from 'viem/chains'

// weaveVM configuration https://docs.wvm.dev/using-weavevm/network-configurations
export const weaveVmChainConfig = {
  ...weaveVMAlphanet,
   contracts: {
    ecRecover: { // Elliptic curve digital signature algorithm (ECDSA) public key recovery function
      address: '0x0000000000000000000000000000000000000001',
    },
    ["SHA2-256"]: { // hash function contract
      address: '0x0000000000000000000000000000000000000002',
    },
    ["RIPEMD-160"]: { // hash function contract
      address: '0x0000000000000000000000000000000000000003',
    },
    identity: { // Returns the input
        address: '0x0000000000000000000000000000000000000004'
    },
     modexp: { // Arbitrary-precision exponentiation under modulo
        address: '0x0000000000000000000000000000000000000005'
    },
     ecAdd: { // Point addition (ADD) on the elliptic curve alt_bn128
        address: '0x0000000000000000000000000000000000000006'
    },
     ecMul: { // Point addition (ADD) on the elliptic curve alt_bn128
        address: '0x0000000000000000000000000000000000000007'
    },
     ecPairing: { 
        address: '0x0000000000000000000000000000000000000008'
    },
     blake2f: { 
        address: '0x0000000000000000000000000000000000000009'
    },
     pointEvaluation: {
        address: '0x000000000000000000000000000000000000000A'
    },
    arweaveUpload: {
        address: '0x0000000000000000000000000000000000000017'
    },
     arweaveRead: {
        address: '0x0000000000000000000000000000000000000018'
    },
     readBlock: {
        address: '0x0000000000000000000000000000000000000020'
    },
     kyveTrustlessApiBlob: {
        address: '0x0000000000000000000000000000000000000021'
    },
  },
} as const satisfies Chain