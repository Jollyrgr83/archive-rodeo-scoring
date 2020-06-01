$(() => {
    $(document).on("click", ".button", (event) => {
        var ID = $(event.target).attr("id");
        console.log("ID: ", ID);
        var routes = {
            "home": "/",
            "view": "/view",
            "year": "/year",
            "comp": "/competitors",
            "score": "/score",
            "reports": "/reports",
            "help": "/help"
        };
        if (routes[ID]) {
            window.location.href = routes[ID];
        }
        else if (ID === "view-menu-button") {
            var titleName = $("#view-menu").val();
            getView(titleName);
        }
        else if (ID === "add-menu-button") {
            var titleName = $("#add-menu").val();
            renderAddMenu(titleName);
        }
        else if (ID === "add-container-button") {
            var titleName = $("#add-menu").val();
            var itemName = $("#add-container-input").val().trim();
            if (itemName === "" || (isNaN(parseInt(itemName)) && titleName === "Years")) {
                renderAddMessage("error", titleName);
            }
            else {
                if (titleName === "Tiers") {
                    var teamStatus = $("#tiers-add-select").val();
                }
                renderAddMessage("success", titleName, itemName, teamStatus);
            }
        }
    });

    $(document).on("click", ".view-button", (event) => {
        var clickClass = $(event.target).attr("class");
        var ID = parseInt($(event.target).attr("id"));
        var titleName = $("#view-menu").val();
        if (clickClass.indexOf("delete") != -1) {
            clickClass = "delete";
        }
        else if (clickClass.indexOf("update") != -1) {
            clickClass = "update";
        }
        $.ajax("/api/view/", {
            type: "DELETE",
            data: {
                titleName: titleName,
                id: ID
            }
        }).then((res) => {
            console.log("res", res);
            if (res.affectedRows === 1) {
                window.location.href = "/view";
            }
        });
    });

    function getView(titleName) {
        console.log("titleName", titleName);
        const dataObj = {
            titleName: titleName,
            tableName: titleName.toLowerCase()
        };
        $.get("/api/view/" + dataObj.tableName, (data) => {
            console.log("data", data);
            dataObj.data = [...data.data];
            renderViewMenu(dataObj);
        });
    }

    function renderViewMenu(dataObj) {
        console.log("dataObj", JSON.stringify(dataObj));
        $("#view-container").empty();
        $("#view-container").attr("class", "main-container mx-auto text-center show");
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
    }

    function renderAddMenu(titleName) {
        $("#add-container").empty();
        var pTitleEl = $("<p>");
        pTitleEl.attr("class", "item-title mx-auto");
        pTitleEl.text(`Enter New ${titleName} Item Name:`);
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
            optionYesEl.text("Yes");
            tiersSelectEl.append(optionYesEl);
            var optionNoEl = $("<option>");
            optionNoEl.text("No");
            tiersSelectEl.append(optionNoEl);
            $("#add-container").append(tiersSelectEl);
        }
        var buttonEl = $("<button>");
        buttonEl.attr("class", "button mx-auto");
        buttonEl.attr("id", "add-container-button");
        buttonEl.text(`Add New ${titleName} Item`);
        $("#add-container").append(buttonEl);
        var messageEl = $("<div>");
        messageEl.attr("id", "add-message-container");
        $("#add-container").append(messageEl);
    }

    function renderAddMessage(status, titleName, itemName, teamStatus) {
        $("#add-container").empty();
        if (status === "error") {
            console.log("status was error");
            var textEl = $("<p>");
            textEl.attr("class", "item-title");
            textEl.text("Please ensure that your entry is not blank or is a valid number for a year entry.");
            renderAddMenu(titleName);
            $("#add-container").append(textEl);
        }
        else {
            console.log("status was success");
            const addObj = {
                titleName: titleName,
                itemName: itemName,
            };
            if (teamStatus === "Yes" || teamStatus === "No") {
                if (teamStatus === "Yes") {
                    addObj.teamStatus = true;
                }
                else {
                    addObj.teamStatus = false;
                }
            }
            $.ajax("/api/view/", {
                type: "POST",
                data: addObj
            }).then((res) => {
                console.log("response", res);
                var textEl = $("<p>");
                textEl.attr("class", "item-title");
                textEl.text(`Success! Item Added!`);
                $("#add-container").append(textEl);
            });
        }
    }

});




