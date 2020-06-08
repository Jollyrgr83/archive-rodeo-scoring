$(() => {
    renderCompPage();

    $(document).on("click", ".button", (event) => {
        if ($(event.target).attr("id") === "comp-save-button") {
            $.ajax("/api/comp/update/", {
                type: "PUT",
                data: {
                    id: parseInt($(event.target).attr("data-id")),
                    comp_number: $("#comp-number").val().trim(),
                    first_name: $("#first-name").val() === undefined ? null : $("#first-name").val().trim(),
                    last_name: $("#last-name").val() === undefined ? null : $("#last-name").val().trim(),
                    team_name: $("#team-name").val() === undefined ? null : $("#team-name").val().trim(),
                    group_names: $("#group-names").val() === undefined ? null : $("#group-names").val().trim()
                }
            }).then((data) => {
                var textEl = $("<p>");
                textEl.attr("class", "item-title mx-auto");
                textEl.text(`Success! Changes Saved!`);
                $("#view-dynamic-comp-info").append(textEl);
            })
        } else if ($(event.target).attr("id") === "comp-delete-button") {
            $.ajax("/api/comp/", {
                type: "DELETE",
                data: {
                    id: parseInt($(event.target).attr("data-id"))
                }
            }).then(data => renderCompPage());
        } else if ($(event.target).attr("id") === "add-comp-save-button") {
            renderAddMessage();
        }
    });

    $(document).on("change", "#year-select", event => renderCompPage());

    $(document).on("change", "#comp-select", event => renderCompInfo());

    $(document).on("change", "#tier-select", event => renderCompAddInfo());

    function renderCompPage() {
        getCompData();
    }

    function getCompData() {
        $.get("/api/comp/year/" + parseInt($("#year-select").val()), (data) => {
            renderCompSelectionMenu(data);
            renderCompInfo();
            renderCompAddInfo();
        });
    }
    
    function renderAddMessage() {
        var inputObj = {
            tier_id: parseInt($("#tier-select").val()),
            comp_number: $("#add-comp-number").val() === undefined ? null : $("#add-comp-number").val().trim(),
            first_name: $("#add-first-name").val() === undefined ? null : $("#add-first-name").val().trim(),
            last_name: $("#add-last-name").val() === undefined ? null : $("#add-last-name").val().trim(),
            team_name: $("#add-team-name").val() === undefined ? null : $("#add-team-name").val().trim(),
            group_names: $("#add-group-names").val() === undefined ? null : $("#add-group-names").val().trim(),
            org_id: parseInt($("#org-select").val()),
            year_id: parseInt($("#year-select").val())
        };
        $.ajax("/api/comp/", {
            type: "POST",
            data: inputObj
        }).then((data) => {
            var textEl = $("<p>");
            textEl.attr("class", "item-title mx-auto");
            textEl.text(`Success! Competitor Added!`);
            $("#add-dynamic-comp-info").append(textEl);
            $("#add-comp-number").val(""),
            $("#add-first-name").val("");
            $("#add-last-name").val("");
            $("#add-team-name").val("");
            $("#add-group-names").val("");
        });
    }

    function renderCompSelectionMenu(data) {
        $("#view-dynamic-comp-select").empty();
        var menuTitleEl = $("<p>");
        menuTitleEl.attr("class", "item-title mx-auto");
        menuTitleEl.text("Select a Competitor");
        $("#view-dynamic-comp-select").append(menuTitleEl);
        var menuEl = $("<select>");
        menuEl.attr("id", "comp-select");
        for (let i = 0; i < data.length; i++) {
            var optionEl = $("<option>");
            optionEl.attr("value", data[i].id);
            optionEl.attr("data-type", data[i].team);
            optionEl.text(data[i].text);
            menuEl.append(optionEl);
        }
        $("#view-dynamic-comp-select").append(menuEl);
    }

    function renderCompInfo() {
        $.get("/api/comp/competitor/" + parseInt($("#comp-select").val()), data => data.team === 0 ? renderIndividual(data) : renderTeam(data));
    }

    function renderCompAddInfo() {
        $("#add-dynamic-comp-info").empty();
        var compNumberTitleEl = $("<p>");
        compNumberTitleEl.attr("class", "item-title mx-auto");
        compNumberTitleEl.text("Enter Competitor Number");
        var compNumberEl = $("<input>");
        compNumberEl.attr("id", "add-comp-number");
        compNumberEl.attr("type", "text");
        var firstNameTitleEl = $("<p>");
        firstNameTitleEl.attr("class", "item-title mx-auto");
        firstNameTitleEl.text("Enter Competitor's First Name");
        var firstNameEl = $("<input>");
        firstNameEl.attr("id", "add-first-name");
        firstNameEl.attr("type", "text");
        var lastNameTitleEl = $("<p>");
        lastNameTitleEl.attr("class", "item-title mx-auto");
        lastNameTitleEl.text("Enter Competitor's Last Name");
        var lastNameEl = $("<input>");
        lastNameEl.attr("id", "add-last-name");
        lastNameEl.attr("type", "text");
        var teamNameTitleEl = $("<p>");
        teamNameTitleEl.attr("class", "item-title mx-auto");
        teamNameTitleEl.text("Enter Competitor Team Name");
        var teamNameEl = $("<input>");
        teamNameEl.attr("id", "add-team-name");
        teamNameEl.attr("type", "text");
        var groupNamesTitleEl = $("<p>");
        groupNamesTitleEl.attr("class", "item-title mx-auto");
        groupNamesTitleEl.text("Enter the Group's Names");
        var groupNamesEl = $("<input>");
        groupNamesEl.attr("id", "add-group-names");
        groupNamesEl.attr("type", "text");
        var orgMenuTitleEl = $("<p>");
        orgMenuTitleEl.attr("class", "item-title mx-auto");
        orgMenuTitleEl.text("Select the Competitor's Organization");
        var saveButtonEl = $("<button>");
        saveButtonEl.attr("id", "add-comp-save-button");
        saveButtonEl.attr("class", "button mx-auto");
        saveButtonEl.text("Add Competitor");
        $.get("/api/comp/tier/" + parseInt($("#tier-select").val()), (res) => {
            if (res[0].team === 0) {
                $.get("/api/comp/org/", (data) => {
                    var orgMenuEl = $("<select>");
                    orgMenuEl.attr("id", "org-select");
                    for (let i = 0; i < data.length; i++) {
                        var optionEl = $("<option>");
                        optionEl.attr("value", data[i].id);
                        optionEl.text(data[i].name);
                        orgMenuEl.append(optionEl);
                    }
                    $("#add-dynamic-comp-info").append(compNumberTitleEl);
                    $("#add-dynamic-comp-info").append(compNumberEl);
                    $("#add-dynamic-comp-info").append(firstNameTitleEl);
                    $("#add-dynamic-comp-info").append(firstNameEl);
                    $("#add-dynamic-comp-info").append(lastNameTitleEl);
                    $("#add-dynamic-comp-info").append(lastNameEl);
                    $("#add-dynamic-comp-info").append(orgMenuTitleEl);
                    $("#add-dynamic-comp-info").append(orgMenuEl);
                    $("#add-dynamic-comp-info").append(saveButtonEl);
                });    
            } else {
                $.get("/api/comp/org/", (data) => {
                    var orgMenuEl = $("<select>");
                    orgMenuEl.attr("id", "org-select");
                    for (let i = 0; i < data.length; i++) {
                        var optionEl = $("<option>");
                        optionEl.attr("value", data[i].id);
                        optionEl.text(data[i].name);
                        orgMenuEl.append(optionEl);
                    }
                    $("#add-dynamic-comp-info").append(compNumberTitleEl);
                    $("#add-dynamic-comp-info").append(compNumberEl);
                    $("#add-dynamic-comp-info").append(teamNameTitleEl);
                    $("#add-dynamic-comp-info").append(teamNameEl);
                    $("#add-dynamic-comp-info").append(groupNamesTitleEl);
                    $("#add-dynamic-comp-info").append(groupNamesEl);
                    $("#add-dynamic-comp-info").append(orgMenuTitleEl);
                    $("#add-dynamic-comp-info").append(orgMenuEl); 
                    $("#add-dynamic-comp-info").append(saveButtonEl); 
                });
            }
        });
    }

    function renderTeam(data) {
        $("#view-dynamic-comp-info").empty();
        var compNumberTitleEl = $("<p>");
        compNumberTitleEl.attr("class", "item-title mx-auto");
        compNumberTitleEl.text("Competitor Number");
        var compNumberEl = $("<input>");
        compNumberEl.attr("id", "comp-number");
        compNumberEl.attr("value", data.comp_number);
        var teamNameTitleEl = $("<p>");
        teamNameTitleEl.attr("class", "item-title mx-auto");
        teamNameTitleEl.text("Team Name");
        var teamNameEl = $("<input>");
        teamNameEl.attr("id", "team-name");
        teamNameEl.attr("value", data.team_name);
        var groupNamesTitleEl = $("<p>");
        groupNamesTitleEl.attr("class", "item-title mx-auto");
        groupNamesTitleEl.text("Group Names");
        var groupNamesEl = $("<input>");
        groupNamesEl.attr("id", "group-names");
        groupNamesEl.attr("value", data.group_names);
        var saveButtonEl = $("<button>");
        saveButtonEl.attr("id", "comp-save-button");
        saveButtonEl.attr("data-id", data.id);
        saveButtonEl.attr("class", "button");
        saveButtonEl.text("Save Changes");
        var delButtonEl = $("<button>");
        delButtonEl.attr("id", "comp-delete-button");
        delButtonEl.attr("class", "button");
        delButtonEl.attr("data-id", data.id);
        delButtonEl.attr("style", "background-color: red; border: solid 2px red;");
        delButtonEl.text("Delete Competitor");
        $("#view-dynamic-comp-info").append(compNumberTitleEl);
        $("#view-dynamic-comp-info").append(compNumberEl);
        $("#view-dynamic-comp-info").append(teamNameTitleEl);
        $("#view-dynamic-comp-info").append(teamNameEl);
        $("#view-dynamic-comp-info").append(groupNamesTitleEl);
        $("#view-dynamic-comp-info").append(groupNamesEl);
        $("#view-dynamic-comp-info").append(saveButtonEl);
        $("#view-dynamic-comp-info").append(delButtonEl);
    }
    
    function renderIndividual(data) {
        $("#view-dynamic-comp-info").empty();
        var compNumberTitleEl = $("<p>");
        compNumberTitleEl.attr("class", "item-title mx-auto");
        compNumberTitleEl.text("Competitor Number");
        var compNumberEl = $("<input>");
        compNumberEl.attr("id", "comp-number");
        compNumberEl.attr("value", data.comp_number);
        var firstNameTitleEl = $("<p>");
        firstNameTitleEl.attr("class", "item-title mx-auto");
        firstNameTitleEl.text("First Name");
        var firstNameEl = $("<input>");
        firstNameEl.attr("id", "first-name");
        firstNameEl.attr("value", data.first_name);
        var lastNameTitleEl = $("<p>");
        lastNameTitleEl.attr("class", "item-title mx-auto");
        lastNameTitleEl.text("Last Name");
        var lastNameEl = $("<input>");
        lastNameEl.attr("id", "last-name");
        lastNameEl.attr("value", data.last_name);
        var saveButtonEl = $("<button>");
        saveButtonEl.attr("id", "comp-save-button");
        saveButtonEl.attr("data-id", data.id);
        saveButtonEl.attr("class", "button");
        saveButtonEl.text("Save Changes");
        var delButtonEl = $("<button>");
        delButtonEl.attr("id", "comp-delete-button");
        delButtonEl.attr("class", "button");
        delButtonEl.attr("data-id", data.id);
        delButtonEl.attr("style", "background-color: red; border: solid 2px red;");
        delButtonEl.text("Delete Competitor");
        $("#view-dynamic-comp-info").append(compNumberTitleEl);
        $("#view-dynamic-comp-info").append(compNumberEl);
        $("#view-dynamic-comp-info").append(firstNameTitleEl);
        $("#view-dynamic-comp-info").append(firstNameEl);
        $("#view-dynamic-comp-info").append(lastNameTitleEl);
        $("#view-dynamic-comp-info").append(lastNameEl);
        $("#view-dynamic-comp-info").append(saveButtonEl);
        $("#view-dynamic-comp-info").append(delButtonEl);
    }
});