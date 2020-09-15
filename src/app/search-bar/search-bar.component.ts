import { Component, OnInit } from '@angular/core';

import { UserService } from '../services/user.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  // private searchTerms = '';

  constructor(private userService: UserService) { }

  search(term, event): void {
    event.preventDefault();

    this.userService.fetchMoreUsers(term);
  }




  ngOnInit(): void {
  }

}
