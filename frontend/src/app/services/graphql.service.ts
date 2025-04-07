import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  constructor(
    private apollo: Apollo,
    private sessionService: SessionService 
  ) {}

  signup(user: any): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation Signup($username: String!, $email: String!, $password: String!) {
          signup(username: $username, email: $email, password: $password) {
            id
            username
            email
          }
        }
      `,
      variables: {
        username: user.username,
        email: user.email,
        password: user.password,
      },
    });
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
            user {
              id
              username
              email
            }
          }
        }
      `,
      variables: credentials,
      
    });
  }

  storeToken(token: string): void {
    this.sessionService.setToken(token);
  }

  getToken(): string | null {
    return this.sessionService.getToken();
  }

  logout(): void {
    this.sessionService.clearToken();
  }
}
