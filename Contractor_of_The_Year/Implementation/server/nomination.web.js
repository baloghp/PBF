import wixUsersBackend from 'wix-users-backend';
import { Permissions, webMethod } from "wix-web-module";
import wixData from 'wix-data';
import { contacts, triggeredEmails } from 'wix-crm-backend'; 
import { currentMember } from 'wix-members-backend'; // <-- Modern Wix API

// 1. GET NOMINATION
export const getMyNomination = webMethod(Permissions.Anyone, async () => {
    const user = wixUsersBackend.currentUser;
    if (!user.loggedIn) throw new Error("Not logged in");

    // Standardized: Query by _owner, not userId
    const results = await wixData.query("Nominations")
        .eq("_owner", user.id) 
        .find({ suppressAuth: true });

    if (results.items.length === 0) return null;

    let nomination = results.items[0];

    // RESOLVE NAMES
    const nomineeName = await getMemberName(user.id);
    
    // Check coach (Assuming you have a 'coachId' column in your collection)
    let coachName = "Not Assigned Yet"; 
    if (nomination.coachId) {
        coachName = await getMemberName(nomination.coachId);
    }

    return {
        ...nomination,
        nomineeNameDisplay: nomineeName,
        coachNameDisplay:   coachName
    };
});

// 2. CREATE DRAFT
export const createDraftNomination = webMethod(Permissions.Anyone, async () => {
  const user = wixUsersBackend.currentUser;
    if (!user.loggedIn) throw new Error("Not logged in");

    let nominationRecord;

    // 1. Check for existing record (Safety Check)
    const existing = await wixData.query("Nominations")
        .eq("_owner", user.id)
        .find({ suppressAuth: true });

    if (existing.items.length > 0) {
        nominationRecord = existing.items[0];
    } else {
        // 2. Create the blank Draft record
        const newNomination = {
            status: 'DRAFT',
            submissionDate: new Date(),
            publicationConsent: false,
            retentionPolicy: false,
            gdprCheck: false,
            _owner: user.id 
        };
        nominationRecord = await wixData.insert("Nominations", newNomination, { suppressAuth: true });
    }

    // 3. RESOLVE NAMES (The Fix)
    // We must return the same structure as getMyNomination so the UI doesn't break
    
    const nomineeName = await getMemberName(user.id);
    
    let coachName = "Not Assigned Yet";
    // Even though it's new, we check just in case we retrieved an existing one that had a coach
    if (nominationRecord.coachId) {
        coachName = await getMemberName(nominationRecord.coachId);
    }

    // 4. Return the combined data
    return {
        ...nominationRecord,
        nomineeNameDisplay: nomineeName,
        coachNameDisplay: coachName
    };
});

