/// <reference types="react" />
import { IGoogleOneTapLogin } from './types';
import { useGoogleOneTapLogin } from './useGoogleOneTapLogin';
declare function GoogleOneTapLogin({ children, ...props }: IGoogleOneTapLogin): import("react").ReactElement<any, string | ((props: any) => import("react").ReactElement<any, string | any | (new (props: any) => import("react").Component<any, any, any>)> | null) | (new (props: any) => import("react").Component<any, any, any>)> | null;
declare const _default: import("react").MemoExoticComponent<typeof GoogleOneTapLogin>;
export default _default;
export { useGoogleOneTapLogin };
