import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const SIGNUP_MUTATION = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  successMessage = '';
  errorMessage = '';

  constructor(private apollo: Apollo, private router: Router) {}

  onSignup() {
    this.apollo.mutate({
      mutation: SIGNUP_MUTATION,
      variables: {
        name: this.name,
        email: this.email,
        password: this.password
      }
    }).subscribe({
      next: (result: any) => {
        if (result?.data?.signup) {
          this.successMessage = `User ${result.data.signup.name} registered successfully!`;
          this.errorMessage = '';

          // ⏳ Wait before redirecting to login
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2500); // 2.5 seconds
        } else {
          this.successMessage = '';
          this.errorMessage = 'Signup failed. Please try again.';
        }
      },
      error: (err) => {
        this.errorMessage = err.message || 'An error occurred.';
        this.successMessage = '';
      }
    });
  }
}
