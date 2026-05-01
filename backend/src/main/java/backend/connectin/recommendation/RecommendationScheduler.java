package backend.connectin.recommendation;

import backend.connectin.service.RecommendationService;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class RecommendationScheduler {

    private static final Logger log = LoggerFactory.getLogger(RecommendationScheduler.class);

    private final RecommendationService recommendationService;
    private final ExecutorService trainingExecutor = Executors.newFixedThreadPool(2, r -> {
        Thread t = new Thread(r, "recommendation-trainer");
        t.setDaemon(true);
        return t;
    });

    private final AtomicLong totalRuns = new AtomicLong();
    private final AtomicLong totalFailures = new AtomicLong();
    private final AtomicLong lastSuccessEpochMillis = new AtomicLong();
    private final AtomicLong lastFailureEpochMillis = new AtomicLong();
    private final AtomicLong lastDurationMillis = new AtomicLong();

    public RecommendationScheduler(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    // Single-instance only — gate with a distributed lock (e.g. ShedLock) before scaling out.
    @Scheduled(fixedDelayString = "${recommendations.refresh.interval-ms:10800000}",
               initialDelayString = "${recommendations.refresh.initial-delay-ms:5000}")
    public void refreshRecommendations() {
        long start = System.currentTimeMillis();
        long runId = totalRuns.incrementAndGet();
        log.info("Recommendation refresh starting (run #{})", runId);

        CompletableFuture<Void> posts = CompletableFuture.runAsync(recommendationService::recommendPosts, trainingExecutor);
        CompletableFuture<Void> jobs = CompletableFuture.runAsync(recommendationService::recommendJobs, trainingExecutor);

        try {
            CompletableFuture.allOf(posts, jobs).join();
            long duration = System.currentTimeMillis() - start;
            lastDurationMillis.set(duration);
            lastSuccessEpochMillis.set(System.currentTimeMillis());
            log.info("Recommendation refresh #{} finished in {} ms", runId, duration);
        } catch (RuntimeException e) {
            Throwable cause = e.getCause() != null ? e.getCause() : e;
            totalFailures.incrementAndGet();
            lastFailureEpochMillis.set(System.currentTimeMillis());
            log.error("Recommendation refresh #{} failed after {} ms", runId, System.currentTimeMillis() - start, cause);
        }
    }

    @PreDestroy
    void shutdown() {
        trainingExecutor.shutdown();
        try {
            if (!trainingExecutor.awaitTermination(30, TimeUnit.SECONDS)) {
                trainingExecutor.shutdownNow();
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            trainingExecutor.shutdownNow();
        }
    }

    long totalRuns() { return totalRuns.get(); }
    long totalFailures() { return totalFailures.get(); }
    long lastSuccessEpochMillis() { return lastSuccessEpochMillis.get(); }
    long lastFailureEpochMillis() { return lastFailureEpochMillis.get(); }
    long lastDurationMillis() { return lastDurationMillis.get(); }
}
