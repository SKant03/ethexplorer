"use client";
import useIsDark from "@/utils/useIsDark";
import clsx from "clsx";

type TableColumn={
    title:string
}
type TableHeadType={
    columns:{title:string; className?:string}[];
}
export default function TableHead({columns}:TableHeadType){
    const isDark = useIsDark();
    return(
        <div className="w-full flex justify-center">
            <div className={clsx("w-full max-w-6xl flex justify-between mt-2 rounded py-2 px-4 text-xl font-semibold text-left bg-gray-200 ",isDark
            ? "border-slate-800 bg-slate-900 hover:bg-slate-800/50"
            : "border-slate-200 bg-white hover:bg-slate-50")}>
            {
                columns.map((col, index)=>(
                    <div key={index} className={col.className}>{col.title}</div>
                ))
            }
            </div>
        </div>
    )
}