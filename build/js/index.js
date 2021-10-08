/**
 *
 * @param { NodeList | HTMLCollection } collection an HTMLCollection/Nodelist of DOM elements.
 * @returns the HTMLCollection as an array.
 */
export var toArray = function (collection) {
    var arr = [];
    for (var i = collection.length; i--; arr.unshift(collection[i]))
        ;
    return arr;
};
export var throttle = function (callback, timeFrame) {
    var lastTime = 0;
    return function () {
        var now = Date.now();
        if (now - lastTime >= timeFrame) {
            callback();
            lastTime = now;
        }
    };
};
/**
 *
 * @param element The element you'd like to put an eventlistener one
 * @param event The event you'd like to listen for
 * @param callback The callback you'd like to be executed when the event occurs
 * @param config Additional config if you need to customize the throttle time between function execution, capture, once, passive or signal option.
 * @returns void
 */
export var addListener = function (element, event, callback, config) {
    if (config === void 0) { config = {
        throttle: 50,
        capture: false,
        once: false,
        passive: false,
        signal: false,
    }; }
    var validEvents = ["blur", "change", "click", "dblclick", "drag", "dragend", "dragenter", "dragleave",
        "dragover", "dragstart", "drop", "error", "focus", "focusin", "fullscreenchange", "hashchange", "input",
        "keydown", "keypress", "keyup", "load", "loadstart", "mousedown", "mouseenter", "mouseleave", "mousemove",
        "mouseover", "mouseout", "mouseup", "offline", "online", "open", "paste", "pause", "play", "playing", "progress",
        "resize", "reset", "scroll", "search", "select", "storage", "submit", "toggle", "touchcancel", "touchend",
        "touchmove", "touchstart", "transitionend", "unload", "volumechange", "wheel"];
    /** First validate the events to see if they're legit. */
    if (event.split(' ').length === 1 && !validEvents.includes(event)) {
        return console.error("The event \"" + event + "\" you're trying to listen for is currently not supported");
    }
    else if (event.split(' ').length > 1) {
        var events = event.split(' ');
        for (var i = 0; i < events.length; i++) {
            if (!validEvents.includes(events[i])) {
                return console.error("The events " + events[i] + " you're trying to listen for is currently not supported");
            }
        }
    }
    /** Then set the events and throttle them if they're multiple */
    if (event.split(' ').length === 1) {
        element.addEventListener(event, callback.bind(null), { capture: config.capture, passive: config.passive, once: config.once });
    }
    else {
        var events = event.split(' ');
        for (var i = 0; i < events.length; i++) {
            element.addEventListener(events[i], executeCallback.bind(null), { capture: config.capture, passive: config.passive, once: config.once });
        }
    }
    /** If we have more than one event firing (for example touchend and click) we don't want the function firing
     * twice on for example tablets that do support both touchend and click. Therefor, we throttle it.
     */
    var canExecute = true;
    function executeCallback() {
        if (canExecute) {
            callback();
            canExecute = false;
            setTimeout(function () { return canExecute = true; }, config.throttle);
        }
    }
};
