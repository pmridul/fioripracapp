sap.ui.define([
    'CoreChange/ABAP/first/controller/baseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast'
], function(baseController, MessageBox, MessageToast) {
    'use strict';

    return baseController.extend("CoreChange.ABAP.first.controller.supplier", {

        onInit: function () {
            // Define the router object
            this.oRouter = this.getOwnerComponent().getRouter();

            // this will ensure that this statement is triggred when detail data is called
            // this will call the event matched and call function binddata and attach to this
            // this is the method SAP uses in thier std code
           // this.oRouter.getRoute("supplierdata").attachMatched(this.supplBindData, this)

            // we can also use below alternate. Disadvantage is it will be triggered
            // for every route, but it will work
            this.oRouter.attachRouteMatched(this.supplBindData, this);
        },    
        
        supplBindData: function(oEvent){
            debugger;

            var sIndex = oEvent.getParameter("arguments").supplIndex;
            var sPath = "/suppliers/" + sIndex;
            this.getView().bindElement(sPath);

        }
    });
});