/**
 * Mock fee configuration data for the Fees Settings prototype.
 *
 * V2 data model: conditions are decoupled from pricing source.
 * Each rule has an explicit `conditions` array (dealer-configured filters)
 * and a `pricingSource` that determines how the fee is calculated.
 */

// ---------------------------------------------------------------------------
// Condition types (the "Applies when" half)
// ---------------------------------------------------------------------------

export type ConditionField =
  | 'vehicle_condition'
  | 'vehicle_category'
  | 'make'
  | 'cc'
  | 'inventory_age'
  | 'buyer_state'
  | 'payment_method'
  | 'delivery_distance';

export interface ConditionFilter {
  field: ConditionField;
  values: string[];
}

export const CONDITION_FIELD_LABELS: Record<ConditionField, string> = {
  vehicle_condition: 'Vehicle condition',
  vehicle_category: 'Vehicle category',
  make: 'Make',
  cc: 'Engine size (CC)',
  inventory_age: 'Days in stock',
  buyer_state: "Buyer's state",
  payment_method: 'Payment method',
  delivery_distance: 'Delivery distance',
};

export const CONDITION_FIELD_VALUES: Partial<Record<ConditionField, Record<string, string>>> = {
  vehicle_condition: { new: 'New', used: 'Used' },
  vehicle_category: { motorcycle: 'Motorcycle', atv: 'ATV', sxs: 'SxS' },
  payment_method: { ach: 'ACH', card: 'Card', bnpl: 'BNPL', crypto: 'Crypto', financing: 'Financing' },
};

export const CONDITION_FIELD_GROUPS: { label: string; fields: ConditionField[] }[] = [
  {
    label: 'Vehicle',
    fields: ['vehicle_condition', 'vehicle_category', 'make', 'cc', 'inventory_age'],
  },
  {
    label: 'Order',
    fields: ['buyer_state', 'payment_method', 'delivery_distance'],
  },
];

// ---------------------------------------------------------------------------
// Pricing source types (the "Fee calculation" half)
// ---------------------------------------------------------------------------

export type PricingSource =
  | 'dms_field'
  | 'ekho_per_unit'
  | 'fixed'
  | 'labor_hours'
  | 'stepped'
  | 'markup';

export const PRICING_SOURCE_LABELS: Record<PricingSource, string> = {
  dms_field: 'From your DMS',
  ekho_per_unit: 'Set per vehicle in Ekho',
  fixed: 'Fixed amount',
  labor_hours: 'Labor hours',
  stepped: 'Tiered pricing',
  markup: 'Markup on cost',
};

export const PRICING_SOURCE_DESCRIPTIONS: Record<PricingSource, string> = {
  dms_field: 'Pulls the fee amount from a field in your DMS for each vehicle',
  ekho_per_unit: 'A value you set on each vehicle individually in Ekho inventory',
  fixed: 'Flat fee or percentage of vehicle/purchase price',
  labor_hours: 'Hours multiplied by your shop labor rate',
  stepped: 'Different prices based on ranges (e.g., distance tiers, engine size tiers)',
  markup: 'Adds a flat or percentage amount on top of your cost',
};

// ---------------------------------------------------------------------------
// Amount model (for fixed pricing)
// ---------------------------------------------------------------------------

export type AmountModel =
  | 'flat'
  | 'pct_vehicle_price'
  | 'pct_total_purchase';

export const AMOUNT_MODEL_LABELS: Record<AmountModel, string> = {
  flat: 'Flat fee',
  pct_vehicle_price: '% of vehicle price',
  pct_total_purchase: '% of total purchase price',
};

// ---------------------------------------------------------------------------
// Fee model (section-level, used for delivery)
// ---------------------------------------------------------------------------

export type FeeModel = 'flat' | 'percentage' | 'per_mile' | 'stepped' | 'markup';

