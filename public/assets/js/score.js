$(() => {
  renderCompSelectionMenu();

  $(document).on("change", "#year-select", () => renderCompSelectionMenu());

  $(document).on("change", "#comp-select", () => renderScore());

  $(document).on("click", "#save-button", (event) => {
    const totalEvents = $(event.target).attr("data-total-events");
    const scoreObj = [];
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
    $.ajax("/api/score/", { type: "PUT", data: { data: scoreObj } }).then(() => {
        const messageEl = h({ e: "p", c: "item-title mx-auto", tx: "Success! Scores have been updated!" });
        $("#score-container").append(messageEl);
    });
  });

  function renderCompSelectionMenu() {
    $.get(`/api/comp/year/${parseInt($("#year-select").val())}`, (data) => {
      $("#comp-menu-container").empty();
      const menuTitleEl = h({ e: "p", c: "item-title mx-auto", tx: "Select a Competitor" });
      $("#comp-menu-container").append(menuTitleEl);
      const menuEl = h({ e: "select", i: "comp-select" });
      for (let i = 0; i < data.length; i++) {
        const optionEl = h({ e: "option", v: data[i].id, tx: data[i].text });
        menuEl.append(optionEl);
      }
      $("#comp-menu-container").append(menuEl);
      reconcileScores();
    });
  }

  function reconcileScores() {
    $.get(`/api/score/reconcile/${$("#year-select").val()}`, () => renderScore());
  }

  function renderScore() {
    $("#score-container").empty();
    const input = `${parseInt($("#comp-select").val())}&${parseInt($("#year-select").val())}`;
    $.get(`/api/score/competitor/${input}`, (data) => {
      for (let i = 0; i < data.length; i++) {
        const sectionEl = h({ e: "div", c: "section-container mx-auto text-center" });
        const pTitleEl = h({ e: "p", c: "mini-title mx-auto", tx: data[i].name });
        sectionEl.append(pTitleEl);
        const div1El = h({ e: "div", c: "row mx-auto" });
        const pScoreEl = h({ e: "p", c: "item-title score-title mx-auto", tx: "Score" });
        div1El.append(pScoreEl);
        const pMinEl = h({ e: "p", c: "item-title score-title mx-auto", tx: "Minutes" });
        div1El.append(pMinEl);
        const pSecEl = h({ e: "p", c: "item-title score-title mx-auto", tx: "Seconds" });
        div1El.append(pSecEl);
        sectionEl.append(div1El);
        const div2El = h({ e: "div", c: "row mx-auto" });
        const inputScoreEl = h({ e: "input", i: `score-input-${i}`, c: "score-input mx-auto", ty: "number", ri: data[i].id, v: data[i].score });
        div2El.append(inputScoreEl);
        const inputMinEl = h({ e: "input", i: `minutes-input-${i}`, c: "score-input mx-auto", ty: "number", ri: data[i].id, v: data[i].time_minutes });
        div2El.append(inputMinEl);
        const inputSecEl = h({ e: "input", i: `seconds-input-${i}`, c: "score-input mx-auto", ty: "number", ri: data[i].id, v: data[i].time_seconds });
        div2El.append(inputSecEl);
        sectionEl.append(div2El);
        $("#score-container").append(sectionEl);
      }
      const sectionEl = h({ e: "div", c: "section-container mx-auto text-center" });
      const saveButtonEl = h({ e: "button", i: "save-button", c: "button", dte: data.length, tx: "Save Changes" });
      sectionEl.append(saveButtonEl);
      $("#score-container").append(sectionEl);
    });
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