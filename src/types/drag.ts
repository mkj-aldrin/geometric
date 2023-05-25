export interface DragSection {
  name: string;
  el: HTMLElement;
  nameFilter: string[];
}

interface BaseDragDetail {
  name: string;
  el: HTMLElement;
  sections: Record<string, DragSection>;
}

interface BaseDragSectionDetail {
  nameFilter: string[];
}

export interface CustomDragEvent<T> extends CustomEvent<T & BaseDragDetail> {
  target: HTMLElement;
  currentTarget: HTMLElement;
}

export interface CustomDragSectionEvent<T>
  extends CustomEvent<T & BaseDragDetail & BaseDragSectionDetail> {
  target: HTMLElement;
  currentTarget: HTMLElement;
}