export const MODEL_LABELS: Record<FeeModel, string> = {
  flat: 'Flat fee',
  percentage: 'Percentage',
  per_mile: 'Per-mile',
  stepped: 'Tiered',
  markup: 'Markup on cost',
};

// ---------------------------------------------------------------------------
// Stepped brackets
// ---------------------------------------------------------------------------

export interface SteppedBracket {
  from: number;
  to: number | null;
  amount: number;
}

export function formatBracketRange(bracketField: string | undefined, bracket: SteppedBracket): string {
  if (bracketField === 'inventory_age') {
    if (bracket.to == null) return `${bracket.from}+ days`;
    return `${bracket.from}\u2013${bracket.to} days`;
  }
  if (bracketField === 'cc') {
    if (bracket.to == null) return `${bracket.from}+ cc`;
    return `${bracket.from}\u2013${bracket.to} cc`;
  }
  if (bracketField === 'delivery_distance') {
    if (bracket.to == null) return `${bracket.from}+ mi`;
    return `${bracket.from}\u2013${bracket.to} mi`;
  }
  if (bracket.to == null) return `${bracket.from}+`;
  return `${bracket.from}\u2013${bracket.to}`;
}

/** Units for bracket fields */
export const BRACKET_FIELD_UNITS: Partial<Record<string, string>> = {
  inventory_age: 'day',
  cc: 'cc',
  delivery_distance: 'mi',
};

// ---------------------------------------------------------------------------
// US States reference data
// ---------------------------------------------------------------------------

export const US_STATES: { id: string; label: string }[] = [
  { id: 'AL', label: 'Alabama' }, { id: 'AK', label: 'Alaska' }, { id: 'AZ', label: 'Arizona' },
  { id: 'AR', label: 'Arkansas' }, { id: 'CA', label: 'California' }, { id: 'CO', label: 'Colorado' },
  { id: 'CT', label: 'Connecticut' }, { id: 'DE', label: 'Delaware' }, { id: 'FL', label: 'Florida' },
  { id: 'GA', label: 'Georgia' }, { id: 'HI', label: 'Hawaii' }, { id: 'ID', label: 'Idaho' },
  { id: 'IL', label: 'Illinois' }, { id: 'IN', label: 'Indiana' }, { id: 'IA', label: 'Iowa' },
  { id: 'KS', label: 'Kansas' }, { id: 'KY', label: 'Kentucky' }, { id: 'LA', label: 'Louisiana' },
  { id: 'ME', label: 'Maine' }, { id: 'MD', label: 'Maryland' }, { id: 'MA', label: 'Massachusetts' },
  { id: 'MI', label: 'Michigan' }, { id: 'MN', label: 'Minnesota' }, { id: 'MS', label: 'Mississippi' },
  { id: 'MO', label: 'Missouri' }, { id: 'MT', label: 'Montana' }, { id: 'NE', label: 'Nebraska' },
  { id: 'NV', label: 'Nevada' }, { id: 'NH', label: 'New Hampshire' }, { id: 'NJ', label: 'New Jersey' },
  { id: 'NM', label: 'New Mexico' }, { id: 'NY', label: 'New York' }, { id: 'NC', label: 'North Carolina' },
  { id: 'ND', label: 'North Dakota' }, { id: 'OH', label: 'Ohio' }, { id: 'OK', label: 'Oklahoma' },
  { id: 'OR', label: 'Oregon' }, { id: 'PA', label: 'Pennsylvania' }, { id: 'RI', label: 'Rhode Island' },
  { id: 'SC', label: 'South Carolina' }, { id: 'SD', label: 'South Dakota' }, { id: 'TN', label: 'Tennessee' },
  { id: 'TX', label: 'Texas' }, { id: 'UT', label: 'Utah' }, { id: 'VT', label: 'Vermont' },
  { id: 'VA', label: 'Virginia' }, { id: 'WA', label: 'Washington' }, { id: 'WV', label: 'West Virginia' },
  { id: 'WI', label: 'Wisconsin' }, { id: 'WY', label: 'Wyoming' },
];

