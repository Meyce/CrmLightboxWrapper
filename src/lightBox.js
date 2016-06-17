export default function LightBox() {
    "use strict";


    let _dialogHeight = 225;
    let _dialogWidth = 400;

    let tryShowDialog = function(url, width, height, callback) {
        "use strict";

        let dWidth = width || _dialogWidth;
        let dHeight = height || _dialogHeight;

        let isOpened = false;
        let dialogwindow = null;
        let isLightbox = false;

        try {
            let Mscrm = Mscrm && Mscrm.CrmDialog && Mscrm.CrmUri && Mscrm.CrmUri.create ? Mscrm : parent.Mscrm;
            if (Mscrm && Mscrm.CrmDialog && Mscrm.CrmUri && Mscrm.CrmUri.create) {
                let crmUrl = Mscrm.CrmUri.create(url);
                dialogwindow = new Mscrm.CrmDialog(crmUrl, window, dWidth, dHeight);

                if (callback)
                {
                    dialogwindow.setCallbackReference({
                        context: {},
                        callback: callback
                    });
                }

                // Open the lightbox
                dialogwindow.show();
                isOpened = true;
                isLightbox = true;
            }
        } catch(e) {
            console.log(e);
        }

        return new LightboxDialog(dialogwindow, isOpened, isLightbox);
    };

    function LightboxDialog(dialogWindow, isOpened, isLightBox) {
        let self = this;

        self.IsOpened = isOpened;
        self.DialogWindow = dialogWindow;
        self.IsLightbox = isLightBox;

        self.close = function() {
            if (self.DialogWindow && self.IsLightbox) {
                self.DialogWindow.close();
            } else {
                window.close();
            }
        }

    }


    let showAlertDialog = function(title, message, buttons, icon, width, height, callback) {
        let dWidth = width || _dialogWidth;
        let dHeight = height || _dialogHeight;
        let dButtons = buttons || [{
                label: "OK"
            }];

        let queryStrings = "title=" + (title || "") + "&message=" + (message || "") + "&icon=" + (icon || "");
        for (var i = 0; i < dButtons.length; i++) {
            queryStrings += "&buttons[]=" + buttons[i].label;
        }

        var url = "/webresources/dpt_/modules/lightBox/alert/alertDialog.html?Data=" + encodeURIComponent(queryStrings);

        // Our web resource handles the callback functions since they can be different for each button
        let tryShow = tryShowDialog(url, dWidth, dHeight, callback);

        if (tryShow.IsOpened) {
            //no dialog is return, the callbacks should supply what needs to be executed and close will
            //be called afterward
            return;
        }
        else {
            // If all else fails, display an error occurred message
            if (Xrm && Xrm.Utility && Xrm.Utility.alertDialog) {
                Xrm.Utility.alertDialog("An error has occurred while generating this message. Please contact your CRM Administrator.");
            }
            else {
                alert("An error has occurred while generating this message. Please contact your CRM Administrator.");
            }
        }
    };

    //convenience method to show a busy dialog
    let showBusyDialog = function(width, height, callback) {
        var url = "/webresources/dpt_/modules/lightBox/busy/busyDialog.html";
        return tryShowDialog(url, width, height, callback);
    };
    
    let showWebResourceDialog = function(width, height, url, callback){
        //return an instance of the dialog so the caller can close if they choose to
        return tryShowDialog(url, width, height, callback);
    };

    let alertType = {
        Info: "INFO",
        Warning: "WARNING",
        Error: "ERROR",
        Question: "QUESTION",
        Success: "SUCCESS"
    };


    return {
        showAlert: showAlertDialog,
        showBusy: showBusyDialog,
        showWebResource: showWebResourceDialog,
        Alert: {
            alertType: alertType
        }

    };
}
