import { Component, OnInit } from '@angular/core';
import { ExchangeService } from '../../services/exchange.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-trocas-pendentes',
  templateUrl: './trocas-pendentes.component.html',
  styleUrls: ['./trocas-pendentes.component.css']
})
export class TrocasPendentesComponent implements OnInit {
  pendentes: any[] = [];
  aceitas: any[] = [];
  recusadas: any[] = [];

  constructor(
    private exchangeService: ExchangeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadExchanges();
  }

  loadExchanges(): void {
    this.exchangeService.getPendingExchanges().subscribe(
      (data) => {
        this.pendentes = data.filter(exchange => exchange.status === 'PENDING');
        this.aceitas = data.filter(exchange => exchange.status === 'ACCEPTED');
        this.recusadas = data.filter(exchange => exchange.status === 'REJECTED');
      },
      () => {
        this.toastr.error('Erro ao carregar as solicitações de troca.', 'Erro');
      }
    );
  }

  acceptExchange(id: number): void {
    const exchange = this.pendentes.find(e => e.id === id);
    if (!exchange) {
      this.toastr.error('Troca não encontrada.', 'Erro');
      return;
    }

    const message = `Olá, estou aceitando a troca do livro "${exchange.requestedBook.name}". Podemos alinhar os detalhes?`;

    this.exchangeService.acceptExchange(id).subscribe(
      () => {
        this.toastr.success('Solicitação de troca aceita!', 'Sucesso');
        this.loadExchanges();
        window.location.href = `https://wa.me/${exchange.offeredBook.phoneNumber}?text=${encodeURIComponent(message)}`;
      },
      () => {
        this.toastr.error('Erro ao aceitar solicitação.', 'Erro');
      }
    );
  }

  rejectExchange(id: number): void {
    this.exchangeService.rejectExchange(id).subscribe(
      () => {
        this.toastr.success('Solicitação de troca recusada!', 'Sucesso');
        this.loadExchanges();
      },
      () => {
        this.toastr.error('Erro ao recusar solicitação.', 'Erro');
      }
    );
  }
}
