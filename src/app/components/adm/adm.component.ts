import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { CadastroUsuarioService } from '../../services/cadastro-usuario.service';
import { LivroService, Livro } from '../../services/livro.service';
import { User } from '../../services/user.model';

@Component({
  selector: 'app-adm',
  templateUrl: './adm.component.html',
  styleUrls: ['./adm.component.css']
})
export class AdmComponent implements OnInit {
  users: User[] = [];
  books: Livro[] = [];
  isAuthorized = false;
  userToDelete: User | null = null;
  bookToDelete: Livro | null = null;
  bookToEdit: Livro | null = null;
  userToEdit: User | null = null;

  constructor(
    private authService: AuthService,
    private cadastroUsuarioService: CadastroUsuarioService,
    private livroService: LivroService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthorized()) {
      this.isAuthorized = true;
      this.loadUsers();
      this.loadBooks();
    } else {
      this.isAuthorized = false;
      alert('Você não tem permissão para acessar esta área.');
    }
  }

  private loadUsers() {
    this.cadastroUsuarioService.listarUsuarios().subscribe((users) => {
      this.users = users;
    });
  }

  private loadBooks() {
    this.livroService.getLivros().subscribe((books) => {
      this.books = books;
    });
  }

  openEditUserModal(user: User, content: any) {
    this.userToEdit = { ...user }; // Faz uma cópia do usuário para edição
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  openEditBookModal(book: Livro, content: any) {
    this.bookToEdit = { ...book };  // Fazendo uma cópia do livro para edição
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  openDeleteUserModal(user: User, content: any) {
    this.userToDelete = user;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        if (result === 'confirm') {
          this.deleteUser(user.email);
        }
      },
      () => {
        this.userToDelete = null;
      }
    );
  }

  openDeleteBookModal(book: Livro, content: any) {
    this.bookToDelete = book;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        if (result === 'confirm') {
          this.deleteBook(book.id);
        }
      },
      () => {
        this.bookToDelete = null;
      }
    );
  }

  deleteUser(userEmail: string): void {
    this.cadastroUsuarioService.deleteUserByEmail(userEmail).subscribe(() => {
      this.users = this.users.filter(user => user.email !== userEmail);
    });
  }

  deleteBook(bookId: number) {
    this.livroService.deleteBook(bookId).subscribe(() => {
      this.books = this.books.filter(book => book.id !== bookId);
    });
  }

  saveBookChanges() {
    if (this.bookToEdit) {
      this.livroService.updateBook(this.bookToEdit).subscribe(() => {
        this.loadBooks(); // Atualiza a lista de livros após a edição
      });
    }
  }

  saveUserChanges() {
    if (this.userToEdit) {
      this.cadastroUsuarioService.updateUser(this.userToEdit).subscribe(() => {
        this.loadUsers(); // Atualiza a lista de usuários após a edição
      });
    }
  }
}
