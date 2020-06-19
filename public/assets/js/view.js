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
  const getView = (titleName, status) => {
    const dataObj = { titleName: titleName, tableName: titleName.toLowerCase(), status: status };
    $.get("/api/view/menu/" + dataObj.tableName, data => {
      dataObj.data = [...data.data];
      renderViewMenu(dataObj);
    });
  }
  const renderViewMenu = dataObj => {
    $("#view-container").empty();
    var warningDivEl = h({e: "p", c: "warning mx-auto text-center"});
    var warningTitleEl = h({e: "p", s: "font-size: 32px; margin-bottom: 0;", tx: "WARNING!"});
    var warningTextEl = h({e: "p", s: "font-size: 18px;", tx: "Deleting an item will also remove all records associated with that item."});
    var pTitleEl = h({e: "p", c: "mini-title mx-auto", tx: dataObj.titleName});
    warningDivEl.append(warningTitleEl);
    warningDivEl.append(warningTextEl);
    $("#view-container").append(warningDivEl);
    $("#view-container").append(pTitleEl);
    for (let i = 0; i < dataObj.data.length; i++) {
      var itemInputEl = h({e: "input", i: `input-${dataObj.data[i].id}`, ty: "text", v: dataObj.data[i].name});
      var updateButtonEl = h({e: "button", c: "view-button update mx-auto", i: `${dataObj.data[i].id}`, tx: "Update"});
      var deleteButtonEl = h({e: "button", c: "view-button delete mx-auto", i: `${dataObj.data[i].id}`, tx: "Delete"});
      var rowEl = h({e: "div", c: "row mx-auto text-center"});
      $("#view-container").append(itemInputEl);
      rowEl.append(updateButtonEl);
      rowEl.append(deleteButtonEl);
      $("#view-container").append(rowEl);
    }
    if (dataObj.status === "update") {
      var textEl = h({e: "p", c: "item-title", tx: `Success! Item Updated!`});
      $("#view-container").append(textEl);
    }
  }
  const renderAddMenu = () => {
    var titleName = $("#add-menu").val();
    $("#add-container").empty();
    var pTitleEl = h({e: "p", c: "item-title mx-auto", tx: titleName === "Years" ? "Enter Year" : `Enter Name`});
    $("#add-container").append(pTitleEl);
    var inputEl = h({e: "input", i: "add-container-input", ty: "text"});
    $("#add-container").append(inputEl);
    if (titleName === "Tiers") {
      var tiersTextEl = h({e: "p", c: "item-title mx-auto", tx: "Are the competitors in this tier individuals or teams?"});
      $("#add-container").append(tiersTextEl);
      var tiersSelectEl = h({e: "select", i: "tiers-add-select"});
      var optionYesEl = h({e: "option", tx: "Individuals"});
      tiersSelectEl.append(optionYesEl);
      var optionNoEl = h({e: "option", tx: "Teams"});
      tiersSelectEl.append(optionNoEl);
      $("#add-container").append(tiersSelectEl);
    } else if (titleName === "Organizations") {
      var organizationsTextEl = h({e: "p", c: "item-title mx-auto", tx: "Is this organization a coop?"});
      $("#add-container").append(organizationsTextEl);
      var organizationsSelectEl = h({e: "select", i: "organizations-add-select"});
      var optionYesEl = h({e: "option", tx: "Yes"});
      organizationsSelectEl.append(optionYesEl);
      var optionNoEl = h({e: "option", tx: "No"});
      organizationsSelectEl.append(optionNoEl);
      $("#add-container").append(organizationsSelectEl);
    }
    var buttonEl = h({e: "button", c: "button mx-auto", i: "add-container-button", tx: `Add New ${titleName.slice(0, -1)}`});
    $("#add-container").append(buttonEl);
    var messageEl = h({e: "div", i: "add-message-container"});
    $("#add-container").append(messageEl);
  }
  const renderAddMessage = (status, titleName, itemName, teamStatus, coopStatus) => {
    $("#add-container").empty();
    if (status === "error") {
      var textEl = h({e: "p", c: "item-title", tx: "Please ensure that your entry is not blank or is a valid number for a year entry."});
      renderAddMenu(titleName);
      $("#add-container").append(textEl);
    } else {
      const addObj = { titleName: titleName, itemName: itemName };
      if (teamStatus === "Individuals") {
        addObj.teamStatus = true;
      } else if (teamStatus === "Teams") {
        addObj.teamStatus = false;
      } else if (coopStatus === "Yes") {
        addObj.coopStatus = true;
      } else if (coopStatus === "No") {
        addObj.coopStatus = false;
      }
      $.ajax("/api/view/", { type: "POST", data: addObj }).then(() => {
        getView($("#view-menu").val());
        var textEl = h({e: "p", c: "item-title", tx: `Success! Item Added!`});
        $("#add-container").append(textEl);
      });
    }
  }
  renderAddMenu();
  $(document).on("click", ".button", event => {
    if ($(event.target).attr("id") === "view-menu-button") {
      getView($("#view-menu").val());
    } else if ($(event.target).attr("id") === "add-container-button") {
      var titleName = $("#add-menu").val();
      var itemName = $("#add-container-input").val().trim();
      if (itemName === "" || (isNaN(parseInt(itemName)) && titleName === "Years")) {
        renderAddMessage("error", titleName);
      } else {
        if (titleName === "Tiers") {
          var teamStatus = $("#tiers-add-select").val();
        } else if (titleName === "Organizations") {
          var teamStatus = null;
          var coopStatus = $("#organizations-add-select").val();
        }
        renderAddMessage("success", titleName, itemName, teamStatus, coopStatus);
      }
    }
  });
  $(document).on("click", ".view-button", event => {
    var ID = parseInt($(event.target).attr("id"));
    var itemValue = $(`#input-${ID}`).val().trim();
    if (itemValue === "") {
      return;
    } else if ($(event.target).attr("class").indexOf("delete") != -1) {
      $.ajax("/api/view/", { type: "DELETE", data: { titleName: $("#view-menu").val(), id: ID } }).then(() => getView($("#view-menu").val()));
    } else if ($(event.target).attr("class").indexOf("update") != -1) {
      $.ajax("/api/view/", { type: "PUT", data: { titleName: $("#view-menu").val(), id: ID, itemValue: itemValue } }).then(() => getView($("#view-menu").val(), "update"));
    }
  });
  $(document).on("change", "#add-menu", event => renderAddMenu());
});
