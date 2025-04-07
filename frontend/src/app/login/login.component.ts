import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../services/session.service'; 

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private apollo: Apollo,
    private router: Router,
    private sessionService: SessionService 
  ) {}

  onLogin() {
    this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: {
        email: this.email,
        password: this.password
      }
    }).subscribe({
      next: (result: any) => {
        const user = result?.data?.login;
      
        if (user) {
          this.sessionService.setUser(user);     // ✅ Store full user object
          this.successMessage = `Welcome ${user.name}!`;
          this.errorMessage = '';
      
          // Delay navigation to ensure data is saved
          setTimeout(() => {
            this.router.navigate(['/employee']).then(() => {
              window.location.reload(); // ✅ Force full reload to pick up user info
            });
          }, 1000);
        } else {
          this.successMessage = '';
          this.errorMessage = 'Login failed. Please try again.';
        }
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.successMessage = '';
      }
    });
  }
}
