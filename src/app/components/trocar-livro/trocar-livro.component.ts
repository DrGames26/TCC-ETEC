import { Component, OnInit } from '@angular/core';
import { LivroService } from '../../services/livro.service';  // Serviço para listar os livros do usuário
import { ExchangeService } from '../../services/exchange.service';  // Serviço de trocas
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Livro } from '../../services/livro.service';  // Importando a interface Livro

@Component({
  selector: 'app-trocar-livro',
  templateUrl: './trocar-livro.component.html',
  styleUrls: ['./trocar-livro.component.css']
})
export class TrocarLivroComponent implements OnInit {
  livroDesejado: Livro | null = null;  // Inicializando com null
  meusLivros: Livro[] = [];  // Lista de livros do usuário

  constructor(
    private livroService: LivroService,  
    private exchangeService: ExchangeService,  
    private toastr: ToastrService,  
    private router: Router,  
    private route: ActivatedRoute  
  ) {}

  ngOnInit(): void {
    // Obter os livros do usuário
    this.livroService.getMyBooks().subscribe(
      (data: Livro[]) => { // Especificando o tipo de 'data' como Livro[]
        this.meusLivros = data;
      },
      (error: any) => { // Especificando o tipo de 'error' como 'any'
        this.toastr.error('Erro ao carregar seus livros.', 'Erro');
      }
    );
    
    // Obter o livro selecionado a partir da URL
    this.route.paramMap.subscribe(params => {
      const livroId = params.get('livroId');
      if (livroId) {
        this.livroService.getLivroPorId(Number(livroId)).subscribe(
          (livro: Livro) => { // Obtendo os detalhes completos do livro
            this.livroDesejado = livro;
          },
          () => {
            this.toastr.error('Erro ao carregar os detalhes do livro.', 'Erro');
          }
        );
      }
    });
  }

  offerExchange(livroId: string): void {
    const troca = {
      bookOfferedId: livroId,
      bookRequestedId: this.livroDesejado?.id,  // Utilizando a verificação de null
    };

    this.exchangeService.requestExchange(troca).subscribe(
      () => {
        this.toastr.success('Troca solicitada com sucesso!', 'Sucesso');
        this.router.navigate(['/minha-conta']); // Redirecionar para a página da conta do usuário
      },
      () => {
        this.toastr.error('Erro ao solicitar troca.', 'Erro');
      }
    );
  }
}
