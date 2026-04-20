import { getMyNomination, createDraftNomination, saveNomination } from 'backend/nomination.web';
import { getMyCustomers, deleteCustomer } from 'backend/customer.web';
import wixLocation from 'wix-location';
import wixWindow from 'wix-window';

// --- CONFIGURATION ---
const STATE = {
    LOADING: 'LOADING',
    EMPTY:   'EMPTY',
    DRAFT:   'DRAFT',
    SUBMITTED: 'SUBMITTED'
};

// Inputs to Lock in Read-Only Mode
const INPUTS_TO_LOCK = [
    '#titleInput', '#companyInput',
    '#richTextBoxExamplary', '#richTextBoxImpact', '#richTextBoxLessons',
    '#gdprCheckbox', '#retentionCheckbox', '#publicationCheckbox','#addCustomerBtn'
];

// Buttons to Hide in Read-Only Mode

const ACTION_BUTTONS = ['#saveDraftBtn', '#submitFinalBtn'];

// File Upload Definitions

const FILE_DEFINITIONS = [
    { key: 'mainNarrative',      btnId: '#uploadNarrative' },
    { key: 'fileContractMatrix', btnId: '#uploadContractMatrix' },
    { key: 'fileRaci',           btnId: '#uploadRACI' }
];

// --- GLOBAL STATE ---

let loadedNomination = {};

$w.onReady(async function () {
    showState(STATE.LOADING);
    // --- BIND ACTIONS (ONCE) ---
    // Start Button
    $w('#startNominationBtn').onClick(async () => {
        $w('#startNominationBtn').disable();
        $w('#startNominationBtn').label = "Creating...";
        try {
            const newRecord = await createDraftNomination();
            populateForm(newRecord, false); // False = Editable
            showState(STATE.DRAFT);
        } catch (error) {
            console.error(error);
            $w('#errorMsg').text = "Error creating nomination.";
            $w('#errorMsg').expand();
            $w('#startNominationBtn').enable();
        }

    });



    // File Delete Buttons (Bind specific delete logic)

    $w('#deleteNarrativeBtn').onClick(() => handleFileDelete('mainNarrative', '#uploadNarrative', '#viewNarrativeBtn', '#deleteNarrativeBtn'));

    $w('#deleteContractBtn').onClick(() => handleFileDelete('fileContractMatrix', '#uploadContractMatrix', '#viewContractBtn', '#deleteContractBtn'));

    $w('#deleteRaciBtn').onClick(() => handleFileDelete('fileRaci', '#uploadRACI', '#viewRaciBtn', '#deleteRaciBtn'));



    // Save & Submit Buttons

    $w('#saveDraftBtn').onClick(() => handleSave(false));

    $w('#submitFinalBtn').onClick(() => handleSave(true));



    // --- LOAD DATA ---
    try {
        let nomination = await getMyNomination();

        // First-time nominee flow: auto-create draft instead of waiting for Start click.
        if (!nomination) {
            nomination = await createDraftNomination();
        }

        if (nomination.status === 'SUBMITTED') {
            populateForm(nomination, true); // True = Locked
            showState(STATE.SUBMITTED);
        } else {
            populateForm(nomination, false); // False = Editable
            showState(STATE.DRAFT);
        }
    } catch (error) {
        console.error("Load failed", error);

        // Recovery path: in case initial fetch races session propagation, attempt draft create once.
        try {
            const fallbackDraft = await createDraftNomination();
            populateForm(fallbackDraft, false);
            showState(STATE.DRAFT);
        } catch (createError) {
            console.error("Draft auto-create failed", createError);
            $w('#errorMsg').text = "Could not load your nomination right now. Please try again in a moment.";
            $w('#errorMsg').expand();
        }
    }



    // --- CUSTOMER TABLE LOGIC ---



   

    let selectedCustomerIndex = null; // <--- SELECTED ROW TRACKING VARIABLE

    $w('#deleteCustomerBtn').disable();

    // We capture the index from the event and store it in our variable

    $w('#customerTable').onRowSelect((event) => {

        selectedCustomerIndex = event.rowIndex; // <--- STORE THE INDEX HERE

        console.log('selected index:' + selectedCustomerIndex);

        $w('#deleteCustomerBtn').enable();

    });



    // 1. Load the table when page loads

    refreshCustomerTable();

    // 2. "Add Customer" Button -> Open Lightbox

    $w('#addCustomerBtn').onClick(async () => {

        // Open the Lightbox and wait for it to close

        const newCustomer = await wixWindow.openLightbox("AddCustomerPopup");

       

        // If they saved something, refresh the table

        if (newCustomer) {

            refreshCustomerTable();

        }

    });



    // 3. "Delete Customer" Button

    $w('#deleteCustomerBtn').onClick(async () => {

        // Safety check: Make sure we actually caught an ID

        if (selectedCustomerIndex === null || selectedCustomerIndex === undefined) return;

       

        const selectedIndex = selectedCustomerIndex;

        if (selectedIndex === undefined || selectedIndex < 0) return; // Nothing selected



        $w('#deleteCustomerBtn').disable();

        $w('#deleteCustomerBtn').label = "Deleting...";



        try {

            // Get the ID of the selected row

            const rows = $w('#customerTable').rows;

            const recordId = rows[selectedIndex]._id;

            console.log('recordId: ' + recordId);

            await deleteCustomer(recordId);

            await refreshCustomerTable(); // Reload table

            selectedCustomerIndex = null;

            $w('#deleteCustomerBtn').label = "Delete Selected";

            $w('#deleteCustomerBtn').disable(); // Keep disabled until they select a new row

        } catch (err) {

            console.error(err);

            $w('#deleteCustomerBtn').enable();

            $w('#deleteCustomerBtn').label = "Delete Selected";

        }

       

        $w('#deleteCustomerBtn').enable();

        $w('#deleteCustomerBtn').label = "Delete Selected";

    });



});



