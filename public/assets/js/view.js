$(() => {
  renderAddMenu();

  $(document).on("click", ".button", (event) => {
    const btnID = $(event.target).attr("id");
    const btnObj = { titleName: null, itemName: null, teamStatus: null, coopStatus: null };
    if (btnID === "view-menu-button") {
      getView($("#view-menu").val());
    } else if (btnID === "add-container-button") {
      btnObj.titleName = $("#add-menu").val();
      btnObj.itemName = $("#add-container-input").val().trim();
      if (btnObj.itemName === "" || (isNaN(parseInt(btnObj.itemName)) && btnObj.titleName === "Years")) {
        renderAddMessage("error", btnObj.titleName);
      } else {
        if (btnObj.titleName === "Tiers") {
          btnObj.teamStatus = $("#tiers-add-select").val();
        } else if (btnObj.titleName === "Organizations") {
          btnObj.coopStatus = $("#organizations-add-select").val();
        }
        renderAddMessage("success", btnObj);
      }
    }
  });

  $(document).on("click", ".square-button", (event) => {
    const obj = {
      id: parseInt($(event.target).attr("id")),
      class: $(event.target).attr("class"),
      itemValue: $(`#input-${$(event.target).attr("id")}`).val().trim(),
      titleName: $("#view-menu").val()
    };
    if (obj.itemValue === "") {
      return;
    } else if (obj.class.indexOf("del-btn") != -1) {
      $.ajax("/api/view/", { type: "DELETE", data: obj }).then(() => getView($("#view-menu").val()));
    } else {
      $.ajax("/api/view/", { type: "PUT", data: obj }).then(() => getView($("#view-menu").val(), "update"));
    }
  });

  $(document).on("change", "#add-menu", () => renderAddMenu());

  function getView(titleName, status) {
    const dataObj = { titleName: titleName, tableName: titleName.toLowerCase(), status: status };
    $.get(`/api/view/menu/${dataObj.tableName}`, (data) => {
      dataObj.data = [...data.data];
      renderViewMenu(dataObj);
    });
  }

  function renderViewMenu(o) {
    $("#view-container").empty();
    const warningDivEl = h({ e: "p", c: "warning mx-auto text-center" });
    const warningTitleEl = h({ e: "p", tx: "WARNING!" });
    const warningTextEl = h({ e: "p", tx: "Deleting an item will also remove all records associated with that item." });
    const pTitleEl = h({ e: "p", c: "mini-title mx-auto", tx: o.titleName });
    warningDivEl.append(warningTitleEl);
    warningDivEl.append(warningTextEl);
    $("#view-container").append(warningDivEl);
    $("#view-container").append(pTitleEl);
    for (let i = 0; i < o.data.length; i++) {
      const itemInputEl = h({ e: "input", c: "view-input", i: `input-${o.data[i].id}`, ty: "text", v: o.data[i].name });
      const updateButtonEl = svgEl("update", "square-button mx-auto");
      updateButtonEl.setAttribute("id", `${o.data[i].id}`);
      const deleteButtonEl = svgEl("delete", "square-button del-btn mx-auto");
      deleteButtonEl.setAttribute("id", `${o.data[i].id}`);
      const rowEl = h({ e: "div", c: "row mx-auto text-center" });
      rowEl.append(itemInputEl);
      rowEl.append(updateButtonEl);
      rowEl.append(deleteButtonEl);
      $("#view-container").append(rowEl);
    }
    if (o.status === "update") {
      const textEl = h({ e: "p", c: "item-title", tx: "Success! Item Updated!" });
      $("#view-container").append(textEl);
    }
  }

  function renderAddMenu() {
    const titleName = $("#add-menu").val();
    $("#add-container").empty();
    const pTitleEl = h({ e: "p", c: "item-title mx-auto", tx: titleName === "Years" ? "Enter Year" : "Enter Name" });
    $("#add-container").append(pTitleEl);
    const inputEl = h({ e: "input", i: "add-container-input", ty: "text" });
    $("#add-container").append(inputEl);
    if (titleName === "Tiers") {
      const tiersTextEl = h({ e: "p", c: "item-title mx-auto", tx: "Are the competitors in this tier individuals or teams?" });
      $("#add-container").append(tiersTextEl);
      const tiersSelectEl = h({ e: "select", i: "tiers-add-select" });
      const optionYesEl = h({ e: "option", tx: "Individuals", v: "false" });
      tiersSelectEl.append(optionYesEl);
      const optionNoEl = h({ e: "option", tx: "Teams", v: "true" });
      tiersSelectEl.append(optionNoEl);
      $("#add-container").append(tiersSelectEl);
    } else if (titleName === "Organizations") {
      const organizationsTextEl = h({ e: "p", c: "item-title mx-auto", tx: "Is this organization a coop?" });
      $("#add-container").append(organizationsTextEl);
      const organizationsSelectEl = h({ e: "select", i: "organizations-add-select" });
      const optionYesEl = h({ e: "option", tx: "Yes", v: "true" });
      organizationsSelectEl.append(optionYesEl);
      const optionNoEl = h({ e: "option", tx: "No", v: "false" });
      organizationsSelectEl.append(optionNoEl);
      $("#add-container").append(organizationsSelectEl);
    }
    const buttonEl = h({ e: "button", c: "button mx-auto", i: "add-container-button", tx: `Add New ${titleName.slice(0, -1)}` });
    $("#add-container").append(buttonEl);
    const messageEl = h({ e: "div", i: "add-message-container" });
    $("#add-container").append(messageEl);
  }

  function renderAddMessage(status, o) {
    $("#add-container").empty();
    if (status === "error") {
      const textEl = h({ e: "p", c: "item-title", tx: "Please ensure that your entry is not blank or is a valid number for a year entry." });
      renderAddMenu();
      $("#add-container").append(textEl);
    } else {
      $.ajax("/api/view/", { type: "POST", data: o }).then(() => {
        getView($("#view-menu").val());
        renderAddMenu();
        const textEl = h({ e: "p", c: "item-title", tx: "Success! Item Added!" });
        $("#add-container").append(textEl);
      });
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
    return e;
  }
});