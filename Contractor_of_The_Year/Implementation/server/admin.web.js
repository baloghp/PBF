import wixData from 'wix-data';
import { webMethod, Permissions } from 'wix-web-module';

// --- CONFIGURATION: Replace these with your actual Wix Role IDs ---
const ROLE_IDS = {
    "Coaches": "afe0027c-254d-4425-91ef-bfcfa1b26659",
    "Assessors": "a9da2167-36bc-4925-af42-31a58814478c"
};


// --- 1. MEMBER LOOKUP (Formatted for Table) ---
export const searchSiteMembers = webMethod(Permissions.Anyone, async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) return [];

    try {
        const results = await wixData.query("Members/PrivateMembersData")
            .contains("firstName", searchTerm)
            .or(wixData.query("Members/PrivateMembersData").contains("lastName", searchTerm))
            .or(wixData.query("Members/PrivateMembersData").contains("loginEmail", searchTerm))
            .limit(15) // Enough for table paging
            .find({ suppressAuth: true });

        // Map the results to match your Table Column Field Keys (title and email)
        return results.items.map(member => ({
            _id: member._id, // The unique member ID
            title: `${member.firstName || ''} ${member.lastName || ''}`.trim() || "Unknown Name",
            email: member.loginEmail || "No Email"
        }));
    } catch (error) {
        console.error("Member search failed", error);
        throw new Error("Could not search members.");
    }
});
export const getStaff = webMethod(Permissions.Anyone, async (collectionName) => {
    const results = await wixData.query(collectionName).descending("_createdDate").find({ suppressAuth: true });
    return results.items;
});

export const addStaff = webMethod(Permissions.Anyone, async (collectionName, memberId, memberName, memberEmail) => {
    // 1. Data logic remains the same
    const existing = await wixData.query(collectionName).eq("userId", memberId).find({ suppressAuth: true });
    
    let record;
    if (existing.items.length > 0) {
        record = existing.items[0]; 
    } else {
        const newRecord = {
            title_fld: memberName,
            email: memberEmail,
            userId: memberId
        };
        record = await wixData.insert(collectionName, newRecord, { suppressAuth: true });
    }

    return record;
});

/**
 * Removes staff from DB and revokes the corresponding Site Role
 */
export const removeStaff = webMethod(Permissions.Anyone, async (collectionName, recordId) => {
    try {
        const record = await wixData.get(collectionName, recordId, { suppressAuth: true });
        
        return await wixData.remove(collectionName, recordId, { suppressAuth: true });
        
    } catch (err) {
        console.error("Remove staff failed", err);
        throw new Error("Could not remove staff or revoke role.");
    }
});

