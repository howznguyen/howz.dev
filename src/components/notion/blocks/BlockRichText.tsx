"use client";

import React from "react";
import type { Decoration } from "notion-types";
import { DateTime, LinkAtoms, User } from "@/components/atoms";
import cn from "classnames";
import BlockEquation from "./BlockEquation";
import type { Block, ExtendedRecordMap } from "notion-types";
import { getColorClasses } from "@/lib/notion-color";

interface TextProps {
  value: Decoration[];
  recordMap?: ExtendedRecordMap;
  block?: any;
  linkProps?: any;
  linkProtocol?: string;
}

export const BlockRichText: React.FC<TextProps> = ({
  value,
  recordMap,
  block,
  linkProps,
  linkProtocol,
}) => {
  if (!value) {
    console.log("BlockRichText: value is null/undefined");
    return null;
  }

  return (
    <span className="">
      {value?.map(([text, decorations], index) => {
        if (!decorations) {
          return <React.Fragment key={index}>{text}</React.Fragment>;
        }

        return decorations.reduceRight(
          (element, decorator) => {
            const [decoratorType, decoratorValue] = decorator;
            switch (decoratorType) {
              case "b":
              case "i":
              case "s":
              case "_":
              case "c": {
                let classNames = [];
                if (decoratorType === "b") classNames.push("font-bold");
                if (decoratorType === "i") classNames.push("italic");
                if (decoratorType === "s") classNames.push("line-through");
                if (decoratorType === "_") classNames.push("underline");
                if (decoratorType === "c")
                  classNames = [
                    ...classNames,
                    "bg-gray-200",
                    "dark:bg-gray-700",
                    "px-1",
                    "py-0.5",
                    "rounded",
                    "text-sm",
                    "font-mono",
                  ];

                return (
                  <span key={index} className={cn(classNames)}>
                    {element}
                  </span>
                );
              }
              case "a":
                const isExternal = decoratorValue.toString().startsWith("http");
                return isExternal ? (
                  <LinkAtoms
                    key={index}
                    href={decoratorValue}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {element}
                  </LinkAtoms>
                ) : (
                  <LinkAtoms key={index} href={decoratorValue}>
                    {element}
                  </LinkAtoms>
                );
              case "h":
                const className: string[] = getColorClasses(decoratorValue);

                return (
                  <span key={`highlight-${index}`} className={cn(className)}>
                    {element}
                  </span>
                );
              case "e":
                return (
                  <BlockEquation
                    key={`equation-${index}`}
                    math={decorator[1]}
                    inline
                  />
                );
              case "d":
                const v = decorator[1];
                const type = v?.type;

                if (type === "date") {
                  // Example: Jul 31, 2010
                  const startDate = v.start_date;

                  return (
                    <DateTime
                      value={startDate}
                      rawFormat={true}
                      key={`date-${index}`}
                    />
                  );
                } else if (type === "datetime") {
                  // Example: Jul 31, 2010 20:00
                  const startDate = v.start_date;
                  const startTime = v.start_time;

                  return (
                    <DateTime
                      value={`${startDate} ${startTime}`}
                      rawFormat={true}
                      key={`datetime-${index}`}
                    />
                  );
                } else if (type === "daterange") {
                  // Example: Jul 31, 2010 → Jul 31, 2020
                  const startDate = v.start_date;
                  const endDate = v.end_date;

                  return (
                    <>
                      <DateTime
                        value={startDate}
                        rawFormat={true}
                        key={index}
                      />
                      <> → </>
                      <DateTime
                        value={endDate}
                        rawFormat={true}
                        key={`daterange-${index}`}
                      />
                    </>
                  );
                } else {
                  return element;
                }

              case "u":
                const userId = decorator[1];
                const user = recordMap?.notion_user[userId]?.value;

                if (!user) {
                  console.log("missing user", userId);
                  return (
                    <React.Fragment key={`user-${index}`}></React.Fragment>
                  );
                }

                const userProps = {
                  id: user.id,
                  name: user.given_name + " " + user.family_name,
                  avatar: user.profile_photo,
                };

                return <User user={userProps} />;

              default:
                console.log(
                  "BlockRichText: unsupported decorator",
                  decoratorType,
                );
                return (
                  <React.Fragment key={`default-${index}`}>
                    {element}
                  </React.Fragment>
                );
            }
          },
          <React.Fragment key={`default-${index}`}>{text}</React.Fragment>,
        );
      })}
    </span>
  );
};
