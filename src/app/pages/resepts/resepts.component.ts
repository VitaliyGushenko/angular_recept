import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject } from 'rxjs';
import { ReceiptService } from 'src/app/services/receipt.service';
import { AddReceiptModalComponent } from './components/add-receipt-modal/add-receipt-modal.component';

@Component({
  selector: 'app-resepts',
  templateUrl: './resepts.component.html',
  styleUrls: ['./resepts.component.css'],
})
export class ReseptsComponent implements OnInit {
  @ViewChild(AddReceiptModalComponent, { static: false })
  private comp: AddReceiptModalComponent | undefined;
  isLoading$ = new BehaviorSubject<boolean>(false);
  receipts: any;

  constructor(
    private receiptService: ReceiptService,
    private readonly _msg: NzMessageService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadData();
  }

  addReceipt() {
    this.comp?.show();
  }

  async loadData() {
    try {
      this.isLoading$.next(true);
      this.receipts = await this.receiptService.getDocs();
    } catch (e) {
      this._msg.error('Ошибка: ' + e);
    } finally {
      this.isLoading$.next(false);
    }
  }

  editReceipt(uid: string) {
    const [receipt] = this.receipts.filter((e: any) => e.uid === uid);
    this.comp?.show(receipt);
  }
}
