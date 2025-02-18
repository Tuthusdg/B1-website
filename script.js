$(document).ready(function() {
    const apiUrl = 'http://localhost:2506/films';

    // 🔥 Gestionnaire d'événement pour supprimer un film
    $('#movies-list').on('click', '.delete-button', function() {
        const movieCard = $(this).closest('.movie-card');
        const movieId = movieCard.attr('data-id');

        if (!movieId) {
            console.error("Erreur : ID non trouvé");
            return;
        }

        $.ajax({
            url: `${apiUrl}/${movieId}`,
            type: 'DELETE',
            success: function() {
                alert('Film supprimé avec succès !');
                movieCard.remove();
            },
            error: function(xhr, status, error) {
                console.error("Erreur suppression :", error);
            }
        });
    });

    // 🔥 Importer les films avec filtres
    $('#import-button').click(function() {
        const filter = $('#filter-select').val();
        const originFilter = $('#origin-select').val();
        const noteMin = $('#note-min').val();
        const noteMax = $('#note-max').val();

        let queryParams = [];
        if (filter !== 'all') queryParams.push(`niveau=${filter}`);
        if (originFilter !== 'all') queryParams.push(`origine=${originFilter}`);
        if (noteMin) queryParams.push(`noteMin=${noteMin}`);
        if (noteMax) queryParams.push(`noteMax=${noteMax}`);

        const queryString = queryParams.length ? '?' + queryParams.join('&') : '';

        $.ajax({
            url: apiUrl + queryString,
            type: 'GET',
            dataType: 'json',
            success: function(moviesData) {
                const container = $('#movies-list');
                container.empty();

                $.each(moviesData, function(i, movie) {
                    let instance = document.importNode($('#movie-template')[0].content, true);
                    $(instance).find('.nom').text(movie.nom);
                    $(instance).find('.realisateur').text(movie.realisateur);
                    $(instance).find('.compagnie').text(movie.compagnie);
                    $(instance).find('.dateDeSortie').text(movie.dateDeSortie || 'N/A');
                    $(instance).find('.note').text(movie.note ?? 'N/A');
                    $(instance).find('.notePublic').text(movie.notePublic ?? 'N/A');
                    $(instance).find('.description').text(movie.description);
                    $(instance).find('.lienImage').attr('src', 'http://localhost:2506/' + movie.lienImage);
                    $(instance).find('.movie-card').attr('data-id', movie.id);

                    container.append(instance);
                });
            },
            error: function(xhr, status, error) {
                console.error("Erreur récupération :", error);
            }
        });
    });

    // 🔄 Redirection vers formulaire.html
    $('#add-button').click(function() {
        window.location.href = 'formulaire.html';
    });
});
