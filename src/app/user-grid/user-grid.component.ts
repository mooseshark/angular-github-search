import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import gql from 'graphql-tag';

const USER_SEARCH = gql`
  query getUsers {
    search(query: "moose", type: USER, first: 10) {
       nodes {
         ... on User {
           login
           email
           location
           name
           url
           twitterUsername
           websiteUrl
           avatarUrl
           anyPinnableItems
           bioHTML
           companyHTML
           followers {
             totalCount
           }
           following {
             totalCount
           }
           packages {
             totalCount
           }
           projects {
             totalCount
           }
           repositories {
             totalCount
             totalDiskUsage
           }
           starredRepositories {
             totalCount
           }
           status {
             message
             emojiHTML
           }
           issues {
             totalCount
           }
         }
       }
       pageInfo {
         hasNextPage
         hasPreviousPage
         startCursor
         endCursor
       }
       userCount
     }
  }`;

@Component({
  selector: 'app-user-grid',
  templateUrl: './user-grid.component.html',
  styleUrls: ['./user-grid.component.css']
})
export class UserGridComponent implements OnInit {

  columnDefs = [
    {headerName: "", field: "avatarUrl"},
    {headerName: "Login Name", field: "login"},
    {headerName: "Name", field: "name"},
    {headerName: "Bio", field: "bioHMTL"},
    {headerName: "Location", field: "location"},
    {headerName: "Status", field: "status.message"},
    {headerName: "E-mail", field: "email"},
    {headerName: "Company", field: "companyHTML"},
    {headerName: "Twitter Handle", field: "twitterUsername"},
    {headerName: "Website", field: "websiteUrl"},
    {headerName: "Total Followers", field: "followers.totalCount"},
    {headerName: "Total Packages", field: "packages.totalCount"},
    {headerName: "Total Projects", field: "projects.totalCount"},
    {headerName: "Total Repositories", field: "repositories.totalCount"},
    {headerName: "Total Repositories Disk Usage", field: "repositories.totalDiskUsage"},
    {headerName: "Total Issues", field: "issues.totalCount"},
    {headerName: "Total Following", field: "following.totalCount"},
    {headerName: "Total Starred Repositories", field: "starredRepositories.totalCount"},
    {headerName: "", field: "url"},
  ];

  rowData = [];
  users: [];

  constructor(private userService: UserService) { }

  async getUsers(): Promise<any> {
      this.users = await this.userService.getUsers();
      let nodes = this.users.nodes;
      this.rowData = nodes;
      console.log(nodes);
  }

  ngOnInit(): void {
    this.getUsers();
  }
}
