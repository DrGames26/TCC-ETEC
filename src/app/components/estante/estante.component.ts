import { Component, OnInit } from '@angular/core';
import { LivroService, Livro } from 'src/app/services/livro.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estante',
  templateUrl: './estante.component.html',
  styleUrls: ['./estante.component.css']
})
export class EstanteComponent implements OnInit {
  livros: Livro[] = [];
  user = { name: 'user.name' };

  constructor(private livroService: LivroService, private router: Router) {}

  ngOnInit(): void {
    this.carregarLivrosDaEstante();
  }

  carregarLivrosDaEstante(): void {
    this.livroService.getLivros().subscribe(
      (data) => {
        // Filtra os livros publicados pelo usuário logado e ordena por ID
        this.livros = data
          .filter((livro: Livro) => livro.usuarioPublicador === this.user.name)
          .sort((a: Livro, b: Livro) => (b.id || 0) - (a.id || 0));
      },
      (error) => console.error('Erro ao carregar livros da estante:', error)
    );
  }

  navegarParaDetalhes(id: number): void {
    this.router.navigate(['/livro', id]);
  }
}
