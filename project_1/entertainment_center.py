import media, fresh_tomatoes

#movie objects
avengers = media.Movie("The Avengers",
                        "https://upload.wikimedia.org/wikipedia/en/f/f9/TheAvengers2012Poster.jpg",
                        "https://www.youtube.com/watch?v=eOrNdBpGMv8")

super_troopers = media.Movie("Super Troopers", 
                             "https://upload.wikimedia.org/wikipedia/en/1/19/Supertrooper.jpg",
                             "https://www.youtube.com/watch?v=TKzD0z8Jv9I")

incredibles = media.Movie("The Incredibles", 
                            "https://upload.wikimedia.org/wikipedia/en/e/ec/The_Incredibles.jpg",
                            "https://www.youtube.com/watch?v=eZbzbC9285I")

mallrats = media.Movie("Mallrats", 
                        "https://upload.wikimedia.org/wikipedia/en/9/96/Mallrats.jpg",
                        "https://www.youtube.com/watch?v=eOd5zJLsZEc")

deadpool = media.Movie("Deadpool", 
                        "https://upload.wikimedia.org/wikipedia/en/4/46/Deadpool_poster.jpg",
                        "https://www.youtube.com/watch?v=Xithigfg7dA")

deadpool_2 = media.Movie("Deadpool 2", 
                        "https://upload.wikimedia.org/wikipedia/en/c/cf/Deadpool_2_poster.jpg",
                        "https://www.youtube.com/watch?v=D86RtevtfrA")
#list of the movie objects
movies = [avengers, super_troopers, incredibles, mallrats, deadpool, deadpool_2]

#call fresh tomatoes and load the list of movies 
fresh_tomatoes.open_movies_page(movies)