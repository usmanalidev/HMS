import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

/**
 * LEARNING: Smart presentational components accept data via @Input and emit events via @Output.
 *
 * OnPush change detection runs only when inputs change (by reference), events fire,
 * or observables emit via async pipe — fewer checks, better performance in large apps.
 *
 * MatTableDataSource adds client-side filter/sort/pagination; parent components can
 * instead handle server-side paging by listening to pageChange/sortChange/searchChange.
 */
export interface DataTableColumn<T = Record<string, unknown>> {
  /** Property key on each row object. */
  key: string;
  /** Column header label. */
  label: string;
  /** Enables mat-sort-header when true. */
  sortable?: boolean;
  /** Optional custom cell formatter. */
  format?: (row: T) => string;
}

export interface DataTablePageEvent {
  pageIndex: number;
  pageSize: number;
  length: number;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<T extends Record<string, unknown>> implements OnChanges {
  /** Column definitions driving headers and cell rendering. */
  @Input({ required: true }) columns: DataTableColumn<T>[] = [];

  /** Rows to display. Use a new array reference when data updates with OnPush. */
  @Input() data: T[] = [];

  /** Shows built-in search field when true. */
  @Input() searchable = true;

  /** Placeholder for the search input. */
  @Input() searchPlaceholder = 'Search…';

  /** Enables Material paginator footer. */
  @Input() paginated = true;

  /** Page size options passed to mat-paginator. */
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];

  /** Default page size. */
  @Input() pageSize = 10;

  /** Total items (for server-driven pagination). Defaults to data.length. */
  @Input() totalLength?: number;

  /** When true, sorting/filtering/paging is handled locally by MatTableDataSource. */
  @Input() clientSide = true;

  /** Emits debounced search text for server-side filtering. */
  @Output() readonly searchChange = new EventEmitter<string>();

  /** Emits when user changes page or page size. */
  @Output() readonly pageChange = new EventEmitter<DataTablePageEvent>();

  /** Emits when user clicks a sortable column header. */
  @Output() readonly sortChange = new EventEmitter<Sort>();

  protected readonly dataSource = new MatTableDataSource<T>([]);
  protected displayedColumns: string[] = [];
  protected searchTerm = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns']) {
      this.displayedColumns = this.columns.map((col) => col.key);
    }

    if (changes['data']) {
      this.dataSource.data = this.data ?? [];
    }
  }

  protected onSearchInput(value: string): void {
    this.searchTerm = value;
    if (this.clientSide) {
      this.dataSource.filter = value.trim().toLowerCase();
    }
    this.searchChange.emit(value.trim());
  }

  protected onPage(event: PageEvent): void {
    this.pageChange.emit({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
      length: event.length,
    });
  }

  protected onSort(sort: Sort): void {
    this.sortChange.emit(sort);
  }

  protected resolveCell(row: T, column: DataTableColumn<T>): string {
    if (column.format) {
      return column.format(row);
    }
    const value = row[column.key];
    return value == null ? '' : String(value);
  }

  protected get length(): number {
    return this.totalLength ?? this.data.length;
  }
}
