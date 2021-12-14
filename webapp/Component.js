sap.ui.define([
    'sap/ui/core/UIComponent'
], function (UIComponent) {
    'use strict';

    return UIComponent.extend("CoreChange.ABAP.first.Component", {

        metadata: {
            manifest: "json"
        },

        init: function () {
            // Get some additional functionalities from base class into THIS object
            sap.ui.core.UIComponent.prototype.init.apply(this);

            // Step 1: Get the Router object
            var oRouter = this.getRouter();

            // Step 2 : Initialize the Router object
            oRouter.initialize();
        },

        destroy: function () {

        },

        // This will be handled via router
      //   createContent: function () {
       //      // Create our root view
        //     var oAppView = new sap.ui.view({
         //        viewName: "CoreChange.ABAP.first.view.App",
        //         id: "idAppView",
        //         type: "XML"
 //
         //    });

         //    var oView1 = new sap.ui.view({
         //        viewName: "CoreChange.ABAP.first.view.view1",
          //       id: "idView1",
         //        type: "XML"
 //
         //   });
 //
          //   var oView2 = new sap.ui.view({
          //       viewName: "CoreChange.ABAP.first.view.view2",
           //      id: "idView2",
            //     type: "XML"
 //
          //   });

        //     // get the object of the App container
        //     var oAppCont = oAppView.byId("AppCon");
 //
        //     // This was for work list application
       //      //oAppCont.addPage(oView1).addPage(oView2);
 //
       //      // This is for Master Detail floorplan
       //      oAppCont.addMasterPage(oView1).addDetailPage(oView2);
 //
       //      return oAppView;
 //
      //   }

    });
});