export interface StandardMessage {
    types: {
        EIP712Domain: [
            { name: 'name'; type: 'string' },
            { name: 'version'; type: 'string' },
            { name: 'chainId'; type: 'uint256' },
            { name: 'verifyingContract'; type: 'address' }
        ];
        Person: [
            { name: 'name'; type: 'string' },
            { name: 'wallet'; type: 'address' }
        ];
        Mail: [
            { name: 'from'; type: 'Person' },
            { name: 'to'; type: 'Person' },
            { name: 'contents'; type: 'string' }
        ];
    };
    primaryType: string;
    domain: {
        name: string;
        verifyingContract: string;
        version: string;
        chainId: number;
    };
    message: {
        from: {
            name: string;
            wallet: string;
        };
        to: {
            name: string;
            wallet: string;
        };
        contents: string;
    };
}
