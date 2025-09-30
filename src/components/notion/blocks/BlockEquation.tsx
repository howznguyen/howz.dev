import Katex from "@matejmazur/react-katex";

import { EquationBlock } from "notion-types";
import { getBlockTitle } from "notion-utils";
import cn from "classnames";
import * as React from "react";

import "katex/dist/katex.min.css";
import { useNotionContext } from "../NotionContext";

const katexSettings = {
  throwOnError: false,
  strict: false,
};

export default function BlockEquation(props: {
  block?: EquationBlock;
  math?: string;
  inline?: boolean;
  className?: string;
  updatedBlock?: React.ReactElement;
  blurBlockClassName?: string;
}) {
  const { block, math, inline = false, className } = props;
  const { recordMap } = useNotionContext();
  const blockEquation =
    math ?? (!!block && recordMap ? getBlockTitle(block, recordMap) : null);
  if (!blockEquation) return null;

  if (inline) {
    return (
      <span
        tabIndex={0}
        className={cn(
          "notion-equation",
          "notion-equation-inline",
          className,
          props.blurBlockClassName,
        )}
      >
        <Katex math={blockEquation} settings={katexSettings} block={false} />
      </span>
    );
  }

  return (
    <div className="mb-4">
      <span
        tabIndex={0}
        className={cn(
          "notion-equation",
          "block text-center overflow-x-auto overflow-y-hidden relative",
          className,
          props.blurBlockClassName,
        )}
      >
        <Katex math={blockEquation} settings={katexSettings} block={true} />
      </span>
    </div>
  );
}
