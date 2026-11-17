import { create } from "zustand";

export type SubscriptionTier = "free" | "pro" | "team" | "enterprise";
export type BillingCycle = "monthly" | "annual";
export type Currency = "USD" | "INR";

export interface InvoiceItem {
  id: string;
  date: string;
  amount: string;
  plan: string;
  status: "Paid" | "Processing" | "Refunded";
  method: string;
  invoiceNumber: string;
}

export interface PaymentMethodInfo {
  type: "card" | "upi" | "grant_po";
  label: string;
  identifier: string; // e.g. "•••• 4242", "scholar@okaxis", "NIH-R01-HG012345"
  expDate?: string;
}

export interface FeatureAccessResult {
  allowed: boolean;
  requiredTier: SubscriptionTier;
  title: string;
  reason: string;
}

export interface SubscriptionState {
  currentPlan: SubscriptionTier;
  billingCycle: BillingCycle;
  currency: Currency;
  tokensUsed: number;
  tokensTotal: number;
  renewalDate: string;
  labName: string;
  activeLabMembers: number;
  maxLabMembers: number;
  paymentMethod: PaymentMethodInfo | null;
  invoices: InvoiceItem[];

  // Actions
  setCurrency: (currency: Currency) => void;
  setBillingCycle: (cycle: BillingCycle) => void;
  upgradePlan: (plan: SubscriptionTier, cycle: BillingCycle, payment: PaymentMethodInfo) => void;
  downgradePlan: (plan: SubscriptionTier) => void;
  addTokens: (amount: number, costDisplay: string) => void;
  consumeTokens: (amount: number) => boolean;
  setLabName: (name: string) => void;
  checkFeatureAccess: (feature: "unlimited_drafts" | "deep_rag" | "team_collaboration" | "latex_export" | "merkle_audit" | "multi_site_irb") => FeatureAccessResult;
}

const STORAGE_KEY = "cambium_subscription_v2";

const defaultInvoicesUSD: InvoiceItem[] = [
  {
    id: "INV-2026-09",
    invoiceNumber: "CAMB-90214",
    date: "Sep 1, 2026",
    amount: "$1.00",
    plan: "Scholar Pro (Starting Stage)",
    status: "Paid",
    method: "University P-Card (•••• 4242)",
  },
  {
    id: "INV-2026-08",
    invoiceNumber: "CAMB-89102",
    date: "Aug 1, 2026",
    amount: "$1.00",
    plan: "Scholar Pro (Starting Stage)",
    status: "Paid",
    method: "University P-Card (•••• 4242)",
  },
];

const defaultInvoicesINR: InvoiceItem[] = [
  {
    id: "INV-2026-09",
    invoiceNumber: "CAMB-90214",
    date: "Sep 1, 2026",
    amount: "₹89.00",
    plan: "Scholar Pro (Starting Stage)",
    status: "Paid",
    method: "UPI (scholar@okaxis)",
  },
  {
    id: "INV-2026-08",
    invoiceNumber: "CAMB-89102",
    date: "Aug 1, 2026",
    amount: "₹89.00",
    plan: "Scholar Pro (Starting Stage)",
    status: "Paid",
    method: "UPI (scholar@okaxis)",
  },
];

