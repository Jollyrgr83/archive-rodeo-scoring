$(() => {
    $(document).on("click", ".button", (event) => {
        var routes = {
            "home": "/",
            "view": "/view",
            "year": "/year",
            "comp": "/competitors",
            "score": "/score",
            "reports": "/reports",
            "help": "/help"
        };
        if (routes[$(event.target).attr("id")]) {
            window.location.href = routes[$(event.target).attr("id")];
        }
    });
});