/**
 * Mock fee configuration data for the Fees Settings prototype.
 */

// ---------------------------------------------------------------------------
// Rule types and amount models
// ---------------------------------------------------------------------------

export type RuleType = 'dms' | 'ekho_single_unit' | 'inventory_attributes' | 'order_attributes';

export type AmountModel =
  | 'flat'
  | 'pct_vehicle_price'
  | 'pct_total_purchase';

export type InventoryAttribute = 'vehicle_condition' | 'cc' | 'inventory_age' | 'vehicle_category' | 'make' | 'make_model' | 'make_model_year' | 'powertrain_type';
export type OrderAttribute = 'delivery_distance' | 'payment_option' | 'delivery_state' | 'accessory_selection' | 'fulfillment_option' | 'promo_status';

export const RULE_TYPE_LABELS: Record<RuleType, string> = {
  dms: 'DMS lookup',
  ekho_single_unit: 'Ekho single unit lookup',
  inventory_attributes: 'Major unit attributes',
  order_attributes: 'Order attributes',
};

export const AMOUNT_MODEL_LABELS: Record<AmountModel, string> = {
  flat: 'Flat fee',
  pct_vehicle_price: '% of vehicle price',
  pct_total_purchase: '% of total purchase price',
};

export const INVENTORY_ATTRIBUTE_LABELS: Record<InventoryAttribute, string> = {
  vehicle_condition: 'Vehicle condition',
  cc: 'CC',
  inventory_age: 'Inventory age',
  vehicle_category: 'Vehicle category',
  make: 'Make',
  make_model: 'Make model',
  make_model_year: 'Make model year',
  powertrain_type: 'Powertrain type',
};

export const ORDER_ATTRIBUTE_LABELS: Record<OrderAttribute, string> = {
  delivery_distance: 'Delivery distance',
  payment_option: 'Payment option',
  delivery_state: 'Delivery state',
  accessory_selection: 'Accessory selection',
  fulfillment_option: 'Fulfillment option',
  promo_status: 'Promo status',
};

/** Match values for inventory attributes that have a finite set of options */
export const INVENTORY_ATTRIBUTE_VALUES: Partial<Record<InventoryAttribute, Record<string, string>>> = {
  vehicle_condition: { new: 'New vehicles', used: 'Used vehicles' },
  vehicle_category: { motorcycle: 'Motorcycles', atv: 'ATVs', sxs: 'Side-by-Sides' },
};

/** Inventory attributes that use stepped brackets instead of a single match value */
export const BRACKETED_INVENTORY_ATTRIBUTES: Set<InventoryAttribute> = new Set(['inventory_age', 'cc']);

/** Units and labels for bracketed inventory attributes */
export const INVENTORY_BRACKET_UNITS: Partial<Record<InventoryAttribute, string>> = {
  inventory_age: 'day ',
  cc: 'cc ',
};

/** Bracket range labels (for display in sublabels) */
export function formatBracketRange(attr: InventoryAttribute | undefined, bracket: SteppedBracket): string {
  if (attr === 'inventory_age') {
    if (bracket.to == null) return `${bracket.from}+ days`;
    return `${bracket.from}–${bracket.to} days`;
  }
  if (attr === 'cc') {
    if (bracket.to == null) return `${bracket.from}+ cc`;
    return `${bracket.from}–${bracket.to} cc`;
  }
  if (bracket.to == null) return `${bracket.from}+`;
  return `${bracket.from}–${bracket.to}`;
}

export type PaymentMethod = 'ach' | 'card' | 'bnpl' | 'crypto' | 'financing';

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

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  ach: 'ACH',
  card: 'Card',
  bnpl: 'Buy now pay later',
  crypto: 'Crypto',
  financing: 'Financing',
};

// ---------------------------------------------------------------------------
// Fee model (for the section-level fee model dropdown, e.g. Delivery)
// ---------------------------------------------------------------------------

export type FeeModel = 'flat' | 'percentage' | 'per_mile' | 'stepped' | 'markup';

