import {
    CreateCSSProperties,
    CSSProperties,
    makeStyles,
    PropsFunc
} from "@material-ui/styles";
import React, { Component } from "react";

export const colors = {
    primary: "#19aeff",
    dark: "#005c94",
    text: "#ffffff",
    neutral: "#cccccc"
};

export function addPropsClassName(base: string, props: { className?: string }) {
    return {
        ...props,
        className: base + (props.className ? " " + props.className : "")
    };
}

type BaseStyledComponentProps = { className?: string };
type StyledComponentConstraint =
    | keyof JSX.IntrinsicElements
    | React.ElementType<BaseStyledComponentProps>;

//type ReturnedComponentProps<Component extends keyof JSX.IntrinsicElements | React.ReactElement<ElementProps>, ElementProps extends BaseStyledComponentProps | never = never> = Component extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[Component] : ElementProps;

// TODO: forward refs
export function styled<Component extends StyledComponentConstraint>(
    component: Component,
    styles:
        | CSSProperties
        | CreateCSSProperties<{}>
        | PropsFunc<{}, CreateCSSProperties<{}>>,
    overrideProps?: Partial<React.ComponentPropsWithRef<Component>>
) {
    const useStyles = makeStyles(() => ({
        root: styles
    }));

    return (
        props: React.ComponentPropsWithRef<Component>
    ) => {
        const styles = useStyles();
        return React.createElement(
            component,
            {
                ...addPropsClassName(styles.root, props),
                ...overrideProps
            }
        );
    };
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
