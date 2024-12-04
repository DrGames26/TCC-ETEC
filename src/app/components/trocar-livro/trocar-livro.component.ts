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

    // Carregar os livros do usuário autenticado
    this.livroService.getBooksByUsuarioPublicador(usuarioPublicador).subscribe(
      (data: Livro[]) => {
        this.meusLivros = data;
      }
    );
      
    // Carregar detalhes do livro desejado
    this.route.paramMap.subscribe(params => {
      const livroId = params.get('livroId');
      if (livroId) {
        // Primeiramente tenta buscar o livro na API
        this.livroService.getLivroPorId(Number(livroId)).subscribe(
          (livro: Livro) => {
            this.livroDesejado = livro;
            console.log('Livro encontrado na API:', this.livroDesejado);
          },
          (error) => {
            // Caso falhe, tenta buscar no localStorage
            console.error('Livro não encontrado na API, buscando no localStorage...');
            const livro = this.livroService.getFromLocalStorage().find(l => l.id === Number(livroId));
            if (livro) {
              this.livroDesejado = livro;
              console.log('Livro encontrado no localStorage:', this.livroDesejado);
            } else {
              console.error('Livro não encontrado nem na API nem no localStorage.');
            }
          }
        );
      }
    });
  }

  // Função para oferecer a troca
  offerExchange(livroId: number): void {
    if (!this.livroDesejado) {
      return;
    }

    const troca = {
      offeredBook: {
        id: livroId,
      },
      requestedBook: {
        id: this.livroDesejado.id,
      },
      requester: this.authService.getUser()?.email || '',
      requesterPhoneNumber: this.authService.getUser()?.phoneNumber || ''  // Incluindo o número de telefone
    };

    console.log('Requester:', troca.requester);
    console.log('PhoneNumber:', troca.requesterPhoneNumber); // Para garantir que o número de telefone está sendo enviado corretamente

    // Solicitar a troca
    this.exchangeService.requestExchange(troca).subscribe(
      (response) => {
        if (response && response.success) {
          this.toastr.success('Troca solicitada com sucesso!', 'Sucesso');
          // Redirecionar para a página de trocas
          this.router.navigateByUrl('/trocas');
        } else {
          console.error('Falha na solicitação de troca:', response);
          this.toastr.error('Falha ao solicitar a troca.', 'Erro');
        }
      },
    
    );
  }
}
