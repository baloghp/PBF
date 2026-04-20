import wixWindow from 'wix-window';
import { saveCoachAssessment, calculateNominationRollups } from 'backend/coach.web';
import { DEFAULT_DIARY_TEMPLATE } from 'public/diaryTemplate.js';

/**
 * Binds Coach Diary save logic once.
 */
export function initCoachDiary($w, ctx) {
    $w('#saveDiaryBtn').onClick(async () => {
        const nominationId = ctx.getNominationId();
        if (!nominationId || !ctx.isCoachView()) return;

        $w('#saveDiaryBtn').disable();
        $w('#saveDiaryBtn').label = "Saving...";

        const payload = {
            diaryContent: $w('#coachDiaryRichText').value,
            bCOI: $w('#cbCOI').checked,
            category: $w('#dropdownCategory').value
        };

        try {
            const updatedRecord = await saveCoachAssessment(nominationId, payload);
            ctx.onDiarySaved(updatedRecord);

            $w('#saveDiaryBtn').label = "Saved!";
            setTimeout(() => {
                $w('#saveDiaryBtn').enable();
                $w('#saveDiaryBtn').label = "Save Diary";
            }, 1500);
        } catch (error) {
            console.error(error);
            wixWindow.openLightbox("Alert", { message: "Failed to save diary." });
            $w('#saveDiaryBtn').enable();
            $w('#saveDiaryBtn').label = "Save Diary";
        }
    });

    // Coach-triggered scoring rollup button.
    try {
        $w('#btnCalculateScore').onClick(async () => {
            const nominationId = ctx.getNominationId();
            if (!nominationId || !ctx.isCoachView()) return;

            $w('#btnCalculateScore').disable();
            const originalLabel = $w('#btnCalculateScore').label;
            $w('#btnCalculateScore').label = "Calculating...";

            try {
                const result = await calculateNominationRollups(nominationId);

                const assessmentsText = result.avgAssessorScore === null ? "N/A" : result.avgAssessorScore.toFixed(2);
                const customersText = result.avgCustomerScore === null ? "N/A" : result.avgCustomerScore.toFixed(2);
                const overallText = result.overallScore === null ? "N/A" : result.overallScore.toFixed(2);

                $w('#textAssessmentsScore').text = assessmentsText;
                $w('#textCustomersScore').text = customersText;
                $w('#textOverallScore').text = overallText;

                const missing = [];
                if (result.assessmentsSubmittedCount === 0) missing.push("No submitted assessments yet.");
                if (result.customerSubmittedCount === 0) missing.push("No submitted customer feedback yet.");
                if (missing.length > 0) {
                    wixWindow.openLightbox("Alert", { message: missing.join("\n") });
                }
            } catch (error) {
                console.error(error);
                wixWindow.openLightbox("Alert", { message: "Failed to calculate scores." });
            } finally {
                $w('#btnCalculateScore').enable();
                $w('#btnCalculateScore').label = originalLabel;
            }
        });
    } catch (e) {
        // If the button doesn't exist on the page, ignore.
    }
}

/**
 * Populates the Coach Diary UI with nomination data (read-only nomination is handled elsewhere).
 */
export function loadCoachDiary($w, nomination) {
    $w('#coachDiaryRichText').value = nomination.coachDiary || DEFAULT_DIARY_TEMPLATE;
    $w('#cbCOI').checked = nomination.noCoachCoi || false;
    $w('#dropdownCategory').value = nomination.category || "";

    // If rollup scores already exist on the nomination, show them.
    // Field IDs (per user): assessmentsScore, customersScore, overallScore
    try {
        const assessmentsScore = nomination?.assessmentsScore;
        const customersScore = nomination?.customersScore;
        const overallScore = nomination?.overallScore;

        $w('#textAssessmentsScore').text =
            typeof assessmentsScore === 'number' && Number.isFinite(assessmentsScore) ? assessmentsScore.toFixed(2) : "N/A";
        $w('#textCustomersScore').text =
            typeof customersScore === 'number' && Number.isFinite(customersScore) ? customersScore.toFixed(2) : "N/A";
        $w('#textOverallScore').text =
            typeof overallScore === 'number' && Number.isFinite(overallScore) ? overallScore.toFixed(2) : "N/A";
    } catch (e) {
        // If the score text elements don't exist on this page/tab yet, ignore.
    }
}

