import { Component, OnInit } from '@angular/core';
import { LivroService, Livro } from '../../services/livro.service';
import { Router } from '@angular/router'; // Importa o Router para navegação

@Component({
  selector: 'app-busca-livros',
  templateUrl: './busca-livros.component.html',
  styleUrls: ['./busca-livros.component.css']
})
export class BuscaLivrosComponent implements OnInit {
  query: string = ''; // A variável que armazena o texto da pesquisa
  livros: Livro[] = []; // Lista de livros a serem exibidos
  isLoading: boolean = false; // Flag para mostrar carregamento

  constructor(private livroService: LivroService, private router: Router) {}

  ngOnInit(): void {
    // Inicialização do componente (opcional, por enquanto nada é carregado aqui)
  }

  // Função para remover acentos e tornar a comparação insensível a maiúsculas/minúsculas
  removerAcentosEConverterParaMinusculas(texto: string): string {
    return texto
      .normalize('NFD') // Normaliza para decompor os caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
      .toLowerCase(); // Converte para minúsculas
  }

  // Função para dividir a query em palavras e verificar se qualquer palavra está presente no nome ou autor
  verificarPalavrasChave(livro: Livro): boolean {
    const palavrasChave = this.query.trim().split(/\s+/); // Divide a query em palavras (espaços como delimitador)

    // Para depuração, adicione logs para ver como as palavras estão sendo processadas
    console.log('Palavras-chave:', palavrasChave);

    return palavrasChave.some(palavra => {
      const palavraNormalizada = this.removerAcentosEConverterParaMinusculas(palavra);
      // Para depuração, verifique como a busca está sendo feita
      console.log(`Buscando por: ${palavraNormalizada}`);
      return (
        this.removerAcentosEConverterParaMinusculas(livro.name).includes(palavraNormalizada) ||
        this.removerAcentosEConverterParaMinusculas(livro.author).includes(palavraNormalizada)
      );
    });
  }

  // Método para buscar livros
  buscarLivros(): void {
    if (this.query.trim() === '') {
      this.livros = []; // Limpa os resultados se a busca estiver vazia
      return;
    }

    this.isLoading = true; // Ativa o carregamento enquanto busca os dados
    this.livroService.getLivros().subscribe(
      (livros: Livro[]) => {
        // Para depuração, adicione um log para ver como os livros estão sendo filtrados
        console.log('Livros recebidos:', livros);
        this.livros = livros.filter(livro => this.verificarPalavrasChave(livro));
        console.log('Livros filtrados:', this.livros);
        this.isLoading = false; // Desativa o carregamento após os dados serem recebidos
      },
      error => {
        console.error('Erro ao buscar livros:', error);
        this.isLoading = false; // Desativa o carregamento em caso de erro
      }
    );
  }

  // Método para navegar para a página de detalhes do livro
  navegarParaDetalhes(livroId: number): void {
    this.router.navigate([`/livro/${livroId}`]);
  }
}
