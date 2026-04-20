# Nomination Client — Use Cases & WIX Implementation

**Actor:** Nomination Client  
**Scope:** Stage 1 only  
**Purpose:** High-level WIX implementation approach for nomination client use cases

---

## Use Cases & Implementation

### Access client assessment form (no login; no token)
**Goal:** Enable client evaluation of contractor performance with minimal friction.

**WIX Implementation (chosen):**
- Client receives an email containing a link to the public assessment page.
- The link includes `nominationId` and `customerId` as query-string parameters.
- The assessment page validates that:
  - Both records exist, and
  - The `Customer_Feedback` record belongs to the same nominee as the nomination (same `_owner`).
- If validation fails: show “invalid link” / “expired or incorrect link” message and do not load the form.

**Notes / Rationale:**
- Tokenized links were intentionally discarded as unnecessary complexity for this stage.
- Email delivery + ownership validation is considered sufficient for the operational risk level.

---

### Complete contractor evaluation
**Goal:** Provide structured client assessment.

**WIX Implementation:**
- Form with 7 criteria (0-10 scale each)
- Weighted scoring (weights provided per criterion)
- Auto-calculation of Weight × Rating
- Total score and percentage calculation
- Clear instructions and criteria descriptions

**How-to / To-do:**
1. **Create ClientAssessments Collection:**
   - Go to **Database** → **Collections** → **+ New Collection**
   - Name: "ClientAssessments"
   - Add fields:
     - `tokenId` (Reference to ClientAssessmentTokens)
     - `nominationId` (Reference to Nominations Collection)
     - `clientName` (Text)
     - `clientEmail` (Email)
     - `clientRole` (Text)
     - `criterion1_Rating` (Number) - 0-10
     - `criterion1_Weight` (Number)
     - `criterion1_Score` (Number) - Weight × Rating
     - (Repeat for criteria 2-7)
     - `totalScore` (Number) - Sum of all criterion scores
     - `maxPossibleScore` (Number) - Sum of all weights × 10
     - `percentageAchieved` (Number) - (totalScore / maxPossibleScore) × 100
     - `submittedDate` (Date)
     - `signed` (Boolean)
     - `signature` (Text or File)

2. **Add Evaluation Form Fields:**
   - On client assessment page, add form section for each criterion
   - For each of 7 criteria:
     - **Text** element: Criterion name and description
     - **Text** element: Weight (display only, e.g., "Weight: 15%")
     - **Number Input** or **Slider**: Rating (0-10)
     - **Text** element: Calculated score (Weight × Rating, auto-calculated)
   - Add **Text** elements for: Total Score, Max Possible Score, Percentage Achieved

