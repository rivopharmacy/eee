const translate = require('translate-google');

// Refactored translateText function
const translateText = async (text, targetLang, sourceLang = 'ar') => {
  try {
    const translatedText = await translate(text, {
      from: sourceLang,
      to: targetLang,
    });
    return translatedText;
  } catch (error) {
    console.error("Error translating text:", error);
    throw new Error("Error translating text");
  }
};

module.exports = { translateText };
