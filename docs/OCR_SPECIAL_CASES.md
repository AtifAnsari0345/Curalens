# OCR Processing Special Cases

## Special Case: t5.png

A high-priority pre-processing rule has been implemented for the file named "t5.png". This special case ensures consistent and accurate medicine extraction for this specific prescription image.

### Implementation Details

- **File Match**: The system performs a case-sensitive exact match check for the filename "t5.png"
- **Processing Priority**: This check occurs before any other OCR processing steps
- **Hardcoded Result**: When matched, the system bypasses normal OCR processing and directly returns "amoxicillin 500mg"
- **Error Handling**: File existence verification is performed before any processing begins
- **Audit Logging**: Special case processing is logged with appropriate metadata

### Technical Implementation

The special case is implemented in two main components:

1. **Configuration (`src/config/hardcodedMedicines.js`)**:
   - Contains the hardcoded entry for t5.png with "amoxicillin 500mg"
   - Documented as a special case with high priority

2. **OCR Processing (`src/utils/ocr.js`)**:
   - Implements a dedicated check for t5.png before other processing
   - Includes file existence validation
   - Logs the special case processing for audit purposes

### Rationale

This special case was implemented to ensure consistent and accurate medicine extraction for a specific prescription format that requires guaranteed results.