**Actor:** Nominee  
# Nominee — Use Cases & Wix Implementation

## Nominee Portal — Page Sitemap (Wix)

- **Public / marketing layer**
  - **Award Main Page** (public)  
    - Explains the award, eligibility, and process for nominees.  
    - Primary CTA: **Single Smart Button** (`#mainActionBtn`) with 3 states:
      - **GUEST state**: "Log In to Submit Nomination" → Opens Wix login popup
      - **MEMBER state**: "Start New Nomination" → Assigns Nominee role, refreshes page
      - **NOMINEE state**: "View Nomination Status" → Redirects to Nominee Dashboard

- **Members Area (Nominee role only)**
  - **Nominee Dashboard** (`/nominee-dashboard`, members-only, role: Nominee)  
    - Landing page after role assignment.  
    - Shows list of nominations with status (Draft / Submitted / Under Review / Outcome).  
    - Actions covered by use cases: **Start nomination**, **Save draft nomination** (resume drafts), **View nomination status**, **Respond to completion request**, **Withdraw nomination**, **Receive Stage 1 outcome notification / feedback** (via status, messages, and links).
  - **Nomination Form** (dynamic page bound to `Nominations` collection)  
    - Used for **Start nomination**, **Save draft nomination**, and **Submit nomination**.  
    - Contains sections / panels for: **Core nomination details**, **Client contact**, **Required artifacts upload**, and **Required narrative sections**.
  - **Nominee Account / Profile page** (standard Wix members page)  
    - Lets nominees manage basic account info (name, email, password, profile details).

- **System / Wix member pages**
  - **Password reset / email verification pages**  
    - Handled by Wix; linked from login and email notifications (no custom build required).

---

**Actor:** Nominee  
**Scope:** Stage 1 only  
**Purpose:** High-level WIX implementation approach for nominee use cases

---

## Use Cases & Implementation

### Register account / Become Nominee
**Goal:** Enable authenticated access and ownership of submissions via a single smart button.

**Wix implementation:**
- **Single Smart Button** on Award Main Page with 3 states (GUEST → MEMBER → NOMINEE)
- Backend module (`multiRole.web.js`) handles role checking and assignment
- Wix login popup triggered for unauthenticated users
- Automatic Nominee role assignment for authenticated members
- Member profile stored in the Wix Site Members database

**Architecture:**

**Backend: `backend/multiRole.web.js`**
```javascript
import { Permissions, webMethod } from "wix-web-module";
import wixUsersBackend from 'wix-users-backend';
import { authorization } from 'wix-members-backend';

// Check if user is logged in AND has the specific role
export const checkMyRoleStatus = webMethod(Permissions.Anyone, async (targetRoleTitle) => {
    const user = wixUsersBackend.currentUser;
    if (!user.loggedIn) return { loggedIn: false };

    const roles = await user.getRoles();
    const hasRole = roles.some(r => r.name === targetRoleTitle);

    return { loggedIn: true, hasRole: hasRole };
});

// Assign the Nominee role to the currently logged-in user
export const assignRoleToCurrentUser = webMethod(Permissions.Anyone, async () => {
    const user = wixUsersBackend.currentUser;
    if (!user.loggedIn) throw new Error("Must be logged in.");

    // Assign Nominee Role (replace with your actual role ID)
    await authorization.assignRole("b7fc44e8-e5a8-4035-9a99-875f0f85bd4e", user.id, { suppressAuth: true });
});
```

**Frontend: Award Main Page**
```javascript
import { authentication } from 'wix-members-frontend';
import { checkMyRoleStatus, assignRoleToCurrentUser } from 'backend/multiRole.web';
import wixLocation from 'wix-location';

let currentState = "LOADING"; // Options: GUEST, MEMBER, NOMINEE

$w.onReady(async function () {
    $w('#mainActionBtn').hide();
    await updateButtonState();

    $w('#mainActionBtn').onClick(async () => {
        // GUEST: Needs to Log In
        if (currentState === "GUEST") {
            try {
                await authentication.promptLogin(); 
                await updateButtonState();
            } catch (err) {
                console.log("Login cancelled");
            }
        }
        // MEMBER: Needs to "Upgrade" to Nominee
        else if (currentState === "MEMBER") {
            $w('#mainActionBtn').label = "Processing...";
            $w('#mainActionBtn').disable();
            try {
                await assignRoleToCurrentUser();
                wixLocation.to(wixLocation.url); // Refresh page
            } catch (error) {
                console.error(error);
                $w('#mainActionBtn').label = "Error. Try Again.";
                $w('#mainActionBtn').enable();
            }
        }
        // NOMINEE: Already has role
        else if (currentState === "NOMINEE") {
            wixLocation.to('/nominee-dashboard');
        }
    });
});

async function updateButtonState() {
    currentState = "GUEST";
    $w('#mainActionBtn').label = "Log In to Submit Nomination";
    try {
        const status = await checkMyRoleStatus("Nominee");
        if (status.loggedIn && !status.hasRole) {
            currentState = "MEMBER";
            $w('#mainActionBtn').label = "Start New Nomination";
        } 
        else if (status.loggedIn && status.hasRole) {
            currentState = "NOMINEE";
            $w('#mainActionBtn').label = "View Nomination Status";
        }
    } catch (error) {
        console.error("Status check failed", error);
    }
    $w('#mainActionBtn').show();
    $w('#mainActionBtn').enable();
}
```

