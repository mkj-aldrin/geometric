import {
  attachDragEmitter,
  attachDragRoot,
  attachDragSection,
} from "./drag/emitter";
import { getChildIndex, insertAdjacent } from "./tools/dom";

const initArr = [
  {
    modules: [
      {
        type: "PTH",
      },
      {
        type: "PRO",
      },
      {
        type: "LFO",
      },
      {
        type: "BCH",
      },
    ],
  },
  {
    modules: [
      {
        type: "LFO",
      },
      {
        type: "PTH",
      },
      {
        type: "PRO",
      },
      {
        type: "BCH",
      },
    ],
  },
];

const rootEl = document.createElement("x-root");
const cListEl = document.createElement("x-list");
rootEl.appendChild(cListEl);

const dragRoot = attachDragRoot(rootEl);

dragRoot.consider = (state) => {
  switch (state.type) {
    case "emitter":
      insertAdjacent(state.entered.el, state.dragged.el);
      break;
    case "section":
      state.entered.el.querySelector("x-list").appendChild(state.dragged.el);
      break;
  }
};

dragRoot.finish = (state) => {
  console.log(state);
};

document.body.appendChild(rootEl);

initArr.forEach((c) => {
  const cEl = document.createElement("x-chain");

  attachDragSection(cEl, {
    name: "chain",
    nameFilter: ["module"],
  });

  const mListEl = document.createElement("x-list");
  mListEl.dataset.flex = "vertical";

  cEl.appendChild(mListEl);

  c.modules.forEach((m) => {
    const mEl = document.createElement("x-module");
    mEl.innerHTML = `
    <span>${m.type}</span>
    `;

    attachDragEmitter(mEl, { name: "module" });
    mListEl.appendChild(mEl);
  });

  cListEl.appendChild(cEl);
});
