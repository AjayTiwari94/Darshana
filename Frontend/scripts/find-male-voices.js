/**
 * Script to demonstrate finding male voices for Web Speech API
 * This is a conceptual example - in a real browser environment, 
 * you would use the actual Web Speech API
 */

// Common Indian male names used for voice detection
const INDIAN_MALE_NAMES = [
  'ramesh', 'raj', 'kumar', 'singh', 'prakash', 'mohan', 'deepak', 
  'rahul', 'arjun', 'vijay', 'suresh', 'anil', 'ashok', 'ravi', 
  'ajay', 'vikash', 'amar', 'amit', 'anand', 'avinash', 'brijesh',
  'chandan', 'dinesh', 'gaurav', 'hari', 'harish', 'hemant', 'inder',
  'jitendra', 'kamlesh', 'kishore', 'mahesh', 'mukesh', 'naresh', 
  'naveen', 'nitin', 'om', 'pawan', 'pradeep', 'prem', 'rajesh',
  'rameshwar', 'ratan', 'rohit', 'santosh', 'satish', 'shankar', 'shiv',
  'shyam', 'siddharth', 'sudhir', 'tarun', 'uday', 'umesh', 'vishal', 'yogesh'
];

// Common Indian female names (to exclude)
const INDIAN_FEMALE_NAMES = [
  'sita', 'priya', 'lakshmi', 'anita', 'poonam', 'meena', 'asha', 
  'rekha', 'kavita'
];

// Common voice indicators
const MALE_INDICATORS = ['male', 'man', 'boy'];
const FEMALE_INDICATORS = ['female', 'woman', 'girl'];

/**
 * Function to determine if a voice is likely male
 * @param {Object} voice - Voice object with name and lang properties
 * @returns {boolean} - True if voice is likely male
 */
function isMaleVoice(voice) {
  const name = voice.name.toLowerCase();
  
  // Check for explicit male indicators
  const hasMaleIndicator = MALE_INDICATORS.some(indicator => name.includes(indicator)) ||
                          INDIAN_MALE_NAMES.some(namePart => name.includes(namePart));
  
  // Check for explicit female indicators
  const hasFemaleIndicator = FEMALE_INDICATORS.some(indicator => name.includes(indicator)) ||
                            INDIAN_FEMALE_NAMES.some(namePart => name.includes(namePart));
  
  // If we have a clear male indicator and no female indicator, it's likely male
  if (hasMaleIndicator && !hasFemaleIndicator) {
    return true;
  }
  
  // If we have a clear female indicator, it's likely not male
  if (hasFemaleIndicator) {
    return false;
  }
  
  // Default heuristic: if no clear indicators, we can't determine
  return false;
}

/**
 * Function to find the best male voice for a specific language
 * @param {Array} voices - Array of available voices
 * @param {string} language - Target language code (e.g., 'hi-IN')
 * @returns {Object|null} - Best male voice or null if none found
 */
function findBestMaleVoice(voices, language) {
  // Filter for voices that match the language
  const languageVoices = voices.filter(voice => 
    voice.lang === language || 
    voice.lang === language.replace('-', '_') ||
    voice.lang.startsWith(language.split('-')[0])
  );
  
  console.log(`Found ${languageVoices.length} voices for language ${language}`);
  
  // If no voices found for the specific language, use all voices
  const voicesToCheck = languageVoices.length > 0 ? languageVoices : voices;
  
  // Find male voices
  const maleVoices = voicesToCheck.filter(isMaleVoice);
  
  console.log(`Found ${maleVoices.length} male voices`);
  
  if (maleVoices.length > 0) {
    // Prefer voices that exactly match the language
    const exactVoice = maleVoices.find(voice => 
      voice.lang === language || voice.lang === language.replace('-', '_')
    );
    
    if (exactVoice) {
      console.log(`Found exact language match: ${exactVoice.name}`);
      return exactVoice;
    }
    
    // If no exact match, return the first male voice
    console.log(`Returning first male voice: ${maleVoices[0].name}`);
    return maleVoices[0];
  }
  
  // If no male voices found, try to find any voice
  console.log('No male voices found, will force male characteristics on best available voice');
  const bestVoice = voicesToCheck.find(voice => 
    voice.lang === language || voice.lang === language.replace('-', '_')
  ) || voicesToCheck[0];
  
  return bestVoice || null;
}

/**
 * Example usage with mock voice data
 */
function demonstrateVoiceSelection() {
  // Mock voice data (similar to what Web Speech API provides)
  const mockVoices = [
    { name: 'Microsoft David - English (United States)', lang: 'en-US' },
    { name: 'Microsoft Zira - English (United States)', lang: 'en-US' },
    { name: 'Google US English', lang: 'en-US' },
    { name: 'Google UK English Male', lang: 'en-GB' },
    { name: 'Google UK English Female', lang: 'en-GB' },
    { name: 'Microsoft Hindi', lang: 'hi-IN' },
    { name: 'Google हिन्दी', lang: 'hi-IN' },
    { name: 'Google मोहन', lang: 'hi-IN' }, // Indian male name
    { name: 'Google தமிழ்', lang: 'ta-IN' },
    { name: 'Google తెలుగు', lang: 'te-IN' }
  ];
  
  console.log('Available voices:');
  mockVoices.forEach((voice, index) => {
    console.log(`${index + 1}. ${voice.name} (${voice.lang}) - Male: ${isMaleVoice(voice)}`);
  });
  
  console.log('\n--- Finding best male voice for Hindi (hi-IN) ---');
  const bestHindiVoice = findBestMaleVoice(mockVoices, 'hi-IN');
  if (bestHindiVoice) {
    console.log(`Best Hindi male voice: ${bestHindiVoice.name}`);
  } else {
    console.log('No suitable Hindi male voice found');
  }
  
  console.log('\n--- Finding best male voice for English (en-US) ---');
  const bestEnglishVoice = findBestMaleVoice(mockVoices, 'en-US');
  if (bestEnglishVoice) {
    console.log(`Best English male voice: ${bestEnglishVoice.name}`);
  } else {
    console.log('No suitable English male voice found');
  }
}

// Run the demonstration
demonstrateVoiceSelection();

module.exports = {
  isMaleVoice,
  findBestMaleVoice,
  INDIAN_MALE_NAMES,
  INDIAN_FEMALE_NAMES
};