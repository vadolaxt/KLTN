export interface CombinationScore {
	combination: string;
	subjectList: string[];
	complete: boolean;
	missingSubjects: string[];
	score: number;
	priorityScore: number;
	totalScore: number;
	replacedSubject: string | null;
	convertScore: number;
}

export interface CompetencyScore {
	score: number;
	priorityScore: number;
	totalScore: number;
	convertScore: Record<string, number>;
}

export interface ViewScoreResponse {
	schoolRecordMethodScore: CombinationScore[];
	nationalMethodScore: CombinationScore[];
	combineMethodScore: CombinationScore[];
	competencyMethod: CompetencyScore;
}


export interface MajorScore {
	majorCode: string;
	majorName: string;
	priorityArea: string;
	priorityGroup: string;
	scores: MethodScore[]
}

export interface MethodScore {
	type: string;
	combination: string;
	rawScore: number;
	baseConvertedScore: number;
	priorityScore: number;
	convertedScore: number;
}

export interface MajorScoreResponse {
	majorScores: MajorScore[];
}
