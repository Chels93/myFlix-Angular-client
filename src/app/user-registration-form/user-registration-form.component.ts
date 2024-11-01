import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
})
export class UserRegistrationFormComponent implements OnInit {
  registrationForm!: FormGroup;

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Initialize the form with required validators
    this.initForm();
  }

  private initForm(): void {
    this.registrationForm = this.fb.group({
      username: ['', Validators.required],  // Username field is required
      password: ['', [Validators.required, Validators.minLength(6)]],  // Password with a minimum length
      email: ['', [Validators.required, Validators.email]],  // Email validation
      birthdate: ['']  // Optional birthdate field
    });
  }

  // Function to handle form submission for user registration
  registerUser(): void {
    if (this.registrationForm.valid) {
      console.log('Form Values:', this.registrationForm.value);  // Debugging line to log form values

      // Call to service for user registration
      this.fetchApiData.userRegistration(this.registrationForm.value).subscribe(
        (result) => {
          console.log('Registration successful:', result);  // Log the result on success
          this.dialogRef.close();  // Close the dialog on success
          this.snackBar.open('User registration successful', 'OK', {
            duration: 2000,
          });
        },
        (error) => {
          console.error('Registration error:', error);  // Log the error
          const errorMessage = this.extractErrorMessage(error);
          this.snackBar.open(`User registration failed: ${errorMessage}`, 'OK', {
            duration: 3000,
          });
        }
      );
    } else {
      // Mark all fields as touched to show validation errors
      this.registrationForm.markAllAsTouched();
      this.snackBar.open('Please fill in all required fields correctly', 'OK', {
        duration: 3000,
      });
    }
  }

  // Extract and format error message from the API response
  private extractErrorMessage(error: any): string {
    // You can define an interface for your error structure if needed
    if (error.error && error.error.errors) {
      return error.error.errors
        .map((err: { path: string; msg: string }) => `${err.path}: ${err.msg}`)
        .join(', ');
    }
    return error.message || 'An unknown error occurred. Please try again later.';
  }
}