// --- HELPER: REFRESH TABLE ---

async function refreshCustomerTable() {

    // Show a loading indicator if you have one, or dim the table

    try {

        const data = await getMyCustomers();

        console.log(data);

        $w('#customerTable').rows = data;

    } catch (err) {

        console.error("Failed to load customers", err);

    }

}



// --- HELPER 1: STATE SWITCHER ---

function showState(state) {

    const sections = ['#loadingBox', '#introBox', '#editBox'];

    sections.forEach(id => $w(id).collapse());



    switch(state) {

        case STATE.LOADING:   $w('#loadingBox').expand(); break;

        case STATE.EMPTY:     $w('#introBox').expand(); break;

        case STATE.DRAFT:    

        case STATE.SUBMITTED:

            $w('#editBox').expand();

            break;

    }

}



// --- HELPER 2: POPULATE & LOCK ---

function populateForm(data, isLocked) {

    loadedNomination = data;



    // 1. FILL VALUES

    $w('#titleInput').value = data.title || "";

    $w('#companyInput').value = data.company || "";

    $w('#statusText').text = data.status || "DRAFT";

   

    // Rich Text

    $w('#richTextBoxExamplary').value = data.exemplary || "";

    $w('#richTextBoxImpact').value    = data.impact || "";

    $w('#richTextBoxLessons').value   = data.lessons || "";

   

    // Booleans

    $w('#gdprCheckbox').checked        = data.gdprCheck || false;

    $w('#retentionCheckbox').checked   = data.retentionPolicy || false;

    $w('#publicationCheckbox').checked = data.publicationConsent || false;



    // Names

    $w('#coachText').text = data.coachNameDisplay || "Not Assigned";

    $w('#ownerText').text = data.nomineeNameDisplay || "Unknown";



    // 2. RENDER FILES

    renderFileState('mainNarrative',      '#uploadNarrative',      '#viewNarrativeBtn', '#deleteNarrativeBtn', isLocked);

    renderFileState('fileContractMatrix', '#uploadContractMatrix', '#viewContractBtn', '#deleteContractBtn', isLocked);

    renderFileState('fileRaci',           '#uploadRACI',           '#viewRaciBtn',      '#deleteRaciBtn',      isLocked);



    // 3. LOCK/UNLOCK UI ELEMENTS

    if (isLocked) {

        INPUTS_TO_LOCK.forEach(id => $w(id).disable());

        ACTION_BUTTONS.forEach(id => $w(id).collapse());

        $w('#statusText').text = "SUBMITTED ";

    } else {

        INPUTS_TO_LOCK.forEach(id => $w(id).enable());

        ACTION_BUTTONS.forEach(id => $w(id).expand());

    }

}



// --- HELPER: RENDER FILES ---

function renderFileState(fieldKey, uploadId, viewId, deleteId, isLocked) {

    const currentUrl = loadedNomination[fieldKey];



    if (currentUrl) {

        // FILE EXISTS

        $w(viewId).expand();

        $w(viewId).link = currentUrl;

        $w(viewId).target = "_blank";

        $w(uploadId).collapse();



        // If locked, hide delete. If editable, show delete.

        isLocked ? $w(deleteId).collapse() : $w(deleteId).expand();



    } else {

        // NO FILE

        $w(viewId).collapse();

        $w(deleteId).collapse();



        // If locked, hide upload (clean look). If editable, show upload.

        isLocked ? $w(uploadId).collapse() : $w(uploadId).expand();

    }

}



// --- HELPER: DELETE LOGIC ---

function handleFileDelete(fieldKey, uploadId, viewId, deleteId) {

    if (loadedNomination.status === 'SUBMITTED') return;



    loadedNomination[fieldKey] = null;

    $w(viewId).collapse();

    $w(deleteId).collapse();

    $w(uploadId).expand();

}



// --- HELPER: BATCH UPLOAD FILES ---

