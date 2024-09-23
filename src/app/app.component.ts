import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from './user-login-form/user-login-form.component'; // Corrected import
import { FetchApiDataService } from './fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ]
})
export class AppComponent {
  title = 'myFlix-Angular-client';

  constructor(
    public dialog: MatDialog,
    private fetchApiData: FetchApiDataService,
    private snackBar: MatSnackBar
  ) {}

  openUserRegistrationDialog(): void {
    const dialogRef = this.dialog.open(UserRegistrationFormComponent, {
      width: '480px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchApiData.userRegistration(result).subscribe(
          response => {
            console.log('Registration successful:', response);
            this.snackBar.open('User registration successful', 'OK', { duration: 2000 });
          },
          error => {
            console.error('Registration error:', error);
            this.snackBar.open('User registration failed', 'OK', { duration: 2000 });
          }
        );
      }
    });
  }

  openUserLoginDialog(): void { // Corrected function placement and definition
    this.dialog.open(UserLoginFormComponent, {
      width: '280px',
    });
  }
}
