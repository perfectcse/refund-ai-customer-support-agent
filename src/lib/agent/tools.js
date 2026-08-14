import {
  getCustomerById,
  getCustomerOrders,
  getOrderById
} from "../crm/crm";

import { checkRefundEligibility } from "../policy/policy-validator";

// --------------------------------------------------
// Calculate Refund
// --------------------------------------------------

function calculateRefund(orderId) {
  const order = getOrderById(orderId);

  if (!order) {
    return {
      success: false,
      error: "Order not found."
    };
  }

  if (order.amount <= 0) {
    return {
      success: false,
      error: "Invalid order amount."
    };
  }

  return {
    success: true,
    orderId: order.id,
    refundAmount: order.amount,
    currency: "INR"
  };
}

// --------------------------------------------------
// Process Refund
// --------------------------------------------------

function processRefund(orderId, amount) {
  const order = getOrderById(orderId);

  if (!order) {
    return {
      success: false,
      error: "Order not found."
    };
  }

  if (order.refundStatus === "REFUNDED") {
    return {
      success: false,
      error: "This order has already been refunded."
    };
  }

  if (amount <= 0) {
    return {
      success: false,
      error: "Invalid refund amount."
    };
  }

  if (amount > order.amount) {
    return {
      success: false,
      error: "Refund amount cannot exceed the original order amount."
    };
  }

  const refundId = `REF-${Date.now()}`;

  // Mock refund processing
  order.refundStatus = "REFUNDED";

  return {
    success: true,
    refundId,
    orderId: order.id,
    refundAmount: amount,
    currency: "INR",
    status: "REFUNDED",
    paymentMethod: order.paymentMethod,
    message: "Refund processed successfully."
  };
}

// --------------------------------------------------
// Tool Definitions
// --------------------------------------------------

export const agentTools = [
  {
    type: "function",
    function: {
      name: "getCustomer",
      description:
        "Retrieve customer information from the CRM using the customer ID.",
      parameters: {
        type: "object",
        properties: {
          customerId: {
            type: "string",
            description:
              "The unique customer ID, for example CUS-1001."
          }
        },
        required: ["customerId"],
        additionalProperties: false
      }
    }
  },

  {
    type: "function",
    function: {
      name: "getCustomerOrders",
      description:
        "Retrieve all orders belonging to a specific customer.",
      parameters: {
        type: "object",
        properties: {
          customerId: {
            type: "string",
            description:
              "The unique customer ID."
          }
        },
        required: ["customerId"],
        additionalProperties: false
      }
    }
  },

  {
    type: "function",
    function: {
      name: "getOrder",
      description:
        "Retrieve detailed information about an order using the order ID.",
      parameters: {
        type: "object",
        properties: {
          orderId: {
            type: "string",
            description:
              "The unique order ID, for example ORD-2001."
          }
        },
        required: ["orderId"],
        additionalProperties: false
      }
    }
  },

  {
    type: "function",
    function: {
      name: "checkRefundEligibility",
      description:
        "Validate whether an order qualifies for a refund according to the strict refund policy. Always use this tool before approving or denying a refund.",
      parameters: {
        type: "object",
        properties: {
          customerId: {
            type: "string",
            description:
              "The unique customer ID."
          },
          orderId: {
            type: "string",
            description:
              "The unique order ID."
          }
        },
        required: ["customerId", "orderId"],
        additionalProperties: false
      }
    }
  },

  {
    type: "function",
    function: {
      name: "calculateRefund",
      description:
        "Calculate the refund amount for an eligible order.",
      parameters: {
        type: "object",
        properties: {
          orderId: {
            type: "string",
            description:
              "The unique order ID."
          }
        },
        required: ["orderId"],
        additionalProperties: false
      }
    }
  },

  {
    type: "function",
    function: {
      name: "processRefund",
      description:
        "Process a refund after refund eligibility has been confirmed and the refund amount has been calculated.",
      parameters: {
        type: "object",
        properties: {
          orderId: {
            type: "string",
            description:
              "The unique order ID."
          },
          amount: {
            type: "number",
            description:
              "The refund amount in INR."
          }
        },
        required: ["orderId", "amount"],
        additionalProperties: false
      }
    }
  }
];

// --------------------------------------------------
// Tool Executor
// --------------------------------------------------

export function executeTool(toolName, args) {
  switch (toolName) {
    case "getCustomer":
      return getCustomerById(args.customerId);

    case "getCustomerOrders":
      return getCustomerOrders(args.customerId);

    case "getOrder":
      return getOrderById(args.orderId);

    case "checkRefundEligibility":
      return checkRefundEligibility(
        args.customerId,
        args.orderId
      );

    case "calculateRefund":
      return calculateRefund(args.orderId);

    case "processRefund":
      return processRefund(
        args.orderId,
        args.amount
      );

    default:
      throw new Error(
        `Unknown tool: ${toolName}`
      );
  }
}