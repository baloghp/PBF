// Page Code: Unified Assignments Dashboard (Coach & Assessor)

/* ==========================================
   UI IDs USED IN THIS MODULE:
   - Tables/Search: #coachTable, #searchCoach, #assessorTable, #searchAssessor
   - Role Views: #boxCoachView, #boxAssessorView
   - Container: #editBox, #introBox, #nominationTabs
   - Inputs (to lock): #titleInput, #companyInput, #richTextBoxExamplary, #richTextBoxImpact, #richTextBoxLessons
   - Checkboxes (to lock): #gdprCheckbox, #retentionCheckbox, #publicationCheckbox
   - Text elements: #coachText, #ownerText, #statusText
   - File View Buttons: #viewNarrativeBtn, #viewContractBtn, #viewRaciBtn
   - Elements to Hide: #saveDraftBtn, #submitFinalBtn, #addCustomerBtn, #deleteCustomerBtn, 
                       #uploadNarrative, #deleteNarrativeBtn, #uploadContractMatrix, 
                       #deleteContractBtn, #uploadRACI, #deleteRaciBtn
   - DIARY ELEMENTS: #coachDiaryRichText, #saveDiaryBtn, #cbCOI, #dropdownCategory
   ========================================== */

   import { currentMember } from 'wix-members';
   // Make sure to create getAssessorNominations in your backend!
   import { getCoachNominations, getAssessorNominations } from 'backend/coach.web'; 
   import { NominationTableManager } from 'public/nominationSelectionTable.js';
   import { initCustomerRepeater, loadCustomerCards } from 'public/customerCards.js';
   import { renderNominationReadOnly } from 'public/nominationReadOnlyView.js';
   import { initCoachDiary, loadCoachDiary } from 'public/coachDiaryPanel.js';
   import { createAssessmentPanel } from 'public/assessmentPanel.js';
   
   const ELEMENTS_TO_HIDE = [
       '#uploadNarrative', '#deleteNarrativeBtn',
       '#uploadContractMatrix', '#deleteContractBtn',
       '#uploadRACI', '#deleteRaciBtn'
   ];
   
   
   let currentNominationId = null; 
   let currentRoleView = null; // Tracks if they are currently viewing as 'COACH' or 'ASSESSOR'
   let assessmentPanel;
   
   // Global variables for your independent table managers
   let coachTableManager;
   let assessorTableManager;

   const TAB_INDEX = {
       NOMINATION: 0,
       CUSTOMERS: 1,
       COACH_DIARY: 2,
       ASSESSMENT: 3
   };

   const COACH_DIARY = {
       contentBoxId: '#boxCoachDiaryContent',
       blockedBoxId: '#boxCoachDiaryBlocked'
   };

   const ASSESSMENT = {
       contentElementIds: ['#boxAssessmentContent'],
       blockedBoxId: '#boxAssessmentBlocked'
   };
   
   $w.onReady(async function () {
       // 1. Initial UI Setup
       ELEMENTS_TO_HIDE.forEach(id => $w(id).collapse()); 
       configureTabsForRole(null);

       // Re-apply gating if a user clicks a different tab.
       $w('#nominationTabs').onChange(() => {
           configureTabsForRole(currentRoleView);
       });
   
       // 2. Get the currently logged-in Member
       const member = await currentMember.getMember();
       if (!member) return;
   
       // 3. Fetch data & Initialize BOTH Tables
       try {
           // Fetch both sets of assignments at the same time for speed
           const [coachData, assessorData] = await Promise.all([
               getCoachNominations(member._id),
               getAssessorNominations(member._id) // You will need to build this backend function!
           ]);
   
           // Init Coach Table using the Class
           coachTableManager = new NominationTableManager($w, '#coachTable', '#searchCoach', coachData);
           coachTableManager.init((selectedRow) => {
               openNominationView(selectedRow, 'COACH');
           });
   
           // Init Assessor Table using the Class
           assessorTableManager = new NominationTableManager($w, '#assessorTable', '#searchAssessor', assessorData);
           assessorTableManager.init((selectedRow) => {
               openNominationView(selectedRow, 'ASSESSOR');
           });
   
       } catch (error) {
           console.error("Failed to load dashboard data:", error);
       }
   
       // 4. Coach diary module init
       initCoachDiary($w, {
           getNominationId: () => currentNominationId,
           isCoachView: () => currentRoleView === 'COACH',
           onDiarySaved: (updatedRecord) => {
               coachTableManager.updateTableRow(updatedRecord);
           }
       });
   
       // 5. Customer Repeater Initialization
       initCustomerRepeater($w);

       assessmentPanel = createAssessmentPanel($w, {
           isAssessorView: () => currentRoleView === 'ASSESSOR'
       });
       assessmentPanel.init();
   });
   
   // --- THE NEW ROLE-BASED VIEW CONTROLLER ---
   async function openNominationView(data, role) {
       currentNominationId = data._id;
       currentRoleView = role;
   
       // 1. Populate Shared Read-Only Data
       renderNominationReadOnly($w, data);
       loadCustomerCards($w, data._owner);
   
       // 2. Expand/Collapse Views based on Role
       configureTabsForRole(role);
       if (role === 'COACH') {
           // Populate Coach-specific fields
           loadCoachDiary($w, data);
           
       } else if (role === 'ASSESSOR') {
           await assessmentPanel.loadForNomination(data._id);
   
   
       }
   
       
   }


   function configureTabsForRole(role) {
       const showCoachDiaryContent = role === 'COACH';
       const showAssessmentContent = role === 'ASSESSOR';

       // Coach Diary tab: either show content box OR blocked warning box
       toggleElement(COACH_DIARY.contentBoxId, showCoachDiaryContent);
       toggleElement(COACH_DIARY.blockedBoxId, !showCoachDiaryContent);

       // Assessment tab: either show content elements OR blocked warning box
       toggleElements(ASSESSMENT.contentElementIds, showAssessmentContent);
       toggleElement(ASSESSMENT.blockedBoxId, !showAssessmentContent);
   }

   function toggleElements(elementIds, shouldShow) {
       elementIds.forEach((id) => {
           toggleElement(id, shouldShow);
       });
   }

   function toggleElement(elementId, shouldShow) {
       try {
           if (shouldShow) {
               $w(elementId).expand();
           } else {
               $w(elementId).collapse();
           }
       } catch (e) {
           // If an element doesn't exist on this page, ignore.
       }
   }
   