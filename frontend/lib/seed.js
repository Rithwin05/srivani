import 'server-only';
import { randomUUID } from 'crypto';
import { slugify } from './taxonomy';

const school = [];
const primary = [['English Reader', 'Navneet'], ['Maths Magic', 'Telugu Akademi']];
for (let c = 1; c <= 5; c++) primary.forEach(([s, pub]) => school.push({ name: `${s} – Class ${c}`, className: `Class ${c}`, subject: s.includes('Maths') ? 'Mathematics' : 'English', publisher: pub, price: 120 + c * 15 }));
const subjects = [['Mathematics', 'Telugu Akademi', 'maths'], ['Science', 'Telugu Akademi', 'physics chemistry biology'], ['Social Studies', 'Telugu Akademi', 'social history geography civics'], ['English', 'Vikram Publishers', 'grammar'], ['Telugu', 'Telugu Akademi', 'telugu vachakam']];
for (let c = 6; c <= 10; c++) subjects.forEach(([s, pub, tags]) => school.push({ name: `${s} – Class ${c}`, className: `Class ${c}`, subject: s, publisher: pub, price: 180 + c * 20, tags }));
school.push({ name: 'Mathematics Class 10 – Vikram Study Guide', className: 'Class 10', subject: 'Mathematics', publisher: 'Vikram Publishers', price: 349, tags: 'maths guide', pick: true, trending: true });
school.push({ name: 'Physical Science Class 10 – Narayana Guide', className: 'Class 10', subject: 'Science', publisher: 'Narayana Publications', price: 299, tags: 'physics chemistry guide' });
school.push({ name: 'Mathematics Class 10 – CBSE (R.D. Sharma)', className: 'Class 10', subject: 'Mathematics', author: 'R.D. Sharma', publisher: 'Dhanpat Rai', price: 625, tags: 'cbse maths reference', trending: true });
school.push({ name: 'Mathematics Class 9 – CBSE (R.S. Aggarwal)', className: 'Class 9', subject: 'Mathematics', author: 'R.S. Aggarwal', publisher: 'Bharati Bhawan', price: 545, tags: 'cbse maths' });

const college = [
  { name: 'Mathematics 1A – Intermediate First Year', className: 'Intermediate', subject: 'Mathematics', publisher: 'Telugu Akademi', price: 245, tags: 'mpc inter' },
  { name: 'Physics – Intermediate First Year', className: 'Intermediate', subject: 'Physics', publisher: 'Telugu Akademi', price: 230, tags: 'mpc bipc inter' },
  { name: 'Chemistry – Intermediate Second Year', className: 'Intermediate', subject: 'Chemistry', publisher: 'Telugu Akademi', price: 240, tags: 'mpc bipc inter' },
  { name: 'Botany & Zoology – Intermediate (Deepthi Guide)', className: 'Intermediate', subject: 'Biology', publisher: 'Deepthi Publications', price: 390, tags: 'bipc neet inter' },
  { name: 'Commerce & Accountancy – Intermediate (CEC)', className: 'Intermediate', subject: 'Commerce', publisher: 'Vikram Publishers', price: 310, tags: 'cec inter' },
  { name: 'Higher Engineering Mathematics', className: 'Engineering', subject: 'Mathematics', author: 'B.S. Grewal', publisher: 'Khanna Publishers', price: 895, tags: 'btech engineering maths', pick: true },
  { name: 'Programming in ANSI C', className: 'Engineering', subject: 'Computer Science', author: 'E. Balagurusamy', publisher: 'McGraw Hill', price: 560, tags: 'btech cse programming' },
  { name: 'Data Structures Using C', className: 'Engineering', subject: 'Computer Science', author: 'Reema Thareja', publisher: 'Oxford', price: 620, tags: 'btech cse' },
  { name: 'Financial Accounting – B.Com First Year', className: 'Degree', subject: 'Commerce', publisher: 'Himalaya Publishing', price: 380, tags: 'bcom degree' },
  { name: 'Business Statistics – B.Com / BBA', className: 'Degree', subject: 'Statistics', author: 'S.P. Gupta', publisher: 'Sultan Chand', price: 425, tags: 'bcom bba degree' },
  { name: 'Organic Chemistry – B.Sc Second Year', className: 'Degree', subject: 'Chemistry', publisher: 'Telugu Akademi', price: 330, tags: 'bsc degree' },
];

