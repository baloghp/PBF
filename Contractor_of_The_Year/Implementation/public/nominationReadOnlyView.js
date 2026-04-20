const INPUTS_TO_LOCK = [
    '#titleInput', '#companyInput',
    '#richTextBoxExamplary', '#richTextBoxImpact', '#richTextBoxLessons',
    '#gdprCheckbox', '#retentionCheckbox', '#publicationCheckbox'
];

/**
 * Populates the nomination fields and locks them read-only.
 * Expects the page to have all the element IDs referenced below.
 */
export function renderNominationReadOnly($w, data) {
    $w('#nominationTabs').expand();

    $w('#titleInput').value = data.title || "";
    $w('#companyInput').value = data.company || "";
    $w('#statusText').text = data.status || "DRAFT";

    $w('#richTextBoxExamplary').value = data.exemplary || "";
    $w('#richTextBoxImpact').value = data.impact || "";
    $w('#richTextBoxLessons').value = data.lessons || "";

    $w('#gdprCheckbox').checked = data.gdprCheck || false;
    $w('#retentionCheckbox').checked = data.retentionPolicy || false;
    $w('#publicationCheckbox').checked = data.publicationConsent || false;

    $w('#coachText').text = data.coachNameDisplay || "Not Assigned";
    $w('#ownerText').text = data.nomineeNameDisplay || "Unknown";

    INPUTS_TO_LOCK.forEach((id) => $w(id).disable());

    renderReadOnlyFile($w, data.mainNarrative, '#viewNarrativeBtn');
    renderReadOnlyFile($w, data.fileContractMatrix, '#viewContractBtn');
    renderReadOnlyFile($w, data.fileRaci, '#viewRaciBtn');
}

function renderReadOnlyFile($w, fileUrl, viewBtnId) {
    if (fileUrl) {
        $w(viewBtnId).expand();
        $w(viewBtnId).link = fileUrl;
        $w(viewBtnId).target = "_blank";
    } else {
        $w(viewBtnId).collapse();
    }
}

