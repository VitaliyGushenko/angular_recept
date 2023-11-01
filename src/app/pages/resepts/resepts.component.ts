import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
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
    private readonly _receiptService: ReceiptService,
    private readonly _msg: NzMessageService,
    private readonly _router: Router,
    public readonly authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadData();
  }

  addReceipt() {
    this._router.navigate(['receipt', { mode: 'edit' }]);
  }

  async loadData() {
    try {
      this.isLoading$.next(true);
      this.receipts = (await this._receiptService.getDocs()).map((e) => {
        e.canEdit = e.author === this.authService.user$.value?.uid;
        return e;
      });
    } catch (e) {
      this._msg.error('Ошибка: ' + e);
    } finally {
      this.isLoading$.next(false);
    }
  }

  openReceipt(uid: string) {
    this._router.navigate(['receipt', { uid: uid, mode: 'view' }]);
  }

  editReceipt(uid: string) {
    const [receipt] = this.receipts.filter((e: any) => e.uid === uid);
    this.comp?.show(receipt);
  }
}
