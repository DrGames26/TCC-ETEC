import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  private apiUrl = 'https://sorobooks-backend.onrender.com/api/exchange'; 

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  requestExchange(requestData: any): Observable<any> {
    const formattedRequestData = {
      requestedBookId: requestData.requestedBookId,
      offeredBookId: requestData.offeredBookId,
      requester: requestData.requester,
    };
    
    console.log('Dados formatados para troca:', formattedRequestData);

    return this.http.post(`${this.apiUrl}/request`, formattedRequestData).pipe(
      tap({
        next: () => {
          this.toastr.success('Solicitação de troca enviada!', 'Sucesso');
        },
        error: (error) => {
          console.error('Erro ao enviar solicitação de troca:', error);
          this.toastr.error('Erro ao enviar solicitação de troca.', 'Erro');
        }
      })
    );
  }

  // Listar solicitações pendentes
  getPendingExchanges(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pending`).pipe(
      tap({
        error: (error) => {
          console.error('Erro ao obter solicitações pendentes:', error);
          this.toastr.error('Erro ao carregar solicitações pendentes.', 'Erro');
        }
      })
    );
  }

  // Aceitar solicitação de troca
  acceptExchange(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status: 'ACCEPTED' }).pipe(
      tap({
        next: (response) => {
          this.toastr.success('Solicitação de troca aceita!', 'Sucesso');
        },
        error: (error) => {
          console.error('Erro ao aceitar solicitação de troca:', error);
          this.toastr.error('Erro ao aceitar solicitação.', 'Erro');
        }
      })
    );
  }
  

  // Recusar solicitação de troca
  rejectExchange(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status: 'REJECTED' }).pipe(  // Enviando status como string
      tap({
        next: () => {
          this.toastr.success('Solicitação de troca recusada!', 'Sucesso');
        },
        error: (error) => {
          console.error('Erro ao recusar solicitação de troca:', error);
          this.toastr.error('Erro ao recusar solicitação.', 'Erro');
        }
      })
    );
  }
}
