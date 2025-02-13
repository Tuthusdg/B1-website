$(document).ready(function() {
    $('#import-button').click(function() {
        const filter = $('#filter-select').val();
        const originFilter = $('#origin-select').val();
        const classicThreshold = 4.2;
        const navetThreshold = 3.2;

        $.ajax({
            url: 'film.json', 
            type: 'GET',
            dataType: 'json',
            success: function(moviesData) {
                const movieTemplate = document.getElementById('movie-template');
                const navetTemplate = document.getElementById('navet-template');
                const container = $('#movies-list');
                container.empty(); // Vider le conteneur avant d'ajouter les nouveaux films

                $.each(moviesData, function(i, movie) {
                    if (originFilter !== 'all' && movie.origine !== originFilter) {
                        return; // Passer au film suivant si la provenance ne correspond pas
                    }

                    let instance;
                    if (filter === 'navets' && movie.notePublic !== null && movie.notePublic < navetThreshold) {
                        instance = document.importNode(navetTemplate.content, true);
                        $(instance).find('.nom').text(movie.nom);
                        $(instance).find('.lienImage').attr('src', movie.lienImage);
                        container.append(instance);
                    } else if (filter === 'classics' && movie.note >= classicThreshold) {
                        instance = document.importNode(movieTemplate.content, true);
                        $(instance).find('.nom').text(movie.nom);
                        $(instance).find('.realisateur').text(movie.realisateur);
                        $(instance).find('.compagnie').text(movie.compagnie);
                        $(instance).find('.dateDeSortie').text(movie.dateDeSortie || 'N/A');
                        $(instance).find('.note').text(movie.note !== null ? movie.note : 'N/A');
                        $(instance).find('.notePublic').text(movie.notePublic !== null ? movie.notePublic : 'N/A');
                        $(instance).find('.description').text(movie.description);
                        $(instance).find('.lienImage').attr('src', movie.lienImage);
                        $(instance).find('.card').addClass('high-rating');

                        // Calculer et ajouter la différence de notation
                        const diffNote = movie.notePublic !== null && movie.note !== null ? Math.abs(movie.notePublic - movie.note).toFixed(1) : 'N/A';
                        $(instance).find('.diffNote').text(diffNote);

                        container.append(instance);
                    } else if (filter === 'all') {
                        instance = document.importNode(movieTemplate.content, true);
                        $(instance).find('.nom').text(movie.nom);
                        $(instance).find('.realisateur').text(movie.realisateur);
                        $(instance).find('.compagnie').text(movie.compagnie);
                        $(instance).find('.dateDeSortie').text(movie.dateDeSortie || 'N/A');
                        $(instance).find('.note').text(movie.note !== null ? movie.note : 'N/A');
                        $(instance).find('.notePublic').text(movie.notePublic !== null ? movie.notePublic : 'N/A');
                        $(instance).find('.description').text(movie.description);
                        $(instance).find('.lienImage').attr('src', movie.lienImage);

                        // Appliquer la classe high-rating si la note est >= classicThreshold
                        if (movie.note >= classicThreshold) {
                            $(instance).find('.card').addClass('high-rating');
                        }

                        // Calculer et ajouter la différence de notation
                        const diffNote = movie.notePublic !== null && movie.note !== null ? Math.abs(movie.notePublic - movie.note).toFixed(1) : 'N/A';
                        $(instance).find('.diffNote').text(diffNote);

                        container.append(instance);
                    }
                });
            },
            error: function(xhr, status, error) {
                console.error("An error occurred: " + error);
            }
        });
    });
});