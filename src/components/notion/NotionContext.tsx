"use client";

import React, { createContext, useContext } from "react";
import type { ExtendedRecordMap } from "notion-types";

interface NotionContextType {
  recordMap: ExtendedRecordMap | null;
}

const NotionContext = createContext<NotionContextType>({
  recordMap: null,
});

export const useNotionContext = () => {
  return useContext(NotionContext);
};

export const NotionProvider: React.FC<{
  recordMap: ExtendedRecordMap;
  children: React.ReactNode;
}> = ({ recordMap, children }) => {
  return (
    <NotionContext.Provider value={{ recordMap }}>
      {children}
    </NotionContext.Provider>
  );
};