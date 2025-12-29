require('dotenv').config();
const { generateWallet } = require('@stacks/wallet-sdk');
const TransactionLib = require('@stacks/transactions'); // Load the whole library
const NetworkLib = require('@stacks/network'); // Load the whole library

console.log("--- 🕵️ DEBUG DOCTOR ---");

// 1. Check Private Key Generation
try {
  const mnemonic = process.env.MNEMONIC;
  if (!mnemonic) console.log("❌ MNEMONIC: Missing in .env");
  else console.log("✅ MNEMONIC: Found");
  
  // Try to generate
  /* We skip the actual generate call to avoid async complexity in debug, 
     assuming the library load is the issue. */
} catch (e) { console.log("❌ Wallet Check Failed"); }

// 2. Check Stacks Transactions Library
console.log("\n--- Checking Transaction Tools ---");
console.log(`Cl is defined? ${TransactionLib.Cl ? "✅ YES" : "❌ NO (Undefined)"}`);
console.log(`makeContractCall is defined? ${TransactionLib.makeContractCall ? "✅ YES" : "❌ NO"}`);
console.log(`PostConditionMode is defined? ${TransactionLib.PostConditionMode ? "✅ YES" : "❌ NO"}`);

// 3. Check Network Library (The usual suspect)
console.log("\n--- Checking Network Tools ---");
console.log(`STACKS_MAINNET is defined? ${NetworkLib.STACKS_MAINNET ? "✅ YES" : "❌ NO (Undefined)"}`);
console.log(`StacksMainnet (Old Class) is defined? ${NetworkLib.StacksMainnet ? "✅ YES" : "❌ NO"}`);

console.log("\n--- END REPORT ---");