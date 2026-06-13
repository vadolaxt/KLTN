export interface Subject {
	id: string;
	code: string;
	subjectName: string;
}

export interface SubjectScoreRecord {
	subject: Subject;
	score: number;
	gradeLevel: number;
	semester: number;
}

export interface SchoolRecord {
	subjectScoreRecords: SubjectScoreRecord[];
}

export interface NationalExamResult {
	id: string | null;
	subjectScores: SubjectScoreRecord[];
}

export interface CompetencyTestResult {
	score: number;
}

export type SchoolRecordAvg = Map<string, number>;

export interface AcademicScoreProfileRequest {
	schoolRecord: SchoolRecord;
	nationalExamResult: NationalExamResult;
	competencyTestResult: CompetencyTestResult;
}

export interface AcademicScoreProfileResponse {
	schoolRecord: SchoolRecord;
	nationalExamResult: NationalExamResult;
	competencyTestResult: CompetencyTestResult;
	schoolRecordAvg: SchoolRecordAvg;
}