import wixWindow from 'wix-window';
import { getNomineeCustomerFeedback } from 'backend/coach.web';

/**
 * Bind the customer repeater's onItemReady handler once.
 * Expects the repeater items to contain the element IDs used below.
 */
export function initCustomerRepeater($w) {
    $w('#customerRepeater').onItemReady(($item, itemData) => {
        $item('#textCustomerOrganisation').text = itemData.customerOrganization || "Unknown Customer";
        $item('#textContactEmail').text = itemData.contactEmail || "No Company provided";
        $item('#textContactName').text = itemData.contactName || "No feedback provided.";
        $item('#textSignatory').text = itemData.signatoryNameRole || "No feedback provided.";

        $item('#textCommunication').text = String(itemData.communication || "N/A");
        $item('#textHRAptitude').text = String(itemData.hrAptitude || "N/A");
        $item('#textSafety').text = String(itemData.safety || "N/A");
        $item('#textDocumentation').text = String(itemData.documentation || "N/A");
        $item('#textChangeRequests').text = String(itemData.changeRequests || "N/A");
        $item('#textManagementAttention').text = String(itemData.managementAttention || "N/A");
        $item('#textExecutionPace').text = String(itemData.executionPace || "N/A");

        const finalScore = calculateWeightedScore(itemData);
        $item('#textScore').text = `Score: ${finalScore}`;

        $item('#cbDeclaration').checked = itemData.declaration || false;
        $item('#cbEvaluationConsent').checked = itemData.evaluationConsent || false;
        $item('#cbPublicationConsent').checked = itemData.publicationConsent || false;

        $item('#btnCustomerComment').onClick(() => {
            const commentToPass = itemData.customerComments || "No comment provided.";
            wixWindow.openLightbox("CommentLightbox", { commentText: commentToPass });
        });
    });
}

export async function loadCustomerCards($w, nomineeId) {
    $w('#customerRepeater').data = [];
    $w('#noCustomersMessage').collapse();

    if (!nomineeId) {
        $w('#noCustomersMessage').expand();
        return;
    }

    try {
        const customers = await getNomineeCustomerFeedback(nomineeId);
        if (customers.length > 0) {
            $w('#customerRepeater').data = customers;
            $w('#customerRepeater').expand();
        } else {
            $w('#customerRepeater').collapse();
            $w('#noCustomersMessage').expand();
        }
    } catch (error) {
        console.error("Failed to load customer cards", error);
        $w('#noCustomersMessage').text = "Error loading customers.";
        $w('#noCustomersMessage').expand();
    }
}

function calculateWeightedScore(itemData) {
    const WEIGHTS = {
        communication: 10, hrAptitude: 7, safety: 9, documentation: 6,
        changeRequests: 5, managementAttention: 8, executionPace: 10
    };
    const TOTAL_WEIGHT = 55;

    const comm = parseFloat(itemData.communication) || 0;
    const hr = parseFloat(itemData.hrAptitude) || 0;
    const safety = parseFloat(itemData.safety) || 0;
    const doc = parseFloat(itemData.documentation) || 0;
    const change = parseFloat(itemData.changeRequests) || 0;
    const mgmt = parseFloat(itemData.managementAttention) || 0;
    const exec = parseFloat(itemData.executionPace) || 0;

    const weightedSum = (
        (comm * WEIGHTS.communication) + (hr * WEIGHTS.hrAptitude) + (safety * WEIGHTS.safety) +
        (doc * WEIGHTS.documentation) + (change * WEIGHTS.changeRequests) +
        (mgmt * WEIGHTS.managementAttention) + (exec * WEIGHTS.executionPace)
    );

    return (weightedSum / TOTAL_WEIGHT).toFixed(2);
}

