import { Component, EventEmitter, Output } from '@angular/core';

import { UserService } from '../services/user.service';

import { UserGridComponent } from '../user-grid/user-grid.component';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  constructor(private userService: UserService) { }

  @Output() searchTerms = new EventEmitter();

  search(term, event): void {
    event.preventDefault();
    this.searchTerms.emit(term);
  }

}
