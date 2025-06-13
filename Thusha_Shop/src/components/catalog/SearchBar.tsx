
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
}) => {
  return (
    <form onSubmit={onSearch} className="flex flex-1 gap-2">
      <div className="relative flex-1">
        <Input
          type="search"
          placeholder="Search eyeglasses, sunglasses, frames..."
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full pr-10"
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
      <Button type="submit">Search</Button>
    </form>
  );
};

export default SearchBar;
