import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AdminDataRoles$ } from 'src/app/core/models/admin.model';
import {
  RoleAddRequest,
  RoleGetAllResponse,
  RoleGetByIdResponse,
  RoleUpdateRequest,
} from 'src/app/core/models/role.model';
import { DeleteRequest } from 'src/app/core/models/user.model';
import { RoleService } from 'src/app/core/services/http/role.service';
import { AdminDataService } from 'src/app/core/services/store/admin.data.service';

@Component({
  selector: 'app-admin-roles',
  templateUrl: './admin-roles.component.html',
  styleUrls: ['./admin-roles.component.scss'],
})
export class AdminRolesComponent implements OnInit, OnDestroy {
  @ViewChild('rt') rolesTable!: any;

  roleList: RoleGetAllResponse = [];
  roleAddDialog?: boolean;
  roleEditDialog?: boolean;
  rolesChanged: boolean = false;

  roleFetchSubs: Subscription | undefined;
  roleGetSubs: Subscription | undefined;
  roleAddSubs: Subscription | undefined;
  roleEditSubs: Subscription | undefined;
  roleDeleteSubs: Subscription | undefined;

  constructor(
    private roleService: RoleService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private adminDataService: AdminDataService
  ) {}

  ngOnInit() {
    this.fetchRoles();
    this.roleAddDialog = false;
    this.roleEditDialog = false;
  }

  roleForm: FormGroup = new FormGroup({
    id: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    claims: new FormControl('', [Validators.required]),
  });

  applyFilterGlobal($event: Event, stringVal: any) {
    this.rolesTable.filterGlobal(
      ($event.target as HTMLInputElement).value,
      stringVal
    );
  }

  fetchRoles() {
    if (this.rolesChanged) {
      console.log('main method')
      this.fetchRolesFromService();
    }
    this.roleGetSubs = this.adminDataService.roles.subscribe({
      next: (data: AdminDataRoles$) => {
        if (data) {
          const roleArr = Object.entries(data).map(([index, role]) => role);
          this.roleList = roleArr;
        } else {
          this.fetchRolesFromService();
        }
      },
    });
  }

  fetchRolesFromService() {
    this.roleFetchSubs = this.roleService.getAll().subscribe({
      next: (resp: RoleGetAllResponse) => {
        this.roleList = resp;
        this.adminDataService.setRoles(resp);
        this.rolesChanged = false;
        console.log('fetching');
      },
    });
  }

  onToggleRoleAddDialog() {
    this.roleAddDialog = true;
    this.roleForm.reset();
  }

  onAddRole() {
    const claims: string = this.roleForm.get('claims')?.value;
    const body: RoleAddRequest = {
      id: this.roleForm.get('id')?.value,
      name: this.roleForm.get('name')?.value,
      claims: claims.split(','),
    };
    this.roleAddSubs = this.roleService.add(body).subscribe({
      complete: () => {
        this.rolesChanged = true;
        this.messageService.add({
          severity: 'success',
          detail: 'Ролята е добавена успешно!',
          life: 3000,
        });
        this.fetchRoles();
        this.roleAddDialog = false;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onDiscard() {
    this.roleAddDialog = false;
    this.roleEditDialog = false;
  }

  onToggleRoleEditDialog(role: RoleGetByIdResponse) {
    this.roleEditDialog = true;
    this.roleForm.patchValue({
      id: role.id,
      name: role.name,
      claims: role.claims,
    });
  }

  onEditRole() {
    const claims: string = this.roleForm.get('claims')?.value;
    const body: RoleUpdateRequest = {
      currentId: this.roleForm.get('id')?.value,
      name: this.roleForm.get('name')?.value,
      claims: claims.split(','),
    };
    this.roleEditSubs = this.roleService.update(body).subscribe({
      complete: () => {
        this.rolesChanged = true;
        this.messageService.add({
          severity: 'success',
          detail: 'Промените са запазени!',
          life: 3000,
        });
        this.roleEditDialog = false;
        this.fetchRoles();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onDeleteRole(role: RoleGetByIdResponse) {
    const body: DeleteRequest = {
      id: role.id,
    };
    this.confirmationService.confirm({
      message: `Сигурнили сте, че искате да изтриете ${role.name} ?`,
      header: 'Потвърди',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Да',
      rejectLabel: 'Не',
      accept: () => {
        this.roleDeleteSubs = this.roleService.delete(body).subscribe({
          complete: () => {
            this.rolesChanged = true;
            this.messageService.add({
              severity: 'success',
              detail: 'Ролята е изтрита успешно!',
              life: 3000,
            });
            this.fetchRoles();
          },
          error: (err) => {
            console.log(err);
          },
        });
      },
    });
  }

  ngOnDestroy(): void {
    this.roleGetSubs?.unsubscribe();
    this.roleAddSubs?.unsubscribe();
    this.roleEditSubs?.unsubscribe();
    this.roleDeleteSubs?.unsubscribe();
    this.roleFetchSubs?.unsubscribe();
  }
}
