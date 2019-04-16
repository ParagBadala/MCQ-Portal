import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoryComponent } from './category/category.component';
import { AllQuestionsComponent } from './all-questions/all-questions.component';
import { ReviewQuestionComponent } from './review-question/review-question.component';
import { ResultComponent } from './result/result.component';
import { AdminService } from './admin.service';
import { SharedModule } from '../shared/shared.module';
import { ViewResultComponent } from './view-result/view-result.component';

const routes: Routes = [
  {
    path: "add-category",
    component: CategoryComponent
  },
  {
    path: "all-question",
    component: AllQuestionsComponent
  },
  {
    path: "review-question",
    component: ReviewQuestionComponent
  },
  {
    path: "result",
    component: ResultComponent
  },
  {
    path: "view-result",
    component: ViewResultComponent
  },
  {
    path: "",
    component: DashboardComponent,
    pathMatch: 'full',
  }
]

@NgModule({
  declarations: [
    DashboardComponent,
    CategoryComponent,
    AllQuestionsComponent,
    ReviewQuestionComponent,
    ResultComponent,
    ViewResultComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [
    AdminService
  ]
})

export class AdminModule { }
