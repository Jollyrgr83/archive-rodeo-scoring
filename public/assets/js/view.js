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
                console.log("val", $("#tiers-add-select").val());
                console.log("teamStatus", teamStatus);
                renderAddMessage("success", titleName, itemName, teamStatus, coopStatus);
            }
        }
    });

    $(document).on("click", ".square-button", (event) => {
        var ID = parseInt($(event.target).attr("id"));
        var itemValue = $(`#input-${ID}`).val().trim();
        if (itemValue === "") {
            return;
        } else if ($(event.target).attr("class").indexOf("del-btn") != -1) {
            $.ajax("/api/view/", {
                type: "DELETE",
                data: {
                    titleName: $("#view-menu").val(),
                    id: ID
                }
            }).then(res => getView($("#view-menu").val()));
        } else {
            $.ajax("/api/view/", {
                type: "PUT",
                data: {titleName: $("#view-menu").val(), id: ID, itemValue: itemValue}
            }).then(res => getView($("#view-menu").val(), "update"));
        }
    });

    $(document).on("change", "#add-menu", () => renderAddMenu());

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
        warningTitleEl.attr("style", "font-size: 18px; margin-bottom: 0;");
        warningTitleEl.text("WARNING!");
        var warningTextEl = $("<p>");
        warningTextEl.attr("style", "font-size: 12px;");
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
            itemInputEl.attr("class", "view-input");
            itemInputEl.attr("id", `input-${dataObj.data[i].id}`);
            itemInputEl.attr("type", "text");
            itemInputEl.val(dataObj.data[i].name);
            var updateButtonEl = svgEl("update", "square-button mx-auto");
            updateButtonEl.setAttribute("id", `${dataObj.data[i].id}`);
            var deleteButtonEl = svgEl("delete", "square-button del-btn mx-auto");
            deleteButtonEl.setAttribute("id", `${dataObj.data[i].id}`);
            var rowEl = $("<div>");
            rowEl.attr("class", "row mx-auto text-center");
            rowEl.append(itemInputEl);
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
            optionYesEl.val(0);
            tiersSelectEl.append(optionYesEl);
            var optionNoEl = $("<option>");
            optionNoEl.text("Teams");
            optionNoEl.val(1);
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
            if (teamStatus === "1") {
                addObj.teamStatus = true;
            } else if (teamStatus === "0") {
                addObj.teamStatus = false;
            } else if (coopStatus === "Yes") {
                addObj.coopStatus = true;
            } else if (coopStatus === "No") {
                addObj.coopStatus = false;
            }
            $.ajax("/api/view/", {
                type: "POST",
                data: addObj
            }).then(() => {
                getView($("#view-menu").val());
                var textEl = $("<p>");
                textEl.attr("class", "item-title");
                textEl.text(`Success! Item Added!`);
                $("#add-container").append(textEl);
            });
        }
    }

    function svgEl(btnType, btnClass) {
      const obj = {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor",
        fillRule: "evenodd",
        update: {
          class: "bi bi-arrow-clockwise",
          width: "2em",
          height: "2em",
          dOne: "M3.17 6.706a5 5 0 0 1 7.103-3.16.5.5 0 1 0 .454-.892A6 6 0 1 0 13.455 5.5a.5.5 0 0 0-.91.417 5 5 0 1 1-9.375.789z",
          dTwo: "M8.147.146a.5.5 0 0 1 .707 0l2.5 2.5a.5.5 0 0 1 0 .708l-2.5 2.5a.5.5 0 1 1-.707-.708L10.293 3 8.147.854a.5.5 0 0 1 0-.708z"
        },
        delete: {
          class: "bi bi-x",
          width: "2em",
          height: "2em",
          dOne: "M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z",
          dTwo: "M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"
        }
      };
      const svgElement = document.createElementNS(obj.xmlns, "svg");
      svgElement.setAttribute("viewBox", obj.viewBox);
      svgElement.setAttribute("fill", obj.fill);
      svgElement.setAttribute("width", obj[btnType].width);
      svgElement.setAttribute("height", obj[btnType].height);
      svgElement.setAttribute("class", `${obj[btnType].class} ${btnClass}`);
      const pathOneElement = document.createElementNS(obj.xmlns, "path");
      pathOneElement.setAttribute("fill-rule", obj.fillRule);
      pathOneElement.setAttribute("d", obj[btnType].dOne);
      const pathTwoElement = document.createElementNS(obj.xmlns, "path");
      pathTwoElement.setAttribute("fill-rule", obj.fillRule);
      pathTwoElement.setAttribute("d", obj[btnType].dTwo);
      svgElement.append(pathOneElement);
      svgElement.append(pathTwoElement);
      return svgElement;
    }
});