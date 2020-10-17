import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Contato } from '../../core/model';

@Component({
  selector: 'app-pessoa-cadastro-contato',
  templateUrl: './pessoa-cadastro-contato.component.html',
  styleUrls: ['./pessoa-cadastro-contato.component.css']
})
export class PessoaCadastroContatoComponent implements OnInit {

  @Input() contatos: Array<Contato>;
  contato: Contato;
  exbindoFormularioContato = false;
  contatoIndex: number;

  constructor() { }

  ngOnInit() {
  }

  prepararNovoContato() {
    this.exbindoFormularioContato = true;
    this.contato = new Contato();
    this.contatoIndex = this.contatos.length;
  }

  prepararEdicaoContato(contato: Contato, index: number) {
    this.contato = Object.assign({}, contato);
    this.exbindoFormularioContato = true;
    this.contatoIndex = index;
  }

  confirmarContato(frm: FormControl) {
    const contato = Object.assign({}, this.contato);
    this.contatos[this.contatoIndex] = contato;

    this.exbindoFormularioContato = false;

    frm.reset();
  }

  removerContato(index: number) {
    this.contatos.splice(index, 1);
  }

  get editando() {
    return this.contato && this.contato.codigo;
  }

}
