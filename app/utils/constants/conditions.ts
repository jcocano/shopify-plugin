import { ConditionTypeEnum, OperatorEnum } from "@prisma/client";

export const blockchains = [
  { label: "Bitcoin", value: "bitcoin" }, 
  { label: "Ethereum", value: "ethereum" }, 
  { label: "ApeChain", value: "apechain" },
]

export const conditionOptions = [
  { label: "Owns Token", value: ConditionTypeEnum.OWNS_TOKEN },
  { label: "Address List", value: ConditionTypeEnum.WALLET_LIST },
];

export const operators = [
  { label: "Includes", value: OperatorEnum.INCLUDES, },
  { label: "Excludes", value: OperatorEnum.EXCLUDES, },
]
