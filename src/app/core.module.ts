import { BackTopModule } from './share/components/back-top/back-top.module';
import { PipesModule } from './share/pipes/pipes.module';
import { CheckboxModule } from './share/components/checkbox/checkbox.module';
import { DirectivesModule } from 'src/app/share/directives/directives.module';
import { AppRoutingModule } from './app-routing.module';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { HeaderComponent } from './layouts/header/header.component';
import { BreadcrumbModule } from './share/components/breadcrumb/breadcrumb.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PagesModule } from './pages/pages.module';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './layouts/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InterceptorService } from './services/apis/interceptor.service';
import { MessageModule } from './share/components/message/message.module';
import { PlayerComponent } from './layouts/player/player.component';



@NgModule({
  declarations: [
    HeaderComponent,
    LoginComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PagesModule,
    AppRoutingModule,
    BreadcrumbModule,
    DirectivesModule,
    CheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MessageModule,
    BackTopModule
  ],
  exports: [
    BrowserModule,
    BrowserAnimationsModule,
    PagesModule,
    AppRoutingModule,
    HeaderComponent,
    BreadcrumbModule,
    LoginComponent,
    PlayerComponent,
    BackTopModule
  ],
  providers:[
    {provide:HTTP_INTERCEPTORS,useClass:InterceptorService,multi:true}
  ]
})
export class CoreModule {
  constructor(@SkipSelf() @Optional() parentModule:CoreModule){
    if(parentModule){
      throw new Error('CoreModule只能被AppModule引入');
    }
  }
}
