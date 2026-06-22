import {ADMISSION_FACULTIES} from '../../../search/constants/admission_lookup_data';
import type {CombinationInfo, MajorScoreRow} from './types';

export const normalizeText = (value: string) =>
	value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim();

const parseCombination = (value: string): CombinationInfo => {
	const code = value.trim().split(/\s+/)[0] ?? value.trim();
	const subjectsMatch = value.match(/\(([^)]+)\)/);
	const subjects = subjectsMatch?.[1]
		? subjectsMatch[1].split(',').map((subject) => subject.trim()).filter(Boolean)
		: SUBJECT_CATALOG[code] ?? [];

	return {
		code,
		subjects,
	};
};

const getTranscriptSubjects = (subjects: string[]) => {
	const restrictedSubjects = new Set(['toan', 'ngu van', 'van']);
	return subjects.filter((subject) => !restrictedSubjects.has(normalizeText(subject)));
};

export const getTranscriptSubjectLabel = (subjects: string[]) => {
	const transcriptSubjects = getTranscriptSubjects(subjects);

	if (transcriptSubjects.length <= 1) {
		return transcriptSubjects[0] ?? '-';
	}

	return `Môn cao nhất trong: ${transcriptSubjects.join(', ')}`;
};

export const buildCombinationRows = () => {
	const combinations = new Map<string, CombinationInfo>();

	ADMISSION_FACULTIES.forEach((faculty) => {
		faculty.majors.forEach((major) => {
			major.combinations.forEach((combination) => {
				const parsedCombination = parseCombination(combination);
				const catalogSubjects = SUBJECT_CATALOG[parsedCombination.code];
				combinations.set(parsedCombination.code, {
					code: parsedCombination.code,
					subjects: parsedCombination.subjects.length ? parsedCombination.subjects : catalogSubjects ?? [],
				});
			});
		});
	});

	return Array.from(combinations.values()).sort((current, next) => current.code.localeCompare(next.code));
};

export const buildMajorRows = () => {
	const rows = new Map<string, MajorScoreRow>();

	ADMISSION_FACULTIES.forEach((faculty) => {
		faculty.majors.forEach((major) => {
			const normalizedMajorName = normalizeText(major.name);
			const isExcludedCampus = normalizedMajorName.includes('phan hieu');
			const isPreschoolEducation = normalizedMajorName.includes('giao duc mam non');

			if (isExcludedCampus || isPreschoolEducation || rows.has(major.majorCode)) {
				return;
			}

			rows.set(major.majorCode, {
				id: major.majorCode,
				majorCode: major.majorCode,
				majorName: major.name,
			});
		});
	});

	return Array.from(rows.values());
};
