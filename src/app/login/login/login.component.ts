import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPopup: boolean = false; // Inicialmente, o popup não será exibido
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
    // Verifica se o popup já foi mostrado anteriormente
    const popupShown = sessionStorage.getItem('popupShown');
    
    if (!popupShown) {
      // Exibe o popup após 2 segundos na primeira vez que a página é carregada
      setTimeout(() => {
        this.showPopup = true;
      }, 2000);
    }
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
    sessionStorage.setItem('popupShown', 'true'); // Salva o estado no navegador
  }

  // Método para abrir o popup ao clicar no submenu "Login"
  openPopup() {
    this.showPopup = true;
  }
}
