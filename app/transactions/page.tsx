import TableHead from "../common/TableHead";

export default function Transaction() {
  return (
    <div>
      <TableHead
        heading={["Transaction", "Time", "Miner", "Total Transaction"]}
      />
    </div>
  );
}
