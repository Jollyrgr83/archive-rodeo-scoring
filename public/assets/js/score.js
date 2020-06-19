$(() => {
  const h = (o) => {
    const e = $(`<${o.e}>`);
    if (o.c) { e.attr("class", o.c); }
    if (o.i) { e.attr("id", o.i); }
    if (o.ty) { e.attr("type", o.ty); }
    if (o.tx) { e.text(o.tx); }
    if (o.di) { e.attr("data-id", o.di); }
    if (o.dt) { e.attr("data-tier_id", o.dt); }
    if (o.de) { e.attr("data-event_id", o.de); }
    if (o.v) { e.val(o.v); }
    if (o.s) { e.attr("style", o.s); }
    if (o.dr) { e.attr("data-record-id", o.dr) }
    if (o.dte) { e.attr("data-total-events", o.dte) }
    return e;
  };
  renderCompSelectionMenu();
  $(document).on("change", "#year-select", event => renderCompSelectionMenu());
  $(document).on("change", "#comp-select", event => renderScore());
  $(document).on("click", "#save-button", event => {
    var totalEvents = $(event.target).attr("data-total-events");
    var scoreObj = [];
    for (let i = 0; i < totalEvents; i++) {
      scoreObj.push({
        title: "score",
        value: $(`#score-input-${i}`).val(),
        id: $(`#score-input-${i}`).attr("data-record-id"),
      });
      scoreObj.push({
        title: "time_minutes",
        value: $(`#minutes-input-${i}`).val(),
        id: $(`#minutes-input-${i}`).attr("data-record-id"),
      });
      scoreObj.push({
        title: "time_seconds",
        value: $(`#seconds-input-${i}`).val(),
        id: $(`#seconds-input-${i}`).attr("data-record-id"),
      });
    }
    $.ajax("/api/score/", {
      type: "PUT",
      data: { data: scoreObj },
    }).then(() => {
      var messageEl = h({e: "p", c: "item-title mx-auto", tx: "Success! Scores have been updated!"});
      $("#score-container").append(messageEl);
    });
  });

  function renderCompSelectionMenu() {
    $.get("/api/comp/year/" + parseInt($("#year-select").val()), data => {
      $("#comp-menu-container").empty();
      var menuTitleEl = h({e: "p", c: "item-title mx-auto", tx: "Select a Competitor"});
      $("#comp-menu-container").append(menuTitleEl);
      var menuEl = h({e: "select", i: "comp-select"});
      for (let i = 0; i < data.length; i++) {
        var optionEl = h({e: "option", v: data[i].id, tx: data[i].text});
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
    var input = `${parseInt($("#comp-select").val())}&${parseInt(
      $("#year-select").val()
    )}`;
    $.get("/api/score/competitor/" + input, data => {
      for (let i = 0; i < data.length; i++) {
        var sectionEl = h({e: "div", c: "main-container mx-auto text-center"});
        var pTitleEl = h({e: "p", c: "mini-title mx-auto", tx: data[i].name});
        sectionEl.append(pTitleEl);
        var div1El = h({e: "div", c: "row mx-auto"});
        var pScoreEl = h({e: "p", c: "score-title mx-auto", tx: "Score"});
        div1El.append(pScoreEl);
        var pMinEl = h({e: "p", c: "score-title mx-auto", tx: "Minutes"});
        div1El.append(pMinEl);
        var pSecEl = h({e: "p", c: "score-title mx-auto", tx: "Seconds"});
        div1El.append(pSecEl);
        sectionEl.append(div1El);
        var div2El = h({e: "div", c: "row mx-auto"});
        var inputScoreEl = h({e: "input", i: `score-input-${i}`, c: "score-input mx-auto", ty: "number", dr: data[i].id, v: data[i].score});
        div2El.append(inputScoreEl);
        var inputMinEl = h({e: "input", i: `minutes-input-${i}`, c: "score-input mx-auto", ty: "number", dr: data[i].id, v: data[i].time_minutes});
        div2El.append(inputMinEl);
        var inputSecEl = h({e: "input", i: `seconds-input-${i}`, c: "score-input mx-auto", ty: "number", dr: data[i].id, v: data[i].time_seconds});
        div2El.append(inputSecEl);
        sectionEl.append(div2El);
        $("#score-container").append(sectionEl);
      }
      var sectionEl = h({e: "div", c: "main-container mx-auto text-center"});
      var saveButtonEl = h({e: "button", i: "save-button", c: "button", dte: data.length, tx: "Save Changes"});
      sectionEl.append(saveButtonEl);
      $("#score-container").append(sectionEl);
    });
  }
});
