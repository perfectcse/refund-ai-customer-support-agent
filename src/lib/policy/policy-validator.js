import { refundPolicy } from "./refund-policy";
import { getCustomerById, getOrderById } from "../crm/crm";

export function checkRefundEligibility(customerId, orderId) {
  const customer = getCustomerById(customerId);
  const order = getOrderById(orderId);

  // Rule 1: Customer must exist
  if (!customer) {
    return {
      eligible: false,
      reason: "Customer not found."
    };
  }

  // Rule 2: Order must exist
  if (!order) {
    return {
      eligible: false,
      reason: "Order not found."
    };
  }

  // Rule 3: Customer must own the order
  if (order.customerId !== customerId) {
    return {
      eligible: false,
      reason: "Customer does not own this order."
    };
  }

  // Rule 4: Order cannot already be refunded
  if (order.refundStatus === "REFUNDED") {
    return {
      eligible: false,
      reason: "This order has already been refunded."
    };
  }

  // Rule 5: Check non-refundable categories
  if (refundPolicy.nonRefundableCategories.includes(order.category)) {
    return {
      eligible: false,
      reason: `Products in the ${order.category} category are non-refundable.`
    };
  }

  // Rule 6: Check refund window
  const currentDate = new Date();
  const deliveryDate = new Date(order.deliveryDate);

  const differenceInMilliseconds =
    currentDate.getTime() - deliveryDate.getTime();

  const daysSinceDelivery = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60 * 24)
  );

  if (daysSinceDelivery > refundPolicy.refundWindowDays) {
    return {
      eligible: false,
      reason: `The refund window of ${refundPolicy.refundWindowDays} days has expired.`
    };
  }

  // Rule 7: Refund amount cannot exceed order amount
  if (order.amount <= 0) {
    return {
      eligible: false,
      reason: "Order amount is invalid."
    };
  }

  // Damaged product
  if (order.productCondition === "Damaged") {
    return {
      eligible: true,
      requiresVerification: true,
      reason: "Refund eligible because the product is damaged, pending verification."
    };
  }

  // All policy checks passed
  return {
    eligible: true,
    requiresVerification: false,
    reason: "Order satisfies all refund policy requirements."
  };
}