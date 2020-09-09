$(() => {
  getAll();

  let obj;

  $(document).on("click", ".button", () => {
    $.get("/api/retrieve-report/", () => console.log("download pdf"));
  });

  $(document).on("change", "#year-select", () => getAll());

  $(document).on("change", "#report-select", () => renderTierMenu());

  $(document).on("change", "#org-select", () => renderTierMenu());

  $(document).on("change", "#tier-select", () => renderEventMenu());

  $(document).on("change", "#dynamic-select-org", () => renderScores());

  $(document).on("change", "#event-select", () => renderScores());

  function getAll() {
    $.get(`/api/report/all/${parseInt($("#year-select").val())}`, (data) => {
      obj = JSON.parse(JSON.stringify(data));
      renderOrgMenu();
      renderTierMenu();
    });
  }

  function renderOrgMenu() {
    $("#org-select").empty();
    const optionEl = h({ e: "option", v: "all", tx: "All Organizations" });
    $("#org-select").append(optionEl);
    const keys = Object.keys(obj.org_ref);
    for (let i = 0; i < keys.length; i++) {
      const optionEl = h({ e: "option", v: keys[i], tx: obj.org_ref[keys[i]].name });
      $("#org-select").append(optionEl);
    }
  }

  function renderTierMenu() {
    $("#tier-select").empty();
    $("#event-select").empty();
    $("#dynamic-menu").empty();
    // render tier-select menu
    const menuArray = [];
    const tier_id_array = Object.keys(obj.tiers);
    for (let i = 0; i < tier_id_array.length; i++) {
      const tier_id = parseInt(tier_id_array[i]);
      menuArray.push({ id: tier_id, text: `${obj.tier_ref[tier_id].name}` });
    }
    for (let i = 0; i < menuArray.length; i++) {
      const optionEl = h({ e: "option", tx: menuArray[i].text, v: menuArray[i].id });
      $("#tier-select").append(optionEl);
    }
    // initialize event-select menu
    const optionArray = [];
    const tier_id = menuArray[0].id;
    const event_id_array = Object.keys(obj.tiers[tier_id]);
    for (let i = 0; i < event_id_array.length; i++) {
      const event_id = isNaN(parseInt(event_id_array[i])) ? event_id_array[i] : parseInt(event_id_array[i]);
      optionArray.push({id: `${tier_id}-${event_id}`, text: `${obj.tier_ref[tier_id].name} - ${obj.event_ref[event_id]}`});
    }
    for (let i = 0; i < optionArray.length; i++) {
      const optionEl = h({ e: "option", tx: optionArray[i].text, v: optionArray[i].id });
      $("#event-select").append(optionEl);
    }
    renderScores();
  }

  function renderEventMenu() {
    $("#event-select").empty();
    const optionArray = [];
    const tier_id = parseInt($("#tier-select").val());
    const event_id_array = Object.keys(obj.tiers[tier_id]);
    for (let i = 0; i < event_id_array.length; i++) {
      const event_id = isNaN(parseInt(event_id_array[i])) ? event_id_array[i] : parseInt(event_id_array[i]);
      optionArray.push({id: `${tier_id}-${event_id}`, text: `${obj.tier_ref[tier_id].name} - ${obj.event_ref[event_id]}`});
    }
    for (let i = 0; i < optionArray.length; i++) {
      const optionEl = h({ e: "option", tx: optionArray[i].text, v: optionArray[i].id });
      $("#event-select").append(optionEl);
    }
    renderScores();
  }

  function renderScores() {
    const content = [
      { text: "", fontSize: 22 },
      { table: { headerRows: 1, widths: [ "15%", "40%", "15%", "15%", "15%" ], body: [ [ "Competitor Number", "Organization", "Place", "Score", "Time" ] ] } }
    ];
    $("#dynamic").empty();
    const tier_id = parseInt($("#event-select").val().split("-")[0]);
    const event_id = isNaN(parseInt($("#event-select").val().split("-")[1])) ? $("#event-select").val().split("-")[1] : parseInt($("#event-select").val().split("-")[1]);
    const org_id = isNaN(parseInt($("#org-select").val())) ? "all" : parseInt($("#org-select").val());
    content[0].text = obj.event_ref[event_id];
    for (let i = 0; i < obj.tiers[tier_id][event_id].length; i++) {
      const comp_id = obj.tiers[tier_id][event_id][i].competitor_id;
      const compNum = obj.comp_ref[comp_id].comp_number;
      const orgName = obj.comp_ref[comp_id].org_name;
      const sc = obj.tiers[tier_id][event_id][i].score;
      const tt = parseFloat(obj.tiers[tier_id][event_id][i].total_seconds);
      const tmin = (Math.floor(tt / 60)).toFixed(0);
      const tsec = (Math.floor(tt % 60)).toFixed(0);
      const trem = ((tt % 60) - tsec).toFixed(2);
      const tminDisp = tmin.length === 2 ? tmin : `0${tmin}`;
      const tsecDisp = tsec.length === 2 ? tsec : `0${tsec}`;
      const tremDisp = `${trem[2]}${trem[3]}`
      const ttime = `${tminDisp}:${tsecDisp}.${tremDisp}`;
      const tplace = i + 1;
      const tArr = [compNum, orgName, tplace, sc, ttime];
      content[1].table.body.push(tArr);
    }
    // render event title
    const pTitleEl = h({ e: "p", c: "subtitle mx-auto", tx: obj.event_ref[event_id] });
    $("#dynamic").append(pTitleEl);
    const lineEl = h({ e: "hr", c: "line full mx-auto"});
    $("#dynamic").append(lineEl);
    let x = obj.tiers[tier_id][event_id].length;
    if ($("#report-select").val() === "0") {
      x = obj.tiers[tier_id][event_id].length < 3 ? obj.tiers[tier_id][event_id].length : 3;
    }
    for (let i = 0; i < x; i++) {
      // retrieve competitor information
      let competitor_id = obj.tiers[tier_id][event_id][i].competitor_id;
      if (org_id === "all" || org_id === obj.comp_ref[competitor_id].org_id) {
        // render html elements
        const divEl = h({ e: "div", c: "result-container mx-auto" });
        const pRankEl = h({ e: "p", c: "subtitle mx-auto", tx: `Place: ${i + 1}` });
        const divLineEl = h({ e: "hr", c: "line large mx-auto"});
        const pCompNumberEl = h({ e: "p", c: "text mx-auto", tx: obj.comp_ref[competitor_id].comp_number });
        const pNameEl = h({ e: "p", c: "text mx-auto", tx: obj.tier_ref[tier_id].team === 0 ? `${obj.comp_ref[competitor_id].first_name} ${obj.comp_ref[competitor_id].last_name}` : `${obj.comp_ref[competitor_id].team_name}: ${obj.comp_ref[competitor_id].group_names}` });
        const pOrgEl = h({ e: "p", c: "text mx-auto", tx: obj.comp_ref[competitor_id].org_name });
        const pScoreEl = h({ e: "p", c: "text mx-auto", tx: obj.tiers[tier_id][event_id][i].score });
        const pTimeEl = h({ e: "p", c: "text mx-auto", tx: `${Math.floor(obj.tiers[tier_id][event_id][i].total_seconds / 60)}:${(obj.tiers[tier_id][event_id][i].total_seconds % 60).toFixed(2)}` });
        divEl.append(pRankEl);
        divEl.append(divLineEl);
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
    $.ajax("/api/generate-report/", { type: "POST", data: data }).then(() => {});
  }

  function h(o) {
    const e = $(`<${o.e}>`);
    if (o.i) {
      e.attr("id", o.i);
    }
    if (o.c) {
      e.attr("class", o.c);
    }
    if (o.ty) {
      e.attr("type", o.ty);
    }
    if (o.tx) {
      e.text(o.tx);
    }
    if (o.v) {
      e.val(o.v);
    }
    if (o.di) {
      e.attr("data-id", o.di);
    }
    if (o.dti) {
      e.attr("data-tier_id", o.dti);
    }
    if (o.dei) {
      e.attr("data-event_id", o.dei);
    }
    if (o.ri) {
      e.attr("data-record-id", o.ri);
    }
    if (o.dte) {
      e.attr("data-total-events", o.dte);
    }
    return e;
  }
});
