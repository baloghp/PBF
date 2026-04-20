import wixData from 'wix-data';
import { webMethod, Permissions } from 'wix-web-module';

const options = { suppressAuth: true };

async function countQuery(query) {
    const res = await query.count(options);
    return Number(res) || 0;
}

/**
 * Topic 1: Overview KPIs
 * Returns simple counts for KPI tiles.
 */
export const getOverviewKpis = webMethod(Permissions.Anyone, async () => {
    const submittedNominations = await countQuery(
        wixData.query('Nominations').eq('status', 'SUBMITTED')
    );

    const needsCoachAssigned = await countQuery(
        wixData.query('Nominations').eq('status', 'SUBMITTED').isEmpty('coachAssignedId')
    );

    // For array fields, isEmpty doesn't always behave; use "hasSome" negative not available.
    // We approximate by counting SUBMITTED and then subtract those where assessors hasSome any value
    // (works only if assessors is always present for assigned nominations). If this is unreliable,
    // we can replace with a full scan and compute in code.
    const submittedWithAnyAssessor = await countQuery(
        wixData.query('Nominations').eq('status', 'SUBMITTED').isNotEmpty('assessors')
    );
    const needsAssessorsAssigned = Math.max(0, submittedNominations - submittedWithAnyAssessor);

    const assessmentsSubmitted = await countQuery(
        wixData.query('Assessments').eq('status', 'SUBMITTED')
    );

    const customerFeedbackSubmitted = await countQuery(
        wixData.query('Customer_Feedback').eq('evaluationStatus', 'SUBMITTED')
    );

    const scoreRollupPending = await countQuery(
        wixData.query('Nominations').eq('status', 'SUBMITTED').isEmpty('overallScore')
    );

    const missingCategoryCount = await countQuery(
        wixData.query('Nominations')
            .eq('status', 'SUBMITTED')
            .isEmpty('category')
    );

    return {
        submittedNominations,
        needsCoachAssigned,
        needsAssessorsAssigned,
        assessmentsSubmitted,
        customerFeedbackSubmitted,
        scoreRollupPending,
        missingCategoryCount
    };
});

async function fetchAllNominationsSubmittedMinimal() {
    const items = [];
    let skip = 0;
    const limit = 100;

    while (true) {
        const res = await wixData.query('Nominations')
            .eq('status', 'SUBMITTED')
            .skip(skip)
            .limit(limit)
            .find(options);
        items.push(...res.items);
        if (res.items.length < limit) break;
        skip += limit;
    }

    return items;
}

function countAssessorWorkload(submittedNoms) {
    const counts = new Map();
    submittedNoms.forEach((n) => {
        const assessors = Array.isArray(n.assessors) ? n.assessors : [];
        assessors.forEach((assessorId) => {
            counts.set(assessorId, (counts.get(assessorId) || 0) + 1);
        });
    });
    return [...counts.entries()]
        .map(([id, count]) => ({ id, count }))
        .sort((a, b) => b.count - a.count);
}

function countCoachWorkload(submittedNoms) {
    const counts = new Map();
    submittedNoms.forEach((n) => {
        const coachId = n.coachAssignedId;
        if (!coachId) return;
        counts.set(coachId, (counts.get(coachId) || 0) + 1);
    });
    return [...counts.entries()]
        .map(([id, count]) => ({ id, count }))
        .sort((a, b) => b.count - a.count);
}

async function resolveMemberNames(memberIds) {
    const uniqueIds = [...new Set(memberIds.filter((id) => typeof id === 'string' && id.length > 0))];
    if (uniqueIds.length === 0) return {};

    const memberMap = {};
    for (let i = 0; i < uniqueIds.length; i += 50) {
        const chunk = uniqueIds.slice(i, i + 50);
        const res = await wixData.query("Members/PrivateMembersData")
            .hasSome("_id", chunk)
            .find(options);

        res.items.forEach((m) => {
            const firstName = m.firstName || "";
            const lastName = m.lastName || "";
            const fullName = `${firstName} ${lastName}`.trim();
            memberMap[m._id] = fullName || m.loginEmail || "Unknown Member";
        });
    }
    return memberMap;
}

/**
 * Topic 2: Assignments & workload KPIs
 */
