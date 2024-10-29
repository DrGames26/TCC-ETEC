import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';  // Import Router

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  showPopup: boolean = false;
  showError: boolean = false;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.showError = false;
  }

  login() {
    if (this.loginForm.invalid) {
      this.showError = true;
      this.errorMessage = 'Preencha todos os campos corretamente!';
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe(
      (response: any) => {
        console.log('User logged in', response);
        // Redirecionar para a página de perfil com os dados do usuário
        this.router.navigate(['/perfil'], { state: { user: response } });
        this.closePopup();
      },
      (error: any) => {
        this.showError = true;
        this.errorMessage = 'Erro ao fazer login. Tente novamente.';
      }
    );
  }
}
