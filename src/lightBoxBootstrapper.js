import LightBox from "./lightBox";


(function() {
    "use strict";
    if (typeof window.LightBox === "undefined")
    {
        window.LightBox = LightBox();
    }
})(window.LightBox || {});

