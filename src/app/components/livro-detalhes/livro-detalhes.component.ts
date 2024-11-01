import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LivroService, Livro } from 'src/app/services/livro.service';

@Component({
  selector: 'app-livro-detalhes',
  templateUrl: './livro-detalhes.component.html',
  styleUrls: ['./livro-detalhes.component.css']
})
export class LivroDetalhesComponent implements OnInit {
  livro: Livro | undefined;

  constructor(private route: ActivatedRoute, private livroService: LivroService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarLivro(id);
  }

  carregarLivro(id: number): void {
    this.livroService.getLivroPorId(id).subscribe(
      (livro) => this.livro = livro,
      (error) => console.error('Erro ao carregar o livro:', error)
    );
  }
}