const exams = [
  { name: 'Quantitative Aptitude for Competitive Examinations', author: 'R.S. Aggarwal', publisher: 'S. Chand', exam: 'SSC', subject: 'Mathematics', price: 695, tags: 'maths aptitude ssc banking railways', trending: true, pick: true },
  { name: "Lucent's General Knowledge", author: 'Dr. Binay Karna', publisher: 'Lucent Publications', exam: 'SSC', subject: 'General Knowledge', price: 250, tags: 'gk ssc railways police', trending: true },
  { name: 'Indian Polity', author: 'M. Laxmikanth', publisher: 'McGraw Hill', exam: 'UPSC', subject: 'Polity', price: 895, tags: 'upsc tspsc appsc polity', pick: true },
  { name: 'A Modern Approach to Verbal & Non-Verbal Reasoning', author: 'R.S. Aggarwal', publisher: 'S. Chand', exam: 'Banking', subject: 'Reasoning', price: 745, tags: 'reasoning banking ssc ibps sbi' },
  { name: 'Telangana History, Culture & Movement – TSPSC', publisher: 'Vikram Publishers', exam: 'TSPSC / APPSC', subject: 'History', price: 420, tags: 'tspsc group 1 group 2 group 4 telangana', trending: true, language: 'Telugu' },
  { name: 'TSPSC Group 4 Complete Guide (Telugu Medium)', publisher: 'Vikram Publishers', exam: 'TSPSC / APPSC', subject: 'General Studies', price: 650, tags: 'tspsc group 4 telugu', language: 'Telugu' },
  { name: 'Objective General English', author: 'S.P. Bakshi', publisher: 'Arihant', exam: 'SSC', subject: 'English', price: 425, tags: 'english ssc banking' },
  { name: 'Word Power Made Easy', author: 'Norman Lewis', publisher: 'Goyal', exam: 'Banking', subject: 'English', price: 199, tags: 'vocabulary english', trending: true },
  { name: 'RRB NTPC Practice Sets (30 Sets)', publisher: 'Arihant', exam: 'Railways', subject: 'General Studies', price: 345, tags: 'railways rrb ntpc group d' },
  { name: 'TS Police Constable & SI Guide', publisher: 'Arihant', exam: 'Police', subject: 'General Studies', price: 495, tags: 'police constable si telangana' },
  { name: 'TET Paper 2 – Mathematics & Science Guide', publisher: 'Vikram Publishers', exam: 'Teaching', subject: 'Pedagogy', price: 480, tags: 'tet dsc trt teaching' },
  { name: 'IBPS PO Prelims & Mains Guide', publisher: 'Disha', exam: 'Banking', subject: 'General Studies', price: 575, tags: 'ibps po sbi banking' },
  { name: 'Indian Economy', author: 'Ramesh Singh', publisher: 'McGraw Hill', exam: 'UPSC', subject: 'Economy', price: 850, tags: 'upsc economy' },
  { name: 'Certificate Physical & Human Geography', author: 'G.C. Leong', publisher: 'Oxford', exam: 'UPSC', subject: 'Geography', price: 560, tags: 'upsc geography' },
];

