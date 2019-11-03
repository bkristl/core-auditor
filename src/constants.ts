export enum AuditorTransactionType {
    GROUP = 1,
    TYPE = 100,
    KEY = 'auditorData'
}

export enum AuditorAssetType {
    INVOICE = 1,
    PROFORMAINVOICE = 2,
    DELIVERYNOTE = 3
}

export enum AuditorAssetAction {
    SEND = 1,
    CANCEL = 2,
    SPLIT = 3
}

export let AuditorTransactionSchemaRequired = ["type", "action"];

export let AuditorTransactionSchema = {
            auditorData: {
              type: "object",
              required: AuditorTransactionSchemaRequired,
              properties: {
                type: {
                  type: "number"
                },
                action: {
                  type: "number"
                },
              }
            }
          };