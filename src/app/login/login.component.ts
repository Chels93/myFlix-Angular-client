import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  loginUser(): void {
    if (this.loginForm.valid) {
      console.log('Login Form Values:', this.loginForm.value);
      this.fetchApiData.userLogin(this.loginForm.value).subscribe(
        (response) => {
          console.log(response);
          // Save current user and token to localStorage
          localStorage.setItem('user', response.user.username);
          localStorage.setItem('token', response.token);
          this.dialogRef.close(); // Close the dialog on successful login
          this.snackBar.open('Login successful', 'OK', { duration: 2000 });
        },
        (error) => {
          console.error('Login error:', error);
          this.snackBar.open('Login failed. Please check your credentials.', 'OK', { duration: 3000 });
        }
      );
    } else {
      this.loginForm.markAllAsTouched();
      this.snackBar.open('Please fill in all required fields', 'OK', { duration: 3000 });
    }
  }
}
