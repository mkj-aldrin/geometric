export function getChildIndex(target: HTMLElement) {
  const children = target.parentElement.children;
  let idx = -1;

  for (let i = 0; i < children.length; i++) {
    const el = children[i];
    idx = el == target ? i : idx;
  }

  return idx;
}

export function isDescendentOf(target: HTMLElement, parent: HTMLElement) {
  if (target.parentElement == parent) return true;

  return target == document.documentElement
    ? false
    : isDescendentOf(target.parentElement, parent);
}

export function insertAdjacent(target: HTMLElement, element: HTMLElement) {
  const targetIdx = getChildIndex(target);
  const elementIdx = getChildIndex(element);

  const sameParent = target.parentElement == element.parentElement;

  const possition: InsertPosition =
    targetIdx > elementIdx && sameParent ? "afterend" : "beforebegin";

  target.insertAdjacentElement(possition, element);
}

export function getLike(target: HTMLElement) {
  const childrenLike = target.parentElement.querySelectorAll(target.tagName);
  return childrenLike;
}
