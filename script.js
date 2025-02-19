$(document).ready(function() {
    const apiUrl = 'http://localhost:2506/films';

    // 🔥 Suppression d'un film
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

    // 🔥 Importation des films avec filtres
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

                    // Ajout des classes de style
                    if (parseFloat(movie.note) > 4 || parseFloat(movie.notePublic) > 4) {
                        $(instance).find('.movie-card').addClass('classic');
                    } else if (parseFloat(movie.note) >= 3 && parseFloat(movie.note) <= 4) {
                        $(instance).find('.movie-card').addClass('normal');
                    } else {
                        $(instance).find('.movie-card').addClass('bad');
                    }

                    $(instance).find('.nom').text(movie.nom);
                    $(instance).find('.realisateur').text(movie.realisateur);
                    $(instance).find('.compagnie').text(movie.compagnie);
                    $(instance).find('.dateDeSortie').text(movie.dateDeSortie || 'N/A');
                    $(instance).find('.note').text(movie.note ?? 'N/A');
                    $(instance).find('.notePublic').text(movie.notePublic ?? 'N/A');
                    $(instance).find('.description').text(movie.description);
                    $(instance).find('.lienImage').attr('src', 'http://localhost:2506/' + movie.lienImage);
                    $(instance).find('.movie-card').attr('data-id', movie.id);

                    // Ajout du bouton Modifier
                    let editButton = $('<button class="edit-button">Modifier</button>');
                    editButton.click(function() {
                        editMovie(movie, movieCard);
                    });

                    $(instance).find('.movie-card').append(editButton);
                    container.append(instance);
                });
            },
            error: function(xhr, status, error) {
                console.error("Erreur récupération :", error);
            }
        });
    });

    function editMovie(movie, movieCard) {
        // Remplacement de la carte par un formulaire d'édition
        movieCard.html(`
            <input type="text" class="edit-nom" value="${movie.nom}">
            <input type="text" class="edit-realisateur" value="${movie.realisateur}">
            <input type="text" class="edit-compagnie" value="${movie.compagnie}">
            <input type="text" class="edit-dateDeSortie" value="${movie.dateDeSortie}">
            <input type="number" step="0.1" class="edit-note" value="${movie.note}">
            <input type="number" step="0.1" class="edit-notePublic" value="${movie.notePublic}">
            <textarea class="edit-description">${movie.description}</textarea>
            <img class="edit-lienImage" src="http://localhost:2506/${movie.lienImage}" alt="Image du film">
            <input type="text" class="edit-origine" value="${movie.origine}">
            <button class="save-button">Enregistrer</button>
            <button class="cancel-button">Annuler</button>
        `);

        // Bouton Annuler
        $('.cancel-button').click(function() {
            location.reload();
        });

        // Bouton Enregistrer
        $('.save-button').click(function() {
            const updatedMovie = {
                nom: $('.edit-nom').val(),
                realisateur: $('.edit-realisateur').val(),
                compagnie: $('.edit-compagnie').val(),
                dateDeSortie: $('.edit-dateDeSortie').val(),
                note: parseFloat($('.edit-note').val()),
                notePublic: parseFloat($('.edit-notePublic').val()),
                description: $('.edit-description').val(),
                lienImage: movie.lienImage,  // ❌ L'image ne peut pas être modifiée
                origine: $('.edit-origine').val()
            };

            $.ajax({
                url: `${apiUrl}/${movie.id}`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(updatedMovie),
                success: function() {
                    alert('Film modifié avec succès !');
                    location.reload();
                },
                error: function(xhr, status, error) {
                    console.error("Erreur modification :", error);
                }
            });
        });
    }

    // 🔄 Redirection vers formulaire.html
    $('#add-button').click(function() {
        window.location.href = 'formulaire.html';
    });
});
