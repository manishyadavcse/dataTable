import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';


import {MatIconModule} from '@angular/material/icon';
import { OverviewComponent, ConfirmationDialogForDelete, CreateEditDialog } from './components/overview/overview.component';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatPaginatorModule} from '@angular/material/paginator';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSnackBarModule} from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
	ConfirmationDialogForDelete,
	CreateEditDialog
  ],
  imports: [
    BrowserModule,
	FormsModule,
	MatIconModule,
	FlexLayoutModule,
	BrowserAnimationsModule,
	MatCheckboxModule,
	MatTableModule,
	MatPaginatorModule,
	MatButtonModule,
	MatDialogModule,
	MatInputModule,
	MatSelectModule,
	MatSnackBarModule
	MatToolbarModule,
  ],
  providers: [],
  entryComponents: [ ConfirmationDialogForDelete, CreateEditDialog ],
  bootstrap: [AppComponent]
})
export class AppModule { }
