import { Component, OnInit } from '@angular/core';
import { UserCredential } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/services/auth.service';

enum TypeForm {
  LOGIN = 'login',
  REGISTER = 'register',
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  typeForm: any = TypeForm.LOGIN;

  constructor(
    private readonly _msg: NzMessageService,
    private fb: FormBuilder,
    public authService: AuthService,
    private _router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    console.log('ЛОГИН');
  }

  async sendForm() {
    try {
      console.log(this.form.value);
      if (this.typeForm === TypeForm.REGISTER) {
        const data: UserCredential = await this.authService.doRegister(
          this.form.value
        );
        console.log(data);
        this._msg.success('Пользователь успешно создан');
        this.navigateHome();
      } else {
        const a = await this.authService.enter(this.form.value);
        this._msg.success('Вход выполнен успешно');
        this.navigateHome();
      }
    } catch (e: any) {
      this._msg.error('Ошибка: ', e);
    } finally {
    }
  }

  navigateHome() {
    this._router.navigate(['/']);
  }
}
