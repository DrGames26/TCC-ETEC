import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CadastroUsuarioService } from '../../services/cadastro-usuario.service';
import { LivroService } from '../../services/livro.service';
import { User } from '../../services/user.model'; // Certifique-se de que o caminho esteja correto

@Component({
  selector: 'app-adm',
  templateUrl: './adm.component.html',
  styleUrls: ['./adm.component.css']
})
export class AdmComponent implements OnInit {
  users: User[] = [];
  books: any[] = [];
  isAuthorized = false;

  constructor(
    private authService: AuthService,
    private cadastroUsuarioService: CadastroUsuarioService,
    private livroService: LivroService
  ) {}

  ngOnInit(): void {
    // Verifica se o usuário está autorizado
    if (this.authService.isAuthorized()) {
      this.isAuthorized = true;
      // Carrega os dados apenas se o usuário for autorizado
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

  // Editar e excluir usuário
  editUser(user: User) {
    console.log('Editar usuário', user);
  }

  deleteUser(userEmail: string): void {
    // Chame o serviço de exclusão de usuários e passe o email ou outro identificador
    this.cadastroUsuarioService.deleteUserByEmail(userEmail).subscribe(response => {
      // Lógica após a exclusão
    });
  }

  // Editar e excluir livro
  editBook(book: any) {
    console.log('Editar livro', book);
  }

  deleteBook(bookId: number) {
    console.log('Excluir livro', bookId);
  }
}
