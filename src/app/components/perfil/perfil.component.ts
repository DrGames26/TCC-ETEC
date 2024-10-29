// perfil.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
})
export class PerfilComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    this.authService.logout();
  }
}
