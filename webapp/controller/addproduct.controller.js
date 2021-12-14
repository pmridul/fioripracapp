sap.ui.define([
    'CoreChange/ABAP/first/controller/baseController',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment',
], function(baseController, JSONModel, MessageBox, MessageToast, Fragment) {
    'use strict';
   
     return baseController.extend("CoreChange.ABAP.first.controller.addproduct", {

        // on init
        onInit: function(){
            // Create a local model to store data from Fiori
            // adding THIS would make it global variable
            this.oLocalModel = new JSONModel();

            // Set data / structure to the local model
            this.oLocalModel.setData({
                "productSet":{
                    "PRODUCT_ID" : "",
                    "TYPE_CODE" : "PR",
                    "CATEGORY" : "Notebooks",
                    "NAME" : "",
                    "DESCRIPTION" : "",
                    "SUPPLIER_ID" : "0100000047",
                    "SUPPLIER_NAME" : "Becker Berlin",
                    "PRICE" : "",
                    "CURRENCY_CODE" : "EUR",
                    "DIM_UNIT" : "CM",
                    "PRODUCT_PIC_URL" : "/sap/public/bc/NWDEMO_MODEL/IMAGES/HT-1001.jpg",  
            }              
        });

            // set local model as a named model to this view
            this.getView().setModel(this.oLocalModel, "local");
            
        },

        onConfirmF4: function(oEvent){
            debugger;
            // get the ID of the popup
            var sId = oEvent.getSource().getId();
            // In the suppllier pop up we have bound
            // Supplier ID to Lable hence using getLable we get ID
            // Supplier name to value hence using getValue we get name
            var sdata = oEvent.getParameter("selectedItem").getLabel();
            var svalue = oEvent.getParameter("selectedItem").getValue();
            this.fieldObject.setValue(sdata);   
            this.getView().byId("idSuplTxt").setText(svalue);             
        },
        
        //Global
        supplierPopup : null,
        onF4Help: function(oEvent){
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
                    that.supplierPopup.setMultiSelect(false);
                    // As dynamic frag cant access model data
                    // we need to set the permission
                    that.getView().addDependent(that.supplierPopup);
                    // Set title
                    that.supplierPopup.setTitle("Supplier Data");
                    // Bind data
                    that.supplierPopup.bindAggregation( "items",{
                        path : "/SupplierSet",
                        template: new sap.m.DisplayListItem({
                            label: "{BP_ID}",
                            value: "{COMPANY_NAME}"
                        })
                    })
                })                
            }else{
                // as object is create djust open
                that.supplierPopup.open();
            }  

        },

        onMostExp: function(){
            // call function import in OData
            var oOdataModel = this.getView().getModel();
            var that = this;
            this.getView().setBusy(true);
            oOdataModel.callFunction("/GetMostExpensiveProduct", {
                // pass parameters
                urlParameters : {
                    // Hardcoded but we can get from screen also
                    "I_CATEGORY" : 'Notebooks'
                },
                success: function(oData) {
                    // set the data to model
                    that.oLocalModel.setProperty("/productSet", oData);
                    that.getView().setBusy(false);
                },
                error: function(oError) {
                    // use JSON parse to structure the message
                    MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                    that.getView().setBusy(false);
                }
            })             
        },

        OnDelete: function(oEvent){
            // Message pop up confirmation
            MessageBox.confirm("Do you want to continue", {
                // On Close is std function which will called on close
                // and we trigger a proviate method which is shown by _deleteProd
                // from the call back we will not have access to this in Event handler
                // hence we need to bind THIS
                onClose: this._deleteProd.bind(this)
            
            });

        },
         // We will get the user status here
        _deleteProd: function(sStatus){
            // get the prod using the ID of the control
            var vProd = this.getView().byId("idProd").getValue();
            var oOdataModel = this.getView().getModel();
            var that = this;
            if (sStatus === 'OK') {
                oOdataModel.remove("/ProductSet('" + vProd + "')", {
                    success: function(oSuccess) {
                        debugger;
                        MessageToast.show("Product Succesfully deleted")
                    },
                    error: function(oError) {
                        // use JSON parse to structure the message
                        MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                    }
    
                })                  
            }else{
                MessageToast.show("selected cancel");
            }
            // clear once done
            that.onClear();
        },

        onSave : function(){

            // Prepare the payload by passing the entity set name
            var oPayload = this.oLocalModel.getProperty("/productSet");

            // Get the OData Model object. as this is default 
            // model we pass blank value
            var oOdataModel = this.getView().getModel();
          //  debugger;
          // Call Create or Update based on mode value
            if (this.mode === "CRT") {

            // Trigger post using create and passing
            // entity set name of the backend, payload and call back
            // success and error
            oOdataModel.create("/ProductSet", oPayload, {
                success: function(oSuccess) {
                    MessageToast.show("Product Succesfully created")
                },
                error: function(oError) {
                    // use JSON parse to structure the message
                    MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                }

            })   
        }else{
                debugger;
            // Update call. as this is a PUT call we have tp pass key
            // we can create the path duringc all itself
            oOdataModel.update("/ProductSet('" + oPayload.PRODUCT_ID + "')", oPayload, {
                success: function(oSuccess) {
                    MessageToast.show("Product Succesfully Updated")
                },
                error: function(oError) {
                    // use JSON parse to structure the message
                    MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                }

            })  
        }         
        },

        onClear: function(){
            // Clear text or set the local JSON model
            // Set data / structure to the local model
            this.oLocalModel.setData({
                "productSet":{
                    "PRODUCT_ID" : "",
                    "TYPE_CODE" : "PR",
                    "CATEGORY" : "Notebooks",
                    "NAME" : "",
                    "DESCRIPTION" : "",
                    "SUPPLIER_ID" : "0100000047",
                    "SUPPLIER_NAME" : "Becker Berlin",
                    "PRICE" : "",
                    "CURRENCY_CODE" : "EUR",
                    "DIM_UNIT" : "CM",
                    "PRODUCT_PIC_URL" : "/sap/public/bc/NWDEMO_MODEL/IMAGES/HT-1001.jpg",  
            }              
        });            
            // Update text
            this.getView().byId("idBtnSave").setText("Create");
            that.mode = ("CRT");

        },
        // Global variable mode -- default as create
        mode: "CRT",

        onProdChange: function(oEvent){
            // Step 1: Read the Product Entered by user
            var sProdId = oEvent.getParameter("value");
            var sPath = "/ProductSet" +  "('" + sProdId + "')" ;
            // Step 2: Get the object of oData Model
            var oOdataModel = this.getView().getModel();
            // Step 3: Call the read method of oData Model to get single record
            // Set THIS to THAT to use in callback
            var that = this;
            this.getView().setBusy(true);
                oOdataModel.read(sPath, {
                    // If Success bind the entity set of the local model
                    // wit the data received
                    success: function(oData){
                        that.oLocalModel.setProperty("/productSet", oData);
                        that.getView().setBusy(false);
                        that.getView().byId("idBtnSave").setText("Update");
                        // Update mode value
                        that.mode = ("UPD");
                      //  debugger;
                    },
                    error: function(oError){
                        MessageBox.error(JSON.parse(oError.responseText).error.innererror.errordetails[0].message);
                        that.getView().setBusy(false);
                        that.getView().byId("idBtnSave").setText("Save");
                        that.mode = ("CRT");
                    }
                })                


        }

     });
});