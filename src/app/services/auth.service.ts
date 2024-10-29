import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      catchError((error) => {
        // Captura o erro e exibe uma mensagem adequada
        if (error.status === 409) {
          alert(error.error); // Exibe a mensagem de conflito
        }
        return throwError(error); // Repropaga o erro
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      map((response: any) => {
        if (response.name && response.email && response.sex) {
          const user = {
            name: response.name,
            email: response.email,
            sex: response.sex,
          };
          this.userSubject.next(user);
          localStorage.setItem('user', JSON.stringify(user));
        }
        return this.userSubject.value;
      })
    );
  }

  getUser() {
    return this.userSubject.value;
  }

  logout() {
    this.userSubject.next(null);
    localStorage.removeItem('user');
  }
}
