import { Component } from '@angular/core';
import { LivroService, Livro } from '../../services/livro.service';

@Component({
  selector: 'app-livros',
  templateUrl: './livros.component.html',
  styleUrls: ['./livros.component.css']
})
export class LivrosComponent {
  searchQuery: string = '';
  livros: Livro[] = [];

  constructor(private livroService: LivroService) {}

  // Método para pesquisar livros
  onSearch(): void {
    if (this.searchQuery.trim()) {
      // Chama a API com a query de pesquisa
      this.livroService.searchLivros(this.searchQuery).subscribe(
        (resultados) => {
          this.livros = resultados;
        },
        (erro) => {
          console.error('Erro ao buscar livros:', erro);
        }
      );
    } else {
      // Caso a pesquisa esteja vazia, recarrega todos os livros
      this.loadAllBooks();
    }
  }

  // Método para carregar todos os livros
  loadAllBooks(): void {
    this.livroService.getLivros().subscribe(
      (resultados) => {
        this.livros = resultados;
      },
      (erro) => {
        console.error('Erro ao carregar livros:', erro);
      }
    );
  }

  ngOnInit(): void {
    this.loadAllBooks();  // Carrega todos os livros ao iniciar
  }
}
