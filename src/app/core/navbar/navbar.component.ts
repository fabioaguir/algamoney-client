import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/seguranca/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  public exibindoMenu = false;

  constructor(
    public auth: AuthService,
    private router: Router
    ) {}

  criarNovoAccessToken() {
    this.auth.obterNovoAccessToken().subscribe(x => {
      console.log('Access token criado');
    });
  }

  logout() {
    this.auth.logout().subscribe(() => {
      this.router.navigate(['login']);
    });
  }
}
