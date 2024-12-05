import { Component, OnInit } from '@angular/core';
import { LivroService } from '../../services/livro.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  livros: any[] = []; // Armazena os livros para exibição
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
        (data: any) => {
          // Verifica se os livros obtidos da API são diferentes dos do localStorage
          const livrosDoLocalStorage = this.livroService.getFromLocalStorage();
          if (JSON.stringify(livrosDoLocalStorage) !== JSON.stringify(data)) {
            this.livros = data.map((livro: any) => {
              if (livro.picture) {
                if (!livro.picture.startsWith('data:image')) {
                  livro.picture = 'data:image/jpeg;base64,' + livro.picture;
                }
              }
              return livro;
            }).sort((a: any, b: any) => (b.id || 0) - (a.id || 0));

            console.log('Livros carregados da API:', this.livros);

            // Salva os livros da API no localStorage
            this.livroService.saveToLocalStorage(this.livros);
            this.livrosCarregados = true; // Marca como carregado
          } else {
            console.log('Os livros no localStorage já estão atualizados.');
          }
        },
        (error) => {
          console.error('Erro ao carregar livros da API:', error);
        }
      );
    }
  }

  // Método para navegar para a página de detalhes do livro
  navegarParaDetalhes(livroId: number): void {
    this.router.navigate(['/livro', livroId]); 
  }
}
