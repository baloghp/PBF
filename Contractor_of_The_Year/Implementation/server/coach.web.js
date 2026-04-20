// backend/coach.web.js
import wixData from 'wix-data';
import { webMethod, Permissions } from 'wix-web-module';
import { currentMember } from 'wix-members-backend'; // Needed for security check

export const getCoachNominations = webMethod(Permissions.Anyone, async (coachId) => {
    if (!coachId) throw new Error("Coach ID is required.");

    try {
        const results = await wixData.query("Nominations")
            .eq("coachAssignedId", coachId)
            .find({ suppressAuth: true });

        return results.items;
    } catch (error) {
        console.error("Error fetching coach nominations:", error);
        throw new Error("Failed to fetch nominations.");
    }
});

export const saveCoachAssessment = webMethod(Permissions.Anyone, async (nominationId, updateData) => {
    if (!nominationId) throw new Error("Nomination ID is required.");

    const options = { suppressAuth: true };

    try {
        const member = await currentMember.getMember();
        if (!member) throw new Error("Not authorized.");

        const record = await wixData.get("Nominations", nominationId, options);
        if (!record) throw new Error("Nomination not found.");

        if (record.coachAssignedId !== member._id) {
            throw new Error("You are not authorized to edit this diary.");
        }

        // Apply all updates from the payload object
        record.coachDiary = updateData.diaryContent;
        record.noCoachCoi = updateData.bCOI;
        
        // IMPORTANT: Ensure "category" matches your actual database field key!
        record.category = updateData.category; 

        const updatedRecord = await wixData.update("Nominations", record, options);
        
        return updatedRecord;
    } catch (error) {
        console.error("Error saving coach assessment:", error);
        throw new Error("Failed to save data: " + error.message);
    }
});


export const saveCOI = webMethod(Permissions.Anyone, async (nominationId, bCOI) => {
    if (!nominationId) throw new Error("Nomination ID is required.");

    // 1. Define the options to bypass database permissions
    const options = { suppressAuth: true };

    try {
        // 2. Get the currently logged-in user making this request
        const member = await currentMember.getMember();
        if (!member) throw new Error("Not authorized.");

        // 3. Fetch the existing record (using suppressAuth)
        const record = await wixData.get("Nominations", nominationId, options);
        if (!record) throw new Error("Nomination not found.");

        // 4. SECURITY CHECK: Ensure the person saving is the assigned coach!
        if (record.coachAssignedId !== member._id) {
            throw new Error("You are not authorized to edit this diary.");
        }

        // 5. Update just the diary field
        record.noCoachCoi = bCOI;

        // 6. Save it back to the database (using suppressAuth)
        const updatedRecord = await wixData.update("Nominations", record, options);
        
        return updatedRecord;
    } catch (error) {
        console.error("Error saving coach diary:", error);
        throw new Error("Failed to save diary: " + error.message);
    }
});

// Fetch customer records belonging to a specific nominee
export const getNomineeCustomerFeedback = webMethod(Permissions.Anyone, async (nomineeId) => {
    if (!nomineeId) return [];

    try {
        // Assuming your Customers collection uses the default Wix "_owner" field to tie to the member
        // If you use a custom field like "memberId", change "_owner" to that field key.
        const results = await wixData.query("Customer_Feedback")
            .eq("_owner", nomineeId) 
            .find({ suppressAuth: true });

        return results.items;
    } catch (error) {
        console.error("Error fetching customers:", error);
        throw new Error("Failed to load customers.");
    }
});

export const getAssessorNominations = webMethod(Permissions.Anyone, async (assessorId) => {
    if (!assessorId) throw new Error("Assessor ID is required.");

    try {
        // We use .hasSome to check if the assessorId exists within the assessorIds array
        const results = await wixData.query("Nominations")
            .hasSome("assessors", [assessorId])
            .find({ suppressAuth: true });

        return results.items;
    } catch (error) {
        console.error("Error fetching assessor nominations:", error);
        throw new Error("Failed to fetch assessment assignments.");
    }
});

