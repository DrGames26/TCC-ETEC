import { Component, OnInit } from '@angular/core';
import { LivroService } from '../../services/livro.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Livro } from '../../services/livro.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-estante',
  templateUrl: './estante.component.html',
  styleUrls: ['./estante.component.css']
})
export class EstanteComponent implements OnInit {
  livros: Livro[] = [];
  user: any = null; // Alterado para user em vez de userName
  bookToEdit: Livro | null = null;
  livroToDelete: Livro | null = null;

  constructor(
    private livroService: LivroService,
    private modalService: NgbModal,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadLivros();
    this.user = this.authService.getUser(); // Alterado para pegar o usuário completo
  }

  private loadLivros() {
    if (this.user) {
      this.livroService.getBooksByUsuarioPublicador(this.user.name).subscribe((livros) => {
        this.livros = livros;
      });
    }
  }

  navegarParaDetalhes(livroId: number) {
    console.log('Ver detalhes do livro com ID:', livroId);
  }

  openEditBookModal(livro: Livro, content: any) {
    this.bookToEdit = { ...livro };
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  openDeleteBookModal(livro: Livro, content: any) {
    this.livroToDelete = livro;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        if (result === 'confirm' && this.livroToDelete) {
          this.deleteBook(this.livroToDelete.id);
        }
      },
      () => {}
    );
  }

  deleteBook(bookId: number) {
    this.livroService.deleteBook(bookId).subscribe(() => {
      this.livros = this.livros.filter(livro => livro.id !== bookId);
    });
  }

  saveBookChanges() {
    if (this.bookToEdit) {
      this.livroService.updateBook(this.bookToEdit).subscribe(() => {
        this.loadLivros();
      });
    }
  }
}
