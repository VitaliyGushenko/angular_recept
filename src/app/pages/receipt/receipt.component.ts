import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, map, merge, Subject } from 'rxjs';
import { ReceiptService } from 'src/app/services/receipt.service';
// import { FormControl, FormRecord, Validators } from '@angular/forms';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css'],
})
export class ReceiptComponent implements OnInit {
  receipt: any;
  viewMode: boolean = true;
  isLoading$ = new BehaviorSubject<boolean>(false);
  // validateForm: FormRecord<FormControl<string>> = this.fb.record({});
  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _receiptService: ReceiptService,
    private readonly _msg: NzMessageService
  ) {}

  async ngOnInit(): Promise<void> {
    const uid = this._activatedRoute.snapshot.params['uid'];

    this.viewMode = this._activatedRoute.snapshot.params['mode'] === 'view';

    try {
      this.isLoading$.next(true);
      uid && (this.receipt = await this.loadData(uid));
    } catch (e) {
      this._msg.error('Ошибка: ' + e);
    } finally {
      this.isLoading$.next(false);
    }
  }

  async loadData(uid: string) {
    return this._receiptService.getReceipt(uid);
  }
}
