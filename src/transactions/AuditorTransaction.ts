import { Transactions, Utils } from "@arkecosystem/crypto";
import ByteBuffer from "bytebuffer";
import { IAuditorData, AuditorData } from "../interfaces";
import { AuditorTransactionType, AuditorTransactionSchema } from "../constants";
import { Serdes } from "../utils/serdes";


const { schemas } = Transactions;
const serdes = new Serdes();


export class AuditorTransaction extends Transactions.Transaction {
  public static type: number = AuditorTransactionType.TYPE;
  public static typeGroup: number = AuditorTransactionType.GROUP;
  public static key: string = AuditorTransactionType.KEY;

  public static getSchema(): Transactions.schemas.TransactionSchema {
    return schemas.extend(schemas.transactionBaseSchema, {
      $id: AuditorTransactionType.KEY,
      required: ["asset", "typeGroup"],
      properties: {
        type: { transactionType: AuditorTransactionType.TYPE },
        typeGroup: { const: AuditorTransactionType.GROUP },
        amount: { bignumber: { minimum: 0, maximum: 0 } },
        asset: {
          type: "object",
          required: [AuditorTransactionType.KEY],
          properties: AuditorTransactionSchema
        },
      },
    });
  }

  protected static defaultStaticFee: Utils.BigNumber = Utils.BigNumber.ZERO;

  public serialize(): ByteBuffer {
    const { data } = this;
    const auditor = data.asset.auditorData as IAuditorData;
    return serdes.serialize(auditor);
    
  }

  public deserialize(buf: ByteBuffer): void {
    const { data } = this;
    const auditor = new AuditorData();
    data.asset = {};
    //data.asset.auditorData = {type:1, action:1} as IAuditorData
    //console.log(data.asset);
    data.asset.auditorData =  serdes.deserialize(buf,auditor);
    
    
    console.log(data.asset);
  }
}