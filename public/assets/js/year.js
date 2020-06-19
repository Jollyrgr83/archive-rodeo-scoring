$(() => {
    getYearSetup();

    $(document).on("change", "#year-select", event => getYearSetup());

    $(document).on("click", ".button", (event) => {
        if ($(event.target).attr("id") === "year-add-tier-button") {
            $.ajax("/api/year/tier/", {
                type: "POST",
                data: {
                    year_id: parseInt($("#year-select").val()),
                    tier_id: parseInt($("#tier-select").val())
                }
            }).then(res => getYearSetup());
        } else if ($(event.target).attr("class").indexOf("delete") != -1) {
            $.ajax("/api/year/tier/", {
                type: "DELETE",
                data: {
                    year_id: parseInt($("#year-select").val()),
                    tier_id: parseInt($(event.target).attr("data-tier_id"))
                }
            }).then(res => getYearSetup());
        }
    });

    $(document).on("click", ".year-button", (event) => {
        $.ajax("/api/year/", {
            type: "DELETE",
            data: {
                year_id: parseInt($("#year-select").val()),
                tier_id: parseInt($(event.target).attr("data-tier_id")),
                event_id: parseInt($(event.target).attr("data-event_id"))
            }
        }).then(res => getYearSetup());      
    });

    $(document).on("click", ".year-add-event-button", (event) => {
        $.ajax("/api/year/", {
            type: "POST",
            data: {
                year_id: parseInt($("#year-select").val()),
                tier_id: parseInt($(event.target).attr("data-id")),
                event_id: parseInt($(`#year-add-event-select-${parseInt($(event.target).attr("data-id"))}`).val())
            }
        }).then(res => getYearSetup());
    });

    function getYearSetup() {
        $.get("/api/year/" + parseInt($("#year-select").val()), data => renderYearSetup(data));
    }

    function renderYearSetup(data) {
        $("#dynamic").empty();
        for (let i = 0; i < data.tiers.length; i++) {
            var containerEl = $("<section>");
            containerEl.attr("class", "main-container mx-auto text-center");
            var pTitleEl = $("<p>");
            pTitleEl.attr("class", "mini-title mx-auto");
            pTitleEl.text(`${data.tiers[i].name} Tier`);
            containerEl.append(pTitleEl);
            for (let j = 0; j < data[data.tiers[i].name].length; j++) {
                var itemInputEl = $("<input>");
                itemInputEl.attr("class", "year-input mx-auto");
                itemInputEl.attr("data-id", data[data.tiers[i].name][j].event_id);
                itemInputEl.attr("type", "text");
                itemInputEl.val(data[data.tiers[i].name][j].name);
                var deleteButtonEl = $("<button>");
                deleteButtonEl.attr("data-event_id", data[data.tiers[i].name][j].event_id);
                deleteButtonEl.attr("data-tier_id", data.tiers[i].tier_id);
                deleteButtonEl.attr("class", "year-button delete mx-auto");
                deleteButtonEl.text("x");
                var rowEl = $("<div>");
                rowEl.attr("class", "row mx-auto text-center");
                rowEl.append(itemInputEl);
                rowEl.append(deleteButtonEl);
                containerEl.append(rowEl);
            }
            var pAddEl = $("<p>");
            pAddEl.attr("class", "item-title mx-auto");
            pAddEl.text("Add New Event");
            containerEl.append(pAddEl);
            var selectEventEl = $("<select>");
            selectEventEl.attr("id", `year-add-event-select-${data.tiers[i].tier_id}`);
            selectEventEl.attr("data-id", data.tiers[i].tier_id);
            for (let k = 0; k < data.allEvents.length; k++) {
                var optionEl = $("<option>");
                optionEl.attr("value", data.allEvents[k].id);
                optionEl.text(data.allEvents[k].name);
                selectEventEl.append(optionEl);
            }
            containerEl.append(selectEventEl);
            var addEventButtonEl = $("<button>");
            addEventButtonEl.attr("class", "button year-add-event-button");
            addEventButtonEl.attr("data-id", data.tiers[i].tier_id);
            addEventButtonEl.text("Add Event");
            containerEl.append(addEventButtonEl);
            var delTierButtonEl = $("<button>");
            delTierButtonEl.attr("class", "button mx-auto delete");
            delTierButtonEl.attr("data-tier_id", data.tiers[i].tier_id);
            delTierButtonEl.attr("style", "background-color: red; border: solid 2px red;");
            delTierButtonEl.text("Delete Tier");
            containerEl.append(delTierButtonEl);
            $("#dynamic").append(containerEl);
        }
    }
});