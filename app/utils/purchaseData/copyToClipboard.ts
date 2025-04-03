export function copyToClipboard(selectedPurchase: any) {
  if (!selectedPurchase) return;
  const orderText = `
Order Information:
Purchase ID: ${selectedPurchase.purchase_id}
Customer: ${selectedPurchase.customer}
Order Amount: ${selectedPurchase.amount}
Status: ${selectedPurchase.status}
Date: ${selectedPurchase.tx_date || 'N/A'}
Type: ${selectedPurchase.type === 'purchases' ? 'Purchase' : 'Token Redemption'}

Line Items:
${selectedPurchase.line_items.map((item: any) => `${item.product_name} - ${item.quantity} x ${item.price}`).join('\n')}
  `.trim();

  navigator.clipboard.writeText(orderText).then(() => {
    console.log('Text copied to clipboard');
  });
}
