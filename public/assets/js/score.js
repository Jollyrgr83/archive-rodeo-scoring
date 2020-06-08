$(() => {
    renderCompSelectionMenu();

    $(document).on("change", "#year-select", event => renderCompSelectionMenu());

    $(document).on("change", "#comp-select", event => renderScore());

    $(document).on("click", "#save-button", (event) => {
        var totalEvents = $(event.target).attr("data-total-events");
        var scoreObj = [];
        for (let i = 0; i < totalEvents; i++) {
            scoreObj.push({
                title: "score",
                value: $(`#score-input-${i}`).val(),
                id: $(`#score-input-${i}`).attr("data-record-id")
            });
            scoreObj.push({
                title: "time_minutes",
                value: $(`#minutes-input-${i}`).val(),
                id: $(`#minutes-input-${i}`).attr("data-record-id")
            });
            scoreObj.push({
                title: "time_seconds",
                value: $(`#seconds-input-${i}`).val(),
                id: $(`#seconds-input-${i}`).attr("data-record-id")
            });
        }
        $.ajax("/api/score/", {
            type: "PUT",
            data: {data: scoreObj}
        }).then((data) => {
            var messageEl = $("<p>");
            messageEl.attr("class", "item-title mx-auto");
            messageEl.text("Success! Scores have been updated!");
            $("#score-container").append(messageEl);
        });
    });

    function renderCompSelectionMenu() {
        $.get("/api/comp/year/" + parseInt($("#year-select").val()), (data) => {
            $("#comp-menu-container").empty();
            var menuTitleEl = $("<p>");
            menuTitleEl.attr("class", "item-title mx-auto");
            menuTitleEl.text("Select a Competitor");
            $("#comp-menu-container").append(menuTitleEl);
            var menuEl = $("<select>");
            menuEl.attr("id", "comp-select");
            for (let i = 0; i < data.length; i++) {
                var optionEl = $("<option>");
                optionEl.attr("value", data[i].id);
                optionEl.text(data[i].text);
                menuEl.append(optionEl);
            }
            $("#comp-menu-container").append(menuEl);
            reconcileScores();
        });
    }

    function reconcileScores() {
        $.get(`/api/score/reconcile/${$("#year-select").val()}`, data => renderScore());
    }

    function renderScore() {
        $("#score-container").empty();
        var input = `${parseInt($("#comp-select").val())}&${parseInt($("#year-select").val())}`;
        $.get("/api/score/competitor/" + input, (data) => {
            for (let i = 0; i < data.length; i++) {
                var sectionEl = $("<div>");
                sectionEl.attr("class", "main-container mx-auto text-center");
                var pTitleEl = $("<p>");
                pTitleEl.attr("class", "mini-title mx-auto");
                pTitleEl.text(data[i].name);
                sectionEl.append(pTitleEl);
                var div1El = $("<div>");
                div1El.attr("class", "row mx-auto");
                var pScoreEl = $("<p>");
                pScoreEl.attr("class", "score-title mx-auto");
                pScoreEl.text("Score");
                div1El.append(pScoreEl);
                var pMinEl = $("<p>");
                pMinEl.attr("class", "score-title mx-auto");
                pMinEl.text("Minutes");
                div1El.append(pMinEl);
                var pSecEl = $("<p>");
                pSecEl.attr("class", "score-title mx-auto");
                pSecEl.text("Seconds");
                div1El.append(pSecEl);
                sectionEl.append(div1El);
                var div2El = $("<div>");
                div2El.attr("class", "row mx-auto");
                var inputScoreEl = $("<input>");
                inputScoreEl.attr("id", `score-input-${i}`);
                inputScoreEl.attr("class", "score-input mx-auto");
                inputScoreEl.attr("type", "number");
                inputScoreEl.attr("data-record-id", data[i].id);
                inputScoreEl.attr("value", data[i].score);
                div2El.append(inputScoreEl);
                var inputMinEl = $("<input>");
                inputMinEl.attr("id", `minutes-input-${i}`);
                inputMinEl.attr("class", "score-input mx-auto");
                inputMinEl.attr("type", "number");
                inputMinEl.attr("data-record-id", data[i].id);
                inputMinEl.attr("value", data[i].time_minutes);
                div2El.append(inputMinEl);
                var inputSecEl = $("<input>");
                inputSecEl.attr("id", `seconds-input-${i}`);
                inputSecEl.attr("class", "score-input mx-auto");
                inputSecEl.attr("type", "number");
                // inputSecEl.attr("pattern", "^\d+(?:\.\d{1,2})?$");
                inputSecEl.attr("data-record-id", data[i].id);
                inputSecEl.attr("value", data[i].time_seconds);
                div2El.append(inputSecEl);
                sectionEl.append(div2El);
                $("#score-container").append(sectionEl);
            }
            var sectionEl = $("<div>");
            sectionEl.attr("class", "main-container mx-auto text-center");
            var saveButtonEl = $("<button>");
            saveButtonEl.attr("id", "save-button");
            saveButtonEl.attr("class", "button");
            saveButtonEl.attr("data-total-events", data.length);
            saveButtonEl.text("Save Changes");
            sectionEl.append(saveButtonEl);
            $("#score-container").append(sectionEl);
        });
    }
});