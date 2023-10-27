import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject } from 'rxjs';
import { ReceiptService } from 'src/app/services/receipt.service';

@Component({
  selector: 'app-receipt-card',
  templateUrl: './receipt-card.component.html',
  styleUrls: ['./receipt-card.component.css'],
})
export class ReceiptCardComponent implements OnInit {
  isLoading$ = new BehaviorSubject<boolean>(false);
  @Input() receipt: any;
  @Output() update = new EventEmitter<void>();
  @Output() change = new EventEmitter<string>();

  constructor(
    private readonly _modal: NzModalService,
    private receiptService: ReceiptService,
    private readonly _msg: NzMessageService
  ) {}

  ngOnInit(): void {}

  edit() {
    this.change.next(this.receipt.uid);
  }

  remove() {
    this._modal.warning({
      nzTitle: `Вы действительно хотите удалить рецепт <b>${this.receipt.name}</b>?`,
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          this.isLoading$.next(true);
          await this.receiptService.remove(this.receipt.uid);
          this.update.next();
          this._msg.success('Рецепт успешно удален');
        } catch (error) {
        } finally {
          this.isLoading$.next(false);
        }
      },
    });
  }
}
