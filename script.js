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
                    let movieCard = $(instance).find('.movie-card');

                    // Ajouter des classes en fonction des notes
                    const note = parseFloat(movie.note);
                    const notePublic = parseFloat(movie.notePublic);

                    if (note > 4 || notePublic > 4) {
                        movieCard.addClass('classic');
                    } else if ((note <= 4 && note >= 3) || (notePublic <= 4 && notePublic >= 3)) {
                        movieCard.addClass('normal');
                    } else {
                        movieCard.addClass('bad');
                    }

                    // Remplir la carte avec les données du film
                    const lie_img = movie.lienImage;
                    movieCard.attr('data-id', movie.id);
                    movieCard.find('.nom').text(movie.nom);
                    movieCard.find('.realisateur').text(movie.realisateur);
                    movieCard.find('.compagnie').text(movie.compagnie);
                    movieCard.find('.dateDeSortie').text(movie.dateDeSortie || 'N/A');
                    movieCard.find('.note').text(movie.note ?? 'N/A');
                    movieCard.find('.notePublic').text(movie.notePublic ?? 'N/A');
                    movieCard.find('.description').text(movie.description);
                    movieCard.find('.origine').text(movie.origine);
                    movieCard.find('.lienImage').attr('src', 'http://localhost:2506/' + movie.lienImage);

                    // 🔹 Ajouter un bouton Modifier pour chaque carte
                    let editButton = $('<button class="edit-button">Modifier</button>');
                    editButton.click(function() {
                        editMovie(movieCard, movie); // Passez l'objet movie à la fonction
                    });

                    movieCard.append(editButton); // Ajouter le bouton Modifier

                    container.append(instance);
                });
            },
            error: function(xhr, status, error) {
                console.error("Erreur récupération :", error);
            }
        });
    });

    // 🔄 Fonction pour éditer un film
    function editMovie(movieCard, movie) {
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
            <input type="text" class="edit-lienImage" value="${lien_img}">
            <input type="text" class="edit-origine" value="${currentValues.origine}">
            <button class="save-button">Enregistrer</button>
            <button class="cancel-button">Annuler</button>
        `);

        // Bouton Annuler
        $('.cancel-button').click(function() {
            location.reload(); // Recharge la page pour annuler les modifications
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
                url: `${apiUrl}/${movie.id}`, // Utilisation de l'id pour la mise à jour
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(updatedMovie),
                success: function() {
                    alert('Film modifié avec succès !');
                    location.reload();  // Recharge la page après la modification
                },
                error: function(xhr, status, error) {
                    console.error("Erreur modification :", error);
                }
            });
        });
    }

    // 🔄 Redirection vers le formulaire d'ajout de film
    $('#add-button').click(function() {
        window.location.href = 'formulaire.html';
    });
});
