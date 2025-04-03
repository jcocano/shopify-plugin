import db from "../../db.server";
import { CampaignConditionDto } from "../dtos/campaigns/CampaignConditions.dto";

export async function upsertCondition(condition: CampaignConditionDto, campaignId: string) {
  try {
    return await db.campaignCondition.upsert({
      where: {
        campaignId_rule_name: {
          campaignId: campaignId,
          rule_name: condition.ruleName,
        },
      },
      update: {
        type: condition.type,
        operator: condition.operator,
        tokenIds: condition.tokenIds ?? [],
        tokenQty: condition.tokenQty ?? null,
        blockchain: condition.blockchain ?? null,
        contract: condition.contract ?? null,
        wallet: condition.wallet ?? [],
      },
      create: {
        campaignId: campaignId,
        type: condition.type,
        operator: condition.operator,
        rule_name: condition.ruleName,
        tokenIds: condition.tokenIds ?? [],
        tokenQty: condition.tokenQty ?? null,
        blockchain: condition.blockchain ?? null,
        contract: condition.contract ?? null,
        wallet: condition.wallet ?? [],
      },
    });
  } catch (error) {
    console.error(`Error en upsert de condition ${condition.id}:`, error);
    throw new Error("Failed to upsert condition.");
  }
}

export async function getConditionById(conditionId: number) {
  try {
    return await db.campaignCondition.findUnique({
      where: { id: conditionId },
    });
  } catch (error) {
    console.error(`Error fetching condition ${conditionId}:`, error);
    throw new Error("Failed to fetch condition.");
  }
}

export async function getConditionsByCampaign(campaignId: string) {
  try {
    return await db.campaignCondition.findMany({
      where: { campaignId },
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error(`Error fetching conditions for campaign ${campaignId}:`, error);
    throw new Error("Failed to fetch conditions.");
  }
}

export async function deleteCondition(conditionId: number) {
  try {
    return await db.campaignCondition.delete({
      where: { id: conditionId },
    });
  } catch (error) {
    console.error(`Error deleting condition ${conditionId}:`, error);
    throw new Error("Failed to delete condition.");
  }
}
