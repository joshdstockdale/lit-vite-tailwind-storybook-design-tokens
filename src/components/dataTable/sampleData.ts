export const sampleHeaders = [
  { label: "Date", data: { value: "CreatedDateTime", type: "date" } },
  { label: "Storage", data: { value: "StorageLocation" } },
  { label: "PO No.", data: { value: "PONumber" } },
  { label: "Work Order No.", data: { value: "WorkOrderNo" } },
  {
    label: "Added",
    data: { value: "AddedInventory", suffix: "QuantityUOM", type: "number" },
    filter: false,
    sort: false,
  },
  {
    label: "Used",
    data: { value: "UsedInventory", suffix: "QuantityUOM", type: "number" },
  },
  {
    label: "Usage Price",
    data: { prefix: "$", value: "UsagePrice", type: "float" },
    filter: false,
  },
  {
    label: "Purchased",
    data: { prefix: "$", value: "PurchasePrice", type: "float" },
    filter: false,
  },
  { label: "Supplier", data: { value: "SupplierName" } },
];



export const sampleData = () => {
  const data = [];
  for(let i = 1; i <=1000; i++){
    data.push({
      ID: i,
      CreatedDateTime: `/Date(16669${i}9100000)/`,
      StorageLocation: `Storage ${i}`,
      PONumber: `${i}00`,
      WorkOrderNo: `0${i}`,
      AddedInventory: 20+i,
      UsedInventory: 10+i,
      Quantity: 30+i,
      QuantityUOM: `lb`,
      UsagePrice: 1.1 * i,
      PricePerUOMID: `lb`,
      PurchasePrice: 1.01 *i,
      PurchasePriceUOM: `lb`,
      SupplierName: `Supplier ${i}`,
    })
  }
  return data
}