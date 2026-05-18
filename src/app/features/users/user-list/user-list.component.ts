/**

 * LEARNING: Server-side table paging emits pageChange; debounceSearch avoids API spam.

 * DataTable runs clientSide=false so parent owns data fetching.

 */



import {

  ChangeDetectionStrategy,

  Component,

  DestroyRef,

  inject,

  OnInit,

  signal,

} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';

import { RouterLink } from '@angular/router';

import { Subject, switchMap, tap } from 'rxjs';



import { ROLES } from '../../../core/constants/roles.constant';

import type { User } from '../../../core/models/user.model';

import {

  DataTableComponent,

  type DataTableColumn,

  type DataTablePageEvent,

} from '../../../shared/components/data-table/data-table.component';

import { LoadingSkeletonComponent } from '../../../shared/components/loading-skeleton/loading-skeleton.component';

import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';


import { debounceSearch } from '../../../shared/utils/rxjs-operators';

import { UserService } from '../services/user.service';



type UserRow = User & Record<string, unknown>;



@Component({

  selector: 'app-user-list',

  standalone: true,

  imports: [

    ReactiveFormsModule,

    RouterLink,

    PageHeaderComponent,

    DataTableComponent,

    LoadingSkeletonComponent,

    MatButtonModule,


  ],

  templateUrl: './user-list.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,

})

export class UserListComponent implements OnInit {

  private readonly userService = inject(UserService);

  private readonly destroyRef = inject(DestroyRef);



  protected readonly searchControl = new FormControl('', { nonNullable: true });

  protected readonly loading = signal(true);

  protected readonly users = signal<UserRow[]>([]);

  protected readonly total = signal(0);

  protected readonly pageIndex = signal(0);

  protected readonly pageSize = signal(10);



  private readonly reload$ = new Subject<{ page: number; limit: number; q: string }>();



  protected readonly columns: DataTableColumn<UserRow>[] = [

    { key: 'firstName', label: 'First name', sortable: true },

    { key: 'lastName', label: 'Last name', sortable: true },

    { key: 'email', label: 'Email' },

    {

      key: 'role',

      label: 'Role',

      format: (row) => ROLES[row.role] ?? row.role,

    },

    { key: 'department', label: 'Department' },

    {

      key: 'isActive',

      label: 'Status',

      format: (row) => (row.isActive ? 'Active' : 'Inactive'),

    },

  ];



  ngOnInit(): void {

    this.reload$

      .pipe(

        tap(() => this.loading.set(true)),

        switchMap(({ page, limit, q }) =>

          this.userService.getUsers({ page, limit, q: q || undefined }),

        ),

        takeUntilDestroyed(this.destroyRef),

      )

      .subscribe({

        next: (result) => {

          this.users.set(result.items as UserRow[]);

          this.total.set(result.total);

          this.loading.set(false);

        },

        error: () => this.loading.set(false),

      });



    this.searchControl.valueChanges

      .pipe(debounceSearch(300), takeUntilDestroyed(this.destroyRef))

      .subscribe((term) => {

        this.pageIndex.set(0);

        this.fetch(0, this.pageSize(), term);

      });



    this.fetch(0, this.pageSize(), '');

  }



  protected onPage(event: DataTablePageEvent): void {

    this.pageIndex.set(event.pageIndex);

    this.pageSize.set(event.pageSize);

    this.fetch(event.pageIndex, event.pageSize, this.searchControl.value);

  }



  protected onSearch(term: string): void {

    this.searchControl.setValue(term, { emitEvent: false });

    this.pageIndex.set(0);

    this.fetch(0, this.pageSize(), term);

  }



  private fetch(pageIndex: number, pageSize: number, q: string): void {

    this.reload$.next({ page: pageIndex + 1, limit: pageSize, q });

  }

}


