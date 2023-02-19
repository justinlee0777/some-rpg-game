/**
 * When called, should invoke a UI change.
 * The change does not need to return anything, only needs to denote the change is completed.
 */
export interface Animation {
    (): Promise<void>;
}