export const MODEL_LABELS: Record<FeeModel, string> = {
  flat: 'Flat fee',
  percentage: 'Percentage',
  per_mile: 'Per-mile',
  stepped: 'Stepped (brackets)',
  markup: 'Markup on cost',
};

// ---------------------------------------------------------------------------
// Stepped brackets (for delivery distance)
// ---------------------------------------------------------------------------

export interface SteppedBracket {
  from: number;
  to: number | null;
  amount: number;
}

// ---------------------------------------------------------------------------
// Rule interface
// ---------------------------------------------------------------------------

export interface FeeRule {
  id: string;
  type: RuleType;
  /** DMS field name (only for type=dms) */
  dmsFieldName?: string;
  /** Ekho field display name (only for type=ekho_single_unit, read-only) */
  ekhoFieldName?: string;
  /** Selected attribute (only for type=inventory_attributes) */
  inventoryAttribute?: InventoryAttribute;
  /** Match value for the selected attribute (e.g., "used" for vehicle_condition) */
  attributeValue?: string;
  /** Selected attribute (only for type=order_attributes) */
  orderAttribute?: OrderAttribute;
  /** Selected payment method (only for orderAttribute=payment_option) */
  paymentMethod?: PaymentMethod;
  /** Selected US states (only for orderAttribute=delivery_state) */
  states?: string[];
  /** Fee model for delivery distance rules */
  feeModel?: FeeModel;
  /** Markup type: flat dollar or percentage (only for feeModel=markup) */
  markupType?: 'flat' | 'percentage';
  /** Stepped brackets (only for feeModel=stepped) */
  brackets?: SteppedBracket[];
  /** Amount model (only for inventory_attributes and order_attributes) */
  amountModel?: AmountModel;
  /** Amount value (only for non-labor inventory_attributes and order_attributes) */
  amount?: number;
  /** Whether this rule maps labor hours instead of a fee amount */
  isLabor?: boolean;
  /** Labor hours (only when isLabor=true and type is inventory/order attributes) */
  hours?: number;
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
  /** Shorter label for the table of contents (falls back to label) */
  tocLabel?: string;
  description: string;
  icon: string;
  enabled: boolean;
  model: FeeModel;
  availableModels: FeeModel[];
  fallback: FallbackConfig;
  rules: FeeRule[];
  /** Read-only Ekho field name for the single-unit rule */
  ekhoFieldName: string;
  /** True for dealer-created custom fees */
  isCustom?: boolean;
}


// ---------------------------------------------------------------------------
// Helpers: auto-generate label and sublabel for a rule
// ---------------------------------------------------------------------------

export function getRuleLabel(rule: FeeRule): string {
  switch (rule.type) {
    case 'dms':
      return 'DMS lookup';
    case 'ekho_single_unit':
      return 'Ekho single unit override';
    case 'inventory_attributes': {
      if (!rule.inventoryAttribute) return 'Inventory attribute rule';
      const attrLabel = INVENTORY_ATTRIBUTE_LABELS[rule.inventoryAttribute];
      if (rule.brackets?.length) {
        return attrLabel;
      }
      if (rule.attributeValue) {
        const values = INVENTORY_ATTRIBUTE_VALUES[rule.inventoryAttribute];
        const valueLabel = values?.[rule.attributeValue] ?? rule.attributeValue;
        return valueLabel;
      }
      return attrLabel;
    }
    case 'order_attributes':
      if (rule.orderAttribute === 'payment_option' && rule.paymentMethod) {
        return `Payment: ${PAYMENT_METHOD_LABELS[rule.paymentMethod]}`;
      }
      if (rule.orderAttribute === 'delivery_state' && rule.states?.length) {
        return `Delivery in ${rule.states.join(', ')}`;
      }
      return rule.orderAttribute
        ? ORDER_ATTRIBUTE_LABELS[rule.orderAttribute]
        : 'Order attribute rule';
  }
}

