import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EditUserModalComponent } from '../edit-user-modal/edit-user-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @ViewChild(EditUserModalComponent, { static: false })
  private comp: EditUserModalComponent | undefined;
  /**
   * Открыто ли меню
   */
  public isVisibleMenu = false;

  constructor(public auth: AuthService, public router: Router) {}

  showUserProfile() {
    this.comp?.show(this.auth.user$.value);
  }

  ngOnInit(): void {}

  updateUser() {
    this.auth.initAuth();
  }
}
