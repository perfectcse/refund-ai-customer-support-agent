import { customers } from "../../data/customers";
import { orders } from "../../data/orders";

export function getCustomerById(customerId) {
  return customers.find((customer) => customer.id === customerId) || null;
}

export function getOrderById(orderId) {
  return orders.find((order) => order.id === orderId) || null;
}

export function getCustomerOrders(customerId) {
  return orders.filter((order) => order.customerId === customerId);
}