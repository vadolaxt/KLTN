package com.be;

import com.be.ultis.ScoreHelper;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ScoreHelperTest {
    private final ScoreHelper scoreHelper = new ScoreHelper();

    @Test
    void convertsCompetencyScoreUsingTheProfilePercentileTable() {
        Map<String, Double> convertedScores = scoreHelper.convertCompetencyScore(900);

        assertEquals(26.4, convertedScores.get("A00"), 0.001);
        assertEquals(25.76, convertedScores.get("B00"), 0.001);
    }

    @Test
    void calculatesPriorityAfterCompetencyConversion() {
        assertEquals(0.36, scoreHelper.calculatePriorityScore(26.4, 0.75), 0.001);
    }

    @Test
    void convertsSchoolRecordScoreWithTheSameRuleUsedByProfile() {
        assertEquals(24.0, scoreHelper.convertSchoolRecordScore(27.0), 0.001);
    }

    @Test
    void resolvesCompetencyPriorityLevelsOnTheTwelveHundredPointScale() {
        assertEquals(110.0, scoreHelper.resolveCompetencyPriorityLevel("KV1", "UT1"), 0.001);
        assertEquals(60.0, scoreHelper.resolveCompetencyPriorityLevel("KV2-NT", "UT2"), 0.001);
        assertEquals(10.0, scoreHelper.resolveCompetencyPriorityLevel("KV2", "NONE"), 0.001);
    }

    @Test
    void reducesCompetencyPriorityFromTheNineHundredPointThreshold() {
        assertEquals(110.0, scoreHelper.calculateCompetencyPriorityScore(899, 110), 0.001);
        assertEquals(110.0, scoreHelper.calculateCompetencyPriorityScore(900, 110), 0.001);
        assertEquals(73.33, scoreHelper.calculateCompetencyPriorityScore(1000, 110), 0.001);
        assertEquals(0.0, scoreHelper.calculateCompetencyPriorityScore(1200, 110), 0.001);
    }
}
