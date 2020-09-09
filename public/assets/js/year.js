$(() => {
  getYearSetup();

  $(document).on("change", "#year-select", () => getYearSetup());

  $(document).on("click", ".button", (event) => {
    const obj = {
      class: $(event.target).attr("class"),
      year_id: parseInt($("#year-select").val()),
      tier_id: parseInt($(event.target).attr("data-tier_id"))
    };
    if (obj.class.indexOf("del-btn") != -1) {
      $.ajax("/api/year/tier/", { type: "DELETE", data: obj }).then(() => getYearSetup());
    }
  });

  $(document).on("click", ".square-button", (event) => {
    const obj = {
      id: $(event.target).attr("id"),
      class: $(event.target).attr("class"),
      year_id: parseInt($("#year-select").val()),
      tier_id: parseInt($(event.target).attr("data-tier_id")),
      event_id: parseInt($(event.target).attr("data-event_id"))
    };
    if (obj.class.indexOf("del-btn") !== -1) {
      $.ajax("/api/year/", { type: "DELETE", data: obj }).then(() => getYearSetup());      
    } else if (obj.id === "year-add-tier-button") {
      obj.tier_id = parseInt($("#tier-select").val());
      $.ajax("/api/year/tier/", { type: "POST", data: obj }).then(() => getYearSetup());
    }
  });

  $(document).on("click", ".year-add-event-button", (event) => {
    const obj = {
      year_id: parseInt($("#year-select").val()),
      tier_id: parseInt($(event.target).attr("data-id")),
      event_id: parseInt($(`#year-add-event-select-${parseInt($(event.target).attr("data-id"))}`).val())
    };
    $.ajax("/api/year/", { type: "POST", data: obj }).then(() => getYearSetup());
  });

  function getYearSetup() {
    $.get(`/api/year/${parseInt($("#year-select").val())}`, (data) => renderYearSetup(data));
  }

  function renderYearSetup(data) {
    $("#dynamic").empty();
    for (let i = 0; i < data.tiers.length; i++) {
      const containerEl = h({ e: "section", c: "container mx-auto text-center" });
      const pTitleEl = h({ e: "p", c: "subtitle mx-auto", tx: `${data.tiers[i].name} Tier` });
      containerEl.append(pTitleEl);
      const titleLineEl = h({ e: "hr", c: "line large mx-auto" });
      containerEl.append(titleLineEl);
      for (let j = 0; j < data[data.tiers[i].name].length; j++) {
        const itemInputEl = h({ e: "input", c: "large mx-auto", di: data[data.tiers[i].name][j].event_id, ty: "text", v: data[data.tiers[i].name][j].name });
        const deleteButtonEl = h({ e: "i", c: "fas fa-trash-alt square-button del-btn red mx-auto", dei: data[data.tiers[i].name][j].event_id, dti: data.tiers[i].tier_id });
        const rowEl = h({ e: "div", c: "row mx-auto text-center row-container" });
        rowEl.append(itemInputEl);
        rowEl.append(deleteButtonEl);
        containerEl.append(rowEl);
      }
      const pAddEl = h({ e: "p", c: "subtitle mx-auto", tx: "Add New Event" });
      containerEl.append(pAddEl);
      const rowContainerEl = h({ e: "div", c: "row mx-auto text-center row-container" });
      const selectEventEl = h({ e: "select", c: "large mx-auto", i: `year-add-event-select-${data.tiers[i].tier_id}`, di: data.tiers[i].tier_id });
      for (let k = 0; k < data.allEvents.length; k++) {
        const optionEl = h({ e: "option", v: data.allEvents[k].id, tx: data.allEvents[k].name });
        selectEventEl.append(optionEl);
      }
      rowContainerEl.append(selectEventEl);
      const addEventButtonEl = h({ e: "i", c: "fas fa-plus square-button blue year-add-event-button mx-auto", di: data.tiers[i].tier_id });
      rowContainerEl.append(addEventButtonEl);
      containerEl.append(rowContainerEl);
      const pDelEl = h({ e: "p", c: "subtitle mx-auto", tx: "Delete This Tier?" });
      containerEl.append(pDelEl);
      const delTierButtonEl = h({ e: "button", c: "button mx-auto red del-btn", dti: data.tiers[i].tier_id, tx: "Delete" });
      containerEl.append(delTierButtonEl);
      $("#dynamic").append(containerEl);
    }
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
    return e;
  }
});