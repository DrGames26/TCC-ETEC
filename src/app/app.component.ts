import { Component, ViewChild } from '@angular/core';
import { LoginComponent } from './login/login/login.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sorobooks';


  @ViewChild(LoginComponent) loginComponent!: LoginComponent;

  dropdownOpen = false; 

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
}
