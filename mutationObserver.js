const dataObserver = new MutationObserver((mutationsList, observer) => {
  for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
          console.log('A child node has been added or removed.');
      } else if (mutation.type === 'attributes') {
          console.log('The ' + mutation.attributeName + ' attribute was modified.');
      } else if (mutation.type === 'characterData') {
          console.log('Character data has been modified.');
      }
  }
});


const targetNode = document.querySelector('.Region_region__6OUBn');
if (targetNode) {
  dataObserver.observe(targetNode, { 
      childList: true, 
      characterData: true, 
      subtree: true 
  });
  console.log("Observer is set up.");
} else {
  console.log("Target node not found");
}
