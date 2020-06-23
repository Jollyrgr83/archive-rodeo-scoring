$(() => {
    getYearSetup();

    $(document).on("change", "#year-select", () => getYearSetup());

    $(document).on("click", ".button", (event) => {
        if ($(event.target).attr("class").indexOf("del-btn") != -1) {
            $.ajax("/api/year/tier/", {
                type: "DELETE",
                data: {
                    year_id: parseInt($("#year-select").val()),
                    tier_id: parseInt($(event.target).attr("data-tier_id"))
                }
            }).then(res => getYearSetup());
        }
    });

    $(document).on("click", ".square-button", (event) => {
      if ($(event.target).attr("class").indexOf("del-btn") !== -1) {
        $.ajax("/api/year/", {
            type: "DELETE",
            data: {
                year_id: parseInt($("#year-select").val()),
                tier_id: parseInt($(event.target).attr("data-tier_id")),
                event_id: parseInt($(event.target).attr("data-event_id"))
            }
        }).then(() => getYearSetup());      
      } else {
        $.ajax("/api/year/tier/", {
          type: "POST",
          data: {
              year_id: parseInt($("#year-select").val()),
              tier_id: parseInt($("#tier-select").val())
          }
          }).then(() => getYearSetup());
      }
    });

    $(document).on("click", ".year-add-event-button", (event) => {
        $.ajax("/api/year/", {
            type: "POST",
            data: {
                year_id: parseInt($("#year-select").val()),
                tier_id: parseInt($(event.target).attr("data-id")),
                event_id: parseInt($(`#year-add-event-select-${parseInt($(event.target).attr("data-id"))}`).val())
            }
        }).then(() => getYearSetup());
    });

    function getYearSetup() {
        $.get("/api/year/" + parseInt($("#year-select").val()), data => renderYearSetup(data));
    }

    function renderYearSetup(data) {
        $("#dynamic").empty();
        for (let i = 0; i < data.tiers.length; i++) {
            var containerEl = $("<section>");
            containerEl.attr("class", "section-container mx-auto text-center");
            var pTitleEl = $("<p>");
            pTitleEl.attr("class", "mini-title mx-auto");
            pTitleEl.text(`${data.tiers[i].name} Tier`);
            containerEl.append(pTitleEl);
            for (let j = 0; j < data[data.tiers[i].name].length; j++) {
                var itemInputEl = $("<input>");
                itemInputEl.attr("class", "year-input mx-auto");
                itemInputEl.attr("data-id", data[data.tiers[i].name][j].event_id);
                itemInputEl.attr("type", "text");
                itemInputEl.val(data[data.tiers[i].name][j].name);
                var deleteButtonEl = svgEl("delete", "square-button del-btn mx-auto");
                deleteButtonEl.setAttribute("data-event_id", data[data.tiers[i].name][j].event_id);
                deleteButtonEl.setAttribute("data-tier_id", data.tiers[i].tier_id);
                var rowEl = $("<div>");
                rowEl.attr("class", "row mx-auto text-center");
                rowEl.append(itemInputEl);
                rowEl.append(deleteButtonEl);
                containerEl.append(rowEl);
            }
            var pAddEl = $("<p>");
            pAddEl.attr("class", "item-title mx-auto");
            pAddEl.text("Add New Event");
            containerEl.append(pAddEl);
            var rowContainerEl = $("<div>");
            rowContainerEl.attr("class", "row mx-auto text-center");
            var selectEventEl = $("<select>");
            selectEventEl.attr("class", "year-input mx-auto");
            selectEventEl.attr("id", `year-add-event-select-${data.tiers[i].tier_id}`);
            selectEventEl.attr("data-id", data.tiers[i].tier_id);
            for (let k = 0; k < data.allEvents.length; k++) {
                var optionEl = $("<option>");
                optionEl.attr("value", data.allEvents[k].id);
                optionEl.text(data.allEvents[k].name);
                selectEventEl.append(optionEl);
            }
            rowContainerEl.append(selectEventEl);
            var addEventButtonEl = svgEl("plus", "square-button year-add-event-button mx-auto");
            addEventButtonEl.setAttribute("data-id", data.tiers[i].tier_id);
            rowContainerEl.append(addEventButtonEl);
            containerEl.append(rowContainerEl);
            var pDelEl = $("<p>");
            pDelEl.attr("class", "item-title mx-auto");
            pDelEl.text("Delete Tier");
            containerEl.append(pDelEl);
            var delTierButtonEl = $("<button>");
            delTierButtonEl.attr("class", "button mx-auto del-btn");
            delTierButtonEl.attr("data-tier_id", data.tiers[i].tier_id);
            delTierButtonEl.text("Delete Tier");
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
});