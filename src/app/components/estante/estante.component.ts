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

  openEditBookModal(livro: Livro) {
    // Atribui o livro a ser editado
    this.livroToEdit = livro;
    this.modalService.open('#editBookModal', { ariaLabelledBy: 'modal-basic-title' });
  }

  openDeleteBookModal(livro: Livro) {
    this.livroToDelete = livro;
    this.modalService.open('#deleteModal', { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        if (result === 'confirm') {
          this.deleteBook();
        }
      },
      () => {
        this.livroToDelete = null;
      }
    );
  }

  deleteBook() {
    if (this.livroToDelete) {
      this.livroService.deleteBook(this.livroToDelete.id).subscribe(() => {
        this.livros = this.livros.filter(livro => livro.id !== this.livroToDelete?.id);
      });
    }
  }

  updateBook() {
    if (this.livroToEdit) {
      this.livroService.updateBook(this.livroToEdit).subscribe((updatedLivro) => {
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Aqui você pode processar o arquivo, por exemplo, convertê-lo para Base64 ou enviá-lo para o servidor
    }
  }
}
