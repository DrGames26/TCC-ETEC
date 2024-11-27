import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';  // Importando o Router
import { LivroService, Livro } from 'src/app/services/livro.service';

@Component({
  selector: 'app-livro-detalhes',
  templateUrl: './livro-detalhes.component.html',
  styleUrls: ['./livro-detalhes.component.css']
})
export class LivroDetalhesComponent implements OnInit {
  livro: Livro | undefined;

  constructor(
    private route: ActivatedRoute,
    private livroService: LivroService,
    private router: Router  // Injetando o Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarLivro(id);
  }

  carregarLivro(id: number): void {
    this.livroService.getLivroPorId(id).subscribe(
      (livro) => {
        // Verifica se a imagem está em Base64 e ajusta a string para o formato correto
        if (livro.picture && !livro.picture.startsWith('data:image')) {
          livro.picture = 'data:image/jpeg;base64,' + livro.picture;
        }
        this.livro = livro;
      },
      (error) => console.error('Erro ao carregar o livro:', error)
    );
  }

  // Navega para a página de troca de livro
  trocarLivro(): void {
    if (this.livro) {
      this.router.navigate(['/trocar-livro', this.livro.id]);  // Passando o ID do livro para a página de troca
    }
  }
}
