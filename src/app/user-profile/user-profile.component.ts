import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'], // Corrected styleUrls property
})
export class UserProfileComponent implements OnInit {
  user: any = {}; // Define a more specific type if possible

  constructor(private fetchApiData: FetchApiDataService) {}

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  fetchUserProfile(): void {
    // Fetch user profile data from API
    this.fetchApiData.getUserProfile().subscribe(
      (data: any) => { // Specify the type for data if you have a specific structure
        this.user = data;
      },
      (error: any) => { // Specify the type for error
        console.error('Error fetching user profile', error);
      }
    );
  }

  onUpdate(): void {
    // Call an update profile method in your service
    this.fetchApiData.updateUserProfile(this.user).subscribe(
      (response: any) => { // Specify the type for response
        console.log('Profile updated', response);
      },
      (error: any) => { // Specify the type for error
        console.error('Profile update error', error);
      }
    );
  }
}
