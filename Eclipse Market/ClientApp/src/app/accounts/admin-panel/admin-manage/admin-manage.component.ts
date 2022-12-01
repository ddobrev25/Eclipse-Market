import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import {
  AdminDataRoles$,
  AdminDataUsers$,
} from 'src/app/core/models/admin.model';
import { RoleGetAllResponse } from 'src/app/core/models/role.model';
import {
  DeleteRequest,
  User,
  UserGetAllResponse,
  UserUpdateRequest,
} from 'src/app/core/models/user.model';
import { RoleService } from 'src/app/core/services/http/role.service';
import { UserService } from 'src/app/core/services/http/user.service';
import { AdminDataService } from 'src/app/core/services/store/admin.data.service';

@Component({
  selector: 'app-admin-manage',
  templateUrl: './admin-manage.component.html',
  styleUrls: ['./admin-manage.component.scss'],
})
export class AdminManageComponent implements OnInit, OnDestroy {
  @ViewChild('at') accountsTable!: any;
  users?: UserGetAllResponse;
  roleList?: RoleGetAllResponse;

  accountsChanged: boolean = false;

  usersGetSubs?: Subscription;
  usersFetchSubs?: Subscription;
  roleGetSubs?: Subscription;
  roleFetchSubs?: Subscription;
  deleteSubs?: Subscription;
  editSubs?: Subscription;

  accountDialog?: boolean;
  accountForEdit: User | null = null;

  constructor(
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private roleService: RoleService,
    private adminDataService: AdminDataService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchRoles();
  }

  editForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [
      Validators.maxLength(50),
      Validators.minLength(2),
      Validators.required,
    ]),
    lastName: new FormControl('', [
      Validators.maxLength(50),
      Validators.minLength(2),
      Validators.required,
    ]),
    userName: new FormControl('', [
      Validators.maxLength(50),
      Validators.minLength(3),
      Validators.required,
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+.[a-z]{2,3}'),
    ]),
    password: new FormControl('', [
      Validators.maxLength(50),
      Validators.minLength(6),
      Validators.pattern(
        '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$'
      ),
      Validators.required,
    ]),
    phoneNumber: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
  });

  clearTable(table: Table) {
    table.clear();
  }
  applyFilterGlobal($event: Event, stringVal: any) {
    this.accountsTable.filterGlobal(
      ($event.target as HTMLInputElement).value,
      stringVal
    );
  }
  fetchUsers() {
    if (this.accountsChanged) {
      this.fetchUsersFromService();
    }
    this.usersGetSubs = this.adminDataService.users.subscribe({
      next: (data: AdminDataUsers$) => {
        if (data) {
          const usersArr = Object.entries(data).map(([index, user]) => user);
          this.users = usersArr;
        } else {
          this.fetchUsersFromService();
        }
      },
    });
  }

  fetchUsersFromService() {
    this.usersFetchSubs = this.userService.getAll().subscribe({
      next: (resp: UserGetAllResponse) => {
        this.adminDataService.setUsers(resp);
        this.accountsChanged = false;
      },
      error: (err) => console.log(err),
    });
  }
  fetchRoles() {
    this.roleGetSubs = this.adminDataService.roles.subscribe({
      next: (data: AdminDataRoles$) => {
        if (data) {
          this.roleList = Object.entries(data).map(([index, role]) => role);
        } else {
          this.roleFetchSubs = this.roleService.getAll().subscribe({
            next: (resp: RoleGetAllResponse) => {
              this.adminDataService.setRoles(resp);
            },
          });
        }
      },
    });
  }

  onSelectAccount(user: User) {
    console.log(user)
    this.accountDialog = true;
    this.accountsChanged = true;
    this.accountForEdit = user;
  }
  onEditAccount() {
    if (!this.accountForEdit) return;
    let roleId;
    if (this.editForm.get('role')?.value === this.accountForEdit.roleName) {
      roleId = 0;
      console.log(roleId);
    } else {
      roleId = this.editForm.get('role')?.value;
    }

    console.log(roleId);
    const body: UserUpdateRequest = {
      id: this.accountForEdit.id!,
      firstName: this.editForm.get('firstName')?.value,
      lastName: this.editForm.get('lastName')?.value,
      userName: this.editForm.get('userName')?.value,
      email: this.editForm.get('email')?.value,
      password: this.editForm.get('password')?.value,
      phoneNumber: this.editForm.get('phoneNumber')?.value,
      roleId: roleId === "" ? 0 : roleId,
      imageBase64String: 'need to fix',
    };
    this.resetEditForm();
    this.editSubs = this.userService.update(body).subscribe({
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.accountsChanged = true;
        this.fetchUsers();
        this.accountDialog = false;
        this.accountForEdit = null;
        this.messageService.add({
          severity: 'success',
          detail: 'Промените са запазени!',
          life: 3000,
        });
      },
    });
  }

  onDeleteUser(user: User) {
    if (!user) return;

    let body: DeleteRequest = {
      id: user.id!,
    };
    this.confirmationService.confirm({
      message: `Сигурнили сте, че искате да изтриете ${user.userName} ?`,
      header: 'Потвърди',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Да',
      rejectLabel: 'Не',
      accept: () => {
        this.deleteSubs = this.userService.delete(body).subscribe({
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            this.accountsChanged = true;
            this.messageService.add({
              severity: 'success',
              detail: 'Акаунтът е изтрит успешно!',
              life: 3000,
            });
            this.fetchUsers();
          },
        });
      },
    });
  }

  onDiscard() {
    this.accountDialog = false;
    this.resetEditForm();
  }

  resetEditForm() {
    this.editForm.patchValue({
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
      phoneNumber: '',
      role: '',
    });
  }

  ngOnDestroy(): void {
    this.deleteSubs?.unsubscribe();
    this.editSubs?.unsubscribe();
    this.usersFetchSubs?.unsubscribe();
    this.usersGetSubs?.unsubscribe();
    this.roleFetchSubs?.unsubscribe();
    this.roleGetSubs?.unsubscribe();
  }
}
