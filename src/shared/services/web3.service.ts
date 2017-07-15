import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';

const Web3 = require('web3');
const PromisifyWeb3 = require('../../promisifyWeb3.js');

@Injectable()
export class Web3Service {
  web3: any;

  constructor() {
    this.checkAndInstantiateWeb3();
  }

  private checkAndInstantiateWeb3() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof this.web3 !== 'undefined') {
      console.warn('Using web3 detected from external source. If you find that your accounts don\'t appear or you have ' +
        '0 MetaCoin, ensure you\'ve configured that source properly. If using MetaMask, see the following link. Feel ' +
        'free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask');
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(this.web3.currentProvider);
    } else {
      console.warn('No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when ' +
        'you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info ' +
        'here: http://truffleframework.com/tutorials/truffle-and-metamask');
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    }
    PromisifyWeb3.promisify(this.web3);
  }

  getCurrentProvider() {
    return this.web3.currentProvider;
  }

  getAccounts(): string[] {
    return this.web3.eth.accounts;
  }
}
