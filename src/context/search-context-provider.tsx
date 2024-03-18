"use client";

import { createContext, useState } from "react";

type TSearchContext = {
  searchQuery: string;
  handleChangeSearchQuery: (newValue: string) => void;
};

export const SearchContext = createContext<TSearchContext | null>(null);

export default function SearchContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // state
  const [searchQuery, setSearchQuery] = useState("");

  // derived state

  // event handlers / action
  const handleChangeSearchQuery = (newValue: string) => {
    setSearchQuery(newValue);
  };

  const exposed: TSearchContext = { searchQuery, handleChangeSearchQuery };

  return (
    <SearchContext.Provider value={exposed}>{children}</SearchContext.Provider>
  );
}
