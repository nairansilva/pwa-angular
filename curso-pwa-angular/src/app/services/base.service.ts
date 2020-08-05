import { Injectable, Injector, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import Dexie from 'dexie';
import { HttpClient } from '@angular/common/http';
import { OnlineOfflineService } from './online-offline.service';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService<T extends {id: string}> {

  private db: Dexie;
  private table: Dexie.Table<T, any> = null;

  protected http: HttpClient;
  protected onlineOfflineService: OnlineOfflineService;

  constructor(
    protected injector: Injector,
    @Inject(String) protected nomeTabela: string,
    @Inject(String) protected urlApi: string,
    @Inject(String) protected nomeDB: string
   ) {
     this.http = this.injector.get(HttpClient);
     this.onlineOfflineService = this.injector.get(OnlineOfflineService);
     this.ouvirStatusConexao();
     this.iniciarIndexedDb();
   }

  private salvarAPI(tabela: T) {
    this.http.post(this.urlApi, tabela).subscribe(
      () => alert('tabela Cadastrado com Sucesso'),
      (e) => alert('Erro ao cadastrar tabela ' + e)
    );
  }

  private async salvarIdexedDb(tabela: T) {

    try {
      await this.table.add(tabela);
      const todosSeguros: T[] = await this.table.toArray();
      console.log('Seguro foi saldo no indexed db: ' + todosSeguros);
    } catch (error) {
      console.log('Erro: ', error);
    }

  }

  private async enviarIndexedDbParaApi() {
    const todosTabela: T[] = await this.table.toArray();

    todosTabela.map(async tabela => {
      this.salvarAPI(tabela);
      await this.table.delete(tabela.id);
      console.log('tabela com o ID ' + tabela.id + ' foi excluído com sucesso.');
    });
  }

  salvar(tabela: T) {
    if (this.onlineOfflineService.isOnline) {
      this.salvarAPI(tabela);
    } else {
      this.salvarIdexedDb(tabela);
    }
  }

  listar(): Observable<T[]> {
    return this.http.get<T[]>(this.urlApi);
  }

  private ouvirStatusConexao() {
    this.onlineOfflineService.statusConexao.subscribe((online) => {
      if (online) {
        this.enviarIndexedDbParaApi();
      } else {
        console.log('Estou Offline');
      }
    });
  }

  private iniciarIndexedDb() {
    this.db = new Dexie(this.nomeDB);
    this.db.version(1).stores({
      [this.nomeTabela]: 'id',
    });
    this.table = this.db.table(this.nomeTabela);
  }
}
