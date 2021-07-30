import { useState, useEffect, memo } from 'react';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

// https://usehooks.com/useScript/
function useScript(src) {
    // Keep track of script status ("idle", "loading", "ready", "error")
    var _a = useState(src ? 'loading' : 'idle'), status = _a[0], setStatus = _a[1];
    useEffect(function () {
        // Allow falsy src value if waiting on other data needed for
        // constructing the script URL passed to this hook.
        if (!src) {
            setStatus('idle');
            return;
        }
        // Fetch existing script element by src
        // It may have been added by another intance of this hook
        var script = document.querySelector("script[src=\"" + src + "\"]");
        if (!script) {
            // Create script
            script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.setAttribute('data-status', 'loading');
            // Add script to document body
            document.body.appendChild(script);
            // Store status in attribute on script
            // This can be read by other instances of this hook
            var setAttributeFromEvent = function (event) {
                !!script &&
                    script.setAttribute('data-status', event.type === 'load' ? 'ready' : 'error');
            };
            script.addEventListener('load', setAttributeFromEvent);
            script.addEventListener('error', setAttributeFromEvent);
        }
        else {
            // Grab existing script status from attribute and set to state.
            setStatus(script.getAttribute('data-status') || 'idle');
        }
        // Script event handler to update status in state
        // Note: Even if the script already exists we still need to add
        // event handlers to update the state for *this* hook instance.
        var setStateFromEvent = function (event) {
            setStatus(event.type === 'load' ? 'ready' : 'error');
        };
        // Add event listeners
        script.addEventListener('load', setStateFromEvent);
        script.addEventListener('error', setStateFromEvent);
        // Remove event listeners on cleanup
        return function () {
            if (script) {
                script.removeEventListener('load', setStateFromEvent);
                script.removeEventListener('error', setStateFromEvent);
            }
        };
    }, [src]);
    return status;
}

var scriptFlag = '__googleOneTapScript__';
var googleClientScriptURL = 'https://accounts.google.com/gsi/client';
var oauthEndpointURL = 'https://oauth2.googleapis.com/tokeninfo?id_token=';
function callback(_a) {
    var data = _a.data, onError = _a.onError, onSuccess = _a.onSuccess;
    var decodeToken = _a.decodeToken === null || _a.decodeToken === undefined
        ? true
        : _a.decodeToken;
    if (data === null || data === void 0 ? void 0 : data.credential) {
        if (decodeToken) {
            fetch("" + oauthEndpointURL + data.credential)
                .then(function (resp) {
                if ((resp === null || resp === void 0 ? void 0 : resp.status) === 200 && (resp === null || resp === void 0 ? void 0 : resp.json)) {
                    return resp.json();
                }
                else {
                    if (onError) {
                        onError();
                    }
                    throw new Error('Something went wrong');
                }
            })
                .then(function (resp) {
                if (onSuccess) {
                    onSuccess(resp);
                }
            })
                .catch(function (error) {
                if (onError) {
                    onError(error);
                }
                throw error;
            });
        } else if (onSuccess) onSuccess(data.credential)
    }
}
function useGoogleOneTapLogin(_a) {
    var onError = _a.onError, disabled = _a.disabled, onSuccess = _a.onSuccess, onMoment = _a.onMoment, googleAccountConfigs = _a.googleAccountConfigs;
    var script = useScript(googleClientScriptURL);
    var momentCallback = function({ g, h, j }) {
        if (onMoment && typeof onMoment === 'function') {
            onMoment(g, h, j);
        }
    }
    useEffect(function () {
        if (!(window === null || window === void 0 ? void 0 : window[scriptFlag]) && window.google && script === 'ready') {
            window.google.accounts.id.initialize(__assign(__assign({}, googleAccountConfigs), { callback: function (data) {
                    return callback({ data: data, onError: onError, onSuccess: onSuccess, decodeToken: _a.decodeToken });
                } }));
            window[scriptFlag] = true;
        }
        if ((window === null || window === void 0 ? void 0 : window[scriptFlag]) && script === 'ready' && !disabled) {
            window.google.accounts.id.prompt(momentCallback);
        }
    }, [script, window === null || window === void 0 ? void 0 : window[scriptFlag], disabled]);
    return null;
}

function GoogleOneTapLogin(_a) {
    var _b = _a.children, children = _b === void 0 ? null : _b, props = __rest(_a, ["children"]);
    useGoogleOneTapLogin(props);
    return children;
}
var index = memo(GoogleOneTapLogin);

export default index;
export { useGoogleOneTapLogin };
//# sourceMappingURL=index.es5.js.map
