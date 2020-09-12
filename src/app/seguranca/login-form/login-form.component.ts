import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {

  constructor(public service: AuthService) { }

  login(usuario: string, senha: string) {
    this.service.login(usuario, senha).subscribe(response => {

    });
  }

}