**How-to / To-do:**
1. **Enable the Members Area / Site Members app:**
   - In the editor, go to **Settings** → **Site Members**.
   - Ensure your site plan supports the **Members Area / Site Members** feature.

2. **Create "Nominee" member role and get Role ID:**
   - In the editor, open the **Members** panel → **Site Members** → **Roles**.
   - Click **+ New Role** and name it **"Nominee"**.
   - Copy the Role ID (found in role settings or via Wix API) for use in `assignRoleToCurrentUser()`.
   - Set permissions so this role can access nominee portal pages.

3. **Create backend module:**
   - In **Dev Mode** → **Backend**, create file: `multiRole.web.js`
   - Add the `checkMyRoleStatus` and `assignRoleToCurrentUser` functions (see code above).
   - Replace the hardcoded role ID with your actual Nominee role ID.

4. **Add Smart Button to Award Main Page:**
   - Add a **Button** element with ID `#mainActionBtn`.
   - Add the frontend code to the page (see code above).
   - Button will automatically show correct label based on user state.

5. **Configure email verification (optional):**
   - Go to **Settings** → **Email Notifications**
   - Enable "Email Verification" for new members

6. **Test the 3-state flow:**
   - **As guest**: Button shows "Log In to Submit Nomination" → Click opens login popup
   - **After login (no role)**: Button shows "Start New Nomination" → Click assigns Nominee role
   - **After role assigned**: Button shows "View Nomination Status" → Click redirects to dashboard

---

### Log in / log out
**Goal:** Secure access to nominee features.

**Wix implementation:**
- **Login**: Handled by Smart Button on Award Main Page (calls `authentication.promptLogin()`)
- **Session management**: Handled by Wix Members Area (built-in)
- **Logout**: Standard Wix Member Menu or logout button on protected pages

**How-to / To-do:**
1. **Login via Smart Button:**
   - Login is triggered by the Smart Button when user is in GUEST state.
   - Uses `authentication.promptLogin()` from `wix-members-frontend`.
   - After login, button state automatically updates via `updateButtonState()`.
   - See "Register account / Become Nominee" section for full implementation.

2. **Add Logout Button (on protected pages):**
   - On Nominee Dashboard and other member pages, add **Member Menu** element (includes logout option).
   - Or add a **Button** element with action: **Member Logout** (in button settings).

3. **Set page permissions:**
   - For each nominee portal page: **Page Settings** → **Permissions**
   - Set to **"Members Only"** → choose the **"Nominee"** member role
   - This ensures only logged-in nominees with Nominee role can access

4. **Configure password reset:**
   - Go to **Settings** → **Email Notifications**
   - Configure password reset link and email template

5. **Test Login/Logout:**
   - Test login via Smart Button on Award Main Page
   - Verify role assignment and redirect flow
   - Test logout functionality on protected pages
   - Verify protected pages redirect to login if not authenticated

---

### Start nomination
**Goal:** Begin the submission workflow.

**Wix implementation:**
- "Start New Nomination" button on nominee dashboard
- Create new record in **Nominations** collection (Wix Content Manager)
- Link nomination to current member (owner)
- Set initial status: "Draft"
- Redirect to nomination form

**How-to / To-do:**
1. **Create `Nominations` collection (Content Manager):**
   - Go to **Content Manager** → **Collections** → **+ New Collection**
   - Name: "Nominations"
   - Add fields: nominationId (Text, Unique), ownerId (Reference to Members), status (Text), createdDate (Date)

2. **Add "Start New Nomination" Button:**
   - On Nominee Dashboard page, add **Button** element
   - Button text: "Start New Nomination"
   - Set button action: **Run Code** (WIX Velo)

3. **Create WIX Velo Function:**
   - Go to **Dev Mode** → **Backend** → **Functions**
   - Create function: `createNewNomination`
   - Code:
     ```javascript
     import wixData from 'wix-data';
     import { currentMember } from 'wix-members';
     
     export async function createNewNomination() {
       const member = await currentMember();
       const nomination = {
         ownerId: member._id,
         status: "Draft",
         createdDate: new Date()
       };
       const result = await wixData.insert("Nominations", nomination);
       return result;
     }
     ```

4. **Connect Button to Function:**
   - In button settings, select **Run Code**
   - Choose function: `createNewNomination`
   - On success: Navigate to "Nomination Form" page with nomination ID in URL

