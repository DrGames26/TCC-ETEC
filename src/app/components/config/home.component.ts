import { Component, OnInit } from '@angular/core';
import { LivroService } from '../../services/livro.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  livros: any[] = [];  // Define a variável para armazenar os livros

  constructor(private livroService: LivroService, private router: Router) {}

  ngOnInit(): void {
    this.livroService.getLivros().subscribe((data: any) => {
      // Verifica se a imagem está em Base64 e converte corretamente
      this.livros = data.map((livro: any) => {
        if (livro.picture) {
          // Verifica se a imagem já possui o prefixo Base64
          if (!livro.picture.startsWith('data:image')) {
            livro.picture = 'data:image/jpeg;base64,' + livro.picture; // Adiciona o prefixo Base64 se necessário
          }
        }
        return livro;
      }).sort((a: any, b: any) => (b.id || 0) - (a.id || 0)); // Ordena os mais recentes

      console.log(this.livros); // Para verificar os livros carregados
    });
  }

  // Método para navegar para a página de detalhes do livro
  navegarParaDetalhes(livroId: number): void {
    this.router.navigate(['/livro', livroId]); // Altere a rota conforme sua configuração
  }
}
