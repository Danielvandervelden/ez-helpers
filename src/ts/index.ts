/**
 * 
 * @param { NodeList | HTMLCollection } collection an HTMLCollection/Nodelist of DOM elements.
 * @returns the HTMLCollection as an array.
 */
export const toArray = (collection : HTMLCollection | NodeList) => {
	var arr = [];
	for(var i = collection.length; i--; arr.unshift(collection[i]));
	
	return arr;
}

export const throttle = (callback : Function, timeFrame : Number) => {
  var lastTime = 0;
  return function () {
      var now = Date.now();
      if (now - lastTime >= timeFrame) {
          callback();
          lastTime = now;
      }
  };
}

/**
 * 
 * @param element The element you'd like to put an eventlistener one
 * @param event The event you'd like to listen for
 * @param callback The callback you'd like to be executed when the event occurs
 * @param config Additional config if you need to customize the throttle time between function execution, capture, once, passive or signal option.
 * @returns void
 */
export const addListener = (element : Element, 
							event : string, 
							callback : Function, 
							config = { 
								throttle: 50,
								capture: false,
								once: false,
								passive: false,
								signal: false,
							}) => {
	const validEvents = ["blur", "change", "click", "dblclick", "drag", "dragend", "dragenter", "dragleave",
	"dragover", "dragstart", "drop", "error", "focus", "focusin", "fullscreenchange", "hashchange", "input",
	"keydown", "keypress", "keyup", "load", "loadstart", "mousedown", "mouseenter", "mouseleave", "mousemove",
	"mouseover", "mouseout", "mouseup", "offline", "online", "open", "paste", "pause", "play", "playing", "progress",
	"resize", "reset", "scroll", "search", "select", "storage", "submit", "toggle", "touchcancel", "touchend",
	"touchmove", "touchstart", "transitionend", "unload", "volumechange", "wheel"];


	/** First validate the events to see if they're legit. */
	if(event.split(' ').length === 1 && !validEvents.includes(event)) {
		return new Error(`The event "${event}" you're trying to listen for is currently not supported`);
	} else if(event.split(' ').length > 1) {
		const events = event.split(' ');

		for(let i=0;i<events.length;i++) {
			if(!validEvents.includes(events[i])) {
				return new Error(`The events ${events[i]} you're trying to listen for is currently not supported`);
			}
		}
	}

	
	/** Then set the events and throttle them if they're multiple */
	if(event.split(' ').length === 1) {
		element.addEventListener(event, callback.bind(null), { capture: config.capture, passive: config.passive, once: config.once })
	} else {
		const events = event.split(' ');

		for(let i=0;i<events.length;i++) {
			element.addEventListener(events[i], executeCallback.bind(null), { capture: config.capture, passive: config.passive, once: config.once })
		}
	}

	/** If we have more than one event firing (for example touchend and click) we don't want the function firing
	 * twice on for example tablets that do support both touchend and click. Therefor, we throttle it.
	 */
	let canExecute = true;

	function executeCallback() {
		if(canExecute) {
			callback();
			canExecute = false;
			setTimeout(() => canExecute = true, config.throttle);
		}
	}
}

/**
 * 
 * @param type If the node you're looking for is a child or a parent. Value needs to be "child" or "parent".
 * @param identifier This can be a class, id or attribute selector.
 * @param relativeEl The element you want to start searching from.
 * @param all Would you like to find all of the occurences or return the first one found?
 * @returns Depending on the "all" parameter it will return the Element or an Array of elements.
 */
export const findNode = (type : "child" | "parent", relativeEl: HTMLElement, identifier: string, all: boolean = false) => {
	const validElements = ["a","abbr","acronym","address","applet","area","article","aside","audio","b","base","basefont","bdi","bdo","bgsound","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dir","div","dl","dt","element","em","embed","fieldset","figcaption","figure","font","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","isindex","kbd","keygen","label","legend","li","link","listing","main","map","mark","marquee","menu","menuitem","meta","meter","nav","nobr","noframes","noscript","object","ol","optgroup","option","output","p","param","plaintext","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","tt","u","ul","var","video","wbr","xmp"]
	let typeOfIdentifier : string | null = null;

	if(identifier.match(/^\./)) {
		typeOfIdentifier = 'class';
	} else if(identifier.match(/^\[.+?\]/)) {
		typeOfIdentifier = 'data';
	} else if(validElements.includes(identifier)) {
		typeOfIdentifier = 'node';
	} else if(identifier.match(/^#/)) {
		typeOfIdentifier = 'id';
	}

	if(type !== "child" && type !== "parent") {
		throw new Error(`Type needs to be of type (string) and value "child" or "parent", got (${typeof type}) : ${type} in function findNode()`)
	}

	if(!validElements.includes(relativeEl.nodeName.toLowerCase())) {
		throw new Error(`relativeEl needs to be an HTMLElement, got (${typeof relativeEl}) : ${relativeEl}`)
	}

	if(!typeOfIdentifier) {
		throw new Error('identifier needs to be a class (starts with "."), identifier (starts with "#"), an attribute (encapsulated by"[], or a valid DOM node.")');
	}

	if(typeof all !== 'boolean') {
		throw new Error(`all needs to be of type (boolean) got (${typeof all})`)
	}

	if(identifier.match(/^#/) && all === true) {
		throw new Error(`An "id" can only have a single element returned. Identifier: ${identifier} : Return all: ${all}`)
	}

	if(type === "child") {
		if(all) {
			return toArray(relativeEl.querySelectorAll(identifier));
		} else {
			return relativeEl.querySelector(identifier)
		}
	}

	if(type === "parent") {
		return traverseUpDomTree(relativeEl, identifier, all);
	}

	/** Function to recursively check the parentNode */
	function traverseUpDomTree(element : HTMLElement, identifier : string, all : boolean = false) {
		const returnArray : HTMLElement[] = [];
		let returnElement: HTMLElement | null = null;

		function loop(element: HTMLElement, identifier : string) {
			const parentEl = element.parentNode as HTMLElement;

			if(typeOfIdentifier === "class" && parentEl.classList.contains(identifier.replace('.', '')) ||
				typeOfIdentifier === "id" && parentEl.getAttribute('id') === identifier.replace('#', '') ||
				typeOfIdentifier === "node" && parentEl.nodeName.toLowerCase() === identifier ||
				typeOfIdentifier === "data" && parentEl.getAttribute(identifier.replace(/\[|\]/g, ''))) {

				if(all) {
					returnArray.push(parentEl);
				} else {
					returnElement = parentEl;
				}
			}

			if(element.parentNode && element.parentNode.nodeName.toLowerCase() !== 'body' && all || !returnElement && !all && element.parentNode && element.parentNode.nodeName.toLowerCase() !== 'body') {
				loop(parentEl, identifier);
			}
		}

		loop(element, identifier);

		return all ? returnArray : returnElement;
	}
}