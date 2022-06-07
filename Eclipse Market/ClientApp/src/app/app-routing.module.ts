import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountDetailComponent } from './accounts/account-detail/account-detail.component';
import { AccountListingsComponent } from './accounts/account-detail/account-listings/account-listings.component';
import { AccountMessagesComponent } from './accounts/account-detail/account-messages/account-messages.component';
import { AccountSettingsComponent } from './accounts/account-detail/account-settings/account-settings.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AdminManageComponent } from './admin-panel/admin-manage/admin-manage.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { ListingsComponent } from './listings/listings.component';
import { AccountGuardService } from './_guards/account.guard.service';
import { AdminGuard } from './_guards/admin.guard.service';
import { AuthGuardService } from './_guards/auth.guard.service';

const routes: Routes = [
  { path: '', redirectTo:  'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'listings', component: ListingsComponent },
  { path: 'account', component: AccountsComponent, canActivate: [AccountGuardService]},
  { path: 'account/:id', component: AccountDetailComponent, canActivate: [AuthGuardService], children: [
    { path: 'listings', component: AccountListingsComponent },
    { path: 'messages', component: AccountMessagesComponent },
    { path: 'settings', component: AccountSettingsComponent },
    { path: 'admin-panel', component: AdminPanelComponent, canActivate: [AdminGuard], children: [
      { path: 'manage-users', component: AdminManageComponent },
      { path: '**', redirectTo: 'manage-users', pathMatch: 'full' }
    ]},
    { path: '**', redirectTo: 'settings', pathMatch: 'full' },
  ]},
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
