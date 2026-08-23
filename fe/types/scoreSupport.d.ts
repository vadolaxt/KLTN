export interface CombinationScore {
	combination: string;
	subjectList: string[];
	score: number;
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
	scores: MethodScore[]
}

export interface MethodScore {
	type: string;
	combination: string;
	rawScore: number;
	convertedScore: number;
}

export interface MajorScoreResponse {
	majorScores: MajorScore[];
}