import { Component, OnInit } from '@angular/core';
import { LivroService, Livro } from 'src/app/services/livro.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-estante',
  templateUrl: './estante.component.html',
  styleUrls: ['./estante.component.css']
})
export class EstanteComponent implements OnInit {
  livros: Livro[] = [];
  userName: string | null = null;
  livroToDelete: Livro | null = null;
  livroToEdit: Livro | null = null;  // Para armazenar o livro sendo editado

  constructor(
    private livroService: LivroService,
    private authService: AuthService, // Injeta o AuthService
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser(); // Obtém o usuário logado
    if (user) {
      this.userName = user.name; // Atribui o nome do usuário logado
      this.carregarLivrosDaEstante();
    } else {
      console.error("Usuário não autenticado.");
    }
  }

  private carregarLivrosDaEstante() {
    this.livroService.getLivros().subscribe((livros) => {
      // Filtra os livros para mostrar apenas os do usuário logado
      this.livros = livros.filter(livro => livro.usuarioPublicador === this.userName);
    });
  }

  openEditBookModal(livro: Livro, content: any) {
    // Atribui o livro a ser editado
    this.livroToEdit = livro;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  openDeleteBookModal(livro: Livro, content: any) {
    this.livroToDelete = livro;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        if (result === 'confirm') {
          this.deleteBook(livro.id);
        }
      },
      () => {
        this.livroToDelete = null;
      }
    );
  }

  deleteBook(bookId: number) {
    this.livroService.deleteBook(bookId).subscribe(() => {
      this.livros = this.livros.filter(livro => livro.id !== bookId);
    });
  }

  updateBook(livro: Livro) {
    // Chama o método updateBook do serviço para atualizar o livro
    if (this.livroToEdit) {
      this.livroService.updateBook(this.livroToEdit).subscribe((updatedLivro) => {
        // Atualiza o livro na lista local
        const index = this.livros.findIndex(l => l.id === updatedLivro.id);
        if (index !== -1) {
          this.livros[index] = updatedLivro;
        }
      });
    }
  }

  navegarParaDetalhes(bookId: number) {
    this.router.navigate([`/livro/${bookId}`]);
  }
}
