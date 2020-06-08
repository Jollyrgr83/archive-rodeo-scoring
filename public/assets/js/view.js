$(() => {
    renderAddMenu();

    $(document).on("click", ".button", (event) => {
        if ($(event.target).attr("id") === "view-menu-button") {
            getView($("#view-menu").val());
        } else if ($(event.target).attr("id") === "add-container-button") {
            var titleName = $("#add-menu").val();
            var itemName = $("#add-container-input").val().trim();
            if (itemName === "" || (isNaN(parseInt(itemName)) && titleName === "Years")) {
                renderAddMessage("error", titleName);
            } else {
                if (titleName === "Tiers") {
                    var teamStatus = $("#tiers-add-select").val();
                } else if (titleName === "Organizations") {
                    var teamStatus = null;
                    var coopStatus = $("#organizations-add-select").val();
                }
                renderAddMessage("success", titleName, itemName, teamStatus, coopStatus);
            }
        }
    });

    $(document).on("click", ".view-button", (event) => {
        var ID = parseInt($(event.target).attr("id"));
        var itemValue = $(`#input-${ID}`).val().trim();
        if (itemValue === "") {
            return;
        } else if ($(event.target).attr("class").indexOf("delete") != -1) {
            $.ajax("/api/view/", {
                type: "DELETE",
                data: {
                    titleName: $("#view-menu").val(),
                    id: ID
                }
            }).then(res => getView($("#view-menu").val()));
        } else if ($(event.target).attr("class").indexOf("update") != -1) {
            $.ajax("/api/view/", {
                type: "PUT",
                data: {titleName: $("#view-menu").val(), id: ID, itemValue: itemValue}
            }).then(res => getView($("#view-menu").val(), "update"));
        }
    });

    $(document).on("change", "#add-menu", event => renderAddMenu());

    function getView(titleName, status) {
        const dataObj = {
            titleName: titleName,
            tableName: titleName.toLowerCase(),
            status: status
        };
        $.get("/api/view/menu/" + dataObj.tableName, (data) => {
            dataObj.data = [...data.data];
            renderViewMenu(dataObj);
        });
    }

    function renderViewMenu(dataObj) {
        $("#view-container").empty();
        var warningDivEl = $("<p>");
        warningDivEl.attr("class", "warning mx-auto text-center");
        var warningTitleEl = $("<p>");
        warningTitleEl.attr("style", "font-size: 32px; margin-bottom: 0;");
        warningTitleEl.text("WARNING!");
        var warningTextEl = $("<p>");
        warningTextEl.attr("style", "font-size: 18px;");
        warningTextEl.text("Deleting an item will also remove all records associated with that item.");
        var pTitleEl = $("<p>");
        pTitleEl.attr("class", "mini-title mx-auto");
        pTitleEl.text(dataObj.titleName);
        warningDivEl.append(warningTitleEl);
        warningDivEl.append(warningTextEl);
        $("#view-container").append(warningDivEl);
        $("#view-container").append(pTitleEl);
        for (let i = 0; i < dataObj.data.length; i++) {
            var itemInputEl = $("<input>");
            itemInputEl.attr("id", `input-${dataObj.data[i].id}`);
            itemInputEl.attr("type", "text");
            itemInputEl.val(dataObj.data[i].name);
            var updateButtonEl = $("<button>");
            updateButtonEl.attr("id", `${dataObj.data[i].id}`);
            updateButtonEl.attr("class", "view-button update mx-auto");
            updateButtonEl.text("Update");
            var deleteButtonEl = $("<button>");
            deleteButtonEl.attr("id", `${dataObj.data[i].id}`);
            deleteButtonEl.attr("class", "view-button delete mx-auto");
            deleteButtonEl.text("Delete");
            var rowEl = $("<div>");
            rowEl.attr("class", "row mx-auto text-center");
            $("#view-container").append(itemInputEl);
            rowEl.append(updateButtonEl);
            rowEl.append(deleteButtonEl);
            $("#view-container").append(rowEl);
        }
        if (dataObj.status === "update") {
            var textEl = $("<p>");
            textEl.attr("class", "item-title");
            textEl.text(`Success! Item Updated!`);
            $("#view-container").append(textEl);
        }
    }

    function renderAddMenu() {
        var titleName = $("#add-menu").val();
        $("#add-container").empty();
        var pTitleEl = $("<p>");
        pTitleEl.attr("class", "item-title mx-auto");
        titleName === "Years" ? pTitleEl.text("Enter Year") : pTitleEl.text(`Enter Name`);
        $("#add-container").append(pTitleEl);
        var inputEl = $("<input>");
        inputEl.attr("id", "add-container-input");
        inputEl.attr("type", "text");
        $("#add-container").append(inputEl);
        if (titleName === "Tiers") {
            var tiersTextEl = $("<p>");
            tiersTextEl.attr("class", "item-title mx-auto");
            tiersTextEl.text("Are the competitors in this tier individuals or teams?");
            $("#add-container").append(tiersTextEl);
            var tiersSelectEl = $("<select>");
            tiersSelectEl.attr("id", "tiers-add-select");
            var optionYesEl = $("<option>");
            optionYesEl.text("Individuals");
            tiersSelectEl.append(optionYesEl);
            var optionNoEl = $("<option>");
            optionNoEl.text("Teams");
            tiersSelectEl.append(optionNoEl);
            $("#add-container").append(tiersSelectEl);
        } else if (titleName === "Organizations") {
            var organizationsTextEl = $("<p>");
            organizationsTextEl.attr("class", "item-title mx-auto");
            organizationsTextEl.text("Is this organization a coop?");
            $("#add-container").append(organizationsTextEl);
            var organizationsSelectEl = $("<select>");
            organizationsSelectEl.attr("id", "organizations-add-select");
            var optionYesEl = $("<option>");
            optionYesEl.text("Yes");
            organizationsSelectEl.append(optionYesEl);
            var optionNoEl = $("<option>");
            optionNoEl.text("No");
            organizationsSelectEl.append(optionNoEl);
            $("#add-container").append(organizationsSelectEl);
        }
        var buttonEl = $("<button>");
        buttonEl.attr("class", "button mx-auto");
        buttonEl.attr("id", "add-container-button");
        buttonEl.text(`Add New ${titleName.slice(0, -1)}`);
        $("#add-container").append(buttonEl);
        var messageEl = $("<div>");
        messageEl.attr("id", "add-message-container");
        $("#add-container").append(messageEl);
    }

    function renderAddMessage(status, titleName, itemName, teamStatus, coopStatus) {
        $("#add-container").empty();
        if (status === "error") {
            var textEl = $("<p>");
            textEl.attr("class", "item-title");
            textEl.text("Please ensure that your entry is not blank or is a valid number for a year entry.");
            renderAddMenu(titleName);
            $("#add-container").append(textEl);
        } else {
            const addObj = {titleName: titleName, itemName: itemName};
            if (teamStatus === "Individuals") {
                addObj.teamStatus = true;
            } else if (teamStatus === "Teams") {
                addObj.teamStatus = false;
            } else if (coopStatus === "Yes") {
                addObj.coopStatus = true;
            } else if (coopStatus === "No") {
                addObj.coopStatus = false;
            }
            $.ajax("/api/view/", {
                type: "POST",
                data: addObj
            }).then((res) => {
                getView($("#view-menu").val());
                var textEl = $("<p>");
                textEl.attr("class", "item-title");
                textEl.text(`Success! Item Added!`);
                $("#add-container").append(textEl);
            });
        }
    }
});