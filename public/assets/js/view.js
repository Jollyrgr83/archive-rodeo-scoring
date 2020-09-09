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
    const pTitleEl = h({ e: "p", c: "subtitle mx-auto", tx: o.titleName });
    const titleLineEl = h({ e: "hr", c: "line large mx-auto" });
    warningDivEl.append(warningTitleEl);
    warningDivEl.append(warningTextEl);
    $("#view-container").append(warningDivEl);
    $("#view-container").append(pTitleEl);
    $("#view-container").append(titleLineEl);
    for (let i = 0; i < o.data.length; i++) {
      const itemInputEl = h({ e: "input", c: "half mx-auto", i: `input-${o.data[i].id}`, ty: "text", v: o.data[i].name });
      const updateButtonEl = h({ e: "i", c: "fas fa-redo square-button blue mx-auto", i: `${o.data[i].id}` });
      const deleteButtonEl = h({ e: "i", c: "fas fa-trash-alt square-button red del-btn mx-auto", i: `${o.data[i].id}` });
      const rowEl = h({ e: "div", c: "row mx-auto text-center row-container" });
      rowEl.append(itemInputEl);
      rowEl.append(updateButtonEl);
      rowEl.append(deleteButtonEl);
      $("#view-container").append(rowEl);
    }
    if (o.status === "update") {
      const textEl = h({ e: "p", c: "text", tx: "Success! Item Updated!" });
      $("#view-container").append(textEl);
    }
  }

  function renderAddMenu() {
    const titleName = $("#add-menu").val();
    $("#add-container").empty();
    const pTitleEl = h({ e: "p", c: "subtitle full mx-auto", tx: titleName === "Years" ? "Enter Year" : "Enter Name" });
    $("#add-container").append(pTitleEl);
    const inputEl = h({ e: "input", i: "add-container-input", ty: "text", c: "full mx-auto" });
    $("#add-container").append(inputEl);
    if (titleName === "Tiers") {
      const tiersTextEl = h({ e: "p", c: "subtitle full mx-auto", tx: "Are the competitors in this tier individuals or teams?" });
      $("#add-container").append(tiersTextEl);
      const tiersSelectEl = h({ e: "select", i: "tiers-add-select", c: "full mx-auto" });
      const optionYesEl = h({ e: "option", tx: "Individuals", v: "false" });
      tiersSelectEl.append(optionYesEl);
      const optionNoEl = h({ e: "option", tx: "Teams", v: "true" });
      tiersSelectEl.append(optionNoEl);
      $("#add-container").append(tiersSelectEl);
    } else if (titleName === "Organizations") {
      const organizationsTextEl = h({ e: "p", c: "subtitle full mx-auto", tx: "Is this organization a coop?" });
      $("#add-container").append(organizationsTextEl);
      const organizationsSelectEl = h({ e: "select", i: "organizations-add-select", c: "full mx-auto" });
      const optionYesEl = h({ e: "option", tx: "Yes", v: "true" });
      organizationsSelectEl.append(optionYesEl);
      const optionNoEl = h({ e: "option", tx: "No", v: "false" });
      organizationsSelectEl.append(optionNoEl);
      $("#add-container").append(organizationsSelectEl);
    }
    const buttonEl = h({ e: "button", c: "button blue mx-auto", i: "add-container-button", tx: "Add" });
    $("#add-container").append(buttonEl);
    const messageEl = h({ e: "div", i: "add-message-container" });
    $("#add-container").append(messageEl);
  }

  function renderAddMessage(status, o) {
    $("#add-container").empty();
    if (status === "error") {
      const textEl = h({ e: "p", c: "subtitle mx-auto", tx: "Please ensure that your entry is not blank or is a valid number for a year entry." });
      renderAddMenu();
      $("#add-container").append(textEl);
    } else {
      $.ajax("/api/view/", { type: "POST", data: o }).then(() => {
        getView($("#view-menu").val());
        renderAddMenu();
        const textEl = h({ e: "p", c: "subtitle mx-auto", tx: "Success! Item Added!" });
        $("#add-container").append(textEl);
      });
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
    return e;
  }
});