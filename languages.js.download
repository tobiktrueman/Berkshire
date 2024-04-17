function changeLanguage(lang) {
	// launch the server-side script
	$.ajax({
			url: "/languages.php?lang=" + lang
		}).done(function(data) {
			window.location.reload();
		});
};
