package backend.connectin.recommendation.algorithm;

import java.util.Random;

public class MatrixFactorization {

    private double[][] interactionMatrix;
    private int numUsers;
    private int numItems;
    private int numFeatures;
    private double learningRate;
    private double regularizationFactor;
    private int maxIterations;
    private double[][] userFeatureMatrix;
    private double[][] itemFeatureMatrix;

    public MatrixFactorization(double[][] interactionMatrix, int numFeatures, double learningRate, double regularizationFactor, int maxIterations) {
        this.interactionMatrix = interactionMatrix;
        this.numUsers = interactionMatrix.length;
        this.numItems = interactionMatrix[0].length;
        this.numFeatures = numFeatures;
        this.learningRate = learningRate;
        this.regularizationFactor = regularizationFactor;
        this.maxIterations = maxIterations;

        userFeatureMatrix = new double[numUsers][numFeatures];
        itemFeatureMatrix = new double[numFeatures][numItems];
        initializeMatrix(userFeatureMatrix);
        initializeMatrix(itemFeatureMatrix);
    }

    public double[][] trainAndPredict() {
        for (int step = 0; step < maxIterations; step++) {
            double totalError = 0;

            for (int user = 0; user < numUsers; user++) {
                for (int item = 0; item < numItems; item++) {
                    if (interactionMatrix[user][item] != -1) {
                        double predictedRating = dotProduct(userFeatureMatrix[user], getColumn(itemFeatureMatrix, item));
                        double error = interactionMatrix[user][item] - predictedRating;

                        for (int feature = 0; feature < numFeatures; feature++) {
                            userFeatureMatrix[user][feature] += learningRate * (2 * error * itemFeatureMatrix[feature][item] - regularizationFactor * userFeatureMatrix[user][feature]);
                            itemFeatureMatrix[feature][item] += learningRate * (2 * error * userFeatureMatrix[user][feature] - regularizationFactor * itemFeatureMatrix[feature][item]);
                        }
                        totalError += error * error;
                    }
                }
            }

            totalError += calculateRegularization(userFeatureMatrix, itemFeatureMatrix, regularizationFactor);
            if (totalError <= 0.001) break;
        }
        return predictRatings();
    }

    private double dotProduct(double[] userFeatures, double[] itemFeatures) {
        double sum = 0;
        for (int i = 0; i < userFeatures.length; i++) {
            sum += userFeatures[i] * itemFeatures[i];
        }
        return sum;
    }

    private double[] getColumn(double[][] matrix, int colIndex) {
        double[] column = new double[numFeatures];
        for (int feature = 0; feature < numFeatures; feature++) {
            column[feature] = matrix[feature][colIndex];
        }
        return column;
    }

    private void initializeMatrix(double[][] matrix) {
        Random random = new Random();
        for (int i = 0; i < matrix.length; i++) {
            for (int j = 0; j < matrix[i].length; j++) {
                matrix[i][j] = random.nextDouble();
            }
        }
    }

    private double calculateRegularization(double[][] userFeatures, double[][] itemFeatures, double regularizationFactor) {
        double regError = 0;
        for (int user = 0; user < numUsers; user++) {
            for (int feature = 0; feature < numFeatures; feature++) {
                regError += (regularizationFactor / 2) * (userFeatures[user][feature] * userFeatures[user][feature]);
            }
        }
        for (int item = 0; item < numItems; item++) {
            for (int feature = 0; feature < numFeatures; feature++) {
                regError += (regularizationFactor / 2) * (itemFeatures[feature][item] * itemFeatures[feature][item]);
            }
        }
        return regError;
    }

    private double[][] predictRatings() {
        double[][] predictions = new double[numUsers][numItems];
        for (int user = 0; user < numUsers; user++) {
            for (int item = 0; item < numItems; item++) {
                predictions[user][item] = dotProduct(userFeatureMatrix[user], getColumn(itemFeatureMatrix, item));
            }
        }
        return predictions;
    }
}
