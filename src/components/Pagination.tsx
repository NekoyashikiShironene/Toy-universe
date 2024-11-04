
import { ProductParams } from "@/types/searchParams";
import { getUrlParams } from "@/utils/urlParams";
import Link from "next/link";

import "../styles/pagination.css"

type PaginationProps = {
    per_page: number,
    total_count: number,
    params: ProductParams,
}

export default function Pagination({ per_page, total_count, params }: PaginationProps) {
    const newParams = { ...params };
    const page = newParams.page ?? 1;
    const total_page = Math.ceil(total_count / per_page);
    const prevUrl = getUrlParams({ ...newParams, page: page - 1 });
    const nextUrl = getUrlParams({ ...newParams, page: page + 1 });

    const minPage = Math.max(page, 1);
    const maxPage = Math.min(page, total_page);

    const prevClickable = (per_page < per_page * minPage);
    const nextClickable = (per_page * maxPage < total_count);

    return (
        <div className="pagination">
            {
                prevClickable &&
                    <Link href={prevUrl}>
                        Prev
                    </Link>
            }
            {
                nextClickable &&
                    <Link href={nextUrl}>
                        Next
                    </Link>
            }
            
        </div>
    )
}
