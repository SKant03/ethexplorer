// utils/useValueFormat.ts
export const formatValue = (value: number | bigint | string) => {
  let bigValue: bigint;

  if (typeof value === "bigint") {
    bigValue = value;
  } else if (typeof value === "number") {
    bigValue = BigInt(Math.floor(value));
  } else if (typeof value === "string") {
    bigValue = BigInt(value);
  } else {
    throw new Error("Invalid value type");
  }

  const ethInteger = bigValue / 10n ** 18n; // integer part
  const remainder = bigValue % 10n ** 18n; // fractional part

//   // Convert fractional part to 6 decimal digits
  const fraction = remainder.toString().padStart(18, "0");

  // Count trailing zeros in fraction
  let leadingZeroCount = 0;
  for(let i=0;i<fraction.length; i++){
    if(fraction[i]=== "0") leadingZeroCount++;
    else break;
  }
  const significant = fraction.slice(leadingZeroCount).slice(0,3);

  if(leadingZeroCount === 18) return `${ethInteger}.0000`;

   const subscriptMap: Record<string, string> = {

     "4": "₄",
     "5": "₅",
     "6": "₆",
     "7": "₇",
     "8": "₈",
     "9": "₉",
   };

   const subscript =
     leadingZeroCount > 3
       ? Array.from((leadingZeroCount-1).toString())
           .map((n) => subscriptMap[n])
           .join("")
       : "";



   // If the fraction is all zeros
   if (leadingZeroCount === 18) return `${ethInteger}.0₁₈`;

   return `${ethInteger}.0${subscript}${significant}`;

};
