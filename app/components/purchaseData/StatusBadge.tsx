import { Badge } from "@shopify/polaris";

export interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case "PAID":
      return <Badge tone="success">Paid</Badge>;
    case "FULFILLED":
      return <Badge>Fulfiled</Badge>;
    case "PENDING":
      return <Badge tone="info">Pending</Badge>;
    case "CANCELED":
      return <Badge tone="critical">Canceled</Badge>;
    default:
      return <Badge tone="attention">Unknown</Badge>;
  }
};