function sumAssessmentScores(assessmentRecord) {
    const fields = [
        'projectSuccessScore',
        'agilityAdaptabilityScore',
        'commercialModelScore',
        'legalSoundnessScore',
        'interfaceGovernanceScore',
        'riskManagementScore',
        'peopleDevelopmentScore',
        'teamBusinessAcumenScore',
        'innovationAdvancementScore'
    ];

    return fields.reduce((acc, key) => acc + (Number(assessmentRecord?.[key]) || 0), 0);
}

function calculateCustomerWeightedScore(customerRecord) {
    const WEIGHTS = {
        communication: 10,
        hrAptitude: 7,
        safety: 9,
        documentation: 6,
        changeRequests: 5,
        managementAttention: 8,
        executionPace: 10
    };
    const TOTAL_WEIGHT = 55;

    const weightedSum =
        (Number(customerRecord?.communication) || 0) * WEIGHTS.communication +
        (Number(customerRecord?.hrAptitude) || 0) * WEIGHTS.hrAptitude +
        (Number(customerRecord?.safety) || 0) * WEIGHTS.safety +
        (Number(customerRecord?.documentation) || 0) * WEIGHTS.documentation +
        (Number(customerRecord?.changeRequests) || 0) * WEIGHTS.changeRequests +
        (Number(customerRecord?.managementAttention) || 0) * WEIGHTS.managementAttention +
        (Number(customerRecord?.executionPace) || 0) * WEIGHTS.executionPace;

    return weightedSum / TOTAL_WEIGHT;
}

/**
 * Coach-triggered rollup for a nomination.
 * Computes:
 * - avgAssessorScore: average of totals across SUBMITTED assessments for this nomination
 * - avgCustomerScore: average weighted score across SUBMITTED customer feedback records for the nominee (_owner)
 */
export const calculateNominationRollups = webMethod(Permissions.Anyone, async (nominationId) => {
    if (!nominationId) throw new Error("Nomination ID is required.");

    const options = { suppressAuth: true };

    const member = await currentMember.getMember();
    if (!member) throw new Error("Not authorized.");

    const nomination = await wixData.get("Nominations", nominationId, options);
    if (!nomination) throw new Error("Nomination not found.");

    if (nomination.coachAssignedId !== member._id) {
        throw new Error("You are not authorized to calculate scores for this nomination.");
    }

    // 1) Assessor assessments (per nomination)
    const assessmentsRes = await wixData.query("Assessments")
        .eq("nominationId", nominationId)
        .eq("status", "SUBMITTED")
        .find(options);

    const assessmentTotals = assessmentsRes.items.map(sumAssessmentScores);
    const avgAssessorScore = assessmentTotals.length > 0
        ? assessmentTotals.reduce((a, b) => a + b, 0) / assessmentTotals.length
        : null;

    // 2) Customer feedback (currently per nominee via _owner)
    const customerRes = await wixData.query("Customer_Feedback")
        .eq("_owner", nomination._owner)
        .eq("evaluationStatus", "SUBMITTED")
        .find(options);

    const customerScores = customerRes.items.map(calculateCustomerWeightedScore);
    const avgCustomerScore = customerScores.length > 0
        ? customerScores.reduce((a, b) => a + b, 0) / customerScores.length
        : null;

    // Only calculate overallScore when both component averages exist.
    const overallScore =
        avgAssessorScore === null || avgCustomerScore === null
            ? null
            : (avgAssessorScore * 0.75) + (avgCustomerScore * 0.25);

    // Persist rollups onto the nomination record for dashboards/ranking.
    // Field IDs (per user): assessmentsScore, customersScore, overallScore
    nomination.assessmentsScore = avgAssessorScore;
    nomination.customersScore = avgCustomerScore;
    nomination.overallScore = overallScore;

    await wixData.update("Nominations", nomination, options);

    return {
        nominationId,
        assessmentsSubmittedCount: assessmentsRes.items.length,
        avgAssessorScore,
        customerSubmittedCount: customerRes.items.length,
        avgCustomerScore,
        overallScore
    };
});