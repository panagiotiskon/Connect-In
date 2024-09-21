package backend.connectin.domain;

public class Recommendation {
    private final int index;
    private final double score;

    public Recommendation(int index, double score) {
        this.index = index;
        this.score = score;
    }

    public int getIndex() {
        return index;
    }

    public double getScore() {
        return score;
    }
}