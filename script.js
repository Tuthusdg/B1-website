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

                let lien_img; // Déclarez lien_img ici

                $.each(moviesData, function(i, movie) {
                    let instance = document.importNode($('#movie-template')[0].content, true);
                    let movieCard = $(instance).find('.movie-card');

                    // Ajouter des classes en fonction des notes
                    const note = parseFloat(movie.note);
                    const notePublic = parseFloat(movie.notePublic);

                    if ((parseFloat(movie.note) > 4) || (parseFloat(movie.notePublic) > 4)) {
                        $(instance).find('.movie-card').addClass('classic');  // Ajouter la classe 'classic' si la note est > 4
                    }
                    // Vérifier si la note est entre 3 et 4
                    else if ((parseFloat(movie.note) >= 3) || (parseFloat(movie.notePublic) >= 3)) {
                        $(instance).find('.movie-card').addClass('normal');  // Ajouter la classe 'normal' si la note est entre 3 et 4
                    }
                    // Si la note est inférieure à 3
                    else {
                        $(instance).find('.movie-card').addClass('bad');  // Ajouter la classe 'bad' si la note est <= 3
                    }

                    // Remplir la carte avec les données du film
                    lien_img = movie.lienImage; // Initialisez lien_img ici
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
                        editMovie(movieCard, movie, lien_img); // Passez l'objet movie et lien_img à la fonction
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
    function editMovie(movieCard, movie, lien_img) {
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
            <input type="text" class="edit-lienImage" value="${lien_img}"> <!-- Utilisez lien_img ici -->
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
                lienImage: $('.edit-lienImage').val(),  // Utilisation du champ édité pour lienImage
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