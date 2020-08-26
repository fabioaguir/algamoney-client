import { MessageService } from 'primeng/api';
import { PessoaService } from './../pessoa.service';
import { Pessoa } from './../../core/model';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

  public pessoa = new Pessoa();

  constructor(
    private pessoaServive: PessoaService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  salvar(form: NgForm) {
    this.pessoaServive.salvar(this.pessoa).subscribe(resonse => {
      this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Pessoa adicionada com sucesso'});

      form.reset();
      this.pessoa = new Pessoa();
      }
    );
  }

}
