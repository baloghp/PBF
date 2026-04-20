import { Permissions, webMethod } from "wix-web-module";
import wixData from 'wix-data';

// --- 1. GET ALL NOMINATIONS (Enriched with Owner Names) ---
export const getAllNominations = webMethod(Permissions.Anyone, async () => {
    try {
        // A. Fetch all nominations
        const results = await wixData.query("Nominations").descending("_updatedDate").find({ suppressAuth: true });
        const nominations = results.items;

        // B. Extract a list of unique Owner IDs (ignore empty ones)
        const ownerIds = [...new Set(nominations.map(nom => nom._owner).filter(id => id))];
        
        if (ownerIds.length === 0) return nominations; // Fallback if no owners exist

        // C. Fetch Member Data in chunks of 50 (to respect Wix Data limits)
        let memberItems = [];
        for (let i = 0; i < ownerIds.length; i += 50) {
            const chunk = ownerIds.slice(i, i + 50);
            const memberQuery = await wixData.query("Members/PrivateMembersData")
                .hasSome("_id", chunk)
                .find({ suppressAuth: true });
            memberItems.push(...memberQuery.items);
        }

        // D. Create a fast lookup dictionary: { "userId1": "John Doe", "userId2": "Jane Smith" }
        const memberMap = {};
        memberItems.forEach(member => {
            const firstName = member.firstName || "";
            const lastName = member.lastName || "";
            memberMap[member._id] = `${firstName} ${lastName}`.trim() || member.loginEmail || "Unknown Member";
        });

        // E. Attach the resolved name directly to the nomination objects
        const enrichedNominations = nominations.map(nom => {
            return {
                ...nom,
                nomineeName: memberMap[nom._owner] || "Unknown Nominee" 
            };
        });

        return enrichedNominations;

    } catch (error) {
        console.error("Error fetching nominations", error);
        throw new Error("Could not load nominations.");
    }
});

// --- 2. GET STAFF FORMATTED FOR UI ---
export const getStaffOptions = webMethod(Permissions.Anyone, async () => {
    try {
        // Fetch both concurrently for speed
        const [coaches, assessors] = await wixData.query("Coaches").ascending("title_fld").find({ suppressAuth: true })
            .then(c => c)
            .then(async c => [c, await wixData.query("Assessors").ascending("title_fld").find({ suppressAuth: true })]);

        // Format for Dropdown: { label, value }
        const coachOptions = coaches.items.map(c => ({ label: c.title_fld, value: c.userId }));
        coachOptions.unshift({ label: "-- Unassigned --", value: "" });

        // Format for Selection Tags: { label, value } 
        // (Selection tags use the exact same format as dropdowns!)
        const assessorOptions = assessors.items.map(a => ({ label: a.title_fld, value: a.userId }));

        return { coachOptions, assessorOptions };
    } catch (error) {
        console.error("Failed to load staff options", error);
        throw new Error("Could not load assignable staff.");
    }
});

// --- 3. SAVE ASSIGNMENTS ---
export const saveAssignments = webMethod(Permissions.Anyone, async (nominationId, coachId, assessorIdArray) => {
    const nomination = await wixData.get("Nominations", nominationId, { suppressAuth: true });
    if (!nomination) throw new Error("Nomination not found.");

    // Update fields (assessorIds MUST be an array field in your database)
    nomination.coachAssignedId = coachId ? coachId : null;
    nomination.assessors = assessorIdArray || []; 

    return await wixData.update("Nominations", nomination, { suppressAuth: true });
});