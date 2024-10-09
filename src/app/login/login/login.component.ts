import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPopup: boolean = true; // Exibe o popup ao carregar
  showError: boolean = false; // Controla a exibição da mensagem de erro
  errorMessage: string = '';  // Armazena a mensagem de erro

  constructor(private fb: FormBuilder) {
    // Define o formulário de login com validação de campos obrigatórios
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Verifica se o popup já foi mostrado e realiza outras ações se necessário
    this.showPopup = true; // Exibe o popup ao carregar
  }

  login() {
    // Verifica se o formulário está preenchido corretamente
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
      this.showError = true;
      return;
    }

    const { email, password } = this.loginForm.value;

    // Simulação de verificação de e-mail e senha
    if (email !== 'usuario@exemplo.com' || password !== 'senha123') {
      this.errorMessage = 'Login ou senha incorretos. Verifique novamente.';
      this.showError = true;
    } else {
      this.closePopup();  
      console.log('Login bem-sucedido!');
    }
  }

  closePopup() {
    this.showPopup = false;
    sessionStorage.setItem('popupShown', 'true');
  }
}
