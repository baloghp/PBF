/* ==========================================
   UI IDs USED IN THIS MODULE:
   - #nominationsTable   (Managed by Class)
   - #searchNominations  (Managed by Class)
   - #assignmentBox      (Box/Container)
   - #detailProjectName  (Text Element)
   - #detailCompany      (Text Element)
   - #detailNominee      (Text Element)
   - #coachDropdown      (Dropdown Element)
   - #assessorTags       (Selection Tags Element)
   - #saveAssignmentsBtn (Button Element)
   ========================================== */

   import { getAllNominations, getStaffOptions, saveAssignments } from 'backend/assignments.web';
   import { NominationTableManager } from 'public/nominationSelectionTable.js'; // Updated to Class
   import wixWindow from 'wix-window';
   
   let $w;
   let selectedNominationId = null;
   let tableManager; // Store instance globally in this module
   
   export async function initAssignmentsAdmin(page$w) {
       $w = page$w;
   
       // 0. Ensure the detail box is hidden initially
       $w('#assignmentBox').collapse(); 
   
       // 1. Load Data & UI Options
       try {
           const [nominations, staff] = await Promise.all([
               getAllNominations(),
               getStaffOptions()
           ]);
           
           // Feed the formatted data into the UI elements
           $w('#coachDropdown').options = staff.coachOptions;
           $w('#assessorTags').options = staff.assessorOptions; 
   
           // 2. Initialize the new Class-based Table Manager
           // We pass: $w, tableID, searchID, and the data
           tableManager = new NominationTableManager($w, '#nominationsTable', '#searchNominations', nominations);
           
           // Use .init() and pass the callback
           tableManager.init(handleRowSelection);
   
       } catch (error) {
           console.error("Init failed", error);
       }
   
       // 3. Save Button Logic
       $w('#saveAssignmentsBtn').onClick(async () => {
           if (!selectedNominationId) return;
   
           $w('#saveAssignmentsBtn').disable();
           $w('#saveAssignmentsBtn').label = "Saving...";
   
           const coachId = $w('#coachDropdown').value;
           const assessorArray = $w('#assessorTags').value; 
   
           try {
               const updatedRecord = await saveAssignments(selectedNominationId, coachId, assessorArray);
   
               // Update the table using the Class instance method
               tableManager.updateTableRow(updatedRecord);
   
               $w('#saveAssignmentsBtn').label = "Saved!";
               setTimeout(() => {
                   $w('#saveAssignmentsBtn').enable();
                   $w('#saveAssignmentsBtn').label = "Save";
               }, 1500);
   
           } catch (error) {
               console.error(error);
               wixWindow.openLightbox("Alert", { message: "Failed to save assignments." });
               $w('#saveAssignmentsBtn').enable();
               $w('#saveAssignmentsBtn').label = "Save";
           }
       });
   }
   
   /**
    * Callback Function for when a row is clicked in the table
    */
   function handleRowSelection(rowData) {
       selectedNominationId = rowData._id;
   
       // Populate the Text Elements
       $w('#detailProjectName').text = rowData.title || "Untitled Project";
       $w('#detailCompany').text = rowData.company || "Unknown Company";
       $w('#detailNominee').text = rowData.nomineeName || "Unknown Nominee"; 
   
       // Set Coach Dropdown (Defaults to "" if null)
       $w('#coachDropdown').value = rowData.coachAssignedId || "";
   
       // Set Assessor Tags 
       $w('#assessorTags').value = rowData.assessors && Array.isArray(rowData.assessors) 
                                   ? rowData.assessors 
                                   : [];
   
       $w('#assignmentBox').expand();
   }