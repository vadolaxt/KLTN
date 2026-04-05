import {Button} from "@/components/ui/button";
import {SearchBar} from "@/components/SearchBar";

export default function Page() {
    return (
        <div>
            <Button className="bg-red-500 hover:bg-red-600 px-8 rounded-full shadow-lg">
                Hello
            </Button>
            <SearchBar></SearchBar>
        </div>
    )
}