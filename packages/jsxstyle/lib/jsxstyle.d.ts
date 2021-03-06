import {
  CSSProperties,
  DeprecatedJsxstyleComponentName,
  JsxstyleComponentName,
} from 'jsxstyle-utils';
import * as React from 'react';
declare type IntrinsicElement = keyof JSX.IntrinsicElements;
declare type ValidComponentPropValue =
  | undefined
  | false
  | null
  | IntrinsicElement
  | React.StatelessComponent<any>
  | React.ComponentClass<any>;
/**
 * A silly way of typing an object with no keys.
 *
 * Empty interfaces in TypeScript seem to be unexpectedly funky.
 * This is the predictable alternative.
 */
interface EmptyProps {
  [propName: string]: never;
}
/**
 * Generic that returns either the extracted props type for a React component
 * or the props type for an IntrinsicElement.
 *
 * If a React component has an empty interface specified as its props type,
 * `ExtractProps` will return an `EmptyProps` interface.
 */
declare type ExtractProps<T extends ValidComponentPropValue> = T extends
  | null
  | false
  | undefined
  ? JSX.IntrinsicElements['div']
  : T extends IntrinsicElement
  ? JSX.IntrinsicElements[T]
  : T extends React.StatelessComponent<infer SFCProps>
  ? keyof SFCProps extends never
    ? EmptyProps
    : SFCProps
  : T extends React.ComponentClass<infer ClassProps>
  ? keyof ClassProps extends never
    ? EmptyProps
    : ClassProps
  : EmptyProps;
export { CSSProperties };
/** Shared instance of a style cache object. */
export declare const cache: {
  reset(): void;
  injectOptions(
    options?:
      | {
          onInsertRule?:
            | ((rule: string, props?: {} | undefined) => boolean | void)
            | undefined;
          pretty?: boolean | undefined;
          getClassName?:
            | ((key: string, props?: {} | undefined) => string)
            | undefined;
        }
      | undefined
  ): void;
  getClassName(
    props: Record<string, any>,
    classNameProp?: string | false | null | undefined
  ): string | null;
};
/** Props that will be passed through to whatever component is specified */
export interface StylableComponentProps {
  /** passed as-is through to the underlying component */
  className?: string | null | false;
  /** passed as-is through to the underlying component */
  style?: React.CSSProperties | null | false;
}
/** Common props */
interface SharedProps extends StylableComponentProps, CSSProperties {
  /** An object of media query values keyed by the desired style prop prefix */
  mediaQueries?: Record<string, string>;
}
/** Props for jsxstyle components that have a `component` prop set */
interface JsxstylePropsWithComponent<C extends ValidComponentPropValue>
  extends SharedProps {
  /** Component value can be either a React component or a tag name string. Defaults to `div`. */
  component: C;
  /** Object of props that will be passed down to the component specified in the `component` prop */
  props?: ExtractProps<C>;
}
/** Props for jsxstyle components that have no `component` prop set */
interface JsxstyleDefaultProps extends SharedProps {
  /** Component value can be either a React component or a tag name string. Defaults to `div`. */
  component?: undefined;
  /** Object of props that will be passed down to the underlying div */
  props?: JSX.IntrinsicElements['div'];
}
export declare type JsxstyleProps<C extends ValidComponentPropValue> =
  | JsxstyleDefaultProps
  | JsxstylePropsWithComponent<C>;
interface JsxstyleComponentState {
  className: string | null;
}
declare function factory(
  displayName: JsxstyleComponentName
): {
  new <T extends ValidComponentPropValue>(props: JsxstyleProps<T>): {
    render(): JSX.Element;
    setState<K extends 'className'>(
      state:
        | JsxstyleComponentState
        | ((
            prevState: Readonly<JsxstyleComponentState>,
            props:
              | Readonly<JsxstyleDefaultProps>
              | Readonly<JsxstylePropsWithComponent<T>>
          ) => JsxstyleComponentState | Pick<JsxstyleComponentState, K> | null)
        | Pick<JsxstyleComponentState, K>
        | null,
      callback?: (() => void) | undefined
    ): void;
    forceUpdate(callBack?: (() => void) | undefined): void;
    readonly props:
      | (Readonly<{
          children?: React.ReactNode;
        }> &
          Readonly<JsxstyleDefaultProps>)
      | (Readonly<{
          children?: React.ReactNode;
        }> &
          Readonly<JsxstylePropsWithComponent<T>>);
    state: Readonly<JsxstyleComponentState>;
    context: any;
    refs: {
      [key: string]: React.ReactInstance;
    };
  };
  defaultProps: Pick<CSSProperties, 'display' | 'flexDirection'> | null;
  displayName: JsxstyleComponentName;
  getDerivedStateFromProps: (
    props: any
  ) => {
    className: string | null;
  };
};
declare function depFactory(
  displayName: DeprecatedJsxstyleComponentName
): {
  new <T extends ValidComponentPropValue>(props: JsxstyleProps<T>): {
    render(): JSX.Element;
    setState<K extends never>(
      state:
        | {}
        | ((
            prevState: Readonly<{}>,
            props:
              | Readonly<JsxstyleDefaultProps>
              | Readonly<JsxstylePropsWithComponent<T>>
          ) => {} | Pick<{}, K> | null)
        | Pick<{}, K>
        | null,
      callback?: (() => void) | undefined
    ): void;
    forceUpdate(callBack?: (() => void) | undefined): void;
    readonly props:
      | (Readonly<{
          children?: React.ReactNode;
        }> &
          Readonly<JsxstyleDefaultProps>)
      | (Readonly<{
          children?: React.ReactNode;
        }> &
          Readonly<JsxstylePropsWithComponent<T>>);
    state: Readonly<{}>;
    context: any;
    refs: {
      [key: string]: React.ReactInstance;
    };
  };
  displayName: DeprecatedJsxstyleComponentName;
  defaultProps: Pick<CSSProperties, 'display' | 'flexDirection'> | null;
};
declare type JsxstyleComponent = ReturnType<typeof factory>;
declare type DeprecatedJsxstyleComponent = ReturnType<typeof depFactory>;
export declare const Box: JsxstyleComponent;
export declare const Block: JsxstyleComponent;
export declare const Inline: JsxstyleComponent;
export declare const InlineBlock: JsxstyleComponent;
export declare const Row: JsxstyleComponent;
export declare const Col: JsxstyleComponent;
export declare const InlineRow: JsxstyleComponent;
export declare const InlineCol: JsxstyleComponent;
export declare const Grid: JsxstyleComponent;
export declare const Table: DeprecatedJsxstyleComponent;
export declare const TableRow: DeprecatedJsxstyleComponent;
export declare const TableCell: DeprecatedJsxstyleComponent;
export declare const Flex: DeprecatedJsxstyleComponent;
export declare const InlineFlex: DeprecatedJsxstyleComponent;
//# sourceMappingURL=jsxstyle.d.ts.map
