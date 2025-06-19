export const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY || '';

if (!GROQ_API_KEY) {
  console.warn('GROQ_API_KEY is not set. The chatbot functionality will not work properly.');
}
