function walk(rootNode)
{
    // Find all the text nodes in rootNode
    var walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        null,
        false
    ),
    node;

    // Modify each text node's value
    while (node = walker.nextNode()) {
        handleText(node);
    }
}

function handleText(textNode) {
  textNode.nodeValue = replaceText(textNode.nodeValue);
}

function replaceText(v)
{
   
    var replacements = [
     { realword: 'shit', potentialReplacements: [{ replacement: 'poop' }, { replacement: 'ploppers' }, { replacement: 'crud' }, { replacement: 'manure' }, { replacement: 'number two' }, { replacement: 'sugar' }, ] },
     { realword: 'fuck', potentialReplacements: [{ replacement: 'jeepers' }, { replacement: 'fudge' }, { replacement: 'frig' }, { replacement: 'holy cow' }, { replacement: 'gosh' }, { replacement: 'frack' }, ] },
     { realword: 'cock', potentialReplacements: [{ replacement: 'winky' }, { replacement: 'willy' }, { replacement: 'sausage' }, { replacement: 'donger' }, { replacement: 'shlong' }, ] },
     { realword: 'fucking', potentialReplacements: [{ replacement: 'humping' }, { replacement: 'doing it' }, { replacement: 'bonking' }, { replacement: 'fornicating' }, { replacement: 'copulating' }, { replacement: 'procreating' }, ] },
     { realword: 'piss', potentialReplacements: [{ replacement: 'wee' }, { replacement: 'yellow mellow' }, { replacement: 'golden fountain' }] },
     { realword: 'arse', potentialReplacements: [{ replacement: 'bottom' }, { replacement: 'bum' }, { replacement: 'botty' }, { replacement: 'buttocks' }, { replacement: 'rear' }, { replacement: 'rump' }] },
    ];

    v = v.replace(/\bshit\b/gi, replacements.find(x => x.realword == 'shit').potentialReplacements[Math.floor(Math.random() * Math.floor(6))].replacement);
    v = v.replace(/\bfuck\b/gi, replacements.find(x => x.realword == 'fuck').potentialReplacements[Math.floor(Math.random() * Math.floor(6))].replacement);
    v = v.replace(/\bcock\b/gi, replacements.find(x => x.realword == 'cock').potentialReplacements[Math.floor(Math.random() * Math.floor(5))].replacement);
    v = v.replace(/\bpenis\b/gi, replacements.find(x => x.realword == 'cock').potentialReplacements[Math.floor(Math.random() * Math.floor(5))].replacement);
    v = v.replace(/\bfucking\b/gi, replacements.find(x => x.realword == 'fucking').potentialReplacements[Math.floor(Math.random() * Math.floor(5))].replacement);
    v = v.replace(/\bpiss\b/gi, replacements.find(x => x.realword == 'piss').potentialReplacements[Math.floor(Math.random() * Math.floor(3))].replacement);
    v = v.replace(/\barse\b/gi, replacements.find(x => x.realword == 'arse').potentialReplacements[Math.floor(Math.random() * Math.floor(6))].replacement);
    v = v.replace(/\bass\b/gi, replacements.find(x => x.realword == 'arse').potentialReplacements[Math.floor(Math.random() * Math.floor(6))].replacement);

    return v;
}

// Returns true if a node should *not* be altered in any way
function isForbiddenNode(node) {
    return node.isContentEditable || // DraftJS and many others
    (node.parentNode && node.parentNode.isContentEditable) || // Special case for Gmail
    (node.tagName && (node.tagName.toLowerCase() == "textarea" || // Some catch-alls
                     node.tagName.toLowerCase() == "input"));
}

// The callback used for the document body and title observers
function observerCallback(mutations) {
    var i, node;

    mutations.forEach(function(mutation) {
        for (i = 0; i < mutation.addedNodes.length; i++) {
            node = mutation.addedNodes[i];
            if (isForbiddenNode(node)) {
                // Should never operate on user-editable content
                continue;
            } else if (node.nodeType === 3) {
                // Replace the text for text nodes
                handleText(node);
            } else {
                // Otherwise, find text nodes within the given node and replace text
                walk(node);
            }
        }
    });
}

// Walk the doc (document) body, replace the title, and observe the body and title
function walkAndObserve(doc) {
    var docTitle = doc.getElementsByTagName('title')[0],
    observerConfig = {
        characterData: true,
        childList: true,
        subtree: true
    },
    bodyObserver, titleObserver;

    // Do the initial text replacements in the document body and title
    walk(doc.body);
    doc.title = replaceText(doc.title);

    // Observe the body so that we replace text in any added/modified nodes
    bodyObserver = new MutationObserver(observerCallback);
    bodyObserver.observe(doc.body, observerConfig);

    // Observe the title so we can handle any modifications there
    if (docTitle) {
        titleObserver = new MutationObserver(observerCallback);
        titleObserver.observe(docTitle, observerConfig);
    }
}
walkAndObserve(document);
