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
    // Verificar se o usuário está sendo carregado corretamente
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.userToEdit = { 
          name: user.name || '', 
          email: user.email || '', 
          password: user.password || '', 
          dateOfBirth: user.dateOfBirth || '', 
          sex: user.sex || '', 
          profilePicture: user.profilePicture || '', 
          phoneNumber: user.phoneNumber || ''
        };
      }
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

      // Converter o arquivo para base64
      const reader = new FileReader();
      reader.onloadend = () => {
        // A variável reader.result vai ser o base64 da imagem
        this.userToEdit!.profilePicture = reader.result as string;
      };
      reader.readAsDataURL(file);  // Converte o arquivo para base64
    }
  }

  saveProfileChanges(modal: any) {
    if (this.userToEdit && this.user) {
      // Verifica se a senha está vazia antes de tentar removê-la
      if (this.userToEdit.password && this.userToEdit.password.trim() === '') {
        this.userToEdit.password = undefined; // Define como indefinido para evitar uso do `delete`
      }

      this.authService.updateUser(this.user.email, this.userToEdit).subscribe(
        (updatedUser) => {
          this.user = updatedUser; // Atualiza o usuário no frontend
          modal.close(); // Fecha o modal
        },
        (error) => {
          console.error('Erro ao salvar as mudanças do perfil', error);
        }
      );
    }
  }
}
