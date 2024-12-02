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
  livrosCarregados: boolean = false; // Controle para evitar chamadas repetidas

  constructor(private livroService: LivroService, private router: Router) {}

  ngOnInit(): void {
    // Tenta carregar os livros do localStorage primeiro
    const livrosSalvos = this.livroService.getFromLocalStorage();
    if (livrosSalvos.length > 0) {
      this.livros = livrosSalvos;
      console.log('Livros carregados do localStorage:', this.livros);
    }

    // Verifica se os livros já foram carregados da API anteriormente
    if (!this.livrosCarregados) {
      // Busca livros da API apenas se não estiverem presentes no localStorage ou se forem antigos
      this.livroService.getLivros().subscribe(
        (data: Livro[]) => {
          // Verifica se os livros obtidos da API são diferentes dos do localStorage
          const livrosDoLocalStorage = this.livroService.getFromLocalStorage();
          if (JSON.stringify(livrosDoLocalStorage) !== JSON.stringify(data)) {
            this.livros = data.map((livro) => {
              if (livro.picture) {
                if (!livro.picture.startsWith('data:image')) {
                  livro.picture = 'data:image/jpeg;base64,' + livro.picture;
                }
              }
              return livro;
            }).sort((a, b) => b.id - a.id);

            console.log('Livros carregados da API:', this.livros);

            // Salva os livros da API no localStorage
            this.livroService.saveToLocalStorage(this.livros);
            this.livrosCarregados = true; // Marca como carregado
          } else {
            console.log('Os livros no localStorage já estão atualizados.');
          }
        },
        (error) => console.error('Erro ao carregar livros:', error)
      );
    }
  }

  // Método para navegar para a página de detalhes do livro
  navegarParaDetalhes(id: number): void {
    this.router.navigate(['/livro', id]);
  }
}
