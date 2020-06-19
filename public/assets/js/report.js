$(() => {
    getAll();

    let obj;

    $(document).on("click", ".button", (event) => {
      $.get("/api/retrieve-report/", (data) => {
        console.log("report", data);
        window.location.href = "/api/retrieve-report/";
      });
    });

    $(document).on("change", "#year-select", event => getAll());

    $(document).on("change", "#report-select", event => renderTierMenu());

    $(document).on("change", "#org-select", event => renderTierMenu());

    $(document).on("change", "#tier-select", event => renderEventMenu());

    $(document).on("change", "#dynamic-select-org", event => renderScores());

    $(document).on("change", "#event-select", event => renderScores());

    function getAll() {
        $.get("/api/report/all/" + parseInt($("#year-select").val()), (data) => {
            obj = JSON.parse(JSON.stringify(data));
            console.log("obj", obj);
            renderOrgMenu();
            renderTierMenu();
        });
    }

    function renderOrgMenu() {
        $("#org-select").empty();
        var optionEl = $("<option>");
        optionEl.val("all");
        optionEl.text("All Organizations");
        $("#org-select").append(optionEl);
        var keys = Object.keys(obj.org_ref);
        for (let i = 0; i < keys.length; i++) {
            var optionEl = $("<option>");
            optionEl.val(keys[i]);
            optionEl.text(obj.org_ref[keys[i]].name);
            $("#org-select").append(optionEl);
        }
    }

    function renderTierMenu() {
        $("#tier-select").empty();
        $("#event-select").empty();
        $("#dynamic-menu").empty();
        // render tier-select menu
        let menuArray = [];
        let tier_id_array = Object.keys(obj.tiers);
        for (let i = 0; i < tier_id_array.length; i++) {
            let tier_id = parseInt(tier_id_array[i]);
            menuArray.push({id: tier_id, text: `${obj.tier_ref[tier_id].name}`});
        }
        for (let i = 0; i < menuArray.length; i++) {
            var optionEl = $("<option>");
            optionEl.text(menuArray[i].text);
            optionEl.attr("value", menuArray[i].id);
            $("#tier-select").append(optionEl);
        }
        // initialize event-select menu
        let optionArray = [];
        let tier_id = menuArray[0].id;
        let event_id_array = Object.keys(obj.tiers[tier_id]);
        for (let i = 0; i < event_id_array.length; i++) {
            if (isNaN(parseInt(event_id_array[i]))) {
                var event_id = event_id_array[i];
            } else {
                var event_id = parseInt(event_id_array[i]);
            }
            optionArray.push({id: `${tier_id}-${event_id}`, text: `${obj.tier_ref[tier_id].name} - ${obj.event_ref[event_id]}`});
        }
        for (let i = 0; i < optionArray.length; i++) {
            var optionEl = $("<option>");
            optionEl.text(optionArray[i].text);
            optionEl.attr("value", optionArray[i].id);
            $("#event-select").append(optionEl);
        }
        renderScores();
    }

    function renderEventMenu() {
        $("#event-select").empty();
        let optionArray = [];
        let tier_id = parseInt($("#tier-select").val());
        let event_id_array = Object.keys(obj.tiers[tier_id]);
        for (let i = 0; i < event_id_array.length; i++) {
            if (isNaN(parseInt(event_id_array[i]))) {
                var event_id = event_id_array[i];
            } else {
                var event_id = parseInt(event_id_array[i]);
            }
            optionArray.push({id: `${tier_id}-${event_id}`, text: `${obj.tier_ref[tier_id].name} - ${obj.event_ref[event_id]}`});
        }
        for (let i = 0; i < optionArray.length; i++) {
            var optionEl = $("<option>");
            optionEl.text(optionArray[i].text);
            optionEl.attr("value", optionArray[i].id);
            $("#event-select").append(optionEl);
        }
        renderScores();
    }

    function renderScores() {
      const content = [
        { text: "", fontSize: 22},
        { table: { headerRows: 1, widths: [ "15%", "40%", "15%", "15%", "15%" ], body: [ [ "Competitor Number", "Organization", "Place", "Score", "Time" ] ] } }
      ];
      
        $("#dynamic").empty();
        var tier_id = parseInt($("#event-select").val().split("-")[0]);
        var event_id = isNaN(parseInt($("#event-select").val().split("-")[1])) ? $("#event-select").val().split("-")[1] : parseInt($("#event-select").val().split("-")[1]);
        var org_id = isNaN(parseInt($("#org-select").val())) ? "all" : parseInt($("#org-select").val());
        

        content[0].text = obj.event_ref[event_id];
        for (let i = 0; i < obj.tiers[tier_id][event_id].length; i++) {
          var comp_id = obj.tiers[tier_id][event_id][i].competitor_id;
          var compNum = obj.comp_ref[comp_id].comp_number;
          var orgName = obj.comp_ref[comp_id].org_name;
          var sc = obj.tiers[tier_id][event_id][i].score;
          var tt = parseFloat(obj.tiers[tier_id][event_id][i].total_seconds);
          var tmin = (Math.floor(tt / 60)).toFixed(0);
          var tsec = (Math.floor(tt % 60)).toFixed(0);
          var trem = ((tt % 60) - tsec).toFixed(2);
          var tminDisp = tmin.length === 2 ? tmin : `0${tmin}`;
          var tsecDisp = tsec.length === 2 ? tsec : `0${tsec}`;
          var tremDisp = `${trem[2]}${trem[3]}`
          var ttime = `${tminDisp}:${tsecDisp}.${tremDisp}`;
          var tplace = i + 1;
          var tArr = [compNum, orgName, tplace, sc, ttime];
          content[1].table.body.push(tArr);
        }
        console.log("content", content);

        // render event title
        var pTitleEl = $("<p>");
        pTitleEl.attr("class", "mini-title mx auto");
        pTitleEl.text(obj.event_ref[event_id]);
        $("#dynamic").append(pTitleEl);
        if ($("#report-select").val() === "0") {
            var x = 3;
        } else if ($("#report-select").val() === "1") {
            var x = obj.tiers[tier_id][event_id].length;
        }
        for (let i = 0; i < x; i++) {
            // retrieve competitor information
            let competitor_id = obj.tiers[tier_id][event_id][i].competitor_id;
            if (org_id === "all" || org_id === obj.comp_ref[competitor_id].org_id) {
                // render html elements
                var divEl = $("<div>");
                divEl.attr("class", "result-container mx-auto");
                var pRankEl = $("<p>");
                pRankEl.attr("class", "mini-title mx-auto");
                pRankEl.text(`Place: ${i + 1}`);
                var pCompNumberEl = $("<p>");
                pCompNumberEl.attr("class", "item-title mx-auto");
                pCompNumberEl.text(obj.comp_ref[competitor_id].comp_number);
                var pNameEl = $("<p>");
                pNameEl.attr("class", "item-title mx-auto");
                if (obj.tier_ref[tier_id].team === 0) {
                    pNameEl.text(`${obj.comp_ref[competitor_id].first_name} ${obj.comp_ref[competitor_id].last_name}`);
                } else {
                    pNameEl.text(`${obj.comp_ref[competitor_id].team_name}: ${obj.comp_ref[competitor_id].group_names}`);
                }
                var pOrgEl = $("<p>");
                pOrgEl.attr("class", "item-title mx-auto");
                pOrgEl.text(obj.comp_ref[competitor_id].org_name);
                var pScoreEl = $("<p>");
                pScoreEl.attr("class", "item-title mx-auto");
                pScoreEl.text(obj.tiers[tier_id][event_id][i].score);
                var pTimeEl = $("<p>");
                pTimeEl.attr("class", "item-title mx-auto");
                pTimeEl.text(`${Math.floor(obj.tiers[tier_id][event_id][i].total_seconds / 60)}:${(obj.tiers[tier_id][event_id][i].total_seconds % 60).toFixed(2)}`);
                divEl.append(pRankEl);
                divEl.append(pCompNumberEl);
                divEl.append(pNameEl);
                divEl.append(pOrgEl);
                divEl.append(pScoreEl);
                divEl.append(pTimeEl);
                $("#dynamic").append(divEl);
            }
        }
        generateReport({ data: content });
    }

    function generateReport(content) {
      const data = content;
      $.ajax("/api/generate-report/", {
        type: "POST",
        data: data
      }).then((data) => {
        console.log("generate-report data", data);
      });
    }

});
