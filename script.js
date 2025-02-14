$(document).ready(function() {
    const apiUrl = 'http://localhost:2506/films';
    
    // 🔥 Gestionnaire d'événement pour la suppression (ATTACHÉ UNE SEULE FOIS)
    $('#movies-list').on('click', '.delete-button', function() {
        console.log("Bouton de suppression cliqué !");
        
        const movieCard = $(this).closest('.movie-card');
        const movieId = movieCard.attr('data-id');

        console.log("ID récupéré pour suppression:", movieId);

        if (!movieId) {
            console.error("Erreur : l'ID est undefined");
            return;
        }

        $.ajax({
            url: `${apiUrl}/${movieId}`,
            type: 'DELETE',
            success: function(response) {
                alert('Film supprimé avec succès !');
                movieCard.remove();
            },
            error: function(xhr, status, error) {
                console.error("Erreur lors de la suppression:", error);
            }
        });
    });

    // 🔥 Importer les films
    $('#import-button').click(function() {
        const filter = $('#filter-select').val();
        const originFilter = $('#origin-select').val();
        const classicThreshold = 4.2;
        const navetThreshold = 3.2;

        $.ajax({
            url: apiUrl, 
            type: 'GET',
            dataType: 'json',
            success: function(moviesData) {
                console.log("Films récupérés depuis l'API :", moviesData);
                
                const movieTemplate = document.getElementById('movie-template');
                const navetTemplate = document.getElementById('navet-template');
                const container = $('#movies-list');
                container.empty(); 

                $.each(moviesData, function(i, movie) {
                    if (originFilter !== 'all' && movie.origine !== originFilter) {
                        return;
                    }

                    let instance;
                    if (filter === 'navets' && movie.notePublic !== null && movie.notePublic < navetThreshold) {
                        instance = document.importNode(navetTemplate.content, true);
                        $(instance).find('.nom').text(movie.nom);
                        $(instance).find('.lienImage').attr('src', 'http://localhost:2506/' + movie.lienImage);
                    } else if (filter === 'classics' && movie.note >= classicThreshold) {
                        instance = document.importNode(movieTemplate.content, true);
                        $(instance).find('.nom').text(movie.nom);
                        $(instance).find('.realisateur').text(movie.realisateur);
                        $(instance).find('.compagnie').text(movie.compagnie);
                        $(instance).find('.dateDeSortie').text(movie.dateDeSortie || 'N/A');
                        $(instance).find('.note').text(movie.note !== null ? movie.note : 'N/A');
                        $(instance).find('.notePublic').text(movie.notePublic !== null ? movie.notePublic : 'N/A');
                        $(instance).find('.description').text(movie.description);
                        $(instance).find('.lienImage').attr('src', 'http://localhost:2506/' + movie.lienImage);
                        $(instance).find('.card').addClass('high-rating');
                        $(instance).find('.diffNote').text(movie.notePublic !== null && movie.note !== null ? Math.abs(movie.notePublic - movie.note).toFixed(1) : 'N/A');
                    } else if (filter === 'all') {
                        instance = document.importNode(movieTemplate.content, true);
                        $(instance).find('.nom').text(movie.nom);
                        $(instance).find('.realisateur').text(movie.realisateur);
                        $(instance).find('.compagnie').text(movie.compagnie);
                        $(instance).find('.dateDeSortie').text(movie.dateDeSortie || 'N/A');
                        $(instance).find('.note').text(movie.note !== null ? movie.note : 'N/A');
                        $(instance).find('.notePublic').text(movie.notePublic !== null ? movie.notePublic : 'N/A');
                        $(instance).find('.description').text(movie.description);
                        $(instance).find('.lienImage').attr('src', 'http://localhost:2506/' + movie.lienImage);
                        if (movie.note >= classicThreshold) {
                            $(instance).find('.card').addClass('high-rating');
                        }
                        $(instance).find('.diffNote').text(movie.notePublic !== null && movie.note !== null ? Math.abs(movie.notePublic - movie.note).toFixed(1) : 'N/A');
                    }

                    // ✅ Ajouter l'ID du film à l'instance
                    $(instance).find('.movie-card').attr('data-id', movie.id);
                    console.log(`Ajout de data-id: ${movie.id} pour ${movie.nom}`);

                    container.append(instance);
                });
            },
            error: function(xhr, status, error) {
                console.error("Erreur lors de la récupération des films:", error);
            }
        });
    });

    // Redirection vers formulaire.html
    $('#add-button').click(function() {
        window.location.href = 'formulaire.html';
    });
});