export const getAssignmentsKpis = webMethod(Permissions.Anyone, async () => {
    const submitted = await fetchAllNominationsSubmittedMinimal();

    const unassignedCoachCount = submitted.filter((n) => !n.coachAssignedId).length;

    const unassignedAssessorsCount = submitted.filter((n) => {
        const assessors = Array.isArray(n.assessors) ? n.assessors : [];
        return assessors.length === 0;
    }).length;

    const underAssignedCount = submitted.filter((n) => {
        const assessors = Array.isArray(n.assessors) ? n.assessors : [];
        return assessors.length > 0 && assessors.length < 2;
    }).length;

    const coachWorkloadRaw = countCoachWorkload(submitted).slice(0, 10);
    const assessorWorkloadRaw = countAssessorWorkload(submitted).slice(0, 10);

    const memberIdsToResolve = [
        ...coachWorkloadRaw.map((x) => x.id),
        ...assessorWorkloadRaw.map((x) => x.id)
    ];
    const memberNames = await resolveMemberNames(memberIdsToResolve);

    const coachWorkload = coachWorkloadRaw.map((x) => ({
        ...x,
        name: memberNames[x.id] || x.id
    }));
    const assessorWorkload = assessorWorkloadRaw.map((x) => ({
        ...x,
        name: memberNames[x.id] || x.id
    }));

    return {
        submittedNominations: submitted.length,
        unassignedCoachCount,
        unassignedAssessorsCount,
        underAssignedCount,
        coachWorkload,
        assessorWorkload
    };
});

async function countByStatus(collectionName, statusField, statusValue) {
    return await countQuery(wixData.query(collectionName).eq(statusField, statusValue));
}

async function fetchSubmittedNominationsWithAssessors() {
    const items = [];
    let skip = 0;
    const limit = 100;

    while (true) {
        const res = await wixData.query('Nominations')
            .eq('status', 'SUBMITTED')
            .isNotEmpty('assessors')
            .skip(skip)
            .limit(limit)
            .find(options);
        items.push(...res.items);
        if (res.items.length < limit) break;
        skip += limit;
    }

    return items;
}

async function fetchAssessmentsForNomination(nominationId) {
    // Paging in case there are multiple assessors or resubmits (should be small).
    const items = [];
    let skip = 0;
    const limit = 100;
    while (true) {
        const res = await wixData.query('Assessments')
            .eq('nominationId', nominationId)
            .skip(skip)
            .limit(limit)
            .find(options);
        items.push(...res.items);
        if (res.items.length < limit) break;
        skip += limit;
    }
    return items;
}

/**
 * Topic 3: Assessment progress KPIs
 * - KPI tiles: submitted vs draft assessment records
 * - Action list: nominations where some assigned assessors have no assessment record
 */
export const getAssessmentProgressKpis = webMethod(Permissions.Anyone, async () => {
    const assessmentsSubmitted = await countByStatus('Assessments', 'status', 'SUBMITTED');
    const assessmentsDraft = await countByStatus('Assessments', 'status', 'DRAFT');

    const nominations = await fetchSubmittedNominationsWithAssessors();

    const missing = [];
    let expectedPairs = 0;
    let foundPairs = 0;

    // Collect IDs for name resolution (assessors and coaches).
    const idsToResolve = [];

    // Stage-1 scale assumption: this loop is acceptable. If it grows, switch to a denormalized index.
    for (const n of nominations) {
        const assessors = Array.isArray(n.assessors) ? n.assessors : [];
        if (assessors.length === 0) continue;

        expectedPairs += assessors.length;
        idsToResolve.push(...assessors);
        if (typeof n.coachAssignedId === 'string' && n.coachAssignedId.length > 0) idsToResolve.push(n.coachAssignedId);

        const assessmentRows = await fetchAssessmentsForNomination(n._id);
        const presentAssessorIds = new Set(
            assessmentRows
                .map((a) => a.assessorId)
                .filter((id) => typeof id === 'string' && id.length > 0)
        );

        assessors.forEach((assessorId) => {
            if (presentAssessorIds.has(assessorId)) foundPairs += 1;
        });

        const missingAssessorIds = assessors.filter((assessorId) => !presentAssessorIds.has(assessorId));
        if (missingAssessorIds.length > 0) {
            missing.push({
                nominationId: n._id,
                title: n.title || 'Untitled',
                company: n.company || '',
                coachAssignedId: n.coachAssignedId || '',
                missingAssessorIds
            });
        }
    }

    const memberNames = await resolveMemberNames(idsToResolve);
    const missingWithNames = missing.map((m) => ({
        ...m,
        coachName: memberNames[m.coachAssignedId] || m.coachAssignedId || '',
        missingAssessors: (Array.isArray(m.missingAssessorIds) ? m.missingAssessorIds : []).map((id) => ({
            id,
            name: memberNames[id] || id
        }))
    }));

    return {
        assessmentsSubmitted,
        assessmentsDraft,
        expectedAssessmentCount: expectedPairs,
        foundAssessmentCount: foundPairs,
        missingAssessmentRecords: missingWithNames.slice(0, 50) // cap for UI
    };
});

async function fetchCustomerFeedbackDraftsOlderThan(days) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const items = [];
    let skip = 0;
    const limit = 100;

    while (true) {
        const res = await wixData.query('Customer_Feedback')
            .eq('evaluationStatus', 'DRAFT')
            .lt('_createdDate', cutoff)
            .ascending('_createdDate')
            .skip(skip)
            .limit(limit)
            .find(options);
        items.push(...res.items);
        if (res.items.length < limit) break;
        skip += limit;
    }

    return items;
}

