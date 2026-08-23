package com.be.score;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Component
public class AdmissionScorePolicy {
    private static final String RESOURCE = "admission-score-policy-2026.json";
    private final Policy policy = loadPolicy();

    public double convertSchoolRecordToNational(double score) {
        ConversionRule rule = conversion("SCHOOL_RECORD");
        return round(apply(rule.formula(), rule.anchors(), score));
    }

    public double convertNationalToSchoolRecord(double score) {
        ConversionRule rule = conversion("SCHOOL_RECORD");
        return round(apply(rule.formula(), swapAxes(rule.anchors()), score));
    }

    public double convertNationalToCompetency(double score, String combination) {
        ConversionRule rule = conversion("COMPETENCY");
        List<Anchor> anchors = rule.anchorsByCombination().get(normalize(combination));
        return Math.round(apply(rule.formula(), swapAxes(anchors), score));
    }

    public Map<String, Double> convertCompetencyToNational(double score) {
        ConversionRule rule = conversion("COMPETENCY");
        Map<String, Double> result = new LinkedHashMap<>();
        rule.anchorsByCombination().forEach((combination, anchors) -> {
            double converted = round(apply(rule.formula(), anchors, score));
            if (converted > 0) result.put(combination, converted);
        });
        return result;
    }

    public double resolveStandardPriorityLevel(String area, String group) {
        return resolveLevel(policy.standardPriority(), area, group);
    }

    public double resolveCompetencyPriorityLevel(String area, String group) {
        return resolveLevel(policy.competencyPriority(), area, group);
    }

    public double calculateStandardPriority(double score, double level) {
        return calculatePriority(score, level, policy.standardPriority());
    }

    public double calculateCompetencyPriority(double score, double level) {
        return calculatePriority(score, level, policy.competencyPriority());
    }

    /** Calculates priority on the school-record scale first, then converts the total. */
    public ScoreBreakdown calculateSchoolRecordAdmissionScore(double sourceScore, double priorityLevel) {
        double sourcePriority = sourceScore > 0 ? calculateStandardPriority(sourceScore, priorityLevel) : 0.0;
        double sourceTotal = round(Math.min(sourceScore + sourcePriority, policy.standardPriority().maximumScore()));
        double convertedBase = convertSchoolRecordToNational(sourceScore);
        double convertedTotal = convertSchoolRecordToNational(sourceTotal);
        double convertedPriority = round(Math.max(convertedTotal - convertedBase, 0.0));
        return new ScoreBreakdown(sourceScore, sourcePriority, sourceTotal,
                convertedBase, convertedPriority, convertedTotal);
    }

    private double apply(String formula, List<Anchor> anchors, double score) {
        if (!Double.isFinite(score)) return 0.0;
        if (!"PIECEWISE_LINEAR".equals(formula)) {
            throw new IllegalStateException("Unsupported conversion formula: " + formula);
        }
        if (anchors == null || anchors.size() < 2 || score < anchors.getFirst().source()
                || score > anchors.getLast().source()) return 0.0;

        for (int index = 1; index < anchors.size(); index++) {
            Anchor lower = anchors.get(index - 1);
            Anchor upper = anchors.get(index);
            if (score <= upper.source()) {
                // Official formula, with source/target axes arranged for conversion to THPT.
                return lower.target() + ((score - lower.source()) * (upper.target() - lower.target()))
                        / (upper.source() - lower.source());
            }
        }
        return 0.0;
    }

    private double resolveLevel(PriorityRule rule, String area, String group) {
        return rule.areaLevels().getOrDefault(normalizeDefault(area, "KV3"), 0.0)
                + rule.groupLevels().getOrDefault(normalizeDefault(group, "NONE"), 0.0);
    }

    private double calculatePriority(double score, double level, PriorityRule rule) {
        if (!Double.isFinite(score) || !Double.isFinite(level) || level <= 0) return 0.0;
        double bounded = Math.max(0.0, Math.min(score, rule.maximumScore()));
        double result = bounded >= rule.reductionThreshold()
                ? ((rule.maximumScore() - bounded) / (rule.maximumScore() - rule.reductionThreshold())) * level
                : level;
        return round(Math.max(result, 0.0));
    }

