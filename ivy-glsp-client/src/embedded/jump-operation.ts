import { Operation } from '@eclipse-glsp/client';

export class JumpOperation implements Operation {
    static readonly KIND = 'jumpInto';

    constructor(public readonly elementId: string,
        public readonly kind: string = JumpOperation.KIND) { }
}
