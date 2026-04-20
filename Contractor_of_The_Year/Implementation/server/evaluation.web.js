import { Permissions, webMethod } from "wix-web-module";
import wixData from 'wix-data';

// 1. GET EVALUATION CONTEXT (States 1, 2, 3, 4)
export const getEvaluationData = webMethod(Permissions.Anyone, async (nominationId, customerId) => {
    if (!nominationId || !customerId) return { status: 'MISSING_PARAMS' };

    try {
        // Fetch both records
        const nomination = await wixData.get("Nominations", nominationId, { suppressAuth: true });
        const customer = await wixData.get("Customer_Feedback", customerId, { suppressAuth: true });

        // Security / Validity Check: Do they exist? Do they belong to the same nominee?
        if (!nomination || !customer || nomination._owner !== customer._owner) {
            return { status: 'INVALID_DATA' };
        }

        return {
            status: 'SUCCESS',
            nominationTitle: nomination.title,
            nomineeName: nomination.company,
            customerData: customer
        };
    } catch (error) {
        console.error("Evaluation load error", error);
        return { status: 'ERROR' };
    }
});

// 2. SAVE OR SUBMIT EVALUATION
export const saveEvaluation = webMethod(Permissions.Anyone, async (customerId, formData, isFinal) => {
    // Get existing to prevent overwriting base data
    const existing = await wixData.get("Customer_Feedback", customerId, { suppressAuth: true });
    if (!existing) throw new Error("Record not found");

    const toSave = {
        ...existing,
        ...formData,
        evaluationStatus: isFinal ? 'SUBMITTED' : 'DRAFT',
        evaluationDate: isFinal ? new Date() : existing.evaluationDate
    };

    return await wixData.update("Customer_Feedback", toSave, { suppressAuth: true });
});

// 3. UNFREEZE EVALUATION
export const unfreezeEvaluation = webMethod(Permissions.Anyone, async (customerId) => {
    const existing = await wixData.get("Customer_Feedback", customerId, { suppressAuth: true });
    if (!existing) throw new Error("Record not found");

    existing.evaluationStatus = 'DRAFT';
    return await wixData.update("Customer_Feedback", existing, { suppressAuth: true });
});