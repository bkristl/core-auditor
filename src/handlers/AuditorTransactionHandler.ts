import { Database } from "@arkecosystem/core-interfaces";
import { TransactionPool } from "@arkecosystem/core-interfaces";
import { State } from "@arkecosystem/core-interfaces";
import { EventEmitter } from "@arkecosystem/core-interfaces";

import { Handlers} from "@arkecosystem/core-transactions";
import { TransactionReader} from "@arkecosystem/core-transactions";

import { Transactions } from "@arkecosystem/crypto";
import { Interfaces } from "@arkecosystem/crypto";
import { Managers } from "@arkecosystem/crypto";

import { AuditorTransaction } from "../transactions";

import { AuditorApplicationEvents } from "../events";

//import { AuditorAsset } from "../interfaces";

//import { BusinessRegistrationAssetError, WalletIsAlreadyABusiness } from "../errors";

export class AuditorTransactionHandler extends Handlers.TransactionHandler {
    public getConstructor(): Transactions.TransactionConstructor {
        return AuditorTransaction;
    }
 
    public dependencies(): ReadonlyArray<any> {
        return [];
    }
    
    public walletAttributes(): ReadonlyArray<string> {
        return [];
    }

    public async isActivated(): Promise<boolean> {
        return !!Managers.configManager.getMilestone().aip11;
    }

    public async bootstrap(connection: Database.IConnection, walletManager: State.IWalletManager): Promise<void> {
        const reader: TransactionReader = await TransactionReader.create(connection, this.getConstructor());
        while (reader.hasNext()) {
            const transactions = await reader.read();
    
            for (const transaction of transactions) {
                  const wallet: State.IWallet = walletManager.findByPublicKey(transaction.senderPublicKey);
                  //const asset: AuditorAsset = { };
                
        
                  //wallet.setAttribute<AuditorAsset>("business", asset);
                  walletManager.reindex(wallet);
            }
          
      }
    }
   
    public async throwIfCannotBeApplied(
        transaction: Interfaces.ITransaction,
        wallet: State.IWallet,
        databaseWalletManager: State.IWalletManager,
    ): Promise<void> {
        
        await super.throwIfCannotBeApplied(transaction, wallet, databaseWalletManager);
    }
    
    public emitEvents(transaction: Interfaces.ITransaction, emitter: EventEmitter.EventEmitter): void {
        emitter.emit(AuditorApplicationEvents.InvoiceSend, transaction.data);
    }

    public async canEnterTransactionPool(
        data: Interfaces.ITransactionData,
        pool: TransactionPool.IConnection,
        processor: TransactionPool.IProcessor,
    ): Promise<boolean> {
        
        if (await this.typeFromSenderAlreadyInPool(data, pool, processor)) {
            return false;
        }
        
        return true;
    }
    
    public async applyToSender(transaction: Interfaces.ITransaction, walletManager: State.IWalletManager): Promise<void> {}

    public async revertForSender(transaction: Interfaces.ITransaction, walletManager: State.IWalletManager): Promise<void> {}

    public async applyToRecipient(transaction: Interfaces.ITransaction, walletManager: State.IWalletManager): Promise<void> {}

    public async revertForRecipient(transaction: Interfaces.ITransaction, walletManager: State.IWalletManager): Promise<void> {}

}