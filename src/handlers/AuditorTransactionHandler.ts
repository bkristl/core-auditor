import { Database, TransactionPool, State, EventEmitter } from "@arkecosystem/core-interfaces";
import { Handlers, TransactionReader} from "@arkecosystem/core-transactions";
import { AuditorTransaction } from "../transactions";
import { Transactions, Interfaces, Managers} from "@arkecosystem/crypto";
import { AuditorAsset } from "../interfaces";
//import { BusinessRegistrationAssetError, WalletIsAlreadyABusiness } from "../errors";

export class BusinessRegistrationTransactionHandler extends Handlers.TransactionHandler {
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
              const asset: AuditorAsset = { 
                transaction.asset.auditor 
              
              };
            

              wallet.setAttribute<AuditorAsset>("business", asset);
              walletManager.reindex(wallet);
          }
      }
    }

    public async throwIfCannotBeApplied(
        transaction: Interfaces.ITransaction,
        wallet: State.IWallet,
        databaseWalletManager: State.IWalletManager,
    ): Promise<boolean> {
        
        return super.throwIfCannotBeApplied(transaction, wallet, databaseWalletManager);
    }
    
    public emitEvents(transaction: Interfaces.ITransaction, emitter: EventEmitter.EventEmitter): Promise<void> {}

    public async canEnterTransactionPool(
        data: Interfaces.ITransactionData,
        pool: TransactionPool.IConnection,
        processor: TransactionPool.IProcessor,
    ): Promise<boolean> {}

    public async applyToSender(transaction: Interfaces.ITransaction, walletManager: State.IWalletManager): Promise<void> {}

    public async revertForSender(transaction: Interfaces.ITransaction, walletManager: State.IWalletManager): Promise<void> {}

    public async applyToRecipient(transaction: Interfaces.ITransaction, walletManager: State.IWalletManager): Promise<void> {}

    public async revertForRecipient(transaction: Interfaces.ITransaction, walletManager: State.IWalletManager): Promise<void> {}

}