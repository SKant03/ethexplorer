"use client";

import { useState } from "react";
import clsx from "clsx";

import { Copy, Check } from "lucide-react";

type AddressProps={
    address:string
}

export default function Address({address}:AddressProps){
    const [copy, setCopy] =useState(false);
    const handleCopy = async()=>{
        await navigator.clipboard.writeText(address);
        setCopy(true);
        setTimeout(()=> setCopy(false), 5000)
    }
    
     const truncated =
       address.length > 10
         ? `${address.slice(0, 6)}...${address.slice(-4)}`
         : address;
    return (
      <div className="relative inline-block">

        {/* Truncated address with dotted border on hover */}
        <div
          className={clsx(
            "flex items-center gap-1 px-2 py-1 rounded cursor-pointer group",
            "hover:border-dotted hover:border hover:border-gray-500"
          )}
          onClick={handleCopy}
        >
          <div className="absolute -top-8 left-0 w-max bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
            {address}
          </div>
          <span className="select-none">{truncated}</span>
          <Copy size={14} className="text-gray-500 group-hover:text-gray-700" />
        </div>

        {/* Copied success message */}
        {copy && (
          <div className="absolute bottom-0 right-0 bg-green-600 text-white text-xs px-2 py-1 rounded z-20">
            Copied!
          </div>
        )}
      </div>
    );
}