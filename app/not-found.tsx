import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFoundPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-6 shadow rounded">
                <h2>404 | Not Found</h2>
                <p>Could not find requested resource...</p>
                <Button asChild variant="link">
                    <Link href="/">Return Home</Link>
                </Button>
            </div>
        </div>
    )
}

export default NotFoundPage;
