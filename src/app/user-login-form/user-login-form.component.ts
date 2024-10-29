import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { username: '', password: ''};

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  loginUser(): void {
      this.fetchApiData.userLogin(this.userData).subscribe(res => {
        this.dialogRef.close(); // Close the dialog on successful login
        this.snackBar.open('Login successful', 'OK', { 
            duration: 2000 
        });
        let user = {
            ...res.user,
            id: res.user._id,
            password: this.userData.password,
            token: res.token
        }
        localStorage.setItem("user", JSON.stringify(user));
        this.router.navigate(["movies"]);
    }, res => {
        this.snackBar.open("Login fail", "OK", {
            duration: 2000
        })
    })
}
}
