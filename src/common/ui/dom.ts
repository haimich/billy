
export function preventDragAndDrop(domNode) {
  function prevent(event) {
    event.preventDefault();
    return false;
  }

  domNode.addEventListener('dragover', prevent, false);
  domNode.addEventListener('drop', prevent, false);
}