import wixWindow from 'wix-window';
import { getMyAssessmentForNomination, saveMyAssessmentForNomination } from 'backend/assessments.web';

const ASSESSMENT_FIELDS = [
    { scoreField: 'projectSuccessScore', justificationField: 'projectSuccessJustification', scoreId: '#sliderprojectSuccessScore', justificationId: '#textBoxprojectSuccessJustification', label: 'Project Success' },
    { scoreField: 'agilityAdaptabilityScore', justificationField: 'agilityAdaptabilityJustification', scoreId: '#slideragilityAdaptabilityScore', justificationId: '#textBoxagilityAdaptabilityJustification', label: 'Agility & Adaptability' },
    { scoreField: 'commercialModelScore', justificationField: 'commercialModelJustification', scoreId: '#slidercommercialModelScore', justificationId: '#textBoxcommercialModelJustification', label: 'Commercial Model' },
    { scoreField: 'legalSoundnessScore', justificationField: 'legalSoundnessJustification', scoreId: '#sliderlegalSoundnessScore', justificationId: '#textBoxlegalSoundnessJustification', label: 'Legal Soundness' },
    { scoreField: 'interfaceGovernanceScore', justificationField: 'interfaceGovernanceJustification', scoreId: '#sliderinterfaceGovernanceScore', justificationId: '#textBoxinterfaceGovernanceJustification', label: 'Interface & Governance' },
    { scoreField: 'riskManagementScore', justificationField: 'riskManagementJustification', scoreId: '#sliderriskManagementScore', justificationId: '#textBoxriskManagementJustification', label: 'Risk Management' },
    { scoreField: 'peopleDevelopmentScore', justificationField: 'peopleDevelopmentJustification', scoreId: '#sliderpeopleDevelopmentScore', justificationId: '#textBoxpeopleDevelopmentJustification', label: 'People Development' },
    { scoreField: 'teamBusinessAcumenScore', justificationField: 'teamBusinessAcumenJustification', scoreId: '#sliderteamBusinessAcumenScore', justificationId: '#textBoxteamBusinessAcumenJustification', label: 'Team & Business Acumen' },
    { scoreField: 'innovationAdvancementScore', justificationField: 'innovationAdvancementJustification', scoreId: '#sliderinnovationAdvancementScore', justificationId: '#textBoxinnovationAdvancementJustification', label: 'Innovation & Advancement' }
];

