declare class DelayedCalls {
  constructor(batch: () => void);
  changes: Record<string, () => void>;
  promise: Promise<void>;
  addCall(name: string, callback: () => void): Promise<void>;
  handleChanges(): void;
}

export default DelayedCalls;
