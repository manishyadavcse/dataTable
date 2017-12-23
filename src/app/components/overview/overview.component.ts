import { Component, OnInit, ViewChild, Inject } from '@angular/core';


import {MatTableDataSource, MatPaginator} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MatSnackBar} from '@angular/material';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
	
	displayedColumns = ['select', 'action', 'projectTitle', 'summaryAbstract', 'lastModified'];
	dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
	selection = new SelectionModel<Element>(true, []);
	
	@ViewChild(MatPaginator) paginator: MatPaginator;
	
	editRecord(event: any, element: any) {
		event.stopPropagation();
		const index = this.dataSource.data.indexOf(element);
		let dialogRef = this.dialog.open(CreateEditDialog, {
			width: '450px',
			data: { isEdit: true, ele: this.dataSource.data[index] },
		});

		dialogRef.afterClosed().subscribe(result => {
			if(result != undefined) {
				this.dataSource.data[this.dataSource.data.indexOf(element)] = result;
				this.dataSource.paginator = this.paginator;
			}
		});
	}
	
	createRecord(isCreate: boolean) {
		var existingJobTitles = [];
		this.dataSource.data.map((name) => {existingJobTitles.push(name.projectTitle)})
		let dialogRef = this.dialog.open(CreateEditDialog, {
			width: '450px',
			data: { isEdit: false, ele: undefined, existingJobTitles: existingJobTitles },
		});

		dialogRef.afterClosed().subscribe(result => {
			if(result !== undefined) {
				this.dataSource.data.push(result);
				this.dataSource.paginator = this.paginator;
			}
		});
	}
	
	deleteSnackBar() {
		this.snackBar.open("Record deleted successfully", "", {
			duration: 2000,
		});
	}
	
	deleteRecord(event: any, element:any) {
		event.stopPropagation();
		let dialogRef = this.dialog.open(ConfirmationDialogForDelete, {
			width: '450px',
		});

		dialogRef.afterClosed().subscribe(result => {
			if(result) {
				this.dataSource.data.splice(this.dataSource.data.indexOf(element), 1);
				this.dataSource.paginator = this.paginator;
				this.deleteSnackBar();
			}
		});

	}

	constructor(public dialog: MatDialog, public snackBar: MatSnackBar) { }
	
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}
	
	masterToggle() {
		this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
	}


	ngOnInit() {
	}
	
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
	}

}

