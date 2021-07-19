// This is taken from Kobra (but modified), I wrote the file so I give permission for it to be used in this thing

// Modeled after Chakra UI's Stack component

import { makeStyles } from "@material-ui/styles";
import React from "react";
import { addPropsClassName } from "./theme";

interface StackStylesProps {
    direction?: "row" | "column",
    spacing?: string | number
}

type StackProps = StackStylesProps & JSX.IntrinsicElements["div"];

const useStyles = makeStyles(() => ({
    stack: (props: StackStylesProps) => ({
        display: "flex",
        flexDirection: props.direction ?? "column",
        "& > *:not(:last-child)": {
            [props.direction === "row" ? "marginRight" : "marginBottom"]: props.spacing ?? "1rem"
        }
    })
}));

export default function Stack(props: StackProps) {
    const { direction, spacing, ...containerProps } = props;
    const styles = useStyles({ direction, spacing });

    return (
        <div {...addPropsClassName(styles.stack, containerProps)} />
    );
}