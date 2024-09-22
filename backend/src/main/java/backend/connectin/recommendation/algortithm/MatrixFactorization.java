package backend.connectin.recommendation.algortithm;

import java.util.Random;

public class MatrixFactorization {

    private double[][] R;
    private int users;
    private int items;
    private int K;
    private double alpha;
    private double beta;
    private int iterations;
    private double[][] V;
    private double[][] FTr;

    public MatrixFactorization(double[][] R, int K, double alpha, double beta, int iterations) {
        this.R = R;
        this.users = R.length;
        this.items = R[0].length;
        this.K = K;
        this.alpha = alpha;
        this.beta = beta;
        this.iterations = iterations;

        V = new double[users][K];
        FTr = new double[K][items];
        initializeMatrix(V);
        initializeMatrix(FTr);
    }

    public double[][] trainAndPredict() {
        for (int step = 0; step < iterations; step++) {
            double errorSquared = 0;

            for (int u = 0; u < users; u++) {
                for (int i = 0; i < items; i++) {
                    if (R[u][i] != -1) {
                        double prediction = dot(V[u], getColumn(FTr, i));
                        double error = R[u][i] - prediction;

                        for (int k = 0; k < K; k++) {
                            V[u][k] += alpha * (2 * error * FTr[k][i] - beta * V[u][k]);
                            FTr[k][i] += alpha * (2 * error * V[u][k] - beta * FTr[k][i]);
                        }
                        errorSquared += error * error;
                    }
                }
            }

            errorSquared += regularize(V, FTr, beta);
            if (errorSquared <= 0.001) break;
        }
        return predictRatings();
    }

    private double dot(double[] row, double[] col) {
        double sum = 0;
        for (int i = 0; i < row.length; i++) {
            sum += row[i] * col[i];
        }
        return sum;
    }

    private double[] getColumn(double[][] matrix, int colIndex) {
        double[] column = new double[K];
        for (int k = 0; k < K; k++) {
            column[k] = matrix[k][colIndex];
        }
        return column;
    }

    private void initializeMatrix(double[][] matrix) {
        Random rand = new Random();
        for (int i = 0; i < matrix.length; i++) {
            for (int j = 0; j < matrix[i].length; j++) {
                matrix[i][j] = rand.nextDouble();
            }
        }
    }

    private double regularize(double[][] V, double[][] FTr, double beta) {
        double regularizationError = 0;
        for (int u = 0; u < users; u++) {
            for (int k = 0; k < K; k++) {
                regularizationError += (beta / 2) * (V[u][k] * V[u][k]);
            }
        }
        for (int i = 0; i < items; i++) {
            for (int k = 0; k < K; k++) {
                regularizationError += (beta / 2) * (FTr[k][i] * FTr[k][i]);
            }
        }
        return regularizationError;
    }

    private double[][] predictRatings() {
        double[][] predictions = new double[users][items];
        for (int u = 0; u < users; u++) {
            for (int i = 0; i < items; i++) {
                predictions[u][i] = dot(V[u], getColumn(FTr, i));
            }
        }
        return predictions;
    }
}
