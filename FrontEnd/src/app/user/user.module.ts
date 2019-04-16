import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from "@angular/forms"

import { ManageQuestionsComponent } from './manage-questions/manage-questions.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddQuestionComponent } from './add-question/add-question.component';
import { SingleChoiceComponent } from './single-choice/single-choice.component';
import { MultipleChoiceComponent } from './multiple-choice/multiple-choice.component';
import { SubjectiveComponent } from './subjective/subjective.component';
import { HttpClientModule } from '@angular/common/http';
import { TestComponent } from './test/test.component';
import { FilterPipe } from './test/filter.pipe';
import { TakeTestComponent } from './take-test/take-test.component';
import { TestPortalComponent } from './test-portal/test-portal.component';
import { UserGuard } from './user.guard';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: "start-test",    
    component: TestPortalComponent,
    canDeactivate: [UserGuard]
  },
  {
  path: "manage-questions",
  component: ManageQuestionsComponent
  },
  {
    path: "add-questions",
    component: AddQuestionComponent
  },
  {
    path: "create-test",
    component: TestComponent
  },
  {
    path: "assigned-tests",
    component: TakeTestComponent
  },
  {
  path: "",
  component: DashboardComponent
  }
];

@NgModule({
  declarations: [
    ManageQuestionsComponent, 
    DashboardComponent, 
    AddQuestionComponent, 
    SingleChoiceComponent, 
    MultipleChoiceComponent, 
    SubjectiveComponent, 
    TestComponent, 
    FilterPipe,
    TakeTestComponent, 
    TestPortalComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FormsModule,
    HttpClientModule,
    SharedModule
  ],
  exports:[
    HttpClientModule
  ],
  providers: [
    UserGuard,
    FilterPipe,
  ]
})
export class UserModule { }
