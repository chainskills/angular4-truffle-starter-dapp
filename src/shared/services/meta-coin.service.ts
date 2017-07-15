import {Injectable} from '@angular/core';
import {Web3Service} from './web3.service';
import {Observable} from 'rxjs/Rx';

const contract = require('truffle-contract');
const metaincoinArtifacts = require('../../../build/contracts/MetaCoin.json');

@Injectable()
export class MetaCoinService {
  private MetaCoin = contract(metaincoinArtifacts);

  constructor(private web3Service: Web3Service) {
    this.MetaCoin.setProvider(this.web3Service.getCurrentProvider());
  }

  getBalance(account: string): Observable<number> {
    return Observable.fromPromise(this.MetaCoin.deployed().then((instance) => {
      return instance.getBalance.call(account, {from: account});
    }));
  }

  sendCoin(from: string, to: string, amount: number): Observable<{}> {
    return Observable.fromPromise(this.MetaCoin.deployed().then((instance) => {
      return instance.sendCoin(to, amount, {from: from});
    }));
  }
}
