import { CustomDragEvent, CustomDragSectionEvent } from "./drag";

declare global {
  interface HTMLElementEventMap {
    "drag:start": CustomDragEvent<{}>;
    "drag:enter": CustomDragEvent<{}>;
    "drag:section:enter": CustomDragSectionEvent<{}>;
  }
}

export { };
