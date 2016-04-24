import { App, Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { HomePage } from './pages/home/home';
import { ContasPage } from './pages/contas/contas';
import { SqlStorageService } from './service/sql-storage.service';
import { ToastService } from './service/toast.service';

@App({
  templateUrl: 'build/app.html',
  config: {
    mode: 'md'
  }, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [SqlStorageService, ToastService]
})

export class MyApp {
  static get parameters() {
    return [[Platform]];
  }

  constructor(platform) {
    this.home = HomePage;
    this.contas = ContasPage;

    this.rootPage = this.home;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    this.rootPage = page;
  }
}
