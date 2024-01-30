import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  emails = [
    "example@test.com",
    "example2@test.com",
    "example3@test.com",
    "example4@test.com",
    "example5@test.com"
  ];
  constructor(
    private authService: AuthService,
    public activeModal: NgbActiveModal
  ) {}

  login(email: string): void {
    this.authService.login(email);
    this.activeModal.close();
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