const stationery = [
  ['Classmate A4 Notebook – 172 Pages (Single Line)', 'Notebooks', 'ITC Classmate', 85, 'a4 notebook long book essential', true, true],
  ['Classmate Long Notebook – 200 Pages', 'Notebooks', 'ITC Classmate', 95, 'notebook long book essential', true],
  ['Navneet Practice Notebook – 4 Line (English)', 'Notebooks', 'Navneet', 45, 'practice notebook english four line essential', true],
  ['Camlin Geometry Box – Exam Series', 'Geometry & Maths', 'Camlin', 180, 'geometry box compass essential', true, true],
  ['Reynolds 045 Fine Carbure Ball Pen (Pack of 10)', 'Pens', 'Reynolds', 100, 'ball pen blue essential', true],
  ['Cello Butterflow Ball Pen (Pack of 5)', 'Pens', 'Cello', 50, 'ball pen blue black'],
  ['Pilot V5 Hi-Tecpoint Pen', 'Pens', 'Pilot', 60, 'gel pen exam'],
  ['Apsara Platinum Extra Dark Pencils (Pack of 10)', 'Pencils & Erasers', 'Apsara', 60, 'pencil essential', true],
  ['Natraj 621 Pencil + Eraser + Sharpener Kit', 'Pencils & Erasers', 'Natraj', 40, 'pencil eraser sharpener essential', true],
  ['Fevistick Glue Stick 15g', 'Adhesives', 'Pidilite', 40, 'glue stick craft essential', true],
  ['JK Copier A4 Paper – 500 Sheets (75 GSM)', 'Paper', 'JK Paper', 320, 'a4 paper ream xerox printing'],
  ['Kangaro HP-45 Stapler with Pins', 'Office Supplies', 'Kangaro', 175, 'stapler office'],
  ['Luxor Highlighter Set (Pack of 5)', 'Pens', 'Luxor', 110, 'highlighter'],
  ['Solo Ring Binder File A4', 'Files & Folders', 'Solo', 140, 'file folder'],
  ['Classmate Drawing Book – A3 (36 Pages)', 'Notebooks', 'ITC Classmate', 70, 'drawing book art essential', true],
  ['Doms Sticky Notes 3x3 (Pack of 400)', 'Office Supplies', 'Doms', 90, 'sticky notes'],
  ['Brown Cover Paper Roll – 10 Metres', 'Paper', 'Generic', 60, 'book cover brown paper school essential', true],
  ['School Bag Name Slips (Pack of 50)', 'Office Supplies', 'Generic', 30, 'name slips labels school'],
];

const art = [
  ['Camel Student Water Colour Cakes – 12 Shades', 'Colours', 'Camlin', 90, 'water colours painting'],
  ['Camel Artist Poster Colours – 12 Shades', 'Colours', 'Camlin', 240, 'poster colours painting', true],
  ['Doms Wax Crayons – 24 Shades', 'Colours', 'Doms', 60, 'crayons kids'],
  ['Faber-Castell Oil Pastels – 25 Shades', 'Colours', 'Faber-Castell', 150, 'oil pastels'],
  ['Brustro Artists Sketch Book – A4 (110 GSM)', 'Sketch & Drawing', 'Brustro', 260, 'sketch book drawing'],
  ['Camlin Sketch Pens – 24 Shades', 'Sketch & Drawing', 'Camlin', 120, 'sketch pens kids'],
  ['Craft Paper Assorted Pack – 100 Sheets', 'Craft', 'Generic', 80, 'craft paper origami'],
  ['Modelling Clay Set – 12 Colours', 'Craft', 'Doms', 110, 'clay kids craft'],
];