//     $(".nav-button").on("click", (event) => {
//         var ID = $(event.target).attr("id");
//         console.log("ID: ", ID);
//     });

//     function renderYear(data) {
//         $("#dynamic").empty();
//         $("#add-tier-dynamic").empty();
//         // updates year-input value with selected year
//         $("#year-input").val(parseInt(data.year));
//         // ends if no tiers or events have been selected yet
//         if (data.all.length === 0) {
//             return;
//         }
//         let obj = {
//             // names of active tiers
//             activeTiers: [data.all[0].tier_name],
//             // ids of active tiers
//             activeTierIDs: [data.all[0].tier_id]
//         };
//         // populate obj arrays with active tier names and ids
//         for (let i = 1; i < data.all.length; i++) {
//             if (obj.activeTiers.indexOf(data.all[i].tier_name) === -1) {
//                 obj.activeTiers.push(data.all[i].tier_name);
//                 obj.activeTierIDs.push(data.all[i].tier_id);
//             }
//         }
//         // establish obj keys and arrays for active tiers
//         for (let i = 0; i < obj.activeTiers.length; i++) {
//             obj[obj.activeTiers[i]] = [];
//         }
//         // separate event objects into applicable obj arrays
//         for (let i = 0; i < data.all.length; i++) {
//             obj[data.all[i].tier_name].push(data.all[i]);
//         }
//         // render html elements for active tiers and events
//         for (let i = 0; i < obj.activeTiers.length; i++) {
//             var sectionEl = $("<section>");
//             sectionEl.attr("class", "main-container mx-auto text-center");
//             var pTitleEl = $("<p>");
//             pTitleEl.attr("class", "mini-title mx-auto");
//             pTitleEl.text(obj.activeTiers[i] + " Tier");
//             sectionEl.append(pTitleEl);
//             for (let j = 0; j < obj[obj.activeTiers[i]].length; j++) {
//                 var inputEl = $("<input>");
//                 inputEl.attr("id", obj[obj.activeTiers[i]][j].id);
//                 inputEl.attr("type", "text");
//                 inputEl.val(obj[obj.activeTiers[i]][j].event_name);
//                 sectionEl.append(inputEl);
//             }
//             var pAddEl = $("<p>");
//             pAddEl.attr("class", "item-title mx-auto");
//             pAddEl.text("Add an Event");
//             var addInputEl = $("<input>");
//             addInputEl.attr("id", obj.activeTiers[i] + "EventInput");
//             addInputEl.attr("type", "text");
//             addInputEl.attr("placeholder", "Enter Event Name");
//             var addButtonEl = $("<button>");
//             addButtonEl.attr("class", "button");
//             addButtonEl.attr("id", obj.activeTiers[i] + "EventInputButton");
//             addButtonEl.text("Add Event");
//             sectionEl.append(pAddEl);
//             sectionEl.append(addInputEl);
//             sectionEl.append(addButtonEl);
//             $("#dynamic").append(sectionEl);
//         }
//     }

//     function renderAddTier() {
//         $("#add-tier-dynamic").empty();
//         var inputEl = $("<input>");
//         inputEl.attr("id", "new-tier-input");
//         inputEl.attr("type", "text");
//         inputEl.attr("placeholder", "Enter Tier Name");
//         var buttonEl = $("<button>");
//         buttonEl.attr("class", "button");
//         buttonEl.attr("id", "new-tier-button");
//         buttonEl.text("Update");
//         $("#add-tier-dynamic").append(inputEl);
//         $("#add-tier-dynamic").append(buttonEl);
//     }

//     function renderTierOptions() {
//         console.log("renderTierOptions called");
//         $.get("/api/year-setup", (data) => {
//             console.log("data 166", data);
//             $("#tier-select").empty();
//             for (let i = 0; i < data.tiers.length; i++) {
//                 var optionEl = $("<option>");
//                 optionEl.attr("id", data.tiers[i].id);
//                 optionEl.text(data.tiers[i].tier_name);
//                 $("#tier-select").append(optionEl);
//             }
//             var optionEl = $("<option>");
//             optionEl.text("Add New");
//             $("#tier-select").append(optionEl);
//         });
//     }
// });

// post routes
// year-setup:
// add tier - update db first, then pull from db, and build screen using handlebars? (need partials)