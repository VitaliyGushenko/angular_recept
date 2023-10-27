import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ReceiptService } from 'src/app/services/receipt.service';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.css'],
})
export class EditUserModalComponent implements OnInit {
  isVisible$ = new BehaviorSubject<boolean>(false);
  isLoading$ = new BehaviorSubject<boolean>(false);
  public form: FormGroup;
  user: any;
  @Output() updateUser = new EventEmitter<void>();

  constructor(
    private readonly _msg: NzMessageService,
    private fb: FormBuilder,
    public authService: AuthService,
    private receiptService: ReceiptService
  ) {
    this.form = this.generateFormBuilder();
  }

  ngOnInit(): void {}

  generateFormBuilder() {
    return this.fb.group({
      email: new FormControl(
        {
          value: this.user?.email,
          disabled: true,
        },
        [Validators.required]
      ),
      login: new FormControl(
        {
          value: this.user?.login ?? '',
          disabled: this.user?.login ? true : false,
        },
        [Validators.required]
      ),
    });
  }

  show(user?: any) {
    this.user = user;
    this.form = this.generateFormBuilder();
    this.isVisible$.next(true);
  }

  hide() {
    this.isVisible$.next(false);
  }

  async sendForm() {
    try {
      this.isLoading$.next(true);

      const data = {
        ...this.form.value,
      };

      await this.authService.addUserInCollection(
        data,
        this.authService.user$.value.uid
      );

      this._msg.success('Профиль успешно изменен');

      this.updateUser.next();
      this.form.reset();

      this.hide();
    } catch (e) {
      this._msg.error('Ошибка: ' + e);
    } finally {
      this.isLoading$.next(false);
    }
  }
}