5. **Test:**
   - Click button as logged-in nominee
   - Verify new record created in Nominations Collection
   - Verify redirect to nomination form with correct nomination ID

---

### Save draft nomination
**Goal:** Allow completion over multiple sessions.

**Wix implementation:**
- **Form** or **Dynamic Page** with auto-save functionality (Velo by Wix)
- Save to `Nominations` collection with status "Draft"
- Timestamp last saved date
- Resume from draft on next login
- Show draft nominations on dashboard

**How-to / To-do:**
1. **Add auto-save fields to `Nominations` collection:**
   - Add field: `lastSavedDate` (Date)
   - Add field: `lastSavedBy` (Reference to Members)

2. **Create auto-save function (Velo by Wix):**
   - In **Dev Mode** → **Backend** → **Functions**
   - Create function: `saveDraftNomination(nominationId, formData)`
   - Code:
     ```javascript
     import wixData from 'wix-data';
     import { currentMember } from 'wix-members';
     
     export async function saveDraftNomination(nominationId, formData) {
       const member = await currentMember();
       const update = {
         ...formData,
         status: "Draft",
         lastSavedDate: new Date(),
         lastSavedBy: member._id
       };
       return await wixData.update("Nominations", {_id: nominationId}, update);
     }
     ```

3. **Implement auto-save on form:**
   - On nomination form page, add **WIX Velo** code in page code
   - Use `onInput` or `onChange` events on form fields
   - Call `saveDraftNomination` function every 30 seconds or on field blur
   - Show "Saving..." / "Saved" indicator

4. **Add Manual Save Button:**
   - Add **Button** element: "Save Draft"
   - Connect to `saveDraftNomination` function
   - Show success message after save

5. **Load Draft on Page Load:**
   - In page code, check URL for nomination ID
   - If draft exists, load data from Nominations Collection
   - Populate form fields with saved data

6. **Display drafts on dashboard:**
   - Add **Repeater** element showing nominations
   - Filter: `status = "Draft"` AND `ownerId = currentMember._id`
   - Show last saved date
   - Link to resume editing

7. **Test:**
   - Start nomination, fill some fields, wait for auto-save
   - Log out, log back in, verify draft loads
   - Test manual save button
   - Verify drafts appear on dashboard

---

### Submit nomination
**Goal:** Enter Stage 1 intake/validation.

**Wix implementation:**
- Final validation check (Velo by Wix) before submission
- Update status to "Submitted" in `Nominations` collection
- Set submission timestamp
- Trigger workflow: move to intake queue
- Lock nomination from further editing (read-only)
- Send confirmation notification

**How-to / To-do:**
1. **Add submission fields to `Nominations` collection:**
   - Add field: `submittedDate` (Date)
   - Add field: `submittedBy` (Reference to Members)

2. **Create validation function (Velo by Wix):**
   - Create function: `validateNomination(nominationId)`
   - Check: all required fields filled, files uploaded, word counts valid
   - Return: {valid: true/false, errors: []}

3. **Create submit function (Velo by Wix):**
   - Create function: `submitNomination(nominationId)`
   - Code:
     ```javascript
     import wixData from 'wix-data';
     import { currentMember } from 'wix-members';
     import { validateNomination } from 'backend/validation';
     
     export async function submitNomination(nominationId) {
       const validation = await validateNomination(nominationId);
       if (!validation.valid) {
         throw new Error(validation.errors.join(", "));
       }
       
       const member = await currentMember();
       const update = {
         status: "Submitted",
         submittedDate: new Date(),
         submittedBy: member._id
       };
       const result = await wixData.update("Nominations", {_id: nominationId}, update);
       
       // Send confirmation email (see Email Marketing setup)
       // Trigger workflow notification to Nominee Coach
       
       return result;
     }
     ```

4. **Add Submit Button:**
   - On nomination form, add **Button**: "Submit Nomination"
   - Connect to `submitNomination` function
   - Add confirmation dialog: "Are you sure? You cannot edit after submission."

5. **Lock Editing After Submission:**
   - In nomination detail page code, check status
   - If status = "Submitted" or later, hide edit buttons
   - Make form fields read-only or hide form entirely
   - Show read-only view instead

6. **Send confirmation email:**
   - Go to **Marketing & SEO** → **Email Marketing** → **Automations**
   - Create automation: Trigger on nomination status change to "Submitted"
   - Email template: "Nomination Submitted Confirmation"
   - Include: nomination ID, submission date, next steps

7. **Test:**
   - Test validation (try submitting incomplete nomination)
   - Test successful submission
   - Verify status changes to "Submitted"
   - Verify editing is locked
   - Check confirmation email received

---

### Provide client contact
**Goal:** Enable client assessment request flow.

**Wix implementation:**
- Support multiple client contacts per nomination
- Form fields in nomination form: client name, email, phone, role (repeatable)
- Store in separate ClientContacts Collection linked to nomination
- Validation: email format, required fields, at least one contact required
- Used later for client assessment workflow