3. **Add Auto-Calculation (WIX Velo):**
   - Calculate scores in real-time as ratings are entered:
     ```javascript
     $w.onReady(function () {
       const weights = [15, 15, 15, 15, 15, 15, 10]; // Example weights (should match actual)
       const maxRating = 10;
       
       function calculateScores() {
         let totalScore = 0;
         let maxPossibleScore = 0;
         
         for (let i = 1; i <= 7; i++) {
           const rating = $w(`#criterion${i}Rating`).value || 0;
           const weight = weights[i - 1];
           const score = (rating / maxRating) * weight;
           
           $w(`#criterion${i}Score`).text = score.toFixed(2);
           totalScore += score;
           maxPossibleScore += weight;
         }
         
         $w("#totalScore").text = totalScore.toFixed(2);
         $w("#maxPossibleScore").text = maxPossibleScore.toFixed(2);
         
         const percentage = (totalScore / maxPossibleScore) * 100;
         $w("#percentageAchieved").text = percentage.toFixed(1) + "%";
       }
       
       // Calculate on any rating change
       for (let i = 1; i <= 7; i++) {
         $w(`#criterion${i}Rating`).onChange(() => calculateScores());
         $w(`#criterion${i}Rating`).onInput(() => calculateScores());
       }
     });
     ```

4. **Add Form Validation:**
   - Ensure all 7 criteria are rated (0-10)
   - Validate rating is within range
   - Show error if any criterion missing

5. **Display Criteria Information:**
   - Show clear descriptions for each criterion
   - Display rating scale (0-10) with descriptors if available
   - Show weight for each criterion

6. **Test:**
   - Enter ratings for all criteria
   - Verify scores calculate correctly
   - Test with different rating combinations
   - Verify total and percentage calculations
   - Test validation (try submitting with missing ratings)

---

### Add evidence notes
**Goal:** Support scoring with evidence.

**WIX Implementation:**
- Conditional text fields for ratings ≥8 or ≤4
- Evidence notes required for high/low ratings
- Store notes per criterion
- Clear instructions on when notes are required

**How-to / To-do:**
1. **Add Evidence Notes Fields to ClientAssessments Collection:**
   - Add fields: `criterion1_EvidenceNotes` (Text), `criterion2_EvidenceNotes`, etc. (for all 7 criteria)

2. **Add Conditional Evidence Note Fields:**
   - For each criterion, add **Text Area** element for evidence notes
   - Initially hide these fields
   - Show/hide based on rating value

3. **Implement Conditional Display (WIX Velo):**
   - Show evidence note field when rating ≥8 or ≤4:
     ```javascript
     $w.onReady(function () {
       for (let i = 1; i <= 7; i++) {
         $w(`#criterion${i}Rating`).onChange(() => {
           const rating = $w(`#criterion${i}Rating`).value;
           const evidenceField = $w(`#criterion${i}EvidenceNotes`);
           
           if (rating >= 8 || rating <= 4) {
             evidenceField.show();
             evidenceField.required = true;
             evidenceField.label = `Evidence notes required (Rating: ${rating})`;
           } else {
             evidenceField.hide();
             evidenceField.required = false;
           }
         });
       }
     });
     ```

4. **Add Validation:**
   - In submit validation, check if evidence notes are required
   - Ensure evidence notes are provided when rating ≥8 or ≤4
   - Show error if evidence notes missing

5. **Add Instructions:**
   - Add **Text** element explaining: "Evidence notes are required for ratings of 8 or higher, or 4 or lower"
   - Display prominently near form

6. **Test:**
   - Enter rating of 8, verify evidence field appears and is required
   - Enter rating of 4, verify evidence field appears and is required
   - Enter rating of 5-7, verify evidence field is hidden
   - Try submitting with rating 8 but no evidence notes (should fail validation)

---

### Sign and consent
**Goal:** Formalize assessment and enable publication.

**WIX Implementation:**
- Digital signature capture or checkbox confirmation
- Consent checkboxes for evaluation and publication
- Required before submission
- Store signature and consent in collection

**How-to / To-do:**
1. **Add Consent Fields to ClientAssessments Collection:**
   - Add field: `consentEvaluation` (Boolean)
   - Add field: `consentPublication` (Boolean)
   - Add field: `signatureName` (Text)
   - Add field: `signatureDate` (Date)
   - Add field: `signatureMethod` (Text) - "Digital Signature" or "Checkbox Confirmation"

2. **Add Signature Section to Form:**
   - Add **Text Input**: "Full Name" (for signature)
   - Add **Checkbox**: "I consent to this evaluation being used for the award assessment"
   - Add **Checkbox**: "I consent to a short case story being published if this nomination is selected as a winner or top 3 finalist"
   - Add **Date Picker** or auto-set: Signature Date

3. **Add Signature Validation:**
   - Ensure name is provided
   - Ensure both consent checkboxes are checked
   - Show error if any missing

4. **Alternative: Digital Signature (Optional):**
   - Use **Signature Pad** element (if available in WIX)
   - Or use **File Upload** for signature image
   - Store signature image/file in collection

5. **Display Consent Text:**
   - Show clear consent statements
   - Link to privacy policy or terms if needed
   - Make consent text readable and clear

6. **Test:**
   - Fill form, verify signature name required
   - Verify both consent checkboxes required
   - Test submission without consent (should fail)
   - Test successful submission with all consents

---

### Submit client assessment
**Goal:** Complete client assessment requirement for nomination.

**WIX Implementation:**
- Final validation before submission
- Save assessment to the `Customer_Feedback` record referenced by `customerId`
- Update nomination with assessment score (optional/if needed in Stage 1 reporting)
- Lock form from further editing
- Send confirmation to client and notify nominee/nominee coach

**How-to / To-do:**
1. **Submit flow (WIX Velo):**
   - Use the existing `Customer_Feedback` record identified by `customerId`.
   - Save the form fields into that record and set `evaluationStatus = 'SUBMITTED'`.
   - (Optional) Update the nomination record with aggregated score fields for reporting.
   - Prevent further edits once submitted (UI lock + backend check).

2. **Add Submit Button:**
   - Add **Button**: "Submit Assessment"
   - Connect to `submitClientAssessment` function
   - Add confirmation dialog: "Are you sure? You cannot edit after submission."

3. **Lock Form After Submission:**
   - After successful submission, hide form
   - Show confirmation message
   - Display submitted assessment (read-only)
   - Prevent further edits

4. **Send Confirmation Emails:**
   - Email to client: "Assessment Submitted Confirmation"
   - Email to nominee: "Client Assessment Completed"
   - Email to Nominee Coach: "Client Assessment Received"

5. **Display Confirmation:**
   - Show success message
   - Display summary: Total Score, Percentage Achieved
   - Thank you message
   - Contact information if questions

6. **Test:**
   - Complete full form with all required fields
   - Submit assessment
   - Verify assessment saved to collection
   - Verify token marked as used
   - Verify nomination updated with scores
   - Verify confirmation emails sent
   - Try accessing form again with same token (should show "already submitted")

---

## Nomination Client Portal Structure

**Recommended Pages:**
1. **Client Assessment Form** - Public page with `nominationId` + `customerId` link validation (no login required)
2. **Assessment Confirmation** - Thank you page after submission

**WIX Components:**
- Collections (`Customer_Feedback`, and optionally `Nominations` for rollups)
- Forms (evaluation form with 7 criteria)
- Public page (query-string validated form page)
- Velo (validation, calculations, save/submit)
- Email Marketing (link sending, confirmations)

---

## Security Considerations (chosen approach)

**Link validation:**
- Link contains `nominationId` and `customerId`.
- Page loads only if both exist and share the same nominee ownership (`_owner` match).

**Access control:**
- No login required (public page).
- Form locked after submission (`evaluationStatus = 'SUBMITTED'`).

**Data privacy:**
- Client assessment data stored in `Customer_Feedback`.
- Consent captured for evaluation and publication (per form fields).
