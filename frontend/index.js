function showAlert(message, type = 'success') {
    const alert = $(`<div class="alert alert-dismissible alert-${type}">
        ${message}
    </div>`);

    $('#alertBox').append(alert);

    setTimeout(() => alert.addClass('show'), 50);

    // Auto remove after 3s
    setTimeout(() => {
        alert.removeClass('show');
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

$('#submitUrl').on('submit', function (e) {
    e.preventDefault();
    const url = $('#url').val().trim();

    if (!url) {
        return;
    }

    const isValid = /^https?:\/\/[\w.-]+\.[a-z]{2,}.*$/i.test(url);
    if (!isValid) {
        showAlert('Invalid URL format. Must start with http(s)://', 'danger');
        return;
    }

    $.ajax({
        url: 'http://localhost:2000/trim',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ url }),
        success: function (response) { 
            $('#url').val(`http://localhost:2000/${response.trimmedUrl}`);
            showAlert('URL trimmed successfully!', 'success');
        },
        error: function () {
            showAlert('URL failed to submit', 'danger');
        }
    });
});