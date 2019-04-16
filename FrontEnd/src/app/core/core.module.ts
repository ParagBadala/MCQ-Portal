import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MomentModule } from 'ngx-moment';

import { MiddlePanelComponent } from './middle-panel/middle-panel.component';
import { LeftPanelComponent } from './left-panel/left-panel.component';
import { RightPanelComponent } from './right-panel/right-panel.component';
import { HomeComponent } from './home/home.component';
import { QuestionNavBtnComponent } from './question-nav-btn/question-nav-btn.component';
import { FilterComponent } from './filter/filter.component';
import { AdminService } from '../admin/admin.service';
import { AuthGuard } from '../admin/auth.guard';
import { ChatComponent } from './chat/chat.component';
import { MessageRoomComponent } from './message-room/message-room.component';

const routes: Routes = [
  {
  path: 'user',
  loadChildren: '../user/user.module#UserModule'
  },
  {
    path: 'admin',
    canLoad: [AuthGuard],
    loadChildren: '../admin/admin.module#AdminModule',
  },
  // {
  //   path: '',
  //   component: HomeComponent
  // },
  { path: '',
    redirectTo: '/user',
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [
    LeftPanelComponent,
    RightPanelComponent,
    MiddlePanelComponent,
    HomeComponent,
    QuestionNavBtnComponent,
    FilterComponent,
    ChatComponent,
    MessageRoomComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    MomentModule
  ],
  exports: [
    LeftPanelComponent,
    MiddlePanelComponent,
    RightPanelComponent,
    HomeComponent,
    FilterComponent,
    MomentModule
  ],
  providers: [
    AuthGuard,
    AdminService
  ]
})
export class CoreModule { }
