// public/nominationView.js

/* ==========================================
   UI IDs USED IN THIS MODULE:
   Containers/Text:
   - #loadingBox, #introBox, #editBox, #errorMsg
   - #statusText, #coachText, #ownerText
   
   Inputs & Checkboxes:
   - #titleInput, #companyInput
   - #richTextBoxExamplary, #richTextBoxImpact, #richTextBoxLessons
   - #gdprCheckbox, #retentionCheckbox, #publicationCheckbox
   
   Buttons:
   - #startNominationBtn, #saveDraftBtn, #submitFinalBtn, #addCustomerBtn (Locked on submit)
   
   Files (Upload / View / Delete):
   - #uploadNarrative, #viewNarrativeBtn, #deleteNarrativeBtn
   - #uploadContractMatrix, #viewContractBtn, #deleteContractBtn
   - #uploadRACI, #viewRaciBtn, #deleteRaciBtn
   ========================================== */

   import { getMyNomination, createDraftNomination, saveNomination } from 'backend/nomination.web';
   import wixLocation from 'wix-location';
   import wixWindow from 'wix-window';
   
   let $w;
   let loadedNomination = {}; 
   
   const STATE = {
       LOADING: 'LOADING',
       EMPTY:   'EMPTY',
       DRAFT:   'DRAFT',
       SUBMITTED: 'SUBMITTED'
   };
   
   const INPUTS_TO_LOCK = [
       '#titleInput', '#companyInput', 
       '#richTextBoxExamplary', '#richTextBoxImpact', '#richTextBoxLessons',
       '#gdprCheckbox', '#retentionCheckbox', '#publicationCheckbox', '#addCustomerBtn'
   ];
   
   const ACTION_BUTTONS = ['#saveDraftBtn', '#submitFinalBtn'];
   
   const FILE_DEFINITIONS = [
       { key: 'mainNarrative',      btnId: '#uploadNarrative' },
       { key: 'fileContractMatrix', btnId: '#uploadContractMatrix' },
       { key: 'fileRaci',           btnId: '#uploadRACI' }
   ];
   
   export async function initNominationView(page$w) {
       $w = page$w;
       
       showState(STATE.LOADING);
   
       // --- BIND ACTIONS ---
       $w('#startNominationBtn').onClick(async () => {
           $w('#startNominationBtn').disable();
           $w('#startNominationBtn').label = "Creating...";
           try {
               const newRecord = await createDraftNomination();
               populateForm(newRecord, false);
               showState(STATE.DRAFT);
           } catch (error) {
               console.error(error);
               $w('#errorMsg').text = "Error creating nomination.";
               $w('#errorMsg').expand();
               $w('#startNominationBtn').enable();
           }
       });
   
       $w('#deleteNarrativeBtn').onClick(() => handleFileDelete('mainNarrative', '#uploadNarrative', '#viewNarrativeBtn', '#deleteNarrativeBtn'));
       $w('#deleteContractBtn').onClick(() => handleFileDelete('fileContractMatrix', '#uploadContractMatrix', '#viewContractBtn', '#deleteContractBtn'));
       $w('#deleteRaciBtn').onClick(() => handleFileDelete('fileRaci', '#uploadRACI', '#viewRaciBtn', '#deleteRaciBtn'));
   
       $w('#saveDraftBtn').onClick(() => handleSave(false));
       $w('#submitFinalBtn').onClick(() => handleSave(true));
   
       // --- LOAD DATA ---
       try {
           const nomination = await getMyNomination();
   
           if (!nomination) {
               showState(STATE.EMPTY);
           } else if (nomination.status === 'SUBMITTED') {
               populateForm(nomination, true);
               showState(STATE.SUBMITTED);
           } else {
               populateForm(nomination, false);
               showState(STATE.DRAFT);
           }
       } catch (error) {
           console.error("Load failed", error);
           $w('#errorMsg').text = "Could not load data. Please refresh.";
           $w('#errorMsg').expand();
       }
   }
   
   // --- HELPER FUNCTIONS ---
   
   function showState(state) {
       const sections = ['#loadingBox', '#introBox', '#editBox'];
       sections.forEach(id => $w(id).collapse());
   
       switch(state) {
           case STATE.LOADING:   $w('#loadingBox').expand(); break;
           case STATE.EMPTY:     $w('#introBox').expand(); break;
           case STATE.DRAFT:     
           case STATE.SUBMITTED: $w('#editBox').expand(); break;
       }
   }
   
   function populateForm(data, isLocked) {
       loadedNomination = data;
   
       $w('#titleInput').value = data.title || "";
       $w('#companyInput').value = data.company || "";
       $w('#statusText').text = data.status || "DRAFT";
       
       $w('#richTextBoxExamplary').value = data.exemplary || "";
       $w('#richTextBoxImpact').value    = data.impact || "";
       $w('#richTextBoxLessons').value   = data.lessons || "";
       
       $w('#gdprCheckbox').checked        = data.gdprCheck || false;
       $w('#retentionCheckbox').checked   = data.retentionPolicy || false;
       $w('#publicationCheckbox').checked = data.publicationConsent || false;
   
       $w('#coachText').text = data.coachNameDisplay || "Not Assigned";
       $w('#ownerText').text = data.nomineeNameDisplay || "Unknown";
   
       renderFileState('mainNarrative',      '#uploadNarrative',      '#viewNarrativeBtn', '#deleteNarrativeBtn', isLocked);
       renderFileState('fileContractMatrix', '#uploadContractMatrix', '#viewContractBtn', '#deleteContractBtn', isLocked);
       renderFileState('fileRaci',           '#uploadRACI',           '#viewRaciBtn',      '#deleteRaciBtn',      isLocked);
   
       if (isLocked) {
           INPUTS_TO_LOCK.forEach(id => $w(id).disable());
           ACTION_BUTTONS.forEach(id => $w(id).collapse());
           $w('#statusText').text = "SUBMITTED ";
       } else {
           INPUTS_TO_LOCK.forEach(id => $w(id).enable());
           ACTION_BUTTONS.forEach(id => $w(id).expand());
       }
   }
   
   function renderFileState(fieldKey, uploadId, viewId, deleteId, isLocked) {
       const currentUrl = loadedNomination[fieldKey];
       if (currentUrl) {
           $w(viewId).expand();
           $w(viewId).link = currentUrl;
           $w(viewId).target = "_blank";
           $w(uploadId).collapse();
           isLocked ? $w(deleteId).collapse() : $w(deleteId).expand();
       } else {
           $w(viewId).collapse();
           $w(deleteId).collapse();
           isLocked ? $w(uploadId).collapse() : $w(uploadId).expand();
       }
   }
   
   function handleFileDelete(fieldKey, uploadId, viewId, deleteId) {
       if (loadedNomination.status === 'SUBMITTED') return;
       loadedNomination[fieldKey] = null; 
       $w(viewId).collapse();
       $w(deleteId).collapse();
       $w(uploadId).expand();
   }
   
   async function processFileUploads() {
       const fileResults = {};
       for (const def of FILE_DEFINITIONS) {
           const $btn = $w(def.btnId);
           if ($btn.value.length > 0) {
               try {
                   const result = await $btn.startUpload();
                   fileResults[def.key] = result.url; 
               } catch (uploadError) {
                   console.error(`Upload failed for ${def.key}`, uploadError);
                   throw new Error(`Failed to upload file for ${def.key}`);
               }
           } else {
               fileResults[def.key] = loadedNomination[def.key];
           }
       }
       return fileResults;
   }
   
   async function handleSave(isFinalSubmission) {
       $w('#errorMsg').hide();
       const $saveBtn = $w('#saveDraftBtn');
       const $submitBtn = $w('#submitFinalBtn');
   
       const missingFields = validateForm(isFinalSubmission);
       if (missingFields.length > 0) {
           const msg = "Please complete the following required fields:\n• " + missingFields.join("\n• ");
           wixWindow.openLightbox("Alert", { message: msg });
           return; 
       }
   
       $saveBtn.disable();
       $submitBtn.disable();
       const originalLabel = isFinalSubmission ? "Submit Final" : "Save Draft";
       const $activeBtn = isFinalSubmission ? $submitBtn : $saveBtn;
       $activeBtn.label = isFinalSubmission ? "Submitting..." : "Saving...";
   
       try {
           const fileData = await processFileUploads();
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
   
           await saveNomination(formData, isFinalSubmission);
   
           if (isFinalSubmission) {
               wixLocation.to(wixLocation.url); 
           } else {
               loadedNomination = { ...loadedNomination, ...formData }; 
               $activeBtn.label = "Saved!";
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
   
   function validateForm(isFinal) {
       const missing = [];
       const check = (id, isValid, friendlyName) => { if (!isValid) missing.push(friendlyName); };
   
       check('#titleInput', $w('#titleInput').value, "Title");
       check('#companyInput', $w('#companyInput').value, "Company");
       check('#richTextBoxExamplary', $w('#richTextBoxExamplary').value, "Exemplary Section");
       check('#gdprCheckbox', $w('#gdprCheckbox').checked, "GDPR Consent");
       check('#retentionCheckbox', $w('#retentionCheckbox').checked, "Retention Policy");
       check('#publicationCheckbox', $w('#publicationCheckbox').checked, "Publication Consent");
   
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
   
   export function resetValidationVisuals() {
       INPUTS_TO_LOCK.forEach(id => {
           const element = $w(id);
           try {
               if (element.style) {
                   element.style.borderColor = null; 
                   if (element.style.color) element.style.color = null; 
               }    
           } catch (error) {
               console.log("visual reset error" + error);
           }
       });
   }