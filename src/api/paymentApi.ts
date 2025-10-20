// src/api/paymentApi.ts
import axiosClient from './axiosClient';
export const paymentApi = {
  createStripeIntent: (orderId: string) => axiosClient.post(`/payments/stripe/${orderId}`).then((r) => r.data),
};
