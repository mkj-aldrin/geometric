import { debounce } from "../tools/timing";
import {
  CustomDragEvent,
  CustomDragSectionEvent,
  DragSection,
} from "../types/drag";

type HTMLPointerEvent = PointerEvent & {
  target: HTMLElement;
  currentTarget: HTMLElement;
};

interface EmitterOpt {
  name: string;
  emitOnEnter?: boolean;
}

// ELEMENT EMITTER - - - - - - - - - - - - - -
export function attachDragEmitter(target: HTMLElement, opt: EmitterOpt) {
  const { name, emitOnEnter } = { ...opt, emitOnEnter: true };

  target.addEventListener("pointerdown", (e: HTMLPointerEvent) => {
    target.dispatchEvent(
      new CustomEvent("drag:start", {
        bubbles: true,
        detail: {
          name,
          el: target,
          sections: {},
        },
      }) as CustomDragEvent<{}>
    );
  });

  if (emitOnEnter) {
    target.addEventListener("pointerenter", (e: HTMLPointerEvent) => {
      target.dispatchEvent(
        new CustomEvent("drag:enter", {
          bubbles: true,
          detail: {
            name,
            el: target,
            sections: {},
          },
        }) as CustomDragEvent<{}>
      );
    });
  }
}

interface SectionOpt {
  name: string;
  nameFilter: string[];
}

// SECTION HANDLER - - - - - - - - - - - - - -
export function attachDragSection(target: HTMLElement, opt: SectionOpt) {
  const { name, nameFilter } = { ...opt };

  function sectionDragHandler(e: CustomDragEvent<{}>) {
    if (e.target == e.currentTarget) return;

    e.detail.sections[opt.name] = {
      name,
      el: target,
      nameFilter,
    };
  }

  target.addEventListener("drag:start", sectionDragHandler);
  target.addEventListener("drag:enter", sectionDragHandler);

  target.addEventListener("drag:section:enter", sectionDragHandler);

  target.addEventListener("pointerenter", (e: HTMLPointerEvent) => {
    target.dispatchEvent(
      new CustomEvent("drag:section:enter", {
        bubbles: true,
        detail: {
          el: target,
          name,
          nameFilter,
          sections: {},
        },
      }) as CustomDragSectionEvent<{}>
    );
  });
}

interface DragState {
  type: "emitter" | "section";
  dragged: {
    el: HTMLElement | null;
    name: string | null;
    sections: Record<string, DragSection>;
  };
  entered: {
    el: HTMLElement | null;
    name: string | null;
    sections: Record<string, DragSection>;
  };
}

interface _DragState {
  type: "emitter" | "section";
  dragged: {
    el: HTMLElement;
    name: string;
    sections: Record<string, DragSection>;
  };
  entered: {
    el: HTMLElement;
    name: string;
    sections: Record<string, DragSection>;
  };
}

interface DragHandlers {
  consider: (state: _DragState) => void;
  finish: (stage: _DragState) => void;
}

// ROOT - - - - - - - - - - - - - -
export function attachDragRoot(target: HTMLElement): DragHandlers {
  const sectionDebounce = debounce();

  let dragstate: DragState = {
    type: "emitter",
    dragged: {
      el: null,
      name: null,
      sections: {},
    },
    entered: {
      el: null,
      name: null,
      sections: {},
    },
  };

  const handlers: DragHandlers = {
    consider: () => null,
    finish: () => null,
  };

  // START - - - - - - - - - - - - - -
  target.addEventListener("drag:start", (e) => {
    sectionDebounce.clear();

    const { el, name, sections } = e.detail;

    dragstate.dragged = { el, name, sections };

    dragstate.dragged.el.setAttribute("data-drag-dragged", "true");
  });

  // ENTER - - - - - - - - - - - - - -
  target.addEventListener("drag:enter", (e) => {
    sectionDebounce.clear();

    const { el, name, sections } = e.detail;

    if (!dragstate.dragged.el) return;

    if (!dragstate.dragged) return;
    if (dragstate.dragged.el == el) return;
    if (name != dragstate.dragged?.name) return;

    dragstate.type = "emitter";
    dragstate.entered = { el, name, sections };

    //@ts-ignore
    handlers.consider({ ...dragstate });
  });

  // SECTION ENTER - - - - - - - - - - - - - -
  target.addEventListener("drag:section:enter", (e) => {
    const { el, name, sections, nameFilter } = e.detail;

    if (!dragstate.dragged.el) return;
    if (!nameFilter.some((n) => n == dragstate.dragged?.name)) return;

    dragstate.type = "section";
    dragstate.entered = { el, name, sections };

    //@ts-ignore
    sectionDebounce.run(() => handlers.consider({ ...dragstate }), 75);
  });

  // END - - - - - - - - - - - - - -
  function endHandler(e: HTMLPointerEvent) {
    sectionDebounce.clear();

    if (!dragstate.dragged.el) return;

    dragstate.dragged.el.removeAttribute("data-drag-dragged");

    if (dragstate.entered.el) {
      //@ts-ignore
      handlers.finish({ ...dragstate });
    }

    dragstate = {
      type: "emitter",
      dragged: {
        el: null,
        name: null,
        sections: {},
      },
      entered: {
        el: null,
        name: null,
        sections: {},
      },
    };
  }

  target.addEventListener("pointerleave", endHandler);
  target.addEventListener("pointerup", endHandler);

  return {
    set consider(handler: Handler) {
      handlers.consider = handler;
    },
    set finish(handler: Handler) {
      handlers.finish = handler;
    },
  };
}

type Handler = (state: _DragState) => void;