**How-to / To-do:**
1. **Create `ClientContacts` collection:**
   - Go to **Content Manager** → **Collections** → **+ New Collection**
   - Name: "ClientContacts"
   - Add fields:
     - `nominationId` (Reference to Nominations Collection)
     - `clientName` (Text, Required)
     - `clientEmail` (Email, Required)
     - `clientPhone` (Phone, Optional)
     - `clientRole` (Text, Optional)
     - `isPrimary` (Boolean) - Mark primary contact
     - `order` (Number) - Display order

2. **Add Client Contacts Section to Form:**
   - On nomination form page, add section: "Client Contacts"
   - Add **Repeater** element for client contacts
   - Inside repeater, add **Input** elements:
     - Client Name (Text Input, Required)
     - Client Email (Email Input, Required)
     - Client Phone (Phone Input, Optional)
     - Client Role (Text Input, Optional)
     - Primary Contact (Checkbox) - Only one can be primary
   - Add **Button** in repeater: "Remove Contact" (to delete contact from list)

3. **Add "Add another contact" button:**
   - Add **Button** below repeater: "Add Another Client Contact"
   - Use WIX Velo to add new item to repeater:
     ```javascript
     $w.onReady(function () {
       $w("#addContactButton").onClick(() => {
         const newContact = {
           clientName: "",
           clientEmail: "",
           clientPhone: "",
           clientRole: "",
           isPrimary: false
         };
         $w("#clientContactsRepeater").data.push(newContact);
       });
     });
     ```

4. **Configure email validation:**
   - Set Email Input field type to "Email" (automatic validation)
   - Add custom validation in WIX Velo for each contact:
     ```javascript
     $w.onReady(function () {
       $w("#clientContactsRepeater").onItemReady(($item, itemData) => {
         $item("#clientEmailInput").onInput(() => {
           const email = $item("#clientEmailInput").value;
           const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
           if (email && !emailRegex.test(email)) {
             // Show error message
             $item("#emailError").text = "Invalid email format";
           } else {
             $item("#emailError").text = "";
           }
         });
       });
     });
     ```

5. **Handle primary contact selection:**
   - Ensure only one contact can be marked as primary
   - Use WIX Velo to uncheck others when one is selected:
     ```javascript
     $w.onReady(function () {
       $w("#clientContactsRepeater").onItemReady(($item, itemData) => {
         $item("#primaryCheckbox").onChange(() => {
           if ($item("#primaryCheckbox").checked) {
             // Uncheck all other primary checkboxes
             const allItems = $w("#clientContactsRepeater").data;
             allItems.forEach((contact, index) => {
               if (index !== itemData._index) {
                 contact.isPrimary = false;
               }
             });
             $w("#clientContactsRepeater").data = allItems;
           }
         });
       });
     });
     ```

6. **Save client contacts to collection:**
   - Create Velo function: `saveClientContacts(nominationId, contacts)`
   - Code:
     ```javascript
     import wixData from 'wix-data';
     
     export async function saveClientContacts(nominationId, contacts) {
       // Delete existing contacts for this nomination
       const existing = await wixData.query("ClientContacts")
         .eq("nominationId", nominationId)
         .find();
       
       for (let contact of existing.items) {
         await wixData.remove("ClientContacts", contact._id);
       }
       
       // Insert new contacts
       const contactsToSave = contacts.map((contact, index) => ({
         nominationId: nominationId,
         clientName: contact.clientName,
         clientEmail: contact.clientEmail,
         clientPhone: contact.clientPhone || "",
         clientRole: contact.clientRole || "",
         isPrimary: contact.isPrimary || false,
         order: index
       }));
       
       for (let contact of contactsToSave) {
         await wixData.insert("ClientContacts", contact);
       }
       
       return { success: true };
     }
     ```

7. **Add Validation: At Least One Contact Required:**
   - In submit validation function, check:
     ```javascript
     async function validateClientContacts(nominationId) {
       const contacts = await wixData.query("ClientContacts")
         .eq("nominationId", nominationId)
         .find();
       
       if (contacts.items.length === 0) {
         return { valid: false, error: "At least one client contact is required" };
       }
       
       // Validate all contacts have required fields
       for (let contact of contacts.items) {
         if (!contact.clientName || !contact.clientEmail) {
           return { valid: false, error: "All client contacts must have name and email" };
         }
       }
       
       return { valid: true };
     }
     ```

8. **Display client contacts (read-only view):**
   - On submitted nomination view, add **Repeater** element
   - Connect to ClientContacts Collection
   - Filter: `nominationId = currentNominationId`
   - Display: Name, Email, Phone, Role
   - Highlight primary contact
   - Use **Text** elements bound to collection fields

