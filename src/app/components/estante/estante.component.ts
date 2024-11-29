import { Component, OnInit } from '@angular/core';
import { Livro, LivroService } from 'src/app/services/livro.service';
import { AuthService } from 'src/app/services/auth.service'; 

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
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.carregarLivros();
  }

  carregarLivros(): void {
    this.livroService.getLivros().subscribe((data) => {
      const usuarioLogado = this.authService.getUser(); // Obtém o usuário logado
      if (usuarioLogado) {
        this.livros = data.filter((livro) => livro.usuarioPublicador === usuarioLogado.email);
      }
    });
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
