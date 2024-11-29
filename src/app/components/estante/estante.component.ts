import { Component, OnInit } from '@angular/core';
import { Livro, LivroService } from 'src/app/services/livro.service';
import { AuthService } from 'src/app/services/auth.service'; // Importando o AuthService

@Component({
  selector: 'app-estante',
  templateUrl: './estante.component.html',
  styleUrls: ['./estante.component.css'],
})
export class EstanteComponent implements OnInit {
  livros: Livro[] = [];
  bookToEdit: Livro = {
    id: 0,
    name: '',
    author: '',
    genre: '',
    description: '',
  };

  constructor(
    private livroService: LivroService,
    private authService: AuthService // Injetando o AuthService
  ) {}

  ngOnInit(): void {
    this.carregarLivros();
  }

  carregarLivros(): void {
    const usuarioLogado = this.authService.getUser(); // Obtendo o usuário logado
    if (usuarioLogado) {
      const usuarioPublicador = usuarioLogado.name; // Usando o nome do usuário logado como o publicador
      this.livroService.getBooksByUsuarioPublicador(usuarioPublicador).subscribe(
        (data) => {
          this.livros = data;
        },
        (error) => {
          console.error('Erro ao carregar livros do usuário', error);
        }
      );
    }
  }

  editarLivro(livro: Livro): void {
    this.bookToEdit = { ...livro };
  }

  salvarEdicao(): void {
    this.livroService.updateBook(this.bookToEdit).subscribe(() => {
      this.carregarLivros();
      const modal = document.getElementById('editBookModal') as HTMLElement;
      modal?.classList.remove('show');
    });
  }

  confirmarExclusao(livro: Livro): void {
    this.bookToEdit = livro;
  }

  excluirLivro(): void {
    if (this.bookToEdit.id) {
      this.livroService.deleteBook(this.bookToEdit.id).subscribe(() => {
        this.carregarLivros();
        const modal = document.getElementById('deleteBookModal') as HTMLElement;
        modal?.classList.remove('show');
      });
    }
  }
}
