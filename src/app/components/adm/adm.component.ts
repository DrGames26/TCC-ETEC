import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
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
  userToDelete: User | null = null;
  bookToDelete: any | null = null;
  userToEdit: User | null = null;
  bookToEdit: any | null = null;

  // Referências aos modais de edição
  @ViewChild('editUserModal') editUserModal!: TemplateRef<any>;
  @ViewChild('editBookModal') editBookModal!: TemplateRef<any>;

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

  openEditUserModal(user: User) {
    this.userToEdit = { ...user };
    this.modalService.open(this.editUserModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  openEditBookModal(book: any) {
    this.bookToEdit = { ...book };
    this.modalService.open(this.editBookModal, { ariaLabelledBy: 'modal-basic-title' });
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

  openDeleteBookModal(book: any, content: any) {
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

  deleteBook(bookId: number): void {
    this.livroService.deleteLivro(bookId).subscribe(() => {
      this.books = this.books.filter(book => book.id !== bookId);
    });
  }

  saveUserChanges(): void {
    if (this.userToEdit) {
      this.cadastroUsuarioService.updateUser(this.userToEdit).subscribe(() => {
        this.users = this.users.map(user => (user.email === this.userToEdit?.email ? this.userToEdit : user));
      });
    }
  }

  saveBookChanges(): void {
    if (this.bookToEdit) {
      this.livroService.updateLivro(this.bookToEdit).subscribe(() => {
        this.books = this.books.map(book => (book.id === this.bookToEdit?.id ? this.bookToEdit : book));
      });
    }
  }
}
