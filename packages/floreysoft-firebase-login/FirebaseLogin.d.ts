import * as firebase from 'firebase/app';
import 'firebase/auth';
import { LitElement, TemplateResult } from 'lit-element';
export interface AccountMerger {
    mergeAccounts(anonymousUser: firebase.User, authenticatedUser: firebase.User): Promise<void>;
}
export declare class FirebaseLogin extends LitElement {
    user: firebase.User;
    accountMerger: AccountMerger;
    private loginDialog;
    private ui;
    private options;
    constructor();
    createRenderRoot(): this;
    render(): TemplateResult;
    firstUpdated(): void;
    login(): void;
    logout(): void;
}
//# sourceMappingURL=FirebaseLogin.d.ts.map