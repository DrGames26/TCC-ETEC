import { Component, OnInit } from '@angular/core';
import { LivroService, Livro } from 'src/app/services/livro.service';

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent implements OnInit {
  livros: Livro[] = [];

  constructor(private livroService: LivroService) {}

  ngOnInit(): void {
    this.carregarLivros();
  }

  carregarLivros(): void {
    this.livroService.getLivros().subscribe(
      (data) => this.livros = data,
      (error) => console.error('Erro ao carregar livros:', error)
    );
  }
}
