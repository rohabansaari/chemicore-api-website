// PLACEHOLDER CATALOGUE — replace with Chemi-Core's confirmed product list before launch.
export type Category = 'API' | 'Excipient' | 'Packaging';

export interface Product {
  name: string;
  category: Category;
  cas: string | null;
  grades: string;
  use: string;
}

export const products: Product[] = [
  { name: 'Paracetamol', category: 'API', cas: '103-90-2', grades: 'BP / USP', use: 'Analgesic, antipyretic' },
  { name: 'Metformin hydrochloride', category: 'API', cas: '1115-70-4', grades: 'BP / USP', use: 'Antidiabetic' },
  { name: 'Amoxicillin trihydrate', category: 'API', cas: '61336-70-7', grades: 'BP / USP', use: 'Penicillin antibiotic' },
  { name: 'Ibuprofen', category: 'API', cas: '15687-27-1', grades: 'BP / USP', use: 'NSAID, analgesic' },
  { name: 'Omeprazole', category: 'API', cas: '73590-58-6', grades: 'BP / USP', use: 'Proton pump inhibitor' },
  { name: 'Azithromycin dihydrate', category: 'API', cas: '117772-70-0', grades: 'USP', use: 'Macrolide antibiotic' },
  { name: 'Ciprofloxacin hydrochloride', category: 'API', cas: '86393-32-0', grades: 'BP / USP', use: 'Fluoroquinolone antibiotic' },
  { name: 'Diclofenac sodium', category: 'API', cas: '15307-79-6', grades: 'BP / USP', use: 'NSAID' },
  { name: 'Microcrystalline cellulose', category: 'Excipient', cas: '9004-34-6', grades: 'PH 101 / 102', use: 'Filler, binder' },
  { name: 'Lactose monohydrate', category: 'Excipient', cas: '64044-51-5', grades: 'BP / USP-NF', use: 'Filler, diluent' },
  { name: 'Magnesium stearate', category: 'Excipient', cas: '557-04-0', grades: 'BP / USP-NF', use: 'Lubricant' },
  { name: 'Povidone K30', category: 'Excipient', cas: '9003-39-8', grades: 'BP / USP', use: 'Binder' },
  { name: 'Croscarmellose sodium', category: 'Excipient', cas: '74811-65-7', grades: 'USP-NF', use: 'Disintegrant' },
  { name: 'Colloidal silicon dioxide', category: 'Excipient', cas: '7631-86-9', grades: 'BP / USP-NF', use: 'Glidant' },
  { name: 'Alu-Alu cold form foil', category: 'Packaging', cas: null, grades: 'OPA / Alu / PVC', use: 'Moisture-barrier blisters' },
  { name: 'PVC / PVDC film', category: 'Packaging', cas: null, grades: '40 – 90 gsm', use: 'Thermoform blister film' },
  { name: 'Hard gelatin capsule shells', category: 'Packaging', cas: null, grades: 'Sizes 00 – 4', use: 'Capsule filling' },
  { name: 'HDPE bottles & closures', category: 'Packaging', cas: null, grades: '30 – 500 ml', use: 'Tablets and liquids' },
];
