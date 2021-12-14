sap.ui.define([
], function() {
    'use strict';
    return{

        convertStatus: function(vstatus){
			if (vstatus === "Available") {
				return "Success";
			} else if (vstatus === "Out of Stock") {
				return "Warning";
			} else if (vstatus === "Discontinued"){
				return "Error";
			} else {
				return "None";
			}
        }
    }    
});