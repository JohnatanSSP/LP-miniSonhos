/**
 * Cliente base para a API do Asaas
 * Docs: https://docs.asaas.com
 */

// Se ASAAS_ENVIRONMENT for "production", usa prod. Qualquer outro valor usa sandbox.
const IS_PRODUCTION = process.env.ASAAS_ENVIRONMENT === "production";

const ASAAS_BASE_URL = IS_PRODUCTION
  ? "https://api.asaas.com/v3"
  : "https://sandbox.asaas.com/api/v3";

export async function asaasRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const apiKey = process.env.ASAAS_API_KEY;

  if (!apiKey) {
    throw new AsaasError(
      "ASAAS_API_KEY não está definida no .env.local",
      500,
      null
    );
  }

  const url = `${ASAAS_BASE_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      access_token: apiKey,
      ...options.headers,
    },
    // Sem cache para garantir dados frescos em rotas de API
    cache: "no-store",
  });

  // Lê como texto para não crashar em respostas vazias (ex: 500 null do Asaas)
  const text = await response.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const d = data as Record<string, unknown> | null;
    const errors = d?.errors as { description?: string }[] | undefined;
    const message =
      errors?.[0]?.description ??
      (d?.message as string) ??
      `Erro ${response.status} na API do Asaas`;
    console.error(`Asaas ${response.status} [${path}]:`, JSON.stringify(data));
    throw new AsaasError(message, response.status, data);
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