const reading = [
  { name: 'Tulasi Dalam (తులసి దళం)', author: 'Yandamuri Veerendranath', publisher: 'Navodaya', subcategory: 'Telugu Novels', language: 'Telugu', price: 250, tags: 'telugu novel thriller', trending: true },
  { name: 'Veyipadagalu (వేయిపడగలు)', author: 'Viswanatha Satyanarayana', publisher: 'Sri Viswanatha Publications', subcategory: 'Telugu Novels', language: 'Telugu', price: 480, tags: 'telugu novel classic jnanpith', pick: true },
  { name: 'Barrister Parvateesam', author: 'Mokkapati Narasimha Sastry', publisher: 'Vishalandhra', subcategory: 'Telugu Novels', language: 'Telugu', price: 220, tags: 'telugu novel humour' },
  { name: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', publisher: 'Universities Press', subcategory: 'Biography', price: 250, tags: 'autobiography inspiration', pick: true },
  { name: 'Atomic Habits', author: 'James Clear', publisher: 'Penguin', subcategory: 'Self Help', price: 599, tags: 'self help habits', trending: true },
  { name: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', publisher: 'Plata Publishing', subcategory: 'Self Help', price: 399, tags: 'finance money' },
  { name: 'Panchatantra Stories for Children', publisher: 'Om Books', subcategory: "Children's Books", price: 199, tags: 'kids stories moral', pick: true },
  { name: "Harry Potter and the Philosopher's Stone", author: 'J.K. Rowling', publisher: 'Bloomsbury', subcategory: "Children's Books", price: 499, tags: 'kids fantasy novel' },
  { name: 'Chandamama Kathalu (చందమామ కథలు)', publisher: 'Chandamama', subcategory: "Children's Books", language: 'Telugu', price: 150, tags: 'kids telugu stories' },
  { name: 'The Alchemist', author: 'Paulo Coelho', publisher: 'HarperCollins', subcategory: 'Fiction', price: 350, tags: 'novel fiction' },
];

export function buildDemoProducts() {
  const out = [];
  let n = 1;
  const push = (p, category) => {
    const sku = `SRV-${String(n++).padStart(4, '0')}`;
    const tags = String(p.tags || '').split(/[\s,]+/).filter(Boolean);
    out.push({ sku, category, subcategory: p.subcategory || '', ...p, tags, popularity: 20 + ((n * 37) % 80) + (p.trending ? 40 : 0) + (p.pick ? 20 : 0), inStock: true, language: p.language || 'English', featured: !!(p.pick || p.trending), newArrival: n % 6 === 0 });
  };
  school.forEach((p) => push({ ...p, subcategory: Number(p.className.replace('Class ', '')) <= 5 ? 'Primary (1–5)' : 'High School (6–10)', description: `${p.subject} for ${p.className} as per the Telangana State / CBSE syllabus. ${p.publisher} edition, available at Srivani Book Stall, Karimnagar.` }, 'School Books'));
  college.forEach((p) => push({ ...p, subcategory: p.className, description: `${p.subject} textbook for ${p.className} students. ${p.author ? `By ${p.author}, ` : ''}${p.publisher} edition.` }, 'College Books'));
  exams.forEach((p) => push({ ...p, subcategory: p.exam, description: `Trusted ${p.exam} preparation book${p.author ? ` by ${p.author}` : ''} covering ${p.subject}. Ask at the counter for the latest edition.` }, 'Competitive Exams'));
  stationery.forEach(([name, sub, brand, price, tags, essential, trending]) => push({ name, subcategory: sub, publisher: brand, price, tags: `${tags}${essential ? ' essential' : ''}`, trending: !!trending, description: `${name} by ${brand}. Everyday ${sub.toLowerCase()} available at Srivani.` }, 'Stationery'));
  art.forEach(([name, sub, brand, price, tags, pick]) => push({ name, subcategory: sub, publisher: brand, price, tags, pick: !!pick, description: `${name} — ${sub.toLowerCase()} from ${brand} for school projects, art classes and hobbies.` }, 'Art & Craft'));
  reading.forEach((p) => push({ ...p, description: `${p.name}${p.author ? ` by ${p.author}` : ''}. A popular ${p.subcategory.toLowerCase()} pick at Srivani Book Stall.` }, 'General Reading'));
  return out;
}

const DEMO_OFFERS = [
  { title: 'Back to School Stationery Combo', subtitle: '2 long notebooks + geometry box + pens + pencil kit', price: 299, badge: 'Back to School', link: '/stationery' },
  { title: 'Class 10 Complete Guide Set', subtitle: 'Maths, Science & Social guides — bundle price', price: 899, badge: 'Save ₹150', link: '/books/class-10' },
  { title: 'Student Xerox Offer', subtitle: '₹1 per page for students with ID card', price: null, badge: 'In Store', link: '/visit#services' },
];

export async function seedIfEmpty(db) {
  if (globalThis.__srivaniSeeded) return;
  const count = await db.collection('products').estimatedDocumentCount();
  if (count === 0) await seedDemo(db);
  globalThis.__srivaniSeeded = true;
}

export async function seedDemo(db) {
  const { normalizeProduct } = await import('./products');
  const now = new Date();
  const slugs = new Set();
  const docs = buildDemoProducts().map((p, i) => {
    const doc = normalizeProduct(p);
    let slug = slugify(doc.name), base = slug, k = 2;
    while (slugs.has(slug)) slug = `${base}-${k++}`;
    slugs.add(slug);
    return { ...doc, id: randomUUID(), slug, createdAt: new Date(now - i * 3600 * 1000), updatedAt: now };
  });
  await db.collection('products').deleteMany({});
  await db.collection('products').insertMany(docs);
  await db.collection('offers').deleteMany({});
  await db.collection('offers').insertMany(DEMO_OFFERS.map((o) => ({ id: randomUUID(), active: true, createdAt: now, updatedAt: now, ...o })));
  return docs.length;
}
