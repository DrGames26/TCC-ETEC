import { Component, OnInit } from '@angular/core';
import { LivroService, Livro } from '../../services/livro.service';
import { Router } from '@angular/router';  // Importa o Router para navegação

@Component({
  selector: 'app-busca-livros',
  templateUrl: './busca-livros.component.html',
  styleUrls: ['./busca-livros.component.css']
})
export class BuscaLivrosComponent implements OnInit {
  query: string = '';  // A variável que armazena o texto da pesquisa
  livros: Livro[] = [];  // Lista de livros a serem exibidos
  isLoading: boolean = false;  // Flag para mostrar carregamento

  constructor(private livroService: LivroService, private router: Router) {}

  ngOnInit(): void {
    // Inicialização do componente (opcional, por enquanto nada é carregado aqui)
  }

  // Método para buscar livros
  buscarLivros(): void {
    if (this.query.trim() === '') {
      this.livros = [];  // Limpa os resultados se a busca estiver vazia
      return;
    }

    this.isLoading = true;  // Ativa o carregamento enquanto busca os dados
    this.livroService.getLivros()
      .subscribe(
        (livros: Livro[]) => {
          this.livros = livros.filter(livro => 
            livro.name.toLowerCase().includes(this.query.toLowerCase()) ||
            livro.author.toLowerCase().includes(this.query.toLowerCase())
          );
          this.isLoading = false;  // Desativa o carregamento após os dados serem recebidos
        },
        (error) => {
          console.error('Erro ao buscar livros:', error);
          this.isLoading = false;  // Desativa o carregamento em caso de erro
        }
      );
  }

  // Método para navegar para a página de detalhes do livro
  navegarParaDetalhes(livroId: number): void {
    this.router.navigate([`/livro/${livroId}`]);
  }
  
}
