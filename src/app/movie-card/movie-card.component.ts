import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService, 
    public router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe(res => {
        this.movies = res;

        let user = JSON.parse(localStorage.getItem("user") || "");
        this.movies.forEach((movie: any) => {
            movie.isFavorite = user.favoriteMovies.includes(movie._id);
        })
        return this.movies;
    }, err => {
        console.error(err)
    })
}
}