/**
 * Topic 4: Customer feedback progress KPIs
 * - KPI tiles: submitted vs draft customer feedback records
 * - Action list: stale drafts (older than X days)
 */
export const getCustomerFeedbackProgressKpis = webMethod(Permissions.Anyone, async (staleDays) => {
    const days = Number.isFinite(Number(staleDays)) ? Number(staleDays) : 14;

    const customerFeedbackSubmitted = await countByStatus('Customer_Feedback', 'evaluationStatus', 'SUBMITTED');
    const customerFeedbackDraft = await countByStatus('Customer_Feedback', 'evaluationStatus', 'DRAFT');

    const staleDraftRows = await fetchCustomerFeedbackDraftsOlderThan(days);

    const ownerIds = staleDraftRows.map((r) => r._owner);
    const memberNames = await resolveMemberNames(ownerIds);

    const staleDrafts = staleDraftRows.slice(0, 50).map((r) => ({
        id: r._id,
        createdDate: r._createdDate,
        ownerId: r._owner,
        ownerName: memberNames[r._owner] || r._owner || '',
        customerOrganization: r.customerOrganization || '',
        contactName: r.contactName || '',
        contactEmail: r.contactEmail || '',
        evaluationStatus: r.evaluationStatus || 'DRAFT'
    }));

    return {
        customerFeedbackSubmitted,
        customerFeedbackDraft,
        staleDays: days,
        staleDraftCount: staleDraftRows.length,
        staleDrafts
    };
});

async function fetchSubmittedNominationsForScoreboards() {
    const items = [];
    let skip = 0;
    const limit = 100;

    while (true) {
        const res = await wixData.query('Nominations')
            .eq('status', 'SUBMITTED')
            .skip(skip)
            .limit(limit)
            .find(options);
        items.push(...res.items);
        if (res.items.length < limit) break;
        skip += limit;
    }

    return items;
}

function toNominationScoreRow(n) {
    return {
        nominationId: n._id,
        title: n.title || 'Untitled',
        company: n.company || '',
        category: n.category || '',
        status: n.status || '',
        assessmentsScore: typeof n.assessmentsScore === 'number' ? n.assessmentsScore : (Number.isFinite(Number(n.assessmentsScore)) ? Number(n.assessmentsScore) : null),
        customersScore: typeof n.customersScore === 'number' ? n.customersScore : (Number.isFinite(Number(n.customersScore)) ? Number(n.customersScore) : null),
        overallScore: typeof n.overallScore === 'number' ? n.overallScore : (Number.isFinite(Number(n.overallScore)) ? Number(n.overallScore) : null),
    };
}

function buildTop(rows, scoreKey, topN) {
    const filtered = rows.filter((r) => typeof r?.[scoreKey] === 'number' && Number.isFinite(r[scoreKey]));
    filtered.sort((a, b) => b[scoreKey] - a[scoreKey]);
    return filtered.slice(0, topN);
}

/**
 * Topic 5: Scores & scoreboards (Admin + Coach)
 * Uses persisted rollups on Nominations:
 * - assessmentsScore, customersScore, overallScore
 *
 * Returns KPI tiles + overall + per-category leaderboards (Top N).
 */
export const getScoresAndScoreboardsKpis = webMethod(Permissions.Anyone, async (topNParam) => {
    const topN = Number.isFinite(Number(topNParam)) ? Math.max(1, Math.min(50, Number(topNParam))) : 10;

    const nominations = await fetchSubmittedNominationsForScoreboards();
    const rows = nominations.map(toNominationScoreRow);

    const scoredNominations = rows.filter((r) => typeof r.overallScore === 'number' && Number.isFinite(r.overallScore)).length;
    const unscoredNominations = rows.length - scoredNominations;

    const overall = {
        byOverallScore: buildTop(rows, 'overallScore', topN),
        byAssessmentsScore: buildTop(rows, 'assessmentsScore', topN),
        byCustomersScore: buildTop(rows, 'customersScore', topN),
    };

    const categorySet = new Set(
        rows
            .map((r) => (typeof r.category === 'string' ? r.category.trim() : ''))
            .filter((c) => c.length > 0)
    );
    const categories = [...categorySet].sort((a, b) => a.localeCompare(b));

    const perCategory = categories.slice(0, 10).map((category) => {
        const catRows = rows.filter((r) => (r.category || '').trim() === category);
        return {
            category,
            byOverallScore: buildTop(catRows, 'overallScore', topN),
            byAssessmentsScore: buildTop(catRows, 'assessmentsScore', topN),
            byCustomersScore: buildTop(catRows, 'customersScore', topN),
            totalNominations: catRows.length,
        };
    });

    return {
        topN,
        submittedNominations: rows.length,
        scoredNominations,
        unscoredNominations,
        overall,
        perCategory,
        truncatedCategoryCount: Math.max(0, categories.length - Math.min(categories.length, 10)),
    };
});

