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
      const containerEl = h({ e: "section", c: "section-container mx-auto text-center" });
      const pTitleEl = h({ e: "p", c: "mini-title mx-auto", tx: `${data.tiers[i].name} Tier` });
      containerEl.append(pTitleEl);
      for (let j = 0; j < data[data.tiers[i].name].length; j++) {
        const itemInputEl = h({ e: "input", c: "year-input mx-auto", di: data[data.tiers[i].name][j].event_id, ty: "text", v: data[data.tiers[i].name][j].name });
        const deleteButtonEl = svgEl("delete", "square-button del-btn mx-auto");
        deleteButtonEl.setAttribute("data-event_id", data[data.tiers[i].name][j].event_id);
        deleteButtonEl.setAttribute("data-tier_id", data.tiers[i].tier_id);
        const rowEl = h({ e: "div", c: "row mx-auto text-center" });
        rowEl.append(itemInputEl);
        rowEl.append(deleteButtonEl);
        containerEl.append(rowEl);
      }
      const pAddEl = h({ e: "p", c: "item-title mx-auto", tx: "Add New Event" });
      containerEl.append(pAddEl);
      const rowContainerEl = h({ e: "div", c: "row mx-auto text-center" });
      const selectEventEl = h({ e: "select", c: "year-input mx-auto", i: `year-add-event-select-${data.tiers[i].tier_id}`, di: data.tiers[i].tier_id });
      for (let k = 0; k < data.allEvents.length; k++) {
        const optionEl = h({ e: "option", v: data.allEvents[k].id, tx: data.allEvents[k].name });
        selectEventEl.append(optionEl);
      }
      rowContainerEl.append(selectEventEl);
      const addEventButtonEl = svgEl("plus", "square-button year-add-event-button mx-auto");
      addEventButtonEl.setAttribute("data-id", data.tiers[i].tier_id);
      rowContainerEl.append(addEventButtonEl);
      containerEl.append(rowContainerEl);
      const pDelEl = h({ e: "p", c: "item-title mx-auto", tx: "Delete Tier" });
      containerEl.append(pDelEl);
      const delTierButtonEl = h({ e: "button", c: "button mx-auto del-btn", dti: data.tiers[i].tier_id, tx: "Delete Tier" });
      containerEl.append(delTierButtonEl);
      $("#dynamic").append(containerEl);
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
      },
      plus: {
        class: "bi bi-plus",
        width: "2em",
        height: "2em",
        dOne: "M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z",
        dTwo: "M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"
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