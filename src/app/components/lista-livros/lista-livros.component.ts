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
    // Carrega os livros diretamente da API
    this.livroService.getLivros().subscribe(
      (data: Livro[]) => {
        this.livros = data.map((livro) => {
          if (livro.picture && !livro.picture.startsWith('data:image')) {
            livro.picture = 'data:image/jpeg;base64,' + livro.picture;
          }
          return livro;
        }).sort((a, b) => b.id - a.id);

        console.log('Livros carregados da API:', this.livros);
      },
      (error) => console.error('Erro ao carregar livros:', error)
    );
  }

  // Método para navegar para a página de detalhes do livro
  navegarParaDetalhes(id: number): void {
    this.router.navigate(['/livro', id]);
  }
}