// ---------------------------------------------------------------------------
// Rule interface (V2: conditions decoupled from pricing)
// ---------------------------------------------------------------------------

export interface FeeRule {
  id: string;
  /** Explicit conditions: dealer-configured filters (AND logic) */
  conditions: ConditionFilter[];
  /** How the fee amount is determined */
  pricingSource: PricingSource;

  // --- Pricing source-specific fields ---

  /** DMS field name (pricingSource=dms_field) */
  dmsFieldName?: string;
  /** Whether the DMS field contains labor hours */
  dmsIsLabor?: boolean;
  /** Ekho field display name (pricingSource=ekho_per_unit) */
  ekhoFieldName?: string;
  /** Whether the Ekho field contains labor hours */
  ekhoIsLabor?: boolean;
  /** Amount model for fixed pricing (pricingSource=fixed) */
  amountModel?: AmountModel;
  /** Dollar or percentage amount (pricingSource=fixed, markup) */
  amount?: number;
  /** Labor hours (pricingSource=labor_hours) */
  hours?: number;
  /** Stepped brackets (pricingSource=stepped) */
  brackets?: SteppedBracket[];
  /** What field the brackets are over (e.g. 'cc', 'inventory_age', 'delivery_distance') */
  bracketField?: string;
  /** Whether bracket values are labor hours */
  bracketIsLabor?: boolean;
  /** Markup type (pricingSource=markup) */
  markupType?: 'flat' | 'percentage';
}

// ---------------------------------------------------------------------------
// Fallback config
// ---------------------------------------------------------------------------

export interface FallbackConfig {
  amountModel: AmountModel;
  amount: number;
  isLabor?: boolean;
  hours?: number;
}

// ---------------------------------------------------------------------------
// Fee config
// ---------------------------------------------------------------------------

export interface FeeConfig {
  id: string;
  label: string;
  tocLabel?: string;
  description: string;
  icon: string;
  enabled: boolean;
  model: FeeModel;
  availableModels: FeeModel[];
  fallback: FallbackConfig;
  rules: FeeRule[];
  ekhoFieldName: string;
}

// ---------------------------------------------------------------------------
// Helpers: generate condition chips and pricing summary for a rule
// ---------------------------------------------------------------------------

/** Returns a short chip label for a single condition filter */
function formatConditionChip(cond: ConditionFilter): string {
  const valueMap = CONDITION_FIELD_VALUES[cond.field];
  if (valueMap) {
    return cond.values.map((v) => valueMap[v] ?? v).join(', ');
  }
  if (cond.field === 'buyer_state') {
    return cond.values.join(', ');
  }
  return `${CONDITION_FIELD_LABELS[cond.field]}: ${cond.values.join(', ')}`;
}

/** Returns chip objects for display on rule rows */
export function getRuleChips(rule: FeeRule): { label: string; implicit: boolean }[] {
  const chips: { label: string; implicit: boolean }[] = [];

  // Explicit condition chips
  for (const cond of rule.conditions) {
    chips.push({ label: formatConditionChip(cond), implicit: false });
  }

  // Implicit data condition chips (phrased as conditions, not requirements)
  if (rule.pricingSource === 'dms_field' && rule.dmsFieldName) {
    chips.push({ label: `${rule.dmsFieldName} in DMS`, implicit: true });
  }
  if (rule.pricingSource === 'ekho_per_unit') {
    chips.push({ label: 'Value set in Ekho', implicit: true });
  }
  if (rule.pricingSource === 'stepped' && rule.bracketField) {
    const fieldLabel = CONDITION_FIELD_LABELS[rule.bracketField as ConditionField] ?? rule.bracketField;
    chips.push({ label: `Has ${fieldLabel.toLowerCase()} data`, implicit: true });
  }

  return chips;
}