export function createAssessmentPanel($w, ctx) {
    let locked = false;
    let currentNominationId = null;
    let currentRecordId = null;

    function setLocked(nextLocked) {
        locked = nextLocked;

        if (locked) {
            $w('#cbAsessmentCOI').disable();
            $w('#btnAsessmentSaveDraft').disable();
            $w('#assessmentSubmitButton').disable();
        } else {
            $w('#cbAsessmentCOI').enable();
            $w('#btnAsessmentSaveDraft').enable();
            $w('#assessmentSubmitButton').enable();
        }

        ASSESSMENT_FIELDS.forEach((f) => {
            try { locked ? $w(f.scoreId).disable() : $w(f.scoreId).enable(); } catch (e) { /* ignore */ }
            try { locked ? $w(f.justificationId).disable() : $w(f.justificationId).enable(); } catch (e) { /* ignore */ }
        });
    }

    function populate(existing) {
        const noCoi = Boolean(existing?.noCoi);
        $w('#cbAsessmentCOI').checked = noCoi;

        ASSESSMENT_FIELDS.forEach((f) => {
            const rawScore = existing ? existing[f.scoreField] : undefined;
            const parsedScore = Number(rawScore);
            const scoreValue = Number.isFinite(parsedScore) ? parsedScore : 0;
            try { $w(f.scoreId).value = scoreValue; } catch (e) { /* ignore */ }

            const rawJust = existing ? existing[f.justificationField] : undefined;
            const justValue = typeof rawJust === 'string' ? rawJust : '';
            try { $w(f.justificationId).value = justValue; } catch (e) { /* ignore */ }
        });
    }

    function buildPayloadFromUi() {
        const payload = {};
        ASSESSMENT_FIELDS.forEach((f) => {
            const scoreVal = Number($w(f.scoreId).value);
            payload[f.scoreField] = Number.isFinite(scoreVal) ? scoreVal : 0;
            payload[f.justificationField] = String($w(f.justificationId).value || '');
        });
        return payload;
    }

    function validateForSubmit() {
        const problems = [];

        if (!$w('#cbAsessmentCOI').checked) {
            problems.push("Please confirm No COI before submitting.");
        }

        ASSESSMENT_FIELDS.forEach((f) => {
            const scoreVal = Number($w(f.scoreId).value);
            if (!Number.isFinite(scoreVal)) problems.push(`Missing score for: ${f.label}`);

            const j = String($w(f.justificationId).value || '');
            if (j.trim().length === 0) problems.push(`Missing justification for: ${f.label}`);
        });

        return problems;
    }

    async function loadForNomination(nominationId) {
        currentNominationId = nominationId;
        currentRecordId = null;
        setLocked(false);
        populate(null);

        try {
            console.log('[AssessmentPanel] load start', { nominationId });
            const existing = await getMyAssessmentForNomination(nominationId);
            console.log('[AssessmentPanel] fetched', existing ? { _id: existing._id, status: existing.status } : null);

            if (existing) {
                currentRecordId = existing._id;
                populate(existing);
                setLocked(existing.status === 'SUBMITTED');
            }

            console.log('[AssessmentPanel] load done', { locked, currentRecordId });
        } catch (error) {
            console.error('[AssessmentPanel] load failed', error);
            wixWindow.openLightbox("Alert", { message: "Could not load your assessment for this nomination." });
        }
    }

    async function save(isFinalSubmission) {
        if (!currentNominationId) return;
        if (locked) return;
        if (!ctx.isAssessorView()) return;

        if (isFinalSubmission) {
            const problems = validateForSubmit();
            if (problems.length > 0) {
                wixWindow.openLightbox("Alert", { message: "Cannot submit:\n• " + problems.join("\n• ") });
                return;
            }
        }

        const $draftBtn = $w('#btnAsessmentSaveDraft');
        const $submitBtn = $w('#assessmentSubmitButton');
        $draftBtn.disable();
        $submitBtn.disable();

        const $activeBtn = isFinalSubmission ? $submitBtn : $draftBtn;
        const originalLabel = isFinalSubmission ? "Submit" : "Save Draft";
        $activeBtn.label = isFinalSubmission ? "Submitting..." : "Saving...";

        try {
            const payload = {
                title: `Assessment - ${currentNominationId}`,
                noCoi: Boolean($w('#cbAsessmentCOI').checked),
                ...buildPayloadFromUi()
            };

            const saved = await saveMyAssessmentForNomination(currentNominationId, payload, isFinalSubmission);
            currentRecordId = saved?._id || currentRecordId;

            if (isFinalSubmission) setLocked(true);

            $activeBtn.label = "Saved!";
            setTimeout(() => {
                $activeBtn.label = originalLabel;
                if (!locked) {
                    $draftBtn.enable();
                    $submitBtn.enable();
                }
            }, 1500);
        } catch (error) {
            console.error('[AssessmentPanel] save failed', error);
            wixWindow.openLightbox("Alert", { message: "Failed to save assessment: " + (error?.message || "Unknown error") });
            $draftBtn.enable();
            $submitBtn.enable();
            $activeBtn.label = originalLabel;
        }
    }

    function init() {
        $w('#btnAsessmentSaveDraft').onClick(() => save(false));
        $w('#assessmentSubmitButton').onClick(() => save(true));
        $w('#cbAsessmentCOI').onChange(() => {
            if (locked) return;
        });
    }

    return {
        init,
        loadForNomination,
        setLocked
    };
}