// 3. SAVE OR SUBMIT
export const saveNomination = webMethod(Permissions.Anyone, async (data, isFinalSubmission) => {
    const user = await currentMember.getMember();
    if (!user) throw new Error("Not logged in");
    const userId = user._id;

    // We fetch the record by _owner to ensure we only edit OUR OWN record
    let currentRecordResult = await wixData.query("Nominations")
        .eq("_owner", user._id)
        .find({ suppressAuth: true });

    let currentRecord = currentRecordResult.items.length > 0 ? currentRecordResult.items[0] : null;
    
    // SECURITY
    if (currentRecord && currentRecord.status === 'SUBMITTED') {
        throw new Error("Nomination is locked.");
    }

    const toSave = {
        ...currentRecord, // Merge existing data
        ...data,          // Overwrite with new form data
        status: isFinalSubmission ? 'SUBMITTED' : 'DRAFT',
        submissionDate: isFinalSubmission ? new Date() : undefined,
        _owner: user._id   // Ensure ownership stays correct
    };
    let savedNomination = null;
    if (currentRecord) {
        // Update uses the _id found in currentRecord
        savedNomination = await wixData.update("Nominations", toSave, { suppressAuth: true });
    } else {
        // Should not happen if we call createDraft first, but good fallback
        savedNomination =await wixData.insert("Nominations", toSave, { suppressAuth: true });
    }
    
    if (isFinalSubmission) {
        // If they are submitting finally, ensure the final toSave object has all 3 files.
        if (!toSave.mainNarrative || !toSave.fileContractMatrix || !toSave.fileRaci) {
            throw new Error("Cannot submit. One or more required files are missing.");
        }
    // A. Send the confirmation to the Nominee themselves
    await sendNomineeConfirmation(savedNomination, userId);

        // B. Send the evaluation links to the Customers
    await dispatchCustomerEvaluations(
            savedNomination._id, 
            userId, 
            savedNomination.title,   
            savedNomination.company  
        );
    }
    return { status: toSave.status };
});
// --- HELPER FUNCTION: Get Name from ID ---
async function getMemberName(userId) {
    try {
        const member = await wixData.get("Members/PrivateMembersData", userId, { suppressAuth: true });
        // Build a clean display name and avoid "null null" / "undefined undefined".
        const firstName = member?.firstName ? String(member.firstName).trim() : "";
        const lastName = member?.lastName ? String(member.lastName).trim() : "";
        const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

        if (fullName) return fullName;
        if (member?.loginEmail) return String(member.loginEmail).trim();
        if (member?.nickname) return String(member.nickname).trim();
        if (member?.name) return String(member.name).trim();

        return "Unknown Member";
    } catch (error) {
        console.warn(`Could not find member ${userId}`, error);
        return "Unknown Member";
    }
}

// --- HELPER: SEND NOMINEE CONFIRMATION ---
async function sendNomineeConfirmation(nomination, memberId) {
    const baseUrl = "https://www.ittd.space"; 
    // Replace with your actual dashboard page path if different
    const dashboardPath = "/nominee-dashboard"; 
    
    // Format today's date nicely (e.g. "October 15, 2026")
    const today = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
    });

    try {
        // We use emailMember here because we already know they are logged in
        await triggeredEmails.emailMember('nominationVerificationEmail', memberId, {
            variables: {
                nomineeName: nomination.company || "Nominee",
                projectTitle: nomination.title || "Nominated Project",
                nominationId: nomination._id,
                submissionDate: today,
                dashboarLink: `${baseUrl}${dashboardPath}`, // Matching your exact spelling
                SITE_URL: baseUrl
            }
        });
        
        console.log(`Confirmation email sent to nominee successfully.`);

    } catch (error) {
        console.error(`Failed to send nominee confirmation email`, error);
    }
}


// --- HELPER: SEND EMAILS ---
async function dispatchCustomerEvaluations(nominationId, ownerId, projectTitle, nomineeName) {
    // 1. Get all customers for this nominee
    const customerResults = await wixData.query("Customer_Feedback")
        .eq("_owner", ownerId)
        .find({ suppressAuth: true });

    const customers = customerResults.items;
    
    const baseUrl = "https://www.ittd.space"; 
    const assessmentPagePath = "/nominee-s-customer-evaluation";

    // 2. Loop through each customer and send their email
    for (const customer of customers) {
        try {
            // A. Create the unique URL
            const customLink = `${baseUrl}${assessmentPagePath}?nominationId=${nominationId}&customerId=${customer._id}`;

            // B. Ensure they exist in your Wix Contacts
            const contactInfo = {
                name: { first: customer.contactName },
                emails: [{ email: customer.contactEmail }]
            };
            
            // Note: appendOrCreateContact resolves the contact ID we need for the email
            const contact = await contacts.appendOrCreateContact(contactInfo);

            // C. Send the Triggered Email using your exact template ID and variables
            await triggeredEmails.emailContact('CustomerNotificationEmail', contact.contactId, {
                variables: {
                    projectTitle: projectTitle || "Nominated Project",
                    contactName: customer.contactName,
                    nomineeName: nomineeName || "The Nominee",
                    assessmentLink: customLink,
                    SITE_URL: baseUrl
                }
            });
            
            console.log(`Evaluation email sent successfully to ${customer.contactEmail}`);

        } catch (error) {
            console.error(`Failed to send email to ${customer.contactEmail}`, error);
        }
    }
}