export const useSubscriptionStore = create<SubscriptionState>((set, get) => {
  let initialPlan: SubscriptionTier = "pro"; // Default to Scholar Pro subsidized entry
  let initialCycle: BillingCycle = "monthly";
  let initialCurrency: Currency = "USD";
  let initialTokensUsed = 8450;
  let initialTokensTotal = 10000;
  let initialLabMembers = 3;
  let initialMaxMembers = 8;
  let initialPaymentMethod: PaymentMethodInfo | null = {
    type: "card",
    label: "University Purchasing Card",
    identifier: "•••• 4242",
    expDate: "12/28",
  };
  let initialInvoices = defaultInvoicesUSD;

  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.currentPlan) initialPlan = parsed.currentPlan;
        if (parsed.billingCycle) initialCycle = parsed.billingCycle;
        if (parsed.currency) initialCurrency = parsed.currency;
        if (typeof parsed.tokensUsed === "number") initialTokensUsed = parsed.tokensUsed;
        if (typeof parsed.tokensTotal === "number") initialTokensTotal = parsed.tokensTotal;
        if (parsed.paymentMethod) initialPaymentMethod = parsed.paymentMethod;
        if (Array.isArray(parsed.invoices)) initialInvoices = parsed.invoices;
      } catch {
        // use defaults
      }
    }
  }

  const persist = (data: Partial<SubscriptionState>) => {
    if (typeof window !== "undefined") {
      try {
        const current = {
          currentPlan: get().currentPlan,
          billingCycle: get().billingCycle,
          currency: get().currency,
          tokensUsed: get().tokensUsed,
          tokensTotal: get().tokensTotal,
          paymentMethod: get().paymentMethod,
          invoices: get().invoices,
          ...data,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      } catch {
        // ignore
      }
    }
  };

  return {
    currentPlan: initialPlan,
    billingCycle: initialCycle,
    currency: initialCurrency,
    tokensUsed: initialTokensUsed,
    tokensTotal: initialTokensTotal,
    renewalDate: "Nov 1, 2026",
    labName: "Stanford Neural & Bio-Topology Lab",
    activeLabMembers: initialLabMembers,
    maxLabMembers: initialMaxMembers,
    paymentMethod: initialPaymentMethod,
    invoices: initialInvoices,

    setCurrency: (currency) => {
      set({ currency });
      persist({ currency });
    },

    setBillingCycle: (billingCycle) => {
      set({ billingCycle });
      persist({ billingCycle });
    },

    upgradePlan: (plan, cycle, payment) => {
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const renewalStr = nextMonth.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

      const currency = get().currency;
      let amountStr = "$1.00";
      let totalTokens = 10000;
      let maxMembers = 1;

      if (plan === "pro") {
        amountStr = currency === "USD" ? (cycle === "monthly" ? "$1.00" : "$10.00") : (cycle === "monthly" ? "₹89.00" : "₹899.00");
        totalTokens = 10000;
        maxMembers = 1;
      } else if (plan === "team") {
        amountStr = currency === "USD" ? (cycle === "monthly" ? "$49.00" : "$490.00") : (cycle === "monthly" ? "₹3,999.00" : "₹39,990.00");
        totalTokens = 50000;
        maxMembers = 15;
      } else if (plan === "enterprise") {
        amountStr = currency === "USD" ? "$5,000.00" : "₹420,000.00";
        totalTokens = 500000;
        maxMembers = 250;
      }

      const planNameMap: Record<SubscriptionTier, string> = {
        free: "Scholar Free",
        pro: "Scholar Pro",
        team: "Lab Team Workspace",
        enterprise: "Campus Enterprise",
      };

      const newInvoice: InvoiceItem = {
        id: `INV-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
        invoiceNumber: `CAMB-${Math.floor(10000 + Math.random() * 90000)}`,
        date: dateStr,
        amount: amountStr,
        plan: planNameMap[plan],
        status: "Paid",
        method: `${payment.label} (${payment.identifier})`,
      };

      set((state) => {
        const updatedInvoices = [newInvoice, ...state.invoices];
        return {
          currentPlan: plan,
          billingCycle: cycle,
          paymentMethod: payment,
          tokensTotal: totalTokens,
          renewalDate: renewalStr,
          maxLabMembers: maxMembers,
          invoices: updatedInvoices,
        };
      });

      persist({
        currentPlan: plan,
        billingCycle: cycle,
        paymentMethod: payment,
        tokensTotal: totalTokens,
        invoices: [newInvoice, ...get().invoices],
      });
    },

    downgradePlan: (plan) => {
      set({ currentPlan: plan });
      persist({ currentPlan: plan });
    },

    addTokens: (amount, costDisplay) => {
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const newInvoice: InvoiceItem = {
        id: `TOPUP-${Date.now().toString().slice(-6)}`,
        invoiceNumber: `CAMB-${Math.floor(10000 + Math.random() * 90000)}`,
        date: dateStr,
        amount: costDisplay,
        plan: `Pay-as-you-go Compute (+${amount.toLocaleString()} tokens)`,
        status: "Paid",
        method: get().paymentMethod ? `${get().paymentMethod!.label} (${get().paymentMethod!.identifier})` : "Instant Debit",
      };

      set((state) => {
        const newTotal = state.tokensTotal + amount;
        const updatedInvoices = [newInvoice, ...state.invoices];
        return {
          tokensTotal: newTotal,
          invoices: updatedInvoices,
        };
      });

      persist({
        tokensTotal: get().tokensTotal,
        invoices: get().invoices,
      });
    },

    consumeTokens: (amount) => {
      const state = get();
      if (state.tokensUsed + amount > state.tokensTotal) {
        return false;
      }
      set({ tokensUsed: state.tokensUsed + amount });
      persist({ tokensUsed: state.tokensUsed + amount });
      return true;
    },

    setLabName: (name) => {
      set({ labName: name });
    },

    checkFeatureAccess: (feature) => {
      const plan = get().currentPlan;
      switch (feature) {
        case "unlimited_drafts":
          if (plan === "free") {
            return {
              allowed: false,
              requiredTier: "pro",
              title: "Draft Paper Allowance Limit",
              reason: "Scholar Free includes up to 3 active workspace drafts (75% of features free). Upgrade to Scholar Pro (~$1/mo) for unlimited drafts.",
            };
          }
          return { allowed: true, requiredTier: "pro", title: "", reason: "" };

        case "deep_rag":
          if (plan === "free" && get().tokensUsed >= 2000) {
            return {
              allowed: false,
              requiredTier: "pro",
              title: "Monthly Deep Literature Synthesis Quota",
              reason: "You have utilized your free monthly AI reading quota. Upgrade to Scholar Pro or add pay-as-you-go compute (+5,000 tokens for $0.50).",
            };
          }
          return { allowed: true, requiredTier: "pro", title: "", reason: "" };

        case "team_collaboration":
          if (plan !== "team" && plan !== "enterprise") {
            return {
              allowed: false,
              requiredTier: "team",
              title: "Shared Lab Team Workspace",
              reason: "Multi-user proposal co-authoring, shared GPU compute pools, and CRediT matrix governance require a Lab Team subscription ($49/mo per lab).",
            };
          }
          return { allowed: true, requiredTier: "team", title: "", reason: "" };

        case "latex_export":
          return { allowed: true, requiredTier: "free", title: "", reason: "" };

        case "merkle_audit":
          if (plan !== "enterprise") {
            return {
              allowed: false,
              requiredTier: "enterprise",
              title: "Cryptographic Merkle Audit Ledger",
              reason: "Permanent immutable SHA-256 regulatory audit ledgers are an Institutional Campus feature.",
            };
          }
          return { allowed: true, requiredTier: "enterprise", title: "", reason: "" };

        case "multi_site_irb":
          if (plan === "free") {
            return {
              allowed: false,
              requiredTier: "pro",
              title: "Multi-Site IRB Compliance Tracker",
              reason: "Advanced multi-site ethics protocol governance requires a Pro or Lab Team subscription.",
            };
          }
          return { allowed: true, requiredTier: "pro", title: "", reason: "" };

        default:
          return { allowed: true, requiredTier: "free", title: "", reason: "" };
      }
    },
  };
});

