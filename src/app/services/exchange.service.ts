import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ExchangeService {
  private apiUrl = 'https://sorobooks-backend-1.onrender.com/api/exchange';

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  // Solicitar troca
  requestExchange(requestData: any): Observable<any> {
    const formattedRequestData = {
      requestedBook: requestData.requestedBook,
      offeredBook: requestData.offeredBook,
      requester: requestData.requester,
    };

    return this.http.post(`${this.apiUrl}/request`, formattedRequestData).pipe(
      tap({
        next: () => {
          this.toastr.success('Solicitação de troca enviada!', 'Sucesso');
        },
        error: (error) => {
          console.error('Erro ao enviar solicitação de troca:', error);
          this.toastr.error('Erro ao enviar solicitação de troca.', 'Erro');
        },
      })
    );
  }

  // Listar solicitações pendentes
  getPendingExchanges(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pending`).pipe(
      tap({
        error: (error) => {
          console.error('Erro ao carregar solicitações de troca:', error);
        },
      })
    );
  }

  // Atualizar status da troca
  updateExchangeStatus(id: number, status: 'ACCEPTED' | 'REJECTED'): Observable<any> {
    const body = { status };

    return this.http.put<any>(`${this.apiUrl}/${id}/status`, body).pipe(
      tap({
        next: () => {
          const message = status === 'ACCEPTED' ? 'Troca aceita com sucesso!' : 'Troca recusada com sucesso!';
          console.log(message);
          this.toastr.success(message, 'Sucesso');
        },
        error: (error) => {
          const message = status === 'ACCEPTED' ? 'Erro ao aceitar troca.' : 'Erro ao recusar troca.';
          console.error(message, error);
          this.toastr.error(message, 'Erro');
        },
      })
    );
  }

  // Aceitar troca
  acceptExchange(id: number): Observable<any> {
    return this.updateExchangeStatus(id, 'ACCEPTED');
  }

  // Recusar troca
  rejectExchange(id: number): Observable<any> {
    return this.updateExchangeStatus(id, 'REJECTED');
  }
}
