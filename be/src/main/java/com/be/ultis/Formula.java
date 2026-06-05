package com.be.ultis;

public class Formula {
    double k;
    double a;
    double b;
    double c;
    double d;

    public double fromHocBa(double grade) {
        return grade / k;
    }

    public double fromDGNL(double grade) {
        return (grade - c) / (d - c) * (b - a) + a;
    }
}

