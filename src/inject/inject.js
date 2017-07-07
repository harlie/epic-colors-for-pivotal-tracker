chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(handleMutationEvents);
      });

      // configuration of the observer:
      var config = {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true
      };

      observer.observe(document, config);

      var handleMutationEvents = function handleMutationEvents(mutation) {
        Array.prototype.forEach.call(mutation.addedNodes, styleNode);
        styleNode(mutation.target);
      };

      var styleNode = function styleNode(node) {
        if (nodeIsElement(node)) {
          styleLabels(findInNode('a.label.epic', node));
          styleEpicPreviews(findInNode('span.epic_name', node));
        }
      };

      var styleEpicPreviews = function styleEpicPreviews(epics){
        Array.prototype.forEach.call(epics, function(epic) {
          if(epic.parentElement.querySelectorAll('button').length === 0){
            var button = document.createElement("button");
            button.style.width = '1.5em';
            button.style.height = '1.5em';
            button.style.marginLeft = '1em';
            var colorForLabel = getColorForLabel(epic.textContent);
            button.style.backgroundColor = colorForLabel;
            var picker = new jscolor(button, {valueElement: null, onFineChange: function(){ updateLabelColor(picker, epic.textContent)}});
            picker.fromString(colorForLabel);
            epic.parentElement.appendChild(button);
          }
        });

      };

      var nodeIsElement = function nodeIsElement(node) {
        return (typeof node.querySelectorAll !== 'undefined');
      };

      var findInNode = function findInNode(selector, node) {
        return node.querySelectorAll(selector);
      };

      var styleLabels = function styleLabels(labels) {
        Array.prototype.forEach.call(labels, function(label) {
          var labelColor = getColorForLabel(label.textContent);
          label.style.backgroundColor = labelColor;
        });
      }
    }
  }, 10);
});

function updateLabelColor(jscolor, text) {
  colorMap[text] = jscolor.toHEXString();
  setColorMap();
}


function loadColorMap() {
  chrome.storage.sync.get('colorMap', function(items){
    colorMap = items.colorMap || {};
  });
}

function setColorMap() {
  chrome.storage.sync.set({'colorMap': colorMap}, function () {
  });
}

function getColorForLabel(text) {
  var saniText = text.replace(/,\s*$/,'');
  if (!colorMap[saniText]) {
    colorMap[saniText] = "#" + (Math.random()*0xFFFFFF<<0).toString(16);
    setColorMap();
  }

  return colorMap[saniText];
}

var colorMap;
loadColorMap();