9. **Load Existing Contacts on Form:**
   - When loading draft nomination, fetch client contacts:
     ```javascript
     $w.onReady(async function () {
       const nominationId = $w("#url").query;
       if (nominationId) {
         const contacts = await wixData.query("ClientContacts")
           .eq("nominationId", nominationId)
           .ascending("order")
           .find();
         
         $w("#clientContactsRepeater").data = contacts.items;
       }
     });
     ```

10. **Test:**
    - Add first client contact, verify saves
    - Add second client contact, verify both save
    - Test "Add Another Contact" button
    - Test "Remove Contact" button
    - Test primary contact selection (only one can be primary)
    - Test email validation for each contact
    - Test validation: try submitting with no contacts (should fail)
    - Save draft, verify all contacts persist
    - Submit nomination, verify all contacts saved correctly
    - View submitted nomination, verify all contacts display

---

### Upload required artifacts
**Goal:** Satisfy completeness requirements.

**Wix implementation:**
- **Upload Button** elements (file upload) in nomination form
- Store files in the Wix Media Manager
- Link file references in `Nominations` collection
- File type/size validation (Velo by Wix)
- Multiple file uploads supported
- Display uploaded files list with download links

**How-to / To-do:**
1. **Add file fields to `Nominations` collection:**
   - Add field: `evidenceArtifacts` (Media Gallery - allows multiple files)
   - Or use separate fields for each artifact type if needed

2. **Add upload element:**
   - On nomination form, add **Upload Button** (file upload) element
   - Settings: Allow multiple files, set accepted file types (PDF, DOC, DOCX, images, etc.)
   - Set maximum file size (e.g., 10MB per file)

3. **Add file validation (Velo by Wix):**
   - In page code, add validation on file upload:
     ```javascript
     $w.onReady(function () {
       $w("#fileUpload").onChange(() => {
         const files = $w("#fileUpload").value;
         files.forEach(file => {
           // Check file size (max 10MB)
           if (file.size > 10 * 1024 * 1024) {
             // Show error: File too large
           }
           // Check file type
           const allowedTypes = ['pdf', 'doc', 'docx', 'jpg', 'png'];
           const extension = file.name.split('.').pop().toLowerCase();
           if (!allowedTypes.includes(extension)) {
             // Show error: File type not allowed
           }
         });
       });
     });
     ```

4. **Save files to collection:**
   - Upload Button element automatically saves to a Media Gallery field
   - Files are stored in the Wix Media Manager
   - File URLs/references stored in `Nominations` collection

5. **Display Uploaded Files:**
   - Add **Gallery** element or **Repeater** to show uploaded files
   - Bind to `evidenceArtifacts` field from Nominations Collection
   - Show file names, sizes, download links
   - Allow delete (only if status = "Draft")

6. **Test:**
   - Upload single file, verify it appears in list
   - Upload multiple files, verify all saved
   - Test file size validation (try file >10MB)
   - Test file type validation (try disallowed type)
   - Test file deletion (draft vs submitted status)

---

### Provide required narrative sections
**Goal:** Supply evidence for Stage 1 scoring.

**Wix implementation:**
- **Rich Text Editor** or **Text Area** elements in nomination form
- Sections: Written Submission (≤2,000 words), Exemplary Section (500 words), Impact Section (300 words), Lessons Section (300 words)
- Word count validation (WIX Velo)
- Store in Nominations Collection as rich text fields
- Character/word limits enforced

**How-to / To-do:**
1. **Add Narrative Fields to Nominations Collection:**
   - Add field: `writtenSubmission` (Rich Text)
   - Add field: `exemplarySection` (Rich Text)
   - Add field: `impactSection` (Rich Text)
   - Add field: `lessonsSection` (Rich Text)

2. **Add Text Input Elements:**
   - On nomination form, add **Rich Text Editor** or **Text Input** for each section:
     - Written Submission (Rich Text Editor recommended)
     - Exemplary Section
     - Impact Section
     - Lessons Section

3. **Add Word Count Display:**
   - Add **Text** element below each input to show word count
   - Use WIX Velo to calculate and display:
     ```javascript
     $w.onReady(function () {
       $w("#writtenSubmissionInput").onInput(() => {
         const text = $w("#writtenSubmissionInput").value;
         const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
         $w("#writtenSubmissionCount").text = `${wordCount} / 2000 words`;
         
         // Change color if over limit
         if (wordCount > 2000) {
           $w("#writtenSubmissionCount").style.color = "red";
         } else {
           $w("#writtenSubmissionCount").style.color = "black";
         }
       });
     });
     ```

4. **Add Word Count Validation:**
   - In submit validation function, check word counts:
     ```javascript
     function countWords(text) {
       return text.trim().split(/\s+/).filter(word => word.length > 0).length;
     }
     
     function validateWordCounts(nomination) {
       const errors = [];
       if (countWords(nomination.writtenSubmission) > 2000) {
         errors.push("Written Submission exceeds 2000 words");
       }
       if (countWords(nomination.exemplarySection) > 500) {
         errors.push("Exemplary Section exceeds 500 words");
       }
       // ... etc
       return errors;
     }
     ```

