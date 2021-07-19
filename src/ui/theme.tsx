import {
    CreateCSSProperties,
    CSSProperties,
    makeStyles,
    PropsFunc
} from "@material-ui/styles";
import React from "react";

export const colors = {
    primary: "#19aeff",
    dark: "#005c94",
    text: "#ffffff",
    neutral: "#cccccc"
};

export function addPropsClassName<P extends { className?: string }>(
    base: string,
    props: P
) {
    return {
        ...props,
        className: base + (props.className ? " " + props.className : "")
    };
}

type BaseStyledComponentProps = { className?: string };
type StyledComponentConstraint =
    | keyof JSX.IntrinsicElements
    | React.ElementType<BaseStyledComponentProps>;

export function styled<
    AdditionalProps extends {} = {},
    // This shouldn't ever need to fall back to the default but I might as well provide a sensible value
    Component extends StyledComponentConstraint = "div"
>(
    component: Component,
    styles:
        | CSSProperties
        | CreateCSSProperties<{}>
        | PropsFunc<{}, CreateCSSProperties<{}>>,
    overrideProps?:
        | Partial<React.ComponentPropsWithRef<Component>>
        | {
              (
                  props: React.ComponentPropsWithRef<Component> &
                      AdditionalProps
              ): React.ComponentPropsWithRef<Component>;
          }
) {
    const useStyles = makeStyles(() => ({
        root: styles
    }));

    return React.forwardRef((
        props: React.ComponentPropsWithRef<Component> & AdditionalProps,
        ref
    ) => {
        const styles = useStyles();
        const styleAddedProps = addPropsClassName(styles.root, props);
        return React.createElement(component, {
            ref,
            ...styleAddedProps,
            ...(typeof overrideProps === "function"
                ? overrideProps(styleAddedProps)
                : overrideProps)
        });
    });
}

const useStyles = makeStyles(() => ({
    root: {
        fontFamily: "Supply Mono Light, sans-serif",
        minWidth: "calc(100vw - 4rem)",
        minHeight: "100vh",
        padding: "2rem",
        backgroundColor: colors.primary,
        "& button, input": {
            fontFamily: "Supply Mono Regular"
        }
    }
}));

export default function ThemeProvider(props: { children: React.ReactNode }) {
    const styles = useStyles();

    return <div className={styles.root}>{props.children}</div>;
}
