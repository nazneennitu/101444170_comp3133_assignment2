import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, HttpClientModule } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';

const uri = 'http://localhost:4000/graphql';

const apolloClient = new ApolloClient({
  link: createHttpLink({ uri }),
  cache: new InMemoryCache(),
});

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(appRoutes),
    importProvidersFrom(
      HttpClientModule,
      FormsModule
    ),
    Apollo, 
    {
      provide: APOLLO_OPTIONS,
      useValue: apolloClient,
    },
  ],
});