5. **Set Character Limits (Optional):**
   - In Text Input settings, set Max Length (approximate: words × 6)
   - Or use WIX Velo to prevent typing beyond limit

6. **Save to Collection:**
   - Form fields automatically save to Nominations Collection
   - Rich text formatting preserved in Rich Text fields

7. **Test:**
   - Enter text in each section
   - Verify word count updates in real-time
   - Test word limit validation (try exceeding limits)
   - Test submission with valid word counts
   - Verify text saves correctly with formatting

---

### View nomination status
**Goal:** Transparency and tracking.

**Wix implementation:**
- **Dynamic Page** or dashboard showing nomination status
- Pull from Nominations Collection: status field
- Status badges/indicators (Draft, Submitted, Under Review, Incomplete, Shortlisted, Not Shortlisted)
- Status history/timeline (optional, via WIX Velo)
- Real-time status updates

**How-to / To-do:**
1. **Add status field to `Nominations` collection:**
   - Ensure `status` field exists (Text type)
   - Set possible values: "Draft", "Submitted", "Under Review", "Incomplete", "Shortlisted", "Not Shortlisted", "Withdrawn"

2. **Create Status Display on Dashboard:**
   - Add **Repeater** element showing nominations
   - Filter: `ownerId = currentMember._id`
   - Add **Text** element in repeater showing status
   - Bind to `status` field from Nominations Collection

3. **Add Status Badges:**
   - Use **Text** elements with conditional styling based on status
   - In WIX Velo, set background color/text color:
     ```javascript
     $w.onReady(function () {
       $w("#nominationsRepeater").onItemReady(($item, itemData) => {
         const status = itemData.status;
         const statusColors = {
           "Draft": "#gray",
           "Submitted": "#blue",
           "Under Review": "#orange",
           "Incomplete": "#yellow",
           "Shortlisted": "#green",
           "Not Shortlisted": "#red"
         };
         $item("#statusBadge").style.backgroundColor = statusColors[status] || "#gray";
         $item("#statusBadge").text = status;
       });
     });
     ```

4. **Create Nomination Detail Page (Dynamic):**
   - Create page: "Nomination Status"
   - Set as Dynamic Page with URL: `/nomination-status/[nominationId]`
   - Add **Dataset** element connected to Nominations Collection
   - Filter by URL parameter: `nominationId`
   - Display status prominently

5. **Add Status History (Optional):**
   - Create **StatusHistory Collection** with fields: nominationId, status, changedDate, changedBy
   - In WIX Velo, log status changes:
     ```javascript
     async function updateStatus(nominationId, newStatus) {
       // Update nomination
       await wixData.update("Nominations", {_id: nominationId}, {status: newStatus});
       
       // Log status change
       await wixData.insert("StatusHistory", {
         nominationId: nominationId,
         status: newStatus,
         changedDate: new Date(),
         changedBy: currentMember._id
       });
     }
     ```
   - Display status history timeline on detail page

6. **Auto-Refresh Status (Optional):**
   - Use WIX Velo to periodically refresh status
   - Or use page refresh on focus

7. **Test:**
   - View dashboard as nominee, verify statuses display correctly
   - Check status badges show correct colors
   - Navigate to nomination detail, verify status shown
   - Test status history timeline (if implemented)

---

### Respond to completion request
**Goal:** Remediate incompleteness within deadline.

**Wix implementation:**
- Notification with link to "Complete Submission" page
- Show missing items checklist
- Allow editing of incomplete sections
- Re-upload missing files
- Submit updated materials
- Update status back to "Submitted" after completion
- Deadline tracking and warnings

**How-to / To-do:**
1. **Add completion request fields to `Nominations` collection:**
   - Add field: `completionRequestDate` (Date)
   - Add field: `completionDeadline` (Date)
   - Add field: `missingItems` (Text - list of missing items)
   - Add field: `completionRequestNotes` (Text)

2. **Create completion request email template:**
   - Go to **Marketing & SEO** → **Email Marketing** → **Templates**
   - Create template: "Completion Request"
   - Include: missing items list, deadline, link to complete submission page
   - Link format: `https://yoursite.com/complete-submission/[nominationId]`

3. **Create "Complete Submission" page:**
   - Create page: "Complete Submission"
   - Set as Dynamic Page: `/complete-submission/[nominationId]`
   - Add **Dataset** connected to Nominations Collection
   - Filter by nominationId from URL

4. **Display Missing Items Checklist:**
   - Add **Text** element showing missing items (from `missingItems` field)
   - Format as checklist or bullet list
   - Show deadline prominently with countdown

