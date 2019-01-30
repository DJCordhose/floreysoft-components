var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import 'firebase/auth';
import { LitElement, customElement, html, query } from 'lit-element';
let FirebaseLogin = class FirebaseLogin extends LitElement {
    constructor() {
        super();
        this.options = {
            autoUpgradeAnonymousUsers: true,
            signInFlow: 'popup',
            signInSuccessUrl: window.location.href,
            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                firebase.auth.GithubAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID
                /*
                firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                */
            ],
            callbacks: {
                signInFailure: (error) => __awaiter(this, void 0, void 0, function* () {
                    if (error.code == 'firebaseui/anonymous-upgrade-merge-conflict') {
                        try {
                            let anonymousUser = firebase.auth().currentUser;
                            let user = yield firebase.auth().signInAndRetrieveDataWithCredential(error.credential);
                            if (anonymousUser != null && user && user.user) {
                                this.accountMerger.mergeAccounts(anonymousUser, user.user);
                            }
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                })
            }
        };
    }
    createRenderRoot() {
        return this;
    }
    render() {
        let template;
        if (this.user && !this.user.isAnonymous) {
            let displayName = this.user.displayName;
            let photoURL = this.user.photoURL;
            if (!displayName) {
                let info = this.user.providerData[0];
                if (info) {
                    displayName = info.displayName;
                    photoURL = info.photoURL;
                }
            }
            template = html `${displayName}<img class="photo" src="${photoURL}"/><vaadin-button @click=${this.logout} theme="primary">Logout</vaadin-button>`;
        }
        else {
            template = html `<span>Sign in to save your work -></span> <vaadin-button @click=${this.login} theme="primary">Login</vaadin-button>`;
        }
        return html `${template}<fs-dialog header="Login" buttons='[{ "label" : "Close", "id" : "close" }]'><div id="firebaseui-auth-container"></div></fs-dialog>`;
    }
    firstUpdated() {
        this.ui = new firebaseui.auth.AuthUI(firebase.auth());
        firebase.auth().onAuthStateChanged((user) => __awaiter(this, void 0, void 0, function* () {
            this.loginDialog.open = false;
            this.user = user;
            if (!this.user) {
                yield firebase.auth().signInAnonymously();
            }
            else {
                this.dispatchEvent(new CustomEvent('authStateChanged', { detail: user }));
            }
            this.requestUpdate();
        }));
    }
    login() {
        this.ui.reset();
        this.ui.start('#firebaseui-auth-container', this.options);
        this.loginDialog.open = true;
    }
    logout() {
        firebase.auth().signOut();
    }
};
__decorate([
    query("fs-dialog")
], FirebaseLogin.prototype, "loginDialog", void 0);
FirebaseLogin = __decorate([
    customElement("fs-firebase-login")
], FirebaseLogin);
export { FirebaseLogin };
//# sourceMappingURL=FirebaseLogin.js.map