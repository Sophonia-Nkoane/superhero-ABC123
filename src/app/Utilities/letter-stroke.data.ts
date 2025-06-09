export interface Stroke {
  path: string;
  number: number;
  numberPos: { x: number; y: number };
}

export interface LetterStrokeData {
  [key: string]: Stroke[];
}

export const letterStrokes: LetterStrokeData = {
// UPPERCASE LETTERS
  'A_upper': [
    { path: 'M 50 15 L 25 85', number: 1, numberPos: { x: 30, y: 50 } },
    { path: 'M 50 15 L 75 85', number: 2, numberPos: { x: 70, y: 50 } },
    { path: 'M 35 60 L 65 60', number: 3, numberPos: { x: 42, y: 55 } },
  ],
  'B_upper': [
    { path: 'M 30 15 L 30 85', number: 1, numberPos: { x: 25, y: 50 } },
    { path: 'M 30 15 C 75 15, 75 45, 30 50', number: 2, numberPos: { x: 60, y: 28 } },
    { path: 'M 30 50 C 80 50, 80 85, 30 85', number: 3, numberPos: { x: 65, y: 70 } },
  ],
  'C_upper': [
    { path: 'M 75 25 C 25 15, 25 85, 75 75', number: 1, numberPos: { x: 45, y: 50 } },
  ],
  'D_upper': [
    { path: 'M 30 15 L 30 85', number: 1, numberPos: { x: 25, y: 50 } },
    { path: 'M 30 15 C 80 15, 80 85, 30 85', number: 2, numberPos: { x: 65, y: 50 } },
  ],
  'E_upper': [
    { path: 'M 30 15 L 30 85', number: 1, numberPos: { x: 25, y: 50 } },
    { path: 'M 30 15 L 70 15', number: 2, numberPos: { x: 55, y: 10 } },
    { path: 'M 30 50 L 60 50', number: 3, numberPos: { x: 50, y: 45 } },
    { path: 'M 30 85 L 70 85', number: 4, numberPos: { x: 55, y: 90 } },
  ],
  'F_upper': [
    { path: 'M 30 15 L 30 85', number: 1, numberPos: { x: 25, y: 50 } },
    { path: 'M 30 15 L 70 15', number: 2, numberPos: { x: 55, y: 10 } },
    { path: 'M 30 50 L 60 50', number: 3, numberPos: { x: 50, y: 45 } },
  ],
  'G_upper': [
    { path: 'M 75 25 C 25 15, 25 85, 75 75', number: 1, numberPos: { x: 40, y: 50 } },
    { path: 'M 75 75 L 75 50', number: 2, numberPos: { x: 80, y: 62 } },
    { path: 'M 75 50 L 60 50', number: 3, numberPos: { x: 70, y: 45 } },
  ],
  'H_upper': [
    { path: 'M 30 15 L 30 85', number: 1, numberPos: { x: 25, y: 50 } },
    { path: 'M 70 15 L 70 85', number: 2, numberPos: { x: 75, y: 50 } },
    { path: 'M 30 50 L 70 50', number: 3, numberPos: { x: 50, y: 45 } },
  ],
  'I_upper': [
    { path: 'M 30 15 L 70 15', number: 1, numberPos: { x: 50, y: 10 } },
    { path: 'M 50 15 L 50 85', number: 2, numberPos: { x: 45, y: 50 } },
    { path: 'M 30 85 L 70 85', number: 3, numberPos: { x: 50, y: 90 } },
  ],
  'J_upper': [
    { path: 'M 20 15 L 70 15', number: 1, numberPos: { x: 45, y: 10 } },
    { path: 'M 55 15 L 55 70', number: 2, numberPos: { x: 60, y: 40 } },
    { path: 'M 55 70 C 55 85, 35 85, 25 70', number: 3, numberPos: { x: 35, y: 75 } },
  ],
  'K_upper': [
    { path: 'M 30 15 L 30 85', number: 1, numberPos: { x: 25, y: 50 } },
    { path: 'M 30 50 L 70 15', number: 2, numberPos: { x: 55, y: 30 } },
    { path: 'M 30 50 L 70 85', number: 3, numberPos: { x: 55, y: 70 } },
  ],
  'L_upper': [
    { path: 'M 30 15 L 30 85', number: 1, numberPos: { x: 25, y: 50 } },
    { path: 'M 30 85 L 70 85', number: 2, numberPos: { x: 50, y: 90 } },
  ],
  'M_upper': [
    { path: 'M 20 15 L 20 85', number: 1, numberPos: { x: 15, y: 50 } },
    { path: 'M 20 15 L 50 50', number: 2, numberPos: { x: 30, y: 30 } },
    { path: 'M 50 50 L 80 15', number: 3, numberPos: { x: 70, y: 30 } },
    { path: 'M 80 15 L 80 85', number: 4, numberPos: { x: 85, y: 50 } },
  ],
  'N_upper': [
    { path: 'M 30 15 L 30 85', number: 1, numberPos: { x: 25, y: 50 } },
    { path: 'M 30 15 L 70 85', number: 2, numberPos: { x: 50, y: 50 } },
    { path: 'M 70 15 L 70 85', number: 3, numberPos: { x: 75, y: 50 } },
  ],
  'O_upper': [
    { path: 'M 50 15 C 20 15, 20 85, 50 85 C 80 85, 80 15, 50 15', number: 1, numberPos: { x: 50, y: 50 } },
  ],
  'P_upper': [
    { path: 'M 30 15 L 30 85', number: 1, numberPos: { x: 25, y: 50 } },
    { path: 'M 30 15 C 75 15, 75 50, 30 50', number: 2, numberPos: { x: 60, y: 30 } },
  ],
  'Q_upper': [
    { path: 'M 50 15 C 20 15, 20 85, 50 85 C 80 85, 80 15, 50 15', number: 1, numberPos: { x: 35, y: 50 } },
    { path: 'M 65 70 L 80 85', number: 2, numberPos: { x: 75, y: 75 } },
  ],
  'R_upper': [
    { path: 'M 30 15 L 30 85', number: 1, numberPos: { x: 25, y: 50 } },
    { path: 'M 30 15 C 75 15, 75 50, 30 50', number: 2, numberPos: { x: 60, y: 30 } },
    { path: 'M 30 50 L 70 85', number: 3, numberPos: { x: 55, y: 70 } },
  ],
  'S_upper': [
    { path: 'M 75 25 C 25 15, 25 40, 75 50 C 75 60, 25 85, 25 75', number: 1, numberPos: { x: 50, y: 50 } },
  ],
  'T_upper': [
    { path: 'M 20 15 L 80 15', number: 1, numberPos: { x: 50, y: 10 } },
    { path: 'M 50 15 L 50 85', number: 2, numberPos: { x: 45, y: 50 } },
  ],
  'U_upper': [
    { path: 'M 30 15 L 30 70 C 30 85, 70 85, 70 70 L 70 15', number: 1, numberPos: { x: 50, y: 50 } },
  ],
  'V_upper': [
    { path: 'M 25 15 L 50 85', number: 1, numberPos: { x: 30, y: 50 } },
    { path: 'M 75 15 L 50 85', number: 2, numberPos: { x: 70, y: 50 } },
  ],
  'W_upper': [
    { path: 'M 20 15 L 30 85', number: 1, numberPos: { x: 15, y: 50 } },
    { path: 'M 30 85 L 50 50', number: 2, numberPos: { x: 35, y: 70 } },
    { path: 'M 50 50 L 70 85', number: 3, numberPos: { x: 65, y: 70 } },
    { path: 'M 70 85 L 80 15', number: 4, numberPos: { x: 85, y: 50 } },
  ],
  'X_upper': [
    { path: 'M 25 15 L 75 85', number: 1, numberPos: { x: 35, y: 40 } },
    { path: 'M 75 15 L 25 85', number: 2, numberPos: { x: 65, y: 40 } },
  ],
  'Y_upper': [
    { path: 'M 25 15 L 50 50', number: 1, numberPos: { x: 30, y: 30 } },
    { path: 'M 75 15 L 50 50', number: 2, numberPos: { x: 70, y: 30 } },
    { path: 'M 50 50 L 50 85', number: 3, numberPos: { x: 45, y: 70 } },
  ],
  'Z_upper': [
    { path: 'M 25 15 L 75 15', number: 1, numberPos: { x: 50, y: 10 } },
    { path: 'M 75 15 L 25 85', number: 2, numberPos: { x: 50, y: 50 } },
    { path: 'M 25 85 L 75 85', number: 3, numberPos: { x: 50, y: 90 } },
  ],

  // LOWERCASE LETTERS
  'a_lower': [
    { path: 'M 67 68 A 17 17 0 1 0 66.9 68', number: 1, numberPos: { x: 40, y: 55 } },
    { path: 'M 67 45 L 67 85', number: 2, numberPos: { x: 72, y: 65 } },
  ],
  'b_lower': [
    { path: 'M 30 15 L 30 85', number: 1, numberPos: { x: 25, y: 50 } },
    { path: 'M 30 50 C 70 45, 70 85, 30 85', number: 2, numberPos: { x: 55, y: 70 } },
  ],
  'c_lower': [
    { path: 'M 70 50 C 30 45, 30 85, 70 80', number: 1, numberPos: { x: 50, y: 65 } },
  ],
  'd_lower': [
    { path: 'M 70 15 L 70 85', number: 1, numberPos: { x: 75, y: 50 } },
    { path: 'M 70 50 C 30 45, 30 85, 70 85', number: 2, numberPos: { x: 45, y: 70 } },
  ],
  'e_lower': [
    { path: 'M 30 65 L 70 65 C 70 45, 30 45, 30 65 C 30 85, 70 85, 70 75', number: 1, numberPos: { x: 50, y: 65 } },
  ],
  'f_lower': [
    { path: 'M 60 15 C 45 15, 45 30, 45 45 L 45 85', number: 1, numberPos: { x: 40, y: 50 } },
    { path: 'M 30 45 L 60 45', number: 2, numberPos: { x: 45, y: 40 } },
  ],
  'g_lower': [
    { path: 'M 70 50 C 30 45, 30 85, 70 85', number: 1, numberPos: { x: 45, y: 65 } },
    { path: 'M 70 50 L 70 95 C 70 110, 30 110, 30 95', number: 2, numberPos: { x: 75, y: 85 } },
  ],
  'h_lower': [
    { path: 'M 30 15 L 30 85', number: 1, numberPos: { x: 25, y: 50 } },
    { path: 'M 30 50 C 70 45, 70 85, 70 85', number: 2, numberPos: { x: 55, y: 70 } },
  ],
  'i_lower': [
    { path: 'M 50 25 L 50 25', number: 1, numberPos: { x: 55, y: 20 } },
    { path: 'M 50 45 L 50 85', number: 2, numberPos: { x: 45, y: 65 } },
  ],
  'j_lower': [
    { path: 'M 60 25 L 60 25', number: 1, numberPos: { x: 65, y: 20 } },
    { path: 'M 60 45 L 60 95 C 60 110, 30 110, 30 95', number: 2, numberPos: { x: 45, y: 75 } },
  ],
  'k_lower': [
    { path: 'M 30 15 L 30 85', number: 1, numberPos: { x: 25, y: 50 } },
    { path: 'M 30 65 L 60 45', number: 2, numberPos: { x: 50, y: 55 } },
    { path: 'M 30 65 L 60 85', number: 3, numberPos: { x: 50, y: 75 } },
  ],
  'l_lower': [
    { path: 'M 50 15 L 50 85', number: 1, numberPos: { x: 45, y: 50 } },
  ],
  'm_lower': [
    { path: 'M 20 45 L 20 85', number: 1, numberPos: { x: 15, y: 65 } },
    { path: 'M 20 50 C 40 45, 40 85, 40 85', number: 2, numberPos: { x: 35, y: 70 } },
    { path: 'M 40 50 C 60 45, 60 85, 60 85', number: 3, numberPos: { x: 55, y: 70 } },
  ],
  'n_lower': [
    { path: 'M 30 45 L 30 85', number: 1, numberPos: { x: 25, y: 65 } },
    { path: 'M 30 50 C 70 45, 70 85, 70 85', number: 2, numberPos: { x: 55, y: 70 } },
  ],
  'o_lower': [
    { path: 'M 50 45 C 25 45, 25 85, 50 85 C 75 85, 75 45, 50 45', number: 1, numberPos: { x: 50, y: 65 } },
  ],
  'p_lower': [
    { path: 'M 30 45 L 30 105', number: 1, numberPos: { x: 25, y: 75 } },
    { path: 'M 30 50 C 70 45, 70 85, 30 85', number: 2, numberPos: { x: 55, y: 70 } },
  ],
  'q_lower': [
    { path: 'M 70 50 C 30 45, 30 85, 70 85', number: 1, numberPos: { x: 45, y: 70 } },
    { path: 'M 70 45 L 70 105', number: 2, numberPos: { x: 75, y: 75 } },
  ],
  'r_lower': [
    { path: 'M 30 45 L 30 85', number: 1, numberPos: { x: 25, y: 65 } },
    { path: 'M 30 50 C 60 45, 60 60, 60 60', number: 2, numberPos: { x: 50, y: 55 } },
  ],
  's_lower': [
    { path: 'M 70 50 C 30 45, 30 60, 70 65 C 70 80, 30 85, 30 80', number: 1, numberPos: { x: 50, y: 65 } },
  ],
  't_lower': [
    { path: 'M 50 25 L 50 80 C 50 85, 65 85, 70 80', number: 1, numberPos: { x: 45, y: 55 } },
    { path: 'M 35 45 L 65 45', number: 2, numberPos: { x: 50, y: 40 } },
  ],
  'u_lower': [
    { path: 'M 30 45 L 30 70 C 30 85, 70 85, 70 70', number: 1, numberPos: { x: 35, y: 65 } },
    { path: 'M 70 45 L 70 85', number: 2, numberPos: { x: 75, y: 65 } },
  ],
  'v_lower': [
    { path: 'M 30 45 L 50 85', number: 1, numberPos: { x: 35, y: 65 } },
    { path: 'M 70 45 L 50 85', number: 2, numberPos: { x: 65, y: 65 } },
  ],
  'w_lower': [
    { path: 'M 25 45 L 35 85', number: 1, numberPos: { x: 20, y: 65 } },
    { path: 'M 35 85 L 50 60', number: 2, numberPos: { x: 40, y: 75 } },
    { path: 'M 50 60 L 65 85', number: 3, numberPos: { x: 60, y: 75 } },
    { path: 'M 65 85 L 75 45', number: 4, numberPos: { x: 80, y: 65 } },
  ],
  'x_lower': [
    { path: 'M 30 45 L 70 85', number: 1, numberPos: { x: 40, y: 60 } },
    { path: 'M 70 45 L 30 85', number: 2, numberPos: { x: 60, y: 60 } },
  ],
  'y_lower': [
    { path: 'M 30 45 L 50 75', number: 1, numberPos: { x: 35, y: 60 } },
    { path: 'M 70 45 L 30 105', number: 2, numberPos: { x: 55, y: 75 } },
  ],
  'z_lower': [
    { path: 'M 30 45 L 70 45', number: 1, numberPos: { x: 50, y: 40 } },
    { path: 'M 70 45 L 30 85', number: 2, numberPos: { x: 50, y: 65 } },
    { path: 'M 30 85 L 70 85', number: 3, numberPos: { x: 50, y: 90 } },
  ],
}