    private ConversionRule conversion(String method) {
        ConversionRule rule = policy.conversions().get(method);
        if (rule == null) throw new IllegalStateException("Missing conversion policy for " + method);
        return rule;
    }

    private Policy loadPolicy() {
        try (InputStream stream = getClass().getClassLoader().getResourceAsStream(RESOURCE)) {
            if (stream == null) throw new IllegalStateException("Missing score policy: " + RESOURCE);
            JsonNode root = new ObjectMapper().readTree(stream);
            Map<String, ConversionRule> conversions = new LinkedHashMap<>();
            root.path("conversions").fields().forEachRemaining(entry -> {
                JsonNode node = entry.getValue();
                Map<String, List<Anchor>> byCombination = new LinkedHashMap<>();
                node.path("anchorsByCombination").fields().forEachRemaining(item ->
                        byCombination.put(normalize(item.getKey()), readAnchors(item.getValue())));
                conversions.put(entry.getKey(), new ConversionRule(node.path("formula").asText(),
                        readAnchors(node.path("anchors")), Map.copyOf(byCombination)));
            });
            JsonNode priority = root.path("priority");
            return new Policy(Map.copyOf(conversions), readPriority(priority.path("standard")),
                    readPriority(priority.path("competency")));
        } catch (IOException exception) {
            throw new IllegalStateException("Cannot read score policy: " + RESOURCE, exception);
        }
    }

    private static List<Anchor> readAnchors(JsonNode nodes) {
        List<Anchor> anchors = new ArrayList<>();
        nodes.forEach(node -> anchors.add(new Anchor(node.path(0).asDouble(), node.path(1).asDouble())));
        anchors.sort(Comparator.comparingDouble(Anchor::source));
        if (anchors.size() == 1) {
            throw new IllegalStateException("A conversion rule requires at least two anchors");
        }
        for (int index = 1; index < anchors.size(); index++) {
            Anchor previous = anchors.get(index - 1);
            Anchor current = anchors.get(index);
            if (current.source() <= previous.source() || current.target() <= previous.target()) {
                throw new IllegalStateException("Conversion anchors must increase on both axes");
            }
        }
        return List.copyOf(anchors);
    }

    private static List<Anchor> swapAxes(List<Anchor> anchors) {
        if (anchors == null) return List.of();
        List<Anchor> swapped = anchors.stream()
                .map(anchor -> new Anchor(anchor.target(), anchor.source()))
                .sorted(Comparator.comparingDouble(Anchor::source))
                .toList();
        return List.copyOf(swapped);
    }

    private static PriorityRule readPriority(JsonNode node) {
        return new PriorityRule(node.path("maximumScore").asDouble(), node.path("reductionThreshold").asDouble(),
                readLevels(node.path("areaLevels")), readLevels(node.path("groupLevels")));
    }

    private static Map<String, Double> readLevels(JsonNode node) {
        Map<String, Double> levels = new LinkedHashMap<>();
        node.fields().forEachRemaining(entry -> levels.put(normalize(entry.getKey()), entry.getValue().asDouble()));
        return Map.copyOf(levels);
    }

    private static String normalize(String value) { return value.trim().toUpperCase(Locale.ROOT); }
    private static String normalizeDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : normalize(value);
    }
    private static double round(double value) { return Math.round(value * 100.0) / 100.0; }

    private record Policy(Map<String, ConversionRule> conversions, PriorityRule standardPriority,
                          PriorityRule competencyPriority) {}
    private record ConversionRule(String formula, List<Anchor> anchors,
                                  Map<String, List<Anchor>> anchorsByCombination) {}
    private record Anchor(double source, double target) {}
    private record PriorityRule(double maximumScore, double reductionThreshold,
                                Map<String, Double> areaLevels, Map<String, Double> groupLevels) {}

    public record ScoreBreakdown(double sourceScore, double sourcePriority, double sourceTotal,
                                 double convertedBase, double convertedPriority, double convertedTotal) {}
}
