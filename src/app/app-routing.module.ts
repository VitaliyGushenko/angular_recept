import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ReceiptComponent } from './pages/receipt/receipt.component';
import { ReseptsComponent } from './pages/resepts/resepts.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'receipts', component: ReseptsComponent },
  { path: 'receipt', component: ReceiptComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
