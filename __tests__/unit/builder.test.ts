import "jest-extended";

import { Managers } from "@arkecosystem/crypto";
import { Transactions } from "@arkecosystem/crypto";
import { AuditorBuilder } from "../../src/builders";
import { AuditorTransaction } from "../../src/transactions";
import { AuditorData } from "../../src/interfaces";


describe("Test builder",()=>{

    it("Should verify correctly", ()=> {
        Managers.configManager.setFromPreset("testnet");
        Transactions.TransactionRegistry.registerTransactionType(AuditorTransaction);

        const builder = new AuditorBuilder();
        const auditorData = new AuditorData();
        auditorData.type = 1;
        auditorData.action = 2;
       
       //   let arrayBytes = new Uint8Array(2);
       //console.log(arrayBytes);
       
        
        const actual = builder
            .auditorData(auditorData)
            .nonce("3")
            .sign("clay harbor enemy utility margin pretty hub comic piece aerobic umbrella acquire");


        console.log(actual.build().toJson());
        expect(actual.build().verified).toBeTrue();
        expect(actual.verify()).toBeTrue();
    });
});
