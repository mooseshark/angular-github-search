import {
  Component,
  OnInit,
  Input,
  Output,
  ChangeDetectionStrategy,
  SimpleChanges,
  EventEmitter
} from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-grid-paging',
  templateUrl: './grid-paging.component.html',
  styleUrls: ['./grid-paging.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridPagingComponent implements OnInit {
  private previousCursor: Array<string> = [];
  pageNumber: number = 0;
  qntPages: number = 0;

  @Input() pageInfo: any;
  @Input() userCount: number = 0;

  @Output() loadNext = new EventEmitter();
  @Output() loadPrevious = new EventEmitter();
  @Output() loadFirst = new EventEmitter();

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pageInfo) {
      this.isActionDisabled('');
      this.getQntPages();
      this.pageNumber = this.userCount > 1 ? 1 : 0;
    }
  }

  getQntPages(): void {
    this.qntPages = this.userCount > 1 ? Math.ceil(this.userCount / 10) : 0;
  }

  loadFirstPage(event): void {
    event.preventDefault();
    console.log(this.previousCursor);

    this.pageNumber = 1;

    this.loadFirst.emit('10103d27-cfde-450a-a04b-3e3f7770fac3');
    // this.$emit('loadFirstPage');
  }

  loadNextPage(event): void {
    event.preventDefault();

    this.previousCursor.push(this.pageInfo.startCursor);
    console.log(this.previousCursor);
    this.pageNumber++;

    this.loadNext.emit(this.pageInfo.endCursor);
  }

  loadPreviousPage(event): void {
    this.pageNumber--;
    console.log(this.previousCursor);
    this.loadPrevious.emit(this.previousCursor[this.previousCursor.length - 1]);
    this.previousCursor.pop();
  }

  isActionDisabled(action): any  {
    switch (action) {
      case 'firstPage':
        return !this.pageInfo.hasPreviousPage ? true : false;
      case 'previousPage':
        return !this.pageInfo.hasPreviousPage ? true : false;
      case 'nextPage':
        return !this.pageInfo.hasNextPage ? true : false;
      default:
        return true;
    }
  }

}