@Component({
  selector: 'confirmation-dialog-for-delete',
  template: `<h5 mat-dialog-title>Are you sure you want to delete the record?</h5> <div fxLayout="row" fxLayoutAlign="end end" style="margin-top:1.5rem"><button mat-raised-button mat-dialog-close style="margin-right:1rem;">No</button><button mat-raised-button [mat-dialog-close]="true" color="primary" style="background-color:teal">Yes</button></div>`,
})
export class ConfirmationDialogForDelete {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogForDelete>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'create-edit-dialog',
  template: `<h5 mat-dialog-title>{{data.isEdit ? "Edit Project":"Create new project"}}</h5> 
	<div fxLayout="row">
		<div fxFlex="50">
			Select IP Type *
		</div>
		<div fxFlex="50">
			<mat-select placeholder="Select" [(value)]="formType.ipType">
				<mat-option *ngFor="let ip of IPType" [value] = "ip">
					{{ ip }}
				</mat-option>
			</mat-select>
		</div>
	</div>
		
	<div fxLayout="row">
		<div fxLayout="row" fxFlex="100">
			<mat-form-field fxFlex="100">
				<input matInput placeholder="IP Reference Number" [(ngModel)] = "formType.ipReferenceNumber">
			</mat-form-field>
		</div>
	</div>
		
	<div fxLayout="row">
		<div fxLayout="row" fxFlex="100">
			<mat-form-field fxFlex="100">
				<input matInput placeholder="Owner *" [(ngModel)] = "formType.owner">
			</mat-form-field>
		</div>
	</div>
		
	<div fxLayout="row">
		<div fxLayout="row" fxFlex="100">
			<mat-form-field fxFlex="100">
				<input matInput placeholder="Name of Inventor * " [(ngModel)] = "formType.nameOfInventor">
			</mat-form-field>
		</div>
	</div>
		
	<div fxLayout="row">
		<div fxLayout="row" fxFlex="50" *ngIf = "data.isEdit">
			{{"Project Title"}}
		</div>
		<div fxLayout="row" fxFlex="50" *ngIf = "data.isEdit" style="margin-bottom:1rem">
			{{formType.projectTitle}}
		</div>
		<div fxLayout="row" fxFlex="100" *ngIf = "!data.isEdit">
			<mat-form-field fxFlex="100">
				<input matInput placeholder="Project Title *" [(ngModel)] = "formType.projectTitle">
			</mat-form-field>
		</div>
	</div>
	<div fxLayout="row">
		<div fxLayout="row" fxFlex="100" *ngIf = "!data.isEdit && doesprojectTitleExists()">
			<span style="color:red">This Project Title already exists. Please type another one</span>
		</div>
	</div>
		
	<div fxLayout="row">
		<div fxLayout="row" fxFlex="100">
			<mat-form-field fxFlex="100">
				<textarea matInput placeholder="Summary / Abstract" [(ngModel)] = "formType.summaryAbstract"></textarea>
			</mat-form-field>
		</div>
	</div>  
	
	<div fxLayout="row">
		<sup>All * marked fields are mandatory.</sup>
	</div>
	
	<div fxLayout="row" fxLayoutAlign="end end" style="margin-top:1.5rem">
		<button mat-raised-button mat-dialog-close style="margin-right:1rem;" (click)="cancelForm()">Cancel</button>
		<button mat-raised-button (click)="submitForm()" color="primary" style="background-color:teal" [disabled] ="formType.ipType.length == 0 || formType.projectTitle.length == 0 || formType.owner.length == 0 || formType.nameOfInventor.length == 0">{{data.isEdit ? "Update" : "Create"}}</button>
	</div>`,
})
export class CreateEditDialog {
	
	IPType = ["Patent", "Trademark", "Copyright", "Others"];
	formType = {
		ipType: "",
		ipReferenceNumber: "",
		owner: "",
		nameOfInventor: "",
		projectTitle: "",
		summaryAbstract: "",
		lastModified: "18 Dec 2017"
	}

	constructor( public dialogRef: MatDialogRef<CreateEditDialog>,@Inject(MAT_DIALOG_DATA) public data: any) {
		if(this.data.isEdit){
			this.formType = this.data.ele;
		}
	}
	
	doesprojectTitleExists() {
		if(this.data.existingJobTitles.indexOf(this.formType.projectTitle) >= 0)	return true;
		else return false;
	}
	
	onNoClick(): void {
		this.dialogRef.close(undefined);
	}
	
	cancelForm() {
		this.dialogRef.close(undefined);
	}

	submitForm(): void {
		this.dialogRef.close(this.formType);
	}

}

export interface Element {
	ipType: string,
	ipReferenceNumber: string,
	owner: string,
	nameOfInventor: string,
	projectTitle: string;
	summaryAbstract: string;
	lastModified: string;
}

