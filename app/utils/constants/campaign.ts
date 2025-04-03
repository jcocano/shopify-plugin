import { CampaignEnum, ProductSelectionEnum, EvaluatedConditionEnum } from "@prisma/client";

// type frontend options
export const campaignTypeOptions = [
  { label: "Token Redemption", value: CampaignEnum.TOKEN_REDEMPTION },
  { label: "Special Discount", value: CampaignEnum.SPECIAL_DISCOUNT },
  { label: "Exclusive Products", value: CampaignEnum.EXCLUSIVE_PRODUCTS },
];

// archive frontend options
export const campaignArchiveOptions = [
  { label: 'Leave the products on place and finish tokengated campaign', value: 'false' },
  { label: 'Archive all products from this campaign when the campaign ends', value: 'true' },
];

// product frontend options
export const campaignProductOptions = [ 
  { label: 'All Products', value: ProductSelectionEnum.ALL_PRODUCTS },
  { label: 'Selected Products', value: ProductSelectionEnum.SELECTED_PRODUCT },
]

// product limits
export const campaignProductLimitOptions = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' },
]

//elegibility conditions frontend options
export const elegibilityConditionsOptions = [
  {label: 'All', value: EvaluatedConditionEnum.ALL},
  {label: 'Any', value: EvaluatedConditionEnum.ANY},
]

