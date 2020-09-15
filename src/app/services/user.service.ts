import { Injectable } from '@angular/core';

import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import gql from 'graphql-tag';

const USER_SEARCH = gql`
  query getUsers ($searchTerm: String!, $recordsToReturn: Int!) {
    search(query: $searchTerm, type: USER, first: $recordsToReturn) {
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

  fetchMoreUsers(searchTerms): any {
    console.log(searchTerms);
    this.apollo.watchQuery<any>({
      query: USER_SEARCH,
      variables: {
        searchTerm: searchTerms,
        recordsToReturn: 10
      }
    })
      .valueChanges
        .subscribe(({ data, loading }) => {
         this.loading = loading;
         this.users = data.search;
       });

    return this.users;
  }

  getUsers(): any {
    return  new Promise((resolve, reject) => {
      let me = this;
      this.apollo.watchQuery<any>({
        query: USER_SEARCH,
        variables: {
          searchTerm: 'moose',
          recordsToReturn: 10
        }
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
