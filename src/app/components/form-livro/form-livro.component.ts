import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LivroService, Livro } from 'src/app/services/livro.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-form-livro',
  templateUrl: './form-livro.component.html',
  styleUrls: ['./form-livro.component.css']
})
export class FormLivroComponent {
  novoLivro: Livro = {
    name: '',
    author: '', 
    genre: '',
    description: '',
    picture: '',
    usuarioPublicador: '' 
  };

  errorMessage: string = '';

  constructor(
    private livroService: LivroService, 
    private authService: AuthService,
    private router: Router
  ) {}

  adicionarLivro(): void {
    // Verifica se o usuário está logado
    if (!this.authService.isLoggedIn()) {
      this.errorMessage = 'Você precisa estar logado para adicionar um livro.';
      return;
    }

    // Pega o nome do usuário logado
    const usuarioLogado = this.authService.getUser();
    if (!usuarioLogado || !usuarioLogado.name) {
      this.errorMessage = 'Erro ao identificar o usuário logado. Tente novamente.';
      return;
    }

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!this.novoLivro.name || !this.novoLivro.author ||
        !this.novoLivro.genre || !this.novoLivro.description || !this.novoLivro.picture) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    // Define `usuarioPublicador` com o nome do usuário logado
    const livroComPostagem = { 
      ...this.novoLivro,
      usuarioPublicador: usuarioLogado.name
    };

    // Envia o livro para o serviço
    this.livroService.addLivro(livroComPostagem).subscribe(
      (livro) => {
        console.log('Livro adicionado com sucesso:', livro);
        this.novoLivro = { name: '', author: '', genre: '', description: '', picture: '', usuarioPublicador: '' }; // Reinicia todos os campos
        this.errorMessage = ''; // Limpa a mensagem de erro
        this.router.navigate(['/livros']); // Redireciona para a página de livros
      },
      (error) => {
        console.error('Erro ao adicionar livro:', error);
        this.errorMessage = 'Erro ao adicionar livro. Tente novamente mais tarde.'; // Mensagem de erro genérica
      }
    );
  }
}
