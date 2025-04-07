import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { SessionService } from '../services/session.service';

const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!) {
    uploadFile(file: $file) {
      filename
      mimetype
      encoding
    }
  }
`;

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit { 
  selectedFile: File | null = null;
  uploadedFile: any = null;
  userName: string = '';

  constructor(
    private router: Router,
    private apollo: Apollo,
    private session: SessionService
  ) {}

  ngOnInit(): void {
    const user = this.session.getUser();
    console.log('Employee page user:', user);
    if (user && user.name) {
      this.userName = user.name;
    } else {
      this.userName = 'User';
    }
  }

  logout(): void {
    this.session.clearSession();
    this.router.navigate(['/login']);
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  upload(): void {
    if (!this.selectedFile) return;

    this.apollo.mutate({
      mutation: UPLOAD_FILE,
      variables: {
        file: this.selectedFile
      },
      context: {
        useMultipart: true
      }
    }).subscribe((result: any) => {
      this.uploadedFile = result?.data?.uploadFile;
    });
  }
}