/** Returns the pricing summary line (shown as sublabel on rule rows) */
export function getRuleSublabel(rule: FeeRule, shopRate = 75): string {
  switch (rule.pricingSource) {
    case 'dms_field':
      if (!rule.dmsFieldName) return 'No field mapped';
      return rule.dmsIsLabor
        ? `Field: ${rule.dmsFieldName} (hrs x $${shopRate}/hr)`
        : `Field: ${rule.dmsFieldName}`;

    case 'ekho_per_unit':
      return rule.ekhoIsLabor
        ? `Per-vehicle hours x $${shopRate}/hr`
        : (rule.ekhoFieldName ? `Field: ${rule.ekhoFieldName}` : 'Per-vehicle override');

    case 'fixed':
      if (rule.amount == null || !rule.amountModel) return 'Not configured';
      if (rule.amountModel === 'flat') return `$${rule.amount} flat fee`;
      return `${rule.amount}% ${AMOUNT_MODEL_LABELS[rule.amountModel].replace('% ', '').toLowerCase()}`;

    case 'labor_hours':
      if (rule.hours == null) return 'Not configured';
      return `${rule.hours} hrs x $${shopRate}/hr = $${(rule.hours * shopRate).toFixed(0)}`;

    case 'stepped': {
      const n = rule.brackets?.length ?? 0;
      const unit = rule.bracketField ? (BRACKET_FIELD_UNITS[rule.bracketField] ?? '') : '';
      if (rule.bracketIsLabor) return `${n} ${unit} tier${n === 1 ? '' : 's'}, labor hours`;
      return n > 0 ? `${n} ${unit} tier${n === 1 ? '' : 's'}` : 'Tiered pricing';
    }

    case 'markup':
      if (rule.markupType === 'flat') return `$${rule.amount ?? 0} flat markup on cost`;
      return `${rule.amount ?? 0}% markup on cost`;
  }
}

// ---------------------------------------------------------------------------
// Demo data
// ---------------------------------------------------------------------------

