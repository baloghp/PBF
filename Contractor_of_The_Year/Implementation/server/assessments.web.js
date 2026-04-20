import wixData from 'wix-data';
import { webMethod, Permissions } from 'wix-web-module';
import { currentMember } from 'wix-members-backend';

const COLLECTIONS = {
    nominations: 'Nominations',
    assessments: 'Assessments'
};

async function requireAssessorAccess(nominationId, assessorId) {
    const nomination = await wixData.get(COLLECTIONS.nominations, nominationId, { suppressAuth: true });
    if (!nomination) throw new Error('Nomination not found.');

    const assignedAssessors = Array.isArray(nomination.assessors) ? nomination.assessors : [];
    if (!assignedAssessors.includes(assessorId)) {
        throw new Error('Not authorized to assess this nomination.');
    }

    return nomination;
}

export const getMyAssessmentForNomination = webMethod(Permissions.Anyone, async (nominationId) => {
    if (!nominationId) throw new Error('Nomination ID is required.');

    const member = await currentMember.getMember();
    if (!member) throw new Error('Not authorized.');

    console.log('[assessments.web] getMyAssessmentForNomination', {
        nominationId,
        assessorId: member._id
    });

    await requireAssessorAccess(nominationId, member._id);

    const existing = await wixData.query(COLLECTIONS.assessments)
        .eq('nominationId', nominationId)
        .eq('assessorId', member._id)
        .limit(1)
        .find({ suppressAuth: true });

    console.log('[assessments.web] query result', {
        count: existing.items.length,
        ids: existing.items.map((x) => x._id),
        statuses: existing.items.map((x) => x.status)
    });

    return existing.items.length > 0 ? existing.items[0] : null;
});

export const saveMyAssessmentForNomination = webMethod(Permissions.Anyone, async (nominationId, assessmentData, isFinalSubmission) => {
    if (!nominationId) throw new Error('Nomination ID is required.');

    const member = await currentMember.getMember();
    if (!member) throw new Error('Not authorized.');

    await requireAssessorAccess(nominationId, member._id);

    const existing = await wixData.query(COLLECTIONS.assessments)
        .eq('nominationId', nominationId)
        .eq('assessorId', member._id)
        .limit(1)
        .find({ suppressAuth: true });

    const current = existing.items.length > 0 ? existing.items[0] : null;

    if (current && current.status === 'SUBMITTED') {
        throw new Error('Assessment is locked.');
    }

    const baseRecord = current ? { ...current } : {};

    const toSave = {
        ...baseRecord,
        ...assessmentData,
        title: assessmentData?.title || baseRecord.title || 'Assessment',
        nominationId,
        assessorId: member._id,
        status: isFinalSubmission ? 'SUBMITTED' : 'DRAFT',
        submittedAt: isFinalSubmission ? new Date() : baseRecord.submittedAt
    };

    if (current?._id) {
        return await wixData.update(COLLECTIONS.assessments, toSave, { suppressAuth: true });
    }

    return await wixData.insert(COLLECTIONS.assessments, toSave, { suppressAuth: true });
});

