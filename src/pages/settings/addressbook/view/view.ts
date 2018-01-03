import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { importType } from '@angular/compiler/src/output/output_ast';

// Pages
import { AmountPage } from '../../../../pages/send/amount/amount';

// Providers
import { AddressBookProvider } from '../../../../providers/address-book/address-book';
import { AddressProvider } from '../../../../providers/address/address';
import { BwcProvider } from '../../../../providers/bwc/bwc';
import { PopupProvider } from '../../../../providers/popup/popup';

@Component({
  selector: 'page-addressbook-view',
  templateUrl: 'view.html',
})
export class AddressbookViewPage {

  public contact: any;
  public address: string;
  public name: string;
  public email: string;

  private bitcoreCash: any;
  private coin: string;


  constructor(
    private addressBookProvider: AddressBookProvider,
    private addressProvider: AddressProvider,
    private alertCtrl: AlertController,
    private bwcProvider: BwcProvider,
    private navCtrl: NavController,
    private navParams: NavParams,
    private popupProvider: PopupProvider
  ) {
    this.bitcoreCash = this.bwcProvider.getBitcoreCash();
    this.address = this.navParams.data.contact.address;
    this.name = this.navParams.data.contact.name;
    this.email = this.navParams.data.contact.email;

    var cashAddress = this.bitcoreCash.Address.isValid(this.address, 'livenet');
    if (cashAddress) {
      this.coin = 'bch';
    } else {
      this.coin = 'btc';
    }
  }

  ionViewDidLoad() {
  }

  public sendTo(): void {
    this.navCtrl.push(AmountPage, {
      toAddress: this.address,
      name: this.name,
      email: this.email,
      coin: this.coin,
      recipientType: 'contact',
      network: this.addressProvider.validateAddress(this.address).network,
    });
  }

  public remove(addr: string): void {
    var title = 'Warning!'; // Todo: gettextCatalog
    var message = 'Are you sure you want to delete this contact?'; // Todo: gettextCatalog
    this.popupProvider.ionicConfirm(title, message, null, null).then((res: any) => {
      if (!res) return;
      this.addressBookProvider.remove(addr).then((ab) => {
        this.navCtrl.pop();
      }).catch((err: any) => {
        this.popupProvider.ionicAlert('Error', err); // Todo: gettextCatalog
        return;
      });
    });
  }

}