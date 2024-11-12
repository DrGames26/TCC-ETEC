import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { CadastroUsuarioService } from '../../services/cadastro-usuario.service';
import { LivroService } from '../../services/livro.service';
import { User } from '../../services/user.model';

@Component({
  selector: 'app-adm',
  templateUrl: './adm.component.html',
  styleUrls: ['./adm.component.css']
})
export class AdmComponent implements OnInit {
  users: User[] = [];
  books: any[] = [];
  isAuthorized = false;
  bookToEdit: any | null = null; // Livro selecionado para edição

  constructor(
    private authService: AuthService,
    private cadastroUsuarioService: CadastroUsuarioService,
    private livroService: LivroService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthorized()) {
      this.isAuthorized = true;
      this.cadastroUsuarioService.listarUsuarios().subscribe((users) => {
        this.users = users;
      });
      this.livroService.getLivros().subscribe((books) => {
        this.books = books;
      });
    } else {
      this.isAuthorized = false;
      alert('Você não tem permissão para acessar esta área.');
    }
  }

  openEditBookModal(book: any, content: any) {
    this.bookToEdit = { ...book }; // Clona os dados do livro para edição
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  saveEditedBook() {
    if (this.bookToEdit) {
      this.livroService.editLivro(this.bookToEdit).subscribe(() => {
        // Atualiza a lista de livros
        const index = this.books.findIndex((b) => b.id === this.bookToEdit!.id);
        if (index > -1) this.books[index] = { ...this.bookToEdit };
        this.bookToEdit = null;
        this.modalService.dismissAll();
      });
    }
  }
}
