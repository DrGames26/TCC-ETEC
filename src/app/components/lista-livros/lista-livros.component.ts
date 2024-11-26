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

  constructor(private livroService: LivroService, private router: Router) {}

  ngOnInit(): void {
    this.carregarLivros();
  }

  carregarLivros(): void {
    this.livroService.getLivros().subscribe(
      (data) => {
        // Converte o byte[] para base64
        this.livros = data.map((livro: Livro) => {
          if (livro.picture) {
            livro.picture = this.convertToBase64(livro.picture);
          }
          return livro;
        });

        // Ordena os livros por ID do maior para o menor
        this.livros.sort((a: Livro, b: Livro) => (b.id || 0) - (a.id || 0));
      },
      (error) => console.error('Erro ao carregar livros:', error)
    );
  }

  convertToBase64(byteArray: any): string {
    let binaryString = '';
    const bytes = new Uint8Array(byteArray);
    bytes.forEach((byte) => {
      binaryString += String.fromCharCode(byte);
    });
    return btoa(binaryString);
  }

  navegarParaDetalhes(id: number): void {
    this.router.navigate(['/livro', id]);
  }
}
