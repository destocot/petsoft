"use client";

import { useSearchContext } from "@/lib/hooks";

export const SearchForm = () => {
  const { searchQuery, handleChangeSearchQuery } = useSearchContext();

  return (
    <form className="h-full w-full">
      <input
        type="search"
        className="h-full w-full rounded-md bg-white/20 px-5 outline-none transition placeholder:text-white/50 hover:bg-white/30 focus:bg-white/50"
        placeholder="Search pets"
        value={searchQuery}
        onChange={(e) => handleChangeSearchQuery(e.target.value)}
      />
    </form>
  );
};
