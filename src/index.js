document.addEventListener('DOMContentLoaded', () => {
    const movieList = document.getElementById('films');
    let movieData = [];

    function fetchMoviesFromDB() {
        fetch('db.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching movies from db.json');
                }
                return response.json();
            })
            .then(data => {
                movieData = data.films;
                displayMovies();
            })
            .catch(error => {
                console.error('Error fetching movies from db.json:', error);
                showErrorMessage('Error loading movie data');
            });
    }

    function displayMovies() {
        movieData.forEach(movie => {
            const li = createMovieListItem(movie);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', () => deleteMovie(movie.id));
            li.appendChild(deleteButton);
            movieList.appendChild(li);
        });
    }

    function createMovieListItem(movie) {
        const li = document.createElement('li');
        li.textContent = movie.title;
        li.dataset.movieId = movie.id;
        li.classList.add('film', 'item');
        li.addEventListener('click', () => updateMovieDetails(movie.id));
        return li;
    }

    function updateMovieDetails(movieId) {
        const movie = movieData.find(m => m.id === movieId);
        if (!movie) return;

        const availableTickets = movie.capacity - movie.tickets_sold;
        const buyTicketButton = document.getElementById('buy-ticket');

        buyTicketButton.textContent = availableTickets > 0 ? 'Buy Ticket' : 'Sold Out';
        buyTicketButton.classList.toggle('disabled', availableTickets === 0);
        buyTicketButton.onclick = () => {
            if (availableTickets > 0) {
                buyTicket(movie);
            }
        };

        displayMovieDetails(movie);
    }

    function buyTicket(movie) {
        movie.tickets_sold++;
        updateTicketCount(movie.id);
        updateMovieDetails(movie.id);
    }

    function updateTicketCount(movieId) {
        const movie = movieData.find(m => m.id === movieId);
        const availableTickets = movie.capacity - movie.tickets_sold;
        document.getElementById('ticket-num').textContent = availableTickets;
    }

    function displayMovieDetails(movie) {
        document.getElementById('title').textContent = movie.title;
        document.getElementById('runtime').textContent = `${movie.runtime} minutes`;
        document.getElementById('film-info').textContent = movie.description;
        document.getElementById('showtime').textContent = movie.showtime;
        document.getElementById('poster').src = movie.poster;
        document.getElementById('poster').alt = `Poster for ${movie.title}`;
        updateTicketCount(movie.id);
    }

    function showErrorMessage(message) {
        const errorMessage = document.createElement('div');
        errorMessage.textContent = message;
        errorMessage.classList.add('ui', 'negative', 'message');
        document.body.appendChild(errorMessage);
        setTimeout(() => errorMessage.remove(), 5000);
    }

    function deleteMovie(movieId) {
        fetch(`deleteMovie/${movieId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error deleting movie');
            }
            return response.json();
        })
        .then(() => {
            movieData = movieData.filter(movie => movie.id !== movieId);
            const listItem = document.querySelector(`li[data-movie-id="${movieId}"]`);
            if (listItem) {
                listItem.remove();
            }
        })
        .catch(error => {
            console.error('Error deleting movie:', error);
            showErrorMessage('Error deleting movie');
        });
    }

    fetchMoviesFromDB();
});
