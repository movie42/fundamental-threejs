const $ = document;

function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options?: ElementCreationOptions
): HTMLElementTagNameMap[K] {
  return $.createElement(tagName, options);
}

function getElement<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return $.getElementById(id) as T | null;
}

function appendElement<T extends HTMLElement, N extends HTMLElement>(
  element: T | null,
  newElement: N | null
) {
  if (!element || !newElement) {
    return;
  }
  element.appendChild(newElement);
}

export { appendElement, createElement, getElement };
