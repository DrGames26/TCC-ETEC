import { Component, OnInit } from '@angular/core';
import { LivroService } from '../../services/livro.service';  
import { ExchangeService } from '../../services/exchange.service';
import { AuthService } from '../../services/auth.service';  
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Livro } from '../../services/livro.service';  

@Component({
  selector: 'app-trocar-livro',
  templateUrl: './trocar-livro.component.html',
  styleUrls: ['./trocar-livro.component.css']
})
export class TrocarLivroComponent implements OnInit {
  livroDesejado: Livro | null = null;  
  meusLivros: Livro[] = [];  

  constructor(
    private livroService: LivroService,  
    private exchangeService: ExchangeService,  
    private toastr: ToastrService,  
    private router: Router,
    private authService: AuthService,  
    private route: ActivatedRoute  
  ) {}

  ngOnInit(): void {
    const usuarioPublicador = this.authService.getUser()?.name || '';  

    this.livroService.getBooksByUsuarioPublicador(usuarioPublicador).subscribe(
      (data: Livro[]) => {
        this.meusLivros = data;
      },
      () => {
        // Não exibir erro aqui
      }
    );
      
    this.route.paramMap.subscribe(params => {
      const livroId = params.get('livroId');
      if (livroId) {
        this.livroService.getLivroPorId(Number(livroId)).subscribe(
          (livro: Livro) => {
            this.livroDesejado = livro;
          },
          () => {
            // Não exibir erro aqui
          }
        );
      }
    });
  }

  offerExchange(livroId: number): void {
    if (!this.livroDesejado) {
      return;
    }

    const troca = {
      offeredBook: {
        id: livroId,
        // Adicione aqui outros detalhes do livro oferecido, se necessário
      },
      requestedBook: {
        id: this.livroDesejado.id,
        // Adicione aqui outros detalhes do livro desejado, se necessário
      },
      requester: this.authService.getUser()?.email || ''
    };

    console.log('Requester:', troca.requester);

    this.exchangeService.requestExchange(troca).subscribe(
      (response) => {
        if (response && response.success) {
          this.toastr.success('Troca solicitada com sucesso!', 'Sucesso');
        }
      },
      () => {
        // Não exibir erro aqui
      }
    );
  }
}