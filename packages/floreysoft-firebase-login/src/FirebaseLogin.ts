import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui'
import 'firebase/auth';
import '../components/Dialog'
import { LitElement, customElement, html, query, TemplateResult } from 'lit-element';
import { Dialog } from '../components/Dialog';

export interface AccountMerger {
    mergeAccounts(anonymousUser: firebase.User, authenticatedUser: firebase.User): Promise<void>
}

@customElement("fs-firebase-login")
export class FirebaseLogin extends LitElement {
    user: firebase.User
    accountMerger: AccountMerger

    @query("fs-dialog")
    private loginDialog: Dialog

    private ui: firebaseui.auth.AuthUI
    private options: Object

    constructor() {
        super()
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
                signInFailure: async (error) => {
                    if (error.code == 'firebaseui/anonymous-upgrade-merge-conflict') {
                        try {
                            let anonymousUser = firebase.auth().currentUser;
                            let user = await firebase.auth().signInAndRetrieveDataWithCredential(error.credential);
                            if (anonymousUser != null && user && user.user) {
                                this.accountMerger.mergeAccounts(anonymousUser, user.user)
                            }
                        } catch (error) {
                            console.error(error)
                        }
                    }
                }
            }
        }
    }

    createRenderRoot() {
        return this
    }

    render() {
        let template : TemplateResult
        if (this.user && !this.user.isAnonymous) {
            let displayName = this.user.displayName
            let photoURL = this.user.photoURL
            if (!displayName) {
                let info = this.user.providerData[0];
                if (info) {
                    displayName = info.displayName;
                    photoURL = info.photoURL
                }
            }
            template = html`${displayName}<img class="photo" src="${photoURL}"/><vaadin-button @click=${this.logout} theme="primary">Logout</vaadin-button>`
        } else {
            template = html`<span>Sign in to save your work -></span> <vaadin-button @click=${this.login} theme="primary">Login</vaadin-button>`
        }
        return html`${template}<fs-dialog header="Login" buttons='[{ "label" : "Close", "id" : "close" }]'><div id="firebaseui-auth-container"></div></fs-dialog>`
    }

    firstUpdated() {
        this.ui = new firebaseui.auth.AuthUI(firebase.auth());
        firebase.auth().onAuthStateChanged(async (user: firebase.User) => {
            this.loginDialog.open = false
            this.user = user
            if (!this.user) {
                await firebase.auth().signInAnonymously()
            } else {
                this.dispatchEvent(new CustomEvent('authStateChanged', { detail: user }))
            }
            this.requestUpdate()
        })
    }

    login() {
        this.ui.reset()
        this.ui.start('#firebaseui-auth-container', this.options)
        this.loginDialog.open = true
    }

    logout() {
        firebase.auth().signOut()
    }
}