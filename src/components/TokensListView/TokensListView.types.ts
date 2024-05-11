export type TokenListHandleType = {
  applySortFilter: (
    obj: any,
    type: 'sorting' | 'filter' | 'clearSorting' | 'clearFilter',
  ) => void;
};
