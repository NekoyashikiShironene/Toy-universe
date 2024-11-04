import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { tag, path } = await req.json();

    if (path) {
        revalidatePath(path);
        return NextResponse.json({ message: `Revalidated path ${path}` });
    } else if (tag) {
        revalidateTag(tag);
        return NextResponse.json({ message: `Revalidated tag ${tag}` });
    } else {
        return NextResponse.json({ message: "Required tag or path in request body" }, { status: 400 });
    }    

}