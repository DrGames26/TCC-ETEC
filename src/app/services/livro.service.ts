import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LivroService {

  constructor() {}

  getLivros(): Observable<any[]> {
    // Dados fictícios para teste
    const livros = [
      { nome: 'Livro Exemplo 1'},
      { nome: 'Livro Exemplo 2'},
      { nome: 'Livro Exemplo 3'}
    ];
    return of(livros);
  }
}
