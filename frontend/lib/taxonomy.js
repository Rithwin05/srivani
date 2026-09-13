export const CATEGORIES = ['School Books', 'College Books', 'Competitive Exams', 'Stationery', 'Art & Craft', 'General Reading'];

export const NEEDS = [
  { slug: 'school', label: 'School', hint: 'Textbooks, guides & workbooks', icon: 'GraduationCap', filter: { category: 'School Books' } },
  { slug: 'college', label: 'College', hint: 'Inter, Degree & Engineering', icon: 'Library', filter: { category: 'College Books' } },
  { slug: 'competitive-exams', label: 'Competitive Exams', hint: 'UPSC, SSC, Banking, TSPSC', icon: 'Trophy', filter: { category: 'Competitive Exams' } },
  { slug: 'stationery', label: 'Stationery', hint: 'Notebooks, pens & office', icon: 'PenLine', filter: { category: 'Stationery' } },
  { slug: 'art-craft', label: 'Art & Craft', hint: 'Colours, sketch books, craft', icon: 'Palette', filter: { category: 'Art & Craft' } },
  { slug: 'general-reading', label: 'General Reading', hint: 'Novels, Telugu literature, kids', icon: 'BookOpen', filter: { category: 'General Reading' } },
  { slug: 'services', label: 'Printing & Xerox', hint: 'Xerox, printing, binding, lamination', icon: 'Printer', href: '/visit#services' },
];

export const CLASSES = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Intermediate', 'Degree', 'Engineering'];

export const EXAMS = ['UPSC', 'SSC', 'Banking', 'Railways', 'TSPSC / APPSC', 'Police', 'Teaching'];

export const SHELVES = [
  { slug: 'school', title: 'School Shelf', sub: 'Class 1 to 10 · State & CBSE', filter: { category: 'School Books' }, tone: 'from-amber-700 to-amber-900', span: true },
  { slug: 'exam-prep', title: 'Exam Prep Shelf', sub: 'UPSC · SSC · TSPSC · Banking', filter: { category: 'Competitive Exams' }, tone: 'from-emerald-700 to-emerald-950' },
  { slug: 'reading', title: 'Reading Shelf', sub: 'Telugu & English favourites', filter: { category: 'General Reading' }, tone: 'from-rose-700 to-rose-950' },
  { slug: 'stationery', title: 'Stationery Shelf', sub: 'Notebooks · Pens · Office', filter: { category: 'Stationery' }, tone: 'from-sky-700 to-sky-950' },
  { slug: 'creative', title: 'Creative Shelf', sub: 'Colours · Craft · Sketch', filter: { category: 'Art & Craft' }, tone: 'from-fuchsia-700 to-fuchsia-950' },
];

export const SERVICES = ['Printing', 'Xerox', 'Scanning', 'Lamination', 'Spiral Binding', 'Project Reports'];

export const SORTS = [
  { value: 'popular', label: 'Popular' },
  { value: 'az', label: 'A – Z' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export function slugify(s = '') {
  return String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function filterToQuery(filter = {}) {
  const map = { className: 'class' };
  const p = new URLSearchParams();
  Object.entries(filter).forEach(([k, v]) => v && p.set(map[k] || k, v));
  const s = p.toString();
  return s ? `?${s}` : '';
}

export function resolveCollection(section, slug) {
  if (!['books', 'stationery'].includes(section)) return null;
  if (!slug) {
    return section === 'books'
      ? { title: 'All Books', filter: { type: 'books' } }
      : { title: 'Stationery', filter: { category: 'Stationery' } };
  }
  const need = NEEDS.find((n) => n.slug === slug && n.filter);
  if (need) return { title: need.label, filter: need.filter };
  const cls = CLASSES.find((c) => slugify(c) === slug);
  if (cls) return { title: `${cls} Books`, filter: { className: cls } };
  const exam = EXAMS.find((e) => slugify(e) === slug);
  if (exam) return { title: `${exam} Books`, filter: { exam } };
  return { title: slug.replace(/-/g, ' '), filter: { subcategorySlug: slug, ...(section === 'stationery' ? { category: 'Stationery' } : {}) } };
}
