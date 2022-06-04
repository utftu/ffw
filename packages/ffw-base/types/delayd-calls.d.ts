declare class DelayedCalls {
  constructor(batch: () => void);
  changes: Record<string, () => void>;
  promise: Promise<void>;
  addCall(name: string, callback: () => void): void;
  handleChanges(): void;
}

export default DelayedCalls;
