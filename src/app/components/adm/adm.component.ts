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

  @ViewChild('editUserModal') editUserModal!: TemplateRef<any>;
  @ViewChild('editBookModal') editBookModal!: TemplateRef<any>;
  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;

  constructor(
    private authService: AuthService,
    private cadastroUsuarioService: CadastroUsuarioService,
    private livroService: LivroService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.checkAuthorization();
  }

  checkAuthorization(): void {
    if (this.authService.isAuthorized()) {
      this.isAuthorized = true;
      this.loadUsers();
      this.loadBooks();
    } else {
      this.isAuthorized = false;
      alert('Você não tem permissão para acessar esta área.');
    }
  }

  loadUsers(): void {
    this.cadastroUsuarioService.listarUsuarios().subscribe(
      (users) => (this.users = users),
      (error) => console.error('Erro ao carregar usuários:', error)
    );
  }

  loadBooks(): void {
    this.livroService.getLivros().subscribe(
      (books) => (this.books = books),
      (error) => console.error('Erro ao carregar livros:', error)
    );
  }

  openEditUserModal(user: User): void {
    this.userToEdit = { ...user };
    this.modalService.open(this.editUserModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  openEditBookModal(book: any): void {
    this.bookToEdit = { ...book };
    this.modalService.open(this.editBookModal, { ariaLabelledBy: 'modal-basic-title' });
  }

  openDeleteUserModal(user: User): void {
    this.userToDelete = user;
    this.modalService.open(this.deleteModal, { ariaLabelledBy: 'modal-basic-title' }).result.then(
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

  openDeleteBookModal(book: any): void {
    this.bookToDelete = book;
    this.modalService.open(this.deleteModal, { ariaLabelledBy: 'modal-basic-title' }).result.then(
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
    this.cadastroUsuarioService.deleteUserByEmail(userEmail).subscribe(
      () => {
        this.users = this.users.filter(user => user.email !== userEmail);
        alert('Usuário excluído com sucesso.');
      },
      (error) => console.error('Erro ao excluir usuário:', error)
    );
  }

  deleteBook(bookId: number): void {
    this.livroService.deleteLivro(bookId).subscribe(
      () => {
        this.books = this.books.filter(book => book.id !== bookId);
        alert('Livro excluído com sucesso.');
      },
      (error) => console.error('Erro ao excluir livro:', error)
    );
  }

  saveUserChanges(): void {
    if (this.userToEdit) {
      this.cadastroUsuarioService.updateUser(this.userToEdit).subscribe(
        () => {
          this.users = this.users.map(user => (user.email === this.userToEdit?.email ? this.userToEdit : user));
          alert('Usuário atualizado com sucesso.');
        },
        (error) => console.error('Erro ao atualizar usuário:', error)
      );
    }
  }

  saveBookChanges(): void {
    if (this.bookToEdit) {
      this.livroService.updateLivro(this.bookToEdit).subscribe(
        () => {
          this.books = this.books.map(book => (book.id === this.bookToEdit?.id ? this.bookToEdit : book));
          alert('Livro atualizado com sucesso.');
        },
        (error) => console.error('Erro ao atualizar livro:', error)
      );
    }
  }
}
