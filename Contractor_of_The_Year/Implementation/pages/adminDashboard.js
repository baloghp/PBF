import { initRoleAdmin } from 'public/roleAdmin.js';
import { initAssignmentsAdmin } from 'public/assignmentsAdmin.js';
import { getOverviewKpis, getAssignmentsKpis, getAssessmentProgressKpis, getCustomerFeedbackProgressKpis, getScoresAndScoreboardsKpis } from 'backend/dashboard.web';

$w.onReady(async function () {
    
// 1. Initialize the Roles Management block
    await initRoleAdmin($w);

    // 2. Initialize the Assignments block
    await initAssignmentsAdmin($w);

    // 3. Overview dashboard (Custom Element)
    // Custom element instance ID in the editor: #overviewDash
    try {
        const kpis = await getOverviewKpis();
        $w('#overviewDash').setAttribute('kpis', JSON.stringify(kpis));
    } catch (e) {
        console.error('Failed to load overview KPIs', e);
    }

    // 4. Assignments & workload dashboard (Custom Element)
    // Custom element instance ID in the editor: #assignmentsDash
    try {
        const kpis = await getAssignmentsKpis();
        // Setting attributes on custom elements can race with element initialization in Wix.
        // Defer the assignment by a tick to ensure the element has connected.
        setTimeout(() => {
            try {
                $w('#assignmentsDash').setAttribute('kpis', JSON.stringify(kpis));
            } catch (e) {
                console.error('Failed to set assignments kpis attribute', e);
            }
        }, 0);
    } catch (e) {
        console.error('Failed to load assignments KPIs', e);
    }

    // 5. Assessment progress dashboard (Custom Element)
    // Custom element instance ID in the editor: #assessmentsDash
    try {
        const kpis = await getAssessmentProgressKpis();
        setTimeout(() => {
            try {
                $w('#assessmentsDash').setAttribute('kpis', JSON.stringify(kpis));
            } catch (e) {
                console.error('Failed to set assessments kpis attribute', e);
            }
        }, 0);
    } catch (e) {
        console.error('Failed to load assessment progress KPIs', e);
    }

    // 6. Customer feedback progress dashboard (Custom Element)
    // Custom element instance ID in the editor: #customerFeedbackDash
    try {
        const kpis = await getCustomerFeedbackProgressKpis(14);
        setTimeout(() => {
            try {
                $w('#customerFeedbackDash').setAttribute('kpis', JSON.stringify(kpis));
            } catch (e) {
                console.error('Failed to set customer feedback kpis attribute', e);
            }
        }, 0);
    } catch (e) {
        console.error('Failed to load customer feedback progress KPIs', e);
    }

    // 7. Scores & scoreboards dashboard (Custom Element)
    // Custom element instance ID in the editor: #scoresDash
    try {
        const kpis = await getScoresAndScoreboardsKpis(10);
        setTimeout(() => {
            try {
                $w('#scoresDash').setAttribute('kpis', JSON.stringify(kpis));
            } catch (e) {
                console.error('Failed to set scores kpis attribute', e);
            }
        }, 0);
    } catch (e) {
        console.error('Failed to load scores & scoreboards KPIs', e);
    }

});