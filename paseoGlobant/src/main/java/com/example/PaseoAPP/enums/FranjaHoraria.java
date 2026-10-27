package com.example.PaseoAPP.enums;

//Cada franja dura 1 hora: HORA_6 = 06:00 a 07:00
public enum FranjaHoraria {

    HORA_6,
    HORA_7,
    HORA_8,
    HORA_9,
    HORA_10,
    HORA_11,
    HORA_12,
    HORA_13,
    HORA_14,
    HORA_15,
    HORA_16,
    HORA_17,
    HORA_18,
    HORA_19,
    HORA_20,
    HORA_21;

    //hora en que empieza la franja (HORA_6 -> 6)
    public int horaInicio() {
        return Integer.parseInt(this.name().substring(5));
    }

}
