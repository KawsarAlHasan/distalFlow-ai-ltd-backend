import express from "express";
import bodyParser from "body-parser";
import { stripe } from "../config/stripe";
import config from "../config";
import { dbClient } from "../lib/prisma";
import { emailHelper } from "../helpers/emailHelper";
import { paymentConfirmationEmail } from "../shared/emailTemplate";

const webhookRouter = express.Router();

webhookRouter.post(
  "/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    if (!sig || Array.isArray(sig)) {
      return res.status(400).send("Missing or invalid Stripe signature");
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        config.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // event handle
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.metadata?.type === "subscription") {
          await handleSubscriptionSuccess(session);
        }
        break;
      }
      case "checkout.session.async_payment_failed": {
        const session = event.data.object;
        if (session.metadata?.type === "subscription") {
          await handleSubscriptionFailed(session);
        }
        break;
      }
      case "checkout.session.expired": {
        const session = event.data.object;
        if (session.metadata?.type === "subscription") {
          await handleSubscriptionExpired(session);
        }
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
);

// success payment handle 
async function handleSubscriptionSuccess(session: any) {
  const { clinicId, subscriptionId, adminEmail, planId, adminName, clinicName, planName } = session.metadata;

  if (!clinicId || !subscriptionId) {
    console.error("Missing clinicId or subscriptionId in metadata");
    return;
  }

  try {
    // idempotency check: whether subscription is already active
    const existingSubscription = await dbClient.clinicSubscription.findUnique({
      where: { id: subscriptionId },
      include: { clinic: true },
    });

    if (!existingSubscription) {
      console.error(`Subscription not found: ${subscriptionId}`);
      return;
    }

    if (existingSubscription.status === "active") {
      console.log(`Subscription ${subscriptionId} already active. Skipping.`);
      return;
    }

    // transaction clinic and subscription update
    await dbClient.$transaction(async (tx) => {
      // active clinic status
      await tx.clinic.update({
        where: { id: clinicId },
        data: { status: "ACTIVE" },
      });

      // update clinic admin 
      await tx.clinicAdmin.update({
        where: { email: adminEmail },
        data: { isVerified: true, status: "ACTIVE" },
      });

      // active clinic subscription
      await tx.clinicSubscription.update({
        where: { id: subscriptionId },
        data: {
          status: "active",
        },
      });


    });

    console.log(`Clinic ${clinicId} activated, subscription ${subscriptionId} active.`);

    // Inside your success email notification block
    if (adminEmail) {
      const emailValues = {
        email: adminEmail,
        adminName: adminName,
        clinicName: clinicName,
        planName: planName, // e.g., "Pro", "Enterprise"
        amount: "$99.00", // actual amount from payment
        transactionId: "txn_123456789", // from payment gateway
        paymentDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        nextBillingDate: new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        frontendBaseUrl: config.FRONTEND_BASE_URL,
      };

      const paymentConfirmation = paymentConfirmationEmail(emailValues);
      await emailHelper(paymentConfirmation);
    }
  } catch (error) {
    console.error("Error processing subscription success:", error);
    // logging or retry mechanism
  }
}

// failed payment handle 
async function handleSubscriptionFailed(session: any) {
  const { subscriptionId } = session.metadata;
  if (!subscriptionId) return;

  try {
    await dbClient.clinicSubscription.update({
      where: { id: subscriptionId },
      data: { status: "failed" },
    });
    console.log(`Subscription ${subscriptionId} marked as failed.`);
  } catch (error) {
    console.error("Error handling payment failed:", error);
  }
}

// expired subscription handle 
async function handleSubscriptionExpired(session: any) {
  const { subscriptionId } = session.metadata;
  if (!subscriptionId) return;

  try {
    // update subscription expired
    await dbClient.clinicSubscription.update({
      where: { id: subscriptionId },
      data: { status: "expired" },
    });
    console.log(`Subscription ${subscriptionId} marked as expired.`);
  } catch (error) {
    console.error("Error handling session expiry:", error);
  }
}

export default webhookRouter;