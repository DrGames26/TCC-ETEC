import { Component, OnInit } from '@angular/core';
import { LivroService } from '../../services/livro.service'; // Ajuste o caminho conforme necessário

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  livros: any[] = [];  // Define a variável para armazenar os livros

  constructor(private livroService: LivroService) {}

  ngOnInit(): void {
    this.livroService.getLivros().subscribe((data: any) => {
      this.livros = data;
      console.log(this.livros);
    });
  }
}
