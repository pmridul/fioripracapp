sap.ui.define([
    'CoreChange/ABAP/first/controller/baseController',
    'CoreChange/ABAP/first/util/formatdata',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (baseController, formatdata, Filter, FilterOperator) {
    'use strict';

    return baseController.extend("CoreChange.ABAP.first.controller.view1", {

        formatter: formatdata,
        onInit: function () {
            // Define the router object in the init method 
            // Owner componenet is only 1 Compoenent.js
            this.oRouter = this.getOwnerComponent().getRouter();
        },

        onNewProd: function(){
            this.oRouter.navTo("addproduct", {})

        },

        onLiveSearch: function (oEvent) {
            debugger;
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();
            var oFilterName = new Filter("name", FilterOperator.Contains, sQuery);
            aFilters.push(oFilterName);
            this.getView().byId("idList").getBinding("items").filter(aFilters);

        },

        onDeleteItems: function () {
            // Get the List control object
            var oList = this.getView().byId("idList");
            // Get each item selected by user
            var aItems = oList.getSelectedItems();
            // loop and delete
            for (var i = 0; i < aItems.length; i++) {
                var oItem = aItems[i];
                oList.removeItem(oItem);
            }
        },

        onItemSelect: function (oEvent) {
            // Get the Object of selected item
            var oItem = oEvent.getParameter("listItem");
            // Get the path of selected Item
            var sPath = oItem.getBindingContextPath();
            // CAlling view 2 will be done via router we should not call view2 via VIew 1
            // Get the object of View 2
            // var oSplitApp = this.getView().getParent().getParent();
            // var oView2 = oSplitApp.getDetailPages()[0];
            // Bind the path to the view
            //  oView2.bindElement({ path: sPath });

            // get the index for the row selected
            var sIndex = sPath.split("/")[sPath.split("/").length - 1];

            // pass the index as parameter to next screen funrction 
            // To call the view2 in mobile in desktop its not required
            this.onNext(sIndex);

        },

        onDelItem: function (oEvent) {
            debugger;
            var oItem = oEvent.getParameter("listItem");
            var oList = this.getView().byId("idList");
            oList.removeItem(oItem);
        },

        onChange: function (oEvent) {
            //   debugger;
            var oItem = oEvent.getParameters("listItem");

        },

        onSearch: function (oEvent) {

            // Get the value entered by user
            var sQuery = oEvent.getParameter("query");
            // Construct filter
            // commented the filter as this for fruits json
            //var oFilterName = new Filter("name", FilterOperator.Contains, sQuery);
            // new filter condition based on OData
            var oFilterName = new Filter("CATEGORY", FilterOperator.Contains, sQuery);
            var oFilterType = new Filter("type", FilterOperator.Contains, sQuery);

            var oFilter = new Filter({
                filters: [oFilterName, oFilterType],
                and: false
            });

            // Get the list object
            var oList = this.byId("idList");
            // Get the list  object Binding object
            var oBinding = oList.getBinding("items");
            // Inject the filter
            // commented as this for JSON with 2 conditions
            //oBinding.filter(oFilter);
            // Pass the Odata category filter
            oBinding.filter(oFilterName);

        },
        // receive the index from the calling function
        onNext: function (sIndex) {

            // Step 1: get the parent object - App container control
            // var oAppCont = this.getView().getParent();
            // Step 2: naviagte to view 2
            //  oAppCont.to("idView2");

            // Passs the index as paramter to router
            // Router will call the detaildata route
            this.oRouter.navTo("detaildata", {
                // pass to variable
                fruitIndex : sIndex  
            });
        }
    });
});