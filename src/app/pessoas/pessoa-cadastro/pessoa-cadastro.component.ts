import { MessageService } from 'primeng/api';
import { PessoaService } from './../pessoa.service';
import { Pessoa } from './../../core/model';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

  public pessoa = new Pessoa();

  constructor(
    private pessoaServive: PessoaService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit(): void {
    this.parametrosDaRota();
    this.atualizarTituloEdicao();
  }

  private parametrosDaRota() {
    this.route.params.subscribe((params: Params) => {
      if(params.codigo) {
        this.carregarPessoa(params.codigo);
      }
    });
  }

  get editando() {
    return Boolean(this.pessoa.codigo);
  }

  carregarPessoa(codigo: number) {
    this.pessoaServive.buscarPorCodigo(codigo).subscribe((pessoa: Pessoa) => {
      this.pessoa = pessoa;
      this.atualizarTituloEdicao();
    });
  }

  salvar(form: NgForm){
    if(this.editando) {
      this.atualizarPessoa(form);
    } else {
      this.adicionarPessoa(form);
    }
  }

  adicionarPessoa(form: NgForm) {
    this.pessoaServive.salvar(this.pessoa).subscribe(pessoa => {
      this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Pessoa adicionada com sucesso'});

      this.router.navigate(['/pessoas', pessoa.codigo]);
      }
    );
  }

  atualizarPessoa(form: NgForm) {
    this.pessoaServive.atualizar(this.pessoa).subscribe(pessoa => {
      this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Pessoa atualizada com sucesso'});
      this.pessoa = pessoa;
      this.atualizarTituloEdicao();
      }
    );
  }

  novo(form: NgForm) {
    form.reset();

    setTimeout(function() {
      this.pessoa = new Pessoa();
      this.atualizarTituloEdicao();
    }.bind(this), 1);
    this.router.navigate(['pessoas/novo']);
  }

  atualizarTituloEdicao() {
    if(this.editando) {
      this.title.setTitle(`Edição de pessoa: ${this.pessoa.nome}`);
    } else {
      this.title.setTitle('Nova Pessoa');
    }
  }
}
