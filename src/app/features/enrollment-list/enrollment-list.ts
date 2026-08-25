import { Component, inject, viewChild, effect, OnInit } from '@angular/core';
import {
  MatTableModule,
  MatTableDataSource
} from '@angular/material/table';
import {
  MatPaginatorModule,
  MatPaginator
} from '@angular/material/paginator';
import {
  MatSortModule,
  MatSort
} from '@angular/material/sort';

import { EnrollmentStore } from '../../store/enrollment.store';
import { Enrollment } from '../../models/enrollment.model';

@Component({
  selector: 'tms-enrollment-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './enrollment-list.html',
  styleUrl: './enrollment-list.scss'
})
export class EnrollmentListComponent {
  store = inject(EnrollmentStore);

  displayedColumns = [
    'studentName',
    'courseName',
    'status',
    'actions'
  ];

  // Connects the EnrollmentStore data to Angular Material.
  dataSource = new MatTableDataSource<Enrollment>();

  // Angular 22 signal-based view queries.
  readonly paginator = viewChild.required(MatPaginator);
  readonly sort = viewChild.required(MatSort);

  constructor() {

    // Keep the Material table synchronized with the store.
    effect(() => {
      this.dataSource.data = this.store.entities();
    });

    // Connect sorting and pagination to the Material data source.
    effect(() => {
      this.dataSource.paginator = this.paginator();
      this.dataSource.sort = this.sort();
    });

    // Load enrollment data.
    this.store.loadEnrollments();
  }
  approve(id: number) {
  this.store.approveEnrollment((id));
}
}