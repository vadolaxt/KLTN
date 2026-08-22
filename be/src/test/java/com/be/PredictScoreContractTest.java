package com.be;

import com.be.dto.request.PredictScoreRequest;
import com.be.dto.response.PredictScoreResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PredictScoreContractTest {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void readsCompetencyPrioritySelectionsFromFrontendPayload() throws Exception {
        String json = """
                {
                  "schoolCode": "NLU",
                  "admissionMethod": "dgnl",
                  "majorCode": "7480201",
                  "scores": [],
                  "subjectCombination": "A00",
                  "priorityScore": 0.75,
                  "priorityArea": "KV1",
                  "priorityGroup": "NONE",
                  "targetYear": 2026,
                  "topK": 5
                }
                """;

        PredictScoreRequest request = objectMapper.readValue(json, PredictScoreRequest.class);

        assertEquals("KV1", request.priorityArea());
        assertEquals("NONE", request.priorityGroup());
    }

    @Test
    void writesRawCompetencyPriorityForFrontendResult() throws Exception {
        PredictScoreResponse response = PredictScoreResponse.builder()
                .result(PredictScoreResponse.PredictResult.builder()
                        .rawPriorityScore(30.0)
                        .build())
                .build();

        JsonNode json = objectMapper.valueToTree(response);

        assertEquals(30.0, json.path("result").path("raw_priority_score").asDouble(), 0.001);
    }
}
