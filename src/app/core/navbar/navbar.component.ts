import { Component} from '@angular/core';
import { AuthService } from 'src/app/seguranca/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  public exibindoMenu = false;

  constructor(public auth: AuthService) {}

  criarNovoAccessToken() {
    this.auth.obterNovoAccessToken().subscribe(x => {
      console.log('Access token criado');
    });
  }
}
