export function disambiguateLabel(key: string, value: string | any[]): string {
  switch (key) {
    case "moneySpent":
      return `Money spent is between $${value[0]} and $${value[1]}`;

    case "taggedWith":
      return `Tagged with ${value}`;

    case "accountStatus":
      return (value as string[])
        .map((val) => `Status ${getAccountStatusLabel(val)}`)
        .join(", ");

    case "transactionType":
      return `Transaction type: ${(value as string[])
        .map((val) => (val === "purchases" ? "Purchase" : "Token Redemption"))
        .join(", ")}`;

    default:
      return value as string;
  }
}

function getAccountStatusLabel(status: string): string {
  switch (status) {
    case "PAID":
      return "Paid";
    case "REDEEMED":
      return "Redeemed";
    case "PENDING":
      return "Pending";
    case "CANCELED":
      return "Canceled";
    case "FULFILLED":
      return "Fulfilled";
    default:
      return "Unknown";
  }
}
