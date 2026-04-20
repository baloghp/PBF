import { searchSiteMembers, getStaff, addStaff, removeStaff } from 'backend/admin.web';
import wixWindow from 'wix-window';

// 1. Module-level reference to the page's $w selector
let $w;

// 2. State Variables 
let allCoaches = [];
let allAssessors = [];
let debounceTimer;

let selectedFoundMember = null; 
let selectedCoachRecordId = null; 
let selectedAssessorRecordId = null;

// 3. The Main Exported Initialization Function
export async function initRoleAdmin(page$w) {
    $w = page$w; // Save the page context

    // 0. CLEAR WIX EDITOR PLACEHOLDER DATA
    $w('#memberSearchResultsTable').rows = [];
    $w('#coachesTable').rows = [];
    $w('#assessorsTable').rows = [];

    // 1. Initial UI State
    disableAddButtons();
    disableDeleteButtons();
    
    await refreshTables();

    // 2. Member Lookup Button
    $w('#searchMembersBtn').onClick(async () => {
        const term = $w('#memberSearchInput').value;
        $w('#searchMembersBtn').disable();
        $w('#searchMembersBtn').label = "Searching...";
        
        try {
            const results = await searchSiteMembers(term);
            $w('#memberSearchResultsTable').rows = results;
            
            if (results.length === 0) {
                wixWindow.openLightbox("Alert", { message: "No members found matching that search." });
            }
        } catch (error) {
            console.error(error);
        }
        
        disableAddButtons(); 
        $w('#searchMembersBtn').enable();
        $w('#searchMembersBtn').label = "Find";
    });

    // 3. TABLE ROW SELECTIONS
    $w('#memberSearchResultsTable').onRowSelect((event) => {
        selectedFoundMember = event.rowData; 
        $w('#addCoachBtn').enable();
        $w('#addAssessorBtn').enable();
    });

    $w('#coachesTable').onRowSelect((event) => {
        selectedCoachRecordId = event.rowData._id; 
        $w('#deleteCoachBtn').enable();            
    });

    $w('#assessorsTable').onRowSelect((event) => {
        selectedAssessorRecordId = event.rowData._id;
        $w('#deleteAssessorBtn').enable();
    });

    // 4. ACTION BUTTONS
    $w('#addCoachBtn').onClick(() => handleAddStaff('Coaches'));
    $w('#addAssessorBtn').onClick(() => handleAddStaff('Assessors'));
    
    $w('#deleteCoachBtn').onClick(() => handleDeleteStaff('Coaches', selectedCoachRecordId, '#deleteCoachBtn'));
    $w('#deleteAssessorBtn').onClick(() => handleDeleteStaff('Assessors', selectedAssessorRecordId, '#deleteAssessorBtn'));

    // 5. LOCAL SEARCH FILTERS
    $w('#searchCoaches').onInput((e) => handleTableFilter(e, allCoaches, '#coachesTable'));
    $w('#searchAssessors').onInput((e) => handleTableFilter(e, allAssessors, '#assessorsTable'));
}

// --- HELPERS: UI STATE ---
function disableAddButtons() {
    selectedFoundMember = null;
    $w('#addCoachBtn').disable();
    $w('#addAssessorBtn').disable();
}

function disableDeleteButtons() {
    selectedCoachRecordId = null;
    selectedAssessorRecordId = null;
    $w('#deleteCoachBtn').disable();
    $w('#deleteAssessorBtn').disable();
}

// --- HELPER: REFRESH TABLES ---
async function refreshTables() {
    try {
        allCoaches = await getStaff('Coaches');
        allAssessors = await getStaff('Assessors');
        $w('#coachesTable').rows = allCoaches;
        $w('#assessorsTable').rows = allAssessors;
        disableDeleteButtons(); 
    } catch (error) {
        console.error("Failed to load staff", error);
    }
}

// --- HELPER: LOCAL TABLE FILTER ---
function handleTableFilter(event, dataset, tableId) {
    if (debounceTimer) clearTimeout(debounceTimer);
    
    debounceTimer = setTimeout(() => {
        const term = event.target.value.toLowerCase();
        if (!term) {
            $w(tableId).rows = dataset;
            return;
        }
        $w(tableId).rows = dataset.filter(row => row.title_fld && row.title_fld.toLowerCase().includes(term));
    }, 300);
}

// --- ACTION: ADD STAFF ---
async function handleAddStaff(collectionName) {
    if (!selectedFoundMember) return;

    const $btn = collectionName === 'Coaches' ? $w('#addCoachBtn') : $w('#addAssessorBtn');
    const originalLabel = collectionName === 'Coaches' ? "Add as Coach" : "Add as Assessor";
    
    $btn.disable();
    $btn.label = "Adding...";

    try {
        await addStaff(collectionName, selectedFoundMember._id, selectedFoundMember.title, selectedFoundMember.email);
        await refreshTables();
        
        $btn.label = "Added!";
        setTimeout(() => {
            $btn.label = originalLabel;
            $btn.enable();
        }, 1500);
        
    } catch (error) {
        wixWindow.openLightbox("Alert", { message: "Failed to add user. Please try again." });
        $btn.enable();
        $btn.label = originalLabel;
    }
}

// --- ACTION: DELETE STAFF ---
async function handleDeleteStaff(collectionName, recordId, btnId) {
    if (!recordId) return;

    $w(btnId).disable();
    $w(btnId).label = "Deleting...";

    try {
        await removeStaff(collectionName, recordId);
        await refreshTables(); 
    } catch (error) {
        console.error("Delete failed", error);
        wixWindow.openLightbox("Alert", { message: "Failed to delete record." });
    }
    
    $w(btnId).label = "Delete Selected"; 
}