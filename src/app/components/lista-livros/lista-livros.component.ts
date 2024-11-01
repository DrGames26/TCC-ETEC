import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importa o Router
import { LivroService, Livro } from 'src/app/services/livro.service';

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent implements OnInit {
  livros: Livro[] = [];

  constructor(private livroService: LivroService, private router: Router) {} // Adiciona Router ao construtor

  ngOnInit(): void {
    this.carregarLivros();
  }

  carregarLivros(): void {
    this.livroService.getLivros().subscribe(
      (data) => {
        // Ordena os livros por ID do maior para o menor
        this.livros = data.sort((a: Livro, b: Livro) => (b.id || 0) - (a.id || 0));
      },
      (error) => console.error('Erro ao carregar livros:', error)
    );
  }

  navegarParaDetalhes(id: number): void {
    this.router.navigate(['/livro', id]);
  }
}
