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

const USER_SEARCH_NEXT = gql`
  query getUsers ($searchTerm: String!, $recordsToReturn: Int! $cursorNext: String!) {
    search(query: $searchTerm, type: USER, first: $recordsToReturn, after: $cursorNext) {
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

const USER_SEARCH_PREVIOUS = gql`
  query getUsers ($searchTerm: String!, $recordsToReturn: Int! $cursorPrevious: String!) {
    search(query: $searchTerm, type: USER, first: $recordsToReturn, before: $cursorPrevious)  {
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
  pageInfo: any = {};
  private ngUnsubscribe = new Subject();

  constructor(private apollo: Apollo) { }

  getUsers(searchTerms): any {
    return new Promise((resolve, reject) => {
      let me = this;

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
           this.loading = loading;
           this.users = data.search;
           this.pageInfo = data.search.pageInfo;
         });

      setTimeout( function() {
        resolve(me.users)
        me.users = [];
        me.ngOnDestroy();
      }, 1000)
    })
  }

  loadNextPage(searchTerms, endCursor): any {
    return new Promise((resolve, reject) => {
      let me = this;

      this.apollo.watchQuery<any>({
        query: USER_SEARCH_NEXT,
        variables: {
          searchTerm: searchTerms,
          recordsToReturn: 10,
          cursorNext: endCursor
        }
      })
        .valueChanges
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(({ data, loading }) => {
           this.loading = loading;
           this.users = data.search;
           this.pageInfo = data.search.pageInfo;
         });

      setTimeout( function() {
        resolve(me.users)
        me.users = [];
        me.ngOnDestroy();
      }, 1000)
    })
  }

  loadPreviousPage(searchTerms, startCursor): any {
    return new Promise((resolve, reject) => {
      let me = this;
      this.apollo.watchQuery<any>({
        query: USER_SEARCH_PREVIOUS,
        variables: {
          searchTerm: searchTerms,
          recordsToReturn: 10,
          cursorPrevious: startCursor
        }
      })
        .valueChanges
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(({ data, loading }) => {
           this.loading = loading;
           this.users = data.search;
           this.pageInfo = data.search.pageInfo;
         });

      setTimeout( function() {
        resolve(me.users)
        me.users = [];
        me.ngOnDestroy();
      }, 1000)
    })
  }

  ngOnDestroy() {
    this.apollo.getClient().resetStore();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
