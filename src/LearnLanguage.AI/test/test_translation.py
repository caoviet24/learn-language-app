#!/usr/bin/env python3
"""
Test script for translation functionality
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from translation_service import translate_word

def test_translation():
    print("Testing translation functionality...")
    
    # Test cases - note that T5 model expects full language names
    test_cases = [
        {"word": "dog", "src_lang": "English", "tgt_lang": "Vietnamese", "expected_lang": "Vietnamese"},
        {"word": "cat", "src_lang": "English", "tgt_lang": "French", "expected_lang": "French"},
        {"word": "hello", "src_lang": "English", "tgt_lang": "Spanish", "expected_lang": "Spanish"},
        {"word": "chien", "src_lang": "French", "tgt_lang": "English", "expected_lang": "English"},
        {"word": "ciao", "src_lang": "Italian", "tgt_lang": "English", "expected_lang": "English"},
    ]
    
    for i, test_case in enumerate(test_cases):
        try:
            result = translate_word(test_case["word"], test_case["src_lang"], test_case["tgt_lang"])
            print(f"Test {i+1}: '{test_case['word']}' ({test_case['src_lang']} -> {test_case['tgt_lang']}) = '{result}'")
        except Exception as e:
            print(f"Test {i+1}: FAILED - {str(e)}")
    
    print("Translation tests completed.")

if __name__ == "__main__":
    test_translation()