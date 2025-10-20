import re

# Read the file
with open('NaradAIChat.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all function definitions
pattern = r'(\s*// Function to .*?\s*const \w+ = useCallback\([\s\S]*?};?\s*\)[\s\S]*?;?\s*\]\s*\))\s*(?=(\s*//|$))'

# Find the first set of duplicates (lines ~239-387)
# We'll look for the pattern and remove the first occurrence of each duplicate function

# List of functions that have duplicates
duplicate_functions = [
    'clearSpeechQueue',
    'stopAllSpeech', 
    'queueSpeech',
    'speakText',
    'processSpeechQueue',
    'toggleVoiceRecording'
]

# Find all occurrences of these functions
for func_name in duplicate_functions:
    # Pattern to match the function definition
    pattern = f'\\s*// Function to .*?\\s*const {func_name} = useCallback\\([\\s\\S]*?\\];?\\s*\\]\\s*\\)'
    
    # Find all matches
    matches = list(re.finditer(pattern, content, re.MULTILINE))
    
    # If we have more than one match, remove the first one
    if len(matches) > 1:
        # Get the first match
        first_match = matches[0]
        # Remove it from the content
        content = content[:first_match.start()] + content[first_match.end():]

# Write the cleaned content back to the file
with open('NaradAIChat.tsx.cleaned', 'w', encoding='utf-8') as f:
    f.write(content)

print("Duplicate functions removed. Check NaradAIChat.tsx.cleaned file.")