const ELEMENT_DATA: Element[] = [
	// uncomment below lines to have pre populated data
	  /* {projectTitle: 'Hydrogen', lastModified: "18 Dec 2017", summaryAbstract: 'H', ipType:"Patent", ipReferenceNumber: "001", owner: "Manish", nameOfInventor: "Manish"},
	  {projectTitle: 'Helium', lastModified: "18 Dec 2017", summaryAbstract: 'He', ipType:"Patent", ipReferenceNumber: "001", owner: "Manish", nameOfInventor: "Manish"},
	  {projectTitle: 'Lithium', lastModified: "18 Dec 2017", summaryAbstract: 'Li', ipType:"Patent", ipReferenceNumber: "001", owner: "Manish", nameOfInventor: "Manish"},
	  {projectTitle: 'Beryllium', lastModified: "18 Dec 2017", summaryAbstract: 'Be', ipType:"Patent", ipReferenceNumber: "001", owner: "Manish", nameOfInventor: "Manish"},
	  {projectTitle: 'Boron', lastModified: "18 Dec 2017", summaryAbstract: 'B', ipType:"Patent", ipReferenceNumber: "001", owner: "Manish", nameOfInventor: "Manish"},
	  {projectTitle: 'Carbon', lastModified: "18 Dec 2017", summaryAbstract: 'C', ipType:"Patent", ipReferenceNumber: "001", owner: "Manish", nameOfInventor: "Manish"},
	  {projectTitle: 'Nitrogen', lastModified: "18 Dec 2017", summaryAbstract: 'N', ipType:"Patent", ipReferenceNumber: "001", owner: "Manish", nameOfInventor: "Manish"},
	  {projectTitle: 'Oxygen', lastModified: "18 Dec 2017", summaryAbstract: 'O', ipType:"Patent", ipReferenceNumber: "001", owner: "Manish", nameOfInventor: "Manish"},
	  {projectTitle: 'Fluorine', lastModified: "18 Dec 2017", summaryAbstract: 'F', ipType:"Patent", ipReferenceNumber: "001", owner: "Manish", nameOfInventor: "Manish"},
	  {projectTitle: 'Neon', lastModified: "18 Dec 2017", summaryAbstract: 'Ne', ipType:"Patent", ipReferenceNumber: "001", owner: "Manish", nameOfInventor: "Manish"},
	  {projectTitle: 'Sodium', lastModified: "18 Dec 2017", summaryAbstract: 'Na', ipType:"Patent", ipReferenceNumber: "001", owner: "Manish", nameOfInventor: "Manish"},
	  {projectTitle: 'Magnesium', lastModified: "18 Dec 2017", summaryAbstract: 'Mg', ipType:"Patent", ipReferenceNumber: "001", owner: "Manish", nameOfInventor: "Manish"},
	  {projectTitle: 'Aluminum', lastModified: "18 Dec 2017", summaryAbstract: 'Al', ipType:"Patent", ipReferenceNumber: "001", owner: "Manish", nameOfInventor: "Manish"},
	  {projectTitle: 'Silicon', lastModified: "18 Dec 2017", summaryAbstract: 'Si', ipType:"Patent", ipReferenceNumber: "001", owner: "Manish", nameOfInventor: "Manish"},
	  {projectTitle: 'Phosphorus', lastModified: "18 Dec 2017", summaryAbstract: 'P', ipType:"Patent", ipReferenceNumber: "001", owner: "Manish", nameOfInventor: "Manish"},
	  {projectTitle: 'Sulfur', lastModified: "18 Dec 2017", summaryAbstract: 'S', ipType:"Patent", ipReferenceNumber: "001", owner: "Manish", nameOfInventor: "Manish"},
	  {projectTitle: 'Chlorine', lastModified: "18 Dec 2017", summaryAbstract: 'Cl', ipType:"Patent", ipReferenceNumber: "001", owner: "Manish", nameOfInventor: "Manish"},
	  {projectTitle: 'Argon', lastModified: "18 Dec 2017", summaryAbstract: 'Ar', ipType:"Patent", ipReferenceNumber: "001", owner: "Manish", nameOfInventor: "Manish"},
	  {projectTitle: 'Potassium', lastModified: "18 Dec 2017", summaryAbstract: 'K', ipType:"Patent", ipReferenceNumber: "001", owner: "Manish", nameOfInventor: "Manish"},
	  {projectTitle : 'Calcium', lastModified: "18 Dec 2017", summaryAbstract: 'Ca', ipType:"Patent", ipReferenceNumber: "001", owner: "Manish", nameOfInventor: "Manish"},
	 */
];