5. **Add Deadline Countdown:**
   - Add **Text** element for countdown
   - Use WIX Velo to calculate days remaining:
     ```javascript
     $w.onReady(function () {
       $w("#nominationDataset").onReady(() => {
         const deadline = $w("#nominationDataset").getCurrentItem().completionDeadline;
         const now = new Date();
         const daysRemaining = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
         
         if (daysRemaining < 0) {
           $w("#deadlineCountdown").text = "OVERDUE";
           $w("#deadlineCountdown").style.color = "red";
         } else {
           $w("#deadlineCountdown").text = `${daysRemaining} days remaining`;
         }
       });
     });
     ```

6. **Enable Editing:**
   - Show same nomination form as "Start Nomination" but pre-filled
   - Allow editing all fields
   - Allow re-uploading files
   - Add "Save & Submit" button

7. **Create submit-updated-materials function:**
   - Create Velo function: `submitUpdatedNomination(nominationId)`
   - Validate all missing items are now provided
   - Update status back to "Submitted"
   - Clear completion request fields
   - Notify Nominee Coach

8. **Add Deadline Warnings:**
   - In dashboard, highlight nominations with approaching deadlines
   - Send reminder email 2 days before deadline (WIX Velo scheduled function)

9. **Test:**
   - Simulate completion request (set missingItems, deadline)
   - Verify email sent with correct link
   - Click link, verify page loads with missing items shown
   - Complete missing items, submit
   - Verify status updates to "Submitted"
   - Test deadline countdown display

---

### Withdraw nomination
**Goal:** Allow nominee-controlled termination.

**Wix implementation:**
- "Withdraw" button on nomination detail page
- Confirmation dialog
- Update status to "Withdrawn" in Nominations Collection
- Record withdrawal timestamp and reason (optional)
- Lock nomination from further changes
- Notify Nominee Coach (WIX Velo)

**How-to / To-do:**
1. **Add withdrawal fields to `Nominations` collection:**
   - Add field: `withdrawnDate` (Date)
   - Add field: `withdrawnBy` (Reference to Members)
   - Add field: `withdrawalReason` (Text, Optional)

2. **Add Withdraw Button:**
   - On nomination detail page, add **Button**: "Withdraw Nomination"
   - Show button only if status = "Draft" or "Submitted" (not already processed)
   - Set button action: **Run Code**

3. **Create Withdrawal Confirmation Dialog:**
   - Use WIX **Lightbox** element or custom modal
   - Ask: "Are you sure you want to withdraw this nomination?"
   - Optional: Text input for withdrawal reason
   - Buttons: "Cancel" and "Confirm Withdrawal"

4. **Create withdraw function (Velo by Wix):**
   - Create function: `withdrawNomination(nominationId, reason)`
   - Code:
     ```javascript
     import wixData from 'wix-data';
     import { currentMember } from 'wix-members';
     
     export async function withdrawNomination(nominationId, reason) {
       const member = await currentMember();
       const update = {
         status: "Withdrawn",
         withdrawnDate: new Date(),
         withdrawnBy: member._id,
         withdrawalReason: reason || ""
       };
       const result = await wixData.update("Nominations", {_id: nominationId}, update);
       
       // Notify Nominee Coach (send email)
       // ... email notification code
       
       return result;
     }
     ```

5. **Lock Nomination After Withdrawal:**
   - In page code, check if status = "Withdrawn"
   - Hide all edit buttons and forms
   - Show read-only view with withdrawal notice
   - Display withdrawal date and reason

6. **Notify Nominee Coach:**
   - Create email template: "Nomination Withdrawn"
   - Trigger email in withdraw function
   - Include: nominee name, nomination ID, withdrawal date, reason

7. **Test:**
   - Click "Withdraw" button on draft nomination
   - Verify confirmation dialog appears
   - Confirm withdrawal, verify status updates
   - Verify nomination is locked from editing
   - Check Nominee Coach receives notification
   - Test withdrawal reason is saved (if provided)

---

### Receive Stage 1 outcome notification
**Goal:** Communicate Stage 1 decision.

**Wix implementation:**
- **Email Marketing** template for outcome notification
- Triggered by Nominee Coach action (Velo by Wix)
- Email contains: outcome (shortlisted/not shortlisted), category, next steps
- In-app notification badge on dashboard (optional)
- Link to view detailed results

**How-to / To-do:**
1. **Create email templates:**
   - Go to **Marketing & SEO** → **Email Marketing** → **Templates**
   - Create template: "Stage 1 Outcome - Shortlisted"
   - Create template: "Stage 1 Outcome - Not Shortlisted"
   - Include variables: {nomineeName}, {nominationId}, {category}, {outcome}, {nextSteps}

2. **Create send-notification function (Velo by Wix):**
   - This function is called by Nominee Coach (see Nominee Coach use cases)
   - Function: `sendOutcomeNotification(nominationId, outcome)`
   - Code:
     ```javascript
     import wixData from 'wix-data';
     import { sendEmail } from 'backend/email';
     
     export async function sendOutcomeNotification(nominationId, outcome) {
       const nomination = await wixData.get("Nominations", nominationId);
       const nominee = await wixData.get("Members", nomination.ownerId);
       
       const template = outcome === "Shortlisted" 
         ? "Stage 1 Outcome - Shortlisted" 
         : "Stage 1 Outcome - Not Shortlisted";
       
       await sendEmail({
         to: nominee.email,
         template: template,
         variables: {
           nomineeName: nominee.name,
           nominationId: nomination.nominationId,
           category: nomination.category,
           outcome: outcome
         }
       });
     }
     ```

