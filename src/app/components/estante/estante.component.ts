import { Component, OnInit } from '@angular/core';
import { LivroService, Livro } from 'src/app/services/livro.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estante',
  templateUrl: './estante.component.html',
  styleUrls: ['./estante.component.css']
})
export class EstanteComponent implements OnInit {
  livros: Livro[] = [];
  userName: string | null = null;

  constructor(
    private livroService: LivroService,
    private authService: AuthService, // Injeta o AuthService
    private router: Router
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

  carregarLivrosDaEstante(): void {
    this.livroService.getLivros().subscribe(
      (data) => {
        // Filtra os livros para exibir apenas os publicados pelo usuário logado
        this.livros = data
          .filter((livro: Livro) => livro.usuarioPublicador === this.userName)
          .sort((a: Livro, b: Livro) => (b.id || 0) - (a.id || 0));
      },
      (error) => console.error('Erro ao carregar livros da estante:', error)
    );
  }

  navegarParaDetalhes(id: number): void {
    this.router.navigate(['/livro', id]);
  }
}
