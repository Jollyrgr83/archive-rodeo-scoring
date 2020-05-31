$(() => {
    $(document).on("click", ".button", (event) => {
        var ID = $(event.target).attr("id");
        console.log("ID: ", ID);
        var routes = {
            "home": "/",
            "view": "/view",
            "add": "/add",
            "year": "/year",
            "competitors": "/competitors",
            "score": "/score",
            "reports": "/reports",
            "help": "/help"
        };
        if (routes[ID]) {
            window.location.href = routes[ID];
        }
        else if (ID === "view-menu-button") {
            var option = $("#view-menu").val();
            console.log("option", option);
            getView(option);
        }
    });

    function getView(inputString) {
        console.log("inputString", inputString);
        const dataObj = {
            inputString: inputString
        };
        $.get("/api/view-" + inputString, (data) => {
            console.log("data", data);
            dataObj.data = [...data.data];
            renderViewMenu(dataObj);
        });
    }

    function renderViewMenu(dataObj) {
        console.log("dataObj", JSON.stringify(dataObj));
        $("#view-container").empty();
        var pTitleEl = $("<p>");
        pTitleEl.attr("class", "mini-title mx-auto");
        pTitleEl.text(dataObj.inputString);
        $("#view-container").append(pTitleEl);
        for (let i = 0; i < dataObj.data.length; i++) {
            var pTextEl = $("<p>");
            pTextEl.attr("id", dataObj.data[i].id);
            pTextEl.attr("class", "item-title mx-auto");
            pTextEl.text(dataObj.data[i].name);
            var buttonEl = $("<button>");
            buttonEl.attr("id", `${dataObj.data[i].id}-edit`);
            buttonEl.attr("class", "button");
            buttonEl.text("Edit");
            $("#view-container").append(pTextEl);
            $("#view-container").append(buttonEl);
        }
    }
});
//     $(document).on("click", ".button", (event) => {
//         var ID = $(event.target).attr("id");
//         console.log("ID: ", ID);
//         var routes = {
//             "home": "/",
//             "comp": "/competitor-entry",
//             "year": "/year-setup",
//             "score": "/score-entry",
//             "rep": "/reports",
//             "help": "/instructions"
//         };
//         if (routes[ID]) {
//             window.location.href = routes[ID];
//         }
//         else if (ID === "year-update-button") {
//             $.ajax("/api/year-setup", {
//                 type: "POST",
//                 data: {
//                     year: parseInt($("#year-input").val().trim())
//                 }
//               }).then((data) => {
//                 renderYear(data);
//               });
//         }
//         else if (ID === "year-save-button") {
//             // grab input values, put in object, pass to PUT request
            
//             $.ajax("/api/year-setup", {
//                 type: "POST",
//                 data: {}
//             }).then((data) => {
//                 renderYear(data);
//             });
//         }
//         else if (ID === "year-add-tier-button") {
//             const newTier = $("#tier-select").val();
//             console.log("newTier 38", newTier);
//             console.log("year-input", $("#year-input").val().trim());
//             if ($("#year-input").val().trim() === "") {
//                 if (newTier === "Add New") {
//                     renderAddTier();
//                 }
//             }
//             else {
//                 $.ajax("/api/year-setup", {
//                     type: "POST",
//                     data: {
//                         year: parseInt($("#year-input").val().trim())
//                     }
//                 }).then((data) => {
//                     renderYear(data);
//                     console.log("newTier", newTier);
//                     if (newTier === "Add New") {
//                         renderAddTier();
//                     }
//                 });
//             }
//         }
//         else if (ID === "new-tier-button") {
//             const newTierInput = $("#new-tier-input").val().trim();
//             if (newTierInput === "") {
//                 return;
//             }
//             else {
//                 $.ajax("/api/year-setup/", {
//                     type: "POST",
//                     data: {
//                         year: parseInt($("#year-input").val().trim()),
//                         tier: newTierInput
//                     }
//                 }).then((data) => {
//                     renderYear(data);
//                     renderTierOptions();
//                 });
//             }
//         }
//     });

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