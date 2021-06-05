
/*
   Attach logging to liveexaple activities.

   Send logging messages to Revel logging service in the top window.
   This follows the same logging strategy used by the Pearson 
   Smart Media Player.

   Mouseover activity like in 
       liveexample/dsanimation/Figure14_32.html
   is not logged.

   The biggest thing missing is logging for student entries,
   usually in a text box, that is evaluated for correctness.
   In this case, the log message should include what the student 
   entered, as well as the evaluation of that entry (correct/incorrect
   and error type).  There should not be a separate log message for
   the associated button click.
*/
function addLogging(){

    // Draggable activities
    // These use jQuery, and jQueryUI
    document.addEventListener('load', function(){
        // See wordmatch/event.js
        if('drag' in document){
            console.log("*** draggable logging not done, yet");
        }
    });


    /*
      Click events for buttons and links

      This produces sufficient logging for codeanimation and
      dsanimation (except for mouseover).
    */
    function clickMessage(evt) {
        console.log("**** click:", evt.target);
        var el = evt.target;
        if(el.tagName == 'BUTTON' ||
           (el.tagName == 'INPUT' &&
            el.getAttribute("type").toLowerCase() == "button")){
            postMessage({
                action: 'buttonClick',
                label: el.getAttribute("id") ||
                    /*
                      Handle missing id.
                      For example: liveexample/dsanimation/AVLTree.html
                    */
                (el.tagName == 'BUTTON' ? el.innerHTML : null)
            });
        } else if(el.tagName == 'INPUT' && el.getAttribute("type").toLowerCase() == "submit") {
            postMessage({
                action: 'submitButtonClick',
                label: el.getAttribute("name") || el.innerHTML             
            });
        } else if(el.tagName == 'INPUT' && el.getAttribute("type").toLowerCase() == "radio") {
            postMessage({
                action: 'radioButtonClick',
                label: el.getAttribute("value") 
            });
        } else if(el.tagName == 'A') {
            postMessage({
                action: 'linkClick',
                label: el.getAttribute("href") 
            });
        }
    }
    document.addEventListener('click', clickMessage);


    /*
       The messages should have the same format as 
       http://sequence-player.pearsoned.com/live-iframe.js
    */
    // special debugging code.
    var beep = null;
    if(false && window.location.hostname == "sequence-player.pearsoned.com"){
        beep = new Audio("//sequence-player.pearsoned.com/liveexample/click_x.wav");
    }
    function postMessage(message){
        message.category = "liveexample";
        // Append iframe URL
        message.iframeUrl = document.URL;;
        var jsonMsg = {
            "type": "pxe",
            // I get an error if this is not included.
            "method": "unknown-method",
            "msgOrigin": "liveexampleActivity",
            "message": message
        };
        console.log("**** Send Message:" + JSON.stringify(jsonMsg));

        // Detect if this is an iframe or a separate page
        var target = null;
        if(window.top === window.self) {
            if(window.opener) {
                // window.opener is the PXE reader.
                target = window.opener.top;
                if(beep)beep.play();
            } else {
                console.warn("**** Missing opener: not able to send message.");
                return;
            }
        } else {
            // iframe
            target = window.top;
        }
        target.postMessage(JSON.stringify(jsonMsg), "*");
    }

    /*
      If this is its own window, log visibility changes.
      This is almose identical to the code in live-iframe.js
    */
    if(window.top === window.self) {

        // Detect visibility change in supported browsers.
        function visibilityChange(evt){
            postMessage({
                action: "pageVisibility",
                label: document.hidden?"hidden":"visible"
            });
        }
        if('hidden' in document){
            document.addEventListener('visibilitychange', visibilityChange);
        } else {
            postMessage({
                action: "pageVisibility",
                label: "unknownVisibility"
            }); 
            console.warn("**** live-iframe:  no visibility method available");
        }

        window.addEventListener('focus', function() {
            postMessage({
                action: "pageVisibility",
                label: "focus"
            });
        });
        window.addEventListener('blur', function() {
            postMessage({
                action: "pageVisibility",
                label: "blur"
            });
        });
        window.addEventListener('unload', function() {
            postMessage({
                action: "pageVisibility",
                label: "unload"
            });
        });
        if(document.readyState == 'complete'){
            postMessage({
                action: "pageVisibility",
                label: "load"
            });
        } else {
            window.addEventListener('load', function() {
                postMessage({
                    action: "pageVisibility",
                    label: "load"
                });
            });
        }
    }
}

if(document.readyState == 'loading') {
    document.addEventListener("DOMContentLoaded", addLogging);
} else {
    addLogging();
}
