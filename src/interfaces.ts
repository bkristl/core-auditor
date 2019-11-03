export interface IAuditorData {
    type: number;
    action: number;
    hash: IAuditorCrypto;
    /*docSigHash: AuditorCrypto;
    location: AuditorLocation;*/
}

export interface IAuditorCrypto {
    type: string;
    value: string;
}

export interface AuditorLocation {
    location: string;
    username: string;
    password: string;
}

export interface AuditorWalletAttributes {
    
}

class AuditorCrypto implements IAuditorCrypto {
    type: string;
    value: string;
}

export class AuditorData implements IAuditorData {
    type: number;
    action: number;
    hash: IAuditorCrypto;
    
    constructor() {
        this.type = 0;
        this.action = 0;
        this.hash = new AuditorCrypto();
    }
}