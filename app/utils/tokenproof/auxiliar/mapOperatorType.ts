import { OperatorEnum } from "@prisma/client";
import { OperatorTypeEnum } from "../interfaces/tokenproofInterfaces";

export function mapOperatorType(operator: OperatorEnum): string {
  switch (operator) {
    case OperatorEnum.INCLUDES:
      return OperatorTypeEnum.INCLUDES as string
    case OperatorEnum.EXCLUDES:
      return OperatorTypeEnum.EXCLUDES as string
    default:
        throw new Error(`Unknown operator type: ${operator}`);
  }
}