3. **Add in-app notification badge (optional):**
   - Add **Text** element on dashboard: "New Updates"
   - Use WIX Velo to check if outcome notification sent but not viewed
   - Add field to Nominations Collection: `outcomeViewed` (Boolean)
   - Show badge if `outcomeViewed = false` and status = "Shortlisted" or "Not Shortlisted"

4. **Create Outcome View Page:**
   - Create page: "Stage 1 Results"
   - Dynamic page: `/stage1-results/[nominationId]`
   - Display outcome prominently
   - Show category, scores (if applicable), next steps
   - Mark as viewed when page loads

5. **Add Link in Email:**
   - Include link in email template: `https://yoursite.com/stage1-results/[nominationId]`
   - Link opens outcome view page

6. **Test:**
   - Trigger notification from Nominee Coach interface
   - Verify email sent to nominee
   - Click link in email, verify page loads
   - Check in-app notification badge (if implemented)
   - Verify outcome viewed flag updates

---

### Receive Stage 1 feedback (if not shortlisted)
**Goal:** Enable improvement for future cycles.

**Wix implementation:**
- Feedback stored in Nominations Collection (feedback field)
- Display on nomination detail page (read-only)
- Include in outcome notification email
- Summary of scores and key improvement areas
- Generated from assessor comments (WIX Velo aggregation)

**How-to / To-do:**
1. **Add feedback field to `Nominations` collection:**
   - Add field: `feedback` (Rich Text)
   - Add field: `feedbackGeneratedDate` (Date)

2. **Create feedback-generation function (Velo by Wix):**
   - Function: `generateFeedback(nominationId)`
   - Aggregates assessor comments and scores
   - Code:
     ```javascript
     import wixData from 'wix-data';
     
     export async function generateFeedback(nominationId) {
       // Get all assessments for this nomination
       const assessments = await wixData.query("Assessments")
         .eq("nominationId", nominationId)
         .find();
       
       // Calculate average scores per criterion
       const avgScores = calculateAverageScores(assessments);
       
       // Aggregate key comments (lowest scoring criteria)
       const lowScores = Object.entries(avgScores)
         .filter(([criterion, score]) => score < 3)
         .sort((a, b) => a[1] - b[1]);
       
       // Build feedback summary
       let feedback = "## Stage 1 Assessment Feedback\n\n";
       feedback += "### Overall Performance\n";
       feedback += `Your nomination received an average score of ${avgScores.total}.\n\n`;
       
       feedback += "### Areas for Improvement\n";
       lowScores.forEach(([criterion, score]) => {
         const comments = getCommentsForCriterion(assessments, criterion);
         feedback += `**${criterion}** (Score: ${score}/5)\n`;
         feedback += `${comments.join(" ")}\n\n`;
       });
       
       // Save feedback to nomination
       await wixData.update("Nominations", {_id: nominationId}, {
         feedback: feedback,
         feedbackGeneratedDate: new Date()
       });
       
       return feedback;
     }
     ```

3. **Display feedback on detail page:**
   - On "Stage 1 Results" page, add **Text** element
   - Bind to `feedback` field from Nominations Collection
   - Show only if status = "Not Shortlisted"
   - Format as rich text (if using Rich Text field)

4. **Include feedback in email:**
   - In "Stage 1 Outcome - Not Shortlisted" email template
   - Include feedback section with {feedback} variable
   - Format feedback nicely in email

5. **Auto-Generate Feedback:**
   - When Nominee Coach marks nomination as "Not Shortlisted"
   - Automatically call `generateFeedback` function
   - Store feedback in Nominations Collection

6. **Test:**
   - Mark nomination as "Not Shortlisted" (as Nominee Coach)
   - Verify feedback generated and saved
   - View feedback on nominee's results page
   - Check feedback included in notification email
   - Verify feedback format is readable

---

## Nominee Portal Structure

**Recommended Pages:**
1. **Dashboard** - Overview of nominations, status, quick actions
2. **Start Nomination** - Form to create new nomination
3. **My Nominations** - List of all nominations (drafts, submitted, completed)
4. **Nomination Detail** - View/edit specific nomination (if draft or incomplete)
5. **Submission Status** - View-only status and feedback for submitted nominations

**Wix components:**
- Members Area / Site Members (authentication)
- Content Manager collections (data storage)
- Forms (data entry)
- Dynamic Pages (nomination detail views)
- Velo by Wix (custom logic, validation, workflows)
- Email Marketing / Automations (notifications)
