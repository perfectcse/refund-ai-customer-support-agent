import { getCustomerById, getOrderById } from "../crm/crm";

export const refundPolicy = {
  refundWindowDays: 7,

  eligibleConditions: [
    "Order must exist",
    "Customer must own the order",
    "Refund request must be within 7 calendar days of delivery",
    "Order must not have already been refunded",
    "Refund amount cannot exceed the original order amount"
  ],

  nonRefundableCategories: [
    "Digital",
    "Personalized",
    "Gift Card",
    "Final Sale"
  ],

  damagedProductPolicy: {
    eligible: true,
    requiresVerification: true
  },

  refundMethod: "Original payment method",

  notes: [
    "Only the original purchaser can request a refund.",
    "A refunded order cannot be refunded again.",
    "Refunds are limited to the original order amount.",
    "Non-refundable categories are not eligible for standard refunds.",
    "Damaged products may qualify but require verification."
  ]
};

export function checkRefundEligibility(customerId, orderId) {
  const customer = getCustomerById(customerId);
  const order = getOrderById(orderId);

  if (!customer) {
    return {
      eligible: false,
      reason: "Customer not found."
    };
  }

  if (!order) {
    return {
      eligible: false,
      reason: "Order not found."
    };
  }

  if (order.customerId !== customerId) {
    return {
      eligible: false,
      reason: "Customer does not own this order."
    };
  }

  if (order.refundStatus === "REFUNDED") {
    return {
      eligible: false,
      reason: "This order has already been refunded."
    };
  }

  if (refundPolicy.nonRefundableCategories.includes(order.category)) {
    return {
      eligible: false,
      reason: `Orders in the ${order.category} category are not eligible for a standard refund.`
    };
  }

  const deliveryDate = new Date(order.deliveryDate);
  const currentDate = new Date();

  const differenceInMilliseconds =
    currentDate.getTime() - deliveryDate.getTime();

  const differenceInDays =
    differenceInMilliseconds / (1000 * 60 * 60 * 24);

  if (differenceInDays > refundPolicy.refundWindowDays) {
    return {
      eligible: false,
      reason: "The refund request is outside the 7-day refund window."
    };
  }

  if (differenceInDays < 0) {
    return {
      eligible: false,
      reason: "The order has not been delivered yet."
    };
  }

  if (order.productCondition === "Damaged") {
    return {
      eligible: false,
      requiresVerification: true,
      reason: "The damaged product requires verification before a refund can be approved."
    };
  }

  return {
    eligible: true,
    reason: "Order meets the refund policy requirements.",
    refundAmount: order.amount,
    refundMethod: order.paymentMethod
  };
}
