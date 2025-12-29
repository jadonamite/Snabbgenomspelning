import { describe, it, expect } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const wallet1 = accounts.get("wallet_1")!;

describe('Status Logger Contract', () => {
  it('writes a status and then reads it back', () => {
    // 1. Write the status
    const writeResponse = simnet.callPublicFn(
      'status-logger', 
      'write-status', 
      [Cl.stringUtf8("Feeling good!")], 
      wallet1
    );
    expect(writeResponse.result).toBeOk(Cl.bool(true));

    // 2. Read it back immediately (before memory is wiped)
    const readResponse = simnet.callReadOnlyFn(
      'status-logger',
      'get-status',
      [Cl.standardPrincipal(wallet1)],
      wallet1
    );
    expect(readResponse.result).toBeOk(Cl.some(Cl.stringUtf8("Feeling good!")));
  });
});