import { Component, OnInit, ViewChild } from '@angular/core';
import { AddReceiptModalComponent } from './components/add-receipt-modal/add-receipt-modal.component';

@Component({
  selector: 'app-resepts',
  templateUrl: './resepts.component.html',
  styleUrls: ['./resepts.component.css'],
})
export class ReseptsComponent implements OnInit {
  @ViewChild(AddReceiptModalComponent, { static: false })
  private comp: AddReceiptModalComponent | undefined;

  constructor() {}

  ngOnInit(): void {}

  addReceipt() {
    this.comp?.show();
  }
}
