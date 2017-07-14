# Angular 4 + Truffle Starter Dapp

## Credits

This project was strongly inspired from [Nikhil22's angular2-truffle-starter-dapp](https://github.com/Nikhil22/angular2-truffle-starter-dapp)

## Prerequisites

Here are the tools we created this project with. Earlier versions might work but have not been tested.

- Angular CLI 1.2+
- Truffle 4.0+
- TestRPC 4.0+
- NPM 4.2.0+

## Procedure

Here is how we created this project.

### Create an Angular 4 project

```
$ ng new angular4-truffle-starter-dapp
$ cd angular4-truffle-starter-dapp
```

### Initialize a Truffle project inside the Angular project

```
$ truffle init
```

### Install missing dependencies with NPM

```
$ npm install --save web3
$ npm install --save @types/node
$ npm install --save-dev truffle-contract
```

### Add node types to make it possible to require JS libs

In `src/tsconfig.app.json`, replace:
```
    "types": []
```

By:
```
    "types": [ "node" ],
    "typeRoots": [ "../node_modules/@types" ]
```

### Declare require

In `src/typings.d.ts`, add the following line:
```
declare var require: NodeRequire;
```

### Create a small util library 

Create file in `src/util/validation.ts`, with the following content:
```
export function canBeNumber(str: string): boolean {
  if (!str) {
    return false;
  }
  return !isNaN(+str);
}
```

### App component

Replace content of `src/app/app.component.ts` with the following:
```
import {Component} from '@angular/core';
import {canBeNumber} from '../util/validation';

const Web3 = require('web3');
const contract = require('truffle-contract');
const metaincoinArtifacts = require('../../build/contracts/MetaCoin.json');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  MetaCoin = contract(metaincoinArtifacts);

  account: any;
  accounts: any;
  web3: any;

  balance: number;
  sendingAmount: number;
  recipientAddress: string;
  status: string;
  canBeNumber = canBeNumber;

  constructor() {
    this.checkAndInstantiateWeb3();
    this.onReady();
  }

  checkAndInstantiateWeb3() {
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
  }

  onReady() {
    // Bootstrap the MetaCoin abstraction for Use.
    this.MetaCoin.setProvider(this.web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        alert('There was an error fetching your accounts.');
        return;
      }

      if (accs.length === 0) {
        alert('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
        return;
      }
      this.accounts = accs;
      this.account = this.accounts[0];

      this.refreshBalance();
    });
  }

  refreshBalance() {
    let meta;
    this.MetaCoin.deployed()
      .then((instance) => {
        meta = instance;
        return meta.getBalance.call(this.account, {
          from: this.account
        });
      })
      .then((value) => {
        this.balance = value;
      })
      .catch((e) => {
        console.log(e);
        this.setStatus('Error getting balance; see log.');
      });
  }

  setStatus(message: string) {
    this.status = message;
  }

  sendCoin() {
    const amount = this.sendingAmount;
    const receiver = this.recipientAddress;
    let meta;

    this.setStatus('Initiating transaction... (please wait)');

    this.MetaCoin.deployed()
      .then((instance) => {
        meta = instance;
        return meta.sendCoin(receiver, amount, {
          from: this.account
        });
      })
      .then(() => {
        this.setStatus('Transaction complete!');
        this.refreshBalance();
      })
      .catch((e) => {
        console.log(e);
        this.setStatus('Error sending coin; see log.');
      });
  }
}
```

### Import FormsModule to be able to use forms

In `src/app/app.module.ts`, in @NgModule's imports section, add the following:
```
    FormsModule,
    HttpModule
```

### App Component template

Replace the content of `src/app/app.component.html` with the following:
```
<section class="hero is-medium is-info is-bold">
  <div class="hero-body">
    <div class="container">
      <h1 class="title is-1">
        Metacoin ~ Angular4 + Truffle Starter Dapp
      </h1>
      <h2 class="title">
        You have <span class="is-medium has-underline">{{balance}}</span> META
      </h2>
    </div>
  </div>
</section>
<br>
<div class="container">
  <h1 class="title">Send Metacoin</h1>
  <h1 class="title is-4 is-info help">{{status}}</h1>

  <form #coinForm="ngForm">
    <div class="field">
      <label class="label">Amount</label>
      <p class="control">
        <input
          [(ngModel)]="sendingAmount"
          class="input"
          type="text"
          placeholder="95"
          name="sendingAmount"
          required
          #sendingAmountModel="ngModel">
      </p>
      <div *ngIf="sendingAmountModel.errors && (sendingAmountModel.dirty || sendingAmountModel.touched)"
           class="help is-danger">
        <p [hidden]="!sendingAmountModel.errors.required">
          This field is required
        </p>
      </div>
      <div *ngIf="!sendingAmountModel.errors && (sendingAmountModel.dirty || sendingAmountModel.touched)"
           class="help is-danger">
        <p [hidden]="canBeNumber(sendingAmount)">
          Must be a number
        </p>
      </div>
    </div>
    <div class="field">
      <label class="label">To Address</label>
      <p class="control">
        <input
          [(ngModel)]="recipientAddress"
          name="recipientAddress"
          class="input"
          type="text"
          placeholder="0x93e66d9baea28c17d9fc393b53e3fbdd76899dae"
          required
          #recipientAddressModel="ngModel"
        >
      </p>
      <div *ngIf="recipientAddressModel.errors && (recipientAddressModel.dirty || recipientAddressModel.touched)"
           class="help is-danger">
        <p [hidden]="!recipientAddressModel.errors.required">
          This field is required
        </p>
      </div>
      <div *ngIf="!recipientAddressModel.errors && (recipientAddressModel.dirty || recipientAddressModel.touched)"
           class="help is-danger">
        <p [hidden]="canBeNumber(recipientAddress)">
          Must be a number
        </p>
      </div>
    </div>

    <div class="field is-grouped">
      <p class="control">
        <button
          [disabled]="!coinForm.valid"
          (click)="sendCoin()"
          class="button is-primary">
          Send
        </button>
      </p>
    </div>
  </form>

  <strong>Hint:</strong> open the browser developer console to view any errors and warnings.

</div>
```

### Beautify

Add the following CSS link to the head of `src/index.html`, just to make the whole interface a little nicer
```
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.4.2/css/bulma.min.css">
```

## Run

Start TestRPC:
```
$ testrpc
```

In another window, compile and migrate the MetaCoin smart contract:
```
$ truffle compile
$ truffle migrate
```

Build and run the frontend:
```
$ ng serve
```

Open your browser and go to `http://localhost:4200`, and check that it displays 10000 coins as a starting balance.
Open the developer console to see any potential warning.
Use the account addresses from the Truffle window to set some MetaCoins to any account but the first one.

And voila! You've got yourself a strong basis to start creating your own Ethereum Dapp using Angular 4 for the frontend.
