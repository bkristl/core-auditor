export interface AuditorAsset {
    type: number;
    action: number;
    fileHash: AuditorCrypto;
    docSigHash: AuditorCrypto;
    location: AuditorLocation;
}

export interface AuditorCrypto {
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

