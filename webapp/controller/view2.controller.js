sap.ui.define([
    'CoreChange/ABAP/first/controller/baseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (baseController, MessageBox, MessageToast, Fragment, Filter, FilterOperator) {
    'use strict';

    return baseController.extend("CoreChange.ABAP.first.controller.view2", {

        onInit: function () {
            // Define the router object
            this.oRouter = this.getOwnerComponent().getRouter();

            // this will ensure that this statement is triggred when detail data is called
            // this will call the event matched and call function binddata and attach to this
            this.oRouter.getRoute("detaildata").attachMatched(this.bindData, this)

        },

        // Global variable for suppliers
        supplierPopup : null,
        onSupplierFilter:function(oEvent){
            // Fetch and assign the object of the field 
            // to the global variable created
            var oField = oEvent.getSource();
            this.fieldObject = oField;

            // set this pointer to that to access the pointer in callbackfunction
            // as in call back function we cant access THIS
            var that = this;
            // create Fragment object if variable is null
            if (this.supplierPopup === null) {
                Fragment.
                // load the fragment with id, full name and passing this controller
                load({
                    id: "supplier",
                    name: "CoreChange.ABAP.first.fragment.popup",
                    controller: this            
                }).
                // THEN is a promise which will call our function once load 
                // is complete
                then(function(oDialog) {
                    // pass the control of the event to the global variable
                    that.supplierPopup = oDialog;
                    // open using global var
                    that.supplierPopup.open();
                    // As dynamic frag cant access model data
                    // we need to set the permission
                    that.getView().addDependent(that.supplierPopup);
                    // Set title
                    that.supplierPopup.setTitle("Supplier Data");
                    // Bind data
                    that.supplierPopup.bindAggregation( "items",{
                        path : "/suppliers",
                        template: new sap.m.DisplayListItem({
                            label: "{name}",
                            value: "{sinceWhen}"
                        })
                    })
                })                
            }else{
                // as object is create djust open
                that.supplierPopup.open();
            }            
        },

        // Global variable to Handle F4 help. 
        // define and set to null
        cityPopup: null,

        // global variable for field object
        fieldObject : null,
        onValueHelpRequest: function(oEvent){
            // Fetch and assign the object of the field 
            // to the global variable created
            var oField = oEvent.getSource();
            this.fieldObject = oField;

            // set this pointer to that to access the pointer in callbackfunction
            // as in call back function we cant access THIS
            var that = this;
            // create Fragment object if variable is null
            if (this.cityPopup === null) {
                Fragment.
                // load the fragment with id, full name and passing this controller
                load({
                    id: "cities",
                    name: "CoreChange.ABAP.first.fragment.popup",
                    controller: this  
                              
                }).
                // THEN is a promise which will call our function once load 
                // is complete
                then(function(oDialog) {
                    // pass the control of the event to the global variable
                    that.cityPopup = oDialog;
                    // open using global var
                    that.cityPopup.open();
                    // set multi select as false in case we are using
                    // dynamic fragment which is et to true
                    that.cityPopup.setMultiSelect(false);
                    // As dynamic frag cant access model data
                    // we need to set the permission
                    that.getView().addDependent(that.cityPopup);
                    // Set title
                    that.cityPopup.setTitle("Cities Data");
                    // Bind data
                    that.cityPopup.bindAggregation( "items",{
                        path : "/cities",
                        template: new sap.m.DisplayListItem({
                            label: "{name}",
                            value: "{famousFor}"
                        })
                    })
                })                
            }else{
                // as object is create djust open
                that.cityPopup.open();
            }


        },

        onConfirmF4: function(oEvent){
            debugger;
            // get the ID of the popup
            var sId = oEvent.getSource().getId();
            // compare and proceed
            // check if Sid containtain cities /-1 is false
            if (sId.indexOf("cities") !== -1) {
                var sdata = oEvent.getParameter("selectedItem").getLabel();
                this.fieldObject.setValue(sdata);                
            }else{
              // get the object of selected Item  
              var oSelectedItem = oEvent.getParameters("selectedItems").selectedItems;  
              // Array to hold Filter data
              var aFilters = [];
              // Loop and read the values of selected items
              for (let i = 0; i < oSelectedItem.length; i++) {
                const element = oSelectedItem[i];
                var sText = element.getLabel();
                // Create filter condition
                var oFilterCond = new Filter('name', FilterOperator.EQ, sText);
                // push the condition to array 
                aFilters.push(oFilterCond);
              }
              // Create final filter
              var oFilter = new Filter({
                filters : aFilters,
                and: false
              });
              // get the table by ID, and the binding aggregation 
              // then inject the filter
              this.getView().byId("idTable").getBinding("items").filter(oFilter);
            }

        },

        onItemPress: function(oEvent){
            // Get the id of the item selected
            var sId = oEvent.getParameter("listItem").getId();
            // Get the index of the row item
            var sIndex = sId.split("-")[sId.split("-").length - 1];
            // Pass the id as paramater to router route
            this.oRouter.navTo("supplierdata", {
                supplIndex : sIndex
            });
        },

        bindData: function(oEvent){
            // get the Index from URL
            var sIndex = oEvent.getParameter("arguments").fruitIndex;
            // Prepare the path
            //var sPath = "/fruits/" + sIndex;
            // Bind OData
            var sPath  = "/" + sIndex;
            // Bind the path
            this.getView().bindElement(sPath, {
                expand: 'To_Supplier'
            });

        },

        onBack: function () {

            this.getView().getParent().to("idView1");
        },

        onSave: function () {
            MessageBox.confirm("Do you want to save the Sales Order", {
                onClose: this.onCloseMsg
            });

        },

        onDisplayMCB: function(oEvent){
            debugger;
            var oMultiComBox = this.getView().byId("idMultiCombo");
            var aSelItems = oMultiComBox.getSelectedItems();
            var selectedItem = "Selected Data: "
            for (let i = 0; i < aSelItems.length; i++) {
                selectedItem = selectedItem + aSelItems[i].getText() + " ";
            }
            MessageToast.show(selectedItem);

        },

        onSelFinish: function(oEvent){
            var oMultiComBox = oEvent.getParameters("selectedItems");
            var aSelItems = oMultiComBox.selectedItems;

            var selectedItem = "Selected Data: "
            for (let i = 0; i < aSelItems.length; i++) {
                selectedItem = selectedItem + aSelItems[i].getText() + " ";
            }
          //  MessageToast.show(selectedItem);
        },

        onCloseMsg: function (oAction) {
            if (oAction === 'OK') {
                MessageToast.show("SO was saved Successfully");
            } else {
                MessageToast.show(oAction + " " + "Action was cancelled");
            }
        }
    });
});