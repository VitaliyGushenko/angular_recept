import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, map, merge, Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
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
  public form: FormGroup;

  /**
   * Подписка если нужно кинуть обновление данных через урл
   */
  private _updateUrl = new Subject<{
    uid?: string;
    mode: string;
  }>();

  steps: {
    description: string;
  }[] = [];

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _receiptService: ReceiptService,
    private readonly _msg: NzMessageService,
    private readonly _authService: AuthService,
    private readonly _router: Router,
    private readonly _ref: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.form = this.generateFormBuilder();
  }

  async ngOnInit(): Promise<void> {
    merge(this._activatedRoute.queryParams, this._updateUrl)
      .pipe(
        map((e) => ({
          uid: e.uid,
          mode: e.mode,
        }))
      )
      .subscribe(async ({ uid, mode }) => {
        const uidReceipt = uid ?? this._activatedRoute.snapshot.params['uid'];

        this.viewMode = mode
          ? mode === 'view'
          : this._activatedRoute.snapshot.params['mode'] === 'view';

        try {
          this.isLoading$.next(true);
          uidReceipt && (this.receipt = await this.loadData(uidReceipt));
        } catch (e) {
          this._msg.error('Ошибка: ' + e);
        } finally {
          this.isLoading$.next(false);
        }
      });
  }

  async addReceipt() {
    const data = {
      ...this.form.getRawValue(),
      author: this._authService.user$.value?.uid,
      authorLogin: this._authService.user$.value?.login,
      steps: this.steps,
    };

    // await this.receiptService.edit(data, this.receipt.uid);
    try {
      this.isLoading$.next(true);
      const uid = await this._receiptService.addReceipt(data);
      this._msg.success('Рецепт успешно добавлен');

      this._updateUrl.next({
        uid: uid,
        mode: 'view',
      });
      this._router.navigate(['receipt', { uid: uid, mode: 'view' }]);
    } catch (e) {
      this._msg.error('Ошибка: ' + e);
    } finally {
      this.isLoading$.next(false);
    }
  }

  addStep() {
    this.steps.push({
      description: '',
    });
  }

  removeStep(i: number) {
    this.steps.splice(i, 1);
  }

  async loadData(uid: string) {
    return this._receiptService.getReceipt(uid);
  }

  generateFormBuilder() {
    return this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }
}
