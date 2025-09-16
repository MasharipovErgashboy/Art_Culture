export function getApiHeaders(language = "uz") {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-CSRFTOKEN": "eJuCzMPXzuceRF25yOKmMxM4xf4mqGj35Y0XH5SmFgz83slSgqvKu3WpN7SfScL3",
    "Accept-Language": language,
  }
}

export function getMultilingualField(obj: any, field: string, language = "uz"): string {
  if (!obj) return ""

  // Try language-specific field first
  const langField = `${field}_${language}`
  if (obj[langField]) return obj[langField]

  // Fallback to Uzbek
  const uzField = `${field}_uz`
  if (obj[uzField]) return obj[uzField]

  // Fallback to base field
  if (obj[field]) return obj[field]

  return ""
}
