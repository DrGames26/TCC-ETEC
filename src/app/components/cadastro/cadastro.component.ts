import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CadastroUsuarioService } from '../../services/cadastro-usuario.service';
import { AuthService } from '../../services/auth.service'; // Importe o AuthService
import { User } from '../../services/user.model';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  user: User = {
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    sex: '',
    profilePicture: '',
    phoneNumber: ''
  };

  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private cadastroUsuarioService: CadastroUsuarioService,
    private authService: AuthService, // Injete o AuthService
    private router: Router
  ) {}

  onSubmit() {
    this.errorMessage = ''; // Limpar erros anteriores
    this.successMessage = ''; // Limpar mensagens de sucesso

    // Validação dos campos
    if (!this.user.name) {
      this.errorMessage = 'O nome é obrigatório.';
      return;
    }
    if (!this.user.email) {
      this.errorMessage = 'O email é obrigatório.';
      return;
    }
    if (!this.isValidEmail(this.user.email)) {
      this.errorMessage = 'O email deve ser válido (ex: seuemail@gmail.com).';
      return;
    }
    if (!this.user.password) {
      this.errorMessage = 'A senha é obrigatória.';
      return;
    }
    if (!this.isValidPassword(this.user.password)) {
      this.errorMessage = 'A senha deve ter no mínimo 6 caracteres.';
      return;
    }
    if (!this.user.dateOfBirth) {
      this.errorMessage = 'A data de nascimento é obrigatória.';
      return;
    }
    if (!this.user.sex) {
      this.errorMessage = 'O gênero é obrigatório.';
      return;
    }

    // Chamada ao serviço para cadastrar o usuário
    this.cadastroUsuarioService.cadastrarUsuario(this.user).subscribe(
      (response: User) => {
        console.log('Usuário cadastrado com sucesso!', response);
        this.successMessage = 'Usuário cadastrado com sucesso!';
        this.errorMessage = ''; // Limpar mensagem de erro em caso de sucesso

        // Loga automaticamente após o cadastro
        this.authService.login({ email: this.user.email, password: this.user.password ?? '' }).subscribe(
          () => {
            this.router.navigate(['/perfil']); // Redireciona para a página de perfil
          },
          (error) => {
            console.error('Erro ao realizar login', error);
            this.errorMessage = 'Erro ao logar. Tente novamente mais tarde.'; // Mensagem de erro no login
          }
        );
      },
      (error: any) => {
        console.error('Erro ao cadastrar usuário', error);
        if (error.status === 409) {
          this.errorMessage = 'Email já cadastrado. Por favor, escolha outro.';
        } else {
          this.errorMessage = 'Erro ao cadastrar. Tente novamente mais tarde.';
        }
      }
    );
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  // Validação simples de senha (mínimo de 6 caracteres)
  private isValidPassword(password: string): boolean {
    return password.length >= 6;
  }
}
