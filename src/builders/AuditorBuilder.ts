import { Interfaces, Transactions, Utils } from "@arkecosystem/crypto";
import { AuditorTransaction } from "../transactions";
import { AuditorAsset } from "../interfaces";

export class AuditorBuilder extends Transactions.TransactionBuilder<AuditorBuilder> {
  constructor() {
    super();
    this.data.type = AuditorTransaction.type;
    this.data.typeGroup = AuditorTransaction.typeGroup;
    this.data.version = 2;
    this.data.fee = Utils.BigNumber.ZERO;
    this.data.amount = Utils.BigNumber.ZERO;
    this.data.asset = { auditor: {} };
  }

  public auditorAsset(auditorAsset:AuditorAsset): AuditorBuilder {
    this.data.asset.auditor = {
        ...auditorAsset
    };

    return this;
  }

  public getStruct(): Interfaces.ITransactionData {
    const struct: Interfaces.ITransactionData = super.getStruct();
    struct.amount = this.data.amount;
    struct.asset = this.data.asset;
    return struct;
  }
  
  protected instance(): AuditorBuilder {
    return this;
  }
}