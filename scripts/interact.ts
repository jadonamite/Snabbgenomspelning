import 'dotenv/config';
import { makeContractCall, broadcastTransaction, AnchorMode, Cl } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import { generateWallet } from '@stacks/wallet-sdk';

// 1. SETUP
const mnemonic = process.env.MNEMONIC;
if (!mnemonic) throw new Error("No MNEMONIC found in .env file");

const network = STACKS_MAINNET;
const senderAddress = 'SP3GAYKCWBD2PTNR77WGYWCPPR102C5E0C9MBGPS7'; 

async function interact() {
  console.log("🤖 Initializing Interaction Script...");

  // --- DERIVE PRIVATE KEY ---
  const wallet = await generateWallet({
    secretKey: mnemonic!,
    password: ""
  });
  const privateKey = wallet.accounts[0].stxPrivateKey;
  console.log("🔑 Key derived successfully.");

  // --- CONTRACT 1: STATUS LOGGER ---
  const txOptions = {
    contractAddress: senderAddress,
    contractName: 'status-logger',
    functionName: 'write-status',
    functionArgs: [
      // FIX: Use Cl.stringAscii() instead of raw object
      Cl.stringAscii("Hello Mainnet! Automated.") 
    ],
    senderKey: privateKey,
    validateWithAbi: false,
    network,
    anchorMode: AnchorMode.Any,
  };

  // 2. BROADCAST
  console.log("📡 Broadcasting transaction...");
  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction(transaction, network);
  
  // 3. RESULT
  if (broadcastResponse.error) {
    console.error("❌ Broadcast failed:", broadcastResponse.error);
    console.error("Reason:", broadcastResponse.reason);
  } else {
    const txId = broadcastResponse.txid;
    console.log(`✅ Transaction sent!`);
    console.log(`🔗 Tracker: https://explorer.hiro.so/txid/${txId}?chain=mainnet`);
  }
}

interact().catch(console.error);