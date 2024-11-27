import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../services/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
})
export class PerfilComponent implements OnInit {
  user: User | null = null;
  userToEdit: User | null = null;

  constructor(
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = user;
      this.userToEdit = { 
        name: user?.name || '', 
        email: user?.email || '', 
        password: user?.password || '', 
        dateOfBirth: user?.dateOfBirth || '', 
        sex: user?.sex || '', 
        profilePicture: user?.profilePicture || '', 
        phoneNumber: user?.phoneNumber || ''
      };
    });
  }

  logout() {
    this.authService.logout();
  }

  openEditProfileModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      
      // Lê o arquivo como uma URL base64
      reader.readAsDataURL(file);
      
      reader.onload = () => {
        if (reader.result) {
          // A imagem em Base64 será armazenada em profilePicture
          this.userToEdit!.profilePicture = reader.result as string;
        }
      };
      
      reader.onerror = (error) => {
        console.error('Erro ao ler o arquivo', error);
      };
    }
  }

  saveProfileChanges(modal: any) {
    if (this.userToEdit && this.user) {
      // Chamando o método updateUser do AuthService
      this.authService.updateUser(this.user.email, this.userToEdit).subscribe(
        (updatedUser) => {
          this.user = updatedUser; // Atualiza o usuário após a edição
          modal.close();
        },
        (error) => {
          console.error('Erro ao salvar as mudanças do perfil', error);
        }
      );
    }
  }
}
