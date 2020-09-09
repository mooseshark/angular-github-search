import { Injectable } from '@angular/core';

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


@Injectable({
  providedIn: 'root'
})
export class UserService {
  loading: boolean = true;
  users: [];

  constructor(private apollo: Apollo) { }

  getUsers(): any {
    return  new Promise((resolve, reject) => {
      let me = this;
      this.apollo.watchQuery<any>({
        query: USER_SEARCH
      })
        .valueChanges
          .subscribe(({ data, loading }) => {
           this.loading = loading;
           this.users = data.search;
         });

      setTimeout( function() {
        resolve(me.users)
      }, 1000)
    })
  }
}