export const DEMO_FEES: FeeConfig[] = [
  {
    id: 'sale',
    label: 'Document',
    description: 'Covers title processing, document preparation, and filing.',
    icon: 'description',
    enabled: true,
    model: 'flat',
    availableModels: ['flat'],
    ekhoFieldName: 'Document fee',
    fallback: { amountModel: 'flat', amount: 495 },
    rules: [
      {
        id: 'r1',
        conditions: [{ field: 'vehicle_condition', values: ['used'] }],
        pricingSource: 'fixed',
        amountModel: 'flat',
        amount: 395,
      },
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery',
    description: 'Fee charged for delivering vehicles to the buyer. Supports multiple pricing models.',
    icon: 'local_shipping',
    enabled: true,
    model: 'flat',
    availableModels: ['flat', 'markup', 'per_mile', 'stepped'],
    ekhoFieldName: 'Delivery fee',
    fallback: { amountModel: 'flat', amount: 249 },
    rules: [
      {
        id: 'r2a',
        conditions: [{ field: 'buyer_state', values: ['AK', 'HI'] }],
        pricingSource: 'markup',
        markupType: 'percentage',
        amount: 20,
      },
      {
        id: 'r2b',
        conditions: [],
        pricingSource: 'stepped',
        bracketField: 'delivery_distance',
        brackets: [
          { from: 0, to: 25, amount: 0 },
          { from: 25, to: 75, amount: 149 },
          { from: 75, to: 150, amount: 299 },
          { from: 150, to: null, amount: 499 },
        ],
      },
    ],
  },
  {
    id: 'pickup',
    label: 'Pickup',
    description: 'Fee for in-store pickup scheduling and preparation.',
    icon: 'storefront',
    enabled: false,
    model: 'flat',
    availableModels: ['flat'],
    ekhoFieldName: 'Pickup fee',
    fallback: { amountModel: 'flat', amount: 0 },
    rules: [],
  },
  {
    id: 'assembly',
    label: 'Assembly',
    description: 'Vehicle assembly and prep charges. Common for crated units.',
    icon: 'build',
    enabled: true,
    model: 'flat',
    availableModels: ['flat'],
    ekhoFieldName: 'Assembly fee',
    fallback: { amountModel: 'flat', amount: 0, isLabor: true, hours: 2 },
    rules: [
      {
        id: 'r3',
        conditions: [],
        pricingSource: 'dms_field',
        dmsFieldName: 'setup_hrs',
        dmsIsLabor: true,
      },
      {
        id: 'r3b',
        conditions: [{ field: 'vehicle_category', values: ['sxs'] }],
        pricingSource: 'labor_hours',
        hours: 4,
      },
      {
        id: 'r3c',
        conditions: [{ field: 'vehicle_category', values: ['atv'] }],
        pricingSource: 'labor_hours',
        hours: 3,
      },
      {
        id: 'r3d',
        conditions: [{ field: 'vehicle_category', values: ['motorcycle'] }],
        pricingSource: 'labor_hours',
        hours: 2,
      },
    ],
  },
  {
    id: 'inspection',
    label: 'Inspection',
    description: 'Pre-delivery inspection fee covering safety checks and compliance.',
    icon: 'verified',
    enabled: true,
    model: 'flat',
    availableModels: ['flat'],
    ekhoFieldName: 'Inspection fee',
    fallback: { amountModel: 'flat', amount: 99, isLabor: true, hours: 1 },
    rules: [
      {
        id: 'r_insp_age',
        conditions: [],
        pricingSource: 'stepped',
        bracketField: 'inventory_age',
        bracketIsLabor: true,
        brackets: [
          { from: 0, to: 30, amount: 1 },
          { from: 30, to: 90, amount: 2 },
          { from: 90, to: null, amount: 3 },
        ],
      },
    ],
  },
  {
    id: 'freight',
    label: 'Freight',
    description: 'Factory-to-dealer shipping charges passed through to the buyer.',
    icon: 'package_2',
    enabled: true,
    model: 'flat',
    availableModels: ['flat'],
    ekhoFieldName: 'Freight fee',
    fallback: { amountModel: 'flat', amount: 399 },
    rules: [
      {
        id: 'r_freight_cc',
        conditions: [],
        pricingSource: 'stepped',
        bracketField: 'cc',
        brackets: [
          { from: 0, to: 300, amount: 299 },
          { from: 300, to: 700, amount: 499 },
          { from: 700, to: 1200, amount: 699 },
          { from: 1200, to: null, amount: 899 },
        ],
      },
    ],
  },
  {
    id: 'payments',
    label: 'Payment processing',
    tocLabel: 'Payment',
    description: 'Fees passed to buyers when they choose specific payment methods at checkout.',
    icon: 'credit_card',
    enabled: true,
    model: 'flat',
    availableModels: ['flat'],
    ekhoFieldName: 'Payment processing fee',
    fallback: { amountModel: 'flat', amount: 0 },
    rules: [
      {
        id: 'r_pay_card',
        conditions: [{ field: 'payment_method', values: ['card'] }],
        pricingSource: 'fixed',
        amountModel: 'pct_vehicle_price',
        amount: 2.9,
      },
      {
        id: 'r_pay_ach',
        conditions: [{ field: 'payment_method', values: ['ach'] }],
        pricingSource: 'fixed',
        amountModel: 'flat',
        amount: 0,
      },
      {
        id: 'r_pay_bnpl',
        conditions: [{ field: 'payment_method', values: ['bnpl'] }],
        pricingSource: 'fixed',
        amountModel: 'pct_vehicle_price',
        amount: 3.5,
      },
      {
        id: 'r_pay_financing',
        conditions: [{ field: 'payment_method', values: ['financing'] }],
        pricingSource: 'fixed',
        amountModel: 'flat',
        amount: 0,
      },
      {
        id: 'r_pay_crypto',
        conditions: [{ field: 'payment_method', values: ['crypto'] }],
        pricingSource: 'fixed',
        amountModel: 'pct_vehicle_price',
        amount: 1.5,
      },
    ],
  },
  {
    id: 'custom_1',
    label: 'Custom fee one',
    description: 'Example DMS custom fee',
    icon: 'receipt',
    enabled: true,
    model: 'flat',
    availableModels: ['flat'],
    ekhoFieldName: 'Custom fee one',
    fallback: { amountModel: 'flat', amount: 0 },
    rules: [
      {
        id: 'r_custom_1',
        conditions: [],
        pricingSource: 'dms_field',
        dmsFieldName: 'laborprepfee',
      },
    ],
  },
];

export const DEMO_LOCATION = 'Apex';

export interface CommentaryNote {
  sectionId: string;
  title: string;
  notes: string[];
}

export const COMMENTARY: CommentaryNote[] = [
  {
    sectionId: 'business',
    title: 'Business rationale',
    notes: [
      'Fees are one of the most high-touch parts of dealer onboarding. Every dealer has a unique fee structure, and getting it right requires back-and-forth with ops and often eng involvement.',
      'Fee misconfiguration is the biggest driver of order mistakes. Wrong amounts on the bill of sale erode dealer trust and create manual cleanup work.',
      'Fee troubleshooting is difficult today. There is very little transparency into why a given fee was charged, where the value came from, or what rules were evaluated.',
      'Fee changes currently require eng time. Dealers cannot self-serve config updates, so every change flows through support tickets.',
      'Highly custom across dealerships. No two dealers structure fees the same way, especially for delivery, assembly, and labor-based charges.',
      'This redesign speeds up onboarding (dealers can self-configure), reduces order errors (transparent rule evaluation), eliminates eng dependency for config changes, and gives ops full visibility into how fees resolve per vehicle.',
      'Unlocks new revenue models. Percentage-based fees, labor-hour calculations, and distance-based delivery pricing let dealers capture value they are currently leaving on the table.',
    ],
  },
  {
    sectionId: 'principles',
    title: 'Design principles',
    notes: [
      'Complete configurability.',
      'Total transparency.',
      'Conditions decoupled from pricing: "when does this fee apply?" is answered separately from "how is it calculated?"',
      'Extensible paradigm for custom fees.',
    ],
  },
  {
    sectionId: 'modal-split',
    title: 'Modal split rationale',
    notes: [
      'The previous design mixed "when does this fee apply" with "how is it calculated" into a single "Source / driver" dropdown. Selecting "Inventory attributes > Vehicle condition > Used" set BOTH the condition AND implied the pricing structure.',
      'The new modal splits into two sections: "Applies when" (conditions) and "Fee calculation" (pricing source). This makes the data model visible in the UI and enables combinations the old design could not express.',
      'Conditions come in two flavors: explicit (dealer-configured filters like "Used vehicles" or "Payment: Card") and implicit (auto-generated from the pricing source, like "DMS field has a value").',
      'Implicit conditions make data dependencies visible. If a DMS field rule reads from "setup_hrs" and that field is blank for a vehicle, it is obvious why the rule was skipped.',
      'Labor is now a pricing source ("Labor hours") instead of a toggle. This simplifies the modal and eliminates the question of "what is labor + DMS?".',
    ],
  },
  {
    sectionId: 'limitations',
    title: 'Limitations of current design',
    notes: [
      'Multi-field DMS sum (e.g., summing assembly_hrs + accessory_install_hrs + pdi_hrs from DMS) is V2. Current DMS rule maps to a single field only.',
      'A rule can only use one pricing source. Cannot combine labor hours with a flat fee on the same rule.',
      'No configurability over combining two fee types together for how they display in Checkout and on the Bill of Sale.',
      'Some fees are known on the VDP while others depend on buyer selections in Checkout. This design does not address how or when fees are surfaced to the buyer across those two contexts.',
      'Several pricing sources have upstream dependencies that do not exist yet (markup on cost requires a shipping API, delivery distance requires a distance calculation service).',
    ],
  },
  {
    sectionId: 'decisions',
    title: 'Decisions',
    notes: [
      'All filters on a rule must match. If a rule has [Used] and [SxS], both must be true. To match multiple values within one filter (e.g., ATV or SxS), select them in the same filter row.',
      'Data requirements are auto-generated and read-only. They appear when the pricing source depends on per-vehicle data (From your DMS, Set per vehicle in Ekho, or a tiered pricing field).',
      'Fee types cannot be combined on a single rule. If a dealer needs both labor and a parts fee, they use separate fee sections.',
      'Condition chips on rule rows replace the old auto-generated label. Explicit conditions get solid chips, implicit data conditions get lighter/dotted chips.',
    ],
  },
  {
    sectionId: 'conditions',
    title: 'Conditions',
    notes: [
      'Eight condition fields available: Vehicle condition, Vehicle category, Make, Engine size (CC), Days in stock, Buyer\'s state, Payment method, Delivery distance.',
      'Conditions are optional. A rule with no conditions applies to all vehicles (subject to implicit data conditions).',
      'Multiple filters on a rule all must match.',
      'Within a single condition, values are OR: vehicle_category = [ATV, SxS] matches either.',
    ],
  },
  {
    sectionId: 'pricing',
    title: 'Pricing sources',
    notes: [
      'Six pricing sources: From your DMS, Set per vehicle in Ekho, Fixed amount, Labor hours, Tiered pricing, Markup on cost.',
      'From your DMS and Set per vehicle in Ekho auto-add data requirements (data must exist for the vehicle).',
      'Fixed amount replaces the old inline amount editors. Supports flat fee, % of vehicle price, or % of total purchase.',
      'Labor hours replaces the old labor toggle. Hours x shop rate = fee.',
      'Tiered pricing supports any numeric field (engine size, days in stock, delivery distance).',
      'Markup on cost supports flat dollar or percentage markup.',
    ],
  },
  {
    sectionId: 'fallback',
    title: 'Fallback',
    notes: [
      'Named "Fallback" to emphasize this is only used when no rule matches.',
      'Always the last item in the priority list. Applied when no rule matches.',
      'Configurable as flat fee or percentage (same dropdown as rules).',
    ],
  },
  {
    sectionId: 'sale',
    title: 'Document fee',
    notes: [
      'Currently hard-coded as a single flat fee per dealer. This adds rules so dealers can vary doc fee by condition.',
      'Most dealers charge $199-$499. Some states cap doc fees.',
    ],
  },
  {
    sectionId: 'delivery',
    title: 'Delivery models',
    notes: [
      'Most requested fee enhancement. Dealers want distance-based pricing instead of one flat rate.',
      'Tiered pricing is the most common ask: "free under 25 mi, $199 for 25-50, $349 for 50-100."',
      'Per-mile and markup models cover edge cases for high-value vehicles.',
    ],
  },
  {
    sectionId: 'payments',
    title: 'Payment fees',
    notes: [
      'Payment fees use the same rules system. The payment method becomes a condition, and the fee amount is set via the fixed pricing source.',
      'Each payment method gets flat fee or percentage configuration.',
      'Credit card surcharging legality varies by state. We handle compliance server-side.',
    ],
  },
  {
    sectionId: 'naming',
    title: 'Fee naming',
    notes: [
      'Every fee name is editable. The name flows to the VDP, checkout, and bill of sale.',
      'No built-in/custom distinction. All fees can be renamed, reconfigured, or removed.',
      'Default fees (Document, Delivery, Assembly, etc.) are pre-configured starting points. Dealers can rename or remove any of them.',
    ],
  },
  {
    sectionId: 'moved',
    title: 'Moved fields',
    notes: [
      'License Number and Primary Contract Signer are not fees. They were on the old "Sales" tab for historical reasons.',
      'Moving them to Business Details keeps the Fees page focused and reduces confusion.',
    ],
  },
];
