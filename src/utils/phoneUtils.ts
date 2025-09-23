/**
 * Phone formatting utilities for Evolution WhatsApp API
 */

/**
 * Formats phone number to Evolution WhatsApp standard
 * @param phone - Raw phone number
 * @returns Formatted phone with @s.whatsapp.net suffix
 */
export const formatPhoneForEvolution = (phone: string | null): string => {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Add country code if not present (Brazil +55)
  let formattedPhone = cleanPhone;
  if (cleanPhone.length === 11 && !cleanPhone.startsWith('55')) {
    formattedPhone = `55${cleanPhone}`;
  } else if (cleanPhone.length === 10 && !cleanPhone.startsWith('55')) {
    // For landlines, add 9 after area code
    formattedPhone = `55${cleanPhone.substr(0, 2)}9${cleanPhone.substr(2)}`;
  }
  
  // Ensure it doesn't already have @s.whatsapp.net
  if (formattedPhone.includes('@s.whatsapp.net')) {
    return formattedPhone;
  }
  
  // Add Evolution format suffix
  return `${formattedPhone}@s.whatsapp.net`;
};

/**
 * Extracts clean phone number from Evolution format
 * @param evolutionPhone - Phone with @s.whatsapp.net suffix
 * @returns Clean phone number for display
 */
export const extractCleanPhone = (evolutionPhone: string | null): string => {
  if (!evolutionPhone) return '';
  
  // Remove @s.whatsapp.net suffix
  const cleanPhone = evolutionPhone.replace('@s.whatsapp.net', '');
  
  // Format for display (55 11 99999-9999)
  if (cleanPhone.length === 13 && cleanPhone.startsWith('55')) {
    const withoutCountry = cleanPhone.substr(2);
    const areaCode = withoutCountry.substr(0, 2);
    const firstPart = withoutCountry.substr(2, 5);
    const secondPart = withoutCountry.substr(7, 4);
    return `+55 (${areaCode}) ${firstPart}-${secondPart}`;
  }
  
  return cleanPhone;
};

/**
 * Validates if phone number is valid Brazilian format
 * @param phone - Phone number to validate
 * @returns Boolean indicating if phone is valid
 */
export const isValidBrazilianPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Valid formats: 11 digits (with 9) or 10 digits (landline)
  return cleanPhone.length >= 10 && cleanPhone.length <= 13;
};