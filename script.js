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

                    // Vérifier si la note du film ou de l'utilisateur est supérieure à 4
                    if ((parseFloat(movie.note) > 4) || (parseFloat(movie.notePublic) > 4)) {
                        $(instance).find('.movie-card').addClass('classic');  // Ajouter la classe 'classic' si la note est > 4
                    }

                     if (((parseFloat(movie.note) <= 4) && (parseFloat(movie.note) >= 3)) ||
                    ((parseFloat(movie.note) <= 4) && (parseFloat(movie.notePublic) >= 3))) {
                        $(instance).find('.movie-card').addClass('normal');  // Ajouter la classe 'classic' si la note est > 4
                    }

                    if ((parseFloat(movie.note) < 3) || (parseFloat(movie.notePublic) < 3)) {
                        $(instance).find('.movie-card').addClass('bad');  // Ajouter la classe 'classic' si la note est > 4
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

                    container.append(instance);
                });
            },
            error: function(xhr, status, error) {
                console.error("Erreur récupération :", error);
            }
        });
    });

    let editButton = $('<button class="edit-button">Modifier</button>');
editButton.click(function() {
    const movieCard = $(this).closest('.movie-card');
    const movieId = movieCard.attr('data-id');

    const currentValues = {
        nom: movieCard.find('.nom').text(),
        realisateur: movieCard.find('.realisateur').text(),
        compagnie: movieCard.find('.compagnie').text(),
        dateDeSortie: movieCard.find('.dateDeSortie').text(),
        note: movieCard.find('.note').text(),
        notePublic: movieCard.find('.notePublic').text(),
        description: movieCard.find('.description').text(),
        lienImage: movieCard.find('.lienImage').attr('src'),
        origine: movieCard.find('.origine').text()
    };

    // Remplacer la carte par un formulaire d'édition
    movieCard.html(`
        <input type="text" class="edit-nom" value="${currentValues.nom}">
        <input type="text" class="edit-realisateur" value="${currentValues.realisateur}">
        <input type="text" class="edit-compagnie" value="${currentValues.compagnie}">
        <input type="text" class="edit-dateDeSortie" value="${currentValues.dateDeSortie}">
        <input type="number" step="0.1" class="edit-note" value="${currentValues.note}">
        <input type="number" step="0.1" class="edit-notePublic" value="${currentValues.notePublic}">
        <textarea class="edit-description">${currentValues.description}</textarea>
        <input type="text" class="edit-lienImage" value="${currentValues.lienImage}">
        <input type="text" class="edit-origine" value="${currentValues.origine}">
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
            lienImage: $('.edit-lienImage').val(),
            origine: $('.edit-origine').val()
        };

        $.ajax({
            url: `${apiUrl}/${movieId}`,
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
});

// Ajouter le bouton Modifier à la carte du film
$(instance).find('.movie-card').append(editButton);


    // 🔄 Redirection vers formulaire.html
    $('#add-button').click(function() {
        window.location.href = 'formulaire.html';
    });
});
