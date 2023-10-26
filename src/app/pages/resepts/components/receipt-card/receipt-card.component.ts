import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-receipt-card',
  templateUrl: './receipt-card.component.html',
  styleUrls: ['./receipt-card.component.css'],
})
export class ReceiptCardComponent implements OnInit {
  @Input() receipt: any;

  constructor() {}

  ngOnInit(): void {}
}
