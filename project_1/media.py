import webbrowser

"""constructor to hold movie information
such as movie title, poster, and trailer on youtube

Args:
    title(str): movie title
    poster_image_url: url for the poster image
    trailer_youtube_url: url for the trailer on youtube
"""


class Movie:
    def __init__(self, movie_title, poster_image, trailer_youtube):
        self.title = movie_title
        self.poster_image_url = poster_image
        self.trailer_youtube_url = trailer_youtube

    def show_trailer(self):
        webbrowser.open(self.trailer_youtube_url)
