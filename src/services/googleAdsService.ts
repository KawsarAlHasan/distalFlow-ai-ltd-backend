import { GoogleAdsApi, Customer } from "google-ads-api";
import config from "../config";

const getAdsClient = (): GoogleAdsApi => {
  return new GoogleAdsApi({
    client_id: config.google.client_id!,
    client_secret: config.google.client_secret!,
    developer_token: config.google.developer_token!,
  });
};

// 1. accessible customers
export const getAccessibleCustomers = async (
  refreshToken: string,
): Promise<string[]> => {
  const client = getAdsClient();
  try {
    const response = await client.listAccessibleCustomers(refreshToken);

    console.log(response, "accessibleCustomers response");

    // The response is an object (ListAccessibleCustomersResponse), typically containing resource_names
    return (
      (response as any).resource_names || (response as any).resourceNames || []
    );
  } catch (error: any) {
    throw new Error(`Failed to fetch customers: ${error.message}`);
  }
};

// 2. customer client
export const getCustomerClient = (
  customerId: string,
  refreshToken: string,
): Customer => {
  const client = getAdsClient();

  console.log(client, "client");

  // Remove "customers/" prefix if it exists, and any dashes
  const cleanCustomerId = customerId
    .replace("customers/", "")
    .replace(/-/g, "");

  return client.Customer({
    customer_id: cleanCustomerId,
    refresh_token: refreshToken,
  });
};

// 3. create search campaign (test)
export const createSearchCampaign = async (
  customerClient: Customer,
  campaignData: { name: string; budget: number },
) => {
  console.log(campaignData, "campaignData");

  // 1. Create a campaign budget first. In Google Ads API, campaigns require a pre-created budget resource.
  let budgetResourceName = "";
  try {
    const budgetResponse = await customerClient.campaignBudgets.create([
      {
        name: `${campaignData.name || "Test Campaign"} - Budget`,
        amount_micros: (campaignData.budget || 10) * 1_000_000,
        delivery_method: "STANDARD",
        explicitly_shared: false,
      },
    ]);

    budgetResourceName = (budgetResponse as any).results[0].resource_name;

    console.log("Budget created:", budgetResourceName);
  } catch (error: any) {
    console.error("Budget Creation Error:", JSON.stringify(error, null, 2));
    throw new Error(
      `Budget creation failed: ${error?.message || JSON.stringify(error)}`,
    );
  }

  // 2. Create the campaign using the budget resource name
  const operation = {
    campaign: {
      name: campaignData.name || "Test Campaign",
      status: "PAUSED" as const,
      campaign_budget: budgetResourceName,
      network_settings: {
        target_google_search: true,
        target_search_network: true,
        target_content_network: false,
      },
      advertising_channel_type: "SEARCH" as const,
    },
  };

  console.log(operation, "operation");

  try {
    const response = await customerClient.campaigns.create([
      operation.campaign as any,
    ]);
    console.log(response, "response");
    return response;
  } catch (error: any) {
    console.error("Campaign Creation Error:", JSON.stringify(error, null, 2));
    throw new Error(
      `Campaign creation failed: ${error?.message || JSON.stringify(error)}`,
    );
  }
};
