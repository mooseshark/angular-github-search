import { Injectable, OnDestroy } from '@angular/core';

import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  private ngUnsubscribe = new Subject();

  constructor(private apollo: Apollo) { }

  /*fetchMoreUsers(searchTerms): any {
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
          console.log(data);
         this.loading = loading;
         this.users = data.search;
       });
       console.log(this.users);
    return this.users;
  }*/

  getUsers(searchTerms): any {
    return new Promise((resolve, reject) => {
      let me = this;

      console.log('service');
      console.log(searchTerms);

      this.apollo.watchQuery<any>({
        query: USER_SEARCH,
        variables: {
          searchTerm: searchTerms,
          recordsToReturn: 10
        }
      })
        .valueChanges
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(({ data, loading }) => {
            console.log('data');
            console.log(data.search);
           this.loading = loading;
           this.users = data.search;
         });

      setTimeout( function() {
        console.log(me.users);
        resolve(me.users)
        me.users = [];
      }, 1500)
    })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
