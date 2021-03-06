import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { Apollo, APOLLO_OPTIONS } from "apollo-angular";
import { HttpLinkModule, HttpLink } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpClientModule  } from "@angular/common/http";
import { ApolloClient } from 'apollo-client';
import {IntrospectionFragmentMatcher} from 'apollo-cache-inmemory';
import introspectionQueryResultData from './fragmentTypes.json';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AgGridModule } from 'ag-grid-angular';

import { AboutComponent } from './about/about.component';
import { UserGridComponent } from './user-grid/user-grid.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { GridPagingComponent } from './grid-paging/grid-paging.component';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});

const cache = new InMemoryCache({ fragmentMatcher });

const uri = 'https://api.github.com/graphql';
const token = '';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    UserGridComponent,
    SearchBarComponent,
    GridPagingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpLinkModule,
    AppRoutingModule,
    AgGridModule.withComponents(null)
  ],
  exports: [UserGridComponent,GridPagingComponent],
  providers: [{
    provide: APOLLO_OPTIONS,
    useFactory: (httpLink) => {
      return new ApolloClient({
        cache: cache,
        link:  httpLink.create({
          uri: uri,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
      })
    },
    deps: [HttpLink]
  }],
  bootstrap: [AppComponent]
})

export class AppModule { }
