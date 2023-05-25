export function debounce() {
  let tidx: number;
  return {
    run: (fn: () => void, window: number) => {
      tidx = setTimeout(() => {
        fn();
      }, window);
    },
    clear: () => clearTimeout(tidx),
  };
}
