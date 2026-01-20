export default class projectReducerType<T> {
  allBatches: { data: T; error: string | null; loading: boolean };
  allBatchesLoad: boolean;

  allBatchInfo: { data: T; error: string | null; loading: boolean };
  allBatchInfoLoading: boolean;

  constructor(initialData: T) {
    this.allBatches = { data: initialData, error: null, loading: false };
    this.allBatchesLoad = false;
    this.allBatchInfo = { data: initialData, error: null, loading: false };
    this.allBatchInfoLoading = false;
  }
}
