/**
 * Cliente base para a API do Asaas
 * Docs: https://docs.asaas.com
 */

const ASAAS_BASE_URL =
  process.env.ASAAS_ENVIRONMENT === "production"
    ? "https://api.asaas.com/v3"
    : "https://sandbox.asaas.com/api/v3";

export async function asaasRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const apiKey = process.env.ASAAS_API_KEY;
  if (!apiKey) throw new AsaasError("ASAAS_API_KEY não configurada", 500, null);

  const response = await fetch(`${ASAAS_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      access_token: apiKey,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new AsaasError(
      data?.errors?.[0]?.description ?? "Erro na API do Asaas",
      response.status,
      data
    );
  }

  return data as T;
}

export class AsaasError extends Error {
  constructor(
    message: string,
    public status: number,
    public body: unknown
  ) {
    super(message);
    this.name = "AsaasError";
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type BillingType = "BOLETO" | "CREDIT_CARD" | "PIX" | "UNDEFINED";

export type PaymentStatus =
  | "PENDING"
  | "RECEIVED"
  | "CONFIRMED"
  | "OVERDUE"
  | "REFUNDED"
  | "RECEIVED_IN_CASH"
  | "REFUND_REQUESTED"
  | "CHARGEBACK_REQUESTED"
  | "AWAITING_RISK_ANALYSIS";

export interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
  mobilePhone?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  postalCode?: string;
}

export interface AsaasPayment {
  id: string;
  customer: string;
  billingType: BillingType;
  value: number;
  netValue: number;
  status: PaymentStatus;
  dueDate: string;
  description?: string;
  invoiceUrl?: string;
  bankSlipUrl?: string;
  externalReference?: string;
}

export interface AsaasPixQrCode {
  encodedImage: string;
  payload: string;
  expirationDate: string;
}

export interface AsaasCreditCard {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

export interface AsaasCreditCardHolderInfo {
  name: string;
  email: string;
  cpfCnpj: string;
  postalCode: string;
  addressNumber: string;
  addressComplement?: string;
  phone?: string;
  mobilePhone?: string;
}
