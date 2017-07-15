import {Component} from '@angular/core';
import {canBeNumber} from '../util/validation';
import {Web3Service} from '../shared/services/web3.service';
import {MetaCoinService} from '../shared/services/meta-coin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  account: any;
  accounts: any;

  balance: number;
  sendingAmount: number;
  recipientAddress: string;
  status: string;
  canBeNumber = canBeNumber;

  constructor(private web3Service: Web3Service, private metaCoinService: MetaCoinService) {
    this.onReady();
  }


  onReady() {
    this.accounts = this.web3Service.getAccounts();
    this.account = this.accounts[0];
    this.refreshBalance();
  }

  refreshBalance() {
    this.metaCoinService.getBalance(this.account).subscribe((balance: number) => {
      this.balance = balance;
    }, (error) => {
      console.error(error);
      this.setStatus('Error getting balance; see log.');
    });
  }

  setStatus(message: string) {
    this.status = message;
  }

  sendCoin() {
    const amount = this.sendingAmount;
    const receiver = this.recipientAddress;

    this.setStatus('Initiating transaction... (please wait)');

    this.metaCoinService.sendCoin(this.account, receiver, amount).subscribe(() => {
      this.setStatus('Transaction complete!');
      this.refreshBalance();
    }, () => {
      this.setStatus('Error sending coin; see log.');
    });
  }
}