function formatLaborCalc(hours: number | undefined, shopRate: number): string {
  if (hours == null) return 'Not configured';
  return `${hours} hrs x $${shopRate}/hr = $${(hours * shopRate).toFixed(0)}`;
}

export function getRuleSublabel(rule: FeeRule, shopRate = 75): string {
  switch (rule.type) {
    case 'dms':
      if (!rule.dmsFieldName) return 'No field mapped';
      return rule.isLabor ? `Field: ${rule.dmsFieldName} (hrs x $${shopRate}/hr)` : `Field: ${rule.dmsFieldName}`;
    case 'ekho_single_unit':
      return rule.isLabor ? `Per-vehicle hours x $${shopRate}/hr` : (rule.ekhoFieldName ? `Field: ${rule.ekhoFieldName}` : 'Per-vehicle override');
    case 'order_attributes':
      if (rule.isLabor) return formatLaborCalc(rule.hours, shopRate);
      if (rule.orderAttribute === 'payment_option' && rule.paymentMethod) {
        if (rule.amount == null) return 'Not configured';
        if (rule.amountModel === 'flat') return `$${rule.amount} flat fee`;
        return `${rule.amount}% ${AMOUNT_MODEL_LABELS[rule.amountModel].replace('% ', '').toLowerCase()}`;
      }
      if (rule.orderAttribute === 'delivery_state' && rule.states?.length) {
        if (rule.feeModel === 'markup') {
          return rule.markupType === 'flat'
            ? `$${rule.amount ?? 0} flat markup on cost`
            : `${rule.amount ?? 0}% markup on cost`;
        }
        if (rule.amount == null || !rule.amountModel) return 'Not configured';
        if (rule.amountModel === 'flat') return `$${rule.amount} flat fee`;
        return `${rule.amount}% ${AMOUNT_MODEL_LABELS[rule.amountModel].replace('% ', '').toLowerCase()}`;
      }
      if (rule.orderAttribute === 'delivery_distance' && rule.feeModel) {
        if (rule.feeModel === 'flat') return `$${rule.amount ?? 0} flat fee`;
        if (rule.feeModel === 'per_mile') return `$${rule.amount ?? 0}/mi`;
        if (rule.feeModel === 'markup') {
          return rule.markupType === 'flat'
            ? `$${rule.amount ?? 0} flat markup on cost`
            : `${rule.amount ?? 0}% markup on cost`;
        }
        if (rule.feeModel === 'stepped') {
          const n = rule.brackets?.length ?? 0;
          return n > 0 ? `${n} distance bracket${n === 1 ? '' : 's'}` : 'Stepped brackets';
        }
        return MODEL_LABELS[rule.feeModel];
      }
      if (rule.amount == null || !rule.amountModel) return 'Not configured';
      if (rule.amountModel === 'flat') return `$${rule.amount} flat fee`;
      return `${rule.amount}% ${AMOUNT_MODEL_LABELS[rule.amountModel].replace('% ', '').toLowerCase()}`;
    case 'inventory_attributes':
      if (rule.brackets?.length) {
        const n = rule.brackets.length;
        const unit = INVENTORY_BRACKET_UNITS[rule.inventoryAttribute!]?.trim() ?? '';
        if (rule.isLabor) return `${n} ${unit} bracket${n === 1 ? '' : 's'}, labor hours`;
        return `${n} ${unit} bracket${n === 1 ? '' : 's'}`;
      }
      if (rule.isLabor) return formatLaborCalc(rule.hours, shopRate);
      if (rule.amount == null || !rule.amountModel) return 'Not configured';
      if (rule.amountModel === 'flat') return `$${rule.amount} flat fee`;
      return `${rule.amount}% ${AMOUNT_MODEL_LABELS[rule.amountModel].replace('% ', '').toLowerCase()}`;
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
        type: 'inventory_attributes',
        inventoryAttribute: 'vehicle_condition',
        attributeValue: 'used',
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
        type: 'order_attributes',
        orderAttribute: 'delivery_state',
        states: ['AK', 'HI'],
        feeModel: 'markup',
        markupType: 'percentage',
        amount: 20,
      },
      {
        id: 'r2b',
        type: 'order_attributes',
        orderAttribute: 'delivery_distance',
        feeModel: 'stepped',
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
        type: 'dms',
        dmsFieldName: 'setup_hrs',
        isLabor: true,
      },
      {
        id: 'r3b',
        type: 'inventory_attributes',
        inventoryAttribute: 'vehicle_category',
        attributeValue: 'sxs',
        isLabor: true,
        hours: 4,
      },
      {
        id: 'r3c',
        type: 'inventory_attributes',
        inventoryAttribute: 'vehicle_category',
        attributeValue: 'atv',
        isLabor: true,
        hours: 3,
      },
      {
        id: 'r3d',
        type: 'inventory_attributes',
        inventoryAttribute: 'vehicle_category',
        attributeValue: 'motorcycle',
        isLabor: true,
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
        type: 'inventory_attributes',
        inventoryAttribute: 'inventory_age',
        isLabor: true,
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
        type: 'inventory_attributes',
        inventoryAttribute: 'cc',
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
        type: 'order_attributes',
        orderAttribute: 'payment_option',
        paymentMethod: 'card',
        amountModel: 'pct_vehicle_price',
        amount: 2.9,
      },
      {
        id: 'r_pay_ach',
        type: 'order_attributes',
        orderAttribute: 'payment_option',
        paymentMethod: 'ach',
        amountModel: 'flat',
        amount: 0,
      },
      {
        id: 'r_pay_bnpl',
        type: 'order_attributes',
        orderAttribute: 'payment_option',
        paymentMethod: 'bnpl',
        amountModel: 'pct_vehicle_price',
        amount: 3.5,
      },
      {
        id: 'r_pay_financing',
        type: 'order_attributes',
        orderAttribute: 'payment_option',
        paymentMethod: 'financing',
        amountModel: 'flat',
        amount: 0,
      },
      {
        id: 'r_pay_crypto',
        type: 'order_attributes',
        orderAttribute: 'payment_option',
        paymentMethod: 'crypto',
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
    isCustom: true,
    fallback: { amountModel: 'flat', amount: 0 },
    rules: [
      {
        id: 'r_custom_1',
        type: 'dms',
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
      'One modal to rule them all.',
      'Extensible paradigm for custom fees.',
    ],
  },
  {
    sectionId: 'limitations',
    title: 'Limitations of current design',
    notes: [
      'Difficult to know the sub-types when selecting rule types if not intuitive by nomenclature.',
      'Multi-field DMS sum (e.g., summing assembly_hrs + accessory_install_hrs + pdi_hrs from DMS) is V2. This also does not consider summing labor hours across individual parts on a unit. Current DMS rule maps to a single field only.',
      'A rule is either labor or non-labor. You cannot combine labor hours with a flat fee amount on the same rule.',
      'No configurability over combining two fee types together for how they display in Checkout and on the Bill of Sale. For example, you cannot merge an assembly fee and an inspection fee into a single line item.',
      'No ability to rename fee types for how they show up in Settings, in Checkout, or on the Bill of Sale. The label is fixed.',
      'Some fees are known on the VDP (e.g., document fee, assembly), while others depend on buyer selections in Checkout (e.g., delivery distance, payment method). This design does not address how or when fees are surfaced to the buyer across those two contexts.',
      'Rule submenus and submenu designs were not fully explored. Many attribute types would need their own match-value pickers, condition builders, or range inputs. The ones shown here (e.g., vehicle condition with New/Used) illustrate common use cases but are not exhaustive.',
      'Several rule types shown in the prototype have upstream dependencies that do not exist yet. For example, markup on cost requires knowing the dealer\'s delivery cost (likely via a shipping API or manual entry), and delivery distance requires a distance calculation service. These are prototyped to show the configurability model, not to imply the dependencies are resolved.',
    ],
  },
  {
    sectionId: 'decisions',
    title: 'Decisions',
    notes: [
      'Labor hours is a top-level toggle on a rule, not a standalone rule type. We considered making it a 5th rule type (peer to DMS, Ekho, etc.), but labor hours has the same "where does the value come from?" problem as other fees. The sources (DMS, Ekho single unit, inventory attributes) still apply, they just resolve to hours instead of amounts. Making it a toggle preserves the full rules methodology for sourcing.',
      'Fee types cannot be combined on a single rule. A rule is either labor-based (hours x shop rate) or amount-based (flat, percentage, etc.). If a dealer needs both labor and a parts fee, they use separate fee sections.',
      'Every rule can be cleanly summarized: the title says when the rule applies (e.g., "Used vehicles", "Credit card"), and the description says the fee type and amount (e.g., "$349 flat fee", "3 hrs x $75/hr = $225"). This title/description pattern validates the data model: if a rule cannot be expressed this way, it is too complex.',
      'The title of each rule row is always the most granular dropdown selection available for that rule type. For example, "Used vehicles" (not "Vehicle condition"), "Payment: Card" (not "Payment option"), "Delivery in AK, HI" (not "Delivery state"). The parent attribute name is visible in the modal; the priority list surface shows the specific match value.',
    ],
  },
  {
    sectionId: 'rules',
    title: 'Rules',
    notes: [
      'Each rule answers three questions: (1) Is this labor or non-labor? (top-level toggle), (2) Where does the value come from? ("Source / driver": DMS, Ekho single unit, inventory attributes, or order attributes), (3) What is the value? (amount or hours, depending on labor toggle).',
      'DMS and Ekho single unit source from external systems, so no amount input in the modal. Inventory and order attributes let the user set amounts/hours against attribute conditions (full attribute builder not prototyped).',
      'Rule labels and descriptions are auto-generated from configuration. No manual naming.',
    ],
  },
  {
    sectionId: 'amount',
    title: 'Amount model',
    notes: [
      'Only applies to non-labor rules. Labor rules resolve to hours (multiplied by shop rate), so the amount model is irrelevant.',
      'Three options in a single dropdown: Flat fee, % of vehicle price, % of total purchase price.',
      'Only Inventory attribute and Order attribute rules get amount configuration. DMS and Ekho single unit source from external systems.',
    ],
  },
  {
    sectionId: 'fallback',
    title: 'Fallback',
    notes: [
      'Renamed from "Default" to "Fallback" to be clearer about its role.',
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
      'Stepped brackets are the most common ask: "free under 25 mi, $199 for 25-50, $349 for 50-100."',
      'Per-mile and markup models cover edge cases for high-value vehicles.',
    ],
  },
  {
    sectionId: 'labor',
    title: 'Labor hours',
    notes: [
      'Labor is a top-level toggle on a rule, not a rule type. When enabled, the same four source types (DMS, Ekho single unit, inventory attributes, order attributes) resolve to hours instead of a dollar amount.',
      'Fee total for labor rules = hours x shop rate. Shop labor rate is a dealer-wide setting at the top of the Fees page.',
      'DMS + labor: the mapped field contains hours. Ekho single unit + labor: per-vehicle hours override. Inventory/order attributes + labor: hours input replaces the amount editor.',
      'A rule is either labor or non-labor. Cannot combine labor hours with a flat fee on the same rule.',
      'Common on Assembly and Inspection. Available on all fee types for flexibility, including custom fees.',
      'V2: Multi-field DMS sum (summing hours across multiple DMS fields like assembly_hrs + accessory_install_hrs).',
    ],
  },
  {
    sectionId: 'payments',
    title: 'Payment fees',
    notes: [
      'Payment fees are now handled through the rules system like every other fee, via Order attributes > Payment option.',
      'Payment method submenu: ACH, Card, Buy now pay later, Crypto, Financing.',
      'Each payment method gets flat fee or percentage configuration.',
      'Credit card surcharging legality varies by state. We handle compliance server-side.',
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
