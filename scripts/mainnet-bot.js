require('dotenv').config();
const { generateWallet } = require('@stacks/wallet-sdk');
const { makeContractCall, broadcastTransaction, AnchorMode, PostConditionMode, Cl } = require('@stacks/transactions');
// FIX 1: Import the constant, not the class
const { STACKS_MAINNET } = require('@stacks/network');

// --- CONFIGURATION ---
const MNEMONIC = process.env.MNEMONIC; 
const SENDER_ADDRESS = 'SP3GAYKCWBD2PTNR77WGYWCPPR102C5E0C9MBGPS7'; 

// FIX 2: Use the constant directly (no 'new' keyword)
const NETWORK = STACKS_MAINNET;

// --- THE 7 CONTRACTS & FUNCTIONS ---
const TARGETS = [
  // 1. Status Logger
  { 
    name: 'status-logger', 
    func: 'write-status', 
    args: [Cl.stringAscii("Bot Active")] 
  },
  // 2. Personal Counter
  { 
    name: 'personal-counter', 
    func: 'increment', 
    args: [] 
  },
  // 3. Onchain Notepad
  { 
    name: 'onchain-notepad', 
    func: 'write-note', 
    args: [Cl.stringUtf8("Automated entry")] 
  },
  // 4. Daily Check-in
  { 
    name: 'daily-checkin', 
    func: 'check-in', 
    args: [] 
  },
  // 5. Feedback Box
  { 
    name: 'feedback-box', 
    func: 'submit-feedback', 
    args: [Cl.stringUtf8("Great system!"), Cl.uint(5)] 
  },
  // 6. Simple Points
  { 
    name: 'simple-points', 
    func: 'claim-points', 
    args: [] 
  },
  // 7. Wallet Registry
  { 
    name: 'simple-wallet-registry', 
    func: 'register-wallet', 
    args: [Cl.stringAscii("JadonBot")] 
  }
];

let currentIndex = 0;

async function runBot() {
  if (!MNEMONIC) {
    console.error("❌ Error: No MNEMONIC found in .env file");
    return;
  }
  
  // Convert Phrase to Private Key
  const wallet = await generateWallet({ secretKey: MNEMONIC, password: "" });
  const privateKey = wallet.accounts[0].stxPrivateKey;

  // Select Contract
  const target = TARGETS[currentIndex];
  console.log(`\n🤖 Bot Waking Up...`);
  console.log(`📍 Targeting: [${target.name}] -> Function: [${target.func}]`);

  try {
    const txOptions = {
      contractAddress: SENDER_ADDRESS,
      contractName: target.name,
      functionName: target.func,
      functionArgs: target.args,
      senderKey: privateKey,
      network: NETWORK,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
    };

    // Broadcast
    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, NETWORK);

    if (broadcastResponse.error) {
      console.error(`❌ Transaction failed: ${broadcastResponse.reason}`);
    } else {
      console.log(`✅ Success!`);
      console.log(`🔗 Tracker: https://explorer.hiro.so/txid/${broadcastResponse.txid}?chain=mainnet`);
    }

  } catch (error) {
    console.error("❌ Script Error:", error.message);
  }

  // Update Index
  currentIndex = (currentIndex + 1) % TARGETS.length;
}

// Run immediately exactly once for testing
runBot();