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
      // Ordena os livros por ID do maior para o menor (mais recentes aparecem primeiro)
      this.livros = data.sort((a: any, b: any) => (b.id || 0) - (a.id || 0));
      console.log(this.livros);  // Para verificar os livros carregados
    });
  }

  // Método para navegar para a página de detalhes do livro
  navegarParaDetalhes(livroId: number): void {
    this.router.navigate(['/livro', livroId]); // Altere a rota conforme sua configuração
  }
}
