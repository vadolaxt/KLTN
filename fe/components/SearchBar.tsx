import React from "react";
import {Input} from "@/components/ui/input";
import {Search} from "lucide-react";

export function SearchBar() {
    return (
        <div className="relative w-full max-w-md group">
            <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                size={18}
            />

            <Input
                type="search"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border-2 focus-visible:ring-offset-0 focus-visible:ring-1 transition-all"
            />
        </div>
    );
}