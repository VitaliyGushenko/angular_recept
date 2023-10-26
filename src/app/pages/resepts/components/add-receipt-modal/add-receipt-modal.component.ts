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
  @Input() data: any;
  @Output() update = new EventEmitter<void>();

  constructor(
    private readonly _msg: NzMessageService,
    private fb: FormBuilder,
    public authService: AuthService,
    private receiptService: ReceiptService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  show() {
    this.isVisible$.next(true);
  }

  hide() {
    this.isVisible$.next(false);
  }

  async sendForm() {
    const data = {
      ...this.form.value,
      author: this.authService.user$.value.uid,
    };
    console.log(data);

    try {
      this.isLoading$.next(true);

      await this.receiptService.addReceipt(data);
      this.update.next();
      this._msg.success('Рецепт успешно добавлен');
      this.hide();
    } catch (e) {
      this._msg.error('Ошибка: ' + e);
    } finally {
      this.isLoading$.next(false);
    }
  }
}
