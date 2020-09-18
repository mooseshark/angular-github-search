import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

import { SearchBarComponent } from '../search-bar/search-bar.component';

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
    {
      headerName: "",
      field: "avatarUrl",
      cellRenderer: this.imgRenderer
    },{
      headerName: "Login Name",
      field: "login"
    },{
      headerName: "Name",
      field: "name"
    },{
      headerName: "Bio",
      field: "bioHTML",
      cellRenderer: this.htmlRenderer,
      cellStyle: {"white-space": "normal", "overflow-y": "auto"}
    },{
      headerName: "Location",
      field: "location"
    },{
      headerName: "Status",
      field: "status",
      cellRenderer: this.statusRenderer
    },{
      headerName: "E-mail",
      field: "email"
    },{
      headerName: "Company",
      field: "companyHTML",
      cellRenderer: this.htmlRenderer,
      cellStyle: {"word-wrap": "break-word"}
    },{
      headerName: "Twitter Handle",
      field: "twitterUsername",
      cellRenderer: this.twitterRenderer
    },{
      headerName: "Website",
      field: "websiteUrl",
      cellRenderer: this.websiteRenderer
    },{
      headerName: "Total Followers",
      field: "followers.totalCount"
    },{
      headerName: "Total Packages",
      field: "packages.totalCount"
    },{
      headerName: "Total Projects",
      field: "projects.totalCount"
    },{
      headerName: "Total Repositories",
      field: "repositories.totalCount"
    },{
      headerName: "Total Repositories Disk Usage",
      field: "repositories.totalDiskUsage",
      cellRenderer: this.totalDiskUsageRenderer
    },{
      headerName: "Total Issues",
      field: "issues.totalCount"
    },{
      headerName: "Total Following",
      field: "following.totalCount"
    },{
      headerName: "Total Starred Repositories",
      field: "starredRepositories.totalCount"
    },{
      headerName: "",
      field: "url",
      cellRenderer: this.onClickButton,
      cellStyle: {"text-align": "center"}
    },
  ];

  rowData: any = [];
  private users: any = [];

  constructor(private userService: UserService) { }

  /*
   * Status Renderers
   */
  htmlRenderer(params): any { return params.value; }

  imgRenderer(params): any {
    if(!params.value) return ;
    return '<img src="' + params.value + '" width="100" height="100">';
  }

  statusRenderer(params): any { return params.value }

  totalDiskUsageRenderer(params): any { return params.value ? params.value + ' KB' : '0 KB' }

  twitterRenderer(params): any {
    if(!params.value) return ;
    return '<a href="https://twitter.com/' + params.value + '" rel="noopener noreferrer" target="_blank">' + params.value + '</a>';
  }

  websiteRenderer(params): any {
    if(!params.value) return ;
    if(params.value.indexOf('http://') === -1 && params.value.indexOf('https://') === -1){
      params.value = 'http://' + params.value;
    }
    return '<a href="' + params.value + '" rel="noopener noreferrer" target="_blank">' + params.value + '</a>';
  }

  onClickButton(params): any {
    if(params.value)
      return '<a class="btn btn-info" href="' + params.value + '" role="button" rel="noopener noreferrer" target="_blank">View Profile</a>'
  }

  async getUsers(searchTerms): Promise<any> {
      let unfilteredRowData = [];

      console.log('user component');
      console.log(searchTerms);

      this.users = await this.userService.getUsers(searchTerms);
      unfilteredRowData = this.users.nodes;

      console.log(unfilteredRowData);

      for (let r in unfilteredRowData) {
        if (unfilteredRowData[r].status)
          unfilteredRowData[r].status = unfilteredRowData[r].status.message + ' ' + unfilteredRowData[r].status.emojiHTML;
      }

      this.rowData =  unfilteredRowData;
  }

  ngOnInit(): void {
  }
}
