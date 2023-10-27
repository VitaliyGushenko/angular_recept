import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ReceiptService } from 'src/app/services/receipt.service';

@Component({
  selector: 'app-add-receipt-modal',
  templateUrl: './add-receipt-modal.component.html',
  styleUrls: ['./add-receipt-modal.component.css'],
})
export class AddReceiptModalComponent implements OnInit {
  isVisible$ = new BehaviorSubject<boolean>(false);
  isLoading$ = new BehaviorSubject<boolean>(false);
  public form: FormGroup;
  receipt: any;
  @Output() update = new EventEmitter<void>();

  constructor(
    private readonly _msg: NzMessageService,
    private fb: FormBuilder,
    public authService: AuthService,
    private receiptService: ReceiptService
  ) {
    this.form = this.generateFormBuilder();
  }

  ngOnInit(): void {}

  show(receipt?: any) {
    this.receipt = receipt;
    this.form = this.generateFormBuilder();
    this.isVisible$.next(true);
  }

  hide() {
    this.isVisible$.next(false);
  }

  generateFormBuilder() {
    return this.fb.group({
      name: [this.receipt?.name ?? '', [Validators.required]],
      description: [this.receipt?.description ?? '', [Validators.required]],
    });
  }

  async sendForm() {
    const data = {
      ...this.form.value,
      author: this.authService.user$.value.uid,
      authorLogin: this.authService.user$.value.login,
    };

    try {
      this.isLoading$.next(true);

      !this.receipt
        ? await this.receiptService.addReceipt(data)
        : await this.receiptService.edit(data, this.receipt.uid);
      this._msg.success(
        `Рецепт успешно ${!this.receipt ? 'добавлен' : 'изменен'} `
      );

      this.update.next();

      this.hide();
    } catch (e) {
      this._msg.error('Ошибка: ' + e);
    } finally {
      this.isLoading$.next(false);
    }
  }
}
