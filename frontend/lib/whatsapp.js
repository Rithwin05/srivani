export function waLink(number, text) {
  const digits = String(number || '').replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function telLink(phone) {
  return `tel:${String(phone || '').replace(/[^\d+]/g, '')}`;
}

export function directionsLink(query) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query || '')}`;
}

export const WA_MESSAGES = {
  product: (name) => `Hi Srivani, I want to know the availability of "${name}". Please let me know the price and if it is in stock.`,
  ask: (need) => `Hi Srivani, I'm looking for ${need || '______'}. Can you help me find it?`,
  schoolList: (name, school) => `Hi Srivani, I'm ${name || 'a parent'}. I want to order the school book & stationery list${school ? ` for ${school}` : ''}. Sharing the list here.`,
  bulk: (inst) => `Hi Srivani, this is ${inst || 'an institution'}. We need books/stationery in bulk. Please share a quotation.`,
  offer: (title) => `Hi Srivani, I'm interested in the offer "${title}". Is it available?`,
};

export function formatPrice(n) {
  if (n === null || n === undefined || n === '') return '';
  return '₹' + Number(n).toLocaleString('en-IN');
}
