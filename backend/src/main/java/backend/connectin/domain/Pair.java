package backend.connectin.domain;

public class Pair {
    int index;

    public double getValue() {
        return value;
    }

    public int getIndex() {
        return index;
    }

    public double value;

    public Pair(int index, double value){
        this.index = index;
        this.value = value;
    }
}