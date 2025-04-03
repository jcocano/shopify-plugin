-- CreateEnum
CREATE TYPE "CampaignEnum" AS ENUM ('EXCLUSIVE_PRODUCTS', 'TOKEN_REDEMPTION', 'SPECIAL_DISCOUNT');

-- CreateEnum
CREATE TYPE "DiscountEnum" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');

-- CreateEnum
CREATE TYPE "EvaluatedConditionEnum" AS ENUM ('ALL', 'ANY');

-- CreateEnum
CREATE TYPE "ProductSelectionEnum" AS ENUM ('ALL_PRODUCTS', 'SELECTED_PRODUCT');

-- CreateEnum
CREATE TYPE "StatusEnum" AS ENUM ('ACTIVE', 'ARCHIVED', 'DRAFT', 'INACTIVE');

-- CreateEnum
CREATE TYPE "OperatorEnum" AS ENUM ('INCLUDES', 'EXCLUDES');

-- CreateEnum
CREATE TYPE "ConditionTypeEnum" AS ENUM ('OWNS_TOKEN', 'WALLET_LIST');

-- CreateEnum
CREATE TYPE "OrderStatusEnum" AS ENUM ('PENDING', 'PAID', 'FULFILLED', 'CANCELED', 'REDEEMED');

-- CreateEnum
CREATE TYPE "ButtonUiEnum" AS ENUM ('BLACK', 'BLUE', 'WHITE');

-- CreateEnum
CREATE TYPE "LoaderUiEnum" AS ENUM ('BLACK', 'BLUE', 'WHITE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('AUTHENTICATED', 'PENDING', 'REJECTED');

-- CreateTable
CREATE TABLE "campaigns" (
    "_id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "auth_policy" TEXT NOT NULL,
    "type" "CampaignEnum" NOT NULL,
    "discount_type" "DiscountEnum" NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "offer_description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" "StatusEnum" NOT NULL DEFAULT 'DRAFT',
    "is_auto_archive" BOOLEAN NOT NULL DEFAULT false,
    "product_selection_type" "ProductSelectionEnum" NOT NULL,
    "evaluated_condition" "EvaluatedConditionEnum" NOT NULL,
    "product_purchase_limit" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "campaign_conditions" (
    "id" SERIAL NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "type" "ConditionTypeEnum" NOT NULL,
    "operator" "OperatorEnum" NOT NULL,
    "rule_name" TEXT NOT NULL,
    "tokenIds" TEXT[],
    "tokenQty" INTEGER,
    "blockchain" TEXT,
    "contract" TEXT,
    "wallet" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_selected_products" (
    "id" SERIAL NOT NULL,
    "product_id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image_url" TEXT,
    "variantId" TEXT,
    "variantTitle" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_selected_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Did" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Did_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "line_items" (
    "id" SERIAL NOT NULL,
    "purchase_data_id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "used_contract" TEXT,
    "used_token_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "line_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_data" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "shopify_order_id" TEXT NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL,
    "order_status" "OrderStatusEnum" NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "user_session_id" TEXT NOT NULL,
    "user_session_nonce" TEXT NOT NULL,
    "user_did" TEXT NOT NULL,
    "user_wallet_address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_settings" (
    "_id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "button_ui" "ButtonUiEnum" NOT NULL,
    "loader_ui" "LoaderUiEnum" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_settings_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storefront_sessions" (
    "_id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "client_ip" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "did" TEXT NOT NULL,
    "shopify_session_id" TEXT NOT NULL,
    "holdings" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "storefront_sessions_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "linked_did" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "campaign_conditions_campaign_id_rule_name_key" ON "campaign_conditions"("campaign_id", "rule_name");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_selected_products_product_id_campaignId_variantId_key" ON "campaign_selected_products"("product_id", "campaignId", "variantId");

-- CreateIndex
CREATE UNIQUE INDEX "Did_identifier_key" ON "Did"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_data_shopify_order_id_key" ON "purchase_data"("shopify_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "store_settings_shop_key" ON "store_settings"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_wallet_address_key" ON "Wallet"("wallet_address");

-- AddForeignKey
ALTER TABLE "campaign_conditions" ADD CONSTRAINT "campaign_conditions_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_selected_products" ADD CONSTRAINT "campaign_selected_products_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "line_items" ADD CONSTRAINT "line_items_purchase_data_id_fkey" FOREIGN KEY ("purchase_data_id") REFERENCES "purchase_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_data" ADD CONSTRAINT "purchase_data_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_data" ADD CONSTRAINT "purchase_data_user_wallet_address_fkey" FOREIGN KEY ("user_wallet_address") REFERENCES "Wallet"("wallet_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_linked_did_fkey" FOREIGN KEY ("linked_did") REFERENCES "Did"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;
