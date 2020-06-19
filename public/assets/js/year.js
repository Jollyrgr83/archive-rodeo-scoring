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
    return e;
  };
  getYearSetup();

  $(document).on("change", "#year-select", () => getYearSetup());
  
  $(document).on("click", ".button", event => {
    if ($(event.target).attr("id") === "year-add-tier-button") {
      $.ajax("/api/year/tier/", {
        type: "POST",
        data: {
          year_id: parseInt($("#year-select").val()),
          tier_id: parseInt($("#tier-select").val()),
        }
      }).then(() => getYearSetup());
    } else if ($(event.target).attr("class").indexOf("delete") != -1) {
      $.ajax("/api/year/tier/", {
        type: "DELETE",
        data: {
          year_id: parseInt($("#year-select").val()),
          tier_id: parseInt($(event.target).attr("data-tier_id")),
        }
      }).then(() => getYearSetup());
    }
  });

  $(document).on("click", ".year-button", event => {
    $.ajax("/api/year/", {
      type: "DELETE",
      data: {
        year_id: parseInt($("#year-select").val()),
        tier_id: parseInt($(event.target).attr("data-tier_id")),
        event_id: parseInt($(event.target).attr("data-event_id")),
      }
    }).then(() => getYearSetup());
  });

  $(document).on("click", ".year-add-event-button", event => {
    $.ajax("/api/year/", {
      type: "POST",
      data: {
        year_id: parseInt($("#year-select").val()),
        tier_id: parseInt($(event.target).attr("data-id")),
        event_id: parseInt($(`#year-add-event-select-${parseInt($(event.target).attr("data-id"))}`).val()),
      },
    }).then(() => getYearSetup());
  });

  function getYearSetup() {
    $.get("/api/year/" + parseInt($("#year-select").val()), data => renderYearSetup(data));
  }

  function renderYearSetup(data) {
    $("#dynamic").empty();
    for (let i = 0; i < data.tiers.length; i++) {
      var containerEl = h({ e: "section", c: "main-container mx-auto text-center"});
      var pTitleEl = h({e:"p", c: "mini-title mx-auto", tx: `${data.tiers[i].name} Tier`});
      containerEl.append(pTitleEl);
      for (let j = 0; j < data[data.tiers[i].name].length; j++) {
        var itemInputEl = h({e:"input", c: "year-input mx-auto", di: data[data.tiers[i].name][j].event_id, ty: "text", v: data[data.tiers[i].name][j].name});
        var deleteButtonEl = h({e: "button", de: data[data.tiers[i].name][j].event_id, dt: data.tiers[i].tier_id, c: "year-button delete mx-auto", tx: "x"});
        var rowEl = h({e: "div", c: "row mx-auto text-center"});
        rowEl.append(itemInputEl);
        rowEl.append(deleteButtonEl);
        containerEl.append(rowEl);
      }
      var pAddEl = h({e: "p", c: "item-title mx-auto", tx: "Add New Event"});
      containerEl.append(pAddEl);
      var selectEventEl = h({e: "select", i: `year-add-event-select-${data.tiers[i].tier_id}`, di: data.tiers[i].tier_id});
      for (let k = 0; k < data.allEvents.length; k++) {
        var optionEl = h({e: "option", v: data.allEvents[k].id, tx: data.allEvents[k].name});
        selectEventEl.append(optionEl);
      }
      containerEl.append(selectEventEl);
      var addEventButtonEl = h({e: "button", c: "button year-add-event-button", di: data.tiers[i].tier_id, tx: "Add Event"});
      containerEl.append(addEventButtonEl);
      var delTierButtonEl = h({e: "button", c: "button mx-auto delete", dt: data.tiers[i].tier_id, s: "background-color: red; border: solid 2px red;", tx: "Delete Tier"});
      containerEl.append(delTierButtonEl);
      $("#dynamic").append(containerEl);
    }
  }
});
