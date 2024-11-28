import { Component, OnInit } from '@angular/core';
import { LivroService, Livro } from 'src/app/services/livro.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estante',
  templateUrl: './estante.component.html',
  styleUrls: ['./estante.component.css']
})
export class EstanteComponent implements OnInit {
  livros: Livro[] = [];
  userName: string | null = null;
  bookToEdit: Livro | null = null;

  constructor(
    private livroService: LivroService,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal // Adicionado o serviço NgbModal
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.name;
      this.carregarLivrosDaEstante();
    } else {
      console.error("Usuário não autenticado.");
    }
  }

  carregarLivrosDaEstante(): void {
    this.livroService.getLivros().subscribe(
      (data) => {
        this.livros = data
          .filter((livro: Livro) => livro.usuarioPublicador === this.userName)
          .sort((a: Livro, b: Livro) => (b.id || 0) - (a.id || 0));
      },
      (error) => console.error('Erro ao carregar livros da estante:', error)
    );
  }

  openEditBookModal(livro: Livro, content: any): void {
    this.bookToEdit = { ...livro }; // Cria uma cópia do livro para edição
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  updateBook(): void {
    if (this.bookToEdit) {
      this.livroService.updateBook(this.bookToEdit).subscribe(
        () => {
          this.carregarLivrosDaEstante(); // Atualiza a lista de livros após a edição
          alert('Livro atualizado com sucesso.');
        },
        (error) => console.error('Erro ao atualizar livro:', error)
      );
    }
  }

  openDeleteBookModal(livro: Livro, content: any): void {
    this.bookToEdit = livro; // Armazena o livro a ser excluído
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        if (result === 'confirm') {
          this.deleteBook(); // Chama a exclusão do livro
        }
      },
      () => {
        this.bookToEdit = null;
      }
    );
  }

  deleteBook(): void {
    if (this.bookToEdit) {
      this.livroService.deleteBook(this.bookToEdit.id).subscribe(
        () => {
          this.carregarLivrosDaEstante(); // Atualiza a lista de livros após a exclusão
          alert('Livro excluído com sucesso.');
        },
        (error) => console.error('Erro ao excluir livro:', error)
      );
    }
  }
}
