import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";
import { FormErrorsComponent } from "../form-errors/form-errors.component";
import { ClaimAccessDirective } from "../_directives/claim-access.directive";
import { StepsModule } from 'primeng/steps';

@NgModule({
    declarations: [
        FormErrorsComponent,
        ClaimAccessDirective,
    ],
    imports: [
        CommonModule,
        InputTextModule,
        FormsModule,
        ReactiveFormsModule,
        ToastModule,
        TableModule,
        ConfirmDialogModule,
        DialogModule,
        CascadeSelectModule,
        BreadcrumbModule,
        DropdownModule,
        ToolbarModule,
        StepsModule,
    ],
    exports: [
        CommonModule,
        InputTextModule,
        FormsModule,
        ReactiveFormsModule,
        ToastModule,
        TableModule,
        ConfirmDialogModule,
        DialogModule,
        CascadeSelectModule,
        BreadcrumbModule,
        DropdownModule,
        ToolbarModule,
        FormErrorsComponent,
        ClaimAccessDirective,
        StepsModule,
    ]
})
export class SharedModule {}
