import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-add-receipt-modal',
  templateUrl: './add-receipt-modal.component.html',
  styleUrls: ['./add-receipt-modal.component.css'],
})
export class AddReceiptModalComponent implements OnInit {
  isVisible$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  ngOnInit(): void {}

  show() {
    this.isVisible$.next(true);
  }

  hide() {
    this.isVisible$.next(false);
  }
}
