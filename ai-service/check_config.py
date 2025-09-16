import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '.'))

from src.config.settings import AI_CONFIG
print('AI_CONFIG:', AI_CONFIG)