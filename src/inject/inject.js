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
        Array.prototype.forEach.call(mutation.addedNodes, styleLabelsInNode);
        styleLabelsInNode(mutation.target);
      }

      var styleLabelsInNode = function styleLabelsInNode(node) {
        if (nodeIsElement(node)) {
          styleLabels(findLabelsInNode(node));
        }
      }

      var nodeIsElement = function nodeIsElement(node) {
        return (typeof node.querySelectorAll !== 'undefined');
      }

      var findLabelsInNode = function findLabelsInNode(node) {
        return node.querySelectorAll('a.label');
      }

      var styleLabels = function styleLabels(labels) {
        Array.prototype.forEach.call(labels, function(label) {
          if (label.classList.contains('epic')){
            var labelColor = getColorForLabel(label.textContent);
            label.style.backgroundColor = labelColor;
          }
        });
      }
    }
  }, 10);
});


var colorMap;
function getColorForLabel(text) {
  if(!colorMap){
    if (localStorage.colorMap){
      colorMap = JSON.parse(localStorage.colorMap);
    } else {
      colorMap = {};
    }
  }

  var saniText = text.replace(/,\s*$/,'');
  if (!colorMap[saniText]) {
    colorMap[saniText] = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    localStorage.colorMap = JSON.stringify(colorMap);
  }

  return colorMap[saniText];
}
