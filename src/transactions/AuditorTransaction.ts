import { Transactions, Utils } from "@arkecosystem/crypto";
import ByteBuffer from "bytebuffer";
import { AuditorAsset } from "../interfaces";
import { AuditorTransactionType, AuditorTransactionSchema} from "../constants";

const { schemas } = Transactions;

export class AuditorTransaction extends Transactions.Transaction {
  public static typeGroup: number = AuditorTransactionType.GROUP;
  public static type: number = AuditorTransactionType.TYPE;
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
    const auditor = data.asset.auditor as AuditorAsset;
    let arrayBytes: Array<Uint8Array>;
    let propertiesLength: number;
    
    propertiesLength = 0;
    for (let properties in auditor){
        let propUtf8 = Buffer.from(properties, "utf8");
        arrayBytes.push(propUtf8);
        propertiesLength += propUtf8.length;
    }
    const buffer = new ByteBuffer(propertiesLength + arrayBytes.length, true);
    
    for (let item in arrayBytes){
        buffer.writeUint8(item.length);
        buffer.append(item, "hex");
    }

    return buffer;
    
  }

  public deserialize(buf: ByteBuffer): void {
    const { data } = this;
    const auditor = {} as AuditorAsset;
    
   for (let property in auditor){
        const Length = buf.readUint8();
        auditor[property] = buf.readString(Length);
    }

    data.asset = { auditor };
  }
}