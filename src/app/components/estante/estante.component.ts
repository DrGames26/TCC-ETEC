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
  userName: string = ''; // Variável para armazenar o nome do usuário logado
  bookToEdit: Livro | null = null;
  livroToDelete: Livro | null = null; // Variável para armazenar o livro a ser deletado

  constructor(
    private livroService: LivroService,
    private modalService: NgbModal,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadLivros();
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.name;
    }
  }

  private loadLivros() {
    const user = this.authService.getUser();
    if (user) {
      this.livroService.getBooksByUsuarioPublicador(user.name).subscribe((livros) => {
        this.livros = livros;
      });
    }
  }

  // Método para navegar para a página de detalhes do livro
  navegarParaDetalhes(livroId: number) {
    console.log('Ver detalhes do livro com ID:', livroId);
  }

  // Abre o modal de edição do livro
  openEditBookModal(livro: Livro, content: any) {
    this.bookToEdit = { ...livro };  // Faz uma cópia do livro para edição
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  // Abre o modal de exclusão do livro
  openDeleteBookModal(livro: Livro, content: any) {
    this.livroToDelete = livro; // Armazena o livro a ser excluído
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        if (result === 'confirm' && this.livroToDelete) {
          this.deleteBook(this.livroToDelete.id);
        }
      },
      () => {}
    );
  }

  // Função de excluir o livro
  deleteBook(bookId: number) {
    this.livroService.deleteBook(bookId).subscribe(() => {
      this.livros = this.livros.filter(livro => livro.id !== bookId);
    });
  }

  // Função para salvar as alterações do livro
  saveBookChanges() {
    if (this.bookToEdit) {
      this.livroService.updateBook(this.bookToEdit).subscribe(() => {
        this.loadLivros(); // Atualiza a lista de livros após a edição
      });
    }
  }
}
