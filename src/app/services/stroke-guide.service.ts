import { Injectable } from '@angular/core';

// Export the interface
export interface Stroke {
  path: string;
  number: number;
  numberPos: { x: number; y: number };
}

@Injectable({
  providedIn: 'root'
})
export class StrokeGuideService {
  private strokeData: { [key: string]: Stroke[] } = {
    'A_upper': [
      { path: 'M 50 15 L 25 85', number: 1, numberPos: { x: 30, y: 50 } },
      { path: 'M 50 15 L 75 85', number: 2, numberPos: { x: 70, y: 50 } },
      { path: 'M 35 60 L 65 60', number: 3, numberPos: { x: 42, y: 55 } },
    ],
    'a_lower': [
      { path: 'M 72 65 A 18 18 0 1 0 71.9 65', number: 1, numberPos: { x: 50, y: 50 } },
      { path: 'M 72 47 L 72 85', number: 2, numberPos: { x: 78, y: 65 } },
    ],
    'B_upper': [
      { path: 'M 30 15 L 30 85', number: 1, numberPos: { x: 25, y: 50 } },
      { path: 'M 30 15 C 75 15, 75 45, 30 50', number: 2, numberPos: { x: 60, y: 28 } },
      { path: 'M 30 50 C 80 50, 80 85, 30 85', number: 3, numberPos: { x: 65, y: 70 } },
    ],
    'b_lower': [
      { path: 'M 35 15 L 35 85', number: 1, numberPos: { x: 30, y: 50 } },
      { path: 'M 35 55 C 55 45, 55 85, 35 85', number: 2, numberPos: { x: 45, y: 70 } },
    ],
    'C_upper': [
      { path: 'M 75 25 C 50 0, 25 0, 25 50 C 25 100, 50 100, 75 75', number: 1, numberPos: { x: 40, y: 50 } },
    ],
    'c_lower': [
      { path: 'M 70 65 C 60 45, 40 45, 35 65 C 40 85, 60 85, 70 70', number: 1, numberPos: { x: 50, y: 65 } },
    ],
    'D_upper': [
      { path: 'M 30 15 L 30 85', number: 1, numberPos: { x: 25, y: 50 } },
      { path: 'M 30 15 C 80 35, 80 65, 30 85', number: 2, numberPos: { x: 60, y: 50 } },
    ],
    'd_lower': [
      { path: 'M 65 15 L 65 85', number: 1, numberPos: { x: 70, y: 50 } },
      { path: 'M 65 50 C 45 30, 35 60, 65 70', number: 2, numberPos: { x: 50, y: 60 } },
    ],
    'E_upper': [
      { path: 'M 70 15 L 30 15 L 30 85 L 70 85', number: 1, numberPos: { x: 50, y: 10 } },
      { path: 'M 30 50 L 60 50', number: 2, numberPos: { x: 45, y: 45 } },
    ],
    'e_lower': [
      { path: 'M 65 65 C 55 45, 35 45, 35 65 C 35 85, 55 85, 65 70', number: 1, numberPos: { x: 50, y: 65 } },
      { path: 'M 35 65 L 65 65', number: 2, numberPos: { x: 50, y: 60 } },
    ],
    'F_upper': [
      { path: 'M 30 15 L 30 85', number: 1, numberPos: { x: 25, y: 50 } },
      { path: 'M 30 15 L 70 15', number: 2, numberPos: { x: 50, y: 10 } },
      { path: 'M 30 50 L 60 50', number: 3, numberPos: { x: 45, y: 45 } },
    ],
    'f_lower': [
      { path: 'M 60 10 C 45 10, 45 40, 60 85', number: 1, numberPos: { x: 50, y: 45 } },
      { path: 'M 40 50 L 70 50', number: 2, numberPos: { x: 55, y: 45 } },
    ],
    'G_upper': [
      { path: 'M 75 25 C 50 0, 25 0, 25 50 C 25 100, 75 100, 75 65 L 50 65', number: 1, numberPos: { x: 45, y: 65 } },
    ],
    'g_lower': [
      { path: 'M 65 65 C 55 45, 35 45, 35 65 C 35 85, 55 85, 65 65 Z', number: 1, numberPos: { x: 50, y: 70 } },
      { path: 'M 65 65 L 65 95 C 65 105, 45 105, 45 95', number: 2, numberPos: { x: 55, y: 100 } },
    ],
    'H_upper': [
      { path: 'M 30 15 L 30 85', number: 1, numberPos: { x: 25, y: 50 } },
      { path: 'M 70 15 L 70 85', number: 2, numberPos: { x: 75, y: 50 } },
      { path: 'M 30 50 L 70 50', number: 3, numberPos: { x: 50, y: 45 } },
    ],
    'h_lower': [
      { path: 'M 35 15 L 35 85', number: 1, numberPos: { x: 30, y: 50 } },
      { path: 'M 35 55 C 45 40, 65 50, 65 85', number: 2, numberPos: { x: 50, y: 70 } },
    ],
    'I_upper': [
      { path: 'M 40 15 L 80 15', number: 1, numberPos: { x: 60, y: 10 } },
      { path: 'M 60 15 L 60 85', number: 2, numberPos: { x: 55, y: 50 } },
      { path: 'M 40 85 L 80 85', number: 3, numberPos: { x: 60, y: 80 } },
    ],
    'i_lower': [
      { path: 'M 60 40 L 60 85', number: 1, numberPos: { x: 60, y: 60 } },
      { path: 'M 60 25 A 2 2 0 1 1 59.9 25', number: 2, numberPos: { x: 60, y: 20 } },
    ],
    'J_upper': [
      { path: 'M 70 15 L 70 70 C 70 90, 30 90, 30 70', number: 1, numberPos: { x: 50, y: 75 } },
    ],
    'j_lower': [
      { path: 'M 60 40 L 60 95 C 60 105, 45 105, 45 95', number: 1, numberPos: { x: 50, y: 100 } },
      { path: 'M 60 25 A 2 2 0 1 1 59.9 25', number: 2, numberPos: { x: 60, y: 20 } },
    ],
    'K_upper': [
      { path: 'M 30 15 L 30 85', number: 1, numberPos: { x: 25, y: 50 } },
      { path: 'M 30 50 L 70 15', number: 2, numberPos: { x: 50, y: 30 } },
      { path: 'M 30 50 L 70 85', number: 3, numberPos: { x: 50, y: 70 } },
    ],
    'k_lower': [
      { path: 'M 35 15 L 35 85', number: 1, numberPos: { x: 30, y: 50 } },
      { path: 'M 35 55 L 60 35', number: 2, numberPos: { x: 48, y: 45 } },
      { path: 'M 35 55 L 60 85', number: 3, numberPos: { x: 50, y: 70 } },
    ],
    'L_upper': [
      { path: 'M 30 15 L 30 85 L 70 85', number: 1, numberPos: { x: 45, y: 70 } },
    ],
    'l_lower': [
      { path: 'M 50 15 L 50 85', number: 1, numberPos: { x: 45, y: 50 } },
    ],
    'M_upper': [
      { path: 'M 30 85 L 30 15 L 50 45 L 70 15 L 70 85', number: 1, numberPos: { x: 50, y: 50 } },
    ],
    'm_lower': [
      { path: 'M 30 55 L 30 85', number: 1, numberPos: { x: 25, y: 70 } },
      { path: 'M 30 55 C 40 45, 50 55, 50 85', number: 2, numberPos: { x: 40, y: 70 } },
      { path: 'M 50 55 C 60 45, 70 55, 70 85', number: 3, numberPos: { x: 60, y: 70 } },
    ],

    'N_upper': [
      { path: 'M 30 85 L 30 15 L 70 85 L 70 15', number: 1, numberPos: { x: 50, y: 50 } },
    ],
    'n_lower': [
      { path: 'M 35 55 L 35 85', number: 1, numberPos: { x: 30, y: 70 } },
      { path: 'M 35 55 C 45 45, 65 55, 65 85', number: 2, numberPos: { x: 50, y: 70 } },
    ],

    'O_upper': [
      { path: 'M 50 15 C 20 15, 20 85, 50 85 C 80 85, 80 15, 50 15 Z', number: 1, numberPos: { x: 50, y: 50 } },
    ],
    'o_lower': [
      { path: 'M 50 55 C 35 45, 35 85, 50 85 C 65 85, 65 45, 50 55 Z', number: 1, numberPos: { x: 50, y: 70 } },
    ],

    'P_upper': [
      { path: 'M 30 15 L 30 85', number: 1, numberPos: { x: 25, y: 50 } },
      { path: 'M 30 15 C 70 15, 70 50, 30 50', number: 2, numberPos: { x: 55, y: 30 } },
    ],
    'p_lower': [
      { path: 'M 35 55 L 35 105', number: 1, numberPos: { x: 30, y: 80 } },
      { path: 'M 35 55 C 55 45, 55 85, 35 85', number: 2, numberPos: { x: 45, y: 70 } },
    ],

    'Q_upper': [
      { path: 'M 50 15 C 20 15, 20 85, 50 85 C 80 85, 80 15, 50 15 Z', number: 1, numberPos: { x: 50, y: 50 } },
      { path: 'M 60 65 L 80 85', number: 2, numberPos: { x: 70, y: 75 } },
    ],
    'q_lower': [
      { path: 'M 65 55 L 65 105', number: 1, numberPos: { x: 70, y: 80 } },
      { path: 'M 65 55 C 45 45, 45 85, 65 85', number: 2, numberPos: { x: 55, y: 70 } },
    ],

    'R_upper': [
      { path: 'M 30 15 L 30 85', number: 1, numberPos: { x: 25, y: 50 } },
      { path: 'M 30 15 C 70 15, 70 50, 30 50', number: 2, numberPos: { x: 55, y: 30 } },
      { path: 'M 30 50 L 70 85', number: 3, numberPos: { x: 50, y: 70 } },
    ],
    'r_lower': [
      { path: 'M 35 55 L 35 85', number: 1, numberPos: { x: 30, y: 70 } },
      { path: 'M 35 55 C 45 45, 65 55, 65 60', number: 2, numberPos: { x: 50, y: 60 } },
    ],

    'S_upper': [
      { path: 'M 70 25 C 50 0, 20 20, 50 50 C 80 80, 30 100, 30 85', number: 1, numberPos: { x: 50, y: 50 } },
    ],
    's_lower': [
      { path: 'M 65 65 C 55 55, 35 55, 35 65 C 35 75, 55 75, 65 85', number: 1, numberPos: { x: 50, y: 70 } },
    ],

    'T_upper': [
      { path: 'M 30 15 L 70 15', number: 1, numberPos: { x: 50, y: 10 } },
      { path: 'M 50 15 L 50 85', number: 2, numberPos: { x: 45, y: 50 } },
    ],
    't_lower': [
      { path: 'M 50 15 L 50 85', number: 1, numberPos: { x: 45, y: 50 } },
      { path: 'M 40 50 L 60 50', number: 2, numberPos: { x: 50, y: 45 } },
    ],

    'U_upper': [
      { path: 'M 30 15 L 30 65 C 30 90, 70 90, 70 65 L 70 15', number: 1, numberPos: { x: 50, y: 70 } },
    ],
    'u_lower': [
      { path: 'M 30 55 C 30 80, 70 80, 70 55 L 70 85', number: 1, numberPos: { x: 50, y: 70 } },
    ],

    'V_upper': [
      { path: 'M 30 15 L 50 85 L 70 15', number: 1, numberPos: { x: 50, y: 50 } },
    ],
    'v_lower': [
      { path: 'M 30 55 L 50 85 L 70 55', number: 1, numberPos: { x: 50, y: 70 } },
    ],

    'W_upper': [
      { path: 'M 30 15 L 40 85 L 50 50 L 60 85 L 70 15', number: 1, numberPos: { x: 50, y: 55 } },
    ],
    'w_lower': [
      { path: 'M 30 55 L 40 85 L 50 65 L 60 85 L 70 55', number: 1, numberPos: { x: 50, y: 70 } },
    ],

    'X_upper': [
      { path: 'M 30 15 L 70 85', number: 1, numberPos: { x: 50, y: 50 } },
      { path: 'M 70 15 L 30 85', number: 2, numberPos: { x: 50, y: 50 } },
    ],
    'x_lower': [
      { path: 'M 30 55 L 70 85', number: 1, numberPos: { x: 50, y: 70 } },
      { path: 'M 70 55 L 30 85', number: 2, numberPos: { x: 50, y: 70 } },
    ],

    'Y_upper': [
      { path: 'M 30 15 L 50 50 L 70 15', number: 1, numberPos: { x: 50, y: 30 } },
      { path: 'M 50 50 L 50 85', number: 2, numberPos: { x: 50, y: 70 } },
    ],
    'y_lower': [
      { path: 'M 30 55 L 50 85 L 70 55', number: 1, numberPos: { x: 50, y: 70 } },
      { path: 'M 50 85 L 50 105', number: 2, numberPos: { x: 50, y: 95 } },
    ],

    'Z_upper': [
      { path: 'M 30 15 L 70 15 L 30 85 L 70 85', number: 1, numberPos: { x: 50, y: 50 } },
    ],
    'z_lower': [
      { path: 'M 30 55 L 70 55 L 30 85 L 70 85', number: 1, numberPos: { x: 50, y: 70 } },
    ],
  };

  getLetterStrokes(letter: string, caseType: 'upper' | 'lower'): Stroke[] {
    return this.strokeData[`${letter.toUpperCase()}_${caseType}`] || [];
  }
}
