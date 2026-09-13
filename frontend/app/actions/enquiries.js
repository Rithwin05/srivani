'use server';
import { createEnquiry, getSettings } from '@/lib/store';
import { uploadAttachment } from '@/lib/storage';
import { waLink, WA_MESSAGES } from '@/lib/whatsapp';

const clean = (v) => String(v || '').trim().slice(0, 2000);

export async function submitEnquiry(formData) {
  const type = clean(formData.get('type')) || 'ask';
  const data = {
    type,
    name: clean(formData.get('name')),
    phone: clean(formData.get('phone')),
    message: clean(formData.get('message')),
    institution: clean(formData.get('institution')),
    quantity: clean(formData.get('quantity')),
    school: clean(formData.get('school')),
    productName: clean(formData.get('productName')),
    productSlug: clean(formData.get('productSlug')),
  };
  if (!data.phone && !data.message && !data.productName) return { error: 'Please tell us what you need or share your phone number.' };
  const file = formData.get('file');
  if (file && typeof file === 'object' && file.size > 0) {
    if (file.size > 10 * 1024 * 1024) return { error: 'File must be under 10 MB.' };
    data.fileUrl = await uploadAttachment(file).catch(() => '');
  }
  const id = await createEnquiry(data);
  const settings = await getSettings();
  const site = process.env.NEXT_PUBLIC_SITE_URL || '';
  let text;
  if (type === 'school-list') text = `${WA_MESSAGES.schoolList(data.name, data.school)}${data.message ? `\n\nList:\n${data.message}` : ''}${data.fileUrl ? `\n\nAttached list: ${site}${data.fileUrl}` : ''}`;
  else if (type === 'bulk') text = `${WA_MESSAGES.bulk(data.institution)}\n\nContact: ${data.name} (${data.phone})\nRequirement: ${data.message}\nQuantity: ${data.quantity}${data.fileUrl ? `\nList: ${site}${data.fileUrl}` : ''}`;
  else if (type === 'product') text = WA_MESSAGES.product(data.productName);
  else text = `${WA_MESSAGES.ask(data.message)}${data.name ? `\n– ${data.name}` : ''}`;
  return { ok: true, id, whatsapp: waLink(settings.whatsapp, text) };
}
