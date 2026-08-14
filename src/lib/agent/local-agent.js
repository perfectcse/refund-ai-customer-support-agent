import {
  getCustomerById,
  getOrderById
} from "../crm/crm";

import { checkRefundEligibility } from "../policy/policy-validator";

import { executeTool } from "./tools";

export function runLocalAgent(messages) {
  const latestMessage =
    messages[messages.length - 1]?.content || "";

  const customerIdMatch =
    latestMessage.match(/CUS-\d+/i);

  const orderIdMatch =
    latestMessage.match(/ORD-\d+/i);

  const customerId =
    customerIdMatch?.[0]?.toUpperCase();

  const orderId =
    orderIdMatch?.[0]?.toUpperCase();

  const events = [];

  // --------------------------------------------------
  // Customer ID validation
  // --------------------------------------------------

  if (!customerId) {
    events.push({
      type: "agent",
      message: "Customer ID is required.",
      status: "WAITING"
    });

    return {
      response:
        "Please provide your customer ID so I can verify your account.",
      events,
      mode: "local"
    };
  }

  // --------------------------------------------------
  // Get Customer
  // --------------------------------------------------

  const customer =
    getCustomerById(customerId);

  events.push({
    type: "tool",
    tool: "getCustomer",
    status: customer
      ? "SUCCESS"
      : "FAILED",
    message: customer
      ? `Customer ${customer.name} verified.`
      : "Customer not found."
  });

  if (!customer) {
    return {
      response:
        "I couldn't find a customer account with that ID.",
      events,
      mode: "local"
    };
  }

  // --------------------------------------------------
  // Order ID validation
  // --------------------------------------------------

  if (!orderId) {
    return {
      response:
        `Hi ${customer.name}. Please provide the order ID you'd like me to check.`,
      events,
      mode: "local"
    };
  }

  // --------------------------------------------------
  // Get Order
  // --------------------------------------------------

  const order =
    getOrderById(orderId);

  events.push({
    type: "tool",
    tool: "getOrder",
    status: order
      ? "SUCCESS"
      : "FAILED",
    message: order
      ? `Order ${orderId} retrieved.`
      : `Order ${orderId} was not found.`
  });

  if (!order) {
    return {
      response:
        "I couldn't find that order. Please check the order ID and try again.",
      events,
      mode: "local"
    };
  }

  // --------------------------------------------------
  // Refund Eligibility
  // --------------------------------------------------

  const eligibility =
    checkRefundEligibility(
      customerId,
      orderId
    );

  events.push({
    type: "tool",
    tool: "checkRefundEligibility",
    status: eligibility.eligible
      ? "PASSED"
      : "FAILED",
    message: eligibility.reason
  });

  // --------------------------------------------------
  // Refund Denied
  // --------------------------------------------------

  if (!eligibility.eligible) {
    return {
      response:
        `I'm sorry, but I can't approve the refund for order ${orderId}. ${eligibility.reason}`,
      events,
      mode: "local",
      decision: "DENIED"
    };
  }

  // --------------------------------------------------
  // Calculate Refund
  // --------------------------------------------------

  const refundCalculation =
    executeTool(
      "calculateRefund",
      {
        orderId
      }
    );

  events.push({
    type: "tool",
    tool: "calculateRefund",
    status: refundCalculation.success
      ? "SUCCESS"
      : "FAILED",
    message: refundCalculation.success
      ? `Refund amount calculated: ₹${refundCalculation.refundAmount}`
      : refundCalculation.error
  });

  if (!refundCalculation.success) {
    return {
      response:
        "I couldn't calculate the refund amount.",
      events,
      mode: "local",
      decision: "FAILED"
    };
  }

  // --------------------------------------------------
  // Process Refund
  // --------------------------------------------------

  const refundResult =
    executeTool(
      "processRefund",
      {
        orderId,
        amount:
          refundCalculation.refundAmount
      }
    );

  events.push({
    type: "tool",
    tool: "processRefund",
    status: refundResult.success
      ? "SUCCESS"
      : "FAILED",
    message: refundResult.success
      ? `Refund ${refundResult.refundId} processed successfully.`
      : refundResult.error
  });

  if (!refundResult.success) {
    return {
      response:
        "The refund could not be processed. Please try again later.",
      events,
      mode: "local",
      decision: "FAILED"
    };
  }

  // --------------------------------------------------
  // Final Success Response
  // --------------------------------------------------

  return {
    response:
      `Your refund has been approved and processed successfully. ` +
      `Refund amount: ₹${refundResult.refundAmount}. ` +
      `Refund ID: ${refundResult.refundId}.`,
    events,
    mode: "local",
    decision: "APPROVED",
    refund: {
      refundId: refundResult.refundId,
      amount: refundResult.refundAmount,
      currency: refundResult.currency,
      status: refundResult.status
    }
  };
}