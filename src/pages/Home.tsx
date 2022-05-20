import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import './Home.scss';
import { HOME } from '../routes';
import { ethers } from 'ethers';
import { StandardMessage } from './shared/model/StandardMessage.model';
import { NftMessage } from './shared/model/NftMessage.model';

// @ts-ignore
const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
const signer = ethProvider.getSigner();

const DEFAULT_DOMAIN_NAME = 'Ether Mail';
const DOMAIN_NFT = 'NFT';

class Home extends Component<RouteComponentProps> {
    componentDidMount() {
        if (this.props.location.pathname !== HOME) {
            this.props.history.push(HOME);
        }
    }

    /**
     * Connect to Metamask
     */
    connectMetamaskWallet() {
        ethProvider
            .send('eth_requestAccounts', [])
            .catch(() => console.log('user rejected request'));
    }

    formatMessageStandard = (
        fromName: string,
        fromWallet: string,
        toName: string,
        toWallet: string,
        verifyingContract: string,
        contents: string,
        domainVersion?: string,
        chainId?: number
    ): StandardMessage => {
        return {
            types: {
                EIP712Domain: [
                    { name: 'name', type: 'string' },
                    { name: 'version', type: 'string' },
                    { name: 'chainId', type: 'uint256' },
                    { name: 'verifyingContract', type: 'address' },
                ],
                Person: [
                    { name: 'name', type: 'string' },
                    { name: 'wallet', type: 'address' },
                ],
                Mail: [
                    { name: 'from', type: 'Person' },
                    { name: 'to', type: 'Person' },
                    { name: 'contents', type: 'string' },
                ],
            },
            primaryType: 'Mail',
            domain: {
                name: DEFAULT_DOMAIN_NAME,
                verifyingContract,
                version: domainVersion || '1',
                chainId: chainId || 1,
            },
            message: {
                from: {
                    name: fromName,
                    wallet: fromWallet,
                },
                to: {
                    name: toName,
                    wallet: toWallet,
                },
                contents,
            },
        };
    };

    formatMessageNft: any = (
        fromName: string,
        fromWallet: string,
        toName: string,
        toWallet: string,
        contents: string,
        verifyingContract: string,
        nfts: string[]
    ) => {
        const messageStandard = this.formatMessageStandard(
            fromName,
            fromWallet,
            toName,
            toWallet,
            verifyingContract,
            contents
        );
        return {
            ...messageStandard,
            domain: {
                ...messageStandard.domain,
                name: DOMAIN_NFT,
                version: '1',
                verifyingContract,
            },
            message: {
                ...messageStandard.message,
                nft: nfts,
            },
        };
    };

    createStandardMessage = async () => {
        // Example message standard
        const msgParams = this.formatMessageStandard(
            'bob',
            '0x63441Fd6719382dC38cd7aBE868125D15b22C9F5',
            'marley',
            '0x73541Fd3434382dC38cd7aBE868125D15b22C9F5',
            '0x82541Fd3434382dC38cd7aBE868125D15b22C9F5',
            'No woman no cry'
        );
        this.signMessage(msgParams);
    };

    createNftMessage = async () => {
        // Example message standard
        const msgParams = this.formatMessageNft(
            'bob',
            '0x63441Fd6719382dC38cd7aBE868125D15b22C9F5',
            'marley',
            '0x73541Fd3434382dC38cd7aBE868125D15b22C9F5',
            '0x82541Fd3434382dC38cd7aBE868125D15b22C9F5',
            'No woman no cry',
            ['1', '2']
        );
        this.signMessage(msgParams);
    };

    signMessage = async (msgParams: Partial<StandardMessage | NftMessage>) => {
        const account = await signer.getAddress();

        // @ts-ignore
        window.ethereum.sendAsync(
            {
                method: 'eth_signTypedData_v4',
                params: [account, JSON.stringify(msgParams)],
                from: account,
            },
            async (err: any, res: any) => {
                if (err) {
                    console.error('ERROR', err);
                    return;
                } else if (res.error) {
                    console.error('ERROR', res.error.message);
                    return;
                }
                console.log(res);
                const addr = ethers.utils.verifyMessage(
                    JSON.stringify(msgParams),
                    res.result
                );
                console.log(addr);
            }
        );
    };

    render() {
        return (
            <div id="wrapper" className="home">
                <button onClick={this.connectMetamaskWallet} className="button">
                    Connect Metamask
                </button>
                <button onClick={this.createStandardMessage} className="button">
                    Create generic message
                </button>
                <button onClick={this.createNftMessage} className="button">
                    Create NFT message
                </button>
            </div>
        );
    }
}

export default withRouter(Home);
