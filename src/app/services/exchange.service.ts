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
      requestedBook: requestData.requestedBook,
      offeredBook: requestData.offeredBook,
      requester: requestData.requester
    };
    
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
          console.error('Erro ao carregar solicitações de troca:', error);
        }
      })
    );
  }

  // Aceitar troca
  acceptExchange(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/accept/${id}`, {}).pipe(
      tap({
        next: () => {
          console.log('Troca aceita com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao aceitar troca:', error);
        }
      })
    );
  }

  // Recusar troca
  rejectExchange(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/reject/${id}`, {}).pipe(
      tap({
        next: () => {
          console.log('Troca recusada com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao recusar troca:', error);
        }
      })
    );
  }
}
