import { Component, OnInit } from '@angular/core';
import { PushNotificationService } from './services/push-notification.service';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-pwa-auto-seguros';

  constructor(private push: PushNotificationService, private swUpdate: SwUpdate) {}

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      console.log("Tá ativado");
      this.swUpdate.available.subscribe(() => {
        if (confirm('Nova versão disponível. Deseja recarregar a página?')) {
          window.location.reload();
        }
      },
      (e)=>console.log(e));
    }

    this.push.adicionaPushSubscriber();

  }
}
