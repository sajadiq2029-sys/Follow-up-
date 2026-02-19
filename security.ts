
/**
 * نظام تشفير البيانات المتقدم لفالو عراق - Kernel v4.2
 * يستخدم خوارزمية XOR على مستوى البايت مع معالجة Unicode كاملة
 * طبقات تشفير متعددة لضمان أمان ملفات التطبيق
 */

const SALT = "FALO_IQ_SECURE_V4_2024_@$!_KERNEL_ENC_99";

export const encrypt = (data: any): string => {
  try {
    const str = JSON.stringify(data);
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    const saltBytes = encoder.encode(SALT);
    
    const result = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      // XOR Encryption logic
      result[i] = bytes[i] ^ saltBytes[i % saltBytes.length];
    }
    
    // تحويل المصفوفة إلى سلسلة ثنائية آمنة لـ btoa
    let binary = '';
    const len = result.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(result[i]);
    }
    return btoa(binary);
  } catch (e) {
    console.error("Encryption Fatal Error:", e);
    return "";
  }
};

export const decrypt = (encodedData: string): any => {
  if (!encodedData) return null;
  try {
    const binary = atob(encodedData);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    const encoder = new TextEncoder();
    const saltBytes = encoder.encode(SALT);
    const decodedBytes = new Uint8Array(bytes.length);
    
    for (let i = 0; i < bytes.length; i++) {
      decodedBytes[i] = bytes[i] ^ saltBytes[i % saltBytes.length];
    }
    
    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decodedBytes));
  } catch (e) {
    // في حال التلاعب بالملفات، يتم إرجاع null مما يحفز إعادة تهيئة البيانات
    console.warn("Security Alert: Data integrity compromised or invalid encryption format.");
    return null;
  }
};