async function processFileUploads() {

    const fileResults = {};



    for (const def of FILE_DEFINITIONS) {

        const $btn = $w(def.btnId);



        if ($btn.value.length > 0) {

            // New File Selected

            console.log(`Uploading ${def.key}...`);

            try {

                const result = await $btn.startUpload();

                fileResults[def.key] = result.url;

            } catch (uploadError) {

                console.error(`Upload failed for ${def.key}`, uploadError);

                throw new Error(`Failed to upload file for ${def.key}`);

            }

        } else {

            // Use existing or null (from memory)

            fileResults[def.key] = loadedNomination[def.key];

        }

    }

    return fileResults;

}



// --- MAIN ACTION: SAVE / SUBMIT ---

async function handleSave(isFinalSubmission) {

   

    $w('#errorMsg').hide();

   

    const $saveBtn = $w('#saveDraftBtn');

    const $submitBtn = $w('#submitFinalBtn');



    // 1. HARMONIZED VALIDATION

    // We run it for both Draft and Final, passing the boolean down

    const missingFields = validateForm(isFinalSubmission);

   

    if (missingFields.length > 0) {

        // STOP! Show error message in Lightbox.

        const msg = "Please complete the following required fields:\n• " + missingFields.join("\n• ");

        console.log(msg);

       

        wixWindow.openLightbox("Alert", {

            message: msg

        });

       

        return; // Halt save process

    }



    // 2. UI LOADING STATE

    $saveBtn.disable();

    $submitBtn.disable();

    const originalLabel = isFinalSubmission ? "Submit Final" : "Save Draft";

    const $activeBtn = isFinalSubmission ? $submitBtn : $saveBtn;

    $activeBtn.label = isFinalSubmission ? "Submitting..." : "Saving...";



    try {

        // 3. UPLOAD FILES FIRST

        const fileData = await processFileUploads();



        // 4. GATHER DATA

        const formData = {

            title:   $w('#titleInput').value,

            company: $w('#companyInput').value,

            exemplary: $w('#richTextBoxExamplary').value,

            impact:    $w('#richTextBoxImpact').value,

            lessons:   $w('#richTextBoxLessons').value,

            gdprCheck:          $w('#gdprCheckbox').checked,

            retentionPolicy:    $w('#retentionCheckbox').checked,

            publicationConsent: $w('#publicationCheckbox').checked,

            ...fileData

        };



        // 5. SEND TO BACKEND

        await saveNomination(formData, isFinalSubmission);



        // 6. SUCCESS

        if (isFinalSubmission) {

            wixLocation.to(wixLocation.url); // Refresh to lock

        } else {

            // Update local state without refresh

            loadedNomination = { ...loadedNomination, ...formData };

            $activeBtn.label = "Saved!";

           

            // Re-render to show "View" buttons for any newly uploaded files

            populateForm(loadedNomination, false);

           

            setTimeout(() => {

                $saveBtn.enable();

                $submitBtn.enable();

                $activeBtn.label = originalLabel;

            }, 2000);

        }



    } catch (error) {

        console.error("Save failed", error);

        $w('#errorMsg').text = "Save failed: " + error.message;

        $w('#errorMsg').expand();

        $saveBtn.enable();

        $submitBtn.enable();

        $activeBtn.label = originalLabel;

    }

}





// We pass in isFinal to know whether to enforce file uploads

function validateForm(isFinal) {

    const missing = [];



    // Helper: Checks validity and adds to list

    const check = (id, isValid, friendlyName) => {

        if (!isValid) {

            missing.push(friendlyName);

        }

    };



    // 1. Validate Inputs (Required for BOTH Draft and Final)

    check('#titleInput', $w('#titleInput').value, "Title");

    check('#companyInput', $w('#companyInput').value, "Company");

    check('#richTextBoxExamplary', $w('#richTextBoxExamplary').value, "Exemplary Section");

   

    // 2. Validate Policies (Required for BOTH Draft and Final)

    check('#gdprCheckbox', $w('#gdprCheckbox').checked, "GDPR Consent");

    check('#retentionCheckbox', $w('#retentionCheckbox').checked, "Retention Policy");

    check('#publicationCheckbox', $w('#publicationCheckbox').checked, "Publication Consent");



    // 3. Validate Files (ONLY required for Final Submission)

    if (isFinal) {

        const hasNarrative = loadedNomination.mainNarrative || $w('#uploadNarrative').value.length > 0;

        if (!hasNarrative) missing.push("Main Narrative File");



        const hasContract = loadedNomination.fileContractMatrix || $w('#uploadContractMatrix').value.length > 0;

        if (!hasContract) missing.push("Contract Matrix File");



        const hasRaci = loadedNomination.fileRaci || $w('#uploadRACI').value.length > 0;

        if (!hasRaci) missing.push("RACI File");

    }



    return missing;

}



function resetValidationVisuals() {

    INPUTS_TO_LOCK.forEach(id => {

        const element = $w(id);

        try {

            if (element.style) {

            // RESET SAFELY: Use null or undefined

            element.style.borderColor = null;

            if (element.style.color) element.style.color = null;

        }    

        } catch (error) {

            console.log("visual reset error" + error)

        }

       

    });

}