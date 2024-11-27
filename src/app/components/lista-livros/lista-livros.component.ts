import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LivroService, Livro } from 'src/app/services/livro.service';

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent implements OnInit {
  livros: Livro[] = [];

  constructor(private livroService: LivroService, private router: Router) {}

  ngOnInit(): void {
    this.carregarLivros();
  }

  carregarLivros(): void {
    this.livroService.getLivros().subscribe(
      (data: Livro[]) => {
        this.livros = data.map((livro) => {
          // Configura fallback para imagem e outros dados opcionais
          if (livro.picture) {
            livro.picture = this.convertToBase64(livro.picture);
          }
          return livro;
        });

        // Ordena os livros por ID em ordem decrescente
        this.livros.sort((a, b) => b.id - a.id);
      },
      (error) => console.error('Erro ao carregar livros:', error)
    );
  }

  convertToBase64(base64String: string): string {
    // Retorna a string Base64 diretamente
    return base64String;
  }

  navegarParaDetalhes(id: number): void {
    this.router.navigate(['/livro', id]);
  }
}
