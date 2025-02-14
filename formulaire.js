$(document).ready(function() {
    // Handle form submission to add a new film
    $('#add-film-form').submit(function(event) {
        event.preventDefault();

        const newFilm = {
            nom: $('#nom').val(),
            realisateur: $('#realisateur').val(),
            compagnie: $('#compagnie').val(),
            dateDeSortie: $('#dateDeSortie').val(), // This will now be just the year
            note: parseFloat($('#note').val()),
            notePublic: parseFloat($('#notePublic').val()),
            description: $('#description').val(),
            lienImage: $('#lienImage').val(),
            origine: $('#origine').val()
        };

        $.ajax({
            url: 'http://localhost:2506/films',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newFilm),
            success: function(response) {
                alert('Film ajouté avec succès !');
                $('#add-film-form')[0].reset(); // Reset the form
            },
            error: function(xhr, status, error) {
                console.error("An error occurred: " + error);
            }
        });
    });

    // Handle back button click
    $('#back-button').click(function() {
        window.location.href = 'index.html';
    });
});