import { Component, OnInit } from '@angular/core';
import { ExchangeService } from '../../services/exchange.service'; // Importe o serviço que irá buscar os dados
import { ToastrService } from 'ngx-toastr'; // Importe o Toastr para exibir mensagens

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
    private exchangeService: ExchangeService, // Serviço que interage com o backend
    private toastr: ToastrService  // Para exibir notificações
  ) {}

  ngOnInit(): void {
    this.loadExchanges(); // Chama o método que carrega as trocas
  }

  loadExchanges(): void {
    // Chama o serviço para buscar as trocas pendentes do backend
    this.exchangeService.getPendingExchanges().subscribe(
      (data) => {
        // Filtra as trocas de acordo com o status (PENDING, ACCEPTED, REJECTED)
        this.pendentes = data.filter(exchange => exchange.status === 'PENDING');
        this.aceitas = data.filter(exchange => exchange.status === 'ACCEPTED');
        this.recusadas = data.filter(exchange => exchange.status === 'REJECTED');
      },
      (error) => {
        this.toastr.error('Erro ao carregar as solicitações de troca.', 'Erro');
      }
    );
  }

  acceptExchange(id: number): void {
    // Encontre a troca pendente pelo ID
    const exchange = this.pendentes.find(e => e.id === id);
    if (!exchange || !exchange.requestedBook || !exchange.requestedBook.phoneNumber) {
      this.toastr.error('Número de telefone não disponível.', 'Erro');
      console.log('Troca não encontrada ou número de telefone ausente', exchange);
      return;
    }

    // Exibe o número de telefone encontrado no console
    const phoneNumber = exchange.requestedBook.phoneNumber;
    console.log('Número de telefone encontrado:', phoneNumber);

    // Chama o serviço para aceitar a troca
    this.exchangeService.acceptExchange(id).subscribe(
      () => {
        this.toastr.success('Solicitação de troca aceita!', 'Sucesso');
        this.loadExchanges(); // Recarrega as trocas após aceitar

        // Redireciona para o WhatsApp usando o número de telefone
        window.location.href = `https://wa.me/${phoneNumber}`;
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
        this.loadExchanges(); // Recarrega as trocas após recusar
      },
      () => {
        this.toastr.error('Erro ao recusar solicitação.', 'Erro');
      }
    );
  }
}
