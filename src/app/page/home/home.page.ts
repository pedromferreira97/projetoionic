import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Receitas } from 'src/app/model/receitas.model';
import { DatabaseService } from 'src/app/servico/database.service';
import { UtilityService } from 'src/app/servico/utility.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  receitas: Receitas[] = [];

  constructor(private datab: DatabaseService,
    private alert: AlertController,
    private util: UtilityService,
    private action: ActionSheetController) {}
  
  ngOnInit(): void {
    this.util.mensagemCarregando("Aguarde...", 1500);
    this.datab.getReceita().subscribe(results => this.receitas = results);
  }

  async mensagemAlert() {
    const alerta = this.alert.create({
      mode: "ios",
      header: 'Cadastrar nova receita:',
      inputs: [
        {
          name: 'receita',
          type: 'text',
          placeholder: 'Nome da receita'
        },
        {
          name: 'ingrediente',
          type: 'text',
          placeholder: 'Ingredientes'   
        },
        {
          name: 'preparo',
          type: 'text',
          placeholder: 'Modo de Preparo'
        }
      ],

      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.util.toastMessage("Cancelado", "bottom", 2000, "danger");
          }
        },
        {
          text: 'Cadastrar',
          handler: (guardar) => {
            let receita = {receita: guardar.receita, ingrediente: guardar.ingrediente, modo: guardar.preparo, status: false};
          try {
            this.cadastroReceita(receita);
          } catch(err) {
            console.log(err);
          } finally {
            this.util.toastMessage("Receita cadastrada", "bottom", 2000, "success");
          }
          } 
        }
      ]
    });

      (await alerta).present();
  }

  async actionFolha(receita: Receitas) {
    const sheet = this.action.create({
      mode: "ios",
      header: "Opções",
      buttons: [
        {
          text: receita.status ? 'Já preparei' : 'Não preparei ainda',
          icon: receita.status ? 'radio-button-off' : 'checkmark-circle',
          handler: () => {
            receita.status = !receita.status;
            this.datab.updateStatus(receita);
            receita.status ? this.util.toastMessage("Receita feita", "bottom", 2000, "secondary") : this.util.toastMessage("Receita desmarcada", "bottom", 2000, "primary");
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });

      (await sheet).present();
  }

  cadastroReceita(receita: any){
    this.datab.postReceita(receita);
  }
  
  deletarReceita(id: number){
    try {
      this.datab.deletaReceita(id);
    } catch(err) {
      console.log(err);
    } finally {
      this.util.toastMessage("Receita excluída", "bottom", 2000, "danger");
    }
  }
}
